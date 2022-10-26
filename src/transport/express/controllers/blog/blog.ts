import { Request, Response } from "express";
import { BlogAttrs } from "../../../../entity";
import { List } from "../../../../utils/helper/request";
import { EditBlog } from "../../../../utils/helper/request/blog";
import { OkResponse } from "../../../../response";
import { IBlogService } from "../../../../services";

//TODO we should use request modules in here
export class BlogController {
    constructor(private readonly blogService: IBlogService) { }
    async Create(req: Request, res: Response) {
        await this.blogService.Create(req.body as BlogAttrs);
        res.status(200).send(OkResponse());
    }
    async Edit(req: Request, res: Response) {
        const attrs: EditBlog = req.body;
        await this.blogService.Edit(attrs.id, attrs);
        res.status(200).send(OkResponse());
    }
    async Delete(req: Request, res: Response) {
        const { id } = req.params;
        await this.blogService.Delete(id);
        res.status(200).send(OkResponse());
    }
    async ById(req: Request, res: Response) {
        const { id } = req.params;
        const bc = await this.blogService.ById(id);
        res.status(200).send(bc);
    }
    async List(req: Request, res: Response) {
        const bc = await this.blogService.List(req.query as unknown as List);
        res.status(200).send(bc);
    }
}
