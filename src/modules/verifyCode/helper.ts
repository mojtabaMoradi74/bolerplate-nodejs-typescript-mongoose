const user = (data: string, ctx: any): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    // console.log({ data, user });

    return data ? user[data] : user;
}


const apiKey = (data: string, ctx: any): Record<string, any> => {
    const { apiKey } = ctx.switchToHttp().getRequest();
    // // console.log({ apiKey });
    return data ? apiKey[data] : apiKey;
}


const token = (headers: any): string => {
    // // console.log({ headers });

    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
}


const authHelper = {
    user,
    token,
    apiKey,
}

export default authHelper;