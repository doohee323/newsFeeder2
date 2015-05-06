'use strict';

angular.module('newsfeederApp')
	.filter( 'shortener', function() {
		return function( input ) {
			if(input.length > 90) {
				input = input.substring(0, 90) + '...';
			}
			return input;
	}
});