const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Admin = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    eUser: {
        type: Number,
        default: 1
    },

    eStylist: {
        type: Number,
        default: 1
    },

    eAdmin: {
        type: Number,
        default: 1
    },

    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('admins', Admin)