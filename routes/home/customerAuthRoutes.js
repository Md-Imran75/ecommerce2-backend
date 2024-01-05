const router = require('express').Router()
const customerAuthController = require('../../controllers/home/customerAuthControllers')
router.post('/customer/customer-register', customerAuthController.customer_register)
router.post('/customer/customer-login', customerAuthController.customer_login)
router.get('/customer/logout', customerAuthController.customer_logout)
router.post('/customer-change-password', customerAuthController.customer_change_password);
router.post('/forget-password', customerAuthController.forget_password);
router.post('/customer-profile-image-upload',  customerAuthController.customer_profile_image_upload)
module.exports = router