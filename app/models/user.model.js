import mongoose from 'mongoose'
import { hashPassword } from '../helper/passHelper.js'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
},{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hashedpass = hashPassword(this.password)
    this.password = hashedpass ;
    next()
});

const User =  mongoose.model("User",userSchema)
export default User