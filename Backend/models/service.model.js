import mongoose from "mongoose";
import {serviceCategories} from "../lib/serviceCategories.js"
import {cityEnum,stateEnum} from "../lib/serviceLocations.js"

const serviceSchema = new mongoose.Schema({
    enterpriseName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: serviceCategories
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        city: {
            type: String,
            required: true,
            enum: cityEnum
        },
        state: {
            type: String,
            required: true,
            enum: stateEnum
        }
    },
    contact_info: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    imageUrl: {
        type: String,
        default: null
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {timestamps: true}
);

serviceSchema.methods.updateAverageRatingOnNewReview = async function(rating) {
    try {
        const totalRating = this.averageRating*this.reviewCount
        this.averageRating = (totalRating+rating)/(this.reviewCount+1);
        this.reviewCount++;
        await this.save();
    } catch (error) {
        console.error('Error updating average rating1:', error);
        process.exit(1);
    }
}

serviceSchema.methods.updateAverageRatingOnDeleteReview = async function(rating) {
    try {
        const totalRating = this.averageRating*this.reviewCount
        if (this.reviewCount===1) this.averageRating = 0;
        else this.averageRating = (totalRating-rating)/(this.reviewCount-1);
        this.reviewCount--;
        await this.save();
    } catch (error) {
        console.error('Error updating average rating3:', error);
        process.exit(1);
    }
}

const Service = mongoose.model('Service', serviceSchema);
export default Service;