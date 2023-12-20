const Post = require("../models/Post");

const getTelegramRssFeed = require("../rss_json/telegram");
const getTwitterRssFeed = require("../rss_json/twitter");
// fetch data by source
const forWhich = (req, res, next) => {
  const { source, pageNumber } = req.query;
  const skipCount = (pageNumber - 1) * 10;
  Post.findMany({ source })
    .sort({ updatedAt: -1 })
    .skip(skipCount)
    .limit(10)
    .toArray()
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
 
  forWhich,
};
