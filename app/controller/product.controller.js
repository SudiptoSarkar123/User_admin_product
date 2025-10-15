import asynchandler from "express-async-handler";
import { Validator } from "node-input-validator";
import createError from "../helper/createError.js";
import Product from "../models/product.model.js";
import uploadToCloudinary from "../helper/uploadToCloudinary.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";

export const addProduct = asynchandler(async (req, res) => {
  console.log('req.body',req.body)
  const v = new Validator(req.body, {
    name: "required|string",
    price: "required|numeric",
    quentity: "required|numeric",
    createdBy: "required|string|regex:/^[0-9a-fA-F]{24}$/",
  });
  const matched = v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }
  const { name, price, quentity } = req.body;

  if (!req.file) throw createError(404, "No image file provided");

  const product = await Product.findOne({ name });
  if (product) throw createError(400, "product already exist");

  const result = await uploadToCloudinary(req.file.buffer);

  const newProduct = new Product({
    name,
    price,
    quentity,
    createdBy: req.user.id,
    imageUrl: result.secure_url,
    productImagePublicId: result.public_id,
  });

  await newProduct.save();

  res.status(200).json({
    message: "Product added successfully",
    product: newProduct,
  });
});

export const allProductsByUserAndOthers = asynchandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const result = await Product.aggregate([
    {
      $facet: {
        myProducts: [{ $match: { createdBy: userId } }],
        otherProducts: [{ $match: { createdBy: { $ne: userId } } }],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    myProducts: result[0].myProducts,
    otherProducts: result[0].otherProducts,
  });
});

export const allProducts = asynchandler(async (req, res) => {
  console.log("hello");
  const products = await Product.find();
  res.status(200).json({
    data: products,
  });
});

export const singleProductDetails = asynchandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) throw createError(404, "Product not found");
  res.status(200).json({
    data: product,
  });
});

export const  updateProduct = asynchandler(async(req,res)=>{

  const  v = new Validator(req.body, {
    name: "required|string",
    price: "required|numeric",
    quentity: "required|numeric",
  });



  const matched = v.check();
  if(!matched){
    throw createError(400, "validation error", v.errors);
  }
  

  const { name, price, quentity } = req.body;
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) throw createError(404, "Product not found");

  let updateProduct = {}

  if(name) updateProduct.name = name;
  if(price) updateProduct.price = price;
  if(quentity) updateProduct.quentity = quentity;


  if(req.file){
    const result = await uploadToCloudinary(req.file.buffer);
    updateProduct.imageUrl = result.secure_url;
    updateProduct.productImagePublicId = result.public_id;

    if(product.imageUrl){
      await cloudinary.uploader.destroy(product.productImagePublicId);
    }
  }


  await Product.findByIdAndUpdate(productId, updateProduct);
  res.status(200).json({
    message: "Product updated successfully",
    product
  });
 

})


export const deleteProduct = asynchandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) throw createError(404, "Product not found");
  res.status(200).json({
    message: "Product deleted successfully",
    product: product._id,
  });
});