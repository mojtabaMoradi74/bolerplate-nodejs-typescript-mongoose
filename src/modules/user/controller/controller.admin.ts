import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import { BadRequestError } from "packages/errors/bad-request-error";
import { ActiveError, isExistError, notFoundError, serverError } from "src/utils/error-converter";
import { MEMBER_TYPE } from "../constant";
import { NotFoundException } from "packages/errors/NotFoundException";
import { Types } from 'mongoose';
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
import { BadRequestException } from "packages/errors/BadRequestException";
import RoleService from "src/modules/role/service/service.admin";
import BulkService from "../service/bulk.service";
import MediaGalleryService from "src/modules/media/gallery/service/service.admin";
import AuthService from "src/modules/auth/service/service.admin";

class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService,
        private readonly roleService: RoleService,
        private readonly mediaGalleryService: MediaGalleryService,
        private readonly authService: AuthService,
    ) { }


    async List(req: Request, res: Response) {

        const { page, limit, sort, search, status } = req.query as Record<string, any>;
        const find: Record<string, any> = {};


        if (status) {
            find["status"] = {
                $in: status
            }
        }

        if (search) {
            find['$or'] = [
                {
                    firstName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },

                },
                {
                    lastName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
                {
                    mobileNumber: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                }
            ];

        }
        // const bc = await this.service.List(find);
        try {
            const Users: Interface.IDocument[] = await this.service.findAll(find, {
                limit,
                page,
                sort,
                populate: {
                    role: true,
                    permission: true,
                    image: true,
                }
            });

            const count: number = await this.service.getTotal(find);

            res.status(200).send({
                result: Users,
                count
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

    }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }

    async Create(req: Request, res: Response): Promise<any> {
        const { body } = req;
        const checkExist: Interface.ICheckExist = await this.service.checkExist(
            body.email,
            body.mobileNumber
        );

        if (checkExist.email && checkExist.mobileNumber) {
            throw new BadRequestError(isExistError({ key: 'user', ns: 'global' }));
        } else if (checkExist.email) {
            throw new BadRequestError(isExistError({ key: 'email', ns: 'global' }));
        } else if (checkExist.mobileNumber) {
            throw new BadRequestError(isExistError({ key: 'mobileNumber', ns: 'global' }));
        }

        if (body.type === MEMBER_TYPE.ADMIN) {

            const role = await this.roleService.findOneById(body.role);
            if (!role) {
                throw new NotFoundException(
                    notFoundError({ key: 'role', ns: 'global' })
                );
            }

        }


        if (body.image) {

            const findImage: any = await this.mediaGalleryService.findOneById(body.image);

            if (!findImage) {
                throw new NotFoundException(notFoundError({ key: 'gallery', ns: 'global' }));
            } else if (findImage.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'gallery', ns: 'global' }),);
            }

        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.service.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                mobileNumber: body.mobileNumber,
                role: body.role,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                salt: password.salt,
                type: body.type,
                ...(body.image && { image: body.image }),
                status: body.status,
            });

            if (body.image) {
                // const set = { $push: { Users: new Types.ObjectId(create._id) } }
                const set = { $addToSet: { Users: { $each: [new Types.ObjectId(create._id)] } } }

                this.mediaGalleryService.update(body.image, set);
            }
            res.status(200).send({
                _id: create._id,
            });
        } catch (error: any) {

            throw new InternalServerErrorException(error.message);
        }
    }


    async Update(req: Request, res: Response): Promise<any> {
        const { _data: User, body } = req;

        const checkExist: Interface.ICheckExist = await this.service.checkExist(
            User.email !== body.email ? body.email : null,
            User.mobileNumber !== body.mobileNumber ? body.mobileNumber : null,
            User._id
        );

        // console.log({ checkExist });
        if (checkExist.email && checkExist.mobileNumber) {
            throw new BadRequestException(isExistError({ key: 'user', ns: 'global' }));
        } else if (checkExist.email) {
            throw new BadRequestException(isExistError({ key: 'email', ns: 'global' }));
        } else if (checkExist.mobileNumber) {
            throw new BadRequestException(isExistError({ key: 'mobileNumber', ns: 'global' }));
        }

        if (body.type === MEMBER_TYPE.ADMIN) {

            const role = await this.roleService.findOneById(body.role);
            if (!role) {
                throw new NotFoundException(notFoundError({ key: 'role', ns: 'global' }));
            }

        }
        if (body.image) {

            const findImage: any = await this.mediaGalleryService.findOneById(body.image);


            if (!findImage) {
                throw new NotFoundException(notFoundError({ key: 'gallery', ns: 'global' }),);
            } else if (findImage.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'gallery', ns: 'global' }),);
            }

        }

        try {
            const updateOneById = await this.service.updateOneById(User._id, {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                role: body.role,
                mobileNumber: body.mobileNumber,
                ...(body.image && { image: body.image }),
                ...(body.status && { status: body.status }),
                ...(body.type && { type: body.type }),
                updatedBy: req.user._id
            });

            console.log({ updateOneById, body });
            if (body?.image && !User?.image?._id?.equals(body?.image)) {
                console.log("set image");

                const set = { $addToSet: { users: { $each: [(updateOneById._id)] } } }
                this.mediaGalleryService.update(body.image, set);
            }
            res.status(200).send(updateOneById)

        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

    }

    async ChangeStatus(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const find = { _id: { $in: body.data } }
        const set = { $set: { status: body.status } }

        try {
            await this.bulkService.updateMany(find, set);
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

        res.status(200).send(body);
    }

}

export default BlogCategoryController