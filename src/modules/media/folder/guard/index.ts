// import { Request, Response, NextFunction } from "express";
// import { DataNotFoundError } from "packages/errors/data-not-found-error";
// import constant from "../constant";
import Service from "../service/service.admin";
import { ILogger } from 'packages/logger/index';
// import { DataInactiveError } from 'packages/errors/data-inactive-error';
// import { notFoundError, ActiveError } from "src/utils/error-converter";

class BlogCategoryGuard {

    constructor(
        private readonly service: Service,
        private readonly logger: ILogger
    ) {
    }




}


export default BlogCategoryGuard;