var console = window.console || {'log':function(){}};
//nformatter ////////////////////////////////////////////////////////////////////////////

function log(){
	var console = window.console;
	if (console && console.log) {
		return console.log.apply(console, arguments);
	}
}

//엔터키 체크
function checkEnter(e){
	let checkEnter_k = false;
	if(e.key === 13 || e.key === 'Enter'){
    e.preventDefault();
    checkEnter_k = true;
  }
	else {
    checkEnter_k = false;
  }
	return checkEnter_k;
}

//파일 사이즈를 이쁘게 변환해서 리턴
function GetFileSize(size){
	if(size >= 1024 * 1024 * 1024)
		return Math.round((((size / 1024) / 1024) / 1024)) + " Gb";
	else if(size >= 1024 * 1024)
		return Math.round(((size / 1024) / 1024)) + " Mb";
	else if(size >= 1024)
		return Math.round((size / 1024)) + " Kb";
	else
		return Math.round(size) + " Byte";
}

function isJQueryVisible(elem) {
  if (!elem) return false;
  if (!elem.ownerDocument || !elem.ownerDocument.documentElement.contains(elem)) return false;
  // input[type="hidden"] 체크
  if (elem instanceof HTMLInputElement && elem.type === "hidden") return false;
  // 조상 중 display: none 체크
  let current = elem;
  while (current) {
    const style = window.getComputedStyle(current);
    if (style.display === 'none') return false;
    current = current.parentElement;
  }
  // width/height 0 체크 (명시적으로 0인 경우만)
  const rect = elem.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  // visibility: hidden, opacity: 0은 무시 (jQuery 1.x에서는 visible로 간주)
  return true;
}


/**
 * 숫자 포맷
 * 숫자가 1000이 넘어가는 경우 digits는 아래 방식을 따릅니다.
 * 소숫점을 사용하지 않는 케이스가 생긴다면 변수를 추가해주세요.
 * digits 처리 예시: 1.1k~9.9k, 10k~999k, 1m, 1.1m~9.9m, 10m~999m...
 * @param {*} num
 * @param Boolean upper 포맷 대문자 여부, 기본값 false인 경우 소문자, true인 경우 대문자
 * @param Number limit 포맷 체크 여부, 기본값 3인 경우 1e3 단위인 k까지만 적용함
 * @param Boolean round 반올림 여부, 1000 이상일 때 기본값 true인 경우 반올림, false인 경우 내림
 * @returns
 */
function nFormatter(num, upper = false, limit = 3, round = true) {
  if(num < 1000) return num;
  const token = ["k", "m", "b", "t"];
  let lookup = [{value: 1, symbol: ""}];
  for(let i = 3; i <= limit && i/3 <= token.length; i += 3){
    let symbol = token[(i/3) - 1];
    if(upper) symbol = symbol.toUpperCase();
    lookup.push({value: Number(`1e${i}`), symbol});
  }
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let item = lookup.slice().reverse().find(function(item) {
	  return num >= item.value;
	});
  if(!item) return "0";
  const fixedNum = (num / item.value);
  if(fixedNum >= 10){
    if(round){
      return (num / item.value).toFixed(0).replace(rx, "$1") + item.symbol;
    }else{
      return Math.floor(num / item.value).toFixed(0).replace(rx, "$1") + item.symbol;
    }
  }else{
    if(round){
      return (num / item.value).toFixed(1) + item.symbol;
    }else{
      return Math.floor(num / item.value * 10) / 10 + item.symbol;
    }
  }
}

//쿠키 생성
function setCookie(name, value, expiredays){
	if(expiredays == 0){
		document.cookie = name + "=" + encodeURIComponent(value) + "; path=/;";
	}else{
		var todayDate = new Date();
		todayDate.setDate(todayDate.getDate() + expiredays );
		document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
	}
}

//쿠키 읽기
function getCookie(name){
	var nameOfCookie = name + "=";
	var x = 0;
	while(x <= document.cookie.length){
		var y = (x + nameOfCookie.length);
		if(document.cookie.substring(x, y) == nameOfCookie){
			if((endOfCookie = document.cookie.indexOf(";", y)) == -1)
				endOfCookie = document.cookie.length;
			return decodeURIComponent(document.cookie.substring(y, endOfCookie));
		}
		x = document.cookie.indexOf(" ", x) + 1;
		if(x == 0)
			break;
	}
	return "";
}

/** 쿠키 제거 */
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

//makeUniq
function makeUniq(prefix){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 10;
	var random_string = '';
	for(var x = 0; x < string_length; x++){
		var letterOrNumber = Math.floor(Math.random() * 2);
		if(letterOrNumber == 0){
			var newNum = Math.floor(Math.random() * 9);
			random_string += newNum;
		}else{
			var r_num = Math.floor(Math.random() * chars.length);
			random_string += chars.substring(r_num, r_num + 1);
		}
	}
	if(typeof prefix == 'undefined')
		return random_string;
	else
		return prefix + random_string;
}

//cancelPropagation 중첩된 요소에서 하위에서 상위 중첩으로 가는 이벤트 전파를 중지
function cancelPropagation(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}

//isEnter
function isEnter(e){
	return e.keyCode == 13;
}

//isEsc
function isEsc(e){
	return e.keyCode == 27;
}

//base64Encode
function base64Encode(str){
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	while (i < str.length) {
		chr1 = str.charCodeAt(i++);
		chr2 = str.charCodeAt(i++);
		chr3 = str.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
	}
	return output;
}

//base64Decode
function base64Decode(str){
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	str = str.replace(/[^A-Za-z0-9+/=]/g, "");

	while (i < str.length){
		enc1 = keyStr.indexOf(str.charAt(i++));
		enc2 = keyStr.indexOf(str.charAt(i++));
		enc3 = keyStr.indexOf(str.charAt(i++));
		enc4 = keyStr.indexOf(str.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}
	}
	return output;
}

//getByteLength 문자열 바이트로 변환
function getByteLength(s,b,i,c){
	for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
	return b;
}

// getByteLength는 한글을 3바이트로 계산되어서 한글을 2바이트로 계산하기위한 대체함수
function getByteLengthForKorean(str) {
	var byte = 0;
	for (var i=0; i<str.length; ++i) {
		// 기본 한글 2바이트 처리
		(str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
	}
	return byte;
}


//바이트 단위로 문자열 자르기
function cutByLen(str, maxByte) {
	for(b = i = 0; c = str.charCodeAt(i);){
		b += c >> 11 ? 2 : c >> 7 ? 2 : 1;
		if(b > maxByte)
			break;
		i++;
	}
	return str.substring(0,i);
}

/**
 * 문자열 전체 바꾸기
 * @param str 대상 문자열
 * @param searchStr 찾을 문자열
 * @param replaceStr 변경할 문자열
 * @returns {*}
 */
function replaceAll(str, searchStr, replaceStr){
	return str.split(searchStr).join(replaceStr);
}

/**
 * getScrollPositionBottom 스크롤의 위치가 마지막인지 체크
 * @param content
 * @param wrap
 * @param call
 */
function getScrollPositionBottom(content, wrap, call){
	content = content || $(document);
	wrap = wrap || $(window);
	wrap.off('scroll.bottomscrolling').on('scroll.bottomscrolling', function(){
		var is_bottom = false;
		var scroll_bottom = (content.outerHeight() - $(this).outerHeight());
		var scroll_top = $(this).scrollTop();

		if(Math.ceil(scroll_top) >= Math.ceil(scroll_bottom)){
			is_bottom = true;
		}
		call(is_bottom);
	});
}

//getTemplateConvert
function getTemplateConvert(tpl, o){
	switch(typeof o){
		case 'object' :
			for(var key in o){
				if(o.hasOwnProperty(key)){
					var reg = new RegExp('{' + key + '}', 'g');
					tpl = tpl.replace(reg, o[key]);
				}
			}
			break;
		case 'string' :
			tpl = tpl.replace(/{.*?}/, o);
			break;
	}
	return tpl;
}

//array_intersect
function array_intersect(arr1){
	//  discuss at: http://phpjs.org/functions/array_intersect/
	// original by: Brett Zamir (http://brett-zamir.me)
	//        note: These only output associative arrays (would need to be
	//        note: all numeric and counting from zero to be numeric)
	//   example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
	//   example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
	//   example 1: $array3 = ['green', 'red'];
	//   example 1: $result = array_intersect($array1, $array2, $array3);
	//   returns 1: {0: 'red', a: 'green'}

	var retArr = {},
		argl = arguments.length,
		arglm1 = argl - 1,
		k1 = '',
		arr = {},
		i = 0,
		k = '';

	arr1keys: for(k1 in arr1){
		arrs: for(i = 1; i < argl; i++){
			arr = arguments[i];
			for(k in arr){
				if(arr[k] === arr1[k1]){
					if(i === arglm1){
						retArr[k1] = arr1[k1];
					}
					// If the innermost loop always leads at least once to an equal value, continue the loop until done
					continue arrs;
				}
			}
			// If it reaches here, it wasn't found in at least one array, so try next value
			continue arr1keys;
		}
	}

	return retArr;
}

//deleteArrayValue
function deleteArrayValue(arr, value){
	if(typeof arr != 'object')
		return arr;

	var delete_key = -1;
	$.each(arr, function(k, v){
		if(v === value){
			delete_key = k;
			return false;
		}
	});
	if(delete_key !== -1){
		arr.splice(delete_key, 1);
		return arr;
	}else
		return arr;
}

//isBlank
function isBlank(str){
	if(typeof str === 'undefined'){
		return true;
	}
	if(str === null){
		return true;
	}
	if(str === ''){
		return true;
	}
	if(str.length === 0){
		return true;
	}
	if(str === 'null'){
		return true;
	}
	return false;
}

//RemoveTag 태그제거 (태그 관련된 문자를 엔티티코드로 변환)
function RemoveTag(s){
	var tmp = '';
	tmp = s || ''; // 가끔 s가 undefined 일 때가 있어서 공백으로 대체할 수 있으면 대체.
	tmp += ''; // 숫자인 경우 문자열로 만들어주기
	tmp = tmp.replace(/&/gi,"&amp;");
	tmp = tmp.replace(/</gi,"&lt;");
	tmp = tmp.replace(/>/gi,"&gt;");
	tmp = tmp.replace(/\"/gi,"&quot;");
	return tmp;
}

//removeHtmlTag 태그를 삭제처리.
function removeHtmlTag(s){
	s = s.replace(/<br\/>/ig, "\n");

	// h1~h6 숫자 추가, attribute - 추가
	s = s.replace(/<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z1-6-]*=[^>]*)?(\s)*(\/)?>/ig, "");
	return s;
}

//escape_javascript 자바스크립트 이스케이프 처리
function escape_javascript(s){
	if (s=='') return '';
	s = s.replace(/\n/gi,"\\n");
	s = s.replace(/\r/gi,"\\r");
	s = s.replace(/\'/gi,"\\'");
	s = s.replace(/\"/gi,"\\\"");
	return s;
}
//HTML entity가 그대로 출력되는 경우 decode 작업을 할 수 있음
function decodeHTMLEntities(str) {
  const entities = [
    ['amp', '&'],
    ['apos', '\''],
    ['#x27', '\''],
    ['#x2F', '/'],
    ['#39', '\''],
    ['#47', '/'],
    ['lt', '<'],
    ['gt', '>'],
    ['nbsp', ' '],
    ['quot', '"'],
    ['#039', "'"],
    ['lsquo', '‘'],
    ['rsquo', '’'],
    ['ldquo', '“'],
    ['rdquo', '”'],
  ];
  for (let v of entities)
    str = str.replace(new RegExp('&'+v[0] +';', 'g'), v[1]);
  return str
}

//getYoutubeThumbnail
function getYoutubeThumbnail(id){

	var thumbnail = '';
	$.ajax({
		type: 'POST',
		data: {'id':id},
		url: '/ajax/get_youtube_thumbnail.cm',
		dataType: 'json',
		async: false,
		cache: false,
		success: function (res) {
			thumbnail = res.thumbnail;
		}
	});

	// var thumbnail = [];
	// thumbnail['mqdefault'] = "https://img.youtube.com/vi/"+id+"/mqdefault.jpg"; // Medium Quality Thumbnail
	// thumbnail['hqdefault'] = "https://img.youtube.com/vi/"+id+"/hqdefault.jpg"; // High Quality Thumbnail
	// thumbnail['sddefault'] = "https://img.youtube.com/vi/"+id+"/sddefault.jpg"; // Standard Definition Thumbnail
	// thumbnail['maxresdefault'] = "https://img.youtube.com/vi/"+id+"/maxresdefault.jpg"; // Maximum Resolution Thumbnail
	// var max_thumbnail = '';
	// max_thumbnail = "https://img.youtube.com/vi/"+id+"/sddefault.jpg";

	return thumbnail;
}

//getVimeoThumbnail
function getVimeoThumbnail(src,callback){
	var vidStr = src.indexOf("video/");
	var vid = src.slice(vidStr+6);
	var url = "https://vimeo.com/api/v2/video/"+vid+".json";
	var thumb = "";

	$.getJSON(url, function( data) {
		thumb = data[0]['thumbnail_large'];
		callback(src,thumb);
	});
}

function getVimeoThumbnailById(id,callback){
	var url = "https://vimeo.com/api/v2/video/"+id+".json";
	var thumb = "";

	$.getJSON(url, function(data) {
		thumb = data[0]['thumbnail_large'];
		callback(id,thumb);
	});
}

/**
 * 화폐 문자열로 변환
 * @param number
 * @param decimals
 * @param decPoint
 * @param thousandsSep
 * @returns {*|string}
 * @url http://locutus.io/php/strings/number_format/
 */
function money_format (number, decimals, decPoint, thousandsSep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number;
	var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
	var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
	var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
	var s = '';

	var toFixedFix = function (n, prec) {
		var k = Math.pow(10, prec);
		return '' + (Math.round(n * k) / k)
			.toFixed(prec)
	};

	// @todo: for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}

	return s.join(dec)
}

function kr_callnum_validate_chk(num){
	var result = '';
	var success_str = 'pass';
	try {
		var _num_length = [];
		var v = num.replace(/[^0-9]/g, "");

		// 0으로 시작하는 경우에만 체크
		if ( /^0/.exec(v) ) {
			var phoneRegEx = /^[0-9]$/;

			// 1. 휴대전화 체크
			if ( /^01/.exec(v) ) {
				_num_length = [11];
				if ( v.charAt(2) != '0' ) _num_length.push(10);

				if ( !phoneRegEx.test(v.charAt(3)) ) 			throw (new Error('phone1-1'));
				else if (_num_length.indexOf(v.length) == -1 ) 	throw (new Error('phone1-2'));
				throw (new Error(success_str));
			}

			// 2. 집전화번호 형식 체크
			var telRegEx = /^[2-9]$/;
			if ( /^02/.exec(v) ) {			// 서울
				if ( !telRegEx.test(v.charAt(2)) ) 			throw (new Error('tel1-1'));
				if ([9,10].indexOf(v.length) == -1 ) 		throw (new Error('tel1-2'));
				throw (new Error(success_str));
			}
			if ( /^0[3-9][1-9]/.exec(v) ) {	// 서울이외
				// telRegEx = /^[3-9]$/;
				// if ( !telRegEx.test(v.charAt(3)) ) 			throw (new Error('tel2-2'));
				if ([10,11].indexOf(v.length) == -1 ) 	throw (new Error('tel2-3'));
				throw (new Error(success_str));
			}

			// 3. 인터넷전화 형식 체크
			if ( /^0[3578]0/.exec(v) ) {
				_num_length = [11];
				if ( v.charAt(1) == '5' ) _num_length.push(12);

				if ( !phoneRegEx.test(v.charAt(3)) ) throw (new Error('phone2-1'));
				else if (_num_length.indexOf(v.length) == -1 ) throw (new Error('phone2-2'));
				throw (new Error(success_str));
			}
		}

		throw (new Error(success_str));
	} catch ( exception ) {
		result = exception.message;
	}

	return (result === success_str);
}

//현재 상황을 알수있는 토스트 표시
function toastrShow(){
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-center",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	toastr.info('로드 중입니다...');
}

function windowOpen(win, url, width, height, scroll, method, left, top) {
	// 모바일 팝업 차단 안내
	const handleBlockedPopupForMobile = function () {
		const userAgent = window.navigator.userAgent;
		const isMobeile = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i].some(keyword => userAgent.match(keyword));
		if (!isMobeile) { return }

		const isiOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
		const isSafari = /AppleWebKit\/.+Version\/\S+\sMobile\/\S+\sSafari\/\S+$/.test(userAgent);
		const isChromeiOS = /CriOS/i.test(userAgent) && !/edge|edg|opr/i.test(userAgent);
		const isFirefoxiOS = /FxiOS/i.test(userAgent);
		const isEdgeiOS = /edgiOS/i.test(userAgent);

		let browserName = '브라우저 ';

		if (isSafari) {
			browserName = '사파리 ';
		} else if (isChromeiOS) {
			browserName = '크롬 ';
		} else if (isFirefoxiOS) {
			browserName = '파이어폭스 ';
		} else if (isEdgeiOS) {
			browserName = '엣지 ';
		}

		let alertMessage = browserName + '팝업 차단을 해제하고 다시 시도해 주세요';

		if (isiOS && isSafari) {
			alertMessage += '\n아이폰 설정 > Safari > 일반 > 팝업 차단 토글 해제';
		}

		window.alert(alertMessage)
	}

	let features = 'toolbar=no, channelmode=no, location=no, directories=no, menubar=no, scrollbars=' + scroll + ', resizable=yes, status=yes, width=' + width + ', height=' + height;
	if (method == "post") { features += ', left=' + left + ', top=' + top; }

	let newWin = method == "post" ?
		window.open('', win, features) :
		window.open(url, win, features);
	if (!newWin) { return handleBlockedPopupForMobile() }

	if(method == "post") {
		var urlInfo = parseUri(url);
		var $form = $("<form />");

		$form.attr("method","post");
		$form.attr("action", urlInfo.protocol+"://"+urlInfo.authority+urlInfo.path);
		$form.attr("target", win);

		for ( var i in urlInfo.queryKey ) {
			var $input = $("<input />");
			$input.attr("type", "hidden");
			$input.attr("name", i);
			$input.attr("value", urlInfo.queryKey[i]);
			$form.append($input);
		}
		var $body = $('body');

		$body.append($form);
		$form.submit();
	}
}

//setHeightCardType
function setHeightCardType($obj){
	var height = 450;
	var $card = $obj.find('._card');
	$card.each(function(){
		var $_obj = $(this);

		var $_card_summary = $_obj.find('._card_summary');
		var $_card_head = $_obj.find('._card_head');
		var $_card_body = $_obj.find('._card_body');
		var $_card_foot = $_obj.find('._card_foot');
		var head_height = $_card_head.height();
		var summary_height = $_card_summary.height();
		if($_card_foot.length > 0)
			var foot_height = $_card_foot.height();
		else
			var foot_height = 0;
		$_card_body.height(Math.round(height- head_height-summary_height-foot_height));
	});
}

// android_version
function android_version(){
	var x = navigator.userAgent;
	if(x.match(/Android/)){
		var index = x.indexOf('Android');
		var and_v = eval(x.substr(index+8,1));
		return and_v;
	}else{
		return 0;
	}
}

//ie 11에서 모달 오픈시 스크롤 오류 수정
function ieScrollFix(){
	if(navigator.userAgent.match(/Trident\/7\./)){
		$('body').on("mousewheel.iescroll", function(){
			if($('body').hasClass('modal-open'))
				return;
			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
			var wheelDelta = event.wheelDelta;
			var currentScrollPosition = window.pageYOffset;
			window.scrollTo(0, currentScrollPosition - wheelDelta);
		});

		$('body').on('keydown.iescroll', function(e){
			if($('body').hasClass('modal-open'))
				return;
			switch(e.which){
				case 38: // up
					if(e.target.tagName == 'BODY' || e.target.tagName == 'INPUT'){
						e.preventDefault(); // prevent the default action (scroll / move caret)
						var currentScrollPosition = window.pageYOffset;
						window.scrollTo(0, currentScrollPosition - 120);
					}
					break;
				case 40: // down
					if(e.target.tagName == 'BODY' || e.target.tagName == 'INPUT'){
						e.preventDefault(); // prevent the default action (scroll / move caret)
						var currentScrollPosition = window.pageYOffset;
						window.scrollTo(0, currentScrollPosition + 120);
					}
					break;
				default:
					return; // exit this handler for other keys
			}
		});
	}
}

//환율 가져오기
function getCurrencyExchangeRate(from_currency, target_currency, complete_handler, site_code, unit_code){
	$.ajax({
		type: 'POST',
		url: ('/ajax/get_currency_exchange_rate.cm'),
		dataType: 'json',
		data : {'site_code':site_code, 'unit_code':unit_code, 'from_currency':from_currency,'target_currency':target_currency},
		success: function(res){
			if (res.msg=='SUCCESS'){
				if (complete_handler!="undefined") complete_handler(res);
			}else{
				complete_handler({'rate':1,'user_rate':1});
			}

		}
	});
}

