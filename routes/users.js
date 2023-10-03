const express = require('express')
const router = express.Router();
// User mondel
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const passport = require('passport')

//login
router.get("/login",(req,res)=> res.render('login'))
//register
router.get("/register",(req,res)=> res.render('register'))

router.post("/register",async(req,res)=>{
   const {name,email,password,password2} = req.body;
    let errors = []
    //check required field
    if(!name || !email || !password || !password2){
        errors.push( {msg:'field is empty'})
    }
    //password match 
    if(password!==password2){
        errors.push({msg:"passwords is not match"})
    }
    //pass length
    if(password.length<6){
        errors.push({msg:"password should at least be more than 6 caracteres"})
    }
    if(errors.length>0){

        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })

    }else{
        try{
       //check if user already exist 
       const user = await User.findOne({email})
       if(user){
        errors.push({msg:'email already exist ! '})
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        const newUser = new User({
            name,
            email,
            password
        })
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) throw err     
            else{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err
                    else{
                        newUser.password = hash
                        newUser.save(newUser).then((user)=>{
                            req.flash('success_msg','You are now registred and you can log in ')//creating flash message next we display it in  ejs file
                            res.redirect('/users/login')
                        }).catch((err)=>{
                           console.log(err)
                        })
                        
                    }
                })
            }
        })


    }
        }catch(err){
            console.log(err)
        }
       
    }
})
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:"/users/login",
        failureFlash:true
    })(req,res,next);
})

//logout handle
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect("/users/login");
    });
});
module.exports = router