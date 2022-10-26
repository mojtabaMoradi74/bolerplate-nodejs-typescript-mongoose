import express from "express";
import Controller from "./controller/controller.admin";
import Service from "./service/service.admin";
import BulkService from "./service/bulk.service";
import validation from "./validation";
import { validationRequest } from "src/app/middleware/validation-error";
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";
import globalValidationParam from "src/utils/helper/request/request.validation";
import GlobalGuard from "src/utils/guard";
import constant from "./constant"

const MediaFolderRouter = (): express.IRouter => {


    // -------------------------------------------------------------------------------- Service

    // ---------------------------------------- Helper

    const bulkService = new BulkService();
    const helperSlugService = new HelperSlugService();

    // ----------------------------------------

    const service = new Service();

    // -------------------------------------------------------------------------------- Controller

    const controller = new Controller(
        service,
        bulkService,
        helperSlugService
    );


    // -------------------------------------------------------------------------------- Guard

    const guard = new GlobalGuard(service, constant);
    const PutToRequestByIdGuard = guard.PutToRequestByIdGuard.bind(guard);
    const NotFound = guard.NotFound.bind(guard);
    const ActiveStatusGuard = guard.ActiveStatusGuard.bind(guard);


    // -------------------------------------------------------------------------------- Router

    const router = express.Router();

    // ---------------------------------------- POST

    router.post(
        "/create",
        validation.create,
        validationRequest,
        controller.Create.bind(controller)
    );

    // ---------------------------------------- DELETE

    router.delete(
        "/delete/:id",
        globalValidationParam.idParamValidation,
        validationRequest,
        PutToRequestByIdGuard,
        NotFound,
        controller.ChangeStatus.bind(controller)
    );

    // ---------------------------------------- GET

    router.get(
        "/get/:id",
        globalValidationParam.idParamValidation,
        validationRequest,
        PutToRequestByIdGuard,
        NotFound,
        ActiveStatusGuard,
        controller.GetById.bind(controller)
    );


    router.get(
        "/list",
        globalValidationParam.listQueryValidation,
        validationRequest,
        controller.List.bind(controller)
    );


    // ---------------------------------------- PUT

    router.put(
        "/change-status",
        globalValidationParam.changeStatus,
        validationRequest,
        guard.PutToRequestMultiGuard.bind(guard),
        guard.NotFound.bind(guard),
        controller.ChangeStatus.bind(controller)
    );

    router.put(
        "/update/:id",
        validation.update,
        validationRequest,
        PutToRequestByIdGuard,
        NotFound,
        ActiveStatusGuard,
        controller.Update.bind(controller)
    );

    return router;
};
export default MediaFolderRouter