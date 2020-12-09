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
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
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



// Idea index page
// npm install --save @handlebars/allow-prototype-access
// https://mahmoudsec.blogspot.com/2019/04/handlebars-template-injection-and-rce.html
app.get('/ideas', (req, res) => {
    Idea.find({})
        .lean()
        .sort({ date: 'desc' })
        // without lean() -->
        // .then(ideas => {
        //     res.render('ideas/index', {
        //         ideas_to_hb: ideas.map(xer => xer.toJSON());
        //     });
        // })
        .then(ideas => {
            console.log(ideas);
            res.render('ideas/index', {
                ideas_to_handlebars: ideas
            });
        })
        .catch(error => res.status(500).send(error));
});

// Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// app.get('/ideas/edit', (req, res) => {
//     res.redirect('/ideas');
// });

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .lean()
    .then(idea => {
        res.render('ideas/edit', {
            idea_to_hb: idea
        });
    })
});


// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add title.' });
    }

    if (!req.body.details) {
        errors.push({ text: 'Please add details.' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
    // console.log(req.body);
    // res.send('ok, ' + req.body.username);
});



app.listen(port, function () {
    console.log(`Servers started on port ${port}`);

});
