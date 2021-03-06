var port = process.env.PORT || 2595;
var fs = require('fs');
var request = require("request")
var Movie = require('./public/js/models/movie');
var User = require('./public/js/models/user');
var MoviesData = require('./data/moviesData');
var file1 = './data/generatedMovies1.json'
var http = require('http');
var path = require('path');
var passport = require('passport');	
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var session = require('express-session')
var flash    = require('connect-flash');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movies');
 
var db = mongoose.connection;
 
db.on('error', function (err) 
{
	console.log('connection error', err);
});
db.once('open', function () 
{
	console.log('connected.');
});


var app = express()

//MoviesData.prepareMovieData(0);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser()); 
app.use(methodOverride());
// required for passport
app.use(session({secret: 'shanimishaev', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.set("view options", {
    layout: false
});
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

require('./public/js/config/passport')(passport); // pass passport for configuration


//=========================User Authentication=========================================

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login.ejs', { message: req.flash('loginMessage') });
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
	successRedirect : '/#', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
app.get('/signup', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/#', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile.ejs', {
		user : req.user // get the user out of session and pass to template
	});
});


//route to test if the user is logged in or not 
app.get('/loggedin', function(req, res) 
{ res.send(req.isAuthenticated() ? req.user : '0'); }); 


app.get('/authenticatedUser', isLoggedIn, function(req, res) {
	res.render('profile.ejs', {
		user : req.user // get the user out of session and pass to template
	});
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

//route middleware to make sure
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
if (req.isAuthenticated())
	return next();

// if they aren't redirect them to the home page
res.redirect('/');
}

//=========================Movies=========================================

app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.get('/movies', function (req, res) 
{
    var movies1 = require(MoviesData.getOutputFileName());	
    res.json(movies1);
});


app.post('/addMovie', function (req, res) 
{
	MoviesData.addMovie(req,res);
});

app.listen(port);
console.log('Express server running at http://localhost:' + port);
