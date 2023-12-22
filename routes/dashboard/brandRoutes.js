const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const brandController = require('../../controllers/dashboard/brandController')

router.post('/brand-add', authMiddleware, brandController.add_brand)
router.get('/brand-get', authMiddleware, brandController.get_brand)

module.exports = router