import express from "express"
import { signup, login, logout } from "../controllers/auth.control.js"

const router = express.Router();

router.get("/signup", (req,res) =>{
    return res.end("Signup page")
});

router.post("/signup", signup);

router.get("/login", (req,res) => {
    return res.end("Login page")
});

router.post("/login", login);

router.post("/logout",logout)

export default router;