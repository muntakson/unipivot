$(function(){
	if(LIMIT_API_LIST.indexOf('youtube') === -1){
		var $youtube_player_api = $('#youtube_player_api');
		if($youtube_player_api.length === 0){
			$youtube_player_api = $('<script src="https://www.youtube.com/iframe_api" id="youtube_player_api" />');
			var $first_script = $('script').eq(0);
			$first_script.before($youtube_player_api);
		}
	}
});

var SITE_VIDEO = function () {
	var code;
	var data = {};
	var $video;
	var $cover_layer;
	var $is_mo_video;
	var tv;

	var init = function(c,d){
		code = c;
		data = d;
		$video = $('#video_' + code);
		$cover_layer = $video.find('._cover_layer');
		if(data.autoplay == 'Y' && data.video_type == 'vimeo' ){
			play();
		}
	};
	var play = function () {
		$is_mo_video = $('.mobile_section').find('#video_' + code).length;
		var window_width = $(window).width();

		if(typeof data.video_id == 'undefined')
			return;
		if(typeof data.video_type == 'undefined')
			data.video_type = 'youtube';
		if(data.video_type == '')
			data.video_type = 'youtube';
		if(data.video_id == '')
			return;
		if(data.video_type == 'vimeo'){
			//vimeo
			var options;
			options = {
				'id' : data.video_id,
				'loop' : data.loop == 'Y',
				'title' : data.hide_title != 'Y',
				'muted' : data.mute == 'Y',
				'controls': data.hide_controls != 'Y',
				'autoplay' : true,
				'transparent' : false,
				'autopause' : false,
			};
			if(window_width > 991 && $is_mo_video){
				options.autoplay = false;
				options.autopause = true;
			}
			tv = new Vimeo.Player('img_box_' + code, options);
			tv.on('loaded', function(){
				$('#img_box_' + code).find('iframe').css({width: '100%', height: '100%', margin: '0'});
				$('#img_' + code).remove();
			});
		}else{
			//youtube
			var options = {
				'loop' : data.loop=='Y'?1:0,
				'rel': 0,
				'playlist' : data.video_id,
				'showinfo' : data.hide_title=='Y'?0:1,
				'controls' : data.hide_controls=='Y'?0:'',
				'mute' : data.mute=='Y'?1:0,
				'autoplay' : 1
			};

			tv = new YT.Player('img_' + code, {playerVars: options, events: {'onReady': onPlayerReady}});
			$('#img_' + code).css({width: '100%', height: '100%', margin: '0'});
		}
		// $cover_layer가 남아있을 경우 화면 resize 시에 다시 block 되는 문제 있어 재생 시에 제거
		// (autoplay는 cover_layer를 기준으로 resize하여 자동재생하므로 video/index.sub에서 따로 처리
    if(data.autoplay !== 'Y')
			$cover_layer.remove();

	};

	var onPlayerReady = function(event){
		tv.loadVideoById(data.video_id);
		tv.loadPlaylist(data.video_id);
		tv.setLoop(data.loop === 'Y');
		event.target.playVideo();
	};

	return {
		'play': function () {
			play();
		},
		'init': function (c, d) {
			init(c, d);
		}
	}
};