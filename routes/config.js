const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Admin')
const Admin = mongoose.model('admins')

require('../models/Neighborhood')
const Neighborhood = mongoose.model('neighborhoods')

router.get('/admin', (req, res) => {
    Admin.find().then((admins) => {
        res.render('admin/admin', {admins: admins.map(Admin => Admin.toJSON())})
    }).catch((err) => {
        console.log(err, "Não foi possivel listar os Admins")
        res.redirect('/admin/index')
    })
})

router.post('/deleteadmin/:id', (req, res) =>{
    Admin.findOneAndDelete({_id: req.params.id}).then(() => {
        console.log(`Admin Deletada com Sucesso!`)
        res.redirect('/config/admin')
    }).catch((erro) => {
        console.log(`Houve um erro ao deletar o Admin`)
        res.redirect('/config/admin')
    });
});

router.get('/neighborhood', (req, res) => {
    Neighborhood.find().then((neighborhood) => {
        res.render('admin/neighborhoods/neighborhood', {neighborhood: neighborhood.map(Neighborhood => Neighborhood.toJSON())})
    })

})

router.get('/addneighborhood', (req, res) => {
    res.render('admin/neighborhoods/addneighborhood')
})

router.post('/addneighborhood', (req, res) => {
    var err_name = []
    var err_subdistrict = []

    if(!req.body.name || req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome invalido, corrija'})
    }

    if(req.body.name < 3){
        err_name.push({text:'Nome muito curto, minímo de 3 caracteres.'})
    }

    if(!req.body.subdistrict || req.body.subdistrict == undefined || req.body.subdistrict == null){
        err_subdistrict.push({text: 'Sub-Ditrito invalido, corrija'})
    }

    if(req.body.subdistrict < 3){
        err_subdistrict.push({text: 'Sub-distrito muito curto, minímo de 3 caracteres.'})
    }

    if(err_name.length > 0 || err_subdistrict.length > 0){
        res.render('admin/neighborhoods/addneighborhood', {
            err_name: err_name,
            err_subdistrict: err_subdistrict,
        })
    }else{
        const newNeighborhood = {
            name: req.body.name,
            subdistrict: req.body.subdistrict
        }

        new Neighborhood(newNeighborhood).save().then(() => {
            console.log('Bairro registrdo!')
            req.flash('success_msg', 'Bairro registrado sucesso!')
            res.redirect('/config/neighborhood')
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Falha ao registrar. Tente novamente!')
            res.redirect('/config/addneighborhood')
        })
    }
})

router.get('/editneighborhood/:id', (req, res) => {
    Neighborhood.findOne({_id:req.params.id}).lean().then((neighborhood) =>{
        res.render('admin/neighborhoods/editneighborhood', {neighborhood: neighborhood})
    }).catch((err) => {
        req.flash('error_msg', 'Bairro inexistente!')
        res.redirect('/config/neighborhood')
    })
})

router.post('/editneighborhood', (req, res) => {
    var err_name = []
    var err_subdistrict = []

    if(!req.body.name || req.body.name == undefined || req.body.name == null){
        err_name.push({text: 'Nome invalido, corrija'})
    }

    if(req.body.name < 3){
        err_name.push({text:'Nome muito curto, minímo de 3 caracteres.'})
    }

    if(!req.body.subdistrict || req.body.subdistrict == undefined || req.body.subdistrict == null){
        err_subdistrict.push({text: 'Sub-Ditrito invalido, corrija'})
    }

    if(req.body.subdistrict < 3){
        err_subdistrict.push({text: 'Sub-distrito muito curto, minímo de 3 caracteres.'})
    }

    if(err_name.length > 0 || err_subdistrict.length > 0){
        res.render('admin/neighborhoods/editneighborhood', {
            err_name: err_name,
            err_subdistrict: err_subdistrict,
        })
    }else{
        Neighborhood.findOne({_id: req.body.id}).then((neighborhood) => {

            neighborhood.name = req.body.name
            neighborhood.subdistrict = req.body.subdistrict


            neighborhood.save().then(() => {
                console.log('Bairro Editado!')
                req.flash('success_msg', 'Bairro alterado com sucesso!')
                res.redirect('/config/neighborhood')
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possivel editar, tente novamente!')
                res.redirect('/config/neighborhood')
            })
        })
    }
})

router.post('/deleteneighborhood/:id', (req, res) => {
    Neighborhood.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', `Bairro Deletado com Sucesso!`)
        res.redirect('/config/neighborhood')
    }).catch((err) => {
        req.flash('error_msg' `Houve um erro ao deletar o Bairro`)
        res.redirect('/config/neighborhood')
    });
})

module.exports = router