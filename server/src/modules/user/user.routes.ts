import UserController from './user.controller.js';
import express from 'express';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.getUser);
userRouter.patch('/', userController.updateUser);
userRouter.delete('/', userController.deleteUser);

export default userRouter;