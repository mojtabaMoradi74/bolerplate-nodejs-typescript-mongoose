import { DeleteResult } from 'mongodb';
import mongo from '../mongo';

export default class UserBulkService {
    constructor(
    ) { }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return mongo.model.deleteMany(find);
    }

}
