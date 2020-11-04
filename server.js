const express = require('express')
const dotenv = require('dotenv')
// 中间件
const morgan = require('morgan')
const colors = require('colors')
// 引入数据库
const connectDB = require('./config/db')

// 引入mscamps 路由
const mscamps = require('./routes/mscamps')

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

// 使用 mscamps路由
app.use('/api/v1/mscamps', mscamps)

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
  