const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 5000;

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/database');

// connect mongoose
mongoose.connect(db.mongoURI, {
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

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
    secret: 'sakdjfhsad76t&^yuh34rk0&^%&#@23dvdf_',
    resave: true,
    saveUninitialized: true   
}));

// Passport session middleware. Must be after express-session
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    
    // if user is logged in, then create global variable req.user or set to null.
    res.locals.user = req.user || null
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
