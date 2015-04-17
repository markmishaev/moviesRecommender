movieStubApp.controller("RatingCtrl", function($scope) {
  $scope.rating1 = 1;
  $scope.isReadonly = true;
  $scope.rateFunction = function(rating)
  {
		console.log("Rating selected: " + rating);
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