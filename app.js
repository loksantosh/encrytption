require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')
const md5=require('md5')

const userModel=require(__dirname+"/models/userModel")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

mongoose.connect(process.env.DATA_BASE,{ useNewUrlParser: true }).then(() => console.log("Database connected"), (error) => console.log(error))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register' ,async(req,res)=>{
    const {username ,password}=req.body
   await userModel.create({username:username ,password:md5(password)})
   res.render('secrets')
})

app.post('/login' ,async(req,res)=>{
    let {username ,password}=req.body
    password=md5(password)
    const check=await userModel.findOne({username:username})
    if(check.password===password)
   console.log("verified" ,check)
    res.render('secrets')
})



app.listen(3000, () => console.log('Server running on port 3000'))