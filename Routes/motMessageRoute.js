const express = require("express")
const router = express.Router()
const motMessageController = require("../Controller/motMessageController")

router.post("/addMotMessage", motMessageController.addNewMotMessage);
router.get("/getAllMotMessage", motMessageController.getAllMotMessage);
router.get("/getSingleMotMessage/:id", motMessageController.getSingleMotMessage) 
router.delete("/deleteMotMessage/:id", motMessageController.deleteMotMessage)
router.put("/updateMotMessage/:id", motMessageController.updateMotMessage)

module.exports = router