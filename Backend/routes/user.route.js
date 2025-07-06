import express from "express"
import { getMyInfo, updateMyInfo} from "../controllers/user.control.js";

const router = express.Router();

router.get("/me",getMyInfo);
router.patch("/me",updateMyInfo);

export default router;