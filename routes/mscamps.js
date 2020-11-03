const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.json({msg: '获取全部列表'})
})

router.post('/', (req,res) => {
    res.json({msg: '添加单个数据'})
})

router.get('/:id', (req,res) => {
    res.json({msg: `根据${req.params.id}获取单条数据`})
})

router.put('/:id', (req,res) => {
    res.json({msg: `根据${req.params.id}更新单挑数据`})
})

router.delete('/:id', (req,res) => {
    res.json({msg: `根据${req.params.id}删除数据`})
})

module.exports = router
