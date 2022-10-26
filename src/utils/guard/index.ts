import { Request, Response, NextFunction } from "express";
import { DataNotFoundError } from "packages/errors/data-not-found-error";
import { DataInactiveError } from 'packages/errors/data-inactive-error';
import { notFoundError, ActiveError } from "src/utils/error-converter";
import { STATUS } from "src/enum";
import { Types } from "mongoose";
import { InternalError } from "packages/errors/internal-error";

class GlobalGuard {

    constructor(
        private readonly service: any,
        private readonly constant: any,
    ) {
    }

    PutToRequestMultiGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { body }: any = req;
        // console.log({ body });

        const check: Record<string, any> = await this.service.findAll({ '_id': { $in: body.data.map((x: string) => new Types.ObjectId(x)) } });
        // console.log({ check });

        req._data = check;
        next()
    }

    PutToRequestByIdGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const data = await this.service.findOneById(id);
            req._data = data;
        } catch (error) {
            throw new InternalError();
        }
        next()
    }

    PutToRequestSlugGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { slug } = req.params;
        try {
            let set: Record<string, any> = { $inc: { views: 1 } }
            if (req.user) set['$addToSet'] = { viewers: { $each: [req.user._id] } }
            const data = await this.service.findOneBySlugAndUpdate({ slug }, set);
            req._data = data;
        } catch (error) {
            throw new InternalError();
        }
        next()
    }


    PutToRequestAndUpdateSlugGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { slug } = req.params;
        try {
            const data = await this.service.findOne({ slug });
            req._data = data;
        } catch (error) {
            throw new InternalError();
        }
        next()
    }

    NotFound = (req: Request, _: Response, next: NextFunction) => {

        const { _data, body } = req;


        if (Array.isArray(_data)) {
            const newCheck = _data.map((x: any) => x._id)
            let difference = body.data.filter((x: string) => !newCheck.some((y: any) => y.equals(new Types.ObjectId(x))));
            if (difference.length) {
                throw new DataNotFoundError(notFoundError({ key: this.constant.LOCALE_NAME, }), difference);
            }
        } else if (!_data) {
            throw new DataNotFoundError(notFoundError({ key: this.constant.LOCALE_NAME }));
        }

        next()
    }

    ActiveStatusGuard = async (req: Request, _: Response, next: NextFunction) => {
        const { _data } = req;

        if (_data?.status !== STATUS.ACTIVE) {
            throw new DataInactiveError(ActiveError({ key: this.constant.LOCALE_NAME }))
        }
        next()
    }
}


export default GlobalGuard;