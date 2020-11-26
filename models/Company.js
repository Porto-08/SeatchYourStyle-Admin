const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Company = new Schema({
    name: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },
    
    payment: {
        type: Number,
        required: true
    },

    time: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('companys', Company)