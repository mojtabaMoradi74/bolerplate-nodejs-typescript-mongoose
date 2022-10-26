import ms from 'ms';

const authConfig = ({
    jwt: {
        accessToken: {
            secretKey:
                process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY || '123456',
            expirationTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || ''
            // ? ms(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED)
            // : ms('30m')
            , // recommendation for production is 30m
            notBeforeExpirationTime: ms(0), // keep it in zero value
        },

        refreshToken: {
            secretKey:
                process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ||
                '123456000',
            expirationTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED || ''
            // ? ms(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED)
            // : ms('7d')
            , // recommendation for production is 7d
            expirationTimeRememberMe: process.env
                .AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED || ''
            // ? ms(process.env.AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED)
            // : ms('30d')
            , // recommendation for production is 30d
            notBeforeExpirationTime: ms(0)
            // process.env
            //     .AUTH_JWT_ACCESS_TOKEN_EXPIRED
            //     ? ms(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED)
            //     : ms('30m'), // recommendation for production is 30m
        }

    },

    password: {
        saltLength: 10,
        expiredInMs: ms('182d'), // recommendation for production is 182 days
    },

    basicToken: {
        clientId: process.env.AUTH_BASIC_TOKEN_CLIENT_ID,
        clientSecret: process.env.AUTH_BASIC_TOKEN_CLIENT_SECRET,
    },
    mailer: {
        // SERVICE: process.env.SERVICE,
        // HOST: process.env.HOST,
        // USER: process.env.USER,
        // PASS: process.env.PASS,
        email: process.env.MAILER_EMAIL,
        password: process.env.MAILER_PASSWORD,
    }
});

export default authConfig;

