import { Sort } from "../../../enum/sort";
import Interface from "./request.interface";

export interface Id {
    id: string;
}
export interface List {
    sort: Interface.ISort;
    page: number;
    limit: number;
    search?: string;
}
