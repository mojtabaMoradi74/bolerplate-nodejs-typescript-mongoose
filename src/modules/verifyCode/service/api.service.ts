import mongo from "../mongo";
import { STATUS } from 'src/enum';
export default class VerifyApiService {


    constructor(

    ) {

    }
    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }

    async findOneById(_id: string): Promise<any> {
        return mongo.model.findById(_id).lean();
    }

    async create({
        email,
        rememberMe,
        code,
    }: any): Promise<any> {

        let expired: any = new Date();
        expired = new Date(expired.getTime() + 120000);
        // console.log({ expired });

        const create: any = new mongo.model({
            email,
            rememberMe,
            code,
            expired: expired,
            status: STATUS.ACTIVE,
        });

        await create.save();

        return {
            email
        };
    }

    async findOne(find?: Record<string, any>): Promise<any> {
        return mongo.model.findOne(find).lean();
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<any> {
        return mongo.model.findOneAndDelete(find);
    }

    async inactive(_id: string): Promise<any> {
        const VerifyCodeApi: any = await mongo.model.findById(_id);

        VerifyCodeApi.status = STATUS.DISABLE;
        return VerifyCodeApi.save();
    }

}
