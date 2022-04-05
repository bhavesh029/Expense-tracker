const bcrypt = require('bcrypt');


const User = require('../Models/users');

exports.signUp = (req, res, next) =>{
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, (err, hash) => {
            if(err){
                console.log("Unable to create the user")
                res.json({message: 'Unabl to create the user'})
            }
            User.create({name, email, contact, password: hash})
                .then(() => {
                    res.status(201).json({message: 'Successfully created the new user'})
                })
                .catch(err => {
                    res.status(403).json(err);
                })
        });
    });
}
