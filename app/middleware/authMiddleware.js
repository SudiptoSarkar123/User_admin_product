import jwt from "jsonwebtoken";
import createError from "../helper/createError.js";

const authCheck = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies.authCheck;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(createError(401, " Unauthorized access"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth error");

    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token has expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token"));
    }

    // Fallback for any other error
    return next(createError(500, "Authentication failed"));
  }
};


export default authCheck ;