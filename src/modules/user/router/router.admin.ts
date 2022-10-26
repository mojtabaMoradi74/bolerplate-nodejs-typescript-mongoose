import express from "express";
import { validationRequest } from "../../../app/middleware/validation-error";
import Controller from "../controller/controller.admin";
import Service from "../service/service.admin";
import validation from "../validation";
import BulkService from "../service/bulk.service";
import RoleService from "../../role/service/service.admin";
import MediaGalleryService from "../../media/gallery/service/service.admin";
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import AuthService from "../../auth/service/service.admin";
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import globalValidationParam from "src/utils/helper/request/request.validation";
import GlobalGuard from "src/utils/guard";
import constant from "../constant"
import UserAdminCommonController from "../controller/controller.admin.common";
const UserAdminRouter = (): express.IRouter => {

    // -------------------------------------------------------------------------------- Service

    // ---------------------------------------- Helper

    const helperStringService = new HelperStringService();
    const helperHashService = new HelperHashService();
    const helperDateService = new HelperDateService();

    // ----------------------------------------

    const service = new Service(helperStringService);
    const roleService = new RoleService();
    const mediaGalleryService = new MediaGalleryService();
    const authService = new AuthService(helperHashService, helperDateService);
    const bulkService = new BulkService();

    // -------------------------------------------------------------------------------- Controller

    const controller = new Controller(
        service,
        bulkService,
        roleService,
        mediaGalleryService,
        authService,
    );

    // ---------------------------------------- Common

    const commonController = new UserAdminCommonController();

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

    router.get(
        "/current",
        validationRequest,
        commonController.Profile.bind(controller)
    );

    // ---------------------------------------- PUT

    router.put(
        "/change-status",
        validation.changeStatus,
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
export default UserAdminRouter

