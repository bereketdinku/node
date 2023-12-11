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

// store new data to server
async function mainPost() {
  try {
    const telegramData = await getTelegramRssFeed();

    // store telegram to server
    for (const item of telegramData) {
      let post = new Post({
        contentText: item.contentText,
        image: item.image,
        authors: item.authors,
        datePublished: item.datePublished,
        accountName: item.accountName,
        previewImage: item.previewImage,
        source: item.source,
      });

      const data = await fetchDataByLink(item.link);
      if (data) {
        console.log(data);
      } else {
        post
          .save()
          .then((response) => {
            // res.json({
            //   message: "FaceBook Rss Added Successfully",
            // });
            console.log("FaceBook Rss Added Successfully");
          })
          .catch((error) => {
            // res.json({
            //   message: "An error Occured",
            // });
            console.log("An error Occured");
          });
      }
    }
    const twitterData = await getTwitterRssFeed();
    //store twitter data to server
    for (const item of twitterData) {
      let post = new Post({
        contentText: item.contentText,
        image: item.image,
        authors: item.authors,
        datePublished: item.datePublished,
        accountName: item.accountName,
        previewImage: item.previewImage,
        source: item.source,
      });

      const data = await fetchDataByContentText(item.link);
      if (data) {
      } else {
        post
          .save()
          .then((response) => {
            console.log("Twitter Rss Added Successfully");
          })
          .catch((error) => {
            console.log("An error Occured");
          });
      }
    }
  } catch (error) {
    console.error("Main function error:", error);
  }
}
// fetch data by contentText
async function fetchDataByContentText(contentText) {
  try {
    // Fetch data by email
    const result = await Post.findOne({ contentText });

    return result;
  } catch (error) {
    console.error("Error fetching data by email:", error);
  } finally {
  }
}
module.exports = {
  mainPost,
  forWhich,
};
