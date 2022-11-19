require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const app = express()
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const findOrCreate = require('mongoose-findorcreate')
const mongoose = require('mongoose')

const userModel = require(__dirname + "/models/userModel")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(session({  //initalize the session
    secret: "my secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize()) //starting the passportjs
app.use(passport.session()) //paasport js store auth token in session

passport.use(userModel.createStrategy());  //part of auth2.0 strategy

passport.serializeUser(function(user, done) { //wrappping the session cookie with token
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {   //unwrapping the session cookie to check auth
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({  //passport js stratgy files //authenticating with google
    clientID:process.env.CLIENT_ID,    
    clientSecret:process.env.CLIENT_SECRET, //it is used same for register and login
    callbackURL: "http://localhost:3000/auth/google/secrets"
    
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true }).then(() => console.log("Database connected"), (error) => console.log(error))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/auth/google',
  passport.authenticate("google", { scope: ["profile"] }));


  app.get('/auth/google/secrets',  //this url is registred with google developer api to perform auth
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated())  //here checking the login status and authentication  , basically its a key 
        res.render('secrets')

    else res.redirect('/login')
})

app.post('/register', async (req, res) => { //this route used when authenticating locally
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