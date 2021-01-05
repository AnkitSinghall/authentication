const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);

userRouter.post('/login', authController.login);

//any user can update their profile
userRouter.patch('/updateMe', authController.protect, userController.updateMe);

//only Admin can access these routes
userRouter.get('/', authController.protect, authController.restrictTo('admin'), userController.getAllUsers);
userRouter.patch('/:id', authController.protect, authController.restrictTo('admin'), userController.updateUser);
userRouter.delete('/:id', authController.protect, authController.restrictTo('admin'), userController.deleteUser);

module.exports = userRouter;