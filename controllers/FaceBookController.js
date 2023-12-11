const FaceBook = require("../models/FaceBook");
const getFaceBookRssFeed = require("../rss_json/facebook");
// fetch all data
const index = (req, res, next) => {
  FaceBook.find()
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
// store new data to server
async function mainFaceBook() {
  try {
    const rssUrl =
      "http://fetchrss.com/rss/6561fb3580746912e74802d26572032b1d95834d31500702.xml";
    // Replace with your actual RSS feed URL
    const rssFeedData = await getFaceBookRssFeed(rssUrl);

    // Access and use the extracted data as needed
    for (const item of rssFeedData) {
      let faceBook = new FaceBook({
        title: item.title,
        link: item.link,
        description: item.description,
      });

      const data = await fetchDataByLink(item.link);
      if (data) {
        console.log(data);
      } else {
        faceBook
          .save()
          .then((response) => {
            console.log("FaceBook Rss Added Successfully");
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
// fetch data by link
async function fetchDataByLink(link) {
  try {
    // Fetch data by email
    const result = await FaceBook.findOne({ link });

    return result;
  } catch (error) {
    console.error("Error fetching data by email:", error);
  } finally {
  }
}

module.exports = {
  index,
  mainFaceBook,
};
