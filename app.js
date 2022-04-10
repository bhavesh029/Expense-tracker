const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const sequelize = require('./utils/database');
const User = require('./Models/users');
const Expense = require('./Models/expense');

const userRoutes = require('./Routes/user');

const app = express();

app.use(cors());
dotenv.config();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

app.use('/user',userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
