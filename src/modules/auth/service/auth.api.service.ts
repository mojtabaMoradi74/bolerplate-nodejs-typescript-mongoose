/* istanbul ignore file */

import Interface from '../interface';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { HelperEncryptionService } from 'src/utils/helper/service/helper.encryption.service';
import mongo from '../mongo';
import configService from 'src/app/config';
import { HelperHashService } from 'src/utils/helper/service/helper.hash.service';
import { IDatabaseFindAllOptions } from 'src/app/database/database.interface';
import { STATUS } from 'src/enum';

export class AuthApiService {
    private readonly env: string;
    constructor(
        private readonly helperStringService: HelperStringService,
        // private readonly configService: ConfigService,
        private readonly helperHashService: HelperHashService,
        private readonly helperEncryptionService: HelperEncryptionService
    ) {
        this.env = configService.app.env;
    }

    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<any[]> {
        const users = mongo.model.find(find).select({
            name: 1,
            key: 1,
            status: 1,
            createdAt: 1,
        });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            users.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            users.sort(options.sort);
        }

        return users.lean();
    }

    async getTotal(find: Record<string, any>): Promise<number> {
        return mongo.model.countDocuments(find);
    }

    async findOneById(_id: string): Promise<any> {
        return mongo.model.findById(_id).lean();
    }

    async findOne(find?: Record<string, any>): Promise<any> {
        return mongo.model.findOne(find).lean();
    }

    async findOneByKey(key: string): Promise<any> {
        return mongo.model.findOne({ key }).lean();
    }





    async inactive(_id: string): Promise<any> {
        const authApi: any = await mongo.model.findById(_id);

        authApi.status = STATUS.DISABLE;
        return authApi.save();
    }

    async active(_id: string): Promise<any> {
        const authApi: any = await mongo.model.findById(_id);

        authApi.status = STATUS.ACTIVE;
        return authApi.save();
    }

    async create({
        name,
        description,
        key,
        secret,
        passphrase,
        encryptionKey,
    }: Interface.Create): Promise<any> {
        key = key ? key : await this.createKey();
        secret = secret ? secret : await this.createSecret();
        passphrase = passphrase ? passphrase : await this.createPassphrase();
        encryptionKey = encryptionKey
            ? encryptionKey
            : await this.createEncryptionKey();
        const hash: string = await this.createHashApiKey(key, secret);

        const create: any = new mongo.model({
            name,
            description,
            key,
            hash,
            passphrase,
            encryptionKey,
            status: STATUS.ACTIVE,
        });

        await create.save();

        return {
            _id: create._id,
            secret,
            passphrase,
            encryptionKey,
        };
    }

    async updateOneById(
        _id: string,
        { name, description }: any
    ): Promise<any> {
        const authApi: any = await mongo.model.findById(_id);

        authApi.name = name;
        authApi.description = description;

        return authApi.save();
    }

    async updateHashById(_id: string): Promise<any> {
        const authApi: any = await mongo.model.findById(_id);
        const secret: string = await this.createSecret();
        const hash: string = await this.createHashApiKey(authApi.key, secret);
        const passphrase: string = await this.createPassphrase();
        const encryptionKey: string = await this.createEncryptionKey();

        authApi.hash = hash;
        authApi.passphrase = passphrase;
        authApi.encryptionKey = encryptionKey;

        await authApi.save();

        return {
            _id: authApi._id,
            secret,
            passphrase,
            encryptionKey,
        };
    }

    async deleteOneById(_id: string): Promise<any> {
        return mongo.model.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<any> {
        return mongo.model.findOneAndDelete(find);
    }

    async createKey(): Promise<string> {
        return this.helperStringService.random(25, {
            safe: false,
            upperCase: true,
            prefix: this.env === 'production' ? 'production_' : 'development_',
        });
    }

    async createEncryptionKey(): Promise<string> {
        return this.helperStringService.random(15, {
            safe: false,
            upperCase: true,
            prefix: this.env === 'production' ? 'production_' : 'development_',
        });
    }

    async createSecret(): Promise<string> {
        return this.helperStringService.random(35, {
            safe: false,
            upperCase: true,
        });
    }

    async createPassphrase(): Promise<string> {
        return this.helperStringService.random(16, {
            safe: true,
        });
    }

    async createHashApiKey(key: string, secret: string): Promise<string> {
        return this.helperHashService.sha256(`${key}:${secret}`);
    }

    async validateHashApiKey(
        hashFromRequest: string,
        hash: string
    ): Promise<boolean> {
        return this.helperHashService.sha256Compare(hashFromRequest, hash);
    }

    async decryptApiKey(
        apiKeyHashed: string,
        secretKey: string,
        passphrase: string
    ): Promise<any> {
        const decrypted = this.helperEncryptionService.aes256Decrypt(
            apiKeyHashed,
            secretKey,
            passphrase
        );

        return JSON.parse(decrypted);
    }

    async encryptApiKey(
        data: any,
        secretKey: string,
        passphrase: string
    ): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            data,
            secretKey,
            passphrase
        );
    }

    async createBasicToken(
        clientId: string,
        clientSecret: string
    ): Promise<string> {
        const token = `${clientId}:${clientSecret}`;
        return this.helperEncryptionService.base64Decrypt(token);
    }

    async validateBasicToken(
        clientBasicToken: string,
        ourBasicToken: string
    ): Promise<boolean> {
        return this.helperEncryptionService.base64Compare(
            clientBasicToken,
            ourBasicToken
        );
    }
}
