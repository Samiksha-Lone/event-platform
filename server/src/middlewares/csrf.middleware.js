const csurf = require('csurf');

const csrfProtection = csurf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

const getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

module.exports = {
  csrfProtection,
  getCsrfToken
};
