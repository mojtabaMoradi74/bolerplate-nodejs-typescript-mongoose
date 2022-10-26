import { Sort } from "../enum/sort";

export const CalculateSort = (sort: Sort): number => {
    return +Sort[sort] - 1;
};
export const CalculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};
