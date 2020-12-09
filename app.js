const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
// const passport = require('passport'),
// LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 5000;

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// connect mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json 

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
    secret: 'sakdjfhsad76t&^yuh34rk0&^%&#@23dvdf_',
    resave: true,
    saveUninitialized: true   
}));

// connect-flash middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



//////////////////////////////////////////
///////////////// ROUTES /////////////////
//////////////////////////////////////////


// index route
app.get('/', (req, res) => {
    const title = 'Welcome!!!';
    res.render('index', {
        title: title
    });
    console.log(Date.now());
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});






// app.post('/login', passport.authenticate('local'), function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/users/' + req.user.username);
// });


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);


/// MAIN APP
app.listen(port, function () {
    console.log(`Servers started on port ${port}`);
});
