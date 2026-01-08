
var POST = function(){
	var code, post_body, body_input, is_notice,is_notice_input,is_secret,is_secret_input, post_form,post_subject,total_file_size;

	var $board_container,$floara_obj;
	var $post_img_library;
	var $represent_img;
	var $upload_cover_image_btn_obj, $delete_cover_image_btn_obj, $cover_image, $cover_image_tmp_no;
	var $post_secret_password;
	var $widget_wrap,board_code,listing_type,more_list_page;
	var $listing_obj,type_data;
	var option = {};
	var category_list;
	var board_data;
	var sent = false;
	var isIOS, isSafari, $fr_m_custom, $write_header, m_sticky_container_trigger_top, $toolbarContainer;

	var reaction_token, reaction_token_key;

	var postDeletePost = function (board_code,code,return_url,secret_pass){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type		: 'post',
				data:{'pcode':code,board_code:board_code,secret_pass:secret_pass},
				url			: '/ajax/deletePost.cm',
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


	/***
	 * 안드로이드앱에서 post글쓰기시 이미지 업로드 완료시 처리
	 * @param image
	 */

	var $image_list_obj = {};
	//이미지 임시저장 리스트 추가
	if(!($image_list_obj.length > 0)) {
		var image_list_html = $("<ul id='image_list' style='display: none'></ul>");
		$("body form").append(image_list_html);
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
			FroalaEditor('#post_body').image.insert(CDN_UPLOAD_URL + image.url, true);
	};

	var postAddImage = function(tmp_idx,size){
		var uniq_id = makeUniq('image_');
		var hidden_input = $('<input name="temp_images[]" value="' + tmp_idx + '" type="hidden" />');
		var li 	= $('<li>').attr('id',uniq_id).data({'item':uniq_id,size:size});
		li.append(hidden_input);
		$image_list_obj.append(li);
	};





	var postInitWrite = function(key,data, str_category){
		$("body").addClass("write_mode");
		$board_container = $('#board_container');
		post_body = $('#post_body');
		post_subject = $('#post_subject');
		body_input = $('#body_input');
		post_form = $('#post_form');
		$upload_cover_image_btn_obj = $('._upload_cover_image');
		$delete_cover_image_btn_obj = $('._delete_cover_image');
		$cover_image = $('#cover_image');
		$cover_image_tmp_no = $('#cover_image_tmp_no');
		code = key;
		board_data = data;
		total_file_size = 0;
		category_list = categoryList(str_category);
		if(IE_VERSION < 10){
			CKEDITOR.replace( 'post_body',{
				filebrowserImageUploadUrl: '/ajax/post_image_upload.cm?board_code='+key
			});
		}else{
			if(android_version() == 4){
				post_body.addClass('legacy_webview');
			}
			var placeholder = board_data.placeholder_edit;
			if(placeholder == '') placeholder = getLocalizeString('설명_내용을_입력해주세요', '', '내용을 입력해주세요');
      setFroala('#post_body', {
        'code' : code,
        'image_upload_url' : "/ajax/post_image_upload.cm",
        'file_upload_url' : "/ajax/post_file_upload.cm",
        'file_list_obj' : $("#file_list"),
        'placeholderText' : placeholder,
        'image_display' : 'inline',
        'mobile_custom' : true
      }, {
        'image.inserted' : function($img, response){
          if(IS_ANDROID_APP == 'Y'){
            var img = post_body.find('img[src="' + CDN_UPLOAD_URL + image.url + '"]');
            img.data(image);
            postAddImage(image.tmp_idx, image.size);
            android_que.splice(0, 1);
            if(android_que.length > 0) androidAppPostImageUploadAllComplete();
          }
        }
      });
		}

		function dataURLtoBlob(dataurl) {
			var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {type:mime});
		}

		$delete_cover_image_btn_obj.on('click',function(){
			POST.deleteCoverImage();
		});

		$upload_cover_image_btn_obj.setUploadImage({
			url : '/ajax/upload_image.cm',
			formData : {target : 'post', 'temp' : 'Y', 'param_name' : 'cover_image'}
		}, function (msg, data,res) {
			$.each(res.cover_image,function(i,file){
				if(file.tmp_idx > 0){
					$cover_image.val(CDN_UPLOAD_URL+file.url);
					$cover_image_tmp_no.val(file.tmp_idx);
					$delete_cover_image_btn_obj.show();
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
		m_sticky_container_trigger_top = $fr_m_custom.offset().top;
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

		// $(window).bind('beforeunload', function(){
		// 	return LOCALIZE.설명_페이지를벗어나시겠습니까();
		// });
		var $_mobile_tool_bar = $('._mobile_tool_bar');
		if($_mobile_tool_bar.find('._tool_btn:visible').length === 0){
			$_mobile_tool_bar.hide();
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
				post_body.css('padding-top', '50px');
			}else{
				$toolbarContainer.css({'-webkit-transition': 'none', 'transition': 'none', 'top': 'auto'});
				post_body.css('padding-top', '50px');
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
		$cover_image.val('');
		$cover_image_tmp_no.val('');
		$board_container.toggleClass('bg_on',false);
		$board_container.find('._cover_image').css('background-image','none');
		$board_container.find('._cover_image_src').attr('src','');
		$delete_cover_image_btn_obj.hide();
	};


	const setPostToken = async () => {
		await $.ajax({
			type: 'post',
			url: '/set_post_client_token.cm',
			dataType: 'json',
			async : false
		});
	};

	var postSubmit = async function(){
		if(sent) return false;
		await setPostToken(); // 토큰주입API호출

		if(IE_VERSION < 10){
			var body = CKEDITOR.instances.post_body.getData();
			body_input.val(body);
			post_form.submit();
		}else{
      if(post_body.hasClass('fr-code-view'))
        FroalaEditor('#post_body').codeView.toggle();
      var body = FroalaEditor('#post_body').html.get(true);

			body_input.val(body);
			post_form.submit();
		}
		sent = true;
	};

	var endSubmit = function(msg){
		sent = false;
		alert(msg);
	};

	var postCancel = function(back_url){
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

	var is_more = true;
	var listing_obj = {};

	var postInitMoreList = function(wcode,bcode,type){
		listing_type = type;
		$widget_wrap = $("#"+wcode);
		board_code = bcode;
		more_list_page = 1;
		is_more = true;
		return true;
	};

	var toggleAlarmPopup = function(){
		var $alarm_popup = $('#alarm_popup');
		var $dLabel = $('#dLabel');
		$alarm_popup.toggleClass('open');
		if($alarm_popup.hasClass('open')){
			$(window).on('click.alarm_popup',function(event){
				var $top_closest = $(event.target).closest('a');
				if($top_closest.attr('id')!='dLabel'){
					var $closest = $(event.target).closest('ul');
					if($closest != null && !$closest.hasClass('dropdown-menu')){
						$alarm_popup.removeClass('open');
						$(window).off('click.alarm_popup');
						var alarm_group_list = $alarm_popup.find("input[type='checkbox']").is(":checked");
						if(alarm_group_list) $dLabel.addClass('active');
						else $dLabel.removeClass('active');
					}
				}
			});
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

	var MovePostPopup = function(post_code,menu_url){
		$.ajax({
			type		: 'post',
			data:{'post_code':post_code,'menu_url':menu_url},
			url			: '/ajax/move_post_popup.cm',
			dataType 	: 'json',
			success		: function(result){
				if(result.msg == 'SUCCESS'){
					var html = $(result.html);
					$.cocoaDialog.open({type : 'site_alert', custom_popup : html});
				}else{
					alert(result.msg);
				}
			}
		});
	};

	/**
	 * 설정된 카테고리 생성
	 * @returns {Array}
	 */
	var categoryList = function(str_category){
		var b_data = board_data;
		var category_type_list_temp = [];
		var category_list_default = {};
		category_list_default.key = 0;
		category_list_default.value = str_category;
		category_type_list_temp.push(category_list_default);

		if(Array.isArray(b_data.category_list)){
			$.each(b_data.category_list, function(key, val){
				var category_list = {};
				var $name = val.name;
				var $color = val.color;
				category_list.key = key + 1;
				category_list.value = '<span style="color:' + $color + '">' + RemoveTag($name) + '</span>';
				category_type_list_temp.push(category_list);
			});
		}
		return category_type_list_temp;
	};

	/**
	 * 분류 리스트 출력
	 * @param $obj
	 * @param default_code
	 */
	var categoryTypeSelect = function($obj,default_code){
		$obj.find('._category_type_list').setSelectBox({
			option: category_list,
			'set' : {
				select_custom_cls:'category_select',
				custom_cls:'category_dropdown',
				width:180
			},
			'default' : default_code,
			change: function (o) {
				$('#category_type').val(o.key);
			}
		});
	};

	var viewReviewPostDetail = function(idx, board_code){
		$(function(){
		$.ajax({
			type : 'POST',
			data : {idx : idx, board_code : board_code},
			url : ('/ajax/review_post_detail_view.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg === 'SUCCESS'){
					$.cocoaDialog.open({
						type : 'prod_detail review', custom_popup : res.html, width : 800});
					if(history.replaceState && history.pushState){
						// 모달 히스토리 커스텀(IE 10 이상)
						var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
						var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
						history.pushState(null, null, current_url);
						history.replaceState(null, null, current_url + "#prod_detail_review!/" + res.idx);
					}else{
						location.hash = "prod_detail_review!/" + res.idx;
					}
					$(window).off('hashchange').on('hashchange',function(){
						var hash_qna_spilt = location.hash.split('!/')[1];
						if(!hash_qna_spilt){
							$.cocoaDialog.close();
						}else{
							var hash_spilt_tab = location.hash.split('!/')[0];
							if(hash_spilt_tab === '#prod_detail_review'){
								viewReviewPostDetail(hash_qna_spilt,board_code);
							}else if(hash_spilt_tab === '#prod_detail_qna'){
								viewQnaPostDetail(hash_qna_spilt,board_code);
							}
						}
					});
					$('.modal_prod_detail').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
						removeReviewHash();
					});
				}else{
					alert(res.msg);
				}
			}
		});
		});
	};

	var removeReviewHash = function(){
		$(window).off('hashchange');
    $('html').toggleClass('modal-scroll-control', false);
		var hash_review_spilt = location.hash.split('!/')[1];
		if(hash_review_spilt){
			if(history.replaceState && history.pushState){
				history.back();
			}else{
				location.href = '#prod_detail_review';
			}
		}
	};

	var viewQnaPostDetail = function(idx, board_code){
		$(function(){
			$.ajax({
				type : 'POST',
				data : {idx : idx, board_code : board_code},
				url : ('/ajax/qna_post_detail_view.cm'),
				dataType : 'json',
				async : false,
				cache : false,
				success : function(res){
					if(res.msg === 'SUCCESS'){
						$.cocoaDialog.open({
							type : 'prod_detail review', custom_popup : res.html, width : 800});
						if(history.replaceState && history.pushState){
							// 모달 히스토리 커스텀(IE 10 이상)
							var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
							var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
							history.pushState(null, null, current_url);
							history.replaceState(null, null, current_url + "#prod_detail_qna!/" + res.idx);
						}else{
							location.hash = "prod_detail_qna!!/" + res.idx;
						}
						$(window).off('hashchange').on('hashchange',function(){
							var hash_qna_spilt = location.hash.split('!/')[1];
							if(!hash_qna_spilt){
								$.cocoaDialog.close();
							}else{
								var hash_spilt_tab = location.hash.split('!/')[0];
								if(hash_spilt_tab === '#prod_detail_review'){
									viewReviewPostDetail(hash_qna_spilt, board_code);
								}else if(hash_spilt_tab === '#prod_detail_qna'){
									viewQnaPostDetail(hash_qna_spilt, board_code);
								}
							}
						});
						$('.modal_prod_detail').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
							removeQnaHash();
						});
					}else{
						alert(res.msg);
					}
				}
			});
		});
	};

	var removeQnaHash = function(){
		$(window).off('hashchange');
    $('html').toggleClass('modal-scroll-control', false);
		var hash_qna_spilt = location.hash.split('!/')[1];
		if(hash_qna_spilt){
			if(history.replaceState && history.pushState){
				history.back();
			}else{
				location.href = '#prod_detail_qna';
			}
		}
	};

  var alertNoSale = function(){
    $.cocoaDialog.open({
      type: 'site_alert',
      custom_popup: `
        <div class="layer_pop">
            <div class="container-fluid">
                <p class="tw-text-center tw-mb-0">
                    ${getLocalizeString('설명_상품페이지이동불가안내', '', '해당 상품 페이지로 이동할 수 없습니다.')}
                </p>
            </div>
            <div class="btn-group-justified">
                <a href="javascript:" class="btn" onclick="$('.modal_site_alert').modal('hide');">${getLocalizeString('버튼_확인', '', '확인')}</a>
            </div>
        </div>`
    }, function(){
      $('.modal_site_alert').css('z-index', 100002);
    });
  }

	return {
		'init' : function(code, data, str_category) {
			postInitWrite(code, data, str_category);
		},
		'initMoreList' : function(widget_code,board_code,listing_type) {
			return postInitMoreList(widget_code,board_code,listing_type);
		},
		'submit' : function(){
			postSubmit();
		},
		'submit_error': function(msg){
			endSubmit(msg);
		},
		'postCancel': function(back_url){
			postCancel(back_url);
		},
		'addFile' : function(filename,file_code,tmp_idx,size){
			postAddFile(filename,file_code,tmp_idx,size);
		},
		'androidAppPostImageUploadComplete' :function(image){
			androidAppPostImageUploadComplete(image);
		},
		'androidAppPostImageUploadAllComplete' :function(){
			androidAppPostImageUploadAllComplete();
		},
		'deletePost' : function (board_code,code,return_url,secret_pass) {
			postDeletePost(board_code,code,return_url,secret_pass);
		},
		'moreList' : function(keyword,keyword_type,q){
			moreList(keyword,keyword_type,q);
		},
		'toggleAlarmPopup' : function(){
			toggleAlarmPopup();
		},
		'MovePostPopup' : function(post_code,menu_url){
			MovePostPopup(post_code,menu_url);
		},
		'deleteCoverImage' : function(){
			deleteCoverImage();
		},
		'deleteLibraryImage' : function(url){
			deleteLibraryImage(url);
		},
		'categoryTypeSelect' : function($obj,defult_code){
			categoryTypeSelect($obj,defult_code);
		},
		'categoryList' : function(str_category){
			categoryList(str_category);
		},
		'viewReviewPostDetail' : function(idx, board_code){
			viewReviewPostDetail(idx, board_code);
		},
		'removeReviewHash' : function(){
			removeReviewHash();
		},
		'viewQnaPostDetail' : function(idx, board_code){
			viewQnaPostDetail(idx, board_code);
		},
		'removeQnaHash' : function(){
			removeQnaHash();
		},
    'alertNoSale' : function(){
      alertNoSale();
    }
	};
}();

function POST_INIT_LIST(code,data){
	var that 	= this;
	that.type_data = data;
	that.code = code;
	that.windowWidth = $(window).width();
	that.change_timer = setTimeout(function(){},1);
	that.listing_obj = $('#post_card_'+that.code);

	that.listing_obj.imagesLoaded().always(function(ins) {
		that.listResize();
	});

	$('body').off('gridChange.'+that.code).on('gridChange.'+that.code,function(){
		that.listing_obj.imagesLoaded().always(function(ins) {
			that.listResize();
		});
	});

	$(window).off('resize.'+that.code).on('resize.'+that.code,function(){
		if ($(window).width() != that.windowWidth) {
			that.windowWidth = $(window).width();
		}else{
			return;
		}
		clearTimeout(that.change_timer);
		that.change_timer = setTimeout(function(){
			that.listResize();
		},1000);
	});

	this.listResize = function(){
		that.listing_obj.imagesLoaded()
			.always(function(){
				var window_width = $(window).width();
				if(!that.type_data.grid_gutter){
					that.type_data.grid_gutter = 15;
				}
				if($('body').hasClass('device_type_m'))
					window_width = 370;
				if(window_width <= 991)
					that.type_data.grid_gutter = that.type_data.grid_gutter/2;
				that.listing_obj.css({'margin':'0 -'+that.type_data.grid_gutter+'px'});
				if(that.type_data['design_type'] == 'grid' || that.type_data['design_type'] == 'masonry'){
					that.listing_obj.css({'margin-top':'-'+that.type_data.grid_gutter+'px'});
				}

				var cnt = parseInt(that.type_data.grid_col_count);
				var inner_width = that.listing_obj.width();

				if(window_width <= 991){
					if(typeof that.type_data.grid_mobile_col_count == "undefined")
						cnt = 2;
					else
						cnt = parseInt(that.type_data.grid_mobile_col_count);
				}else{
					if(that.type_data.design_type == 'slide'){
						inner_width = that.listing_obj.parent().width();
					}else{
						inner_width = that.listing_obj.width();
					}

					if(that.type_data.grid_extend_fix != 'Y'){
						var s_width = (that.type_data.max_width - (that.type_data.document_margin * 2)) + that.type_data.grid_gutter * 2;
						var item_max = s_width - ((cnt - 1) * parseInt(that.type_data.grid_gutter));
						var grid_width = Math.floor(item_max / cnt);
						var current_width = Math.floor((inner_width - ((cnt - 1) * parseInt(that.type_data.grid_gutter))) / cnt);
						if(current_width > grid_width){
							cnt = Math.floor(inner_width / grid_width);
						}
					}
				}

				var width = Math.floor(inner_width / cnt);
				if(that.type_data['design_type'] == 'grid'){
					that.listing_obj.find('._post_item_wrap').css({'padding' : that.type_data.grid_gutter + 'px'});
					that.runColSize(cnt);
				}else if(that.type_data['design_type'] == 'masonry'){
					var $masonry_item = that.listing_obj.find('.ma-item');
					var masonry_item_count = $masonry_item.length;
					that.listing_obj.find('.ma-item').css({'width' : width,'padding' : that.type_data.grid_gutter + 'px'});
					that.runMasonry(masonry_item_count);
				}
			});
	};

	this.runColSize = function(col_cnt){
		that.listing_obj.find('._card_wrap').show();
		var i = 1;
		var $_row = $('<div />').addClass('_post_row post_row');
		var is_append = false;
		that.listing_obj.find('._dummy_item').remove();
		var $item = that.listing_obj.find('._card_wrap');
		var item_count = $item.length;

		$item.each(function(e,$_obj){
			$_row.append($_obj);
			is_append = false;
			if(i % col_cnt == 0){
				that.listing_obj.append($_row);
				is_append = true;
				$_row = $('<div />').addClass('_post_row post_row');
			}
			i++;
		});

		if(!is_append){
			var $tmp_item = $_row.find('._post_item_wrap');
			if($tmp_item.length >0 ){
				if($tmp_item.length < col_cnt){
					var remain_cnt = col_cnt - $tmp_item.length;
					for(var i = 0; i <remain_cnt; i++){
						var $dummy_col = $('<div/>').addClass('dummy_col item_post _item _dummy_item list-style-card');
						$_row.append($dummy_col);
					}
				}
				that.listing_obj.append($_row);
			}
		}

		that.listing_obj.find('._post_row').each(function(){
			var $tmp_item = $(this).find('._post_item_wrap');
			if($tmp_item.length ==0 ){
				$(this).remove();
			}
		});

		that.imgHeight();
	};

	this.imgHeight = function(){
		if(that.type_data['design_type'] == 'grid'){
			var height = Math.ceil(that.listing_obj.find('._post_item_wrap').eq(0).width() / (that.type_data.img_ratio / 100));
			that.listing_obj.find('._img_wrap').height(height);
		}
	};

	this.runMasonry = function(count){
		if(count > 0){
      let is_masonry_timeout;
			that.listing_obj.off('layoutComplete').on( 'layoutComplete', function() {
        if(that.listing_obj.css('visibility') !== 'visible'){
          that.listing_obj.css('visibility', 'visible');
          that.listing_obj.find('img').lazyload({
            'effect' : 'fadeIn',
            'load' : function() {
              if(typeof is_masonry_timeout === 'number'){
                clearTimeout(is_masonry_timeout);
              }
              is_masonry_timeout = setTimeout(function(){
                /* 레이지 로드 완료 후 100ms 후에 masonry layout 재실행 */ 
                that.listing_obj.masonry('layout');
              }, 100);
            },
            'threshold': (window.innerHeight * 2)
          });
        }
			});
      that.listing_obj.masonry({
        itemSelector: '.ma-item'
      });
    }else{
      that.listing_obj.css('visibility','visible');
    }
	};
}
