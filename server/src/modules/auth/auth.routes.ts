import express from 'express';
import {AuthController} from '@server/modules/auth/auth.controller.js';


const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/login', authController.login)
authRouter.post('/register', authController.signUp);
authRouter.post('/verify', authController.verifyToken); // testing

export default authRouter;
