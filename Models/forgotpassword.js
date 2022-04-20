const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const forgetpassword = sequelize.define('forgetPassword',{
    id:{
        type:Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresBy: Sequelize.DATE
})

module.exports = forgetpassword;