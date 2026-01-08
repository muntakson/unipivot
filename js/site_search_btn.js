var SITE_SEARCH_BTN = function(){
	var code;
	var data = {};
	var $container;
	var $button;
	var $input;
	var spare_width = 0;

	var init = function(c,d){
		code = c;
		data = d;
		$container = $('#'+c);
		$button = $container.find('._search_button');
		$input = $container.find('._input');

		run();
	};

	var run = function(){
		spare_width = 2;
		var width = Math.floor($button.outerWidth(true)) + spare_width;
		$input.css({
			'width' : 'calc(100% - '+width+'px)'
		});
	};

	return {
		'init': function (c, d) {
			init(c, d);
		},
		'run': function () {
			run();
		}
	}
};