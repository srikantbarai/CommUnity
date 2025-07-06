import User from "../models/user.models.js"

export const getMyInfo = async (req, res) => {
    try {
        const me = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ data: me });
    } catch (error) {
        return res.status(500).json({ data: "Error fetching user info" });
    }
}

export const updateMyInfo = async (req, res) => {
    const { fullName, password, profilePicUrl } = req.body;
    try {
        if (!fullName && !password && !profilePicUrl) {
            return res.status(400).json({ data: "At least one field is required" });
        }
        if (password && password.length < 8) {
            return res.status(400).json({ data: "Password must be at least 8 characters" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ data: "User not found" });
        }
        
        if (fullName) user.fullName = fullName;
        if (password) user.password = password; 
        if (profilePicUrl) user.profilePicUrl = profilePicUrl;
        
        const updatedMe = await user.save();
        return res.status(200).json({ data: updatedMe });
    } catch (error) {
        return res.status(500).json({ data: "Update User Info Error" });
    }
}