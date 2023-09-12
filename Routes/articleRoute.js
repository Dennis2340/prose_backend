const express = require("express")
const router = express.Router()
const articleController = require("../Controller/articleController")

router.post("/addArticle", articleController.addNewArticle);
router.get("/getAllArticles", articleController.getAllArticles);
router.get("/getSingleArticle/:id", articleController.getSingleArticle) 
router.delete("/deleteArticle/:id", articleController.deleteArticle)
router.put("/updateArticle/:id", articleController.updateArticle)

module.exports = router