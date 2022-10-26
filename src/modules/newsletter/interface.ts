import { Document, Types } from "mongoose";




declare namespace newsletterInterface {
    export interface IDocument extends Document {
        _id: string,
        email: string;
        status: String,
    }

    export interface ICreate {
        email: string;
        status?: string;
    }


    export type ICheckExist = boolean

    export interface IEdit {
        email: string;
        status: string;
    }

}
export default newsletterInterface
