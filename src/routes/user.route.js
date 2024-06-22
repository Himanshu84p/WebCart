import { Router } from "express";
import {
  deleteUser,
  editUser,
  getAllUser,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

//user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/curr-user").get(verifyJWT, getUser);
router.route("/all").get(verifyJWT, getAllUser);
router.route("/update-details").put(verifyJWT, editUser);
router.route("/delete-user").delete(verifyJWT, deleteUser);

export default router;