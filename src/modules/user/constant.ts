
export enum ENUM_USER_STATUS_CODE_ERROR {
    NOT_FOUND_ERROR = 5400,
    EXISTS_ERROR = 5401,
    IS_INACTIVE_ERROR = 5402,
    EMAIL_EXIST_ERROR = 5403,
    MOBILE_NUMBER_EXIST_ERROR = 5404,
    ACTIVE_ERROR = 5405,
}

export enum ENUM_USER_STATUS {
    DISABLE = "0",
    ACTIVE = "1",
    DELETE = "2",
    BLOCK = "3",
    BAN = "4",
}


export enum MEMBER_TYPE {
    ADMIN = 'ADMIN',
    USER = 'USER',
}



const userConstant = {
    MODULE_VERSION: "1",
    MODULE_PATH: "user",
    MODULE_NAME: "user",
    LOCALE_NAME: "user",
    ACTIVE_META_KEY: 'UserActiveMetaKey',
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 10,
    DEFAULT_SORT: 'name@asc',
    DEFAULT_AVAILABLE_SORT: [
        'firstName',
        'lastName',
        'email',
        'mobileNumber',
        'createdAt',
    ],
    DEFAULT_AVAILABLE_SEARCH: [
        'firstName',
        'lastName',
        'email',
        'mobileNumber',
    ],
}

export default userConstant