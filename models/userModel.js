const mongoose=require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const userModel=new mongoose.Schema({
    username:String,
    googleId:String,
    password:String
      })

userModel.plugin(passportLocalMongoose)
userModel.plugin(findOrCreate);

module.exports=mongoose.model('user',userModel)