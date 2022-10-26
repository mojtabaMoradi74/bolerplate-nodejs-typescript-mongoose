import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {

        refreshToken: {
            type: String,
            required: true,
        },

        accessToken: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        device: {
            type: String,
        },
        sessionId: {
            type: String,
            required: true,
        },

        loginDate: {
            type: Date,
            required: true,
        },
        logoutDate: {
            type: Date,
            required: false,
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