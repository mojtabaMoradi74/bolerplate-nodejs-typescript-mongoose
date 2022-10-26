import { Request } from "express";
import { IResponse } from "src/utils/helper/response/response.interface";

class UserPublicController {
    constructor(
    ) { }

    async Profile(req: Request): Promise<IResponse> {
        const { user } = req;

        return user;
    }

}

export default UserPublicController