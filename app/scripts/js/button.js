(function () {
	
	$('.b-menu').on('click', function() {
		//caching
		var $burger_container = $('.b-container');
		var $burger_menu = $('.b-menu');
		var $nav = $('.navigatie');
		var $nav_list = $('.nav-list');
		var $body = $('body');
		
		//animate hamburger menu
		$burger_container.toggleClass('open');
		$burger_menu.toggleClass('open');
		
		//show off-canvas navigation
		$nav.toggleClass('show-nav');
		$nav_list.toggleClass('show-nav');
		
		//disable scroll when navigation is on canvas
		$body.toggleClass('disable_scroll');
		
		//hide navigation when link is clicked
		$nav_list.children().on('click', function() {
			//remove navigation off screen
			$nav.removeClass('show-nav');
			$nav_list.removeClass('show-nav');
			
			//put hamburger back to initial state
			$burger_container.removeClass('open');
			$burger_menu.removeClass('open');
			
			//re-enable scrolling
			$body.removeClass('disable_scroll');
		});
	});
	
})();