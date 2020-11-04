const express = require('express')
const router = express.Router()
const { getMscamps, createMscamp, getMscamp, updateMscamp, deleteMscamp } = require('../controller/ascamps')

// http://localhost:5000/api/v1/mscamps
router.route('/').get(getMscamps).post(createMscamp)

// http://localhost:5000/api/v1/mscamps/:id
router.route('/:id').get(getMscamp).put(updateMscamp).delete(deleteMscamp)

module.exports = router
