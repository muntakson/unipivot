var HEADER_OVERLAY = function(){
	var $wrap;
	var header_height = '';
	var resize_time = {};

	var is_init = false;
	var init = function(){

		if(is_init)
			return false;
		is_init = true;
		$(window).on('resize.header_overlay',function(){
			if(resize_time) {
				clearTimeout(resize_time);
			}
			resize_time = setTimeout(function() {
				$(this).trigger('header_overlay_resize_end');
			}, 500);
		});
		setTimeout(function() {
			setOverlayHeight();
		}, 500);

		$(window).off('header_overlay_resize_end').on('header_overlay_resize_end',function(){
			setOverlayHeight();
		});
		$('body').on('section_overlay_change',function(){
			setOverlayHeight();
		});
	};

	var setOverlayHeight = function(){
		$wrap = $('#doz_header');
		header_height = $wrap.height();

		//DO SOMETHING

		$('.header_overlay ._section_first').css('cssText',"padding-top : "+header_height+'px !important;');
		$('.header_overlay ._section_first.visual_section .op').css('cssText',"padding-top : "+header_height+'px !important;');
		$('.header_overlay ._section_first.visual_section').css('cssText',"padding-top : "+0+'px !important;');
	};

	return {
		'init' : function(){
			init();
		}
	}
}();
