import { Request, Response } from "express";
import { List } from "../../../utils/helper/request";
import { OkResponse } from "../../../response";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import RequestInterface from "src/utils/helper/request/request.interface";
import { ILogger } from "packages/logger";
import { BadRequestError } from "packages/errors/bad-request-error";
import { ActiveError, isExistError, notFoundError, serverError } from "src/utils/error-converter";
// import { MEMBER_TYPE } from "../constant";
import { NotFoundException } from "packages/errors/NotFoundException";
import { Types } from 'mongoose';
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
// import MediaGalleryInterface from 'src/modules/media/gallery/interface';
import { BadRequestException } from "packages/errors/BadRequestException";

class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService
    ) { }


    async List(req: Request, res: Response) {

        const { skip,
            limit,
            sort,
            search,
            status } = req.query as Record<string, any>;
        const find: Record<string, any> = {};

        if (status) {
            find["status"] = {
                $in: status
            }
        }

        if (search) {
            find['$or'] = [
                {
                    title: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },

                },
            ];

        }

        // console.log({ search, find });

        const data: any[] = await this.service.findAll(find, {
            limit,
            skip,
            sort,
        });
        const count: number = await this.service.getTotal(find);

        const result = data;

        return {
            count,
            result,
        };
    }


    async Create(
        req: Request
    ): Promise<any> {
        const { body } = req;
        // const exist: boolean = await this.service.exists(name);
        // if (exist) {
        //     throw new BadRequestException({
        //         message: isExistError({ key: 'role' }),
        //     });
        // }



        try {
            const create = await this.service.create({
                status: body.status || STATUS.ACTIVE,
                refreshToken: body.refreshToken,
                accessToken: body.accessToken,
                user: body.user,
            });

            return {
                _id: create._id,
            };
        } catch (error: any) {
            throw new InternalServerErrorException({ message: serverError() });
        }

    }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        return _data;
    }


    async Delete(req: Request, res: Response): Promise<void> {
        const { _data: data, } = req;
        try {
            await this.service.deleteOneById(data._id);
        } catch (err) {
            throw new InternalServerErrorException({ message: serverError() });
        }
        return;
    }

    async ChangeStatus(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const find = { _id: { $in: body.data } }
        const set = { $set: { status: body.status } }

        try {
            await this.bulkService.updateMany(find, set);
        } catch (err) {
            throw new InternalServerErrorException({ message: serverError() });
        }

        return body;
    }


}

export default BlogCategoryController