var _jn='';
var _jid='';
var _ag='';
var _gd='';
var m_ag='';
var m_gd='';
var m_jn='';
var m_jid='';
var m_id='';
var _id='';
var SITE_MEMBER = function(){
	var member_profile_id = 'member_profile';
	var $member_profile, $join_form;
	var address_format;

	//중복 클릭으로 인해 두번 액션 되는 것을 방지 하기 위한 flag
	var join_processing = false;

	var authRedirectProcessing = false;

	var terms_agree = false;
	var _third_party, _marketing_sms_agree, _marketing_email_agree;

	var policyConfirm = function(){
	};

	var openFindPassword = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {d: 'd'},
			url: ('/dialog/find_password.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_find_password', custom_popup: $html, hide_event:function(){
						$(window).unbind('keydown');
					}});
			}
		});
	};


	var findToken ='';
	var findSubmit  = function(step){
		var that = this;
		if(step=='find'){
			var status_find_id  	   = !($('._find_id').hasClass('hidden'));		   // 아이디 찾기 상태
			var status_find_password   = !($('._find_password').hasClass('hidden'));   // 비밀번호 찾기 상태

			var email_wrap = $('._find_id_email_wrap');			// 가입한 이메일로 찾기 영역
			var nick_wrap  = $('._find_id_nick_wrap');			// 가입한 휴대폰으로 찾기 영역

			var find_id_first_result_wrap   = $('#find_step2_info_1');
			var find_id_second_result_wrap  = $('#find_step2_info_2');

			var only_email	  	 = $('._find_id_only_input_email').val(); // 가입한 이메일로 찾기만 있을 경우 입력되는 값
			var is_find_id_only_email = false;

			var find_id_send_email_wrap = $('._find_id_send_email_wrap'); // 아이디, 비밀번호 재설정 메일 발송 영역

			var email 	 	  = $('._find_id_input_email').val();		// 아이디 찾기 이메일 입력값
			var nick  	 	  = $('._find_id_input_nick').val();		// 아이디 찾기 이름 입력값
			var	call_num 	  = $('._find_id_input_call_num').val();	// 아이디 찾기 전화번호 입력값

			var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
			if(call_num) call_num = call_num.replace(regex, "");

			var find_pw_email = $('._find_pw_input_email').val(); 		// 비밀번호 찾기 이메일 입력값

			var is_auth_input = false;
			var is_auth_dream_seucrity = $('._auth_dream_security_input').length;
			var is_auth_mobilians 	   = $('._auth_mobilians_input').length;
			var is_auth_inicis 		   = $('._auth_inicis_input').length;
			if(is_auth_dream_seucrity > 0 || is_auth_mobilians > 0 || is_auth_inicis > 0){ // 본인인증 수단 한개라도 사용하고 있을 경우
				is_auth_input = true;
			}

			if(only_email != undefined){ // 가입한 이메일로 찾기만 존재할 경우
				is_find_id_only_email = true;
				email = only_email;
			}

			if(status_find_id){
				find_pw_email = ''; // 비밀번호 찾기에서 입력된 값 초기화
				if(email_wrap.css('display') == 'block'){ // 가입한 이메일로 찾기 입력 데이터 이외의 값 초기화
					nick = '';
					call_num = '';
				}else if(nick_wrap.css('display') == 'block'){ // 가입한 휴대폰으로 찾기 입력 데이터 이외의 값 초기화
					email = '';
				}
			}else if(status_find_password){
				nick = '';
				call_num = '';
				email = '';

				email = find_pw_email;
			}

			var data = {};
			data.is_find_id_only_email = is_find_id_only_email; // 가입한 이메일로 찾기만 존재할 경우 true
			data.status_find_id  	   = status_find_id;  // 비밀번호 찾기인지 확인
			data.email 	  		  	   = email;
			data.nick  	  		  	   = nick;
			data.call_num 		  	   = call_num;

			$.ajax({
				type:'POST',
				data:{data:data, step:1},
				url:('/ajax/find_pass.cm'),
				dataType:'json',
				async:false,
				cache:false,
				success:function(res){
					if(res.msg =='SUCCESS'){
						that.findToken = res.token;
						$('#token').val(res.token);											// 본인인증에 사용되는 값
						$('#member_code_token').val(res.member_code);						// 본인인증에 사용되는 값
						$('._result_find_data_uid').text(res.result_find_data_uid);			// 아이디 결과값 입력
						$('._result_find_data_email').text(res.result_find_data_email);		// 이메일 정보 결과값 입력

						if(res.result_find_data_email == undefined){
							// 회원 이메일 정보 없을 경우,
							find_id_send_email_wrap.hide();
							if($('input:radio[name="findIdStep03"]')[1] != undefined) $('input:radio[name="findIdStep03"]')[1].click();
						}else{
							find_id_send_email_wrap.show();
						}

						// 조회 결과가 하나일 경우,
						// STEP 2로 이동
						if($('#find_step_1').css('display') == 'block' && res.member_data == undefined){
							if(status_find_id){
								$('#find_step_1').hide();
								$('#find_step_2').show();
								$('#find_step_3').hide();
								if(res.is_use_only_id && !is_auth_input){ 	   // 가입 및 그룹 이메일 사용 X, 본인인증 사용 X, 회원정보 이메일 정보 없을 경우
									if(res.result_find_data_email == undefined){
										find_id_first_result_wrap.hide();
										find_id_second_result_wrap.show();
									}else{
										find_id_first_result_wrap.show();
										find_id_second_result_wrap.hide();
									}
								}else{
									find_id_first_result_wrap.show();
									find_id_second_result_wrap.hide();
								}
							}else if(status_find_password){ // 비밀번호 찾기일 경우 STEP 3 이동
								if(res.is_use_only_id && !is_auth_input){ 	   // 가입 및 그룹 이메일 사용 X, 본인인증 사용 X, , 회원정보 이메일 정보 없을 경우
									if(res.result_find_data_email == undefined){
										find_id_first_result_wrap.hide();
										find_id_second_result_wrap.show();
									}else{
										find_id_first_result_wrap.show();
										find_id_second_result_wrap.hide();
									}

									$('#find_step_1').hide();
									$('#find_step_2').show();
									$('#find_step_3').hide();
								}else{
									find_id_first_result_wrap.show();
									find_id_second_result_wrap.hide();

									$('#find_step_1').hide();
									$('#find_step_2').hide();
									$('#find_step_3').show();
								}
							}
						}else if($('#find_step_1').css('display') == 'block' && res.member_data != undefined){ // 가입한 휴대폰으로 찾기
							if(res.is_one_member_data){
								// 조회 결과가 한개만 존재할 경우
								$.each(res.member_data, function(index, value){
									if(value[3] != null){
										find_id_send_email_wrap.show();
										$('input:radio[name="findIdStep03"]')[0].click();
									}else{
										if(!is_auth_input){ 	   // 본인인증 사용 X, 회원정보 이메일 정보 없을 경우
											$('#find_step_1').hide();
											$('#find_step_2').show();
											$('#find_step_3').hide();

											find_id_first_result_wrap.hide();
											find_id_second_result_wrap.show();
										}
									}
								});
							}
						}

						// 조회 결과가 다수일 경우,
						// STEP 2로 이동
						if(res.member_data){
							$('#find_step_1').hide();
							$('#find_step_2').show();
							$('#find_step_3').hide();

							if(res.is_use_only_id && !is_auth_input){ 	   // 가입 및 그룹 이메일 사용 x, 본인인증 사용 x
								find_id_first_result_wrap.hide();
								find_id_second_result_wrap.show();
							}else{
								find_id_first_result_wrap.show();
								find_id_second_result_wrap.hide();
							}

							var add_member_list = $(".text-ultra-bold.mt16._result_find_data_uid").parent();
							add_member_list.show();
							add_member_list.children().hide();

							if(res.is_one_member_data){
								// 조회 결과가 한개만 존재할 경우
								$.each(res.member_data, function(index, value){
									add_member_list.append(
										"<input type='hidden' class='_one_member_encrypt_uid' value='"+value[1]+"' />" +
										"<input type='hidden' class='_one_member_login_type' value='"+value[2]+"' />" +
										"<input type='hidden' class='_one_member_asterisk_email' value='"+value[3]+"' />" +
										"<span class='text-ultra-bold mt16 _result_find_data_uid _one_member_asterisk_uid'>"+value[0]+ "</span>"
									);
									if(value[3] == null && !is_auth_input){
										if(!is_auth_input){ 	   // 본인인증 사용 X, 회원정보 이메일 정보 없을 경우
											$('#find_step_1').hide();
											$('#find_step_2').show();
											$('#find_step_3').hide();

											find_id_first_result_wrap.hide();
											find_id_second_result_wrap.show();
										}
									}

								});
							}else{ // 조회 결과가 다수일 경우
								if(res.is_use_only_id && !is_auth_input){
									// (가입 및 그룹) 이메일 사용 x, 본인인증 x
									// 비밀번호 재설정, 정확한 아이디 기억나지 않아요! 수단 이용할 수 없음
									// 결과 바로 출력
									find_id_first_result_wrap.hide();
									find_id_second_result_wrap.show();

									$.each(res.member_data, function(index, value){
										add_member_list.append(
											"<div class='pw_search mt8'>" +
											"<span class='text-ultra-bold mt16 _result_find_data_uid _one_member_asterisk_uid'>"+value[0]+ "</span>" +
											"</div>"
										);
									});

								}else{
									$.each(res.member_data, function(index, value){
										add_member_list.append(
											"<div class='select_tit radio radio-styled mt0 mb0 _member_list_radio'>" +
											"<label>" +
											"<input type='hidden' class='_asterisk_email' value='"+value[3]+"' />" +
											"<input type='hidden' value='"+value[2]+"' />" +
											"<input type='radio' name='findIdMemberList' value='"+value[1]+"' />" +
											"<span>"+value[0]+"</span>" +
											"</label>" +
											"</div>"
										);
									});
									$('input:radio[name="findIdMemberList"]').first().prop("checked", true);
								}
							}
						}
					}else{
						alert(res.msg);
					}
				}
			});
		}else if(step=='send'){
			var status_find_id   = current_find_tab === "findId" ? "Y" : "N";
			if($('#token').val() != ''){ // 본인인증으로 넘어온 값
				that.findToken = $('#token').val();
			}

			$.ajax({
				type:'POST',
				data:{'token':that.findToken, 'status_find_id':status_find_id, 'step':2},
				url:('/ajax/find_pass.cm'),
				dataType:'json',
				async:false,
				cache:false,
				success:function(res){
					if(res.msg =='SUCCESS'){

						$('#find_step_1').hide();
						$('#find_step_2').hide();
						$('#find_step_3').hide();
						$('#find_step_4').show();

						$('_result_find_data').text(res.result_find_data);
					}else{
						alert(res.msg);
					}
				}
			});
		}else if(step=='update_password'){
			if($('#token').val() != ''){ // 본인인증으로 넘어온 값
				that.findToken = $('#token').val();
			}
			var data = $('#find_password_form').serializeObject();

			$.ajax({
				type:'POST',
				data:{data:data, token:that.findToken,step:3},
				url:('/ajax/find_pass.cm'),
				dataType:'json',
				async:false,
				cache:false,
				success:function(res){
					if(res.msg =='SUCCESS'){
						alert(LOCALIZE.설명_비밀번호변경이완료되었습니다());
						location.href="/?mode=login";
					}else{
						if(res.error == -2){
							alert(LOCALIZE.설명_동일한암호로입력하시기바랍니다());
						}else if(res.error == -3){
							alert(LOCALIZE.설명_정상적인암호로입력하시기바랍니다());
						}else if(res.error == -4){
							alert(LOCALIZE.설명_비밀번호재설정링크유효기간만료());
						}else if(res.error == -5){
							alert(LOCALIZE.설명_변경가능시간을초과하였습니다());
						}else if(res.error == -6){
							alert(res.error_detail);
						}else{
							alert(res.msg);
						}
					}
				}
			});
		}
	};

	var openChangePassword = function(c,r,s, type){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {c: c, r : r, s : s, type : type},
			url: ('/dialog/change_password.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_change_password', custom_popup: $html});
			}
		});

	};

	var changePassword = function(){
		var data = $('#find_password_form').serializeObject();
		$.ajax({
			type:'POST',
			data:data,
			url:('/backpg/change_password.cm'),
			dataType:'json',
			async:false,
			cache:false,
			success:function(res){
				if(res.msg =='SUCCESS'){
					alert(LOCALIZE.설명_비밀번호변경이완료되었습니다());
					location.href="/?mode=login";
				}else{
					if(res.error == -2){
						alert(LOCALIZE.설명_동일한암호로입력하시기바랍니다());
					}else if(res.error == -3){
						alert(LOCALIZE.설명_정상적인암호로입력하시기바랍니다());
					}else if(res.error == -4 || res.error == -14){
						alert(LOCALIZE.설명_비밀번호재설정링크유효기간만료());
					}else if(res.error == -5){
						alert(LOCALIZE.설명_변경가능시간을초과하였습니다());
					}else if(res.error == -6){
						alert(res.error_detail);
					}else{
						alert(LOCALIZE.설명_잘못된접근입니다());
					}
				}
			}
		});

	};

	var editProfile = function(back_url){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {'back_url': back_url},
			url: ('/dialog/join.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				var $join_btn = $html.find('._join_btn');

				$join_btn.off('click').on('click', function(e){
					joinSubmit();
					e.preventDefault();
					return false;
				});

				$.cocoaDialog.open({type: 'site_join', custom_popup: $html});
			}
		});
	};

	var checkRequireOption = function(){
		if($('._requireOption').length > 0 || $('._requireInputOption').length > 0){		// 필수옵션이 존재할 때
			if($('._selected_require_option').length == 0) return false;		// 선택된 필수옵션이 없는 경우
		}

		return true;
	};

	/**
	 *
	 * @param back_url
	 * @param type
	 * @param callback
	 * @param used_login_btn 로그인 버튼을 직접 클릭해서 들어왔을 경우 'Y', 'Y'일 때만 로그인 후 설정된 메뉴로 이동
	 * @param page_type 호출된 페이지, 현재 payment 에서만 사용 중
	 */
	var openLogin = function(back_url,type,callback,used_login_btn, page_type){
		var param = {};
		if ( page_type == 'payment' ) { // 호출된 페이지가 payment 일 경우
			// 필수옵션 선택 유효성 검사 실행
			if ( ! checkRequireOption() ) {
				alert(LOCALIZE.설명_필수옵션이모두선택되어있지않습니다());
				return false;
			}
			// 배송국가 param 세팅
			param.country_code = $(".countryList").val();
		}

		var back_url = typeof back_url == 'undefined' ? '':back_url;
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {back_url:back_url,'type':type,'used_login_btn':used_login_btn, 'param' : param},
			url: ('/dialog/login.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$html.find('._guest_payment').on('click',function(){
					if(typeof callback == 'function')
						callback();
				});

				if(type === 'adult'){
					$('._login_auth_btn').hide();
					$.cocoaDialog.open({
						type : 'site_login', custom_popup : $html, 'close_block':true, hide_event : function(){
							$('._login_auth_btn').show();
						}
					});
				}else{
					$.cocoaDialog.open({type: 'site_login', custom_popup: $html});
				}
			}
		});
	};
	var openGuestLogin = function(back_url){
		var back_url = typeof back_url == 'undefined' ? '':back_url;
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {back_url:back_url },
			url: ('/dialog/guest_login.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_login', custom_popup: $html});
			}
		});
	};

	var joinSubmit = function(is_social){
		if(join_processing)
			return false;
		join_processing = true;
		var birth_form = $('._item._birth');
		var data = $join_form.serializeObject();
		var inactive_year = 0;//$('#inactive_year:checked').val();
		if($('.is_change_all_admin').length > 0 ){
			$.extend(data, {is_change_all_admin: $('.is_change_all_admin').prop('checked')});
		}
		if(birth_form.find('#birth_y').prop("disabled")){
			$.extend(data, {
				birth_y: birth_form.find('#birth_y').val(),
				birth_m: birth_form.find('#birth_m').val(),
				birth_d: birth_form.find('#birth_d').val()
			});
		}
		//$.extend(data, {inactive_year: inactive_year});
		$.extend(data, {is_social: is_social ? 'Y' : 'N'});
		$.ajax({
			type:'POST',
			data:data,
			url:('/backpg/join.cm'),
			dataType:'json',
			cache:false,
			success:function(res){
				if(res.msg === 'SUCCESS'){
					setCookie('join_back_url', '', -1);

					var asyncTasks = [];

					switch ( res.mode ) {
						case 'add':
							if ( typeof FB_PIXEL != 'undefined' && res.fb_registration_check == 'N')FB_PIXEL.CompleteRegistration('join',res.currency,res.join_id);
							if ( typeof NP_LOG != 'undefined' ) NP_LOG.CompleteJoin();
							if ( typeof DAUM_CTS != 'undefined' ) DAUM_CTS.CompleteJoin();
							if ( typeof ACE_COUNTER != 'undefined' ) {
								ACE_COUNTER.setType(res['ace_counter_type']);
								ACE_COUNTER.CompleteJoin(res.join_id);
                if(res['use_join_confirm']){
                  ACE_COUNTER.CompleteLogin(res.join_id);
                }
							}
							if ( typeof KAKAO_PIXEL != 'undefined' ) KAKAO_PIXEL.CompleteJoin();
							// if ( typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.CompleteJoin();
							if ( typeof GOOGLE_ADWORDS_TRACE != 'undefined' && res.google_join_check) GOOGLE_ADWORDS_TRACE.EtcTrace(res.google_join_id);
							if ( typeof ACE_COUNTER_PARTNER != 'undefined'){
								if(res.ace_counter_partner_type == 'mweb'){
									m_jn = 'join';
									m_jid = res.join_id;
									if(res.age > 0){
										m_ag = res.age;
									}
									if(res.gender !== ''){
										m_gd = res.gender === 'F' ? 'woman' : 'man';
									}
									if(res.use_join_confirm !==''){
										m_id = res.join_id;
									}
									try{
										AM_PL('/join_complete.php');
									}catch(e){
									}
								}else{
									_jn = 'join';
									_jid = res.join_id;
									if(res.age > 0){
										_ag = res.age;
									}
									if(res.gender !== ''){
										_gd = res.gender === 'F' ? 'woman' : 'man';
									}
									if(res.use_join_confirm !==''){
										_id = res.join_id;
									}
									try{
										_PL(window.location.hostname+'/join_complete.php');
									}catch(e){
									}
								}
							}
							if(res.useChannelTalk === 'Y') {
								localStorage.setItem('channelTalkJoinFlag', 'true');
							}

							if (typeof TIKTOK_PIXEL != 'undefined') {
								TIKTOK_PIXEL.track('CompleteRegistration', {
									event_id: res.join_id,
									currency: res.currency,
									content_id: res.join_id,
									value: 1,
								});
							}

							if(typeof parent.Nachocode !== 'undefined' && res.nachocode_api_key != '' && res.nachocode_api_key != 'temp-api-key') {
								asyncTasks.push(
									(async function() {
										try {
											await parent.Nachocode.initAsync(res.nachocode_api_key);

											if (parent.Nachocode.env.isApp()) {
												await parent.Nachocode.push.registerPushToken(res.join_id);
											}
										} catch (error) {
											console.error('Nachocode 에러:', error);
										}
									})()
								);
							}

							break;
						case 'edit':
							if ( typeof CHANNEL_PLUGIN != "undefined" ) CHANNEL_PLUGIN.updateChannelProfileAttr('member');
							break;
					}

					terms_agree = true;
					if ( res['use_join_confirm'] ) {
						if(res['join_confirm_type'] === 'confirm_admin'){
							alert(LOCALIZE.설명_가입승인되지않은아이디입니다());
						}
					}

					if(res.advanced_trace_data != null){
						if(res.advanced_trace_data.header != ''){
							$('head').append(res.advanced_trace_data.header);
						}
						if(res.advanced_trace_data.body != ''){
							$('body').append(res.advanced_trace_data.body);
						}
						if(res.advanced_trace_data.footer != ''){
							$('footer').append(res.advanced_trace_data.footer);
						}
					}

					Promise.race([
						Promise.all(asyncTasks),
						new Promise(function(resolve) { setTimeout(resolve, 3000); })
					]).then(function() {
						if(res.back_url != ''){
							window.location.href = window.location.protocol + '//' + window.location.host + res.back_url;
						}else{
							window.location.href = '/';
						}
					}).catch(function(error) {
						if(res.back_url != ''){
							window.location.href = window.location.protocol + '//' + window.location.host + res.back_url;
						}else{
							window.location.href = '/';
						}
					});
				}else{
					if(res.code > 0){
						alert(res.msg);
						if(res.code === 4){
							window.location.href = '/';
						}
					}else{
						var $obj = $join_form.find('._' + res.flag);
						$join_form.find('._item').toggleClass('active', false);
						$join_form.find('._item').toggleClass('triangle', false);
						$.each(res.accept, function(e, v){
							var $acc_obj = $join_form.find('._' + v);
							$acc_obj.toggleClass('active', true);
						});

						$obj.toggleClass('triangle', true);
						$obj.find('input').focus();
						if ($obj[0]) $obj[0].scrollIntoView({ behavior: 'smooth', block: 'center' });

						// 중복 문구 방지
						const doubleCheck = $obj.find('._msg').text() === res.msg;
						if (!doubleCheck) $obj.find('._msg').text(res.msg);

						$join_form.find('._' + res.flag).toggleClass('active', false);
						if(res.flag === 'passwd') $('._passwd_confirm').toggleClass('active', false);
					}
				}

				join_processing = false;
			}
		});
	};

	/**
	 * 팝업형 소셜 회원가입 시 소셜에서 제공된 정보가 충분한 경우 약관동의 창에서 추가정보 받지 않고 바로 가입 처리
	 */
	var joinSubmitByAgree = function(){
		var policy_agree = $('#policy_agree').is(':checked') ? 'ok' : '';
		var privacy_agree = $('#privacy_agree').is(':checked') ? 'ok' : '';
		var third_party_agree = $('#third_party_agree').is(':checked') ? 'ok' : '';
		var marketing_sms_agree = $('#marketing_sms_agree').is(':checked') ? 'ok' : '';
		var marketing_email_agree = $('#marketing_email_agree').is(':checked') ? 'ok' : '';
		var limit_join_agree = $('#limit_join_agree').is(':checked') ? 'ok' : '';
		var join_type_code = $('#type_code').val();
		var inactive_year = 0;//$('#inactive_year:checked').val();

		$.ajax({
			type : 'POST',
			data : {
				policy_agree: policy_agree,
				privacy_agree: privacy_agree,
				third_party_agree: third_party_agree,
				marketing_sms_agree: marketing_sms_agree,
				marketing_email_agree: marketing_email_agree,
				limit_join_agree: limit_join_agree,
				//inactive_year: inactive_year,
				is_social: 'Y',
				required_data: 'N',
				use_login_popup: 'Y',
				type_code : join_type_code
			},
			url : ('/backpg/join_agree.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg === 'SUCCESS'){
					// 나쵸코드 앱 푸시 토큰 등록
					if(typeof parent.Nachocode !== 'undefined' && res.uid && res.nachocode_api_key) {
						parent.Nachocode.event.on('init', function() {
							if (parent.Nachocode.env.isApp()) {
								parent.Nachocode.push.registerPushToken(res.uid)
									.then(function() {
										location.href = res.url;
									}, function() {
										location.href = res.url;
									});
							} else {
								location.href = res.url;
							}
						});
						parent.Nachocode.init(res.nachocode_api_key);
					} else {
						location.href = res.url;
					}
				}else{
					if(res.msg === 'NEED_ADMIN_CONFIRM'){
						alert(getLocalizeString('설명_가입승인되지않은아이디입니다', '', '가입승인 대기 중입니다. 운영자의 승인 후 이용하실 수 있습니다.'));
						location.href = res.url;
					}else{
						alert(res.msg);
					}
				}
			}
		});
	};

	/**
	 * 소셜 회원가입 시 소셜에서 제공된 정보가 충분한 경우 가입유형 선택창에서 추가정보 받지 않고 바로 가입 처리
	 */
	var joinSubmitByJoinPattern = function(join_type_code){
		$.ajax({
			type : 'POST',
			data : {
				policy_agree: 'ok',
				privacy_agree: 'ok',
				is_social: 'Y',
				required_data: 'N',
				use_login_popup: 'Y',
				type_code : join_type_code
			},
			url : ('/backpg/join_agree.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg === 'SUCCESS'){
					// 나쵸코드 앱 푸시 토큰 등록
					if(typeof parent.Nachocode !== 'undefined' && res.uid && res.nachocode_api_key) {
						parent.Nachocode.event.on('init', function() {
							if (parent.Nachocode.env.isApp()) {
								parent.Nachocode.push.registerPushToken(res.uid)
									.then(function() {
										location.href = res.url;
									}, function() {
										location.href = res.url;
									});
							} else {
								location.href = res.url;
							}
						});
						parent.Nachocode.init(res.nachocode_api_key);
					} else {
						location.href = res.url;
					}
				}else{
					if(res.msg === 'NEED_ADMIN_CONFIRM'){
						alert(getLocalizeString('설명_가입승인되지않은아이디입니다', '', '가입승인 대기 중입니다. 운영자의 승인 후 이용하실 수 있습니다.'));
						location.href = res.url;
					}else{
						alert(res.msg);
					}
				}
			}
		});
	};

	var openJoinWithoutTerms = function(__third_party,__marketing_sms_agree,__marketing_email_agree, back_url, type_code){
		_third_party = __third_party;
		_marketing_sms_agree = __marketing_sms_agree;
		_marketing_email_agree = __marketing_email_agree;
		terms_agree = true;
		openJoin(back_url, '', type_code);
	};

	var openJoin = function(back_url, type, type_code){
    var third_party_agree = $('#third_party_agree').is(':checked') ? 'Y' : 'N';
    var marketing_sms_agree = $('#marketing_sms_agree').is(':checked') ? 'Y' : 'N';
    var marketing_email_agree = $('#marketing_email_agree').is(':checked') ? 'Y' : 'N';
    var limit_join_agree = $('#limit_join_agree').is(':checked') ? 'Y' : 'N';
    var inactive_year = 0;//$('#inactive_year:checked').val();
		$.cocoaDialog.close();
		if(!terms_agree){
			$.ajax({
				type: 'POST',
				data: {d: 'd', type : type, back_url: back_url, type_code:type_code},
				url: ('/dialog/join_policy.cm'),
				dataType: 'json',
				async: true,
				cache: false,
				success: function(res){
					if(res.msg === 'SUCCESS'){
						var $html = $(res.html);
						var $policy_check_all = $html.find('._check_all');
						var $agree_list = $html.find('._join_agree');
						var $join_btn = $html.find('._join_btn');

						$policy_check_all.off('click').on('click', function(){
							$agree_list.prop('checked', $(this).prop('checked'));
						});

						$agree_list.off('click').on('click', function(){
							if($(this).prop('checked') === false && $policy_check_all.prop('checked')) $policy_check_all.prop('checked', false);

							var is_all_checked = true;
							$agree_list.each(function(idx){
								if($agree_list.eq(idx).prop('checked') === false) is_all_checked = false;
							});
							if(is_all_checked) $policy_check_all.prop('checked', true);
						});

						$join_btn.off('click').on('click', function(){
							var missing_agree_cnt = $html.find(".require_agreement:checkbox:not(:checked)").length;
							var third_party_agree = $html.find("#third_party_agree").length;

							if($html.find("#limit_join_agree").length > 0){
								if(!$html.find("#limit_join_agree").is(":checked")){
									alert(getLocalizeString('설명_만14세미만은가입이불가합니다오류', '', '"만 14세 미만은 가입이 불가합니다.만 14세 이상임을 확인해주세요'));

									return false;
								}
							}


							// 필수항목 동의 누락이 있을 경우
							if(missing_agree_cnt > 0){
								if(third_party_agree > 0){
									// 개인정보 제3자 제공 동의 필수인 경우
									alert(getLocalizeString('설명_이용약관및개인정보처리방침및개인정보제3자동의', '', '이용약관 및 개인정보 처리방침 및 개인정보 제3자 제공에 동의하셔야 가입이 가능합니다.'));
								}else{
									alert(getLocalizeString('설명_동의해주세요', '', '이용약관 및 개인정보 처리방침에 동의하셔야 가입이 가능합니다.'));
								}
							}else{
								terms_agree = true;
								openJoin(back_url, '', type_code);
							}
							event.stopPropagation();
							return false;
						});

						$.cocoaDialog.open({type : 'site_join_policy', custom_popup : $html});
					}else if(res.msg === 'pass'){
						terms_agree = true;
						openJoin(back_url, '', type_code);
					}
				}
			});
		}else{
			terms_agree = false;
      
			if(_third_party !== undefined){
				third_party_agree = _third_party;
			}
			if(_marketing_sms_agree !== undefined){
				marketing_sms_agree = _marketing_sms_agree;
			}
			if(_marketing_email_agree !== undefined){
				marketing_email_agree = _marketing_email_agree;
			}
			$.ajax({
				type: 'POST',
				data: {d: 'd',
					'third_party_agree'    : third_party_agree,
					'marketing_sms_agree'  : marketing_sms_agree,
					'marketing_email_agree': marketing_email_agree,
					'inactive_year'		   : inactive_year,
					back_url 			   : back_url,
					type_code 			   : type_code,
					limit_join_agree	   :limit_join_agree,
				},
				url: ('/dialog/join.cm'),
				dataType: 'html',
				async: true,
				cache: false,
				success: function(html){
					var $html = $(html);
					var $join_btn = $html.find('._join_btn');

					$join_btn.off('click').on('click', function(e){
						joinSubmit();
						e.preventDefault();
						return false;
					});

					$.cocoaDialog.open({type: 'site_join', custom_popup: $html});
				}
			});
		}

	};

	var openJoinPatternChoice = function(back_url, request_page,social_type){
		$.ajax({
			type: 'POST',
			data: {back_url : back_url, request_page : request_page, social_type : social_type},
			url: ('/dialog/join_pattern_choice.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === 'SUCCESS'){ // 가입 유형이 복수일때
					$.cocoaDialog.close();
					$.cocoaDialog.open({type: 'site_join', custom_popup: res.html});
				}else{ // 가입유형이 복수가 아닐때
					openJoinTypeChoice(back_url,request_page);
				}
			}
		});
	};

	var openJoinTypeChoice = function(back_url, request_page, type_code){
		$.ajax({
			type: 'POST',
			data: {back_url: back_url, request_page : request_page, type_code : type_code},
			url: ('/dialog/join_type_choice.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === 'SUCCESS'){ // 소셜, 일반 회원가입 선택 모달
					$.cocoaDialog.close();
					$.cocoaDialog.open({type: 'site_join', custom_popup: res.html});
				}else{ // 바로 약관동의 모달로
					openJoin(back_url, request_page, type_code);
				}
			}
		});
	};

	/**
	 * 소셜 가입 버튼을 숨기고 ID/PW 회원가입 입력폼 노출시킴
	 */
	var showJoinForm = function(){
		if(!$join_form) $join_form = $('#join_form');
		var $sns_login_wrap = $('._sns_login_wrap');
		$sns_login_wrap.hide();
		$join_form.show();

	};
	/**
	 * 앱에서 프로필 호출할때 로그인여부 체크해서 분기처리
	 * [DATE] 2016 11 29
	 * @param isLogin
	 */
	var openAppAction = function (isLogin) {
		if(!isLogin) openLogin();
		else editProfile();

	};

	/***
	 * 현재 로그인상태를 확인해서 로그인 창 또는 정보수정 다이얼로그를 뛰움
	 */
	var openLoginOrModifyDialogByLoginStatus = function(){
		$.ajax({
			type: 'POST',
			url: ('/ajax/check_login.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.is_login == "Y"){
					//쇼핑/예약 사이트인경우 마이페이지로
					if(res.is_shop == "Y"){
						location.href="/shop_mypage";
					}else{
						editProfile();
					}

				}else{
					location.href = '/login';
					//openLogin();
				}
			}
		});
	};

	/**
	 * 다이얼로그가 실행되어있는지 체크해서 분기처리
	 * [DATE] 2016 11 29
	 */
	var isDialogOpen = function () {
		if($.cocoaDialog.isOpen())
			$.cocoaDialog.close();
		else
			window.dozAndroidBridge.dialogClose();
	};

	var positionMemberProfile = function($obj){
		var $window = $(window);
		var $body = $('body');
		var fixed = $body.hasClass('fixed_menu');
		if(fixed){
			$obj = $('#doz_header_wrap .fixed_header').find('.profile');
		}
		var body_width = $('body').width();
		var body_height = $('body').height();
		var window_height = $window.height();

		var top = $obj.offset().top;
		var left = $obj.offset().left;
		var width = $obj.outerWidth();
		var height = $obj.outerHeight();

		var layer_width = $member_profile.outerWidth();
		var layer_height = $member_profile.outerHeight();

		var result_top = 0;
		var result_left = 0;

		result_left = left+width-layer_width;
		//TODO 아래의 경우에만 처리된 이유가 있는것인지..
		//아래와 같이 처리뢰면 메뉴바 확장을 사용안할 경우 프로필 레이아웃 위치 계산이 안됨
		//			if(body_width < left+layer_width){
		//				result_left = left+width-layer_width;
		//			}

		//if(window_height < top+layer_height){
		//	result_top = top-height-layer_height;
		//}else{
		result_top = top+height+10;
		//}


		if(left <= layer_width){
			//프로필 팝업이 화면밖으로 나가는 경우 프로필 영역 가운데 정렬처리
			if(body_width < left+layer_width){
				$member_profile.css({
					'margin':'0 auto'
				});
				result_left = 0;
			}else{
				result_left = left;
			}

		}

		$member_profile.css({
			left : result_left,
			top : result_top
		});
	};

	var showMemberProfile = function($obj){
		if(typeof $member_profile == 'undefined') return false;
		positionMemberProfile($obj);
		$member_profile.show();
		var is_click = true;
		$('body').off('click.show_member_profile').on('click.show_member_profile',function(e){
			var $target = $(e.target);
			var is_profile = $target.closest('#'+member_profile_id).length>0;
			if(!is_profile && !is_click) {
				closeMemberProfile();
			}
			is_click = false;
		});
		$(window).off('scroll.show_member_profile').on('scroll.show_member_profile',function(e){
			positionMemberProfile($obj);
		});

	};
	var closeMemberProfile = function($obj){
		$member_profile.hide();
		$('body').off('click.show_member_profile');
		$(window).off('scroll.show_member_profile');
	};

	/**
	 * 드림 시큐리티 v2 본인인증 표준창 호출
	 */
	var openDreamSecurityV2Window = function() {

		authRedirectProcessing = false;

		var step2_select_val = '';
		var step1_pw_input_val = '';
		if ($('#token').val() !== undefined) {
			step2_select_val = $('#token').val();
		} else if ($('._one_member_encrypt_uid').val() !== undefined) {
			step2_select_val = $('._one_member_encrypt_uid').val();
		} else if ($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined) {
			step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
		}
		if ($('#member_code_token').val() !== undefined) {
			step1_pw_input_val = $('#member_code_token').val();
		}

		if (typeof MOBILEOK !== 'undefined') {

			$.ajax({
				type: 'POST',
				data: {
					'encrypt_uid': step2_select_val || '',
					'encrypt_member_code': step1_pw_input_val || ''
				},
				url: '/ajax/set_dream_security_v2_tokens.cm',
				dataType: 'json',
				cache: false,
				success: function(res) {
					if (res.msg === 'SUCCESS') {
						var userAgent = navigator.userAgent || '';
						var isInAppBrowser =
								userAgent.indexOf('Instagram') > -1 ||
								userAgent.indexOf('FBAN') > -1 ||
								userAgent.indexOf('Line') > -1 ||
								userAgent.indexOf('KAKAOTALK') > -1 ||
								userAgent.indexOf('Kakaotalk') > -1;

						var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
						try {
							if (IS_ANDROID_APP == 'Y' || IS_IOS_APP == 'Y' || isInAppBrowser || isSafari ) {
								MOBILEOK.process('/adult/set_auth_service_dream_security_v2_session.cm','MB','');
							} else {
								window.dreamSecurityV2result = function(data) {

									if (typeof data === 'string') {
										var htmlParser = parseAuthResultHTML(data);

										if (htmlParser.success) {
											// 인증 성공 - 모드별 처리
											processParsedAuthResult(htmlParser);
										} else {
											handleAuthFailure(htmlParser);
										}
										return;
									}

									console.error('Unexpected response type:', typeof data, data);
								};

								MOBILEOK.process('/adult/set_auth_service_dream_security_v2_session.cm','WB','dreamSecurityV2result');
							}
						} catch (e) {
							console.error('DreamSecurity V2 process error:', e);
							alert("인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
						}
					} else {
						alert(res.msg);
					}
				},
				error: function() {
					alert("인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
				}
				
			});
		} else {
			alert("인증 서버 오류입니다. 고객지원에 문의해주세요.");
		}
	};

	var openDreamSecurityV2ForFindId = function() {
		openDreamSecurityV2Window();
	};

	var openDreamSecurityV2ForAdult = function() {
		openDreamSecurityV2Window();
	};

	/**
	 * auth_service_result.cm 응답 파싱
	 */
	var parseAuthResultHTML = function(htmlString) {
		var result = {
			success: false,
			data: {},
			errorMsg: null,
			mode: 'join_form',
			hasOpener: false,
			redirectUrl: null,
			isConfirm: false
		};

		result.hasOpener = htmlString.indexOf('have_opener') > -1;

		if (htmlString.indexOf('인증에 성공하였습니다') > -1) {
			result.success = true;

			var authModeMatch = htmlString.match(/var AUTH_MODE = '([^']+)'/);
			if (authModeMatch) {
				result.mode = authModeMatch[1];
			} else {
				result.mode = 'join_form';
			}

			if (result.mode === 'prod_adult') {
				var backUrlMatch = htmlString.match(/_location\.href='([^']*)'/);
				if (backUrlMatch) result.data.back_url = backUrlMatch[1];
			} else if (result.mode === 'find_id') {
				var dreamDiMatch = htmlString.match(/dream_security_di\s*:\s*'([^']*)'/);
				if (dreamDiMatch) result.data.dream_security_di = dreamDiMatch[1];

				var encryptCiMatch = htmlString.match(/encrypt_ci\s*:\s*'([^']*)'/);
				if (encryptCiMatch) result.data.encrypt_ci = encryptCiMatch[1];

				var nameMatch = htmlString.match(/name\s*:\s*'([^']*)'/);
				if (nameMatch) result.data.name = nameMatch[1];

				var birthdayMatch = htmlString.match(/birthday\s*:\s*'([^']*)'/);
				if (birthdayMatch) result.data.birthday = birthdayMatch[1];

				var encryptUidMatch = htmlString.match(/encrypt_uid\s*:\s*'([^']*)'/);
				if (encryptUidMatch) result.data.encrypt_uid = encryptUidMatch[1];

				var memberCodeMatch = htmlString.match(/member_code\s*:\s*'([^']*)'/);
				if (memberCodeMatch) result.data.member_code = memberCodeMatch[1];
			} else if (result.mode === 'join_form') {

				var birthYMatch = htmlString.match(/_document\.find\('#birth_y'\)\.val\('([^']*)'\)/);
				var birthMMatch = htmlString.match(/_document\.find\('#birth_m'\)\.val\('([^']*)'\)/);
				var birthDMatch = htmlString.match(/_document\.find\('#birth_d'\)\.val\('([^']*)'\)/);

				if (birthYMatch) result.data.birth_y = birthYMatch[1];
				if (birthMMatch) result.data.birth_m = birthMMatch[1];
				if (birthDMatch) result.data.birth_d = birthDMatch[1];

				var nameMatch = htmlString.match(/_document\.find\('#join_name'\)\.val\('([^']*)'\)/);
				if (nameMatch) result.data.name = nameMatch[1];

				var callnumMatch = htmlString.match(/_document\.find\('#join_callnum'\)\.val\('([^']*)'\)/);
				if (callnumMatch) result.data.callnum = callnumMatch[1];

				var genderMMatch = htmlString.match(/_document\.find\('#gender_M'\)\.attr\('checked', true\)/);
				var genderFMatch = htmlString.match(/_document\.find\('#gender_F'\)\.attr\('checked', true\)/);
				if (genderMMatch) result.data.gender = 'M';
				else if (genderFMatch) result.data.gender = 'F';

				var limitJoinMatch = htmlString.match(/checkLimitJoin\('([^']*)'[^)]*\)/);
				if (limitJoinMatch) {
					result.data.is_adult = limitJoinMatch[1] === 'Y';
				}

				result.data.auth_info_save = htmlString.indexOf("attr('readonly', true)") > -1;

				var joinRedirectMatch = htmlString.match(/_location\.href='([^']*site_join[^']*)'/);
				if (joinRedirectMatch) result.redirectUrl = joinRedirectMatch[1];
			}

		} else {
			result.success = false;

			var alertMatch = htmlString.match(/alert\(['"]([^'"]+)['"]\)/);
			if (alertMatch && alertMatch[1] !== '인증에 성공하였습니다') {
				result.errorMsg = alertMatch[1].replace(/\\n/g, '\n');
			}

			var confirmMatch = htmlString.match(/confirm\(['"]([^'"]+)['"]\)/);
			if (confirmMatch) {
				result.errorMsg = confirmMatch[1].replace(/\\n/g, '\n');
				result.isConfirm = true;
			}

			var failRedirectMatch = htmlString.match(/_location\.href='([^']*)'/);
			if (failRedirectMatch) result.redirectUrl = failRedirectMatch[1];
		}

		return result;
	};

	/**
	 * 파싱된 결과 모드별 처리
	 */
	var processParsedAuthResult = function(htmlParser) {
		// 이미 처리 중이면 중복 실행 방지
		if (authRedirectProcessing) {
			return;
		}
		authRedirectProcessing = true;

		var mode = htmlParser.mode;
		var data = htmlParser.data;

		var hasOpener = false;
		try {
			if (window.opener && typeof window.opener.NOT_APP_PAGE !== 'undefined') {
				hasOpener = true;
			}
		} catch (e) {
			hasOpener = false;
		}

		alert('인증에 성공하였습니다.');
		switch(mode) {
			case 'adult_page': // 성인인증 인트로페이지
				if (hasOpener) {
					window.opener.location.reload();
					window.close();
				} else {
					location.href = '/';
				}
				break;

			case 'unauth_member': // 미인증 회원 로그인처리
				if (hasOpener) {
					window.opener.location.reload();
					window.close();
				} else {
					location.href = '/';
				}
				break;

			case 'join_form': // 가입 폼 처리
				if (hasOpener) {
					updateJoinFormFields(data);
					window.close();
				} else {
					if ($('#auth_success_wrap').length > 0 || $('#join_name').length > 0) {
						updateJoinFormFields(data);
					} else if (htmlParser.redirectUrl) {
						location.href = htmlParser.redirectUrl;
					}
				}
				break;

			case 'prod_adult': // 미성년자구매불가 상품
				if (hasOpener) {
					if (data.back_url) {
						window.opener.location.href = data.back_url;
					} else {
						window.opener.location.reload();
					}
					window.close();
				} else {
					if (data.back_url) {
						location.href = data.back_url;
					} else {
						location.reload();
					}
				}
				break;

		case 'find_id': // 아이디/비밀번호 찾기
			processFindIdInDialog(data);
			break;

			default:
				location.reload();
				break;
		}
	};

	var updateJoinFormFields = function(data) {
		$('#auth_success_wrap').show();
		$('#prevention_screen').hide();
		$('#auth_fail_wrap').hide();
		$('#auth_btn_wrap').hide();
		$('._auth_before_success_button').hide();
		$('.auth_completed').show();

		if (data.birth_y) {
			$('#birth_y').val(data.birth_y).attr('disabled', true).css('cursor', 'default');
		}
		if (data.birth_m) {
			$('#birth_m').val(data.birth_m).attr('disabled', true).css('cursor', 'default');
		}
		if (data.birth_d) {
			$('#birth_d').val(data.birth_d).attr('disabled', true).css('cursor', 'default');
		}
		$('#prevention_screen_birth').show();

		if (data.auth_info_save) {
			if (data.name) {
				$('#join_name').val(data.name).attr('readonly', true);
				$('#join_name').attr('onclick', "alert('본인인증으로 저장된 회원정보는 재인증을 통해서만 수정 가능합니다.')");
			}

			if (data.gender) {
				$('#gender_' + data.gender).prop('checked', true);
				var opposite_gender = data.gender === 'M' ? 'F' : 'M';
				$('#gender_' + opposite_gender).attr('disabled', true);
				$('#gender_' + opposite_gender).parent('label').attr('onclick',
					"alert('본인인증으로 저장된 회원정보는 재인증을 통해서만 수정 가능합니다.')");
				$('#gender_' + data.gender).siblings('span').addClass('gender_readonly');
				$('#gender_' + opposite_gender).siblings('span').addClass('gender_readonly');
			}

			if (data.callnum) {
				$('#join_callnum').val(data.callnum).attr('readonly', true);
				$('#join_callnum').attr('onclick', "alert('본인인증으로 저장된 회원정보는 재인증을 통해서만 수정 가능합니다.')");
			}
		}

		if (typeof checkLimitJoin === 'function' && data.is_adult !== undefined) {
			// 나이 계산
			var age = data.birth_y ? new Date().getFullYear() - parseInt(data.birth_y) : 0;
			checkLimitJoin(data.is_adult, 'auth', age);
		}
	};

	var handleAuthFailure = function(htmlParser) {
		// 이미 처리 중이면 중복 실행 방지
		if (authRedirectProcessing) {
			return;
		}
		authRedirectProcessing = true;

		// 실제 opener 존재 여부 체크
		var hasOpener = false;
		try {
			if (window.opener && typeof window.opener.NOT_APP_PAGE !== 'undefined') {
				hasOpener = true;
			}
		} catch (e) {
			hasOpener = false;
		}

		if (htmlParser.errorMsg) {
			if (htmlParser.isConfirm) {
				if (confirm(htmlParser.errorMsg)) {
					if (hasOpener) {
						window.opener.location.href = '/?mode=find_id';
						window.close();
					} else {
						location.href = '/?mode=find_id';
					}
				} else {
					if (hasOpener) {
						window.opener.location.href = '/';
						window.close();
					} else {
						location.href = '/';
					}
				}
				return; // confirm 처리 후 바로 리턴
			} else {
				alert(htmlParser.errorMsg);
				if (hasOpener) {
					window.close();
				}
			}
		}

		if (hasOpener) {
			if ($(window.opener.document).find('#auth_fail_wrap').length > 0) {
				$(window.opener.document).find('#auth_fail_wrap').show();
			}
		} else {
			if ($('#auth_fail_wrap').length > 0) {
				$('#auth_fail_wrap').show();
			}
		}

		if (htmlParser.redirectUrl && !htmlParser.isConfirm) {
			if (hasOpener) {
				window.opener.location.href = htmlParser.redirectUrl;
				window.close();
			} else {
				location.href = htmlParser.redirectUrl;
			}
		}
	};


	var processFindIdInDialog = function(data) {
		var check_step_1 = $('#find_step_1').css('display');
		var check_step_3 = $('#find_step_3').css('display');
		var check_id_title = $('._find_id').css('display') === 'block';
		var check_pw_title = $('._find_password').css('display') === 'block';

		var find_token = $('#token').val() || '';
		var member_code_token = $('#member_code_token').val() || '';

		var ajaxData = {
			encrypt_ci: data.encrypt_ci || '',
			name: data.name || '',
			birthday: data.birthday || '',
			find_token: find_token,
			member_code: member_code_token
		};

		if (data.dream_security_di) {
			ajaxData.dream_security_di = data.dream_security_di;
		}

		$.ajax({
			type: 'POST',
			data: {data: ajaxData, step: 1},
			url: '/ajax/find_pass.cm',
			dataType: 'json',
			cache: false,
			success: function(res) {
				if (res.msg === 'SUCCESS') {
					$('._one_member_asterisk_uid').remove();
					$('._result_find_data_uid').text(res.result_find_data_uid);
					$('#token').val(res.token);											// 본인인증에 사용되는 값
					$('#member_code_token').val(res.member_code);						// 본인인증에 사용되는 값

					if (check_step_1 === 'block') {
						$('#find_step_1').hide();
						$('#find_step_2').show();
						$('#find_step_3').hide();
						$('._find_id_detail').hide();

						if (!res.is_use_only_id) {
							$('._result_find_data_email').text(res.result_find_data_email);
						}
						$('#token').val(res.token);
					}

					if (res.is_use_only_id) {
						$('._find_id_send_email_wrap').hide();
					} else {
						$('._find_id_send_email_wrap').show();
					}

					if (check_step_3 === 'block') {
						if (check_id_title) {
							$('._member_list_radio').hide();
							$('._result_find_data_uid').show();

							$('#find_step_1').hide();
							$('#find_step_2').show();
							$('#find_step_3').hide();

							$('#find_step2_info_1').hide();
							$('#find_step2_info_2').show();
						} else if (check_pw_title) {
							$('#find_step_1').hide();
							$('#find_step_2').hide();
							$('#find_step_3').hide();
							$('#find_step_4').show();

							$('._result_update_password_wrap').show();
							$('._result_sending_email_wrap').hide();
						}
					}
				} else {
					alert(res.msg);
				}
			},
			error: function() {
				alert('처리 중 오류가 발생했습니다.');
			}
		});
	};

	var openDRMOKWindow = function(req_info, cpid, rtn_url){ // 성인/본인 인증 팝업창\
    var step2_select_val;
    var step1_pw_input_val;
    if($('#token').val() !== undefined){
      step2_select_val = $('#token').val();
    }else if($('._one_member_encrypt_uid').val() !== undefined ){
      step2_select_val = $('._one_member_encrypt_uid').val();
    }else if($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined){
      step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
    }
    if($('#member_code_token').val() !== undefined){
      step1_pw_input_val = $('#member_code_token').val();
    }
    $.ajax({
      type: 'POST',
      data: {'return_url' : rtn_url, 'encrypt_uid': step2_select_val, 'encrypt_member_code' : step1_pw_input_val},
      url: ('/ajax/set_auth_service_session.cm'),
      dataType: 'json',
      async: true,
      cache: false,
      success: function(res){
        if(res.msg === 'SUCCESS'){
          if(IS_APP || IS_MOBILE){
            var url = "https://www.mobile-ok.com/popup/hscert.jsp?req_info="+req_info+"&rtn_url="+rtn_url+"&cpid="+cpid+"";
            var urlInfo = parseUri(url);
            var $form = $("<form />");

            $form.attr("method","post");
            $form.attr("action", urlInfo.protocol+"://"+urlInfo.authority+urlInfo.path);

            for ( var i in urlInfo.queryKey ) {
              var $input = $("<input />");
              $input.attr("type", "hidden");
              $input.attr("name", i);
              $input.attr("value", urlInfo.queryKey[i]);
              $form.append($input);
            }
            var $body = $('body');

            $body.append($form);
            $form.submit();

            event.returnValue = false;
            event.cancelBubble = true;
          }else{
	          windowOpen('DRMOKWindow', 'https://www.mobile-ok.com/popup/hscert.jsp?req_info=' + req_info + '&rtn_url=' + rtn_url + '&cpid=' + cpid, 425, 550, 'no', 'post');
          }


        }
      }
    });
	};

	var openMOBILIANSWindow = function(CI_SVCID, Tradeid, Okurl, call_back_data){ // 본인인증, 성인인증 (모빌리언스) 팝업창
		var Keygb   = '1';
		var Cryptyn = 'Y';
		var CI_Mode = '61';
		var MSTR	= call_back_data;
		var Siteurl = 'www.mobilians.co.kr';
		var auth_url = 'https://auth.mobilians.co.kr/goCashMain.mcash?CASH_GB=CI&CI_SVCID='+CI_SVCID+'&Siteurl='+Siteurl+'&Tradeid='+Tradeid+'&Okurl='+Okurl+'&Keygb='+Keygb+'&Cryptyn='+Cryptyn+'&CI_Mode='+CI_Mode+'&MSTR='+MSTR;

    var step2_select_val;
    var step1_pw_input_val;
    if($('#token').val() !== undefined){
      step2_select_val = $('#token').val();
    }else if($('._one_member_encrypt_uid').val() !== undefined ){
      step2_select_val = $('._one_member_encrypt_uid').val();
    }else if($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined){
      step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
    }
    if($('#member_code_token').val() !== undefined){
      step1_pw_input_val = $('#member_code_token').val();
    }
    $.ajax({
      type: 'POST',
      data: {'return_url' : Okurl, 'encrypt_uid': step2_select_val, 'encrypt_member_code' : step1_pw_input_val},
      url: ('/ajax/set_auth_service_session.cm'),
      dataType: 'json',
      async: true,
      cache: false,
      success: function(res){
        if(res.msg === 'SUCCESS'){
	        // 안드로이드에서 인스타그램 인앱브라우저로 접근 시 본인인증이 끝나고 이전 창으로 돌아가지 못하는 문제가 있어 예외처리
	        const isAndroidInstagramBrowser =
			        navigator.userAgent.includes('Android') && navigator.userAgent.includes('Instagram');
	        if (IS_APP || (IS_MOBILE && !isAndroidInstagramBrowser)) {
            var urlInfo = parseUri(auth_url);
            var $form = $("<form />");

            $form.attr("method","post");
            $form.attr("action", urlInfo.protocol+"://"+urlInfo.authority+urlInfo.path);

            for ( var i in urlInfo.queryKey ) {
              var $input = $("<input />");
              $input.attr("type", "hidden");
              $input.attr("name", i);
              $input.attr("value", urlInfo.queryKey[i]);
              $form.append($input);
            }
            var $body = $('body');

            $body.append($form);
            $form.submit();

            event.returnValue = false;
            event.cancelBubble = true
          }else{
            windowOpen('MOBILIANSWindow',auth_url,450,750,'yes','post', 'euc-kr');
          }
        }
      }
    });
	};

	// 신규 인증창 방식 (서버방식) - KG모빌리언스 휴대폰 본인확인
	var openMOBILIANSWindow2 = function(CI_SVCID, Tradeid, Okurl, call_back_data, Notiurl, Cryptstring){
		var Keygb   = '1';
		var Cryptyn = 'Y';
		var CI_Mode = '61';
		var MSTR    = call_back_data;
		var Siteurl = window.location.hostname;
		// KG 모빌리언스 Siteurl은 20byte 제한이 있어 초과시 잘라냄
		if (Siteurl.length > 20) {
			Siteurl = Siteurl.substring(0, 20);
		}
		var PAY_MODE = '10';

		var authParams = {
			'CASH_GB': 'CI',
			'CI_SVCID': CI_SVCID,
			'PAY_MODE': PAY_MODE,
			'Okurl': Okurl,
			'Notiurl': Notiurl || '',
			'Cryptyn': Cryptyn,
			'Keygb': Keygb,
			'Cryptstring': Cryptstring,
			'Siteurl': Siteurl,
			'Tradeid': Tradeid,
			'CI_Mode': CI_Mode,
			'MSTR': MSTR,
			'LOGO_YN': 'N',
			'CALL_TYPE': 'P',
			'Sendtype': 'POST',
		};

		var step2_select_val;
		var step1_pw_input_val;
		if($('#token').val() !== undefined){
			step2_select_val = $('#token').val();
		}else if($('._one_member_encrypt_uid').val() !== undefined ){
			step2_select_val = $('._one_member_encrypt_uid').val();
		}else if($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined){
			step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
		}
		if($('#member_code_token').val() !== undefined){
			step1_pw_input_val = $('#member_code_token').val();
		}

		$.ajax({
			type: 'POST',
			data: {'return_url' : Okurl, 'encrypt_uid': step2_select_val, 'encrypt_member_code' : step1_pw_input_val},
			url: ('/ajax/set_auth_service_session.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			timeout: 10000,
			success: function(res){
				if(res.msg === 'SUCCESS'){
					var loadMobiliansScript = function() {
						if (typeof AUTH_PAYMENT === 'function') {
							executeMobiliansAuth();
							return;
						}

						var script = document.createElement('script');
						script.src = 'https://auth.mobilians.co.kr/js/ext/v2/ext_inc_comm.js';
						script.onload = function() {
							executeMobiliansAuth();
						};
						script.onerror = function() {
							alert('모빌리언스 인증 모듈 로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
						};
						document.head.appendChild(script);
					};

					var executeMobiliansAuth = function() {
						// 기존 form 제거 (재시도 대응)
						var existingForm = document.getElementById('mobiliansAuthForm');
						if (existingForm) {
							existingForm.parentNode.removeChild(existingForm);
						}

						var form = document.createElement('form');
						form.name = 'mobiliansAuthForm';
						form.id = 'mobiliansAuthForm';
						form.method = 'post';
						form.action = 'https://auth.mobilians.co.kr/goAuthMain.mcash';
						form.acceptCharset = 'euc-kr';

						for (var key in authParams) {
							if (authParams.hasOwnProperty(key)) {
								var input = document.createElement('input');
								input.type = 'hidden';
								input.name = key;
								input.value = authParams[key];
								form.appendChild(input);
							}
						}

						document.body.appendChild(form);

						// DOM에 추가된 후 딜레이를 두고 AUTH_PAYMENT 호출
						setTimeout(function() {
							try {
								AUTH_PAYMENT(document.forms['mobiliansAuthForm']);
							} catch(e) {
								console.error('AUTH_PAYMENT 호출 실패:', e);
								alert('인증 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
							}
						}, 500);
					};

					loadMobiliansScript();
				} else {
					alert('인증 세션 설정에 실패했습니다. 잠시 후 다시 시도해주세요.');
				}
			},
			error: function(xhr, status, error) {
				console.error('AJAX Error:', {status: status, error: error, xhr: xhr});
				alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
			},
			complete: function() {
				console.log('AJAX 요청 완료 (openMOBILIANSWindow2)');
			}
		});
	};


	var openINICISWindow = function(mid, Tradeid, Okurl, call_back_data){ // 본인인증, 성인인증 (이니시스) 팝업창
		var MSTR	= call_back_data;
		var Siteurl = 'www.inicis.com';
		var auth_url ='https://cas.inicis.com/casapp/ui/cardauthreq?mid=' + mid + '&Siteurl=' + Siteurl + '&Tradeid=' + Tradeid + '&Closeurl=' + Okurl + '&Okurl=' + Okurl + '&MSTR=' + MSTR + '&encryptYN=Y';

		var step2_select_val;
		var step1_pw_input_val;
		if($('#token').val() !== undefined){
			step2_select_val = $('#token').val();
		}else if($('._one_member_encrypt_uid').val() !== undefined ){
			step2_select_val = $('._one_member_encrypt_uid').val();
		}else if($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined){
			step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
		}
		if($('#member_code_token').val() !== undefined){
			step1_pw_input_val = $('#member_code_token').val();
		}
		$.ajax({
			type: 'POST',
			data: {'return_url' : Okurl, 'encrypt_uid': step2_select_val, 'encrypt_member_code' : step1_pw_input_val},
			url: ('/ajax/set_auth_service_session.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === 'SUCCESS'){
					if(IS_APP || IS_MOBILE){
						var urlInfo = parseUri(auth_url);
						var $form = $("<form />");

						$form.attr("method","post");
						$form.attr("action", urlInfo.protocol+"://"+urlInfo.authority+urlInfo.path);

						for ( var i in urlInfo.queryKey ) {
							var $input = $("<input />");
							$input.attr("type", "hidden");
							$input.attr("name", i);
							$input.attr("value", urlInfo.queryKey[i]);
							$form.append($input);
						}
						var $body = $('body');

						$body.append($form);
						$form.submit();

						event.returnValue = false;
						event.cancelBubble = true;
					}else{
						windowOpen('INICISWindow', auth_url, 450, 750, 'yes', 'post');
					}
				}
			}
		});
	};

	var openCOMBINATIONAUTHTYPESWindow = function(mid, mTxId, return_url, auth_hash){ // 본인인증, 성인인증 (통합 본인인증) 팝업창

		// reqSvcCd : 요청 구분 코드 (01:간편인증, 02:전자서명)

		var auth_url ='https://sa.inicis.com/auth?mid=' + mid + '&reqSvcCd=01' + '&mTxId=' + mTxId + '&successUrl=' + return_url + '&failUrl=' + return_url + '&flgFixedUser=N' + '&authHash=' + auth_hash + '&reservedMsg=isUseToken=Y';

		var step2_select_val;
		var step1_pw_input_val;
		if($('#token').val() !== undefined){
			step2_select_val = $('#token').val();
		}else if($('._one_member_encrypt_uid').val() !== undefined ){
			step2_select_val = $('._one_member_encrypt_uid').val();
		}else if($('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val() !== undefined){
			step2_select_val = $('#find_step_2').find("input:radio[name='findIdMemberList']:checked").val();
		}
		if($('#member_code_token').val() !== undefined){
			step1_pw_input_val = $('#member_code_token').val();
		}
		$.ajax({
			type: 'POST',
			data: {'return_url' : return_url, 'encrypt_uid': step2_select_val, 'encrypt_member_code' : step1_pw_input_val},
			url: ('/ajax/set_auth_service_session.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === 'SUCCESS'){
					if(IS_APP || IS_MOBILE){
						var urlInfo = parseUri(auth_url);
						var $form = $("<form />");

						$form.attr("method","post");
						$form.attr("action", urlInfo.protocol+"://"+urlInfo.authority+urlInfo.path);

						for ( var i in urlInfo.queryKey ) {
							var $input = $("<input />");
							$input.attr("type", "hidden");
							$input.attr("name", i);
							$input.attr("value", urlInfo.queryKey[i]);
							$form.append($input);
						}
						var $body = $('body');

						$body.append($form);
						$form.submit();

						event.returnValue = false;
						event.cancelBubble = true
					}else{
						windowOpen('COMBINATIONAUTHTYPESWindow', auth_url, 600, 620, 'yes', 'post');
					}
				}
			}
		});
	};

	var openAgreeSocialJoin = function(back_url, type_code, type){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {'is_social': 'Y', 'back_url': back_url, 'type_code' : type_code, 'type' : type},
			url: ('/dialog/join_policy.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				var $html = $(res.html);
				var $policy_check_all = $html.find('._check_all');
				var $agree_list =  $html.find('._join_agree');
				var $join_btn = $html.find('._join_btn');

				$policy_check_all.off('click').on('click', function(){
					$agree_list.prop('checked',$(this).prop('checked'));
				});

				$agree_list.off('click').on('click', function(){
					if($(this).prop('checked') === false && $policy_check_all.prop('checked')) $policy_check_all.prop('checked', false);


					var is_all_checked = true;
					$agree_list.each(function(idx){
						if($agree_list.eq(idx).prop('checked') === false) is_all_checked = false;
					});
					if(is_all_checked) $policy_check_all.prop('checked', true);
				});

				$join_btn.off('click').on('click', function(){
					var missing_agree_cnt = $html.find(".require_agreement:checkbox:not(:checked)").length;
					var third_party_agree = $html.find("#third_party_agree").length;
					// 필수항목 동의 누락이 있을 경우
					if(missing_agree_cnt > 0 ){
						if(third_party_agree > 0){
							// 개인정보 제3자 제공 동의 필수인 경우
							alert(getLocalizeString('설명_이용약관및개인정보처리방침및개인정보제3자동의', '', '이용약관 및 개인정보 처리방침 및 개인정보 제3자 제공에 동의하셔야 가입이 가능합니다.'));
						}else{
							alert(getLocalizeString('설명_동의해주세요', '', '이용약관 및 개인정보 처리방침에 동의하셔야 가입이 가능합니다.'));
						}
					} else {
						openSocialJoin(back_url, type_code);
					}
					//event.stopPropagation();
					return false;
				});

				$.cocoaDialog.open({type: 'site_join_policy', custom_popup: $html, close_block : true});
			}
		});
	};

	var openSocialJoin = function(back_url, type_code,social_type){		// 소셜 가입 시 추가정보 다이얼로그를 띄움
		$.cocoaDialog.close();
		var third_party_agree = $('#third_party_agree').is(':checked') ? 'Y' : 'N';
		var marketing_sms_agree = $('#marketing_sms_agree').is(':checked') ? 'Y' : 'N';
		var marketing_email_agree = $('#marketing_email_agree').is(':checked') ? 'Y' : 'N';
		var limit_join_agree = $('#limit_join_agree').is(':checked') ? 'Y' : 'N';
		var inactive_year = 0;//$('#inactive_year:checked').val();
		$.ajax({
			type: 'POST',
			data: {'is_social': 'Y', 'back_url' : back_url, 'third_party_agree' : third_party_agree,'marketing_sms_agree': marketing_sms_agree, 'marketing_email_agree' : marketing_email_agree, 'type_code' : type_code, 'social_type' : social_type, 'limit_join_agree' : limit_join_agree,'inactive_year':inactive_year},
			url: ('/dialog/join.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success : function(html){
				var $html = $(html);
				var $join_btn = $html.find('._join_btn');

				$join_btn.off('click').on('click', function(e){
					$join_btn
					joinSubmit(true);
					e.preventDefault();
					return false;
				});

				$.cocoaDialog.open({type : 'site_join', custom_popup : $html, hide_event : function(e){
						if(confirm(getLocalizeString('설명_가입중단경고', '', '추가정보 중 필수항목을 모두 입력해 주셔야 가입이 완료됩니다. 가입을 중단할까요?'))){
							clearOAuthData();
						}else{
							e.preventDefault();		// 다이얼로그 닫기 중단
							return false;
						}
					}});
			}
		});
	};

	var clearOAuthData = function(){		// 소셜 가입 취소 시 세션에서 OAuthData 삭제
		$.ajax({
			type: 'POST',
			url: ('/oauth/clear.cm'),
			async: true,
			cache: false,
			success: function(res){
				location.href = '/';
			}
		});
	};

	var disconnectOAuth = function(type,back_url){
		var $join_form = $('#join_form');
		$.ajax({
			type:'POST',
			data:{'type' : type},
			url:('/ajax/disconnect_oauth.cm'),
			dataType:'json',
			async:false,
			cache:false,
			success:function(res){
				if(res.msg =='SUCCESS'){
					$join_form.find('._'+type+'_disconnect').hide();
					$join_form.find('._'+type+'_connect').show();
				}else{
					alert(res.msg);
				}
			}
		});
	};

	var openGoodbye = function(){
		$.ajax({
			type: 'POST',
			data: {d: 'd'},
			url: ('/dialog/goodbye.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_goodbye', custom_popup: $html});
			}
		});
	};

	var goodbye = function(rand){
		$.ajax({
			type: 'POST',
			data: {'rand': rand},
			url: ('/ajax/goodbye.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg == 'SUCCESS'){
					if ( typeof ACE_COUNTER_PARTNER != 'undefined' ){
						if(res.ace_counter_partner_kind == 'mweb'){
							m_jn = 'withdraw';
							try{
								AM_PL('withdraw_complete.php');
							}catch(e){
							}
						}else{
							_jn = 'withdraw';
							try{
								_PL(window.location.hostname+'/withdraw_complete.php');
							}catch(e){
							}
						}
					}

					if(typeof parent.Nachocode !== 'undefined' && res.uid != '' && res.nachocode_api_key != '' && res.nachocode_api_key != 'temp-api-key') {
						(async function() {
							await parent.Nachocode.initAsync(res.nachocode_api_key);
							parent.Nachocode.push.deletePushToken(res.uid)
							.then(function() {
								window.location.href='/logout.cm';
							}, function() {
								window.location.href='/logout.cm';
							});
						})();
					}else {
						window.location.href='/logout.cm';
					}
				}else {
					alert(res.msg);
				}
			}
		});
	};
	var openInactive = function(back_url,is_social){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/member_login_inactive.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					$ianctive_login_form = $html.find("._inactive_btn");
					$ianctive_login_form.click(function(){
						$.ajax({
							type : 'POST',
							data : {
								'back_url' : back_url,
								'is_social' : is_social
							},
							url : ('/ajax/member_inactive.cm'),
							dataType : 'json',
							async : true,
							cache : false,
							success : function(res){
								if(res.msg == 'SUCCESS'){
									alert(getLocalizeString('설명_휴면상태완료', '', '휴면해제 완료 되었습니다.'));
									if(back_url != 'Y'){
										if (is_social === 'Y') {
											if (res.site_back_url != '') {
												window.parent.location.href = res.site_back_url;
											} else {
												location.reload();
											}
										}else{
											$html.append(res.form);
											var $admin_form = $html.find('#inactive_login_form');
											$admin_form.submit();
										}
									}else{
										if(res.site_back_url != '') {
											window.parent.location.href = res.site_back_url;
										}else{
											location.reload();
										}
									}
								}else{
									alert(res.msg);
								}
							}
						});
					});
					$.cocoaDialog.open({
						type : 'inactive_login', custom_popup : $html, hide_event : function(e){
							if(confirm(getLocalizeString('설명_휴면상태로그아웃', '', '휴면 상태를 유지하고 로그아웃 합니다.'))){
								SITE_TWO_FACTOR_LOGIN.clearTwoFactorLoginData();
							}else{
								e.preventDefault();	// 다이얼로그 닫기 중단
								return false;
							}
						}
					});
				}else{
					alert(res.msg);
					SITE_TWO_FACTOR_LOGIN.clearTwoFactorLoginData();
				}
			}
		});
	}
	var initJoinForm = function(country){
		$join_form = $('#join_form');
		if ( typeof country != "undefined" ) {
			$join_form.find('select[name="addr_country"]').val(country);
			changeCountry(country);
		}
	};

	var changeCountry = function(compare_country){
		if ( $join_form.find('select[name="addr_country"]').length == 0) return false;

		// 회원정보 수정일 때 선택한 국가에 맞게 안 나오는 에러 임시 처리용
		if ( compare_country.trim() === '' ) {
			compare_country = $join_form.find('select[name="addr_country"]').val();
			if ( compare_country === "") {
				changeAddressForm('');
				return false;
			}
		}

		$.ajax({
			"url": "/ajax/get_site_address_format.cm",
			"data": {"country_code": compare_country },
			"type": "POST",
			"dataType": "json",
			"success": function(res){
				changeAddressForm(res["format"]);
			}
		});
	};

	var changeAddressForm = function(format){
		var $kr_addr_form_wrap = $join_form.find('#kr_addr_form_wrap');
		var $jp_addr_form_wrap = $join_form.find('#jp_addr_form_wrap');
		var $en_addr_form_wrap = $join_form.find('#en_addr_form_wrap');
		var $tw_addr_form_wrap = $join_form.find('#tw_addr_form_wrap');
		var $vn_addr_form_wrap = $join_form.find('#vn_addr_form_wrap');
		var $hk_addr_form_wrap = $join_form.find('#hk_addr_form_wrap');

		if ( address_format !== format || true ) {
			address_format = format;
			$join_form.find('._addr_form_wrap').hide();

			switch(address_format) {
				case "KR":
					$kr_addr_form_wrap.show();
					break;
				case "TW":
					$tw_addr_form_wrap.show();
					break;
				case "3":
					$jp_addr_form_wrap.show();
					break;
				case 'VN':
					$vn_addr_form_wrap.show();
					break;
				case 'HK':
					$hk_addr_form_wrap.show();
					break;
				case "5":
					$en_addr_form_wrap.show();
					break;
			}
		}
	};

	var itemFileUpload = function($obj, code){

		$obj.fileupload({
			url : '/ajax/member_join_file_upload.cm',
			dataType : 'json',
			limitMultiFileUploads : 1,
			dropZone : null,
			maxFileSize : 20000000, //20mb
			limitMultiFileUploadSize : 100000000, //110 mb
			formData : {'code' : code},
			add : function(e, data){
				if(data.files[0].size > 50000000){
					alert(LOCALIZE.설명_최대업로드용량안내());
					return false;
				}else{
					data.submit();
				}
			},
			start : function(e, data){
				dozProgress.start();
			},
			progress : function(e, data){
			},
			done : function(e, data){
				dozProgress.done();
				var form_file = '';
				form_file = 'form_file_' + code;
				if(data.result[form_file][0].error){
					alert(data.result[form_file][0].error);
				}else{
					if(data.result[form_file][0].tmp_idx > 0){
						$obj.find('._form_file_list').show();
						$obj.find('._holder').hide();
						$obj.find('._filename').text(data.result[form_file][0].org_name);
						$obj.find('._filesize').text('(' + GetFileSize(data.result[form_file][0].size) + ')');
						$obj.find('._temp_file').val(data.result[form_file][0].tmp_idx);
						$obj.find('._upload_file').val('');
						$obj.find('._download_link').removeAttr("href");
						if(data.result[form_file][0].type.substring(0 ,5) === "image"){
							$obj.find('._image').show();
							$obj.find('._image_src').attr('src', CDN_UPLOAD_URL+data.result[form_file][0].url);
						}
					}
				}
			},
			fail : function(e, data){
			}
		})
			.find('._fileremove').click(function(){
			$obj.find('._form_file_list').hide();
			$obj.find('._holder').show();
			$obj.find('._temp_file').val('');
			$obj.find('._upload_file').val('');
			$obj.find('._image').hide();
		});
	};


	var init = function(){
		$member_profile = $('#'+member_profile_id);
	};

	var sendJoinMailAuth = function(){
		$.ajax({
			type: 'POST',
			data: '',
			url: ('/ajax/send_join_mail_auth.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === 'SUCCESS'){
					alert(getLocalizeString('설명_인증메일발송완료', '', '인증메일을 발송하였습니다.'));
				}else{
					alert(res.msg);
				}
			}
		});
	};

	var getSiteMemberCustomData = function(data, callback) {
		$.ajax({
			type: 'POST',
			url: ('/ajax/get_custom_data.cm'),
			data: {data: data},
			dataType: 'json',
			async: true,
			cache: false,
			success: callback || function (res) {
				console.log(res);
			}
		});
	};


	var current_find_tab = 'findId';
	var step = function(){
		$('.btn_find').off('click').on('click', function(){
			var tab_id = $(this).attr('data-tab');
			current_find_tab = tab_id;
			$('.btn_find').removeClass('active');
			$('._find_tit').addClass('hidden');
			$('._step').addClass('hidden');

			$(this).addClass('active');
			$('.'+tab_id).removeClass('hidden');
			$('#'+tab_id).removeClass('hidden');

			if(tab_id == 'findId'){
				$('._find_id').removeClass('hidden');
				$('._find_password').addClass('hidden');
			}else if(tab_id == 'findPassword'){
				$('._find_password').removeClass('hidden');
				$('._find_id').addClass('hidden');
			}
		});
	};

	var updateFindIdStatus = function (){
		$('._update_status').off('click').on('click', function(){
			var tab_name = $(this).attr('data-tab');

			if(tab_name == 'find_id'){
				$('._find_id').removeClass('hidden');
				$('._find_password').addClass('hidden');
			}else if(tab_name == 'find_password'){
				$('._find_password').removeClass('hidden');
				$('._find_id').addClass('hidden');
			}
		});
	};

	var initFindId = function(obj){ // 비밀번호 찾기 필요값 초기화

		// step 1
		$('input:radio[name=findIdStep01]').change(function(){
			// 가입한 이메일로 찾기 비활성화
			$('._step01_find_id_email_input_wrap').hide();
			$('._find_id_input_email').val('');

			// 가입한 휴대폰으로 찾기 비활성화
			$('._step01_find_id_name_and_phone_input_wrap').hide();
			$('._find_id_input_nick').val('');
			$('._find_id_input_call_num').val('');

			var find_id_step_01_btn_wrap = $('._find_id_step_01_btn_wrap'); // 버튼 링크 설정
			var checked_radio_val = $('input:radio[name=findIdStep01]:checked').val();
			find_id_step_01_btn_wrap.children().remove();
			switch(checked_radio_val){
				case 'find_id_email':
					$('._step01_find_id_email_input_wrap').show(); // 가입한 이메일로 찾기 영역 활성화
					$('._find_id_input_nick').val('');			   // 가입한 이메일로 찾기 입력폼의 데이터만 입력되게 나머지 값 초기화
					$('._find_id_input_call_num').val('');		   // 가입한 이메일로 찾기 입력폼의 데이터만 입력되게 나머지 값 초기화

					find_id_step_01_btn_wrap.append("<button class='btn btn-primary _update_status' data-tab='find_id' onclick=SITE_MEMBER.findSubmit('find');>"+LOCALIZE.버튼_아이디찾기()+"</button>");
					break;
				case 'find_id_name_and_phone':
					$('._step01_find_id_name_and_phone_input_wrap').show(); // 가입한 휴대폰 찾기 영역 활성화
					$('._find_id_input_email').val('');						// 가입한 휴대폰 찾기 영역 입력폼의 데이터만 입력되게 나머지 값 초기화

					find_id_step_01_btn_wrap.append("<button class='btn btn-primary _update_status' data-tab='find_id' onclick=SITE_MEMBER.findSubmit('find');>"+LOCALIZE.버튼_아이디찾기()+"</button>");
					break;
				case 'find_id_dream_security':
					if(obj.use_dream_security_v2){
						// v2
						find_id_step_01_btn_wrap.append("<button class='btn btn-primary' onclick='SITE_MEMBER.openDreamSecurityV2ForFindId();'>"+LOCALIZE.버튼_아이디찾기()+"</button>");
					}else{
						find_id_step_01_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.dream_security+">"+LOCALIZE.버튼_아이디찾기()+"</button>");
					}
					break;
				case 'find_id_mobilians':
					find_id_step_01_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.mobilians+">"+LOCALIZE.버튼_아이디찾기()+"</button>");
					break;
				case 'find_id_inicis':
					find_id_step_01_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.inicis+">"+LOCALIZE.버튼_아이디찾기()+"</button>");
					break;
				case 'find_id_combination':
					find_id_step_01_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.combination+">"+LOCALIZE.버튼_아이디찾기()+"</button>");
					break;
			}
		});

		// step3
		$('input:radio[name=findIdStep03]').change(function(){
			var find_id_step_03_btn_wrap = $('._find_id_step_03_btn_wrap'); // 버튼 링크 설정
			var checked_radio_val = $(':input:radio[name=findIdStep03]:checked').val();

			find_id_step_03_btn_wrap.children().remove();
			$('._step04_select_input.step04_select_input_id.mb0').hide();
			switch(checked_radio_val){
				case 'find_id_send_email':
					find_id_step_03_btn_wrap.append("<button class='btn btn-primary' onclick=SITE_MEMBER.findSubmit('send');>"+LOCALIZE.버튼_계속()+"</button>");
					$('._step04_select_input.step04_select_input_id.mb0').show();
					break;
				case 'find_id_dream_security':
					if(obj.use_dream_security_v2){
						// v2
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' onclick='SITE_MEMBER.openDreamSecurityV2ForFindId();'>"+LOCALIZE.버튼_계속()+"</button>");
					}else{
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.dream_security+">"+LOCALIZE.버튼_계속()+"</button>");
					}
					break;
				case 'find_id_mobilians':
					find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.mobilians+">"+LOCALIZE.버튼_계속()+"</button>");
					break;
				case 'find_id_inicis':
					find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.inicis+">"+LOCALIZE.버튼_계속()+"</button>");
					break;
				case 'find_id_combination':
					find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.combination+">"+LOCALIZE.버튼_계속()+"</button>");
					break;
			}
		});

		$('._find_id_reset_password').off('click').on('click', function(){ // 비밀번호 재설정
			current_find_tab = 'findPassword';

			$('#find_step_1').hide();
			$('#find_step_2').hide();
			$('#find_step_3').show();
			if($('._member_list_radio').css('display') == 'block'){ // 가입한 이메일로 찾기, 가입한 휴대폰으로 찾기 다수 결과 나올 경우 해당 영역 활성화 됨
				var check_member_list_radio 	  = $('input:radio[name="findIdMemberList"]:checked'); // 클라이언트가 라디오 버튼 선택한값
				var check_member_list_is_email	  = check_member_list_radio.prev().val(); 			   // 이메일 정보 있는지
				var asterisk_email = check_member_list_radio.prev().prev().val();
				var check_member_list_asterisk_id = check_member_list_radio.next().text();

				if(check_member_list_radio.val() != undefined){
					$('#token').val(check_member_list_radio.val());

					$('._result_find_data_uid').text(check_member_list_asterisk_id);
					$('._result_find_data_email').text(asterisk_email);

					if(check_member_list_is_email == 'Y'){
						$('._find_id_send_email_wrap').show();

						$('input:radio[name="findIdStep03"]')[0].click();
					}else if($('input:radio[name="findIdStep03"]')[1] == undefined){
						$('#find_step_1').hide();
						$('#find_step_2').show();
						$('#find_step_3').hide();

						$('#find_step2_info_1').hide();
						$('#find_step2_info_2').show();

						$('._result_find_data_uid').show();
						$('._member_list_radio').hide();
					}
				}
			}else if($('._one_member_login_type').length > 0){ // 조회 결과 한개만 존재하는 경우
				if($('._one_member_asterisk_email').val() == 'null'){ // 이메일 정보 없음
					$('._find_id_send_email_wrap').hide();
					if($('input:radio[name="findIdStep03"]')[1] != undefined){
						$('input:radio[name="findIdStep03"]')[1].click();
					}else{
						$('#find_step_1').hide();
						$('#find_step_2').show();
						$('#find_step_3').hide();

						$('#find_step2_info_1').hide();
						$('#find_step2_info_2').show();
					}
				}else{
					$('#token').val($('._one_member_encrypt_uid').val());

					$('._result_find_data_uid').text($('._one_member_asterisk_uid').text());
					$('._result_find_data_email').text($('._one_member_asterisk_email').val());
				}
			}else{
				if($('#token').val() != ''){ // 본인인증으로 넘어왔을 경우에는 바로 비밀번호 설정창으로 이동
					$('#find_step_1').hide();
					$('#find_step_2').hide();
					$('#find_step_3').hide();
					$('#find_step_4').show();

					$('._result_sending_email_wrap').hide();
					$('._result_update_password_wrap').show();
				}
			}

			if($('input:radio[name="findIdStep03"]')[1] != undefined && $('input:radio[name="findIdStep03"]')[1].checked){
				var find_id_step_03_btn_wrap = $('._find_id_step_03_btn_wrap'); // 버튼 링크 설정
				var checked_radio_val = $(':input:radio[name=findIdStep03]:checked').val();

				find_id_step_03_btn_wrap.children().remove();
				switch(checked_radio_val){
					case 'find_id_send_email':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' onclick=SITE_MEMBER.findSubmit('send');>"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_dream_security':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.dream_security+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_mobilians':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.mobilians+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_inicis':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.inicis+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_combination':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.combination+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
				}
			}

			$('._find_password').addClass('active');
			$('._find_password').removeClass('hidden');

			$('._find_id').addClass('hidden');
			$('._find_id').removeClass('active');

		});

		$('._find_id_detail').off('click').on('click', function(){ // 정확한 아이디가 기억나지 않아요! 영역
			current_find_tab = 'findId';

			$('#find_step_1').hide();
			$('#find_step_2').hide();
			$('#find_step_3').show();
			if($('._member_list_radio').css('display') == 'block'){ // 가입한 이메일로 찾기, 가입한 휴대폰으로 찾기 다수 결과 나올 경우 해당 영역 활성화 됨
				var check_member_list_radio = $('input:radio[name="findIdMemberList"]:checked'); // 가입한 휴대폰으로 찾기로 생성된 라디오 버튼
				var check_member_list_is_email = check_member_list_radio.prev().val(); 			   // 이메일 정보 있는지
				var asterisk_email = check_member_list_radio.prev().prev().val();
				var check_member_list_asterisk_id = check_member_list_radio.next().text();

				if(check_member_list_radio.val() != undefined){
					$('#token').val(check_member_list_radio.val());

					$('._result_find_data_uid').text(check_member_list_asterisk_id);
					$('._result_find_data_email').text(asterisk_email);

					if(check_member_list_is_email == 'Y'){
						$('._find_id_send_email_wrap').show();

						$('input:radio[name="findIdStep03"]')[0].click();

					}else if($('input:radio[name="findIdStep03"]')[1] == undefined){
						$('#find_step_1').hide();
						$('#find_step_2').show();
						$('#find_step_3').hide();

						$('#find_step2_info_1').hide();
						$('#find_step2_info_2').show();

						$('._result_find_data_uid').show();
						$('._member_list_radio').hide();
					}
				}
			}else if($('._one_member_login_type').length > 0){ // 조회 결과 한개만 존재하는 경우
				if($('._one_member_asterisk_email').val() == 'null'){ // 이메일 정보 없음
					$('._find_id_send_email_wrap').hide();
					if($('input:radio[name="findIdStep03"]')[1] != undefined){
						$('input:radio[name="findIdStep03"]')[1].click();
					}else{
						$('#find_step_1').hide();
						$('#find_step_2').show();
						$('#find_step_3').hide();

						$('#find_step2_info_1').hide();
						$('#find_step2_info_2').show();
					}
				}else{
					$('#token').val($('._one_member_encrypt_uid').val());

					$('._result_find_data_uid').text($('._one_member_asterisk_uid').text());
					$('._result_find_data_email').text($('._one_member_asterisk_email').val());
				}
			}else{
				if($('#token').val() != ''){ // 본인인증으로 넘어왔을 경우에는 바로 비밀번호 설정창으로 이동
					$('#find_step_1').hide();
					$('#find_step_2').hide();
					$('#find_step_3').hide();
					$('#find_step_4').show();

					$('._result_sending_email_wrap').hide();
					$('._result_update_password_wrap').show();
				}
			}

			if($('input:radio[name="findIdStep03"]')[1] != undefined && $('input:radio[name="findIdStep03"]')[1].checked){
				var find_id_step_03_btn_wrap = $('._find_id_step_03_btn_wrap'); // 버튼 링크 설정
				var checked_radio_val = $(':input:radio[name=findIdStep03]:checked').val();

				find_id_step_03_btn_wrap.children().remove();
				switch(checked_radio_val){
					case 'find_id_send_email':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' onclick=SITE_MEMBER.findSubmit('send');>"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_dream_security':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.dream_security+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_mobilians':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.mobilians+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_inicis':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.inicis+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
					case 'find_id_combination':
						find_id_step_03_btn_wrap.append("<button class='btn btn-primary' "+obj.auth_anchor_list.combination+">"+LOCALIZE.버튼_계속()+"</button>");
						break;
				}
			}

			$('._find_id').addClass('active');
			$('._find_id').removeClass('hidden');

			$('._find_password').addClass('hidden');
			$('._find_password').removeClass('active');

		});

		// 모바일로 본인인증 했을 경우
		if(obj.use_mobile_auth == 'Y'){
			$('._result_find_data_uid').text(obj.result_email);			// 아이디 결과값 입력

			$('#find_step_1').hide();
			$('#find_step_2').show();
			$('#find_step_3').hide();

			$('._find_id_detail').hide();
		}
	};

	var createRecommendCode = function(callback){
		var is_create_recommend_code = false;
		if(!is_create_recommend_code){
			$.ajax({
				type : 'POST',
				url : ('/ajax/create_recommend_code.cm'),
				dataType : 'json',
				async : true,
				cache : false,
				success : function(res){
					is_create_recommend_code = true;
					if(res.msg === 'SUCCESS'){
						callback(res.recommend_code);
					}else{
						alert(res.msg)
					}
				}
			});
		}

	};

	var setSyncJoinInterLock = function(){
		var $interlock_form = $("#interlock_form");
		var progress = false;
		$interlock_form.find("._sync_btn").click(function(){

			if(!progress){
				progress = true;
				var data = $interlock_form.serializeObject();
				$.ajax({
					type : 'POST',
					data : data,
					url : ('/ajax/sync_join_interlock.cm'),
					dataType : 'json',
					async : true,
					cache : false,
					success : function(res){
						progress = false;
						if(res.msg === 'SUCCESS'){
							location.reload();
						}else{
							alert(res.msg)
						}
					}
				});
			}

		});


	};

	var kakaoSyncJoin = function(join_type_code,back_url){
		$.ajax({
			type : 'POST',
			data : {
				type_code : join_type_code,
				back_url  : back_url
			},
			url : ('/backpg/kakao_sync_join.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg === 'SUCCESS'){
					location.href = res.url;
				}else{
					if(res.msg === 'NEED_ADMIN_CONFIRM'){
						alert(getLocalizeString('설명_가입승인되지않은아이디입니다', '', '가입승인 대기 중입니다. 운영자의 승인 후 이용하실 수 있습니다.'));
						location.href = res.url;
					}else{
						alert(res.msg);
					}
				}
			}
		});
	};
		var unauthMemberModal = function(){
			$.ajax({
				type: 'POST',
				data: {},
				url: ('/dialog/unauth_member_processing.cm'),
				dataType: 'html',
				async: false,
				cache: false,
				success: function (res) {
					var $html = $(res);
					$.cocoaDialog.open({type:'site_join',custom_popup:$html, close_block :'undefined'});
				}
			});
		};
	return {
		init : function(){
			init();
		},
		unauthMemberModal : function(type){
			unauthMemberModal(type);
		},
		showMemberProfile : function(o){
			showMemberProfile(o);
		},
		checkRequireOption : function(){
			return checkRequireOption();
		},
		openLogin : function(back_url, type, callback, used_login_btn, page_type){
			openLogin(back_url, type, callback, used_login_btn, page_type);
		},
		openGuestLogin : function(back_url){
			openGuestLogin(back_url);
		},
		openJoin : function(back_url, type, type_code){
			openJoin(back_url, type, type_code);
		},
		openJoinWithoutTerms : function(third_party, marketing_sms_agree, marketing_email_agree, back_url, type_code){
			openJoinWithoutTerms(third_party, marketing_sms_agree, marketing_email_agree, back_url, type_code);
		},
		openJoinPatternChoice : function(back_url, request_page, social_type){
			openJoinPatternChoice(back_url, request_page, social_type);
		},
		openJoinTypeChoice : function(back_url, request_page, type_code){
			openJoinTypeChoice(back_url, request_page, type_code);
		},
		joinSubmit : function(is_social){
			joinSubmit(is_social);
		},
		joinSubmitByAgree : function(){
			joinSubmitByAgree();
		},
		joinSubmitByJoinPattern : function(join_type_code){
			joinSubmitByJoinPattern(join_type_code);
		},
		editProfile : function(backurl){
			editProfile(backurl);
		},
		openFindPassword : function(){
			openFindPassword();
		},
		findSubmit : function(s){
			findSubmit(s);
		},
		openChangePassword : function(c, r, s, type){
			openChangePassword(c, r, s, type);
		},
		changePassword : function(){
			changePassword();
		},
		openDreamSecurityV2Window : function(){
			openDreamSecurityV2Window();
		},

		openDRMOKWindow : function(req_info, cpid, rtn_url){
			openDRMOKWindow(req_info, cpid, rtn_url);
		},

		openMOBILIANSWindow : function(CI_SVCID, Tradeid, Okurl, call_back_data){
			openMOBILIANSWindow(CI_SVCID, Tradeid, Okurl, call_back_data);
		},

		// 신규 인증창 방식 (서버방식)
		openMOBILIANSWindow2 : function(CI_SVCID, Tradeid, Okurl, call_back_data, Notiurl, Cryptstring){
			openMOBILIANSWindow2(CI_SVCID, Tradeid, Okurl, call_back_data, Notiurl, Cryptstring);
		},

		openINICISWindow : function(mid, Tradeid ,Okurl, call_back_data){
			openINICISWindow(mid, Tradeid ,Okurl, call_back_data);
		},

		openCOMBINATIONAUTHTYPESWindow : function(mid, mTxId, return_url, auth_hash){
			openCOMBINATIONAUTHTYPESWindow(mid, mTxId, return_url, auth_hash);
		},

		showJoinForm : function(){
			showJoinForm();
		},
		openAppAction : function(isLogin){
			openAppAction(isLogin);
		},
		openLoginOrModifyDialogByLoginStatus : function(){
			openLoginOrModifyDialogByLoginStatus();
		},
		isDialogOpen : function(){
			isDialogOpen();
		},
		openAgreeSocialJoin : function(back_url, type_code, type){
			openAgreeSocialJoin(back_url, type_code, type);
		},
		openSocialJoin : function(back_url, type_code,social_type){
			openSocialJoin(back_url, type_code, social_type);
		},
		clearOAuthData : function(){
			clearOAuthData();
		},
		'disconnectOAuth' : function(type,back_url){
			disconnectOAuth(type,back_url);
		},
		'openGoodbye' : function(){
			openGoodbye();
		},
		'goodbye' : function(rand){
			goodbye(rand);
		},
		'openInactive' : function(back_url,is_social){
			openInactive(back_url,is_social);
		},
		'initJoinForm' : function(country){
			initJoinForm(country);
		},
		'changeCountry' : function(compare_country){
			changeCountry(compare_country);
		},
		itemFileUpload : function($obj, code){
			itemFileUpload($obj, code);
		},
		'sendJoinMailAuth' : function(){
			sendJoinMailAuth();
		},
		'getSiteMemberCustomData': function(data, callback) {
			getSiteMemberCustomData(data, callback);
		},
		'step' : function(){
			step()
		},
		'updateFindIdStatus' : function(){
			updateFindIdStatus()
		},
		'initFindId' : function(obj){
			initFindId(obj)
		},
		'createRecommendCode' : function(callback){
			createRecommendCode(callback);
		},
		'setSyncJoinInterLock' : function(){
			setSyncJoinInterLock();
		},
		'kakaoSyncJoin' : function(join_type_code,back_url){
			kakaoSyncJoin(join_type_code,back_url);
		},
		'openDreamSecurityV2ForFindId' : function(){
			openDreamSecurityV2ForFindId();
		},
		'openDreamSecurityV2ForAdult' : function(){
			openDreamSecurityV2ForAdult();
		}
	};
}();

$(function() {
	SITE_MEMBER.init();
});