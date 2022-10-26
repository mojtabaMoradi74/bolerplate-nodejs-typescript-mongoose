import Interface from 'src/modules/role/interface';
import { List } from 'src/utils/helper/request';
import { Document, Types } from "mongoose";
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from 'src/app/database/database.interface';
import { MEMBER_TYPE } from './constant';
import { STATUS } from 'src/enum';




declare namespace UserInterface {

    export interface IDocument {
        _id?: String;
        role: Interface.IDocument;
        firstName: String,
        deletedAt: Date,
        lastName: String,
        mobileNumber: String,
        email: String,
        password: String,
        passwordExpired: String,
        salt: String,
        createdBy: Types.ObjectId | string,
        updatedBy: Types.ObjectId | string,
        type: MEMBER_TYPE.USER
        status: STATUS.ACTIVE
        image: Types.ObjectId | string | any,
    }

    export interface ICheckExist {
        email: boolean;
        mobileNumber: boolean;
    }
    export interface ICreate {
        firstName: string;
        lastName: string;
        password: string;
        passwordExpired: Date;
        email: string;
        mobileNumber: string;
        role?: Types.ObjectId | string;
        salt?: string;
        image?: Types.ObjectId | string;
        status?: string;
        type?: string;

    }

    export type IUpdate = Omit<ICreate, 'passwordExpired' | 'password'>;

    export interface ICheckExist {
        email: boolean;
        mobileNumber: boolean;
    }





    export interface IEdit {
        firstName: string;
        lastName: string;
        password: string;
        passwordExpired: Date;
        email: string;
        mobileNumber: string;
        role?: Types.ObjectId | string;
        salt?: string;
        image?: Types.ObjectId | string;
        status?: string;
        type?: string;
        updatedBy?: string
    }

    export interface IService {
        // Create(params: ICreate): Promise<void>;
        // Edit(id: string, params: IEdit): Promise<void>;
        // Delete(id: string): Promise<void>;
        // ById(id: string): Promise<IDocument>;
        // List(params: List): Promise<IDocument[]>;
        findAll(find: Record<string, any>,
            options?: IDatabaseFindAllOptions): Promise<IDocument[]>;
        getTotal(find: Record<string, any>): Promise<number>;
        findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
        findOne<T>(find?: Record<string, any>,
            options?: IDatabaseFindOneOptions): Promise<T>;
        getTotal(find: Record<string, any>): Promise<number>;
        create(params: Interface.ICreate | any): Promise<Interface.IDocument>;
        checkExist(
            email: string,
            mobileNumber: string,
            _id?: string
        ): Promise<Interface.ICheckExist>;
        deleteOneById(_id: string): Promise<any>
        deleteOne(find: Record<string, any>): Promise<any>

    }
}
export default UserInterface
