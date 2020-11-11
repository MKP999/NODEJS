const User = require("../modles/users")
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')


/**
 * @desc    获取所有用户
 * @route   GET /api/v1/users
 * @access  私有/admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
  })
  
/**
 * @desc    根据id获取单个用户
 * @route   get /api/v1/users/:id
 * @access  私有/admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
  res.status(200).json({success: true, data: user})
  })

  /**
 * @desc    创建用户
 * @route   POST /api/v1/users
 * @access  私有/admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  //   console.log(req.user);
  const user = await User.create(req.body);
  res.status(200).json({ success: true, data: user });
});


  /**
 * @desc    根据id修改用户信息
 * @route   PUT /api/v1/users/:id
 * @access  私有/admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});


  /**
 * @desc    删除用户密码
 * @route   DELETE /api/v1/users/:id
 * @access  私有/admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  res.status(200).json({ success: true, data: {} })
});

 
