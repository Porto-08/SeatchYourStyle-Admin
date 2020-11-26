const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MODELS
    require('../models/Admin')
        const Admin = mongoose.model('admins') 

    require('../models/Categorie')
        const Categorie = mongoose.model('categories')

    require('../models/User')
        const User = mongoose.model('users') 

    require('../models/Publicity')
        const Publicity = mongoose.model('publicitys')

    require('../models/Company')
        const Company = mongoose.model('companys')

// Index
router.get('/index', (req,res) => {
    Categorie.find().then((categories) => {
        res.render('admin/index', {categories: categories.map(Categorie => Categorie.toJSON())})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', `Houve um erro ao listar as categorias registradas: `)
    })
})

// Admins
router.get('/register', (req, res) => {
    res.render('admin/register')
})

router.post('/register', (req,res) => {
    // Validação
    var err = [];
    var err_name = []
    var err_email = []
    var err_password = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        err_email.push({text: 'Email Inválido, corrija.'})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        err_password.push({text: 'Senha Inválida, corrija.'})
    }
    // Tamanhos Password 
    if(req.body.password.length < 8){
        err.push({text: 'Senha muito curta, minimo de 8 digitos.'})
    }

    if(req.body.password != req.body.password_2){
        err.push({text: 'Senhas não correspondentes, corrija.'})
    }

    if(err.length > 0 || err_name.length > 0 || err_email.length > 0|| err_password.length > 0){
        res.render('admin/register', {
            err: err, 
            err_name: err_name,
            err_email: err_email, 
            err_password: err_password, 
        })
    }else{
        Admin.findOne({email: req.body.email}).lean().then((admin) => {
            if(admin){
                console.log('Email identico encontrado')
                req.flash('error_msg', `Já existe uma conta com esse email. É você? Acesse sua Conta!`)
                res.redirect('/admin/register')
            }else{
                const newAdmin = new Admin({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if(err){
                            console.log(err)
                            req.flash('error_msg', 'Houver um erro durante a criação da conta, tente novamnete!')
                            res.redirect('/admin/register')
                        }

                        newAdmin.password = hash

                        newAdmin.save().then(() => {
                            console.log('Admin registrado')
                            req.flash('success_msg', 'Sua conta foi criada com sucesso, obrigado!')
                            res.redirect('/admin/index')
                        }).catch((err) => {
                            console.log(err)
                            req.flash('error_msg', 'Não foi possivel criar sua conta, tente novamente!')
                            res.redirect('/admin/register')
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err, 'deu ruim')
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/admin/register')
        })
    }
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Você saiu com sucesso, nos vemos logo, ne?')
    res.redirect('/')
})

// Users
router.get('/users', (req,res) => {
    User.find().then((users) => {
        res.render('admin/users', {users: users.map(User => User.toJSON())})
    })   
})

router.post('/deleteuser/:id', (req, res) =>{
    User.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', `Usuario Deletada com Sucesso!`)
        res.redirect('/admin/users')
    }).catch((erro) => {
        console.log(`Houve um erro ao deletar a Categoria`)
        res.redirect('/admin/users')
    });
});



// Stylists (NÃO CONCLUIDA!)
router.get('/stylist', (req,res) => {
    User.find().then((users) => {
        res.render('admin/stylist', {users: users.map(User => User.toJSON())})
    })   
})



// Services
router.get('/categories', (req,res) => {
    Categorie.find().then((categories) => {
        res.render('admin/categories/categories', {categories: categories.map(Categorie => Categorie.toJSON())})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', `Houve um erro ao listar as categorias registradas: `)
    })
    
})

router.get('/addcategories', (req, res) => {
    res.render('admin/categories/addcategories')
})

router.post('/addcategories', (req, res) => {
    var err_name = [];
    var err_slug = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        err_slug.push({text: 'Slug Inválido, corrija.'})
    }

    if(err_name.length > 0 || err_slug.length > 0){
        res.render('admin/categories/addcategories', {
            err_slug: err_slug,
            err_name: err_name
        })
    }else{
        const newCategorie = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Categorie(newCategorie).save().then(() => {
            console.log('categoria cadastrada')
            req.flash('success_msg', 'Categoria Cadastrada com Sucesso!')
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('erro_msg', 'Não foi possivel cadastrar. Erro interno!')
            res.redirect('/admin/addcategories')
        })
    }
})

router.get('/editcategories/:id', (req,res)=> {
    Categorie.findOne({_id:req.params.id}).lean().then((categories) => { // Nao esquecer do .lean() apos pegar os parametros
        res.render('admin/categories/editcategories', {categories: categories})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        req.redirect('/admin/categories')
    });
})

