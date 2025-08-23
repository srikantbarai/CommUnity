import express from "express";
import {getSummaryOfAllReviews} from "../controllers/ai.control.js"

const router = express.Router({ mergeParams: true });

router.get("/",getSummaryOfAllReviews);

export default router;