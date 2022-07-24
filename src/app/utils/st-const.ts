import {IsActiveMatchOptions} from '@angular/router';

/**
 * RouterLinkActiveOptions equivalent to {exact: true}.
 */
export const EXACT_MATCH_TRUE: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored'
};

/**
 * RouterLinkActiveOptions equivalent to {exact: false}.
 */
export const EXACT_MATCH_FALSE: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored'
};

/**
 * Scroll time from smoothscroll polyfill:
 * https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js.
 */
export const SCROLL_TIME = 468;

/**
 * Media Queries in accordance to assets/styles/media.scss and:
 * https://github.com/angular/flex-layout/wiki/Responsive-API#mediaqueries-and-aliases
 */
export const BREAKPOINTS = {
    XS: 'screen and (max-width: 599px)',
    SM: 'screen and (min-width: 600px) and (max-width: 959px)',
    MD: 'screen and (min-width: 960px) and (max-width: 1279px)',
    LG: 'screen and (min-width: 1280px) and (max-width: 1919px)',
    XL: 'screen and (min-width: 1920px)',

    LT_SM: 'screen and (max-width: 599px)',
    LT_MD: 'screen and (max-width: 959px)',
    LT_LG: 'screen and (max-width: 1279px)',
    LT_XL: 'screen and (max-width: 1919px)',

    GT_XS: 'screen and (min-width: 600px)',
    GT_SM: 'screen and (min-width: 960px)',
    GT_MD: 'screen and (min-width: 1280px)',
    GT_LG: 'screen and (min-width: 1920px)'
};

/**
 * Constants for http status codes.
 * Reverse of {@link http.STATUS_CODES}.
 */
export const HTTP_STATUS = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    ALREADY_REPORTED: 208,
    IM_USED: 226,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    I_AM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    UNORDERED_COLLECTION: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    VARIANT_ALSO_NEGOTIATES: 506,
    INSUFFICIENT_STORAGE: 507,
    LOOP_DETECTED: 508,
    BANDWIDTH_LIMIT_EXCEEDED: 509,
    NOT_EXTENDED: 510,
    NETWORK_AUTHENTICATION_REQUIRED: 511
};

/**
 * Constants for standard http headers.
 * From javax.ws.rs.core.HttpHeaders.
 */
export const HTTP_HEADERS = {
    ACCEPT: "Accept",
    ACCEPT_CHARSET: "Accept-Charset",
    ACCEPT_ENCODING: "Accept-Encoding",
    ACCEPT_LANGUAGE: "Accept-Language",
    ALLOW: "Allow",
    AUTHORIZATION: "Authorization",
    CACHE_CONTROL: "Cache-Control",
    CONTENT_DISPOSITION: "Content-Disposition",
    CONTENT_ENCODING: "Content-Encoding",
    CONTENT_ID: "Content-ID",
    CONTENT_LANGUAGE: "Content-Language",
    CONTENT_LENGTH: "Content-Length",
    CONTENT_LOCATION: "Content-Location",
    CONTENT_TYPE: "Content-Type",
    DATE: "Date",
    ETAG: "ETag",
    EXPIRES: "Expires",
    HOST: "Host",
    IF_MATCH: "If-Match",
    IF_MODIFIED_SINCE: "If-Modified-Since",
    IF_NONE_MATCH: "If-None-Match",
    IF_UNMODIFIED_SINCE: "If-Unmodified-Since",
    LAST_MODIFIED: "Last-Modified",
    LOCATION: "Location",
    LINK: "Link",
    RETRY_AFTER: "Retry-After",
    USER_AGENT: "User-Agent",
    VARY: "Vary",
    WWW_AUTHENTICATE: "WWW-Authenticate",
    COOKIE: "Cookie",
    SET_COOKIE: "Set-Cookie",
    LAST_EVENT_ID_HEADER: "Last-Event-ID"
};

/**
 * Constants for custom headers.
 */
export const X_HTTP_HEADERS = {
    ID: 'X-ST-ID',
    USERNAME: 'X-ST-Username',
    EMAIL: 'X-ST-Email',
    PASSWORD: 'X-ST-Password',
    VERIFICATION: 'X-ST-Verification'
};
