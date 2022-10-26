import { body } from "express-validator";
import { STATUS } from "src/enum";
import { invalidError, requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    // body("slug").trim().withMessage(requireError({ key: 'slug' })),
    body("status").trim().notEmpty().withMessage(requireError({ key: 'status' })).custom(isInEnum(STATUS, body.prototype)).withMessage(invalidError({ key: 'status' })),

];
export default create