import { STATUS } from "src/enum";

declare namespace TokenInterface {

    export interface IDocument {
        refreshToken: String,
        accessToken: String,
        user: string,
        device: String,
        loginDate: Date,
        logoutDate: Date,
        status: string
    }

    export interface ICreate {
        refreshToken: string;
        accessToken: string;
        user: string;
        device: string;
        loginDate: string;
        logoutDate?: string;
        status?: string;
    }


    export interface ICheckExist {
        title: string;
        slug?: string;
    }

    export interface IUpdate {
        refreshToken: string;
        accessToken: string;
        user: string;
        device: string;
        loginDate: string;
        logoutDate?: string;
        status?: string;

    }
}

export default TokenInterface
