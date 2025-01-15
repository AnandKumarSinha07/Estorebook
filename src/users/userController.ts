import { NextFunction, Request,Response } from "express";
import createHttpError from "http-errors";
import user from "./userModel";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';



const RegisterUser=async(req:Request,res:Response,next:NextFunction)=>{
   try {

       const {name,email,password}=req.body;
       

       if(!name || !email || !password){
          const error=createHttpError(404,"Enter all the required fields")
          return next(error);  
       }

       const findEmail=await user.findOne({email:email})

       if(findEmail){
          const error=createHttpError(404,"credentials found please register")
          return next(error)
       }

       const hashPassword=await bcrypt.hash(password,10);

       if(!hashPassword){
          const error=createHttpError(500,"password hashing not working properly")
          return next(error)
       }



       const newUser=await user.create({
        name:name,
        email:email,
        password:hashPassword
       })


       const token=jwt.sign({sub:newUser._id},"anand123@",{
           expiresIn:'7d'
       })

        

       res.status(200).json({
        message:"User Register",
        accesToken:token,
       })


   } catch (error) {
       console.log("Error inside the rehister api ",error);
       res.status(404).json({
          message:"Bad Request"
       })
   }
}

export  {RegisterUser};