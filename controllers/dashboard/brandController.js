const brandModel = require('../../models/brandModel')
const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const { IncomingForm } = require('formidable')

class brandController {

    add_brand = async (req, res) => {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {


            if (err) {
                responseReturn(res, 404, { error: 'something went wrong' })
            } else {
                let { name } = fields
                let { image } = files
 
                console.log(name)
                console.log(image)

                if (Array.isArray(name)) {
                    name = name[0];
                }

                name = name.trim()
                const slug = name.split(' ').join('-')



                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })



                try {

                    const result = await cloudinary.uploader.upload(String(image[0].filepath), { folder: 'brands' });
                     console.log('result',result)

                    if (result && result.url) {
                        const brand = await brandModel.create({
                            name,
                            slug,
                            image: result.url
                        })
                        responseReturn(res, 201, { brand, message: 'brand add success' })
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed' })
                    }
                } catch (error) {
                    console.log( 'errror' , error)
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }

    get_brand = async (req, res) => {
        const { page, searchValue, perPage } = req.query
        try {
            let skipPage = ''
            if (perPage && page) {
                skipPage = parseInt(perPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && perPage) {
                const brands = await brandModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalbrand = await brandModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalbrand, brands })
            }
            else if (searchValue === '' && page && perPage) {
                const brands = await brandModel.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalbrand = await brandModel.find({}).countDocuments()
                responseReturn(res, 200, { totalbrand, brands })
            }
            else {
                const brands = await brandModel.find({}).sort({ createdAt: -1 })
                const totalbrand = await brandModel.find({}).countDocuments()
                responseReturn(res, 200, { totalbrand, brands })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = new brandController