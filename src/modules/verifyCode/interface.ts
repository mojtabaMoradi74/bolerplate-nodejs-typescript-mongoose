import mongoose, { Document, Types } from 'mongoose';


declare namespace IAuthInterface {

    export interface IDocument extends Document {
        _id: string,
        code: String,
        email: String,
        expired: Date,
        rememberMe: String,
        status: string;
    }

    export interface IApiPayload {
        _id: string;
        email: string;
        rememberMe: boolean;
        code: string;
    }

    export interface IApiDocument {
        _id: Types.ObjectId | string;
    }

    export interface IApiCreate {
        email: string;
        rememberMe: boolean;
        code: number;
    }


}

export default IAuthInterface


