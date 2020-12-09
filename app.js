// npm init
// npm install --save express
// npm install -g nodemon
// npm root -g
// npm install --save express-handlebars
// npm install --save mongoose
// vscode alt+shift+F ---> format code

// git init
// git add --all
// git commit -m "Initial"
// git remote add origin https://github.com/SieroSec/vidjot.git
// git remote -v
// git push origin master (or main)
//

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// connect mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// another option
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// });


// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// // How middleware works:
// app.use(function (req, res, next){
//     console.log(Date.now());
//     req.name = 'siero';
//     next();
// });

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

app.listen(port, function () {
    console.log(`Servers started on port ${port}`);

});
