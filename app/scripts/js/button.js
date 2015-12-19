(function () {
	
	$('.b-menu').on('click', function() {
		//animate hamburger menu
		$('.b-container').toggleClass('open');
		$('.b-menu').toggleClass('open');
		
		//show off-canvas navigation
		$('.navigatie').toggleClass('show-nav');
		$('.nav-list').toggleClass('show-nav');
		
  });
})();