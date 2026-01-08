/**
 * 공통 컴포넌트 js 파일
 * 스타일은 im_component.css에 작성
 */
/**
 * 화면 아래에서 올라오는 시트 다이얼로그
 * @type {{isOpen: imSheet.isOpen, close: imSheet.close, open: imSheet.open}}
 */
var imSheet = function(){
	var default_option = {
		html: '',
		backdrop: 'rgba(0, 0, 0, 0.6)',  // 뒷배경 색상
		zIndex: 1351
	};
	var $im_sheet_content;
	var $im_sheet;
	var open = function(o, callback) {
		var option = o;
		if(typeof option.id === 'undefined') option.id = makeUniq('im_sheet_');
		option = $.extend({}, default_option, option);
		if(isOpen(option.id)) close(option.id);
		$im_sheet_content = $('<div class="im-sheet-content"></div>').append(o.html);
		$im_sheet = $('<div class="im-sheet" id="' + option.id + '"></div>').css({background: option.backdrop, 'z-index': option.zIndex}).append($im_sheet_content);
		$('body').append($im_sheet).addClass('modal-open');
		setTimeout(function(){
			$im_sheet_content.css({
				'top': 'calc(100% - ' + $im_sheet_content.height() + 'px)'
			}).focus();
			setTimeout(function(){
				if(typeof callback == 'function')
					callback($im_sheet);
			}, 200);
		}, 10);
		$im_sheet.on('click', function(e){
			if($(e.target).parents('.im-sheet-content').length === 0){
				close(option.id);
			}
		});
	};
	var close = function(id, callback) {
		if(typeof id === 'undefined') return false;
		$im_sheet = $("#" + id);
		$im_sheet_content = $im_sheet.find('.im-sheet-content');
		$im_sheet_content.css({
			'top' : '100%'
		});
		setTimeout(function(){
			$im_sheet.remove();
			$('body').removeClass('modal-open');
			if(typeof callback == 'function')
				callback($im_sheet);
		}, 200);
	};
	var isOpen = function(id) {
		if(typeof id === 'undefined') return false;
		var $im_sheet = $("#" + id);
		return $im_sheet.css('display')==='block';
	};
	return {
		'open': function(o, callback){
			open(o, callback);
		},
		'close': function(id, callback){
			close(id, callback);
		},
		isOpen: function(id){
			isOpen(id);
		}
	}
}();

/**
 * imSheet 디자인의 셀렉트 다이얼로그
 * @type {{close: imSheetSelect.close, open: imSheetSelect.open}}
 */
var imSheetSelect = function(){
	var default_option = {
	};
	var open = function(list, selected, select_event, o){
		var option = o;
		if(typeof option.id === 'undefined') option.id = makeUniq('im_sheet_');
		option = $.extend({}, default_option, option);
		var $ul = $('<ul class="im-sheet-select"></ul>');
		for (var key in list){
			var selected_class = key === selected ? 'selected' : '';
			var $li = $('<li data-val="' + key + '" class="' + selected_class + '">' + list[key] + '</li>');
			$ul.append($li);
		}
		imSheet.open({
			html: $ul[0].outerHTML,
			id: option.id
		}, function($im_sheet){
			$im_sheet.find('ul > li').off('click').on('click', function(){
				var $that = $(this);
				var val = $that.attr('data-val');
				$im_sheet.find('ul > li').removeClass('selected');
				$that.addClass('selected');
				close(option.id, function(){
					if(val !== selected){
						if(typeof select_event == 'function')
							select_event(val, option.id);
					}
				});
			})
		});
	};
	var close = function(id, callback){
		imSheet.close(id, callback);
	};
	return {
		'open': function(list, selected, select_event, o){
			open(list, selected, select_event, o);
		},
		'close': function(id, callback){
			close(id, callback);
		}
	}
}();
