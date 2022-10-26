import { body } from "express-validator";
import { STATUS } from "../../../enum";
import { isInEnum } from "../../../app/validation/enum";
import { requireError } from "src/utils/error-converter";

const edit = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("slug").trim().notEmpty().withMessage(requireError({ key: 'slug' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(requireError({ key: 'status' })),
];
export default edit