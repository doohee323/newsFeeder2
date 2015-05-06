'use strict';

angular.module('newsfeederApp')
.controller('ListCtrl', function($scope, $http, $state, config, MainService) {

  var currentPage = 0;
  $scope.next = function(id) {
    if(!id) {
    	id = currentPage + 1;
    	currentPage = id;
    }
		$scope.retrieve(id);
	}

  $scope.prev = function(id) {
    if(!id) {
		id = currentPage - 1;
		currentPage = id;
    }
	$scope.retrieve(id);
  }
  
  $scope.init = function(id) {
  	if(!$scope.storys) {
		$scope.retrieve(0);
	}
  }  
	
  $scope.retrieve = function(id) {
		if(!id) {
			id = currentPage;
		}
		if(config.back) {
			$scope.storys = config.storys;
			config.back = false;
		} else {
			var last_updated = '2015-04-18T20:35:02-05:00';
			MainService.R.get({'last_updated': last_updated, 'page': id}, function(data) {
				if(data.rows) {
					$scope.storys = data.rows;
			   	config.storys = $scope.storys;
				}
				}, function(error) {
			});	
		}
		$scope.published_date = $scope.storys[0].published_date;
  }

  $scope.open = function(item) {
  	config.item = item;
  	$state.go('story');
  }
});

// from android
var gfNextPage = function(json) {
	var scope = angular.element($("#listCtrl")).scope();
    scope.$apply(function(){
		for(var i=0;i<json.length;i++) {
			if(!json[i].multimedia) {
				json[i].multimedia = 'images/ny.png';
			}
			var published_date = json[i].published_date;
			published_date = published_date.substring(0, published_date.lastIndexOf('-'));
			json[i].published_date = moment(published_date).format('YYYY-MM-DD');
			scope.storys[scope.storys.length] = json[i];
		}
    })	
}
