import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asynchandler from "express-async-handler";
import createError from "../helper/createError.js";

export const createOrder = asynchandler(async (req, res) => {
  const userId = req.user.id;
  console.log(req.body); // req.body
  const { productId, quentity } = req.body || {};
  const productQuentityRaw =
    typeof quentity === "string" ? Number(quentity) : quentity;
  const productQuentity = productQuentityRaw === 0 ? 1 : productQuentityRaw;

  let cart = await Cart.findOne({ user: userId });

  console.log("Cart", cart);
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] });
  }

  let orderProducts = [];

  if (productId && productQuentity) {
    const product = await Product.findById(productId);
    console.log("The Product :", product); //product

    if (!product) throw createError(404, "Product not found");
    // find index of product

    const existingIndex = cart.products.findIndex((p) => {
      const idCandidate =
        p?.productId && p.productId._id ? p.productId._id : p?.productId;
      if (!idCandidate) return false;
      return idCandidate.toString() === productId;
    });

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

    await cart.save();

    product.quentity -= Number(productQuentity);
    await product.save();
  } else {
    if (!cart.products || cart.products.length === 0) {
      throw createError(400, "Cart is empty");
    }
    for (const p of cart.products) {
      const pid =
        p?.productId && p.productId._id ? p.productId._id : p?.productId;
      const product = await Product.findById(pid);
      if (!product) {
        throw createError(404, "Product not found");
      }
      if (product.quentity < p.quentity) {
        throw createError(400, `Not enough stock for ${product.name}`);
      }

      orderProducts.push({
        productId: product._id,
        quentity: p.quentity,
        price: product.price,
      });

      product.quentity -= p.quentity;
      await product.save();
    }
    // Do not clear the cart after ordering; preserve user's cart entries
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

export const getMyOrders = asynchandler(async (req, res) => {
  const userId = req.user.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get paginated orders
  const orders = await Order.find({ user: userId })
    .populate("products.productId", "name price imageUrl")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean(); 

    // console.log(orders[0].products)
  const totalOrders = await Order.countDocuments({ user: userId });

  if (!orders.length) throw createError(404, "Orders not found");

  // Format each order
  const formattedOrders = orders.map(order => {
    let totalAmount = 0;
    let totalQuantity = 0;

    const products = order.products.map(item => {
      totalAmount += item.productId.price * item.quentity;
      totalQuantity += item.quentity;

      return {
        _id: item.productId._id,  
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.imageUrl,
        quentity: item.quentity
      };
    });

    return {
      orderId: order._id,
      totalAmount,
      totalQuantity,
      products,
      createdAt: order.createdAt
    };
  });

  return res.status(200).json({
    status: true,
    page,
    limit,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    orders: formattedOrders
  });
});



// export const getOrderDetails = asynchandler(async (req, res) => {
//   const orderId = req.params.id;
// })