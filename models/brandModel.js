const { Schema, model } = require('mongoose')

const brandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
}, { timestamps: true })

brandSchema.index({
    name: 'text'
})

module.exports = model('brands', brandSchema)