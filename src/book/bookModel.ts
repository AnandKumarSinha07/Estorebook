import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema=new mongoose.Schema<Book>({

   title:{
     type:String,
     required:true,
     trim:true,
   },
   author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
   },
   coverImg:{
    type:String,
    required:true,
   },

   file:{
    type:String,
    required:true
   },

   genre:{
    type:String,
    required:true,
   },

    
},{timestamps:true})

const book=mongoose.model<Book>("book",bookSchema);
export default book;