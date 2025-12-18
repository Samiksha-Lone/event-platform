const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

async function authenticateToken(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied: Login First" });
    }

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(verified.id);

        req.user = user;
        next();

    } catch(err) {

        res.status(400).json({ message: "Invalid Token" });

    }

}

module.exports = {
    authenticateToken
}