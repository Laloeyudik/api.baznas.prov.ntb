import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const middCors = cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
});

export default middCors;
