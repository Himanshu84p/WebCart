import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";

const router = Router();

// Product routes
router.route("/").get(getAllProducts);

export default router;
