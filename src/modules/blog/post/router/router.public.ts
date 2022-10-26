import express from "express";
import Controller from "../controller/controller.public";
import Service from "../service/service.admin";
import { validationRequest } from "src/app/middleware/validation-error";
import globalValidationParam from "src/utils/helper/request/request.validation";
import GlobalGuard from "src/utils/guard";
import constant from "../constant";

const PostPublicRouter = (): express.IRouter => {

    const router = express.Router();
    const service = new Service();
    const controller = new Controller(
        service,
    );

    const guard = new GlobalGuard(service, constant);

    router.get(
        "/get/:id",
        globalValidationParam.idParamValidation,
        validationRequest,
        guard.PutToRequestSlugGuard.bind(guard),
        guard.NotFound.bind(guard),
        guard.ActiveStatusGuard.bind(guard),
        controller.GetBySlug.bind(controller)
    );

    router.get(
        "/list",
        globalValidationParam.listQueryValidation,
        validationRequest,
        controller.List.bind(controller)
    );

    return router;
};
export default PostPublicRouter