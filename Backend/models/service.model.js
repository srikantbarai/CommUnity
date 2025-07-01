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
        set: val => Math.round(val * 10) / 10
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const Service = mongoose.model('Service', serviceSchema);

export default Service;