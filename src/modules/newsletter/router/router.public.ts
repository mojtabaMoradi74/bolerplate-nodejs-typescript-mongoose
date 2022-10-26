import express from "express";
import { validationRequest } from "../../../app/middleware/validation-error";
import Controller from "../controller/controller.admin";
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import validation from "../validation";


const NewsletterRouter = (): express.IRouter => {

    const service = new Service();
    const bulkService = new BulkService();

    const controller = new Controller(
        service,
        bulkService
    );

    // -------------------------------------------------------------------------------- Router

    const router = express.Router();

    // ---------------------------------------- POST

    router.post(
        "/create",
        validation.create,
        validationRequest,
        controller.Create.bind(controller)
    );


    return router;
};
export default NewsletterRouter