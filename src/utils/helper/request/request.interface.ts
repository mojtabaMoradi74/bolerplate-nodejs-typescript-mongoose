import { ENUM_AVAILABLE_SORT_TYPE } from './request.constant';


declare namespace RequestInterface {
    export interface IOptions {
        limit?: number;
        skip?: number;
        page?: number;
        sort?: Record<string, ENUM_AVAILABLE_SORT_TYPE>;
        search?: string;
        status?: string
    }

    export type ISort = Record<
        string,
        ENUM_AVAILABLE_SORT_TYPE
    >;

    export interface IFilterOptions {
        required?: boolean;
    }

    export interface IFilterDateOptions extends IFilterOptions {
        asEndDate?: {
            moreThanField: string;
        };
    }

    export interface IFilterStringOptions
        extends IFilterOptions {
        lowercase?: boolean;
    }
}
export default RequestInterface