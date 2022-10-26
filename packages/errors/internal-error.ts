import { CustomError } from "./custom-error";
import { SomethingWentWrong } from "../messages";

export class InternalError extends CustomError {
    statusCode = 500;

    constructor(message: string = SomethingWentWrong) {
        super(message);

        Object.setPrototypeOf(this, InternalError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
