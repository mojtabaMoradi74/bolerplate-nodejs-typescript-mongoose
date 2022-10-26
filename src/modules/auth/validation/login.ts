import { body } from "express-validator";
import { requireError } from "src/utils/error-converter";

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage(requireError({ key: 'email' })),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(requireError({ key: 'password' }))
        .matches(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${8},}$`),

    body("rememberMe")
        .isBoolean()
        .withMessage(requireError({ key: 'rememberMe' })),

];
export default loginValidation