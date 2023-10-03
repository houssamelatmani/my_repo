const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const app = express()


const PORT = process.env.PORT||5000;

//flash
const flash = require('connect-flash');

//session
const session = require('express-session');
const passport = require("passport");

//passport config
require('./configs/passport')(passport)

//config db
const db = require('./configs/keys').mongoURI

//connect to mongo 
mongoose.connect(db,{useNewUrlParser: true}).then(()=> console.log("mongo atlas connect succesfully")).catch((err)=>console.log(err))

//Set Templating Engine
app.set('view engine', 'ejs');
app.use(expressLayouts)

//body parser 
app.use(express.urlencoded({extended: true})); 

//express session
app.use(session({ 		
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash 
app.use(flash())

//global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next();
})

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

app.listen(PORT,console.log(`server is running on ${PORT}`))

