const express = require('express')
const {dbConnect} = require('./utils/db')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}))



app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api' , require('./routes/authRoutes'))
app.use('/api' , require('./routes/dashboard/modelRoutes'))
app.use('/api' , require('./routes/dashboard/sellerRoutes'))
app.use('/api' , require('./routes/dashboard/brandRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api/home', require('./routes/home/homeRoutes'))
// app.use('/api', require('./routes/order/orderRoutes'))
// app.use('/api', require('./routes/home/cartRoutes'))
// app.use('/api', require('./routes/authRoutes'))

app.get('/' , (_req , res) => res.send('Hello world') )


const port = process.env.PORT
dbConnect()
app.listen(port , () => console.log(`Server is listening on port ${port}`))
