import express from "express";
import { validationRequest } from "../../app/middleware/validation-error";
import Controller from "./controller/controller.admin";
import Guard from "./guard";
import Service from "./service/service.admin";
import BulkService from "./service/bulk.service";

import validation from "./validation";
import { logger } from 'packages/logger/winston';
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";
// import { IdParamValidation, ListQueryValidation } from "src/utils/helper/request/request.validation";

const TokenRouter = (): express.IRouter => {


    // ---------------------------------------- Helper
    const helperHashService = new HelperHashService();


    const router = express.Router();
    const service = new Service(helperHashService);
    const bulkService = new BulkService();

    const controller = new Controller(
        service,
        bulkService
    );

    const guard = new Guard(service, logger);

    router.post(
        "/create",
        validation.create,
        validationRequest,
        controller.Create.bind(controller)
    );
    // router.put(
    //     "/edit/:id",
    //     validation.edit,
    //     validationRequest,
    //     guard.PutToRequestByIdGuard.bind(guard),
    //     guard.NotFound.bind(guard),
    //     guard.ActiveStatusGuard.bind(guard),
    //     controller.Update.bind(controller)
    // );
    router.delete(
        "/delete/:id",
        // IdParamValidation,
        validationRequest,
        guard.PutToRequestByIdGuard.bind(guard),
        guard.NotFound.bind(guard),
        controller.ChangeStatus.bind(controller)
    );
    router.get(
        "/get/:id",
        // IdParamValidation,
        validationRequest,
        guard.PutToRequestByIdGuard.bind(guard),
        guard.NotFound.bind(guard),
        guard.ActiveStatusGuard.bind(guard),
        controller.GetById.bind(controller)
    );
    router.get(
        "/list",
        // ListQueryValidation,
        validationRequest,
        controller.List.bind(controller)
    );

    return router;
};
export default TokenRouter