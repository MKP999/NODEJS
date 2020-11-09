const express = require('express')
// 合并路由 mergeParams
const router = express.Router({ mergeParams: true})
const { getCourses, getCourse, updateCourse, deleteCourse } = require('../controller/courses')

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const Courses = require('../modles/courses')

// 路由鉴权 角色路由
const { protect, authorize } = require('../middleware/auth')

// http://localhost:5000/api/v1/courses
router.route('/').get(advancedResults(Courses, {
  path: 'mscamp',
  select: 'name description'
}), getCourses)

// http://localhost:5000/api/v1/courses/:id
router.route('/:id').get(getCourse).put(protect, authorize('admin', 'user'), updateCourse).delete(protect, authorize('admin', 'user'), deleteCourse)

module.exports = router
