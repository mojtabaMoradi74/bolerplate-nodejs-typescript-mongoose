import Interface from "../interface";
import mongo from "../mongo";
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import mongoose, { Types } from 'mongoose';
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import mediaFolderConstant from "../../folder/constant";
import userConstant from "src/modules/user/constant";
import blogPostConstant from "src/modules/blog/post/constant";


class MediaGalleryService {

    public helperStringService: HelperStringService;

    constructor(

    ) {
        this.helperStringService = new HelperStringService()

    }


    async findAll(
        find: Record<string, any>,
        options: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        console.log({ find, options });

        const findAll = mongo.model.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            findAll.limit(options.limit).skip(options.skip);
        }

        if (options?.populate?.folder) {
            findAll.populate({
                path: 'folder',
                model: mediaFolderConstant.MODULE_NAME,
                select: ['title', 'status']
            });
        }
        if (options?.populate?.users) {
            findAll.populate({
                path: 'users',
                model: userConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: ['_id', 'title', 'status']
            });
        }
        if (options?.populate?.posts) {
            findAll.populate({
                path: 'posts',
                model: blogPostConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: ['_id', 'title', 'status']
            });
        }

        if (options && options.sort) {
            findAll.sort(options.sort);
        }

        return findAll.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }



    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findById(_id);

        data.populate({
            path: 'folder',
            model: mediaFolderConstant.MODULE_NAME,
            select: ['_id', 'title']
        });
        return data.lean();
    }

    async findOne(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findOne(find);
        if (options && options.populate && options.populate.folder) {
            data.populate({
                path: 'folder',
                model: mediaFolderConstant.MODULE_NAME,
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
            _id: { $ne: new mongoose.Types.ObjectId(_id) },
        });

        return exist ? true : false;
    }

    async create({
        status,
        createdBy,
        folder,
        ...props
    }: Interface.ICreate): Promise<any> {



        const create: any = new mongo.model({
            ...props,
            status: status || STATUS.ACTIVE,
            folder: new mongoose.Types.ObjectId(folder),
            createdBy: new mongoose.Types.ObjectId(createdBy),
        });

        return create.save();
    }


    // async update(
    //     _id: string,
    //     props: any
    // ): Promise<Interface.IDocument> {
    //     const update: any = await mongo.model.findById(_id);
    //     for (const key in props) {
    //         update[key] = props[key]
    //     }
    //     return update.save();
    // }

    async update(
        _id: string,
        set: any
    ): Promise<any> {
        return await mongo.model.updateOne({ _id }, set, { upsert: true });
    }

    async addGallery(_id: string, data: string) {
        console.log({ _id, data });
        // const set = { $addToSet: { admins: { $each: [new mongoose.Types.ObjectId(updateOneById._id)] } } }

        return await mongo.model.findByIdAndUpdate(
            _id,
            { $addToSet: { galleries: { $each: [new mongoose.Types.ObjectId(data)] } } },
            { new: true, useFindAndModify: false }
        );
    };

    async updateOneById(
        _id: string,
        { folder, ...object }: any
    ): Promise<any> {
        const updateOneById: any = await mongo.model.findById(_id);

        if (folder) updateOneById.folder = new mongoose.Types.ObjectId(folder)
        for (const key in object) {
            updateOneById[key] = object[key]
        }

        console.log({ _id, folder, updateOneById });

        return updateOneById.save();
    }


    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<any> {
        return mongo.model.findOneAndDelete(find);
    }

    async createRandomFilename(): Promise<any> {
        const filename: string = this.helperStringService.random(20);

        return filename;
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

export default MediaGalleryService
