// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var movieSchema = new Schema({
  
	movieId:    { type: Number, required: true, unique: true },  
    movieName:   { type: String, required: true },  
    movieRating:   { type: Number, required: true }  
  
});

// the schema is useless so far
// we need to create a model using it
var Movie = mongoose.model('Movie', movieSchema);

// make this available to our users in our Node applications
module.exports = Movie;