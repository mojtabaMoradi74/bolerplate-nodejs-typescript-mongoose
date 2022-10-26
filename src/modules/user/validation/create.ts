import { body } from "express-validator";
import { STATUS } from "src/enum";
import { requireError } from "src/utils/error-converter";
import { isInEnum } from "src/app/validation/enum";

const create = [
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

    body("password")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'password' }))
        .matches(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${8},}$`),

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
export default create