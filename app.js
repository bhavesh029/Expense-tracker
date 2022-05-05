const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./utils/database');
const User = require('./Models/users');
const Expense = require('./Models/expense');
const Order = require('./Models/order');
const forgetPassword = require('./Models/forgotpassword');

const userRoutes = require('./Routes/user');
const purchaseRoutes = require('./Routes/purchase');

const app = express();

app.use(cors());
dotenv.config();
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

app.use('/user',userRoutes);
app.use('/purchase',purchaseRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use((req,res) => {
    console.log('url',req.url);
    res.sendFile(path.join(__dirname,`Views/${req.url}`));
})

sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT ||3000);
    })
    .catch(err => {
        console.log(err);
    })
