export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message?: any) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message?: any; field?: string; data?: any }[];
}
