import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service";
import { ActiveError, expiredError, notFoundError } from "src/utils/error-converter";
import { NotFoundException } from "packages/errors/NotFoundException";
import { STATUS } from "src/enum";
import { ForbiddenException } from "packages/errors/ForbiddenException";
import UserService from "src/modules/user/service/service.admin";
import TokenService from "src/modules/token/service/service.admin";
import VerifyCodeApiService from '../service/api.service';
import InterfaceUser from 'src/modules/user/interface';
import { loginVerifyCodeUi } from "src/modules/auth/helper";
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';


class VerifyCodeController {
    constructor(
        private readonly userService: UserService,
        private readonly service: Service,
        private readonly verifyCodeApiService: VerifyCodeApiService,
        private readonly tokenService: TokenService,
        private readonly helperStringService: HelperStringService

    ) { }

    async SendCode(req: Request, res: Response): Promise<any> {
        const { params } = req
        const user: any = await this.userService.findOne(
            {
                email: params.email,
            },
            {
                populate: {
                    role: true,
                    permission: true,
                },
            }
        );

        if (!user) {
            throw new NotFoundException(notFoundError({ key: 'user' }));
        } else if (user.status !== STATUS.ACTIVE) {
            throw new ForbiddenException(ActiveError({ key: 'user' }));
        } else if (user.role.status !== STATUS.ACTIVE) {
            throw new ForbiddenException(ActiveError({ key: 'role' }));
        }

        const safe: Record<string, any> = user;

        const createVerifyCode: any = await this.service.createVerifyCode(safe, !!params.rememberMe, {
            subject: 'Welcome to Nice App! Confirm Email',
            html: loginVerifyCodeUi
        });
        res.status(200).send(createVerifyCode);

    }


    async VerifyCode(req: Request, res: Response): Promise<any> {
        const { body } = req
        const findData: any = await this.verifyCodeApiService.findOne({ ...body, status: STATUS.ACTIVE });
        // console.log({ body, findData });
        const rememberMe = findData?.rememberMe;
        const sessionId = this.helperStringService.random(10)

        if (!findData) {
            throw new NotFoundException(notFoundError({ key: 'code' }));
        }

        const expired = new Date(findData.expired);


        const isExpired = await this.service.checkExpired(expired)

        // console.log({ isExpired, expired });

        if (isExpired) {
            // this.verifyCodeApiService.inactive(verifyCode._id);
            throw new NotFoundException(expiredError({ key: 'code' }));
        }

        const user: InterfaceUser.IDocument = await this.userService.findOne({ email: body.email, },
            {
                populate: {
                    role: true,
                    permission: true,
                },
            }
        );
        const token: Record<string, any> = await this.tokenService.create({
            device: null,
            user: user._id,
            sessionId,
            rememberMe,
        })

        this.verifyCodeApiService.inactive(findData._id);

        res.status(200).send({
            result: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }
        });

    }


}

export default VerifyCodeController