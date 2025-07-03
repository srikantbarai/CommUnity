import User from "../models/user.models.js"

export const getMyInfo = async (req,res) => {
    const me = await User.findById(req.user._id);
    return res.status(200).json({success: true, data: me});
}

export const updateMyInfo = async (req,res) => {
    const {fullName, password, profilePicUrl} = req.body;
    try {
        if (!fullName && !password && !profilePicUrl) {
            return res.status(400).json({success: false, data: "At least one field is required"});
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({success: false, data: "User not found"});

        if (fullName) user.fullName = fullName;
        if (password) user.password = password; 
        if (profilePicUrl) user.profilePicUrl = profilePicUrl;
        
        const updatedMe = await user.save();

        return res.status(200).json({success: true, data: updatedMe});
    } catch (error) {
        return res.status(500).json({success: false, data: "Update User Info Error"})
    }
}

export const getUserInfo = async (req,res) => {
    const user = await User.findById(req.params.userId);
    return res.status(200).json({success: true, data: user});
}