var MOBILE_CAROUSEL_MENU = function($carousel_wrap_obj){
    var init = function($carousel_wrap_obj){

        var $carousel_objs =  $carousel_wrap_obj.find('._mobile_navigation_menu');

        $carousel_objs.each(function(e){
            makeCarousel($(this));
        });
    };
  	var makeCarousel = function($carousel_obj){
		var width = $carousel_obj.width();
		$carousel_obj.find('._item').each(function(e){
            var child_offset_left = Math.ceil($(this).offset().left);

			if($(this).hasClass('active')){
				if(width <= child_offset_left){
					$carousel_obj.scrollLeft(child_offset_left)
				}
			}

        });
    };
    init($carousel_wrap_obj);
};