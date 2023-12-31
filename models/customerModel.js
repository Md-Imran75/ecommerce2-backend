const { Schema, model } = require('mongoose')

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    favoriteBike: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
        default : ''
    },
    method: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = model('customers', customerSchema)