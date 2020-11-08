const express = require('express')
// 合并路由 mergeParams
const router = express.Router({ mergeParams: true})
const { getCourses, getCourse, updateCourse, deleteCourse } = require('../controller/courses')

const advancedResults = require('../middleware/advancedResults')
const Courses = require('../modles/courses')
// http://localhost:5000/api/v1/courses
router.route('/').get(advancedResults(Courses, {
  path: 'mscamp',
  select: 'name description'
}), getCourses)

// http://localhost:5000/api/v1/courses/:id
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
