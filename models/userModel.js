const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User Must have a Name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false 
    } ,
    role: {
        type: String,
        enum: ['admin' , 'user'],
        default: 'user'
    }
});


//ENCRYPTING by USING MONGOOSE MIDDLEWARE
userSchema.pre('save', async function(next){
   if(!this.isModified('password')) {    
     return next();
   } 
   
   this.password = await bcrypt.hash(this.password,12);

   this.passwordConfirm = undefined;  
   next();

});

//encryting password for LOGIN
userSchema.methods.correctPassword = async function( candidatePassword, userStoredPassword){
    return bcrypt.compare(candidatePassword,userStoredPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;