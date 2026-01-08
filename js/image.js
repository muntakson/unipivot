var IMAGE_RESIZE = function(){
	var code;
	var $img_wrap, $obj, $parent, $text_wrap, $overlay_wrap, $hover_text_wrap, $hover_overlay_wrap;
	var gh, r, img_ratio,h, pw, w, o, fix_height, fix_ratio;
	var data;
	var resize_timer = {};
	var log_mode = false;

	var init = function(c, d){
		data = d;
    
		// console.log('data', data);
    // 이미지 자체의 가로값
		w = parseFloat(data.img_width);
		logging('이미지넓이 w', w);
    // 이미지 자체의 세로값
		h = parseFloat(data.img_height);
		logging('이미지높이 h', h);
    // 이미지 자체의 비율
		r = parseFloat(data.img_ratio);
		logging('이미지비율 r', r);
    // 이미지 고정 높이값, null인 경우, 이미지 비율에 따라 해당 길이 조정
		gh = parseFloat(data.grid_height);
		logging('그리드 높이 gh', gh);
		o = data.org_size;
		fix_height = data.fix_height;
		fix_ratio = data.fix_ratio;
		code = c;
		$img_wrap = $('#'+code+' ._image_wrap');
		$obj = $img_wrap.find("#img_" + code);
		$parent = $obj.parent('._img_box');
		$text_wrap = $obj.siblings('._txt_wrap');
		$hover_text_wrap = $obj.siblings('._hover_txt_wrap');
		$overlay_wrap = $obj.siblings('._overlay');
		$hover_overlay_wrap = $obj.siblings('._hover_overlay');
		img_ratio = Math.round((h * 100) / w) / 100;
		var windowWidth = $(window).width();

		$(window).off('resize.'+code)
			.on('resize.'+code,function(){
				if ($(window).width() != windowWidth) {
					windowWidth = $(window).width();
				}else{
					return;
				}
				run();
			});
		$img_wrap.imagesLoaded()
			.always(function(){
				run();
			});
	};

	var logging = function(type,value){
		if(!log_mode)
			return;
		//$obj.attr('log-'+type, value);
		console.log('log-'+type, value)
	};

	var run = function(){
		setTimeout(function(){
			$parent = $obj.parent('._img_box');
			pw = $parent.width();

			logging('pw', pw);

			if(typeof o == 'undefined'){
				o = false;
			}

			if(o == 'Y'){
				runOrgImageResize();
			}else{
				runFitImageResize();
			}
		}, 50);
	};
	var runOrgImageResize = function(){
		if($obj.length == 0)
			return;
		logging('type', 'org');
		//console.log('원본 크기인 경우');
		logging('gh1', typeof gh);
		logging('gh2', parseInt(gh));
		if(typeof gh === 'undefined' || gh === 0){
			gh = Math.round(pw * r);
		}
		var fix_ratio = Math.round((gh * 100) / pw) / 100;

		logging('r', r);
		logging('gh', gh);
		logging('img_ratio', img_ratio);
		logging('fix_ratio', fix_ratio);
		if(img_ratio > fix_ratio){
			logging('1', 1);
			//console.log('제한한 비율보다 이미지의 높이가 길쭉한 경우');
			var h_term = 0;
			if(h > gh){
				logging('11', 1);
				//console.log('제한한 높이 보다 이미지의 원본 높이가 높은 경우');
				$obj.css({
					'display' : 'inline-block',
					'width' : 'auto',
					'height' : Math.round(gh),
					'margin' : Math.round(h_term) + 'px auto'
				});

			}else{
				logging('11', 2);
				h_term = Math.round((gh - h) / 2);
				//console.log('제한한 높이 보다 이미지의 원본 높이가 낮은 경우');
				$obj.css({
					'display' : 'inline-block',
					'width' : 'auto',
					'height' : Math.round(h),
					'margin' : h_term + 'px auto'
				});
			}
			$parent.css('height',Math.round($obj.height()+(h_term*2)));
			if($text_wrap.length >0){
				logging('12', 1);
				$text_wrap.css({
					'position' : 'relative',
					'margin' : 'auto',
					'margin-top' : Math.round($obj.height()+h_term) * (-1),
					'margin-bottom' : h_term == 0 ? 'auto' : Math.round(h_term) + 'px',
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
					'top' : '0',
					'left' : '0'
				});

				$text_wrap.find('span.txt_body').css({
					'height' : Math.round($obj.height()),
				});
			}
			if($hover_text_wrap.length >0){
				logging('13', 1);
				$hover_text_wrap.css({
					'position' : 'relative',
					'margin' : 'auto',
					'margin-top' : Math.round($obj.height()+h_term) * (-1),
					'margin-bottom' : h_term == 0 ? 'auto' : Math.round(h_term) + 'px',
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
					'top' : '0',
					'left' : '0'
				});

				$hover_text_wrap.find('span.txt_body').css({
					'height' : Math.round($obj.height()),
				});
			}
			if($overlay_wrap.length >0){
				logging('14', 1);
				$overlay_wrap.css({
					'position' : 'relative',
					'margin' : 'auto',
					'margin-top' : Math.round($obj.height()+h_term) * (-1),
					'margin-bottom' : h_term == 0 ? 'auto' : Math.round(h_term) + 'px',
					'width' : $obj.width() == 0 ? Math.round($obj.height()) : $obj.width(),
					'height' : Math.round($obj.height()),
					'top' : '0',
					'left' : '0'
				});
			}
			if($hover_overlay_wrap.length >0){
				logging('15', 1);
				$hover_overlay_wrap.css({
					'position' : 'relative',
					'margin' : 'auto',
					'margin-top' : Math.round($obj.height()+h_term) * (-1),
					'margin-bottom' : h_term == 0 ? 'auto' : Math.round(h_term) + 'px',
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
					'top' : '0',
					'left' : '0'
				});
			}
			if(!isBlank(data.hover_thumb_url)){
				logging('16', 1);
				$parent.find('._hover_image').remove();
				var $hover_img = $('<div />').addClass('_hover_image hover_img');
				if(data.circle == 'Y'){
					logging('161', 1);
					$hover_img.addClass(' circle');
				}
				$hover_img.css({
					'position' : 'relative',
					'margin' : 'auto',
					'margin-top' : Math.round($obj.height()+h_term) * (-1),
					'margin-bottom' : h_term == 0 ? 'auto' : Math.round(h_term) + 'px',
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
					'background-image' : 'url(' + data.hover_thumb_url + ')',
					'background-size' : 'cover',
					'background-repeat' : 'no-repeat',
					'background-position' : '50% 50%',
					'top' : '0',
					'left' : '0'
				});
				$parent.append($hover_img);
			}
		}else{
			logging('1', 2);
			if(w > pw){
				logging('21', 1);
				var fix_h = pw * img_ratio;
				var h_term = Math.round((gh - fix_h) / 2);
				$obj.css({
					'display' : 'inline-block',
					'width' : pw,
					'height' : 'auto',
					'margin-top' : h_term + 'px',
					'margin-bottom' : h_term + 'px',
					'margin-left' : 'auto',
					'margin-right' : 'auto'
				});

			}else{
				logging('21', 2);
				var w_term = (pw - w) / 2;
				var fix_h = w * img_ratio;
				var h_term = (gh - fix_h) / 2;
				var ma = h_term > 0 ? h_term + 'px ' : 'auto ';
				$obj.css({
					'display' : 'inline-block',
					'width' : w,
					'height' : 'fit-content',
					'margin' : Math.round(ma + w_term) + 'px'
				});
			}
			if($text_wrap.length >0){
				logging('22', 1);
				$text_wrap.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : Math.round($obj.height()/2) * (-1),
					'margin-left' : ($obj.width()/2) * (-1),
					'width' : $obj.width(),
					'height' : Math.round($obj.height())
				});

				$text_wrap.find('span.txt_body').css({
					'height' : Math.round($obj.height())
				});
			}

			if($hover_text_wrap.length >0){
				logging('23', 1);
				$hover_text_wrap.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : Math.round($obj.height()/2) * (-1),
					'margin-left' : ($obj.width()/2) * (-1),
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
				});

				$hover_text_wrap.find('span.txt_body').css({
					'height' : Math.round($obj.height()),
				});
			}
			if($overlay_wrap.length >0){
				logging('24', 1);
				$overlay_wrap.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : Math.round($obj.height()/2) * (-1),
					'margin-left' : ($obj.width()/2) * (-1),
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
				});
			}

			if($hover_overlay_wrap.length >0){
				logging('25', 1);
				$hover_overlay_wrap.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : Math.round($obj.height()/2) * (-1),
					'margin-left' : ($obj.width()/2) * (-1),
					'width' : $obj.width(),
					'height' : Math.round($obj.height()),
				});
			}
			if(!isBlank(data.hover_thumb_url)){
				logging('26', 1);
				$parent.find('._hover_image').remove();
				var $hover_img = $('<div />').addClass('_hover_image hover_img');
				const test = $obj.height();
				const imgHeight = $obj.height() === 0 ? ($obj.width() * data.img_ratio) : $obj.height();
				logging('img_heignt', imgHeight);
				if(data.circle == 'Y'){
					logging('261', 1);
					$hover_img.addClass(' circle');
				}
				$hover_img.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : Math.round(imgHeight/2) * (-1),
					'margin-left' : Math.round($obj.width()/2) * (-1),
					'width' : $obj.width(),
					'height' : Math.round(imgHeight),
					'background-image' : 'url(' + data.hover_thumb_url + ')',
					'background-size' : 'cover',
					'background-repeat' : 'no-repeat',
					'background-position' : '50% 50%'
				});
				$obj.css({ 'height' : Math.round(imgHeight), });
				$parent.append($hover_img);
			}
		}

		if ( $img_wrap.closest('._widget_data').hasClass('wg_animated') ) {
			$obj.css('visibility','inherit');
		} else {
			$obj.css('visibility','visible');
		}

		// console.log('$obj.width()', $obj.width());
		// console.log('$obj.height()', $obj.height());


	};

	var runFitImageResize = function(){
		logging('type', 'fit');
		if($parent.css('position') != 'absolute'){
			if(fix_height == 'Y'){
				logging('type', 'fit height');
				$parent.height(Math.round(gh));
			} else if ( fix_ratio == 'Y' ) {
				logging('type', 'fit ratio');
				const imgHeight = data.img_height;
				const imgWidth = data.img_width;
				const imgRatio = imgHeight / imgWidth;
				$parent.height(Math.round(pw * imgRatio));
			} else {
				$parent.height(Math.round(pw * r));
			}
		}

		if(r != h / w){
			logging('1', 1);
			var ph = $parent.height();
			logging('부모 높이 ph', ph);
			var wr = pw / w;
			logging('pw /w = wr', wr);

			if(wr * h > ph){
				logging('11', 1);
				$obj.css({
					'display' : 'block',
					'width' : '100%',
					'height' : 'auto',
					'margin-top' : Math.round((h * wr - ph) / 2) * (-1),
					'margin-left' : 0
				})
			}else{
				logging('11', 2);
				var hr = ph / h;
				$obj.css({
					'display' : 'block',
					'width' : 'auto',
					'height' : '100%',
					'margin-top' : 0,
					'margin-left' : -(w * hr - pw) / 2
				})
			}
		}else{
			logging('1', 2);
			$obj.css({
				'display' : 'bock',
				'width' : '100%',
				'height' : '100%',
				'object-fit' : 'cover',
				'margin-top' : 0,
				'margin-left' : 0
			})
		}

		if($text_wrap.length >0){
			$text_wrap.css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%',
				'top' : 0,
				'left' : 0
			});

			$text_wrap.find('span.txt_body').css({
				'height' : Math.round($parent.height()),
			});
		}
		if($hover_text_wrap.length >0){
			$hover_text_wrap.css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%',
				'top' : 0,
				'left' : 0
			});

			$hover_text_wrap.find('span.txt_body').css({
				'height' : Math.round($parent.height()),
			});
		}
		if($overlay_wrap.length >0){
			$overlay_wrap.css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%',
				'top' : 0,
				'left' : 0,
			});
		}

		if($hover_overlay_wrap.length >0){
			$hover_overlay_wrap.css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%',
				'top' : 0,
				'left' : 0
			});
		}

		if(!isBlank(data.hover_thumb_url)){
			$parent.find('._hover_image').remove();
			var $hover_img = $('<div />').addClass('_hover_image hover_img');
			if(data.circle == 'Y')
				$hover_img.addClass(' circle');
			$hover_img.css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%',
				'top' : 0,
				'left' : 0,
				'background-image' : 'url(' + data.hover_thumb_url + ')',
				'background-size' : 'cover',
				'background-repeat' : 'no-repeat',
				'background-position' : '50% 50%'
			});
			$parent.append($hover_img);
		}
		if ( $img_wrap.closest('._widget_data').hasClass('wg_animated') ) {
			$obj.css('visibility','inherit');
		} else {
			$obj.css('visibility','visible');
		}

	};

	return {
		'init' : function(c,data){
			init(c, data);
		}
	}
};