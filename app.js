const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// connect mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser middleware
// application/x-www-form-urlencoded | multipart/form-data | application/json | application/xml
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data
//
// app.use(bodyParser.json({ type: 'application/*+json' })) // parse various different custom JSON types as JSON
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' })) // parse some custom thing into a Buffer
// app.use(bodyParser.text({ type: 'text/html' })) // parse an HTML body into a string

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json 



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

// Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text:'Please add title.'});
    }

    if (!req.body.details) {
        errors.push({text:'Please add details.'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        res.send('passed');
    }
    // console.log(req.body);
    // res.send('ok, ' + req.body.username);
});



app.listen(port, function () {
    console.log(`Servers started on port ${port}`);

});
