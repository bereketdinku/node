const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(cors());

const router = require("./routes/rssRoute");
const getTransferRssFeed = require("./rss_json/transfer");
const { mainFaceBook } = require("./controllers/FaceBookController");
const {
  RSS_ONE,
  RSS_THREE,
  RSS_FOUR,
  RSS_FIVE,
  RSS_TWO,
  
} = require("./rss_json/rss_constants");
const getFaceBookRssFeed = require("./rss_json/facebook");
const getTwitterRssFeed = require("./rss_json/twitter");
const { getInstagramRss } = require("./rss_json/instagram");
const { instagramList } = require("./rss_json/instagramList");
const { twitterList } = require("./rss_json/twitterList");
const { telegramList } = require("./rss_json/telegramList");
const getTelegramRssFeed = require("./rss_json/telegram");
mongoose.connect("mongodb+srv://bereketdinku:beki1234@cluster0.69ripac.mongodb.net/postmodel");
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("Database Connection Established");
});
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// for(const item of twitterList){
//   getTwitterRssFeed(item.rss)
// }
for(const item of telegramList){
   getTelegramRssFeed(item.rss,item.profilePicture)
}

// for (const item of instagramList){
//   getInstagramRss(item.rss,item.profilePicture)
// }

app.use("/api/rss", router);
cron.schedule("0 0 * * *", async () => {
  console.log("Running RSS fetch and store task...");
  
});
