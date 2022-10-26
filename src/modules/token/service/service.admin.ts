// import { DataNotFoundError } from "../../../../packages/errors/data-not-found-error";
// import { BlogCategoryNotFound } from "../../../../packages/messages";
// import { CalculateOffset, CalculateSort, ErrorHandling } from "../../../utils";
// import { List } from "../../../utils/helper/request";
import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import { Types } from 'mongoose';
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import { HelperEncryptionService } from "src/utils/helper/service/helper.encryption.service";
import configService from 'src/app/config';
import IAuthInterface from './../../auth/interface';
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";
import { ForbiddenException } from "packages/errors/ForbiddenException";
import { ActiveError, notFoundError } from "src/utils/error-converter";
import { NotFoundException } from "packages/errors/NotFoundException";
import { DataInactiveError } from "packages/errors/data-inactive-error";


class TokenService {




    private readonly accessTokenSecretToken: string;
    private readonly accessTokenExpirationTime: string;
    private readonly accessTokenNotBeforeExpirationTime: string;

    private readonly refreshTokenSecretToken: string;
    private readonly refreshTokenExpirationTime: string;
    private readonly refreshTokenExpirationTimeRememberMe: string;
    private readonly refreshTokenNotBeforeExpirationTime: string;
    private readonly helperDateService: HelperDateService;
    private readonly helperEncryptionService: HelperEncryptionService;


    constructor(
        private readonly helperHashService: HelperHashService,

    ) {
        this.helperDateService = new HelperDateService();
        this.helperEncryptionService = new HelperEncryptionService();
        this.accessTokenSecretToken = configService.auth.jwt.accessToken.secretKey
        this.accessTokenExpirationTime = configService.auth.jwt.accessToken.expirationTime
        this.accessTokenNotBeforeExpirationTime = configService.auth.jwt.accessToken.notBeforeExpirationTime

        this.refreshTokenSecretToken = configService.auth.jwt.refreshToken.secretKey
        this.refreshTokenExpirationTime = configService.auth.jwt.refreshToken.expirationTime
        this.refreshTokenExpirationTimeRememberMe = configService.auth.jwt.refreshToken.expirationTimeRememberMe
        this.refreshTokenNotBeforeExpirationTime = configService.auth.jwt.refreshToken.notBeforeExpirationTime
    }

    section: string = constant.MODULE_NAME;
    async createAccessToken(payload: Record<string, any>): Promise<string> {
        // // console.log({ accessTokenExpirationTime: this.accessTokenExpirationTime });

        return this.helperEncryptionService.jwtEncrypt(payload, {
            secretKey: this.accessTokenSecretToken,
            expiredIn: this.accessTokenExpirationTime,
            notBefore: this.accessTokenNotBeforeExpirationTime,
        });
    }

