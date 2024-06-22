import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

// Helper function for API responses
const returnApiResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return returnApiResponse(res, 200, products, "Products fetched successfully");
});

export {
  getAllProducts
};
