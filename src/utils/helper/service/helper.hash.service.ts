import bcrypt, { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SHA256, enc } from 'crypto-js';

export class HelperHashService {
    randomSalt(length: number): string {
        return genSaltSync(length);
    }

    bcrypt(passwordString: string, salt: string): string {
        return hashSync(passwordString, salt);
    }

    bcryptCompare(passwordString: string, passwordHashed: string): any {
        // console.log({ passwordString, passwordHashed }, bcrypt.compareSync(passwordString, passwordHashed));
        return compareSync(passwordString, passwordHashed);
    }

    sha256(string: string): string {
        return SHA256(string).toString(enc.Hex);
    }

    sha256Compare(hashOne: string, hashTwo: string): boolean {
        return hashOne === hashTwo;
    }
}