router.post('/editcategories', (req, res) => {
    var err_name = [];
    var err_slug = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        err_slug.push({text: 'Slug Inválido, corrija.'})
    }

    if(err_name.length > 0 || err_slug.length > 0){
        res.render('admin/categories/editcategories', {
            err_slug: err_slug,
            err_name: err_name
        })
    }else{
        Categorie.findOne({_id: req.body.id}).then((categories) => {
            categories.name = req.body.name
            categories.slug = req.body.slug
            
            categories.save().then(() => {
                console.log('categoria editada')
                req.flash('success_msg', `A edição foi concluida com sucesso.`)
                res.redirect('/admin/categories/categories').catch((err) => {
                    req.flash('error_msg' , `Houve um erro ao fazer a edição, tente novamnete.`)
                    res.redirect('/admin/categorias')
                })
            }).catch((err) => {
                req.flash('error_msg', `Houve um erro ao editar a categoria`)
                res.redirect('/admin/categories')
            })
        })
    }
})

router.post('/deletecategories/:id', (req, res) =>{
    Categorie.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', `Categoria Deletada com Sucesso!`)
        res.redirect('/admin/categories')
    }).catch((erro) => {
        req.flash('error_msg' `Houve um erro ao deletar a Categoria`)
        res.redirect('/admin/categories')
    });
});

// Publicitys
router.get('/publicity', (req, res) => {
    Publicity.find().then((publicity) => {
        res.render('admin/publicitys/publicity', {publicity: publicity.map(Publicity => Publicity.toJSON())})
    }).catch((err) => {
        console.log('Não foi possivel listar a Publicidade')
        res.redirect('/admin/index')
    })
})

router.get('/addpublicity', (req, res) => {
    res.render('admin/publicitys/addpublicity')
})

router.post('/addpublicity', (req, res) => {
    var err_name = [];
    var err_type = [];
    var err_price = [];
    var err_description = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.type || typeof req.body.type == undefined || req.body.type == null){
        err_type.push({text: 'Tipo inválido, corrija.'})
    } 

    if(req.body.type.length < 5){
        err_type.push({text: 'Tipo muito curto, corrija.'}) 
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        err_description.push({text: 'Descrição Inválido, corrija.'})
    }
    
    if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
        err_price.push({text: 'Preço inválido, corrija.'})
    } 

    if(req.body.price.length > 4){
        err_price.push({text: 'Preço não pode ser maior que 4 digitos, corrija.'}) 
    }
    
    if(err_name > 0 || err_price > 0 || err_type > 0 ||  err_description > 0){
        res.render('admin/publicitys/addpublicity', {
            err_name: err_name,
            err_type: err_type,
            err_description: err_description,
            err_price: err_price
        })
    }else{
        const newPublicity = {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price
        }

        new Publicity(newPublicity).save().then(() => {
            console.log('Publicidade cadastrada')
            req.flash('success_msg', 'Publicidade Cadastrada com Sucesso!')
            res.redirect('/admin/publicity')
        }).catch((err) => {
            console.log(err)
            req.flash('erro_msg', 'Não foi possivel cadastrar. Erro interno!')
            res.redirect('/admin/addpublicity')
        })
    }
})

router.get('/editpublicity/:id', (req, res) => {
    Publicity.findOne({_id:req.params.id}).lean().then((publicity) => {
        res.render('admin/publicitys/editpublicity', {publicity: publicity})
    }).catch((err) => {
        console.log('Publicidade não existe')
        res.redirect('/admin/index')
    })
})

router.post('/editpublicity' ,(req, res) => {
    var err_name = [];
    var err_type = [];
    var err_price = [];
    var err_description = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.type || typeof req.body.type == undefined || req.body.type == null){
        err_type.push({text: 'Tipo inválido, corrija.'})
    } 

    if(req.body.type.length < 5){
        err_type.push({text: 'Tipo muito curto, corrija.'}) 
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        err_description.push({text: 'Descrição Inválido, corrija.'})
    }
    
    if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
        err_price.push({text: 'Preço inválido, corrija.'})
    } 

    if(req.body.price.length > 4){
        err_price.push({text: 'Preço não pode ser maior que 4 digitos, corrija.'}) 
    }
    
    if(err_name > 0 || err_price.length > 0 || err_type > 0 || err_description > 0){
        res.render('admin/publicitys/editpublicity', {
            err_name: err_name,
            err_type: err_type,
            err_description: err_description,
            err_price: err_price
        })
    }else{
        Publicity.findOne({_id: req.params.id}).then((publicity) => {
            publicity.name = req.body.name,
            publicity.type = req.body.type,
            publicity.description = req.body.description,
            publicity.price = req.body.price

            publicity.save().then(() => {
                console.log('Publicidade editada')
                req.flash('success_msg', `A edição foi concluida com sucesso.`)
                res.redirect('/admin/publicitys/publicity').catch((err) => {
                    req.flash('error_msg' , `Houve um erro ao fazer a edição, tente novamnete.`)
                    res.redirect('/admin/editpublicity')
                })
            }).catch((err) => {
                req.flash('error_msg', `Houve um erro ao editar a categoria`)
                res.redirect('/admin/publicity')
            })
        })
    }

    
})

