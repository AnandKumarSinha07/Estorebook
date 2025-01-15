import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./users/userRouter";


const app = express();


app.use(express.json())
app.use("/api/users",userRouter)
app.use(globalErrorHandler)
export default app;
