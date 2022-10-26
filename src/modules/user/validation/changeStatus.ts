import { body } from "express-validator";
import { invalidError, requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";
import { ENUM_USER_STATUS } from "../constant";

export const changeStatus = [
    body("data").isArray().notEmpty().withMessage(requireError({ key: 'data' })),
    body("status").trim().notEmpty().withMessage(requireError({ key: 'status' })).custom(isInEnum(ENUM_USER_STATUS, body.prototype)).withMessage(invalidError({ key: 'status' })),
];
export default changeStatus