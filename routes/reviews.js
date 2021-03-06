const express = require('express')
// 合并路由 mergeParams
const router = express.Router({ mergeParams: true})
const { getReviews, getReview ,createReviews, updateReview, deleteReviews } = require('../controller/reviews')

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const Reviews = require('../modles/reviews')

// 路由鉴权 角色路由
const { protect, authorize } = require('../middleware/auth')

// http://localhost:5000/api/v1/courses
router.route('/').get(advancedResults(Reviews, {
  path: 'mscamp',
  select: 'name description'
}), getReviews).post(protect, authorize('admin', 'user'), createReviews)

router.route('/:id').get(protect, authorize('admin', 'user'), getReview).put(protect, authorize('admin', 'user'), updateReview).delete(protect, authorize('admin', 'user'), deleteReviews)

module.exports = router
