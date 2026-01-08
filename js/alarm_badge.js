/**
 *
 * @type {{addBadgeArea, runAlarmBadgeSystem}}
 */
var ALARM_BADGE = function(){
	var alarm_count = 0;
	var alarm_area_list = [];
	var runAlarmBadgeSystem = function(){
		getAlarmCount(function(count){
			makeBadge(count);
		});
	};
	var getAlarmCount =  function (callback) {
		$.ajax({
			type: 'GET',
			url: ('/ajax/get_alarm_count.cm'),
			dataType: 'json',
			async: true,
			success: function (res) {
				if(res.msg === 'SUCCESS'){
					alarm_count = parseInt(res.count);
				}else{
					alarm_count = 0;
				}
				if(typeof callback === 'function'){
					callback(alarm_count);
				}
			}
		});
	};

	var addBadgeArea = function($obj,tpl){
		var $tmp = {'obj':$obj,'tpl' : tpl};
		alarm_area_list.push($tmp);
	};

	var makeBadge = function(alarm_count){
		if(alarm_count === 0)
			return;
		$.each(alarm_area_list,function(e, $_tmp){
			insertHtml($_tmp.obj,$_tmp.tpl,alarm_count);
		});
	};

	var updateBadge = function(){
		var $badge_cnt = $("._badge_cnt");
		if($badge_cnt.length > 0){
			$badge_cnt.each(function(){
				$(this).remove();
			});
		}
	};

	var insertHtml = function($obj,tpl,count){
		var html = getTemplateConvert(tpl,{'count':count});
		$obj.html(html);
	};
	return {
		'addBadgeArea' : function($obj,tpl){
			addBadgeArea($obj,tpl);
		},
		'runAlarmBadgeSystem' : function(){
			runAlarmBadgeSystem();
		},
		'insertHtml' : function($obj,tpl,count){
			insertHtml($obj,tpl,count);
		},
		'updateBadge' : function(){
			updateBadge();
		}
	}
}();