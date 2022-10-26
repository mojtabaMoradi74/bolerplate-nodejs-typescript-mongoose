import { DeleteResult } from 'mongodb';
import mongo from '../mongo';

export default class MediaFolderBulkService {
    constructor(
    ) { }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return mongo.model.deleteMany(find);
    }

    async updateMany(find: Record<string, any>, set: Record<string, any>): Promise<any> {
        return mongo.model.updateMany(find, set);
    }



    async findMany(find: Record<string, any>): Promise<any> {

        return await mongo.model.find({
            '_id': { $in: find }
        });
    }


}
