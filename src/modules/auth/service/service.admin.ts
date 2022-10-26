import IUserInterface from 'src/modules/user/interface';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { HelperEncryptionService } from 'src/utils/helper/service/helper.encryption.service';
import { HelperHashService } from 'src/utils/helper/service/helper.hash.service';
import Interface from '../interface';
import configService from 'src/app/config';

export default class AuthService {
    // private readonly accessTokenSecretToken: string;
    // private readonly accessTokenExpirationTime: string;
    // private readonly accessTokenNotBeforeExpirationTime: string;

    // private readonly refreshTokenSecretToken: string;
    // private readonly refreshTokenExpirationTime: string;
    // private readonly refreshTokenExpirationTimeRememberMe: string;
    // private readonly refreshTokenNotBeforeExpirationTime: string;




    constructor(
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService,
        // private readonly mailerService: MailerService
    ) {
        // this.accessTokenSecretToken = configService(
        //     'auth.jwt.accessToken.secretKey'
        // );
        // this.accessTokenExpirationTime = configService(
        //     'auth.jwt.accessToken.expirationTime'
        // );
        // this.accessTokenNotBeforeExpirationTime =
        //     configService(
        //         'auth.jwt.accessToken.notBeforeExpirationTime'
        //     );

        // this.refreshTokenSecretToken = configService(
        //     'auth.jwt.refreshToken.secretKey'
        // );
        // this.refreshTokenExpirationTime = configService(
        //     'auth.jwt.refreshToken.expirationTime'
        // );
        // this.refreshTokenExpirationTimeRememberMe =
        //     configService(
        //         'auth.jwt.refreshToken.expirationTimeRememberMe'
        //     );
        // this.refreshTokenNotBeforeExpirationTime =
        //     configService(
        //         'auth.jwt.refreshToken.notBeforeExpirationTime'
        //     );
    }

    // async createAccessToken(payload: Record<string, any>): Promise<string> {
    //     // // console.log({ accessTokenExpirationTime: this.accessTokenExpirationTime });

    //     return this.helperEncryptionService.jwtEncrypt(payload, {
    //         secretKey: this.accessTokenSecretToken,
    //         expiredIn: this.accessTokenExpirationTime,
    //         notBefore: this.accessTokenNotBeforeExpirationTime,
    //     });
    // }

    // async validateAccessToken(token: string): Promise<boolean> {
    //     return this.helperEncryptionService.jwtVerify(token, {
    //         secretKey: this.accessTokenSecretToken,
    //         expiredIn: this.accessTokenExpirationTime,
    //     });
    // }

    // async payloadAccessToken(token: string): Promise<Record<string, any>> {
    //     return this.helperEncryptionService.jwtDecrypt(token);
    // }

    // async createRefreshToken(
    //     payload: Record<string, any>,
    //     rememberMe: boolean,
    //     test?: boolean
    // ): Promise<string> {
    //     return this.helperEncryptionService.jwtEncrypt(payload, {
    //         secretKey: this.refreshTokenSecretToken,
    //         expiredIn: rememberMe
    //             ? this.refreshTokenExpirationTimeRememberMe
    //             : this.refreshTokenExpirationTime,
    //         notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
    //     });
    // }

    // async validateRefreshToken(token: string): Promise<boolean> {
    //     return this.helperEncryptionService.jwtVerify(token, {
    //         secretKey: this.refreshTokenSecretToken,
    //         expiredIn: this.accessTokenExpirationTime,
    //     });
    // }

    // async payloadRefreshToken(token: string): Promise<Record<string, any>> {
    //     return this.helperEncryptionService.jwtDecrypt(token);
    // }

    async validateUser(
        passwordString: string,
        passwordHash: string
    ): Promise<boolean> {
        return this.helperHashService.bcryptCompare(
            passwordString,
            passwordHash
        );
    }

    // async createPayloadAccessToken(
    //     data: Record<string, any>,
    //     rememberMe: boolean,
    //     options?: IAuthPayloadOptions
    // ): Promise<Record<string, any>> {
    //     return {
    //         ...data,
    //         rememberMe,
    //         loginDate:
    //             options && options.loginDate
    //                 ? options.loginDate
    //                 : this.helperDateService.create(),
    //     };
    // }

    // async createPayloadRefreshToken(
    //     // { _id }: AuthLoginSerialization,
    //     data: Record<string, any>,
    //     rememberMe: boolean,
    //     options?: IAuthPayloadOptions
    // ): Promise<Record<string, any>> {
    //     return {
    //         // _id,
    //         ...data,
    //         rememberMe,
    //         loginDate:
    //             options && options.loginDate ? options.loginDate : undefined,
    //     };
    // }



    async createPassword(password: string): Promise<Interface.Password> {
        const saltLength: number = configService.auth.password.saltLength;

        const salt: string = this.helperHashService.randomSalt(saltLength);

        const passwordExpiredInMs: number = configService.auth.password.expiredInMs

        const passwordExpired: Date =
            this.helperDateService.forwardInMilliseconds(passwordExpiredInMs);
        const passwordHash = this.helperHashService.bcrypt(password, salt);
        return {
            passwordHash,
            passwordExpired,
            salt,
        };
    }

    async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
        const today: Date = this.helperDateService.create();
        const passwordExpiredConvert: Date = this.helperDateService.create({
            date: passwordExpired,
        });

        if (today > passwordExpiredConvert) {
            return true;
        }

        return false;
    }

    // async sendEmail(user: any, options: any) {
    //     const { email, firstName, lastName, code } = user

    //     await this.mailerService.sendMail({
    //         to: email,
    //         subject: options.subject,
    //         template: options.template,
    //         context: {
    //             firstName,
    //             lastName,
    //             email,
    //             code
    //         },
    //     });
    // }

    generateCode() {
        return Math.floor(10000 + Math.random() * 90000)
    }

}
