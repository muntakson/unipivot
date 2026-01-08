
var MAP = function(){

	var total_file_size = 0;
	var $map_form, $map_editor, $board_container;
	// 아래 배열들은 map_data[board_code][data] 식으로 2차 배열로 사용(원페이지 구성 대응)
	var map_data = [];
	var naver_map = [];
	var markers = [], infowindows = [];		// 네이버 지도용 infowindow 배열
	var cluster = [];		// 마커 클러스터링 배열
	var google_cluster_maxzoom = 16;
	var naver_cluster_maxzoom = 13;
	var naver_cluster_marker1, naver_cluster_marker2, naver_cluster_marker3, naver_cluster_marker4, naver_cluster_marker5;
	var isIOS, isSafari, $fr_m_custom, $write_header, m_sticky_container_trigger_top, $toolbarContainer;
	var target_map, target_marker;		// 글쓰기 화면이나 게시물 본문 등 단일 지도에서 사용

	/***
	 * 안드로이드앱에서 post글쓰기시 이미지 업로드 완료시 처리
	 * @param image
	 */

	/*
	var $image_list_obj = {};
	//이미지 임시저장 리스트 추가
	if(!($image_list_obj.length > 0)) {
		var image_list_html = $("<ul id='image_list' style='display: none'></ul>");
		$("body").append(image_list_html);
		$image_list_obj = image_list_html;
	}

	var android_que = [];
	var androidAppPostImageUploadComplete = function(image){
		if(image.tmp_idx > 0){
			android_que.push(image);
			if(image.is_last == "Y") androidAppPostImageUploadAllComplete();
		}
	};

	var androidAppPostImageUploadAllComplete = function(){
		androidAppPostImageInsert(android_que[0]);
	};

	var androidAppPostImageInsert = function(image){
		$map_editor.find('#map_body').froalaEditor('image.insert', CDN_UPLOAD_URL+image.url, true);
		var img = $froala_obj.find('img[src="'+CDN_UPLOAD_URL+image.url+'"]');
		img.data(image);
		postAddImage(image.tmp_idx,image.size);
		android_que.splice(0,1);
	};

	var postAddImage = function(tmp_idx,size){
		var uniq_id = makeUniq('image_');
		var hidden_input = $('<input name="temp_images[]" value="' + tmp_idx + '" type="hidden" />');
		var li 	= $('<li>').attr('id',uniq_id).data({'item':uniq_id,size:size});
		li.append(hidden_input);
		$image_list_obj.append(li);
	};
	/**
	 * 지도 게시물 클릭 시 이벤트 선언
	 * @param b_code
	 * @param $obj		글쓰기 화면에서 호출 시 에디터 클래스, 그 외에는 null
	 * @param api
	 * @param category_list
	 */
	var mapInitWrite = function(b_code, $obj, api, category_list, placeholder_edit){
		$map_form = $('#map_form');
		$board_container = $('#board_container');
		var board_code = b_code;
		var map_api = api === 'naver' ? 'naver' : 'google';
		var category_data;
		var current_position; //같은 컨테이너 클릭시 DB조회 없이 마커만 이동하기위한 변수
		if(category_list) category_data = categoryList(category_list);
		if(typeof markers[board_code] === 'undefined') markers[board_code] = [];
		if(typeof infowindows[board_code] === 'undefined') infowindows[board_code] = [];
		if($obj){
			$("body").addClass("write_mode");
			$map_editor = $obj;
			if(IE_VERSION < 10){
				CKEDITOR.replace( 'map_body',{
					filebrowserImageUploadUrl: '/ajax/post_image_upload.cm?board_code='+b_code
				});
			}else{
        setFroala('#map_form #map_body', {
          code : board_code,
          image_upload_url : "/ajax/post_image_upload.cm",
          file_upload_url : "/ajax/post_file_upload.cm",
          file_list_obj : $("#file_list"),
          'placeholderText': placeholder_edit,
          'image_display' : 'inline',
          mobile_custom: true
        });
			}

			$map_form.find('#delete_cover_image').on('click',function(){
				deleteCoverImage($map_form);
			});

			$map_form.find('#upload_cover_image').setUploadImage({
				url : '/ajax/upload_image.cm',
				formData : {target : 'post', 'temp' : 'Y', 'param_name' : 'cover_image'}
			}, function (msg, data,res) {
				$.each(res.cover_image,function(i,file){
					if(file.tmp_idx > 0){
						$map_form.find('#cover_image').val(file.url);
						$map_form.find('#cover_image_tmp_no').val(file.tmp_idx);
						$map_form.find('#delete_cover_image').show();
						$board_container.toggleClass('bg_on',true);
						$board_container.find('._cover_image').css('background-image',"url("+CDN_UPLOAD_URL+file.url+")");
						$board_container.find('._cover_image_src').attr('src',CDN_UPLOAD_URL+file.url);
					}
				});
			});

			isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
			isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			$fr_m_custom = $board_container.find('._fr-m-custom');
			$write_header = $board_container.find('._write_header');
			m_sticky_container_trigger_top = $fr_m_custom.offset().top - $fr_m_custom.height();
			$toolbarContainer = $fr_m_custom.find('#toolbarContainer');
			if(isIOS && isSafari){
				$write_header.css('position', 'absolute');
			}
			var timeoutTime = isIOS && isSafari ? 100 : 10;
			var resize_time;
			resizeStickyContainer();
			$(window).off('scroll.mobile_write resize.mobile_write').on('scroll.mobile_write resize.mobile_write',function(){
				var s_top = $(this).scrollTop();
				if(isIOS && isSafari){
					$write_header.css({'-webkit-transition': 'none', 'transition': 'none', 'top': 0});
					if(s_top > m_sticky_container_trigger_top){
						$toolbarContainer.css({'-webkit-transition': 'none', 'transition': 'none', 'top': 0});
					}
				}
				if(resize_time) {
					clearTimeout(resize_time);
				}
				resize_time = setTimeout(function() {
					resizeStickyContainer();
				}, timeoutTime);
			});

			$obj.find('._map_search').keypress(function(e){
				if(e.keyCode == '13'){
					mapAddressSearch($(this).val(), map_api);
				}
			});

			//지도게시판 부제목 반영전까지 해당기능 off / 부제목 기능 추가시 다시 on 시켜야함
			//$obj.find('#number').on('keydown').check_callnum();
		}

		if(!IS_MOBILE){
			$('#map_list_fold_' + board_code).find('._map_container').on('click', function(){
				if($(this).attr('data-bcode') === board_code){
					var post_id = $(this).attr('id');
					var pos_x = parseFloat($('#' + post_id).find('._pos_x_temp').val());
					var pos_y = parseFloat($('#' + post_id).find('._pos_y_temp').val());
					if(map_api === 'naver'){
						if(current_position !== post_id){ //현재 떠있는 팝업과 다른 컨테이너 클릭시에만 DB조회
							infowindows[board_code][post_id].setContent(getInfoWindowData(board_code, post_id));
							infowindows[board_code][post_id].open(naver_map[board_code], markers[board_code][post_id]);
							current_position = post_id;
						}
						// 해당 마커를 지도 중심으로 이동
						naver_map[board_code].setOptions({
							center: new naver.maps.LatLng(pos_y, pos_x),
							zoom: naver_cluster_maxzoom + 1
						});
						naverMarkCenter(naver_map[board_code]);
					}else{
						var get_data = $('#gmap_' + board_code).gmap3({get: {id: post_id}});
						var info_close = $('#gmap_' + board_code).gmap3({get: {name: "infowindow"}});
						if(info_close){
							info_close.close();
						}
						var map_data = '';
						var count = 0;
						$('#gmap_' + board_code).gmap3({
							exec: {
								id: post_id,
								func: function(data){
									if(count == 4){
										map_data = data;
									}
									count++;
								}
							}
						});
						$('#gmap_' + board_code).gmap3({
							map: {
								options: {
									center: [pos_y, pos_x],
									scaleControl: true,
									maxZoom: 19,
									minZoom: 3,
									zoom: google_cluster_maxzoom + 1,
									mapTypeControl: false,
									streetViewControl: false,
									controlSize: 29
								}
							},
							infowindow: {
								anchor: get_data,
								options: {position: [pos_y, pos_x], content: getInfoWindowData(board_code, post_id)}
							}
						});

						var map_comment_count = 0;
						var like_cnt = 0;
						var read_cnt = 0;
						var idx_arr = post_id.split('list_');
						map_comment_count = Math.round($('#' + post_id).find('._comment_count').text());
						like_cnt = Math.round($('#' + post_id).find('._like_count').text());
						read_cnt = Math.round($('#' + post_id).find('._read_count').text());
						$('#list_pop_' + idx_arr[1]).find('._comment_count').text(map_comment_count);
						$('#list_pop_' + idx_arr[1]).find('._like_count').text(like_cnt);
						$('#list_pop_' + idx_arr[1]).find('._read_count').text(read_cnt);
					}
				}
			});
		}



		document.onkeydown = function(evt) {
			if(evt.keyCode == 27){
				$('html').removeClass('fullboard_on');
				$('body').find('#maps_more').remove();
				$('body').css('overflow','');
				location.hash = '';
				//$map_editor.hide();
				$('._calendar_modal_back').hide();
				if($map_form.find('#add_address_ck').val() == 'N'){
					searchDataClear('close');
				}
				$('._cancel').trigger('click');
			}
		}


	};

	function resizeStickyContainer(){
		var s_top = $(this).scrollTop();
		if(isIOS && isSafari){
			$write_header.css({'-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px'});
			$fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
			$fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
			if(s_top > m_sticky_container_trigger_top){
				$toolbarContainer.css({'-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px'});
				$map_form.find('#map_body').css('padding-top', '50px');
			}else{
				$toolbarContainer.css({'-webkit-transition': 'none', 'transition': 'none', 'top': 'auto'});
				$map_form.find('#map_body').css('padding-top', '');
			}
		}else{
			$fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
		}
		if($(window).width() >= 768){
			if($board_container.hasClass('bg_on'))
				$board_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 487);
			else
				$board_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 180);
		}
	}


	var deleteCoverImage = function(){
		$map_form.find('#cover_image').val('');
		$map_form.find('#cover_image_tmp_no').val('');
		$board_container.toggleClass('bg_on',false);
		$board_container.find('._cover_image').css('background-image','none');
		$board_container.find('._cover_image_src').attr('src','');
		$map_form.find('#delete_cover_image').hide();
	};

	var toggleAlarmPopup = function(){
		$('#alarm_popup').toggleClass('open');
		if($('#alarm_popup').hasClass('open')){
			$(window).on('click.alarm_popup',function(event){
				var $top_closest = $(event.target).closest('a');
				if($top_closest.attr('id')!='dLabel'){
					var $closest = $(event.target).closest('ul');
					if($closest != null && !$closest.hasClass('dropdown-menu')){
						$('#alarm_popup').removeClass('open');
						$(window).off('click.alarm_popup');
						var alarm_group_list = $('#alarm_popup').find("input[type='checkbox']").is(":checked");
						if(alarm_group_list) $('#dLabel').addClass('active');
						else $('#dLabel').removeClass('active');
					}
				}
			});
		}
	};
	/**
	 * 마커 위치 데이터 받아서 map_data 배열에 저장
	 * @param board_code
	 * @param keyword
	 * @param keyword_type
	 * @param sort
	 * @param category
	 */
	var addMapData = function(board_code, keyword, keyword_type, sort, category){
		if(typeof map_data[board_code] === 'undefined') map_data[board_code] = [];
		$.ajax({
			type : 'post',
			data : {
				'board_code': board_code,
				'search': keyword,
				'search_mod': keyword_type,
				'sort': sort,
				'status': category
			},
			url : '/ajax/get_map_data.cm',
			dataType : 'json',
			async : false,
			cache : false,
			success : function(result){
				if(result.msg == 'SUCCESS'){
					var map_data_array = result.map_data_array;
					for(var key in map_data_array){
						map_data[board_code].push(JSON.parse(map_data_array[key]));
					}
				}
			}
		});
	};
	/**
	 *	게시물 수정 중 장소 수정 창을 띄움
	 * @param map_api		naver, google, null(지도 API 키가 없을 때 수정 불가)
	 */
	var mapEditorPop = function(map_api){
		if(map_api){
			$map_editor.show();
			$('._calendar_modal_back').show();
			if($map_form.find('#pos_x').val() && $map_form.find('#pos_y').val()){
				setMap($map_form.find('#pos_y').val(), $map_form.find('#pos_x').val(), 'N', null, null, map_api, true, 'Y', $map_form.find('#zoom').val(), getMarkerByColorType($map_form.find('#category_color_type').val()));
			}else{
				setMap(37.5666805, 126.9784147, 'N', null, null, map_api, true, 'Y', 17, getMarkerByColorType($map_form.find('#category_color_type').val()));
			}

			if($map_form.find('#address').val()){
				$map_editor.find('._map_search').val($map_form.find('#address').val());
			}
			if($map_form.find('#sub_address').val()){
				$map_editor.find('#s_address').val($map_form.find('#sub_address').val());
			}
			if($map_form.find('#phone_number').val()){
				$map_editor.find('#number').val($map_form.find('#phone_number').val());
			}
			if($map_form.find('#web_address').val()){
				$map_editor.find('#h_address').val($map_form.find('#web_address').val());
			}

			$("body").off('mousedown.map').on('mousedown.map', function(e){
				var t3 = $(e.target);
				if(t3.closest('._map_moda_content').length == 0){
					$map_editor.hide();
					$('._calendar_modal_back').hide();
					if($map_form.find('#add_address_ck').val() == 'N'){
						searchDataClear('back');
					}
				}
			});

			$map_editor.find('._map_editor_close').on('click', function(){
				$map_editor.hide();
				$('._calendar_modal_back').hide();
				if($map_form.find('#add_address_ck').val() == 'N'){
					searchDataClear('close');
				}
			});

			$map_editor.find('._map_adress_add').on('click', function(){
				if(!$map_editor.find('._map_search').val()){
					if(map_api === 'google'){
						alert(LOCALIZE.설명_주소장소를검색해주세요());
					}else{
						alert(LOCALIZE.설명_도로명지번을검색해주세요());
					}
				}else{
					if(!$map_form.find('#temp_pos_x').val() || !$map_form.find('#temp_pos_y').val()){
						alert(LOCALIZE.설명_주소검색버튼을눌러주세요());
					}else{
						searchDataAdd();
					}
				}
			});
			$map_editor.find('#s_address,#number,#h_address').keypress(function(e){
				if(e.keyCode == '13'){
					if(!$map_editor.find('._map_search').val()){
						if(map_api === 'google'){
							alert(LOCALIZE.설명_주소장소를검색해주세요());
						}else{
							alert(LOCALIZE.설명_도로명지번을검색해주세요());
						}
					}else{
						searchDataAdd();
					}
				}
			});
		}else{
			alert(LOCALIZE.설명_장소를수정할수없습니다());
		}
	};
	/**
	 * 장소 검색
	 * @param val
	 * @param map_api
	 * @return {boolean}
	 */
	var mapAddressSearch = function(val, map_api){
		if(val == '') {
			$map_editor.find('._search_result').hide();
			if(map_api === 'google'){
				alert(LOCALIZE.설명_주소장소를검색해주세요());
			}else{
				alert(LOCALIZE.설명_도로명지번을검색해주세요());
			}
			return false;
		}
		$.ajax({
			type : 'POST',
			data : {keyword: val, map_api: map_api},
			url : ('/admin/ajax/map_search.cm'),
			dataType : 'json',
			async : true,
			cache : false,
			success : function(res){
				$map_editor.find('._search_list').empty();
				if(res.msg == 'SUCCESS'){
					if(res.count > 0){
						if(typeof res.data.errorMessage !== 'undefined'){
							// 에러 메시지가 넘어왔을 때
							var item = $('<li><span class="txt">' + res.data.errorMessage + '</span></li>')
								.on('click', function(){
									$map_editor.find('._search_result').hide();
								});
							$map_editor.find('._search_list').append(item);
						}else{
							$.each(res.data, function(e, _data){
								var item = $('<li><span class="txt">' + _data.address + '</span></li>').data({
									lat : _data.lat,
									lng : _data.lng,
									address : _data.address
								})
									.on('click', function(){
										$map_editor.find('._map_search').val($(this).data('address'));
										var tmp = {
											'lat' : $(this).data('lat'),
											'lng' : $(this).data('lng'),
											'address' : $(this).data('address')
										};
										$map_editor.find('._search_result').hide();
										var zoom = $map_form.find('#temp_zoom').val() ? $map_form.find('#temp_zoom').val() : 17;
										if(map_api === 'google'){
											var latlng = new google.maps.LatLng($(this).data('lat'), $(this).data('lng'));
											target_map.setCenter(latlng);
											target_marker.setPosition(latlng);
										}else{
											var latlng = new naver.maps.LatLng($(this).data('lat'), $(this).data('lng'));
											target_map.setCenter(latlng);
											target_marker.setPosition(latlng);
										}
										$map_form.find('#temp_pos_x').val($(this).data('lng'));
										$map_form.find('#temp_pos_y').val($(this).data('lat'));
									});
								$map_editor.find('._search_list').append(item);
							});
						}
					}else{
						var item = $('<li><span class="txt">' + LOCALIZE.설명_검색결과가존재하지않습니다() + '</span></li>')
							.on('click', function(){
								$map_editor.find('._search_result').hide();
							});
						$map_editor.find('._search_list').append(item);
					}
					$map_editor.find('._search_result').show();
				}else{
					$map_editor.find('._search_result').hide();
				}
			}
		});
	};
	/**
	 * api에 따른 맵 설정
	 * @param lat
	 * @param lng
	 * @param detail
	 * @param $obj
	 * @param m_data
	 * @param map_api
	 * @param editable 장소 수정 가능 여부
	 * @param scroll_wheel 스크롤휠로 확대 축소 허용 여부(지도 게시판 설정에서 받아옴)
	 * @param zoom
	 * @param marker_url
	 */
	var setMap = function(lat,lng,detail,$obj,m_data,map_api,editable,scroll_wheel,zoom,marker_url){
		if($obj){
			$obj.find('#_gmap').get(0).innerHTML = '';
		}else{
			$map_editor.find('#_gmap').get(0).innerHTML = '';
		}
		var _marker_url = marker_url ? marker_url : '//static.imweb.me/vendor/images/marker/marker_red.png';
		if(map_api === 'naver')
			setNaverMap(lat,lng,detail,$obj,m_data,editable,scroll_wheel,zoom,_marker_url);
		else
			setGoogleMap(lat,lng,detail,$obj,m_data,editable,scroll_wheel,zoom,_marker_url);

	};
	/**
	 *
	 * @param lat
	 * @param lng
	 * @param detail
	 * @param $obj
	 * @param m_data
	 * @param editable
	 * @param scroll_wheel
	 * @param zoom
	 * @param marker_url
	 */
	var setNaverMap = function(lat,lng,detail,$obj,m_data,editable,scroll_wheel,zoom,marker_url){
		var latlng = new naver.maps.LatLng(lat,lng);

		var myOptions = {
			zoom: parseInt(zoom),
			useStyleMap: true,
			center: latlng,
			mapTypeId: naver.maps.MapTypeId.NORMAL,
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: true,
			disableDoubleClickZoom: true,
			scrollWheel: scroll_wheel === 'Y'
		};

		if($obj){
			target_map = new naver.maps.Map($obj.find('#_gmap').get(0), myOptions);
		}else{
			target_map = new naver.maps.Map($map_editor.find('#_gmap').get(0), myOptions);
		}

		target_marker = new naver.maps.Marker({
			position: latlng,
			map: target_map,
			clickable: true,
			icon: {
				url : marker_url,
				size : new naver.maps.Size(27, 35.5),
				scaledSize : new naver.maps.Size(27, 35.5)
			}
		});

		if(editable){
			naver.maps.Event.addListener(target_map, 'click', function(event) {
				// 클릭 시 클릭한 지점으로 마커 및 지도 이동
				target_map.setCenter(event.latlng);
				target_marker.setPosition(event.latlng);
				$map_form.find('#temp_pos_x').val(event.latlng._lng);
				$map_form.find('#temp_pos_y').val(event.latlng._lat);
			});
			naver.maps.Event.addListener(target_map, 'drag', function(event) {
				// 드래그 중에는 마커만 가운데에 고정
				target_marker.setPosition(target_map.getCenter());
			});
			naver.maps.Event.addListener(target_map, 'dragend', function(event) {
				// 드래그 종료 시에 값 저장
				var map_center = target_map.getCenter();
				target_marker.setPosition(map_center);
				$map_form.find('#temp_pos_x').val(map_center._lng);
				$map_form.find('#temp_pos_y').val(map_center._lat);
				// 드래그 완료된 지점으로 마커 클릭이벤트 새로 연결
				naver.maps.Event.clearListeners(target_marker, 'click');
			});
			naver.maps.Event.addListener(target_map, 'mouseout', function(event){
				$map_form.find('#temp_zoom').val(target_map.getZoom());
			});
			$map_editor.find('._map_adress_add').on('click', function(){
				$map_form.find('#temp_zoom').val(target_map.getZoom());
			});
		}else{
			if(detail === 'Y'){
				var info_name = '';
				var info_phone_number = '';
				var info_address = '';
				if(typeof m_data.subject != 'undefined' && m_data.subject != ''){
					info_name = '<header><div class="box_tit">' + m_data.subject + '</div></header>';
				}
				if(typeof m_data.address != 'undefined' && m_data.address != ''){
					if(typeof m_data.phone_number != 'undefined' && m_data.phone_number != ''){
						info_phone_number = '<span class="map_tell" style="display: block">' + m_data.phone_number + '</span>';
						info_address = '<p class="map_adress">' + m_data.address + info_phone_number + '</p>';
					}else{
						info_address = '<p class="map_adress">' + m_data.address + '</p>';
					}
				}

				if(info_name != '' || info_address != ''){
					var contentString1 = '<div class="map_info_box">' + info_name + info_address + '</div>';
					var infowindow = new naver.maps.InfoWindow({
						content : contentString1
					});
					infowindow.open(target_map, target_marker);
				}

				target_marker.addListener('click', function(){
					infowindow.open(target_map, target_marker);
				});
			}else{
				target_marker.addListener('click', function(){
					if(IS_MOBILE){
						var map_link = m_data.sub_address ? 'https://m.map.naver.com/search2/search.nhn?query=' + m_data.address + '%20' + m_data.sub_address + '&sm=sug&style=v5#/map/1' : 'https://m.map.naver.com/search2/search.nhn?query=' + m_data.address + '&sm=sug&style=v5#/map/1';
					}else{
						var map_link = m_data.sub_address ? 'https://map.naver.com/v5/search/' + m_data.address + '%20' + m_data.sub_address : 'https://map.naver.com/v5/search/' + m_data.address;
					}
					window.open(map_link);
				});
			}
		}
	};
	/**
	 *
	 * @param lat
	 * @param lng
	 * @param detail
	 * @param $obj
	 * @param m_data
	 * @param editable
	 * @param scroll_wheel
	 * @param zoom
	 * @param marker_url
	 */
	var setGoogleMap = function(lat,lng,detail,$obj,m_data,editable,scroll_wheel,zoom,marker_url){
		var latlng = new google.maps.LatLng(lat,lng);

		var myOptions = {
			zoom: parseInt(zoom),
			center: latlng,
			mapTypeId: 'roadmap',
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			rotateControl: false,
			disableDoubleClickZoom : true,
			gestureHandling: 'auto',
			controlSize: 29
		};

		var styles = [
			{
				'stylers': []
			}
		];

		if($obj){
			target_map = new google.maps.Map($obj.find('#_gmap').get(0), myOptions);
		}else{
			target_map = new google.maps.Map($map_editor.find('#_gmap').get(0), myOptions);
		}
		target_map.setOptions({styles: styles});

		target_marker = new google.maps.Marker({
			position: latlng,
			map: target_map,
			icon: {
				url: marker_url,
				size: new google.maps.Size(27, 35.5),
				scaledSize: new google.maps.Size(27, 35.5)
			},
			shadow: null,
			title: name
		});

		if(editable){
			google.maps.event.addListener(target_map, 'click', function(event) {
				// 클릭 시 클릭한 지점으로 마커 및 지도 이동
				target_map.setCenter(event.latLng);
				target_marker.setPosition(event.latLng);
				$map_form.find('#temp_pos_x').val(event.latLng.lng());
				$map_form.find('#temp_pos_y').val(event.latLng.lat());
			});
			google.maps.event.addListener(target_map, 'drag', function(event) {
				// 드래그 중에는 마커만 가운데에 고정
				target_marker.setPosition(target_map.getCenter());
			});
			google.maps.event.addListener(target_map, 'dragend', function(event) {
				// 드래그 종료 시에 값 저장
				var map_center = target_map.getCenter();
				target_marker.setPosition(map_center);
				$map_form.find('#temp_pos_x').val(map_center.lng());
				$map_form.find('#temp_pos_y').val(map_center.lat());
				// google 지도 드래그 시 관성 방지
				target_map.setCenter(map_center);
				// 드래그 완료된 지점으로 마커 클릭이벤트 새로 연결
			});
			google.maps.event.addListener(target_map, 'mouseout', function(event){
				$map_form.find('#temp_zoom').val(target_map.getZoom());
			});
			$map_editor.find('._map_adress_add').on('click', function(){
				$map_form.find('#temp_zoom').val(target_map.getZoom());
			});
		}else{
			if(detail == 'Y'){
				var info_name = '';
				var info_phone_number = '';
				var info_address = '';
				if(typeof m_data.subject != 'undefined' && m_data.subject != ''){
					info_name = '<header><div class="box_tit">' + m_data.subject + '</div></header>';
				}
				if(typeof m_data.address != 'undefined' && m_data.address != ''){
					if(typeof m_data.phone_number != 'undefined' && m_data.phone_number != ''){
						info_phone_number = '<span class="map_tell" style="display: block">' + m_data.phone_number + '</span>';
						info_address = '<p class="map_adress">' + m_data.address + info_phone_number + '</p>';
					}else{
						info_address = '<p class="map_adress">' + m_data.address + '</p>';
					}
				}

				if(info_name != '' || info_address != ''){
					var contentString1 = '<div class="map_info_box">' + info_name + info_address + '</div>';
					var infowindow = new google.maps.InfoWindow({
						content : contentString1
					});
					infowindow.open(target_map, target_marker);
				}

				target_marker.addListener('click', function(){
					infowindow.open(target_map, target_marker);
				});
			}else{
				target_marker.addListener('click', function(){
					var map_link = m_data.sub_address ? 'http://www.google.cn/maps/search/' + m_data.address + '%20' + m_data.sub_address : 'http://www.google.cn/maps/search/' + m_data.address;
					if(LIMIT_API_LIST.indexOf('google_map') === -1){
						map_link = m_data.sub_address ? 'https://www.google.com/maps/search/' + m_data.address + '%20' + m_data.sub_address : 'https://www.google.com/maps/search/' + m_data.address;
					}
					window.open(map_link);
				});
			}
		}
	};

	/**
	 * 게시물 수정 중 장소 정보 지우기
	 * @param map_api		naver, google, null(지도 API 키가 없을 때 주소 등록이 불가능하므로 삭제도 방지)
	 */
	var addressDelete = function(map_api){
		if(map_api)
			searchDataClear('delete');
		else
			alert(LOCALIZE.설명_장소를수정할수없습니다());
	};

	/**
	 * 위치 데이터 삭제 또는 초기화
	 * @param type
	 */
	var searchDataClear = function(type){
		if(type == 'back'){
			$map_form.find('#temp_pos_x').val('');
			$map_form.find('#temp_pos_y').val('');
			$map_form.find('#temp_zoom').val('');
			$map_editor.find('._map_search').val('');
			$map_editor.find('#s_address').val('');
			$map_editor.find('#number').val('');
			$map_editor.find('#h_address').val('');
		}else if(type == 'close'){
			$map_form.find('#temp_pos_x').val('');
			$map_form.find('#temp_pos_y').val('');
			$map_form.find('#temp_zoom').val('');
			$map_editor.find('._map_search').val('');
			$map_editor.find('#s_address').val('');
			$map_editor.find('#number').val('');
			$map_editor.find('#h_address').val('');
		}else if(type == 'delete'){
			$map_form.find('#add_address_ck').val('N');
			$map_form.find('#pos_x').val(126.9784147);
			$map_form.find('#pos_y').val(37.5666805);
			$map_form.find('#zoom').val(17);
			$map_form.find('#temp_pos_x').val('');
			$map_form.find('#temp_pos_y').val('');
			$map_form.find('#temp_zoom').val(17);
			$map_form.find('#phone_number').val('');
			$map_form.find('#address').val('');
			$map_form.find('#sub_address').val('');
			$map_form.find('._add_map').removeClass('on');
			$map_form.find('._address').text('');
			$map_form.find('._phone').text('');
			$map_form.find('._web_address').text('');
			$map_form.find('#web_address').val('');
			$map_editor.find('._map_search').val('');
			$map_editor.find('#s_address').val('');
			$map_editor.find('#number').val('');
			$map_editor.find('#h_address').val('');
		}
	};

	/**
	 * 위치 데이터 추가
	 */
	var searchDataAdd = function(){
		$map_form.find('#address').val($map_editor.find('._map_search').val());
		$map_form.find('#sub_address').val($map_editor.find('#s_address').val());
		$map_form.find('#phone_number').val($map_editor.find('#number').val());
		$map_form.find('#web_address').val($map_editor.find('#h_address').val());
		$map_form.find('._add_map').addClass('on');
		$map_form.find('._address').text($map_editor.find('._map_search').val()+' '+$map_editor.find('#s_address').val());
		$map_form.find('._phone').text($map_editor.find('#number').val());
		$map_form.find('._web_address').text($map_editor.find('#h_address').val());
		$map_form.find('#add_address_ck').val('Y');
		if($map_form.find('#temp_pos_x').val() && $map_form.find('#temp_pos_y').val()){
			$map_form.find('#pos_x').val($map_form.find('#temp_pos_x').val());
			$map_form.find('#pos_y').val($map_form.find('#temp_pos_y').val());
		}
		$map_form.find('#zoom').val($map_form.find('#temp_zoom').val());
		$map_editor.hide();
		$('._calendar_modal_back').hide();
	};

	/**
	 * 위치 정보 입력 완료
	 * @param map_api
	 */
	var mapSubmit = function(map_api){
		var address = $map_form.find('input#address').val();
		if(address != ''){
			if(IE_VERSION < 10){
				var body = CKEDITOR.instances.map_body.getData();
				var plain_text = $(body).text();
				$map_form.find('#body_input').val(body);
				$map_form.find('#plain_body_input').val(plain_text);
				$map_form.submit();
			}else{
        if($map_form.find('#map_body').hasClass('fr-code-view')) FroalaEditor('#map_form #map_body').codeView.toggle();
        var body = FroalaEditor('#map_form #map_body').html.get(true);
				var plain_text = $(body).text();
				$map_form.find('#body_input').val(body);
				$map_form.find('#plain_body_input').val(plain_text);
				$map_form.submit();
			}
		}else{
			alert(LOCALIZE.설명_주소를입력하세요());
			mapEditorPop(map_api);
		}
	};

	var mapCancel = function(back_url){
		if(isIOS && isSafari){
			var s_top = $(this).scrollTop();
			$write_header.css({'-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': 0});
			$fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
			$fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
			if(s_top > m_sticky_container_trigger_top){
				$toolbarContainer.css({'-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': $write_header.height() + 'px'});
			}else{
				$toolbarContainer.css({'-webkit-transition': 'none', 'transition': 'none', 'top': 'auto'});
			}
		}
		document.location.href = back_url;
	};

	/**
	 *
	 * @param idx
	 * @param back_url
	 * @param board_code
	 * @param map_api		naver, google, null(지도 API 키가 없을 경우)
	 * @param scroll_wheel		스크롤휠로 확대 축소 허용 여부
	 * @param is_ignore		window width 무시 여부
	 */
	var getTypeMapView = function(idx,back_url, board_code, map_api, scroll_wheel, is_ignore = true){
    const check_ww = window.innerWidth;
    if(check_ww > 767 && !is_ignore) return false;
		cancelFullScreen();
		$('html').addClass('fullboard_on');
		location.hash = '/map'+idx;
		back_url = back_url+location.hash;
		var is_update_time = $('._map_view_' + board_code + ' select[name=sort]').val() === 'UPDATE' ? 'Y' : 'N';
		$.ajax({
			type		: 'post',
			data:{'idx':idx,'board_code':board_code,'back_url':back_url, 'update_time':is_update_time},
			url			: '/ajax/map_more_view.cm',
			dataType 	: 'json',
			async       : false,
			cache       : false,
			success		: function(result){
				if(result.msg == 'SUCCESS'){
					SNS.init(result.sns_init_data);
					$('[data-toggle="tooltip"]').tooltip();
					var $html = $(result.html);
					$('body').append($html);
					if(IS_ANDROID_APP == 'Y'){
						var height = 0;
						var org_height = 0;
						org_height = $("html,body").height();
						height = $("html,body").height()+100;
						$("html,body").css('height',height);
						$html.scroll(function(){
							$("html,body").scrollTop($(this).scrollTop());
						});
					}else{
						$('body').css('overflow','hidden');
					}
					if(!result.require_login && !result.deny && !result.require_pass){
						if(map_api){
							var marker_url = '//static.imweb.me/vendor/images/marker/marker_red.png';
							var category_list = JSON.parse(result.category_list);
							if(result.data.category_code){
								marker_url = getMarkerByCategoryCode(result.data.category_code, category_list);
							}
							setMap(result.data.pos_y, result.data.pos_x, 'N', $('#maps_more'), result.data, map_api, false, scroll_wheel, result.data.zoom, marker_url);
						}else{
							var map_disable_html = '<div class="widget_map_disable"></div>';
							$('#_gmap').html(map_disable_html);
						}
					}
					$(window).off('hashchange').on('hashchange',function(){
						var old_hash_url_tmp;
						var old_hash_url;
						var new_hash_url_tmp;
						var new_hash_url;
						old_hash_url_tmp = location.hash.split('#');
						if(old_hash_url_tmp[1]){
							old_hash_url = old_hash_url_tmp[1].split('map');
						}
						new_hash_url_tmp = back_url.split('#');
						new_hash_url = new_hash_url_tmp[1].split('map');
						if(!location.hash){
							$('body').find('#maps_more').remove();
							$('body').css('overflow','');
						}else{
							if(typeof old_hash_url[1] != 'undefined' && old_hash_url[1] != '' && old_hash_url[1] != 'null'){
								if(old_hash_url[1] != new_hash_url[1]){
									getTypeMapView(old_hash_url[1], null, board_code, map_api, scroll_wheel);
								}
							}
						}
					});
					POST_COMMENT.init(result.data.code);
					$('body').find('#map_more_close').off('click').on('click',function(){
						$('html').removeClass('fullboard_on');
						if(IS_ANDROID_APP == 'Y'){
							$("html,body").css('height',org_height);
						}
						$('body').find('#maps_more').remove();
						$('body').css('overflow','');
						location.hash = '';
					});
					$('body').addClass('map_view');
				}else{
					alert(result.msg);
				}
			}
		});
	};

	/**
	 * 전체화면 보기 상태일 때 전체화면 해제
	 */
	var cancelFullScreen = function(){
		if (document.fullscreenElement){
			document.exitFullscreen();
		} else if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {		// FireFox
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {		// Chrome
			document.webkitCancelFullScreen();
		} else if (document.msExitFullscreen) {		// IE
			document.msExitFullscreen();
		}
	};

	/**
	 *
	 * @param board_code
	 * @param code
	 * @param return_url
	 */
	var deleteMap = function (board_code,code,return_url){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type		: 'post',
				data:{'mcode':code,board_code:board_code},
				url			: '/ajax/deleteMap.cm',
				dataType 	: 'json',
				success		: function(result){
					if(result.msg == 'SUCCESS'){
						window.location.href = return_url;
					}else{
						alert(result.msg);
					}
				}
			});
		}
	};

	var mapListToggle = function($obj){
		if($obj.hasClass('fold') === true){
			$obj.removeClass('fold');
		}else{
			$obj.addClass('fold');
		}
	};

	var mapSearchToggle = function($obj,type){
		if(type == 'show'){
			$obj.find('.head_wrap').hide();
			$obj.find('.search-wrap').show();
		}
		if(type == 'hide'){
			$obj.find('.head_wrap').show();
			$obj.find('.search-wrap').hide();
		}
	};

	var mapListChange = function($obj,type){
		if(type=='map'){
			$obj.addClass('fold');
		}
		if(type=='list'){
			$obj.removeClass('fold');
		}
	};

	/**
	 * 브라우저 위치 정보 받기
	 * @param force true일 경우 위치 정보 쿠키가 있어도 갱신
	 */
	var posCreat = function(force){
		if(force || (!getCookie('lng') && !getCookie('lat'))){
			var option = {
				enableHighAccuracy:false,
				timeout : 5000,
				maximumAge: 60000
			};
			var geolocation_timeout;

			if(IS_ANDROID_APP == 'Y' && APP_VERSION >= 97000){
				window.dozAndroidBridge.getLocationData();
			}else{
				if(navigator.geolocation){
					function success(pos){
						clearTimeout(geolocation_timeout);
						var crd = pos.coords;
						if(getCookie('lat') != crd.latitude && getCookie('lng') != crd.longitude){
							setCookie('lat', crd.latitude, 7);
							setCookie('lng', crd.longitude, 7);
						}
					}

					function error(err){
						clearTimeout(geolocation_timeout);
						if(!(!!err)){
							err = {};
							err.code = 1;
						}
						switch(err.code){
							case 0: //0: '위치 정보 검색에 문제가 있습니다.
								$(function(){
									alert(LOCALIZE.설명_위치정보검색에문제가있습니다());
								});
								break;
							case 1: //1: '현재 페이지에서 사용자가 위치 정보 검색을 거부했습니다.',
								$(function(){
									alert(LOCALIZE.설명_위치정보검색을허용해주세요());
								});
								break;
							case 2: //2: '브라우저가 위치정보를 검색하지 못했습니다.
								$(function(){
									alert(LOCALIZE.설명_위치정보를검색하지못했습니다());
								});
								break;
							case 3: //3: '브라우저의 위치 정보 검색 시간이 초과됐습니다.'
								$(function(){
									alert(LOCALIZE.설명_위치정보검색시간을초과하였습니다());
								});
								break;
							default:
								break;
						}
					}

					geolocation_timeout = setTimeout(error, option.timeout);
					navigator.geolocation.getCurrentPosition(success, error, option);
				}else{
					alert(LOCALIZE.설명_위치검색이지원되지않는브라우져입니다());
				}
			}
		}
	};

	/**
	 * 내 위치 중심으로 이동
	 * @param board_code
	 * @param map_api
	 */
	var moveUserPosition = function(board_code, map_api){
		posCreat(true);
		userPosCreat(board_code, map_api);
		var userLat = getCookie('lat');
		var userLng = getCookie('lng');
		if(map_api === 'naver'){
			if(userLng >= 124 && userLng <= 132 && userLat >= 33 && userLat <= 43){
				naver_map[board_code].setOptions({center : new naver.maps.LatLng(userLat, userLng)});
			}
		}else{
			var target_map = $('#gmap_' + board_code).gmap3('get');
			target_map.setCenter(new google.maps.LatLng(userLat, userLng));
		}
	};

	/**
	 * 앱에서 위치정보 전송시 호출
	 */
	var setAndroidLocationData = function(latitude, longitude){
		if(latitude < 0 || longitude < 0){
			alert(LOCALIZE.설명_기기의위치정보검색실패());
		}else{
			if(getCookie('lat') != latitude && getCookie('lng') != longitude){
				setCookie('lat', latitude, 7);
				setCookie('lng', longitude, 7);
			}
			//location.reload();
		}
	};

	/**
	 * 정보창 내용 생성
	 * @param board_code
	 * @param post_id
	 * @returns {string}
	 */
	function getInfoWindowData(board_code, post_id){
		var data = '';
		var idx = post_id.split('list_')[1];
		$.ajax({
			type : 'post',
			data : {'idx' : idx, 'board_code' : board_code},
			url : '/ajax/get_map_post_data.cm',
			dataType : 'json',
			async : false,
			cache : false,
			success : function(result){
				if(result.msg === 'SUCCESS'){
					var post_data = result.post_data;
					var thumb_data = result.thumb_data;
					var board_data = result.board_data;
					var $map_view = $('._map_view_' + board_code);
					var menu_url = $map_view.find('input[name=menu_url]').val();
					var keyword_type = $map_view.find('input[name=keyword_type]').val();
					var category = $map_view.find('select[name=category]').val();
					var keyword = $map_view.find('input[name=keyword]').val();
					var sort = $map_view.find('select[name=sort]').val();
					var page = $map_view.find('ul.pagination > li.active > a').text();
					var sort_str = sort ? '?sort='+sort : '?sort=TIME';
					var category_str = category ? '&category='+category : '';
					var keyword_str = keyword ? '&keyword='+keyword : '';
					var keyword_type_str = keyword_type ? '&keyword_type='+keyword_type : '';
					var page_str = page ? '&page='+page : '';
					var back_link = menu_url + sort_str + category_str + keyword_str + keyword_type_str + page_str;
					var show_like_cnt_tag = "";
					var show_cmt_cnt_tag = "";
					var show_read_cnt_tag = "";
					var show_account_tag = "";
					var close_btn = "";
					var like_on = post_data.like_cnt > 0 ? 'on' : '';
					var like_btn_possible = result.like_btn_possible;

					if(board_data.show_like_cnt === 'Y'){
						show_like_cnt_tag = "<span class='comment_num no-padding-x no-pointer'>" +
							"<i class='icon-bubble vertical-middle' style='margin-right: 5px'></i>" +
							"<em class='_comment_count'>" + post_data.comment_cnt + "</em>" +
							"</span>";
					}
					if(board_data.show_cmt_cnt === 'Y'){
						show_cmt_cnt_tag = "<span class='comment_num no-padding-x like_btn " + like_on + "' id='like_btn_" + post_data.code + "'";
						if(like_btn_possible){
							show_cmt_cnt_tag += " onclick=\"mapClickLike('" + post_data.idx + "', '" + board_data.listing + "', '" + post_data.code + "', '" + result.like_token_key + "', '" + result.like_token + "', false); return false;\"";
						}
						show_cmt_cnt_tag += ">" +
							"<i class='btm bt-heart vertical-middle' style='margin-right: 5px'></i>" +
							"<em class='_like_count' id='like_count_" + post_data.code + "'>" + post_data.like_cnt + "</em>" +
							"</span>";
					}
					if(board_data.show_hit_cnt === 'Y'){
						show_read_cnt_tag = "<span class='comment_num no-padding-x'>" +
							"<i class='icon-eye vertical-middle' style='margin-right: 5px'></i>" +
							"<em class='_read_count'>" + post_data.read_cnt + "</em>" +
							"</span>";
					}
					if(board_data.show_account === 'Y'){
						show_account_tag = "<p class='tell'>" + post_data.phone_number + "</p>";
					}
					var scroll_wheel = board_data.map_scroll_wheel;
					var api = board_data.map_api;
					// Google 지도는 자체적으로 닫기 버튼 포함
					if(api !== 'google'){
						close_btn = "<div class='map_contents_close' style='top: 5px; right: 5px;'>" +
							"<a href='javascript:;' onclick=\"MAP.infowindowClose('" + api + "', '" + post_id + "', '" + board_code + "')\"><i class='btl bt-times'></i></a>" +
							"</div>";
					}
					if(thumb_data){
						data =
							"<div style='padding: 9px 15px;'>" +
							"<a href='javascript:;' onclick=\"MAP.getTypeMapView('" + idx + "','" + back_link + "', '" + board_code + "', '" + api + "', '" + scroll_wheel + "')\">" +
							"<div class='map_container map_container_view map-inner $cover_class _map_container' id='list_pop_" + idx + "'>" +
							"<div class='thumb'>" +
							"<img src='" + CDN_THUMBNAIL_URL + thumb_data.url + "'>" +
							"</div>" +
							"<div class='map_contents'>" +
							"<div class='head'>" +
							"<div class='tit'>" + RemoveTag(post_data.subject) + "</div>" +
							"</div>" +
							"<div class='p_group'> " +
							"<p class='adress'>" + RemoveTag(post_data.address) + "</p>" +
							show_account_tag +
							"</div>" +
							"<div class='btn-gruop btn-group-comment'>" +
							show_like_cnt_tag +
							show_cmt_cnt_tag +
							show_read_cnt_tag +
							"</div>" +
							close_btn +
							"<div class='text-center'><a href='javascript:;'  onclick=\"MAP.getTypeMapView('" + idx + "','" + back_link + "', '" + board_code + "', '" + api + "', '" + scroll_wheel + "')\" class='btn btn-xs bg-brand' style='margin-top:15px; letter-spacing: 0; border-radius: 30px;'>" + LOCALIZE.버튼_상세보기() + "</a></div>" +
							"</div>" +
							"</div>" +
							"</a>" +
							"</div>";
					}else{
						data =
							"<a href='javascript:;' onclick=\"MAP.getTypeMapView('" + idx + "','" + back_link + "', '" + board_code + "', '" + api + "', '" + scroll_wheel + "')\">" +
							"<div class='map_container  map-inner $cover_class _map_container' id='list_pop_" + idx + "'>" +
							"<div class='map_contents'>" +
							"<div class='head'>" +
							"<div class='tit'>" + RemoveTag(post_data.subject) + "</div>" +
							"</div>" +
							"<div class='p_group'> " +
							"<p class='adress'>" + RemoveTag(post_data.address) + "</p>" +
							show_account_tag +
							"</div>" +
							"<div class='btn-gruop btn-group-comment'>" +
							show_like_cnt_tag +
							show_cmt_cnt_tag +
							show_read_cnt_tag +
							"</div>" +
							close_btn +
							"<div class='text-center'><a href='javascript:;'  onclick=\"MAP.getTypeMapView('" + idx + "','" + back_link + "', '" + board_code + "', '" + api + "', '" + scroll_wheel + "')\" class='btn btn-xs bg-brand' style='margin-top:15px; letter-spacing: 0; border-radius: 30px;'>" + LOCALIZE.버튼_상세보기() + "</a></div>" +
							"</div>" +
							"</div>" +
							"</a>";
					}
				}
			}
		});

		return data;
	}

	/**
	 * 지도 위에 마커 표시 및 정보창 설정
	 * @param board_code
	 * @param api
	 * @param category_list
	 * @param category
	 * @param scroll_wheel
	 * @param marker_clustering
	 * @param is_refresh		마커 새로고침일 경우 지도는 새로 생성하지 않음
	 */
	var listView = function(board_code,api, category_list, category, scroll_wheel, marker_clustering, is_refresh){
		var id = '#gmap_' + board_code;
		if(typeof category === 'undefined') category = '';
		if(typeof markers[board_code] === 'undefined') markers[board_code] = [];
		if(typeof infowindows[board_code] === 'undefined') infowindows[board_code] = [];
		if(typeof map_data[board_code] === 'undefined') map_data[board_code] = [];
		if(typeof is_refresh == 'undefined') is_refresh = false;
		var list_data = [];

		$.each(map_data[board_code],function(k,v){
			// 카테고리에 해당되고 숨김처리 되지 않은 마커만 표시
			if((category === '' || category === v.category_code) && v.is_hide !== 'Y'){
				var value_obj = {};
				value_obj.category_code = v.category_code;
				value_obj.id = 'list_' + v.idx;
				value_obj.latLng = [v.pos_y, v.pos_x];

				if(api === 'naver'){
					list_data[value_obj.id] = value_obj;
				}else{
					value_obj.options = {
						icon: {
							url: getMarkerByCategoryCode(v.category_code, category_list),
							size: new google.maps.Size(27, 35.5),
							scaledSize: new google.maps.Size(27, 35.5)
						}
					};
					list_data.push(value_obj);
				}
			}
		});
		if(api === 'naver'){
			/* 네이버 지도 설정 시작 */
			var myOptions = {
				minZoom : 6,
				useStyleMap: true,
				mapTypeId : naver.maps.MapTypeId.NORMAL,
				zoomControl : true,
				zoomControlOptions : {
					position : naver.maps.Position.RIGHT_TOP
				},
				mapTypeControl : false,
				scaleControl : true,
				disableDoubleClickZoom : true,
				scrollWheel : scroll_wheel === 'Y'
			};

			naver_map[board_code] = new naver.maps.Map('gmap_' + board_code, myOptions);

			for(var key in list_data){
				var context = list_data[key];
				var position = new naver.maps.LatLng(context.latLng[0], context.latLng[1]);
				var marker_url = getMarkerByCategoryCode(context.category_code, category_list);
				var marker = new naver.maps.Marker({
					map: naver_map[board_code],
					position: position,
					clickable: true,
					icon: {
						url : marker_url,
						size : new naver.maps.Size(27, 35.5),
						scaledSize : new naver.maps.Size(27, 35.5)
					}
				});
				var contentString = context.data;
				var infowindow = new naver.maps.InfoWindow({
					content: contentString
				});
				markers[board_code][context.id] = marker;
				infowindows[board_code][context.id] = infowindow;
			}

			/**
			 * 마커 클릭 이벤트 설정
			 * @param post_id
			 * @return {Function}
			 */
			function getClickHandler(post_id){
				return function(e) {
					var marker = markers[board_code][post_id],
						infowindow = infowindows[board_code][post_id];

					if (infowindow.getMap()) {
						infowindow.close();
					}else{
						infowindow.setContent(getInfoWindowData(board_code, post_id));
						infowindow.open(naver_map[board_code], marker);
						
						
						// 해당 마커를 지도 중심으로 이동
						naver_map[board_code].setOptions({center: new naver.maps.LatLng(marker.position._lat, marker.position._lng)});
						naverMarkCenter(naver_map[board_code]);
					}
				}
			}

			var leftBound = null, rightBound = null, topBound = null, bottomBound = null;
			for(var key in markers[board_code]){
				var marker = markers[board_code][key];
				naver.maps.Event.addListener(marker, 'click', getClickHandler(key));
				var nowLng = marker.position._lng, nowLat = marker.position._lat;
				if(nowLng >= 124 && nowLng <= 132 && nowLat >= 33 && nowLat <= 43){
					// 국내 범위 내
					if(leftBound === null){
						// 첫 실행 시 마커 좌표를 경계로 설정
						leftBound = nowLng;
						rightBound = nowLng;
						topBound = nowLat;
						bottomBound = nowLat;
					}else{
						// 마커가 전부 들어오는 기준으로 경계 설정(국내 한정이므로 음수 구간 생각하지 않아도 됨)
						if(leftBound > nowLng){
							leftBound = nowLng;
						}else if(rightBound < nowLng){
							rightBound = nowLng;
						}
						if(topBound > nowLat){
							topBound = nowLat;
						}else if(bottomBound < nowLat){
							bottomBound = nowLat;
						}
					}
				}
			}
			if(leftBound !== null){
				// 국내에 포함된 마커들로 경계 설정, 마커가 하나도 없을 경우 기본값 서울시청
				var bounds = new naver.maps.LatLngBounds(new naver.maps.LatLng(topBound, leftBound), new naver.maps.LatLng(bottomBound, rightBound));
				var margin = {top: 10, right: 10, bottom: 10, left: 10};
				if(!IS_MOBILE){
					// 좌측 map-list가 차지하는 340px 너비의 공간 고려
					margin = {top: 10, right: 10, bottom: 10, left: 350};
				}
				naver_map[board_code].fitBounds(bounds, margin);
			}
			if(marker_clustering === 'Y'){
				naver_cluster_marker1 = {
					content : '<div style="cursor:pointer;width:53px;height:53px;line-height:53px;font-size:11px;color:#FFFFFF;text-align:center;font-weight:bold;background:url(//static.imweb.me/vendor/images/markerclusterer/m1.png);background-size:contain;"></div>',
					size : naver.maps.Size(53, 53),
					anchor : naver.maps.Point(27, 27)
				},
					naver_cluster_marker2 = {
						content : '<div style="cursor:pointer;width:56px;height:56px;line-height:56px;font-size:11px;color:#FFFFFF;text-align:center;font-weight:bold;background:url(//static.imweb.me/vendor/images/markerclusterer/m2.png);background-size:contain;"></div>',
						size : naver.maps.Size(56, 56),
						anchor : naver.maps.Point(28, 28)
					},
					naver_cluster_marker3 = {
						content : '<div style="cursor:pointer;width:66px;height:66px;line-height:66px;font-size:11px;color:#FFFFFF;text-align:center;font-weight:bold;background:url(//static.imweb.me/vendor/images/markerclusterer/m3.png);background-size:contain;"></div>',
						size : naver.maps.Size(66, 66),
						anchor : naver.maps.Point(33, 33)
					},
					naver_cluster_marker4 = {
						content : '<div style="cursor:pointer;width:78px;height:78px;line-height:78px;font-size:11px;color:#FFFFFF;text-align:center;font-weight:bold;background:url(//static.imweb.me/vendor/images/markerclusterer/m4.png);background-size:contain;"></div>',
						size : naver.maps.Size(78, 78),
						anchor : naver.maps.Point(39, 39)
					},
					naver_cluster_marker5 = {
						content : '<div style="cursor:pointer;width:90px;height:90px;line-height:90px;font-size:11px;color:#FFFFFF;text-align:center;font-weight:bold;background:url(//static.imweb.me/vendor/images/markerclusterer/m5.png);background-size:contain;"></div>',
						size : naver.maps.Size(90, 90),
						anchor : naver.maps.Point(45, 45)
					};
				naverClustering(board_code);
			}
			/* 네이버 지도 컨트롤 z-index 100 고정 */
			$('#doz_header').css('z-index', 101);
			/* 네이버 지도 설정 완료 */
		}else{
			/* Google 지도 설정 시작 */
			if(!is_refresh){
				$(id).gmap3({
					map : {
						options : {
							center : [37.5666805, 126.9784147],
							maxZoom : 17,
							minZoom : 3,
							mapTypeControl : false,
							scaleControl : true,
							streetViewControl : false,
							gestureHandling : 'auto',
							controlSize : 29
						}
					},
					marker : {
						values : list_data,
						options : {
							draggable : false
							/*
							icon: {
								path: google.maps.FORWARD_CLOSED_ARROW,
								fillOpacity: 1,
								fillColor: 'black',
								strokeOpacity: 0,
								scale: 1,
								anchor: new google.maps.Point(23.0, 42.0)
							}
							*/
						},
						events : {
							click : function(marker, event, context){
								var map = $(this).gmap3("get"),
									infowindow = $(this).gmap3({get : {name : "infowindow"}});
								if(infowindow){
									infowindow.setContent(getInfoWindowData(board_code, context.id));
									infowindow.open(map, marker);
								}else{
									$(this).gmap3({
										infowindow : {
											anchor : marker,
											options : {content : getInfoWindowData(board_code, context.id)}
										}
									});
								}
							}
						}
					},
					autofit : {}
				});
			}else{
				$(id).gmap3({
					marker : {
						values : list_data,
						options : {
							draggable : false
						},
						events : {
							click : function(marker, event, context){
								var map = $(this).gmap3("get"),
									infowindow = $(this).gmap3({get : {name : "infowindow"}});
								if(infowindow){
									infowindow.setContent(getInfoWindowData(board_code, context.id));
									infowindow.open(map, marker);
								}else{
									$(this).gmap3({
										infowindow : {
											anchor : marker,
											options : {content : getInfoWindowData(board_code, context.id)}
										}
									});
								}


								var map_comment_count = 0;
								var like_cnt = 0;
								var read_cnt = 0;
								var idx_arr = context.id.split('list_');
								map_comment_count = Math.round($('#' + context.id).find('._comment_count').text());
								like_cnt = Math.round($('#' + context.id).find('._like_count').text());
								read_cnt = Math.round($('#' + context.id).find('._read_count').text());
								$('#list_pop_' + idx_arr[1]).find('._comment_count').text(map_comment_count);
								$('#list_pop_' + idx_arr[1]).find('._like_count').text(like_cnt);
								$('#list_pop_' + idx_arr[1]).find('._read_count').text(read_cnt);
							}
						}
					},
					autofit : {}
				});
			}
			if(marker_clustering === 'Y'){
				gmap3Clusterer(id, null, board_code);
			}
		}

		/* Google 지도 설정 완료 */
	};

	/**
	 * 카테고리 코드에 따른 마커 이미지 반환
	 * @param category_code
	 * @param category_list
	 * @return {string}		마커 이미지 url
	 */
	function getMarkerByCategoryCode(category_code, category_list){
		var marker_url = '';
		var color_type = '';
		if(category_list !== ''){
			$.each(category_list, function(k, v){
				if(category_code === v.category_code){
					color_type = v.color_type;
					return false;
				}
			});
		}
		marker_url = getMarkerByColorType(color_type);
		return marker_url;
	}

	/**
	 * 마커 컬러 타입에 따른 마커 이미지 반환
	 * @param color_type
	 * @return {string}		마커 이미지 url
	 */
	function getMarkerByColorType(color_type){
		var marker_url = '//static.imweb.me/vendor/images/marker/marker_red.png';
		switch(color_type){
			case 'marker-color-red':
			default:
				marker_url = '//static.imweb.me/vendor/images/marker/marker_red.png';
				break;
			case 'marker-color-pink':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_pink.png';
				break;
			case 'marker-color-orange':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_orange.png';
				break;
			case 'marker-color-yellow':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_yellow.png';
				break;
			case 'marker-color-green':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_green.png';
				break;
			case 'marker-color-mint':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_mint.png';
				break;
			case 'marker-color-blue':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_blue.png';
				break;
			case 'marker-color-violet':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_violet.png';
				break;
			case 'marker-color-gray':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_gray.png';
				break;
			case 'marker-color-darkgray':
				marker_url = '//static.imweb.me/vendor/images/marker/marker_darkgray.png';
				break;
		}
		return marker_url;
	}

	/**
	 * 정보창 닫기
	 * @param api
	 * @param id
	 * @param board_code
	 */
	var infowindowClose = function(api, id, board_code){
		if(api === 'google'){
			var infowindow = $('#gmap_' + board_code).gmap3({get : {name : "infowindow"}});
			if(infowindow){
				infowindow.close();
			}
		}else{
			var infowindow = infowindows[board_code][id];
			if(infowindow.getMap()) infowindow.close();
		}
	};

	var mapSecretPost = function($obj,type){
		if(type == 'pc'){
			if($('#secret_input_pc').hasClass('active') === false){
				$obj.find('#secret_input_pc').addClass('active');
				$obj.find('#secret_input_nomember').addClass('active');
				$obj.find('#secret_input_mobile').addClass('active');
			}else{
				$obj.find('#secret_input_pc').removeClass('active');
				$obj.find('#secret_input_nomember').removeClass('active');
				$obj.find('#secret_input_mobile').removeClass('active');
			}
			if($('#secret_input_pc').hasClass('active') === true){
				$('#is_secret_input').val('Y');
			}else{
				$('#is_secret_input').val('N');
			}
		}
		if(type == 'nomember'){
			if($('#secret_input_nomember').hasClass('active') === false){
				$obj.find('#secret_input_pc').addClass('active');
				$obj.find('#secret_input_nomember').addClass('active');
				$obj.find('#secret_input_mobile').addClass('active');
			}else{
				$obj.find('#secret_input_pc').removeClass('active');
				$obj.find('#secret_input_nomember').removeClass('active');
				$obj.find('#secret_input_mobile').removeClass('active');
			}
			if($('#secret_input_nomember').hasClass('active') === true){
				$('#is_secret_input').val('Y');
			}else{
				$('#is_secret_input').val('N');
			}
		}
		if(type == 'mobile'){
			if($('#secret_input_mobile').hasClass('active') === false){
				$obj.find('#secret_input_pc').addClass('active');
				$obj.find('#secret_input_nomember').addClass('active');
				$obj.find('#secret_input_mobile').addClass('active');
			}else{
				$obj.find('#secret_input_pc').removeClass('active');
				$obj.find('#secret_input_nomember').removeClass('active');
				$obj.find('#secret_input_mobile').removeClass('active');
			}
			if($('#secret_input_mobile').hasClass('active') === true){
				$('#is_secret_input').val('Y');
			}else{
				$('#is_secret_input').val('N');
			}
		}
	};

	var postDeleteFile = function(id){
		var obj = $('#'+id);
		var size = obj.data('size');
		total_file_size -= size;
		obj.remove();
	};

	var postAddFile = function(filename,file_code,tmp_idx,size){
		var uniq_id = makeUniq('upfile_');
		total_file_size += size;
		var clear_ico = $('<i class="zmdi zmdi-close"></i>').data({'item':uniq_id,size:size}).click(function(e){
			postDeleteFile(uniq_id);
		});
		var hidden_input = '';
		if(file_code.length>0) {
			hidden_input = $('<input name="upload_files[]" value="' + file_code + '" type="hidden" />');
		}else if(Math.round(tmp_idx) > 0){
			hidden_input = $('<input name="temp_files[]" value="' + tmp_idx + '" type="hidden" />');
		}
		var li 	= $('<li>').attr('id',uniq_id).data({'item':uniq_id,size:size});
		// XSS 방지: 파일명은 HTML로 해석되지 않도록 text로 삽입 (KVE-2025-2806)
		var $file_name_dom = $('<span></span>');
		$file_name_dom.text(filename);
		$file_name_dom.append($('<em></em>').text(' ' + GetFileSize(size)));
		li.append($file_name_dom);
		li.append(clear_ico);
		li.append(hidden_input);
		$("#file_list").append(li);
	};

	var userPosCreat = function(board_code, map_api){
		var image = '/img/my_location_1x.png';
		if(map_api === 'google'){
			var id = '#gmap_' + board_code;
			var list_data = [];
			var value_obj = {};
			value_obj.latLng = [getCookie('lat'),getCookie('lng')];
			list_data.push(value_obj);
			$(id).gmap3({
				map : {
					options : {
						center : [37.5666805, 126.9784147],
						scaleControl : true,
						maxZoom : 17,
						minZoom : 3,
						mapTypeControl : false,
						streetViewControl : false,
						controlSize: 29
					}
				},
				marker : {
					values : list_data,
					options : {
						draggable : false,
						icon : image
					}
				}
			});
		}else{		// 기본 네이버 지도
			var marker = new naver.maps.Marker({
				position: new naver.maps.LatLng(getCookie('lat'),getCookie('lng')),
				map: naver_map[board_code],
				icon: image
			});
		}
	};

	/**
	 * 게시판 위젯 카테고리 active (위젯 카테고리와 연동시)
	 * @param board_code
	 * @param category
	 */
	var activeSubMenu = function(board_code, category) {
		var $ul = $('ul.' + board_code);
		if ($ul.length > 0) {
			$ul.find('li.active').removeClass('active').find('a').removeClass('active');
			$ul.find('[href="?category=' + category + '"]').addClass('active').parent('li').addClass('active');
		}
	}

	/**
	 * 게시판 페이지/검색/정렬 변경
	 * @param menu_url
	 * @param board_code
	 * @param map_api
	 * @param marker_refresh		마커 새로고침 여부, 페이지/정렬 변경 시에 false
	 * @param target_page
	 * @param target_category
	 */
	var searchChange = function(menu_url, board_code, map_api, marker_refresh, target_page, target_category){
		var $map_view = $('._map_view_' + board_code);
		var keyword_type = $map_view.find('input[name=keyword_type]').val();
		var category = typeof target_category === 'undefined' ? $map_view.find('select[name=category]').val() : target_category;
		var keyword = $map_view.find('input[name=keyword]').val();
		var sort = $map_view.find('select[name=sort]').val();
		var page = typeof target_page === 'undefined' ? $map_view.find('ul.pagination > li.active > a').text() : target_page;

		if(sort === 'STREET'){
			if(document.location.protocol !== "https:"){
				alert(getLocalizeString('설명_거리순정렬이지원되지않습니다', '', '거리순 정렬이 지원되지 않습니다.'));
				sort = 'TIME';
			}
		}

		$.ajax({
			type : 'post',
			data : {
				'board_code': board_code,
				'search': keyword,
				'search_mod': keyword_type,
				'page': page ? page : false,
				'sort': sort,
				'status': category
			},
			url : '/ajax/get_map_list.cm',
			dataType : 'html',
			async : false,
			cache : false,
			success : function(result){
				//메뉴 카테고리 연동시 active
				activeSubMenu(board_code, category);
				// 지도 게시물 목록 변경
				var resultHtml = $('<div>' + result +'</div>');
				var mapListHtml = resultHtml.find('.map-list');
				$map_view.find('.map-list').replaceWith(mapListHtml);
				// 페이지 변경, 정렬 변경 시에는 마커 변동이 없으므로 마커를 재생성 하지 않음
				if(marker_refresh){
					var category_list = JSON.parse($map_view.find('input[name=json_category_list]').val());
					var scroll_wheel = $map_view.find('input[name=scroll_wheel]').val();
					var marker_clustering = $map_view.find('input[name=marker_clustering]').val();
					// 마커 초기화
					clearMap(board_code, map_api, marker_clustering);
					// 마커 정보 받아옴
					addMapData(board_code, keyword, keyword_type, sort, category);
					// 마커 추가
					listView(board_code, map_api, category_list, category, scroll_wheel, marker_clustering, true);
				}
				// 게시물 목록과 정보창 연결
				mapInitWrite(board_code, null, map_api, category_list);
				// 현재 URL 변경
				if(history.replaceState){
					//IE 9 이하 URL 변경 안됨
					var sort_str = sort ? '?sort='+sort : '?sort=TIME';
					var category_str = category ? '&category='+category : '';
					var keyword_str = keyword ? '&keyword='+keyword : '';
					var keyword_type_str = keyword_type ? '&keyword_type='+keyword_type : '';
					var page_str = page ? '&page='+page : '';
					var change_url = menu_url + sort_str + category_str + keyword_str + keyword_type_str + page_str;
					history.replaceState(null, null, change_url);
				}
				if(target_page > 1 && $(window).width() < 768){
					var $fixed_header = $('#inline_header_mobile').find('._fixed_header_section');
					var total_fixed_height = 0;
					for(var i = 0; i < $fixed_header.length; i++){
						var target = $fixed_header[i].getBoundingClientRect();
						total_fixed_height += target.height;
					}
					window.scrollTo(0, $map_view.offset().top - total_fixed_height);
				}
				if(sort === 'STREET'){
					if(document.location.protocol === "https:"){
						posCreat();
					}
				}
				//set token
				TOKEN.setListToken();
			},
			error : function(result){
				alert(getLocalizeString('설명_게시물을불러오는데에실패하였습니다', '', '게시물을 불러오는 데에 실패하였습니다.'));
			}
		});
	};

	/**
	 * 정보창 닫고 마커 초기화
	 * @param board_code
	 * @param map_api
	 * @param marker_clustering
	 */
	var clearMap = function(board_code, map_api, marker_clustering){
		if(map_api === 'naver'){
			naver_map[board_code].destroy();
		}else{
			if(marker_clustering === 'Y'){
				cluster[board_code].clearMarkers();
				cluster[board_code] = null;
			}
			var infowindow = $('#gmap_' + board_code).gmap3({get : {name : "infowindow"}});
			if(infowindow){
				infowindow.close();
			}
			var gmap_id = '#gmap_' + board_code;
			$(gmap_id).gmap3({
				clear : {}
			});
		}
		markers[board_code] = [];
		infowindows[board_code] = [];
		map_data[board_code] = [];
	};

	/**
	 * 설정된 카테고리 생성
	 * @param category_list
	 * @param str_category
	 * @returns {Array}
	 */
	var categoryList = function(category_list, str_category){
		var category_type_list_temp = [];
		var category_list_default = {};
		category_list_default.key = 0;
		category_list_default.value = str_category;
		category_list_default.color_type = 'marker-color-red';
		category_type_list_temp.push(category_list_default);

		if(Array.isArray(category_list)){
			$.each(category_list, function(key, val){
				var _category_list = {};
				var $name = val.name;
				var $color = val.color;
				_category_list.key = key + 1;
				_category_list.value = '<span style="color:' + $color + '">' + RemoveTag($name) + '</span>';
				_category_list.color_type = val.color_type ? val.color_type : 'marker-color-red';
				category_type_list_temp.push(_category_list);
			});
		}
		return category_type_list_temp;
	};

	/**
	 * 분류 리스트 출력
	 * @param $obj
	 * @param default_code
	 * @param category_data
	 */
	var categoryTypeSelect = function($obj,default_code,category_data){
		$obj.find('._category_type_list').setSelectBox({
			option: category_data,
			'set' : {
				select_custom_cls:'category_select',
				custom_cls:'category_dropdown',
				width:180
			},
			'default' : default_code,
			change: function (o) {
				$('#category_type').val(o.key);
				$('#category_color_type').val(category_data[o.key].color_type);
			}
		});
	};

	/**
	 * 네이버 마커 클러스터링(인접한 마커 묶기)
	 * @param board_code
	 */
	var naverClustering = function(board_code){
		var markerArray = [];
		for (var key in markers[board_code]){
			markerArray.push(markers[board_code][key]);
		}
		cluster[board_code] = new MarkerClustering({
			minClusterSize: 2,
			maxZoom: naver_cluster_maxzoom,
			map: naver_map[board_code],
			markers: markerArray,
			disableClickZoom: false,
			icons: [naver_cluster_marker1, naver_cluster_marker2, naver_cluster_marker3, naver_cluster_marker4, naver_cluster_marker5],
			indexGenerator: [10, 100, 1000, 10000, 100000],
			stylingFunction : function(clusterMarker, count){
				$(clusterMarker.getElement()).find('div:first-child').text(count);
			}
		});
	};

	/**
	 * 구글 마커 클러스터링(인접한 마커 묶기)
	 * @param map_id		gmap3을 사용하는 map ID
	 * @param options
	 * @param board_code
	 */
	var gmap3Clusterer = function(map_id, options, board_code){
		var mapObject = $(map_id).gmap3("get");
		var mapMarkers = $(map_id).gmap3({get: {name: "marker", all: true}});
		var _options = {
			imagePath: '//static.imweb.me/vendor/images/markerclusterer/m',
			zoomOnClick: true,
			maxZoom: google_cluster_maxzoom
		};
		if(typeof options !== 'undefined') _options = $.extend(_options, options);
		cluster[board_code] = new MarkerClusterer(mapObject, mapMarkers, _options);
	};

	/**
	 * 네이버 마커 
	 */
	var naverMarkCenter = function(naver_map) {
		function checkMapListOffset () {
			const mapList = document.querySelector('._map-list');
			if (!mapList) return false;
			return {
				width: mapList.offsetWidth,
				left: mapList.offsetLeft
			};
		}

		function checkMapWidth() {
			var map = document.querySelector('._map');
			if (!map) return 0;
			return map.offsetWidth;
		}

		// 리스트가 있을때 리스트를 제외한 영역의 중심으로 이동
		if (document.querySelector('body').offsetWidth > 766) {
			var listW = checkMapListOffset().width;
			var listL = checkMapListOffset().left;
			var halfMapWidth = checkMapWidth() / 2;
			var mapViewWidth = -1 * ((checkMapWidth() - listW - (listL * 2)) / 2);
			mapViewWidth = mapViewWidth - (listW + listL - halfMapWidth);
			naver_map.panBy(new naver.maps.Point(mapViewWidth, 0));
		}
	}

	return {
		mapInitWrite: function(b_code,$obj,api,category_list,placeholder_edit) {
			mapInitWrite(b_code,$obj,api,category_list,placeholder_edit);
		},
		toggleAlarmPopup : function(){
			toggleAlarmPopup();
		},
		addMapData : function(board_code, keyword, keyword_type, sort, category){
			addMapData(board_code, keyword, keyword_type, sort, category);
		},
		mapEditorPop : function(map_api){
			mapEditorPop(map_api);
		},
		mapAddressSearch : function(val, map_api){
			mapAddressSearch(val, map_api);
		},
		addressDelete : function(map_api){
			addressDelete(map_api);
		},
		submit : function(map_api){
			mapSubmit(map_api);
		},
		mapCancel: function(back_url){
			mapCancel(back_url);
		},
		setMap : function(lat,lng,detail,$obj,m_data,map_api,editable,scroll_wheel,zoom,marker_url){
			setMap(lat,lng,detail,$obj,m_data,map_api,editable,scroll_wheel,zoom,marker_url);
		},
		getTypeMapView : function(idx,back_url, board_code, map_api,scroll_wheel, is_ignore){
			getTypeMapView(idx,back_url, board_code, map_api,scroll_wheel, is_ignore);
		},
		deleteMap : function(board_code,code,return_url){
			deleteMap(board_code,code,return_url);
		},
		mapListToggle : function($obj){
			mapListToggle($obj);
		},
		mapSearchToggle : function($obj,type){
			mapSearchToggle($obj,type);
		},
		mapListChange : function($obj,type){
			mapListChange($obj,type);
		},
		posCreat : function(force){
			posCreat(force);
		},
		posChange : function(){
			posCreat(true);
		},
		moveUserPosition : function(board_code, map_api){
			moveUserPosition(board_code, map_api);
		},
		setAndroidLocationData : function(latitude, longitude){
			setAndroidLocationData(latitude, longitude);
		},
		listView : function(board_code, api, category_list, category, scroll_wheel, marker_clustering, is_refresh){
			listView(board_code, api, category_list, category, scroll_wheel, marker_clustering, is_refresh);
		},
		getMarkerByColorType: function(color_type){
			return getMarkerByColorType(color_type);
		},
		mapSecretPost : function($obj,type){
			mapSecretPost($obj,type);
		},
		addFile : function(filename,file_code,tmp_idx,size){
			postAddFile(filename,file_code,tmp_idx,size);
		},
		infowindowClose:function(api, id, board_code){
			infowindowClose(api, id, board_code);
		},
		userPosCreat:function(board_code, map_api){
			userPosCreat(board_code, map_api);
		},
		searchChange: function(menu_url, board_code, map_api, marker_refresh, target_page, category){
			searchChange(menu_url, board_code, map_api, marker_refresh, target_page, category);
		},
		pageChange: function(menu_url, board_code, map_api, page){
			pageChange(menu_url, board_code, map_api, page);
		},
		deleteCoverImage : function(){
			deleteCoverImage();
		},
		categoryTypeSelect : function($obj,default_code,category_data){
			categoryTypeSelect($obj,default_code,category_data);
		},
		categoryList : function(category_list, str_category){
			return categoryList(category_list, str_category);
		}
	};
}();
