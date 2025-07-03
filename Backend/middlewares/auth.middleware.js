import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const secret = process.env.jwtsecret;
        if (!token) {
            return res.status(401).json({ data: "Unauthenticated - No token provided" });
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({ data: "Unauthenticated - Invalid token" });
        }
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ data: "Unauthenticated - User not found" });
        }
        req.user = user;    
        next();
    } catch (error) {
        return res.status(500).json({ data: "Error in verify token middleware" });
    }
}