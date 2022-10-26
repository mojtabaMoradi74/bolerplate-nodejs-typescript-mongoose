var uniqueValidator = require("mongoose-unique-validator");
uniqueValidator.defaults.message = "This {PATH} has already been taken.";

export * from "./blog-category";
export * from "./blog";
