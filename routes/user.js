const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const auth = require('../middleware/auth')

// login router
router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login', userController.login)

//register router
router.get('/register',auth.isLogin, userController.loadRegister)
router.post('/register', userController.registerUser) 

// home router
router.get('/userHome', auth.checkSession, userController.loadHome)

//logout router
router.get('/logout',auth.checkSession,userController.logout)


module.exports = router;