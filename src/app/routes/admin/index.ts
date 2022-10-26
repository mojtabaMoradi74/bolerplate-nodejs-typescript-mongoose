import express from "express";
import AuthRouter from "src/modules/auth/router/router.admin";
import VerifyCodeRouter from "src/modules/verifyCode/router";
import BlogCategoryRouter from "src/modules/blog/category/router/router.admin";
import BlogTagRouter from "src/modules/blog/tag/router/router.admin";
import BlogPostRouter from "src/modules/blog/post/router/router.admin";
import UserRouter from "src/modules/user/router/router.admin";
import RoleRouter from "src/modules/role/router/router.admin";
import JwtGuard from "src/modules/auth/guard/jwt";
import TokenService from "src/modules/token/service/service.admin";
import UserService from "src/modules/user/service/service.admin";
import { HelperEncryptionService } from "src/utils/helper/service/helper.encryption.service";
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import { IImportGlobalService } from "../interface";
import MediaFolderRouter from "src/modules/media/folder/router";
import MediaGalleryRouter from "src/modules/media/gallery/router";
import NewsletterRouter from "src/modules/newsletter/router/router.admin";
import { HelperHashService } from "src/utils/helper/service/helper.hash.service";



export const GetAdminRoutes = (): express.IRouter => {

    // -------------------------------------------------------------------------------- Service

    // ---------------------------------------- Helper Service
    const helperStringService = new HelperStringService();
    const helperDateService = new HelperDateService();
    const helperEncryptionService = new HelperEncryptionService();
    const helperHashService = new HelperHashService();
    // ----------------------------------------
    const tokenService = new TokenService(helperHashService);
    const userService = new UserService(helperStringService);

    // -------------------------------------------------------------------------------- Jwt Guard
    const jwtGuard = new JwtGuard(
        tokenService,
        userService,
        helperEncryptionService,
        helperDateService,
    );

    // -------------------------------------------------------------------------------- Variable
    const globalProp: IImportGlobalService = {
        helperStringService,
        helperDateService,
        helperEncryptionService,
        tokenService,
        userService,
        jwtGuard,
    }

    // -------------------------------------------------------------------------------- Express

    const app = express();

    // ----------------------------------------
    app.use(jwtGuard.FindToken)
    app.use("/auth", AuthRouter(globalProp))
    app.use("/code", VerifyCodeRouter(globalProp))
    // app.use("/token", TokenRouter())

    app.use(jwtGuard.ProtectedAdminAccessToken)
    app.use("/blog/category", BlogCategoryRouter())
    app.use("/blog/tag", BlogTagRouter())
    app.use("/blog/post", BlogPostRouter())
    app.use("/user", UserRouter())
    app.use("/role", RoleRouter())
    app.use("/media/folder", MediaFolderRouter())

    app.use("/media/gallery", MediaGalleryRouter())
    app.use("/newsletter", NewsletterRouter())
    // app.use("/permission", permissionRouter())

    return app
};
