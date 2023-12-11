const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    contentText: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    authors: {
      type: String,
    },
    datePublished: {
      type: String,
    },
    accountName: {
      type: String,
    },
    previewImage: {
      type: String,
      default: "",
    },
    source: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
