const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Stylist = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    sexo: {
        type: String,
        required: true
    },

    phoneProfessional: {
        type: Number,
        required: true
    },

    cpf: {
        type: Number,
        required: true
    },

    specialty: {
        type: String,
        required: true
    },

    categories_one: {
        type: String,
        required: true
    },

    categories_two: {
        type: String,
        required: true
    },

    categories_three: {
        type: String,
        required: true
    },

    categories_for: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }

})

mongoose.models('stylists', Stylist)