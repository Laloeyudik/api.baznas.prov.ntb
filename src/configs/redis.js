import Redis from "ioredis";
import * as dotenv from "dotenv";
import {Queue, Worker} from "bullmq"
dotenv.config();

const redisOptions = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASS,
      tls: process.env.REDIS_TLS_SSL ? {} : undefined,
      db: process.env.REDIS_DB,
    };

const cached = new Redis(redisOptions);

export { cached, Queue, Worker};
