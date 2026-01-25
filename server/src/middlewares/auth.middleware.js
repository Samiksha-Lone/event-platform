const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

async function authenticateToken(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: Login First" });
    }

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(verified.id).select('-password');

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
        next();

    } catch(err) {

        res.status(400).json({ message: "Invalid Token" });

    }

}

module.exports = {
    authenticateToken
}