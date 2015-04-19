var fs = require('fs');
var S = require('string');
var request = require("request")


var requests = [];
var filesNumber = 20;
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
										'id': varJsonObj.id.toString()
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
