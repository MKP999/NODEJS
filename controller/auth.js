const crypto = require("crypto");
const User = require("../modles/users")
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail') 


/**
 * @desc    注册账号
 * @route   POST /api/v1/auth/register
 * @access  公开的
 */
exports.register = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const user = await User.create(req.body)
    
    sendTokenResponse(user, 200, res)
  })
  
/**
 * @desc    登录账号
 * @route   POST /api/v1/auth/login
 * @access  公开的
 */
exports.login = asyncHandler(async (req, res, next) => {
    // 选择两个进行验证即可
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    console.log(user)

    // 没有该账号
    if(!user) {
        return next(new ErrorResponse('参数有误', 400))
    }

    // 匹配密码
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('密码错误', 401))
    }

    sendTokenResponse(user, 200, res)
  })

  /**
 * @desc    获取当前登录用户信息
 * @route   GET /api/v1/auth/me
 * @access  私有的
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  //   console.log(req.user);
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});


  /**
 * @desc    修改当前用户信息
 * @route   PUT /api/v1/auth/updatedetails
 * @access  私有的
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const field = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(req.user.id, field, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});


  /**
 * @desc    修改当前用户密码
 * @route   PUT /api/v1/auth/updatepassword
 * @access  私有的
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  //  旧密码 新密码
  const user = await User.findById(req.user.id).select('+password')
  console.log(user)
  // 判断旧密码是否一致
  if(!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('密码错误', 401))
  }

  // 存储
  user.password = req.body.password

  // 保存
  await user.save()

  sendTokenResponse(user, 200, res)
});

  /**
 * @desc    忘记密码
 * @route   POST /api/v1/auth/forgotpassword
 * @access  私有的
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 根据用户输入邮箱
  const user = await User.findOne({email: req.body.email})
  // 查找不到
  if(!user) {
    return next(new ErrorResponse('用户名不存在', 401))
  }

  // 获取发送邮箱 token
  const resetToken = user.getResetPasswordToken()

  // 保存 并且无需验证
  await user.save({ validateBeforeSave: false })

  // 发送邮件 包含重置密码的网址
  // {{URL}}/api/v1/auth/resetpassword/imissu1217
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `收到该邮件的原因是你需要重置密码, 请点击链接${
    req.protocol
  }://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

  // 发送邮件
  try {
    await sendEmail({
      email: user.email,
      subject: "重置密码",
      message,
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("邮件发送失败", 500));
  }


  res.status(200).json({ success: true, data: user })
});


/**
 * @desc    重置密码
 * @route   POST /api/v1/auth/resetpassword/:resettoken
 * @access  公开的
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 获取resetPasswordToken
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.resettoken)
  .digest("hex");
  
  console.log(resetPasswordToken)
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user)
  if (!user) {
    return next(new ErrorResponse("token不合法", 400));
  }

  // 重置密码
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 存储
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});


 // 生成token并存储到cookie的方法
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(    // 过期时间
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,       // 进允许http请求
    };
  
    if (process.env.NODE_ENV == "production") {     // 生产环境支持安全配置
      options.secure = true;
    }
  
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, token });
  };  