/**
 * min (포함) 과 max (불포함) 사이의 임의 정수를 반환
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * min (포함) 과 max (포함) 사이의 임의 정수를 반환
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
}
parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

/**
 * 특정 jquery input 객체를 localize 화함 - 다국어 포함
 * @param o
 */
function set_money_format(o, decimal_count, decimal_char, thousand_char){
	// 이미 적용되어있는 format 이벤트 제거 후 재적용
	o.unbind('keydown.format keyup.format keyup.format');

	if (typeof decimal_count == "undefined")  decimal_count=LOCALIZE.getCurrencyDecimalCount();
	if (typeof decimal_char == "undefined")  decimal_char=LOCALIZE.getCurrencyDecimalChar();
	if (typeof thousand_char == "undefined")  thousand_char=LOCALIZE.getCurrencyThousandChar();
	o.number(true, decimal_count, decimal_char, thousand_char);
}

/**
 * @param localize_code
 * @param parameter
 * @param default_string
 * @returns {string}
 */
function getLocalizeString(localize_code, parameter, default_string){
	var split_string = localize_code.split("_");
	var str = '';

	if(typeof LOCALIZE === 'undefined' && typeof LOCALIZE_ADMIN === 'undefined'){
	}else{
		if( typeof LOCALIZE_ADMIN !== 'undefined' ){
			if(typeof LOCALIZE_ADMIN[localize_code] === "function"){
				str = LOCALIZE_ADMIN[localize_code](parameter);
			}
		} else if (typeof LOCALIZE !== 'undefined') {
			if(typeof LOCALIZE[localize_code] === "function"){
				str = LOCALIZE[localize_code](parameter);
			}
		}
	}

	if(str === ''){
		str = default_string;
		if(parameter !== ''){
			if(typeof parameter === 'object' && parameter.length > 0){
				for(var i = 1; i <= parameter.length; i++){
					str = replaceAll(str, '%' + i, parameter[i - 1]);		// 반각 퍼센트
					str = replaceAll(str, '％' + i, parameter[i - 1]);		// 전각 퍼센트(한자권 언어)
				}
			}else{
				str = replaceAll(str, '%1', parameter);		// 반각 퍼센트
				str = replaceAll(str, '％1', parameter);		// 전각 퍼센트(한자권 언어)
			}
		}
	}

	return str;
}

/**
 * URL에서 특정 param만 변경
 * @param name
 * @param value
 * @returns {boolean}		변경 성공 시 true, 실패 시 false(history API 사용 불가 등)
 */
function setParameterByName(name, value) {
	if(checkUseHistory()){
		var tempArray = location.search.split('?');
		var newAdditionalURL = '';
		var baseURL = tempArray[0];
		var additionalURL = tempArray[1];
		var temp = "";
		if(additionalURL){
			var tempAnchor = additionalURL.split('#');
			if(tempAnchor[1]){
				additionalURL = tempAnchor[0];
			}
			tempArray = additionalURL.split('&');
			for(var i = 0; i < tempArray.length; i++){
				if(tempArray[i].split('=')[0] !== name){
					newAdditionalURL += temp + tempArray[i];
					temp = '&';
				}
			}
		}else{
			var tempAnchor = baseURL.split('#');
			if(tempAnchor[0]){
				baseURL = tempAnchor[0];
			}
		}
		if(tempAnchor[1]){
			value += '#' + tempAnchor[1];
		}
		history.replaceState(null, null, baseURL + '?' + newAdditionalURL + temp + name + '=' + value);
		return true;
	}else{
		return false;
	}
}

/**
 * 부 배열을 합쳐서 새로운 오브젝트 형식을 만듦
 */
function arrayToObject(key_array, value_array) {
  let obj = {};

  if (key_array.length !== value_array.length) {
    alert('key_array와 value_array의 길이가 다릅니다.');
    return false;
  }

  for(let i = 0; i < key_array.length; i++) {
    obj[key_array[i]] = value_array[i];
  }

  return obj;
}
//////////////////////////////////////////////////////////////////////////////

//serializeObject
$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if(typeof o[this.name] != 'undefined'){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}else{
			o[this.name] = this.value || '';
		}
	});
	return o;
};

(function() {
	var patterns = {
		validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
		key:      /[a-z0-9_]+|(?=\[\])/gi,
		push:     /^$/,
		fixed:    /^\d+$/,
		named:    /^[a-z0-9_]+$/i
	};

	function FormSerializer(helper, $form) {

		// private variables
		var data     = {},
			pushes   = {};

		// private API
		function build(base, key, value) {
			base[key] = value;
			return base;
		}

		function makeObject(root, value) {

			var keys = root.match(patterns.key), k;

			// nest, nest, ..., nest
			while ((k = keys.pop()) !== undefined) {
				// foo[]
				if (patterns.push.test(k)) {
					var idx = incrementPush(root.replace(/\[\]$/, ''));
					value = build([], idx, value);
				}

				// foo[n]
				else if (patterns.fixed.test(k)) {
					value = build([], k, value);
				}

				// foo; foo[bar]
				else if (patterns.named.test(k)) {
					value = build({}, k, value);
				}
			}

			return value;
		}

		function incrementPush(key) {
			if (pushes[key] === undefined) {
				pushes[key] = 0;
			}
			return pushes[key]++;
		}

		function encode(pair) {
			switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
				case "checkbox":
					return pair.value === "on" ? true : pair.value;
				default:
					return pair.value;
			}
		}

		function addPair(pair) {
			if (!patterns.validate.test(pair.name)) return this;
			var obj = makeObject(pair.name, encode(pair));
			data = helper.extend(true, data, obj);
			return this;
		}

		function addPairs(pairs) {
			if (!helper.isArray(pairs)) {
				throw new Error("formSerializer.addPairs expects an Array");
			}
			for (var i=0, len=pairs.length; i<len; i++) {
				this.addPair(pairs[i]);
			}
			return this;
		}

		function serialize() {
			return data;
		}

		function serializeJSON() {
			return JSON.stringify(serialize());
		}

		// public API
		this.addPair = addPair;
		this.addPairs = addPairs;
		this.serialize = serialize;
		this.serializeJSON = serializeJSON;
	}

	FormSerializer.patterns = patterns;

	FormSerializer.serializeObject = function serializeObject() {
		return new FormSerializer($, this).
		addPairs(this.serializeArray()).
		serialize();
	};

	FormSerializer.serializeJSON = function serializeJSON() {
		return new FormSerializer($, this).
		addPairs(this.serializeArray()).
		serializeJSON();
	};

	if (typeof $.fn !== "undefined") {
		$.fn.serializeObject2 = FormSerializer.serializeObject;
		$.fn.serializeJSON   = FormSerializer.serializeJSON;
	}
})();

//limitLength
$.fn.limitLength = function(option, add_event){
	option = option || {};
	add_event = add_event || false;
	var default_option = {
		max_byte : 3000,
		max_count_obj : '',
		count_count_obj : ''
	};

	var option = $.extend(default_option, option);
	var $input = this;

	// update 함수는 keyup, paste, input 이벤트에서 호출한다.
	var update = function(){
		var str_len = $input.val().length;
		var cbyte = 0;
		var li_len = 0;
		for(i = 0; i < str_len; i++){
			var ls_one_char = $input.val().charAt(i);
			if(encodeURI(ls_one_char).length > 4){
				cbyte += 2; //한글이면 2를 더한다
			}else{
				cbyte++; //한글아니면 1을 다한다
			}
			if(cbyte <= option.max_byte){
				li_len = i + 1;
			}
		}
		// 사용자가 입력한 값이 제한 값을 초과하는지를 검사한다.
		if(parseInt(cbyte) > parseInt(option.max_byte)){
			var str2 = $input.val().substr(0, li_len);
			$input.val(str2);
			var cbyte = 0;
			for(i = 0; i < $input.val().length; i++){
				var ls_one_char = $input.val().charAt(i);
				if(encodeURI(ls_one_char).length > 4){
					cbyte += 2; //한글이면 2를 더한다
				}else{
					cbyte++; //한글아니면 1을 다한다
				}
			}
		}
		if(option.count_count_obj.length > 0)
			option.count_count_obj.text(cbyte);
	};
	update();

	if(add_event){
		$input.off('input keyup keydown paste change')
			.on('input keyup keydown paste change', function(){
				setTimeout(function(){
					update();
				}, 0);
			});
	}
};

//checkIframeLoaded
$.fn.checkIframeLoaded = function(callback){
	var iframe = this;
	var iframeDoc = iframe[0];
	var doc = iframeDoc.contentDocument || iframeDoc.contentWindow.document;

	if(doc.readyState == 'complete'){
		if(typeof callback == 'function'){
			callback();
		}
		return;
	}
	setTimeout(function(){
		iframe.checkIframeLoaded(callback);
	}, 100);
};

//scrollable
$.fn.scrollable = function(){
	return this.map(function(){
		var elem = this,
			isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;

		if(!isWin){
			return elem;
		}
		var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
		return $.browser.safari || doc.compatMode == 'BackCompat' ?
			doc.body :
			doc.documentElement;
	});
};

/**
 * imageResize
 * @param w 이미지 원래의 가로
 * @param h 이미지 원래의 세로
 * @param r 이미지 원래의 비율
 */
