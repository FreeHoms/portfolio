const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));

// Sample hardcoded username and hashed password for demonstration
const validUsername = 'Zaid';
const hashedPassword = '$2a$10$SWv424xAyA4pdw/kMevVk.xaU5zBec1.pcOOCuzUtF.2N9dBMriH.'; // Hashed form of 'Za.id.gh'

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // The user is authenticated
    next();
  } else {
    // Redirect to the login page if not authenticated
    res.redirect('/login');
  }
};

// Render the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Compare the entered password with the hashed password
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  console.log(passwordMatch);
  if (username === validUsername && passwordMatch) {
    // Set user information in the session
    req.session.user = { username };
    req.session.isAuthenticated = true;

    // Successful login, you might redirect to a dashboard
    res.redirect('/');
  } else {
    // Failed login, you might render the login page with an error message
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = { router, isAuthenticated };
