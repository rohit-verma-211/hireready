import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.get('/logout', logoutUserController);
authRouter.get('/get-me',authMiddleware,getMeController); 

export default authRouter;