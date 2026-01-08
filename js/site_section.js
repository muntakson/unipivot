$(function(){
	if(LIMIT_API_LIST.indexOf('youtube') === -1){
		var $youtube_player_api = $('#youtube_player_api');
		if($youtube_player_api.length === 0){
			$youtube_player_api = $('<script src="https://www.youtube.com/iframe_api" id="youtube_player_api" />');
			var $first_script = $('script').eq(0);
			$first_script.before($youtube_player_api);
		}
	}
});
var SITE_SECTION_YOUTUBE = function(){
	var type;
	var tv;
	var vid;
	var playerDefaults = {'autoplay': 1, 'autohide': 1, 'modestbranding': 0, 'rel': 0, 'showinfo': 0, 'controls': 0, 'disablekb': 1, 'enablejsapi': 1, 'iv_load_policy': 3};
	var screen_code;
	var slide_code;
	var id;
	var $screen;
	var code;
	var currVid = 0;
	var $section_obj;
	var is_fullpage;

	var init = function(t,c,d,s){
		type = t;
		code = c;
		id = d;
		slide_code = s;
		is_fullpage = $('#'+code).attr('doz_fullpage') === 'Y';

		if(type == 'section'){
			screen_code = "screen_"+code;
			$section_obj = $('#' + code);
		}
		if(type == 'visual'){
			screen_code = "screen_"+code+"_"+slide_code;
			$section_obj = $('#visual_' + code);
			if(is_fullpage){
				$section_obj = $('#visual_' + code+' .item');
			}
		}
		vid = [ {'videoId': id, 'startSeconds': 0, 'endSeconds': 0, 'suggestedQuality': 'default'}];

		youTubePlayer();
	};

	var youTubePlayer  = function (){
		$section_obj.imagesLoaded()
			.always(function(){
				tv = new YT.Player(screen_code, {events: {'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults});
			});

	};

	var onPlayerReady = function(){
		if(type == 'section'){
			screen_code = "screen_"+code;
		}
		if(type == 'visual'){
			screen_code = "screen_"+code+"_"+slide_code;
		}
		$screen = $('#' + screen_code);
		tv.loadVideoById(vid[currVid]);
		tv.mute();
		if(type == 'visual' && is_fullpage){
			$screen.attr('data-keepplaying', '');
			tv.stopVideo();
		}
		vidRescale();
		$('body').off('gridChange.'+code).on('gridChange.'+code,function(){
			vidRescale();
		});
		$(window).on('resize', function(){
			vidRescale();
		});
	};

	var playVideo = function(){
		if(typeof tv.playVideo === 'function'){
			tv.playVideo();
			return true;
		}else
			return false;
	};

	var onPlayerStateChange = function(e) {
		$screen = $('#' + screen_code);
		if (e.data === 1){
			$screen.addClass('active');
		} else if (e.data === 0){
			$screen.removeClass('active');
			if(currVid === vid.length - 1){
				currVid = 0;
			} else {
				currVid++;
			}
			tv.loadVideoById(vid[currVid]);
			tv.seekTo(vid[currVid].startSeconds);
		}
	};

	var vidRescale = function(){
		var w = $section_obj.outerWidth()+20,
			h = $section_obj.outerHeight()+20;
		if (w/h > 16/9){ //납작하다는 애기
			tv.setSize(w, w/16*9);
			$screen.css({'left': '-10px', 'top':'-10px'});
		} else { //길죽할때
			tv.setSize(h*(16/9), h);
			$screen.css({'left': -(($screen.outerWidth()-w)/2)-10 , "top":"-10px"});
		}
	};

	return {
		'init' : function(t,c,d,s){
			init(t,c,d,s);
		},
		'playVideo' : function(){
			return playVideo();
		}
	}

};

var SITE_SECTION_VIMEO = function(){
	var type;
	var tv;
	var options = {'autoplay': true, 'autopause': false, 'controls': false, 'title': false, 'loop': true, 'muted': true, 'background': true};
	var screen_code;
	var id;
	var slide_code;
	var $screen;
	var code;
	var $section_obj;
	var is_fullpage;
	var $screen_iframe;
	var org_width;
	var org_height;

	var init = function(t,c,d,s){
		type = t;
		code = c;
		id = d;
		slide_code = s;
		is_fullpage = $('#'+code).attr('doz_fullpage') === 'Y';

		if(type == 'section'){
			screen_code = "screen_"+code;
			$section_obj = $('#' + code);
		}
		if(type == 'visual'){
			screen_code = "screen_"+code+"_"+slide_code;
			$section_obj = $('#visual_' + code);
			if(is_fullpage){
				$section_obj = $('#visual_' + code+' .item');
			}
		}

		vimeoPlayer();
	};

	var vimeoPlayer  = function (){
		$section_obj.imagesLoaded()
			.always(function(){
				$.extend(options, {'id': id});
				tv = new Vimeo.Player(screen_code, options);
				tv.on('loaded', function(){
					onPlayerReady();
				});
				tv.on('play', function(){
					$screen.addClass('active');
				});
				tv.on('ended', function(){
					$screen.removeClass('active');
				});
			});

	};

	var onPlayerReady = function(){
		if(type == 'section'){
			screen_code = "screen_"+code;
		}
		if(type == 'visual'){
			screen_code = "screen_"+code+"_"+slide_code;
		}
		$screen = $('#' + screen_code);
		$screen_iframe = $screen.find('iframe');
		org_width = $screen_iframe.width();
		org_height = $screen_iframe.height();
		tv.setVolume(0);
		if(type == 'visual' && is_fullpage){
			$screen.attr('data-keepplaying', '');
			if(!tv.getPaused()) tv.pause();
		}
		vidRescale();
		$('body').off('gridChange.'+code).on('gridChange.'+code,function(){
			vidRescale();
		});
		$(window).on('resize', function(){
			vidRescale();
		});
	};

	var playVideo = function(){
		if(typeof tv.play === 'function'){
			tv.play();
			return true;
		}else
			return false;
	};

	var vidRescale = function(){
		var w = $section_obj.outerWidth()+20,
			h = $section_obj.outerHeight()+20;
		if (w/h > org_width/org_height){ //납작하다는 애기
			$screen_iframe.attr('width', w);
			$screen_iframe.attr('height', w/(org_width/org_height));
			$screen.css({'left': '-10px', 'top':'-10px'});
		} else { //길죽할때
			$screen_iframe.attr('width', h*(org_width/org_height));
			$screen_iframe.attr('height', h);
			$screen.css({'left': -(($screen_iframe.outerWidth()-w)/2)-10 , "top":"-10px"});
		}
	};

	return {
		'init' : function(t,c,d,s){
			init(t,c,d,s);
		},
		'playVideo' : function(){
			return playVideo();
		}
	}

};

var SECTION_RESIZE = function(){
	var code;
	var $section;
	var org_inside_width;
	var $main;
	var $aside;
	var $gutter;
	var $inside;
	var init = function(c){
		code = c;
		$section = $('#'+c);
		$main = $section.find('main');
		$aside = $section.find('div[doz_type="aside"]');
		$gutter = $section.find('div._side_gutter');
		$inside = $section.find('main > div[doz_type="inside"]');
		org_inside_width = parseInt($inside.css('width'));
		run();
	};

	var run = function(){
		//calc();
		$(window).off('resize.section_resize_'+code).on('resize.section_resize_'+code,function(){
			//calc();
		});
	};

	var calc = function(){
		var main_width = $main.width();
		if($aside.css('display')=='none')
			return;
		var side_width = $aside.outerWidth() + parseInt($aside.css('margin-left')) + parseInt($aside.css('margin-right'));
		var gutter_width = $gutter.outerWidth();
		var inside_width = $inside.outerWidth();
		var t_width = side_width+gutter_width+inside_width;
		if(main_width < t_width){
			var term = t_width-main_width;
			$inside.outerWidth(inside_width-term);
		}else if(t_width < main_width){
			var term = main_width - t_width;
			$inside.outerWidth(inside_width+term);
		}else{
			$inside.outerWidth(parseInt(org_inside_width));
		}
	};

	return {
		'init' : function(c){
			init(c)
		}
	}
};

var SECTION_PARTICLE_ANIMATION = function(){
	var code;
	var $section;
	var $section_class;
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var particle;
	var camera;
	var scene;
	var renderer;
	var mouseX = 0;
	var mouseY = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var particles = [];
	var particleImage = new Image();
	var animation_interval = {};
	var animation_timeout = {};
	particleImage.src = '/common/img/ParticleSmoke.png';


	var init = function(c, vc){

		$section = $('#'+c);
		$section_class = $('#'+c+'_snowfall');

		if($section_class.length == 0)
			return;

		setTimeout(function(){
			run();
		},1000);

		$(window).on('resize',function(){
			clearAnimation();
			clearTimeout(animation_timeout);
			animation_timeout = setTimeout(function(){
				run();
			},1000);
		})
	};


	function clearAnimation(){ //@TODO 브라우저 모바일 사이즈에서 pc 사이즈로 변경시 domElement 찾을수 없다는 에러로 조건 부여함.
		clearInterval(animation_interval);
		if(typeof renderer !== 'undefined' && typeof renderer.domElement !== 'undefined')
			$(renderer.domElement).remove();

	}

	function run(){
		SCREEN_WIDTH = $section.innerWidth();
		SCREEN_HEIGHT = $section.innerHeight();


		camera = new THREE_IMWEB.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
		camera.position.z = 1000;
		scene = new THREE_IMWEB.Scene();
		scene.add(camera);

		renderer = new THREE_IMWEB.CanvasRenderer();
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		var material = new THREE_IMWEB.ParticleBasicMaterial({map: new THREE_IMWEB.Texture(particleImage)});


		for (var i = 0; i < 150; i++) {
			particle = new Particle3D(material);
			particle.position.x = Math.random() * 2000 - 1000;
			particle.position.y = Math.random() * 2000 - 1000;
			particle.position.z = Math.random() * 2000 - 1000;

			if(SCREEN_HEIGHT < 1000)
				particle.scale.x = particle.scale.y = 1.5;
			else
				particle.scale.x = particle.scale.y = 1;

			scene.add(particle);

			particles.push(particle);
		}
		$section_class.append(renderer.domElement);

		clearInterval(animation_interval);
		animation_interval = setInterval(loop, 30);
	}

	function loop() {
		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			particle.updatePhysics();

			with (particle.position) {
				if (y < -1000) y += 2000;
				if (x > 1000) x -= 2000;
				else if (x < -1000) x += 2000;
				if (z > 1000) z -= 2000;
				else if (z < -1000) z += 2000;
			}
		}

		//	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		//camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
		//	camera.lookAt(scene.position);

		renderer.render(scene, camera);
	}

	return {
		'init' : function(c, vc){
			init(c, vc)
		}
	}
};

var SECTION_FIXED = function(){
	var $body = $('body');
	var $section;
	var $section_next;
	var $aside;
	var $aside_inside;
	var limit = 0;
	var margin_top = 0;
	var fixed_class = 'new_fixed_menu_on'; // 고정메뉴 사용시
	var fixed_diable_class = 'new_fixed_header_disable'; // 스크롤 고정(scrollTofixed) 사용시
	var fixed_section_disable_class = 'section_fixed_disable'; // 섹션 고정시 추가되는 class && 섹션 가장 상단에 존재할 때 해당 부분 background 위해 추가
	var shop_view_class = 'shop_view';
	var booking_view_class = 'booking_view';
	var fixed_header_active_height = 0;
	var $fixed_header_active;
	var $fixed_header_disable;
	var options = {};
	var $container = '';
	var is_section_fixed = false;
	var is_section_side_fixed = false;
	var is_mobile_section_fixed = false;
	var is_one_page = false;
	var next_id;
	var prev_id;
	var ScrollToFixedZIndex = 0;
	var window_width = $(window).width();
	var window_height = $(window).height();

	var init = function(c, _d){
		$section = $('#'+c);
		$section_next = $section.next('._fixed_section');
		$aside = $section.find('div[doz_type="aside"]');
		$aside_inside = $aside.find('div[doz_type="inside"]');
		$container = $section;
		$fixed_header_active = $('#doz_header_wrap').find('._new_fixed_header');
		fixed_header_active_height = $fixed_header_active.length > 0 ? $fixed_header_active.height() : 0;
		$fixed_header_disable = $('#inline_header_normal').find('._fixed_header_section');
		options = $.extend(options, _d);
		is_section_fixed = options.section_fixed == 'Y' && options.side == 'basic';
		is_section_side_fixed = options.section_side_fixed == 'Y' && options.side != 'basic';
		is_mobile_section_fixed = options.mobile_section_fixed == 'Y';
		is_one_page = $body.hasClass('one-page-on');
		next_id = $section.nextAll('._fixed_section').attr('id');
		prev_id = $section.prevAll('._fixed_section').attr('id');

		runFixed();
	};

	var runFixed = function(){
		$(function(){
			var resize_flag = window_width < 992 ? "mobile" : "pc";

			var setFixedTime = {};

			var sectionResizeFlag = false;
			if(typeof ResizeObserver === 'function' && is_section_side_fixed){
				// 사이드 섹션 고정의 경우 섹션 내에 아코디언 게시판 등이 포함되어 섹션 높이 자체가 변할 경우 고정되어야 하는 범위도 변하므로 ResizeObserver로 체크
				// IE는 ResizeObserver를 지원하지 않음
				var sectionResizeObserver = new ResizeObserver(function(entries){

					window_height = $(window).height();
					var container_height = $container.height();

					clearTimeout(setFixedTime);
					setFixedTime = setTimeout(function(){
						if(!sectionResizeFlag){
							sectionResizeFlag = true;
							window_width = $(window).width();
							window_height = $(window).height();
							resize_flag = window_width < 992 ? "mobile" : "pc";
							setFixed(resize_flag, function(){
								sectionResizeFlag = false;
							});
						}
					}, 500);
				});
				sectionResizeObserver.observe($section[0]);
			}else{
				$(window).on('resize',function(){
					window_width = $(this).width();
					window_height = $(this).height();
					resize_flag = window_width < 992 ? "mobile" : "pc";
					setFixed(resize_flag);
				});
			}
		});

		setTimeout(function(){
			setFixed($(window).outerWidth() < 992 ? "mobile" : "pc");
		},500);

	};

	function setFixed(type, callback){
		if ( type != 'mobile' ) {
			$fixed_header_disable = $('#inline_header_normal').find('._fixed_header_section');
			if( $section.hasClass('mobile_section') ) return;
		} else {
			$fixed_header_disable = $('#inline_header_mobile').find('._fixed_header_section');
			if ( !$section.hasClass('side_basic') || $section.hasClass('mobile_hide') ) return;
		}

		getMarginTop();


		if ( $body.hasClass(fixed_class) ) {
			if ( type != 'mobile' ) {
				margin_top = fixed_header_active_height;
			} else {
				getMarginTop();
			}
		}

		if ( is_section_fixed || is_mobile_section_fixed ) {
			next_id = getNextId($section, type);
			if ( next_id !== false ) {
				limit = $('#'+next_id).offset().top - $container.outerHeight();
			} else {
				limit = 0;
			}
		}

		if ( is_section_side_fixed && type != 'mobile') {
			$container = $aside;
			prev_id = $section.prevAll('._fixed_section.pc_section').attr('id');
			limit = $section.offset().top + $section.outerHeight() - $aside_inside.outerHeight();

			if ( typeof prev_id !== 'undefined' && $section.prevAll('._fixed_section').length >= 1 ) {
				if ( $body.hasClass('new_header_overlay') && $body.find('._section_first').hasClass('_fixed_section') ) {
					margin_top =  $('#' + prev_id).outerHeight();
				} else {
					margin_top = margin_top + $('#' + prev_id).outerHeight();
				}
			}

			$(window).resize(function(){
				$aside.css('left', 'auto');
			});
		}

		var zoom = 1;
		if(window_width <= 1024 && window_width >= 767){
			zoom = 0.85;
		}

		if ($container.hasClass('doz_aside')) {
			$container.find('.inside').css({
				position : 'sticky',
				top : margin_top,
				left : 0,
				zIndex : 100,
			})
		} else {
			$container.trigger('detach.ScrollToFixed');
			$container.scrollToFixed({
				'marginTop': margin_top,
				'limit': limit * zoom,
				'zoom': zoom,		/* 태블릿 구간 zoom 커스텀에 대응하기 위한 커스텀 속성, body zoom 배율을 넘겨주면 위치 계산 시 반영 */
				'preFixed': function() {
					$(this).removeClass('scroll-to-fixed-fixed-end');
				},
				'preAbsolute': function() {
					ScrollToFixedZIndex++;
					$(this).addClass('scroll-to-fixed-fixed-end');
					$(this).css({
						'z-index' : ScrollToFixedZIndex,
					});
				}
			});

			$container.trigger('resize.ScrollToFixed');
			$container.trigger('scroll.ScrollToFixed');
		}

		if ( $body.hasClass('new_header_overlay') ) {
			$body.addClass(fixed_section_disable_class); // 겹치기가 아니라면 해당 클래스 추가
			if (window.pageYOffset > 0) { // 스크롤이 되어있을 때
				$body.removeClass(fixed_section_disable_class);
			}
		}

		$(window).scroll(function(e) {
			if ($body.hasClass('new_header_overlay')) {
				if (window.pageYOffset <= 0 && !$body.hasClass(fixed_section_disable_class)) {
					$body.addClass(fixed_section_disable_class);
				}
			if (window.pageYOffset > 0 && $body.hasClass(fixed_section_disable_class)) {
				$body.removeClass(fixed_section_disable_class);
			}
		}
		});

		if(typeof callback === 'function'){
			return callback();
		}

	}

	var getMarginTop = function(){
		margin_top = 0;
		if ( $body.hasClass(shop_view_class) || $body.hasClass(booking_view_class) ) {
			margin_top = 0;
		} else {
			for ( var i = 0; i < $fixed_header_disable.length; i++ ) {
				var target = $fixed_header_disable[i].getBoundingClientRect();
				margin_top += target.height;
			}
		}
	};

	var getNextId = function($section, type){
		if ( is_one_page ) {
			if ( type == 'mobile' ) {
				next_id = $section.nextAll('._fixed_section:not(.mobile_hide)').attr('id');
			} else {
				next_id = $section.nextAll('._fixed_section.pc_section').attr('id');
			}
			if ( typeof next_id === 'undefined' ) {
				var $next_p_section = $section.parent('._one_page_section').nextAll('._one_page_section');
				if ( $next_p_section.length > 0 ) {
					$next_p_section.each(function(){
						if ( type == 'mobile' ){
							var $next_f_section = $(this).find('._fixed_section');
						} else {
							var $next_f_section = $(this).find('._fixed_section.pc_section');
						}
						var next_f_section_id = $next_f_section.attr('id');
						if ( typeof next_f_section_id !== 'undefined' ) {
							next_id = next_f_section_id;
						}
					});
				}
			}
		} else {
			if ( type == 'mobile' ) {
				next_id = $section.nextAll('._fixed_section:not(.mobile_hide)').attr('id');
			} else {
				next_id = $section.nextAll('._fixed_section.pc_section').attr('id');
			}
			if ( $body.hasClass(shop_view_class) || $body.hasClass(booking_view_class) ) {
				var find_detail_wrap = $section.nextAll('.section_wrap');
				find_detail_wrap.each(function(){
					if ( type == 'mobile' ){
						var $fixed_tab = $(this).find('#fixed_tab_mobile');
					} else {
						var $fixed_tab = $(this).find('#fixed_tab');
					}
					var fixed_tab_id = $fixed_tab.attr('id');
					if ( typeof fixed_tab_id !== 'undefined' ) {
						next_id = fixed_tab_id;
					}
				});
			}
		}
		if( typeof next_id === 'undefined' )
			return false;

		return next_id;
	};

	return {
		'init' : function(c, d){
			init(c, d)
		}
	}
};