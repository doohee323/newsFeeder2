'use strict';

var currentPage = 1;

$(function() {
	if(!localStorage.getItem('storys')) {
		retrieve(1);
	}
});

var retrieve = function(id) {
	if(!id) {
		id = currentPage;
	}
		if(localStorage.getItem('back')) {
//			$scope.storys = config.storys;
			localStorage.removeItem('back');
	} else {
		var last_updated = '2015-04-18T20:35:02-05:00';
		$.ajax({
		  url: "http://localhost:3000/bbs/" + id,
			method: "GET",
		  data: {'last_updated': last_updated, 'id': id}		  
		}).done(function( data ) {
			if(data.rows) {
				$('#published_date').text(data.rows[0].date);
				var $myList = $( "#myList" );
	 			$.each(data.rows, function(i, item) {
				    $('<li />').append(
				        $('<a />').attr('id', 'item_' + item.id).attr('href', 'story.html#' + JSON.stringify(item)).append(
				            $('<h3 />').text(item.title).addClass('ui-li-heading'),
				            $('<p />').text(item.desc).addClass('ui-li-desc')
				        )
				    ).appendTo($myList).trigger('create');
				});
			}
		});
	}
}  
