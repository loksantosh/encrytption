require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const app = express()
const session = require('express-session')
const passport = require('passport')

const mongoose = require('mongoose')

const userModel = require(__dirname + "/models/userModel")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true }).then(() => console.log("Database connected"), (error) => console.log(error))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated())
        res.render('secrets')

    else res.redirect('/login')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const registerUser = await userModel.register({ username: username, active: false }, password)
    if (!registerUser)
        res.redirect('/register')

    passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')

    })

});

app.get('/logout', (req, res) => {
    req.logout((error) => {
        if (error) console.log(error)
        res.redirect('/')
    })

})

app.post('/login', async (req, res) => {
    let { username, password } = req.body
    const user = {
        username: username,
        password: password
    }
    req.login(user, (error) => {
        if (error) {
            console.log(error)
            res.redirect('/login')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secrets')
        })
    })

    res.render('secrets')
})



app.listen(3000, () => console.log('Server running on port 3000'))