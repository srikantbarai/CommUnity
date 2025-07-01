import Service from "../models/service.model.js"

export const listServices = async (req, res) => {
    const allServices = await Service.find({});
    return res.status(200).json(allServices);
}

export const listServiceDetails = async (req,res) => {
    const service = await Service.findById(req.params.id);
    return res.status(200).json(service);
}

export const registerService = async (req,res) => {
    const {enterpriseName, category, description, address, city, state, phone, email } = req.body;
    const ownerId = req.user._id;
    try {
        if (!enterpriseName || !category || !description || !address || !city || !state || !phone || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid Phone number format" });
        }
        const newService = await Service.create({
            enterpriseName, 
            category, 
            description, 
            address, 
            location: { city, state },
            contact_info: { phone, email },
            owner: ownerId
        });
        return res.status(200).json({success: true, service: newService});
    } catch (error) {
        console.log("Service register error",error);
        process.exit(1);
    }
}