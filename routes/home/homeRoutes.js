const router = require('express').Router()
const homeControllers = require('../../controllers/home/homeControllers')
router.get('/get-models', homeControllers.get_models)
router.get('/get-brands', homeControllers.get_brands)
router.get('/get-products', homeControllers.get_products)
router.get('/get-product/:slug', homeControllers.get_product)
router.get('/price-range-latest-product', homeControllers.price_range_product)
router.get('/query-products', homeControllers.query_products)
router.get('/query-products-brand', homeControllers.query_products_brand)



module.exports = router