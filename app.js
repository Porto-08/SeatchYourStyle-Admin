const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')



// Express
    const app = express()
// Passport
    require('./config/auth')(passport)      
// Helpers
    const {eAdmin} = require('./helpers/eAdmin')
// Config
    // Require Routes
        // Admin    
            const admin = require('./routes/admin')
        // Config
            const config = require('./routes/config')
    // Sessao
        app.use(session({
            secret: 'samuel',
            resave: true,
            saveUninitialized: true
        }))
    // Passport
        app.use(passport.initialize())
        app.use(passport.session()) 
    // Flash
        app.use((flash()))
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('erro')
            res.locals.user = req.user || null;
            next();
        });
    // Template Engine
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Body-Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/bd_sys', {
             useNewUrlParser: true 
        }).then(() =>{
            console.log('Conectado com ao mongo, Banco "bd_sys" ')
        }).catch((erro) => {
            console.log(`Houve um erro inesperado: ${erro}`)
        })

    // Public
        app.use(express.static(path.join(__dirname,'public')))
// Rotas
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/index',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
})

app.use('/admin', eAdmin, admin)
app.use('/config', eAdmin, config)

//Porta
app.listen(2001, () => {
    console.log('Subiu!')
})