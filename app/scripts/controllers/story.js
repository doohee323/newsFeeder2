'use strict';

$(function() {
	if(!localStorage.getItem('storys')) {
		var url = document.location.hash;
		url = url.substring(1, url.length);
		var item = JSON.parse(url);
		retrieve(item);
	}
});

var retrieve = function(item) {
	var $myItem = $( "#myItem" );
	$('#title_dt').text(item.title + ' ' + item.date);
  $('<li />').append(
      $('<a />').attr('id', 'item_' + item.id).attr('href', 'story.html#' + JSON.stringify(item)).append(
          $('<h3 />').text(item.title).addClass('ui-li-heading'),
          $('<p />').text(item.desc).addClass('ui-li-desc')
      )
  ).appendTo($myItem).trigger('create');
}  

var goBack = function() {
	config.back = true;
	$window.history.back();
}  
