const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController');
const adminAuth = require('../middleware/adminAuth')



router.get('/login', adminAuth.isLogin, adminController.loadlogin);
router.post('/login', adminController.login);
router.get('/dashBoard', adminAuth.checkSession, adminController.loaddashBoard);
router.post('/add-user', adminController.addUser);
router.put('/edit-user/:id', adminController.editUser); 
router.delete('/delete-user/:id', adminController.deleteUser); 
router.get('/logout',adminAuth.checkSession, adminController.logout); 




module.exports = router