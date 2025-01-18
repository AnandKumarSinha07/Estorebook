
import jwt from 'jsonwebtoken';
import { NextFunction,Request,Response } from "express";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
    userID:string,
}

const authentication=async(req:Request,res:Response,next:NextFunction)=>{
   try {
    
    const token=req.header("Authorization")

    if(!token){
        return next(createHttpError(401,"Token Not generated"))
    }

    const decodeToken=token.split(' ')[1];
    const {verify}=jwt;
    const verifyToken=verify(decodeToken,"anand123@");

    if(!verifyToken){
        return next(createHttpError(404,"Not authrozied user"))
    }

    console.log("verify",verifyToken);


    const _req=req as AuthRequest
    _req.userID=verifyToken.sub as string;
    next();

    
   } catch (error) {
      console.log("Error inside the jwt verify api",error);
      next(createHttpError(404,"Error in the api of jwt"))
   }
}

export default authentication;