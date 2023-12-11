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
mongoose.connect("mongodb://localhost:27017/rss", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
// run auto store
// runAutoStoresFeed();
getTransferRssFeed();
mainFaceBook();
//api route
app.use("/api/rss", router);
cron.schedule("0 0 * * *", async () => {
  console.log("Running RSS fetch and store task...");
  await getTransferRssFeed();
  await mainFaceBook();
});
