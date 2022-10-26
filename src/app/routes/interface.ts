import mongoose from "mongoose";
import JwtGuard from "src/modules/auth/guard/jwt";
import TokenService from "src/modules/token/service/service.admin";
import UserService from "src/modules/user/service/service.admin";
import { HelperDateService } from "src/utils/helper/service/helper.date.service";
import { HelperEncryptionService } from "src/utils/helper/service/helper.encryption.service";
import { HelperStringService } from "src/utils/helper/service/helper.string.service";


export interface IImportGlobalService {
    helperStringService: HelperStringService
    helperDateService: HelperDateService
    helperEncryptionService: HelperEncryptionService
    tokenService: TokenService
    userService: UserService
    jwtGuard: JwtGuard
}
