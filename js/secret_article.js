var SECRET_ARTICLE = function(){
	var $secret_password;
	var $widget_code;
	var postInitWrite = function(widget_code){
		$widget_code = widget_code;
	}
	var confirmSecret = function(event,board_code,code,link,widget_type,reload){
		$secret_password = $('#post_secret_password');
		if($secret_password.length==0){
			$secret_password = $('<div class="remove-pop" id="post_secret_password" style="position:absolute; left:0;top:0;z-index:99999;"><p>'+LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요()+'</p><div class="input_area"><input type="password" placeholder="'+LOCALIZE.설명_비밀번호()+'"><button class="btn btn-primary _confirm">'+LOCALIZE.버튼_확인닫기()+'</button></div></div>').hide();
			if(widget_type == 'calendar'){
				$('#calendar').append($secret_password);
			}else if(widget_type == 'map'){
				$('body').append($secret_password);
			}else{
				$('body').append($secret_password);
			}
		}
		if(widget_type == 'calendar'){
				var top = '50%';
				var left = $(window).width()/2;
				left = left -162.5;

			$secret_password.css({
				position:'fixed',
				top : top,
				left : left
			});
			$('._calendar_modal_back').show();
		}else if(widget_type == 'map'){
			var $post_link = $(event.target).find('._tools_txt');
			var top = $post_link.offset().top;
			var left = $post_link.offset().left;

			$secret_password.css({
				position : 'absolute',
				top : top,
				left : left
			});

		}else if(widget_type == 'map_mobile'){
			var $post_link = $(event.target).find('._dropdown');

			var top = $post_link.offset().top+113;
			var left = $post_link.offset().left-325;

			$secret_password.css({
				position : 'absolute',
				top : top,
				left : left
			});
		}else if(widget_type == 'map_more'){
			var $post_link = $('body').find('#maps_more .text-brand');

			var top = $post_link.offset().top;
			var left = $(window).width()/2;
			left = left -162.5;

			$secret_password.css({
				position : 'absolute',
				top : top,
				left : left
			});
		}else{
			var $post_link = $(event.target);
			var top;
			if($post_link.offset() === undefined){
				top = $(window).height()/2;
				top = top - 117
			}else{
				top = $post_link.offset().top;
			}


			var left = $(window).width()/2;
			left = left -162.5;

			$secret_password.css({
				position : 'absolute',
				top : top,
				left : left
			});
		}

		$secret_password.find('input').val('');
		$secret_password.show();
		$secret_password.off('click','._confirm')
			.on('click','._confirm',function(){
				var secret_pass = $secret_password.find('input').val();
				CheckSecret(board_code,code,secret_pass,function(){
					if(typeof link == 'function'){
						if(widget_type == 'calendar'){
							$('._calendar_modal_back').hide();
						}
						link(secret_pass);
					}else{
						window.location.href=link;

						//hash url 용 reload 옵션 추가
						if(typeof reload != 'undefined' && reload == 'Y'){
							location.reload();
						}
					}
				},widget_type);
			});
		$('body').off('mousedown.post_secret')
			.on('mousedown.post_secret',function(e){
				var $tmp = $(e.target).closest('#post_secret_password');
				if($tmp.length==0) {
					$secret_password.hide();
					$('body').off('click.post_secret');
				}
			});
	};
	var CheckSecret = function(board_code,code,secret_pass,callback,widget_type){
		$.ajax({
			type:'post',
			data:{board_code:board_code,code:code,secret_pass :secret_pass,widget_type:widget_type},
			url:'/ajax/check_secret_pass.cm',
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

	return{
		init: function(code) {
			postInitWrite(code);
		},
		confirmSecret : function(event,board_code,code,link,widget_type,reload){
			confirmSecret(event,board_code,code,link,widget_type,reload);
		}
	}
}();