import { Request, Response, NextFunction } from "express";
import { DataNotFoundError } from "packages/errors/data-not-found-error";
import { STATUS, STATUS_CODE_WITH_MESSAGE_OBJECT } from "../../../enum";
import { ErrorHandling } from "../../../utils";
import constant from "../constant";
import Service from "../service/service.admin";
import { ILogger } from 'packages/logger/index';
import { DataInactiveError } from 'packages/errors/data-inactive-error';
import { body } from "express-validator";
import { isInEnum } from "src/app/validation/enum";

class BlogCategoryValidation {

    constructor(
    ) {
    }

    private requireError = (title: string) => ({ key: 'isRequire', properties: { ns: "error", author: { key: title, ns: "translation" } } })

    Create = async (req: Request, res: Response, next: NextFunction) => {
        return (
            [
                body("title").trim().notEmpty().withMessage(this.requireError("title")),
                body("slug").trim().notEmpty().withMessage(this.requireError("slug")),
                body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(this.requireError("status")),
            ])
    }

    Edit = this.Create

}


export default BlogCategoryValidation;