import User from "../models/user.models.js"

export const listServiceDetails = async (req,res) => {
    const service = await Service.findById(req.params.id);
    return res.status(200).json(service);
}