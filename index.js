require("dotenv").config({path: './config/.env'})
require("express-async-errors")
const express = require("express");
const app = express();
const cors = require("cors")
const corsOption = require("./config/corsOption")
const port = process.env.PORT || 3600; // fixed typo and made it dynamic
const multer = require("multer")
const connectDB = require("./config/mongodb")
const poemController = require("./Controller/peomController")
const videoController = require("./Controller/videoController")
const storyController = require("./Controller/storyController")
const articleController = require("./Controller/articleController")
const motMessageController = require("./Controller/motMessageController")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require("./Controller/userController")
const verifyToken = require("./middleware/verifyJWT");
const handleHeaderError = require("./middleware/handlesHeaderError");
const admin = require("firebase-admin")
const  poemrouter  = require("./Routes/peomRoute")
const motmsgrouter = require("./Routes/motMessageRoute")
const storyrouter = require("./Routes/storyRoute")
const articlerouter = require("./Routes/articleRoute")
const videorouter = require("./Routes/videoRoute")
// connects to mongodb 
connectDB()

app.use(express.json());
app.use(cors(corsOption));

///////// THE PICTURE URL ///////////////
app.get("/user/userImage/:mainUrl", (req,res) => {
 try {
    const filename  = req.params.mainUrl

    const bucket = admin.storage().bucket();
    const file = bucket.file(filename);
   
     const stream = file.createReadStream();
     stream.on('error', (err) => {
       console.error(`Error streaming file ${filename}:`, err);
       res.sendStatus(500);
     });

     stream.pipe(res);
 } catch (error) {
     console.error(`Error reading file`, error);
      res.sendStatus(500);
 }
  
})

///////// This is the user Routes and RestApi //////////////////

app.get("/user/getUserInfo", userController.getUserInfo)
app.post("/user/register",upload.single("picture"), handleHeaderError,userController.addNewUser)
app.post("/user/login", userController.login)
app.put("/user/updateUser/:id", userController.updateUser)
app.delete("/user/deleteUser/:id", userController.deleteUser)
///////// This is the poem Routes and RestApi //////////////////

app.use("/poem", poemrouter)
///////// This is the Video Routes and RestApi //////////////////
app.use("/video",videorouter)

///////// This is the Story Routes and RestApi //////////////////
app.use("/story", storyrouter)
///////// This is the Article Routes and RestApi //////////////////
app.use("/article", articlerouter)
///////// This is the Article Routes and RestApi //////////////////
app.use("/motivationalmessage", motmsgrouter)
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
