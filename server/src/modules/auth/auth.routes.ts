import express from 'express';
import {AuthController} from '@server/modules/auth/auth.controller.js';


const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/auth/login', authController.login)

export default authRouter;
