var HEADER_CENTER_COLGROUP = function(){
	var data = {};
	var code;
	var $section, $left_col_group, $center_col_group, $right_col_group;
	var $window;

	var init = function(c,sd){
		if(isBlank(c))
			return;
		code = c;

		$window = $(window);
		$section = $('#'+code);
		if($section.length == 0)
			return;

		if(!$section.hasClass('extend'))
			return;

		data = sd;
		if(isBlank(data))
			return;

		if(isBlank(data.center_width))
			return;

		if(parseInt(data.center_width) == 0)
			return;

		if(parseInt(data.center_width) > parseInt(data.left_width))
			return;

		if(parseInt(data.center_width) > parseInt(data.right_width))
			return;


		$left_col_group = $section.find('div[data-type=col-group][data-col-group=left]');
		$center_col_group = $section.find('div[data-type=col-group][data-col-group=center]');
		$right_col_group = $section.find('div[data-type=col-group][data-col-group=right]');

		if($center_col_group.length == 0)
			return;

		if(typeof ResizeObserver === 'function'){
			var sectionResizeObserver = new ResizeObserver(function(){
				resizeCenterColgroup();
			});
			sectionResizeObserver.observe($section[0]);
		}else{
			$window.off('resize.header_colgroup_'+code).on('resize.header_colgroup_'+code,function(){
				resizeCenterColgroup();
			});
		}
		resizeCenterColgroup();

	};

	var resizeCenterColgroup = function(){
		var section_width = $section.find('div[data-type=section]').width();
		var left_width = (section_width - parseInt(data.center_width))/2;
		$left_col_group.width(left_width);
		$right_col_group.width(left_width);
	};
	return {
		'init' : function(c,sd){
			init(c,sd);
		}
	}
};