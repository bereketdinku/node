const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const TransferController = require("../controllers/TransferController");
const FaceBookController = require("../controllers/FaceBookController");
router.post("/socialmedia", PostController.forWhich);
router.get("/transfer", TransferController.index);
router.get("/facebook", FaceBookController.index);
module.exports = router;
