import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import mongoose from 'mongoose';
import permissionConstant from 'src/modules/permission/constant';
import userConstant from "src/modules/user/constant";
import blogPostConstant from './../../post/constant';


class BlogTagService {


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

        if (options?.sort) {
            data.sort(options.sort);
        }

        if (options?.populate?.posts) {
            data.populate({
                path: 'posts',
                model: blogPostConstant.MODULE_NAME,
                select: '_id title slug'
            });
        }

        if (options?.populate?.createdBy) {
            data.populate({
                path: 'createdBy',
                model: userConstant.MODULE_NAME,
                select: '_id firstName lastName'
            });
        }

        data.populate({
            path: 'posts',
            model: blogPostConstant.MODULE_NAME,
            select: 'status',
            match: {
                status: STATUS.ACTIVE
            }
        })

        return data.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }

    async findOneById<T>(
        _id: string,
        other?: Record<string, any>
    ): Promise<T> {
        const findByIdData = mongo.model.findById(_id, other);
        return findByIdData.lean();
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const role = mongo.model.findOne(find);

        if (options && options.populate && options.populate.permission) {
            role.populate({
                path: 'permissions',
                model: permissionConstant.MODULE_NAME,
            });
        }

        return role.lean();
    }

    async exists(name: string, _id?: string): Promise<boolean> {
        const exist = await mongo.model.exists({
            name: {
                $regex: new RegExp(name),
                $options: 'i',
            },
            _id: { $ne: new mongoose.Types.ObjectId(_id) },
        });

        return exist ? true : false;
    }

    async create({
        title,
        slug,
        status,
        // tags,
        // categories,
        createdBy
    }: Interface.ICreate): Promise<Interface.IDocument> {

        const create: Interface.IDocument | any = new mongo.model({
            title,
            slug,
            status: status || STATUS.ACTIVE,
            // tags: tags.map(x => new Types.ObjectId(x)),
            // categories: categories.map(x => new Types.ObjectId(x)),
            createdBy: new mongoose.Types.ObjectId(createdBy),
        });

        return create.save();
    }


    async addPost(_id: string, data: string) {
        // const set = { $addToSet: { posts: { $each: [new Types.ObjectId(create._id)] } } }

        return await mongo.model.findByIdAndUpdate(
            _id,
            { $addToSet: { posts: { $each: new mongoose.Types.ObjectId(data) } } },
            { new: true, useFindAndModify: false }
        );
    };

    async update(
        _id: string,
        props: any
    ): Promise<Interface.IDocument> {
        const update: Interface.IDocument | any = await mongo.model.findById(_id);
        for (const key in props) {
            update[key] = props[key]
        }

        return update.save();
    }


    async updateOneById(
        _id: string,
        object: any
    ): Promise<Interface.IDocument> {
        const findById: Interface.IDocument | any = await mongo.model.findById(_id);

        for (const key in object) {
            findById[key] = object[key]
        }

        return findById.save();
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
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

export default BlogTagService
