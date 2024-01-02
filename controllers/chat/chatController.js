const sellerModel = require('../../models/sellerModel')
const adminSellerMessage = require('../../models/chat/adminSellerMessage')
const { responseReturn } = require('../../utils/response')


class chatController {
    
    

    get_sellers = async (_req, res) => {
        try {
            const sellers = await sellerModel.find({})
            responseReturn(res, 200, { sellers })
        } catch (error) {
            console.log(error)
        }
    }

    seller_admin_message_insert = async (req, res) => {
        const { senderId, receverId, message, senderName } = req.body
        try {
            const messageData = await adminSellerMessage.create({
                senderId,
                receverId,
                senderName,
                message
            })
            responseReturn(res, 200, { message: messageData })
        } catch (error) {
            console.log(error)
        }
    }

    get_admin_messages = async (req, res) => {

        const { receverId } = req.params;
        const id = ""
        try {
            const messages = await adminSellerMessage.find({
                $or: [
                    {
                        $and: [{
                            receverId: { $eq: receverId }
                        }, {
                            senderId: {
                                $eq: id
                            }
                        }]
                    },
                    {
                        $and: [{
                            receverId: { $eq: id }
                        }, {
                            senderId: {
                                $eq: receverId
                            }
                        }]
                    }
                ]
            })
            let currentSeller = {}
            if (receverId) {
                currentSeller = await sellerModel.findById(receverId)
            }
            responseReturn(res, 200, { messages, currentSeller })
        } catch (error) {
            console.log(error)
        }
    }

    get_seller_messages = async (req, res) => {

        const receverId = ""
        const { id } = req
        try {
            const messages = await adminSellerMessage.find({
                $or: [
                    {
                        $and: [{
                            receverId: { $eq: receverId }
                        }, {
                            senderId: {
                                $eq: id
                            }
                        }]
                    },
                    {
                        $and: [{
                            receverId: { $eq: id }
                        }, {
                            senderId: {
                                $eq: receverId
                            }
                        }]
                    }
                ]
            })
            responseReturn(res, 200, { messages })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new chatController()