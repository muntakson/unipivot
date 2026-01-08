var MOBILE_SLIDE_MENU = function(){
	var $menu_slide;
	var $menu_container;
	var $body;
	var status;
	var $backdrop;
	var open_class = 'slide_open';
	var backdrop_class = 'slide_menu_backdrop';
	var init = function(){
		$body = $('body');
		$menu_container = $('#mobile_slide_menu_wrap');
		$menu_slide = $('#mobile_slide_menu');

		var data = $body.data('slide_menu');
		if(typeof  data == 'undefined') {
			$body.data('slide_menu','N');
			status = false;
		}

		$(window).on("resize", function () {
			if(!$body.hasClass('admin')){
				status = $body.data('slide_menu')=='Y';
				if ($(window).width() > 767 && status) {
					slideNavToggle();
				}
			}
		});
		runAccordion();
		// menuActivate();
	};

	var set_accordion = false;
	var active_list = {};
	var runAccordion = function(){
		var transitioning = null;

		var show = function ($el) {
			if (transitioning || $el.hasClass('in')) return;

			var dimension = 'height';

			$el
				.show()
				.removeClass('collapse')
				.addClass('collapsing')[dimension](0)
				.attr('aria-expanded', true);

			//활성화 메뉴 리스트에 추가
			active_list[$el.attr('data-index')] = $el;

			transitioning = 1;

			var complete = function () {
				$el
					.removeClass('collapsing')
					.addClass('collapse in')[dimension]('');
				transitioning = 0;
			};


			var scrollSize = $.camelCase(['scroll', dimension].join('-'));

			$el
				.one('bsTransitionEnd', $.proxy(complete, this))
				.emulateTransitionEnd(350)[dimension]($el[0][scrollSize]);
		};
		var hide = function ($el) {
			if (transitioning || !$el.hasClass('in')) return;

			var dimension = 'height';

			$el[dimension]($el[dimension]())[0].offsetHeight;

			$el
				.addClass('collapsing')
				.removeClass('collapse in')
				.attr('aria-expanded', false);

			// 메뉴를 접을 때 하위 메뉴도 모두 접기 처리
			var $el_li = $el.children('li');
			var $el_li_a = $el_li.children('a');
			if($el_li_a.hasClass('has_child')){
				hide($el_li.children('ul'));
				$el_li_a.toggleClass('open', false);
			}

			transitioning = 1;

			var complete = function () {
				transitioning = 0;
				$el
					.removeClass('collapsing')
					.addClass('collapse')
					.hide();

				//메뉴서랍 숨기기
				$el.find('ul').hide();
				//활성화 메뉴 리스트에서 제거
				delete active_list[$el.attr('data-index')];

			};

			$el
				[dimension](0)
				.one('bsTransitionEnd', $.proxy(complete, this))
				.emulateTransitionEnd(350);
		};


		if(!set_accordion){
			$menu_slide.find('a').each(function(i){
				var $that = $(this);
				var $parent_li = $that.parent('li');
				var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
				if($that.hasClass('active')){
					if(has_child){
						var $child_ul = $parent_li.children('ul');
						var $child_ul_li = $child_ul.children('li:not(.pms_check)');
						$child_ul.attr('data-index',i);
					}
					if(has_child && $child_ul_li.length>0){
						$child_ul.show();
						$child_ul.toggleClass('in', true);
						$that.toggleClass('open', true);
						$that.toggleClass('has_child', true);

						active_list[i] = $child_ul;
					}
				}else{
					var $child_ul = $parent_li.children('ul');
					var $child_ul_li = $child_ul.children('li:not(.pms_check)');
					$child_ul.height(0);
					if(has_child && $child_ul_li.length>0){
						$that.toggleClass('has_child', true);
					}
					$child_ul.attr('data-index',i);
				}
				$that.off('click').on('click',function(e){
					var $parent_li = $that.parent('li');
					var is_folder_menu = $that.data('is_folder_menu')=='Y';
					var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
					if(has_child){
						var $child_ul = $parent_li.children('ul');
						var $child_ul_li = $child_ul.children('li:not(.pms_check)');
					}

					if(has_child && $child_ul_li.length>0){
						if(is_folder_menu || $(e.target).hasClass('_toggle_btn')){
							var $child_ul = $parent_li.children('ul');
							var child_height = 0;
							$child_ul.children('li:not(.pms_check)').each(function(){
								child_height += $that.outerHeight();
							});
							if($child_ul.hasClass('in')){
								hide($child_ul);
								$that.toggleClass('open', false);
							}else{
								$that.toggleClass('open', true);
								show($child_ul);
							}
							cancelPropagation(e);
							return false;
						}
					}else{
						slideNavToggle();
					}
				});

			});
		}

	};

	var rebuildAccordion = function(){
		$menu_slide.find('a').each(function(i){
			var $that = $(this);
			var $parent_li = $that.parent('li');
			var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
			if(has_child){
				var $child_ul = $parent_li.children('ul');
				var $child_ul_li = $child_ul.children('li:not(.pms_check)');
			}
			if(has_child && $child_ul_li.length>0){
				$that.toggleClass('has_child', true);
			}
		});
	};

	var slideNavToggle = function($obj){
		if(typeof $obj == 'object'){
			var $colgroup = $obj.closest('div[data-type=col-group]');
			var colgroup = $colgroup.attr('data-col-group');
			if(colgroup == 'right'){
				$menu_container.toggleClass('left-slide', false);
				$menu_container.toggleClass('right-slide', true);
			}else{
				$menu_container.toggleClass('right-slide', false);
				$menu_container.toggleClass('left-slide', true);
			}
			$menu_slide.toggleClass('animation',true);
		}
		status = $body.data('slide_menu')=='Y';

		if(status){
			hideSlide();
		} else{
			showSlide();
		}

	};

	var showSlide = function(){

		//활성화되어있는 메뉴 보이도록 처리
		for(var k in active_list){
			if(active_list[k].length > 0){
				if(active_list[k].css('display') === 'none') active_list[k].show();
			}
		}

		$('#'+backdrop_class).remove();
		$backdrop = $('<div id="'+backdrop_class+'"/>').addClass(backdrop_class).on('click',function(){
			slideNavToggle();
		});
		$body.data('slide_menu','Y');
		$body.css('overflow-y','hidden');
		setTimeout(function() {
			$menu_container.width('100%');
		},10);
		$menu_container.prepend($backdrop);
		$menu_slide.before();
		$menu_container.toggleClass(open_class, true);
	};

	var hideSlide = function(){
		$body.data('slide_menu','N');
		var is_fullpage = $body.find('.visual_section').attr('doz_fullpage') ==='Y';
		if(is_fullpage)
			$body.css('overflow-y','hidden');
		else
			$body.css('overflow-y','auto');
		$backdrop.remove();
		setTimeout(function(){
			$body.data('slide_menu','N');
			if(is_fullpage)
				$body.css('overflow-y','hidden');
			else
				$body.css('overflow-y','auto');
			$menu_container.width(0);
			$menu_container.toggleClass(open_class,false);
			$('#'+backdrop_class).remove();

			//열려있는 메뉴서랍 숨기기
			$menu_slide.find('.depth-01 ul').hide();
		},700);
		$menu_container.toggleClass(open_class,false);
	};

	// var menuActivate = function(){
	// 	var url = window.location.href;
	// 	var url_id = url.split('/').splice(-1);
	//
	// 	$menu_slide.find('a').each(function(){
	// 		var $that = $(this);
	// 		var $parent_li = $that.parent('li');
	// 		var has_child = $that.data('has_child')=='Y' && $parent_li.children('ul').children('li:not(.pms_check)').length > 0;
	//
	// 		if ( url_id[0] ==  $that.data('url') ) {
	// 			$that.toggleClass('active-real', true);
	// 		}
	//
	// 		var active_child = $parent_li.children('ul').children('li').children('a');
	//
	// 		setTimeout(function(){
	// 			if( has_child && active_child.hasClass('active-real') ){
	// 				$parent_li.children('ul').show().css('height', 'auto');
	// 				$that.toggleClass('active open', true);
	// 				$that.siblings('a.has_child').toggleClass('active open', true);
	// 			}
	// 		}, 100);
	//
	// 	});
	// };

	return {
		'init' :function(){
			init();
		},
		'rebuildAccordion': function(){
			rebuildAccordion();
		},
		'slideNavToggle' : function($obj){
			slideNavToggle($obj);
		},
		'hideSlide' : function(){
			hideSlide();
		},
		'showSlide' : function(){
			showSlide();
		}
		// ,
		// 'menuActivate' : function(){
		// 	menuActivate();
		// }
	};

}();
var PC_SLIDE_MENU = function(){
	var $menu_slide;
	var $menu_container;
	var $body;
	var status;
	var $backdrop;
	var open_class = 'slide_open';
	var backdrop_class = 'slide_menu_backdrop';
	var init = function(){
		$body = $('body');
		$menu_container = $('#pc_slide_menu_wrap');
		$menu_slide = $('#pc_slide_menu');

		var data = $body.data('pc_slide_menu');
		if(typeof  data == 'undefined') {
			$body.data('pc_slide_menu','N');
			status = false;
		}

		$(window).on("resize", function () {
			status = $body.data('pc_slide_menu')=='Y';
			if ($(window).width() <= 767 && status) {
				slideNavToggle();
			}
		});
		runAccordion();

		$menu_slide.find('._tse_scrollable').TrackpadScrollEmulator();
	};

	var set_accordion = false;
	var active_list = {};
	var runAccordion = function(){
		var transitioning = null;

		var show = function ($el) {
			if (transitioning || $el.hasClass('in')) return;

			var dimension = 'height';

			$el
				.show()
				.removeClass('collapse')
				.addClass('collapsing')[dimension](0)
				.attr('aria-expanded', true);

			//활성화 메뉴 리스트에 추가
			active_list[$el.attr('data-index')] = $el;

			transitioning = 1;

			var complete = function () {
				$el
					.removeClass('collapsing')
					.addClass('collapse in')[dimension]('');
				transitioning = 0;
			};


			var scrollSize = $.camelCase(['scroll', dimension].join('-'));

			$el
				.one('bsTransitionEnd', $.proxy(complete, this))
				.emulateTransitionEnd(350)[dimension]($el[0][scrollSize]);
		};
		var hide = function ($el) {
			if (transitioning || !$el.hasClass('in')) return;

			var dimension = 'height';

			$el[dimension]($el[dimension]())[0].offsetHeight;

			$el
				.addClass('collapsing')
				.removeClass('collapse in')
				.attr('aria-expanded', false);

			// 메뉴를 접을 때 하위 메뉴도 모두 접기 처리
			var $el_li = $el.children('li');
			var $el_li_a = $el_li.children('a');
			if($el_li_a.hasClass('has_child')){
				hide($el_li.children('ul'));
				$el_li_a.toggleClass('open', false);
			}

			transitioning = 1;

			var complete = function () {
				transitioning = 0;
				$el
					.removeClass('collapsing')
					.addClass('collapse')
					.hide();

				//메뉴서랍 숨기기
				$el.find('ul').hide();
				//활성화 메뉴 리스트에서 제거
				delete active_list[$el.attr('data-index')];

			};

			$el
				[dimension](0)
				.one('bsTransitionEnd', $.proxy(complete, this))
				.emulateTransitionEnd(350);
		};


		if(!set_accordion){
			$menu_slide.find('a').each(function(i){
				var $that = $(this);
				var $parent_li = $that.parent('li');
				var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
				if($that.hasClass('active')){
					if(has_child){
						var $child_ul = $parent_li.children('ul');
						var $child_ul_li = $child_ul.children('li:not(.pms_check)');
						$child_ul.attr('data-index',i);
					}
					if(has_child && $child_ul_li.length>0){
						$child_ul.show();
						$child_ul.toggleClass('in', true);
						$that.toggleClass('open', true);
						$that.toggleClass('has_child', true);

						active_list[i] = $child_ul;
					}
				}else{
					var $child_ul = $parent_li.children('ul');
					var $child_ul_li = $child_ul.children('li:not(.pms_check)');
					$child_ul.height(0);
					if(has_child && $child_ul_li.length>0){
						$that.toggleClass('has_child', true);
					}
					$child_ul.attr('data-index',i);
				}
				$that.off('click').on('click',function(e){
					var $parent_li = $that.parent('li');
					var is_folder_menu = $that.data('is_folder_menu')=='Y';
					var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
					if(has_child){
						var $child_ul = $parent_li.children('ul');
						var $child_ul_li = $child_ul.children('li:not(.pms_check)');
					}

					if(has_child && $child_ul_li.length>0){
						if(is_folder_menu || $(e.target).hasClass('_toggle_btn')){
							var $child_ul = $parent_li.children('ul');
							var child_height = 0;
							$child_ul.children('li:not(.pms_check)').each(function(){
								child_height += $that.outerHeight();
							});
							if($child_ul.hasClass('in')){
								hide($child_ul);
								$that.toggleClass('open', false);
							}else{
								$that.toggleClass('open', true);
								show($child_ul);
							}
							cancelPropagation(e);
							return false;
						}
					}else{
						slideNavToggle();
					}
				});

			});
		}

	};

	var rebuildAccordion = function(){
		$menu_slide.find('a').each(function(i){
			var $that = $(this);
			var $parent_li = $that.parent('li');
			var has_child = $that.data('has_child')=='Y' && $that.parent('li').children('ul').children('li:not(.pms_check)').length > 0;
			if(has_child){
				var $child_ul = $parent_li.children('ul');
				var $child_ul_li = $child_ul.children('li:not(.pms_check)');
			}
			if(has_child && $child_ul_li.length>0){
				$that.toggleClass('has_child', true);
			}
		});
	};

	var slideNavToggle = function($obj){
		if(typeof $obj == 'object'){
			var $colgroup = $obj.closest('div[data-type=col-group]');
			var colgroup = $colgroup.attr('data-col-group');
			if(colgroup == 'right'){
				$menu_container.toggleClass('left-slide', false);
				$menu_container.toggleClass('right-slide', true);
			}else{
				$menu_container.toggleClass('right-slide', false);
				$menu_container.toggleClass('left-slide', true);
			}
			$menu_slide.toggleClass('animation',true);
		}
		status = $body.data('pc_slide_menu')=='Y';
		if(status){
			hideSlide();
		} else{
			showSlide();
		}
	};

	var showSlide = function(){
		//활성화되어있는 메뉴 보이도록 처리
		for(var k in active_list){
			if(active_list[k].length > 0){
				if(active_list[k].css('display') === 'none') active_list[k].show();
			}
		}
		$('#'+backdrop_class).remove();
		$backdrop = $('<div id="'+backdrop_class+'"/>').addClass(backdrop_class).on('click',function(){
			slideNavToggle();
		});
		$body.data('pc_slide_menu','Y');
		$body.css('overflow-y','hidden');
		setTimeout(function() {
			$menu_container.width('100%');
		},10);
		$menu_container.prepend($backdrop);
		$menu_slide.before();
		$menu_container.toggleClass(open_class, true);
	};

	var hideSlide = function(){
		$body.data('pc_slide_menu','N');
		$backdrop.remove();
		var is_fullpage = $body.find('.visual_section.pc_section').attr('doz_fullpage') ==='Y';
		if(is_fullpage)
			$body.css('overflow-y','hidden');
		else
			$body.css('overflow-y','auto');
		setTimeout(function(){
			$body.data('pc_slide_menu','N');
			if(is_fullpage)
				$body.css('overflow-y','hidden');
			else
				$body.css('overflow-y','auto');
			$menu_container.width(0);
			$menu_container.toggleClass(open_class,false);
			$('#'+backdrop_class).remove();
		},700);
		$menu_container.toggleClass(open_class,false);
	};


	return {
		'init' :function(){
			init();
		},
		'rebuildAccordion': function(){
			rebuildAccordion();
		},
		'slideNavToggle' : function($obj){
			slideNavToggle($obj);
		},
		'hideSlide' : function(){
			hideSlide();
		},
		'showSlide' : function(){
			showSlide();
		}
	};

}();
$(function(){
	MOBILE_SLIDE_MENU.init();
	PC_SLIDE_MENU.init();
});