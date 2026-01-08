var HEADER_MORE_MENU = function(){
	var uniq_id = '';
	var $menu_wrap;
	var $menu_grid;
	var $menu;
	var $menu_obj_clone, $menu_obj_clone_temp;
	var more_width;
	var width_adj = 1;
	var prev_more_width = 60;
	var $more_menu;
	var $col_group;
	var use_mega_dropdown = false;
	var resize_time = {};
	var more_menu_html = '<li class="dropdown _more_menu"><a data-toggle="dropdown" class="fixed_transform dropdown-toggle disabled dropdown-more _header_dropdown" data-toggle="dropdown" aria-expanded="false"><i class="icon-options vertical-middle" aria-hidden="true"></i></a><ul class="dropdown-menu more_list _more_list"></ul></li>';
	var widget_code = ''; // optional
	var $inline_menu_container;

	var getAdjWidth = function(){
		return width_adj;
	};

	var resetAdjWidth = function(){
		width_adj = 1;
	};

	var init = function($_obj,_use_mega_dropdown,callback){
		uniq_id = makeUniq();
		$menu_wrap = $_obj;
		use_mega_dropdown = _use_mega_dropdown;
    
		$menu = $menu_wrap.find('._main_menu');
		$menu_wrap.css({'visibility' : 'hidden'});

		$menu_obj_clone = $menu.clone(true);
		$menu_obj_clone.removeClass('_main_menu');
		$menu_obj_clone.addClass('_main_clone_menu main_clone_menu');
		$menu_wrap.find('._main_clone_menu').remove();
		$menu_wrap.append($('<div class="_main_clone_menu_wrap"/>').css({
			position : 'absolute',
			top : -9999,
			left : -9999
		}).append($menu_obj_clone));

		$menu_obj_clone_temp = $menu.clone(true);
		$menu_obj_clone_temp.empty();
		$menu_obj_clone_temp.removeClass('_main_menu');
		$menu_obj_clone_temp.addClass('main_clone_menu');
		$more_menu = $(more_menu_html);

		$inline_menu_container = $('#inline_header_normal *[data-type=col-group]:has(*[data-widget-type=inline_menu])');

		setTimeout(function() {
			$menu_obj_clone_temp.append($more_menu);
			$menu_wrap.append($('<div class="_main_clone_menu_wrap"/>').css({
				position : 'absolute',
				top : -9999,
				left : -9999
			}).append($menu_obj_clone_temp));
			more_width = Math.ceil($more_menu.outerWidth())+width_adj;

			calculateMenuWidth(callback);
    }, 500);


		$(window).off('resize.'+uniq_id).on('resize.'+uniq_id,function(){
			if(resize_time) {
				clearTimeout(resize_time);
			}
			resize_time = setTimeout(function() {
				$(this).trigger('resizeEnd.'+uniq_id);
			}, 500);
		});

		$(window).off('resizeEnd.'+uniq_id).on('resizeEnd.'+uniq_id,function(){
			calculateMenuWidth(callback);
		});
		$('body').on('section_change.'+uniq_id,function(e,event_section_code){
			var $section = $menu.closest('div[data-type=section]');
			var section_code = $section.attr('section-code');
			if(section_code != event_section_code)
				return false;
			calculateMenuWidth(callback);
		});
	};

	var setWidgetCode = function(widgetCode) {
		widget_code = widgetCode;
	}

	var allowDropdownHover = function(){
		if($(window).width() > 991){
			$menu_wrap.find('._header_dropdown').dropdownHover();
		}
	};

	var calculateMenuWidth = function(callback){
    const main_clone_menu_wrap = $menu_wrap[0].querySelector('._main_clone_menu_wrap');
    main_clone_menu_wrap.style.display = 'block';
		resetAdjWidth();
		$col_group = $menu_wrap.closest('div[data-type=col-group]');
		$menu_grid = $menu_wrap.closest('div[data-type=grid]');
		$col_group.css('visibility', 'hidden');
		var menu_cnt = 0;
		$menu.children("li").filter(function(){
			return $(this).css('display') != 'none';
		}).each(function(index){
			$(this).data('width', Math.ceil($(this).outerWidth(true)));
			menu_cnt++;
		});
		prev_more_width = more_width;
		more_width = Math.ceil($more_menu.outerWidth())+getAdjWidth();
		if(more_width <= 50)
			more_width = prev_more_width;


		var col_group_width = Math.floor($col_group.width());
		var menu_width = 0;

		var $menu_grid_siblings = $menu_grid.siblings().not('div[data-type=line-guide]');
		$menu_grid_siblings.each(function(){
			var _s_width = Math.ceil($(this).outerWidth(true));
			menu_width += _s_width;
		});


		var is_split = false;

		var calc_list = [];
		$menu_obj_clone.children("li").filter(function(){
			return $(this).css('display') != 'none';
		}).each(function(index){
			var _width_adj = getAdjWidth();
			var _width_data = {'obj':$(this), 'width' : Math.ceil($(this).outerWidth())+_width_adj};
			calc_list.unshift(_width_data);
			menu_width += Math.ceil($(this).outerWidth(true));
			menu_width += _width_adj;
			if(menu_width >= col_group_width){
				is_split = true;
				return false;
			}
		});

		if(is_split){
			$.each(calc_list, function(e, _calc_data){
				menu_width = menu_width - _calc_data.width;
				var more_contain_width = menu_width + more_width+40;
				if(more_contain_width >= col_group_width){
					if(calc_list.length == 1){
						splitMoreMenu(_calc_data.obj, callback);
						return false;
					}
					return true;
				}else{
					splitMoreMenu(_calc_data.obj, callback);
					return false;
				}
			});
		}else{
			splitMoreMenu(false, callback);
		}
    main_clone_menu_wrap.style.display = 'none';

		window.setTimeout(() => {
			// Browser resize 시 상단 메뉴를 다시 그리기 때문에 이벤트를 다시 등록해야함
			attachWheelEventOnDropdownElements();

			const isExistInlineMenuContainer = Boolean($inline_menu_container.length);

			if (isExistInlineMenuContainer)  {
				handleInlineMenuLastDropdown();
				handleClickMenuLink();
			}
		}, 0);
	};

	var splitMoreMenu = function($split_item, callback){
		if(!$split_item){
			$menu.empty();
			$menu_obj_clone.children("li").each(function(index){
				$menu.append($(this).clone(true));
			});
		}else{
			var $menu_items = $split_item.prevAll();
			$menu.empty();
			$menu_items.each(function(){
				$menu.prepend($(this).clone(true));
			});
			var $more_items = $split_item.nextAll();
			$more_menu = $(more_menu_html);
			$menu.append($more_menu);

			if(!use_mega_dropdown){
				$more_menu.find('._more_list').append($split_item.clone(true).removeClass('dropdown').addClass('dropdown-submenu'));
				$more_items.each(function(){
					var $_clone_item = $(this).clone(true);
					$_clone_item.removeClass('dropdown').addClass('dropdown-submenu');
					$more_menu.find('._more_list').append($_clone_item);
				});
			}

		}

		if(!use_mega_dropdown){
			$menu.find("li.dropdown").each(function(index){
				$(this).find("li.dropdown-submenu").each(function(index){
					if(!$(this).hasClass('pulldown-hide')){
						if($(this).find(".dropdown-menu > li").length > 0) $(this).addClass("sub-active");
					}else{
						$(this).find('ul').removeClass('dropdown-menu');
						$(this).find('ul li').hide();
					}
				});
			});
			$more_menu.find("li").each(function(index){
				$(this).find("li.dropdown-submenu").each(function(index){
					if(!$(this).hasClass('pulldown-hide')){
						if($(this).find(".dropdown-menu > li").length > 0) $(this).addClass("sub-active");
					}else{
						$(this).find('ul').removeClass('dropdown-menu');
						$(this).find('ul li').hide();
					}
				});
			});
		}
		$menu_wrap.css('visibility', 'visible');
		$col_group.css('visibility', 'visible');

		allowDropdownHover();

		if(typeof callback == 'function'){
			callback();
		}

		$menu_wrap.trigger('more_menu_complete');


	};

	/**
	 * 상단 메뉴가 viewport 높이보다 큰 경우 마우스로 상단 메뉴를 스크롤링 하기 위함
	 * @description 디자인모드가 아니며, 서브메뉴의 타입이 mega dropdown이 아니며, 상단메뉴가 고정인 경우 이벤트 추가
	 */
	const attachWheelEventOnDropdownElements = () => {
		// PC 헤더(#inline_header_normal)만 적용되도록 처리
		const $root = $("._new_org_header #inline_header_normal ._fixed_header_section");

		const isDesignMode = window.location.pathname.includes('admin/design');

		const shouldAttachWheelEvent = !isDesignMode && !use_mega_dropdown && Boolean($root.length);

		if (!shouldAttachWheelEvent) {
			return;
		}

		const $targetDropdowns = $root.find('._inline_menu_container ._main_menu > .dropdown > .dropdown-menu');
		const $targetHeaderDropdowns = $targetDropdowns.parent().find('> ._header_dropdown');

		initDropdowns($targetDropdowns);

		$targetDropdowns.on('wheel.dropdown', handleWheelDropdown);

		// bootstrap-hover-dropdown lib에서 dropdownHover함수를 호출한 요소에 이벤트를 실행시킴
		$targetHeaderDropdowns.on('hide.bs.dropdown', handleHideDropdown);
	}

	const initDropdowns = ($dropdowns) => {
		resetDropdowns($dropdowns);
	}

	const resetDropdowns = ($dropdowns) => {
		$dropdowns.data('currentY', 0);
		$dropdowns.data('initHoverGuard', false);

		$dropdowns.css('transform', 'translateY(0)');

		$dropdowns.removeClass('init-hover-guard');
	}

	const handleWheelDropdown = function(e) {
		const $element = $(this);

		const innerHeight = window.innerHeight;
		const elementScrollHeight = $element.prop('scrollHeight');

		const isOverflow = innerHeight < elementScrollHeight;

		// 브라우저 높이가 dropdown의 높이보다 작을경우 처리하지 않음
		if (!isOverflow)  {
			return;
		}

		const event = e.originalEvent;
		const initHoverGuard = $element.data('initHoverGuard');

		const acc = { min: 20, max: 30 };
		const deltaY = event.deltaY;
		const accValue = Math.floor(Math.min(acc.max, Math.max(acc.min, Math.abs(deltaY * 0.1))));
		const currentY = $element.data('currentY') || 0;

		const threshold = Math.floor(innerHeight / 3);
		const position = deltaY > 0 ? -1 : 1;

		const sumAccValue = Math.min(0, currentY + accValue * position);
		const maxAccValue = currentY;
		const nextY = elementScrollHeight - Math.abs(sumAccValue) < threshold ? maxAccValue : sumAccValue;

		$element.css('transform', `translateY(${nextY}px)`);
		$element.data('currentY', nextY);

		if (!initHoverGuard) {
			$element.addClass('init-hover-guard');
			$element.data('initHoverGuard', true);
		}

		// 바깥 스크롤 방지
		event.preventDefault();
	}

	const handleHideDropdown = function() {
		const $dropdown = $(this).parent().find('> .dropdown-menu');

		resetDropdowns($dropdown);
	}

	const handleInlineMenuLastDropdown = function() {
		// 기존에 추가된 클래스로 인해 pos 계산이 부정확할 수 있으므로 제거
		$inline_menu_container.removeClass('overflow-last-dropdown');

		const $lastDropdown = $inline_menu_container.find(`#${widget_code} ._main_menu li.dropdown:last-of-type > ul.dropdown-menu`);

		const hasLastDropdown = Boolean($lastDropdown.length);

		if (!hasLastDropdown) {
			return;
		}

		const viewportWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
		const lastDropdownRect = $lastDropdown.get(0).getBoundingClientRect();

		const remainRightSpace = viewportWidth - lastDropdownRect.left;

		const isOverflowDropdown = lastDropdownRect.width > remainRightSpace;

		if (isOverflowDropdown) {
			$inline_menu_container.addClass('overflow-last-dropdown');
		}
	}

	const handleClickMenuLink = function() {
		/**
		 * mega dropdown 설정인 경우
		 * - 아이패드, Chrome, Safari에서 메뉴 클릭 시 다르게 동작하는 부분이 있어 아래와 같이 처리
		 * - mega dropdown이 보이는 경우에만 링크 클릭이 가능하도록 처리
 		 */
		if (use_mega_dropdown) {
			const $widget = $(`#${widget_code}`);
			const $dropdown = $(`#dropdown_${widget_code}`);

			const hasItemMegaDropdown = !!$dropdown.find('._item').length;
			const hasSubMenuMegaDropdown = !!$dropdown.find('.sub_menu').length || $dropdown.attr('data-widget-type') === 'inline_menu_btn';
			const hasMoreMenu = !!$widget.find('._main_menu ._more_menu').length;

			/**
			 * 하위 메뉴가 없고 더보기 버튼이 존재하지 않는 경우
			 * @ref header_mega_dropdown.js, open 함수
			 */
			if (!hasItemMegaDropdown || (!hasSubMenuMegaDropdown && !hasMoreMenu)) {
				return;
			}

			$menu.find('a._header_dropdown').off('click.megaDropdown').on('click.megaDropdown', function(e) {
				const $megaDropdownContainer = $(`._mega_dropdown_container_${widget_code}`);

				const hasMegaDropdownContainer = !!$megaDropdownContainer.length;

				if (!hasMegaDropdownContainer) {
					return;
				}

				/** mega dropdown이 펼쳐질 때 height가 동적으로 style 속성에 지정됨 */
				const isProgressing = $megaDropdownContainer.get(0).style.height !== '';

				const isComplete = !isProgressing && $megaDropdownContainer.css('display') === 'block';

				if (!isComplete) {
					e.preventDefault();
				}
			});
		}
	}


	return {
		'init' : function($obj,callback){
			init($obj,callback);
		},
		'setWidgetCode': function(widgetCode) {
			setWidgetCode(widgetCode);
		},
		'calculateMenuWidth' : function(callback){
			calculateMenuWidth(callback);
		}
	}

};

