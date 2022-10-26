import express from "express";
import Controller from "../controller/controller.public";
import Service from "../service/service.admin";
import { validationRequest } from "src/app/middleware/validation-error";
import GlobalGuard from "src/utils/guard";
import constant from "../constant";
import globalValidationParam from "src/utils/helper/request/request.validation";


const BlogCategoryAdminRouter = (): express.IRouter => {
    const router = express.Router();
    // ---------------------------------------------------------------------------------------- Service

    // --------------------------------------------
    const service = new Service();
    // ---------------------------------------------------------------------------------------- Controller
    const controller = new Controller(
        service,
    );
    // ----------------------------------------------------------------------------------------  Guard
    const guard = new GlobalGuard(service, constant);

    // ----------------------------------------------------------------------------------------  Router

    router.get(
        "/get/:slug",
        globalValidationParam.slugParamValidation,
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
}
export default BlogCategoryAdminRouter