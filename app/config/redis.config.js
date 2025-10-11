import Redis from "ioredis";

const redis = new Redis({
  port: 18808, // Redis port
  host: "redis-18808.c257.us-east-1-3.ec2.redns.redis-cloud.com", // Redis host
  username: "default", // needs Redis >= 6
  password: "dPoJ2YnYLlBQ7xCnSU9TbqY8uKpGacDH",
  db: 0,
});


export default redis ;
