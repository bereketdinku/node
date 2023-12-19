const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InstagramSchema = new Schema(
  {
    
    image:{
        type:String
    },
    description: {
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
const FaceBook = mongoose.model("Instagram", InstagramSchema);
module.exports = FaceBook;
