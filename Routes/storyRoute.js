const express = require("express")
const router = express.Router()
const storyController = require("../Controller/storyController")

router.post("/addStory", storyController.addNewStory);
router.get("/getAllStory", storyController.getAllStories);
router.get("/getSingleStory/:id", storyController.getSingleStory) 
router.delete("/deleteStory/:id", storyController.deleteStory)
router.put("/updateStory/:id", storyController.updateStory)

module.exports = router