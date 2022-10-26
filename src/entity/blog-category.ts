import mongoose from "mongoose";
import { SlugRequired, TitleRequired } from "../../packages/messages";
import uniqueValidator from "mongoose-unique-validator";
// An interface that describes the properties
// that are required to create a new BlogCategory
interface BlogCategoryAttrs {
    title: string;
    slug: string;
}

// An interface that describes the properties
// that a BlogCategory Model has
interface BlogCategoryModel extends mongoose.Model<BlogCategoryDoc> {
    build(attrs: BlogCategoryAttrs): BlogCategoryDoc;
}

// An interface that describes the properties
// that a BlogCategory Document has
interface BlogCategoryDoc extends mongoose.Document {
    title: string;
    slug: string;
}

const BlogCategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, TitleRequired],
        },
        slug: {
            type: String,
            unique: true,
            required: [true, SlugRequired],
        },
        deletedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                // ret.id = ret._id;
                // delete ret._id;
                delete ret.__v;
            },
        },
    }
);

BlogCategorySchema.plugin(uniqueValidator);

BlogCategorySchema.statics.build = (attrs: BlogCategoryAttrs) => {
    return new BlogCategory(attrs);
};

const BlogCategory = mongoose.model<BlogCategoryDoc, BlogCategoryModel>(
    "BlogCategory",
    BlogCategorySchema
);

export { BlogCategory, BlogCategoryAttrs, BlogCategoryDoc };
