const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
require('../models/User');
const User = mongoose.model('users');

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// User Login route
router.get('/login', (req, res) => {
   res.render('users/login');
});

// User Logout route
router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success_msg', 'Logged out');
   res.redirect('/users/login');
});

// User Register route
router.get('/register', (req, res) => {
   res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/ideas',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
});

// Register for POST
router.post('/register', (req, res) => {
   // console.log(req.body);
   // res.send('REGISTER');
   let errors = [];

   if (req.body.password != req.body.password2) {
      errors.push({ text: 'Passwords do not match' });
   }
   if (req.body.password.length < 4) {
      errors.push({ text: 'Password must be at least 4 chars' });
   }

   if (errors.length > 0) {
      res.render('users/register', {
         errors: errors,
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         password2: req.body.password2
      });
   } else {
      User.findOne({ email: req.body.email })
         .then(user => {
            if (user) {
               req.flash('error_msg', 'Email already registered');
               res.redirect('/users/register');
               console.log('Email already registered. user found:  ' + user);
            }
            else {
               const newUser = new User({
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password,
                  password2: req.body.password2
               });

               bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if (err) throw err;
                     newUser.password = hash;
                     newUser.save()
                        .then(user => {
                           console.log("succ: " + newUser);
                           req.flash('success_msg', 'You are now registered and can log in.');
                           res.redirect('/users/login')
                        })
                        .catch(err => {
                           console.log(err);
                           console.log("err " + newUser);
                           return;
                        });
                  });
               });

               console.log('else user: ' + user);
               console.log("newUser: " + newUser);
            }
         });



   }

});

module.exports = router;