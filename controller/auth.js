const User = require("../modles/users")
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')


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
        return new ErrorResponse('参数有误', 400)
    }

    // 匹配密码
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return new ErrorResponse('密码错误', 401)
    }

    sendTokenResponse(user, 200, res)
  })


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