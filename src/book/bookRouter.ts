import express from "express"
import { createBook, deleteBook, getBooks, oneBook } from "./bookController";
import multer from "multer";
import path from "path";
import authentication from "../middleware/auth";


const bookRouter=express.Router();

const upload=multer({
    dest:path.resolve(__dirname,'../../public/data/uploads'),
    limits:{fileSize:3e7}
})

bookRouter.post("/",authentication,upload.fields([
    {name:'coverImg',maxCount:1},
    {name:'file',maxCount:1}
]),createBook)

bookRouter.get("/",getBooks)
bookRouter.get('/:id',oneBook)
bookRouter.delete('/:id',authentication,deleteBook)

export default bookRouter;