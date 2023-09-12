const express = require('express');
const router = express.Router();
const multer = require("multer")
const videoController = require('../Controller/videoController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/addVideo",upload.single("video"),videoController.create)
router.get("/getAllVideos", videoController.getAllVideos)
router.get("/getSingleVideo/:id", videoController.getSingleVideo)
router.delete("/deleteSingleVideo/:id",videoController.deleteVideo)

module.exports = router;
