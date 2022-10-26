import { Request, Response, NextFunction } from "express";
import { DataNotFoundError } from "packages/errors/data-not-found-error";
import constant from "../constant";
import Service from "../service/service.admin";
import { ILogger } from 'packages/logger/index';
import { DataInactiveError } from 'packages/errors/data-inactive-error';
import { notFoundError, ActiveError } from "src/utils/error-converter";
import { STATUS } from "src/enum";
import { ErrorHandling } from "src/utils";

class BlogCategoryGuard {

    constructor(
        private readonly service: Service,
        private readonly logger: ILogger
    ) {
    }

    PutToRequestByIdGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        console.log({ id });
        try {
            const data = await this.service.findOneById(id);
            req._data = data;
        } catch (error) {
            throw ErrorHandling(error, this.logger, `${constant.MODULE_NAME}`);
        }
        next()
    }

    NotFound = (req: Request, _: Response, next: NextFunction) => {
        const { _data } = req;
        console.log({ _data });
        if (!_data) {
            throw new DataNotFoundError(notFoundError({ key: "blog.category" }));
        }
        next()
    }

    ActiveStatusGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { _data } = req;
        if (_data?.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: "blog.category" }))
        }
        next()
    }
}


export default BlogCategoryGuard;