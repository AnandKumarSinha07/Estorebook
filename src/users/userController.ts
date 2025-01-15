import { NextFunction, Request,Response } from "express";
import createHttpError from "http-errors";
import user from "./userModel";


const RegisterUser=async(req:Request,res:Response,next:NextFunction)=>{
   try {

       const {name,email,password}=req.body;
       console.log("body of the user is",req.body)

       if(!name || !email || !password){
          const error=createHttpError(404,"Enter all the required fields")
          return next(error);  
       }

       const findEmail=await user.findOne({email:email})

       if(findEmail){
          const error=createHttpError(404,"credentials found please register")
          return next(error)
       }









       res.status(200).json({
        message:"User Register"
       })


   } catch (error) {
       console.log("Error inside the rehister api ",error);
       res.status(404).json({
          message:"Bad Request"
       })
   }
}

export  {RegisterUser};