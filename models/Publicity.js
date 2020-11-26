const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Publicity = new Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    description: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('publicitys', Publicity) 