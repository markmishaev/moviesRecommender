var fs = require('fs');
var S = require('string');
var request = require("request")
var Movie = require('../public/js/models/movie');
var User = require('../public/js/models/user');
var mongoose = require('mongoose');

var requests = [];
var filesNumber = 50;
var file = './data/generatedMovies.json'
var file1 = './data/generatedMovies1.json'


exports.getOutputFileName = function () 
{
	return file1;
}
	
exports.prepareMovieData = function () 
{
	fs.unlink(file, function (err) {});
	fs.unlink(file1, function (err) {});
	var array = fs.readFileSync('./data/movies.dat').toString().split("\n");
	
	for(var i = 1; i <= filesNumber; i++) 
	{
		var arr = array[i].split("::");
		var id = S(arr[0]);
		var movieStr = S(arr[1]);
		var pos = movieStr.indexOf('(');
		var shortMovieNameStr = movieStr.substr(0, pos-1);
		var shortMoveNameStrWithNoSpaces = shortMovieNameStr.replaceAll(' ', '+').s	
		var url = "http://www.omdbapi.com/?t=" + shortMoveNameStrWithNoSpaces + "&y=&plot=short&r=json"
		
		var data = {
						'url': url,
						'id': id
					};	
		
		requests.push(data);
		
	}
	
	exports.makeMoviesRequests(0);
}

//This function repeatedly calls itself until all requests are done.
exports.makeMoviesRequests = function (index) 
{
	if (index == requests.length) 
	{
		// we are done.
		exports.writeFinalFile();
		//setTimeout(writeFinalFile, 1000);		
	} 
	else 
	{
		varJsonObj = requests[index]; 
	
		request({
				url: varJsonObj.url,
				json: true
			}, 
			function (error, response, body) 
			{
				if (!error && response.statusCode === 200) 
				{
					if(body['Title'] != null && body['Poster'] != null)
					{
						var data = {
										'name': body['Title'],
										'thumb': body['Poster'],
										'id': varJsonObj.id.toString(),
										'rating': Math.round(Number(body['imdbRating'])/10*5)
									};							
						fs.appendFile(file, JSON.stringify(data) + '\r\n', function (err) {});					
					}					
				}	
				
				exports.makeMoviesRequests(index + 1);				
			})			
	}
};

exports.writeFinalFile =  function()
{
	fs.appendFileSync(file1, '[\r\n');
	var linesCount = 0;
	var indexCount = 0;
	
	fs.readFileSync(file).toString().split('\r\n').forEach(function (line) 
	{ 
		linesCount++;
	});
		
	fs.readFileSync(file).toString().split('\r\n').forEach(function (line) 
	{ 
        indexCount++;
        if(indexCount < linesCount - 1)			
		{
			fs.appendFileSync(file1, line.toString() + ',\r\n');
		}
		else
		{
			fs.appendFileSync(file1, line.toString());
		}
	});
	
	fs.appendFileSync(file1, '\r\n]');
}

exports.addMovie = function (req, res) 
{
	
	console.log("Movie Id " + req.body.id);
	
	if (req.isAuthenticated())
	{
		console.log("Request is authenticated with user id " + req.user._id);
		User.findOne({_id: req.user._id}, function(err, user) 
		{
			console.log("User found " + req.user._id);			
			
			//checks if user already rated this movie
			User.findOne({'movies.movieId': req.body.id}, function(err, ratedUser)
			{
			    if(err)
			    	console.log(err);
			    
			    if(!ratedUser)
				{
					console.log("No embedded movie found, creating embedded movie item");			        
			    	user.movies.push( {movieId: req.body.id,
				    		  movieName: req.body.name,
				    		  movieRating: req.body.rating} );
				}
				else
				{
					console.log("Embedded movie found, updating embedded movie item");		
					for (var i=0; i < user.movies.length; i++)
						 if (user.movies[i].movieId == req.body.id)
							 user.movies[i].movieRating = req.body.rating;					
				}				
				   // call the built-in save method to save to the database
			    user.save(function(err) {
					if (err) throw err;
					});			
			    
			});		    
		});
	}
	else//request is not authenticated, saves general rating information
	{
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
	}
}