    async validateAccessToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.accessTokenSecretToken,
            expiredIn: this.accessTokenExpirationTime,
        });
    }

    async payloadAccessToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token);
    }

    async createRefreshToken(
        payload: Record<string, any>,
        rememberMe: boolean,
        test?: boolean
    ): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(payload, {
            secretKey: this.refreshTokenSecretToken,
            expiredIn: rememberMe
                ? this.refreshTokenExpirationTimeRememberMe
                : this.refreshTokenExpirationTime,
            notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
        });
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.refreshTokenSecretToken,
            expiredIn: this.accessTokenExpirationTime,
        });
    }

    async payloadRefreshToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token);
    }


    async createPayloadAccessToken(
        data: Record<string, any>,
        rememberMe: boolean,
        options?: IAuthInterface.PayloadOptions
    ): Promise<Record<string, any>> {
        return {
            ...data,
            rememberMe,
            loginDate:
                options && options.loginDate
                    ? options.loginDate
                    : this.helperDateService.create(),
        };
    }

    async createPayloadRefreshToken(
        // { _id }: AuthLoginSerialization,
        data: Record<string, any>,
        rememberMe: boolean,
        options?: IAuthInterface.PayloadOptions
    ): Promise<Record<string, any>> {
        return {
            // _id,
            ...data,
            rememberMe,
            loginDate:
                options && options.loginDate ? options.loginDate : undefined,
        };
    }


    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<any[]> {
        const data = mongo.model.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            data.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            data.sort(options.sort);
        }


        return data.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }

    async findOneById<T>(
        _id: string,
        other?: Record<string, any>
    ): Promise<T> {
        const roles = mongo.model.findById(_id, other);



        return roles.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const data = mongo.model.findOne(find);

        // if (options?.populate?.user) {
        //     data.populate({
        //         path: 'user',
        //         model: UserEntity.name,
        //         populate: [{
        //             path: "role",
        //             model: RoleEntity.name,
        //             populate: {
        //                 path: "permissions",
        //                 model: PermissionEntity.name,
        //             }
        //         },

        //         ]
        //     });
        // }

        return data.lean();
    }

    async exists(refreshToken: string, accessToken: string, _id?: string): Promise<boolean> {
        const exist = await mongo.model.exists({
            refreshToken,
            accessToken,
            _id: { $ne: new Types.ObjectId(_id) },
        });

        return exist ? true : false;
    }


    async validateToken(
        tokenString: string,
        tokenHash: string
    ): Promise<boolean> {
        console.log({ tokenString, tokenHash });

        return this.helperHashService.bcryptCompare(
            tokenString,
            tokenHash
        );
    }



    async encrypt(param: string): Promise<any> {
        const salt: string = this.helperHashService.randomSalt(10);
        const paramHash = this.helperHashService.bcrypt(param, salt);
        return paramHash
    }


    async create({
        status,
        user,
        device,
        sessionId,
        rememberMe,
        ...props
    }: any): Promise<any> {
        const payloadAccessToken: Record<string, any> = await this.createPayloadAccessToken({ _id: user, sessionId }, rememberMe);
        const payloadRefreshToken: Record<string, any> = await this.createPayloadRefreshToken({ _id: user, sessionId }, rememberMe, {
            loginDate: payloadAccessToken.loginDate,
        });

        const accessToken: string = await this.createAccessToken(
            payloadAccessToken
        );

        const refreshToken: string = await this.createRefreshToken(
            payloadRefreshToken,
            rememberMe
        );


        const accessTokenEncrypt: string = await this.encrypt(accessToken);
        const refreshTokenEncrypt: string = await this.encrypt(refreshToken);

        const today: Date = this.helperDateService.create();
        const create: any = new mongo.model({
            ...props,
            status: status || STATUS.ACTIVE,
            user: new Types.ObjectId(user),
            sessionId,
            // device: new Types.ObjectId(device),
            loginDate: today,
            logoutDate: null,
            accessToken: accessTokenEncrypt,
            refreshToken: refreshTokenEncrypt
        });
        await create.save();
        return {
            accessToken,
            refreshToken
        }
    }




    async refresh({
        user,
        rememberMe,
        loginDate,
        tokenDecrypted,
        tokenEncrypted
    }: any): Promise<any> {


        let data: any = await mongo.model.findOne({ sessionId: tokenDecrypted.sessionId, user })



        if (!data) {
            throw new NotFoundException(notFoundError({ key: 'token' }));
        }
        else if (data.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: 'token' }));
        }


        const validateToken = await this.validateToken(tokenEncrypted, data.refreshToken)
        if (!validateToken) throw new ForbiddenException(notFoundError({ key: 'token' }));


        const payloadAccessToken: Record<string, any> = await this.createPayloadAccessToken({ _id: user, sessionId: tokenDecrypted.sessionId }, rememberMe, {
            loginDate,
        });

        const accessToken: string = await this.createAccessToken(
            payloadAccessToken
        );
        const accessTokenEncrypt: string = await this.encrypt(accessToken);


        data.accessToken = accessTokenEncrypt;

        await data.save();

        return {
            accessToken
        }
    }


    async update(
        _id: string,
        props: any
    ): Promise<any> {
        const update: any = await mongo.model.findById(_id);
        for (const key in props) {
            update[key] = props[key]
        }

        return update.save();
    }


    async updateOneById(
        _id: string,
        object: any
    ): Promise<any> {
        const findById: any = await mongo.model.findById(_id);

        for (const key in object) {
            findById[key] = object[key]
        }

        return findById.save();
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    // async serializationGet(data: Interface.IDocument): Promise<GetSerialization> {
    //     return plainToInstance(GetSerialization, data);
    // }

    // async serializationList(
    //     data: any[]
    // ): Promise<ListSerialization[]> {
    //     return plainToInstance(ListSerialization, data);
    // }
}

export default TokenService;
