const jwt = require("jsonwebtoken");
const User = require("../../modules/userSchema");

exports.me = async (req, res) => {
    const token = req.cookies.token;
    try {
        if (!token) return res.status(401).json({ message: "No token" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");

        if (!user) return res.status(401).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }
};
