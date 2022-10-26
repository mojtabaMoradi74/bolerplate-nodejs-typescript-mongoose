import { body } from "express-validator";
import { requireError } from "src/utils/error-converter";

const sendCode = [
    body("email")
        .trim()
        .isEmail()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage(requireError({ key: 'email' })),
    body("rememberMe")
        .isBoolean()
        .withMessage(requireError({ key: 'rememberMe' })),

];
export default sendCode