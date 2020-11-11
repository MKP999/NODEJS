const express = require('express')
// 合并路由 mergeParams
const router = express.Router()
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controller/users')

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const User = require('../modles/users')

// 路由鉴权 角色路由
const { protect, authorize } = require('../middleware/auth')

// 全部统一使用
router.use(protect)
router.use(authorize('admin'))

// http://localhost:5000/api/v1/courses
router.route('/').get(advancedResults(User), getUsers).post(createUser)

// http://localhost:5000/api/v1/courses/:id
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
