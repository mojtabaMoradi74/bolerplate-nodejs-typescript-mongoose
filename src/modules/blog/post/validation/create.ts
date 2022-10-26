import { body } from "express-validator";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("subtitle").trim().notEmpty().withMessage(requireError({ key: 'subtitle' })),
    body("shortDescription").trim().notEmpty().withMessage(requireError({ key: 'shortDescription' })),
    body("description").trim().notEmpty().withMessage(requireError({ key: 'description' })),
    body("categories").isArray().notEmpty().withMessage(requireError({ key: 'categories' })),
    body("tags").isArray().notEmpty().withMessage(requireError({ key: 'tags' })),
    // body("image").trim().notEmpty().withMessage(requireError({ key: 'image' })),
    body("status").trim().optional().custom(isInEnum(STATUS, body.prototype)),
];
export default create