const express = require('express')
// 合并路由 mergeParams
const router = express.Router({ mergeParams: true})
const { getReviews } = require('../controller/reviews')

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const Reviews = require('../modles/reviews')

// 路由鉴权 角色路由
const { protect, authorize } = require('../middleware/auth')

// http://localhost:5000/api/v1/courses
router.route('/').get(advancedResults(Reviews, {
  path: 'mscamp',
  select: 'name description'
}), getReviews)

module.exports = router
