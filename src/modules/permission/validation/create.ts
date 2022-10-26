import { body } from "express-validator";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("slug").trim().notEmpty().withMessage(requireError({ key: 'slug' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(requireError({ key: 'status' })),
];
export default create