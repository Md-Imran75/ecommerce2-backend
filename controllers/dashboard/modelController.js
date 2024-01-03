const modelModel = require('../../models/modelModel')
const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const { IncomingForm } = require('formidable')

class modelController {

    add_model = async (req, res) => {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {


            if (err) {
                responseReturn(res, 404, { error: 'something went wrong' })
            } else {
                let { name } = fields
                let { image } = files




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

                    const result = await cloudinary.uploader.upload(String(image[0].filepath), { folder: 'models' });


                    if (result && result.url) {
                        const model = await modelModel.create({
                            name,
                            slug,
                            image: result.url
                        })
                        responseReturn(res, 201, { model, message: 'model add success' })
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed' })
                    }
                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }

    delete_model = async (req, res) => {
        const { modelId } = req.body;
        try {
            await modelModel.findByIdAndDelete(modelId);
            responseReturn(res, 200, { message: 'Model deleted successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
    
    

    get_model = async (req, res) => {
        const { page, searchValue, perPage } = req.query
        try {
            let skipPage = ''
            if (perPage && page) {
                skipPage = parseInt(perPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && perPage) {
                const models = await modelModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalmodel = await modelModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalmodel, models })
            }
            else if (searchValue === '' && page && perPage) {
                const models = await modelModel.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalmodel = await modelModel.find({}).countDocuments()
                responseReturn(res, 200, { totalmodel, models })
            }
            else {
                const models = await modelModel.find({}).sort({ createdAt: -1 })
                const totalmodel = await modelModel.find({}).countDocuments()
                responseReturn(res, 200, { totalmodel, models })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = new modelController