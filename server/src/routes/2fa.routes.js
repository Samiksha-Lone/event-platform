const express = require('express');
const router = express.Router();

const twoFAController = require('../controllers/2fa.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validate2FAToken } = require('../middlewares/validation.middleware');

router.post('/setup', 
  authenticateToken, 
  twoFAController.setup2FA
);

router.post('/enable', 
  authenticateToken,
  validate2FAToken,
  twoFAController.enable2FA
);

router.post('/disable', 
  authenticateToken,
  validate2FAToken,
  twoFAController.disable2FA
);

module.exports = router;
