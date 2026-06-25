var paintingsApp = angular.module('paintingsApp', [
  'ngRoute',
  'ngAnimate',
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
      when('/painting/:number', {
        templateUrl: 'partials/painting.html',
        controller: 'PaintingCtrl'
      }).
      otherwise({ redirectTo: '/paintings' });
  }]);

paintingsApp.run(['$location', function($location) {
  $location.path('/paintings');
}]);

paintingsApp.directive('imgOnload', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('load', function() {
        scope.$eval(attrs.imgOnload);
        if (!scope.$$phase) scope.$apply();
      });
      $timeout(function() {
        if (element[0].complete && element[0].naturalWidth > 0) {
          scope.$eval(attrs.imgOnload);
        }
      }, 0);
    }
  };
}]);
