import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { DataInactiveError } from "packages/errors/data-inactive-error";
import { NotFoundException } from "packages/errors/NotFoundException";
import { STATUS } from "src/enum";
import TokenInterface from "src/modules/token/interface";
import TokenService from "src/modules/token/service/service.admin";
import UserInterface from "src/modules/user/interface";
import UserService from "src/modules/user/service/service.admin";
import { ActiveError, expiredError, notFoundError } from "src/utils/error-converter";
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import { HelperEncryptionService } from "src/utils/helper/service/helper.encryption.service";
import { ForbiddenException } from 'packages/errors/ForbiddenException';


class JwtGuard {

    constructor(
        readonly tokenService: TokenService,
        readonly userService: UserService,
        readonly helperEncryptionService: HelperEncryptionService,
        readonly helperDateService: HelperDateService
    ) { }

    public FindToken = async (req: Request, res: Response, next: NextFunction) => {
        const { headers: { authorization } } = req;
        const token = authorization?.split(' ')?.[1] as string;
        const authUser: Record<string, any> = this.helperEncryptionService.jwtDecrypt(token);
        req.tokenDecrypted = authUser;
        req.tokenEncrypted = token;
        next()
    }

    // ---------------------------------------------------------------------------------------------------------


    NotFoundTokenError = (tokenDecrypted: any) => {
        if (!tokenDecrypted) {
            throw new NotFoundException({ key: 'header.authorize.unset', ns: "error" });
        }
    }


    // ---------------------------------------------------------------------------------------------------------

    GetTokenWithSessionId = async (sessionId: string, tokenDecrypted: any, tokenEncrypted: string) => {

        const token: TokenInterface.IDocument | any = await this.tokenService.findOne<TokenInterface.IDocument>({ user: new Types.ObjectId(tokenDecrypted?._id), sessionId });

        if (!token) return false;

        const checkIsExpired = this.helperDateService.isExpired(new Date(tokenDecrypted.exp * 1000));
        if (checkIsExpired) {
            throw new ForbiddenException(expiredError({ key: 'token' }));
        }

        return token
    }

    // ---------------------------------------------------------------------------------------------------------

    GetAccessToken = async (accessToken: string, tokenDecrypted: any) => {

        const token: TokenInterface.IDocument | any = await this.tokenService.findOne<TokenInterface.IDocument>({ user: new Types.ObjectId(tokenDecrypted?._id), accessToken });

        if (!token) return false;

        const checkIsExpired = this.helperDateService.isExpired(new Date(tokenDecrypted.exp * 1000));
        if (checkIsExpired) {
            throw new ForbiddenException(expiredError({ key: 'token' }));
        }

        return token
    }

    // ---------------------------------------------------------------------------------------------------------

    AccessTokenStatus = async (token: any) => {


        if (!token) {
            throw new NotFoundException(notFoundError({ key: 'token' }));
        }
        else if (token.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: 'token' }));
        }
    }

    // ---------------------------------------------------------------------------------------------------------

    GetRefreshToken = async (refreshToken: string, tokenDecrypted: any) => {

        const token: TokenInterface.IDocument | any = await this.tokenService.findOne<TokenInterface.IDocument>({ user: new Types.ObjectId(tokenDecrypted?._id), refreshToken });
        if (!token) return false;

        const checkIsExpired = this.helperDateService.isExpired(new Date(tokenDecrypted.exp * 1000));

        if (checkIsExpired) {
            token.status = STATUS.DISABLE;
            token.save();
            throw new ForbiddenException(expiredError({ key: 'token' }));
        }
        return token
    }

    // ---------------------------------------------------------------------------------------------------------

    RefreshTokenStatus = async (token: any) => {


        if (!token) {
            throw new NotFoundException(notFoundError({ key: 'token' }));
        }
        else if (token.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: 'token' }));
        }
    }

    // ---------------------------------------------------------------------------------------------------------

    GetUser = async (tokenDecrypted: Record<string, any>) => {
        // console.log({ tokenDecrypted });

        try {
            const data: UserInterface.IDocument = await this.userService.findOneById(tokenDecrypted._id, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
            return data

        } catch (error: any) {
            throw new NotFoundException(error.message);

        }


    }

    // ---------------------------------------------------------------------------------------------------------

    UserRole = (user: UserInterface.IDocument) => {


        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        }
        else if (user?.role?.status !== STATUS.ACTIVE) {
            throw new ForbiddenException(ActiveError({ key: 'role' }));
        }
        return user
    }

    // ---------------------------------------------------------------------------------------------------------

    UserStatus = (user: UserInterface.IDocument) => {


        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        }
        else if (user.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: 'user' }));
        }
        return user
    }

    // ---------------------------------------------------------------------------------------------------------

    NotFoundUserError = async (user: UserInterface.IDocument) => {

        if (!user) {
            throw new NotFoundException({ key: 'header.authorize.unset', ns: "error" });
        }
        return true
    }

    // ---------------------------------------------------------------------------------------------------------
    BaseProtectedAdminToken = async (req: Request, res: Response, next: NextFunction) => {
        const { tokenDecrypted, tokenEncrypted } = req;
        // this.NotFoundTokenError(tokenDecrypted);

        const sessionToken = await this.GetTokenWithSessionId(tokenDecrypted.sessionId, tokenDecrypted, tokenEncrypted)
        // console.log({ sessionToken });
        this.AccessTokenStatus(sessionToken)
        const user = await this.GetUser(tokenDecrypted);
        req.user = user;
        this.UserStatus(user);

        next()
    }
    // ---------------------------------------------------------------------------------------------------------
    validateToken = async (token: string, tokenHash: string) => {
        // console.log({ token, tokenHash });

        const validateToken = await this.tokenService.validateToken(token, tokenHash)
        if (!validateToken) throw new ForbiddenException(notFoundError({ key: 'token' }));
    }
    // ---------------------------------------------------------------------------------------------------------

    ProtectedAdminAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        const { tokenDecrypted, tokenEncrypted } = req;
        // console.log({ tokenDecrypted, tokenEncrypted });

        this.NotFoundTokenError(tokenDecrypted);
        const sessionToken = await this.GetTokenWithSessionId(tokenDecrypted.sessionId, tokenDecrypted, tokenEncrypted)
        // console.log({ tokenEncrypted, tokenDecrypted, sessionToken });

        await this.validateToken(tokenEncrypted, sessionToken.accessToken)

        this.AccessTokenStatus(sessionToken)
        const user = await this.GetUser(tokenDecrypted);
        // console.log({ user });

        this.UserStatus(user);
        this.UserRole(user);
        req.user = user;
        // console.log({ user });

        next()
    }

    // ---------------------------------------------------------------------------------------------------------

    ProtectedAdminRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const { tokenDecrypted } = req;
        this.NotFoundTokenError(tokenDecrypted);
        const user = await this.GetUser(tokenDecrypted);
        this.UserStatus(user);
        this.UserRole(user);
        req.user = user;
        next()
    }

}


export default JwtGuard;