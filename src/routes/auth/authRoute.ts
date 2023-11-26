
import express from 'express';
import { AuthController } from '../../controllers/authentication/AuthController';

const authController = new AuthController();

export default (router:express.Router) => {
    router.post('/auth/register',authController.registerUser)
    router.post('/auth/login',authController.loginUser)
}

