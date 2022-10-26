import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import { isExistError, notFoundError } from "src/utils/error-converter";
import { NotFoundException } from "packages/errors/NotFoundException";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { BadRequestException } from "packages/errors/BadRequestException";
import PermissionService from "src/modules/permission/service/service.admin";

class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly permissionService: PermissionService,
        private readonly bulkService: BulkService
    ) { }


    async List(req: Request, res: Response) {

        const { skip, limit, sort, search, status } = req.query as Record<string, any>;
        const find: Record<string, any> = {};

        if (status) {
            find["status"] = {
                $in: status
            }
        }

        if (search) {
            find['$or'] = [
                {
                    name: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
            ];
        }

        const data: Interface.IDocument[] = await this.service.findAll(find, {
            skip: skip,
            limit: limit,
            sort,
            populate: {
                permission: true
            }
        });

        const count: number = await this.service.getTotal(find);
        // const totalPage: number = await this.paginationService.totalPage(
        //     totalData,
        //     limit
        // );

        const result = data;

        res.status(200).send({
            count,
            result,
        });
    }


    async Create(req: Request, res: Response): Promise<any> {
        const { body: { name, permissions, status } } = req;
        const exist: boolean = await this.service.checkExist(name);
        // console.log({ body: req.body, permissions });
        // console.log({ exist });


        if (exist) {
            throw new BadRequestException(isExistError({ key: 'role' }));
        }

        for (const permission of permissions) {
            const checkPermission: any =
                await this.permissionService.findOneById(permission);
            console.log({ checkPermission });

            if (!checkPermission) {
                throw new NotFoundException(notFoundError({ key: 'permission' }));
            }
        }

        try {
            const create = await this.service.create({
                name,
                permissions,
                status
            });
            console.log({ create });

            res.status(200).send(create);
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

    }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }


    async Update(
        // @decorators.GetData() User: IUserDocument,
        // // @GetData() data: any,
        // @Body() body: UserEditDto,
        // @Request() req: any
        req: Request, res: Response

    ): Promise<any> {
        const { _data: data, body: { name, permissions, status } } = req;
        // const User=   _data
        // console.log({ User });

        const check: boolean = await this.service.checkExist(name, data._id);
        if (check) {
            throw new BadRequestException(isExistError({ key: 'role' }));
        }

        for (const permission of permissions) {
            const checkPermission: any =
                await this.permissionService.findOneById(permission);

            if (!checkPermission) {
                throw new NotFoundException(notFoundError({ key: 'permission' }));
            }
        }

        try {
            await this.service.update(data._id, {
                name,
                permissions,
                status
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

        res.status(200).send({
            _id: data._id,
        });

    }


    async Delete(req: Request, res: Response): Promise<void> {
        const { _data } = req;
        try {
            await this.service.deleteOneById(_data._id);
            res.status(200).send(_data)
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