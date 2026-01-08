var SITE_BOOKING = function(){
	var $booking_wrap, $booking_content_wrap, $booking_view_calendar, $day_booking_wrap, $prod_image_list, $prod_image_list_rolling, $cuurent_day_obj, $prod_detail_wish_count, $prod_detail_content;
	var data;
	var target_month, select_day, start_day, end_day;
	var start_time, end_time;
	var unselected_end_day = false;
	var restore_end_day = false;
	var idx = 0;
	var current_content_tab = '';
	var duration_type = '';		// 예약 기간 타입
	var min_day = 0;		// 예약 최대 일
	var max_day = 0;		// 예약 최대 일
	var day_list = [];		// 날짜 리스트
	var add_order_progress_check = false;
	var is_admin = false;
	var cm_data = {};
	var $mfe_booking_wrap;

	var person_num;
	var init_list = function(d){
		data = d;
		$booking_wrap = $('#'+data.code+' ._booking_wrap');
		$booking_view_calendar = $('#'+data.code+' ._booking_view_calendar');
		runMobileCalendar($booking_wrap);
	};
	var init_calendar = function(d){
		data = d;
		$mfe_booking_wrap = $('#'+ data.code + ' ._clay_calendar_root');

		$.ajax({
			type : 'POST',
			url : ('/booking/html_mfe_list.cm'),
			dataType : 'html',
			success : function(html){
				// magnet-shell이 없으면 전체 HTML을 삽입
				$mfe_booking_wrap.html('');
				const range = document.createRange();
				const $booking_html = range.createContextualFragment(html);
				$mfe_booking_wrap[0].append($booking_html);
			}
		});
	};

	var init_view = function(no,d,st,s,e, dt, mid,mxd,ia ,_cm_data){
		idx = no;
		data = d;
		duration_type = dt;
		min_day = mid;
		max_day = mxd;
		start_day = s;
		start_time = parseInt(st);
		end_day = e;
		end_time = 2;
		is_admin = ia;
		cm_data = $.extend(cm_data,_cm_data);
		$booking_content_wrap = $('#'+data.code+' ._booking_content_wrap');
		$booking_view_calendar = $('#'+data.code+' ._booking_view_calendar');
		$day_booking_wrap = $('#'+data.code+' ._day_booking_wrap');
		$prod_detail_wish_count = $('#'+data.code+' #prod_detail_wish_count');
		$prod_detail_content = $('#'+data.code+' #prod_detail_content');
		$prod_image_list = $("#prod_image_list");
		$prod_image_list_rolling = $prod_image_list.find("._detail_image");
		if(duration_type == 'day' && !is_admin) {
			const $onElement = $booking_view_calendar.find('.on');

			if ($onElement.length) {
				clickViewCalendar($onElement);		// 예약 기간 타입이 일자단위일 경우 오늘 날짜를 자동으로 선택시킴
			}
		}
		runViewCalendar($booking_view_calendar);
		startProdImageRolling();
		current_content_tab = 'detail';
		$booking_content_wrap.find('a._' + current_content_tab).addClass('on');
	};

	var runViewCalendar = function($obj){

		$booking_view_calendar = $('._booking_view_calendar');

		day_list = [];
		$booking_view_calendar.find('.booking_day').each(function(k, v){
			day_list.push($(v));
		});

		$booking_view_calendar.find('._day_item').off('click').on('click',function(){
			clickViewCalendar($(this));
		});
		$booking_view_calendar.find('._check_out_item').off('click').on('click',function(){
			clickCheckOutViewCalendar($(this));
		});

	};

	var getValidateDay = function(){
		// 클래스 초기화
		$booking_view_calendar.find('._temp_day_item').addClass('check_out_item');
		$booking_view_calendar.find('._temp_day_item').addClass('_check_out_item');
		$booking_view_calendar.find('._temp_day_item').addClass('full_day');
		$booking_view_calendar.find('._temp_day_item').removeClass('_day_item');
		$booking_view_calendar.find('._temp_day_item').removeClass('_temp_day_item');

		for(var i in day_list){
			if(day_list[i].hasClass('on') === true){		// 입실 날짜의 위치를 구함
				var key = 0;
				var full_day_cnt = 0;
				for(var i2 = min_day; i2 <= max_day; i2++){		// 최대 예약일 만큼 반복
					key = Number(i) + Number(i2);
					if(day_list[key].hasClass('full_day') === true){		// 입실 날짜와 최대 에약일 사이에 있는 다른 예약의 입실 날짜를 예약 가능상태로 변경
						day_list[key].removeClass('check_out_item');
						day_list[key].removeClass('_check_out_item');
						day_list[key].removeClass('full_day');
						day_list[key].addClass('_temp_day_item');
						day_list[key].addClass('_day_item');
						full_day_cnt++;
					}

					if(full_day_cnt === 1) break;		// 입실 날짜가 아닌 날의 경우 가능상태로 변경하지 않음
				}
				break;
			}
		}
	};

	var clickCheckOutViewCalendar = function($day_obj){
		end_time = $day_obj.data('stamp');
		if(start_time <end_time){
			if(start_day != '' && end_day ==''){ //종료일을 선택
				unselected_end_day = false;
				end_day = $day_obj.data('date');
				end_time = $day_obj.data('stamp');
				restore_end_day = false;
				getViewBookingDetail($day_obj);
			}
		}
	};

	var clickViewCalendar = function($day_obj){
		end_time = $day_obj.data('stamp');
		if(start_time <end_time){
			if(start_day != '' && end_day ==''){ //종료일을 선택
				unselected_end_day = false;
				end_day = $day_obj.data('date');
				end_time = $day_obj.data('stamp');
				if(max_day == 1 && duration_type == 'day'){
					start_day = $day_obj.data('date');
					start_time = $day_obj.data('stamp');
					end_day = start_day;
					end_time = start_time;
				}
				restore_end_day = false;
			}else if(start_day != '' && end_day != ''){ //다시 조정
				if(duration_type != 'day'){		// 예약 기간 타입이 1박 단위일 경우
					unselected_end_day = true;
					start_day = $day_obj.data('date');
					start_time = $day_obj.data('stamp');
					restore_end_day = false;
					end_day = '';
					$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
					$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
					$day_obj.addClass('on');
					getValidateDay();
				}else{		// 예약 기간 설정이 1일 단위일 경우 날짜 선택시 종료일을 복구하지 않음
					start_day = $day_obj.data('date');
					start_time = $day_obj.data('stamp');
					restore_end_day = false;
					end_day = '';
					end_time = '';
					$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
					$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
					$day_obj.addClass('on');
				}
			}
		}else{
			if(duration_type != 'day'){		// 예약 기간 타입이 1박 단위일 경우
				unselected_end_day = true;
				start_day = $day_obj.data('date');
				start_time = $day_obj.data('stamp');
				restore_end_day = false;
				end_day = '';
				end_time = '';
				$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
				$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
				$day_obj.addClass('on');
				getValidateDay();
			}else{		// 예약 기간 설정이 1일 단위일 경우 날짜 선택시 종료일을 복구하지 않음
				start_day = $day_obj.data('date');
				start_time = $day_obj.data('stamp');
				restore_end_day = false;
				end_day = '';
				end_time = '';
				$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
				$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
				$day_obj.addClass('on');
			}
		}
		getViewBookingDetail($day_obj);
	};

	var getViewBookingDetail = function($day_obj){
		$cuurent_day_obj = $day_obj;

		var $booking_f = $('#booking_f');
		var f_data = $booking_f.serializeObject();
		var data = {'idx':idx,'start_day' : start_day, 'end_day':end_day, 'person':person_num};
		data = $.extend(f_data,data);
		$.ajax({
			type : 'POST',
			data : data,
			url : ('/booking/html_day_booking.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					if(!restore_end_day){
						getViewMonth(target_month);
					}
					$('._day_booking_wrap').html($html);
				}else{
					restore_end_day = true;
					end_day = 'error';
					end_time = '';
					alert(res.msg);
				}
			}
		});
	};

	var getListMonth = function(ym){
		$.ajax({
			type : 'POST',
			data : {'target_month' : ym, 'select_day':select_day, 'menu_code' : data['menu_code']},
			url : ('/booking/html_list.cm'),
			dataType : 'html',
			success : function(html){
				var $html = $(html);
				$booking_wrap.html($html);
				runMobileCalendar($html);
			}
		});
	};
	var getViewMonth = function(ym){
		$.ajax({
			type : 'POST',
			data : {'idx':idx,'target_month' : ym, 'start_day':start_day,'end_day':end_day},
			url : ('/booking/html_detail_calendar.cm'),
			dataType : 'html',
			success : function(html){
				var $html = $(html);
				target_month = ym;
				$booking_view_calendar.html($html);
				runViewCalendar($booking_view_calendar);
			}
		});
	};

	const loadBookingDetailCalendar = function (idx, start_day, end_day) {
		$.ajax({
			type: 'POST',
			data: { idx, start_day, end_day },
			url: ('/shop/load_booking_detail_detail_calendar.cm'),
			dataType: 'json',
			cache: false,
			success: function (result) {
				if (result.msg === 'SUCCESS') {
					var $html = $(result.output);
					const $booking_view_calendar = $('._booking_view_calendar');
					$booking_view_calendar.html($html);
					runViewCalendar($booking_view_calendar);
				}
			}
		});
	};

	const loadBookingDayCalendar = function (idx, start_day, end_day) {
		$.ajax({
			type: 'POST',
			data: { idx, start_day, end_day },
			url: ('/shop/load_booking_detail_day_calendar.cm'),
			dataType: 'json',
			cache: false,
			success: function (result) {
				if (result.msg === 'SUCCESS') {
					$('._day_booking_wrap').html(result.output);
				}
			}
		});
	};

	var runMobileCalendar = function($obj){
		var $nav_left = $obj.find('.slide_left');
		var $nav_right = $obj.find('.slide_right');
		$nav_left.removeClass('slide_left');

		$obj.find("._booking_day_slide").owlCarousel({
			'mouseDraggable':false,
			'singleItem':true,
			'items' : 7
		}).on('changed.owl.carousel', function(event) {
			var index = event.item.index;
			var items = event.item.count;
			var size = event.page.size;
			if ( index == 0 ) {
				$nav_left.removeClass('slide_left');
			} else {
				$nav_left.addClass('slide_left');
			}
			if ( items-size == index ) {
				$nav_right.removeClass('slide_right');
			} else {
				$nav_right.addClass('slide_right');
			}
		});

		$obj.find('._booking_date').on('click',function(){
			$obj.find('._booking_date').removeClass('on');
			$(this).addClass('on');
			select_day = $(this).data('day');
			$.ajax({
				type : 'POST',
				data : {"select_day":select_day, "menu_code": data['menu_code']},
				url : ('/booking/html_day_detail.cm'),
				cache : false,
				dataType : 'html',
				success : function(html){
					var $html = $(html);
					$booking_wrap.find('._booking_day_detail').html($html);
				}
			});
		});
	};

	var changePerson = function(num){
		person_num = num;
		getViewBookingDetail($cuurent_day_obj);
	};

	var changeOption = function(status){
		if(status == 'require'){
			alert(LOCALIZE.설명_해당옵션필수입니다());
			$('#require_option_check').prop("checked", true);
		}else{
			getViewBookingDetail($cuurent_day_obj);
		}

	};


	/**
	 * 상품 이미지 롤링 시작
	 */
	var startProdImageRolling = function(){

		var items = $prod_image_list.find('._item');
		var is_dots = false;

		is_dots = items.length > 1 ? true : false;

		if(is_dots){
			switch(cm_data.paging_style_type){
				case 'st00':
					switch(cm_data.paging_default_style_type){
						case 'st00':
							$prod_image_list_rolling.toggleClass('paging_type_dot paging_type_dot01', true);
							break;
						case 'st01':
							$prod_image_list_rolling.toggleClass('paging_type_dot paging_type_dot02', true);
							break;
					}
					break;
				case 'st01':
					$prod_image_list_rolling.toggleClass('paging_type_big_dot', true);
					break;
				case 'st02':
					$prod_image_list_rolling.toggleClass('paging_type_line', true);
					break;
				case 'st03':
					switch(cm_data.paging_active_style_type){
						case 'st00':
							$prod_image_list_rolling.toggleClass('paging_type_count paging_type_count01', true);
							break;
						case 'st01':
							$prod_image_list_rolling.toggleClass('paging_type_count paging_type_count02', true);
							break;
						case 'st02':
							$prod_image_list_rolling.toggleClass('paging_type_count paging_type_count03', true);
							break;
					}
					break;
			}
		}

		if (items.length > 1 ) {
			$prod_image_list_rolling.owlCarousel({
				navigation : true,
				slideSpeed : 300,
				paginationSpeed : 400,
				singleItem : true,
				animateOut : 'fadeOut',
				items : 1,
        onInitialized : function(){
          // init
          const owl_item_list = document.querySelectorAll("#prod_image_list .owl-item");
          const total = owl_item_list.length;
          const countDiv = document.createElement("div");
          countDiv.innerHTML = '<span class="_numbering_variable">1</span> <span class="_numbering_total">/ '+total+'</span>';
          document.querySelector("#_carousel_count_numbering").appendChild(countDiv);
        },
				onChanged : function(){
					const owl = $prod_image_list_rolling.data('owlCarousel');
					let current = 0;
					if(typeof owl !== "undefined") current = owl._current;
					const li_list = $prod_image_list.find('li.owl-dot');
					li_list.find('a').removeClass('active');
					li_list.eq(current).find('a').addClass('active');
          // img count changed
          if(document.querySelector("._numbering_variable")) document.querySelector("._numbering_variable").innerHTML = (parseInt(current) + 1);
				},
			});
		} else {
      // item count 1 혹은 없을 때
      document.querySelector("#_carousel_count_numbering").remove();
    }
	};

	/**
	 * 상품 이미지 롤링 특정 위치 이동
	 * @param no
	 */
	function changeProdImageRolling(no){
		var owl = $prod_image_list_rolling.data('owlCarousel');
		if(typeof owl !== "undefined"){
			owl.to(no);
		}
	}

	var toggleMobileBooking = function(){
		if($booking_content_wrap.hasClass('on')){
			$booking_content_wrap.removeClass('on');
		}else{
			$booking_content_wrap.addClass('on');
		}
	};

	/**
	 * 바로 주문하기 추가
	 */
	var addBooking = function(callback){
		var $booking_f = $('#booking_f');
		var data = $booking_f.serializeObject();
		data = $.extend(data, {'unselected_end_day' : unselected_end_day});
		if(unselected_end_day){
			data = $.extend(data, {'start_timestamp' : start_time});
		}
		add_order_progress_check = true;
		$.ajax({
			'type' : 'POST',
			'data' : data,
			'url' : ('/booking/add_order.cm'),
			'dataType' : 'json',
			'cache' : false,
			success : function(result){
				if(result.msg == 'SUCCESS'){
					callback(result);
				}else{
					add_order_progress_check = false;
					alert(result.msg);
				}
			}
		});
	};

	/**
	 * 특정상품 위시리스트 추가 처리
	 * @param prod_code
	 */
	var addProdWish = function(prod_code){
		$.ajax({
			type : 'POST',
			data : {'prod_code' : prod_code},
			url : ('/booking/add_prod_wish.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					if(res.res == 'add'){
						if ( typeof FB_PIXEL != 'undefined' ) FB_PIXEL.AddToWishlist();
						$prod_detail_wish_count.parent().addClass('active');
					}else if(res.res == 'delete'){
						$prod_detail_wish_count.parent().removeClass('active');
					}
					$prod_detail_wish_count.text(res.wish_cnt);
				}else
					alert(res.msg);
			}
		});
	};

	/**
	 * 상세정보 탭 변경 처리
	 * @param type
	 */
	var changeContentTab = function(type,r_p, q_p,only_photo){

		if(current_content_tab != ''){
			$booking_content_wrap.find('a._' + current_content_tab).removeClass('on');
		}
		current_content_tab = type;
		$booking_content_wrap.find('a._' + type).addClass('on');
		if(type == 'detail'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx},
				url : ('/booking/prod_detail.cm'),
				dataType : 'json',
				cache : false,
				success : function(result){
					if(result.msg == 'SUCCESS'){
						if(result.content == ''){
							$prod_detail_content.html('<div style="text-align: center; padding: 50px 0;"><div class="body_font_color_40" style="font-size: 18px; margin:30px"></div></div>');
						}else{
							$prod_detail_content.html(result.content);
						}
						$prod_detail_content.toggleClass('qna_list', false);
					}else{
						alert(result.msg);
					}
				}
			});
		}else if(type == 'review'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx,'review_page' : r_p, 'qna_page' : q_p, 'only_photo' : only_photo},
				url : ('/booking/prod_review.cm'),
				dataType : 'html',
				cache : false,
				success : function(result){
					$prod_detail_content.html(result);
					$prod_detail_content.toggleClass('qna_list', false);
				}
			});
		}else if(type == 'qna'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx, 'review_page' : r_p, 'qna_page' : q_p},
				url : ('/booking/prod_qna.cm'),
				dataType : 'html',
				cache : false,
				success : function(result){
					$prod_detail_content.html(result);
					$prod_detail_content.toggleClass('qna_list', true);
				}
			});
		}
	};

	var openBuyerReview = function(prod_code){
		$.ajax({
			type : 'POST',
			data : {'prod_code' : prod_code},
			url : ('/booking/open_buyer_review.cm'),
			dataType : 'json',
			cache : false,
			async : false,
			success : function(result){
				if(result.msg === 'SUCCESS'){
					$.cocoaDialog.open({type : 'eduModal', custom_popup : result.html, width : 800, hide_event : function(){
						}});
				}else{
					alert(result.msg);
				}
			}
		});
	};

	var getOnlyPhotoReview = function(only_photo_switch){
		var $icon_picture = $('.icon-picture');
		$.ajax({
			type : 'POST',
			data : {'prod_idx' : idx, 'only_photo' : only_photo_switch},
			url : '/booking/prod_review.cm',
			dataType : 'html',
			cache : false,
			async : false,
			success : function(result){
				$prod_detail_content.html(result);
				if($icon_picture.hasClass('active')){
					$icon_picture.removeClass('active');
				}else{
					$icon_picture.addClass('active');
				}
			}
		});


	};

	return{
		'init_list' : function(data){
			init_list(data);
		},
		'init_calendar' : function(data){
			init_calendar(data);
		},
		'init_view' : function(idx,data,st,s,e, duration_type, min_day, max_day,ia,cm){
			init_view(idx,data,st,s,e, duration_type, min_day, max_day,ia,cm);
		},
		'getListMonth' : function(ym){
			getListMonth(ym);
		},
		'getViewMonth' : function(ym){
			getViewMonth(ym);
		},
		'loadBookingDetailCalendar': function(idx, start_day, end_day) {
			loadBookingDetailCalendar(idx, start_day, end_day);
		},
		'loadBookingDayCalendar': function(idx, start_day, end_day) {
			loadBookingDayCalendar(idx, start_day, end_day);
		},
		'changePerson' : function(num){
			changePerson(num);
		},
		'changeOption' : function(status){
			changeOption(status);
		},
		'changeProdImageRolling' : function(no){
			changeProdImageRolling(no);
		},
		'toggleMobileBooking' : function(){
			toggleMobileBooking();
		},
		'addBooking' : function(is_guest_login){
			if(add_order_progress_check) return false;
			addBooking(function(result){
				if ( typeof FB_PIXEL != 'undefined' ) FB_PIXEL.InitiateCheckout();
				if ( typeof CHANNEL_PLUGIN != 'undefined' ) CHANNEL_PLUGIN.AddOrder();
				if (is_guest_login){	//비회원주문시 로그인 페이지로 이동처리
					window.location.href = '/login?booking_order_code=' + result.order_code + '&back_url=' + encodeURIComponent(result.back_url_base64);
				}else{	//일반주문인경우 결제화면으로 이동
					window.location.href = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code);
				}
			});
		},
		addProdWish : function(prod_code){
			addProdWish(prod_code);
		},
		'changeContentTab' : function(type,r_p, q_p,only_photo){
			changeContentTab(type,r_p, q_p,only_photo);
		},
		'openBuyerReview' : function(prod_code){
			openBuyerReview(prod_code);
		},
		"getOnlyPhotoReview" : function(only_photo_switch){
			getOnlyPhotoReview(only_photo_switch)
		}
	}
}();

