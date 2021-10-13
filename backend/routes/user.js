const express = require('express')
const router = express.Router();
const userCtrl = require('../controller/user');
const sanitizer = require('../middleware/sanitizer')
const passwordValidation = require('../middleware/passwordValidation')

router.post('/signup', sanitizer, passwordValidation, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router;