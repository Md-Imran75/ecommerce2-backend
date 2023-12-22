const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    sellerId: {
        type: Schema.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    regYear: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    cc: {
        type: Number,
        required: true
    },
    kilometerAs: {
        type: Number,
        required: true
    },
    ml: {
        type: Number,
        required: true
    },
    fi: {
        type: String,
        required: true
    },
    abs: {
        type: String,
        required: true
    },
    taxValid: {
        type: String,
        required: true
    },
    productImages: {
        type: Array,
        required: true
    },
    documentImages: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default : 'pending'
    },
}, { timestamps: true })



productSchema.index({
    name: 'text',
    model: 'text',
    brand: 'text',
    description: 'text'
}, {
    weights: {
        name: 5,
        model: 4,
        brand: 3,
        description: 2
    }
})

module.exports = model('products', productSchema)