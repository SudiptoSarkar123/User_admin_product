import mongoose from "mongoose";

const productSchema   = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quentity:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        default:"https://demofree.sirv.com/nope-not-here.jpg"
    },
    productImagePublicId:{
        type:String
    },
    purchaseCount:{
        type:Number,
        default:0
    }
},{timestamps:true})
const Product =  mongoose.model("Product",productSchema)
export default Product