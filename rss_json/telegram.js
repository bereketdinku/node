const axios = require("axios");
const parseString = require("xml2js").parseString;
const { ObjectId } = require("mongodb"); // Assuming you are using MongoDB

const rssUrl =
  "http://fetchrss.com/rss/6561fb3580746912e74802d26572032b1d95834d31500702.xml";

async function getTelegramRssFeed(rssUrl) {
  try {
    const response = await axios.get(rssUrl);

    if (response.status === 200) {
      const xmlData = response.data;
      let items = [];

      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Error converting XML to JSON:", err);
        } else {
          // Extract relevant information
          items = result.rss.channel.item.map((node) => ({
            fromClubName: node.contentText,
            image: node.image,
            authors: node.authors,
            accountName: node.accountName,
            datePublished: node.datePublished,
            previewImage: node.previewImage,
            source: "telegram",
            // Add more fields as needed
          }));
        }
      });

      if (process.env.NODE_ENV === "development") {
        // console.log(items);
      }

      for (const item of items) {
        const result = {
          title: item.title || "",
          link: item.link || "",
        };
      }
      return items;
    } else {
      // Handle HTTP error
      console.log(`HTTP error ${response.status}`);
      return [];
    }
  } catch (e) {
    // Handle other errors
    console.error(`Error: ${e}`);
    return [];
  }
}

module.exports = getTelegramRssFeed;
