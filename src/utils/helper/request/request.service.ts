import { Request, Response } from 'express';
import { NextFunction } from 'express';
import {
    ENUM_PAGINATION_AVAILABLE_SORT_TYPE,
    PAGINATION_DEFAULT_AVAILABLE_SORT,
    PAGINATION_DEFAULT_MAX_PAGE,
    PAGINATION_DEFAULT_MAX_PER_PAGE,
    PAGINATION_DEFAULT_SORT,
} from '../helper.constant';
import requestConstant from './request.constant';


export function paginationServiceSkip(page: number, limit: number): any {
    page =
        page > PAGINATION_DEFAULT_MAX_PAGE
            ? PAGINATION_DEFAULT_MAX_PAGE
            : page;
    limit =
        limit > PAGINATION_DEFAULT_MAX_PER_PAGE
            ? PAGINATION_DEFAULT_MAX_PER_PAGE
            : limit;
    const skip: number = (page - 1) * limit;
    return skip;
}

export function paginationServiceTotalPage(totalData: number, limit: number): number {
    return Math.ceil(totalData / limit);
}

export function paginationServiceSort(sort: any = PAGINATION_DEFAULT_SORT): any {
    const availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT
    const bSort = PAGINATION_DEFAULT_SORT.split('@')[0];
    const valid = sort.includes('@');
    if (!valid) sort = [PAGINATION_DEFAULT_AVAILABLE_SORT, sort].join('@')

    let field: string = sort.split('@')[0];
    let type: string = sort.split('@')[1];


    const convertField: string = availableSort.includes(field) ? field : bSort;

    const convertType: number = type === 'desc' ? ENUM_PAGINATION_AVAILABLE_SORT_TYPE.DESC : ENUM_PAGINATION_AVAILABLE_SORT_TYPE.ASC;
    // console.log({ convertField, convertType }, { [convertField]: convertType });

    return { [convertField]: convertType };
}

export function paginationParams(req: Request, _: Response, next: NextFunction) {
    let { page, limit, sort } = req.query as Record<string, any>;

    page = page || requestConstant.DEFAULT_PAGE;
    limit = limit || requestConstant.DEFAULT_LIMIT;
    sort = sort || requestConstant.DEFAULT_SORT;

    limit = limit > requestConstant.DEFAULT_MAX_LIMIT ? requestConstant.DEFAULT_MAX_LIMIT : limit;

    req.query.page = page || 1;
    req.query.limit = limit || 10;
    req.query.sort = paginationServiceSort(sort);
    req.query.skip = paginationServiceSkip(page, limit);

    next()
}