const axios = require("axios");
const transliteratePlayers = require("../controllers/TransliteratePlayers");
const parseString = require("xml2js").parseString;

const rssUrl =
  "https://crssnt.com/preview/https:/docs.google.com/spreadsheets/d/1h-XoXOlAeY-ZriweURBNqf7SnQfmejrI799RxvWlYpg/edit#gid=0";
const util = require("util");
const Transfer = require("../models/Transfer");
const parseStringPromise = util.promisify(parseString);

async function getTransferRssFeed() {
  try {
    const response = await axios.get(rssUrl);

    if (response.status === 200) {
      const xmlData = response.data;

      // Use promisified parseString function
      const result = await parseStringPromise(xmlData, {
        explicitArray: false,
      });

      // Extract relevant information
      const items = result.rss.channel.item.map((node) => ({
        fromClubName: extractFromClub(node.title),
        toClubName: extractToClub(node.title),
        playerName: extractName(node.title),
        transferAmount: extractTransferAmount(node.description),
        // Add more fields as needed
      }));

      if (process.env.NODE_ENV === "development") {
        // console.log(items);
      }

      // Use Promise.all to parallelize the transliteratePlayers calls
      // const transformedItems = await Promise.all(
      //   items.map(async (item) => ({
      //     fromClubName: item.fromClubName,
      //     toClubName: item.toClubName,
      //     playerName: transliteratePlayers(item.playerName),
      //     transferAmount: item.transferAmount,
      //   }))
      // );
      for (const item of items) {
        const result = {
          fromClubName: item.fromClubName,
          toClubName: item.toClubName,
          playerName: await transliteratePlayers(item.playerName),
          transferAmount: item.transferAmount,
        };
        console.log();
        const response = await fetchDataByPlayerName(
          result.playerName.EnglishName
        );
        // console.log(response);
        if (!response) {
          Transfer(result).save();
        } else {
          console.log("found");
        }
        //
      }
      // console.log(transformedItems);
      // return transformedItems;
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

function extractName(name) {
  const match = name.match(/^([^\(]+)/);

  // Check if a match is found and extract the result
  const extractedName = match ? match[0].trim() : "Name not found";
  // const playerName =  transliteratePlayers(extractedName);
  //  ? console.log(playerName);
  return extractedName;
}

function extractFromClub(fromClubName) {
  const match = fromClubName.match(/\(([^➡️]+)➡️/);

  // Check if a match is found and extract the result
  const extractedClub = match ? match[1].trim() : "Club not found";
  return extractedClub;
}

function extractToClub(toClubName) {
  const match = toClubName.match(/\(([^➡️]+)➡️/);

  // Check if a match is found and extract the result
  const extractedClub = match ? match[1].trim() : "Club not found";
  return extractedClub;
}
function extractTransferAmount(transferAmount) {
  const regex = /Transfer fee: [^]+/;
  const match = transferAmount.match(regex);

  // Check if a match is found and extract the result
  const extractedTransferInfo = match
    ? match[0].trim()
    : "Transfer info not found";
  return extractedTransferInfo;
}
//fetch data from server by player name
async function fetchDataByPlayerName(playerName) {
  try {
    const result = await Transfer.find({
      "playerName.EnglishName": playerName,
      // You can add more conditions if needed
    });

    // console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}
module.exports = getTransferRssFeed;
