var SLIDE_RESIZE = function(){
	var $el, $container;
	var data;
	var max_width,ratio;
	var slideWidgetResize =function (){
		var width = $container.width();
		if(width > max_width)
			width = max_width;
		var height = width*ratio;
		if(height == 0)
			height = 550;
		$container.height(height);
	};
	var carouselResize = function(){
		if(data.cnt>1){
			var owl = $el.data('owlCarousel');
			owl.onResize();
		}
	};
	var setRatio = function (r){
		ratio = r;
	};
	var init = function(d){
		data = d;
		$el = $('#gallery_'+data.code);
		$container = $('#'+data.code+' ._gallery_wrap');
		max_width = data.max_width;
		ratio = data.ratio;
		if(data.cnt>1){
			$el.owlCarousel({
				animateIn : data.animate_in,
				animateOut : data.animate_out,
				loop : true,
				smartSpeed : 700,
				autoplayTimeout : 4000,
				nav : data.show_next_prev,
				autoplay : true,
				dots : data.show_paging,
				navText : ["", ""],
				items : 1
			});
		}

		slideWidgetResize();

		$(window).off('resize.'+data.code)
			.on('resize.'+data.code,function(){
				slideWidgetResize();
			});
	};
	return {
		'init' : function(d){
			init(d);
		},
		'slideWidgetResize' : function(){
			slideWidgetResize();
		},
		'carouselResize' : function(){
			carouselResize();
		},
		'setRatio' : function(r){
			setRatio(r);
		}
	}
};


