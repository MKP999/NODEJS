const express = require('express')
const dotenv = require('dotenv')

dotenv.config({
    path: './config/config.env'
})

const app = express()

app.get('/', (req,res) => {
    res.send('hello')
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})