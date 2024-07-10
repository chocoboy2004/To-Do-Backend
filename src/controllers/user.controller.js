import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const getUser = await User.findById(userId).select("-password");
    const accessToken = getUser.generateAccessToken();
    const refreshToken = getUser.generateRefreshToken();

    getUser.refreshToken = refreshToken;
    await getUser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw new ApiError(200, "No fields should be empty");
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be atleast 8 digits");
  }

  const response = await User.findOne({ email });
  if (response) {
    throw new ApiError(400, "Existed user");
  }

  const user = await User.create({
    firstname: firstname.trim().toLowerCase(),
    lastname: lastname.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password: password.toString(),
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body

  if(!email || !password) {
    throw new ApiError(400, "No fields should be empty")
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email")
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 digits")
  }

  const response = await User.findOne({ email })
  if (!response) {
    throw new ApiError(401, "You haven't registered yet! Please register yourself")
  }

  const isValidPass = await response.checkPassword(password.toString(), response.password)
  if (!isValidPass) {
    throw new ApiError(401, "Invalid password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(response._id)
  const user = await User.findById(response._id).select("-password -refrehToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, user, "User loggged in successfully!")
  )
});

const logoutUser = AsyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully!")
    )
})

export { 
    registerUser, 
    loginUser,
    logoutUser 
};
