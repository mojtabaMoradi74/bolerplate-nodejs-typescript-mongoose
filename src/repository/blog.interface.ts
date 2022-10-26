import { BlogAttrs, BlogDoc } from "../entity";
import { BlogCategoryAttrs, BlogCategoryDoc } from "../entity/blog-category";
import { List } from "../utils/helper/request";

export interface IBlogCategoryRepository {
    Create(b: BlogCategoryAttrs): Promise<void>;
    Edit(id: string, b: BlogCategoryAttrs): Promise<void>;
    Delete(id: string): Promise<void>;
    ById(id: string): Promise<BlogCategoryDoc>;
    List(params: List): Promise<BlogCategoryDoc[]>;
}
export interface IBlogRepository {
    Create(b: BlogAttrs): Promise<void>;
    Edit(id: string, b: BlogAttrs): Promise<void>;
    Delete(id: string): Promise<void>;
    ById(id: string): Promise<BlogDoc>;
    List(params: List): Promise<BlogDoc[]>;
}
