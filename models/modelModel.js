const { Schema, model } = require('mongoose')

const modelSchema = new Schema({
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

modelSchema.index({
    name: 'text'
})

module.exports = model('models', modelSchema)