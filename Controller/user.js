const bcrypt = require('bcrypt');

const User = require('../Models/users');

exports.signUp = (req, res, next) =>{
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;

    User.create({name, email, contact, password})
        .then(() => {
            res.status(201).json({message: 'Successfully created the new user'})
        })
        .catch(err => {
            res.status(403).json(err);
        })
};


exports.login = (req, res, next) => {

}