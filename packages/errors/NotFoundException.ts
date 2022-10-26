import { CustomError } from "./custom-error";

export class NotFoundException extends CustomError {
    statusCode = 400;

    constructor(public message: any, public data?: any) {
        super(message);

        Object.setPrototypeOf(this, NotFoundException.prototype);
    }

    serializeErrors() {
        return [{ message: this.message, data: this.data }];
    }
}
