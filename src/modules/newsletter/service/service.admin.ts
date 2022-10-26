import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import { Types } from 'mongoose';


class NewsletterService {


    constructor() {
    }

    section: string = constant.MODULE_NAME;

    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        const data = mongo.model.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            data.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            data.sort(options.sort);
        }


        return data.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }



    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findById(_id);

        return data.lean();
    }

    async findOne(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findOne(find);

        return data.lean();
    }

    async checkExist(email: string, _id?: string): Promise<Interface.ICheckExist> {
        const exist = await mongo.model.exists({
            email: {
                $regex: new RegExp(email),
                $options: 'i',
            },
            _id: { $ne: new Types.ObjectId(_id) },
        });

        return exist ? true : false;
    }

    async create({
        email, status
    }: Interface.ICreate): Promise<any> {

        const create: Interface.IDocument = new mongo.model({
            email,
            status: status || STATUS.ACTIVE,
        });

        return create.save();
    }


    async update(
        _id: string,
        { email, status }: Interface.IEdit
    ): Promise<Interface.IDocument> {
        const update: any = await mongo.model.findById(_id);
        update.email = email;
        update.status = status;
        return update.save();
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<any> {
        return mongo.model.findOneAndDelete(find);
    }

    // async serializationGet(data: Interface.IDocument): Promise<RoleGetSerialization> {
    //     return plainToInstance(RoleGetSerialization, data);
    // }

    // async serializationList(
    //     data: RoleDocument[]
    // ): Promise<RoleListSerialization[]> {
    //     return plainToInstance(RoleListSerialization, data);
    // }
}

export default NewsletterService
