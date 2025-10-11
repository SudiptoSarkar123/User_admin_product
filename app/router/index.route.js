import express from "express";
import AuthRouter from "./auth.route.js";
import ProductRouter from "./product.route.js";
import CartRouter from "./cart.route.js";
import OrderRouter from "./order.route.js";
const router = express.Router();

// All route index route  
router.use("/auth", AuthRouter);
router.use("/product", ProductRouter);
router.use("/cart", CartRouter);
router.use("/order", OrderRouter);

export default router;
