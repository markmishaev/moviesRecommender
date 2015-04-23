// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//create a schema
var movieSchema = new Schema({
  
	movieId:    { type: Number, required: true, unique: true },  
    movieName:   { type: String, required: true },  
    movieRating:   { type: Number, required: true }  
  
});

// define the schema for our user model
var userSchema = mongoose.Schema({

	email        : String,
	password     : String,
	movies:      [movieSchema]
});

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


//generating a hash
userSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// this method hashes the password and sets the users password
userSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
