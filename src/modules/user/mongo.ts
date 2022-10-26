import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant, { MEMBER_TYPE } from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        deletedAt: { type: Date },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: mongoose.Types.ObjectId,
            // type: String
            // ref: RoleEntity.name,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        passwordExpired: {
            type: String,
        },
        salt: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            // type: String
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            // type: String
        },

        type: {
            type: String,
            default: MEMBER_TYPE.USER
        },
        status: {
            type: String,
            default: STATUS.ACTIVE
        },
        image: {

            type: mongoose.Types.ObjectId,
            // type: String
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

const userMongo = {
    model,
    schema,
    name
}


export default userMongo;