import { NextFunction ,Request,Response} from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import book from "./bookModel";


const createBook=async(req:Request,res:Response,next:NextFunction)=>{
   try {
        
    console.log("req",req.files)

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
     const bookFilePath=path.resolve(__dirname,'../../public/data/uploads',filename)

     const bookFileUpload=await cloudinary.uploader.upload(bookFilePath,{
         resource_type:'raw',
         filename_override:bookfileName,
         folder:'book-pdfs',
         format:"pdf"
     })

     console.log("fileUpload",bookFileUpload)


     console.log("upload result",uploadResult)
     res.json({
       message:"ok"
     })
   } catch (error) {
    
   }
}

export {createBook}