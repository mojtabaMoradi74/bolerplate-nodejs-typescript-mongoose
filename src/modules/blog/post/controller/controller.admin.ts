import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import { ActiveError, notFoundError, isUsedError } from "src/utils/error-converter";
import { NotFoundException } from "packages/errors/NotFoundException";
import mongoose, { Types } from 'mongoose';
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";
import BlogCategoryBulkService from "../../category/service/bulk.service";
import MediaGalleryService from "src/modules/media/gallery/service/service.admin";
import BlogCategoryInterface from "../../category/interface";
import MediaGalleryInterface from "src/modules/media/gallery/interface";
import BlogTagService from "../../tag/service/service.admin";
import BlogTagBulkService from "../../tag/service/bulk.service";
import BlogTagInterface from "../../tag/interface";
import BlogCategoryService from "../../category/service/service.admin";

class BlogCategoryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService,
        private readonly blogTagService: BlogTagService,
        private readonly blogTagBulkService: BlogTagBulkService,
        private readonly blogCategoryService: BlogCategoryService,
        private readonly blogCategoryBulkService: BlogCategoryBulkService,
        private readonly helperSlugService: HelperSlugService,
        private readonly mediaGalleryService: MediaGalleryService,
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


        try {

            const BlogCategory: Interface.IDocument[] = await this.service.findAll(find, {
                limit,
                skip,
                sort,
                populate: {
                    image: true,
                    categories: true,
                    tags: true,

                }
            });

            const count: number = await this.service.getTotal(find);

            const result = BlogCategory;

            res.status(200).send({
                count,
                result,
            });

        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }

    }


    async Create(req: Request, res: Response): Promise<any> {
        const { body } = req;
        const checkSlug = await this.helperSlugService.checkSlug(body.slug || body.title, this.service)

        if (checkSlug.find) {
            throw new InternalServerErrorException(isUsedError({ key: 'slug' }));
        }


        for (const category of body.categories) {
            const checkCategory: BlogCategoryInterface.IDocument = await this.blogCategoryService.findOneById(category);
            console.log({ checkCategory });

            if (!checkCategory) {
                throw new NotFoundException(
                    notFoundError({ key: 'blog.category' }),
                    category
                );
            } else if (checkCategory.status !== STATUS.ACTIVE) {
                throw new NotFoundException(
                    ActiveError({ key: 'blog.category' }),
                    category
                );
            }
        }


        for (const tag of body.tags) {

            const checkTag: BlogTagInterface.IDocument = await this.blogTagService.findOneById(tag);
            // console.log({ checkTag }, tag);

            if (!checkTag) {
                throw new NotFoundException(notFoundError({ key: 'blog-tag' }), tag);
            } else if (checkTag.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'blog-tag' }), tag);

            }

        }

        if (body.image) {

            const findImage: MediaGalleryInterface.IDocument = await this.mediaGalleryService.findOneById(body.image);

            if (!findImage) {
                throw new NotFoundException(notFoundError({ key: 'gallery' }));
            } else if (findImage.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'gallery' }));
            }

        }

        try {

            const create = await this.service.create({
                title: body.title,
                subtitle: body.subtitle,
                slug: checkSlug.slug,
                description: body.description,
                shortDescription: body.shortDescription,
                categories: body.categories,
                tags: body.tags,
                ...(body.image && { image: body.image }),
                status: body.status || STATUS.ACTIVE,
                createdBy: req.user._id
            });
            console.log({ create });

            const set = { $addToSet: { posts: { $each: [create._id] } } }

            if (body.image) {
                // const set = { $push: { posts: new mongoose.Types.ObjectId(create._id) } }
                this.mediaGalleryService.update(body.image, set);
            }


            const tagIds = { _id: { $in: body.tags.map((x: string) => new mongoose.Types.ObjectId(x)) } }
            const categoryIds = { _id: { $in: body.categories.map((x: string) => new mongoose.Types.ObjectId(x)) } }
            // const set = { $push: { posts: new mongoose.Types.ObjectId(create._id) } }

            this.blogTagBulkService.updateMany(tagIds, set);
            this.blogCategoryBulkService.updateMany(categoryIds, set);


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
        const { body, _data } = req

        let checkSlug = body.slug;


        if (_data.slug !== body.slug) {
            checkSlug = await this.helperSlugService.checkSlug(body.slug || body.title, this.service)
            console.log(checkSlug.find, _data._id);
            if (checkSlug.find && !(checkSlug.find._id).equals((_data._id))) {
                throw new InternalServerErrorException(isUsedError({ key: "slug" }));
            }
        }


        for (const category of body.categories) {

            const checkCategory: BlogCategoryInterface.IDocument = await this.blogCategoryService.findOneById(category);

            if (!checkCategory) {
                throw new NotFoundException(notFoundError({ key: 'blog-category' }), category)

            } else if (checkCategory.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'blog-category' }), category)

            }

        }


        for (const tag of body.tags) {

            const checkTag: BlogTagInterface.IDocument = await this.blogTagService.findOneById(tag);
            // console.log({ checkTag }, tag);

            if (!checkTag) {
                throw new NotFoundException(notFoundError({ key: 'blog-tag' }), tag);
            } else if (checkTag.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'blog-tag' }), tag);

            }

        }

        if (body.image) {

            const findImage: MediaGalleryInterface.IDocument = await this.mediaGalleryService.findOneById(body.image);

            if (!findImage) {
                throw new NotFoundException(notFoundError({ key: 'gallery' }));
            } else if (findImage.status !== STATUS.ACTIVE) {
                throw new NotFoundException(ActiveError({ key: 'gallery' }));
            }

        }

        try {

            const updateOneById = await this.service.updateOneById(_data._id,
                {
                    title: body.title,
                    subtitle: body.subtitle,
                    description: body.description,
                    shortDescription: body.shortDescription,
                    slug: checkSlug.slug,
                    categories: body.categories,
                    tags: body.tags,
                    ...(body.status && { status: body.status }),
                    image: body.image,
                    updatedBy: req.user._id
                }
            );

            const tagIds = { _id: { $in: body.tags.map((x: string) => new mongoose.Types.ObjectId(x)) } }
            const categoryIds = { _id: { $in: body.categories.map((x: string) => new mongoose.Types.ObjectId(x)) } }
            const set = { $addToSet: { posts: { $each: [updateOneById._id] } } }
            this.blogTagBulkService.updateMany(tagIds, set);
            this.blogCategoryBulkService.updateMany(categoryIds, set);

            if (body.image) {
                // const set = { $push: { posts: new mongoose.Types.ObjectId(create._id) } }
                this.mediaGalleryService.update(body.image, set);
            }
            res.status(200).send(updateOneById)

        } catch (error: any) {

            throw new InternalServerErrorException(error.message);
        }

    }


    async Delete(req: Request, res: Response): Promise<void> {
        const { _data, } = req;
        try {
            await this.service.deleteOneById(_data._id);
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
        res.status(200).send(_data);
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