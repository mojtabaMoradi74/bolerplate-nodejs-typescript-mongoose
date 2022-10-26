import ms from 'ms';

const helperConfig = ({
    salt: {
        length: 8,
    },
    jwt: {
        secretKey: '123456',
        expirationTime: ms('1h'),
        notBeforeExpirationTime: ms(0),
    },
})
export default helperConfig;

