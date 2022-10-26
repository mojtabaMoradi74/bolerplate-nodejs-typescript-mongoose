import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: false
        },
        expired: {
            type: Date,
            required: true,
            trim: true,
            unique: true,
        },
        rememberMe: {
            type: String,
            required: false,
            trim: true,
        },
        status: {
            type: String,
            default: STATUS.ACTIVE
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                // ret.id = ret._id;
                // delete ret._id;
                delete ret.__v;
            },
        }
    }
);

schema.plugin(uniqueValidator);

const name = constant.MODULE_NAME;
// UserSchema.statics.build = (attrs: Interface.ICreate) => {
//     return new BlogCategory(attrs);
// };

const model = mongoose.model<Interface.IDocument>(
    name,
    schema
);

const VerifyCodeMongo = {
    model,
    schema,
    name
}


export default VerifyCodeMongo;