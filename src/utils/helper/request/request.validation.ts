import { body, param, query } from "express-validator";
import { isInEnum } from "src/app/validation/enum";
import { STATUS } from "src/enum";
import { invalidError, requireError } from "src/utils/error-converter";


export const idBodyValidation = [
    body("id")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'id' }))
        .isMongoId()
        .withMessage(invalidError({ key: 'id' })),
];

export const idParamValidation = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'id' }))
        .isMongoId()
        .withMessage(invalidError({ key: 'id' })),
];

export const slugParamValidation = [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'slug' }))
];

export const listQueryValidation = [
    query("sort")
        .optional()
    // .withMessage(requireError({ key: 'sort' })),
    // .custom(isInEnum(Sort, query.prototype))
    ,
    query("limit")
        .optional()
    // .withMessage(requireError({ key: 'limit' }))
    ,
    query("page")
        .optional()
    // .withMessage(requireError({ key: 'page' }))
    ,
    query("search").optional(),
];


export const changeStatus = [
    body("data").isArray().notEmpty().withMessage(requireError({ key: 'data' })),
    body("status").trim().notEmpty().withMessage(requireError({ key: 'status' })).custom(isInEnum(STATUS, body.prototype)).withMessage(invalidError({ key: 'status' })),
];

const globalValidationParam = {
    idBodyValidation,
    idParamValidation,
    slugParamValidation,
    listQueryValidation,
    changeStatus
}

export default globalValidationParam