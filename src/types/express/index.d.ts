import express from "express";
import RequestInterface from "src/utils/helper/request/request.interface";

declare global {
    namespace Express {
        interface Request {
            user: Record<string, any>
            _data: Record<string, any> | any
            t: Function,
            tokenDecrypted: any,
            tokenEncrypted: any,
            headers: {
                authorization: string
            }
            query: {
                skip: any
            }
            files: Array
        }


    }
    interface Error {
        status: number
        errors: Record<string, any>
    }
}


declare module 'express-serve-static-core' {
    interface Response {
        error: (code: number, message: string) => Response;
        success: (code: number, message: string, result: any) => Response
    }
}