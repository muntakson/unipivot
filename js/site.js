var SITE = function(){
	var openPolicy = function(is_sub){
		is_sub = (is_sub == true);
		if(!is_sub){
			$.cocoaDialog.close();
		}
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/policy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_policy', custom_popup: $html});
			}
		});
	};
	var openPrivacy = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/privacy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_privacy', custom_popup: $html});
			}
		});
	};
	var openDomestic = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy_domestic.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_domestic', custom_popup: $html});
			}
		});
	};
	var openOverseas = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy_overseas.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_overseas', custom_popup: $html});
			}
		});
	};
	var openDomesticOverseas = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_domesticoverseas', custom_popup: $html});
			}
		});
	};

	var openThirdParty = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/third_party.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_thirdparty', custom_popup: $html});
			}
		});
	};

	var openOauthDataInterlock = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/oauth_data_interlock.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_thirdparty', custom_popup: $html});
			}
		});
	};

	/**
	 * 모달 메뉴를 띄움
	 * @param menu_code			모달 메뉴의 menu_code
	 * @param base_menu_code	모달 밖에 깔리는 메뉴(모달을 호출한 메뉴)의 menu_code, 모달 내부에서 back_url 처리 등을 위해 사용
	 */
	var openModalMenu = function(menu_code, base_menu_code){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {
				'menu_code': menu_code,
				'base_menu_code': base_menu_code
			},
			url: ('/ajax/get_modal_menu.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if ( res.msg === 'SUCCESS' ) {
					// 웹접근성을 위해 모달 열기 전에 마지막 포커스를 저장하고 모달 닫힐 때 해당 포커스로 복귀
					let lastFocus = document.activeElement;

					$.cocoaDialog.open({
						type: 'site_modal_menu',
						custom_popup: res.html,
						opened: function(){
							$('.modal_site_modal_menu').attr('tabindex', 0).attr('role', 'dialog');
							$('.modal_site_modal_menu').lightGallery({
									selector: '._image_widget_lightbox',
									thumbnail: false,
									animateThumb: false,
									swipeThreshold : 20,
									showThumbByDefault: false,
									mode: 'lg-fade',
									speed: 200,
									galleryId: 'img_lg',
							});
						},
						hide_event: async function(e){
							const target = $(e.target);
							if (target.data('lightGallery')) await target.data('lightGallery').destroy(true);
							target.removeData('bs.modal').find('.modal-content').html('');
							$('.modal_site_modal_menu').attr('tabindex', -1).attr('role', '');
							// 이전 포커스 복귀 및 포커스 초기화
							if (lastFocus) lastFocus.focus();
							lastFocus = null;
						}
					});
				} else {
					alert(res.msg);
				}
			}
		});
	};

	var changeAlarmCheckbox = function(obj, is_mobile){
		if(is_mobile == 'Y'){
			$('#alarm_popup').find("input:checkbox").prop("checked", false);
			var $alarm_popup = $('#alarm_popup_mobile');
		}else{
			$('#alarm_popup_mobile').find("input:checkbox").prop("checked", false);
			var $alarm_popup = $('#alarm_popup');
		}

		if($(obj).hasClass("_all")){
			$alarm_popup.find("input:checkbox").prop("checked", obj.checked);
			toggleAlarmActive(is_mobile);
		}else{
			var count_total = $alarm_popup.find("._alarm_list li").length;
			var count_check = $alarm_popup.find("input:checkbox:checked").length;
			if($alarm_popup.find("._all").prop("checked")){
				count_check = count_check - 1;
			}
			if(count_total == count_check && (count_check != 0 && count_total != 0)){
				$alarm_popup.find("._all").prop("checked", true);
			}else{
				$alarm_popup.find("._all").prop("checked", false);
			}
			toggleAlarmActive(is_mobile);
		}
	};

	var toggleAlarmPopup = function(is_mobile){
		if(is_mobile == 'Y'){
			var $alarm_popup = $('#alarm_popup_mobile');
			var $dLabel = $('#dLabel_mobile');
			var $id = 'alarm_popup_mobile';
			var $clos_id = 'alarm_popup';
			var $layer = '_alarm_layer_mobile';
		}else{
			var $alarm_popup = $('#alarm_popup');
			var $dLabel = $('#dLabel');
			var $id = 'alarm_popup';
			var $clos_id = 'alarm_popup_mobile';
			var $layer = '_alarm_layer';
		}
		$alarm_popup.toggleClass('open');
		if($alarm_popup.hasClass('open')){
			$(window).off('mousedown.'+$clos_id);
			$(window).on('mousedown.'+$id,function(event){
				if($(event.target).closest('.'+$layer).length == 0){
					$alarm_popup.removeClass('open');
					$(window).off('mousedown.'+$id);
				}
			});
		}
	};

	var toggleAlarmActive = function(is_mobile){
		if(is_mobile == 'Y'){
			var $alarm_popup = $('#alarm_popup_mobile');
			var $dLabel = $('#dLabel_mobile');
		}else{
			var $alarm_popup = $('#alarm_popup');
			var $dLabel = $('#dLabel');
		}
		var count_check = $alarm_popup.find("li input:checkbox:checked").length;
		if(count_check == 0){
			$dLabel.removeClass('active');
		}else{
			$dLabel.addClass('active');
		}
	};
	var androidUpdateAlert = function (package) {
		$.ajax({
			type : 'POST',
			data: {'package':package},
			url : ('dialog/android_update_form.cm'),
			dataType : 'html',
			async : false,
			cache : false,
			success : function(html){
				$.cocoaDialog.open({type : 'site_alert', custom_popup : $(html)});
			}
		});
	};

	var firstScrollFixed = function(id){
		var stop_fixed = {};
		clearInterval(stop_fixed);
		var setCss = function(id){
			var top = $(window).scrollTop();
			clearInterval(stop_fixed);
			if(top > 0){
				$('#'+id).toggleClass('first_scroll_fixed',false);
				$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed2').toggleClass('scroll-to-fixed-fixed',true).toggleClass('scroll-to-fixed-fixed2',false);
				$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed2').toggleClass('scroll-to-fixed-fixed',true).toggleClass('scroll-to-fixed-fixed2',false);
			}else{
				$('#'+id).toggleClass('first_scroll_fixed',true);
				stop_fixed = setInterval(function(){
					var $fixed = $('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed');
					var $fixed2 = $('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed');
					if($fixed.length > 0 || $fixed2.length >0){
						clearInterval(stop_fixed);
						$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed', false).toggleClass('scroll-to-fixed-fixed2', true);
						$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed', false).toggleClass('scroll-to-fixed-fixed2', true);
					}
				},200);
				$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed',false).toggleClass('scroll-to-fixed-fixed2',true);
				$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed',false).toggleClass('scroll-to-fixed-fixed2',true);
			}
		};
		$(window).bind('scroll.firstScrollFixed',function(){
			setCss(id);
		});

		$(window).bind('resize.firstScrollFixed',function(){
			setCss(id);
		});

		setCss(id);
	};

	/**
	 *
	 * @returns {boolean}
	 */

	var setBookMark = function(){
		var bookmarkURL = window.location.href;
		var bookmarkTitle = document.title;
		var triggerDefault = false;

		if (window.sidebar && window.sidebar.addPanel) {
			// Firefox version < 23
			window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
		} else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) || (window.opera && window.print)) {
			// Firefox version >= 23 and Opera Hotlist
			var $this = $(this);
			$this.attr('href', bookmarkURL);
			$this.attr('title', bookmarkTitle);
			$this.attr('rel', 'sidebar');
			$this.off(e);
			triggerDefault = true;
		} else if (window.external && ('AddFavorite' in window.external)) {
			// IE Favorite
			window.external.AddFavorite(bookmarkURL, bookmarkTitle);
		} else {
			// WebKit - Safari/Chrome
			alert(LOCALIZE.설명_즐겨찾기등록키안내( (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D') );
		}

		return triggerDefault;
	};

	var setSnsShare = function(_type){
    SNS.init(MENU_SNS_INIT_DATA);
		switch(_type){
			case 'kakaotalk':
				SNS.shareKakaoTalk();
				break;
			case 'line':
				SNS.shareLine();
				break;
			case 'band':
				SNS.shareBand();
				break;
			case 'naver':
				SNS.shareNaver();
				break;
			case 'facebook':
				SNS.shareFacebook();
				break;
			case 'twitter':
				SNS.shareTwitter();
				break;
			case 'default':
			default:
				SNS.showDefalutSnsShareList();
				break;
		}
	};

	/**
	 * 대상 없이 단일 라이트갤러리를 띄움
	 * @param d		{type: gallery 또는 video, img_url: gallery일 때 url, video_url: video일 때 url, loop: video일 때 반복재생 여부 Y 또는 N, hide_title: video일 때 타이틀 숨김 여부 Y 또는 N}
	 */

	var showLightGallery = function(d){
		var _data = d;
		var _type = _data.type;
		var modalZ = 17000;
		if($('#cocoaModal').length == 1) modalZ = $('#cocoaModal').css('z-index');		// 모달의 z-index보다 상위로 설정

		if(_type == 'gallery'){
			var img_url = _data.img_url;
			var $_body = $("body");
			if($("#lg-temp-gallery").length > 0){		// 이전에 사용된 라이트갤러리 제거
				$("#lg-temp-gallery").remove();
			}
			var $_html = '<div id="lg-temp-gallery">' +
				'<a href="' + img_url + '"></a>' +
				'</div>' +
				'<style>.lg-backdrop {z-index: ' + (modalZ + 1) + '} .lg-outer {z-index: ' + (modalZ + 2) + '}</style>';
			$_body.append($_html);

			$("#lg-temp-gallery").lightGallery();

			$("#lg-temp-gallery a").trigger('click');

		}else if(_type == 'video'){
			var video_url = _data.video_url;		// 바른 주소가 아닐 경우 예외처리 필요
			var loop = _data.loop;
			var hide_title = _data.hide_title;

			var youtube_id = '';
			var video_id = getVideoId(video_url);
			if(typeof video_id != 'undefined'){
				if (typeof video_id['youtube'] != 'undefined' && video_id['youtube'][1] != ''){
					youtube_id = video_id['youtube'][1];
				}
			}

			var $_body = $("body");
			if($("#lg-temp-gallery").length > 0){
				$("#lg-temp-gallery").remove();
			}
			var $_html = '<div id="lg-temp-gallery">' +
				'<a href="' + video_url + '"></a>' +
				'</div>' +
				'<style>.lg-backdrop {z-index: 17001} .lg-outer {z-index: 17002}</style>';
			$_body.append($_html);

			// vimeo의 경우 자동재생 시에는 타이틀 노출이 되지 않으므로 자동재생이 되지 않는 모바일에서 타이틀 확인 가능
      // YouTube는 playlist 인자를 넘길 경우 매일 1회 동영상을 제대로 못부르는 경우가 발생함
      var lg_option = {
        youtubePlayerParams: {
          rel : 0,
          showinfo: hide_title=='Y'?0:''
        },
        vimeoPlayerParams : {
          autoplay : 1,
          rel : 0,
          title: hide_title=='Y'?0:1
        },
        controls: 0,
        zoom: false,
        fullScreen: false,
        download: false,
        counter: false,
        hash: false,
        videoMaxWidth:1140
      };
      if(loop === 'Y'){
        lg_option.youtubePlayerParams = Object.assign(lg_option.youtubePlayerParams, {loop: 1, playlist: youtube_id});
        lg_option.vimeoPlayerParams = Object.assign(lg_option.vimeoPlayerParams, {loop: 1});
      }
      
			$("#lg-temp-gallery").lightGallery(lg_option);
      
			$("#lg-temp-gallery a").trigger('click');

		}
	};

	var hidePermissionMenu = function(){
		if($('.pms_check').length > 0){
			$.ajax({
				type: 'POST',
				data: {unit_code : UNIT_CODE},
				url: ('/ajax/get_permission_limit_menu_list.cm'),
				dataType: 'json',
				async: true,
				cache: false,
				success: function(res){
					if(res.msg === 'SUCCESS'){
						var limit_menu_list = res.limit_menu_list;
						$.each(limit_menu_list, function(key, value){
							$('.pms_check[data-code=' + value + ']').remove();
						});
						$('.pms_check').removeClass('pms_check');
						rebuildMobileTableMenu();
						rebuildSlideMenu();
					}else{
						$('.pms_check').remove();
					}
				},
				error: function(){
					$('.pms_check').remove();
				}
			});
		}
	};

	var rebuildMobileTableMenu = function(){
		var $mobile_table_nav_wrap = $('._mobile_table_nav_wrap');
		if($mobile_table_nav_wrap.length > 0){
			var table_line_count = $mobile_table_nav_wrap.data('table_line_count');
			var nav_item_cnt = 0;
			var rebuild_table_html = '';
			$mobile_table_nav_wrap.find('td[data-rel=table_nav]').each(function(key, value){
				if(nav_item_cnt == 0){
					rebuild_table_html += "<tr>";
				}
				rebuild_table_html += value.outerHTML;
				nav_item_cnt++;
				if(nav_item_cnt % table_line_count == 0){
					rebuild_table_html += "</tr>";
				}
			});
			var table_row_cnt, max_item_cnt, empty_cnt;
			if(nav_item_cnt > 0){
				table_row_cnt = Math.ceil(nav_item_cnt / table_line_count);
				max_item_cnt = table_row_cnt * table_line_count;
				empty_cnt = max_item_cnt - nav_item_cnt;
			}
			for(var i = 0; i < empty_cnt; i++){
				rebuild_table_html += '<td class="nav-item empty_item "></td>';
				if(i == empty_cnt - 1){
					rebuild_table_html += '</tr>';
				}
			}
			$mobile_table_nav_wrap.html(rebuild_table_html);
		}
	};

	var rebuildSlideMenu = function(){
		MOBILE_SLIDE_MENU.rebuildAccordion();
		PC_SLIDE_MENU.rebuildAccordion();
	};

	var setViewportBtn = function(color, background_color){
		var $last_section = $('body');
		var viewport_mode = getCookie('viewport_mode');
		if($('#doz_footer').length > 0){
			$last_section = $('#doz_footer .footer-section .inside');
		}else{
			if(viewport_mode === 'PC'){
				var $pc_section = $('div[doz_type=section][doz_mobile_section=N]');
				if($pc_section.length > 0){
					var $pc_section_last = $($pc_section[$pc_section.length - 1]);
					if($pc_section_last.hasClass('visual_section')){
						$last_section = $pc_section_last;
					}else{
						var $pc_section_last_inside = $pc_section_last.find('div[doz_type=inside], div[doz_type=row]');
						$last_section = $($pc_section_last_inside[$pc_section_last_inside.length - 1]);
					}
				}
			}else{
				var $mobile_show_section = $('div[doz_type=section][doz_mobile_hide=N]');
				if($mobile_show_section.length > 0){
					var $mobile_show_section_last = $($mobile_show_section[$mobile_show_section.length - 1]);
					if($mobile_show_section_last.hasClass('visual_section')){
						$last_section = $mobile_show_section_last;
					}else{
						var $mobile_show_section_last_inside = $mobile_show_section_last.find('div[doz_type=inside], div[doz_type=row]');
						$last_section = $($mobile_show_section_last_inside[$mobile_show_section_last_inside.length - 1]);
					}
				}
			}
		}
		if(viewport_mode === 'PC'){
			var pc_mode_str = getLocalizeString('타이틀_모바일모드로보기', '', '모바일 모드로 보기');
		}else{
			var pc_mode_str = getLocalizeString('타이틀_PC모드로보기', '', 'PC 모드로 보기');
		}
		var border_color = tinycolor(color).setAlpha(tinycolor(color).getAlpha() * 0.2).toRgbString();
		$last_section.append('<div class="pc_mode_btn_wrap"><btn class="btn btn-default pc_mode_btn _pc_mode_btn" onclick="SITE.toggleViewport();" style="color: ' + color + '; background-color: ' + background_color + '; border: 1px solid ' + border_color + '">' + pc_mode_str + '</btn></div>');
	};

	var toggleViewport = function(){
		var viewport_mode = getCookie('viewport_mode');
		if(viewport_mode === 'PC'){
			setCookie('viewport_mode', 'm');
		}else{
			setCookie('viewport_mode', 'PC');
		}
		location.href = location.search;
	};

	var alarm_html_data = {"group_html":"","app_html":""};
	var is_loaded = false;
	/***
	 * 알림 발송 타겟 리스트 불러오기
	 */
	var loadAlarmTargetList = function(board_code){
		if(alarm_html_data.group_html === ""){
			if(!is_loaded){
				var $alarm_popup = $('#alarm_popup');
				var $alarm_popup_mobile = $('#alarm_popup_mobile');
				$.ajax({
					type: 'POST',
					data: {'board_code' : board_code},
					url: ('/ajax/get_alarm_target_list.cm'),
					dataType: 'json',
					async: true,
					cache: false,
					success: function(res){
						is_loaded = true;
						if(res.msg === 'SUCCESS'){
							alarm_html_data.group_html= res.group_html;
							alarm_html_data.app_html= res.app_html;

							$alarm_popup.find(".dLabel").html('').append(alarm_html_data.group_html);
							$alarm_popup.find("._alarm_layer").append(alarm_html_data.app_html);
							$alarm_popup_mobile.find(".dLabel").html('').append(alarm_html_data.group_html);
							$alarm_popup_mobile.find("._alarm_layer_mobile").append(alarm_html_data.app_html);


							$alarm_popup.find("._all_check").off("click._all_check").on("click._all_check",function(){
								SITE.changeAlarmCheckbox(this,'N');
							});
							$alarm_popup_mobile.find("._all_check").off("click._all_check_m").on("click._all_check_m",function(){
								SITE.changeAlarmCheckbox(this,'Y');
							});

							$alarm_popup.find("._alarm_group_list").off("click._alarm_group_list").on("click._alarm_group_list",function(){
								SITE.changeAlarmCheckbox(this,'N');
							});
							$alarm_popup_mobile.find("._alarm_group_list").off("click._alarm_group_list_m").on("click._alarm_group_list_m",function(){
								SITE.changeAlarmCheckbox(this,'Y');
							});
						}
					},
					error: function(){
						is_loaded = true;
					}
				});
			}
		}
	};

	const createTermsMode = function() {
		const termsModeFnMap = {
			policy: openPolicy,
			privacy: openPrivacy,
			domesticoverseas: openDomesticOverseas,
			third_party: openThirdParty,
		};

		const allowTermsMode = Object.keys(termsModeFnMap);
		const allowTermsModeType = ['modal', 'link'];
		const defaultTermsModeType = 'link';

		const getTemsModeType = (termsModeType) => {
			const isAllowed = allowTermsModeType.includes(termsModeType);

			return isAllowed ? termsModeType : defaultTermsModeType;
		}

		function init() {
			const $target = $('[data-terms-mode]').filter(function() {
				return allowTermsMode.includes($(this).data('terms-mode'));
			});

			$target.off('click.terms').on('click.terms', function(e) {
				e.preventDefault();

				const termsMode = $(this).data('terms-mode');
				const termsModeType = getTemsModeType($(this).data('terms-mode-type'));

				if (termsModeType === 'modal') {
					termsModeFnMap[termsMode]();
				}

				if (termsModeType === 'link') {
					window.location.href = `?mode=${termsMode}`;
				}
			});
		}

		return { init };
	}

	const termsMode = createTermsMode();

	return {
		'openPolicy' : function(is_sub){
			openPolicy(is_sub);
		},
		'openPrivacy' : function(){
			openPrivacy();
		},
		'openDomestic' : function(){
			openDomestic();
		},
		'openOverseas' : function(){
			openOverseas();
		},
		'openDomesticOverseas' : function(){
			openDomesticOverseas();
		},
		'openThirdParty' : function(){
			openThirdParty()
		},
		'openOauthDataInterlock' : function(){
			openOauthDataInterlock();
		},
		'openModalMenu' : function(menu_code, base_menu_code){
			openModalMenu(menu_code, base_menu_code);
		},
		'changeAlarmCheckbox' : function(obj, is_mobile){
			changeAlarmCheckbox(obj,is_mobile);
		},
		'toggleAlarmPopup' : function(is_mobile){
			toggleAlarmPopup(is_mobile);
		},
		'androidUpdateAlert' : function (package) {
			androidUpdateAlert(package);
		},
		'firstScrollFixed' : function(id){
			firstScrollFixed(id);
		},
		'setBookMark' : function(){
			setBookMark();
		},
		'setSnsShare' : function(d, type){
			setSnsShare(d, type);
		},
		'showLightGallery' : function(d){
			showLightGallery(d);
		},
		'hidePermissionMenu' : function(){
			hidePermissionMenu();
		},
		'rebuildMobileTableMenu' : function(){
			rebuildMobileTableMenu();
		},
		'rebuildSlideMenu' : function(){
			rebuildSlideMenu();
		},
		'setViewportBtn' : function(color, background_color){
			setViewportBtn(color, background_color);
		},
		'toggleViewport' : function(){
			toggleViewport();
		},
		'loadAlarmTargetList' : function(board_code){
			loadAlarmTargetList(board_code);
		},
		'initTermsModeElements': function() {
			termsMode.init();
		}
	}

}();

var SITE_TWO_FACTOR_LOGIN = function(){
	var limit_time;
	var interval_time_event;
	var $cert_request_btn;
	var $cert_input_wrap;
	var receiver;
	var $limit_time_wrap;
	var $cert_code;
	var $two_factor_cert_save_btn;
	var member_code;
	var openAdminTwoFactor = function(back_url,is_social){
		$.cocoaDialog.close();
		$.ajax({
			type : 'POST',
			data : {},
			url : ('/dialog/admin_two_factor_login.cm'),
			dataType : 'json',
			async : true,
			cache : false,
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);

					clearInterval(interval_time_event);
					$html.on('hidden.bs.modal', function(){
						clearInterval(interval_time_event);
					});
					var type = $html.find("input[name='type']").val();
					receiver = $html.find("input[name='receiver']").val();
					$cert_request_btn = $html.find('._cert_request_btn');
					limit_time = $html.find("input[name='limit_time']").val();
					$html.find("._lime_time_obj").html(limit_time);
					$cert_input_wrap = $html.find("._cert_input_wrap");
					$limit_time_wrap = $html.find("._limit_time_wrap");
					$cert_code = $html.find("input[name='cert_code']");
					$two_factor_cert_save_btn = $html.find("._two_factor_cert_save_btn");
					member_code = $html.find("input[name='member_code']").val();

					$cert_request_btn.off("click.cert_request_btn").on("click.cert_request_btn", function(){
						if($cert_request_btn.hasClass("disabled")) return false;
						$.ajax({
							type : 'POST',
							data : {
								'type' : type,
								'receiver' : receiver,
								'member_code' : member_code
							},
							url : ('/backpg/request_two_factor_certification.cm'),
							dataType : 'json',
							async : true,
							cache : false,
							success : function(res){
								if(res.msg !== 'SUCCESS'){
									alert(res.msg);
								}else{
									$cert_input_wrap.show();
									$cert_request_btn.addClass("disabled");
									setTimeout(function(){
										$cert_request_btn.removeClass("disabled");
									},5000);

									clearInterval(interval_time_event);
									//모달 닫을때 이벤트 제거
									$html.on('hidden.bs.modal', function () {
										clearInterval(interval_time_event);
									});

									$limit_time_wrap.show();
									$html.find("._lime_time_obj").html(limit_time);
									interval_time_event = setInterval(function(){
										var _limit_time = $html.find("._lime_time_obj").html();
										$html.find("._lime_time_obj").html(_limit_time-1);
										if((_limit_time-1) <= 0) clearInterval(interval_time_event);
									},1000);
								}
							}
						});
					});

					$two_factor_cert_save_btn.off("click.cert_save_btn").on("click.cert_save_btn",function(){
						var cert_code = $cert_code.val();
						if(cert_code === ""){
							alert(LOCALIZE.설명_인증번호를입력해주세요());
							$cert_code.focus();
							return false;
						}
						$.ajax({
							type: 'POST',
							data:{
								'type' : type,
								'receiver' : receiver,
								'cert_code' : cert_code,
								'member_code' : member_code,
								'back_url' : back_url,
								'is_social' : is_social
							},
							url: ('/backpg/update_two_factor_certification.cm'),
							dataType: 'json',
							async: true,
							cache: false,
							success: function (res) {
								if(res.msg === 'SUCCESS'){
									alert(LOCALIZE.설명_인증이완료되었습니다());
									if(back_url != 'Y'){
										if (is_social === 'Y') {
											if (res.site_back_url != '') {
												window.parent.location.href = res.site_back_url;
											} else {
												location.reload();
											}
										} else {
											$html.append(res.form);
											var $admin_form = $html.find('#admin_two_factor_login_form');
											$admin_form.submit();
										}
									}else{
										if(res.site_back_url != '') window.parent.location.href = res.site_back_url;
										else location.reload();
									}
								}else{
									alert(res.msg);
								}
							}
						});
					});
					$.cocoaDialog.open({
						type : 'site_two_factor_login', custom_popup : $html, hide_event : function(e){
							if(confirm(getLocalizeString('설명_2단계인증을진행하지않으면로그인이불가능합니다', '', '2단계 인증을 진행하지 않으면 로그인이 불가능합니다. 인증을 중단할까요?'))){
								$cert_code.val('');
								$cert_input_wrap.hide();
								clearTwoFactorLoginData();
							}else{
								e.preventDefault();	// 다이얼로그 닫기 중단
								return false;
							}
						}
					});
				}else{
					alert(res.msg);
					clearTwoFactorLoginData();
				}
			}
		});
	};

	var clearTwoFactorLoginData = function(){
		$.ajax({
			type : 'POST',
			url : ('/backpg/clear_two_factor_login.cm'),
			dataType : 'json',
			async : true,
			cache : false,
			success : function(res){
				if(res.msg == 'SUCCESS'){
					location.href = '/';
				}else{
					alert(res.msg);
				}
			}
		});
	};

	return {
		'openAdminTwoFactor' : function(back_url,is_social){
			openAdminTwoFactor(back_url,is_social);
		},
		'clearTwoFactorLoginData' : function(){
			clearTwoFactorLoginData();
		}
	}

}();


