import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        toLowerCase: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        toLowerCase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        toLowerCase: true,
        trim: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    } else {
        next()
    }
})

userSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema)

export default User