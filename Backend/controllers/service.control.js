import User from "../models/user.models.js"
import Service from "../models/service.model.js";
import Review from "../models/review.model.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const listServices = async (req, res) => {
    const allServices = await Service.find({});
    return res.status(200).json({success: true, data: allServices});
}

export const listServiceDetails = async (req,res) => {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
        return res.status(404).json({ success: false, data: "Service not found" });
    }
    return res.status(200).json({success: true, data:service});
}

export const registerService = async (req,res) => {
    const {enterpriseName, category, description, address, city, state, phone, email, imageUrl } = req.body;
    const ownerId = req.user._id;
    try {
        if (!enterpriseName || !category || !description || !address || !city || !state || !phone || !email && !imageUrl) {
            return res.status(400).json({success: false, data: "All fields are required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({success: false, data: "Invalid email format" });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({success: false, data: "Invalid Phone number format" });
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
        return res.status(201).json({success: true, data: newService});
    } catch (error) {
        return res.status(500).json({success: false, data: "Service register error"})
    }
}

export const editService = async (req, res) => {
    const { enterpriseName, description, address, city, state, phone, email, imageUrl} = req.body;
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    try {
        if (!enterpriseName && !description && !address && !city && !state && !phone && !email && !imageUrl) {
            return res.status(400).json({ success: false, data: "At least one field is required" });
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, data: "Service not found" });
        }
        if (service.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, data: "Not authorized to edit this service" });
        }
        if (enterpriseName) service.enterpriseName = enterpriseName;
        if (description) service.description = description;
        if (address) service.address = address;
        if (city) service.location.city = city;
        if (state) service.location.state = state;
        if (phone) {
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ success: false, data: "Invalid phone number format" });
            }
            service.contact_info.phone = phone;
        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, data: "Invalid email format" });
            }
            service.contact_info.email = email;
        }
        if (imageUrl) service.imageUrl = imageUrl;
        const updatedService = await service.save();
        return res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
        return res.status(500).json({success: false, data: "Edit Service Error"})
    }
}

export const deleteService = async (req,res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    const password = req.body.password;
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, data: "Service not found" });
        }
        if (service.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, data: "Not authorized to delete this service" });
        }
        
        const user = await User.findById(userId);
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({success: false, data: "Invalid password" });

        const deletedService = await Service.findByIdAndDelete(serviceId);
        await Review.deleteMany({ serviceId: serviceId });
        return res.status(200).json({success: true, data: deletedService});
    } catch(error) {
        return res.status(500).json({success: false, data: "Delete Service Error"})
    }
}