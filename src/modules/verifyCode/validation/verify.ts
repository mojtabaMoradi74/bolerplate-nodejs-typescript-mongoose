import { body } from "express-validator";
import { requireError } from "src/utils/error-converter";

const verify = [
    body("email")
        .trim()
        .isEmail()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage(requireError({ key: 'email' })),
    body("code")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'code' })),
];
export default verify