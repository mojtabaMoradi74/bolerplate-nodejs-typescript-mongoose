import { ENUM_PERMISSIONS } from 'src/modules/permission/constant';
import PermissionInterface from 'src/modules/permission/interface';
import PermissionService from 'src/modules/permission/service/service.admin';
import RoleBulkService from 'src/modules/role/service/bulk.service';

export class RoleSeed {
    constructor(
        private readonly permissionService: PermissionService,
        private readonly roleBulkService: RoleBulkService
    ) { }


    async insert(): Promise<void> {
        const permissions: PermissionInterface.IDocument[] =
            await this.permissionService.findAll(
                {
                    type: { $in: Object.values(ENUM_PERMISSIONS) },
                }
            );

        try {
            const permissionsMap = permissions.map((val) => val._id);
            await this.roleBulkService.createMany([
                {
                    name: 'admin',
                    permissions: permissionsMap,
                },
                {
                    name: 'user admin',
                    permissions: permissions.filter((x) => x.type === "USER").map((y) => y._id),
                },
                {
                    name: 'blog admin',
                    permissions: permissions.filter((x) => x.type === "BLOG").map((y) => y._id),
                },
            ]);
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }


    async remove(): Promise<void> {
        try {
            await this.roleBulkService.deleteMany({});
        } catch (e: any) {
            throw new Error(e.message);
        }

        return;
    }
}
