const bcrypt = require('bcrypt');

const User = require('../Models/users');

const jwt =require('jsonwebtoken');

function generateAccessToken(id){
    console.log(id, process.env.TokenSecret);
    return jwt.sign(id, process.env.TokenSecret);
}

exports.signUp = ((req, res, next) =>{
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;
    //***** */
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            if(err){
                console.log('Unable to create new user')
                res.json({message:'Unable to create new user'})
            }
            User.create({name, email, contact, password:hash}).then(() => {
                res.status(201).json({message: 'Successfully created new User'})
            }).catch(err => {
                res.status(403).json(err);
            })
        })
    })
    // const hashPassword = await bcrypt.hash(password, 10);
    // await User.create({name, email, contact, password:hashPassword})
    //     .then(() => {
    //         res.status(201).json({message: 'Successfully created the new user'})
    //     })
    //     .catch(err => {
    //         res.status(403).json(err);
    //     })
});


exports.login = (req, res, next) => {
    const email= req.body.email;
    const password = req.body.password;
    User.findAll({where: {email:email}}).then(result => {
        if(result[0] != undefined){
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(err){
                    console.log(result[0].name);
                    return res.json({success: false, message: 'Something went wrong'});
                }
                if(response){
                    console.log('Inside Response', result[0].id);
                    const jwtToken = generateAccessToken(result[0].id)
                    res.json({token: jwtToken, success: true, message: 'Successfully logged In'})
                }
                else{
                    console.log("Inside the else where not found");
                    return res.status(401).json({success: false, message: 'Password does not match'});
                }
            })
        }
        else{
            return res.status(404).json({success: false, message: 'User Not Found'})
        }
    })
    .catch(err => {
        console.log(err);
    })
    
}