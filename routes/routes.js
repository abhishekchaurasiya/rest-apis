import express from "express";
const router = express.Router();
import { loginController, logoutController, refreshController, registerController, userController, productController } from "../controller";

import admin from "../middlewares/admin";
import auth from "../middlewares/auth";

router.post("/register", registerController.register);

router.post("/login", loginController.login);

router.get("/me", auth, userController.me);

router.get("/refresh", refreshController.refreshToken);

router.post("/logout", auth, logoutController.logout)

router.post("/product", [auth, admin], productController.store)

router.put("/product/:id", [auth, admin], productController.update)

router.delete("/product/:id", [auth, admin], productController.deleteProduct)

router.get("/product", productController.getProductList)

router.get("/product/:id", productController.getSingleProduct)

export default router;

