var paintingsControllers = angular.module('paintingsControllers', []);

paintingsControllers.controller('PaintingsCtrl', function ($scope, $http, $sce, $location) {
  loadData($scope, $http, $sce, $location, 'public');
});

paintingsControllers.controller('AllPaintingsCtrl', function ($scope, $http, $sce, $location) {
  loadData($scope, $http, $sce, $location, 'private');
});

function loadData($scope, $http, $sce, $location, mode) {
  $scope.paintings = [];
  $scope.dataPaintings = []
  $scope.location = $location.path();

  $http.get('data/data.json').success(function (data) {
    $scope.totalPaintings = data.length;
    if (mode === 'private') {
      $scope.paintings = data.filter(function (e) { return e.isPrivate; });
    } else if (mode === 'public') {
      $scope.paintings = data.filter(function (e) { return !e.isPrivate; });
    } else {
      $scope.paintings = data;
    }
    $scope.dataPaintings = $scope.paintings;
    $scope.centuries = [];
    [1, 100, 200, 300, 400].forEach(function(marker) {
      var found = $scope.paintings.find(function(p) { return p.number >= marker; });
      if (found) $scope.centuries.push({ label: marker, number: found.number });
    });
  }).error(function (data, status) {
    console.log(status);
  });

  $scope.scrollTo = function(id, isFirst) {
    if (isFirst) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  $scope.open = function (painting) {
    $scope.current = painting;
    $scope.trustedHtmlText = $sce.trustAsHtml($scope.current.text);
  };
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