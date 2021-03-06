const express = require('express')
const router = express.Router()
const { getMscamps, createMscamp, getMscamp, updateMscamp, deleteMscamp } = require('../controller/ascamps')
// 路由鉴权 角色路由
const { protect, authorize } = require('../middleware/auth')

// 定向路由  http://localhost:5000/api/v1/mscamps/5d713a66ec8f2b88b8f830b8/courses
const { getCourses, createCourse } = require('../controller/courses')
router.route('/:mscampsID/courses').get(getCourses).post(protect, authorize('admin', 'user'), createCourse)

// 定向路由  http://localhost:5000/api/v1/mscamps/5d713a66ec8f2b88b8f830b8/reviews
const { getReviews, createReviews } = require('../controller/reviews')
router.route('/:mscampsID/reviews').get(getReviews).post(protect, authorize('admin', 'user'), createReviews)

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const Mscamp = require('../modles/mscamps')


// http://localhost:5000/api/v1/mscamps
router.route('/').get(advancedResults(Mscamp, 'courses'), getMscamps).post(protect, authorize('admin', 'user'), createMscamp)

// http://localhost:5000/api/v1/mscamps/:id
router.route('/:id').get(getMscamp).put(protect, authorize('admin', 'user'), updateMscamp).delete(protect, authorize('admin', 'user'), deleteMscamp)

module.exports = router
