import express from "express";
import upload from "../middleware/multerMiddleware.js";
import {
  addProduct,
  allProducts,
  allProductsByUserAndOthers,
  singleProductDetails,
} from "../controller/product.controller.js";
import authCheck from "../middleware/authMiddleware.js";
const ProductRouter = express.Router();

// This is  a product route 

ProductRouter.post("/add", authCheck, upload.single("image"), addProduct);

ProductRouter.get("/by-user", authCheck, allProductsByUserAndOthers);

ProductRouter.get("/", authCheck, allProducts);

ProductRouter.get("/single/:id", authCheck, singleProductDetails);

export default ProductRouter;
