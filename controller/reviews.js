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
 * @desc    根据ID获取某个评论
 * @route   GET /api/v1/reviews/:id
 * @access  公开的
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id)
  if (!review) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
  res.status(200).json({success: true, data: review})
})

/**
 * @desc    创建评论
 * @route   POST /api/v1/mscamps/mscampsID/reviews
 * @access  私有的
 */
exports.createReviews = asyncHandler(async (req, res, next) => {
  // 获取该培训营
  const mscamp = await Mscamps.findById(req.params.mscampsID)
  // 判断是否有该培训营
  if (!mscamp) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.user.id}`, 404)
    );
  }
console.log(111, mscamp)
console.log(222, req.user)
  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(mscamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.user.id}没有权限创建此数据`, 401))
}

    // 添加培训营id 用户id
    req.body.mscamp = req.params.mscampsID
    req.body.user = req.user.id

  // 如果有 则添加课程进入该培训营
  const review = await Reviews.create(req.body)

  res.status(200).json({success: true, data: review})
})

/**
 * @desc    根据id更新评论
 * @route   PUT /api/v1/reviews/:id
 * @access  私有的
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Reviews.findById(req.params.id);

  // 没有找到
  if (!review) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.params.id}没有权限修改此数据`, 401))
}

  review = await Reviews.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: review });
})

/**
* @desc    根据id删除评论
* @route   DELETE /api/v1/reviews/:id
* @access  私有的
*/
exports.deleteReviews = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id)

  // 没有找到
  if (!review) {
      return next(
          new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
  }

  // 路由守卫  限制非admin 非本身创建的数据不能修改
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.params.id}没有权限修改此数据`, 401))
}

  Reviews.remove()

  res.status(200).json({success: true, data: {}})
})
