export enum ENUM_newsletter_TYPE {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

const newsletterConstant = {
    MODULE_VERSION: "1",
    MODULE_PATH: "newsletter",
    MODULE_NAME: "newsletter",
    ACTIVE_META_KEY: 'newsletterActiveMetaKey',
    ACCESS_FOR_META_KEY: 'newsletterAccessForMetaKey',
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

export default newsletterConstant