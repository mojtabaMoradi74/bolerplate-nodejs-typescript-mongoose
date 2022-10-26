import { BlogAttrs, BlogDoc } from "../entity";
import { BlogCategoryAttrs, BlogCategoryDoc } from "../entity/blog-category";
import { List } from "../utils/helper/request";

export interface IBlogCategoryService {
    Create(bc: BlogCategoryAttrs): Promise<void>;
    Edit(id: string, bc: BlogCategoryAttrs): Promise<void>;
    Delete(id: string): Promise<void>;
    ById(id: string): Promise<BlogCategoryDoc>;
    List(params: List): Promise<BlogCategoryDoc[]>;
}
export interface IBlogService {
    Create(bc: BlogAttrs): Promise<void>;
    Edit(id: string, bc: BlogAttrs): Promise<void>;
    Delete(id: string): Promise<void>;
    ById(id: string): Promise<BlogDoc>;
    List(params: List): Promise<BlogDoc[]>;
}
