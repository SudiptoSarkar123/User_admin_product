import express from "express";
const CartRouter = express.Router();
import authCheck from "../middleware/authMiddleware.js";
import {
  addToCart,
  clearCart,
  getCartDetails,
  updateCart,
} from "../controller/cart.controller.js";

// All Cart route

// import { redisMiddleware } from "../middleware/redisMiddleware.js";


CartRouter.post("/add", authCheck, addToCart);

CartRouter.get("/", authCheck, getCartDetails);

CartRouter.put("/update", authCheck, updateCart);

// CartRouter.get("/removeFromCart/:id", authCheck, singleProductRemoveFromCart);
CartRouter.delete("/clear", authCheck, clearCart);

export default CartRouter;
