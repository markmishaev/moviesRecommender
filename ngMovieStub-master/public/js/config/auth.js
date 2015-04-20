// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '656613331150249', // your App ID
		'clientSecret' 	: 'ecbb0663891585ff6fcf6765ef1c1fd6', // your App Secret
		'callbackURL' 	: 'http://localhost:2595/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};