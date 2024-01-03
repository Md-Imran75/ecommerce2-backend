const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const modelController = require('../../controllers/dashboard/modelController')

router.post('/model-add', authMiddleware, modelController.add_model)
router.get('/model-get', authMiddleware, modelController.get_model)
router.post('/delete-model', authMiddleware, modelController.delete_model);

module.exports = router