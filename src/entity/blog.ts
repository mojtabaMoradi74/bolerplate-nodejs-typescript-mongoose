import mongoose, { Schema } from "mongoose";
import {
    CategoryRequired,
    DescriptionRequired,
    SlugRequired,
    TitleRequired,
} from "../../packages/messages";
import uniqueValidator from "mongoose-unique-validator";
import { BlogStatus, BlogType } from "../enum/blog";
// An interface that describes the properties
// that are required to create a new Blog
interface BlogAttrs {
    title: string;
    slug: string;
    description: string;

    text?: string;
    thumbnail?: string;
    image?: string;
    video?: string;

    isHome?: boolean;
    recommended?: boolean;

    type?: string;
    status?: string;

    category: string;
}
// An interface that describes the properties
// that a Blog Model has
interface BlogModel extends mongoose.Model<BlogDoc> {
    build(attrs: BlogAttrs): BlogDoc;
}

// An interface that describes the properties
// that a Blog Document has
interface BlogDoc extends mongoose.Document {
    title: string;
    slug: string;
    description: string;

    text?: string;
    thumbnail?: string;
    image?: string;
    video?: string;

    isHome: boolean;
    recommended: boolean;

    type: string;
    status: string;

    likes: number;

    category: Schema.Types.ObjectId;
}

const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, TitleRequired] },
        slug: { type: String, unique: true, required: [true, SlugRequired] },
        description: { type: String, required: [true, DescriptionRequired] },

        text: { type: String },
        thumbnail: { type: String },
        image: { type: String },
        video: { type: String },

        isHome: { type: Boolean, default: false },
        recommended: { type: Boolean, default: false },

        type: { type: String, enum: BlogType, default: BlogType.article },
        status: { type: String, enum: BlogStatus, default: BlogStatus.active },

        likes: { type: Number, default: 0 },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, CategoryRequired],
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

BlogSchema.plugin(uniqueValidator);

BlogSchema.statics.build = (attrs: BlogAttrs) => {
    return new Blog(attrs);
};

const Blog = mongoose.model<BlogDoc, BlogModel>("Blog", BlogSchema);

export { Blog, BlogAttrs, BlogDoc };
