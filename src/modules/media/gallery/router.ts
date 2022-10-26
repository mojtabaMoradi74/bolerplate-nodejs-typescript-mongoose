import { AwsS3Service } from "../aws/service/aws.s3.service";
import MediaFolderService from "../folder/service/service.admin";
import Controller from "./controller/controller.admin";
import Service from "./service/service.admin";
import BulkService from "./service/bulk.service";
import validation from "./validation";
import { validationRequest } from "src/app/middleware/validation-error";
import globalValidationParam from "src/utils/helper/request/request.validation";
import GlobalGuard from "src/utils/guard";
import constant from "./constant"
import express from "express";
import HelperService from "./service/service.helper";

// import uploadMiddleware from "src/app/middleware/uploadMiddleware";

const MediaGalleryRouter = (): express.IRouter => {

    const service = new Service();
    const bulkService = new BulkService();
    const awsService = new AwsS3Service();
    const mediaFolderService = new MediaFolderService();
    const helperService = new HelperService();



    const controller = new Controller(
        service,
        bulkService,
        helperService,
        awsService,
        mediaFolderService,
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
        // validation.create,
        // validationRequest,
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
        // validation.update,
        // validationRequest,
        PutToRequestByIdGuard,
        NotFound,
        ActiveStatusGuard,
        controller.Update.bind(controller)
    );

    return router;
};
export default MediaGalleryRouter