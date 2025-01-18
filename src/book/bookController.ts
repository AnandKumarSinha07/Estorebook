import { NextFunction ,Request,Response} from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import book from "./bookModel";
import fs from "node:fs"
import { AuthRequest } from "../middleware/auth";



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


     const _req=req as AuthRequest;
     const newBook=await book.create({
        title,
        genre,
        author:_req.userID,
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

const getBooks=async(req:Request,res:Response,next:NextFunction)=>{
   try {
      const findBook=await book.find();

      res.json({
        message:"Books",
        findBook
      }) 
   } catch (error) {
       console.log("Error inside the api of getting book",error)
       next(createHttpError(500,"Error while getting book "))
   }
}

const oneBook=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const Bookid=req.params.id;
        const findBookId=await book.findOne({_id:Bookid});

        if(!findBookId){
            next(createHttpError(404,"Book Not found"))
        }

        res.json({
            message:"Your Book",
            findBookId
        })
    } catch (error) {
        console.log("Error inside the single book api",error);
        next(createHttpError(500,"Error in the book api"))
    }
}

const deleteBook=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id;
        const findBookId=await book.findOne({_id:id});

        if(!findBookId){
            return next(createHttpError(400,"Book Not found"));
        }

        const _req=req as AuthRequest

        if(_req.userID.toString()!=findBookId.author.toString()){
           return next(createHttpError(404,"Not authorized to delete book"))
        }

        //https://res.cloudinary.com/dpheetc0h/image/upload/v1737054075/book-cover/celttkvp4jlmgvzpwmbv.jpg
        //book-cover/celttkvp4jlmgvzpwmbv
        
        const coverimageSplit=findBookId.coverImg.split('/');
        const coverimage=coverimageSplit.at(-2)+'/'+(coverimageSplit.at(-1)?.split('.').at(-2));

       
        //https://res.cloudinary.com/dpheetc0h/raw/upload/v1737054076/book-pdfs/dac6jdst30y9ywsqphbx.pdf
        //book-pdfs/dac6jdst30y9ywsqphbx.pdf

         const FileSplit=findBookId.file.split('/');
         const coverfile=FileSplit.at(-2)+'/'+FileSplit.at(-1);

           
         await cloudinary.uploader.destroy(coverimage)
         await cloudinary.uploader.destroy(coverfile,{
            resource_type:"raw"
         })


        const deleteBook=await book.findByIdAndDelete({_id:id},{new:true})

        res.status(204).json({
            message:"Book deleted succesfully",
        })
        

        
    } catch (error) {
         console.log("Error inside the delete api",error)
         next(createHttpError(500,"Error in the delete api"))
    }
}

export {createBook,getBooks,oneBook,deleteBook}
