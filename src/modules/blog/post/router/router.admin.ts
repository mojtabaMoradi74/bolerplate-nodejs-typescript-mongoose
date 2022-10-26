import express from "express";
import Controller from "../controller/controller.admin";
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";

import validation from "../validation";
import { HelperSlugService } from "src/utils/helper/service/helper.slug.service";
import { validationRequest } from "src/app/middleware/validation-error";
import globalValidationParam from "src/utils/helper/request/request.validation";
import BlogTagService from "../../tag/service/service.admin";
import BlogTagBulkService from "../../tag/service/bulk.service";
import BlogCategoryBulkService from "../../category/service/bulk.service";
import MediaGalleryService from "src/modules/media/gallery/service/service.admin";
import GlobalGuard from "src/utils/guard";
import constant from "../constant";
import BlogCategoryService from "../../category/service/service.admin";

const PostAdminRouter = (): express.IRouter => {

    const router = express.Router();


    const service = new Service();
    const bulkService = new BulkService();
    const blogTagService = new BlogTagService();
    const blogTagBulkService = new BlogTagBulkService();
    const blogCategoryService = new BlogCategoryService();
    const blogCategoryBulkService = new BlogCategoryBulkService();
    const helperSlugService = new HelperSlugService();
    const mediaGalleryService = new MediaGalleryService();

    const controller = new Controller(
        service,
        bulkService,
        blogTagService,
        blogTagBulkService,
        blogCategoryService,
        blogCategoryBulkService,
        helperSlugService,
        mediaGalleryService,
    );

    const guard = new GlobalGuard(service, constant);


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
};
export default PostAdminRouter