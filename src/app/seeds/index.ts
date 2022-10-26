import AuthService from "src/modules/auth/service/service.admin";
import PermissionBulkService from "src/modules/permission/service/bulk.service";
import PermissionService from "src/modules/permission/service/service.admin";
import RoleBulkService from "src/modules/role/service/bulk.service";
import RoleService from "src/modules/role/service/service.admin";
import UserBulkService from "src/modules/user/service/bulk.service";
import UserService from "src/modules/user/service/service.admin";
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import PermissionSeed from "./permission.seed";
import { RoleSeed } from "./role.seed";
import { UserSeed } from "./user.seed";

const seeds = async (migrateSeeds: any,) => {

    console.log("---------------- seeds start");

    for await (const results of migrateSeeds) {


        const permissionBulkService = new PermissionBulkService()
        const permissionService = new PermissionService()

        const roleBulkService = new RoleBulkService()

        const helperHashService = new HelperHashService()
        const helperDateService = new HelperDateService()
        const helperStringService = new HelperStringService()

        const authService = new AuthService(helperHashService, helperDateService)

        const userService = new UserService(helperStringService)
        const userBulkService = new UserBulkService()

        const roleService = new RoleService()

        const permissionSeed = new PermissionSeed(permissionBulkService)
        const roleSeed = new RoleSeed(permissionService, roleBulkService)
        const userSeed = new UserSeed(authService, userService, userBulkService, roleService)

        console.log(`----------------${results}`);

        switch (results) {
            case 'insert:permission':
                await permissionSeed.insert()
                console.log(`${results} =========> completed`);

                break;
            case 'remove:permission':
                await permissionSeed.remove()
                console.log(`${results} =========> completed`);
                break;

            case 'insert:role':
                await roleSeed.insert()
                console.log(`${results} =========> completed`);

                break;
            case 'remove:role':
                await roleSeed.remove()
                console.log(`${results} =========> completed`);
                break;

            case 'insert:user':
                await userSeed.insert()
                console.log(`${results} =========> completed`);

                break;
            case 'remove:user':
                await userSeed.remove()
                console.log(`${results} =========> completed`);
                break;

            default:
                break;
        }

    }



    process.exit(0);

}

export default seeds;