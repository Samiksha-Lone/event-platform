const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!password || password.length < 6) return res.status(400).json({ message: 'Password too short' });

        const isUserExist = await userModel.findOne({email});

        if(isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })

        res.status(201).json({ 
            message: 'User registered successfully', 
            newUser: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }, 
            token 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({email})

        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })

        res.status(200).json({ 
            message: 'User logged in successfully', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }, 
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ 
        message: 'User logged out successfully' 
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}