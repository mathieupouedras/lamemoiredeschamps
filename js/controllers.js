var paintingsControllers = angular.module('paintingsControllers', []);

paintingsControllers.controller('PaintingsCtrl', function ($scope, $http, $sce, $location) {
  loadData($scope, $http, $sce, $location, true);
});
paintingsControllers.controller('AllPaintingsCtrl', function ($scope, $http, $sce, $location) {
  
  $scope.toggleAvalaible = function () {
    $scope.paintings = $scope.dataPaintings.filter(function (element) {
      if ($scope.hideUnavailable) {
        return !element.isPrivate && !element.isReserved;
      }
      return true;
    });
  }
  
  loadData($scope, $http, $sce, $location, false);
});

function loadData($scope, $http, $sce, $location, isPrivateHidden) {
  $scope.paintings = [];
  $scope.dataPaintings = []
  $scope.location = $location.path();

  $http.get('data/data.json').success(function (data) {
    $scope.paintings = data;
    $scope.dataPaintings = data
    if (isPrivateHidden) {
      hidePrivatePaintings($scope);
    }
    // $scope.paintings = partition($scope.paintings, 6);
  }).error(function (data, status) {
    console.log(status);
  });

  $scope.open = function (painting) {
    $scope.current = painting;
    $scope.trustedHtmlText = $sce.trustAsHtml($scope.current.text);
  };
}

function hidePrivatePaintings($scope) {
  $scope.paintings = $scope.paintings.filter(function (element) {
    // hack to avoid displaying Glyphicon
    element.isPrivate = !element.isPrivate;
    element.isReserved = !element.isReserved;
    return element.isPrivate;
  });
}

function partition(arr, size) {
  arr = arr.filter(function (element) {
    return element.imageFile;
  });
  var newArr = [];
  for (var i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i + size));
  }
  return newArr;
}