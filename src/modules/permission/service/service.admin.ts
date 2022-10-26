import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import { Types } from 'mongoose';


class PermissionService implements Interface.IService {


    constructor() {
    }

    section: string = constant.MODULE_NAME;

    async findAll(
        find?: Record<string, any> | any,
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
        const findById = mongo.model.findById(_id);
        return findById.lean();
    }

    async findOne(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const User = mongo.model.findOne(find);

        return User.lean();
    }

    async create({
        status,
        createdBy,
        ...props
    }: Interface.ICreate): Promise<any> {



        const create: any = new mongo.model({
            ...props,
            status: status || STATUS.ACTIVE,
            createdBy: new Types.ObjectId(createdBy)
        });
        return create.save();
    }

    async update(
        _id: string,
        props: any
    ): Promise<Interface.IUpdate> {
        const update: any = await mongo.model.findById(_id);
        for (const key in props) {
            update[key] = props[key]
        }

        return update.save();
    }


    async updateOneById(
        _id: string,
        object: any
    ): Promise<any> {
        const findById: any = await mongo.model.findById(_id);

        for (const key in object) {
            findById[key] = object[key]
        }

        return findById.save();
    }

    async checkExist(
        email: string,
        mobileNumber: string,
        _id?: string
    ): Promise<any> {

        const existEmail: Record<string, any> | null = await mongo.model.exists({
            $and: [
                {
                    email: {
                        $regex: new RegExp(email),
                        $options: 'i',
                    }
                },
                { _id: { $ne: new Types.ObjectId(_id) } },
            ]
        });

        const existMobileNumber: Record<string, any> | null =
            await mongo.model.exists({
                $and: [
                    { mobileNumber },
                    { _id: { $ne: new Types.ObjectId(_id) } },
                ],
            });

        console.log({ existEmail, existMobileNumber, email, mobileNumber, _id });

        return {
            email: existEmail ? true : false,
            mobileNumber: existMobileNumber ? true : false,
        };
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<any> {
        return mongo.model.findOneAndDelete(find);
    }
}

export default PermissionService
