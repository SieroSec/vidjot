const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function (passport) {
   passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      console.log("email: " + email);
      console.log("password: " + password);

      // Match user
      User.findOne({
         email: email
      })
         .then(user => {
            if (!user) { return done(null, false, { message: 'no user found' }); }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
               if (err) throw err;
               if (isMatch) {
                  return done(null, user); // password match - return null for the error, user for the user.
               } else {
                  // password didnt matched - return null for the error, nul for the user, and error message.
                  return done(null, false, { message: 'Password Incorrect' });
               }
            });
         });
   }));

   passport.serializeUser(function (user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
         done(err, user);
      });
   });


}