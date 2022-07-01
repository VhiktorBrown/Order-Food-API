const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
        required: true,
        trim : true,
        default: 'No description'
    },
    price : {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    stars : {
        type: Number,
        default: 4,
    },
    image : {
        type: String,
        required: true,
        trim: true,
    },
    location : {
        type: String,
        required: true,
        trim: true,
    }
},
{
    timestamps: true
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product