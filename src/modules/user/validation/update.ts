import { body } from "express-validator";
import { STATUS } from "../../../enum";
import { isInEnum } from "../../../app/validation/enum";
import { requireError } from "src/utils/error-converter";

const edit = [
    body("email")
        .trim()
        .isEmail()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage(requireError({ key: 'email' })),

    body("firstName")
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 30 })
        .withMessage(requireError({ key: 'firstName' })),

    body("lastName")
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 30 })
        .withMessage(requireError({ key: 'lastName' })),

    body("mobileNumber")
        .trim()
        .notEmpty()
        .isLength({ min: 10, max: 14 })
        .withMessage(requireError({ key: 'mobileNumber' })),

    body("role")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'role' }))
    ,

    body("type")
        .trim()
        // .custom(isInEnum(STATUS, body.prototype))
        .optional()
    // .withMessage(requireError({ key: 'type' }))
    ,

    body("status")
        .trim()
        .optional()
        .custom(isInEnum(STATUS, body.prototype))
    // .notEmpty().withMessage(requireError({ key: 'status' }))
    ,
];
export default edit