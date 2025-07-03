import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const secret = process.env.jwtsecret;
        if (!token) {
            return res.status(401).json({success: false, data: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({success: false, data: "Unauthorized - Invalid token" });
        }
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({success: false, data: "Unauthorized - User not found" });
        }
        req.user = user;    
        next();
    } catch (error) {
        return res.status(500).json({ success: false, data: "Error in verify token middleware" });
    }
}