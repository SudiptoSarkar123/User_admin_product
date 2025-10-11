import redis from "../config/redis.config.js";
import asynchandler from "express-async-handler";

export const redisMiddleware = asynchandler(async (req, res, next) => {
  const casheKey = req.originalUrl;
  const casheResponse = await redis.get(casheKey);

  if (casheResponse) {
    console.log("Data served from redis ceche");
    return res.send(JSON.parse(casheResponse));
  }
  next();
});
