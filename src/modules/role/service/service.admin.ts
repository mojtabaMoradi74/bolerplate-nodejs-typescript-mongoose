import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import { Types } from 'mongoose';
import permissionConstant from "src/modules/permission/constant";


class RoleService {


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

        if (options?.populate?.permission) {
            // data.populate({
            //     path: 'permissions',
            //     model: PermissionEntity.name,
            //     match: {
            //         status: STATUS.ACTIVE
            //     },
            //     select: '_id type title'
            // });
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
        // if (options && options.populate && options.populate.permission) {
        //     roles.populate({
        //         path: 'permissions',
        //         model: PermissionEntity.name,
        //     });
        // }
        return data.lean();
    }

    async findOne(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findOne(find);
        if (options && options.populate && options.populate.permission) {
            data.populate({
                path: 'permissions',
                model: permissionConstant.MODULE_NAME,
            });
        }

        return data.lean();
    }

    async checkExist(name: string, _id?: string): Promise<Interface.ICheckExist> {
        const exist = await mongo.model.exists({
            name: {
                $regex: new RegExp(name),
                $options: 'i',
            },
            _id: { $ne: new Types.ObjectId(_id) },
        });

        return exist ? true : false;
    }

    async create({
        name,
        permissions,
        status
    }: Interface.ICreate): Promise<any> {

        const create: Interface.IDocument = new mongo.model({
            name: name,
            permissions: permissions.map((val) => new Types.ObjectId(val)),
            status: status || STATUS.ACTIVE,
        });

        return create.save();
    }


    async update(
        _id: string,
        { name, permissions, status }: Interface.IEdit
    ): Promise<Interface.IDocument> {
        const update: any = await mongo.model.findById(_id);
        update.name = name;
        update.permissions = permissions.map((val) => new Types.ObjectId(val));
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

export default RoleService
