var SITE_WIDGET = function(){
	var fixed_header_section;
	var new_fixed_header;
	var widget_top_position;
	var header_height = 0;

	var move_to_widget_position = function(widget_id){
		$(window).load(function(){
			// 스크롤 고정 메뉴 확인
			fixed_header_section = $("._fixed_header_section");
			if(fixed_header_section.length > 0){
				for(var i = 0; i < fixed_header_section.length; i++){
					header_height += 2 * fixed_header_section[i].offsetHeight;
				}
			}
			// 상단 고정 메뉴 확인
			new_fixed_header = $('#doz_header_wrap').find('._new_fixed_header');
			if(new_fixed_header.length > 0){
				header_height += new_fixed_header.height();
			}
			var $pos_widget = $('#'+widget_id);
			if($pos_widget.length > 0){
				// 위젯 위치 세팅
				widget_top_position = $('#'+widget_id).offset().top;
				$(window).scrollTop(widget_top_position - header_height -15);
			}

		});
	};

	return{
		'move_to_widget_position' : function(widget_id){
			move_to_widget_position(widget_id);
		}
	}
}();