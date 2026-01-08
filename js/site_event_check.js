/*
	페이지에서 일어나는 이벤트(클릭, 이동, 입력 등등)에 대한 체크를 위한 js (추후 사용자의 이벤트 체크 후 데이터 수집을 위해 분리생성)
 */
var SECURITY_PRIVACY = function(){ //개인정보 보호 설정 관련 이벤트

	var ONE_MINUTE = 60 * 1000; //1분
	var TWO_MINUTES = 2 * 60 * 1000; //2분
	var NEXT_ACTION_TIME_LOCAL_STORAGE_KEY = 'NEXT_ACTION_TIME';

	var event_setting_timer; //마우스, 키보드 이벤트 등록되기까지의 타이머
	var logout_warning_timer; //로그아웃 경고 출력되기까지의 타이머
	var auto_logout_timer; //자동 로그아웃 되기까지 타이머

	var setAutoLogoutEvent = function(auto_logout_time){

		if(IS_IE){
			if(typeof event_setting_timer !== 'undefined'){
				clearTimeout(event_setting_timer);
			}
			if(typeof logout_warning_timer !== 'undefined'){
				clearTimeout(logout_warning_timer);
			}
			if(typeof auto_logout_timer !== 'undefined'){
				clearTimeout(auto_logout_timer);
			}

			window.addEventListener('storage', function(e){
				//IE일 경우 localstorage 동기화 처리를 위해 리스너를 등록 - 등록하면 자동으로 동기화 처리됨
			});
		}else{
			deleteTimeout();
		}

		removeFocusListner(); //창이 2개이상일경우 새로 타임이 셋팅될때 포커스 리스너 제거

		//같은 브라우저의 창이 여러개일 경우 하나라도 사용중이면 미사용중인 브라우저의 timeout이 동작안되도록 비교하기위한 시간 저장
		var next_action_time = new Date();
		next_action_time.setMinutes(next_action_time.getMinutes() + 1);

		LOCAL_STORAGE.setLocalStorage(NEXT_ACTION_TIME_LOCAL_STORAGE_KEY, next_action_time);

		event_setting_timer = setTimeout(function(){
			setActionEvent(auto_logout_time); // 로그아웃타임 = 1
		}, ONE_MINUTE);
	};

	var openChangePasswordNotice = function(month_notice){
		$.cocoaDialog.close();
		$.ajax({
			type : "POST",
			url : ("/ajax/change_password_notice.cm"),
			data : {month_notice : month_notice},
			dataType : "html",
			async : true,
			cache : false,
			success : function(html){

				var $html = $(html);
				var change_password_btn = $html.find("._change_password_btn"); // 변경하기 버튼
				var not_change_password_btn = $html.find("._not_change_password_btn"); //다음에 변경하기 버튼

				change_password_btn.off("click").on("click", function(e){

					changePassword();
					e.preventDefault();
					return false;
				});

				not_change_password_btn.off("click").on("click", function(e){

					notChangePassword();
					e.preventDefault();
					return false;
				});

				$.cocoaDialog.open({type : "admin_change_password", custom_popup : $html, "close_block" : true});
			}
		});
	};

	function resetAutoLogoutEvent(auto_logout_time){
		removeActionEvent();
		deleteTimeout(logout_warning_timer); //로그아웃 경고 타이머 해제
		deleteTimeout(auto_logout_timer); //로그아웃 경고 내에서 설정한 자동로그아웃 타이머 해제

		setAutoLogoutEvent(auto_logout_time);
	}

	//*--------------------------------------------------------------------
	//** 내부사용 함수
	//*--------------------------------------------------------------------

	/**
	 * 마우스, 키보드등 사용자 액션 이벤트 셋팅
	 * @param auto_logout_time
	 */
	function setActionEvent(auto_logout_time){

		var action_time = LOCAL_STORAGE.getLocalStorage(NEXT_ACTION_TIME_LOCAL_STORAGE_KEY); //세팅된 시간으로부터(현재 시간) 1분 뒤

		if(new Date(action_time).getTime() <= new Date().getTime()){ //Time out 후 액션이 발생해야되는 시간이 현재시간보다 작을때만 실행 (액션 발생 시간이 현재 시간보다 크면 다른 탭을 이용중인 경우)
			//자동로그아웃 1분전 로그아웃 경고 셋팅
			logout_warning_timer = setTimeout(function(){
				removeActionEvent();
				showLogoutWarning(auto_logout_time);
			}, (auto_logout_time * ONE_MINUTE) - TWO_MINUTES);

			$(document).off("mousemove keydown").on("mousemove keydown", function(){

				removeActionEvent();
				deleteTimeout(logout_warning_timer); //로그아웃 경고 타이머 해제
				deleteTimeout(auto_logout_timer); //로그아웃 경고 내에서 설정한 자동로그아웃 타이머 해제

				setAutoLogoutEvent(auto_logout_time);
			});
		}else{

			//다른 창에서 다시 돌아올 경우 로그아웃 시간을 다시 셋팅해야함(페이지 이동시에는 자동셋팅하나 창으로 돌아만왓을경우는 셋팅이 필요)
			$(document).off("focus").on("focus", function(){
				setAutoLogoutEvent(auto_logout_time);
			});
		}
	}

	/**
	 * 자동 로그아웃 1분전 경고 출력 이벤트
	 * @param auto_logout_time
	 */
	function showLogoutWarning(auto_logout_time){

		//자동 로그아웃 알림 셋팅
		auto_logout_timer = setTimeout(function(){

			removeActionEvent();
			$.cocoaDialog.hide();
			LOCAL_STORAGE.setLocalStorage("IS_AUTO_LOGOUT", "Y"); //로그아웃 후 자동로그아웃이면 안내 얼럿 띄워주기위해 셋팅
			location.href = "/logout.cm";
		}, ONE_MINUTE);

		showAutoLogoutAlert(auto_logout_time);
	}

	/**
	 * 자동로그아웃 관련 얼럿창
	 * @param auto_logout_time
	 */
	function showAutoLogoutAlert(auto_logout_time){

		$.ajax({
			type : "POST",
			url : ("/ajax/auto_logout_alert.cm"),
			data : {auto_logout_time : auto_logout_time},
			dataType : "html",
			async : false,
			cache : false,
			success : function(html){
				$.cocoaDialog.open({type : "site_alert", custom_popup : html, "close_block" : true});
			}
		});
	}

	/**
	 * 설정된 타임아웃 제거
	 * @param timer_id
	 */
	function deleteTimeout(timer_id){
		if(!timer_id){
			clearTimeout();
		}else{
			clearTimeout(timer_id);
		}
	}

	/**
	 * 마우스, 키보드 등 사용자 액션 이벤트 제거
	 */
	function removeActionEvent(){
		$(document).off("mousemove keydown");
	}

	/**
	 * 포커스 리스닝 이벤트 제거
	 */
	function removeFocusListner(){
		$(document).off("focus");
	}

	/**
	 * 비밀번호 변경 클릭시 동작
	 */
	function changePassword(){

		var data = $("#change_password_notice").serializeObject();

		$.ajax({
			type : "POST",
			url : ("/ajax/change_password.cm"),
			data : data,
			dataType : "json",
			async : false,
			cache : false,
			success : function(res){

				if(res.msg === "SUCCESS"){

					window.location.reload();

				}else{

					var join_form = $("#change_password_notice");
					var object = join_form.find("._" + res.type);

					join_form.find("._item").toggleClass("triangle", false);
					join_form.find("._msg").text("");
					object.toggleClass("triangle", true);
					object.find("input").focus();
					object.find("._msg").text(res.msg);
				}
			}
		});
	}

	/**
	 * 다음에 변경하기 클릭시 동작
	 */
	function notChangePassword(){

		$.ajax({
			type : "POST",
			url : ("/ajax/not_change_password.cm"),
			dataType : "json",
			async : false,
			cache : false,
			success : function(res){

				if(res.msg === "SUCCESS"){
					$.cocoaDialog.close();
				}
			}
		});
	}

	return {
		"setAutoLogoutEvent" : function(auto_logout_time){
			setAutoLogoutEvent(auto_logout_time);
		},
		"openChangePasswordNotice" : function(month_notice){
			openChangePasswordNotice(month_notice);
		},
		"resetAutoLogoutEvent" : function(auto_logout_time){
			resetAutoLogoutEvent(auto_logout_time);
		}
	};
}();