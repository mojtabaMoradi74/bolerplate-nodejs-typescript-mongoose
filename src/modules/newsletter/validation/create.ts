import { body } from "express-validator";
import { invalidError, requireError } from "src/utils/error-converter";

const create = [
    body("email").trim().isEmail().withMessage(invalidError({ key: 'email' })).notEmpty().withMessage(requireError({ key: 'email' })),
    // body("status").trim().custom(isInEnum(STATUS, body.prototype)),
];
export default create