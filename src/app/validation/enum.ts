import { CustomValidator } from "express-validator";

export class EnumMapper<T extends { [name: string]: any }> {
    constructor(public enumObject: T) {}
}
export const isInEnum: CustomValidator = (P) => (value: any) => {
    return Object.values(new EnumMapper(P).enumObject).includes(value);
};