var GALLERY2 = function(){
	var code;
	var $list_wrap;
	var $container;
	var $org_html;
	var old_item_cnt = 0;
	var change_timer = setTimeout(function(){},1);
	var current_window_width;
	var ratio;
	var max_width;
	var option = {
	};
	var type_data = {
	};
	var cm_data = {
	};
	var mobile_section;
	var org_grid_gutter;
	var thumb_line_cnt;
	var thumb_item_cnt;
	var thumb_ratio;
	var thumb_margin;
	var thumb_top_bottom_margin;
	var show_more_status = false;
	var show_text = false;
	var is_site_page;
	var is_modal = false;

	var init = function(_c,data,_type_data,c_idx,st,_cm_data){
		option = $.extend(option,data);
		is_site_page = st;
		org_grid_gutter = option.grid_gutter;
		thumb_line_cnt = option.thumb_line_cnt;
		thumb_item_cnt = option.thumb_item_cnt;
		thumb_ratio = option.thumb_ratio;
		thumb_margin = option.thumb_margin;
		thumb_top_bottom_margin = option.thumb_top_bottom_margin;
		type_data = $.extend(type_data,_type_data);
		cm_data = $.extend(cm_data,_cm_data);
		code = _c;
		$list_wrap = $('#container_'+code);
		$container = $('#'+code+' ._gallery_wrap');
		if ( $list_wrap.closest('.modal_site_modal_menu').length > 0 ) is_modal = true;

		var $section_obj = $list_wrap.closest('div[doz_type=section]');
		var windowWidth = $(window).width();

		mobile_section = $section_obj.attr('doz_mobile_section') == 'Y';
		current_window_width = $(window).width();
		$org_html = $list_wrap.clone(false);

		//갤러리 로드시 텍스트는 가려진 상태로 시작(갤러리 완성후 출력)
		if(type_data['type'] != 'masonry'){
			$list_wrap.find('._text_wrap').hide();
		}else{
			show_text = true;
		}
		$list_wrap.imagesLoaded()
			.always(function(){
				runLightGallery(c_idx);
				listResize();
			});

		if(type_data['sub_type']==='slide_03')
			slideThumbsResize();

		if(option['random_btn'] == 'Y' && type_data['sub_type'] != 'slide_03')
			randomItem();

		if(type_data['type'] != 'masonry'){
			slideHeightResize();
		}

		if ( is_modal ){
			if(type_data['type'] == 'masonry'){
				setTimeout(function(){listResize()},100);
			}
			if(type_data['sub_type'] == 'slide_03'){
				clearTimeout(change_timer);
				change_timer = setTimeout(function(){
					slideThumbsResize();
					slideHeightResize();
				}, 50);
			}
		};

		$(window).off('resize.'+code)
			.on('resize.'+code,function(){
				//if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
				if ($(window).width() != windowWidth) {
					windowWidth = $(window).width();
					show_more_status = false;
				}else{
					return;
				}
				//}
				if(type_data['sub_type']==='slide_03')
					slideThumbsResize();

				if(type_data['type'] != 'masonry'){
					slideHeightResize();
				}

				clearTimeout(change_timer);
				change_timer = setTimeout(function(){
					listResize();
				},1000);
			});

		$('body').off('gridChange.'+code).on('gridChange.'+code,function(){
			$(window).trigger('gallery_width.'+code);
		});

		$('#'+code +' ._more_btn').off('click').on('click', function(event){
			var show_cnt = (data.type == 'grid')? data.grid_col_count * data.grid_row_count : data.masonry_count;
			if(windowWidth <= 767){
				// mobile section일 경우
				if ($('#'+code +' ._more_btn').parents('.mobile_section').length > 0) show_cnt = (data.type === 'grid') ? data.grid_col_count * data.grid_row_count : data.masonry_mobile_count;
				else show_cnt = (data.type === 'grid') ? data.grid_mobile_col_count * data.grid_row_count : data.masonry_mobile_count;
			}
			showMore(show_cnt);
		});
	};

	var setRatio = function (r){
		option.slide_ratio = r;
	};
	var slideHeightResize =function (){
		if(type_data['use_height']!='Y'){
			$list_wrap.height('auto');
			return;
		}
		setTimeout(function(){slideHeightResizeSet();},40);
	};

	var slideThumbsResize = function(){

		var container_width = $list_wrap.width(); // 컨테이너 넓이
		var item_wrap = $container.find('.owl-thumbs');
		var item = item_wrap.find('.owl-thumb-item');
		var is_max_grid = $list_wrap.closest('div[doz_type="grid"]').hasClass('col-dz-12');
		if(option.extend_thumbs == 'Y' && $list_wrap.closest('div[class="inside"]').length === 0 && is_max_grid)
			container_width = item_wrap.width() - thumb_margin;
		var item_width = (container_width - (thumb_item_cnt-1) * thumb_margin) / thumb_item_cnt;
		var item_height =  item_width  / (thumb_ratio / 100);
		var container_height = ((thumb_line_cnt-1) * thumb_top_bottom_margin) + (item_height * thumb_line_cnt);

		item.outerHeight(item_height).outerWidth(item_width);
		item_wrap.outerHeight(container_height);
		if(option.thumb_line_cnt != 1)
			item_wrap.outerHeight(container_height - (thumb_top_bottom_margin * (thumb_line_cnt-1)) + (thumb_margin * (thumb_line_cnt-1)));

	};

	var slideHeightResizeSet = function(){
		var width = $list_wrap.width();
		if(width > max_width)
			width = max_width;

		var height = width*option.slide_ratio;
		if(height == 0)
			height = 550;

		if(type_data['sub_type']==='slide_03'){
			var thumbs = $container.find('._owl_thumbs');
			var thumbs_height = thumbs.height();
			var thumbs_item = thumbs.find('.owl-thumb-item');
			var thumbs_item_height = thumbs_item.height();

			if(option.thumb_line_cnt == 1){
				height = (width * option.slide_ratio) - Number(thumb_top_bottom_margin);
				var total_height = Number(thumb_margin) + Number(thumbs_height);
				$container.css('padding-bottom',total_height + Number(thumb_top_bottom_margin) - Number(thumb_margin) +'px');
				$list_wrap.parent().height(height - thumbs_height);
			}else{
				height = ((width * option.slide_ratio) - Number(thumb_top_bottom_margin)) - ((option.thumb_line_cnt - 1) * thumbs_item_height);
				var total_height = Number(thumb_top_bottom_margin) + Number(thumb_margin) + Number(thumbs_height);
				$container.css('padding-bottom',total_height - Number(thumb_margin) +'px');
				$list_wrap.parent().height((height - thumbs_height) + (thumbs_item_height * (option.thumb_line_cnt - 1)));
			}
		}else{
			$list_wrap.parent().height(height);
		}

	};


	var carouselResize = function(){
		if($list_wrap.find('._item').length>1){
			var owl = $list_wrap.data('owlCarousel');
			owl.onResize();
		}
	};

	var runLightGallery = function(c_idx){
		// 비메오 자동재생 시 소리 겹침 문제로 자동재생 해제
		$list_wrap.lightGallery({
			selector: '._lightbox_item',
			thumbnail: false,
			animateThumb: false,
			autoplayControls: false,
			hash: true,
			galleryId: code,		// 원래 galleryId는 number로 들어가야하나 widget_code 외에 구분할 ID가 적당하지 않아 widget_code 그대로 사용(갤러리 닫을 때마다 Document not active 에러 뜨는 이유)
			swipeThreshold: 20,
			showThumbByDefault: false,
			mode: 'lg-fade',
			speed: 200,
			startClass: '',
			scale: 0.5,
			youtubePlayerParams: {
				loop: 0,
				autoplay: 1,
				rel: 0,
				showinfo: 0
			},
			vimeoPlayerParams: {
				loop: 0,
				autoplay: 0,
				rel: 0,
				title: 0
			},
			videoMaxWidth: 1140
		});

		if(history.replaceState && history.pushState){
			// 라이트박스 hash 커스텀(IE 10 이상)
			var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
			var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
			var history_push_flag = true;
			$list_wrap.on('onBeforeOpen.lg', function(){
				// URL에 해시를 입력해서(또는 링크로) 들어온 경우 onBeforeOpen.lg 이벤트 실행되지 않음
				history_push_flag = true;
			});
			$list_wrap.on('onAfterSlide.lg', function(event, prevIndex, index){
				if(history_push_flag){
					history.replaceState(null, null, current_url);
					history.pushState(null, null, current_url + '#lg=' + code + '&slide=' + index);		// 현재 페이지 히스토리 위에 슬라이드 히스토리를 추가
					history_push_flag = false;
				}
				history.replaceState(null, null, current_url + '#lg=' + code + '&slide=' + index);		// 슬라이드 히스토리 교체
			});
			var history_back_flag = true;
			$list_wrap.on('onBeforeClose.lg', function(e){
				history_back_flag = true;
				if(window.location.hash.indexOf('lg=' + code) !== -1){		// #lg가 남아있으면 뒤로 가기 처리
					// 닫기 버튼을 눌렀을 때(뒤로 가기 버튼을 눌렀을 때는 lg 해시가 제거됨)
					history.back();
					history_back_flag = false;
				}
			});
			$list_wrap.on('onCloseAfter.lg', function(){
				if(history_back_flag || window.location.hash.indexOf('lg=' + code) !== -1){
					// Safari에서 onBeforeClose.lg의 history.back()이 실행되지만 해시가 제거되지 않는 문제로 인해 추가 처리
					// onBeforeClose.lg 이벤트에서 한 번 처리하지 않으면 라이트박스가 닫힌 이후 뒤로가기 시 해시가 다시 나타남(기본적으로 닫힐 때 추가 히스토리를 삽입하는 듯)
					history.back();
				}
				history_back_flag = true;
			})
		}
		var current_idx = parseInt(c_idx);
		if(current_idx>0){
			showLightGallery(current_idx);
		}
	};

	var showLightGallery = function(idx){

		$('#gal_item_'+idx).click();
	};

	var runMasonry = function(is_first){
		var threshold = 9999999;

		$list_wrap.on('layoutComplete', function() {
			$list_wrap.css('visibility','visible');
		});

		$list_wrap.masonry({
			'itemSelector': '._item'
		});
		if(is_first){
			setTimeout(function(){
				if(!is_modal){
					$list_wrap.find('._lazy_img').lazyload({
						effect : 'fadeIn'
					});
				}else{
					$list_wrap.find('._lazy_img').lazyload({
						threshold : threshold
					});
				}
			}, 200);
		}
	};

	var runSlide = function(item_cnt){
		if(type_data['show_slide_wrap'] != 'Y')
			return;

		if(is_site_page){
			var is_mobile = false;
			if(MENU.getCurrentDeviceType() == 'm')
				is_mobile = true;
		};

		var slide_dots = '';
		if(type_data['sub_type']=='slide_03'){
			if(!is_mobile){
				slide_dots = false;
			}else{
				slide_dots = true;
			}
		}else{
			slide_dots = option['show_paging']=='Y';
		};

		if(option['show_paging']=='Y') pagingStyle();

		if(old_item_cnt == item_cnt){
			imgHeight();
			return;
		}

		if(typeof $list_wrap.data('owlCarousel') != 'undefined'){
			$list_wrap.data('owlCarousel',false);
			$list_wrap.empty();
			$list_wrap.off();
			$list_wrap.unbind();
			$.each($org_html.find('._item'),function(e,$_item){
				$list_wrap.append($_item);
			});
			$org_html = $list_wrap.clone(false);
		}


		old_item_cnt = item_cnt;
		var mobile_cnt = item_cnt;
		var pc_cnt = item_cnt;
		mobile_cnt  = type_data['max_col'] <=1 ? 1 : mobile_cnt;
		pc_cnt  = type_data['max_col'] <=1 ? 1 : pc_cnt;

		if(type_data['sub_type']==='slide_01' || type_data['sub_type']==='slide_03'){
			mobile_cnt =1;
			pc_cnt =1;
		}
		if(type_data['max_col'] > 1){
			$list_wrap.find('._item').css({'padding' : option.grid_gutter + 'px'});
		}

		var change_animate_list = {
			'slide' : {
				'name' : 'Slide',
				'in' : false,
				'out' : false
			},
			'fade' : {
				'name' : 'Fade',
				'in' : 'fadeIn',
				'out' : 'fadeOut'
			},
			'fadedown' : {
				'name' : 'Fade Down',
				'in' : false,
				'out' : 'fadeOutDown'
			},
			'slidedown' : {
				'name' : 'Slide Down',
				'in' : 'slideInDown',
				'out' : 'slideOutDown'
			},
			'slidedown2' : {
				'name' : 'Slide Down2',
				'in' : false,
				'out' : 'slideOutDown'
			}
		};

		if(option['show_next_prev']=='Y'){
			$list_wrap.toggleClass('custom_nav nav_type_'+cm_data.nav_style_type);
			switch(cm_data.nav_style_type){
				case 'st00':
					switch(cm_data.nav_type_angle){
						case 'normal':
							$list_wrap.toggleClass('nav_normal');
							break;
						case 'round':
							$list_wrap.toggleClass('nav_round');
							break;
						case 'square':
							$list_wrap.toggleClass('nav_square');
							break;
					}
					break;
				case 'st01':
					switch(cm_data.nav_type_arrow){
						case 'normal':
							$list_wrap.toggleClass('nav_normal');
							break;
						case 'round':
							$list_wrap.toggleClass('nav_round');
							break;
						case 'square':
							$list_wrap.toggleClass('nav_square');
							break;
					}
					break;
				case 'st02':
					switch(cm_data.nav_type_long_arrow){
						case 'normal':
							$list_wrap.toggleClass('nav_normal');
							break;
						case 'round':
							$list_wrap.toggleClass('nav_round');
							break;
						case 'square':
							$list_wrap.toggleClass('nav_square');
							break;
					}
					break;
				case 'st03':
					switch(cm_data.nav_type_caret){
						case 'normal':
							$list_wrap.toggleClass('nav_normal');
							break;
						case 'round':
							$list_wrap.toggleClass('nav_round');
							break;
						case 'square':
							$list_wrap.toggleClass('nav_square');
							break;
					}
					break;
				case 'st04':
					$list_wrap.toggleClass('nav_text');
					break;
			}
		};

		var is_extend_grid = $list_wrap.closest('div[class="inside"]').length === 0;
		var stagePadding = 0;

		if ( option['sub_type']=='slide_05') {
			if ( is_extend_grid ) { // 그리드 확장시
				$list_wrap.addClass('extend_gallery');
				stagePadding = 100;
			} else {
				$list_wrap.removeClass('extend_gallery');
				stagePadding = 60;
			}

			// 디자인 모드일 경우 모바일 처럼 보여야함
			const isDesignModeAtMobile = $('body').hasClass('device_type_m')
				&& $list_wrap.closest('div[doz_type="section"]').hasClass('pc_section');

			if ( isDesignModeAtMobile ) stagePadding = 40;
		}

		if ( option['sub_type']=='slide_05' )
			$container.css('overflow', 'hidden');

		if($list_wrap.find('._item').length > 1){
			var owl = $list_wrap.owlCarousel({
				'animateIn' : change_animate_list[option['effect']]['in'],
				'test' : change_animate_list,
				'animateOut' : change_animate_list[option['effect']]['out'],
				'loop' : option['effect_loop']=='Y',
				'smartSpeed' : option['effect_time']*1000,
				'autoplayTimeout' : option['effect_wait'] == '0' ? '31' : option['effect_wait']*1000,
				'nav' : option['show_next_prev']=='Y',
				'autoplay' : option['auto_change']=='Y',
				'dots' : slide_dots,
				'navText' : ["", ""],
				'items':pc_cnt,
				'slideBy':(option['slide_by']=='Y' && (option['sub_type']=='slide_02' || option['sub_type']=='slide_05' )) ? 1 : pc_cnt,
				'responsive':{
					0:{
						'items':mobile_cnt,
						'slideBy': (option['slide_by']=='Y' && (option['sub_type']=='slide_02' || option['sub_type']=='slide_05' )) ? 1 : mobile_cnt,
						'nav':(option['show_next_prev']=='Y' && option['show_mobile_next_prev']=='Y') ? true : false,
						'dots' : type_data['sub_type']=='slide_03' ? true : option['show_paging']=='Y',
						'stagePadding': option['sub_type']=='slide_05' ? 40 : 0
					},
					990:{
						'items':pc_cnt,
						'slideBy': (option['slide_by']=='Y' && (option['sub_type']=='slide_02' || option['sub_type']=='slide_05' )) ? 1 : pc_cnt,
						'nav':option['show_next_prev']=='Y',
						'stagePadding': stagePadding
					}
				},
				'onInitialized': function(){
					if ( option['type']=='slide' && option['show_next_prev']=='Y' && option['effect_loop'] != 'Y' ) {
						$list_wrap.find('.owl-prev').hide();
					}
					if(option['effect_loop'] === 'Y'){
						$list_wrap.find('.owl-item.cloned ._lightbox_item').on('click', function(){
							// 슬라이드 반복 기능으로 생성된 복제 아이템은 원본 아이템으로 클릭 이벤트 연결
							var slide_no = $(this).data('no');
							var $org_item = $list_wrap.find('.owl-item:not(.cloned) ._lightbox_item[data-no=' + slide_no + ']');
							if($org_item){
								$org_item.trigger('click');
							}
						})
					}
				}
			});


			if(type_data['sub_type']  == 'slide_03'){
				if(option.thumb_line_cnt != 1){
					$container.find('._owl_thumbs button').each(function(eq){
						$(this).on('click',function(){
							owl.trigger('to.owl.carousel', [eq, 300 ,true]);
							$container.find('._owl_thumbs button').filter('.active').removeClass('active');
							$(this).addClass('active');
						});
					});
				}else{
					if(!is_mobile){
						owl.on('changed.owl.carousel', syncPosition);
						var syncedSecondary = true;
						var thumbs = $container.find('._owl_thumbs');
						thumbs.on('initialized.owl.carousel', function() {
							thumbs.find('.owl-item').eq(0).addClass('current');
						}).owlCarousel({
							'items' : option.thumb_item_cnt,
							'slideBy' : option.thumb_item_cnt,
							'dots' : false,
							'nav' : false,
							'margin' : Number(option.thumb_margin)
						}).on('changed.owl.carousel', syncPosition2);
					}
					function syncPosition(el) {
						if(option['effect_loop'] !='Y'){
							var current = el.item.index;
						}else{
							var current = el.item.index-2;
						}
						thumbs
							.find('.owl-item')
							.removeClass('current')
							.eq(current)
							.addClass('current');
						var onscreen = thumbs.find(".owl-item.active").length;
						var start = thumbs
							.find('.owl-item.active')
							.first()
							.index();
						var end = thumbs
							.find('.owl-item.active')
							.last()
							.index();
						if (current > end){
							thumbs.trigger('to.owl.carousel', [current, 100, true]);
						}
						if (current < start){
							thumbs.trigger('to.owl.carousel', [current - onscreen, 100, true]);
						}
					}
					function syncPosition2(el) {
						var start = el.item.index;
						var end = el.item.index + parseInt(el.page.size) - 1;
						if(option['effect_loop'] !='Y'){
							var current = owl.find('.owl-item.active').index();
						}else{
							var current = owl.find('.owl-item.active').index() - 2;
						}
						if(current > end || current < start){
							if(syncedSecondary){
								syncedSecondary = false;
								owl.trigger('to.owl.carousel', [start, 100, true]);
								syncedSecondary = true;
							}
						}
					}
					if(!is_mobile){
						thumbs.on('click', '.owl-item', function(e) {
							e.preventDefault();
							var number = $(this).index();
							owl.trigger('to.owl.carousel', [number, 300, true]);
						});
					}
				}
			} else {
				if ( option['show_next_prev'] == 'Y' && option['effect_loop'] != 'Y') {
					owl.on('changed.owl.carousel', setNavBtn);
					function setNavBtn(event){
						var $nextBtn = $container.find('.owl-next');
						var $prevBtn = $container.find('.owl-prev');
						var index = event.item.index;
						var items = event.item.count;
						var size = event.page.size;

						if ( index == 0 ) {
							$prevBtn.hide();
						} else {
							$prevBtn.show();
						}
						if ( items-size == index ) {
							$nextBtn.hide();
						} else {
							$nextBtn.show();
						}
					}
				}
			}

		}
		imgHeight();

		setTimeout(function(){carouselResize();},1000);
	};

	var listResize = function(){
		var window_width = $(window).width();
		if($('body').hasClass('device_type_m')){
			window_width = 370;
		}
		if(window_width <= 991)
			option.grid_gutter = org_grid_gutter/2;

		if ( type_data['sub_type'] !=='slide_01' )
			$list_wrap.css({'margin':'0 -'+option.grid_gutter+'px'});

		var cnt = parseInt(option.grid_col_count);
		var inner_width = $list_wrap.width();

		//var item_cnt = Math.floor(inner_width/option.grid_width);
		//var width = Math.floor(inner_width / item_cnt);
		if(window_width <= 991 && !mobile_section){
			if(typeof option.grid_mobile_col_count == "undefined")
				cnt = 2;
			else
				cnt = parseInt(option.grid_mobile_col_count);
		}else{
			if(type_data['type'] == 'slide'){
				inner_width = $list_wrap.parent().width();
			}else{
				inner_width = $list_wrap.width();
			}
			if(option.grid_extend_fix != 'Y'){
				var s_width = (option.max_width - (option.document_margin * 2)) + option.grid_gutter * 2;
				var item_max = s_width - ((cnt - 1) * parseInt(option.grid_gutter));
				var grid_width = Math.floor(item_max / cnt);
				var current_width = Math.floor((inner_width - ((cnt - 1) * parseInt(option.grid_gutter))) / cnt);
				if(current_width > grid_width){
					cnt = Math.floor(inner_width / grid_width);
				}
			}
		}
		var width = Math.floor(inner_width / cnt);
		if(type_data['type'] === 'grid'){
			$list_wrap.find('._item').css({'padding' : option.grid_gutter + 'px'});
			runColSize(cnt);
		}else if(type_data['type'] === 'masonry'){
			$list_wrap.find('._item').css({'width' : width, 'padding' : option.grid_gutter + 'px'});
			runMasonry(true);
		}else {
			runSlide(cnt);
		}
		//한번 보여진 텍스트는 그다음부터 show 처리안하도록
		if(!show_text){
			$list_wrap.find('._text_wrap').show();
			show_text = true;
		}
	};

	var runColSize = function(col_cnt){
		var i = 1;
		var $_row = $('<div />').addClass('_gallery_row gallery_row tabled');
		var is_append = false;
		$list_wrap.find('._dummy_item').remove();
		var $item = $list_wrap.find('._item');
		var item_count = $item.length;
		var max_count = col_cnt * parseInt(option['grid_row_count']);
		if(parseInt(option['grid_row_count']) <= 0){
			max_count = 99999999;
		}
		if(type_data['type'] == 'grid'){
			$item.each(function(e,$_obj){
				if(e < max_count || show_more_status){
					showItem($(this));
				}else
					hideItem($(this));
			});
		}


		$item.each(function(e,$_obj){
			$_row.append($_obj);
			is_append = false;
			if(i % col_cnt == 0){
				$list_wrap.append($_row);
				is_append = true;
				$_row = $('<div />').addClass('_gallery_row gallery_row tabled');
			}
			i++;
		});

		if(!is_append){
			var $tmp_item = $_row.find('._item');
			if($tmp_item.length >0 ){
				if($tmp_item.length < col_cnt){
					var remain_cnt = col_cnt - $tmp_item.length;
					for(var i = 0; i <remain_cnt; i++){
						var $dummy_col = $('<div/>').addClass('dummy_col item_gallary _item _dummy_item');
						$_row.append($dummy_col);
					}
				}
				$list_wrap.append($_row);
			}
		}
		$list_wrap.find('._gallery_row').each(function(){
			var $tmp_item = $(this).find('._item');
			if($tmp_item.length ==0 ){
				$(this).remove();
			}
		});

		//$list_wrap.find('._item').css('width' , percent+'%');
		imgHeight();
	};


	var imgHeight = function(){
		if(type_data['show_ratio_wrap'] == 'Y'){
			if (option.img_ratio != 'img_circle'){ // 이미지 비율이 원형이 아니면 기존대로 처리
				var height = Math.ceil($list_wrap.find('._img_wrap').eq(0).width() / (option.img_ratio / 100));
			}else{
				var height = Math.ceil($list_wrap.find('._img_wrap').eq(0).width() / (100 / 100));
				$list_wrap.find('._img_wrap').css({'border-radius':'50%'});
				$list_wrap.find('._item_container').css({'border-radius':'50%'});
				if(type_data['sub_type']=='grid_03' || type_data['sub_type']=='slide_02' || option['sub_type']=='slide_05' ){
					$list_wrap.find('._item_container').css({'border-radius':''});
				}
			}
			$list_wrap.find('._img_wrap').css({'min-height':height});
			if(type_data['sub_type'] == 'slide_02' || option['sub_type']=='slide_05' ){
				$list_wrap.find('._img_wrap').height(height);
			}
			if(type_data['is_hover_text'] == 'Y'){
				$list_wrap.find('._text_wrap').height(height);
			}
		}
		if(type_data['use_masonry'] == 'Y'){
			runMasonry(true);
		}
	};


	var showMore = function(show_cnt){
		// Chrome에서 Scroll Anchoring 기능이 갤러리 다음 내용을 기준으로 동작하는 문제가 있어 잠시 기능 해제
		$('body.doz_sys').css('overflow-anchor', 'none');
		$list_wrap.find('._item_hide').each(function(index){
			if(show_cnt-1 < index){
				return ;
			}
			showItem($(this));
		});
		show_more_status = true;
		// 섹션 크기가 변경되므로 resize 처리함
		if(type_data['type'] == 'masonry'){
			runMasonry(false);
		}
		$(window).trigger('resize');
		$('body.doz_sys').css('overflow-anchor', '');
	};
	var showItem = function($_obj){
		$_obj.show();
		var _url = $_obj.find('._img_wrap').data('bg');
		$_obj.find('._img_wrap').css('background-image',_url);
		$_obj.removeClass('_item_hide');
		if($list_wrap.find('._item_hide').length == 0)
			$('#'+code +' ._more_btn').hide();
	};
	var hideItem = function($_obj){
		$_obj.hide();
		$_obj.addClass('_item_hide');
		if($list_wrap.find('._item_hide').length > 0)
			$('#'+code +' ._more_btn').show();
	};

	var randomItem = function(){
		if(type_data['type'] == 'masonry'){
			var list_cnt = $list_wrap.children().length;
			var hide_cnt = $list_wrap.find('._item_hide').length;
			$list_wrap.children().removeClass('_item_hide').css({'display' : '',});
			$list_wrap.children().sort(function(){
				return Math.round(Math.random()) - 0.5;
			}).each(function(index){
				$(this).appendTo($list_wrap);
				if(index > (list_cnt - hide_cnt -1)){
					$(this).addClass('_item_hide').css({'display' : 'none'});
				}
			});
		}else{
			$list_wrap.children().sort(function(){
				return Math.round(Math.random()) - 0.5;
			}).each(function(){
				$(this).appendTo($list_wrap);
			});
		}
	};

	var pagingStyle = function(){
		switch(cm_data.paging_style_type){
			case 'st00':
				switch(cm_data.paging_default_style_type){
					case 'st00':
						$list_wrap.toggleClass('paging_type_dot paging_type_dot01', true);
						break;
					case 'st01':
						$list_wrap.toggleClass('paging_type_dot paging_type_dot02', true);
						break;
				}
				break;
			case 'st01':
				$list_wrap.toggleClass('paging_type_big_dot', true);
				break;
			case 'st02':
				$list_wrap.toggleClass('paging_type_line', true);
				break;
			case 'st03':
				switch(cm_data.paging_active_style_type){
					case 'st00':
						$list_wrap.toggleClass('paging_type_count paging_type_count01', true);
						break;
					case 'st01':
						$list_wrap.toggleClass('paging_type_count paging_type_count02', true);
						break;
					case 'st02':
						$list_wrap.toggleClass('paging_type_count paging_type_count03', true);
						break;
				}
				break;
		}

	};

	return {
		'init' : function(c,d,t,c_idx,st,_cm){
			init(c,d,t,c_idx,st,_cm);
		},
		'listResize' : function(){
			listResize();
		},
		'setRatio' : function(r){
			setRatio(r);
		},
		'slideWidgetResize' : function(){
			slideHeightResize();
		},
		'carouselResize' : function(){
			carouselResize();
		},
		'showMore' : function(show_cnt){
			showMore(show_cnt);
		},
		'showLightGallery' : function(idx){
			showLightGallery(idx);
		}
	}
};
