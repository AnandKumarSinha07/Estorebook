import express, { Request, Response } from 'express';
import {RegisterUser} from './userController';


const userRouter = express.Router();

userRouter.post("/register",RegisterUser);
export default userRouter;  