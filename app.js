// npm init
// npm install --save express
// npm install -g nodemon
// npm root -g
// npm install --save express-handlebars
// npm install --save mongoose
// vscode alt+shift+F ---> format code


const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 5000;

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
