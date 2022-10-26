import { body } from "express-validator";
import { isInEnum } from "src/app/validation/enum";
import { STATUS } from "src/enum";

import { requireError } from "src/utils/error-converter";

const update = [
    body("title").trim().notEmpty().withMessage(requireError({ key: 'title' })),
    body("folder").trim().notEmpty().withMessage(requireError({ key: 'folder' })),
    body("status").trim().custom(isInEnum(STATUS, body.prototype)),
];
export default update