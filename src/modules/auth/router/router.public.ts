import express from "express";
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";
import { validationRequest } from "../../../app/middleware/validation-error";
import VerifyCodeApiService from "../../verifyCode/service/api.service";
import { IImportGlobalService } from "src/app/routes/interface";
import VerifyCodeService from "../../verifyCode/service/service";
import RoleService from "../../role/service/service.admin";
import Controller from "../controller/controller.admin";
import Service from "../service/service.admin";
import validation from "../validation";



const UserRouter = ({ jwtGuard, helperDateService, tokenService, userService }: IImportGlobalService): express.IRouter => {

    // -------------------------------------------------------------------------------- Service

    // ---------------------------------------- Helper
    const helperHashService = new HelperHashService();

    // ----------------------------------------
    const service = new Service(helperHashService, helperDateService);
    const roleService = new RoleService();
    const verifyCodeApiService = new VerifyCodeApiService()
    const verifyCodeService = new VerifyCodeService(verifyCodeApiService, helperDateService)

    // -------------------------------------------------------------------------------- Controller
    const controller = new Controller(
        userService,
        service,
        roleService,
        tokenService,
        verifyCodeService
    );

    // -------------------------------------------------------------------------------- Router
    const router = express.Router();

    router.post(
        "/login",
        validation.login,
        validationRequest,
        controller.Login.bind(controller)
    );

    router.post(
        "/sign-up",
        validation.signUp,
        validationRequest,
        controller.SignUp.bind(controller)
    );

    router.post(
        "/refresh",
        jwtGuard.ProtectedAdminRefreshToken,
        controller.Refresh.bind(controller)
    );

    router.patch(
        "/change-password",
        validation.changePassword,
        validationRequest,
        controller.ChangePassword.bind(controller)
    );


    return router;
};
export default UserRouter