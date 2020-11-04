const express = require('express')
const dotenv = require('dotenv')

// 引入mscamps 路由
const mscamps = require('./routes/mscamps')

dotenv.config({
    path: './config/config.env'
})

const app = express()

// 使用 mscamps路由
app.use('/api/v1/mscamps', mscamps)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})