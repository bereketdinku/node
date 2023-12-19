const axios = require("axios");
const parseString = require("xml2js").parseString;
const { ObjectId } = require("mongodb"); // Assuming you are using MongoDB
const Post = require("../models/Post");
const cheerio = require('cheerio');
// const rssUrl =
//   "http://fetchrss.com/rss/6561fb3580746912e74802d26572032b1d95834d31500702.xml";

async function getTwitterRssFeed(rssUrl) {
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
          const profilePicture=result.rss.channel.image.url
          items = result.rss.channel.item.map((node) => ({
            contentText: node.title,
            image:profilePicture ,
            authors: removeAt( node["dc:creator"]),
            accountName: removeAt( node["dc:creator"]),
            datePublished: node.pubDate,
            previewImage: extractImage( node.description),
            source: "twitter",
            // Add more fields as needed
          }));
        }
      });

    

      for (const item of items) {
        const result = {
          contentText: item.contentText,
          image: item.image,
          authors: item.authors,
          accountName: item.accountName,
          datePublished: item.datePublished,
          previewImage: item.previewImage,
          source: item.source,
        };
        const data = await fetchDataByImage(item.previewImage);
        if (data) {
          console.log(data);
        } else {
          Post(result).save()
          console.log('Twitter data add to db')
        }
       
        // console.log(result)
      }
      // console.log(items)
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
function extractImage(description){
  const $ = cheerio.load(description);

  // Find the image tag and get the 'src' attribute
  const imageUrl = $('img').attr('src');
  return imageUrl
}
function removeAt(usernameWithAt){
  const usernameWithoutAt = usernameWithAt.replace('@', '');
  return usernameWithoutAt
}
async function fetchDataByImage(previewImage) {
  try {
    // Fetch data by email
    const result = await Post.findOne({ previewImage });

    return result;
  } catch (error) {
    console.error("Error fetching data by email:", error);
  } finally {
  }
}
module.exports = getTwitterRssFeed;
