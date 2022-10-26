import { IBlogCategoryRepository } from "..";
import { DataNotFoundError } from "../../../packages/errors/data-not-found-error";
import { ILogger } from "../../../packages/logger";
import { BlogCategoryNotFound } from "../../../packages/messages";
import { BlogCategory, BlogCategoryAttrs, BlogCategoryDoc } from "../../entity";
import { List } from "../../utils/helper/request";
import { ErrorHandling, CalculateOffset, CalculateSort } from "../../utils";

export class BlogCategoryRepository implements IBlogCategoryRepository {
    constructor(private readonly logger: ILogger) { }
    section: string = "repository.blog-category";
    async Create(bc: BlogCategoryAttrs): Promise<void> {
        try {
            await BlogCategory.build(bc).save();
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.create`);
        }
    }
    async Edit(id: string, bc: BlogCategoryAttrs): Promise<void> {
        let oldBlogCategory: BlogCategoryDoc | null;
        try {
            oldBlogCategory = await BlogCategory.findOneAndUpdate({ _id: id }, bc, {
                runValidators: true,
                context: "query",
            });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.edit`);
        }
        if (!oldBlogCategory) {
            throw new DataNotFoundError(BlogCategoryNotFound);
        }
    }
    async Delete(id: string): Promise<void> {
        try {
            await BlogCategory.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.delete`);
        }
    }
    async ById(id: string): Promise<BlogCategoryDoc> {
        let bc: BlogCategoryDoc | null;
        try {
            bc = await BlogCategory.findOne({ _id: id, deletedAt: { $exists: false } });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.by-id`);
        }
        if (bc === null) {
            throw new DataNotFoundError(BlogCategoryNotFound);
        }
        return bc;
    }
    async List(params: List): Promise<BlogCategoryDoc[]> {
        let bc: BlogCategoryDoc[] = [];
        try {
            bc = await BlogCategory.find({
                deletedAt: { $exists: false },
                ...(params.search && { title: { $regex: params.search, $options: "i" } }),
            })
                .skip(CalculateOffset(params.page, params.limit))
                .limit(params.limit)
                .sort({ createdAt: CalculateSort(params.sort) });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.list`);
        }
        return bc;
    }
}
