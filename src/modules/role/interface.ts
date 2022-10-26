import Interface from 'src/modules/role/interface';
import { List } from 'src/utils/helper/request';
import { Document, Types } from "mongoose";
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from 'src/app/database/database.interface';




declare namespace RoleInterface {
    export interface IDocument extends Document {
        _id: string,
        permissions: string[];
        name: String,
        createdBy: String,
        updatedBy: String,
        status: String,
    }

    export interface ICreate {
        name: string;
        permissions: any[];
        status?: string;
    }


    export type ICheckExist = boolean

    export interface IEdit {
        name: string;
        permissions: string[];
        status: string;
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
        checkExist(name: string, _id?: string): Promise<boolean>;
        deleteOneById(_id: string): Promise<any>
        deleteOne(find: Record<string, any>): Promise<any>

    }
}
export default RoleInterface
