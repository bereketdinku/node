const { mainFaceBook } = require("../controllers/FaceBookController");
const { mainPost } = require("../controllers/PostController");
const { transferMain } = require("../controllers/TransferController");
const { getTransferRssFeed } = require("../rss_json/transfer");

async function runAutoStoresFeed() {
  // await mainFaceBook();
  // await mainPost();
  const data = await getTransferRssFeed();
  console.log(data);

  // await transferMain();
}
module.exports = runAutoStoresFeed;
