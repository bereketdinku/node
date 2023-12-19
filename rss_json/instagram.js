const axios = require("axios");
const Instagram=require('../models/Instagram')
const cheerio = require('cheerio');
async function getInstagramRss(rssUrl,profilePicture){
    try {
        const response = await axios.get(rssUrl);
        if (response.status === 200) {
            
            const items = response.data.items;

            for (const item of items) {
                const result = {
                    description:extractDescription(item.content_html),
                    image:extractImage(item.content_html),
                    profilePicture:profilePicture,
                    creater:item.author.name,
                    pubDate:item.date_modified,

                }
                const data = await fetchDataByImage(item.image);
                if(!data){
                    Instagram(result).save()
                    console.log('instagram add')
                }
            }
        }else{
            console.log(`HTTP error ${response.status}`);
      return [];
        }
    } catch (error) {
        
    }
}
function extractImage(description){
    const $ = cheerio.load(description);

// Extract the image link
const imageLink = $('a img').attr('src');
return imageLink
}
function extractDescription(content){
    const $ = cheerio.load(content);

    // Extract all text content
    const allTextContent = $('body').text();
    console.log(allTextContent)
    return allTextContent
}
async function fetchDataByImage(image) {
    try {
      // Fetch data by email
      const result = await Instagram.findOne({ image });
  
      return result;
    } catch (error) {
      console.error("Error fetching data by email:", error);
    } finally {
    }
  }
module.exports={getInstagramRss}