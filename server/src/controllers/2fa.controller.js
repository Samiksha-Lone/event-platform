const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/user.model');
const { logAuthEvent, logSecurityEvent } = require('../middlewares/logger.middleware');

async function setup2FA(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    const secret = speakeasy.generateSecret({
      name: `EventHub (${user.email})`,
      length: 32
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    user.twoFactorSecret = secret.base32;
    await user.save();

    logAuthEvent('2FA_SETUP_INITIATED', userId, { email: user.email });

    res.json({
      message: '2FA setup initiated',
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function enable2FA(req, res) {
  try {
    const userId = req.user._id;
    const { token } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: 'Please setup 2FA first' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 
    });

    if (!verified) {
      logSecurityEvent('2FA_ENABLE_FAILED', { 
        userId, 
        email: user.email,
        reason: 'Invalid token' 
      });
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    logAuthEvent('2FA_ENABLED', userId, { email: user.email });

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function disable2FA(req, res) {
  try {
    const userId = req.user._id;
    const { token } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      logSecurityEvent('2FA_DISABLE_FAILED', { 
        userId, 
        email: user.email,
        reason: 'Invalid token' 
      });
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    logAuthEvent('2FA_DISABLED', userId, { email: user.email });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

function verify2FAToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
}

module.exports = {
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FAToken
};
