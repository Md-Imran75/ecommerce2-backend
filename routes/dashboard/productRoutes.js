const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const productController = require('../../controllers/dashboard/productController')

router.post('/product-add', authMiddleware, productController.add_product)
router.get('/products-get', authMiddleware, productController.products_get)
router.get('/product-get/:productId', authMiddleware, productController.product_get)
router.post('/product-update', authMiddleware, productController.product_update)
router.post('/product-image-update', authMiddleware, productController.product_image_update)
router.post('/document-image-update', authMiddleware, productController.document_image_update)
router.post('/delete-product', authMiddleware, productController.delete_product);
router.get('/all-products-get-for-admin', authMiddleware, productController.allProducts_get_for_admin);
router.post('/product-status-update',authMiddleware,productController.product_status_update)
router.get('/request-product-get',authMiddleware,productController.get_product_request)

router.get('/get-productss',authMiddleware,productController.get_active_products)
router.get('/get-rejected-products',authMiddleware,productController.get_rejected_products)

module.exports = router