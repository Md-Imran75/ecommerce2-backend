const authorOrder = require('../../models/adminOrderModel.js')
const customerOrder = require('../../models/customerOrder')
const sellerWallet = require('../../models/sellerWallet.js')
const myShopWallet = require('../../models/myShopWallet')
const sellerModel = require('../../models/sellerModel')

const adminSellerMessage = require('../../models/chat/adminSellerMessage')
const productModel = require('../../models/productModel')

const { mongo: { ObjectId } } = require('mongoose')
const { responseReturn } = require('../../utils/response')

module.exports.get_seller_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        // const totalSele = await sellerWallet.aggregate([
        //     {
        //         $match: {
        //             sellerId: {
        //                 $eq: id
        //             }
        //         }
        //     }, {
        //         $group: {
        //             _id: null,
        //             totalAmount: { $sum: '$amount' }
        //         }
        //     }
        // ])

        const totalProduct = await productModel.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalOrder = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalPendingOrder = await authorOrder.find({
            $and: [
                {
                    sellerId: {
                        $eq: new ObjectId(id)
                    }
                },
                {
                    delivery_status: {
                        $eq: 'pending'
                    }
                }
            ]
        }).countDocuments()

       

        const recentOrders = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).limit(5)

        responseReturn(res, 200, {
            totalOrder,
            // totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
            totalPendingOrder,
            recentOrders,
            totalProduct
        })
    } catch (error) {
        console.log('get seller dashboard data error ' + error)
        responseReturn(res, 500, { error: 'Internal server error' })

    }
}

module.exports.get_admin_dashboard_data = async (req, res) => {
    const { id } = req
    try {
        const totalSele = await myShopWallet.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])


        const totalProduct = await productModel.find({}).countDocuments()

        const totalOrder = await customerOrder.find({}).countDocuments()

        const totalSeller = await sellerModel.find({}).countDocuments()

        const messages = await adminSellerMessage.find({}).limit(3)

        const recentOrders = await customerOrder.find({}).limit(5)

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
            totalSeller,
            messages,
            recentOrders,
            totalProduct
        })

    } catch (error) {
        console.log('get admin dashboard data error ' + error.messages)
        responseReturn(res, 500, { error: 'Internal server error' })

    }

}