export enum ENUM_HELPER_DATE_FORMAT {
    DATE = 'YYYY-MM-DD',
    FRIENDLY_DATE = 'MMM, DD YYYY',
    FRIENDLY_DATE_TIME = 'MMM, DD YYYY HH:MM:SS',
    YEAR_MONTH = 'YYYY-MM',
    MONTH_DATE = 'MM-DD',
    ONLY_YEAR = 'YYYY',
    ONLY_MONTH = 'MM',
    ONLY_DATE = 'DD',
    ISO_DATE = 'YYYY-MM-DDTHH:MM:SSZ',
}

export enum ENUM_HELPER_DATE_DIFF {
    MILIS = 'milis',
    SECONDS = 'seconds',
    HOURS = 'hours',
    DAYS = 'days',
    MINUTES = 'minutes',
}



export const PAGINATION_DEFAULT_PER_PAGE = 10;
export const PAGINATION_DEFAULT_MAX_PER_PAGE = 100;
export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_MAX_PAGE = 20;
export const PAGINATION_DEFAULT_SORT = 'createdAt@asc';
export const PAGINATION_DEFAULT_AVAILABLE_SORT = ['createdAt'];

export enum ENUM_PAGINATION_AVAILABLE_SORT_TYPE {
    ASC = 1,
    DESC = -1,
}

export enum ENUM_PAGINATION_TYPE {
    FUL = 'FUL',
    SIMPLE = 'SIMPLE',
    MINI = 'MINI',
}
