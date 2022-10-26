import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },

        path: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        pathWithFilename: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        filename: {
            type: String,

            required: true,
            index: true,
            trim: true,
        },
        mimetype: {
            type: String,

            required: true,
            index: true,
            trim: true,
        },
        folder: {
            type: mongoose.Types.ObjectId,
        },
        users: {
            type: Array,
            default: []
        },

        admins: {
            type: Array,
            default: []
        },

        posts: {
            type: Array,
            default: []
        },

        galleries: {
            type: Array,
            default: []
        },

        createdBy: {
            type: mongoose.Types.ObjectId,
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
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

const userMongo = {
    model,
    schema,
    name
}


export default userMongo;