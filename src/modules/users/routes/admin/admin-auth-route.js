import express from "express";
import {
  oneTimeLink,
  loginVerify,
} from "../../controllers/admin/admin-auth-controller.js";

const adminRoute = express();

adminRoute
  .route("/login")
  .get(function (req, res) {
    res.render("../../../../../views/pages/getlink");
  })
  .post(oneTimeLink);
adminRoute
  .route("/login/verify")
  .get(function (req, res) {
    const { otl_token } = req.query;
    if (!otl_token) {
      res.json("Token tidak ada");
    }
    res.render("../../../../../views/pages/login", { otl_token });
  })
  .post(loginVerify);

export default adminRoute;
