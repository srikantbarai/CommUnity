import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

const secret = process.env.jwtsecret

export const signup = async (req, res) => {
    const { fullName, email, password, profilePicUrl } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ data: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ data: "Password must be at least 8 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ data: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ data: "Email already exists, please use a different one" });
        }
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicUrl
        });
        return res.status(201).json({ data: newUser });
    } catch (error) {
        return res.status(500).json({ data: "Signup error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ data: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ data: "Invalid email or password" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ data: "Invalid email or password" });
        }
        const payload = {
            _id: user._id,
        };
        const token = jwt.sign(payload, secret, {
            expiresIn: "3d"
        });
        res.cookie("jwt", token);
        return res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ data: "Login error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ data: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ data: "Logout error" });
    }
}