import express from "express";
import authCheck from "../middleware/authMiddleware.js";
import { createOrder, getMyOrders } from "../controller/order.controller.js";

const OrderRouter = express.Router();

// This is order route
OrderRouter.post("/orderFromCart", authCheck, createOrder);
OrderRouter.get("/", authCheck, getMyOrders);

export default OrderRouter;
