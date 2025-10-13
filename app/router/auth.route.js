import express from "express";
import {
  addUser,
  clearCookies,
  getUser,
  login,
  register,
  updateUser,
} from "../controller/auth.controller.js";
import authCheck from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adiminCheck.js";
import upload from "../middleware/multerMiddleware.js";
const AuthRouter = express.Router();

// All auth route 

AuthRouter.post("/login", login);
AuthRouter.post("/register", register);
AuthRouter.post("/add-user", authCheck, isAdmin, addUser);
AuthRouter.put("/update-user/:id", authCheck,upload.none(),updateUser);
AuthRouter.get("/profile", authCheck,isAdmin,getUser);

AuthRouter.get("/logout",authCheck,clearCookies)

export default AuthRouter;
