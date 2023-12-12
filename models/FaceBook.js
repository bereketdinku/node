const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const faceBookSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    mediaContent: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
    },
    creater: {
      type: String,
      default: "",
    },
    pubDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const FaceBook = mongoose.model("FaceBook", faceBookSchema);
module.exports = FaceBook;
