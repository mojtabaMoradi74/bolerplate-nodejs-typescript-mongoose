import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import { ActiveError, isExistError, isUsedError, notFoundError, serverError } from "src/utils/error-converter";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
import BulkService from '../service/bulk.service';
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";

class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService,
        private readonly helperSlugService: HelperSlugService,
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
                    title: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },

                },
            ];

        }

        // console.log({ search, find });

        const data: Interface.IDocument[] = await this.service.findAll(find, {
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
        // res.status(200).send(Users);
    }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        return _data;
    }
    async Create(
        // @Body() body: UserAddDto,
        // @Request() req: any
        req: Request, res: Response

    ): Promise<any> {
        const { body } = req;
        const checkSlug = await this.helperSlugService.checkSlug(body.slug || body.title, this.service)

        if (checkSlug.find) {
            throw new InternalServerErrorException({ message: isUsedError({ key: 'slug' }) });
        }

        try {
            const create = await this.service.create({
                title: body.title,
                slug: checkSlug.slug,
                status: body.status || STATUS.ACTIVE,
                createdBy: req.user._id
            });

            return {
                _id: create._id,
            };
        } catch (err: any) {

            throw new InternalServerErrorException({ message: serverError() });
        }
    }


    async Update(
        // @decorators.GetData() User: IUserDocument,
        // // @GetData() data: any,
        // @Body() body: UserEditDto,
        // @Request() req: any
        req: Request, res: Response

    ): Promise<any> {
        const { _data: data, body } = req;
        // const User=   _data
        // console.log({ User });

        const { title, slug, status } = body;
        const checkSlug = await this.helperSlugService.checkSlug(slug || data.slug, this.service)


        if (checkSlug.find && !checkSlug.find._id.equals(data._id)) {
            throw new InternalServerErrorException({ message: isUsedError({ key: 'slug' }) });
        }

        try {
            await this.service.updateOneById(data._id,
                {
                    title,
                    status,
                    slug: checkSlug.slug
                });
        } catch (err: any) {
            throw new InternalServerErrorException({ message: serverError() });
        }
        return {
            _id: data._id,
        };

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