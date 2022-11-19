const mongoose=require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')

const userModel=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
       type:String
      }
})

userModel.plugin(passportLocalMongoose)

module.exports=mongoose.model('user',userModel)