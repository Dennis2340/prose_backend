const express = require("express")
const router = express.Router()
const poemController = require("../Controller/peomController")

router.post("/addPoem",poemController.addNewPoem);
router.get("/getAllPoems", poemController.getAllPoems);
router.get("/getSinglePoem/:id", poemController.getSinglePoem) 
router.delete("/deletePoem/:id",poemController.deletePoem)
router.put("/updatePoem/:id",poemController.updatePoem)
   
module.exports = router