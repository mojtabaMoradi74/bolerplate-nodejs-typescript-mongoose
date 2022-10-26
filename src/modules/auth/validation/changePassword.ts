import { body } from "express-validator";
import { requireError } from "src/utils/error-converter";

const changePasswordValidation = [
    body("newPassword").trim().notEmpty().withMessage(requireError({ key: 'newPassword' })),
    body("oldPassword").trim().notEmpty().withMessage(requireError({ key: 'oldPassword' })),
];
export default changePasswordValidation