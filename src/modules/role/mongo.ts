import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import constant from './constant';
import Interface from "./interface"



const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        permissions: {
            type: Array,
            // ref: RoleEntity.name,
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