var BOOKING_REVIEW_COMMENT = function(){
	var $review_comment_wrap;
	var $form;
	var review_code;

	var init = function(code){
		$form = $('.m_booking_nav_tools #accordion_review_form_'+code+', .booking_nav_tools #accordion_review_form_'+code);
		review_code = code;

		$form.each(function(){
			const $this = $(this);
			$this.find('#review_image_upload_btn').setUploadImage({
				url : '/shop/upload_image.cm',
				dropZone : 'icon_img_upload_wrap',
				singleFileUploads : true,
				formData : {temp : 'Y'}
			}, function(res, data){
				$this.find("#review_comment_image_box").show();
				$.each(data, function(e, tmp){
					if(tmp.error == "" || tmp.error == null){
						var url = CDN_UPLOAD_URL + tmp.url;
						var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="BOOKING_REVIEW_COMMENT.removeCommentImg($(this))"></em></span>';
						$this.find("#review_comment_image_box").append(html);
					}else{
						alert(tmp.error);
					}
				});
			});
		});
	};

	var imageUploadInit = function(idx){
		const $wrapper = $('.m_booking_nav_tools, .booking_nav_tools');

		$wrapper.each(function(){
			const $this = $(this);
			$this.find("#sub_review_image_box_" + idx).hide();

			$this.find('#sub_review_image_upload_btn_' + idx).setUploadImage({
				url : '/shop/upload_image.cm',
				dropZone : 'icon_img_upload_wrap',
				singleFileUploads : true,
				formData : {temp : 'Y'}
			}, function(res, data){
				$this.find("#sub_review_image_box_" + idx).show();
				$.each(data, function(e, tmp){
					if(tmp.error == "" || tmp.error == null){
						var url = CDN_UPLOAD_URL + tmp.url;
						var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><img src="' +  url + '"><em class="del" onclick="BOOKING_REVIEW_COMMENT.removeCommentImg($(this))"></em></span>';
						$this.find("#sub_review_image_box_" + idx).append(html);
					}else{
						alert(tmp.error);
					}
				});
			});

			$this.find('#editor_review_image_upload_btn_' + idx).setUploadImage({
				url : '/shop/upload_image.cm',
				dropZone : 'icon_img_upload_wrap',
				singleFileUploads : true,
				formData : {temp : 'Y'}
			}, function(res, data){
				$this.find("#editor_review_image_box_" + idx).show();
				$.each(data, function(e, tmp){
					if(tmp.error == "" || tmp.error == null){
						var url = CDN_UPLOAD_URL + tmp.url;
						var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><img src="' + url + '"><em class="del" onclick="BOOKING_REVIEW_COMMENT.removeCommentImg($(this))"></em></span>';
						$this.find("#editor_review_image_box_" + idx).append(html);
					}else{
						alert(tmp.error);
					}
				});
			});
		});
	};


	var submit = function(t, type, i){
		// mobile 및 pc 에서 같은 id 값 공유 해당 부분 수정 필요...
		const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);
		switch(type){
			case 'main': // pc 리뷰 댓글
				if (isMobile_width) {
					var data = $('.m_booking_nav_tools #' + $form.attr('id')).serializeObject();
				} else {
					var data = $('.booking_nav_tools #' + $form.attr('id')).serializeObject();
				}
				break;
			case 'sub_form': //pc 리뷰 대댓글
				if (isMobile_width) {
					var data = $('.m_booking_nav_tools #sub_review_form_' + i).serializeObject();
				} else {
					var data = $('.booking_nav_tools #sub_review_form_' + i).serializeObject();
				}
				break;
			case 'editor': // pc 리뷰 댓글 수정
				if (isMobile_width) {
					var data = $('.m_booking_nav_tools #sub_review_editor_form_' + i).serializeObject();
				} else {
					var data = $('.booking_nav_tools #sub_review_editor_form_' + i).serializeObject();
				}
				break;
			case 'mobile': // Mobile 리뷰 댓글
				var data = $('#mobile_review_form').serializeObject();
				break;
			case 'mobile_sub_form': // Mobile 리뷰 대댓글
				var data = $('#mobile_sub_review_form_' + i).serializeObject();
				break;
			case 'mobile_editor': // Mobile 리뷰 댓글 수정
				var data = $('#mobile_sub_review_editor_form_' + i).serializeObject();
				break;
		}
		if(!t.hasClass("btn-writing")){
			t.addClass("btn-writing");
		}
		$.ajax({
			type : 'POST',
			data : {data : data, review_code : review_code},
			url : ('/booking/add_review_comment.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(result){
				if(t.hasClass("btn-writing")){
					t.removeClass("btn-writing");
				}
				if(result.msg == 'SUCCESS'){
					$('#comment_count_'+review_code).text(result.comment_count);
					getReviewCommentHtml(review_code,t);
					$("div[id^='sub_review_image_box_']").hide();
				}else alert(result.msg);
			}
		});
	};

	var getReviewCommentHtml = function(code,object){
		$review_comment_wrap = $('.review_comment_wrap_'+code);
		if(!object.hasClass('active')){
			$.ajax({
				type : 'POST',
				data : {'code' : code},
				url : ('/booking/get_review_comment_list.cm'),
				dataType : 'json',
				async : false,
				cache : false,
				success : function(result){
					if(result.msg === 'SUCCESS'){
						$review_comment_wrap.html(result.html);
						$review_comment_wrap.show();
					}else{
						alert(result.msg);
					}
				}
			});
		}else{
			$review_comment_wrap.hide();
		}
	};

	var removeCommentImg = function(obj){
		var box_obj = obj.parent().parent();
		obj.parent().remove();
		if(box_obj.find('.file-add').length == 0)box_obj.hide();
	};

	var reviewCommentDelete = function(code){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type : 'POST',
				data : {code : code, review_code : review_code},
				url : ('/booking/delete_review_comment.cm'),
				async : false,
				dataType : 'json',
				success : function(result){
					if(result.msg == 'SUCCESS'){
						$('#comment_count_'+review_code).text(result.comment_count);
						getReviewCommentHtml(review_code,$(this));
					}else
						alert(result.msg);
				}
			});
		}
	};

	var EditHide = function(idx){
		var editor_form = $("._sub_form_editor_" + idx);
		editor_form.hide();
		$('.tools').show();
		editor_form.siblings('._comment_body').show();
		editor_form.closest('.comment_area').siblings().show();
		editor_form.closest('.comment_area').css('padding-top', '');
		editor_form.css('margin-top', '');
	};

	return {
		init : function(code){
			init(code);
		},
		imageUploadInit : function(idx){
			imageUploadInit(idx);
		},
		submit : function(t, type, i){
			submit(t, type, i);
		},
		getReviewCommentHtml : function(code,object){
			getReviewCommentHtml(code,object);
		},
		removeCommentImg : function(obj){
			removeCommentImg(obj);
		},
		Delete : function(code){
			reviewCommentDelete(code);
		},
		EditHide : function(idx){
			EditHide(idx);
		}

	}
}();

