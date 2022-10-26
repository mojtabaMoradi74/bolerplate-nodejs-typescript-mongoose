import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import mongoose, { Types } from 'mongoose';
import permissionConstant from './../../../permission/constant';
import userConstant from "src/modules/user/constant";
import blogCategoryConstant from "../../category/constant";
import mediaGalleryConstant from "src/modules/media/gallery/constant";
import blogTagConstant from "../../tag/constant";


class BlogPostService {


    constructor() {
    }

    section: string = constant.MODULE_NAME;

    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        const findAll = mongo.model.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            findAll.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            findAll.sort(options.sort);
        }

        findAll.populate({
            path: 'createdBy',
            model: userConstant.MODULE_NAME,
            select: '_id firstName lastName image'
        });

        if (options?.populate?.tags) {
            findAll.populate({
                path: 'tags',
                model: blogTagConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title'
            });
        }
        if (options?.populate?.categories) {
            findAll.populate({
                path: 'categories',
                model: blogCategoryConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title'
            });
        }

        if (options?.populate?.image) {
            findAll.populate({
                path: 'image',
                model: mediaGalleryConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title completedUrl'
            });
        }
        return findAll.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }

    async findOneById<T>(
        _id: string,
        options?: Record<string, any>
    ): Promise<any> {
        console.log({ _id });

        const findByIdData = mongo.model.findById(_id);

        findByIdData.populate({
            path: 'createdBy',
            model: userConstant.MODULE_NAME,
            select: '_id firstName lastName image'
        });

        if (options?.populate?.tags) {
            findByIdData.populate({
                path: 'tags',
                model: blogTagConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title'
            });
        }
        if (options?.populate?.categories) {
            findByIdData.populate({
                path: 'categories',
                model: blogCategoryConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title'
            });
        }

        if (options?.populate?.image) {
            findByIdData.populate({
                path: 'image',
                model: mediaGalleryConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title completedUrl'
            });
        }

        const data = await findByIdData.lean();
        console.log({ data });

        return data
    }

    async findOneBySlugAndUpdate(slug: string, other?: Record<string, any>) {
        const data = await mongo.model.findOneAndUpdate({ slug }, other)
        return data;
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const findData = mongo.model.findOne(find);

        if (options && options.populate && options.populate.permission) {
            findData.populate({
                path: 'permissions',
                model: permissionConstant.MODULE_NAME,
            });
        }

        return findData.lean();
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
        categories,
        tags,
        status,
        createdBy,
        image,
        ...props
    }: Interface.ICreate): Promise<Interface.IDocument> {

        const create: Interface.IDocument | any = new mongo.model({
            ...props,
            categories: categories.map((x: string) => new mongoose.Types.ObjectId(x)),
            tags: tags.map((x: string) => new mongoose.Types.ObjectId(x)),
            createdBy: new mongoose.Types.ObjectId(createdBy),
            ...(image && { image: new mongoose.Types.ObjectId(image) }),
        });

        return create.save();
    }

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

export default BlogPostService
