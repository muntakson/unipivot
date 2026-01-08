var ARTICLE_REACTION = function(){
	var $btn,$num;
	var target_type, target_code;
	var like_token, like_token_key;
	var post_position; //글목록에서 좋아요 클릭시 클릭한 글이 무엇인지 알기 위한 변수
	var recommend_token, recommend_token_key;
	var init = function(type,code,$b,$n){
		$btn = $b;
		$num = $n;
		target_type = type;
		target_code = code;
	};

	//글 목록에서 좋아요 클릭구분
	var checkLikeToken = function(key,token,current_position){
		if((typeof like_token === "undefined") || (typeof like_token_key === "undefined") || (post_position !== current_position)){
			like_token = token;
			like_token_key = key;

		}
	};

	var setLikeToken = function(){
		TOKEN.makeToken(86400,'article_reaction_set_like',function(token,token_key){
			like_token = token;
			like_token_key = token_key;
		});
	};

	var setRecommendToken = function(){
		TOKEN.makeToken(86400,'article_reaction_set_recommend',function(token,token_key){
			recommend_token = token;
			recommend_token_key = token_key;
		});
	};

	var toggleLike = function(){
		toggleReaction('like');
	};

	var toggleReaction = function(type){
		$.ajax({
			type        : 'POST',
			data        : {'target_type':target_type, 'target_code' : target_code,'token':like_token, 'key' : like_token_key, 'type' : type},
			url         : ('/ajax/article_reaction.cm'),
			dataType    : 'json',
			async       : true,
			cache       : false,
			success     : function (result) {
				if(result.msg == 'SUCCESS'){


					//최신글 위젯의 좋아요 버튼, 카운트
					var newest_like_btn = $("[name='newest_like_btn_" + target_code + "']");
					var newest_like_count = $("[name='newest_like_count_" + target_code + "']");

					if(result.mode == 'add'){

						//최신글 위젯 갱신
						$.each(newest_like_btn, function(){
							newest_like_btn.toggleClass('on', true);
						});

						$.each(newest_like_count, function(index){
							newest_like_count.eq(index).text(parseInt(newest_like_count.eq(index).text()) + 1);
						});

						$btn.toggleClass('on', true);
						$num.text(parseInt($num.text()) + 1);
					}else if(result.mode == 'delete'){

						//최신글 위젯 갱신
						$.each(newest_like_btn, function(){
							newest_like_btn.toggleClass('on',false);
						});

						$.each(newest_like_count, function(index){
							newest_like_count.eq(index).text(parseInt(newest_like_count.eq(index).text())-1);
						});

						$btn.toggleClass('on',false);
						$num.text(parseInt($num.text())-1);
						$('#like_token_key_' + target_code).val(result.key);
						$('#like_token_' + target_code).val(result.token);
						like_token = result.token;
						like_token_key = result.key;
					}
					post_position = target_code; //글 목록에서 좋아요 클릭한 글의 위치를 파악하기위해 저장
				}
			}
		});
	};

	var mapToggleLike = function(idx,list_type){
		mapToggleReaction('like',idx,list_type);
	};

	var mapToggleReaction = function(type,idx,list_type){

		$.ajax({
			type        : 'POST',
			data        : {'target_type':target_type, 'target_code' : target_code,'token':like_token, 'key' : like_token_key, 'type' : type},
			url         : ('/ajax/article_reaction.cm'),
			dataType    : 'json',
			async       : true,
			cache       : false,
			success     : function (result) {
				if(result.msg == 'SUCCESS'){
					if(list_type == 'map'){
						if(result.mode == 'add'){
							$btn.toggleClass('on', true);
							$('#list_pop_'+idx).find('#like_btn_' + target_code).toggleClass('on', true);
							$num.text(parseInt($num.text()) + 1);
							$('#list_'+idx).find('#like_count_' + target_code).text(parseInt($num.text()));
							$('#list_pop_'+idx).find('#like_count_' + target_code).text(parseInt($num.text()));
						}else if(result.mode == 'delete'){
							$btn.toggleClass('on',false);
							$('#list_pop_'+idx).find('#like_btn_' + target_code).toggleClass('on', false);
							$num.text(parseInt($num.text())-1);
							$('#list_'+idx).find('#like_count_' + target_code).text(parseInt($num.text()));
							$('#list_'+idx).find('#like_token_key_' + target_code).val(result.key);
							$('#list_'+idx).find('#like_token_' + target_code).val(result.token);
							$('#list_pop_'+idx).find('#like_count_' + target_code).text(parseInt($num.text()));
							like_token = result.token;
							like_token_key = result.key;
						}
					}else{
						if(result.mode == 'add'){
							$btn.toggleClass('on', true);
							$num.text(parseInt($num.text()) + 1);
						}else if(result.mode == 'delete'){
							$btn.toggleClass('on',false);
							$num.text(parseInt($num.text())-1);
							like_token = result.token;
							like_token_key = result.key;
						}
					}
					post_position = target_code; //글 목록에서 좋아요 클릭한 글의 위치를 파악하기위해 저장
				}
			}
		});
	};

	return {
		'init' : function(type,code,$btn,$num){
			init(type,code,$btn,$num);
		},
		'checkLikeToken' : function(key,token, current_position){
			checkLikeToken(key,token, current_position);
		},
		'setLikeToken' : function(){
			setLikeToken();
		},
		'setRecommendToken' : function(){
			setRecommendToken();
		},
		'toggleLike' : function(){
			toggleLike();
		},
		'mapToggleLike' : function(idx,list_type){
			mapToggleLike(idx,list_type);
		}
	}
};