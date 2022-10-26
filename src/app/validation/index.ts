// import { body, param, query } from "express-validator";
// import { invalidError, requireError } from "src/utils/error-converter";


// export const IdBodyValidation = [
//     body("id")
//         .trim()
//         .notEmpty()
//         .withMessage(requireError({ key: 'id' }))
//         .isMongoId()
//         .withMessage(invalidError({ key: 'id' })),
// ];

// export const IdParamValidation = [
//     param("id")
//         .trim()
//         .notEmpty()
//         .withMessage(requireError({ key: 'id' }))
//         .isMongoId()
//         .withMessage(invalidError({ key: 'id' })),
// ];

// export const ListQueryValidation = [
//     query("sort")
//         .notEmpty()
//         .withMessage(requireError({ key: 'sort' })),
//     // .custom(isInEnum(Sort, query.prototype))
//     query("limit")
//         .trim()
//         .optional()
//         .withMessage(requireError({ key: 'limit' })),
//     query("page")
//         .trim()
//         .optional()
//         .withMessage(requireError({ key: 'page' })),
//     query("search").optional(),
// ];

// export * from "./blog-category";
// export * from "./blog";
