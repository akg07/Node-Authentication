const express = require('express'); // provides web development environment
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // creating partials and layout for FE

// middleware: provide functinality to write css code in sass form
const sassMiddleware = require('node-sass-middleware');


const app = express();
const port = 8080;


// load scss in project
app.use(sassMiddleware({
    src: path.join(__dirname, 'assets', 'scss'),
    dest: path.join(__dirname, 'assets', 'css'),
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));

app.use(express.urlencoded());

//use express layout
app.use(expressLayouts);

// extract styles and scripts from sub-pages into parent page
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(path.join(__dirname, './assets'))); // get all style, script, img from asset folder

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// call parent router
app.use('/', require('./router')); // this should be 2nd last statement in the main.app.js

// list this app to port: 8080
app.listen(port, function(err) {
    if(err) {
        console.log('Err at loding application');
    }

    console.log(`Server is running on port: ${port}`);
});
