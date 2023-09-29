const { set } = require("mongoose");
const users = require("../Model/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const rolesEmail = require("../config/roles_lists")
const uploadFileToFirebase = require("../helperFunctions/videoHelper");
const user = require("../Model/users");
const admin = require("firebase-admin")
const addNewUser= async(req, res) => {
    if(!req?.body?.userName || !req?.body?.userEmail || !req?.body?.userPassword){
        return res.status(400).json({message : "Name, Email and Password of the user are required"});
    }
    try{

        // const {  userEmail } = req.body
        // if(userEmail  !== rolesEmail[0]) return res.status(500).json({msg : "You are not authorized to register"})
        let url = ""
        if(req.file){
        const { originalname, buffer } = req?.file;
         url = await uploadFileToFirebase(originalname, buffer)
      }
        
        const passwordHashed = await bcrypt.hash(req.body.userPassword, 10)

        const isDuplicate = await users.exists({  
            userName: req.body.userName,
            userEmail: req.body.userEmail,
           
          });
      
          if (isDuplicate) {
            return res
              .status(400)
              .json({ message: "This user already exists and it should be a maximum of one user for this routes" });
          }
        const result = await users.create({
           userName: req.body.userName,
           userEmail: req.body.userEmail,
           userPhoneNumber: req.body.userPhoneNumber,
           userOccupation: req.body.userOccupation,
           userGender: req.body.userGender,
           userDateOfBirth: req.body.userDateOfBirth,
           userPassword: passwordHashed,
           pictureUrl : url
        });

        const savedUser = await result.save();
        const newUrl = savedUser.pictureUrl
        const filename = newUrl.split("/")
        const picture = filename[filename.length - 1]
        res.status(201).json({savedUser,picture, message: "user added successfully"})
       
        console.log("new user added");
       
    } catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error", error});
    }
};


  const getUserInfo = async(req,res) => {
    try {
      const users = await user.find({})
      return res.status(200).json({users})
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Unable to get users" });
    }
  }
  
  
const updateUser = async(req, res) => {
    try {
        if (!req?.body) return res.status(400).json({ message: "Nothing to be updated" });
        // const passwordHashed = await bcrypt.hash(req.body.userPassword, 10)
        const updatedUser = await users.findByIdAndUpdate(req.params.id, {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDateOfBirth: req.body.userDateOfBirth,
            userGender: req.body.userGender,
            userPhoneNumber: req.body.userPhoneNumber,
            userOccupation: req.body.userOccupation,
            
        }, { new: true });
    
        res.status(202).json({ updatedUser, message: "user updated succesfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
      }
}

const login = async (req, res) => {
    try {
        const { userEmail, userPassword }  = req.body
        const user = await users.findOne({ userEmail : userEmail})
        if(!user) return res.status(404).json({msg: "User Does not exist"})

        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if(!isMatch) return res.status(400).json({msg : "Invalid credentials"})

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET)
        await delete user.userPassword
         
        res.status(200).json({ token, user, message: "user loggeg in successfully"})
    } catch (error) {
        res.status(500).json({ error : error.message})
    }
}

const deleteUser = async (req, res) => {
  try {
    // Delete user from MongoDB
    const singleUser = await users.findById(req.params.id);
    const deletedUser = await users.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      // Delete the picture from Google Cloud Storage
      const url = singleUser.pictureUrl;
      const filename = url.split("/");
      const filePath = filename[filename.length - 1];
      const fileRef = admin.storage().bucket().file(filePath);

      await fileRef.delete();
      console.log("File deleted successfully.");

      // Send user deletion response
      return res.status(203).json({ message: "User deleted" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
    addNewUser,
    login,
    updateUser,
    getUserInfo,
    deleteUser
}