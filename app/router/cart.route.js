import express from "express";
const CartRouter = express.Router();
import authCheck from "../middleware/authMiddleware.js";
import {
  addDeleteOrSubtractFromCart,
  addToCart,
  allProductsClearFromCart,
  getCartDetails,
} from "../controller/cart.controller.js";

// All Cart route


// import { redisMiddleware } from "../middleware/redisMiddleware.js";

CartRouter.post("/add", authCheck, addToCart);

CartRouter.get("/", authCheck, getCartDetails);

CartRouter.put("/subtractFromCart", authCheck, addDeleteOrSubtractFromCart);

// CartRouter.get("/removeFromCart/:id", authCheck, singleProductRemoveFromCart);

CartRouter.get("/clearCart", authCheck, allProductsClearFromCart);

export default CartRouter;
