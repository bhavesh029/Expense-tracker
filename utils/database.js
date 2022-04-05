const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenseTracker', 'bhavesh', 'Bhavesh#1998', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;