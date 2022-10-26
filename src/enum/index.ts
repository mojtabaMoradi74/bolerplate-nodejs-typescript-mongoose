export enum STATUS {
    DISABLE = "0",
    ACTIVE = "1",
    DELETE = "2",
}



export const STATUS_CODE_WITH_MESSAGE_OBJECT = {
    IS_INACTIVE: {
        statusCode: 5500,
        message: 'error.inactive',
    },

    NOT_FOUND: {
        statusCode: 5501,
        message: 'error.notFound',
    },
    EXIST: {
        statusCode: 5502,
        message: 'error.exist',
    },
    ACTIVE: {
        statusCode: 5503,
        message: 'error.active',
    },
    USED: {
        statusCode: 5504,
        message: 'error.active',
    },
    FORBIDDEN: {
        statusCode: 5505,
        message: 'error.active',
    },
    SLUG_IS_USED: {
        statusCode: 5506,
        message: 'error.slug-is-used',
    },
    EXPIRED: {
        statusCode: 5507,
        message: 'error.expired',
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 5508,
        message: 'http.serverError.internalServerError',
    },
    IS_BLOCKED: {
        statusCode: 5509,
        message: 'error.blocked',
    },
    IS_BANNED: {
        statusCode: 5510,
        message: 'error.banned',
    },
    SUCCESS: {
        statusCode: 2000,
        message: 'global.success',
    }
}
