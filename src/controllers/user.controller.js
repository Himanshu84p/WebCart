import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

//function to return an api error which take three para
const returnApiError = (res, statusCode, message) => {
  return res.status(statusCode).json(new ApiError(statusCode, message));
};

//function to return api response which take four para
const returnApiResponse = (res, statusCode, data, message) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};

//function to generate the token
const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const token = user.generateToken();
    user.token = token;
    await user.save({ validateBeforeSave: false }); //false because validation needs to off while saving otherwise it gives an error

    return { token };
  } catch (error) {
    console.log("Error occured in generating token", error);
  }
};
//******************************************************************api functions here

//register user
const registerUser = asyncHandler(async (req, res) => {
  //take user from frontend
  //check for empty value
  //check user already exist or not
  //create user object and save in db
  //remove password and token from response
  //check for user creation
  //return response

  const { name, username, email, phoneNumber, password, gender, profile } =
    req.body;
  console.log("data", req.body);
  if (
    [name, username, email, password, gender].some(
      (feild) => feild?.trim() === ""
    ) ||
    !phoneNumber
  ) {
    return returnApiError(res, 400, "All the fields are required");
  }

  //checking if user existed or not
  const existedUser = await User.findOne({ $or: [{ email, username }] });

  if (existedUser) {
    return returnApiError(res, 409, "User already exist");
  }

  const user = await User.create({
    name,
    username,
    email,
    phoneNumber,
    password,
    gender,
    profile,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return returnApiError(res, 500, "User creation failed");
  }

  return returnApiResponse(res, 201, createdUser, "User created successfully");
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email || !password) {
    return returnApiError(
      res,
      400,
      "email / username and password is required"
    );
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return returnApiError(res, 404, "user not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return returnApiError(res, 400, "Password is incorrect");
  }

  const { token } = await generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -token");

  return returnApiResponse(
    res,
    200,
    { loggedInUser, token },
    "User Logged in successfully"
  );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  await User.findOneAndUpdate(
    req.user._id,
    {
      $unset: {
        token: "",
      },
    },
    {
      new: true,
    }
  );

  return returnApiResponse(res, 200, {}, "Logout Successfully");
});

//getting user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).select("-password -token");
  return returnApiResponse(res, 200, user, "User fetched successfully");
});

//getting user
const getAllUser = asyncHandler(async (req, res) => {
  const allUsers = await User.find({}).select("-password");
  return returnApiResponse(
    res,
    200,
    allUsers,
    "All Users fetched successfully"
  );
});

//edit user details
const editUser = asyncHandler(async (req, res) => {
  //take inputs from frontend
  //check for empty values
  //check already exist or not
  //update user and save in db
  //send user updated in res
  console.log("user is ", req.user);
  const { name, username, email, phoneNumber, gender } = req.body;

  if (
    [name, username, email, gender].some((field) => field?.trim() === "") ||
    !phoneNumber
  ) {
    return returnApiError(res, 400, "All Fields are required");
  }

  if (phoneNumber.toString().length != 10) {
    return returnApiError(res, 400, "Enter Valid Mobile Number");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
    _id: { $ne: req.user?._id },
  });
  if (existedUser) {
    return returnApiError(res, 401, "User alredy exist with username or email");
  }

  const updatedUser = await User.findOneAndUpdate(
    //! You should set the new option to true to return the document after update was applied.
    req.user?._id,
    {
      $set: {
        name,
        username,
        email,
        phoneNumber,
        gender,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return returnApiResponse(
    res,
    200,
    updatedUser,
    "User Details updated successfully"
  );
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.deleteOne(req.user._id).select("-password -token");
  return returnApiResponse(res, 200, user, "User deleted successfully");
});

export {
  registerUser,
  getUser,
  deleteUser,
  editUser,
  loginUser,
  logoutUser,
  getAllUser,
};
