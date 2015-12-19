(function () {
	
	$('.b-menu').on('click', function() {
		//caching
		$burger_container = $('.b-container');
		$burger_menu = $('.b-menu');
		$nav = $('.navigatie');
		$nav_list = $('.nav-list');
		$body = $('body');
		
		//animate hamburger menu
		$burger_container.toggleClass('open');
		$burger_menu.toggleClass('open');
		
		//show off-canvas navigation
		$nav.toggleClass('show-nav');
		$nav_list.toggleClass('show-nav');
		
		//disable scroll when navigation is on canvas
		$body.toggleClass('fixed__debug');
		
		//hide navigation when link is clicked
		$nav_list.children().on('click', function() {
			//remove navigation off screen
			$nav.removeClass('show-nav');
			$nav_list.removeClass('show-nav');
			
			//put hamburger back to initial state
			$burger_container.removeClass('open');
			$burger_menu.removeClass('open');
			
			//re-enable scrolling
			$body.removeClass('fixed__debug');
		});
  });
})();