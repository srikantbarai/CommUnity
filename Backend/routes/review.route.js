import express from "express"
import { createReviewForService, getAllReviewsForService, editReviewForService, deleteReviewForService } from "../controllers/review.control.js";

const router = express.Router({ mergeParams: true });

router.get("/",getAllReviewsForService);
router.post("/",createReviewForService);
router.patch("/:reviewId", editReviewForService);
router.delete("/:reviewId",deleteReviewForService);

export default router;