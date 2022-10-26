import { body } from "express-validator";
import { STATUS } from "../../../enum";
import { isInEnum } from "../../../app/validation/enum";
import { requireError } from "src/utils/error-converter";

const edit = [
    body("name").trim().notEmpty().withMessage(requireError({ key: 'name' })),
    body("permissions").isArray().notEmpty().withMessage(requireError({ key: 'permissions' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(requireError({ key: 'status' })),
];
export default edit