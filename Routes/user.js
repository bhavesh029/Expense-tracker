const express = require('express');

const userController = require('../Controller/user');
const expenseController = require('../Controller/expense');
const authenticateMiddleware  = require('../middleware/auth');

const router = express.Router();

router.post('/signup',userController.signUp);
router.post('/login', userController.login);

router.post('/addexpense', authenticateMiddleware.authenticate, expenseController.addExpense);
router.get('/getexpenses', authenticateMiddleware.authenticate, expenseController.getexpenses);
router.delete('/deleteexpense/:expenseid', authenticateMiddleware.authenticate, expenseController.deleteexpense);
router.get('/download', authenticateMiddleware.authenticate, expenseController.download);

module.exports = router;