const express = require('express')
const router = express.Router()
const { register, login, getMe, updateDetails, updatePassword, forgotPassword, resetPassword } = require('../controller/auth')
const { protect } = require('../middleware/auth')

// http://localhost:5000/api/v1/auth/register
router.post('/register', register)

// http://localhost:5000/api/v1/auth/login
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:resettoken', resetPassword)

module.exports = router
