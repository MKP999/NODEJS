const express = require('express')
const dotenv = require('dotenv')
// 中间件
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require("cookie-parser")

// 引入数据库
const connectDB = require('./config/db')

// 引入路由 
const mscamps = require('./routes/mscamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

// 引入error报错中间件
const errorHandler = require('./middleware/error')
// 引入异步处理中间件
const asyncHandler = require('./middleware/async')

dotenv.config({
    path: './config/config.env'
})

// 连接数据库
connectDB()

const app = express()

// 配置 json
app.use(express.json())

// 使用morgan 中间件 仅在开发环境打印
app.use(morgan('dev'))

// 使用cookie中间件
app.use(cookieParser())

// 使用路由
app.use('/api/v1/mscamps', mscamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

// 一定要在路由绑定后使用
app.use(errorHandler)
app.use(asyncHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red.bold)
})

// 监听数据库
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // 关闭服务器 & 退出进程
    server.close(() => {
      process.exit(1);
    });
  });
  