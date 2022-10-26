import { IBlogRepository } from "..";
import { DataNotFoundError } from "../../../packages/errors/data-not-found-error";
import { ILogger } from "../../../packages/logger";
import { BlogNotFound } from "../../../packages/messages";
import { Blog, BlogAttrs, BlogDoc } from "../../entity";
import { List } from "../../utils/helper/request";
import { ErrorHandling, CalculateOffset, CalculateSort } from "../../utils";
//TODO add result and total
export class BlogRepository implements IBlogRepository {
    constructor(private readonly logger: ILogger) { }
    section: string = "repository.blog";
    async Create(bc: BlogAttrs): Promise<void> {
        try {
            await Blog.build(bc).save();
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.create`);
        }
    }
    async Edit(id: string, bc: BlogAttrs): Promise<void> {
        let oldBlog: BlogDoc | null;
        try {
            oldBlog = await Blog.findOneAndUpdate({ _id: id }, bc, {
                runValidators: true,
                context: "query",
            });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.edit`);
        }
        if (!oldBlog) {
            throw new DataNotFoundError(BlogNotFound);
        }
    }
    async Delete(id: string): Promise<void> {
        try {
            await Blog.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.delete`);
        }
    }
    async ById(id: string): Promise<BlogDoc> {
        let bc: BlogDoc | null;
        try {
            bc = await Blog.findOne({ _id: id, deletedAt: { $exists: false } });
        } catch (err) {
            throw ErrorHandling(err, this.logger, `${this.section}.by-id`);
        }
        if (bc === null) {
            throw new DataNotFoundError(BlogNotFound);
        }
        return bc;
    }
    async List(params: List): Promise<BlogDoc[]> {
        let bc: BlogDoc[] = [];
        try {
            bc = await Blog.find({
                deletedAt: { $exists: false },
                ...(params.search && {
                    title: { $regex: params.search, $options: "i" },
                    description: { $regex: params.search, $options: "i" },
                }),
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
