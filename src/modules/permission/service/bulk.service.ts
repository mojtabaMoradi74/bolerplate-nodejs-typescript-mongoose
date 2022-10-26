import { DeleteResult } from 'mongodb';
import mongo from '../mongo';
import Interface from "../interface";
import { STATUS } from 'src/enum';

export default class PermissionBulkService {
    constructor(
    ) { }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return mongo.model.deleteMany(find);
    }

    async updateMany(find: Record<string, any>, set: Record<string, any>): Promise<any> {
        return mongo.model.updateMany(find, set);
    }





    async createMany(data: Interface.ICreate[]): Promise<any> {
        return mongo.model.insertMany(
            data.map(({ status, type, description, title }) => ({
                type: type,
                title: title,
                description: description,
                status: status || STATUS.ACTIVE,
            }))
        );
    }

    async findMany(find: Record<string, any>): Promise<any> {
        console.log({ find });

        return await mongo.model.find({
            '_id': { $in: find }
        });
    }
}
