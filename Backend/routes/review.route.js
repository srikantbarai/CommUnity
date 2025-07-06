import express from "express"
import { createReviewForService, getAllReviewsForService, deleteReviewForService } from "../controllers/review.control.js";

const router = express.Router({ mergeParams: true });

router.get("/",getAllReviewsForService);
router.post("/",createReviewForService);
router.delete("/:reviewId",deleteReviewForService);

export default router;