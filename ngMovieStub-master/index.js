var port = process.env.PORT || 2595;
var fs = require('fs');
var S = require('string');
var request = require("request")
	
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var bookings = [];
var requests = [];
var filesNumber = 20;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var file = './data/generatedMovies.json'
var file1 = './data/generatedMovies1.json'
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

makeMoviesRequests(0);

// This function repeatedly calls itself until all requests are done.
function makeMoviesRequests(index) 
{
	if (index == requests.length) 
	{
		// we are done.
		writeFinalFile();
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
										'id': varJsonObj.id.toString()
									};							
						fs.appendFile(file, JSON.stringify(data) + '\r\n', function (err) {});					
					}					
				}	
				
				makeMoviesRequests(index + 1);				
			})			
	}
};
		
function writeFinalFile()
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
		
		
app.set("view options", {
    layout: false
});
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.get('/movies', function (req, res) 
{
    var movies1 = require(file1);	
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

app.listen(port);
console.log('Express server running at http://localhost:' + port);
