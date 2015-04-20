movieStubApp.config(function ($routeProvider, $locationProvider, $httpProvider) 
{
	//================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    
  //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
	
    $routeProvider
        .when('/', {
            templateUrl: 'tmpl/home.html',
            controller: 'movieStubController'
        }).when('/movie/:id', {
            templateUrl: 'tmpl/movie.html',
            controller: 'movieDetailsController'
        }).when('/bookings', {
            templateUrl: 'tmpl/bookings.html',
            controller: 'bookingDetailsController'
        }).when('/bookTickets/:id', {
            templateUrl: 'tmpl/bookTickets.html',
            controller: 'bookTicketsController'
        }).when('/admin', {
            templateUrl: 'tmpl/admin.html',
            controller: 'AdminCtrl',
            resolve: {
              loggedin: checkLoggedin
            }
        }).when('/login', {
            templateUrl: 'tmpl/login.html',
            controller: 'LoginCtrl'
        }).otherwise({
            redirectTo: '/'
        });
});