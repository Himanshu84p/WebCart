import { Router } from "express";
import {
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCart,
  deleteCart,
  decreaseStockQuantity,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Cart routes
router.route("/add-item").post(verifyJWT, addItemToCart);
router.route("/update-item").put(verifyJWT, updateCartItem);
router.route("/remove-item").delete(verifyJWT, removeItemFromCart);
router.route("/").get(verifyJWT, getCart);
router.route("/delete-cart").delete(verifyJWT, deleteCart);
router.route("/order").post(verifyJWT, decreaseStockQuantity);

export default router;
