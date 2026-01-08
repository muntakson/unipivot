var APP = function(){
	var appDefaultTabType = {
		'APP_TAB_WEB_VIEW_BACK' : 'webViewBack',
		'APP_TAB_ALARM' : 'alarm',
		'APP_TAB_MY' : 'my'
	};

	var init = function(){
		//당겨서 새로고침 사용설정
		setPullToRefresh();
	};

	/***
	 * 탭바 뱃지설정
	 * type은 type+Badge형태 ex alarmBadge
	 * @param type
	 * @param cnt
	 */
	var updateTabBadgeCnt = function(type,cnt){
		if(IS_IOS_APP){
			var data = {
				"method" : "updateTabBadgeCnt",
				"type" : type,
				"cnt" : cnt
			};
			loadMethod(data);
		}
	};

	/***
	 * 탭바 아이콘 변경
	 * type은 type+Icon형태 ex alarmIcon
	 * path는 도메인을 제외한 uri만 입력
	 * @param type
	 * @param icon_path
	 */
	var changeTabIcon = function(type,icon_path){
		var data = {
			"method" : "changeTabIcon",
			"type" : type,
			"icon_path" : icon_path
		};
		loadMethod(data);
	};

	/***
	 * 탭바 활성/비활성화 시키기
	 * type은 type+Icon형태 ex alarmIcon
	 * @param type
	 * @param is_disable
	 */
	var disableTab = function(type,is_disable){
		var data = {
			"method" : "disableTab",
			"type" : type,
			"is_disable" : is_disable
		};
		loadMethod(data);
	};

	/***
	 * Ios앱 메소드 호출하기
	 */
	function loadMethod(data){
		try {
			webkit.messageHandlers.imwebIosCallBack.postMessage(data);
		} catch(err) {

		}
	}

	/***
	 * 앱 당겨서 새로고침 사용유무
	 * @param is_enable
	 */
	var setPullToRefresh = function(is_enable){
		is_enable = isBlank(is_enable) ? "Y" : is_enable;
		if(IS_APP){
			if(IS_ANDROID_APP === "Y"){//android 앱일경우 처리
				window.dozAndroidBridge.setPullToRefresh(is_enable);
			}else{//iOS 앱일경우 처리
				var data = {
					"method" : "setPullToRefresh",
					"is_enable" : is_enable
				};
				loadMethod(data);
			}
		}
	};

	var reFresh = function(){
		location.reload();
	};

	return {
		'init' : function(){
			init();
		},
		appDefaultTabType : appDefaultTabType,
		'updateTabBadgeCnt' : function(type,cnt){
			updateTabBadgeCnt(type,cnt);
		},
		'disableTab' : function(type,is_disable){
			disableTab(type,is_disable);
		},
		'changeTabIcon' : function(type,icon_path){
			changeTabIcon(type,icon_path);
		},
		'setPullToRefresh' : function(isEnable){
			setPullToRefresh(isEnable);
		},
		'reFresh' : function(){
			reFresh();
		}
	};
}();