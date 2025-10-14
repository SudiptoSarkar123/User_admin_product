import asynchandler from "express-async-handler";
import { Validator } from "node-input-validator";
import createError from "../helper/createError.js";
import User from "../models/user.model.js";
import { comparePassword } from "../helper/passHelper.js";
import { generateToken } from "../helper/tokenGenerate.js";

//This route is for user login
export const login = asynchandler(async (req, res) => {
  const v = new Validator(req.body, {
    email: "required|string",
    password: "required|string",
  });

  const matched = v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createError(404, "user not found");
  const passcheck = await comparePassword(password, user.password);
  if (!passcheck) throw createError(400, "invalid email or password");

  const payload = { id: user._id, role: user.role };
  const token = generateToken(payload);

  res.status(200).json({
    message: "login successful",
    data: {
      name: user.name,
      email: user.email,
    },
    token,
  });
});

//This route is for user registration
export const register = asynchandler(async (req, res) => {
  const v = new Validator(req.body, {
    name: "required|string",
    email: "required|string|email",
    password: "required|string|minLength:6",
  });
  const matched = await v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }

  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw createError(409, "User already exists with this email");

  const newUser = new User({
    name,
    email,
    password,
    role: role ? role : "user",
  });
  await newUser.save();

  return res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
});

//This route is for add user
export const addUser = asynchandler(async (req, res) => {
  const v = new Validator(req.body, {
    name: "required|string",
    email: "required|email",
    password: "required|string|minLength:6",
  });

  const matched = await v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }
  const { name, email, password, role } = req.body;

  const user = await User.findOne({ email });
  if (user) throw createError(400, "User already exists");

  const newUser = new User({
    name,
    email,
    password,
    role: role ? role : "user",
  });
  await newUser.save();
  return res.status(201).json({
    message: "New user created successfully",
    user: newUser,
  });
});

//This route is for update user
export const updateUser = asynchandler(async (req, res) => {
  const userId = req.params.id;
  console.log("req.body", req.body);

  const v = new Validator(req.body, {
    name: "string",
    email: "email",
    password: "string|minLength:6",
    role: "in:user,admin",
  });
  const matched = await v.check();
  if (!matched) {
    throw createError(400, "validation error", v.errors);
  }

  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.role) user.role = req.body.role;
  if (req.body.password) user.password = req.body.password;

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

// This route is for get single user
export const getUser = asynchandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");
  res.status(200).json({ user });
});

// This route is for logout
export const clearCookies = asynchandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Cookies cleared" });
});
