import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import { isExistError } from "src/utils/error-converter";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { BadRequestException } from "packages/errors/BadRequestException";
import { STATUS } from "src/enum";

class NewsletterController {
    constructor(
        private readonly service: Service,
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



        try {
            const data: Interface.IDocument[] = await this.service.findAll(find, {
                skip: skip,
                limit: limit,
                sort,
            });

            const count: number = await this.service.getTotal(find);

            const result = data;

            res.status(200).send({
                count,
                result,
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }


    async Create(req: Request, res: Response): Promise<any> {
        const { body: { email, permissions, status } } = req;
        const exist: boolean = await this.service.checkExist(email);

        if (exist) {
            throw new BadRequestException(isExistError({ key: 'newsletter' }));
        }

        try {
            const create: Interface.IDocument = await this.service.create({
                email,
                status: status || STATUS.ACTIVE
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


    async Update(req: Request, res: Response): Promise<any> {
        const { _data: data, body: { email, status } } = req;
        // const User=   _data
        // console.log({ User });

        const check: boolean = await this.service.checkExist(email, data._id);
        if (check) {
            throw new BadRequestException(isExistError({ key: 'newsletter' }));
        }


        try {
            await this.service.update(data._id, {
                email,
                status: status || STATUS.ACTIVE
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

export default NewsletterController