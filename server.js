const express = require('express')
const {dbConnect} = require('./utils/db')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
require('dotenv').config()
const socket = require('socket.io')

const server = http.createServer(app)

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}))





const io = socket(server, {
    cors: {
        origin: '*',
        transports: ['websocket', 'polling'],
        credentials: true
    }
})


var allSeller = []

const addSeller = (sellerId, socketId, userInfo) => {
    const chaeckSeller = allSeller.some(u => u.sellerId === sellerId)
    if (!chaeckSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
}



const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId)
}

const remove = (socketId) => {
    allSeller = allSeller.filter(c => c.socketId !== socketId)
}

let admin = {}

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {}
    }
}


io.on('connection', (soc) => {
    console.log('socket server is connected...')

    
    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('add_admin', (adminInfo) => {
        delete adminInfo.email
        admin = adminInfo
        admin.socketId = soc.id
        io.emit('activeSeller', allSeller)
        io.emit('activeAdmin', { status: true })

    })
    

    soc.on('send_message_admin_to_seller', msg => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg)
        }
    })


    soc.on('send_message_seller_to_admin', msg => {

        if (admin.socketId) {
            console.log('Received seller message:', msg);
            soc.to(admin.socketId).emit('receved_seller_message', msg)
        }
    })


    soc.on('disconnect', () => {
        remove(soc.id);
        removeAdmin(soc.id);
        io.emit('activeAdmin', { status: false });
        io.emit('activeSeller', allSeller);
    });
})


app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api', require('./routes/chatRoutes'))

app.use('/api' , require('./routes/authRoutes'))
app.use('/api' , require('./routes/dashboard/modelRoutes'))
app.use('/api' , require('./routes/dashboard/sellerRoutes'))
app.use('/api' , require('./routes/dashboard/brandRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api/home', require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/home/customerAuthRoutes'))
app.use('/api', require('./routes/home/cartRoutes'))
app.use('/api', require('./routes/order/orderRoutes'))

app.get('/' , (_req , res) => res.send('Hello world') )


const port = process.env.PORT
dbConnect()
server.listen(port , () => console.log(`Server is listening on port ${port}`))
