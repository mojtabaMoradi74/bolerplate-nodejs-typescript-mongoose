import { body } from "express-validator";
import { STATUS } from "src/enum";
import { invalidError, requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const changeStatus = [
    body("data").isArray().notEmpty().withMessage(requireError({ key: 'data' })),
    body("status").trim().notEmpty().withMessage(requireError({ key: 'status' })).custom(isInEnum(STATUS, body.prototype)).withMessage(invalidError({ key: 'status' })),
];
export default changeStatus