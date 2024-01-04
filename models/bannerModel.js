const { Schema, model } = require('mongoose')

const bannerSchema = new Schema({
 
    image: {
        type: String,
        required: true
    },
  
}, { timestamps: true })


module.exports = model('banners', bannerSchema)