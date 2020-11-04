const Mscamp = require("../modles/mscamps");

/**
 * @desc    获取米修所有数据
 * @route   GET /api/v1/mscamps
 * @access  公开的
 */
exports.getMscamps = async (req, res, next) => {
    try {
        const mscamps = await new Mscamp.find()
        res.status(200).json({success: true, data: mscamps})
    } catch (error) {
        res.status(400).json({success:false, data: error})
    }
} 

/**
 * @desc    创建米修数据
 * @route   POST /api/v1/mscamps
 * @access  公开的
 */
exports.createMscamp = async (req, res, next) => {
    try {
        console.log(req.body)
        const mscamps = await new Mscamp(req.body)
        res.status(200).json({success: true, data: mscamps})
    } catch (error) {
        res.status(400).json({success:false, data: error})
    }
}

/**
 * @desc    根据ID获取米修某个数据
 * @route   GET /api/v1/mscamps/:id
 * @access  公开的
 */
exports.getMscamp = (req, res, next) => {
    res.status(200).json({msg: `根据${req.params.id}获取单条数据`})
}

/**
 * @desc    根据id更新米修数据
 * @route   PUT /api/v1/mscamps/:id
 * @access  公开的
 */
exports.updateMscamp = (req, res, next) => {
    res.status(200).json({msg: `根据${req.params.id}更新单挑数据`})
} 

/**
 * @desc    根据id删除米修数据
 * @route   DELETE /api/v1/mscamps/:id
 * @access  公开的
 */
exports.deleteMscamp = (req, res, next) => {
    res.status(200).json({msg: `根据${req.params.id}删除数据`})
} 