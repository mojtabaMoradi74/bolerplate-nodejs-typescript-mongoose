import express from "express";
import Controller from "../controller/controller.admin";
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";

import validation from "../validation";
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";
import { validationRequest } from "src/app/middleware/validation-error";
import GlobalGuard from "src/utils/guard";
import constant from "../constant";
import globalValidationParam from "src/utils/helper/request/request.validation";
import { IImportGlobalService } from "src/app/routes/interface";


const BlogCategoryAdminRouter = (): express.IRouter => {
    const router = express.Router();
    // ---------------------------------------------------------------------------------------- Service
    const helperSlugService = new HelperSlugService();
    // --------------------------------------------
    const service = new Service();
    const bulkService = new BulkService();
    // ---------------------------------------------------------------------------------------- Controller
    const controller = new Controller(
        service,
        bulkService,
        helperSlugService,
    );
    // ----------------------------------------------------------------------------------------  Guard
    const guard = new GlobalGuard(service, constant);

    // ----------------------------------------------------------------------------------------  Router
    router.post(
        "/create",
        validation.create,
        validationRequest,
        controller.Create.bind(controller)
    );
    router.put(
        "/update/:id",
        validation.update,
        validationRequest,
        guard.PutToRequestByIdGuard.bind(guard),
        guard.NotFound.bind(guard),
        guard.ActiveStatusGuard.bind(guard),
        controller.Update.bind(controller)
    );
    router.delete(
        "/delete/:id",
        globalValidationParam.idParamValidation,
        validationRequest,
        guard.PutToRequestByIdGuard.bind(guard),
        guard.NotFound.bind(guard),
        controller.ChangeStatus.bind(controller)
    );
    router.get(
        "/get/:id",
        globalValidationParam.idParamValidation,
        validationRequest,
        guard.PutToRequestByIdGuard.bind(guard),
        guard.NotFound.bind(guard),
        guard.ActiveStatusGuard.bind(guard),
        controller.GetById.bind(controller)
    );
    router.get(
        "/list",
        globalValidationParam.listQueryValidation,
        validationRequest,
        controller.List.bind(controller)
    );
    router.put(
        "/change-status",
        globalValidationParam.changeStatus,
        validationRequest,
        guard.PutToRequestMultiGuard.bind(guard),
        guard.NotFound.bind(guard),
        controller.ChangeStatus.bind(controller)
    );

    return router;
}
export default BlogCategoryAdminRouter