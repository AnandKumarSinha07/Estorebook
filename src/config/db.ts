import { config } from '../config/config'
import mongoose from "mongoose";

const connectDb=async()=>{
     
     try{

        mongoose.connection.on('connected',()=>{
            console.log('connected to database succesfully')
        })
        await mongoose.connect(config.database_url as string)     
     }
     catch(err){
         console.log('Error in the database connection',err)
         process.exit(1);
     }
}

export default connectDb;




