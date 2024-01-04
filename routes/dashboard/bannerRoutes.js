const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const bannerController = require('../../controllers/dashboard/bannerController')

router.post('/banner-add', authMiddleware, bannerController.add_banner)
router.get('/banner-get', authMiddleware, bannerController.get_banner)
router.post('/delete-banner', authMiddleware, bannerController.delete_banner);

module.exports = router