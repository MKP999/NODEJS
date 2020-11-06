const express = require('express')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config({
    path: './config/config.env'
})

// 引入数据库mscamps构造器
const Mscamp = require('./modles/mscamps')
const { json } = require('express')

// 连接数据库
mongoose.connect(process.env.NET_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// 读取本地数据
const mscamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/mscamps.json`, "utf-8"))

// 数据导入到 mongoose数据库
const importData = async () => {
    try {
        await Mscamp.create(mscamps)
        console.log('数据存储成功'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

// 删除到 mongoose数据库
const deleteData = async () => {
    try {
        await Mscamp.deleteMany()
        console.log('数据删除成功'.red.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

// 设置命令行 进行存储数据或删除数据
// console.log(process.argv);
if (process.argv[2] == "-i") {
    importData();
  } else if (process.argv[2] == "-d") {
    deleteData();
  }
  