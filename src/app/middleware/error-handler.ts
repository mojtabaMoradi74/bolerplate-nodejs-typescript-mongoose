import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

import { MongooseValidationError } from "packages/errors/mongoose-validation-error";
import { logger } from "packages/logger/winston";
import { CustomError } from "../../../packages/errors/custom-error";
import { SomethingWentWrong } from "../../../packages/messages";

const errorConverter = (err: Error, req: Request) => {
    const { key, ns, properties }: any = err.message;

    console.log({ err, key, ns, properties });

    let variable: Record<string, any> = {}

    for (const x in properties) {
        // console.log({ x, properties });

        const property = properties[x];
        // console.log({ property }, x);

        variable[x] = req.t(property.key, { ns: property.ns })

    }

    // console.log({ variable });

    const msg = req.t(key, { ns, ...variable })
    // console.log({ msg });

    err.message = msg;

    return err;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    const { errors } = err;
    // console.log(err, errors);
    // console.log(req);



    // const child = logger.child({
    //     userID: "ou04iu22i",
    //   });

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            errors: errors?.map((error: Record<string, any>) => {
                const { key, ns, properties } = error.msg;
                let variable: Record<string, any> = {}
                for (const x in properties) {
                    const property = properties[x];
                    variable[x] = req.t(property.key, { ns: property.ns })
                }
                const msg = req.t(key, { ns, ...variable })

                error.msg = msg
                return error;
            }) || [errorConverter(err, req)],

            timestamp: new Date().getTime(),
            path: req.originalUrl,
        });
    }
    if (err instanceof MongooseError.ValidationError) {
        logger.error(err.message, { function: req.originalUrl }
        );
        return new MongooseValidationError(err.errors);
    }
    if (err instanceof Error) logger.error(err.message, { function: req.originalUrl });

    res.status(500).send({
        errors: [{ message: req.t("serverError", { ns: "error" }) }],
        timestamp: new Date().getTime(),
        path: req.originalUrl,
    });
};
