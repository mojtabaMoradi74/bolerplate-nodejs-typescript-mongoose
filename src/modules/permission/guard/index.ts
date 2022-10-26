import { Request, Response, NextFunction } from "express";
import { DataNotFoundError } from "packages/errors/data-not-found-error";
import { STATUS } from "../../../enum";
import Service from "../service/service.admin";
import { DataInactiveError } from 'packages/errors/data-inactive-error';
import { notFoundError, ActiveError } from "src/utils/error-converter";
import { InternalError } from "packages/errors/internal-error";

class BlogCategoryGuard {

    constructor(
        private readonly service: Service,
    ) {
    }

    PutToRequestByIdGuard = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const data = await this.service.findOneById(id);
            req._data = data;
        } catch (error) {
            throw new InternalError();
        }
        next()
    }

    NotFound = (req: Request, res: Response, next: NextFunction) => {
        const { _data } = req;
        console.log({ _data });
        if (!_data) {
            throw new DataNotFoundError(notFoundError({ key: "blog.category" }));
        }
        next()
    }

    ActiveStatusGuard = async (req: Request, res: Response, next: NextFunction) => {
        const { _data } = req;
        if (_data?.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: "blog.category" }))
        }
        next()
    }
}


export default BlogCategoryGuard;