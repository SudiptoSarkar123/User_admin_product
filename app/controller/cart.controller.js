import express from "express";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import createError from "../helper/createError.js";
import { Validator } from "node-input-validator";
import mongoose from "mongoose";
import asynchandler from "express-async-handler";
import Product from "../models/product.model.js";
import redis from "../config/redis.config.js";



export const addToCart = asynchandler(async (req, res) => {
  console.log('req.query',req.query)
  const v = new Validator(req.query, {
    productId: "required",
    quentity: "required|numeric",
  });
  const matched = await v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }
  const { productId, quentity } = req.query;
  const product = await Product.findById(productId);
  console.log('product',product)
  if (!product) throw createError(404, "Product not found");
  if (product.quentity < quentity) {
    throw createError(400, "Product out of stock");
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    const newCart = new Cart({
      user: req.user.id,
      products: [{ productId, quentity }],
    });
    await newCart.save();
    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: newCart,
    });
  }

  cart.products.push({ productId, quentity });
  await cart.save();

  res.status(200).json({
    message: "Product added to cart successfully",
    cart,
  });
});

export const getCartDetails = asynchandler(async (req, res) => {
  const userId = req.user.id;

  const cartDetails = await Cart.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },

    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $addFields: {
        "products.product": "$productDetails",
        "products.price": {
          $multiply: ["$products.quentity", "$productDetails.price"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        products: { $push: "$products" },
        totalPrice: { $sum: "$products.price" },
      },
    },
  ]);

  if (!cartDetails.length) {
    throw createError(404, "Cart not found");
  }

  res.status(200).json({
    cart: {
      products: cartDetails[0].products,
      totalPrice: cartDetails[0].totalPrice,
    },
  });

  await redis.set(req.originalUrl, cartDetails);
  console.log("All Products cached in Redis");
});

export const addDeleteOrSubtractFromCart = asynchandler(async (req, res) => {
  const { action } = req.body;
  const productId = req.body.productId;
  // this is the porblem area
  const cart = await Cart.findOne({ user: req.user.id });
  console.log(req.user.id);
  // console.log(cart);
  if (!cart) throw createError(404, "Cart not found!");

  const product = await Product.findById(productId);
  console.log(productId);
  if (!product) throw createError(404, "Product not found!");

  const existingIndex = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );

  if (action === "add") {
    if (product.quentity <= 0) throw createError(400, "Product Outof shock!");

    if (existingIndex >= 0) {
      cart.products[existingIndex].quentity += 1;
    }
    await cart.save();

    product.quentity -= 1;
    await product.save();
    return res.status(200).json({
      status: true,
      message: "Product quantity increased successfully",
      cart,
    });
  }

  if (action === "sub") {
    if (existingIndex >= 0) {
      const currentQty = cart.products[existingIndex].quentity;

      if (currentQty > 1) {
        cart.products[existingIndex].quentity -= 1;
      } else {
        cart.products.splice(existingIndex, 1);
      }

      await cart.save();

      product.quentity += 1;
      await product.save();

      return res.status(200).json({
        status: true,
        message: "Product quantity decreased successfully",
        cart,
      });
    } else {
      throw createError(404, "Product not found in cart");
    }
  }
  if (action === "remove") {
    if (existingIndex >= 0) {
      cart.products.splice(existingIndex, 1);
      await cart.save();
      return res.status(200).json({
        status: true,
        message: "Product removed from cart successfully",
        cart,
      });
    }
  }

  throw createError(400, "Invalid action. Use 'add , sub' or 'remove'! ");
});

export const allProductsClearFromCart = asynchandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw createError(404, "Cart not found");
  }
  cart.products = [];
  await cart.save();
  return res.status(200).json({
    status: true,
    message: "All products cleared from cart",
    cart,
  });
});
