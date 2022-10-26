import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import { isUsedError } from "src/utils/error-converter";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";


class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService,
        private readonly helperSlugService: HelperSlugService,
    ) { }


    async List(req: Request, res: Response) {

        const { limit, sort, skip, search, status } = req.query as Record<string, any>;
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

        try {
            const BlogCategory: Interface.IDocument[] = await this.service.findAll(find, {
                limit,
                skip,
                sort,
            });
            const count: number = await this.service.getTotal(find);

            const result = BlogCategory;

            res.status(200).send({
                count,
                result,
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    async Create(req: Request, res: Response): Promise<any> {
        const { body } = req;
        const checkSlug = await this.helperSlugService.checkSlug(body.slug || body.title, this.service)

        if (checkSlug.find) {
            throw new InternalServerErrorException(isUsedError({ key: "slug" }));
        }

        try {
            const create = await this.service.create({
                title: body.title,
                slug: checkSlug.slug,
                status: body.status || STATUS.ACTIVE,
                createdBy: req.user?._id
            });


            res.status(200).send({
                _id: create._id,
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }



    }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }


    async Update(
        req: Request, res: Response
    ): Promise<any> {
        const { body, _data } = req
        const { title, slug, status } = body;

        let checkSlug = slug;

        if (_data.slug !== slug) {
            checkSlug = await this.helperSlugService.checkSlug(slug || _data.slug, this.service)
            if (checkSlug.find && !checkSlug.find._id.equals(_data._id)) {
                throw new InternalServerErrorException(isUsedError({ key: "slug" }));
            }
        }

        try {
            await this.service.updateOneById(_data._id,
                {
                    title,
                    ...(status && { status }),
                    slug: checkSlug.slug
                });

            res.status(200).send({
                _id: _data._id,
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }


    }


    async Delete(req: Request, res: Response): Promise<void> {
        const { _data } = req;
        try {
            await this.service.deleteOneById(_data._id);
            res.status(200).send({
                _id: _data._id,
            });

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async ChangeStatus(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const find = { _id: { $in: body.data } }
        const set = { $set: { status: body.status } }

        try {
            await this.bulkService.updateMany(find, set);
            res.status(200).send(body);
        } catch (error) {
            throw new InternalServerErrorException(error);

        }

    }


}

export default BlogCategoryController