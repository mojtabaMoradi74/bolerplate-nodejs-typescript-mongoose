export enum ENUM_PERMISSIONS {
    // -------------------------------
    USER = 'USER',
    // -------------------------------
    ROLE = 'ROLE',
    // -------------------------------
    BLOG = 'BLOG',
    // -------------------------------
    NEWSLETTER = 'NEWSLETTER',
    // -------------------------------
    MEDIA = 'MEDIA',
    // -------------------------------
    PERMISSION = 'PERMISSION',
    // -------------------------------
    SETTING = 'SETTING',
    // -------------------------------
}

export const PERMISSION_META_KEY = 'permissionMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'permissionActiveMetaKey';

export enum ENUM_PERMISSION_STATUS_CODE_ERROR {
    NOT_FOUND_ERROR = 5200,
    GUARD_INVALID_ERROR = 5201,
    ACTIVE_ERROR = 5203,
}

// export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
// export const ROLE_ACCESS_FOR_META_KEY = 'RoleAccessForMetaKey';


const permissionConstant = {
    MODULE_VERSION: "1",
    MODULE_PATH: "permission",
    MODULE_NAME: "permission",
    META_KEY: 'permissionMetaKey',
    ACTIVE_META_KEY: 'permissionActiveMetaKey',
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

export default permissionConstant