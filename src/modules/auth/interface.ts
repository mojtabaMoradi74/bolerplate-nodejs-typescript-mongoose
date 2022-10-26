import mongoose from 'mongoose';


declare namespace IAuthInterface {

    export interface Password {
        salt: string;
        passwordHash: string;
        passwordExpired: Date;
    }

    export interface PayloadOptions {
        loginDate: Date;
    }

    export interface Payload {
        _id: string;
        key: string;
        name: string;
        description: string;
    }

    export interface IDocument extends Document {
        _id: mongoose.Types.ObjectId;
        secret: string;
        passphrase: string;
        encryptionKey: string;
        password: string
        status: string
        role: any
        type: string
    }

    export interface Create {
        name: string;
        description: string;
        key?: string;
        secret?: string;
        passphrase?: string;
        encryptionKey?: string;
    }

    export interface RequestHashedData {
        key: string;
        timestamp: number;
        hash: string;
    }



    export interface PayloadOptions {
        loginDate: Date;
    }

    export interface ApiPayload {
        _id: string;
        key: string;
        name: string;
        description: string;
    }


}

export default IAuthInterface


