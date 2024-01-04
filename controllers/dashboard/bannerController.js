const bannerModel = require('../../models/bannerModel')
const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const { IncomingForm } = require('formidable')

class bannerController {
    add_banner = async (req, res) => {
        const form = new IncomingForm();
        form.parse(req, async (err, _fields, files) => {
          
    
            if (err) {
                responseReturn(res, 404, { error: 'something went wrong' });
            } else {
                const { image } = files;
    
    
                if (!image) {
                    responseReturn(res, 400, { error: 'No image uploaded' });
                    return;
                }
    
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });
    
                try {
                    const result = await cloudinary.uploader.upload(String(image[0].filepath), { folder: 'banners' });
    
                    if (result && result.url) {
                        const banner = await bannerModel.create({
                            image: result.url
                        });
    
                        responseReturn(res, 201, { banner, message: 'banner add success' });
                    } else {
                        console.log(err);
                        responseReturn(res, 404, { error: 'Image upload failed' });
                    }
                } catch (error) {
                    console.log(error);
                    responseReturn(res, 500, { error: 'Internal server error' });
                }
            }
        });
    };
    
    delete_banner = async (req, res) => {
        const { bannerId } = req.body;
        try {
            await bannerModel.findByIdAndDelete(bannerId);
            responseReturn(res, 200, { message: 'banner deleted successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
    
    

    get_banner = async (req, res) => {
        try {
            const banners = await bannerModel.find({}).sort({ createdAt: -1 });
            const totalbanner = await bannerModel.countDocuments();
    
            responseReturn(res, 200, { totalbanner, banners });
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
}

module.exports = new bannerController