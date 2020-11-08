const Courses = require("../modles/courses")
const Mscamps = require("../modles/mscamps")
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')


/**
 * @desc    获取米修课程数据
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/mscamps/mscampsID/courses
 * @access  公开的
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.mscampsID) {
    const courses = await Courses.find({mscamp: req.params.mscampsID})
    res.status(200).json({success: true, total: courses.length, data: courses})
  } else {
    res.status(200).json(res.advancedResults)
  }  
})

/**
 * @desc    根据ID获取某个课程
 * @route   GET /api/v1/courses/:id
 * @access  公开的
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id)
  if (!course) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
  res.status(200).json({success: true, data: course})
})

/**
 * @desc    创建课程数据
 * @route   POST /api/v1/mscamps/mscampsID/courses
 * @access  私有的
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // 获取该培训营
  const mscamp = await Mscamps.findById(req.params.mscampsID)
  // 判断是否有该培训营
  if (!mscamp) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // 如果有 则添加课程进入该培训营
  const course = await Courses.create(req.body)

  res.status(200).json({success: true, data: course})
})

/**
 * @desc    根据id更新课程数据
 * @route   PUT /api/v1/courses/:id
 * @access  私有的
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  console.log(req.params.id, req.body)
  let course = await Courses.findById(req.params.id);
  console.log(course)
  if (!course) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(course)
  res.status(200).json({ success: true, data: course });
})

/**
* @desc    根据id删除课程数据
* @route   DELETE /api/v1/courses/:id
* @access  私有的
*/
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id)

  if (!course) {
      return next(
          new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
  }

  course.remove()

  res.status(200).json({success: true, data: {}})
})
