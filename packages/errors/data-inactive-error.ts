import { CustomError } from "./custom-error";

export class DataInactiveError extends CustomError {
    statusCode = 503;

    constructor(public message: any) {
        super(message);

        Object.setPrototypeOf(this, DataInactiveError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
