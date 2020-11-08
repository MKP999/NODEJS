const express = require('express')
const router = express.Router()
const { getMscamps, createMscamp, getMscamp, updateMscamp, deleteMscamp } = require('../controller/ascamps')

// 定向路由  http://localhost:5000/api/v1/mscamps/5d713a66ec8f2b88b8f830b8/courses
const { getCourses, createCourse } = require('../controller/courses')
router.route('/:mscampsID/courses').get(getCourses).post(createCourse)

// 高级查询方法中间件引入
const advancedResults = require('../middleware/advancedResults')
const Mscamp = require('../modles/mscamps')

// http://localhost:5000/api/v1/mscamps
router.route('/').get(advancedResults(Mscamp, 'courses'), getMscamps).post(createMscamp)

// http://localhost:5000/api/v1/mscamps/:id
router.route('/:id').get(getMscamp).put(updateMscamp).delete(deleteMscamp)

module.exports = router
