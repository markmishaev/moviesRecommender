var port = process.env.PORT || 2595;
var fs = require('fs');
var request = require("request")
var Movie = require('./public/js/models/movie');
var MoviesData = require('./data/moviesData');
var file1 = './data/generatedMovies1.json'
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;	
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var session = require('express-session')

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
app.use(session({
    secret: 'securedsession',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization

		
app.set("view options", {
    layout: false
});
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

//=========================Users=========================================

//Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
		  function(username, password, done) {
		    if (username === "admin" && password === "admin") // stupid example
		      return done(null, {name: "admin"});

		    return done(null, false, { message: 'Incorrect username.' });
		  }
		));

		//Serialized and deserialized methods when got from session
		passport.serializeUser(function(user, done) {
		    done(null, user);
		});

		passport.deserializeUser(function(user, done) {
		    done(null, user);
		});

		// Define a middleware function to be used for every secured routes
		var auth = function(req, res, next){
		  if (!req.isAuthenticated()) 
		  	res.send(401);
		  else
		  	next();
		};


app.get('/users', auth, function(req, res){
	  res.send([{name: "user1"}, {name: "user2"}]);
	});

//route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
res.send(req.isAuthenticated() ? req.user : '0');
});

//route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
res.send(req.user);
});

//route to log out
app.post('/logout', function(req, res){
req.logOut();
res.send(200);
});

//=========================Movies=========================================

app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.get('/movies', function (req, res) 
{
    var movies1 = require(MoviesData.getOutputFileName());	
    res.json(movies1);
});


app.post('/addMovie', function (req, res) {
    
	
	var changed = false;
	console.log("Movie Id " + req.body.id);
	
	Movie.findOne({movieId: req.body.id}, function(err, movie) 
	{
	    if (err)
	    {
	        console.log("MongoDB Error: " + err);
	        return false;
	    }
	    
	    if (!movie) {
	    	
	    	console.log("No movie found, creating movie item");
	        
	        movie = new Movie({
	    		  movieId: req.body.id,
	    		  movieName: req.body.name,
	    		  movieRating: req.body.rating 
	    		});

	    }
	    else //movie found
	    { 
	    	console.log("Movie found, updating movie item");
	    	movie.movieRating = req.body.rating;
	    }
	
	    // call the built-in save method to save to the database
		movie.save(function(err) {
			if (err) throw err;
			});
			    
	});
    	
	
    
    console.log(req.body.rating.toString());
    console.log(req.body.id.toString());
    console.log(req.body.name.toString());
    
});

app.listen(port);
console.log('Express server running at http://localhost:' + port);
