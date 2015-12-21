/*
*	Title: upstart test
*	Created: 07-12-2015
*	Modified: 21-12-2015
*	Author: Mathias Fonck
* 	-----------------------------------------------
*	
*	Worldbank countries:
*	http://api.worldbank.org/countries/all?format=jsonP&prefix=jsonp_callback&per_page=300
*	Start-up procedures to register a business (number):
*	http://api.worldbank.org/countries/all/indicators/IC.REG.PROC?format=jsonP&prefix=jsonp_callback&date=2015&per_page=300
*	Time required to start a business (days):
*	http://api.worldbank.org/countries/all/indicators/IC.REG.DURS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	New businesses registered (number):
*	http://api.worldbank.org/countries/all/indicators/IC.BUS.NREG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	New business density (new registrations per 1,000 people ages 15-64):
*	http://api.worldbank.org/countries/all/indicators/IC.BUS.NDNS.ZS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	[Real interest rate %:
*	http://api.worldbank.org/countries/all/indicators/FR.INR.RINR?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	Inflation, GDP deflator (annual %):
*	http://api.worldbank.org/countries/all/indicators/NY.GDP.DEFL.KD.ZG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*
*/

(function() {
	
	//test 404
	
	var $w = $( window ).width();
var $dW = $('.bb8').css('width');
$dW = $dW.replace('px', '');
$dW = parseInt($dW);
var $dPos = 0;
var $dSpeed = 1;
var $dMinSpeed = 1;
var $dMaxSpeed = 4;
var $dAccel = 1.04;
var $dRot = 0;
var $mPos = $w - $w/5;
var $slowOffset = 120;
var $movingRight = false;

function moveDroid(){
  if($mPos > $dPos + ($dW/4)){
    // moving right
    if(!$movingRight){
      $movingRight = true;
      $('.antennas').addClass('right');
      $('.eyes').addClass('right');
    }
    if($mPos - $dPos > $slowOffset){
      if($dSpeed < $dMaxSpeed){
        // speed up
        $dSpeed = $dSpeed * $dAccel;
      }
    } else if($mPos-$dPos < $slowOffset){
      if($dSpeed > $dMinSpeed){
        // slow down
        $dSpeed = $dSpeed / $dAccel;
      }
    }
    $dPos = $dPos + $dSpeed;
    $dRot = $dRot + $dSpeed;
  } else if($mPos < $dPos - ($dW/4)){
    // moving left
    if($movingRight){
      $movingRight = false;
      $('.antennas').removeClass('right');
      $('.eyes').removeClass('right');
    }
    if($dPos - $mPos > $slowOffset){
      if($dSpeed < $dMaxSpeed){
        // speed up
        $dSpeed = $dSpeed * $dAccel;
      }
    } else if($dPos - $mPos < $slowOffset){
      if($dSpeed > $dMinSpeed){
        // slow down
        $dSpeed = $dSpeed / $dAccel;
      }
    }
    $dPos = $dPos - $dSpeed;
    $dRot = $dRot - $dSpeed;
  } else { }
  $('.bb8').css('left', $dPos);
  $('.ball').css({ WebkitTransform: 'rotate(' + $dRot + 'deg)'});
  $('.ball').css({ '-moz-transform': 'rotate(' + $dRot + 'deg)'});
}

setInterval(moveDroid, 10);

$( document ).on( "mousemove", function( event ) {
  $('h2').addClass('hide');
  $mPos = event.pageX;
  return $mPos;
});

	App.init();// Intialize the application
	
})();