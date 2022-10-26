import { Request, Response } from "express";

class UserAdminCommonController {
    constructor(
    ) { }

    async Profile(req: Request, res: Response): Promise<any> {
        const { user } = req;

        res.status(200).send(user);
    }

}

export default UserAdminCommonController