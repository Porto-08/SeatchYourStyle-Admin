const mongooose = require('mongoose')
const Schema = mongooose.Schema;

const Categorie = new Schema({
    name: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    date: {
        type: String,
        default: Date.now()
    }

})

mongooose.model('categories', Categorie)