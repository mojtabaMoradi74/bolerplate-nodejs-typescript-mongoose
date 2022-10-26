import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import { ActiveError, invalidError, isExistError, notFoundError, notMatchError, serverError } from "src/utils/error-converter";
import { NotFoundException } from "packages/errors/NotFoundException";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
import { BadRequestException } from "packages/errors/BadRequestException";
import RoleService from "src/modules/role/service/service.admin";
import { ForbiddenException } from "packages/errors/ForbiddenException";
import UserService from "src/modules/user/service/service.admin";
import authHelper, { loginVerifyCodeUi } from "../helper";
import UserInterface from "src/modules/user/interface";
import TokenService from "src/modules/token/service/service.admin";
import VerifyCodeService from "src/modules/verifyCode/service/service";

class AuthPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: Service,
        private readonly roleService: RoleService,
        private readonly tokenService: TokenService,
        private readonly verifyCodeService: VerifyCodeService,
    ) { }


    async Login(req: Request, res: Response): Promise<any> {
        const { body } = req
        const rememberMe: boolean = body.rememberMe ? true : false;
        const user: Interface.IDocument = await this.userService.findOne(
            {
                email: body.email,
            },
        );

        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        }

        const validate: any = await this.authService.validateUser(
            body.password,
            user.password
        );
        // console.log({ body, user, validate });

        if (!validate) {
            throw new BadRequestException(invalidError({ key: 'password', ns: "translate" }));
        } else if (user.status !== STATUS.ACTIVE) {
            throw new ForbiddenException(ActiveError({ key: 'user' }));
        }

        const safe: any = user;

        try {
            const createVerifyCode: any = await this.verifyCodeService.createVerifyCode(safe, rememberMe, {
                subject: 'Welcome to Nice App! Confirm Email',
                html: loginVerifyCodeUi

            });
            res.status(200).send(createVerifyCode);

        }
        catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }



    async Refresh(req: Request, res: Response) {
        const { user, headers, body, query } = req
        const refreshToken = authHelper.token(headers)
        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        } else if (user.status !== STATUS.ACTIVE) {
            throw new ForbiddenException(ActiveError({ key: 'user' }));
        }
        try {
            const token: Record<string, any> = await this.tokenService.refresh({
                user: user._id,
                rememberMe: user.rememberMe,
                loginDate: user.loginDate,
                refreshToken
            })
            res.status(200).send({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            });

        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }



        // const count: number = await this.service.getTotal(find);
        // res.status(200).send(Users);
    }
    async ChangePassword(
        req: Request, res: Response
    ): Promise<void> {
        const { user: { _id }, headers, body, query } = req
        const user: any = await this.userService.findOneById(_id);
        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        }

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password
        );
        if (!matchPassword) {
            throw new BadRequestException(notMatchError({ key: 'password' }));
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password
        );
        if (newMatchPassword) {
            throw new BadRequestException(({ key: 'newPasswordMustDifference', ns: "error", }));
        }

        try {
            const password = await this.authService.createPassword(
                body.newPassword
            );

            await this.userService.updatePassword(user._id, password);
            res.status(200).send()
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }


    }

    async SignUp(
        req: Request, res: Response
    ): Promise<any> {
        const { user, headers, body: { email, mobileNumber, ...body }, query } = req
        const role: any = await this.roleService.findOne(
            {
                name: 'admin',
            }
        );
        if (!role) {
            throw new NotFoundException(notMatchError({ key: 'role' }));
        }

        const checkExist: UserInterface.ICheckExist = await this.userService.checkExist(
            email,
            mobileNumber
        );

        if (checkExist.email && checkExist.mobileNumber) {
            throw new BadRequestException(isExistError({ key: 'user' }));
        } else if (checkExist.email) {
            throw new BadRequestException(isExistError({ key: 'email' }));
        } else if (checkExist.mobileNumber) {
            throw new BadRequestException(isExistError({ key: 'mobile' }));
        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email,
                mobileNumber,
                role: role._id,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                salt: password.salt,
                status: body.status
            });

            const token: Record<string, any> = this.tokenService.create({
                device: null,
                user: create._id,
                // rememberMe,
            })
            res.status(200).send({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            });

        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}

export default AuthPublicController