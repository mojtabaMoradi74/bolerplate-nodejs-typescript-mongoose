import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            index: true,
            uppercase: true,
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            default: STATUS.ACTIVE,
        }
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

const permissionMongo = {
    model,
    schema,
    name
}


export default permissionMongo;