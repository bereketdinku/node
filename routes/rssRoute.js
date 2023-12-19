const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const TransferController = require("../controllers/TransferController");
const FaceBookController = require("../controllers/FaceBookController");
const InstagramIndex=require('../controllers/InstagramController').index
// for twitter and telegram
router.post("/socialmedia", PostController.forWhich);

//
router.get("/transfer", TransferController.index);
router.get("/facebook", FaceBookController.index);
//for instagram
router.get("/instagram", InstagramIndex);

module.exports = router;
