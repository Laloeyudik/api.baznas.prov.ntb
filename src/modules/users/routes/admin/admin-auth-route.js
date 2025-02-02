import express from "express";
import {fileURLToPath} from "url";
import path from "path";

import {
  oneTimeLink,
  loginVerify,
} from "../../controllers/admin/admin-auth-controller.js";

const adminRoute = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

adminRoute
  .route("/login")
  .get(function (req, res) {
    res.render(path.join(__dirname, "../../../../../views/pages/getlink"));
  })
  .post(oneTimeLink);
adminRoute
  .route("/login/verify")
  .get(function (req, res) {
    const { otl_token } = req.query;
    if (!otl_token) {
      res.json("Token tidak ada");
    }
    res.render(path.join(__dirname, "../../../../../views/pages/login"), { otl_token });
  })
  .post(loginVerify);

export default adminRoute;
