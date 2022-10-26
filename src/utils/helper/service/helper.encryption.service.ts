import { AES, enc, mode, pad } from 'crypto-js';
import { IHelperJwtOptions } from '../helper.interface';
import jwtService from 'jsonwebtoken';
export class HelperEncryptionService {
    constructor() { }

    base64Encrypt(data: string): string {
        const buff: Buffer = Buffer.from(data, 'utf8');
        return buff.toString('base64');
    }

    base64Decrypt(data: string): string {
        const buff: Buffer = Buffer.from(data, 'base64');
        return buff.toString('utf8');
    }

    base64Compare(clientBasicToken: string, ourBasicToken: string): boolean {
        return ourBasicToken === clientBasicToken;
    }

    aes256Encrypt(
        data: string | Record<string, any> | Record<string, any>[],
        key: string,
        iv: string
    ): string {
        const cIv = enc.Utf8.parse(iv);
        const cipher = AES.encrypt(JSON.stringify(data), key, {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: cIv,
        });

        return cipher.toString();
    }

    aes256Decrypt(encrypted: string, key: string, iv: string): string {
        const cIv = enc.Utf8.parse(iv);
        const cipher = AES.decrypt(encrypted, key, {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: cIv,
        });

        return cipher.toString(enc.Utf8);
    }

    jwtEncrypt(
        payload: Record<string, any>,
        options: IHelperJwtOptions
    ): string {
        return jwtService.sign(payload, options.secretKey, {
            expiresIn: options.expiredIn,
            notBefore: options.notBefore || 0,
        });
    }

    jwtDecrypt(token: string): Record<string, any> {
        return jwtService.decode(token) as Record<string, any>;
    }

    jwtVerify(token: string, options: IHelperJwtOptions): boolean {
        // console.log({ token });

        try {
            const jwt = jwtService.verify(token, options.secretKey);
            // console.log({ jwt });

            return true;
        } catch (e) {
            // console.log({ e });

            return false;
        }
    }
}
