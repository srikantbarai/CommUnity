import Review from "../models/review.model.js"
import Service from "../models/service.model.js";

export const getAllReviewsForService = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const reviews = await Review.find({ serviceId: serviceId });
        return res.status(200).json({ data: reviews });
    } catch (error) {
        return res.status(500).json({ data: "Error fetching reviews" });
    }
}

export const createReviewForService = async (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    const { rating, comment } = req.body;
    try {
        if (!rating || !comment) {
            return res.status(400).json({ data: "All fields are required" });
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        const newReview = await Review.create({
            userId: userId,
            serviceId: serviceId,
            rating,
            comment
        });
        await service.updateAverageRatingOnNewReview(parseInt(rating));
        return res.status(201).json({ data: newReview });
    } catch (error) {
        return res.status(500).json({ data: "Create Review Error" });
    }
}

export const editReviewForService = async (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    const { rating, comment } = req.body;
    
    try {
        if (!rating && !comment) {
            return res.status(400).json({ data: "At least one field (rating or comment) is required" });
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ data: "Review not found" });
        }
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({ data: "Not authorized to edit this review" });
        }
        if (review.serviceId.toString() !== serviceId.toString()) {
            return res.status(400).json({ data: "Review does not belong to this service" });
        }
        const oldRating = review.rating;
    
        if (rating) review.rating = parseInt(rating);
        if (comment) review.comment = comment;
        
        const updatedReview = await review.save();

        if (rating && parseInt(rating) !== oldRating) {
            await service.updateAverageRatingOnEditReview(oldRating, parseInt(rating));
        }

        return res.status(200).json({ data: updatedReview });
    } catch (error) {
        return res.status(500).json({ data: "Edit Review Error" });
    }
};

export const deleteReviewForService = async (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ data: "Review not found" });
        }
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({ data: "Not authorized to delete this review" });
        }
        if (review.serviceId.toString() !== serviceId.toString()) {
            return res.status(400).json({ data: "Review does not belong to this service" });
        }
        const rating = review.rating;
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);

        await service.updateAverageRatingOnDeleteReview(rating);

        return res.status(200).json({ data: deletedReview });
    } catch (error) {
        return res.status(500).json({ data: "Delete Review Error" });
    }
};