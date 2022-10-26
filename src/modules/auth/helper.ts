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

export const loginVerifyCodeUi = ({ firstName, lastName, code }: any) => `
        <div style="    width: 250px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;">
            <div >
              <span>Hello <b style="color: blue;">${firstName} ${lastName}</b>,
              <br/>
              <p style="color: #666;">
              please used this code for enter to admin dashboard</span>
              </p>
              <br/>
            </div>
            <b style="
            display: block;
            color: #000;"
            >Your verify code</b>
            <div style="font-size: 20px;

            padding: 10px;
            margin-top: 10px;
            text-align:center;
            background: aliceblue;
            ">
              ${code}
            </div>
        </div>
`


const authHelper = {
    user,
    token,
    apiKey,
}

export default authHelper;