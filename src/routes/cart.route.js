import { Router } from "express";
import {
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCart
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Cart routes
router.route("/add-item").post(verifyJWT, addItemToCart);
router.route("/update-item").put(verifyJWT, updateCartItem);
router.route("/remove-item").delete(verifyJWT, removeItemFromCart);
router.route("/").get(verifyJWT, getCart);

export default router;
