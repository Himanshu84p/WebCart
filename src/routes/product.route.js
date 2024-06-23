import { Router } from "express";
import { getAllProducts, getProduct } from "../controllers/product.controller.js";

const router = Router();

// Product routes
router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);

export default router;
