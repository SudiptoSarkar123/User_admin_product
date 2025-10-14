import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asynchandler from "express-async-handler";
import createError from "../helper/createError.js";
import { Validator } from "node-input-validator";

export const createOrder = asynchandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quentity } = req.query;
  const productQuentity = quentity === 0 ? 1 : quentity;

  let cart = await Cart.findOne({ user: userId }).populate(
    "products.productId"
  );

  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] });
  }

  let orderProducts = [];

  if (productId && productQuentity) {
    const product = await Product.findById(productId);
    if (!product) throw createError(404, "Product not found");

    const existingIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (existingIndex >= 0) {
      if (
        product.quentity <
        cart.products[existingIndex].quentity + Number(productQuentity)
      ) {
        throw createError(400, "Product out of stock");
      }
      cart.products[existingIndex].quentity = Number(productQuentity);
    } else {
      cart.products.push({ productId, quentity: Number(productQuentity) });
    }

    await cart.save();

    orderProducts.push({
      productId,
      quentity: productQuentity,
      price: product.price,
    });

    cart.products = cart.products.filter(
      (p) => p.productId._id.toString() !== productId
    );

    await cart.save();

    product.quentity -= Number(productQuentity);
    await product.save();
  } else {
    if (!cart.products || cart.products.length === 0) {
      throw createError(400, "Cart is empty");
    }
    for (const p of cart.products) {
      const product = await Product.findById(p.productId._id);
      if (!product) {
        throw createError(404, "Product not found");
      }
      if (product.quentity < p.quentity) {
        throw createError(400`Not enough stock for ${product.name}`);
      }

      orderProducts.push({
        productId: p.productId._id,
        quentity: p.quentity,
        price: product.price,
      });

      product.quentity -= p.quentity;
      await product.save();
    }

    cart.products = [];
    await cart.save();
  }

  const totalAmount = orderProducts.reduce(
    (acc, p) => acc + p.price * p.quentity,
    0
  );

  const order = await Order.create({
    user: userId,
    products: orderProducts,
    totalAmount,
  });

  res.status(200).json({
    status: true,
    order,
  });
});

export const getAllOrders = asynchandler(async (req, res) => {
  const orders = await Order.find().populate("products.productId");
  res.status(200).json({
    status: true,
    orders,
  });
});
