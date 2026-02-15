const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const {sendResetEmail} = require('../utils/mailer');
const { verify2FAToken } = require('./2fa.controller');
const { logAuthEvent, logSecurityEvent } = require('../middlewares/logger.middleware');
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
            secure: process.env.NODE_ENV === 'production',
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
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password, twoFactorToken } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({email});

        if(!user) {
            logSecurityEvent('LOGIN_FAILED', { email, reason: 'User not found' });
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.isLocked) {
            logSecurityEvent('LOGIN_BLOCKED', { 
                userId: user._id, 
                email, 
                reason: 'Account locked' 
            });
            return res.status(423).json({ 
                message: 'Account is locked due to too many failed login attempts. Please try again later.' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            await user.incLoginAttempts();
            logSecurityEvent('LOGIN_FAILED', { 
                userId: user._id, 
                email, 
                reason: 'Invalid password',
                attempts: user.loginAttempts + 1
            });
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.twoFactorEnabled) {
            if (!twoFactorToken) {
                return res.status(200).json({ 
                    message: '2FA required',
                    requires2FA: true,
                    userId: user._id
                });
            }

            const is2FAValid = verify2FAToken(user.twoFactorSecret, twoFactorToken);
            if (!is2FAValid) {
                await user.incLoginAttempts();
                logSecurityEvent('2FA_FAILED', { 
                    userId: user._id, 
                    email,
                    attempts: user.loginAttempts + 1
                });
                return res.status(400).json({ message: 'Invalid 2FA token' });
            }
        }

        if (user.loginAttempts > 0 || user.lockUntil) {
            await user.resetLoginAttempts();
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        logAuthEvent('LOGIN_SUCCESS', user._id, { email });

        res.status(200).json({ 
            message: 'User logged in successfully', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                twoFactorEnabled: user.twoFactorEnabled
            }, 
            token 
        });
    } catch (error) {
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
          id: req.user._id,
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
        
        try {
            await sendResetEmail(user.email, resetLink);
            return res.json({
                message: 'Password reset link has been sent to your email'
            });
        } catch (emailError) {
  
            if (process.env.NODE_ENV === 'development') {
                return res.json({
                    message: 'Password reset link generated (check server console for the link in development)',
                    devNote: 'Reset link logged to server console. Copy it from there.'
                });
            }
            
            return res.status(200).json({ 
                message: 'Your request was processed, but the email service is currently unavailable. Please try again later.',
                warning: 'Email service error'
            });
        }

    } catch (error) {

        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });

    }
}

async function passwordStrength(password = '') {
  if (!password) {
    return { score: 0, percent: 0, label: '', color: 'bg-red-500' };
  }

  let score = 0;

  if (password.length >= 8) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;

  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (hasSpecial) score += 2; 

  const maxScore = 5; 
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
      return res
        .status(400)
        .json({ message: 'Reset link is invalid or has expired' });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset link' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
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