$.fn.imageResize = function(w, h, r, o, gh){
	var $obj = this;

	setTimeout(function(){
		w = parseFloat(w);
		h = parseFloat(h);
		r = parseFloat(r);
		gh = parseFloat(gh);
		var $parent = $obj.parent('._img_box');
		var $text_wrap = $obj.next('._txt_wrap');
		var pw = $parent.width();
		var img_ratio = Math.round((h * 100) / w) / 100;

		if($obj.length == 0)
			return;
		if(typeof o == 'undefined'){
			o = false;
		}

		//$obj.attr('doz_resize','');
		if(o == 'Y'){ //채우기가 아님
			//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|o=y');
			if(typeof gh == 'undefined'){
				gh = pw * r;
			}

			var fix_ratio = Math.round((gh * 100) / pw) / 100;

			if(img_ratio > fix_ratio){ // 화면 보다 이미지의 높이가 크면  이미지 높이를 꽉차게
				//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|img_ratio>fix_ratio');
				if(h > gh){ //
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|h>gh');
					$obj.css({
						'display' : 'inline-block',
						'width' : 'auto',
						'height' : gh,
						'margin' : '0 auto'
					});
				}else{
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|!h>gh');
					var h_term = (gh - h) / 2;
					$obj.css({
						'display' : 'inline-block',
						'width' : 'auto',
						'height' : h,
						'margin' : h_term + 'px auto'
					});
				}
			}else{ //화면 보다 이미지 넓이가 넓으므로 이미지 너비를 꽉차게
				//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|!img_ratio>fix_ratio');
				if(w > pw){
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|w>pw');
					var fix_h = pw * img_ratio;
					var h_term = (gh - fix_h) / 2;
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
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|!w>pw');
					var w_term = (pw - w) / 2;
					var fix_h = w * img_ratio;
					var h_term = (gh - fix_h) / 2;
					var ma = h_term > 0 ? h_term + 'px ' : 'auto ';
					$obj.css({
						'display' : 'inline-block',
						'width' : w,
						'height' : 'auto',
						'margin' : ma + w_term + 'px'
					});
				}
			}
			if($text_wrap.length >0){
				$text_wrap.css({
					position : 'relative',
					margin : 'auto',
					'margin-top' : $obj.height() * (-1),
					width : $obj.width(),
					height : $obj.height()
				});
				$text_wrap.find('span').css({
					height : $obj.height()
				});
			}
		}else{ //채우기
			//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|o=n');
			if($parent.css('position') != 'absolute')
				$parent.height(pw * r);

			if(r != h / w){
				//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|r!=h/w');
				var ph = $parent.height();
				var wr = pw / w;
				if(wr * h > ph){
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|wr*h>ph');
					$obj.css({
						'display' : 'block',
						'width' : '100%',
						'height' : 'auto',
						'margin-top' : -(h * wr - ph) / 2,
						'margin-left' : 0
					})
				}else{
					//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|!wr*h>ph');
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
				//$obj.attr('doz_resize',$obj.attr('doz_resize')+'|!r!=h/w');
				$obj.css({
					'display' : 'block',
					'width' : '100%',
					'margin-top' : 0,
					'margin-left' : 0
				})
			}

			$text_wrap.css({
				width : $obj.width(),
				height: $parent.height(),
				top : $obj.position().top,
				left : $obj.position().left
			});

			$text_wrap.find('span').css({
				height: $parent.height()
			});
		}
	},1);
};

//toggleClassClick
$.fn.toggleClassClick = function(cls){
	$(this).click(function(e){
		$(this).toggleClass(cls);
	});
};

//setUploadImage - 다국어 포함
$.fn.setUploadImage = function(option, callback){
	var default_option = {
		dataType : 'json',
		singleFileUploads : false,
		limitMultiFileUploads : 200,
		formData : {temp : 'N'},
		dropZone : null,
		acceptList : 'image/jpeg, image/jpg, image/png, image/gif, image/svg+xml',
		minWidth : 0,
		minHeight : 0,
		maxWidth : 50000,
		maxHeight : 50000,
		add: function(e, data){
			if(data.originalFiles.length > 0){
				var _minWidth = typeof option.minWidth === 'undefined' ? 0 : option.minWidth;
				var _minHeight = typeof option.minHeight === 'undefined' ? 0 : option.minHeight;
				var _maxWidth = typeof option.maxWidth === 'undefined' ? 0 : option.maxWidth;
				var _maxHeight = typeof option.maxHeight === 'undefined' ? 0 : option.maxHeight;
				var invalid_image = false, min_ck = false, max_ck = false;
				var onload_count = 0;
				var _url = window.URL || window.webkitURL;
				for(var i = 0; i < data.originalFiles.length; i++){
					if(!option.acceptList.includes(data.originalFiles[i]['type'])) {
						alert(getLocalizeString('설명_파일업로드확장제한', option.acceptList,'%1 확장자의 파일만 업로드 가능합니다.'));
						return;
					}
					if(data.originalFiles[i]['size'] > 0){
						var tempImg = new Image();
						tempImg.onload = function(){
							if(this.width < _minWidth || this.height < _minHeight){
								min_ck = true;
							}else if(this.width > _maxWidth || this.height > _maxHeight){
								max_ck = true;
							}
							if(onload_count == data.originalFiles.length - 1){
								if(invalid_image){
									alert(getLocalizeString('설명_이미지등록실패', invalid_image, '%1 이미지 등록에 실패하였습니다.'));
								}else if(min_ck){
									alert(getLocalizeString('설명_최소이미지크기안내', [_minWidth, _minHeight], '%1x%2 이상의 이미지만 업로드 하실 수 있습니다.'));
								}else if(max_ck){
									alert(getLocalizeString('설명_최대이미지크기안내', [_maxWidth, _maxHeight], '%1x%2 이하의 이미지만 업로드 하실 수 있습니다.'));
								}else{
									data.submit();
								}
							}
							_url.revokeObjectURL(this.src);
							onload_count++;
						};
						tempImg.src = _url.createObjectURL(data.originalFiles[i]);		// Blob Url을 사용하여 이미지 크기 체크
					}else{
						invalid_image = data.originalFiles[i].name;
						onload_count++;
					}
				}
			}
		},
		start : function(e, data){
			dozProgress.start();
			// TODO site 에서는 preloader 변수가 아직 없음
			//$preloader.show();
		},
		progress : function(e, data){
			dozProgress.increase(data.loaded);
			// Calculate the completion percentage of the upload
			var progress = parseInt(data.loaded / data.total * 100, 10);
			if(progress == 100){
				//	data.context.removeClass('working');
			}
		},
		done : function(e, data){
			dozProgress.done();
			if(typeof callback != 'undefined' && typeof callback == 'function'){
				callback('success', data.result.files, data.result);
			}else
				return data.result.files;
		},
		fail : function(e, data){
			dozProgress.done();
			if(typeof callback != 'undefined' && typeof callback == 'function'){
				callback('error');
			}else
				return 'error';
		}
	};
	var option = $.extend(default_option, option);
	$(this).attr('accept', option.acceptList);
	$(this).fileupload(option);
};

//setUploadFile - 다국어 포함
$.fn.setUploadFile = function(option, callback){
	var default_option = {
		dataType : 'json',
		singleFileUploads : false,
		limitMultiFileUploads : 200,
		formData : {temp : 'N'},
		dropZone : null,
		add: function(e, data) {
			var max_ck = false;
			for(var i = 0; i < data.originalFiles.length; i++){
				if(data.originalFiles[i]['size'] > 104857600){
					max_ck = true;
				}
			}
			if(max_ck)
				alert(getLocalizeString('설명_최대업로드용량안내_게시판', '', '최대 100MB 까지 업로드 하실 수 있습니다.'));
			else data.submit();
		},
		start : function(e, data){
			dozProgress.start();
		},
		progress : function(e, data){
			dozProgress.increase(data.loaded);
			// Calculate the completion percentage of the upload
			var progress = parseInt(data.loaded / data.total * 100, 10);
			if(progress == 100){
				//	data.context.removeClass('working');
			}
		},
		done : function(e, data){
			dozProgress.done();
			if(typeof callback != 'undefined' && typeof callback == 'function'){
				callback('success', data.result.files, data.result);
			}else
				return data.result.files;
		},
		fail : function(e, data){
			dozProgress.done();
			if(typeof callback != 'undefined' && typeof callback == 'function'){
				callback('error');
			}else
				return 'error';
		}
	};
	var option = $.extend(default_option, option);
	$(this).fileupload(option);
};

//////////////////////////////////////////////////////////////////////////////

//cocoaResizeData
(function(){
	$.cocoaResizeData = {
		data_list : [],
		add : function(o){
			this.data_list.push($(o));
		},
		showData : function(){
			return this.data_list;
		},
		remove : function(i){
			this.data_list.splice(i, 1);
		},
		use_resize : true
	};
})();

//setCheck
(function(){
	/**
	 * o.cls        - css class
	 * o.change     - click event callback function
	 *
	 * @param el
	 * @param o
	 */
	var check = function(el, o){
		this.element = $(el);
		this.label = this.element.find('label');
		if(this.label.length == 0)
			this.label = this.element.find('.label');
		if(this.label.length == 0)
			this.label = this.element;

		this.is_label = this.label.get(0).tagName == 'LABEL';
		this.input = this.element.find('input');
		this.o = o;
		this.init();
	};

	check.prototype.init = function(){
		var that = this;

		if(that.is_label){
			that.input
				.off('change')
				.on('change', function(){
					that.change(that.input.prop("checked"));
				});
		}else{
			that.label
				.off('click')
				.on('click', function(){
					if(that.input.prop("disabled"))
						return false;
					if(that.input.prop("checked"))
						that.input.prop("checked", false);
					else
						that.input.prop("checked", true);
					that.change(that.input.prop("checked"));
				});
		}

		that.input.prop("checked", that.o.value);

		if(typeof that.o.disable != 'undefined' && that.o.disable == true){
			this.disable();
		}else{
			this.enable();
		}
	};

	check.prototype.change = function(bool){
		if(typeof this.o.change == 'function')
			this.o.change(bool);
	};
	check.prototype.get = function(){
		return this.input.prop('checked');
	};
	check.prototype.set = function(res){
		return this.input.prop('checked', res);
	};
	check.prototype.disable = function(){
		this.input.prop("disabled", true);
		this.label.toggleClass('disabled', true);
	};
	check.prototype.enable = function(){
		this.input.prop("disabled", false);
		this.label.toggleClass('disabled', false);
	};
	check.prototype.destroy = function(){
		this.element.data("setCheck", false);
	};

	function PLUGIN(o, v){
		var obj = $(this);
		if(typeof o == 'string'){
			var data = obj.data('setCheck');
			if(!data) obj.data('setCheck', (data = new check(obj, o)));
			return data[o](v);
		}else if(typeof o == 'object'){
			var data = obj.data('setCheck');
			if(typeof data != 'undefined'){
				if(data !== false){
					data.destroy();
				}
			}
			obj.data('setCheck', (data = new check(obj, o)));
		}
		return this;
	}
	$.fn.setCheck = PLUGIN;
})();

//cssSwitch
(function(){
	var cssSwitch = function(el,callback){
		this.$element = $(el);
		this.init();
	};

	cssSwitch.prototype.init = function(){
		var that = this;
	};
	cssSwitch.prototype.change = function(url,callback){
		var link = url+"&"+makeUniq();
		this.$element.attr("href", link);
		var img = document.createElement('img');
		img.onerror = function(){
			if(typeof callback == 'function')
				callback(link);
		};
		img.src = url;
	};
	function PLUGIN(o, v){
		var $obj = $(this);
		if(typeof o == 'string'){
			var data = $obj.data('cssSwitch');
			if(!data) $obj.data('cssSwitch', (data = new cssSwitch($obj)));
			return data.change(o,v);
		}
		return this;
	}
	$.fn.cssSwitch = PLUGIN;
})();

//setImageMapBox
(function(){
	var setImageMapBox = function(el, o){
		this.id = makeUniq();
		this.$element = $(el);
		this.default_option = {
			'window_resize' : false,
			'container'  : $('body'),
			'left' : 0,
			'top' : 0,
			'width' :100,
			'height' : 100,
			'set_width' : 530 //기준 넓이
		};

		if(typeof o == 'undefined')
			o = {};

		this.options = $.extend(this.default_option, o);
		this.$container = o.container;
		this.init();

	};


	setImageMapBox.prototype.init = function(){
		var that = this;
		this.$element.css({'position':'absolute'});
		this.set();
		if(this.options.window_resize){
			$(window).off('resize.'+this.id).on('resize.'+this.id,function(){
				that.set();
			});
		}

	};

	setImageMapBox.prototype.set = function(){
		var container_width = this.$container.width();
		var ratio = container_width/this.options.set_width;
		var top = parseInt(this.options.top) * ratio;
		var left = parseInt(this.options.left) * ratio;
		var width = parseInt(this.options.width) * ratio;
		var height = parseInt(this.options.height) * ratio;
		this.$element.css({
			'top' : top,
			'left' : left,
			'width' : width,
			'height' : height
		});

	};

	setImageMapBox.prototype.destroy = function(){

	};

	function PLUGIN(o){
		var obj = $(this);
		var data = obj.data('setImageMapBox');
		if(typeof o == 'string'){
			if(!data) obj.data('setImageMapBox', (data = new setImageMapBox(obj, o)));
			return data[o]();
		}else if(typeof o == 'object'){
			if(typeof data != 'undefined'){
				if(data !== false){
					data.destroy();
				}
			}
			obj.data('setImageMapBox', (data = new setImageMapBox(obj, o)));
		}
		return this;
	}
	$.fn.setImageMapBox = PLUGIN;
})();

//setSelectBox
(function(){
	/**
	 * o.option             - select list
	 * o.option_layer        - 사용자화 레이어
	 * o['default']            - 기본 selected value
	 * o.change             - select callback function
	 * o.set                - setting option
	 * @param el
	 * @param o
	 */
	var setSelectBox = function(el, o){
		this.default_set = {
			select_custom_cls : '',
			custom_cls : 'design-dropdown',       // 셀렉트박스 가장 위 부모의 클래스
			custom_option_layer : 'N', //옵션 레이어 전체를 사용자화  this.custom_layer 에 jquery 돔 객체를 보냄
			use_custom_value : 'N',                  // Y: 기본 li에 value를 추가함
			left : 0,
			use_insert : 'Y',                        // Y: 선택된 후 value 넣을지 여부
			use_key_press : 'N',
			use_selected : 'Y',
			max_height : 260,
			item_align : 'left'
		};

		this.element = el;
		this.o = o;
		this.option_container = {};
		this.select_wrap = {};
		this.current_select_div = {};
		this.current_select_arrow = {};

		this.o.set = $.extend(this.default_set, this.o.set);
		this.init();
	};

	setSelectBox.prototype.init = function(){
		var that = this;

		if(typeof that.element.data('id') == 'undefined' || that.element.data('id') == '')
			that.element.data('id', makeUniq());
		that.makeDesignSelect();
		that.makeOptionLayer();
		that.set(that.o['default']);
		that.element.data('select', 'Y');

		that.element.off('click').on('click', function(e){
			cancelPropagation(e);
			if(that.element.data('is_show') == 'Y')
				that.close();
			else
				that.show();
		});

		if(typeof that.o.disable != 'undefined' && that.o.disable == true){
			this.disable();
		}else{
			this.enable();
		}
	};

	setSelectBox.prototype.setPosition = function(){
		var that = this;
		var width = that.o.set.width ? that.o.set.width : that.element.outerWidth();
		var offset = that.element.offset();

		var height = that.element.outerHeight();
		var window_height = $(window).height();
		var window_width = $(window).width();
		var window_scroll = $(window).scrollTop();
		var select_offset_t = offset.top - window_scroll; //절대적인 화면상의 좌표
		var select_offset_l = offset.left; //절대적인 화면상의 좌표
		var select_container_h = that.option_container.outerHeight();
		var select_container_w = that.option_container.outerWidth();

		var obj_h = Math.round(select_offset_t + height + select_container_h); //절대적 화면상의 좌표에서 설렉트박스의 높이와 옵션의 높이의 합( 옵션이 열렸을때 옵션의 맨 아래 좌표값)
		var obj_w = Math.round(select_offset_l + width); //절대적 화면상의 좌표에서 설렉트박스의 높이와 옵션의 높이의 합( 옵션이 열렸을때 옵션의 맨 아래 좌표값)

		if(window_height < obj_h){ //윈도우 크기보다 옵션 맨 아래 절대 좌표가 크다는 것은 옵션이 보이지 않는 것이 므로 위로 보이도록 설정
			if(offset.top > 350){
				that.option_container.css('top', select_container_h * (-1) + offset.top);
			}else{
				that.option_container.css('top', offset.top + height);
			}
		}else{
			that.option_container.css('top', offset.top + height);
		}
		if(window_width < obj_w){ //윈도우 크기보다 옵션 맨 아래 절대 좌표가 크다는 것은 옵션이 보이지 않는 것이 므로 위로 보이도록 설정
			if(offset.left > 350){
				var left = offset.left + that.element.outerWidth() - that.o.set.width + that.o.set.left;
			}else{
				var left = offset.left + that.o.set.left
			}
		}else{
			var left = offset.left + that.o.set.left
		}
		that.option_container.css({
			'position' : 'absolute',
			'z-index' : 19000,
			'left' : left,
			'width' : width
		});
		that.element.data('is_show', 'Y');
	};

	setSelectBox.prototype.show = function(){
		var that = this;
		$('._select_option').hide();

		that.setPosition();

		$('#' + that.element.data('id')).show();
		$('body').addClass('_selected_box');
		$('body').data('selectbox', 'Y');

		$(window).off('resize.' + that.element.data('id'));
		$(window).on('resize.' + that.element.data('id'), function(e){
			that.setPosition();
		});
		$(document).off('scroll.' + that.element.data('id'));
		$(document).on('scroll.' + that.element.data('id'), function(e){
			that.setPosition();
		});

		that.element.off('keypress.'+that.element.data('id'));
		that.element.on('keypress.'+that.element.data('id'),function(e){
			if(e.keyCode == 13){
				that.close();
			}
		});

		$(document).off('mousedown.' + that.element.data('id'));
		$(document).on('mousedown.' + that.element.data('id'), function(e){
			cancelPropagation(e);
			e.preventDefault();
			that.close();
		});


	};

	setSelectBox.prototype.close = function(){
		this.element.data('is_show', 'N');
		$('#' + this.element.data('id')).hide();
		$(document).off('scroll.' + this.element.data('id'));
		$(window).off('resize.' + this.element.data('id'));
		$(document).off('click.' + this.element.data('id'));
		$(document).off('mousedown.' + this.element.data('id'));
		this.element.off('keypress.'+this.element.data('id'));
		$('body').removeClass('_selected_box');
		$('body').data('selectbox', 'N');
	};

	setSelectBox.prototype.makeDesignSelect = function(){
		var that = this;
		if(that.element[0].tagName == 'INPUT')
			return;
		if(that.o.set.use_insert == 'N')
			return;
		that.element.empty(false);
		if(that.o.set.select_custom_cls){
			that.select_wrap = $('<div class="div_select '+that.o.set.select_custom_cls+'">');
		}else{
			that.select_wrap = $('<div class="div_select">');
		}
		that.current_select_div = $('<div>');
		that.select_wrap.append(that.current_select_div);
		that.element.append(that.select_wrap);
	};

	setSelectBox.prototype.makeOptionLayer = function(){
		var that = this;
		that.option_container = $('<div/>').addClass(that.o.set.custom_cls + (typeof that.o.set.container_cls !== 'undefined' ? ' ' + that.o.set.container_cls : '')).addClass('_select_option').attr('id', that.element.data('id'));
		var scroll_wrap = $('<div/>').addClass('tse-scrollable');

		var scroll_contents = $('<div/>').addClass('tse-content');

		if(that.o.set.custom_option_layer == 'Y'){
			var option_ul = scroll_contents.append(that.o.option_layer);

		}else{

			var option_ul = $('<ul/>');
			$.each(that.o.option, function(k, v){
				if(v.key === 'doz_divider'){
					var item = $('<li />').addClass('divider');
				}else if(v.key === 'doz_unselected'){
					var item = $('<li class="unselected">' + v.value + '</li>');
				}else{
					if(k == 0 && (typeof that.o['default'] == 'undefined' || that.o['default'] == '')){
						that.o['default'] = v.key;
					}
					var select_class = (v.key == that.o['default'] && that.o.set.use_selected == 'Y') ? 'active' : '';
					var item = $(that.o.set.use_custom_value == 'Y' ? '<li>' + v.value + '</li>' : '<li><span class="txt">' + v.value + '</span></li>');
					if(v.key == that.o['default']){
						that.element.data('data', {key : v.key, value : v.value});
						that.set(v.key);
					}
					if(v.disabled) {
						item.addClass('disabled');
					}

					item.addClass(select_class)
						.data({'key' : v.key, 'value' : v.value})
						.on('mousedown', function(e){
							if($(this).hasClass('disabled')) {
								return false;
							} else {
								that.selected(v.key, v.value);
							}
						});
				}
				option_ul.append(item);
			});
			option_ul = scroll_contents.append(option_ul);

		}

		scroll_wrap.append(option_ul);
		if($('body').children('#' + that.element.data('id')).length == 0){
			that.option_container.append(scroll_wrap);
			$('body').append(that.option_container);
		}

		var width = that.o.set.width ? that.o.set.width : that.element[0].clientWidth;
		var height = option_ul[0].clientHeight;
		height = that.o.set.max_height < height ? that.o.set.max_height : height;
		scroll_wrap[0].style.width = width + 'px';
		scroll_wrap[0].style.height = height + 'px';
    let option = {};
    /**
     * option.autoHide의 기본값 true
     * false 일때 숨겨지지 않고 보여진다.
     * that의 disableAutoHide는 평소에 없기 때문에 항상 true
     */
    option['autoHide'] =
      that.o.eventOriginTarget ?
      that.o.eventOriginTarget[0].dataset.disabledAutoHide !== '' :
      that.element[0].dataset.disabledAutoHide !== '';
    scroll_wrap.TrackpadScrollEmulator(option);

		if(that.o.set.use_key_press == 'Y'){
			that.option_container.append(scroll_wrap);
			$('#' + that.element.data('id')).replaceWith(that.option_container);
			that.show();
		}
	};

	setSelectBox.prototype.append = function(o){
		this.option_container.find('li').removeClass('active');
		var that = this;
		var item = $(that.o.set.use_custom_value == 'Y' ? '<li>' + v.value + '</li>' : '<li><span class="txt">' + v.value + '</span></li>');
		item.data({'key' : o.key, 'value' : o.value})
			.click(function(e){
				that.selected(o.key, o.value);
			});
		this.option_container.find('ul li.doz_divider:last-child').before(item);
		this.set(o.key);
	};

	setSelectBox.prototype.findData = function(key){
		var data;
		var find = false;
		$.each(this.o.option, function(k, v){
			if(v.key == key){
				data = v;
				find = true;
				return false;
			}
		});
		if(find)
			return data;
		else
			return false;
	};


	setSelectBox.prototype.set = function(key){
		var data = this.findData(key);
		if(!data)
			data = this.findData(this.o['default']);

		this.element.data('data', {key : data.key, value : data.value});
		this.option_container.find('li').removeClass('active');

		var item = this.findItem(key);
		if(item !== false){
			if(this.o.set.use_selected == 'Y'){
				item.addClass('active');
			}
		}
		// TODO value -> object 변경
		if(this.o.set.use_insert != 'N'){
			if(this.o.set.use_custom_value == 'Y')
				var value = $(data.value).text();
			else
				var value = data.value;

			try{
				$(value);

				throw 1;
			}catch(e){
				if(e === 1){
					if(this.element[0].tagName == 'INPUT'){
						if($(value).text().length < 1)
							value = value;
						else{
							var reg = /(<([^>]+)>)/;
							if(reg.test(value)){
								value = $(value).text();
							}else{
								value = value;
							}
						}
						this.element.val(value);
					}else
						this.current_select_div.html(value);
				}else{
					if(this.element[0].tagName == 'INPUT'){
						this.element.val(value);
					}else
						this.current_select_div.text(value);
				}

			}
		}

	};

	setSelectBox.prototype.selected = function(key, value){
		this.set(key);
		this.close();
		this.change();
	};

	setSelectBox.prototype.findItem = function(key){
		var o = false;
		this.option_container.find('li').each(function(e){
			if($(this).data('key') == key){
				o = $(this);
				return false;
			}
		});
		return o;
	};

	setSelectBox.prototype.change = function(){
		if(typeof this.o.change == "function"){
			return this.o.change(this.element.data('data'));
		}
	};

	setSelectBox.prototype.modifyValue = function(data){
		var that = this;
		var o = false;
		$.each(that.o.option, function(k, v){
			if(v.key == data.key){
				v.value = data.value;
				return false;
			}
		});
		this.option_container.find('li').each(function(e){
			if($(this).data('key') == data.key){
				o = $(this);
				o.data('value', data.value);
				o.find('.txt').text(data.value);
				o.off('click')
					.on('click', function(e){
						that.selected(data.key, data.value);
					});
				var current_data = that.element.data('data');
				if(current_data.key == data.key){
					that.set(current_data.key);
				}

				return false;
			}
		});
	};

	setSelectBox.prototype.get = function(){
		return this.element.data('data');
	};

	setSelectBox.prototype.remove = function(data){
		this.option_container.find('li').each(function(e){
			if($(this).data('key') == data){
				$(this).remove();
			}
		});
	};


	setSelectBox.prototype.disable = function(){
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
	};
	setSelectBox.prototype.enable = function(){
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
	};

	setSelectBox.prototype.destroy = function(){
		this.element.data('setSelectBox', false);
		this.element.data('select', '');
		$('#' + this.element.data('id')).remove();
		this.element.data('id', '');
		this.element.data('data', '');
	};

	function PLUGIN(o, d){
		var obj = $(this);
		if(typeof o == 'string'){
			var data = obj.data('setSelectBox');
			if(!data) obj.data('setSelectBox', (data = new setSelectBox(obj, o)));
			return data[o](d);
		}else if(typeof o == 'object'){
			var data = obj.data('setSelectBox');
			if(typeof data != 'undefined'){
				if(data !== false){
					data.destroy();
				}
			}
			obj.data('setSelectBox', (data = new setSelectBox(obj, o)));
		}

		return this;
	}
	$.fn.setSelectBox = PLUGIN;
})();

//setInput
(function(){
	/**
	 * o.event      - event 목록
	 * o.default    - default value
	 * o.change     - event callback function
	 *
	 * @param el
	 * @param o
	 */
	var input = function(el, o){
		var default_option = {
			'default' : ''
		};
		this.element = $(el);
		this.o = o;
		this.o = $.extend(default_option, this.o);

		this.trigger_event = ['blur', 'enter'];

		this.disabled = false;

		this.init();
	};

	input.prototype.init = function(){
		var that = this;
		if(typeof that.o['default'] != 'undefined')
			that.element.val(that.o['default']);

		if(typeof this.o.event != 'undefined'){
			this.trigger_event = $.merge(this.o.event,this.trigger_event);
		}


		if($.inArray('no_blur',this.trigger_event) > -1 ){

			this.trigger_event = deleteArrayValue(this.trigger_event,'blur');
			this.trigger_event = deleteArrayValue(this.trigger_event,'no_blur');

		}
		if($.inArray('no_enter',this.trigger_event) > -1 ){

			this.trigger_event = deleteArrayValue(this.trigger_event,'enter');
			this.trigger_event = deleteArrayValue(this.trigger_event,'no_enter');

		}


		$.each(this.trigger_event, function(i, k){
			that[k]();
		});
	};

	input.prototype.blur = function(){
		var that = this;
		this.element.off('blur');
		if(!that.disabled){
			this.element.on('blur', function(e){
				that.change($(this).val());
			});
			if(this.element[0].tagName != 'TEXTAREA'){
				this.element.off('keypress.bl-enter');
				this.element.on('keypress.bl-enter', function(e){
					if(e.keyCode == 13){
						that.element.blur();
					}
				});
			}
		}
	};

	input.prototype.keyup = function(){
		var that = this;
		this.element.off('keyup');
		this.element.on('keyup', function(e){
			that.change($(this).val());
		});
	};

	input.prototype.keydown = function(){
		var that = this;
		this.element.off('keydown');
		this.element.on('keydown', function(e){
			that.change($(this).val());
		});
	};

	input.prototype.keypress = function(){
		var that = this;
		this.element.off('keypress');
		this.element.on('keypress', function(e){
			that.change($(this).val());
		});
	};

	input.prototype.enter = function(){
		var that = this;
		this.element.off('keypress');
		this.element.on('keypress', function(e){
			if(e.keyCode == 13){
				that.change($(this).val());
			}
		});
	};

	input.prototype.change = function(data){
		this.o['default'] = data;
		this.o.change(data);
	};

	input.prototype.get = function(){
		return this.element.val();
	};

	input.prototype.set = function(value){
		return this.element.val(value);
	};


	/** 블러 이벤트 활성 비활성 **/
	input.prototype.setDisable = function(){
		this.disabled = true;
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
	};
	input.prototype.setEnable = function(){
		this.disabled = false;
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
	};

	input.prototype.disable = function(){
		this.disabled = true;
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
	};
	input.prototype.enable = function(){
		this.disabled = false;
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
	};

	input.prototype.destroy = function(){
		this.element.data('setInput',false);
	};

	function PLUGIN(o, d){
		var obj = $(this);
		if(typeof o == 'string'){
			var data = obj.data('setInput');
			if(!data) obj.data('setInput', (data = new input(obj, o)));
			return data[o](d);
		}else if(typeof o == 'object'){
			var data = obj.data('setInput');
			if(typeof data != 'undefined'){
				if(data !== false){
					data.destroy();
				}
			}
			obj.data('setInput', (data = new input(obj, o)));
		}
		return this;
	}

	$.fn.setInput = PLUGIN;

})();

//////////////////////////////////////////////////////////////////////////////

//getCaretPixelPos
var getCaretPixelPos = function($node, offsetx, offsety){
	offsetx = offsetx || 0;
	offsety = offsety || 0;

	var nodeLeft = 0,
		nodeTop = 0;
	if($node){
		nodeLeft = $node.offsetLeft;
		nodeTop = $node.offsetTop;
	}

	var pos = {left : 0, top : 0};

	if(document.selection){
		var range = document.selection.createRange();
		pos.left = range.offsetLeft + offsetx - nodeLeft + 'px';
		pos.top = range.offsetTop + offsety - nodeTop + 'px';
	}else if(window.getSelection){
		var sel = window.getSelection();
		var range = sel.getRangeAt(0).cloneRange();
		try{
			range.setStart(range.startContainer, range.startOffset - 1);
		}catch(e){
		}
		var rect = range.getBoundingClientRect();
		if(range.endOffset == 0 || range.toString() === ''){
			// first char of line
			if(range.startContainer == $node){
				// empty div
				if(range.endOffset == 0){
					pos.top = '0px';
					pos.left = '0px';
				}else{
					// firefox need this
					var range2 = range.cloneRange();
					range2.setStart(range2.startContainer, 0);
					var rect2 = range2.getBoundingClientRect();
					pos.left = rect2.left + offsetx - nodeLeft + 'px';
					pos.top = rect2.top + rect2.height + offsety - nodeTop + 'px';
				}
			}else{
				pos.top = range.startContainer.offsetTop + 'px';
				pos.left = range.startContainer.offsetLeft + 'px';
			}
		}else{
			pos.left = rect.left + rect.width + offsetx - nodeLeft + 'px';
			pos.top = rect.top + offsety - nodeTop + 'px';
		}
	}
	return pos;
};

var getVideoId = function(src) {
	if(isBlank(src))
		return {};

	var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
	var vimeo = src.match(/\/\/(?:www|player\.)?vimeo.com\/([0-9a-z\-_]+)/i);
	var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
	var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

	if (youtube) {
		return {
			youtube: youtube
		};
	} else if (vimeo) {
		return {
			vimeo: vimeo
		};
	} else if (dailymotion) {
		return {
			dailymotion: dailymotion
		};
	} else if (vk) {
		return {
			vk: vk
		};
	}
};

//////////////////////////////////////////////////////////////////////////////

/**
 * check_key
 * 숫자, 알파벳 등 입력 시 문자 유효성 체크
 */
(function($){
	$.extend($.fn, {
		check_key : function(opt){
			var o = $(this);
			var default_allow_option = {
				digit: true,		// 숫자 허용 여부
				upper: true,		// 알파벳 대문자 허용 여부
				lower: true,		// 알파벳 소문자 허용 여부
				arrow: true,		// 방향키 허용 여부
				special_list: ['Backspace', 'Tab', 'Enter', 'Esc', 'Escape', 'Home', 'End', 'Del', 'Delete'],		// 추가 허용 특수키
				allow_list: [],		 // 추가 허용 문자키(정규식에 포함될 값이므로 주의할 것) ex) ['-', '_']
				ctrl_list: ['c', 'C', 'v', 'V']		// ctrl 단축키 허용 목록
			};
			var allow_option = $.extend(default_allow_option, opt);
			o.css('ime-mode', 'disabled');
			o.off('keydown.check_key').on('keydown.check_key',function(event){
				var key = event.key;
				if(key){
					if(Array.isArray(allow_option.ctrl_list) && (event.ctrlKey || event.metaKey) && allow_option.ctrl_list.indexOf(key) >= 0){
						return true;
					}else{
						if(event.ctrlKey || event.metaKey){
							event.preventDefault();
						}else{
							if(key.length > 1){
								var arrow_list = ['Up', 'Down', 'Left', 'Right', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
								if(allow_option.arrow && arrow_list.indexOf(key) >= 0){
									return true;
								}else if(Array.isArray(allow_option.special_list) && allow_option.special_list.indexOf(key) >= 0){
									return true;
								}else{
									event.preventDefault();
								}
							}else{
								if(allow_option.digit && (/[0-9]/.test(key))){
									return true;
								}else if(allow_option.upper && (/[A-Z]/.test(key))){
									return true;
								}else if(allow_option.lower && (/[a-z]/.test(key))){
									return true;
								}else if(Array.isArray(allow_option.allow_list) && allow_option.allow_list.indexOf(key) >= 0){
									return true;
								}else{
									event.preventDefault();
								}
							}

						}
					}
				}
			});
			o.off('keyup.check_key').on('keyup.check_key',function(event){
				var key = event.key;
				var str = $(this).val();
				var allowReg = '';
				if(allow_option.digit) allowReg += '0-9';
				if(allow_option.upper) allowReg += 'A-Z';
				if(allow_option.lower) allowReg += 'a-z';
				if(Array.isArray(allow_option.allow_list)){
					$.each(allow_option.allow_list, function(k, v){
						if(v.length === 1){
							allowReg += v.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&');
						}
					});
				}
				if(allowReg === ''){
					str = '';
				}else{
					var replaceReg = new RegExp('[^' + allowReg + ']', 'gi');
					str = str.replace(replaceReg, '');
				}
				$(this).val(str);
			});
		}
	});
})(jQuery);

//check_callnum 전화번호만 입력되도록
(function($){
	$.extend($.fn, {
		check_callnum : function(){
			var o = $(this);
			o.css('ime-mode', 'disabled');
			o.off('keypress.check_callnum').on('keypress.check_callnum',function(event){
				var code = event.which?event.which:event.keyCode;
				if(code && ((code > 47 && code < 58) || (event.ctrlKey == true && (code == 118 || code == 86 || code == 67)) || code == 13 || code == 8 || code == 27 || code == 45 || code == 189 || code == 43)){
					//숫자범위,컨트롤브이대소문자,enter,back,esc,-, +
					return true;
				}else if(code && (code == 37 || code == 39 || code == 38 || code == 40)){ //방향키
					return true;
				}else if(code && (code == 9 || code == 46 || code == 35 || code == 36)){ //tab , del,  홈, 엔드
					return true;
				}else{
					event.preventDefault();
				}
			});
			o.off('keyup.check_callnum').on('keyup.check_callnum',function(event){
				var code = event.which?event.which:event.keyCode;
				if(code && (code == 37 || code == 39 || code == 38 || code == 40)) //방향키
					return true;
				else if(code && (code == 9 || code == 46 || code == 35 || code == 36)) //tab , del,  홈, 엔드
					return true;
				var str = $(this).val();
				str = str.replace(/[^0-9^\-^+]/gi, '');
				$(this).val(str);
			});
		}
	});

})(jQuery);

//check_num 숫자만 입력되도록
(function($){
	$.extend($.fn, {
		check_num : function(){
			var o = $(this);
			o.css('ime-mode', 'disabled');
			o.off('keypress.check_num').on('keypress.check_num',function(event){
				var code = event.which?event.which:event.keyCode;
				if(code && ((code > 47 && code < 58) || code == 8 || code == 13)){
					//숫자범위,back,enter,esc,-
					return true;
				}else if(code && (code == 9 || code == 46 || code == 35 || code == 36)){ //tab , del,  홈, 엔드
					return true;
				}else if(code && (code == 37 || code == 39 || code == 38 || code == 40)){ //방향키
					return true;
				}else{
					event.preventDefault();
				}
			});
			o.off('keyup.check_num').on('keyup.check_num',function(event){
				var code = event.which?event.which:event.keyCode;
				if(code && (code == 37 || code == 39 || code == 38 || code == 40)) //방향키
					return true;
				else if(code && (code == 9 || code == 46 || code == 35 || code == 36)) //tab , del,  홈, 엔드
					return true;
				var str = $(this).val();
				str = str.replace(/[^0-9]/gi, '');
				$(this).val(str);
			});
		}
	});
})(jQuery);

//check_email 이메일만 입력
(function($){
	$.extend($.fn, {
		check_email : function(){
			var o = $(this);
			o.css('ime-mode', 'disabled');
			o.off('keypress.check_email').on('keypress.check_email',function(event){
				var code = event.which?event.which:event.keyCode;
				if(!code)
					event.preventDefault();
				if(code > 47 && code < 58) //숫자범위
					return true;
				if(code > 64 && code < 91) //소문자범위
					return true;
				if(code > 96 && code < 123) //대문자
					return true;
				if(event.ctrlKey == true && (code == 118 || code == 86 || code == 99 || code == 67)) //컨트롤v대소문자c
					return true;
				if(code == 45 || code == 189) //-
					return true;
				if((event.shiftKey == true && code == 50) || code == 64) //@
					return true;
				if((event.shiftKey == true && code == 189) || code == 95) //_
					return true;
				if(code == 13 || code == 8 || code == 9 || code == 27 || code == 46 || code == 35 || code == 36) //enter, back, esc, tab , del,  홈, 엔드
					return true;
				if(code == 37 || code == 39 || code == 38 || code == 40) //방향키
					return true;

				event.preventDefault();
			});
			o.off('keyup.check_email').on('keyup.check_email',function(event){
				var str = $(this).val();
				str = str.replace(/[^0-9^a-z^A-Z^.^@^_^-]/gi, '');
				$(this).val(str);
			});
		}
	});
})(jQuery);

//nl2br
(function($){
	$.extend({
		nl2br : function(str){
			var breakTag = '<br />';
			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
		}
	});
})(jQuery);

//setBackgroundPosition
(function($){
	$.fn.setBackgroundPosition = function(o, v){
		var obj = $(this);
		var item = {
			'0 0' : 'tl',
			'50% 0' : 'tc',
			'100% 0' : 'tr',
			'0 50%' : 'ml',
			'50% 50%' : 'mc',
			'100% 50%' : 'mr',
			'0 100%' : 'bl',
			'50% 100%' : 'bc',
			'100% 100%' : 'br'
		};
		var default_key = '50% 50%';
		var event_closed = false;
		var select_option = {};
		var select_container = {};
		var select_option_wrap = {};
		var select_container_h = 0;

		//set select
		function select_item(key){
			var i = 0;
			obj.find('li').removeClass('active');
			$.each(item, function(k, v){
				if((key == '' || key == undefined) && i == 0){
					obj.find('._' + v).addClass('active');
					obj.data('current_value', v);
					obj.data('current_key', k);
					return;
				}else if(key == k){
					obj.find('._' + v).addClass('active');
					obj.data('current_value', v);
					obj.data('current_key', k);
					return;
				}
				i++;
			});
		}

		//set disabled
		function set_disabled(v){
			obj.data('is_disabled', v);
		}

		//make_selectbox_option
		function make_selectbox_option(){
			select_option = $("<div class='position_option' style='visibility:hidden'></div>");
			select_container = $("<ul class='select_container'/>");

			//var i=0;
			$.each(item, function(k, v){
				var li = $("<li class='select_item'><span class='position_" + v + "'></span></li>").off('click').on('click', function(){
					select_item(k);
					hide_selectbox();
					o.change(k);	//raise event
				}).data('key', k);
				select_container.append(li);
			});
			select_option.append(select_container);
			return select_option;
		}


		function setPosition(){
			//container_item_offset_top
			select_option.css({
				'visibility' : 'hidden',
				'display' : 'block'
			});
			select_container_h = select_option.outerHeight();

			var select_docu_h = $(window).height();
			var select_sc_t = $(window).scrollTop();
			var select_offset_t = obj.offset().top - select_sc_t;

			var obj_h = Math.round(select_offset_t + obj.outerHeight() + select_container_h);
			if(select_docu_h < obj_h){
				if(obj.offset().top > 350){
					select_option.css('top', select_container_h * (-1));
				}else{
					select_option.css('top', obj.outerHeight());
				}
			}else{
				select_option.css('top', obj.outerHeight());
			}

			select_option.css({
				'visibility' : 'visible'
			});
			select_option_wrap.css({
				'position' : 'absolute',
				'z-index' : 9999,
				'top' : obj.offset().top,
				'left' : obj.offset().left
			});
		}

		//show_selectbox
		function show_selectbox(){
			if(obj.data('is_disabled')) return;
			setPosition();
			select_option.show();

			select_container.find('li.select_item').each(function(no){
				if($(this).data('key') == obj.data('current_key')){
					$(this).addClass('current');
				}else
					$(this).removeClass('current');
			});

			$('body').addClass('_selected_box');
			$('body').data('selectbox', 'Y');

			$(window).off('resize.positionui');
			$(window).on('resize.positionui', function(e){
				setPosition();
			});
			$(document).off('scroll.positionui');
			$(document).on('scroll.positionui', function(e){
				setPosition();
			});
			$(document).off('click.positionui');
			$(document).on('click.positionui', function(e){
				cancelPropagation(e);
				e.preventDefault();
				hide_selectbox();
			});

		}

		//hide_selectbox
		function hide_selectbox(){

			$(document).off('scroll.positionui');
			$(window).off('resize.positionui');
			$(document).off('click.positionui');
			$('body').removeClass('_selected_box');
			$('body').data('selectbox', 'N');

			select_option.hide();
			if(event_closed){
				o.closed(obj.data('current_key'));
			}
		}

		switch(o){
			case 'get_key':
				return obj.data('current_key');

			case 'get_value':
				return obj.data('current_value');
			case 'get_tag':
				return obj.data('current_tag');
			case 'set_key':
				select_item(v);
				break;
			case 'set_disabled':
				set_disabled(v);
				break;
			case 'hide':
				hide_selectbox();
				break;
			case 'remove':
				$('#' + $(this).attr('id') + "_option").remove();
				$(this).empty();
				break;
			case 'destroy':
				$('#' + $(this).attr('id') + "_option").remove();
				$(this).empty();
				obj.removeData();
				break;
			default:
				obj.data('item', item);

				if(o.disabled) set_disabled(true);

				if(o.event_closed == true){
					event_closed = true;
				}

				select_option_wrap = $('<div class="position_ui_option"></div>');
				$('body').append(select_option_wrap);

				$(this).empty();
				$(this).append($("<div class='position_ui'><ul><li class='_tl'/><li class='_tc'/><li class='_tr'/><li class='_ml'/><li class='_mc'/><li class='_mr'/><li class='_bl'/><li class='_bc'/><li class='_br'/></ul></div>"));

				select_option_wrap.append(make_selectbox_option());

				$(this).off('click').on('click', function(e){
					cancelPropagation(e);
					show_selectbox();
				});

				select_item((o.default_key != '' && o.default_key != undefined) ? o.default_key : default_key);
				select_option.css({
					'visibility' : 'visible',
					'display' : 'none'
				});

		}
	};
})(jQuery);

/**
 * Froala Editor v3 셋팅
 * @param selector			에디터를 설치할 셀렉터(v3 특징상 object로 설정할 수 없음)
 * @param option			events를 제외한 옵션(기존 events 옵션을 전부 덮어씌울 경우만 이곳에 events 추가)
 * @param events_option		events 옵션(기존 events 옵션을 유지하고 대치)
 */
var setFroala = function(selector, option, events_option){
  var android_que = [];
  var post_image_que = [];

  var total_file_size = 0;
  var $image_list_obj = {};
  var $image_upload_input_obj = {};
  var $image_replace_input_obj = {};
  var $file_upload_btn_obj = {};
  var $file_list_obj = option.file_list_obj;
  var $froala_obj = $(this);

  if(typeof option.file_insert_key == 'undefined' || option.file_insert_key =='')
    var file_insert = "dozInsertFile";
  else
    var file_insert = option.file_insert_key;

  if(typeof option.image_align == 'undefined' || option.image_align =='')
    var image_align = 'left';
  else
    var image_align = option.image_align;

  if(typeof option.image_insert_key == 'undefined' || option.image_insert_key =='')
    var image_insert = "insertCustomImage";
  else
    var image_insert = option.image_insert_key;

  if(typeof option.image_replace_key == 'undefined' || option.image_replace_key =='')
    var image_replace = "replaceCustomImage";
  else
    var image_replace = option.image_replace_key;

  if(typeof option.disable_image_upload == 'undefined')
    var use_image_upload = true;
  else
    var use_image_upload = !option.disable_image_upload;

  if(typeof option.image_display == 'undefined' || option.image_align =='')
    var image_display = 'block';
  else
    var image_display = option.image_display;

  var code = option.code;
  var image_upload_url = option.image_upload_url;
  var file_upload_url = option.file_upload_url;

  if(image_upload_url == "") alert(getLocalizeString('설명_이미지업로드URL이비어있습니다', '', '이미지 업로드 URL이 비어있습니다.'));
  if(file_upload_url == "") alert(getLocalizeString('설명_파일업로드URL이비어있습니다', '', '파일 업로드 URL이 비어있습니다.'));
  // if(!isBlank(file_upload_url) && ($file_list_obj == "" || $file_list_obj.length == 0)) alert(getLocalizeString('설명_파일리스트를확인하세요', '', '파일 리스트를 확인하세요.'));

  //이미지 업로드 버튼 추가
  if(!($image_upload_input_obj.length > 0)){
    var upload_html = $("<div id='image_upload_input' style='width:0; height:0; left: -9999px; opacity: 0;position: absolute' ><input type='file' name='post_images[]' multiple  accept='.jpg,.jpeg,.png,.gif' class='_image_upload_btn' ></div>");
    $("body").append(upload_html);
    $image_upload_input_obj = upload_html;
    $image_upload_input_obj.setUploadImage({
      url : image_upload_url,
      formData : {target : 'post',board_code : code}
    }, function (msg, data,data_list) {
      if (msg == 'success') {
        var html = '';
        $.each(data_list.post_images, function (index, file) {
          if(file.tmp_idx > 0) {
            if ( image_display == 'block' ) {
              switch(image_align){
                case 'center':
                  html += '<p><img class="fr-dib fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'right':
                  html += '<p><img class="fr-dib fr-draggable fr-fir" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'left':
                  html += '<p><img class="fr-dib fr-draggable fr-fil" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                default:
                  html += '<p><img class="fr-dib fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
              }
            } else {
              switch(image_align){
                case 'center':
                  html += '<p style="text-align: center"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'right':
                  html += '<p style="text-align: right"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'left':
                default:
                  html += '<p style="text-align: left"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
              }
            }
            postAddImage(file.tmp_idx,file.size);
          }else{
            alert(file.error);
          }
        });
        froala3.html.insert(html, true);
        extend_option.change_content();
      }
    });
  }

  //이미지 교체 버튼 추가(복수로 들어가면 안됨) - 한 페이지에 에디터가 여럿 사용될 경우 별개로 세팅해줘야 함
  if(!($image_replace_input_obj.length > 0)){
    var replace_html = $("<div id='image_replace_input' style='width:0; height:0; left: -9999px; opacity: 0;position: absolute' ><input type='file' name='post_images[]' accept='.jpg,.jpeg,.png,.gif' class='_image_replace_btn' ></div>");
    $("body").append(replace_html);
    $image_replace_input_obj = replace_html;

    $image_replace_input_obj.setUploadImage({
      url : image_upload_url,
      formData : {target : 'post',board_code : code},
      singleFileUploads: true
    }, function (msg, data,data_list) {
      if (msg == 'success') {
        if(data_list.post_images.length > 0){
          // 저장된 이미지 객체 가져와서 교체
          var current_image = $('#image_replace_input').data('current_image');
          if(current_image && current_image.length > 0) {
            // DOM에 존재하고 여전히 에디터 내부에 있는지 확인
            if($.contains(document.body, current_image[0]) && current_image.closest('.fr-element').length > 0) {
              $(current_image).attr('src', CDN_UPLOAD_URL+data_list.post_images[0].url);
            }
            // 사용 후 항상 정리
            $('#image_replace_input').removeData('current_image');
          }
        }else{
          alert(msg);
        }
        extend_option.change_content();
      }
    });
  }

  //이미지 임시저장 리스트 추가
  if(!($image_list_obj.length > 0)) {
    var image_list_html = $("<ul id='image_list' style='display: none'></ul>");
    $("body form").append(image_list_html);
    $image_list_obj = image_list_html;
  }

  var postDeleteFile = function(id){
    var obj = $('#'+id);
    var size = obj.data('size');
    total_file_size -= size;
    obj.remove();
  };

	  var postAddFile = function(filename,file_code,tmp_idx,size){
	    var uniq_id = makeUniq('upfile_');
	    total_file_size += size;
	    var clear_ico = $('<i class="zmdi zmdi-close"></i>').data({'item':uniq_id,size:size}).click(function(e){
	      postDeleteFile(uniq_id);
	    });
    var hidden_input = '';
    if(file_code.length>0) {
      hidden_input = $('<input name="upload_files[]" value="' + file_code + '" type="hidden" />');
	    }else if(Math.round(tmp_idx) > 0){
	      hidden_input = $('<input name="temp_files[]" value="' + tmp_idx + '" type="hidden" />');
	    }
	    var li 	= $('<li>').attr('id',uniq_id).data({'item':uniq_id,size:size});
	    // XSS 방지: 파일명은 HTML로 해석되지 않도록 text로 삽입 (KVE-2025-2806)
	    var $file_name_dom = $('<span></span>');
	    $file_name_dom.text(filename);
	    $file_name_dom.append($('<em></em>').text(' ' + GetFileSize(size)));
	    li.append($file_name_dom);
	    li.append(clear_ico);
	    li.append(hidden_input);
	    $file_list_obj.append(li);
	  };

  var upload_file_html = $("<div id='image_upload_input' style='width:0; height:0; left: -9999px; opacity: 0;position: absolute' ><input type='file' name='post_files[]' multiple class='_file_upload_btn' />");
  $("body").append(upload_file_html);
  $file_upload_btn_obj = upload_file_html;
  $file_upload_btn_obj.setUploadFile({
    url : file_upload_url,
    formData : {target : 'post',board_code : code}
  }, function (msg, data,data_list) {
    if (msg == 'success') {
      var html = '';
      $.each(data_list.post_files,function(i,file){
        if(file.tmp_idx > 0){
          postAddFile(file.org_name,'',file.tmp_idx,file.size);
        }else{
          alert(file.error);
        }
      });
    }
  });

  FroalaEditor.DefineIcon(file_insert, {NAME: 'file-o'});
  FroalaEditor.RegisterCommand(file_insert, {
    title: getLocalizeString('버튼_파일첨부_최대nMB', 100, '파일첨부(최대 %1MB)'),
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      upload_file_html.find("._file_upload_btn").click();
    }
  });

  FroalaEditor.DefineIcon(image_insert, {NAME: 'image'});
  FroalaEditor.RegisterCommand(image_insert, {
    title: getLocalizeString('버튼_이미지첨부', '', '이미지 첨부'),
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      upload_html.find("._image_upload_btn").click();
    }
  });

  FroalaEditor.DefineIcon(image_replace, {NAME: 'exchange'});
  FroalaEditor.RegisterCommand(image_replace, {
    title: getLocalizeString('버튼_이미지교체', '', '이미지 교체'),
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      // 현재 선택된 이미지를 전역 객체에 저장
      var $current_img = this.image.get();
      if($current_img && $current_img.length > 0) {
        $('#image_replace_input').data('current_image', $current_img);
      }
      // 파일 선택 다이얼로그 열기
      $('#image_replace_input').find("._image_replace_btn").click();
    }
  });

  if(IS_ANDROID_APP == 'Y') {
    $('#mobile_image_upload').off('click').on('click',function(){
      window.dozAndroidBridge.openPostAlbum();
    });
  }else{
    var upload_html2 = $("<input type='file' style='width:30px; height:30px;top:10px;left:12px;opacity: 0;position: absolute' name='post_images[]'  accept='image/jpeg, image/jpg, image/png, image/gif, image/svg+xml' id='image_upload_btn2' >");
    $('#mobile_image_upload').append(upload_html2);
    upload_html2.setUploadImage({
      url : image_upload_url,
      formData : {target : 'post',board_code : code}
    }, function (msg, data,data_list) {
      if (msg == 'success') {
        var html = '';
        $.each(data_list.post_images, function (index, file) {
          if(file.tmp_idx > 0) {
            if ( image_display == 'block' ) {
              switch(image_align){
                case 'center':
                  html += '<p><img class="fr-dib fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'right':
                  html += '<p><img class="fr-dib fr-draggable fr-fir" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'left':
                  html += '<p><img class="fr-dib fr-draggable fr-fil" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                default:
                  html += '<p><img class="fr-dib fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
              }
            } else {
              switch(image_align){
                case 'center':
                  html += '<p style="text-align: center"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'right':
                  html += '<p style="text-align: right"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
                case 'left':
                default:
                  html += '<p style="text-align: left"><img class="fr-dii fr-draggable" src="'+CDN_UPLOAD_URL+file.url+'"></p>';
                  break;
              }
            }
            postAddImage(file.tmp_idx,file.size);
          }
        });
        froala3.html.insert(html, true);
        extend_option.change_content();
      }
    });
  }

  /***
   * 안드로이드앱에서 post글쓰기시 이미지 업로드 완료시 처리
   * @param image
   */
  var androidAppPostImageUploadComplete = function(image){
    if(image.tmp_idx > 0){
      android_que.push(image);
      if(image.is_last == "Y") androidAppPostImageUploadAllComplete();
    }
  };

  var androidAppPostImageUploadAllComplete = function(){
    androidAppPostImageInsert(android_que[0]);
  };

  var androidAppPostImageInsert = function(image){
    //$froala_obj.froalaEditor('image.insert', CDN_UPLOAD_URL+image.url, true);
    froala3.html.insert(CDN_UPLOAD_URL+image.url, true);
    var img = $froala_obj.find('img[src="'+CDN_UPLOAD_URL+image.url+'"]');
    img.data(image);
    postAddImage(image.tmp_idx,image.size);
    android_que.splice(0,1);
  };


  var postAddImage = function(tmp_idx,size){
    var uniq_id = makeUniq('image_');
    var hidden_input = $('<input name="temp_images[]" value="' + tmp_idx + '" type="hidden" />');
    var li 	= $('<li>').attr('id',uniq_id).data({'item':uniq_id,size:size});
    li.append(hidden_input);
    $image_list_obj.append(li);
  };

  /**
   * 디자인모드와 달리 IE에서는 ComputedPropertyName(ES6 문법)을 사용할 수 없으므로 문자열로 만든 후 JSON 파싱
   */
  var getInlineStyle = function(){
    var inlineStyle =
      '{"' + getLocalizeString('타이틀_기본자간', '', '기본 자간') + '": "letter-spacing: 0;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' -1px": "letter-spacing: -1px;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' 1px": "letter-spacing: 1px;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' 2px": "letter-spacing: 2px;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' 3px": "letter-spacing: 3px;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' 4px": "letter-spacing: 4px;", '
      + '"' + getLocalizeString('타이틀_자간', '', '자간') + ' 5px": "letter-spacing: 5px;"}';
    return JSON.parse(inlineStyle);
  };

  // 커스텀 아이콘 설정
  FroalaEditor.DefineIconTemplate('custom_icon', '<i class="[CLASSNAME]" aria-hidden="true"></i>');

  FroalaEditor.DefineIcon('bold', {CLASSNAME: 'fas fa-bold', template: 'custom_icon'});
  FroalaEditor.DefineIcon('italic', {CLASSNAME: 'fas fa-italic', template: 'custom_icon'});
  FroalaEditor.DefineIcon('underline', {CLASSNAME: 'fas fa-underline', template: 'custom_icon'});
  FroalaEditor.DefineIcon('strikeThrough', {CLASSNAME: 'fas fa-strikethrough', template: 'custom_icon'});
  //FroalaEditor.DefineIcon('fontSize', {CLASSNAME: 'fas fa-text-height', template: 'custom_icon'});
  FroalaEditor.DefineIcon('fontSize', {SRC: '//static.imweb.me/vendor/images/froala/font_size_white.png', template: 'image'});
  FroalaEditor.DefineIcon('textColor', {CLASSNAME: 'fas fa-tint', template: 'custom_icon'});
  FroalaEditor.DefineIcon('emoticons', {CLASSNAME: 'far fa-grin-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('moreText', {CLASSNAME: 'simple icon-options', template: 'custom_icon'});

  FroalaEditor.DefineIcon('superscript', {CLASSNAME: 'fas fa-superscript', template: 'custom_icon'});
  FroalaEditor.DefineIcon('subscript', {CLASSNAME: 'fas fa-subscript', template: 'custom_icon'});
  FroalaEditor.DefineIcon('backgroundColor', {CLASSNAME: 'fas fa-fill-drip', template: 'custom_icon'});
  FroalaEditor.DefineIcon('inlineStyle', {CLASSNAME: 'fas fa-text-width', template: 'custom_icon'});
  FroalaEditor.DefineIcon('clearFormatting', {CLASSNAME: 'fas fa-eraser', template: 'custom_icon'});

  FroalaEditor.DefineIcon('paragraphFormat', {CLASSNAME: 'fas fa-paragraph', template: 'custom_icon'});
  FroalaEditor.DefineIcon('align', {CLASSNAME: 'fas fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('align-left', {CLASSNAME: 'fas fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('align-right', {CLASSNAME: 'fas fa-align-right', template: 'custom_icon'});
  FroalaEditor.DefineIcon('align-center', {CLASSNAME: 'fas fa-align-center', template: 'custom_icon'});
  FroalaEditor.DefineIcon('align-justify', {CLASSNAME: 'fas fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('formatOL', {CLASSNAME: 'fas fa-list-ol', template: 'custom_icon'});
  FroalaEditor.DefineIcon('formatUL', {CLASSNAME: 'fas fa-list', template: 'custom_icon'});
  FroalaEditor.DefineIcon('lineHeight', {CLASSNAME: 'fas fa-text-height', template: 'custom_icon'});
  FroalaEditor.DefineIcon('moreParagraph', {CLASSNAME: 'simple icon-options', template: 'custom_icon'});

  FroalaEditor.DefineIcon('outdent', {CLASSNAME: 'fas fa-outdent', template: 'custom_icon'});
  FroalaEditor.DefineIcon('indent', {CLASSNAME: 'fas fa-indent', template: 'custom_icon'});
  FroalaEditor.DefineIcon('quote', {CLASSNAME: 'fas fa-quote-left', template: 'custom_icon'});

  FroalaEditor.DefineIcon(image_insert, {CLASSNAME: 'far fa-images', template: 'custom_icon'});
  FroalaEditor.DefineIcon('insertImage', {CLASSNAME: 'far fa-images', template: 'custom_icon'});
  FroalaEditor.DefineIcon('insertVideo', {CLASSNAME: 'fas fa-video', template: 'custom_icon'});
  FroalaEditor.DefineIcon('insertLink', {CLASSNAME: 'fas fa-link', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkList', {CLASSNAME: 'fas fa-search', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkOpen', {CLASSNAME: 'fas fa-external-link-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkStyle', {CLASSNAME: 'fas fa-magic', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkEdit', {CLASSNAME: 'fas fa-edit', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkRemove', {CLASSNAME: 'fas fa-unlink', template: 'custom_icon'});
  FroalaEditor.DefineIcon('linkBack', {CLASSNAME: 'fas fa-arrow-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('insertTable', {CLASSNAME: 'fas fa-table', template: 'custom_icon'});
  FroalaEditor.DefineIcon('moreRich', {CLASSNAME: 'simple icon-options', template: 'custom_icon'});

  FroalaEditor.DefineIcon(file_insert, {CLASSNAME: 'far fa-file-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('insertHR', {CLASSNAME: 'fas fa-minus', template: 'custom_icon'});
  FroalaEditor.DefineIcon('fontAwesome', {CLASSNAME: 'fab fa-font-awesome-flag', template: 'custom_icon'});
  FroalaEditor.DefineIcon('embedly', {CLASSNAME: 'fas fa-share-alt', template: 'custom_icon'});

  FroalaEditor.DefineIcon('undo', {CLASSNAME: 'fas fa-undo-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('redo', {CLASSNAME: 'fas fa-redo-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('fullscreen', {CLASSNAME: 'fas fa-expand', template: 'custom_icon'});
  FroalaEditor.DefineIcon('fullscreenCompress', {CLASSNAME: 'fas fa-compress', template: 'custom_icon'});
  FroalaEditor.DefineIcon('html', {CLASSNAME: 'fas fa-code', template: 'custom_icon'});

  FroalaEditor.DefineIcon('fontFamily', {CLASSNAME: 'fas fa-font', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableHeader', {CLASSNAME: 'fas fa-header', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableRemove', {CLASSNAME: 'fas fa-trash-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableRows', {CLASSNAME: 'fas fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableColumns', {CLASSNAME: 'fas fa-align-justify fa-rotate-90', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableStyle', {CLASSNAME: 'fas fa-border-all', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableCells', {CLASSNAME: 'far fa-square', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableCellBackground', {CLASSNAME: 'fas fa-fill-drip', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableCellVerticalAlign', {CLASSNAME: 'fas fa-arrows-alt-v', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableCellHorizontalAlign', {CLASSNAME: 'fas fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableCellStyle', {CLASSNAME: 'fas fa-magic', template: 'custom_icon'});
  FroalaEditor.DefineIcon('tableBack', {CLASSNAME: 'fa fa-arrow-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon(image_replace, {CLASSNAME: 'fas fa-exchange-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('image-align', {CLASSNAME: 'fa fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('image-align-left', {CLASSNAME: 'fa fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('image-align-right', {CLASSNAME: 'fa fa-align-right', template: 'custom_icon'});
  FroalaEditor.DefineIcon('image-align-center', {CLASSNAME: 'fa fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageAlign', {CLASSNAME: 'fas fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageRemove', {CLASSNAME: 'fas fa-trash-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageLink', {CLASSNAME: 'fas fa-link', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageDisplay', {CLASSNAME: 'fas fa-star', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageStyle', {CLASSNAME: 'fas fa-magic', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageAlt', {CLASSNAME: 'fas fa-info', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageSize', {CLASSNAME: 'fas fa-expand-arrows-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('imageBack', {CLASSNAME: 'fa fa-arrow-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoReplace', {CLASSNAME: 'fa fa-exchange', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoRemove', {CLASSNAME: 'fa fa-trash', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoDisplay', {CLASSNAME: 'fa fa-star', template: 'custom_icon'});
  FroalaEditor.DefineIcon('video-align', {CLASSNAME: 'fa fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('video-align-left', {CLASSNAME: 'fa fa-align-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('video-align-right', {CLASSNAME: 'fa fa-align-right', template: 'custom_icon'});
  FroalaEditor.DefineIcon('video-align-center', {CLASSNAME: 'fa fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoAlign', {CLASSNAME: 'fa fa-align-justify', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoSize', {CLASSNAME: 'fa fa-arrows-alt', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoByURL', {CLASSNAME: 'fa fa-link', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoEmbed', {CLASSNAME: 'fa fa-code', template: 'custom_icon'});
  FroalaEditor.DefineIcon('videoBack', {CLASSNAME: 'fa fa-arrow-left', template: 'custom_icon'});
  FroalaEditor.DefineIcon('embedlyRemove', {CLASSNAME: 'fa fa-trash', template: 'custom_icon'});
  // PC 좁은 화면에서도 모바일 뷰로 보여야 함
  var is_custom_mobile = option.mobile_custom && $(window).width() < 768;
  var ios_tmp_agent = "";
  var default_option = {
    theme: 'custom',
    //initOnClick: true,
    //toolbarInline : true,
    imageDefaultWidth : 0,
    imageDefaultAlign : 'left',
    fontSize:['8', '9', '10', '11', '12', '13', '14', '16', '18','20','22', '24','26', '30', '36', '48', '60', '72', '96'],
    toolbarButtons : {
      'moreText': {
        'buttons': ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'strikeThrough', 'inlineStyle', 'superscript', 'subscript', 'backgroundColor', 'clearFormatting'],
        'buttonsVisible': 5
      },
      'moreParagraph': {
        'buttons': ['|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'lineHeight', 'quote'],
        'buttonsVisible': 4
      },
      'moreRich': {
        'buttons': ['|', image_insert, 'insertLink', 'insertTable', file_insert, 'insertVideo', 'insertHR'],
        'buttonsVisible': 4
      },
      'moreMisc': {
        'buttons': ['|', 'undo', 'redo', 'html','emoticons'],
        'buttonsVisible': 5
      }
    },
    toolbarButtonsMobile : {
      'moreText': {
        'buttons': [image_insert, 'insertVideo', 'insertLink', file_insert, '|', "fontSize", "bold", "italic", "underline", "strikeThrough", "align", "textColor", "clearFormatting", '|', 'quote', "insertHR", "formatOL", "formatUL"],
        'buttonsVisible': 50
      }
    },
    language: 'ko',
    imageEditButtons: [image_replace, 'imageAlign', 'imageRemove', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '_', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
    toolbarSticky: true,
    toolbarStickyOffset: 65,
    heightMin: 150,
    placeholderText: getLocalizeString('설명_내용을입력해주세요', '', '내용을 입력해주세요'),
    htmlAllowedAttrs:["accept","accept-charset","accesskey","action","align","allow","allowfullscreen","allowtransparency","alt","aria-.*","async","autocomplete","autofocus","autoplay","autosave","background","bgcolor","border","charset","cellpadding","cellspacing","checked","cite","class","color","cols","colspan","content","contenteditable","contextmenu","controls","controlsList","coords","data","data-.*","datetime","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","for","form","formaction","frameborder","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","ismap","itemprop","keytype","kind","label","lang","language","list","loop","low","max","maxlength","media","method","min","mozallowfullscreen","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","scrolling","seamless","selected","shape","size","sizes","span","src","srcdoc","srclang","srcset","start","step","summary","spellcheck","style","tabindex","target","title","type","translate","usemap","value","valign","webkitallowfullscreen","width","wrap"],
	  htmlAllowedEmptyTags: [
			  ...FroalaEditor.DEFAULTS.htmlAllowedEmptyTags,
			  'i',
	  ],
    fileAllowedTypes : ['application/pdf', 'application/msword'],
    tableStyles : {
      tableHorizontal: getLocalizeString('버튼_가로구분선만', '', '가로 구분선만'),
      noBorder: getLocalizeString('버튼_테두리없음', '', '테두리 없음'),
      tableStrong: getLocalizeString('버튼_테두리진하게', '', '테두리 진하게'),
      tableHover: getLocalizeString('버튼_Hover효과행단위', '', 'Hover 효과(행 단위)'),
      tableHeaderDarken: getLocalizeString('버튼_테이블헤더음영', '', '테이블 헤더 음영'),
      tableStriped: getLocalizeString('버튼_줄무늬행', '', '줄무늬 행'),
      'm-table-style' : getLocalizeString('버튼_모바일에서표형식무시', '', '모바일에서 표 형식 무시'),
      '_table_responsive' : getLocalizeString('버튼_반응형테이블', '', '반응형 테이블')
    },
    linkMultipleStyles: false,
    linkStyles: {
      'btn btn-default': getLocalizeString('버튼_기본버튼', '', '기본 버튼'),
      'btn btn-primary': getLocalizeString('버튼_강조버튼', '', '강조 버튼')
    },
    inlineStyles: getInlineStyle(),
    paragraphFormat: {
      H1: 'Heading 1',
      H2: 'Heading 2',
      H3: 'Heading 3',
      H4: 'Heading 4',
      H5: 'Heading 5',
      H6: 'Heading 6',
      N: 'Normal'
    },
    linkInsertButtons: [],
    codeMirror: window.CodeMirror,
    colorsBackground: ['#000000','#444444','#666666','#999999','#CCCCCC','#EEEEEE','#F3F3F3','#FFFFFF',
      '#FF0000','#FF9900','#FFFF00','#00FF00','#00FFFF','#0000FF','#9900FF','#FF00FF',
      '#F4CCCC','#FCE5CD','#FFF2CC','#D9EAD3','#D0E0E3','#CFE2F3','#D9D2E9','#EAD1DC',
      '#EA9999','#F9CB9C','#FFE599','#B6D7A8','#A2C4C9','#9FC5E8','#B4A7D6','#D5A6BD',
      '#E06666','#F6B26B','#FFD966','#93C47D','#76A5AF','#6FA8DC','#8E7CC3','#C27BA0',
      '#CC0000','#E69138','#F1C232','#6AA84F','#45818E','#3D85C6','#674EA7','#A64D79',
      '#990000','#B45F06','#BF9000','#38761D','#134F5C','#0B5394','#351C75','#741B47',
      '#660000','#783F04','#7F6000','#274E13','#0C343D','#073763','#20124D','#4C1130'],
    colorsText: ['#000000','#444444','#666666','#999999','#CCCCCC','#EEEEEE','#F3F3F3','#FFFFFF',
      '#FF0000','#FF9900','#FFFF00','#00FF00','#00FFFF','#0000FF','#9900FF','#FF00FF',
      '#F4CCCC','#FCE5CD','#FFF2CC','#D9EAD3','#D0E0E3','#CFE2F3','#D9D2E9','#EAD1DC',
      '#EA9999','#F9CB9C','#FFE599','#B6D7A8','#A2C4C9','#9FC5E8','#B4A7D6','#D5A6BD',
      '#E06666','#F6B26B','#FFD966','#93C47D','#76A5AF','#6FA8DC','#8E7CC3','#C27BA0',
      '#CC0000','#E69138','#F1C232','#6AA84F','#45818E','#3D85C6','#674EA7','#A64D79',
      '#990000','#B45F06','#BF9000','#38761D','#134F5C','#0B5394','#351C75','#741B47',
      '#660000','#783F04','#7F6000','#274E13','#0C343D','#073763','#20124D','#4C1130'],
    colorsStep: 8,
    tableColors: ['#000000','#444444','#666666','#999999','#CCCCCC','#EEEEEE','#F3F3F3','#FFFFFF',
      '#FF0000','#FF9900','#FFFF00','#00FF00','#00FFFF','#0000FF','#9900FF','#FF00FF',
      '#F4CCCC','#FCE5CD','#FFF2CC','#D9EAD3','#D0E0E3','#CFE2F3','#D9D2E9','#EAD1DC',
      '#EA9999','#F9CB9C','#FFE599','#B6D7A8','#A2C4C9','#9FC5E8','#B4A7D6','#D5A6BD',
      '#E06666','#F6B26B','#FFD966','#93C47D','#76A5AF','#6FA8DC','#8E7CC3','#C27BA0',
      '#CC0000','#E69138','#F1C232','#6AA84F','#45818E','#3D85C6','#674EA7','#A64D79',
      '#990000','#B45F06','#BF9000','#38761D','#134F5C','#0B5394','#351C75','#741B47',
      '#660000','#783F04','#7F6000','#274E13','#0C343D','#073763','#20124D','#4C1130'],
    tableColorsStep: 8,
    imageUploadParam : 'files',
    imageUploadURL: '/ajax/upload_image_froala.cm',
    imageUpload: use_image_upload,
    fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      'Arial Black,Arial Bold,Gadget,Helvetica,sans-serif': 'Arial Black',
      'Georgia,serif': 'Georgia',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      "'Times New Roman',Times,serif": 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana'
    },
    mobile_custom: false,
    change_content : function(){

    },
    emoticonsUseImage: false,
    pastePlain: true,
    key: FROALA_KEY,
    attribution: false
  };
  var default_events_option = {
    'image.inserted': function($img, response){
      if(IS_ANDROID_APP == 'Y') {
        setTimeout(function () {
          if (android_que.length > 0) androidAppPostImageInsert(android_que[0]);
        }, 1);
      }
    },
    'image.beforeUpload': function(images){
      if(!use_image_upload){
        alert(getLocalizeString('설명_드래그업로드는지원하지않습니다', '', '드래그 업로드는 지원하지 않습니다.'));
        //cancelPropagation(e);
        return false;
      }
    },
    'image.beforePasteUpload': function(img){
      if(!use_image_upload){
        alert(getLocalizeString('설명_이미지복사붙여넣기기능은지원하지않습니다', '', '이미지 복사 붙여넣기 기능은 지원하지 않습니다.'));
        img.remove();
        //cancelPropagation(e);
        return false;
      }
    },
    'initialized': function(){
    const that = this;
      function _refreshInsertPopup () {
        var $popup = froala3.popups.get('video.insert');

        var $url_input = $popup.find('.fr-video-by-url-layer input');
        $url_input.val('').trigger('change');

        var $embed_area = $popup.find('.fr-video-embed-layer textarea');
        $embed_area.val('').trigger('change');
      }
      function _hideInsertPopup () {
      }
      function _initInsertPopup () {
        // Image buttons.
        var video_buttons = '';
        if (froala3.opts.videoInsertButtons.length > 1) {
          video_buttons = '<div class="fr-buttons">' + editor.button.buildList(editor.opts.videoInsertButtons) + '</div>';
        }

        // Video by url layer.
        var by_url_layer = '';
        if (froala3.opts.videoInsertButtons.indexOf('videoByURL') >= 0) {
          by_url_layer = '<div class="fr-video-by-url-layer fr-layer fr-active" id="fr-video-by-url-layer-' + editor.id + '"><div class="fr-input-line"><input type="text" placeholder="http://" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="videoInsertByURL" tabIndex="2">' + editor.language.translate('Insert') + '</button></div></div>'
        }

        // Video embed layer.
        var embed_layer = '';
        if (froala3.opts.videoInsertButtons.indexOf('videoEmbed') >= 0) {
          embed_layer = '<div class="fr-video-embed-layer fr-layer" id="fr-video-embed-layer-' + editor.id + '"><div class="fr-input-line"><textarea type="text" placeholder="' + editor.language.translate('Embedded Code') + '" tabIndex="1" rows="5"></textarea></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="videoInsertEmbed" tabIndex="2">' + editor.language.translate('Insert') + '</button></div></div>'
        }

        var template = {
          buttons: video_buttons,
          by_url_layer: by_url_layer,
          embed_layer: embed_layer,
          upload_layer: '',
          progress_bar: ''
        };

        // Set the template in the popup.
        var $popup = froala3.popups.create('video.insert', template);

        froala3.popups.onRefresh('video.insert', _refreshInsertPopup);
        froala3.popups.onHide('video.insert', _hideInsertPopup);

        return $popup;
      }
      resizeToolbar();
      var resize_time;
      $(window).off('resize.frToolbar').on('resize.frToolbar',function(e){
        if(resize_time) {
          clearTimeout(resize_time);
        }
        resize_time = setTimeout(function() {
          $(this).trigger('resizeEnd.frToolbar');
        }, 500);
      });
      $(window).off('resizeEnd.frToolbar').on('resizeEnd.frToolbar',function(){
        is_custom_mobile = option.mobile_custom && $(window).width() < 768;
        resizeToolbar();
      });

      function resizeToolbar(){
        var $tb = $(froala3.$tb);
        var $fr_btn_grp = $tb.find(".fr-btn-grp");
        var pointerDownName = 'touchstart';
        var pointerMoveName = 'touchmove';
        var pointerUpName = 'touchend';
        if(!IS_MOBILE){		// PC 좁은 화면일 때
          pointerDownName = 'mousedown';
          pointerMoveName = 'mousemove';
          pointerUpName = 'mouseup';
        }else if(window.PointerEvent){
          // Chrome, Edge, IE11, Firefox에서는 PointerEvents 사용(Safari는 TouchEvents 사용해야함)
          pointerDownName = 'pointerdown';
          pointerMoveName = 'pointermove';
          pointerUpName = 'pointerup';
        }
        if(is_custom_mobile){
          $('.custom-theme.fr-toolbar .fr-command.fr-btn[data-cmd="fontSize"] img').attr('src', '//static.imweb.me/vendor/images/froala/font_size_black.png');
          // 요소에 맞게 길이 조절
          var tbPadding = 10;
          var tbWidth = 0;
          $fr_btn_grp.children(".fr-btn, .fr-separator, .fr-btn-wrap").filter(function(){
            return $(this).css('display') !== 'none';
          }).each(function(index){
            tbWidth += Math.ceil($(this).outerWidth(true));
          });
          tbWidth += tbPadding * 2;
          $fr_btn_grp.width(tbWidth);
          $fr_btn_grp.css('padding', '0 ' + tbPadding + 'px');
          // 스크롤 수동 구현(Froala 에디터 내부에서 터치 이벤트 가로채기로 overflow scroll이 동작하지 않음)
          var touchStart = false;
          var scrollStart = false;
          var touchStartX = false;
          var beforeX = false;
          var tbLeftEnd = (tbWidth - $(window).width()) * -1;
          $fr_btn_grp.on(pointerDownName, function(e){
            scrollStart = false;
            beforeX = false;
            touchStart = true;
            if(pointerDownName !== 'touchstart'){
              touchStartX = e.originalEvent.pageX;
            }else{
              touchStartX = e.originalEvent.touches[0].pageX;
            }
          });
          $fr_btn_grp.off(pointerMoveName).on(pointerMoveName, function(e){
            // 글꼴 크기 등 드롭다운이 내려가 있을 때는 움직이면 안됨
            if(touchStart && $tb.find('.fr-dropdown.fr-active').length === 0 && $tb.find('.fr-popup.fr-active').length === 0){
              if(pointerMoveName !== 'touchmove'){
                var nowX = e.originalEvent.pageX;
              }else{
                var nowX = e.originalEvent.touches[0].pageX;
              }
              var tbOffset = $fr_btn_grp.offset();
              if(scrollStart){
                var tbX = tbOffset.left + nowX - beforeX;
                if(tbX > 0){
                  tbX = 0;
                }else if(tbX < tbLeftEnd){
                  tbX = tbLeftEnd;
                }
                $fr_btn_grp.offset({top : tbOffset.top, left : tbX});
                beforeX = nowX;
              }else if(Math.abs(touchStartX - nowX) > 50){
                scrollStart = true;
                var tbX = tbOffset.left + nowX - touchStartX;
                if(tbX > 0){
                  tbX = 0;
                }else if(tbX < tbLeftEnd){
                  tbX = tbLeftEnd;
                }
                $fr_btn_grp.offset({top : tbOffset.top, left : tbX});
                beforeX = nowX;
              }
            }
          });
          $(window).on(pointerUpName, function(e){
            touchStartX = false;
            scrollStart = false;
            beforeX = false;
            touchStart = false;
          });
          if(!IS_MOBILE){
            $fr_btn_grp.on('mousewheel', function(e){
              if($tb.find('.fr-dropdown.fr-active').length === 0 && $tb.find('.fr-popup.fr-active').length === 0){
                var tbOffset = $fr_btn_grp.offset();
                var tbX = tbOffset.left + e.originalEvent.wheelDelta;
                if(tbX > 0){
                  tbX = 0;
                }else if(tbX < tbLeftEnd){
                  tbX = tbLeftEnd;
                }
                $fr_btn_grp.offset({top : tbOffset.top, left : tbX});
                e.preventDefault();
                e.stopPropagation();
              }
            });
            $fr_btn_grp.on('mouseleave', function(e){
              touchStartX = false;
              scrollStart = false;
              beforeX = false;
              touchStart = false;
            })
          }
          // 리사이즈 후 툴바 위치 조정
          var tbOffset = $fr_btn_grp.offset();
          if(tbOffset.left < tbLeftEnd){
            $fr_btn_grp.offset({top : tbOffset.top, left : tbLeftEnd});
          }
          // v3 팝업 및 드롭다운 위치 설정 로직 변경으로 인해 팝업 및 드롭다운 위치 설정 별도 작성
          $('.fr-toolbar .fr-command.fr-btn[data-cmd="textColor"]').on('click', function(e){
            var btnOffsetLeft = $(this).offset().left;
            var $popup = $('.fr-popup');
            var popup_width = $popup.width();
            if(btnOffsetLeft < tbPadding){
              btnOffsetLeft = tbPadding;
            }else if(btnOffsetLeft + popup_width > $(window).width() - tbPadding){
              btnOffsetLeft = $(window).width() - tbPadding - popup_width;
            }
            $popup.offset({left: btnOffsetLeft});
          });
          $('.fr-toolbar .fr-command.fr-btn.fr-dropdown').on('click', function(e){
            var btnOffsetLeft = $(this).offset().left;
            var $dropdown_menu = $(this).next('.fr-dropdown-menu');
            var dropdown_menu_width = $dropdown_menu.width();
            if(btnOffsetLeft < tbPadding){
              btnOffsetLeft = tbPadding;
            }else if(btnOffsetLeft + dropdown_menu_width > $(window).width() - tbPadding){
              btnOffsetLeft = $(window).width() - tbPadding - dropdown_menu_width;
            }
            $dropdown_menu.offset({left: btnOffsetLeft});
          });
        }else{
          $('.custom-theme.fr-toolbar .fr-command.fr-btn[data-cmd="fontSize"] img').attr('src', '//static.imweb.me/vendor/images/froala/font_size_white.png');
          $fr_btn_grp.off(pointerMoveName);
          $fr_btn_grp.off('mousewheel');
          $fr_btn_grp.css('left', '');
          $fr_btn_grp.css('top', '');
          $fr_btn_grp.css('padding', '');
          $fr_btn_grp.css('width', '');
        }
      }
      $('#mobile_vod_upload').off('click').on('click',function(){
        var $btn = $(this);

        var $popup = froala3.popups.get('video.insert');
        if (!$popup) $popup = _initInsertPopup();

        if (!$popup.hasClass('fr-active')){
          froala3.popups.refresh('video.insert');
          froala3.popups.setContainer('video.insert', froala3.$tb);

          var scroll_top = $(window).scrollTop();
          var left = $btn.offset().left + $btn.outerWidth() / 2;
          var top = $btn.offset().top + (froala3.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);
          froala3.popups.show('video.insert', 1350,30, $btn.outerHeight());
          $popup.css({
            'position':'fixed',
            'top':100,
            'left':60
          });
          $popup.find('.fr-arrow').hide();
        }
      });

      if(android_version() == 4){
        froala3.toolbar.hide();
      }
			const emoticonStatus = window.localStorage.getItem('emoticon')
			that.toggleValue =  emoticonStatus ? emoticonStatus:'emoji';
      that.selector = selector
      that.theme = "black"
      that.toolbarSelector = that.$tb[0] ? that.$tb[0] : document.querySelector("#toolbarContainer")
      that.emoticonButton = that.toolbarSelector.querySelector("[id^='emoticons-']")
      that.toggleButton = that.toolbarSelector.querySelector("select.tab-toggle")
      that.changeColorThemeOfToggleButton = function () {
        let toggleButtonBackground = that.toolbarSelector.querySelector('.toggle_background'); //
        toggleButtonBackground.style.backgroundColor = 'white';
        that.toggleButton = that.toolbarSelector.querySelector("select.tab-toggle")
        that.toggleButton.style.backgroundColor = 'white';
        that.toggleButton.style.fontColor = 'black';
      }
      that.handleEmoticonBox = function () {
        if (that.theme == 'white') {
          that.changeColorThemeOfToggleButton();
        }
        that.emoticonButton = that.toolbarSelector.querySelector("[id^='emoticons-']")
        that.toggleButton = that.toolbarSelector.querySelector("select.tab-toggle") //toggle버튼 select
        that.toggleButton.value = that.toggleValue

        window.localStorage.setItem('emoticon', that.toggleValue);
        that.emoticonButton.addEventListener('click', () => { //열기버튼을 누르면
          that.activateToggle() //toggle 이벤트 활성화
        })
      }
      that.activateToggle = function () {
        if (that.theme == 'white') {
          that.changeColorThemeOfToggleButton();
        }
        that.handleToggleButton()
      }
      that.handleToggleButton = function () {
        that.toggleButton = that.toolbarSelector.querySelector("select.tab-toggle") //toggle버튼 select
        that.toggleButton.value = that.toggleValue;
        that.toggleButton.addEventListener('change', function () { //이벤트 활성화
          that.toggleValue = that.toggleButton.value;
          window.localStorage.setItem('emoticon', that.toggleButton.value);
          that.opts.emoticonsUseImage = that.toggleValue == "emoji" ? false : true; //클릭하면  이모티콘 방식 변환
          that.popups.hide("emoticons") //emoticons 팝업 가려짐
          that.deleteAndJustifyEmoticonBox();
        })

      }

      that.deleteAndJustifyEmoticonBox = function () {
        let emoticonBox = that.toolbarSelector.querySelectorAll(".fr-popup");
        const deleteEmoticonBox = new Promise(function () {
          emoticonBox.forEach((e, i) => {
            e.remove()
          })
        });
        const reopenEmoticonPopup = new Promise(function () {
          that.emoticons.showEmoticonsPopup() //다시 열기 => 이 과정에서 객체 초기화 다시 필요.
        })
        Promise.all([deleteEmoticonBox, reopenEmoticonPopup])
        that.activateToggle()
      }
      FroalaEditor.RegisterCommand("setEmoticonCategory", {
        callback: function (e, c) {
          const that = FroalaEditor(this.selector)
          that.emoticons.setEmoticonCategory(c);
          that.activateToggle();
        }
      })
      FroalaEditor.RegisterCommand("emoticons", {
        callback: function() {

          const that = FroalaEditor(this.selector)
					const emoticonStatus = window.localStorage.getItem('emoticon')
					that.toggleValue =  emoticonStatus ? emoticonStatus:'emoji';
          that.opts.emoticonsUseImage = that.toggleValue == 'froala' ? true : false; //클릭하면  이모티콘 방식 변환

          let emoticonBox = document.querySelectorAll(".fr-popup.fr-desktop.custom-theme");
          emoticonBox.forEach((e,i)=>{ e.remove()})
          that.popups.isVisible("emoticons") ? (that.$el.find(".fr-marker").length && (that.events.disableBlur(), that.selection.restore()), that.popups.hide("emoticons")) : that.emoticons.showEmoticonsPopup()
          that.handleEmoticonBox();
        }
      });
		FroalaEditor.RegisterCommand("insertEmoticon", {
			callback: function(e, c, d) {
				this.html.insert(d);
				this.popups.hide("emoticons");
				extend_option.change_content();
			}
		});


    },
    'contentChanged': function(){
      extend_option.change_content();
    },
    'paste.before': function(original_event){
      //ios기기에 스크롤컨테이너를 찾지못하는 에디터 버그때문에 유저에이전트를 일시적으로 변조함
      // TODO v3에서 해당 버그 남아있는지 확인하고 수정되었으면 제거할 것
      if(this.helpers.isIOS()){
        ios_tmp_agent = navigator.userAgent;
        window.navigator.__defineGetter__('userAgent', function () {
          return 'Mozilla/5.0 (android; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206 CUSTOM';
        });
      }
    },
    'paste.beforeCleanup': function(clipboard_html){
      if(ios_tmp_agent !== ""){
        window.navigator.__defineGetter__('userAgent', function () {
          return ios_tmp_agent;
        });
      }
      extend_option.change_content();
    },
    'keyup': function(keyupEvent){
      if(this.fullscreen.isActive()){
        if(keyupEvent.key == 'Escape' || keyupEvent.key == 'Esc'){
          this.fullscreen.toggle();
        }
      }
    },
  };
  var extend_events_option = $.extend(default_events_option, events_option);		// 기본 events 옵션에 커스텀 events 옵션 대치
  default_option = $.extend(default_option, {'events': extend_events_option});		// 기본 옵션에 events 옵션 추가
  var extend_option = $.extend(default_option, option);		// 기본 옵션에 커스텀 옵션 추가(커스텀 events_option이 아닌 커스텀 option에 events 옵션이 포함된 경우 기존 events_option을 무시하고 대체)
  extend_option = $.extend(extend_option, {'file_list_obj':''});
  if(extend_option.mobile_custom && extend_option.toolbarButtonsMobile){
    // toolbarButtonsXS와 별개로 모바일에서만 보이는 버튼 설정
    extend_option = $.extend(extend_option, {
      toolbarButtonsXS : extend_option.toolbarButtonsMobile
    });
  }
  var lang_code = 'ko';		// froala editor의 언어 코드
  var html_lang_code = $('html').attr('lang').trim();
  if ( html_lang_code !== '' ) {
    switch(html_lang_code){
      case 'zh-Hans':
        lang_code = 'zh_cn';
        break;
      case 'zh-tw':
        lang_code = 'zh_tw';
        break;
      default:
        lang_code = html_lang_code;
        break;
    }
  }

  var unit_lang_code = $('#toolbarContainer').attr('data-lang');		// 다국어 사이트 언어 코드
  switch(unit_lang_code){
    case 'EN':
      lang_code = 'default';
      break;
    case 'JA':
      lang_code = 'ja';
      break;
    case 'CN':
      lang_code = 'zh_cn';
      break;
    case 'VI':
      lang_code = 'vi';
      break;
    case 'ES':
      lang_code = 'es';
      break;
    case 'zh-TW':
      lang_code = 'zh_tw';
      break;
    case 'KR':
      lang_code = 'ko';
      break;
  }
  extend_option = $.extend(extend_option, {language: lang_code});
  if(android_version() != 4){
    extend_option = $.extend(extend_option, {toolbarContainer: $('#toolbarContainer').get(0)});
  }

  var froala3 = new FroalaEditor(selector, extend_option);
  return froala3;
};

//setFroala3 - Froala Editor v3 테스트
//셀렉터와 옵션을 인자로 받는 함수로 변경함
(function($){
  var android_que = [];
  var post_image_que = [];
  $.fn.setFroala = function(selector, option, events_option){
    setFroala(selector, option, events_option);
  };
})(jQuery);




//////////////////////////////////////////////////////////////////////////////

//cocoaDataExtend
$(function(){
	/**
	 * @param o_data
	 * @param n_data
	 */
	$.cocoaDataExtend = function(o_data, n_data){
		return $.extend({}, o_data, n_data);
	}
});

//cocoaDialog - 다국어 포함
$(function(){
	const cocoaDialogDefaultSettings = {
		preventHide: false,
	};

	/**
	 * @type {{obj: (*|jQuery|HTMLElement), open: Function, close: Function, default_setting: Function, delete_popup: string, delete_setting: Function, widget_setting: Function}}
	 * @example * $.cocoaDialog.open({type:'', terms: ''}, callback)
	 */
	$.cocoaDialog = {
		modal_type : 'main',
		obj : $('#cocoaModal'),
		use_enter : false,
		body_scroll_width: 0,
		/** 공유 옵션이므로 사용 후 초기화 필요 */
		settings: { ...cocoaDialogDefaultSettings },
		setSettings: function(settings) {
			this.settings = { ...this.settings, ...settings };
		},
		setDefaultSettings: function() {
			this.settings = { ...cocoaDialogDefaultSettings };
		},
		open : function(o, callback){
			const range = window.document.createRange();
			const cocoaModal
				= Array.from(window.document.querySelectorAll('.modal')).filter(isJQueryVisible).length === 0
				? window.document.getElementById('cocoaModal')
				: window.document.getElementById('cocoaSubModal');
			if (cocoaModal === null) {
				console.warn('Not found: #cocoaModal');
				return;
			}
			const modalBody = cocoaModal.querySelector('.modal-content');
			if (modalBody === null) {
				console.warn('Not fount: .modal-content');
				return;
			}




			// legacy
			var that = this;

			if($('.modal:visible').length > 0)
				this.obj = $('#cocoaSubModal');
			else
				this.obj = $('#cocoaModal');
			if(typeof this.obj.find('.modal-dialog').data('uiDraggable') != 'undefined'){
				this.obj.find('.modal-dialog').draggable('destroy');
			}

			if (this.obj.attr('id') === 'cocoaModal') {
				this.body_scroll_width = window.innerWidth - document.documentElement.clientWidth;

				if (this.body_scroll_width) {
					$('body').data('prev_padding_right', document.body.style.paddingRight);
					$('body').css('padding-right', `${this.body_scroll_width}px`);
				}
			}

			this.obj.removeAttr('class');
			this.obj.addClass('modal in');
			$('body').toggleClass('modal-open', true);
			$('html').toggleClass('modal-scroll-control', true);
			if(this.obj.attr('id') == 'cocoaSubModal')
				this.obj.addClass('submodal');
			this.obj.toggleClass('modal_' + o.type, true);
			if(o.type == 'widget')
				this.obj.toggleClass('modal_widget_' + o.widget_type, true);

			if(o.type) {
				if ($(this.obj).find('.modal-dialog').css('inset') && (o.type === 'widget' || o.type.includes('section')))
					$(this.obj).find('.modal-dialog').css('inset', '');
			}

			/**
			 * withFroalaEditor 옵션이 true인 경우, with-fr-editor class 추가
			 * FroalaEditor의 input(링크 설정 등)이 동작하지 않는 오류를 방지하기 위함
			 */
			if (o.withFroalaEditor) {
				this.obj.addClass('with-fr-editor');
			}

			// width는 과거 사용하지 않는 옵션값으로 deprecated 처리, 대신 pc_width 사용
			if(typeof o.pc_width !== 'undefined' && window.innerWidth >= 768){
        this.obj.find('.modal-dialog').css('width', o.pc_width);
			}else{
				this.obj.find('.modal-dialog').css('width', '');
			}

			this.obj.off('shown.bs.modal');
			this.obj.on('shown.bs.modal', function(e){
				if(typeof o.opened == 'function')
					o.opened();

				var $focus_target = $(":focus");
				if ( !$('body').hasClass('admin') ) {
					e.isDefaultPrevented() || that.obj.one("hidden.bs.modal", function(){
						$focus_target.is(":visible") && $focus_target.trigger("focus");
					});
				}
			});

			this.obj.off('hidden.bs.modal');
			this.obj.on('hidden.bs.modal', function(e){
				$('html').toggleClass('modal-scroll-control', false);
				$('body').off('keyup.delete_setting');
				if($(this).attr('id') == 'cocoaSubModal') {
					$('body').toggleClass('modal-open', true);
				}

				if ($(this).attr('id') === 'cocoaModal') {
					that.restore();
				}
			});

			if(typeof o.hide_event == 'function'){
				this.obj.on('hide.bs.modal', o.hide_event);
			}


			if(typeof o.close_block == 'undefined')
				o.close_block = false;
			if(o.close_block){
				this.obj.data('bs.modal',false);
				this.obj.attr('data-backdrop','static');
				this.obj.attr('data-keyboard','false');
				this.obj.data('backdrop','static');
				this.obj.data('keyboard','false');
			}else{
				this.obj.data('bs.modal',false);
				this.obj.attr('data-backdrop','true');
				this.obj.attr('data-keyboard','true');
				// if(navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.indexOf("msie") != -1) //ie에서만 모달에 탭인덱스 적용
				// 	this.obj.attr('tabindex','-1');//esc로 모달 닫기
				this.obj.data('backdrop','true');
				this.obj.data('keyboard','true');
			}
			this.obj.find('.modal-content').css({ 'transform' : '', 'opacity' : '', });

			switch(o.type){
				case 'delete':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.delete_popup)
						.end()
						.modal();
					that.delete_setting(callback);
					break;
				case 'save':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.save_popup)
						.end()
						.modal();
					that.save_setting(callback);
					break;
				case 'alert':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.alert_popup)
						.end()
						.modal();
					that.alert_setting(callback);
					break;
				case 'alert_btn':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.alert_btn_popup)
						.end()
						.modal();
					that.alert_btn_setting(o, callback);
					break;
				case 'alert_responsive':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.alert_responsive_popup)
						.end()
						.modal();
					that.alert_responsive_setting(o, callback);
					break;
				case 'alert_clay':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.alert_clay_popup)
						.end()
						.modal();
					that.alert_clay_setting(o, callback);
					break;
				case 'alert_designmode_restore':
					this.obj.addClass('modal_alert_designmode');
				case 'alert_designmode':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.alert_designmode_popup)
						.end()
						.modal();
					that.alert_designmode_setting(o, callback);
					break;
				case 'page_add' :
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(that.page_add_popup)
						.end()
						.modal();
					that.page_add_setting(callback);
					break;
				case 'widget_add':
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(o.custom_popup)
						.end()
						.modal();
					break;
				case 'prod_detail_from_shopping_list': {
					modalBody.replaceChildren();
					const modalContent = range.createContextualFragment(o.custom_popup);
					modalBody.append(modalContent);
					$(cocoaModal).modal();
					break;
				}
				case 'widget':
				default :
					this.obj
						.find('.modal-dialog')
						.end()
						.find('.modal-content')
						.children().detach()
						.end()
						.append(o.custom_popup)
						.end()
						.modal();

					this.obj.find('.modal-dialog').draggable({
						handle: "._drag_modal",
						containment: this.obj,
						stop: function(){
							$('.modal-dialog').toggleClass('ui-draggabled', true);
							$('.modal-dialog').css('width', '');
						}
					});

					if(typeof callback == 'function')
						callback();
					break;

			}

			if(o.terms){
				this.obj.find('.modal-header').html(o.terms);
			}

			/**
			 * Backdrop 여부
			 * false 일 경우 배경색 투명하게 처리
			 * default true
			 */
			o.backdrop = o.backdrop ?? true;
			if (!o.backdrop) {
				$('.modal-backdrop.in').css('background-color', 'transparent');
			}

			// Initialize Tooltips
			$('[data-toggle="tooltip"], .enable-tooltip').tooltip({container: this.obj, animation: false});
			// Initialize Popovers
			$('[data-toggle="popover"], .enable-popover').popover({container: this.obj, animation: true});

			if ( typeof o.use_enter != "undefined" ) {
				this.use_enter = (o.use_enter === true);
			}

			/* 모달 스크롤이 생기는 경우 body 스크롤이 아니기 때문에 모달 뒤의 내용이 스크롤 아래로 들어가는 문제가 있어 padding으로 보정 */
			var scrollbar_width = this.obj[0].offsetWidth - this.obj[0].clientWidth;
			if(scrollbar_width > 0){
				document.body.style.paddingRight = scrollbar_width + 'px';
			}

			// 닫기 툴팁 활성화
			var $tooltip = this.obj.find('[data-dismiss=modal]');
			if ($tooltip) {
				// 닫기 아이콘이 있는지 확인 & bootstrap 툴팁 속성추가
				$tooltip.has('.btl.bt-times')
					.attr('data-toggle', 'tooltip')
					.attr('data-placement', 'bottom')
					.attr('data-original-title', getLocalizeString('버튼_닫기', '', '닫기'));
				// 툴팁 활성화
				$tooltip.tooltip();
			}

			if (o.type !== 'page_add') {
				$(document.activeElement).blur();
				// 그래도 안 없어진 애들은 이걸로..
				setTimeout(function(){
				  $(document.activeElement).blur();
				}, 1);
			}
			/* 모달에 autoFocus 가능하게 하는 기능 */
			if (o.type == 'widget_search'){
				setTimeout(()=>{
					this.obj.find('#search_input').focus();
				}, 0);
			}
      /*
      * o.max_width : number
      * ex) o.max_width : 380
      * */
      if (o.max_width){
        this.obj.find('.modal-content').css('max-width', o.max_width);
      }
      if (o.min_width){
        this.obj.find('.modal-content').css('min-width', o.min_width);
      }
      /*
      * o.margin_auto : boolean
      * */
      if (o.margin_auto ){
        this.obj.find('.modal-content').css('margin', 'auto');
      }
		},
		hide : function(){
			/*
			* 특정 로직에서 강제로 hide 함수를 호출하는 로직이 존재
			* 이것을 방지하기 위해 해당 조건을 추가
			*/
			if (this.settings.preventHide) {
				return;
			}

			if($('.submodal:visible').length > 0){
				this.obj = $('#cocoaSubModal');
			}else{
				this.obj = $('#cocoaModal');
				document.body.style.paddingRight = 0;
			}
			this.obj.modal('hide');
		},
		modalControl : function(event) {
			if ( !this.isOpen() ) return false;
			var code = event.keyCode;
			var keyboardOption = this.obj.attr('data-keyboard') === 'true';

			// ESC 눌렀을 경우 - 닫기
			var ESC_KEY_CODE = 27;
			var $cancel_btn = this.obj.find('._cancel');
			if ( code === ESC_KEY_CODE && keyboardOption ) {
				if ( $cancel_btn.length > 0 ) {
					$cancel_btn.trigger('click');
				} else {
					this.hide();
				}
			}

			// ENTER 눌렀을 경우 - 확인 버튼
			var ENTER_KEY_CODE = 13;
			var $submit_btn = this.obj.find('._submit, ._add_btn, ._confirm');
			if ( code === ENTER_KEY_CODE ) {
				if ( $submit_btn.length > 0 ) {
					if ( this.isContainFormElements() ) {
						if ( this.use_enter ) {
							$submit_btn.trigger('click');
						} else {
							// 폼 입력 및 선택 요소가 존재할 경우 인풋에 포커스 가있는 상태에서만 적용
							if ( $(event.target).prop('tagName').toLowerCase() === 'input' ) {
								//$submit_btn.trigger('click');
							}
						}
					} else {
						// 그냥 확인 얼럿개념의 모달일 경우
						$submit_btn.trigger('click');
					}
				}
			}
		},
		isContainFormElements : function(){
			// 이거 케이스별로 좀 더 자세히 봐야 함....
			var form_elements = 'input:not(:hidden), textarea, select';
			if ( this.obj.find('form').length > 0 ) {
				return ( $(form_elements, this.obj.find('form')).length > 0 );
			} else {
				return ( $(form_elements, this.obj).length > 0 );
			}
		},
		delete_popup : '<div class="modal-header">' + getLocalizeString('설명_삭제하시겠습니까', '', '삭제하시겠습니까?') + '</div><div class="btn-group btn-group-justified" role="group" aria-label="Justified button group"> <a href="javascript:;" id="dialog_popup_cancel"class="bt bt-default" role="button">' + getLocalizeString('설명_취소', '','취소') + '</a> <a href="javascript:;" id="dialog_popup_delete" class="bt bt-default" role="button">' + getLocalizeString('설명_확인', '', '확인') + '</a> </div>',
		delete_setting : function(callback){
			var that = this;
			that.obj.find('#dialog_popup_delete').click(function(e){
				that.obj.modal("hide");
				callback();
			});
			that.obj.find('#dialog_popup_cancel').click(function(e){
				that.obj.modal("hide");
			});

			$('body').off('keyup.delete_setting');
			$('body').on('keyup.delete_setting', function(e){
				cancelPropagation(e);
				if(e.keyCode == 13){
					that.obj.modal("hide");
					callback();
				}
			});
		},
		page_add_popup : '<div class="input-group"> <input type="text" class="menu_name _name" placeholder="' + getLocalizeString('설명_메뉴명입력', '', '메뉴명 입력') + '"> <span class="input-group-btn"> <button class="bt bt-default _btn" type="button">' + getLocalizeString('설명_확인', '', '확인') + '</button> </span> </div>',
		page_add_setting : function(callback){
			var that = this;
			var input = that.obj.find('._name');
			input.focus();
			that.obj.find('._btn').click(function(e){
				var name = input.val();
				callback(name);
				that.obj.modal("hide");
			});
			that.obj.find('#dialog_popup_cancel').click(function(e){
				that.obj.modal("hide");
			});

			$('body').off('keyup.delete_setting');
			$('body').on('keyup.delete_setting', function(e){
				cancelPropagation(e);
				var name = input.val();
				if(e.keyCode == 13){
					that.obj.modal("hide");
					callback(name);
				}
			});
		},
		save_popup : '<div class="modal-header">' + getLocalizeString('설명_저장하시겠습니까', '', '저장 하시겠습니까?') + '</div><div class="modal-footer"><button class="bt bt-default" id="dialog_popup_cancel">' + getLocalizeString('설명_취소', '', '취소') + '</button><button class="bt bt-primary" id="dialog_popup_save">' + getLocalizeString('설명_저장', '', '저장') + '</button></div></div>',
		save_setting : function(callback){
			var that = this;
			that.obj.off('click', '#dialog_popup_save');
			that.obj.on('click', '#dialog_popup_save', function(e){
				that.obj.modal("hide");
				callback(true);
			});

			that.obj.off('click', '#dialog_popup_cancel');
			that.obj.on('click', '#dialog_popup_cancel', function(e){
				that.obj.modal("hide");
				callback(false);
			});

			$('body').off('keyup.delete_setting');
			$('body').on('keyup.delete_setting', function(e){
				cancelPropagation(e);
				if(e.keyCode == 13){
					that.obj.modal("hide");
					callback(true);
				}
			});
		},
		alert_popup : '<div class="modal-header design_alert_header">' + getLocalizeString('설명_완료되었습니다', '', '완료되었습니다') + '</div><div class="modal-footer design_alert_popup"><button id="dialog_popup_alert" class="bt bt-flat bt-primary" type="button">' + getLocalizeString('설명_확인', '', '확인') + '</button></div>',
		alert_setting : function(callback){
			var that = this;
			that.obj.off('click', '#dialog_popup_alert');
			that.obj.on('click', '#dialog_popup_alert', function(e){
				callback(true);
				that.obj.modal("hide");
			});
		},
		alert_btn_popup : '<div class="modal-header"><button type="button" class="close _modal_close" data-dismiss="modal" aria-label="Close"><i class="btl bt-times" style="padding:4px"></i></button><h4 class="modal-title _modal_title text-center font-kakao"></h4></div>'
			+ '<div class="modal-body _modal_body"></div>'
			+ '<div class="modal-footer no-padding"> <div class="btn-group-justified"><a href="javascript:;" class="btn _cancel cancel"  data-dismiss="modal">' + getLocalizeString('설명_취소', '', '취소') + '</a><a href="javascript:;" class="btn btn-primary _confirm confirm" id="dialog_popup_alert_btn">' + getLocalizeString('설명_확인', '', '확인') + '</a></div></div>',
		alert_btn_setting : function(o, callback){
			var that = this;
			if(o.title){
				that.obj.find('._modal_title').text(o.title);
			}
			if(o.content){
				that.obj.find('._modal_body').html(o.content);
			}
			if(o.confirm_text){
				that.obj.find('._confirm').text(o.confirm_text);
			}
			if(o.cancel_text){
				that.obj.find('._cancel').text(o.cancel_text);
			}else{
				that.obj.find('._cancel').remove();
				that.obj.find('._confirm').css('border-radius', '0 0 3px 3px');
			}
			if(o.close_block){
				that.obj.find('._modal_close').remove();
				$('body').on('keydown.alert_btn', function(e){
					if(e.keyCode == 27){
						e.preventDefault();
						cancelPropagation(e);
						return false;
					}
				});
			}
			that.obj.off('click', '#dialog_popup_alert_btn');
			that.obj.on('click', '#dialog_popup_alert_btn', function(e){
				that.obj.modal("hide");
				callback();
			});
		},
		alert_responsive_popup : '<div class="modal-body _modal_body text-14"></div>'
			+ '<div class="modal-footer no-padding"> <a href="javascript:;" class="btn _cancel cancel"  data-dismiss="modal">' + getLocalizeString('설명_취소', '', '취소') + '</a><a href="javascript:;" class="btn _confirm confirm" id="dialog_popup_alert_btn">' + getLocalizeString('설명_확인', '', '확인') + '</a></div>',
		alert_responsive_setting : function(o, callback){
			var that = this;
			if(o.content){
				that.obj.find('._modal_body').html(o.content);
			}
			if(o.confirm_text){
				that.obj.find('._confirm').text(o.confirm_text);
			}
			if(o.cancel_text){
				that.obj.find('._cancel').text(o.cancel_text);
			}else{
				that.obj.find('._cancel').remove();
			}
			if(o.close_block){
				that.obj.find('._modal_close').remove();
				$('body').on('keydown.alert_btn', function(e){
					if(e.keyCode == 27){
						e.preventDefault();
						cancelPropagation(e);
						return false;
					}
				});
			}
			that.obj.off('click', '#dialog_popup_alert_btn');
			that.obj.on('click', '#dialog_popup_alert_btn', function(e){
				that.obj.modal("hide");
				if(typeof callback === 'function') callback();
			});
		},
		alert_clay_popup : '<div class="modal-header"><button type="button" class="close _modal_close" data-dismiss="modal" aria-label="Close"><i class="btl bt-times"></i></button><h4 class="modal-title _modal_title"></h4></div><div class="modal-body _modal_body"></div>'
			+ '<div class="modal-footer"> <a href="javascript:;" class="btn _cancel cancel"  data-dismiss="modal">' + getLocalizeString('설명_취소', '', '취소') + '</a><a href="javascript:;" class="btn btn-primary _confirm confirm" id="dialog_popup_alert_btn">' + getLocalizeString('설명_확인', '', '확인') + '</a></div>',
		alert_clay_setting : function(o, callback){
			var that = this;
			if(o.title){
				that.obj.find('._modal_title').html(o.title);
			}
			if(o.content){
				that.obj.find('._modal_body').html(o.content);
			}
			if(o.confirm_text){
				that.obj.find('._confirm').text(o.confirm_text);
			}
			if(o.cancel_text){
				that.obj.find('._cancel').text(o.cancel_text);
			}else{
				that.obj.find('._cancel').remove();
			}
			if(o.close_block){
				that.obj.find('._modal_close').remove();
				$('body').on('keydown.alert_btn', function(e){
					if(e.keyCode == 27){
						e.preventDefault();
						cancelPropagation(e);
						return false;
					}
				});
			}
			that.obj.off('click', '#dialog_popup_alert_btn');
			that.obj.on('click', '#dialog_popup_alert_btn', function(e){
				that.obj.modal("hide");
				if(typeof callback === 'function') callback();
			});
		},
		alert_designmode_popup : '<div class="modal-body _modal_body text-14"></div>'
			+ '<div class="modal-footer _modal_footer no-padding"><div class="btn-wrap"><a href="javascript:;" class="btn _cancel cancel" data-dismiss="modal">' + getLocalizeString('설명_취소', '', '취소') + '</a><a href="javascript:;" class="btn _confirm confirm" id="dialog_popup_alert_btn">' + getLocalizeString('설명_확인', '', '확인') + '</a></div></div>',
		alert_designmode_setting : function(o, callback){
			var that = this;
			if(o.content){
				that.obj.find('._modal_body').html(o.content);
			}
			if(o.footer_content){
				that.obj.find('._modal_footer').prepend(o.footer_content);
			}
			if(o.confirm_text){
				that.obj.find('._confirm').text(o.confirm_text);
			}
			if(o.cancel_text){
				that.obj.find('._cancel').text(o.cancel_text);
			}else{
				that.obj.find('._cancel').remove();
			}
			if(o.close_block){
				that.obj.find('._modal_close').remove();
				$('body').on('keydown.alert_btn', function(e){
					if(e.keyCode == 27){
						e.preventDefault();
						cancelPropagation(e);
						return false;
					}
				});
			}
			that.obj.off('click', '#dialog_popup_alert_btn').on('click', '#dialog_popup_alert_btn', function(e){
				that.obj.modal("hide");
				if(typeof callback === 'function') callback();
			});
		},
		close : function(){
			$('#cocoaSubModal').modal("hide");
			$('#cocoaModal').modal("hide");
		},
		isOpen : function(){
			if($('#cocoaModal').css('display')=='block')
				return true;
			if($('#cocoaSubModal').css('display')=='block')
				return true;
			return false;
		},
		restore: function () {
			$('body').css('padding-right', $('body').data('prev_padding_right'));
		}
	};
});

/**
 * 버튼 클릭 시 해당 위치에서 출력되는 모달
 * (현재 대시보드만 css 대응되어있음, 다른 곳에서 사용 시 css 대응할 것)
 */
$(function(){
	$.cocoaStickerModal = {
		default_option: {
			id: 'cocoaStickerModal',
			target: document.body,		// fixed된 target 아래에 출력됨, fixed 되지 않은 대상에 사용하려면 추가 구현할 것
			html: '',
			width: '320px',		// px 외에 다른 단위도 사용할 수 있어 string 그대로 받음
			top: 0,		// 추가 Y축 보정 위치, px(단위 제외)
			left: 0,		// 추가 X축 보정 위치, px(단위 제외)
			bottom: 'auto',     // bottom 기준 Y축 보정 위치, 사용 시 top 무시
			mobile_full: true,		// 모바일에서 전체화면으로 표시
			forceLeft: false,		// left 위치 강제 적용
		},
		open: function(o, callback, close_callback){
			var that = this;
			var o = $.extend({}, that.default_option, o);
			var $target = $(o.target);
			var $modal_content = $('<div class="modal-content"></div>').append(o.html);
			var $cocoa_sticker_modal = $('<div class="modal cocoa-sticker-modal" id="' + o.id + '"></div>').append($modal_content);
			$('body').append($cocoa_sticker_modal);
			if(window.innerWidth < 768 && o.mobile_full){
				// 모바일 전체화면
				setTimeout(function(){
					$modal_content.css({
						'top': 0
					}).focus();
					$cocoa_sticker_modal.find('button.close').on('click', function(){
						that.close(o.id, o.mobile_full, close_callback);
					});
					setTimeout(function(){
						if(typeof callback == 'function')
							callback();
					}, 200);
				}, 10);
			}else{
				const leftPos = o.forceLeft ? o.left : $target.offset().left - $(window).scrollLeft() + o.left;

				if(o.bottom !== 'auto'){
					// bottom이지만 계산 후 top으로 적용
					$modal_content.css({
						'width': o.width,
						'top': $target.offset().top - $(window).scrollTop() - $modal_content.height() - o.bottom,
						'left': leftPos,
					});
				}else{
					$modal_content.css({
						'width': o.width,
						'top': $target.offset().top + $target.outerHeight() - $(window).scrollTop() + o.top,
						'left': leftPos,
					});
				}
				$modal_content.fadeIn(200, function(){
					if(typeof callback == 'function')
						callback();
				}).focus();
				$cocoa_sticker_modal.on('click', function(e){
					if($(e.target).parents('.modal-content').length === 0){
						that.close(o.id, o.mobile_full, close_callback);
					}
				});
			}
		},
		close: function(id, mobile_full = true, callback){
			var that = this;
			var target_id = id ?? that.default_option.id;
			var $modal = $("#" + target_id);
			if(window.innerWidth < 768 && mobile_full){
				// 모바일 전체화면
				var $modal_content = $modal.find('.modal-content');
				$modal_content.css({
					'top': '100%'
				});
				setTimeout(function(){
					$modal.remove();
					setTimeout(function(){
						if(typeof callback == 'function')
							callback();
					}, 200);
				}, 200);
			}else{
				$modal.off('click');
				$modal.fadeOut(200, function(){
					$modal.remove();
					setTimeout(function(){
						if(typeof callback == 'function')
							callback();
					}, 200);
				});
			}
		},
		isOpen: function(id){
			var that = this;
			var target_id = id ?? that.default_option.id;
			var $modal = $("#" + target_id);
			return $modal.css('display')==='block';
		}
	};
});

/**
 * 화면 상단에 일시적으로 표시되는 토스트 알림
 * (현재 대시보드만 css 대응되어있음, 다른 곳에서 사용 시 css 대응할 것)
 */
$(function(){
	$.cocoaToast = {
		default_option: {
			html: '',
			autohide: true,
			delay: 1000,
      opacity: 0.8,
			clay: false,
		},
		show: function(o, callback){
			var that = this;
			var option = o;
			if(typeof option.id === 'undefined') option.id = makeUniq('cocoaToast_');
			if(option.clay && typeof option.opacity === 'undefined') option.opacity = 1;
			option = $.extend({}, that.default_option, option);
			if(that.isOpen({id: option.id})) $("#" + option.id).remove();
			var $toast_content = $('<div class="toast-content"></div>').append(option.html);
			var $cocoa_toast = $('<div class="cocoa-toast' + (option.clay ? ' clay-toast' : '') + '" id="' + option.id + '"></div>').append($toast_content);
			$('body').append($cocoa_toast);
			$cocoa_toast.show().css({
				'-webkit-transform': 'translate(0, 0)',
				'-ms-transform': 'translate(0, 0)',
				'-o-transform': 'translate(0, 0)',
				'transform': 'translate(0, 0)',
				'opacity': option.opacity,
			});
			setTimeout(function(){
				if(typeof callback == 'function')
					callback();
				if(option.autohide){
					setTimeout(function(){
						that.close({id: option.id})
					}, option.delay);
				}
			}, 600);
		},
		close: function(o){
			var that = this;
			var option = o;
			if(typeof option.id === 'undefined') return false;
			option = $.extend({}, that.default_option, o);
			var $toast = $("#" + option.id);
			$toast.css({
				'-webkit-transform': 'translate(0, -16px)',
				'-ms-transform': 'translate(0, -16px)',
				'-o-transform': 'translate(0, -16px)',
				'transform': 'translate(0, -16px)',
				'opacity': 0
			});
			setTimeout(function(){
				$toast.remove();
			}, 600);

		},
		isOpen: function(o){
			var that = this;
			var option = o;
			if(typeof option.id === 'undefined') return false;
			option = $.extend({}, that.default_option, option);
			var $toast = $("#" + option.id);
			return $toast.css('display')==='block';
		}
	}
});
//////////////////////////////////////////////////////////////////////////////

var dozProgress = function(){
	var run = 0;
	var end = 0;
	var init = function(){
		if(typeof NProgress == 'undefined')
			return;
		NProgress.configure({
			minimum: 0.08,
			easing: 'linear',
			positionUsing: '',
			speed: 350,
			trickle: true,
			trickleSpeed: 250,
			showSpinner: true,
			barSelector: '[role="bar"]',
			spinnerSelector: '[role="spinner"]',
			parent: 'body',
			template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
		});
	};
	var start = function(){
		if(typeof NProgress == 'undefined')
			return;
		if(run===0){
			NProgress.start();
		}else{
			NProgress.inc();
		}
		run++;
	};

	var increase = function(amount){
		NProgress.inc(amount);
	};
	var done = function(){
		if(typeof NProgress == 'undefined')
			return;
		end++;
		if(run <= end){
			NProgress.done();
			run = 0;
			end = 0;
		}
	};
	$(function(){
		init();
	});
	return {
		'start' : function(){
			start();
		},
		'increase' : function(){
			increase();
		},
		'done' : function(){
			done();
		}
	}
}();

var carouselControl = function(){
	var tapArea, startX;
	tapArea = document.querySelectorAll('.owl-carousel');
	startX = 0;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = tapArea[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;
			item.ontouchstart = function (e) {
				startX = e.touches[0].clientX;
			};
			item.ontouchmove = function (e) {
				if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable) {
					e.preventDefault();
				}
			};
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
};

var TOKEN = function(){
	var makeToken = function(expire,type,callback){

		var add_type = '';
		if(typeof type != 'undefined') add_type = "?"+type;

		$.ajax({
			type: 'POST',
			data: {'expire':expire},
			url: '/ajax/make_token.cm'+add_type,
			dataType: 'json',
			cache: false,
			success: function (res) {
				callback(res.token,res.token_key);
			}
		});
	};

	var makeTokens = function(expire,count,callback){
		// IMWEB token endpoint disabled - return dummy tokens
		var tokens = [];
		for (var i = 0; i < count; i++) {
			tokens.push({ token: '', token_key: '' });
		}
		if (callback) callback({ tokens: tokens });
	};

	var setListToken = function(){
		var $_target = $("._token_obj");
		if ( $_target.length ) {
			TOKEN.makeTokens(86400, $_target.length, function(res){
				$_target.each(function(i, o) {
					var $that = $(o);
					$that.find("._tk_obj").val(res.tokens[i].token);
					$that.find("._tk_key_obj").val(res.tokens[i].token_key);
				});
			});
		}
	};

	return {
		"makeToken": function(expire,type,callback){
			makeToken(expire,type,callback);
		},
		"makeTokens": function(expire,count,callback){
			makeTokens(expire,count,callback);
		},
		setListToken : function(){
			setListToken();
		}
	};
}();

$(function(){
	TOKEN.setListToken();
});


/**
 * 원래는 대만쪽에서만 사용했는데
 * https://www.notion.so/imweb/5-364a1435480b4895842d704c4dfd1071
 * 홍콩 추가되면서 기능적으로는 동일하므로 같이쓰도록 변경 됨
 * @type {{init: CITY_DISTRICT_ADDRESS_LIST.init}}
 */
var CITY_DISTRICT_ADDRESS_LIST = function(){
	var address = {};
	var init = function($obj, list){
		if ( typeof list !== "undefined") {
			setList($obj.data('country'), list);
		}
		setEvent($obj);
	};

	var setList = function(key, list){
		address[key] = list;
	};
	var setEvent = function($obj){
		var $city = $obj.find('.' + $obj.data('city'));
		var $district = $obj.find('.' + $obj.data('district'));
		var $zipcode = $obj.find('.' + $obj.data('postcode'));
		var country = $obj.data('country');
		var is_use_zipcode = ( $zipcode.length > 0 );

		$city.on('change', function(){
			var _city = $(this).val();
			$district.find('option:not(._default)').remove();
			if ( is_use_zipcode ) $zipcode.val('');
			if ( typeof address[country][_city] == "undefined" ) return false;
			for ( var _district in address[country][_city] ) {
				var _district_str = _district;
				if ( is_use_zipcode ) _district_str = address[country][_city][_district] + ' ' + _district;
				$district.append('<option value="'+_district+'">'+_district_str+'</option>');
			}
		});

		$district.on('change', function(){
			var _city =  $city.val();
			var _district = $(this).val();
			if ( !is_use_zipcode ) return false;

			if ( is_use_zipcode ) $zipcode.val('');
			if ( typeof address[country][_city] == "undefined" ) return false;
			if ( typeof address[country][_city][_district] == "undefined" ) return false;
			$zipcode.val(address[country][_city][_district]);
		});
	};

	return {
		"init": function($obj, list){
			init($obj, list);
		}
	};
};

var LOCAL_STORAGE = function(){

	var setLocalStorage = function(key, value){
		localStorage.setItem(key, value);
	};

	var getLocalStorage = function(key){
		return localStorage.getItem(key);
	};

	var deleteLocalStorage = function(key){
		localStorage.removeItem(key);
	};

	return {
		'setLocalStorage' : function(key, value){
			setLocalStorage(key, value);
		},
		'getLocalStorage' : function(key){
			return getLocalStorage(key);
		},
		'deleteLocalStorage': function(key){
			deleteLocalStorage(key);
		}
	}
}();

var IMWEB_STORAGE = function(_type){
	var storage;

	this.init = function(_type) {
		switch( _type ) {
			case 'local':
				storage = window.localStorage;
				break;
			case 'session':
				storage = window.sessionStorage;
				break;
		}
	};

	this.set = function(key, value, expire) {
		if ( ! storage ) return false;
		expire = expire || 0;
		var data = {
			value: value,
			add_time: getTimestamp(),
			expire: expire
		};
		storage.setItem(key, JSON.stringify(data));
	};

	/**
	 * @param key
	 * @param expire_callback 키가 만료되었을 때 호출할 콜백함수
	 * @param expire 만료시간 ( second 단위 )
	 * @returns {null|*}
	 */
	this.get = function(key, expire_callback, expire) {
		if ( ! storage ) return null;

		var current_timestamp = getTimestamp();
		var data = storage.getItem(key);
		expire = expire || 0;
		if ( data ) {
			var data = JSON.parse(data);
			if ( data.expire > 0 && data.add_time + data.expire < current_timestamp ) {
				if ( typeof expire_callback == "function" ) {
					var value = expire_callback.apply(this, []);
					storage.set(key, value, expire);
					return value;
				} else {
					storage.removeItem(key);
				}
			} else {
				return data.value;
			}
		} else {
			return null;
		}
	};

	this.remove = function(key) {
		if ( ! storage ) return null;
		storage.removeItem(key);
	};

	this.clear = function(key_pattern) {
		if ( ! storage ) return null;
		if ( key_pattern ) {
			var reg = new RegExp(key_pattern);
			var remove_keys = [];

			var storage_length = storage.length;
			for( var i=0; i<storage_length; i++ ) {
				var _key = storage.key(i);
				if ( reg.test(_key) ) {
					remove_keys.push(_key);
				}
			}

			remove_keys.forEach(function(_key) {
				storage.removeItem(_key);
			});
		} else {
			storage.clear();
		}
	};

	var getTimestamp = function() {
		return parseInt(Date.now() / 1000);
	};

	/* 기본값 local */
	this.init(_type || 'local');
};

var IMWEB_LOCALSTORAGE = new IMWEB_STORAGE('local');
var IMWEB_SESSIONSTORAGE = new IMWEB_STORAGE('session');

var IMWEB_TEMPLATE = (function() {
	var template_list = {};

	return {
		loadSimple: function(code, data) {
			if ( template_list[code] == void 0 ) { template_list[code] = $("#" + code).html();}
			var template = template_list[code];
			return this.convert(template, data);
		},
		convert: function(template, data) {
			if ( template == void 0 ) return '';
			if ( data != void 0 ) {
				Object.keys(data).forEach(function(k) {
					template = template.replace(new RegExp("\\{" + k + "\\}", "g"), data[k]);
				});
			}
			return template;
		},
		clear: function() {
			template_list = {};
		}
	};
})();


/**
 * 브라우저에서 지원하는 이벤트 옵션을 확인한다.
 * @param {'capture' | 'once' | 'passive' | 'signal'} optionKey
 * @returns {boolean}
 */
const checkerlistenerOption = (optionKey) => {
	if (typeof window === 'undefined') {
		return false;
	}
	let supported = false;
	try {

		const options = {
			get [optionKey]() {
				supported = true;
				return;
			}
		}

		window.addEventListener("test", null, options);
		window.removeEventListener("test", null, options);
	} catch (e) {
		supported = false;
	}
	return supported;
}

/**
 * PHP의 template 요소를 convertCallback을 실행하여 변환한 후 targetElement에 추가한다.
 * @param {string} templateElementId
 * @param {string} [targetElement]
 * @param {function} [convertCallback]
 * @returns {Node | Promise<Node>}
 */
const loadTemplate = (templateElementId, targetElement, convertCallback) => {
	const $template = window.document.getElementById(templateElementId);

	console.assert($template !== null, `#${templateElementId} is not exist`);
	if ($template === null) {
		return;
	}

	// TODO: $template 태그가 template 태그가 아닐 경우 예외처리

	if ('content' in $template) {
		const $templateContent = $template.content.cloneNode(true);
		const converted = typeof convertCallback === 'function'
			? convertCallback($templateContent)
			: $templateContent;
		switch (true) {
			case targetElement instanceof Node: {
				if (converted instanceof Promise) {
					converted.then((_node) => {
						targetElement.appendChild(_node);
					});
					break;
				}
				targetElement.appendChild(converted);
				break;
			}
			case targetElement instanceof jQuery: {
				if (converted instanceof Promise) {
					converted.then((_node) => {
						targetElement.append(_node);
					});
					break;
				}
				targetElement.append(converted);
				break;
			}
			default: {
				break
			}
		}
		return converted;
	}

	return typeof convertCallback === 'function'
		? convertCallback($template.innerHTML)
		: $template.innerHTML;
}

var isIPhone = function(){
	return navigator.userAgent.match(/iPhone|iPad|iPod/i);
};
var isChrome = function(){
	return navigator.userAgent.match(/Chrome|CriOS/i);
};

// 아이폰 크롬 history 조정 문제로 예외처리
var checkUseHistory = function(){
	if(history.replaceState && history.pushState){
		// 탭 히스토리 커스텀(IE 10 이상)
		if(isIPhone() && isChrome()){
			return false;
		}else{
			return true;
		}
	}else{
		return false;
	}
};

/**
 * 유닛 다국어 코드를 moment, datetimepicker 등에서 사용하는 코드로 변환
 * @param unit_lang_code
 * @returns {string}
 */
var getMomentLangCode = function(unit_lang_code){
	switch(unit_lang_code){
		case "JA":
			return 'ja';
		case "CN":
			return 'zh-cn';
		case "zh-TW":
			return 'zh-tw';
		case "ES":
			return "es";
		case "VI":
			return "vi";
		case "KR":
			return 'ko';
		case "EN":
		default:
			return 'en';
	}
}

/**
 * 스로틀링 / 디바운싱 관련
 * 사용 예제 )
 * JS_DELAY('test', function() { console.log('test'); }).debouncing(3000);
 */
var JS_DELAY = (function() {
	var handle_list = {};
	return function(key, callback) {
		return {
			throttling: function(timeout) {
				// 스로틀링 - 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
				if ( ! handle_list[key] ) {
					handle_list[key] = setTimeout(function() { handle_list[key] = null; }, timeout);
					callback();
				}
			},
			debouncing: function(timeout) {
				// 디바운싱 - 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것
				clearTimeout(handle_list[key]);
				handle_list[key] = setTimeout(callback, timeout);
			}
		}
	};
})();


function getWesternAge(birthday) {
	// Date 객체인 birthday 를 매개변수로 받는 getWesternAge 함수 생성
	var rightNow = new Date();
	var age = rightNow.getFullYear() - birthday.getFullYear();
	// 현재 연도에서 생일 연도를 뺀 값을 age refresh_connection_queue.cm로 한다.
	var birthMonth = birthday.getMonth();
	var thisMonth = rightNow.getMonth();
	// 현재 월과 생일 월을 변수에 저장한다.
	var birthDate = birthday.getDate();
	var thisDate = rightNow.getDate();
	// 현재 날짜와 생일 날짜를 변수에 저장한다.

	// 아래 코드는 다음 흐름에 따라 작성되었다.
	// 1. 생일 월과 현재 월을 비교 (3가지 경우의 수를 if, else if, else 로 처리)
	// 2. 생일 월과 현재 월이 같을 경우, 날짜를 비교

	if (birthMonth < thisMonth) {
		return age;
	} else if (birthMonth > thisMonth) {
		return age -1;
	} else {
		if (birthDate <= thisDate) {
			return age;
		} else {
			return age -1;
		}
	}
}

var refreshConnectionQueue = (function() {
	var t = (( 2 * 60 ) * 1000);
	var c=0;
	var callback = function() {
		if ( ++c < 15 ) {
			$.ajax({
				'type': 'get',
				'url' : '/ajax/refresh_connection_queue.cm',
				'dataType' : 'json',
				'cache' : false,
				'success' : function (res) {
					if ( res.msg == 'SUCCESS' ) {
						setTimeout(callback, t);
					}
				}
			});
		}
	};
	return function() {
		setTimeout(callback, t);
	};
})();

var useDebounce = function(func, timeout = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args) }, timeout);
  }
}

var IMWEB_CSS_CLASS = function() {
	var is_support_css = false;

	var init = function() {
		is_support_css = ( typeof CSS == 'object');
	};

	this.isDisplayFlex = function() {

	};

	/* */
	init();
};

var IMWEB_CSS = new IMWEB_CSS_CLASS();

/**
 * @author @Hansanghyeon
 * @param {Function} f function
 * @param {object} i10n i10n
 * @returns async function
 */
function __(f, i10n) {
  return function(...args) {
      const i10nArgs = [i10n, ...args]
      return f.apply(this, i10nArgs);
  };
}

/**
 * toStringByFormatting(new Date(), '.') // 2022-10-28
 * @author @Hansanghyeon
 */
function toStringByFormatting(source, delimiter = '-') {
  function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
  }

  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

/**
 * var el = document.createElement("span");
 * el.innerHTML = "test";
 * var div = document.getElementById("foo");
 * insertAfter(div, el);
 *
 * <div id="foo">Hello</div>
 * <span>test</span>
 *
 * @author @Hansanghyeon
 */
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * deep clone object
 */
function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * object change
 */
function copyDifferentValues(source, target) {
  const targetData = cloneObject(target);

  for (let key in source) {
    if (source.hasOwnProperty(key) && source[key] !== targetData[key]) {
      targetData[key] = source[key];
    }
  }

  return targetData;
}

function querystringParser() {
	const tokenize = (q) => {
		return q.replace(/^\?/, '').split('&').filter(v => Boolean(v));
	}

	const parse = (token) => {
		return token.reduce((acc, cur) => {
			const [key, value] = cur.split('=');

			acc[key] = window.decodeURIComponent(value);

			return acc;
		}, {});
	}

	const refine = (parsed) => {
		const clone = { ...parsed };

		return Object.keys(clone).reduce((acc, key) => {
			let value = clone[key];

			if (/^\d+$/.test(value)) {
				value = parseInt(value, 10);
			}

			acc[key] = value;

			return acc;
		}, {});
	}

	const pipe = (...fns) => {
		return (input) => fns.reduce((previousValue, fn) => fn(previousValue), input);
	}

	return pipe(
		tokenize,
		parse,
		refine,
	);
}

function getQuerystring(obj, withSeparator = true) {
	const clone = { ...obj };

	const querystring = Object.keys(clone).reduce((acc, cur) => {
		const key = cur;
		const value = window.encodeURIComponent(clone[cur]);

		acc.push(`${key}=${value}`);

		return acc;
	}, []).join('&');

	return withSeparator ? `?${querystring}` : querystring;
}

function isValidDate(date) {
	return date && new Date(date).toString() !== 'Invalid Date';
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function isIos() {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

function scrollWindowToElement(el) {
  if (!el) return;

  return new Promise(resolve => setTimeout(() => {
    document.documentElement.style.overflowY = 'hidden';
    window.scrollTo(0, el.offsetTop);
    document.documentElement.style.overflowY = null;
    resolve();
  }, 100));
}

async function copyInnerTextById(elementId, toastMessage = '복사되었습니다.') {
	// 요소를 ID로 가져옵니다.
	const element = document.getElementById(elementId);

	// 요소가 존재하는지 확인합니다.
	if (element) {
		// innerText를 클립보드에 복사합니다.
		const textToCopy = element.innerText;

		try {
			await navigator.clipboard.writeText(textToCopy);
			// 복사 완료 메시지
			$.cocoaToast.show({
				html : toastMessage,
			});
		} catch (err) {
			alert('복사 중에 오류가 발생했습니다.');
		}
	} else {
		alert('복사 중에 오류가 발생했습니다.');
	}
}

function* serializeGenerator(obj, prefix) {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const k = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === 'object' && value !== null) {
      yield* serializeGenerator(value, k);
    } else {
      yield `${encodeURIComponent(k)}=${encodeURIComponent(value)}`;
    }
  }
}

/**
 * 객체를 URL 인코딩된 문자열로 변환합니다. jQuery의 $.param()과 유사한 기능을 수행합니다.
 * 이 함수는 중첩된 객체도 지원합니다. 내부에서 serializeGenerator를 사용하여
 * 객체를 순회하며 키-값 쌍을 생성합니다.
 * $.post -> fetch 로 변경 시 유용해요.
 * @param {Object} obj - 변환할 객체
 * @returns {string} - URL 인코딩된 문자열
 */
function serializeToUrlencoded(obj) {
  return Array.from(serializeGenerator(obj)).join("&");
}
