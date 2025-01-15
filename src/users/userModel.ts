import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    min:6,
    max:19,
    
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  password:{
    type:String,
    min:8,
    max:14,
    required:true,
  }

},{timestamps:true})



const user = mongoose.model('user', userSchema);
export default user;