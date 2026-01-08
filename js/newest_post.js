var NEWEST_POST = function(){

	var mode;

  /**
   * 구매평 또는 문의 URL로 리다이렉트, 현재 예약에서만 사용됨
   * moveReviewUrl 등의 이름이 맞을 듯 하나 고객 커스텀 코드로 사용될 가능성을 고려하여 함수명 유지
   * @param type
   * @param prod_url
   * @param idx
   */
	var getReviewUrl = function(type,prod_url,idx){
		if(type == 'shop_review'){
			location.href = prod_url+'#prod_detail_review!/'+idx;
		}else{
			location.href = prod_url+'#prod_detail_qna!/'+idx;
		}
	};

	//bmode 구해서 변수에 셋팅
	var setParameterByName = function(name){
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);

		mode = null === results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
	};

	var newestClickLike = function(post_code, like_token_key, like_token){
		event.stopPropagation();

		if(mode === 'view'){ //게시글 본문과 같은 페이지에 있으면 갱신버튼을 본문 좋아요 버튼으로 셋팅
			post_like_reaction.init('post', post_code, $('#view_like_btn_' + post_code), $('#view_like_count_' + post_code));
		}else{
			post_like_reaction.init('post', post_code, $('#like_btn_' + post_code), $('#like_count_' + post_code));
		}
		post_like_reaction.checkLikeToken(like_token_key, like_token, post_code);
		post_like_reaction.toggleLike();
	};

  var viewReviewPostDetail = function(idx){
    $(function(){
      $.ajax({
        type : 'POST',
        data : {idx : idx},
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
                  viewReviewPostDetail(hash_qna_spilt);
                }else if(hash_spilt_tab === '#prod_detail_qna'){
                  viewQnaPostDetail(hash_qna_spilt);
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

  var viewQnaPostDetail = function(idx){
    $(function(){
      $.ajax({
        type : 'POST',
        data : {idx : idx},
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
                  viewReviewPostDetail(hash_qna_spilt);
                }else if(hash_spilt_tab === '#prod_detail_qna'){
                  viewQnaPostDetail(hash_qna_spilt);
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

	var viewQnaPostPassword = function(idx, code){
		var pw = prompt(LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요());
		if(pw == null) return false;
		if(!pw) return alert(LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요());
		CheckSecret(code, pw, function () {
			NEWEST_POST.viewQnaPostDetail(idx);
		});
	};

	var CheckSecret = function(code, secret_pass, callback) {
		$.ajax({
			type: 'post',
			data: { code: code, secret_pass: secret_pass, type: 'qna' },
			url: '/ajax/check_review_pass.cm',
			dataType: 'json',
			success: function (result) {
				if (result.msg == 'SUCCESS') {
					if (typeof callback == 'function')
						callback();
				} else {
					alert(result.msg);
				}
			}
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
		'getReviewUrl' : function(type,prod_url,idx){
			return getReviewUrl(type,prod_url,idx);
		},
		'setParameterByName' : function(name){
			setParameterByName(name);
		},
		'newestClickLike' : function(post_code, like_token_key, like_token){
			newestClickLike(post_code, like_token_key, like_token);
		},
    'viewReviewPostDetail' : function(idx){
      viewReviewPostDetail(idx);
    },
    'removeReviewHash' : function(){
      removeReviewHash();
    },
    'viewQnaPostDetail' : function(idx){
      viewQnaPostDetail(idx);
    },
		'viewQnaPostPassword' : function(idx, code){
			viewQnaPostPassword(idx, code);
		},
    'removeQnaHash' : function(){
      removeQnaHash();
    },
    'alertNoSale' : function(){
      alertNoSale();
    }
	}
}();