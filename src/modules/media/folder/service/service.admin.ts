import { ILogger } from "packages/logger";
// import { DataNotFoundError } from "../../../../packages/errors/data-not-found-error";
// import { BlogCategoryNotFound } from "../../../../packages/messages";
// import { CalculateOffset, CalculateSort, ErrorHandling } from "../../../utils";
// import { List } from "../../../utils/helper/request";
import Interface from "../interface";
import mongo from "../mongo";
import constant from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import mongoose, { ObjectId, Types } from 'mongoose';
import mediaFolderConstant from "../constant";
import permissionConstant from "src/modules/permission/constant";
import mediaGalleryConstant from "../../gallery/constant";


class MediaFolderService {


    constructor() {
    }


    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        const findData = mongo.model.find(find)
        return findData.lean();
    }

    async findAllList(
        find: Record<string, any>,
        options: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        const aggregate: any = [
            { "$match": { ...(options.search && { "title": { $regex: options.search, $options: 'g' } }) } },
            { "$match": { ...(options.status && { "status": options.status }) } },
            { "$sort": options.sort },
            { "$limit": options.limit },
            { "$skip": options.skip },
            // {
            //     "$lookup": {
            //         from: mediaGalleryConstant.MODULE_NAME,
            //         localField: "galleries",
            //         foreignField: "_id",
            //         // pipeline: [
            //         //     { $match: { status: STATUS.ACTIVE } },
            //         //     { $project: { _id: 1, completedUrl: 1 } }
            //         // ],
            //         as: "galleries",
            //     }
            // },
            // {
            //     '$project': {
            //         galleries_count: { $cond: { if: { $isArray: "$galleries" }, then: { $size: "$galleries" }, else: "NA" } }
            //     }
            // },
        ]


        if (options.image === "true") {
            aggregate.push(
                {
                    "$addFields": {
                        "image": {
                            $arrayElemAt: [
                                "$galleries",
                                -1
                            ]
                        }
                    }
                },
                {
                    "$lookup": {
                        from: mediaGalleryConstant.MODULE_NAME,
                        localField: "image",
                        foreignField: "_id",
                        pipeline: [
                            { $match: { status: STATUS.ACTIVE } },
                            { $project: { _id: 1, completedUrl: 1 } }
                        ],
                        as: "image",
                    }
                },
                { "$unwind": { path: "$image", preserveNullAndEmptyArrays: true } },

            )
        }

        aggregate.push(
            {
                "$addFields": { galleryCounts: { $cond: { if: { $isArray: "$galleries" }, then: { $size: "$galleries" }, else: 0 } } },
            },
            {
                "$unset": "galleries",
            }
        )

        return mongo.model.aggregate(
            [
                {
                    $facet: {
                        result: aggregate,
                        count: [
                            { "$match": { ...(options.search && { "title": { $regex: options.search, $options: 'g' } }) } },
                            { "$match": { ...(options.status && { "status": options.status }) } },
                            { $count: "total" },
                        ]
                    },
                },
                {
                    $unwind: { path: "$count", preserveNullAndEmptyArrays: true }
                },
                {
                    $addFields: ({
                        "count": "$count.total"
                    })
                },
            ])
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }



    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const data = mongo.model.findById(_id);
        if (options && options.populate && options.populate.permission) {
            // roles.populate({
            //     path: 'permissions',
            //     model: permissionConstant.MODULE_NAM,
            // });
        }
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
        ...props
    }: Interface.ICreate): Promise<any> {


        const create: any = new mongo.model({
            ...props,
            status: status || STATUS.ACTIVE,
            createdBy: new mongoose.Types.ObjectId(createdBy)
        });

        return create.save();
    }


    async update(
        _id: string,
        props: any
    ): Promise<Interface.IDocument> {
        const update: any = await mongo.model.findById(_id);
        for (const key in props) {
            update[key] = props[key]
        }
        return update.save();
    }

    async addGallery(_id: string | ObjectId, data: string | ObjectId) {
        console.log({ _id, data });
        // const set = { $addToSet: { admins: { $each: [new mongoose.Types.ObjectId(updateOneById._id)] } } }

        return await mongo.model.findByIdAndUpdate(
            _id,
            { $addToSet: { galleries: { $each: [data] } } },
            // { new: true, useFindAndModify: false }
        );
    };

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

export default MediaFolderService
