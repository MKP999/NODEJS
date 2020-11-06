const Mscamp = require("../modles/mscamps");
// 封装报错类型 class
const ErrorResponse = require('../utils/ErrorResponse')
// 封装异步请求处理
const asyncHandler = require('../middleware/async')

/**
 * @desc    获取米修所有数据
 * @route   GET /api/v1/mscamps
 * @access  公开的
 */
exports.getMscamps = asyncHandler(async (req, res, next) => {
        // const query = req.query
        // let query = await Mscamp.find(req.query)
        // if (req.query.select) {
        //    const fields = req.query.select.split(',').join(' ')
        //    query = query.select(fields)   
        // }
        const mscamps = await Mscamp.find(req.query)
        res.status(200).json({success: true, data: mscamps})
})

/**
 * @desc    创建米修数据
 * @route   POST /api/v1/mscamps
 * @access  公开的
 */
exports.createMscamp = asyncHandler(async (req, res, next) => {
        const mscamp = await Mscamp.create(req.body)
        if (!mscamp) {
            return next(new ErrorResponse("该机构已存在,请不要重复创建", 400 ))
        }
        res.status(200).json({success: true, data: mscamp})
})

/**
 * @desc    根据ID获取米修某个数据
 * @route   GET /api/v1/mscamps/:id
 * @access  公开的
 */
exports.getMscamp = asyncHandler(async (req, res, next) => {
        const mscamp = await Mscamp.findById(req.params.id)
        if (!mscamp) {
            return next(
              new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
            );
          }
        res.status(200).json({success: true, data: mscamp})
})

/**
 * @desc    根据id更新米修数据
 * @route   PUT /api/v1/mscamps/:id
 * @access  公开的
 */
exports.updateMscamp = asyncHandler(async (req, res, next) => {
        const mscamp = await Mscamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          })

          if (!mscamp) {
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
              );
        }

        res.status(200).json({success: true, data: mscamp})
})

/**
 * @desc    根据id删除米修数据
 * @route   DELETE /api/v1/mscamps/:id
 * @access  公开的
 */
exports.deleteMscamp = asyncHandler(async (req, res, next) => {
        const mscamp = await Mscamp.findByIdAndRemove(req.params.id)

        if (!mscamp) {
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
              );
        }

        res.status(200).json({success: true, data: {}})
})