import { body } from "express-validator";
import { IdBodyValidation } from ".";
import { SlugRequired, TitleRequired } from "../../../packages/messages";
export const blogCategoryValidation = [
    body("title").trim().notEmpty().withMessage(TitleRequired),
    body("slug").trim().notEmpty().withMessage(SlugRequired),
];
export const blogCategoryEditValidation = [...IdBodyValidation, ...blogCategoryValidation];
