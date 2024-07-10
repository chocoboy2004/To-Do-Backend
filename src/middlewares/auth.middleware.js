import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = AsyncHandler(async(req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(401, "Token got expired")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(decodeToken);
    const getUser = await User.findById(decodeToken._id).select("-password -refreshToken")

    if (!getUser) {
        throw new ApiError(401, "Invalid public or secret key")
    }

    req.user = getUser
    next()
})

export default verifyJWT;