// SET UP ======================================================================
// Get all the tools we need ===================================================

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');

// Configuration ===============================================================
// =============================================================================

// Connect to our database
//mongoose.connect(configDB.url); 

// PassportJS configuration
require('./config/passport')(passport); 

app.use(express.static(__dirname + '/public'));

// Log every request to the console
app.use(morgan('dev')); 

// Read cookies (needed for auth)
app.use(cookieParser()); 

// Get information from html forms
app.use(bodyParser()); 

// Set up our EJS template engine
app.set('view engine', 'ejs'); 

// Session secret
app.use(session({ secret: 'izejzpiejzoijczoifjzoijzoijz' }));
// PassportJS initalize
app.use(passport.initialize());
// Persistent login sessions
app.use(passport.session()); 
// Use connect-flash for flash messages stored in session
app.use(flash()); 

// ROUTES ======================================================================
// =============================================================================

// Load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 

// LAUNCH ======================================================================
// =============================================================================
app.listen(port);