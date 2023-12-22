const { IncomingForm } = require('formidable')
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel');
const { responseReturn } = require('../../utils/response');
class productController {
    add_product = async (req, res) => {
        const { id } = req;
        const form = new IncomingForm({ multiples: true })

        form.parse(req, async (_err, field, files) => {
            let { name, cc, ml, fi, kilometerAs, regYear, taxValid, abs, model, description, stock, price, brand } = field;
            const { productImages } = files;
            const { documentImages } = files;

            if (Array.isArray(name)) {
                name = name[0];
            }
            if (Array.isArray(model)) {
                model = model[0];
            }
            if (Array.isArray(brand)) {
                brand = brand[0];
            }
            if (Array.isArray(description)) {
                description = description[0];
            }
            if (Array.isArray(fi)) {
                fi = fi[0];
            }
            if (Array.isArray(abs)) {
                abs = abs[0];
            }
            if (Array.isArray(taxValid)) {
                taxValid = taxValid[0];
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
                let allImageUrlProduct = [];
                let allImageUrlDocument = [];


                for (let i = 0; i < productImages.length; i++) {
                    const result = await cloudinary.uploader.upload(productImages[i].filepath, { folder: 'products' })
                    allImageUrlProduct = [...allImageUrlProduct, result.url]
                }

                for (let i = 0; i < documentImages.length; i++) {
                    const result = await cloudinary.uploader.upload(documentImages[i].filepath, { folder: 'documents' })
                    allImageUrlDocument = [...allImageUrlDocument, result.url]
                }

                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    regYear: parseInt(regYear),
                    cc: parseInt(cc),
                    ml: parseInt(ml),
                    kilometerAs: parseInt(kilometerAs),
                    taxValid,
                    fi,
                    abs,
                    model: model.trim(),
                    brand: brand.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    productImages: allImageUrlProduct,
                    documentImages: allImageUrlDocument,

                })


                responseReturn(res, 201, { message: "product add success" })
            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }

        })
    }
    products_get = async (req, res) => {
        const { page, searchValue, perPage } = req.query
        const { id } = req;

        const skipPage = parseInt(perPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()
                responseReturn(res, 200, { totalProduct, products })
            } else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({ sellerId: id }).countDocuments()
                responseReturn(res, 200, { totalProduct, products })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product })
        } catch (error) {
            console.log(error.message)
        }
    }
    product_update = async (req, res) => {
        let { name, cc, ml, fi, kilometerAs, regYear, taxValid, abs, description, price, productId, stock } = req.body;

        if (Array.isArray(name)) {
            name = name[0];
        }
        name = name.trim()
        const slug = name.split(' ').join('-')
        try {
            await productModel.findByIdAndUpdate(productId, {
                name, cc, ml, fi, kilometerAs, regYear, taxValid, abs, description, price, productId, stock, slug
            })
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product, message: 'product update success' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }


    product_image_update = async (req, res) => {
        const form = new IncomingForm({ multiples: true })
    
        form.parse(req, async (err, field, files) => {
            const { productId, oldImage } = field;
            const { newImage } = files;
    
            if (err) {
                responseReturn(res, 404, { error: err.message });
            } else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });
    
                    const result = await cloudinary.uploader.upload(newImage[0].filepath, { folder: 'products' });
                        console.log('product',result)
                    if (result) {
                        let { productImages } = await productModel.findById(productId);
                        // Check for a substring match instead of exact match
                        const index = productImages.findIndex(img => img.includes(oldImage));
                        if (index !== -1) {
                            const newProductImages = [...productImages];
                            newProductImages[index] = result.url;
    
                            await productModel.findOneAndUpdate(
                                { _id: productId },
                                { $set: { productImages: newProductImages } },
                                { new: true }
                            );
                        }
    
                        const product = await productModel.findById(productId);
                        responseReturn(res, 200, { product, message: 'product image update success' });
                    } else {
                        responseReturn(res, 404, { error: 'image upload failed' });
                    }
                } catch (error) {
                    responseReturn(res, 404, { error: error.message });
                }
            }
        });
    };
    
    


    document_image_update = async (req, res) => {
        const form = new IncomingForm({ multiples: true })
    
        form.parse(req, async (err, field, files) => {
            const { productId, oldImage } = field;
            const { newImage } = files;
    
            if (err) {
                responseReturn(res, 404, { error: err.message });
            } else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });
    
                    const result = await cloudinary.uploader.upload(newImage[0].filepath, { folder: 'documents' });
                    console.log(result)
                    if (result) {
                        let { documentImages } = await productModel.findById(productId);
                        // Check for a substring match instead of exact match
                        const index = documentImages.findIndex(img => img.includes(oldImage));
                        if (index !== -1) {
                            const newDocumentImages = [...documentImages];
                            newDocumentImages[index] = result.url;
    
                            await productModel.findOneAndUpdate(
                                { _id: productId },
                                { $set: { documentImages: newDocumentImages } },
                                { new: true }
                            );
                        }
    
                        const product = await productModel.findById(productId);
                        responseReturn(res, 200, { product, message: 'document image update success' });
                    } else {
                        responseReturn(res, 404, { error: 'image upload failed' });
                    }
                } catch (error) {
                    responseReturn(res, 404, { error: error.message });
                }
            }
        });
    };
    
}

module.exports = new productController()