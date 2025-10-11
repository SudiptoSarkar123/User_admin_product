import createError from "../helper/createError.js";

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "admin") {
    throw createError(400, "You are not authorized into this route");
  }
  next();
};

export default isAdmin;
