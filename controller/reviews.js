const Reviews = require("../modles/reviews")
const Mscamps = require("../modles/mscamps")
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')


/**
 * @desc    获取评论数据
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/mscamps/mscampsID/reviews
 * @access  公开的
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.mscampsID) {
    const reviews = await Reviews.find({mscamp: req.params.mscampsID})
    res.status(200).json({success: true, total: reviews.length, data: reviews})
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
      new ErrorResponse(`Resource not found with id of ${req.user.id}`, 404)
    );
  }

  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(mscamp.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.user.id}没有权限创建此数据`, 401))
}

    // 添加培训营id 用户id
    req.body.mscamp = req.params.mscampsID
    req.body.user = req.user.id

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
  let course = await Courses.findById(req.params.id);

  // 没有找到
  if (!course) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(course.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.params.id}没有权限修改此数据`, 401))
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

  // 没有找到
  if (!course) {
      return next(
          new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
  }

  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(course.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.params.id}没有权限修改此数据`, 401))
}

  course.remove()

  res.status(200).json({success: true, data: {}})
})