router.post('/deletepublicity/:id', (req, res) =>{
    Publicity.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', `Publicidade Deletada com Sucesso!`)
        res.redirect('/admin/publicity')
    }).catch((erro) => {
        req.flash('error_msg' `Houve um erro ao deletar a Categoria`)
        res.redirect('/admin/publicity')
    });
});

// Companys
router.get('/company', (req, res) => {
    Company.find().then((company) => {
        res.render('admin/companys/company', {company: company.map(Company => Company.toJSON())})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro ao listar')
        res.redirect('/admin/index')
    })})

router.get('/addcompany', (req, res) => {
    res.render('admin/companys/addcompany')
})

router.post('/addcompany', (req, res) => {
    var err_name = [];
    var err_company = [];
    var err_payment = [];
    var err_time = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.company || typeof req.body.company == undefined || req.body.company == null){
        err_company.push({text: 'Empresa inválido, corrija.'})
    } 

    if(req.body.company.length < 2){
        err_company.push({text: 'Empresa muito curta, corrija.'}) 
    }
    
    if(!req.body.payment || typeof req.body.payment == undefined || req.body.payment == null){
        err_payment.push({text: 'Pagamento inválido, corrija.'})
    } 

    if(req.body.payment.length > 5){
        err_payment.push({text: 'Preço não pode ser maior que 5 digitos, corrija.'}) 
    }

    if(!req.body.time || typeof req.body.time == undefined || req.body.time == null){
        err_time.push({text: 'Tempo Inválido, corrija.'})
    }
    
    
    if(err_name > 0 || err_company > 0 || err_payment > 0 || err_time > 0){
        res.render('admin/companys/addcompany', {
            err_name: err_name,
            err_company: err_company,
            err_payment: err_payment,
            err_time: err_time
        })
    }else{

        const newCompany = {
            name: req.body.name,
            company: req.body.company,
            payment: req.body.payment,
            time: req.body.time
        }

        new Company(newCompany).save().then(() => {
            console.log('Empresa Registrada!')
            req.flash('success_msg', 'Empresa criada com Sucesso!')
            res.redirect('/admin/company')
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Falha ao Registrar. Tente Novamente')
            res.redirect('/admin/addcompany')
        })
    }
})


router.get('/editcompany/:id', (req, res) => {
    Company.findOne({_id: req.params.id}).lean().then((companys) =>{
        res.render('admin/companys/editcompany', {companys: companys})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Empresa não existe!')
        res.redirect('/admin/company')
    })
})

router.post('/editcompany', (req, res) => {
    var err_name = [];
    var err_company = [];
    var err_payment = [];
    var err_time = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome Inválido, corrija.'})
    }

    if(req.body.name.length < 3){
        err_name.push({text: 'Nome muito curto, corrija.'}) 
    }

    if(!req.body.company || typeof req.body.company == undefined || req.body.company == null){
        err_company.push({text: 'Empresa inválido, corrija.'})
    } 

    if(req.body.company.length < 2){
        err_company.push({text: 'Empresa muito curta, corrija.'}) 
    }
    
    if(!req.body.payment || typeof req.body.payment == undefined || req.body.payment == null){
        err_payment.push({text: 'Pagamento inválido, corrija.'})
    } 

    if(req.body.payment.length > 5){
        err_payment.push({text: 'Preço não pode ser maior que 5 digitos, corrija.'}) 
    }

    if(!req.body.time || typeof req.body.time == undefined || req.body.time == null){
        err_time.push({text: 'Tempo Inválido, corrija.'})
    }
    
    
    if(err_name > 0 || err_company > 0 || err_payment > 0 || err_time > 0){
        res.render('admin/companys/editcompany', {
            err_name: err_name,
            err_company: err_company,
            err_payment: err_payment,
            err_time: err_time
        })
    }else{
        Company.findOne({_id: req.body.id}).then((companys) => {
            companys.name = req.body.name,
            companys.company = req.body.company,
            companys.payment = req.body.payment,
            companys.time = req.body.time

            companys.save().then(() => {
                req.flash('success_msg', 'Empresa editada com sucesso!')
                res.redirect('/admin/company')
            }).catch((err) => {
                console.log(err)
                req.flash('Não foi possivel editar, tente novamente!')
                res.redirect('/admin/company')
            })

        })
    }
})

router.post('/deletecompany/:id', (req, res) =>{
    Company.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', `Empresa Deletada com Sucesso!`)
        res.redirect('/admin/company')
    }).catch((err) => {
        req.flash('error_msg' `Houve um erro ao deletar a Categoria`)
        res.redirect('/admin/company')
    });
});


module.exports = router