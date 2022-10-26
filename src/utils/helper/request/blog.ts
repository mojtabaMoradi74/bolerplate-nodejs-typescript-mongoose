import { Id } from ".";

export interface BlogCategory {
    title: string;
    slug: string;
}
export interface EditBlogCategory extends BlogCategory, Id {}

export interface Blog {
    title: string;
    slug: string;
    description: string;

    text?: string;
    thumbnail?: string;
    image?: string;
    video?: string;

    isHome?: boolean;
    recommended?: boolean;

    type?: string;
    status?: string;

    category: string;
}
export interface EditBlog extends Blog, Id {}
