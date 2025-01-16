import { NextFunction ,Request,Response} from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import book from "./bookModel";
import fs from "node:fs"



const createBook=async(req:Request,res:Response,next:NextFunction)=>{
   try {
        
     const {title,genre}=req.body;

     const files=req.files as {[filename:string]:Express.Multer.File[]}   
 
     const coverImgMimetype=files.coverImg[0].mimetype.split("/").at(-1)
     const filename=files.coverImg[0].filename;
     const filePath=path.resolve(__dirname,'../../public/data/uploads',filename)

     const uploadResult=await cloudinary.uploader.upload(filePath,{
         filename_override:filename,
         folder:"book-cover",
         format:coverImgMimetype,
     })

     const bookfileName=files.file[0].filename;
     const bookFilePath=path.resolve(__dirname,'../../public/data/uploads',bookfileName)


     const bookFileUpload=await cloudinary.uploader.upload(bookFilePath,{
         resource_type:"raw",
         filename_override:bookfileName,
         folder:'book-pdfs',
         format:"pdf"
     })


     
     const newBook=await book.create({
        title,
        genre,
        author:"6788ba8710724fafc26884ac",
        coverImg:uploadResult.secure_url,
        file:bookFileUpload.secure_url

     })
    
     

     res.status(201).json({
        id:newBook._id
     })

   } catch (error) {
       console.log("error inside the createbook api",error);
       next(createHttpError(404,"Bad gateway"))
   }
}

export {createBook}