const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const transferSchema = new Schema(
  {
    fromClubName: {
      type: String,
    },
    toClubName: {
      type: String,
    },
    playerProfile: {
      type: String,
    },
    fromClubPhoto: {
      type: String,
    },
    toClubPhoto: {
      type: String,
    },
    playerName: {
      EnglishName: {
        type: String,
      },
      AmharicName: {
        type: String,
      },
      OromoName: {
        type: String,
      },
      SomaliName: {
        type: String,
      },
    },
    transferAmount: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Transfer = mongoose.model("Transfer", transferSchema);
module.exports = Transfer;