var SITE_BOOKING_REVIEW = function(){
	var $review_wrap;
	var $review_form;
	var $mobile_form;
	var $rating;
	var $star;
	var $m_rating;
	var $m_star;
	var $comment_body;
	var $review_image_box;
	var $comment_area;
	var $platform;
	var images = {};

	var init = function(t){
		switch(t){
			case 'pc':
				$platform = $('.booking_nav_tools');
				break;
			case 'mobile':
				$platform = $('.m_booking_nav_tools');
				break;
		}
		$star = $("._star");
		$rating = $("#rating");
		$review_form = $("#review_form");


		$review_form.find('#review_image_upload_btn').fileupload({
			url: '/ajax/review_image_upload.cm',
			formData: {target: 'site_review', type: 'image'},
			dataType: 'json',
			singleFileUploads: true,
			limitMultiFileUploads: 1,
			start: function(e, data){
			},
			progress: function(e, data){
			},
			done: function(e, data){
				$.each(data.result.files, function(e, tmp){
					if(tmp.error == null){
						$review_form.find("#review_image_box").show();
						$review_form.find('._btn_add_image').toggleClass('no-margin', false);
						var url = tmp.url;
						images[tmp.code] = url;
						var html = '<span class="file-add _img_'+tmp.code+'"><input type="hidden" name="img" value="' + tmp.name + '"><div class="img-thumb-wrap"><img src="' + CDN_UPLOAD_URL + url + '"></div><a class="del" href="javascript:;" onclick="SITE_BOOKING_REVIEW.deleteReviewImage(\''+tmp.code+ '\')" ><i class="btm bt-times vertical-middle" aria-hidden="true"></i></a></span>';
						$review_form.find("#review_image_box ._btn_add_image").before(html);
					}else{
						alert(tmp.error);
					}
				});
			},
			fail: function(e, data){
				alert(getLocalizeString("설명_업로드에실패하였습니다", "", "업로드에 실패 하였습니다."));
			}
		});


		// $mobile_form = $platform.find('#mobile_review_form');
		// $m_rating = $mobile_form.find('#mobile_rating');
		// $m_star = $mobile_form.find('._star');
		// $mobile_form.find("#mobile_review_image_box").hide();
		//
		// $mobile_form.find('#mobile_review_image_upload_btn').setUploadImage({
		// 	url : '/shop/upload_image.cm',
		// 	dropZone : 'icon_img_upload_wrap',
		// 	singleFileUploads : true,
		// 	formData : {temp : 'Y'}
		// }, function(res, data){
		// 	$mobile_form.find("#mobile_review_image_box").show();
		// 	$.each(data, function(e, tmp){
		// 		if(tmp.error == "" || tmp.error == null){
		// 			var url = CDN_UPLOAD_URL + tmp.url;
		// 			var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
		// 			$mobile_form.find("#mobile_review_image_box").append(html);
		// 		}else{
		// 			alert(tmp.error);
		// 		}
		// 	});
		// });
		// autosize($('.textarea_block textarea'));
	};

	var changeRating = function(t,n){
		if(t == 'desktop'){
			$rating.val(n + 1);
			$star.each(function(e){
				if(n <= 0 && e == 0){
					if(n == -1){
						$(this).removeClass('active');
					}else{
						$(this).addClass('active');
					}
				}else{
					$(this).removeClass('active');
					if(e <= n){
						$(this).addClass('active');
					}
				}
			});
		}else{
			$m_rating.val(n + 1);
			$m_star.each(function(e){
				if(n <= 0 && e == 0){
					if(n == -1){
						$(this).removeClass('active');
					}else{
						$(this).addClass('active');
					}
				}else{
					$(this).removeClass('active');
					if(e <= n){
						$(this).addClass('active');
					}
				}
			});
		}
	};

	var reviewFormShow = function(t){
		var sub_form = $("._sub_form_" + t);

		sub_form.data('show', 'Y');
		sub_form.show();
		var comment_add_body = sub_form.find('._comment_add_body_' + t);

		$('body').off('mouseup.sub_comment')
			.on('mouseup.sub_comment', function(e){
				var $c_target = $(e.target);
				var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
				if($s_form.length == 0){

					var text = comment_add_body.val();
					sub_form.data('show', 'N');
					if(text == ''){
						$('body').off('mouseup.sub_comment');
						reviewFormHide();
					}
				}
			});
	};

	var reviewEditShow = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.siblings('.block-postmeta').find('.comment_area').hide();

		editor_form.data('show', 'Y');
		editor_form.show();

	};

	var DeleteShow = function(code,prod_code,only_photo){
		var $show_secret_password = $('#show_secret_password');
		var $show_link = $(event.target);
		if($show_secret_password.length == 0){
			$show_secret_password = $('<div class="remove-pop" id="show_secret_password" onclick="event.cancelBubble = true;" tabindex="0" style="position:absolute;z-index:99999;"><p>'+LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요()+'</p><div class="input_area"><input type="password" placeholder="'+LOCALIZE.설명_비밀번호()+'"><button class="btn btn-primary _confirm">'+LOCALIZE.버튼_확인닫기()+'</button></div></div>').hide();
			$show_link.after($show_secret_password);
		}
		$show_secret_password.find('input').val('');
		$show_secret_password.show();
		$show_secret_password.off('click', '._confirm')
			.on('click', '._confirm', function(){
				var secret_pass = $show_secret_password.find('input').val();
				CheckSecret(code,secret_pass,function(){
					reviewDelete(code, prod_code,'',only_photo);
				});
				$show_secret_password.hide();
			});
		$('body').off('mousedown.show_secret')
			.on('mousedown.show_secret', function(e){
				var $tmp = $(e.target).closest('#show_secret_password');
				if($tmp.length == 0){
					$show_secret_password.hide();
					$('body').off('click.show_secret');
				}
			});
	};

	var CheckSecret = function(code,secret_pass,callback){
		$.ajax({
			type:'post',
			data:{code:code,secret_pass :secret_pass, type : 'review'},
			url:'/ajax/check_review_pass.cm',
			dataType:'json',
			success:function(result){
				if(result.msg == 'SUCCESS'){
					if(typeof callback == 'function')
						callback();
				}else{
					alert(result.msg);
				}
			}
		});
	};

	var reviewEditHide = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.hide();
		editor_form.siblings('.block-postmeta').find('.comment_area').show();
	};

	var reviewFormHide = function(){
		$("._sub_review_form").hide();
	};

	var reviewDelete = function(code, prod_code,r_p, only_photo, buyer_permission){
		only_photo = only_photo ? 'Y' : 'N';
		var _msg = buyer_permission == 'Y' ? LOCALIZE.설명_후기를삭제하시겠습니까() : LOCALIZE.설명_삭제하시겠습니까();
		if(confirm(_msg)){
			$.ajax({
				type : 'POST',
				data : {'code' : code, 'prod_code' : prod_code},
				url : ('/booking/delete_review.cm'),
				dataType : 'json',
				success : function(result){
					if(result.msg == 'SUCCESS'){
						SITE_BOOKING.changeContentTab('review',r_p,'',only_photo);
					}else
						alert(result.msg);
				}
			});
		}
	};

	var imageUploadInit = function(n){
		$("#sub_review_image_box_" + n).hide();
		//$("#editor_review_image_box_"+n).hide();

		$('#sub_review_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#sub_review_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#sub_review_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});

		$('#editor_review_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#editor_review_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#editor_review_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
	};

	var submit = function(t, type, i){
		var data = $review_form.serializeObject();
		data.images = images;
		$.ajax({
			type : 'POST',
			data : data,
			url : ('/booking/add_review.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				if(result.msg == 'SUCCESS'){
					reviewCompleted();
				}else
					alert(result.msg);
			}
		});
	};

	var reviewCompleted = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/booking/add_review_completed.cm'),
			dataType: 'html',
			async: false,
			cache: false,
			success : function(html){
				$.cocoaDialog.open({
					type : 'prod_review_completed',
					custom_popup : html,
					'close_block' : false,
					hide_event : function(){
						location.reload();
					}
				});
			}
		});
	};

	var createHtml = function(prod_idx, review_page, qna_page,paging_on,only_photo){
		$review_wrap = $platform.find('#prod_detail_content');
		$.ajax({
			type : 'POST',
			data : {prod_idx : prod_idx, review_page : review_page, qna_page : qna_page, only_photo : only_photo},
			url : ('/booking/prod_review.cm'),
			dataType : 'html',
			cache : false,
			success : function(result){
				$review_wrap.html(result);
			}
		});
	};


	var openAddReview = function(idx, prod_code, code){
		$.cocoaDialog.close();
		$.ajax({
			type : 'POST',
			data : {'idx' : idx, 'prod_code' : prod_code, 'code' : code},
			url : ('/booking/open_add_review.cm'),
			dataType : 'json',
			cache : false,
			async : false,
			success : function(result){
				if(result.msg === 'SUCCESS'){
					$.cocoaDialog.open({type : 'add_review', custom_popup : result.html,'close_block': true, width : 800, hide_event : function(){
							images = {};
						}});
				}else{
					alert(result.msg);
				}
			}
		});
	};

	var EditReviewShow = function (idx, prod_code, code) {
		var $show_secret_password = $('#show_secret_password');
		var $show_link = $(event.target);
		if ($show_secret_password.length == 0) {
			$show_secret_password = $('<div class="remove-pop" id="show_secret_password" onclick="event.cancelBubble = true;" tabindex="0" style="position:absolute;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
			$show_link.after($show_secret_password);
		}
		$show_secret_password.find('input').val('');
		$show_secret_password.show();
		$show_secret_password.off('click', '._confirm')
			.on('click', '._confirm', function () {
				var secret_pass = $show_secret_password.find('input').val();
				CheckSecret(code, secret_pass, function () {
					SITE_BOOKING_REVIEW.openAddReview(idx, prod_code, code);
				});
				$show_secret_password.hide();
			});
		$('body').off('mousedown.show_secret')
			.on('mousedown.show_secret', function (e) {
				var $tmp = $(e.target).closest('#show_secret_password');
				if ($tmp.length == 0) {
					$show_secret_password.hide();
					$('body').off('click.show_secret');
				}
			});
	};

	var convertReviewImage = function(image_list){
		$review_form.find("#review_image_box").show();
		$review_form.find('._btn_add_image').toggleClass('no-margin', false);
		for(var i = 0; i < image_list.length; i++){
			images[i] = image_list[i];
			var html = '<span class="file-add _img_'+i+'"><input type="hidden" name="img" value="' + i + '"><div class="img-thumb-wrap"><img src="' + CDN_UPLOAD_URL + image_list[i] + '"></div><a class="del" href="javascript:;" onclick="SITE_BOOKING_REVIEW.deleteReviewImage(\''+i+ '\')" ><i class="btm bt-times vertical-middle" aria-hidden="true"></i></a></span>';
			$review_form.find("#review_image_box ._btn_add_image").before(html);
		}
	};

	var deleteReviewImage = function(code){
		if ( typeof images[code] != 'undefined' ) {
			delete images[code];
		}
		$("span._img_"+code).remove();
	};

	var checkReviewData = function(){
		var review_body = $("#review_body").val();
		var check = Object.keys(images).length > 0 || review_body != '';
		if(check){
			if(confirm(LOCALIZE.설명_작성한내용이모두사라집니다())){
				$.cocoaDialog.close();
			}else{
				return false;
			}
		}else{
			$.cocoaDialog.close();
		}
	};

	return {
		init : function(t){
			init(t);
		},
		submit : function(t,type,i){
			submit(t,type,i);
		},
		changeRating : function(t,n){
			changeRating(t,n);
		},
		FormShow : function(t){
			reviewFormShow(t);
		},
		Delete : function(code, prod_code,r_p, only_photo, buyer_permission){
			reviewDelete(code, prod_code,r_p, only_photo, buyer_permission);
		},
		DeleteShow : function(code,prod_code,only_photo){
			DeleteShow(code,prod_code,only_photo);
		},
		EditShow : function(t){
			reviewEditShow(t);
		},
		EditHide : function(t){
			reviewEditHide(t);
		},
		imageUploadInit : function(n){
			imageUploadInit(n);
		},
		createHtml : function(prod_idx, review_page, qna_page,paging_on,only_photo){
			createHtml(prod_idx, review_page, qna_page,paging_on,only_photo);
		},
		openAddReview : function(idx, prod_code, code){
			openAddReview(idx, prod_code, code);
		},
		EditReviewShow : function (idx, prod_code, code) {
			EditReviewShow(idx, prod_code, code);
		},
		convertReviewImage : function(image_list){
			convertReviewImage(image_list);
		},
		deleteReviewImage : function(code){
			deleteReviewImage(code);
		},
		reviewCompleted : function(){
			reviewCompleted();
		},
		checkReviewData : function(){
			checkReviewData()
		}
	}
}();

