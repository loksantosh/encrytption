const mongoose=require('mongoose')
require('dotenv').config()
const encrypt=require('mongoose-encryption')

const userModel=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
       type:String,
       required:true
    }
})
console.log(process.env.SECRET);
userModel.plugin(encrypt, { secret:process.env.SECRET ,encryptedFields: ['password']})

module.exports=mongoose.model('user',userModel)