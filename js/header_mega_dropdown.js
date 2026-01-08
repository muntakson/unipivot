var HEADER_MEGA_DROPDOWN = function(){
	var uniq_id = '';
	var resize_time = {};
	var dropdown_state = 'closed'; // 'closed', 'opening', 'open', 'closing'
	var $body;
	var code;
	var widget_offset_top = 0;
	var widget_height = 0;
	var widget_bottom = 0;
	var section_offset_top = 0;
	var section_height = 0;
	var section_bottom = 0;
	var org_row_size = 5;
	var calculate_row_size = 5;
	var row_size = 5;
	var align = 'center';
	var menu_width = 0;
	var gap = 0;
	var event_type = 'mouseover';
	var menu_sync = false;
	var $section;
	var $widget;
	var $drop_down;
	var option;
	var $has_child = false;		// 하위 메뉴 소유 여부
  var is_header_config = false; // 디자인모드 상단설정 여부 true, false
	var getFullHeight = function(){
		var _h = 0;
		var _style_h = $drop_down[0].style.height;
		var _style_d = $drop_down.css('display');
		var _style_v = $drop_down.css('visibility');
		$drop_down.css({'height':'auto', 'display':'block', 'visibility':'hidden'});
		_h = $drop_down.height();
		$drop_down.css({'visibility':_style_v, 'display':_style_d});
		if(_style_h) $drop_down.css('height', _style_h);
		else $drop_down.css('height', '');
		return _h;
	};

	var init = function($w, $d, o){
		uniq_id = makeUniq();
    is_header_config = o.is_header_config;
		$widget = $w;
		$drop_down = $d;
		option = o;
		if(typeof $widget == 'undefined')
			return;
		if(typeof $drop_down == 'undefined')
			return;

		if($widget.length == 0)
			return;

		if($drop_down.length == 0)
			return;

		code = option.code;
		event_type = typeof option.event_type == 'undefined'? 'mouseover' : option.event_type;

		//ios 에서 mouseover 이벤트를 더블탭하여 함. 다른 링크들에 영향을 줌
		if(IS_MOBILE){
			event_type = 'click';
		}
		org_row_size = option.row_size;
		menu_width = option.menu_width;
		menu_sync = option.menu_sync;
		align = option.align;
		calculateRowSize();

		$has_child = $widget.find('.sub_menu').length > 0 ? true : false;		// 하위 메뉴 요소가 1개 이상 존재할 경우 true
		if($('#dropdown_' + code).attr('data-widget-type') === 'inline_menu_btn'){
			$has_child = true;
		};

		$section = $widget.closest('div[data-type=section-wrap]');
		$section.find('._mega_dropdown_container_'+code).remove();
		$section.append($drop_down);

		widget_offset_top = $widget.offset().top;
		widget_height = $widget.outerHeight();
		widget_bottom = widget_offset_top+widget_height;
		section_offset_top = $section.offset().top;
		section_height = $section.outerHeight();
		section_bottom = section_offset_top+section_height;
		$body = $('body');

		gap = (widget_offset_top - section_offset_top)+widget_height;
		$drop_down.css({'top' : gap + 'px'});
		setDropDownTop();

		if(menu_sync){
			//setMenuSync();
		}else{
			$drop_down.find('._mega_dropdown_sync').css('visibility','visible');
			$(window).off('resize.'+uniq_id).on('resize.'+uniq_id,function(){
				if(resize_time) {
					clearTimeout(resize_time);
				}
				resize_time = setTimeout(function() {
					$(this).trigger('resizeEnd.'+uniq_id);
				}, 500);
			});
			$(window).off('resizeEnd.'+uniq_id).on('resizeEnd.'+uniq_id,function(){
				// resize 시 한줄 메뉴 개수 재계산
				calculateRowSize();
			});
		}
		$widget.find('._inline_menu_container').on('more_menu_complete',function(){
			setMenuSync();
		});

		        if (IS_MOBILE) {
		            $widget.off(event_type+".mega_dropdown_"+code).on(event_type+".mega_dropdown_"+code,function(e){
		                if(dropdown_state === 'open' && event_type=='click'){
		                    close(e);
		                }else{
		                    open(e);
		                }
		            });
		
		            $(document).off(event_type+".mega_dropdown_"+code).on(event_type+".mega_dropdown_"+code,function(e){
		                if(($(e.target).closest("#"+code).length == 0 || (event_type=='click' && dropdown_state !== 'opening')) && $(e.target).closest("#dropdown_"+code).length == 0){
		                    close(e);
		                }
		            });
		        } else {			var close_timer = null;
			$widget.add($drop_down).off('mouseenter.mega_dropdown_' + code).on('mouseenter.mega_dropdown_' + code, function(e) {
				if (close_timer) {
					clearTimeout(close_timer);
					close_timer = null;
				}
				open(e);
			});

			$widget.add($drop_down).off('mouseleave.mega_dropdown_' + code).on('mouseleave.mega_dropdown_' + code, function(e) {
				close_timer = setTimeout(function() {
					close(e);
				}, 50);
			});
		}

		// 페이지 로드 직후 마우스가 이미 메뉴 위에 있을 때도 서브메뉴를 열어준다
		if (!IS_MOBILE) {
			setTimeout(function() {
				// 마우스를 한 번만 감지해 영역 안에 있으면 열기
				$(document).one('mousemove.mega_dropdown_init_' + code, function(e) {
					var rect = $widget[0].getBoundingClientRect();
					if (e.clientX >= rect.left && e.clientX <= rect.right &&
						e.clientY >= rect.top && e.clientY <= rect.bottom) {
						open(e);
					}
				});

				// 이미 호버 상태라면 즉시 열기
				if ($widget.is(':hover') || $widget.find(':hover').length > 0) {
					var fakeEvent = { currentTarget: $widget[0] };
					open(fakeEvent);
				}
			}, 100);
		}
	};

	var setMenuSync = function(){
		if(menu_sync && $(window).width() > 768){
			setDropDownTop();
			var $mega_dropdown_sync = $drop_down.find('._mega_dropdown_sync');
			$mega_dropdown_sync.css('visibility','hidden');
			$mega_dropdown_sync.find('._title_anchor').css('visibility', 'hidden');
			$mega_dropdown_sync.find('._title_anchor').css('height', '1px');
			var $menu_items = $widget.find('._main_menu li');
			var $more_menu = $widget.find('._main_menu li._more_menu');
			var $drop_down_menu_items = $mega_dropdown_sync.find('._item');
			if($more_menu.length >0){
				var _last_code = '';
				$menu_items.each(function(){
					if(isBlank($(this).attr('data-code')))
						return false;
					_last_code = $(this).attr('data-code');
				});
				var more_list = [];
				var show_list = [];
				var hit_more = false;
				if(_last_code == '')
					hit_more = true;
				$drop_down_menu_items.each(function(){
					if(hit_more){
						more_list.push($(this));
					}else{
						show_list.push($(this));
					}
					var _code = $(this).attr('data-code');
					if(_code == _last_code){
						hit_more = true;
					}
				});
				if(more_list.length > 0){
					// 공간상 노출되지 않은 메뉴들을 드롭다운 마지막 메뉴 아래로 노출시킴
					var $more_ul = $('<ul class="sub_menu mega_more_list"/>');
					$.each(more_list, function(e, $_obj){
						$_obj.find('ul.mega_more_list').remove();
						$_obj.find('span').show();
						var $clone_title = $_obj.find('._title_anchor').clone().removeClass('_title_anchor');
						$clone_title.show();
						$more_ul.append($('<li class="mega_more"/>').append($clone_title));
						$_obj.find('._title_anchor').hide();
						$_obj.hide();
					});
					var $origin_ul = more_list[0].find('ul');
					$origin_ul.hide();
					more_list[0].append($more_ul);
					more_list[0].show();
					$more_ul.show();
				}
				if(show_list.length > 0){
					$.each(show_list, function(e, $_obj){
						$_obj.find('ul.mega_more_list').remove();
						$_obj.find('ul').show();
						$_obj.show();
					});
				}
			}else{
				// 브라우저 크기가 넓어져 more_menu가 사라졌을 때 숨겼던 메뉴들 다시 노출시킴
				$drop_down_menu_items.each(function(){
					var $show_item = $(this);
					$show_item.find('ul.mega_more_list').remove();
					$show_item.find('ul').show();
					$show_item.show();
				});
			}

			var left = $widget.offset().left;
			if($body.hasClass('admin'))
				left = left-$('#edit').offset().left;
			$mega_dropdown_sync.css({
				'padding' : 0,
				'position' : 'relative',
				'left' : left,
				'visibility' : 'visible'
			});
		}
	};

	var open = function(e){
		if($body.hasClass('admin') && is_header_config)
			return;
		if($('#dropdown_' + code).find('._item').length == 0)
			return;
		if(!$has_child && $(e.currentTarget).find('._main_menu ._more_menu').length == 0)		// 하위 메뉴가 존재하지 않거나 메뉴 더보기 버튼이 존재하지 않을 경우
			return;

		$drop_down.stop(true, true);
		var current_h = $drop_down.height();
		if($drop_down.is(':hidden')) current_h = 0;
		var full_h = getFullHeight();
		var duration = 400;
		if(full_h > 0) duration = Math.round(400 * (Math.abs(full_h - current_h) / full_h));

		$drop_down.slideDown({
			'duration' : duration,
			'easing' : 'swing',
			'start' : function(animation){
				dropdown_state = 'opening';
			},
			'progress' : function(animation, progress, remainingMs){

			},
			'done' : function(animation,jumpedToEnd){
				dropdown_state = 'open';
			}
		});
	};

	var close = function(e){
		if($body.hasClass('admin') && is_header_config)
			return;
		if($('#dropdown_' + code).find('._item').length == 0)
			return;
		if(!$has_child && $(e.currentTarget).find('._main_menu ._more_menu').length == 0)		// 하위 메뉴가 존재하지 않거나 메뉴 더보기 버튼이 존재하지 않을 경우
			return;

		// 애니메이션 중단 시 높이가 남아 클릭 영역을 가리는 문제 예방
		$drop_down.stop(true, true);
		var current_h = $drop_down.height();
		if($drop_down.is(':hidden')) current_h = 0;
		var full_h = getFullHeight();
		var duration = 400;
		if(full_h > 0) duration = Math.round(400 * (current_h / full_h));

		$drop_down.slideUp({
			'duration' : duration,
			'easing' : 'swing',
			'start' : function(animation){
				dropdown_state = 'closing';
			},
			'progress' : function(animation, progress, remainingMs){

			},
			'done' : function(animation,jumpedToEnd){
				dropdown_state = 'closed';
			}
		});
	};

	var setDropDownTop = function(){
		setTimeout(function(){
			widget_offset_top = $widget.offset().top;
			widget_height = $widget.outerHeight();
			widget_bottom = widget_offset_top+widget_height;
			section_offset_top = $section.offset().top;
			section_height = $section.outerHeight();
			section_bottom = section_offset_top+section_height;
			gap = (widget_offset_top - section_offset_top)+widget_height;
			$drop_down.css({'top' : gap + 'px'});
		},1000);
	};

	var calculateRowSize = function(){
		if(menu_width){
			calculate_row_size = align == 'center' ? Math.floor($(window).width() / menu_width) : Math.floor(($(window).width() - (menu_width / 2)) / menu_width);
			if(calculate_row_size < 1) calculate_row_size = 1;
			row_size = calculate_row_size > org_row_size ? org_row_size : calculate_row_size;
		}else{
			row_size = option.row_size;
		}
		if(row_size <1 || row_size>20) row_size = 5;
		if(!menu_sync){
			$('#dropdown_' + code).find('._item').each(function(e){
				if(e % row_size == 0){
					$(this).addClass('clear-both');
				}else{
					$(this).removeClass('clear-both');
				}
			});
		}
	};

	return {
		'init' : function($widget, $drop_down, option){
			init($widget, $drop_down, option);
		}
	}

};
