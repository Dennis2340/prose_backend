const express = require("express")
const router = express.Router()
const userController = require("../Controller/userController")
const handleHeaderError = require("../middleware/handlesHeaderError");
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getUserInfo", userController.getUserInfo)
router.post("/register",upload.single("picture"), handleHeaderError,userController.addNewUser)
router.post("/login", userController.login)
router.put("/updateUser/:id", userController.updateUser)
router.delete("/deleteUser/:id", userController.deleteUser)

module.exports = router