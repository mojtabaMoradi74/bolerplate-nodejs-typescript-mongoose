import express from "express";
import { validationRequest } from "../../app/middleware/validation-error";
import Controller from "./controller/controller.admin";
import Service from "./service/service";
import ApiService from './service/api.service';
import validation from "./validation";
import { IImportGlobalService } from "src/app/routes/interface";

const VerifyCodeRouter = ({ helperStringService, helperDateService, tokenService, userService }: IImportGlobalService): express.IRouter => {

    const router = express.Router();



    const verifyCodeApiService = new ApiService()

    const service = new Service(
        verifyCodeApiService,
        helperDateService,
    );


    const controller = new Controller(
        userService,
        service,
        verifyCodeApiService,
        tokenService,
        helperStringService
    );

    router.post(
        "/verify",
        validation.verify,
        validationRequest,
        controller.VerifyCode.bind(controller)
    );


    router.get(
        "/send",
        validation.sendCode,
        validationRequest,
        controller.SendCode.bind(controller)
    );

    return router;
};
export default VerifyCodeRouter