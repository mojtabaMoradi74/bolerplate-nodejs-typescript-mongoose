import { Request, Response } from "express";
import { BlogCategoryAttrs } from "../../../../entity";
import { List } from "../../../../utils/helper/request";
import { EditBlogCategory } from "../../../../utils/helper/request/blog";
import { OkResponse } from "../../../../response";
import { IBlogCategoryService } from "../../../../services";

class BlogCategoryController {
    constructor(private readonly blogCategoryService: IBlogCategoryService) { }
    async Create(req: Request, res: Response) {
        await this.blogCategoryService.Create(req.body as BlogCategoryAttrs);
        res.status(200).send(OkResponse());
    }
    async Edit(req: Request, res: Response) {
        const attrs: EditBlogCategory = req.body;
        await this.blogCategoryService.Edit(attrs.id, attrs);
        res.status(200).send(OkResponse());
    }
    async Delete(req: Request, res: Response) {
        const { id } = req.params;
        await this.blogCategoryService.Delete(id);
        res.status(200).send(OkResponse());
    }
    async ById(req: Request, res: Response) {
        const { id } = req.params;
        const bc = await this.blogCategoryService.ById(id);
        res.status(200).send(bc);
    }
    async List(req: Request, res: Response) {
        const bc = await this.blogCategoryService.List(req.query as unknown as List);
        res.status(200).send(bc);
    }
}

