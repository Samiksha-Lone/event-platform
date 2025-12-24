const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const {sendResetEmail} = require('../utils/mailer');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

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
        }, process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

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

        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({email});

        if(!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('User found:', user.email);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Password valid:', isPasswordValid);

        if(!isPasswordValid) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        console.log('Login successful for:', email);

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

async function getMe(req, res) {
  res.json({
    user: req.user
      ? {
          id: req.user.id || req.user._id,
          name: req.user.name,
          email: req.user.email,
        }
      : null,
  });
}

async function forgotPassword(req, res) {
    try {

        const {email} = req.body;

        if(!email) {
            return res.status(400).json({message: 'Email is required'});
        }

        const user = await userModel.findOne({ email });

        if(!user) {
            return res.status(200)
            .json({
                message: 'If that email exists, a reset link was sent'
            })
        }

        const resetToken =  jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;
        await sendResetEmail(user.email, resetLink);

        return res.json({
            message: 'Password reset link has been sent to your email'
        })

    } catch (error) {

        console.error('forgotPassword error:', error);
        return res.status(500).json({ message: 'Server error' });

    }
}

async function passwordStrength(password = '') {
  if (!password) {
    return { score: 0, percent: 0, label: '', color: 'bg-red-500' };
  }

  let score = 0;

  // base length rule
  if (password.length >= 8) score += 1;

  // extra rules
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;

  // SPECIAL CHARACTERS – REQUIRED FOR MAX SCORE
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (hasSpecial) score += 2; // give them highest weight

  const maxScore = 5; // 1 + 1 + 1 + 2
  const labels = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
  return {
    score,
    percent: Math.round((score / maxScore) * 100),
    label: labels[score],
    color: colors[score],
  };
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const { score } = passwordStrength(password);
    if (score < 5) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and include uppercase, number and special character.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log('jwt verify error:', err.message);
      return res
        .status(400)
        .json({ message: 'Reset link is invalid or has expired' });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset link' });
    }

    // use the validated password from body
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword
}