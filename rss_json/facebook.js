const axios = require("axios");
const parseString = require("xml2js").parseString;
const cheerio = require("cheerio");
const rssUrl =
  "http://fetchrss.com/rss/6561fb3580746912e74802d26572032b1d95834d31500702.xml";

async function getFaceBookRssFeed() {
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
            title: node.title,
            link: node.link,
            description: extractDescription(node.description),
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
      console.log(items);
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
function extractDescription(description) {
  const $ = cheerio.load(description);

  // Extract the specific text
  const targetText = $("body")
    .contents()
    .filter(function () {
      return this.nodeType === 3; // Node type 3 represents text nodes
    })
    .text()
    .trim();
  return targetText;
}
module.exports = getFaceBookRssFeed;
