import path from "path";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import compression from "compression";
import adminRoute from "./modules/users/routes/admin/admin-auth-route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

app.get("/favicon.ico", (req, res) => res.statusCode(204));

app.get("/", (req, res) => {
  res.render("../views/home");
});

/**
 * @description Route untuk semua modul
 *
 * */

app.use("/v1/", adminRoute);

/**
 * @description Testing with ejs
 * @routes login admin
 *
 */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));

/**
 * @scoop {global}
 * @description Error Handler
 * @param {Error} err
 *
 */

app.use(function (err, req, res, next) {
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
