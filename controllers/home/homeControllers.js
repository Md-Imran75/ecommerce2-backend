const modelModel = require('../../models/modelModel')
const brandModel = require('../../models/brandModel')
const productModel = require('../../models/productModel')
const queryProducts = require('../../utils/queryProducts')


const {
    responseReturn
} = require('../../utils/response')
class homeControllers {

    
    get_models = async (_req, res) => {
        
        try {
            const models = await modelModel.find({})
            responseReturn(res, 200, {
                models
            })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }

    get_brands = async (_req, res) => {
        try {
            const brands = await brandModel.find({})
            responseReturn(res, 200, {
                brands
            })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }

    get_products = async (_req, res) => {
        try {
            const products = await productModel.find({}).limit(20).sort({
                createdAt: -1
            })
            // const allProduct1 = await productModel.find({}).limit(15).sort({
            //     createdAt: -1
            // })
            // const latest_product = this.formateProduct(allProduct1);
            const latest_product = await productModel.find({}).limit(15).sort({
                  createdAt: -1})
           
            responseReturn(res, 200, {
                products,
                latest_product,                
            })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }

    get_product = async (req, res) => {
        const {
            slug
        } = req.params
        try {
            const product = await productModel.findOne({
                slug
            })
            const relatedProducts = await productModel.find({
                $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    model: {
                        $eq: product.model
                    }
                }
                ]
            }).limit(20)
            const moreProducts = await productModel.find({

                $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    sellerId: {
                        $eq: product.sellerId
                    }
                }
                ]
            }).limit(3)
            responseReturn(res, 200, {
                product,
                relatedProducts,
                moreProducts
            })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }

    price_range_product = async (_req, res) => {
        try {
            const priceRange = {
                low: 0,
                high: 0
            }
           
            const latest_product = await productModel.find({}).limit(20).sort({
                createdAt: -1
            });
            const getForPrice = await productModel.find({}).sort({
                'price': 1
            })
            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1].price
                priceRange.low = getForPrice[0].price
            }
            responseReturn(res, 200, {
                latest_product,
                priceRange
            })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }

    query_products = async (req, res) => {
        const perPage = 10
        req.query.perPage = perPage
        try {
            const products = await productModel.find({}).sort({
                createdAt: -1
            })
            const totalProduct = new queryProducts(products, req.query).modelQuery().searchQuery().priceQuery().sortByPrice().countProducts();

            const result = new queryProducts(products, req.query).modelQuery().searchQuery().priceQuery().sortByPrice().skip().limit().getProducts();

            responseReturn(res, 200, {
                products: result,
                totalProduct,
                perPage
            })

        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }


    query_products_brand = async (req, res) => {
        const perPage = 15
        req.query.perPage = perPage
        try {
            const products = await productModel.find({}).sort({
                createdAt: -1
            })
            const totalProduct = new queryProducts(products, req.query).brandQuery().searchQuery().priceQuery().sortByPrice().countProducts();

            const result = new queryProducts(products, req.query).brandQuery().searchQuery().priceQuery().sortByPrice().skip().limit().getProducts();
              console.log('result' , result)
            responseReturn(res, 200, {
                products: result,
                totalProduct,
                perPage
            })

        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })

        }
    }


}

module.exports = new homeControllers()