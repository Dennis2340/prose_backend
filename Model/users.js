const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName :{
        type: String,
        required : true
    },
    userEmail : {
      type: String,
      required: true
    },
    userPassword : {
      type: String,
      required: true
    },
    userDateOfBirth: {
      type: String,
    },
    userPhoneNumber : {
      type: String,
      required: true
    },
    userOccupation: {
      type: String,
      
    },
    pictureUrl: {
      type: String,
      
    },
    userGender: {
      type: String,
    }
   

})

const user = mongoose.model("users", userSchema)
module.exports = user