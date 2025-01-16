import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import user from "./userModel";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const RegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
       const { name, email, password } = req.body;
       
       if (!name || !email || !password) {
          
          const error = createHttpError(400, "Enter all the required fields");
          return next(error); 
       }

      
       const findEmail = await user.findOne({ email: email });
       if (findEmail) {
          const error = createHttpError(400, "Credentials found, please register");
          return next(error);
       }

     
       const hashPassword = await bcrypt.hash(password, 10);
       if (!hashPassword) {
          const error = createHttpError(500, "Password hashing failed");
          return next(error);
       }

      
       const newUser = await user.create({
           name: name,
           email: email,
           password: hashPassword
       });

 
       const token = jwt.sign({ sub: newUser._id }, "anand123@", { expiresIn: '7d' });

       res.status(200).json({
           message: "User Registered",
           accessToken: token,
       });

   } catch (error) {
       console.log("Error inside the register API:", error);
       res.status(500).json({ message: "Internal Server Error" });
   }
};


export const LoginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
         const { email, password } = req.body;

     
         if (!email || !password) {
            return next(createHttpError(400, "Enter all the required fields"));
         }

       
         const findUser = await user.findOne({ email });
         if (!findUser) {
            return next(createHttpError(400, "Email does not exist. Please Register!"));
         }
         
         const comparePassword = await bcrypt.compare(password, findUser.password);
         if (!comparePassword) {
             return next(createHttpError(400, "Password does not match"));
         }

         
          const token = jwt.sign({ sub: findUser._id }, "anand123@", { expiresIn: '7d' });

          
            res.status(200).json({
            message: "Login Successful",
            data: token,
          });

   } catch (error) {
         console.log("Error inside the Login API:", error);
         res.status(500).json({ message: "Internal Server Error" });
   }
};