const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Neighborhood = new Schema({
    name: {
        type: String,
        required: true
    },

    subdistrict: {
        type: String,
        required: true
    }

})


mongoose.model('neighborhoods', Neighborhood)