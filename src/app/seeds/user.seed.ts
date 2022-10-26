
import { STATUS } from 'src/enum';
import AuthService from 'src/modules/auth/service/service.admin';
import RoleInterface from 'src/modules/role/interface';
import RoleService from 'src/modules/role/service/service.admin';
import { MEMBER_TYPE } from 'src/modules/user/constant';
import UserBulkService from 'src/modules/user/service/bulk.service';
import UserService from 'src/modules/user/service/service.admin';

export class UserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly bulkService: UserBulkService,
        private readonly roleService: RoleService
    ) { }

    async insert(): Promise<void> {
        const role: RoleInterface.IDocument = await this.roleService.findOne(
            {
                name: 'admin',
            }
        );

        try {
            const password = await this.authService.createPassword(
                'aaAA@@123444'
            );

            console.log(password);


            await this.userService.create({
                firstName: 'admin',
                lastName: 'test',
                email: 'admin@mail.com',
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                mobileNumber: '09111111111',
                role: role?._id,
                salt: password.salt,
                type: MEMBER_TYPE.ADMIN,
                status: STATUS.ACTIVE,
            });
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }


    async remove(): Promise<void> {
        try {
            await this.bulkService.deleteMany({});
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }
}
