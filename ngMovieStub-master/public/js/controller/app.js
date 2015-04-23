movieStubApp.controller("RatingCtrl", function($scope, $http,  $log) 
{
	$scope.isReadonly = true;
	$scope.$log = $log;
	$scope.message = 'Hello World!';
	
	$scope.rateFunction = function(ratingValue)
	{
		 $http.post("/addMovie", 
				 { id: $scope.movieId, name: $scope.movieName,  rating: ratingValue }, { headers: { "Content-Type": "application/json" } })
         .success( function(response) {
            console.log("success");
        }).
        error( function(response) {
            console.log("error");
        });
		
		console.log("Rating selected: " + ratingValue);
		console.log("MovieId: " + $scope.movieId);
		console.log("MoiveName: " + $scope.movieName);
	};
})
movieStubApp.directive("starRating", function() {
  return {
    restrict : "EA",
    template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=ngModel",
      max : "=?", //optional: default is 5
      onRatingSelected : "&?",
      readonly: "=?"
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly == false){
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating: index + 1
          });
        }
      };
      scope.$watch("ratingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});
movieStubApp.controller("movieStubController", function ($scope, movieStubFactory, $location) {
	
	$scope.headerSrc = "tmpl/header.html";
    $scope.movies = movieStubFactory.query();
    $scope.currMovie = null;

    $scope.getMovieById = function (id) {
        var movies = $scope.movies;
        for (var i = 0; i < movies.length; i++) {
            var movie = $scope.movies[i];
            if (movie.id == id) {
                $scope.currMovie = movie;
            }
        }
    };

    $scope.back = function () {
        window.history.back();
    };

    $scope.getCount = function (n) {
        return new Array(n);
    }

    $scope.isActive = function (route) {
        return route === $location.path();
    }

    $scope.isActivePath = function (route) {
        return ($location.path()).indexOf(route) >= 0;
    }

});

movieStubApp.controller("movieDetailsController", function ($scope, $routeParams) {
    $scope.getMovieById($routeParams.id);
});
movieStubApp.controller("bookTicketsController", function ($scope, $http, $location, $routeParams) {
    $scope.getMovieById($routeParams.id);
    $scope.onlyNumbers = /^\d+$/;
    $scope.formData = {};
    $scope.formData.movie_id = $scope.currMovie.id;
    $scope.formData.movie_name = $scope.currMovie.name;
    $scope.formData.date = "Today"

    $scope.processForm = function () {
        console.log($scope.formData);
        $http({
            method: 'POST',
            url: '/book',
            data: $.param($scope.formData), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            } // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                $location.path("/bookings");
            });
    };
});
movieStubApp.controller("bookingDetailsController", function ($scope, movieStubBookingsFactory) {
    $scope.bookings = movieStubBookingsFactory.query();
});

movieStubApp.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
	  // This object will be filled by the form
	  $scope.user = {};

	  // Register the login() function
	  $scope.login = function(){
	    $http.post('/login', {
	      username: $scope.user.username,
	      password: $scope.user.password,
	    })
	    .success(function(user){
	      // No error: authentication OK
	      $rootScope.message = 'Authentication successful!';
	      $location.url('/admin');
	    })
	    .error(function(){
	      // Error: authentication failed
	      $rootScope.message = 'Authentication failed.';
	      $location.url('/login');
	    });
	  };
	});
