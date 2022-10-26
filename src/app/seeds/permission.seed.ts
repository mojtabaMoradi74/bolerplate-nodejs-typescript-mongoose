import PermissionBulkService from 'src/modules/permission/service/bulk.service';
import { ENUM_PERMISSIONS } from 'src/modules/permission/constant';

export default class PermissionSeed {
    constructor(
        private readonly permissionBulkService: PermissionBulkService
    ) { }

    // @ErrorMeta(PermissionSeed.name, 'insert')
    // @Command({
    //     command: 'insert:permission',
    //     describe: 'insert permissions',
    // })
    async insert(): Promise<void> {
        try {
            const permissions: any = Object.keys(ENUM_PERMISSIONS).map((val) => ({
                type: val,
                title: val.replace('_', ' '),
            }));

            await this.permissionBulkService.createMany(permissions);
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }

    // @ErrorMeta(PermissionSeed.name, 'remove')
    // @Command({
    //     command: 'remove:permission',
    //     describe: 'remove permissions',
    // })
    async remove(): Promise<void> {
        try {
            await this.permissionBulkService.deleteMany({});
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }
}
