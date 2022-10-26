import mongoose from "mongoose";



declare namespace BlogCategoryInterface {

    export interface IDocument {
        _id: mongoose.Types.ObjectId,
        title: string,
        slug?: string,
        posts: string[],
        createdBy: string,
        updatedBy: string,
        status: String,
    }

    export type ICheckExist = boolean

    export interface ICreate extends Omit<IDocument, '_id' | 'updatedBy' | 'posts'> {

    }

    export interface IUpdate extends Omit<IDocument, '_id' | 'createdBy' | 'posts'> {
    }
}
export default BlogCategoryInterface
