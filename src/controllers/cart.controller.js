import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Helper functions for API responses and errors
const returnApiError = (res, statusCode, message) => {
  return res.status(statusCode).json(new ApiError(statusCode, message));
};

const returnApiResponse = (res, statusCode, data, message) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};

//function to calculate price of cart
const calculateTotalPrice = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    console.log("product ", product);
    total += product.price * item.quantity;
  }
  cart.totalPrice = total;
  await cart.save();
  await cart.populate("items.productId");

  return cart;
};
//******************************************************************api functions here

// Add item to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return returnApiError(res, 400, "Product ID and quantity are required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    return returnApiError(res, 404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  console.log("idx", existingItemIndex);

  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity =
      cart.items[existingItemIndex].quantity + quantity;
  } else {
    cart.items.push({
      productId: productId,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  console.log(cart);
  await calculateTotalPrice(cart);

  return returnApiResponse(res, 200, cart, "Item added to cart successfully");
});

// Update item quantity in cart
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  console.log("productId", productId, req.user._id);

  if (!productId || !quantity) {
    return returnApiError(res, 400, "Product ID and quantity are required");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return returnApiError(res, 404, "Cart not found");
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex === -1) {
    return returnApiError(res, 404, "Item not found in cart");
  }

  cart.items[existingItemIndex].quantity = quantity;

  await calculateTotalPrice(cart);

  return returnApiResponse(res, 200, cart, "Cart item updated successfully");
});

// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  console.log("productId", productId);

  if (!productId) {
    return returnApiError(res, 400, "Product ID is required");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return returnApiError(res, 404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await calculateTotalPrice(cart);

  return returnApiResponse(
    res,
    200,
    cart,
    "Item removed from cart successfully"
  );
});

// Get cart details
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.productId"
  );

  if (!cart) {
    return returnApiError(res, 404, "Cart not found");
  }

  return returnApiResponse(res, 200, cart, "Cart details fetched successfully");
});
// delete cart details
const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  if (!cart) {
    return returnApiError(res, 404, "Cart not found");
  }

  return returnApiResponse(res, 200, cart, "Cart deleted successfully");
});

export {
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCart,
  deleteCart,
};
