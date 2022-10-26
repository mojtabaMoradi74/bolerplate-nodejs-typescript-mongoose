import { body } from "express-validator";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)),
];
export default create