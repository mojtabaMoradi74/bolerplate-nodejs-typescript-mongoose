import { body } from "express-validator";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
    body("name").trim().notEmpty().withMessage(requireError({ key: 'name' })),
    body("permissions").isArray().notEmpty().withMessage(requireError({ key: 'permissions' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(requireError({ key: 'status' })),
];
export default create