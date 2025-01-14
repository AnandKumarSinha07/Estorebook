import express from "express";

const app=express();
app.get("/",(req,res,)=>{
     res.json({
        message:"initial testing server"
     })
})


export default app;