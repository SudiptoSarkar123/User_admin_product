import express from "express";
import { addReview } from "../controller/review.controller.js";
import authCheck from "../middleware/authMiddleware.js";
const ReviewRouter = express.Router();

// This is review route 
ReviewRouter.post("/:productId", authCheck, addReview);


export default ReviewRouter;