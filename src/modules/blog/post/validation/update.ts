
import { body } from "express-validator";
import { isInEnum } from "src/app/validation/enum";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";

const update = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("slug").trim().notEmpty().withMessage(requireError({ key: 'slug' })),
    body("subtitle").trim().notEmpty().withMessage(requireError({ key: 'subtitle' })),
    body("shortDescription").trim().notEmpty().withMessage(requireError({ key: 'shortDescription' })),
    body("description").trim().notEmpty().withMessage(requireError({ key: 'description' })),
    body("categories").isArray().notEmpty().withMessage(requireError({ key: 'categories' })),
    body("tags").isArray().notEmpty().withMessage(requireError({ key: 'tags' })),
    body("image").trim().notEmpty().withMessage(requireError({ key: 'image' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)).notEmpty().withMessage(requireError({ key: 'status' })),
];
export default update