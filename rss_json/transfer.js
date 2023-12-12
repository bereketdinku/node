const axios = require("axios");
const transliteratePlayers = require("../controllers/TransliteratePlayers");
const parseString = require("xml2js").parseString;

// const rssUrl =
//   "https://crssnt.com/preview/https:/docs.google.com/spreadsheets/d/1h-XoXOlAeY-ZriweURBNqf7SnQfmejrI799RxvWlYpg/edit#gid=0";
const rssUrl =
  "https://crssnt.com/preview?id=1h-XoXOlAeY-ZriweURBNqf7SnQfmejrI799RxvWlYpg&name=big";
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
        transferAmount: extractTransferAmount(node.title),
        playerProfile: extractPhoto(extractName(node.title)),
        fromClubPhoto: extractPhoto(extractFromClub(node.title)),
        toClubPhoto: extractPhoto(extractToClub(node.title)),
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
      let firstItem = true;
      for (const item of items) {
        if (firstItem) {
          firstItem = false;
          continue;
        }
        const result = {
          fromClubName: await transliteratePlayers(item.fromClubName),
          toClubName: await transliteratePlayers(item.toClubName),
          playerName: await transliteratePlayers(item.playerName),
          transferAmount: item.transferAmount,
          playerProfile: item.playerProfile,
          fromClubPhoto: item.fromClubPhoto,
          toClubPhoto: item.toClubPhoto,
        };
        console.log(result);
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
      // console.log(items);
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
  const regex = /\(([^)]+)\➡️/;

  // Use the match method to find the match in the text
  const match = fromClubName.match(regex);

  // Extract the value from the matched group
  const extractedClub = match && match[1];
  console.log("fromclub", extractedClub);
  return extractedClub;
}

function extractToClub(toClubName) {
  const regex = /➡️\s([^💲:]+)/;

  // Use the match method to find the match in the text
  const match = toClubName.match(regex);

  // Extract the value from the matched group
  const extractedClub = match && match[1];
  console.log("toClub", extractedClub);
  return extractedClub;
}
function extractTransferAmount(transferAmount) {
  const regex = /: [^]+/;
  const match = transferAmount.match(regex);

  // Check if a match is found and extract the result
  const extractedTransferInfo = match
    ? match[0].trim()
    : "Transfer info not found";
  if (extractedTransferInfo === "loan") {
    extractedTransferInfo = "በውሰት";
  } else if (extractedTransferInfo == "free transfer") {
    extractedTransferInfo = "ነጻ ዝውውር";
  } else if (
    extractedTransferInfo == "-" ||
    extractedTransferInfo == "?" ||
    extractedTransferInfo == " "
  ) {
    extractedTransferInfo = "አልተገለጸም";
  }
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
function extractPhoto(name) {
  if (name == null) {
    return "";
  } else {
    name = name.replace(/\.$/, "");
    let modifiedName = name.replace(/\s+/g, "-");
    const normalizedString = modifiedName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let lowercaseName = normalizedString.toLowerCase();

    let photo = `https://fifaratings.com/wp-content/uploads/${lowercaseName}.png`;
    return photo;
  }
}
module.exports = getTransferRssFeed;
