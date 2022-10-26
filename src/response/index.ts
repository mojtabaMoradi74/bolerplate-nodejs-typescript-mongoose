export type Regular = {
    message: string;
};
export const OkResponse = (): Regular => {
    return {
        message: "OK",
    };
};
