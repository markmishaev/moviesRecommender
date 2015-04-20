movieStubApp.config(function ($routeProvider, $locationProvider, $httpProvider) 
{
    $routeProvider
        .when('/', {
            templateUrl: 'tmpl/home.html',
            controller: 'movieStubController'
        }).otherwise({
            redirectTo: '/'
        });
});