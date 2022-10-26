import { Document } from "mongoose";


declare namespace MediaGalleryInterface {

    export interface IDocument extends Document {
        _id: string,
        title: string;
        path?: string;
        pathWithFilename?: string;
        url: string;
        filename: string;
        fieldName: string
        mimetype: string;
        folder: String,
        users: String[],
        admins: String[],
        posts: String[],
        galleries: String[],
        createdBy: String,
        updatedBy: String,
        status: String,
    }

    export interface ICreate {
        title: string;
        path?: string;
        pathWithFilename?: string;
        url: string;
        filename: string;
        fieldName: string
        mimetype: string;
        createdBy?: string
        folder?: string;
        status?: string;
    }


    export type ICheckExist = boolean


    export interface IUpdate {
        title: string;
        path?: string;
        pathWithFilename?: string;
        url: string;
        filename: string;
        fieldName: string
        mimetype: string;
        updatedBy?: string
        folder?: string;
        status?: string;

    }

}

export default MediaGalleryInterface