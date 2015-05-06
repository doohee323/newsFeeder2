'use strict';

/**
 * @ngdoc overview
 * @name newsfeederApp
 * @description
 * # newsfeederApp
 *
 * Main module of the application.
 */

var config = {
	android: true
};
 
angular
  .module('newsfeederApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ]).constant('config', config)
.config(['$stateProvider', '$urlRouterProvider', '$provide',
  function ($stateProvider, $urlRouterProvider, $provide) {
  
	$stateProvider.state('index', {
		url: "",
		templateUrl: 'views/list.html',
		controller: 'ListCtrl'
	}).state('list', {
		url: '/list',
		templateUrl: 'views/list.html',
		controller: 'ListCtrl'
	}).state('story', {
		url: '/story',
		templateUrl: 'views/story.html',
		controller: 'StoryCtrl'
	});
}]);

angular.module('newsfeederApp').factory('$exceptionHandler', function () {
  return function (exception, cause) {
  	if(exception.message == "Cannot read property 'resolve' of undefined") {
  		console.log(exception.message);
  		return;
  	} else {
	  	var errorInfo = {title: exception.message,
	        date: moment().utc().toDate().format('YYYYMMDD HH:mm:ss:SS'),
	        stack: exception.stack
	      };
	    console.log(exception.message);
  	}
    //throw exception;
  };
});
