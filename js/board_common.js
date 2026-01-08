/**
 * 게시판 공통으로 사용되는 함수. (게시판위젯, 지도위젯, 캘린더위젯)
 *
 */
var BOARD_COMMON = function(){

	// site 에서 사용됨.
	var _openReportModal = function() {
		var board_code = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
		var post_code = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
		var comment_code = arguments[2];
		var type = arguments[3];

		$.ajax({
			type : 'post',
			data : {'board_code':board_code, 'post_code':post_code, 'comment_code':comment_code, 'type':type},
			url : '/dialog/open_report_modal.cm',
			dataType : 'json',
			success : function(res){
				if(res.msg === 'SUCCESS'){
					$.cocoaDialog.open({type : 'admin', custom_popup : res.html});

					//cocoaDialog
					$('#cocoaSubModal').css('z-index',$('#cocoaModal').css('z-index') + 1);

				}else{
					alert(res.msg)
				}
			}
		});
	};

	var addReport = function(){
		var data = $('#report_form').serializeObject();
		$.ajax({
			type : 'post',
			data : {'data':data},
			url : '/ajax/add_report.cm',
			dataType : 'json',
			success : function(res){
				if(res.msg === 'SUCCESS'){
					alert(LOCALIZE.설명_신고가성공적으로접수되었습니다());
					$.cocoaDialog.close();
					$('#doz_body').css('overflow-y','scroll');

					location.reload();
				}else{
					alert(res.msg);
				}
			}
		});
	};
	var getOnlyPhotoReview = function(a,l){
		window.location.href = l + "&only_photo=" + a;
	};

	var _addBlock = function (code, writer, type, bord_code) {
		var current_page = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

		var alert_block_text = '';
		var alert_block = '';
		switch(type){
			case 'post':
				alert_block_text = '게시글을 차단하시겠습니까? 작성자의 다른 글과 댓글도 확인할 수 없습니다.';
				alert_block = '설명_게시글차단안내';
				break;
			case 'comment':
				alert_block_text = '댓글을 차단하시겠습니까? 작성자의 다른 댓글도 확인할 수 없습니다.';
				alert_block = '설명_님을차단안내';
				break;
		}
		if (confirm(getLocalizeString(alert_block, '', alert_block_text))){
			$.ajax({
				type : 'post',
				data : {
					'code' : code,
					'writer' : writer,
					'type' : type,
				},
				url : '/ajax/add_block.cm',
				dataType : 'json',
				success : function(res){
					if(res.msg === 'SUCCESS'){
						//댓글
						$('._comment_body_' + writer).html("<p class='text-gray'><i aria-hidden='true' class='icon icon-exclamation' style='margin-right: 5px;'></i>" + getLocalizeString("설명_차단된작성자의댓글입니다", "", "차단된 작성자의 댓글입니다.") + "</p>");

						$('._block_'+ writer)
							.text(getLocalizeString("설명_차단해제", "", "차단해제"))
							.attr("onclick", "BOARD_COMMON.deleteBlock('" + res.post_code + "','"  + writer + "', 'comment', '" + bord_code + "','" + current_page + "')");

						//게시글
						$('.margin-top-xxl._comment_body_' + writer).html("<p class='text-gray'><i aria-hidden='true' class='icon icon-exclamation' style='margin-right: 5px;'></i>" + getLocalizeString("설명_차단된작성자의게시글입니다", "", "차단된 작성자의 게시글입니다.") + "</p>");

						$('._board._block_'+ writer)
							.text(getLocalizeString("설명_차단해제", "", "차단해제"))
							.attr("onclick", "BOARD_COMMON.deleteBlock('" + res.post_code + "','"  + writer + "', 'post', '" + bord_code + "','" + current_page + "')");

					}else{
						alert(res.msg);
					}
				}
			});
		}
	};

	var _deleteBlock = function (post_code, writer, type, bord_code) {
		var current_page = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

		var alert_block_text = '';
		var alert_block = '';
		switch(type){
			case 'post':
				var page_number = $(".pagination [class='active']").text();
				current_page = page_number == "" ? '1' : page_number;
				alert_block_text = '게시글을 차단 해제하시겠습니까? 작성자의 다른 글과 댓글을 다시 확인할 수 있습니다.';
				alert_block = '설명_게시글차단해제안내';
				break;
			case 'comment':
				alert_block_text = '댓글을 차단 해제하시겠습니까? 작성자의 다른 댓글을 다시 확인할 수 있습니다.';
				alert_block = '설명_님을차단해제안내';
				break;
		}

		if(confirm(getLocalizeString(alert_block, '', alert_block_text))){
			$.ajax({
				type : 'post',
				data : {
					'writer' : writer,
					'post_code' : post_code,
					'bord_code' : bord_code,
					'current_page' : current_page,
				},
				url : '/ajax/delete_block.cm',
				dataType : 'json',
				success : function(res){
					if(res.msg === 'SUCCESS'){
						$('#comment_container').html(res.html);

						//게시물 상단
						$('.margin-top-xxl._comment_body_' + writer).html(res.post_body);

						$('._board._block_'+ writer)
							.text(getLocalizeString("설명_차단", "", "차단"))
							.attr("onclick", "BOARD_COMMON.addBlock('"+ res.code +"','"+ writer + "','post','" + bord_code +"');");
					}else{
						alert(res.msg)
					}
				}
			});
		}
	};
	return {
		'openReportModal': function () {
			var board_code = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
			var post_code = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
			var comment_code = arguments[2];
			var type = arguments[3];

			_openReportModal(board_code, post_code, comment_code, type);
		},
		'addReport' : function(){
			addReport();
		},
		'getOnlyPhotoReview' : function(a,l){
			getOnlyPhotoReview(a,l);
		},
		'addBlock': function (code, writer, type, bord_code) {
			var current_page = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

			_addBlock(code, writer, type, bord_code, current_page);
		},
		'deleteBlock': function (post_code, writer, type, bord_code) {
			var current_page = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

			_deleteBlock(post_code, writer, type, bord_code, current_page);
		}
	};
}();