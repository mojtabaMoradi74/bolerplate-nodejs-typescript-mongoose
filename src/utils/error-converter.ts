


type props = {
    key: string;
    ns?: string
}

export const convertError = (x: props, y: props) =>
    ({ key: x.key, ns: x.ns || "error", properties: { author: { key: y.key, ns: y.ns || "translation" } } });

export const isExistError = ({ key, ns }: props) =>
    ({ key: 'exist', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const isUsedError = ({ key, ns }: props) =>
    ({ key: 'isUsed', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const invalidError = ({ key, ns }: props) =>
    ({ key: 'invalid', ns: "error", properties: { author: { key, ns: ns || "translation" } } });
export const serverError = (key: undefined | null | any = false) =>
    ({ key: key ? 'serverAuthor' : 'server', ns: "error", ...(key && { properties: { author: { key } } }) });

export const requireError = ({ key, ns }: props) =>
    ({ key: 'isRequired', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const notFoundError = ({ key, ns }: props) =>
    ({ key: 'notfound', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const expiredError = ({ key, ns }: props) =>
    ({ key: 'expired', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const notMatchError = ({ key, ns }: props) =>
    ({ key: 'notMatch', ns: "error", properties: { author: { key, ns: ns || "translation" } } });

export const ActiveError = ({ key, ns }: props) =>
    ({ key: 'inactive', ns: "error", properties: { author: { key, ns: ns || "translation" } } });