var SITE_BOOKING_QNA = function(){
	var $qna_wrap;
	var $mobile_form;
	var $form;
	var $secret;
	var $m_secret;
	var $platform;

	var init = function(t,qna_secret_type){
		switch(t){
			case 'pc':
				$platform = $('.booking_nav_tools');
				break;
			case 'mobile':
				$platform = $('.m_booking_nav_tools');
				break;
		}
		$mobile_form = $platform.find('#mobile_qna_form');
		$m_secret = $mobile_form.find('._secret');
		$secret = $platform.find('._secret');
		if(qna_secret_type == 'secret'){
			$secret.addClass('active');
			$platform.find('#secret').val('Y');
		}else{
			if(qna_secret_type == 'no_secret'){
				$secret.removeClass('active');
				$platform.find('#secret').val('N');
			}else{
				$secret.on('click', function(){
					if($secret.hasClass('active')){
						$secret.removeClass('active');
						$platform.find('#secret').val('N');
					}else{
						$secret.addClass('active');
						$platform.find('#secret').val('Y');
					}
				});
			}
		}
		if($platform.find('#secret').val() != ''){//수정일 경우 비밀글 체크
			if($platform.find('#secret').val() == 'Y'){
				$secret.addClass('active');
				$platform.find('#secret').val('Y');
			}else{
				$secret.removeClass('active');
				$platform.find('#secret').val('N');
			}
		}
		$mobile_form.find("#mobile_qna_image_box").hide();

		$mobile_form.find('#mobile_qna_image_upload_btn').setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$mobile_form.find("#mobile_qna_image_box").show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$mobile_form.find("#mobile_qna_image_box").append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
		autosize($('.textarea_block textarea'));
	};

	var qnaFormShow = function(t){
		var sub_form = $("._sub_form_" + t);

		sub_form.data('show', 'Y');
		sub_form.show();
		var comment_add_body = sub_form.find('._comment_add_body_' + t);

		$('body').off('mouseup.sub_comment')
			.on('mouseup.sub_comment', function(e){
				var $c_target = $(e.target);
				var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
				if($s_form.length == 0){

					var text = comment_add_body.val();
					sub_form.data('show', 'N');
					if(text == ''){
						$('body').off('mouseup.sub_comment');
						qnaFormHide();
					}
				}
			});
	};

	var qnaEditShow = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.siblings('.block-postmeta').find('.feed-summary').hide();
		editor_form.data('show', 'Y');
		editor_form.show();
		editor_form.css('margin-top', '-32px');
	};

	var qnaEditHide = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.hide();
		editor_form.siblings('.block-postmeta').find('.feed-summary').show();
	};


	var qnaFormHide = function(){
		$("._sub_qna_form").hide();
	};
	var qnaDelete = function(code, prod_code, secret_pass){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type : 'POST',
				data : {code : code, prod_code : prod_code, secret_pass : secret_pass, isbook:'Y'},
				url : ('/shop/delete_qna.cm'),
				dataType : 'json',
				success : function(result){
					if(result.msg == 'SUCCESS'){
						SITE_BOOKING.changeContentTab('qna');
					}else
						alert(result.msg);
				}
			});
		}
	};

	var qnaModify = function(idx, prod_code, secret_pass, is_book, code){
		$.ajax({
			type : 'POST',
			data : {idx : idx, prod_code : prod_code, secret_pass : secret_pass, is_book : is_book, code : code},
			url : ('/shop/show_secret_qna.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					qnaEditShow(idx);
				}else
					alert(result.msg);
			}
		});
	};

	var qnaShow = function(idx, prod_code, secret_pass, is_book, code){
		$.ajax({
			type : 'POST',
			data : {idx : idx, prod_code : prod_code, secret_pass : secret_pass, is_book : is_book, code : code},
			url : ('/shop/show_secret_qna.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					$("._comment_body_"+idx).html(result.html);
					if(result.isSubComment){
						for(var i in result.sub_comment){
							var sub_data = result.sub_comment[i];
							$("._comment_child_"+idx+"_"+sub_data.idx).html(sub_data.html);
						}
					}
				}else
					alert(result.msg);
			}
		});
	};

	var qnaConfirmShow = function (e, idx, prod_code, type,code){
		var $show_secret_password = $('#show_secret_password');
		if($show_secret_password.length == 0){
			$show_secret_password = $('<div class="remove-pop" id="show_secret_password" style="position:absolute; left:0;top:0;z-index:99999;"><p>'+LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요()+'</p><div class="input_area"><input type="password" placeholder="'+LOCALIZE.설명_비밀번호()+'"><button class="btn btn-primary _confirm">'+LOCALIZE.버튼_확인닫기()+'</button></div></div>').hide();
			$('body').append($show_secret_password);
		}
		var $show_link = $(event.target);

		var top = $show_link.offset().top;
		var left = $show_link.offset().left;

		$show_secret_password.css({
			position : 'absolute',
			top : top,
			left : left
		});

		$show_secret_password.find('input').val('');
		$show_secret_password.show();
		$show_secret_password.off('click', '._confirm')
			.on('click', '._confirm', function(){
				var secret_pass = $show_secret_password.find('input').val();
				$show_secret_password.hide();
				switch(type){
					case 'show' :
						qnaShow(idx, prod_code, secret_pass, 'Y',code);
						break;
					case 'modify' :
						qnaModify(idx, prod_code, secret_pass, 'Y',code);
						break;
					case 'delete' :
						qnaDelete(code, prod_code, secret_pass);
						break;

				}
			});
		$('body').off('mousedown.show_secret')
			.on('mousedown.show_secret', function(e){
				var $tmp = $(e.target).closest('#show_secret_password');
				if($tmp.length == 0){
					$show_secret_password.hide();
					$('body').off('click.show_secret');
				}
			});
	};

	var imageUploadInit = function(n){
		$("#sub_qna_image_box_" + n).hide();

		$('#sub_qna_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#sub_qna_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#sub_qna_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});

		$('#editor_qna_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#editor_qna_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#editor_qna_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
	};

	var submit = function(t, type, i){
		console.log(type);
		console.log($form);
		console.log($platform);
		switch(type){
			case 'main': // PC 형태 form Q&A
				var data = $form.serializeObject();
				break;
			case 'sub_form': //PC 형태 form Q&A 댓글
				var data = $platform.find('#sub_qna_form_' + i).serializeObject();
				break;
			case 'editor': // PC 형태 form Q&A 수정
				var data = $platform.find('#sub_qna_editor_form_' + i).serializeObject();
				break;
			case 'mobile': // Mobile 형태 form Q&A
				var data = $platform.find('#mobile_qna_form').serializeObject();
				break;
			case 'mobile_sub_form': // Mobile 형태 form Q&A 댓글
				var data = $platform.find('#mobile_sub_qna_form_' + i).serializeObject();
				break;
			case 'mobile_editor': // Mobile 형태 form Q&A 수정
				var data = $platform.find('#mobile_sub_qna_editor_form_' + i).serializeObject();
				break;
		}
		if(!t.hasClass("btn-writing")){
			t.addClass("btn-writing");
		}

		$.ajax({
			type : 'POST',
			data : {data : data, type : type},
			url : ('/booking/add_qna.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				if(t.hasClass("btn-writing")){
					t.removeClass("btn-writing");
				}
				if(result.msg == 'SUCCESS'){
					SITE_BOOKING.changeContentTab('qna');
				}else
					alert(result.msg);
			}
		});
	};

	var createHtml = function(prod_idx, review_page, qna_page){
		$qna_wrap = $platform.find('#prod_detail_content');
		$.ajax({
			type : 'POST',
			data : {prod_idx : prod_idx, review_page : review_page, qna_page : qna_page},
			url : ('/booking/prod_qna.cm'),
			dataType : 'html',
			cache : false,
			success : function(result){
				$qna_wrap.html(result);
			}
		});
	};

	return {
		init : function(t,qna_secret_type){
			init(t,qna_secret_type);
		},
		submit : function(t,type,i){
			submit(t,type,i);
		},
		FormShow : function(t){
			qnaFormShow(t);
		},
		Delete : function(code, prod_code){
			qnaDelete(code, prod_code);
		},
		EditShow : function(t){
			qnaEditShow(t);
		},
		EditHide : function(t){
			qnaEditHide(t);
		},
		imageUploadInit : function(n){
			imageUploadInit(n);
		},
		confirmShow : function(e, idx, prod_code, type, code){
			qnaConfirmShow(e, idx, prod_code, type, code);
		},
		createHtml : function(prod_idx, review_page, qna_page){
			createHtml(prod_idx, review_page, qna_page);
		}
	}
}();