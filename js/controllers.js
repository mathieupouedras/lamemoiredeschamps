var paintingsControllers = angular.module('paintingsControllers', []);

paintingsControllers.controller('PaintingsCtrl', function ($scope, $http, $sce, $location) {
  loadData($scope, $http, $sce, $location, 'public');
});

paintingsControllers.controller('AllPaintingsCtrl', function ($scope, $http, $sce, $location) {
  loadData($scope, $http, $sce, $location, 'private');
});

paintingsControllers.controller('PaintingCtrl', function ($scope, $http, $sce, $routeParams, $window) {
  $scope.loading = true;
  $http.get('data/data.json').success(function (data) {
    $scope.painting = data.find(function (p) { return p.number === parseInt($routeParams.number); });
    if ($scope.painting) {
      $scope.trustedHtmlText = $sce.trustAsHtml($scope.painting.text);
    }
    if ($scope.painting && $scope.painting.imageFile) {
      var img = new Image();
      img.onload = function () {
        $scope.$apply(function () { $scope.loading = false; });
      };
      img.onerror = function () {
        $scope.$apply(function () { $scope.loading = false; });
      };
      img.src = 'images/basse-def/' + $scope.painting.imageFile;
    } else {
      $scope.loading = false;
    }
  });

  $scope.back = function () { $window.history.back(); };
});

function loadData($scope, $http, $sce, $location, mode) {
  $scope.paintings = [];
  $scope.dataPaintings = [];
  $scope.loading = true;
  $scope.location = $location.path();
  var spinnerStart = Date.now();

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
    var elapsed = Date.now() - spinnerStart;
    var minTime = 500;
    var hideSpinner = function() { $scope.loading = false; };
    if (elapsed >= minTime) {
      hideSpinner();
    } else {
      setTimeout(function() { $scope.$apply(hideSpinner); }, minTime - elapsed);
    }
    var savedScroll = sessionStorage.getItem('scrollPos');
    if (savedScroll) {
      setTimeout(function () {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
        sessionStorage.removeItem('scrollPos');
      }, 0);
    }
    $scope.centuries = [];
    [1, 100, 200, 300, 400].forEach(function(marker) {
      var found = $scope.paintings.find(function(p) { return p.number >= marker; });
      if (found) $scope.centuries.push({ label: marker, number: found.number });
    });
  }).error(function (data, status) {
    console.log(status);
  });

  $scope.saveScroll = function() {
    sessionStorage.setItem('scrollPos', window.scrollY);
  };

  $scope.scrollTo = function(id, isFirst) {
    if (isFirst) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      var el = document.getElementById(id);
      if (el) {
        var bar = document.querySelector('.collection-bar');
        var offset = bar ? bar.offsetHeight : 0;
        var top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'instant' });
      }
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