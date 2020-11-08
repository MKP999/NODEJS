const express = require('express')
const router = express.Router()
const { register, login } = require('../controller/auth')

// http://localhost:5000/api/v1/auth/register
router.route('/register').post(register)

router.route('/login').post(login)

module.exports = router
