var paintingsApp = angular.module('paintingsApp', [
  'ngRoute',
  'paintingsControllers',
  ]);

paintingsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/paintings', {
        templateUrl: 'partials/paintings.html',
        controller: 'PaintingsCtrl'
      }).
      when('/allpaintings', {
        templateUrl: 'partials/paintings.html',
        controller: 'AllPaintingsCtrl'
      }).
      otherwise({ redirectTo: '/paintings' });
  }]);
