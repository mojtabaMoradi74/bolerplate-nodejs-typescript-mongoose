
export enum ENUM_REQUEST_STATUS_CODE_ERROR {
    REQUEST_VALIDATION_ERROR = 5981,
    REQUEST_TIMESTAMP_INVALID_ERROR = 5982,
    REQUEST_USER_AGENT_INVALID_ERROR = 5983,
}

export enum ENUM_REQUEST_METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

export const REQUEST_EXCLUDE_TIMESTAMP_META_KEY =
    'RequestExcludeTimestampMetaKey';



export enum ENUM_AVAILABLE_SORT_TYPE {
    ASC = 1,
    DESC = -1,
}

export enum ENUM_PAGINATION_TYPE {
    FUL = 'FUL',
    SIMPLE = 'SIMPLE',
    MINI = 'MINI',
}


const requestConstant = {
    DEFAULT_LIMIT: 10,
    DEFAULT_MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
    DEFAULT_MAX_PAGE: 20,
    DEFAULT_SORT: 'createdAt@asc',
    DEFAULT_AVAILABLE_SORT: ['createdAt'],
}

export default requestConstant