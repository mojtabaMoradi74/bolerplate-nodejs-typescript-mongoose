import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import ApiService from "./api.service";
import { NotFoundException } from 'packages/errors/NotFoundException';
import { notFoundError } from 'src/utils/error-converter';
import sendEmail from 'src/modules/email/EmailService';



export default class VerifyCodeService {

    constructor(
        private readonly apiService: ApiService,
        private readonly helperDateService: HelperDateService,
    ) {

    }

    async createVerifyCode(user: Record<string, any>, rememberMe: boolean, options: Record<string, any>): Promise<string> {
        let code = this.generateCode();

        try {
            this.sendEmail(
                { ...user, code },
                options
            );

            const create = await this.apiService.create({
                email: user.email,
                code,
                rememberMe
            })

            return {
                ...create,
                firstName: user.firstName,
                lastName: user.lastName,
            }

        } catch (error) {

            throw new NotFoundException({
                message: notFoundError({ key: 'user' }),
            });
        }



    }

    async sendEmail(user: any, options: any) {
        const { email, firstName, lastName, code } = user;
        const { html, subject } = options;

        return await sendEmail({
            email,
            subject,
            html: html(firstName, lastName, code)
        });
    }

    generateCode() {
        // return 12345
        return Number(Math.floor(10000 + Math.random() * 90000))
    }

    async checkExpired(expired: Date): Promise<boolean> {
        return this.helperDateService.isExpired(expired);
    }

}
