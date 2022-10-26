import { CustomError } from "./custom-error";

export class InternalServerErrorException extends CustomError {
    statusCode = 500;

    constructor(public message: any) {
        super(message);

        Object.setPrototypeOf(this, InternalServerErrorException.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
