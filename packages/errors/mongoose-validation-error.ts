import { CustomError } from "./custom-error";
import { Error } from "mongoose";
export class MongooseValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: { [path: string]: Error.ValidatorError | Error.CastError }) {
        super("Invalid mongoose parameters");

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, MongooseValidationError.prototype);
    }

    serializeErrors() {
        return Object.values(this.errors).map((err) => {
            return { message: err.message, field: err.path };
        });
    }
}
