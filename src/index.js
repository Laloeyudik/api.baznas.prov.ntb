import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import middCors from "./shared/middlewares/headers/cors-middle.js";
import middHeader from "./shared/middlewares/headers/header-middle.js";
import adminRoute from "./modules/users/routes/admin/admin-auth-route.js";
import middRateLimiter from "./shared/middlewares/rate-limite/rate-limit.js";
import middCompression from "./shared/middlewares/headers/compression-middle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.disable("x-powered-by'");
app.use(middCompression);
app.use(middCors);
app.use(middHeader);
app.use(middRateLimiter());

/**
 * @description Testing with ejs
 * @routes login admin
 *
 */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));

app.get("//favicon.ico", (req, res) => {
  res.statusCode(204);
});
app.get("/", (req, res) => {
  res.render(path.join(__dirname, "../views/home"));
});
app.get("/v1/login", (req, res) => {
  const { otl_token } = req.query;
  if (otl_token) {
    return res.redirect("/v1/login");
  }
  res.render(path.join(__dirname, "../views/pages/getlink"));
});

app.get("/v1/login/verify", (req, res) => {
  const { otl_token } = req.query;
  if (!otl_token) {
    return res.json("Token tidak ada");
  }
  res.render(path.join(__dirname, "../views/pages/login"), { otl_token });
});

/**
 * @description Route untuk semua modul
 *
 * */

app.use("/v1/", adminRoute);

/**
 * @scoop {global}
 * @description Error Handler
 * @param {Error} err
 *
 */

app.use(function (err, req, res, next) {
  console.log(err?.name, err.stack);

  if (err) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      status: "error",
      statusCode: statusCode,
      message: err.message ?? "Opps.. server gangguan, mohon cobalagi nanti",
      name: err.name,
      error: err.error ?? null,
    });
  }
});

export default app;
