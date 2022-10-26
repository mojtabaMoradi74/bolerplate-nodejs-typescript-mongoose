import { Request, Response, NextFunction } from "express";
import { DataNotFoundError } from "packages/errors/data-not-found-error";
import constant from "../constant";
import Service from "../service/service.admin";
import { ILogger } from 'packages/logger/index';
import { DataInactiveError } from 'packages/errors/data-inactive-error';
import { notFoundError, ActiveError } from "src/utils/error-converter";
import { STATUS } from "src/enum";
import { ErrorHandling } from "src/utils";
import { Types } from "mongoose";

class BlogCategoryGuard {

    constructor(
        private readonly service: Service,
        private readonly logger: ILogger
    ) {
    }

    PutToRequestMultiGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { body }: any = req;
        const check: Record<string, any> = await this.service.findAll({ '_id': { $in: body.data.map((x: string) => new Types.ObjectId(x)) } });
        req._data = check;
        next()
    }

    PutToRequestByIdGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const data = await this.service.findOneById(id);
            req._data = data;
        } catch (error) {
            throw ErrorHandling(error, this.logger, `${constant.MODULE_NAME}`);
        }
        next()
    }

    NotFound = (req: Request, _: Response, next: NextFunction) => {

        const { _data, body } = req;


        if (Array.isArray(_data)) {
            const newCheck = _data.map((x: any) => x._id)
            let difference = body.data.filter((x: string) => !newCheck.some((y: any) => y.equals(new Types.ObjectId(x))));
            if (difference.length) {
                throw new DataNotFoundError(notFoundError({ key: "blog.category", }), difference);
            }
        } else if (!_data) {
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