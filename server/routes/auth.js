const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      displayName
    });
    
    await user.save();
    
    // Set user in session
    req.session.userId = user._id;
    req.session.user = user;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating user');
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send('Invalid password');
    }
    
    // Set user in session
    req.session.userId = user._id;
    req.session.user = user;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging in');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if(error) {
      console.log(error);
      res.send('Error logging out');
    } else {
      res.redirect('/')
    }
  })
});

module.exports = router;
