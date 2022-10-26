import RequestInterface from "src/utils/helper/request/request.interface";

export interface IDatabaseFindOneOptions {
    populate?: Record<string, boolean>;
}

export interface IDatabaseFindAllOptions
    extends RequestInterface.IOptions,
    IDatabaseFindOneOptions {
    image?: any
    search?: any
    status?: any
}
