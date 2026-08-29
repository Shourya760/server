import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generatePassword = (length = 8) => {
    return crypto.randomBytes(length)
        .toString("base64url")
        .slice(0, length);
};


export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};