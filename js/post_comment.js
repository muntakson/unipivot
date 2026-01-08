
var POST_COMMENT = function(){

	var post_code,total_count,comment_count_obj,comment_form,comment_body, comment_area,child_comment_code,use_sub_secret_comment;
	var $comment_container;
	var comment_img_box;

	var main_comment_image, comment_image, sub_comment_image , use_secret_comment;

	var commentInit = function(code){
		post_code = code;
		comment_count_obj = $('#comment_count');
		total_count = Math.round(comment_count_obj.text());
		$comment_container = $('#comment_container');
		comment_form = $('#comment_form');
		comment_body = $('#comment_body');
		comment_area = $('#comment_area');
		comment_img_box = $('#comment_img_box');
		use_secret_comment = $('#use_secret_comment');
		captcha_answer = $('#captcha_answer');
		captcha_key = $('#captcha_key');
		captcha_img = $('#captcha_img');

		main_comment_image = [];
		comment_image = {};
		sub_comment_image = {};

		$secret = comment_form.find('._secret');
		$secret.on('click', function(){
			if($secret.hasClass('active')){
				$secret.removeClass('active');
				$secret.val('N');
				use_secret_comment.val('N');
			}else{
				$secret.addClass('active');
				$secret.val('Y');
				use_secret_comment.val('Y');
			}
		});


		/*
		comment_area.off('input keyup  paste change','._comment_textarea')
			.on('input keyup  paste change','._comment_textarea', function (e) {
				var input = $(this);
				setTimeout(function(){
					input.limitLength({max_byte:3000});
				}, 0);
		});

		comment_area.off('keydown.enter','._comment_textarea')
			.on('keydown.enter','._comment_textarea', function (e) {
				if (e.keyCode == 13) {
					var target = $('#'+$(this).data('action'));
					target.click();
					e.preventDefault();
				}
			});
			*/

		comment_area.off('input keyup keydown paste change','._comment_nick')
			.on('input keyup keydown paste change','._comment_nick', function () {
				var input = $(this);
				setTimeout(function(){
					input.limitLength({max_byte:30});
				}, 0);
			});

		/*
		comment_area.off('input keyup keydown paste change','._comment_password')
			.on('input keyup keydown paste change','._comment_password', function () {
				var input = $(this);
				setTimeout(function(){
					input.limitLength({max_byte:30});
				}, 0);
			});
			*/


		$("#comment_image_upload_btn").fileupload({
			url: '/ajax/comment_image_upload.cm',
			dataType: 'json',
			singleFileUploads:false,
			limitMultiFileUploads: 5,
			dropZone: null,
			maxFileSize : 20000000, //20mb
			limitMultiFileUploadSize : 110000000, //110 mb
			start: function (e, data) {},
			progress: function (e, data) {},
			done: function (e, data) {
				$("#comment_image_box").show();
				$.each(data.result.comment_images,function(i,file){
					var url = CDN_UPLOAD_URL+file.url;
					var html ='<span class="file-add"><input type="hidden" name="tmp_img[]" value="'+file.tmp_idx+'"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#comment_image_box").append(html);

				});
			},
			fail: function (e, data) {
			}
		});

		autosize(comment_area.find('.textarea_block textarea'));

		//$("#comment_image_box").sortable({
		//	placeholder: 'ui-state-highlight'
		//});
	};

	var removeCommentImg = function(obj){
		var box_obj = obj.parent().parent();
		obj.parent().remove();
		if(box_obj.find('.file-add').length == 0)box_obj.hide();
	};

	var updateAttachToolPosition = function(form,editor){
		var $tool = form.find('._attach_tool');
		var scroll_top = editor.$window.scrollTop();
		var el_offset = editor.$el.offset();

		var boundingRect;

		var range = editor.selection.ranges(0);
		if (range && range.collapsed && editor.selection.inEditor()) {
			var remove = false;

			editor.markers.remove();
			if (editor.$el.find('.fr-marker').length == 0) {
				editor.markers.insert();
				remove = true;
			}

			var $marker = editor.$el.find('.fr-marker:first');
			$marker.css('line-height','inherit');
			$marker.css('display', 'inline');
			var offset = $marker.offset();
			boundingRect = {};
			boundingRect.left = offset.left;
			boundingRect.width = 0;
			boundingRect.height = parseInt($marker.css('line-height'), 10) || 20;

			var marker_tag_name = $marker.parent().prop("tagName");
			marker_tag_name = marker_tag_name.toLowerCase();
			if($.inArray(marker_tag_name, ['p','span','h1','h2','h3','h4','h5','h6','h7','h8','strong','b','font','a','i'])) {
				var outer_h = Math.round($marker.parent().outerHeight());
				boundingRect.height = outer_h;
			}
			boundingRect.top = offset.top - $(editor.original_window).scrollTop();
			boundingRect.right = 1;
			boundingRect.bottom = 1;
			boundingRect.ok = true;
			$marker.css('display', 'none');

			if (remove) editor.markers.remove();
		}
		else if (range) {
			boundingRect = range.getBoundingClientRect();
		}

		var attach_tool_left = el_offset.left-boundingRect.left;
		$tool[attach_tool_left ==0?'show':'hide']();
		var attach_tool_top = scroll_top+boundingRect.top-el_offset.top + (boundingRect.height/2) - ($tool.outerHeight()/2);
		$tool.css('top',attach_tool_top);
	};

	var hideAttachTool = function(obj){
		obj.find('._attach_tool').removeClass('open');
	};


	var commentIncreaseTotalCount = function(){
		total_count++;
		comment_count_obj.text(total_count);
	};

	var commentDecreaseTotalCount = function(decrease_count = 1){
		total_count -= decrease_count;
		comment_count_obj.text(total_count);
	};

	var is_writing = false;
	var commentAdd = function(){
		if(!is_writing){
			var data = comment_form.serializeObject();

			if (data.captcha_key) {
				if (data.body.length > 0 && data.captcha_answer.length === 0) {
					refreshCaptcha();
					alert(getLocalizeString("설명_보안문자입력", "", "보안 문자를 입력해 주세요."));
					return;
				}
			}

			var menu_url = window.location.pathname;
			data.menu_url = menu_url;
			$.ajax({
				type:'post',
				data:data,
				url:'/ajax/post_comment_add.cm',
				dataType:'json',
				success:function(result){
          tokenRefresh(comment_form, result.refresh_token, result.refresh_token_key);
					if(result.msg=='SUCCESS') {
						comment_body.val('');
						$("#comment_image_box").empty().hide();
						commentFormHide();
						commentIncreaseTotalCount();
						if(result.comment_sorting_type == 'forward_new_comment'){
							$comment_container.prepend(result.html);
							moveToCommentListTop();
						}else {
							$comment_container.find('div.comment_list div.comment:last').length === 0 ? $comment_container.append(result.html) : $comment_container.find('div.comment_list div.comment:last').after(result.html);
						}
						autosize.update($('.comment_textarea').find('#comment_body'));
					}else
						alert(result.msg);

					is_writing = false;
				},
				complete:function(){
					if (data.captcha_key) {
						refreshCaptcha();
					}
				}
			});
			is_writing = true;
		}
	};

	var refreshCaptcha = function(form_type = 'comment', code){
		var sub_form_captcha_answer = $('#sub_form_captcha_answer_'+code);
		var sub_form_captcha_key = $('#sub_form_captcha_key_'+code);
		var sub_form_captcha_img = $('#sub_form_captcha_img_'+code);
		
		$.ajax({
			type:'post',
			data:{
				'captcha_key': form_type == 'comment' ? captcha_key.val() : sub_form_captcha_key.val(),
				'target': 'comment',
			},
			url:'/ajax/refresh_captcha.cm',
			dataType:'json',
			success:function(result){
				if (result.msg == 'SUCCESS') {
					if (form_type == 'comment') {
						captcha_answer.val('');
						captcha_img.attr('src', result.captcha_img);
						captcha_key.val(result.key);
					} else if (form_type == 'sub_form') {
						sub_form_captcha_answer.val('');
						sub_form_captcha_img.attr('src', result.captcha_img);
						sub_form_captcha_key.val(result.key);
					}
				} else {
					alert(result.msg);
				}
			}
		});
	};

	var commentFormHide = function(){
		$comment_container = $('#comment_container');

		$comment_container.find('._comment_area').show();
		$comment_container.find('._sub_comment_wrap').show();
		$comment_container.find('._sub_form').hide();
		$comment_container.find('._comment_edit_form').hide();
		$comment_container.find('.write').show();
	};

	var commentShowEdit = function(code, interlock_type){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_edit_body_'+code);
		var comment_wrap = obj.find('._comment_wrap_'+code);

		comment_image[code] = [];
		comment_edit_body.data('org_body',comment_edit_body.val());
		commentFormHide();
		comment_wrap.find('._comment_area').hide();
		comment_wrap.find('.write').hide();

		$.ajax({
			type:'post',
			data: {'code' : code, 'board_type': interlock_type},
			url:'/ajax/append_post_comment_html.cm',
			dataType:'json',
			success:function(res){
				obj.find('._comment_edit_form_'+code).html(res.html);
				autosize.update(obj.find('._comment_edit_body'));
				if(comment_wrap.find("._comment_body img").length>0) $("#comment_image_modify_box_"+code).show();
				$("#comment_image_upload_modify_btn_"+code).fileupload({
					url: '/ajax/comment_image_upload.cm',
					dataType: 'json',
					singleFileUploads:false,
					limitMultiFileUploads: 5,
					dropZone: null,
					maxFileSize : 20000000, //20mb
					limitMultiFileUploadSize : 110000000, //110 mb
					start: function (e, data) {},
					progress: function (e, data) {},
					done: function (e, data) {
						$("#comment_image_modify_box_"+code).show();
						$.each(data.result.comment_images,function(i,file){
							var url = CDN_UPLOAD_URL+file.url;
							var html ='<span class="file-add"><input type="hidden" name="tmp_img[]" value="'+file.tmp_idx+'"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
							$("#comment_image_modify_box_"+code).append(html);

						});
					},
					fail: function (e, data) {
					}
				});
				autosize(comment_area.find('.textarea_block textarea'));
			}
		});

		obj.find('._comment_edit_form_'+code).show();

	};

	var commentEdit = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_edit_body_'+code);

		var form = obj.find('._comment_edit_form_'+code+' ._edit_form');

		var comment_body = obj.find('._comment_wrap_'+code+' ._comment_body_'+code);


		var data = form.serializeObject();

		var new_img = form.find("input[name='tmp_img[]']");
		var org_img = form.find("input[name='org_img[]']");
		var img_old_cnt = form.find("input[name='org_image_old_cnt']");
		var secret_comment = form.find("input[name='secret_comment']");

		if((comment_edit_body.val() == comment_edit_body.data('org_body')) && (new_img.length == 0) && (img_old_cnt.val() == org_img.length) && secret_comment.val() == secret_comment.attr('orig')) {
			commentFormHide();
			return;
		}
		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/post_comment_add.cm',
			dataType:'json',
			success:function(result){
        tokenRefresh(form, result.refresh_token, result.refresh_token_key);
				if(result.msg=='SUCCESS') {
					comment_edit_body.data('org_body', result.data.body);
					comment_body.html('<div>'+result.data.body+'</div>');
					comment_body.append(result.data.img_html);
					switch(secret_comment.val()){
						case 'Y':
							$('#icon_' + code).show();
							break;
						case 'N':
							$('#icon_' + code).hide();
							break;
					}
					commentFormHide();
					commentDestroyEdit(code);
				}else
					alert(result.msg);
			}
		});

	};

	var commentEditMap = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_edit_body_'+code);

		var form = obj.find('._comment_edit_form_'+code+' ._edit_form');

		var comment_body = obj.find('._comment_wrap_'+code+' ._comment_body_'+code);


		var data = form.serializeObject();

		var new_img = form.find("input[name='tmp_img[]']");
		var org_img = form.find("input[name='org_img[]']");
		var img_old_cnt = form.find("input[name='org_image_old_cnt']");

		if((comment_edit_body.val() == comment_edit_body.data('org_body')) && (new_img.length == 0) && (img_old_cnt.val() == org_img.length)) {
			commentFormHide();
			return;
		}
		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/map_comment_add.cm',
			dataType:'json',
			success:function(result){
				if(result.msg=='SUCCESS') {
					comment_edit_body.data('org_body', result.data.body);
					comment_body.html(result.data.body);
					comment_body.append(result.data.img_html);
					commentFormHide();
					commentDestroyEdit(code);
				}else
					alert(result.msg);
			}
		});
	};

	var commentDestroyEdit = function(code){
		var obj = $('#'+code);
		comment_image[code] = [];
	};

	var commentDestroyAddEditor = function(code){
		var obj = $('._add_sub_form_'+code);
		comment_image[code] = [];
		var comment_edit_body = obj.find('._comment_add_body_'+code);
		comment_edit_body.val('');
	};

	var commentCancelEdit = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_edit_body_'+code);
		comment_edit_body.val(comment_edit_body.data('org_body'));
		commentFormHide();
		commentDestroyEdit(code);
	};

	var commentShowSubForm = function(code){
		var obj = $('#'+code);
		var sub_form = obj.find('._sub_form_'+code);

		var use_sub_secret_comment = sub_form.find('#use_sub_secret_comment');
		$sub_secret = sub_form.find('._secret');
		$sub_secret.on('click', function(){
			if($sub_secret.hasClass('active')){
				$sub_secret.removeClass('active');
				$sub_secret.val('N');
				use_sub_secret_comment.val('N');
			}else{
				$sub_secret.addClass('active');
				$sub_secret.val('Y');
				use_sub_secret_comment.val('Y');
			}
		});

		commentFormHide();
		if(sub_form.data('show')=='Y'){
			sub_form.data('show', 'N');
			$('body').off('mouseup.sub_comment');
		}else {
			sub_form.data('show', 'Y');
			obj.find('._sub_form_' + code).show();
			sub_comment_image[code] = [];
			var comment_add_body = obj.find('._comment_add_body_' + code);

			$('body').off('mouseup.sub_comment')
				.on('mouseup.sub_comment', function (e) {
					var $c_target = $(e.target);
					var $s_form = $c_target.closest('._sub_form_' + code+', ._show_sub_form_btn_'+code);
					if ($s_form.length == 0) {

						var text = comment_add_body.val();
						sub_form.data('show', 'N');
						if(text == '') {
							$('body').off('mouseup.sub_comment');
							commentFormHide();
						}
					}
				});
		}
		$("#comment_image_upload_btn_"+code).fileupload({
			url: '/ajax/comment_image_upload.cm',
			dataType: 'json',
			singleFileUploads:false,
			limitMultiFileUploads: 5,
			dropZone: null,
			maxFileSize : 20000000, //20mb
			limitMultiFileUploadSize : 110000000, //110 mb
			start: function (e, data) {},
			progress: function (e, data) {},
			done: function (e, data) {
				$("#comment_image_box_"+code).show();
				$.each(data.result.comment_images,function(i,file){
					var url = CDN_UPLOAD_URL+file.url;
					var html ='<span class="file-add"><input type="hidden" name="tmp_img[]" value="'+file.tmp_idx+'"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#comment_image_box_"+code).append(html);

				});
			},
			fail: function (e, data) {
			}
		});
	};

	var commentAddSub = function(code){
		var obj = $('#'+code);
		var comment_sub_body = obj.find('._comment_add_body_'+code);
		var form = obj.find('._add_sub_form_'+code);
		var $image_box = obj.find('#comment_image_box_'+code);
		var data = form.serializeObject();

		var tmp_img = {'temp_images':sub_comment_image[code]};
		data = $.extend(data,tmp_img);

		if (data.captcha_key) {
			if (data.body.length > 0 && data.captcha_answer.length === 0) {
				POST_COMMENT.refreshCaptchaSubForm(code);
				alert(getLocalizeString('설명_보안문자입력','','보안 문자를 입력해 주세요.'));
				return;
			}
		}

		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/post_comment_add.cm',
			dataType:'json',
			success:function(result){
				tokenRefresh(form, result.refresh_token, result.refresh_token_key);

				if(result.msg=='SUCCESS') {
					comment_sub_body.val('');
					commentFormHide();
					commentAddSubHTML(result.data.parent_code !='' ? result.data.parent_code : result.data.code,result.html);
					commentDestroyAddEditor(code);
					//self.location.hash=result.data.code;

					$image_box.empty();
				} else {
					alert(result.msg);
				}
			},
			complete:function(){
				if (data.captcha_key) {
				  POST_COMMENT.refreshCaptchaSubForm(code);
				}
			}
		});
	};

  var tokenRefresh = function(form, refresh_token, refresh_token_key){
    form.find('input[name="comment_token"]').val(refresh_token ? refresh_token : "");
    form.find('input[name="comment_token_key"]').val(refresh_token_key ? refresh_token_key : "");
  };
  
	var commentMapAddSub = function(code){
		var obj = $('#'+code);
		var comment_sub_body = obj.find('._comment_add_body_'+code);
		var form = obj.find('._add_sub_form_'+code);
		var data = form.serializeObject();

		var tmp_img = {'temp_images':sub_comment_image[code]};
		data = $.extend(data,tmp_img);

		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/map_comment_add.cm',
			dataType:'json',
			success:function(result){
				if(result.msg=='SUCCESS') {
					comment_sub_body.val('');
					commentFormHide();
					if(result.map_listing == 'map'){
						var map_sub_comment_count = 0;
						map_sub_comment_count = Math.round($('#list_'+result.list_idx).find('#comment_count').text());
						map_sub_comment_count++;
						$('#list_'+result.list_idx).find('#comment_count').text(map_sub_comment_count);
						$('#comment_area').find('#comment_count').text(map_sub_comment_count);
						$('#list_pop_'+result.list_idx).find('#comment_count').text(map_sub_comment_count);
						var sub_code = result.data.parent_code !='' ? result.data.parent_code : result.data.code;
						var comment_sub_list = $('#'+sub_code).find('._comment_sub_list');
						comment_sub_list.append(result.html);
						commentIncreaseTotalCount();
					}else{
						commentAddSubHTML(result.data.parent_code !='' ? result.data.parent_code : result.data.code,result.html);
					}
					commentDestroyAddEditor(code);
					//self.location.hash=result.data.code;
				}else
					alert(result.msg);
			}
		});
	};

	var commentShowSubEdit = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_sub_edit_body');
		comment_edit_body.data('org_body',comment_edit_body.val());
		comment_edit_body.focus();
		commentFormHide();
		obj.find('._comment_sub_wrap').hide();
		obj.find('._comment_sub_edit_form').show();

		$("#comment_image_upload_modify_btn_"+code).fileupload({
			url: '/ajax/comment_image_upload.cm',
			dataType: 'json',
			singleFileUploads:false,
			limitMultiFileUploads: 5,
			dropZone: null,
			maxFileSize : 20000000, //20mb
			limitMultiFileUploadSize : 110000000, //110 mb
			start: function (e, data) {},
			progress: function (e, data) {},
			done: function (e, data) {
				$("#comment_image_modify_box_"+code).show();
				$.each(data.result.comment_images,function(i,file){
					var url = CDN_UPLOAD_URL+file.url;
					var html ='<span class="file-add"><input type="hidden" name="tmp_img[]" value="'+file.tmp_idx+'"><div class="file-add-bg" style="background: url('+url+') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#comment_image_modify_box_"+code).append(html);

				});
			},
			fail: function (e, data) {
			}
		});

	};

	var commentCancelSubEdit = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_sub_edit_body');
		comment_edit_body.val(comment_edit_body.data('org_body'));
		commentFormHide();

	};

	var commentSubEdit = function(code){
		var obj = $('#'+code);
		var comment_edit_body = obj.find('._comment_sub_edit_body');
		var comment_body = obj.find('._comment_sub_body');
		var form = obj.find('._sub_edit_form');
		var data = form.serializeObject();
		if(comment_edit_body.val() == comment_edit_body.data('org_body')) {
			commentFormHide();
			return;
		}
		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/post_comment_add.cm',
			dataType:'json',
			success:function(result){
				if(result.msg=='SUCCESS') {
					comment_edit_body.data('org_body', result.data.body);
					comment_body.html($.nl2br(result.data.body));
					commentFormHide();
				}else
					alert(result.msg);
			}
		});

	};

	var commentAddHTML = function(html){
		commentIncreaseTotalCount();
		comment_container.append(html);
	};


	var commentConfirmShow = function(event, code , type, interlock_type, use_interlock_board){
		$post_secret_password = $('#post_secret_password');

		if($post_secret_password.length==0){
			$post_secret_password = $('<div class="remove-pop" id="post_secret_password" style="position:absolute; left:0;top:0;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
			$('body').append($post_secret_password);
		}
			var $post_link = $(event.target);

			var top = $post_link.offset().top;
			var left = $post_link.offset().left;

			$post_secret_password.css({
				position : 'absolute',
				top : top,
				left : left
			});
		$post_secret_password.find('input').val('');
			$post_secret_password.show();
			$post_secret_password.off('click','._confirm')
				.on('click','._confirm',function(){
					var secret_pass = $post_secret_password.find('input').val();
					$post_secret_password.hide();
					switch(type){
						case 'show' : commentShow(code,secret_pass,interlock_type);
						break;
						case 'delete' : commentDelete(code,secret_pass,interlock_type,use_interlock_board);
						break;
						case 'edit' :  commentEditShow(code,secret_pass,interlock_type);
						break;
					}
				});

			$('body').off('mousedown.post_secret')
				.on('mousedown.post_secret',function(e){
					var $tmp = $(e.target).closest('#post_secret_password');
					if($tmp.length==0) {
						$post_secret_password.hide();
						$('body').off('click.post_secret');
					}
				});
	};

	var commentMapConfirmShow = function(event, code, type, interlock_type){
		$post_secret_password = $('#post_secret_password');
		if($post_secret_password.length==0){
			$post_secret_password = $('<div class="remove-pop" id="post_secret_password" style="position:absolute; left:0;top:0;z-index:99999;"><p>'+LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요()+'</p><div class="input_area"><input type="password" placeholder="'+LOCALIZE.설명_비밀번호()+'"><button class="btn btn-primary _confirm">'+LOCALIZE.버튼_확인닫기()+'</button></div></div>').hide();
			$('body').append($post_secret_password);
		}
		var $post_link = $(event.target);

		var top = $post_link.offset().top;
		var left = $post_link.offset().left;

		$post_secret_password.css({
			position : 'absolute',
			top : top,
			left : left
		});

		$post_secret_password.find('input').val('');
		$post_secret_password.show();
		$post_secret_password.off('click','._confirm')
			.on('click','._confirm',function(){
				var secret_pass = $post_secret_password.find('input').val();
				$post_secret_password.hide();
				switch(type){
					case 'show'   : commentMapShow(code,secret_pass);
					break;
					case 'delete' : commentMapDelete(code,secret_pass);
					break;
					case 'edit'   : commentEditShow(code,secret_pass,interlock_type);
					break;
				}
			});
		$('body').off('mousedown.post_secret')
			.on('mousedown.post_secret',function(e){
				var $tmp = $(e.target).closest('#post_secret_password');
				if($tmp.length==0) {
					$post_secret_password.hide();
					$('body').off('click.post_secret');
				}
			});
	};

	var commentDelete = function(code,secret_pass,interlock_type,use_interlock_board){
		var obj = $('#'+code);
		var comment_wrap = obj.find('._comment_wrap_'+code);
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type:'post',
				data:{
					code:code,
					post_code:post_code,
					secret_pass:secret_pass,
					interlock_type:interlock_type,
					use_interlock_board:use_interlock_board
				},
				url:'/ajax/post_comment_delete.cm',
				dataType:'json',
				success:function(result){
					if(result.msg == 'SUCCESS'){
						if(result.mode == 'delete'){
							comment_wrap.html(LOCALIZE.설명_삭제된_댓글_입니다());
						}else {
							obj.remove();
						}
						commentDecreaseTotalCount();
					}else{
						alert(result.msg);
					}
				}
			});
		}
	};

	var commentShow = function(code,secret_pass,interlock_type){
		$.ajax({
			type : 'POST',
			data : {code : code, post_code : post_code, secret_pass : secret_pass, show: 'Y', board_type:interlock_type},
			url : ('/ajax/post_comment_show.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					$("._comment_body_"+code).find("#secret_comment_text").text(result.html);
					$("._comment_body_"+code).find($("img")).attr("src",result.img_url);
					if(result.isSubComment){
						for(var i in result.sub_comment){
							var sub_data = result.sub_comment[i];
							$('._comment_body_'+sub_data.code).html(sub_data.html);
						}
					}
				}else
					alert(result.msg);
			}
		});

	};
	var commentEditShow = function(code,secret_pass,interlock_type){
		$.ajax({
			type : 'POST',
			data : {code : code, post_code : post_code, secret_pass : secret_pass, board_type : interlock_type},
			url : ('/ajax/post_comment_show.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					commentShowEdit(code,interlock_type);
				}else
					alert(result.msg);
			}
		});
	};

	var commentMapShow = function(code, secret_pass){
		$.ajax({
			type : 'POST',
			data : {code : code, post_code : post_code, secret_pass : secret_pass},
			url : ('/ajax/post_map_comment_show.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					$("._comment_body_"+code).find("#secret_comment_text").text(result.html);
					$("._comment_body_"+code).find($("img")).attr("src",result.img_url);
					if(result.isSubComment){
						for(var i in result.sub_comment){
							var sub_data = result.sub_comment[i];
							$('._comment_body_'+sub_data.code).html(sub_data.html);
						}
					}
				}else
					alert(result.msg);
			}
		});
	};

	var commentMapDelete = function(code,secret_pass){
		var obj = $('#'+code);
		var comment_wrap = obj.find('._comment_wrap_'+code);
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type:'post',
				data:{code:code,post_code :post_code,secret_pass:secret_pass},
				url:'/ajax/map_comment_delete.cm',
				dataType:'json',
				success:function(result){
					if(result.msg == 'SUCCESS'){
						if(result.mode == 'delete'){
							comment_wrap.html(LOCALIZE.설명_삭제된_댓글_입니다());
						}else {
							obj.remove();
						}
						if(result.map_listing == 'map'){
							var map_comment_count = 0;
							map_comment_count = Math.round($('#list_'+result.list_idx).find('#comment_count').text());
							map_comment_count--;
							$('#list_'+result.list_idx).find('#comment_count').text(map_comment_count);
							$('#comment_area').find('#comment_count').text(map_comment_count);
							$('#list_pop_'+result.list_idx).find('#comment_count').text(map_comment_count);
						}else{
							commentDecreaseTotalCount(result.decrease_count);
						}
					}else{
						alert(result.msg);
					}
				}
			});
		}
	};


	var commentAddSubHTML = function(code,html){
		var obj = $('#'+code);
		var comment_sub_list = obj.find('._comment_sub_list');
		comment_sub_list.append(html);
		commentIncreaseTotalCount();
	};

	var commentToggleSub = function (parent_comment_id){
		var parent_obj = $('#'+parent_comment_id);
		var loaded = parent_obj.data('sub_loaded');
		var sub_open = parent_obj.data('sub_open');
		var sub_comment_wrap = parent_obj.find('._sub_comment_wrap');
		var sub_comment_list = parent_obj.find('._sub_comment_list');
		var arrow_icon = parent_obj.find('._arrow_icon');
		if(typeof loaded == 'undefined' || loaded == false){
			$.ajax({
				type:'post',
				data:{code : parent_comment_id},
				url:'/ajax/getChildComment.cm',
				dataType:'json',
				success:function(data){
					var html = $(data.html);
					sub_comment_list.append(html);
					sub_comment_wrap.show();
					arrow_icon.removeClass('zmdi-chevron-down').removeClass('zmdi-chevron-down').removeClass('zmdi-chevron-down');
					arrow_icon.addClass('zmdi-chevron-up');
					parent_obj.data('sub_loaded', true);
					parent_obj.data('sub_open', true);
				}
			});
		}else{
			if(typeof sub_open == 'undefined' || sub_open == false){
				sub_comment_wrap.show();
				arrow_icon.removeClass('zmdi-chevron-down').removeClass('zmdi-chevron-down').removeClass('zmdi-chevron-down');
				arrow_icon.addClass('zmdi-chevron-up');
				parent_obj.data('sub_loaded', true);
			}else{
				sub_comment_wrap.hide();
				arrow_icon.removeClass('zmdi-chevron-up').removeClass('zmdi-chevron-up').removeClass('zmdi-chevron-up');
				arrow_icon.addClass('zmdi-chevron-down');
				parent_obj.data('sub_loaded', false);
			}
		}
	};

	var commentMapAdd = function(){
		var data = comment_form.serializeObject();
		$.ajax({
			type:'post',
			data:data,
			url:'/ajax/map_comment_add.cm',
			dataType:'json',
			success:function(result){
				if(result.msg=='SUCCESS') {
					comment_body.val('');
					$("#comment_image_box").empty().hide();
					commentFormHide();
					if(result.map_listing == 'map'){
						var map_comment_count = 0;
						map_comment_count = result.comment_cnt;
						$('#list_'+result.list_idx).find('._comment_count').text(map_comment_count);
						$('#comment_area').find('#comment_count').text(map_comment_count);
						$('#list_pop_'+result.list_idx).find('._comment_count').text(map_comment_count);
						if(result.map_comment_sort == 'asc' || !result.map_comment_sort){
							$comment_container.find('div.comment_list div.comment:last').length === 0 ? $comment_container.append(result.html) : $comment_container.find('div.comment_list div.comment:last').after(result.html);
						}else{
							$comment_container.prepend(result.html);
							moveToCommentListTop();
						}
						autosize.update($('.comment_textarea').find('#comment_body'));
					}else{
						commentAddHTML(result.html);
					}
				}else
					alert(result.msg);
			}
		});
	};

	var getCommentListByCurrentPagingNum = function(current_page, is_move_to_comment_list_top){
		var is_loaded = false;
		if(is_loaded === false){ // 재호출 방지
			is_loaded = true;
			$.ajax({
				type:'post',
				data:{
					'board_code': comment_form.find("input[name='board_code']").val(),
					'post_code': post_code,
					'current_page':current_page
				},
				url:'/ajax/post_comment_paging.cm',
				dataType:'json',
				success:function(result){
					is_loaded = false;
					if(result.msg === 'SUCCESS') {
						$comment_container.html(result.html);
						if(is_move_to_comment_list_top) moveToCommentListTop();
					}else{
						alert(result.msg);
					}
				}
			});
		}
	};

	var moveToCommentListTop = function(){
		var $modal_widget_fullboard = $('.modal_widget_fullboard');
		var $pos_comment_container = $('#comment_container');

		// 위젯 위치 세팅
		if($modal_widget_fullboard.length > 0){
			$modal_widget_fullboard.scrollTop($('.comment-block').position().top);
		}else if($pos_comment_container.length > 0){
			// 스크롤 고정 메뉴 확인
			var fixed_header_section = $("._fixed_header_section");
			var header_height = 0;

			if(fixed_header_section.length > 0){
				for(var i = 0; i < fixed_header_section.length; i++){
					header_height += 2 * fixed_header_section[i].offsetHeight;
				}
			}
			// 상단 고정 메뉴 확인
			var new_fixed_header = $('#doz_header_wrap').find('._new_fixed_header');
			if(new_fixed_header.length > 0){
				header_height += new_fixed_header.height();
			}

			$(window).scrollTop($('.comment-block').offset().top - header_height -15);
		}
	};

	return {
		init : function(code){
			commentInit(code);
		},
		toggleSub : function(code){
			commentToggleSub(code);
		},
		showEdit : function(code, board_type){
			commentShowEdit(code, board_type);
		},
		showSubForm : function(code){
			commentShowSubForm(code);
		},
		showAtForm : function(code){
			commentShowAtForm(code);
		},
		edit : function(code){
			commentEdit(code);
		},
		editMap : function(code){
			commentEditMap(code);
		},
		cancelEdit : function (code){
			commentCancelEdit(code);
		},
		addSub : function(code){
			commentAddSub(code);
		},
		addMapSub : function(code){
			commentMapAddSub(code);
		},
		addAt : function(code){
			commentAddAt(code);
		},
		showSubEdit : function(code){
			commentShowSubEdit(code);
		},
		cancelSubEdit : function (code){
			commentCancelSubEdit(code);
		},
		subEdit : function(code){
			commentSubEdit(code);
		},
		confirmShow : function(e,code,type,interlock_type,use_interlock_board){
			commentConfirmShow(e,code,type,interlock_type,use_interlock_board);
		},
		mapConfirmShow : function(e, code, type, interlock_type){
			commentMapConfirmShow(e, code , type, interlock_type)
		},
		confirmMapDelete : function(e,code){
			commentConfirmMapDelete(e,code);
		},
		'delete' : function(code, pass,interlock_type,use_interlock_board){
			commentDelete(code,pass,interlock_type,use_interlock_board);
		},
		deleteMap : function(code,pass){
			commentMapDelete(code,pass);
		},
		add : function(){
			commentAdd();
		},
		mapAdd : function(){
			commentMapAdd();
		},
		removeCommentImg : function(obj){
			removeCommentImg(obj)
		},
		getCommentListByCurrentPagingNum : function(current_page, is_move_to_comment_list_top){
			getCommentListByCurrentPagingNum(current_page, is_move_to_comment_list_top);
		},
		refreshCaptcha : function(){
			refreshCaptcha();
		},
		refreshCaptchaSubForm: function(code) {
			refreshCaptcha('sub_form', code);
		}
	}

}();