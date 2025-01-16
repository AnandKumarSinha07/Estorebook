import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";


const app = express();


app.use(express.json())
app.use("/api/users",userRouter)
app.use("/api/books",bookRouter)
app.use(globalErrorHandler)
export default app;
