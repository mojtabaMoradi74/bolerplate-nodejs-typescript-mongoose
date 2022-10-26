export enum ENUM_ROLE_TYPE {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

const roleConstant = {
    MODULE_VERSION: "1",
    MODULE_PATH: "role",
    MODULE_NAME: "role",
    ACTIVE_META_KEY: 'RoleActiveMetaKey',
    ACCESS_FOR_META_KEY: 'RoleAccessForMetaKey',
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

export default roleConstant