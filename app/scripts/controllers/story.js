'use strict';

var player;
var storyId;

angular.module('newsfeederApp')
.controller('StoryCtrl', function($window, $rootScope, $scope, $sce, $state, config) {

	$scope.onload = function() {
		if(config.item) {
			$scope.item = angular.fromJson(config.item);
		}
	}
	
	$rootScope.goBack = function(){
		config.back = true;
		$window.history.back();
	}

});