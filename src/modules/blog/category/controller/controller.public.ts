import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";


class BlogCategoryPublicController {
    constructor(
        private readonly service: Service,
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


    async GetBySlug(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }


}

export default BlogCategoryPublicController