var PREVIEW_MODE = function(){
	var $preview_bar;
	var $window;
	//var show = false;
	//var hide = true;
	//var hide_timeout = {};
	//var auto_hide_timeout = {};
	var init = function(){
		$preview_bar = $('#preview_mode_bar');
		$window = $(window);
	//	mouseTrigger();
	//	showBar();
	};

	var publishDesignTemp = function(){
    let $publish_btn = $('.preview-tools a.btn-publish');
		$.ajax({
			type: 'POST',
			data: {'mode':'publish'},
			url: ('/admin/ajax/publish_design_temp.cm'),
			dataType: 'json',
			async: true,
			cache: false,
      'beforeSend' : function(){
        /* 게시하기 버튼 게시중 상태로 변경 */
        $publish_btn.html('<span>' + getLocalizeString("버튼_게시중", "", "게시중") + '</span>').attr('data-state','loading').off('click').on('click',function(e){
          return false;
        });
      },
			success: function (result) {
				if (result.msg == 'SUCCESS') {
					$preview_bar.find('._temp').hide();
					$preview_bar.find('._published').show();

					GA4.ClickDesiginMode(result.site_code, result.unit_code);
				}else{
					alert(result.msg );
          $publish_btn.html(getLocalizeString("버튼_게시하기", "", "게시하기")).attr('data-state', '').off('click');
				}
			},
			error: function(){
				alert(getLocalizeString('설명_게시하기실패', '', '게시하기에 실패 했습니다. 새로고침 하시거나 잠시 후 재시도해주시고 계속 실패한다면 고객센터에 문의해주세요.'));
        $publish_btn.html(getLocalizeString("버튼_게시하기", "", "게시하기")).attr('data-state', '').off('click');
			}
		});
	};

	var checkPublishAlert = function(){
		$.ajax({
			'type' : 'POST',
			'data' : {},
			'url' : ('/admin/ajax/check_publish_alert.cm'),
			'dataType' : 'json',
			'async' : false,
			'cache' : false,
			'success' : function(result){
				if(result.status === 'PASS') {
					publishDesignTemp();
				}else if(result.status === 'CHECK'){
					$.cocoaDialog.open({
						type: 'alert_designmode',
						content: result.msg,
						footer_content: result.footer_msg,
						confirm_text: result.confirm_text,
						cancel_text: result.cancel_text
					}, function(){
            if($('input[name=publish_alert_skip]').prop('checked')){
              setCookie('publish_alert_skip', 'Y', 1);
            }
            publishDesignTemp();
            $.cocoaDialog.close();
					});
				}else{
					$.cocoaDialog.open({
						type: 'alert_designmode',
						content: result.msg,
						confirm_text: result.confirm_text,
						cancel_text: result.cancel_text
					}, function(){
            publishDesignTemp();
            $.cocoaDialog.close();
					});
				}
			},
			error: function(){
				alert(getLocalizeString('설명_게시하기실패', '', '게시하기에 실패 했습니다. 새로고침 하시거나 잠시 후 재시도해주시고 계속 실패한다면 고객센터에 문의해주세요.'));
			}
		});
	};

	var closePreviewMode = function(back_url){
		window.location.href='/backpg/close_preview_mode.cm?back_url='+back_url;
	};
	return {
		'init' : function(){
			init();
		},
		'checkPublishAlert' : function(){
			checkPublishAlert();
		},
		'publishDesignTemp' : function(){
			publishDesignTemp();
		},
		'closePreviewMode' : function(back_url){
			closePreviewMode(back_url);
		}
	}
}();