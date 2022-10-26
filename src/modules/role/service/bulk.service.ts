import { DeleteResult } from 'mongodb';
import mongo from '../mongo';
import Interface from 'src/modules/role/interface';
import { Types } from 'mongoose';
import { STATUS } from 'src/enum';

export default class RoleBulkService {
    constructor(
    ) { }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return mongo.model.deleteMany(find);
    }

    async updateMany(find: Record<string, any>, set: Record<string, any>): Promise<any> {
        return mongo.model.updateMany(find, set);
    }


    async createMany(data: Interface.ICreate[]): Promise<Interface.IDocument[]> {
        return mongo.model.insertMany(
            data.map(({ name, permissions }) => ({
                name,
                status: STATUS.ACTIVE,
                permissions: permissions.map((val) => new Types.ObjectId(val)),
            }))
        );
    }


}
