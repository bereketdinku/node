const axios = require("axios");
const parseString = require("xml2js").parseString;
const { ObjectId } = require("mongodb"); // Assuming you are using MongoDB
const Post = require("../models/Post");
const cheerio = require('cheerio');
const rssUrl =
  "http://fetchrss.com/rss/6561fb3580746912e74802d26572032b1d95834d31500702.xml";

async function getTelegramRssFeed(rssUrl,profilePicture) {
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
          const accountName=extractAccountName(result.rss.channel.title)
          items = result.rss.channel.item.map((node) => ({
            contentText:extractDescription(node.description) ,
            image:profilePicture,
            authors: node["dc:creator"],
            accountName:accountName,
            datePublished: node.pubDate,
            previewImage: extractImageLink(node.description),
            source: "telegram",
            // Add more fields as needed
          }));
        }
      });

      

      for (const item of items) {
        const result = {
          contentText:item.contentText,
          image:item.image,
          authors:item.authors,
          accountName:item.accountName,
          datePublished:item.datePublished,
          previewImage:item.previewImage,
          source:item.source
        };
        const data=await fetchDataByImage(item.previewImage)
        if(!data){
          Post(result).save()
          console.log('telegram rss added')
        }
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
function extractDescription(description){
  const $ = cheerio.load(description);
  const textOnly = $.text();
  return textOnly
}
function extractImageLink(description){
  const $ = cheerio.load(description);
const imgSrc = $('img').attr('src');
return imgSrc
}
async function fetchDataByImage(previewImage) {
  try {
    // Fetch data by image
    const result = await Post.findOne({ previewImage });

    return result;
  } catch (error) {
    console.error("Error fetching data by image:", error);
  } finally {
  }
}
function extractAccountName(title){
  const nameMatch = title.match(/^(.*?)\s*–\s*Telegram$/);

  // Check if there is a match and get the name
  const name = nameMatch ? nameMatch[1].trim() : null;
  return name
}
module.exports = getTelegramRssFeed;
