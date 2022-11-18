require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')

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
   await userModel.create(req.body)
   res.render('secrets')
})

app.post('/login' ,async(req,res)=>{
    const {username ,password}=req.body
    const check=await userModel.findOne({username:username ,password:password})
   if(check)console.log("verified" ,check)
    res.render('secrets')
})



app.listen(3000, () => console.log('Server running on port 3000'))