const express = require('express');

const userController = require('../Controller/user');
const user = require('../Models/users');

const router = express.Router();

router.post('/signup',userController.signUp);
router.post('/login', userController.login);

module.exports = router;