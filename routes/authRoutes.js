const router = require('express').Router()
const {authMiddleware} = require('../middlewares/authMiddleware')
const authControllers = require('../controllers/authControllers')

router.post('/admin-login', authControllers.admin_login)
router.post('/seller-login', authControllers.seller_login)

router.get('/get-user', authMiddleware , authControllers.getUser)

router.post('/seller-register', authControllers.seller_register)

router.post('/profile-image-upload', authMiddleware, authControllers.profile_image_upload)
router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add)
router.get('/logout',authMiddleware,authControllers.logout)
router.post('/seller-change-password', authControllers.seller_change_password);
router.post('/admin-change-seller-password', authControllers.admin_change_seller_password);



module.exports = router