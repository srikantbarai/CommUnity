import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

const secret = process.env.jwtsecret

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length<8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
        }
        const newUser = await User.create({
            fullName,
            email,
            password
        });
        return res.status(200).json({success: true, user: newUser});
    } catch (error) {
        console.log("Signup error");
        process.exit(1);
    }
}   

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const payload = {
            _id: user._id,
        };
        const token = jwt.sign(payload,secret,{
            expiresIn: "3d"
        });
        res.cookie("jwt",token);
        return res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.log("Login error");
        process.exit(1);
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({ success: true, message: "Logout successful" });
}