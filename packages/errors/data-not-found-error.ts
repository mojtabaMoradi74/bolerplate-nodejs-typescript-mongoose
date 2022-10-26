import { CustomError } from "./custom-error";

export class DataNotFoundError extends CustomError {
    statusCode = 404;

    constructor(public message: any, public result: any = false) {
        super(message);

        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message, result: this.result }];
    }
}