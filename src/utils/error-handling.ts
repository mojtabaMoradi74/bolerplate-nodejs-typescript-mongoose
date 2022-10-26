import { CustomError } from "../../packages/errors/custom-error";
import { ILogger } from "../../packages/logger";
import { Error as MongooseError } from "mongoose";
import { MongooseValidationError } from "../../packages/errors/mongoose-validation-error";
import { InternalError } from "../../packages/errors/internal-error";

export const ErrorHandling = (err: unknown, logger: ILogger, func: string): CustomError => {
    if (err instanceof MongooseError.ValidationError) {
        logger.error(err.message, { function: func });
        return new MongooseValidationError(err.errors);
    }
    if (err instanceof Error) logger.error(err.message, { function: func });
    return new InternalError();
};
