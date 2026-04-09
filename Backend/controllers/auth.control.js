import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

const secret = process.env.jwtsecret
const issueJwtCookie = (res, userId) => {
    const payload = { _id: userId };
    const token = jwt.sign(payload, secret, { expiresIn: "3d" });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 3*24*60*60*1000
    });
};

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
        if (!user.password) {
            return res.status(400).json({ data: "This account uses Google login" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ data: "Invalid email or password" });
        }
        issueJwtCookie(res, user._id);
        
        return res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ data: "Login error" });
    }
}

export const googleCallback = async (req, res) => {
    try {
        // `req.user` is set by passport strategy
        const user = req.user;
        if (!user?._id) {
            return res.status(401).json({ data: "Google login failed" });
        }

        issueJwtCookie(res, user._id);

        const frontend = process.env.FRONTEND_URL;
        if (frontend) {
            return res.redirect(`${frontend.replace(/\/+$/, "")}/`);
        }
        return res.status(200).json({ data: user });
    } catch (_error) {
        return res.status(500).json({ data: "Google login error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            expires: new Date(0)
        });
        return res.status(200).json({ data: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ data: "Logout error" });
    }
}