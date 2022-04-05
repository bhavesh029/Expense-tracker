const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./utils/database');
const User = require('./Models/users');

const userRoutes = require('./Routes/user');

const app = express();

app.use(cors());

app.use(express.json());
// app.use(bodyParser.urlencoded());

app.use('/user',userRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })