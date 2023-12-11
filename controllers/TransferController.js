const Transfer = require("../models/Transfer");
const getTransferRssFeed = require("../rss_json/transfer");
const transliteratePlayers = require("./TransliteratePlayers");
// fetch all data desc order
const index = (req, res, next) => {
  Transfer.find()
    .sort({ updatedAt: -1 })
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured",
      });
    });
};

module.exports = {
  index,
};
