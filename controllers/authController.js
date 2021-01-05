const { promisify } = require('util');

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    try{
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    } catch(err){
        console.log(err)
    }
      
};      

// LOGIN
exports.login = async (req,res) => {
    const {email,password} = req.body;

    //1.check if email or password exist
        if(!email || !password){
            return res.status(400).json({
                status: 'fail',
                message: 'email or password is not defined'
            })                
        }
    //2.check if the user exist & password is correct
    const user = await User.findOne({email: email}).select('+password');
    console.log(user)

    if(!user || !(await user.correctPassword(password, user.password))){
      return res.status(401).json({
        status: 'fail',
        message: 'invalid email or password'
      })
    }

    //3.if everything is ok, send token to client
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    res.status(200).json({
        status: 'success',
        data: user,
        token
    })
};

//Protecting route for login user
exports.protect = async (req,res,next)=>{
    //1.getting token & check if it's true
        let token;
        // console.log(req.headers.authorization)
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]; 
        }
        console.log(token)

        if(!token){
            return res.status(401).json({
                status: 'fail',
                message: 'you are not logged in...please log in first'
            });
        }

    //2.validate token
    const decoded =  await promisify(jwt.verify)(token.toString(), process.env.JWT_SECRET);
    // console.log(decoded);
    console.log('done validation');


    //3.check if user still exist
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        res.status(401).json({
            status: 'fail',
            message: 'the user belonging to this token does no longer exist'
        })
    }

    req.user = freshUser;
    next();
}

//RestrictTo
exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        // console.log('inside', roles)
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have the permission to perform this action'
              })
        }
        next();
    }
}
