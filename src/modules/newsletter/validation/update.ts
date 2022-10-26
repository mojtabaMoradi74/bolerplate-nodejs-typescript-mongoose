import { body } from "express-validator";
import { STATUS } from "src/enum";
import { invalidError, requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const update = [
    body("email").trim().isEmail().withMessage(invalidError({ key: 'email' })).notEmpty().withMessage(requireError({ key: 'email' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)),
];
export default update