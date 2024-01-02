const router = require('express').Router()
const chatController = require('../controllers/chat/chatController')
const { authMiddleware } = require('../middlewares/authMiddleware')




router.get('/chat/admin/get-sellers', authMiddleware, chatController.get_sellers)

router.post('/chat/message-send-seller-admin', authMiddleware, chatController.seller_admin_message_insert)

router.get('/chat/get-admin-messages/:receverId', authMiddleware, chatController.get_admin_messages)

router.get('/chat/get-seller-messages', authMiddleware, chatController.get_seller_messages)

module.exports = router