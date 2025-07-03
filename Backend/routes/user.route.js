import express from "express"
import { getUserInfo, getMyInfo, updateMyInfo} from "../controllers/user.control.js";

const router = express.Router();

router.get("/me",getMyInfo);
router.patch("/me",updateMyInfo);
router.get("/:userId",getUserInfo);

export default router;