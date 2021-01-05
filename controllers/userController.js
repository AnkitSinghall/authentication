const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj
}

exports.getAllUsers = async(req,res)=>{
    const user = await User.find();
    // console.log(user)
    try{
        res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                users: user
            }
        });
    } catch(err){
        res.status(401).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
    
};

exports.updateMe = async(req,res)=>{

    const filterBody = filterObj(req.body, 'name','email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {new: true, runValidators: true});
    try{
        res.status(200).json({
            status: 'success',
            data: updatedUser
        })
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err
        }) 
    }
    
};

//Only Admin can update to this route handler
exports.updateUser = async(req,res)=>{

    const filterBody = filterObj(req.body, 'name','email');
    const updateUser = await User.findByIdAndUpdate(req.params.id, filterBody, {new: true, runValidators: true});
    try{
        res.status(200).json({
            status: 'success',
            data: updateUser
        })
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err
        }) 
    }
    
};

exports.deleteUser = async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    try{
        res.status(200).json({
            status: 'success',
            data: 'user deleted'
        })
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err
        }) 
    }
};