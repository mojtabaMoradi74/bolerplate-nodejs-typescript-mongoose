import mongoose from "mongoose";



declare namespace BlogCategoryInterface {

    export interface IDocument {
        _id: mongoose.Types.ObjectId,
        title:
        String,
        subtitle: String,
        slug: String
        shortDescription: String
        description: String,
        tags: string[],
        categories: string[],
        views: string,
        likes: string,
        image: string,
        createdBy: string,
        updatedBy: string,
        status: string,
    }

    export type ICheckExist = boolean

    export interface ICreate extends Omit<IDocument, '_id' | 'updatedBy' | 'views' | 'likes' | 'updatedBy'> {
    }

    export interface IUpdate extends Omit<IDocument, '_id' | 'createdBy' | 'posts'> {
    }
}
export default BlogCategoryInterface
