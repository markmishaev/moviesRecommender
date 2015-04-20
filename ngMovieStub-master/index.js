var port = process.env.PORT || 2595;
var fs = require('fs');
var request = require("request")
var Movie = require('./public/js/models/movie');
var MoviesData = require('./data/moviesData');
var file1 = './data/generatedMovies1.json'
	
var express = require('express')
var bodyParser = require('body-parser')

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
var bookings = [];


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//MoviesData.prepareMovieData(0);

		
app.set("view options", {
    layout: false
});
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.get('/movies', function (req, res) 
{
    var movies1 = require(MoviesData.getOutputFileName());	
    res.json(movies1);
});


app.get('/bookings', function (req, res) {
    res.json(bookings);
});

app.post('/book', function (req, res) {
    var data = {
        'qty': req.body.qty,
        'date': req.body.date,
        'id': req.body.movie_id,
        'name': req.body.movie_name
    };
    bookings.push(data);
    // res.render('public/tmpl/bookings.html');
    res.json(bookings);
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
