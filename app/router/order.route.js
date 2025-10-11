import express from "express";
import authCheck from "../middleware/authMiddleware.js";
import { createOrder } from "../controller/order.controller.js";
const OrderRouter = express.Router();
 

// This is order route 
OrderRouter.get("/orderFromCart", authCheck, createOrder);

export default OrderRouter;
