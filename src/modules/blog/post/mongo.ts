import mongoose, { Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { STATUS } from "src/enum";
import mediaGalleryConstant from "src/modules/media/gallery/constant";
import userConstant from "src/modules/user/constant";
import blogCategoryConstant from "../category/constant";
import blogTagConstant from "../tag/constant";

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
        subtitle: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: Array<mongoose.Types.ObjectId>,
            index: true,
            default: [],
            ref: blogTagConstant.MODULE_NAME,
        },
        categories: {
            type: Array<mongoose.Types.ObjectId>,
            index: true,
            default: [],
            ref: blogCategoryConstant.MODULE_NAME,
        },
        views: {
            type: Array<mongoose.Types.ObjectId>,
            default: 0,
        },
        viewers: {
            type: Array<mongoose.Types.ObjectId>,
            default: [],
        },
        likes: {
            type: Array<mongoose.Types.ObjectId>,
            default: 0,
        },
        image: {
            type: mongoose.Types.ObjectId,
            ref: mediaGalleryConstant.MODULE_NAME,
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