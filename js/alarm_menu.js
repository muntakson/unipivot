var ALARM_MENU = function(){
	var alarm_list_page = 1;
	var alarm_list_page_more = true;
	var $alarm_slide, $alarm_slide_container, $alarm_backdrop;
	var $tab;
	var $more_btn;
	var $scroll_wrap;
	var $list_obj;
	var $setting_obj;
	var $title_obj;
	var status;
	var $body;
	var open_class = 'notification_show';
	var is_close_alarm = false;
	var init = function(){
		$body = $('body');
		$alarm_slide_container = $('#site_alarm_slidemenu_container');
		$alarm_slide = $('#site_alarm_slidemenu');
		$alarm_backdrop = $('#site_alarm_slidemenu_backdrop');
		$alarm_backdrop.on('click',function(){
			is_close_alarm = true;
			showAlarmSlide();
		});
		$tab = $("#site_alarm_tab");
		$more_btn = $("#site_alarm_more_btn");
		$list_obj = $("#site_alarm_list_wrap");
		$setting_obj = $("#site_alarm_setting_wrap");
		$title_obj = $("#site_alarm_title");
		$scroll_wrap = $alarm_slide.find('._scroll_wrap');

	};
	var getHeaderAlarmList =  function () {
		$more_btn.hide();
		if (alarm_list_page_more) {
			if (alarm_list_page == 1) $tab.empty();
			$.ajax({
				type: 'GET',
				url: ('/ajax/alarm/get_header_alarm_list.cm'),
				dataType: 'json',
				data: {page: alarm_list_page},
				async: true,
				cache: false,
				success: function (obj) {
					if(IS_ANDROID_APP === 'Y' &&  APP_VERSION >= 94000){
						window.dozAndroidBridge.updateIconBadge(0,"alarm");
					}
					ALARM_BADGE.updateBadge();
					alarm_list_page = obj.page;
					alarm_list_page_more = obj.more === "Y";
					$tab.append(obj.html);
					if (alarm_list_page_more) $more_btn.show();
				}
			});
		}
	};

	var toggleAlarmSetting = function(force){
		var is_setting = $alarm_slide.data('mode')=='setting';

		if(typeof force != 'undefined') is_setting = force;



		$('._setting_header')[is_setting?'hide':'show']();
		$('._alarm_header')[!is_setting?'hide':'show']();
		$list_obj[!is_setting?'hide':'show']();
		$setting_obj[is_setting?'hide':'show']();
		$alarm_slide.data('mode',is_setting?'list':'setting');
	};

	var changeAlarmSetting = function(obj,member_code,type){
		obj.find('input:checkbox').prop('checked',!obj.find('input:checkbox').prop('checked'));
		var is_checked =  obj.find('input:checkbox').is(':checked')?"Y":"N";

		$.ajax({
			type: 'POST',
			data: {member_code: member_code,type:type,is_checked:is_checked},
			url: ('/ajax/alarm/change_alarm_setting.cm'),
			dataType: 'json',
			async: false,
			cache: false,
			success: function () {

			}
		});
	};
	var showAlarmSlide = function(){

		if(!is_close_alarm){
			getHeaderAlarmList();
		}

		toggleAlarmSetting(true);

		status = $body.data('slide_alarm')=='Y';
		if(status){
			$body.data('slide_alarm','N');
			var is_fullpage = $body.find('.visual_section').attr('doz_fullpage') ==='Y';
			if(is_fullpage)
				$body.css('overflow-y','hidden');
			else
				$body.css('overflow-y','auto');
			$alarm_backdrop.hide();
      $alarm_slide[0].addEventListener("transitionend", function() {
        $alarm_slide[0].style.display = 'none';
        $alarm_slide_container.toggleClass(open_class,!status);
      }, {
        once: true
      });
      /* alarm_menu.css .notification-canvas width 991px 이하에서는 좌측에서 애니메이션 */
      if(window.innerWidth > 991){
        $alarm_slide[0].style.transform = 'translate3d(500px, 0px, 0px)';
      }else{
        $alarm_slide[0].style.transform = 'translate3d(-500px, 0px, 0px)';
      }
			setTimeout(function(){
				$alarm_slide_container.width(0);
			},20);
		} else{
			$body.data('slide_alarm','Y');
			var is_fullpage = $body.find('.visual_section').attr('doz_fullpage') ==='Y';
			if(is_fullpage)
				$body.css('overflow-y','hidden');
			else
				$body.css('overflow-y','auto');
      $alarm_slide[0].style.display = 'block';
			setTimeout(function() {
        $alarm_slide[0].style.transform = 'translate3d(0px, 0px, 0px)';
				$alarm_slide_container.width('100%');
			},10);
			$alarm_backdrop.show();
      if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
        $scroll_wrap.css({
          'overflow': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        });
      }else{
        $scroll_wrap.TrackpadScrollEmulator();
      }
      $alarm_slide_container.toggleClass(open_class,!status);
		}

		//앱 탭바 뱃지카운트 초기화
		APP.updateTabBadgeCnt(APP.appDefaultTabType.APP_TAB_ALARM,0);
		is_close_alarm = false;
	};
	return {
		getHeaderAlarmList : function(){
			getHeaderAlarmList();
		},
		toggleAlarmSetting : function(force){
			toggleAlarmSetting(force);
		},
		changeAlarmSetting : function(obj,member_code,type){
			changeAlarmSetting(obj,member_code,type);
		},
		showAlarmSlide : function(){
			showAlarmSlide();
		},
		init : function(){
			init();
		}
	}
}();