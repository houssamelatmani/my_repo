const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//User model
const User = require('../models/User')

module.exports =  function(passport){
     passport.use(
        new localStrategy({usernameField:'email'},async (email,password,done)=>{
            //Authentification logic here
            //Match User
            try{
                const user = await User.findOne({email})
            if(!user) return done(null,false,{message:'That email i not registred'})
                //Match password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err
                    if(isMatch){
                        return done(null,user)//done(error,user,options)
                    }else{
                        return done(null,false,{message:'password incorrect'})
                    }
                })
            }catch(err) {
                console.log(err)
            }
            
        
        })
    )

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user); // No error, user found
        } catch (err) {
            done(err, null); // Error occurred
        }
    });


}
