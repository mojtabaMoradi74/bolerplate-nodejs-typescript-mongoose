import { body } from "express-validator";
import { IdBodyValidation } from ".";
import {
    CategoryRequired,
    DescriptionRequired,
    InvalidBlogStatus,
    InvalidBlogType,
    InvalidCategory,
    SlugRequired,
    TitleRequired,
} from "../../../packages/messages";
import { BlogStatus, BlogType } from "../../enum/blog";
import { isInEnum } from "./enum";
export const blogValidation = [
    body("title").trim().notEmpty().withMessage(TitleRequired),
    body("slug").trim().notEmpty().withMessage(SlugRequired),
    body("description").trim().notEmpty().withMessage(DescriptionRequired),
    body("category")
        .trim()
        .notEmpty()
        .withMessage(CategoryRequired)
        .isMongoId()
        .withMessage(InvalidCategory),
    //TODO Should Be file type
    body("text").optional().trim(),
    body("thumbnail").optional().trim(),
    body("image").optional().trim(),
    body("video").optional().trim(),

    //TODO is home???
    body("isHome").optional().isBoolean().withMessage("video must be boolean"),
    body("recommended").optional().isBoolean().withMessage("video must be boolean"),

    body("type").optional().custom(isInEnum(BlogType, body.prototype)).withMessage(InvalidBlogType),
    body("status")
        .optional()
        .custom(isInEnum(BlogStatus, body.prototype))
        .withMessage(InvalidBlogStatus),
];
export const blogEditValidation = [...IdBodyValidation, ...blogValidation];
