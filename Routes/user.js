const express = require('express');

const userController = require('../Controller/user');
const user = require('../Models/users');

const router = express.Router();

router.post('/signup',userController.signUp);

module.exports = router;