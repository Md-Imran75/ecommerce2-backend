const {Schema , model} = require('mongoose')

const sellerSchema = new Schema({
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


    role: {
        type: String,
        default : 'seller'
    },

    status: {
        type: String,
        default : 'pending'
    },

    image: {
        type: String,
        default : ''
    },

    shopInfo: {
        type: Object,
        default : {}
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,


},{timestamps : true});

sellerSchema.index({
    name: 'text',
    email: 'text'
}, {
    weights: {
        name: 5,
        email: 4,
    }
})

module.exports = model('sellers' , sellerSchema)