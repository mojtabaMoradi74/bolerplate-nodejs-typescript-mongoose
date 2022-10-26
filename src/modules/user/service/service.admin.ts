
import Interface from "../interface";
import mongo from "../mongo";
import constant, { MEMBER_TYPE } from '../constant';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import { Types } from 'mongoose';
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import mediaGalleryConstant from "src/modules/media/gallery/constant";
import roleConstant from "src/modules/role/constant";
import permissionConstant from "src/modules/permission/constant";


class UserService implements Interface.IService {


    constructor(private readonly helperStringService: HelperStringService,
    ) {
    }



    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Interface.IDocument[]> {
        const findData = mongo.model.find(find)
            .populate({
                path: 'role',
                model: roleConstant.MODULE_NAME,
            });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            findData.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            findData.sort(options.sort);
        }

        if (options?.populate?.image) {
            findData.populate({
                path: 'image',
                model: mediaGalleryConstant.MODULE_NAME,
                match: {
                    status: STATUS.ACTIVE
                },
                select: '_id title completedUrl'
            });
        }

        return findData.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }



    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const findById = mongo.model.findById(_id);

        // if (options?.populate?.role) {
        findById.populate({
            path: 'role',
            model: roleConstant.MODULE_NAME,
        });

        // if (options?.populate?.permission) {
        findById.populate({
            path: 'role',
            model: roleConstant.MODULE_NAME,
            populate: {
                path: 'permissions',
                model: permissionConstant.MODULE_NAME,
            },
        });
        // }
        // }
        // if (options?.populate?.image) {
        findById.populate({
            path: 'image',
            model: mediaGalleryConstant.MODULE_NAME,
            match: {
                status: STATUS.ACTIVE
            },
            select: '_id title completedUrl'
        });
        // }

        return findById.lean();
    }

    async findOne(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<any> {
        const User = mongo.model.findOne(find);
        User.populate({
            path: 'image',
            model: mediaGalleryConstant.MODULE_NAME,
        });
        if (options && options.populate && options.populate.role) {
            User.populate({
                path: 'role',
                model: roleConstant.MODULE_NAME,
            });

            if (options.populate.permission) {
                User.populate({
                    path: 'role',
                    model: roleConstant.MODULE_NAME,
                    populate: {
                        path: 'permissions',
                        model: permissionConstant.MODULE_NAME,
                    },
                });
            }
        }

        return User.lean();
    }

    async create({
        firstName,
        lastName,
        password,
        passwordExpired,
        salt,
        email,
        mobileNumber,
        role,
        image,
        status,
        type
    }: Interface.ICreate): Promise<any> {

        const data: Interface.ICreate = {
            firstName,
            email,
            mobileNumber,
            password,
            role: role ? new Types.ObjectId(role) : undefined,
            lastName: lastName,
            salt,
            status: status || STATUS.ACTIVE,
            image: new Types.ObjectId(image),
            passwordExpired,
            type: type || MEMBER_TYPE.USER,
        };

        const create: any = new mongo.model(data);
        return create.save();
    }


    async updateOneById(
        _id: string,
        {
            firstName,
            lastName,
            salt,
            email,
            mobileNumber,
            role,
            image,
            status,
            type,
            updatedBy
        }: Interface.IEdit): Promise<any> {

        const findByIdModule: any = await mongo.model.findById(_id);

        const data: Record<string, any> = {
            firstName,
            email,
            mobileNumber,
            lastName: lastName || undefined,
            role: type === MEMBER_TYPE.ADMIN ? new Types.ObjectId(role) : undefined,
            ...(image && { image: new Types.ObjectId(image) }),
            ...(status && { status }),
            ...(salt && { salt }),
            ...(type && { type }),
            updatedBy: new Types.ObjectId(updatedBy)
        };

        for (const key in data) {
            findByIdModule[key] = data[key]
        }

        return findByIdModule.save();
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

    async createRandomFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: "/user",
            filename: filename,
        };
    }

    async updatePassword(
        _id: string,
        { salt, passwordHash, passwordExpired }: any
    ): Promise<any> {
        const auth: any = await mongo.model.findById(_id);

        auth.password = passwordHash;
        auth.passwordExpired = passwordExpired;
        auth.salt = salt;

        return auth.save();
    }

    async updatePasswordExpired(
        _id: string,
        passwordExpired: Date
    ): Promise<any> {
        const auth: any = await mongo.model.findById(_id);
        auth.passwordExpired = passwordExpired;

        return auth.save();
    }

    async changeStatus(_id: string, status: string): Promise<any> {

        const User: any = await mongo.model.findById(_id);
        User.status = status;
        return User.save();

    }
}

export default UserService
