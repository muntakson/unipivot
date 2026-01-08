var SITE_FORM = function(){
	var init = function(){
	};

	var itemFileUpload = function($obj, code){
		$obj.fileupload({
			url : '/ajax/form_file_upload.cm',
			dataType : 'json',
			singleFileUploads : false,
			limitMultiFileUploads : 1,
			dropZone : null,
			maxFileSize : 100000000, //100mb
			limitMultiFileUploadSize : 110000000, //110 mb
			formData : {'code' : code},
			add : function(e, data){
				if(data.files[0].size > 100000000){
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
					showModal('error',data.result[form_file][0].error);
				}else{
					if(data.result[form_file][0].tmp_idx > 0){
						$obj.find('._form_file_list').show();
						$obj.find('._holder').hide();
						$obj.find('._filename').text(data.result[form_file][0].org_name);
						$obj.find('._filesize').text('(' + GetFileSize(data.result[form_file][0].size) + ')');
						$obj.find('._temp_file').val(data.result[form_file][0].tmp_idx);
						$obj.find('._upload_file').val('');
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
		});
	};

	var itemRequiredCk = function($obj){
		var required_ck = true;
		$obj.find('.form-group').each(function(){
			var $form_group = $(this);
			var type = this.id.split('_');
			if($form_group.find('label i').hasClass('icon-required') === true){ // 필수입력 항
				switch(type[0]){
					case 'privacy':
						if($form_group.find("input").is(":checked") === false){
							required_ck = 'privacy_required';
							return false;
						}
						break;
					case 'thirdparty':
						if($form_group.find('input').is(":checked") === false){
							required_ck = 'third_party_required';
							return false;
						}
						break;
					case 'input':
						if(!$form_group.find('input').val()){
							required_ck = false;
							return false;
						}
						break;
					case 'textarea':
						if(!$form_group.find('textarea').val()){
							required_ck = false;
							return false;
						}
						break;
					case 'radio':
						if(!$form_group.find('input:radio[name="' + this.id + '"]:checked').val()){
							required_ck = false;
							return false;
						}
						//기타 옵션 직접입력란 null체크
						$($form_group.find('input:radio[name="' + this.id + '"]').each(function(){
							if($(this).is(":checked") === true){
								if($(this).data('type') === 'etc'){
									if($form_group.find("input:text[name='" + type[0] + "_etc_" + type[1] + "']").val() === ''){
										required_ck = 'etc_null';
										return false;
									}
								}
							}
						}));
						break;
					case 'checkbox':
						if($form_group.find("input:checkbox[name='" + this.id + "[]']").is(":checked") === false){
							required_ck = false;
							return false;
						}

						//기타 옵션 직접입력란 null체크
						$form_group.find("input:checkbox[name='" + this.id + "[]']").each(function(){
							if($(this).is(":checked") === true){
								if($(this).data('type') === 'etc'){
									if($form_group.find("input:text[name='" + type[0] + "_etc_" + type[1] + "']").val() === ''){
										required_ck = 'etc_null';
										return false;
									}
								}
							}
						});
						break;
					case 'file':
						if(!$obj.find("input[name='temp_files_" + type[1] + "']").val()){
							if(!$obj.find("input[name='upload_files_" + type[1] + "']").val()){
								required_ck = false;
								return false;
							}
						}
						break;
					case 'phonenumber':
						$form_group.find('input:not([type="text"])').each(function(){
							if(!$(this).val()){
								required_ck = false;
								return false;
							}
						});
						break;
					case 'email':
						if(!$form_group.find('input').val()){
							required_ck = false;
							return false;
						}
						break;
					case 'datetime':
						$form_group.find('input').each(function(){
							if(!$(this).val()){
								required_ck = false;
								return false;
							}
						});
						break;
					case 'address':
						$form_group.find('input').each(function(){
							if(!$(this).val()){
								required_ck = false;
								return false;
							}
						});
						break;
					case 'select':
						$form_group.find('select').each(function(){
							if(!$(this).val()){
								required_ck = false;
								return false;
							}
						});
						break;
				}
			}else{ // 필수입력 항목이 아닌
				switch(type[0]){
					case 'checkbox' :
						//기타 옵션 직접입력란 null체크
						$form_group.find("input:checkbox[name='" + this.id + "[]']").each(function(){
							if($(this).is(":checked") === true){
								if($(this).data('type') === 'etc'){
									if($form_group.find("input:text[name='" + type[0] + "_etc_" + type[1] + "']").val() === ''){
										required_ck = 'etc_null';
										return false;
									}
								}
							}
						});
						break;
					case 'radio' :
						//기타 옵션 직접입력란 null체크
						$form_group.find("input:radio[name='" + this.id + "']").each(function(){
							if($(this).is(":checked") === true){
								if($(this).data('type') === 'etc'){
									if($form_group.find("input:text[name='" + type[0] + "_etc_" + type[1] + "']").val() === ''){
										required_ck = 'etc_null';
										return false;
									}
								}
							}
						});
						break;
				}
			}
			if(required_ck === 'etc_null'){
				return false;
			}
			// 입력폼 체크박스 갯수 제한 추가
			if(type[0] == 'checkbox'){
				var checkmax = $('#'+this.id).attr('check-limit');
				if(checkmax > 0 && ($form_group.find("input:checkbox[name='" + this.id + "[]']:checked").length > checkmax)){
					required_ck = 'checkbox_limit_'+checkmax;
					return false;
				}
			}
		});
		return required_ck;
	};

	var itemEtcSetting = function(widget_code, item_code, type){
		var $obj = $('#addForm' + widget_code);
		var $target = $obj.find('#' + type + '_' + item_code);
		if($target.length > 0){
			var $etc_input = $target.find('input[name="' + type + '_etc_' + item_code + '"]');
			var $etc_btn = $target.find('input[data-type=etc]');
			$etc_input.off('keyup').on('keyup', function(){
				if($etc_input.val() != ''){
					if(!$etc_btn.prop('checked')){
						$etc_btn.click();
					}
				}
			})
		}
	}

	var is_submitting= false;
	var form_url_data = {};
	var submit = function(widget_code, callback){
		var $obj = $('#addForm' + widget_code);
		if(!is_submitting){
			is_submitting = true;
			$.ajax({
				type : 'POST',
				data : $obj.serialize(),
				url : ('/ajax/form_add.cm'),
				dataType : 'json',
				async : true,
				cache : false,
				success : function(result){
					is_submitting=false;
					if(result.msg == 'SUCCESS'){
						if ( typeof FB_PIXEL != 'undefined' && result.fb_registration_check == 'Y') FB_PIXEL.CompleteRegistration('form',result.currency);
						if ( typeof DAUM_CTS != 'undefined' && result.daum_registration_check) DAUM_CTS.OrderForm();
						if ( typeof NP_LOG != 'undefined' ) NP_LOG.EtcPage();
						if ( typeof GOOGLE_ADWORDS_TRACE != 'undefined' && result.google_registration_check) GOOGLE_ADWORDS_TRACE.EtcTrace(result.google_registration_id);
						if ( typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.CompleteSubmit();

						//입력폼 입력후 이동 URL 데이터 보관
						form_url_data = result.form_url_data;

						//완료 메세지 변경
						if(result.form_add_end_msg.trim() != ''){
							showModal('complete',result.form_add_end_msg, widget_code);
						}

						if(typeof callback === 'function'){
							callback();
						}



					}else{
						showModal('error',result.msg, widget_code);
					}
				}
			});
		}
	};

	var confirmInputForm = function(widget_code, modify_permit){
		var $obj = $('#addForm' + widget_code);
		var chk_res = itemRequiredCk($obj);
		if(chk_res === true){
			if(modify_permit === 'N'){ //응답수정 허용 off
				submit(widget_code,function(){
					showModal('complete',null,widget_code);
				});
			}else{ //응답수정 허용 on
				showModal('complete',null,widget_code);
			}
		}else{
			if(chk_res === "privacy_required"){
				showModal('error',LOCALIZE.설명_개인정보처리방침에동의하여주시기바랍니다(), widget_code);
			} else if(chk_res == 'third_party_required'){
				showModal('error',LOCALIZE.설명_개인정보제3자제공에동의하여주시기바랍니다(), widget_code);
			} else if(chk_res === 'etc_null'){
				showModal('error', getLocalizeString('설명_기타선택의직접입력부분입력', '', '직접 입력란을 입력해 주세요.'), widget_code);
			} else {
				var checkbox_reg = /^checkbox_limit_[0-9]{1,}$/;
				if(checkbox_reg.test(chk_res)){
					chk_res = chk_res.replace(/[^0-9]/g,'');
					showModal('error',LOCALIZE.설명_최대n개까지선택가능합니다(chk_res), widget_code);
				}else{
					showModal('error',LOCALIZE.설명_필수항목을입력하여주시기바랍니다(), widget_code);
				}
			}
		}
	};

	var hideModal = function(){
		//$('#input_form_complete_modal').hide();
		var $body = $('body');
		$('.modal.in.modal_site_alert').hide();
		$body.toggleClass('site_alert_open', false);
	};

	var showModal = function(type,msg,widget_code){
		hideModal();
		var modal_target;
		var $body = $('body');
		$body.toggleClass('site_alert_open', true);
		if(type == 'complete'){
			modal_target = 'input_form_complete_modal_' + widget_code;
		} else {
			modal_target = 'input_form_error_modal_' + widget_code;
		}
		if(msg != undefined && msg.trim() != ''){
			$('#'+modal_target+' .modal-content .container-fluid p').html(msg);
			if(type == 'complete'){

				var form_url_link = ' onclick="SITE_FORM.completeMoveUrl()"';

				$('#'+modal_target+' .btn-group-justified').html('<a '+form_url_link+' class="btn right" >'+LOCALIZE.버튼_확인()+'</a>');
			}
		}
		$('#'+modal_target).show();
	};

	var completeMoveUrl = function(){
		hideModal();

		if(form_url_data.form_url !== ''){

			if(form_url_data.new_window === 'Y'){
				window.open(form_url_data.form_url, '_blank');
				location.reload();
			}else{
				window.open(form_url_data.form_url, '_self');
			}
		}else{
			location.reload();
		}


	};

	var onlyNumber = function(){
		$("._only_number").on('keydown').check_callnum();
	};

	/**
	 * 국제 번호 검색창 연결
	 * @param widget_code		대시보드 컨텐츠 관리에서는 ''
	 * @param item_code
	 * @param country_code
	 */
	var setDialNumber = function(widget_code, item_code,country_code){
		var $obj = $('#addForm' + widget_code);
		var imgMap = {};
		var imgCountryCode = {};
		var $phone = $obj.find('._phone_' + item_code);
		var $phonenumber = $obj.find('#phonenumber_' + item_code);
		$phone.find("option").filter(function(){
			return $(this).text();
		}).each(function(i) {
			imgMap[i] = $(this).attr("data-img-src");
			imgCountryCode[i] = $(this).attr("data-country-code");

			imgMap[imgCountryCode[i]]=imgMap[i];
		});
		$phone.chosen({
			allow_single_deselect : true,
			search_contains : true,
			no_results_text : getLocalizeString('설명_검색결과가없습니다', '', '검색 결과가 없습니다.') + " : ",
			placeholder_text_single : getLocalizeString('설명_국가선택', '', '국가 선택'),
			width: 'auto'
		});
		var $chosen = $phone.next('.chosen-container');
		var touchStartY, touchEndY, touchStartScrollTop;
		$chosen.on('click.chosen, mousedown.chosen, keyup.chosen, touchstart.chosen', function(event){
			var $chosen_search_input = $chosen.find('.chosen-search input');
			var now_country_code = $phonenumber.find('input[name="phone_country_' + item_code + '"]').val();
			var now_country_index = 0;
			$chosen_search_input.attr('placeholder', getLocalizeString('설명_검색어를입력하세요', '', '검색어를 입력하세요.'));
			var $chosen_result = $chosen.find('.chosen-results');
			var $chosen_result_li = $chosen_result.find('li');
			$chosen_result_li.each(function() {
				var $that = $(this);
				if($that.find('.flag').length === 0){
					// allow_single_deselect 옵션에 의해 초기값이 제외되어 index가 하나씩 밀림
					var imgIndex = $that.attr('data-option-array-index') - 1;
					if(imgMap[imgIndex]){
						// 레이아웃 중앙 정렬 문제로 태그 구조 변경
						// 국가명과 국제 번호 분리(국제 번호도 검색 내용에 포함시킴)
						var text = $that.text();
						var splited_text = text.split('+');
						var $div = $('<div></div>');
						$div.html('<span>' + splited_text[0] + '</span><span class="opacity-50" data-title="dial">+' + splited_text[1] + '</span>');
						// 국기 추가
						var $flag = $('<span class="flag" data-title="flag" data-country-code="'+imgCountryCode[imgIndex]+'" data-img-src="' + imgMap[imgIndex] + '"></span>').css('background-image', 'url("' + imgMap[imgIndex] + '")');
						$div.prepend($flag);
						$that.html($div);
						if(now_country_code != '' && imgCountryCode[imgIndex] === now_country_code){
							now_country_index = imgIndex;
						}
					}
				}
			});
			$chosen_result_li.off('click.chosen_result').on('click.chosen_result', function(event){
				selectDial(event.target);
			});
			// 엔터에 대한 케이스
			if (event.type === 'keyup' && event.key === 'Enter') {
				const $selected = $(event.currentTarget).find('.chosen-results .active-result.result-selected');

				// 선택된 것이 1개일 경우
				if ($selected.length === 1) {
					selectDial($selected);
				}

				/**
				 * Notice:
				 * 	엔터로 선택 시 선택된 요소가 2개가 존재하는 경우가 있음
				 * 	기존 선택을 필터하기 위해 아래와 같이 처리함
				 * 	만약, 3개 이상인 경우가 발생될 경우 수정 필요
				 */
				if ($selected.length > 1) {
					const $target = $(event.currentTarget)
						.find('.chosen-results .active-result.result-selected')
						.filter(function() {
							const targetCountryCode = $(this).find('span[data-title="flag"]').attr('data-country-code') || '';

							return targetCountryCode !== now_country_code;
						});

					selectDial($target);
				}
			}
			if(now_country_index > 0){
				// 선택된 국기를 상위에 표시
				$chosen_result.scrollTop($($chosen_result_li[now_country_index]).offset().top - $($chosen_result_li[0]).offset().top);
			}
			if(IS_MOBILE){
				$chosen_result.off('touchstart.chosen_result').on('touchstart.chosen_result', function(event){
					touchStartY = event.originalEvent.touches[0].pageY;
					touchEndY = touchStartY;
					touchStartScrollTop = $(this).scrollTop();
				});
				$chosen_result.off('touchmove.chosen_result').on('touchmove.chosen_result', function(event){
					touchEndY = event.originalEvent.touches[0].pageY;
					// 터치 스크롤
					$(this).scrollTop(touchStartScrollTop + (touchStartY - touchEndY));
				});
				$chosen_result.off('touchend.chosen_result').on('touchend.chosen_result', function(event){
					// 터치 시작과 끝이 10px 이하일 때 탭으로 간주
					if(Math.abs(touchStartY - touchEndY) < 10){
						selectDial(event.target);
						$chosen.removeClass('chosen-container-active chosen-with-drop');
						$chosen_search_input.val('');
					}
				});
			}

			function selectDial($target){
				$phonenumber.find(".chosen-single").show();
				var $target = $($target).closest('#phonenumber_' + item_code + ' .chosen-results li');
				if($target.length > 0){
					var flag = $target.find('span[data-title="flag"]').attr('data-img-src') || '';
					var dial = $target.find('span[data-title="dial"]').text();
					var country_code = $target.find('span[data-title="flag"]').attr('data-country-code')|| '';
					if(dial){
						if(flag){
							var $flag = $('<span class="flag" data-title="flag"></span>').css('background-image', 'url("' + flag + '")');
							$phonenumber.find(".chosen-single > span").html("<span>"+ dial +"</span>").prepend($flag);
							$phonenumber.find('input[name=phonenumber1_'+ item_code+']').val(dial.replace('+',''));
							$phonenumber.find('input[name=phone_country_'+ item_code+']').val(country_code);
						}else{
							$phonenumber.find(".chosen-single > span").html(dial);
							$phonenumber.find('input[name=phonenumber1_'+ item_code+']').val(dial.replace('+',''));
							$phonenumber.find('input[name=phone_country_'+ item_code+']').val(country_code);
						}
						$phone.val(dial);
					}
				}
			}
		});
		if(IS_MOBILE){
			$chosen.on('touchstart.chosen', function(){
				// 모바일에서 자동으로 focus 되어 가상 키보드가 올라오지 않도록 처리
				var $chosen_search_input = $chosen.find('.chosen-search input');
				$chosen_search_input.blur();
				$chosen_search_input.off('touchend.chosen_search').on('touchend.chosen_search', function(){
					$chosen_search_input.focus();
				})
			})
		}

		//대시보드 : 수정시 번호가 존재할 경우
		var dial_number = $phone.val();
		var $phonenumber1_val = $('<input type="hidden" name="phonenumber1_'+item_code+'" value='+ dial_number +'>');
		var $phone_country_val = $('<input type="hidden" name="phone_country_'+item_code+'" value='+ country_code +'>');
		$phonenumber.prepend($phonenumber1_val);
		$phonenumber.prepend($phone_country_val);
		if(dial_number != ""){
			var $flag = $('<span class="flag" name="flag"></span>').css('background-image', 'url("' + imgMap[country_code] + '")');
			$phonenumber.find(".chosen-single span").html("<span> +" + dial_number + "</span>").prepend($flag);
		}
	};

	return {
		init:function(){
			init();
		},
		itemFileUpload:function($obj,$code){
			itemFileUpload($obj,$code);
		},
		itemRequiredCk:function($obj){
			return itemRequiredCk($obj);
		},
		itemEtcSetting:function(widget_code, item_code, type){
			return itemEtcSetting(widget_code, item_code, type);
		},
		submit:function(widget_code){
			return submit(widget_code);
		},
		confirmInputForm:function(widget_code, modify_permit){
			return confirmInputForm(widget_code, modify_permit);
		},
		hideModal:function(){
			return hideModal();
		},
		onlyNumber: function(){
			return onlyNumber();
		},
		completeMoveUrl : function(){
			return completeMoveUrl();
		},
		setDialNumber : function(widget_code, item_code,country_code){
			return setDialNumber(widget_code, item_code,country_code);
		}
	}
}();