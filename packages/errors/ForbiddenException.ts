import { CustomError } from "./custom-error";

export class ForbiddenException extends CustomError {
    statusCode = 403;

    constructor(public message: any) {
        super(message);

        Object.setPrototypeOf(this, ForbiddenException.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
