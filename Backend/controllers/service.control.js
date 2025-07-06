import User from "../models/user.models.js"
import Service from "../models/service.model.js";
import Review from "../models/review.model.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const listServices = async (req, res) => {
    try {
        const {userServices, category, city, state } = req.query;
        if (userServices) {
            const services = await Service.find({ownerId: req.user._id}).sort("-averageRating")
            return res.status(200).json({ data: services });
        }
        const filter = {};
        if (category) filter.category = category;
        if (city) filter['location.city'] = city; 
        if (state) filter['location.state'] = state;
        const services = await Service.find(filter).sort("averageRating");
        return res.status(200).json({ data: services });
    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({ data: "Error fetching services" });
    }
};

export const listServiceDetails = async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId).populate({
            path: "ownerId",
            select: "-password"
        });
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        return res.status(200).json({ data: service });
    } catch (error) {
        return res.status(500).json({ data: "Error fetching service details" });
    }
}

export const registerService = async (req, res) => {
    const { enterpriseName, category, description, address, city, state, phone, email, imageUrl } = req.body;
    const ownerId = req.user._id;
    try {
        if (!enterpriseName || !category || !description || !address || !city || !state || !phone || !email || !imageUrl) {
            return res.status(400).json({ data: "All fields are required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ data: "Invalid email format" });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ data: "Invalid phone number format" });
        }
        const newService = await Service.create({
            enterpriseName, 
            category, 
            description, 
            address, 
            location: { city, state },
            contact_info: { phone, email },
            ownerId: ownerId,
            imageUrl
        });
        return res.status(201).json({ data: newService });
    } catch (error) {
        return res.status(500).json({ data: "Service register error" });
    }
}

export const editService = async (req, res) => {
    const { description, address, city, state, phone, email, imageUrl } = req.body;
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    try {
        if (!description && !address && !city && !state && !phone && !email && !imageUrl) {
            return res.status(400).json({ data: "At least one field is required" });
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        if (service.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ data: "Not authorized to edit this service" });
        }
        if (description) service.description = description;
        if (address) service.address = address;
        if (city) service.location.city = city;
        if (state) service.location.state = state;
        if (phone) {
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ data: "Invalid phone number format" });
            }
            service.contact_info.phone = phone;
        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).json({ data: "Invalid email format" });
            }
            service.contact_info.email = email;
        }
        if (imageUrl) service.imageUrl = imageUrl;
        const updatedService = await service.save();
        return res.status(200).json({ data: updatedService });
    } catch (error) {
        return res.status(500).json({ data: "Edit Service Error" });
    }
}

export const deleteService = async (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    const password = req.headers['x-user-password'];
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ data: "Service not found" });
        }
        if (service.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ data: "Not authorized to delete this service" });
        }
        
        const user = await User.findById(userId);
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ data: "Invalid password" });
        }
        const deletedService = await Service.findByIdAndDelete(serviceId);
        await Review.deleteMany({ serviceId: serviceId });
        return res.status(200).json({ data: deletedService });
    } catch(error) {
        return res.status(500).json({ data: "Delete Service Error" });
    }
}