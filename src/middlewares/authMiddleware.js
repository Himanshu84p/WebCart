import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    }

    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if(!decodeToken) {
      return res.status(404).json(new ApiError(404, "Invalid access Token"));
    }
    
    const user = await User.findById(decodeToken?._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json(new ApiError(404, "Invalid token"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  }
});