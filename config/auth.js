const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Model Admin 
require('../models/Admin')
const Admin = mongoose.model('admins')

module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email'}, (email,password, done) => {
        Admin.findOne({email: email}).then((admin) => {
            if(!admin){
                return done(null, false, {message: `Opa! Essa conta não existe.`})
            }

            bcrypt.compare(password, admin.password, (error, batem) => {
                if(batem){
                    return done(null, admin)
                }else{
                    return done(null, false, {message: 'Senha incorreta!'})
                }
            })
        })
    }))

    passport.serializeUser((admin, done) => {
        done(null, admin.id)
    })

    passport.deserializeUser((id, done) => {
        Admin.findById(id, (erro, admin) => {
            done(erro, admin)
        })
    })

}