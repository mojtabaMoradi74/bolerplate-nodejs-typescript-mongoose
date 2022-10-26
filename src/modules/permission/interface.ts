import Interface from 'src/modules/role/interface';
import { Document, Types } from "mongoose";
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from 'src/app/database/database.interface';


declare namespace PermissionInterface {

    export interface IDocument extends Document {
        _id?: String,
        type: String,
        title: String,
        description: String,
        status: String
    }

    export interface ICreate {
        title: string;
        slug?: string;
        status?: string;
        type?: string
        description?: string
        createdBy?: string
    }


    export interface ICheckExist {
        title: string;
        slug?: string;
    }

    export interface IUpdate {
        title: string;
        slug?: string;
        status?: string;
        type?: string
        description?: string
    }

    export interface IService {
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

export default PermissionInterface
