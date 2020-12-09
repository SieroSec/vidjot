const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// User Login route
router.get('/login', (req, res) => {
   res.send('login');
});

// User Register route
router.get('/register', (req, res) => {
   res.send('register');
});

module.exports = router;