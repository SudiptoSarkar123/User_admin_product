import asynchandler from "express-async-handler";
import Review from "../models/review.model";


export const addReview = asynchandler(async (req,res)=>{
    const {rating , comment = ""} = req.body
    const {productId} = req.params

    if(!productId || !rating){
        throw createError(404,"Product or rating not found")
    }
    

    const review = await Review.create({
        productId,
        user: req.user.id,
        rating,
        comment
    })


    res.status(200).json({
        message:"Review added successfully",
        review
    })
})