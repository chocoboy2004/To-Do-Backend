import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = AsyncHandler(async(req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        throw new ApiError(200, "No fields should be empty")
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be atleast 8 digits")
    }

    const response = await User.findOne({ email })
    if (response) {
        throw new ApiError(400, "Existed user")
    }

    const user = await User.create({
        firstname: firstname.trim().toLowerCase(),
        lastname: lastname.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password.toString()
    })

    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User registered successfully!"
        )
    )
})

export { registerUser }