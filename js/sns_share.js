var SNS = function(){
	var pin_page = false;
	var snsObjList = [];
	var main_url, site_name, subject, content, image_url, link_url, security_link_url;
	var api_url;
	var kakao_loaded = false;
	var kakao_message_template_id;

	var share_type;
	var social = {};
	var additional = {};

	function SnsObjects(){
		this.name = "";
		this.show = true;
		this.order = 0;
		this.iconClass = "";
		this.type = "";
	}


	var loadKakaoApi = function(key){
		// 카카오 이미 호출되어있으면 호출하지 않음 추가
		if(kakao_loaded) return false;

		if(LIMIT_API_LIST.indexOf('kakao_link') === -1){
			try{
				if(key != undefined){
					key = key.trim();
					if(key != '' && Kakao){
						if (!Kakao.isInitialized()) {
							Kakao.init(key);
						}
						kakao_loaded = true;
					}
				}
			}catch(e){
			}
		}
	};

	var init = function(d){
		// 상품&예약 상세페이지 데이터는 고정
		if(pin_page) return false;

		var data = d;

		if (data.kakao_api_key !== undefined){
			loadKakaoApi(data.kakao_api_key);
			kakao_message_template_id = data.kakao_message_template_id;
		}

		main_url = data._main_url;
		site_name = data._site_name;
		subject = data._subject;
		content = data._body === null ? '' : makeShareContent(data._body);
		image_url = data._img;
		link_url = data._post_url;
		security_link_url = data._security_post_url;
		api_url = "https://sns.imweb.me/?url=";

		social = data._social;
		additional = data._additional;
		share_type = data._share_type;
		if(data._pin_page != undefined){
			pin_page = true;
		}
	};

	var makeShareContent = function(s){
		s = removeHtmlTag(s);

		// 공유하기에 보이는 내용에서 치환
		s = s.replace(/&nbsp;/ig, " ");
		s = s.replace(/&lt;/ig, "<");
		s = s.replace(/&gt;/ig, ">");


		//글자수가 너무 길때 처리 - 공유하기 권장 110글자
		var content_max_len = 110;
		s = (s.length > content_max_len)? s.substring(0,content_max_len) : s;
		return s;
	};

	//SNS공유 초기설정
	//var snsInit = function(_main_url, _site_name, _subject, _content, _link_url, _security_link_url, _image){
	//
	//	try{
	//		if(Kakao) Kakao.init('63e1a2ee956b3aa85ca51663ce4caccb');
	//	}catch(e){
	//
	//	}
	//
	//
	//	main_url = _main_url;
	//	site_name = _site_name != "" ? "[" + _site_name + "]" : "";
	//	api_url = "https://sns.imweb.me/?url=";
	//	subject = _subject;
	//	content = _content;
	//	image_url = _image;
	//	link_url = _link_url;
	//	security_link_url = _security_link_url;
	//};


	var setSnsObj = function(){
		snsObjList = [];
		if(SITE_COUNTRY_CODE === KOREA_COUNTRY_CODE){
			if(LIMIT_API_LIST.indexOf('kakao_link') === -1){
				var snsObj = new SnsObjects();
				snsObj.name = LOCALIZE.버튼_카카오톡();
				snsObj.show = true;
				snsObj.order = 1;
				snsObj.iconClass = "kakao";
				snsObj.type = "kakaotalk";
				snsObjList.push(snsObj);
			}
		}

			if(LIMIT_API_LIST.indexOf('line_link') === -1){
				snsObj = new SnsObjects();
				snsObj.name = LOCALIZE.버튼_라인();
				snsObj.show = true;
				snsObj.order = 1;
				snsObj.iconClass = "line";
				snsObj.type = "line";
				snsObjList.push(snsObj);
			}

		if(SITE_COUNTRY_CODE === KOREA_COUNTRY_CODE){
			if(LIMIT_API_LIST.indexOf('band_link') === -1){
				snsObj = new SnsObjects();
				snsObj.name = LOCALIZE.버튼_밴드();
				snsObj.show = true;
				snsObj.order = 1;
				snsObj.iconClass = "band";
				snsObj.type = "band";
				snsObjList.push(snsObj);
			}

			if(LIMIT_API_LIST.indexOf('naver_link') === -1){
				snsObj = new SnsObjects();
				snsObj.name = LOCALIZE.버튼_네이버();
				snsObj.show = true;
				snsObj.order = 1;
				snsObj.iconClass = "naver";
				snsObj.type = 'naver';
				snsObjList.push(snsObj);
			}
		}

		if(LIMIT_API_LIST.indexOf('facebook_link') === -1){
			snsObj = new SnsObjects();
			snsObj.name = LOCALIZE.버튼_페이스북();
			snsObj.show = true;
			snsObj.order = 1;
			snsObj.iconClass = "face";
			snsObj.type = "facebook";
			snsObjList.push(snsObj);
		}

		if(LIMIT_API_LIST.indexOf('twitter_link') === -1){
			snsObj = new SnsObjects();
			snsObj.name = 'X';
			snsObj.show = true;
			snsObj.order = 1;
			snsObj.iconClass = "twitter";
			snsObj.type = "twitter";
			snsObjList.push(snsObj);
		}

		if(LIMIT_API_LIST.indexOf('instagram') === -1){
			snsObj = new SnsObjects();
			snsObj.name = LOCALIZE.버튼_인스타그램();
			snsObj.show = false;
			snsObj.order = 1;
			snsObj.iconClass = "instagram";
			snsObj.type = "instagram";
			snsObjList.push(snsObj);
		}
	};

	var getDefaultHtml = function(){

    const snsList = [];
		for(var index in snsObjList){
			const snsObj = snsObjList[index];
			if(!snsObj.show) continue;
      snsList.push(`
        <li role='' class='${snsObj.iconClass}'>
          <a href='javascript:;' onclick="SNS.setSnsApi('${snsObj.type}')\">${snsObj.name}</a>
        </li>
      `)
		}
    const html = `
      <div class='modal-header text-basic'>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><i class='btl bt-times'></i></button>
        <h4 class='modal-title'>${LOCALIZE.버튼_공유하기()}</h4>
        </div>
        <div class='modal-body text-basic'>
        <div class='social-btn'>
        <ul>
          ${snsList.join('')}
        </ul>
        </div>
        <div class='url-copy holder'>
          <div class='form-control-line'>
            <input type='text' id='sns_copy_url' class='_sns_copy_url form-control' value='${link_url}' readonly>
            <button type='button' class='_sns_copy_btn sns_copy_btn btn btn-default' onclick=\"SNS.copyToClipboard()\" data-clipboard-target='._sns_copy_url'>${LOCALIZE.버튼_복사()}</button>
          </div>
        </div>
        <div id='copy_complete' class='copy_complete text-center'></div>
      </div>
    `;
		return html;
	};

	var copyToClipboard = function(){
		$('#sns_copy_url').select();
		document.execCommand("Copy");
		$('#copy_complete').text(LOCALIZE.설명_URL이복사되었습니다());
		$('#copy_complete').addClass('copied');
		setTimeout(function () {
			$('#copy_complete').removeClass('copied');
		},4000);
	};

	var showDefalutSnsShareList = function(){
		//snsInit(_main_domain, _site_name, _subject, _content, _link_url, _security_link_url, _image);
		setSnsObj();
		var html = $(getDefaultHtml());
		$.cocoaDialog.open({type : 'post_social', custom_popup : html});
	};


	var setSnsApi = function(type){
		switch(type){
			case 'kakaotalk':
				shareKakaoTalk();
				break;
			case 'line':
				shareLine();
				break;
			case 'band':
				shareBand();
				break;
			case 'naver':
				shareNaver();
				break;
			case 'facebook':
				shareFacebook();
				break;
			case 'twitter':
				shareTwitter();
				break;
			case 'instagram':
				shareInstagram();
				break;
		}

	};


	/***
	 * 카카오톡 공유하기
	 * https://developers.kakao.com/docs/latest/ko/message/js
	 */
	var shareKakaoTalk = function(){
		if(LIMIT_API_LIST.indexOf('kakao_link') === -1){
      subject = decodeHTMLEntities(subject);
      content = decodeHTMLEntities(content);

			var type = share_type;
			var kakao_link = location.href;
			var kakao_send_data = {
				content: {
					title: subject,
					description: content,
					imageUrl: image_url,
					imageWidth: 300,
					imageHeight: 200,
					link: {
						mobileWebUrl: kakao_link,
						webUrl: kakao_link
					}
				},
				buttons: [
					{
						title: '자세히보기',
						link: {
							mobileWebUrl: kakao_link,
							webUrl: kakao_link
						}
					}
				]
			};
			switch(share_type){
				case 'booking':
					kakao_send_data.buttons[0]['title'] = '예약하기';
					type = 'feed';
					break;
				case 'commerce':
					if(additional == undefined || additional.commerce == undefined || additional.hide_price === 'Y'){
						type = 'feed';
						break;
					}

					kakao_send_data.buttons[0]['title'] = '구매하기';
					kakao_send_data.commerce ={};
					kakao_send_data.commerce.regularPrice = additional.commerce.orig_price;			// 정상가격
					if(additional.commerce.sale_price != undefined) {
						kakao_send_data.commerce.discountPrice = additional.commerce.sale_price;	// 할인가격
						kakao_send_data.commerce.discountRate =
							Math.round((kakao_send_data.commerce.regularPrice - kakao_send_data.commerce.discountPrice) * 100 / kakao_send_data.commerce.regularPrice);
					}
					break;
				case 'feed':
				case 'location':
					if(social){
						kakao_send_data.social = {};
						for(key in social){
							kakao_send_data.social[key] = parseInt(social[key]);
						}
					}
					if(share_type == 'location'){
						if(additional == undefined || additional.location == undefined){
							type = 'feed';
							break;
						}
						kakao_send_data.address = additional.location.address;
						kakao_send_data.addressTitle = subject;
					}
					break;
				default:
					type = 'feed';
					break;
			}

			/**
			 * 커머스의 경우 sendCustom() 을 이용하기 위함.
			 * 커머스이고, 템플릿 ID 가 있는 경우에는 sendCustom()
			 * 커머스이고 템플릿 ID 가 없는 경우에는 sendDefault()
			 *
			 * linkUrl 은 카카오 디벨로퍼 앱의 출처 링크 형식으로 리다이렉트
			 * 출처 링크에 url 쿼리 스트링을 붙여 출처 링크 + path 로 리다이렉트 하도록 함.
			 *
			 * @see https://developers.kakao.com/docs/latest/ko/message/js-link#custom-template-msg
			 */
			var kakao_template_id = parseInt(kakao_message_template_id);
			if (type === 'commerce' && kakao_template_id > 0) {
				kakao_send_data = {
					templateId: kakao_template_id,
					templateArgs: {
						title: subject,
						imageUrl: image_url,
						imageWidth: 300,
						imageHeight: 200,
						btnStr: "구매하기",
						linkUrl: (location.pathname + location.search).slice(1),
						originalPrice: additional.commerce.orig_price,
					},
					installTalk: true
				};

				if (additional.commerce.sale_price !== undefined) {
					kakao_send_data.templateArgs.salePrice = additional.commerce.sale_price; // 할인가격
					kakao_send_data.templateArgs.discountPercent =
						Math.round((kakao_send_data.templateArgs.originalPrice - kakao_send_data.templateArgs.salePrice) * 100 / kakao_send_data.templateArgs.originalPrice); // 할인율
				}

				Kakao.Link.sendCustom(kakao_send_data);
			} else {
				kakao_send_data.objectType = type;
				Kakao.Link.sendDefault(kakao_send_data);
			}
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}

	};

	/***
	 * 라인 공유하기
	 */
	var shareLine = function(){
		if(LIMIT_API_LIST.indexOf('line_link') === -1){
			window.open("http://line.naver.jp/R/msg/text/?" + fixedEncodeURIComponent(subject) + " " + fixedEncodeURIComponent(location.href));
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}
	};

	/***
	 * 밴드 공유하기
	 */
	var shareBand = function(){
		if(LIMIT_API_LIST.indexOf('band_link') === -1){
			var tmp_subject = encodeURIComponent(subject + "\n");
			var body = tmp_subject + fixedEncodeURIComponent(location.href);
			window.open("http://band.us/plugin/share?body=" + body + "&route=" + fixedEncodeURIComponent(location.href));
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}
	};

	function fixedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[\.]/g, function(c) {     return '%' + c.charCodeAt(0).toString(16);   });
	}

	var shareNaver = function(){
		if(LIMIT_API_LIST.indexOf('naver_link') === -1){
			if(content.length == 0){
				if(confirm('네이버 블로그 공유 시 본문 텍스트가 없을 경우 사이트 내용 텍스트를 순차적으로 출력합니다. 그래도 공유하시겠습니까?')){
					shareSnsMetatag('naver');
				}
			}else{
				shareSnsMetatag('naver');
			}
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}
	};

	/***
	 * 페이스북 공유하기
	 */
	var shareFacebook = function(){
		if(LIMIT_API_LIST.indexOf('facebook_link') === -1){
			shareSnsMetatag('facebook');
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}
	};

	/***
	 * 트위터 공유하기
	 */
	var shareTwitter = function(){
		if(LIMIT_API_LIST.indexOf('twitter_link') === -1){
			shareSnsMetatag('twitter');
		}else{
			alert(LOCALIZE.설명_사이트관리자설정에의해차단된콘텐츠입니다());
		}
	};

	/***
	 * 인스타그램 공유하기
	 */
	var shareInstagram = function(){
		if(IS_MOBILE){

		}else{

		}
	};

	var shareSnsMetatag = function(type){

		switch(type){
			case 'naver':
				window.open("https://share.naver.com/web/shareView.nhn?url=" + encodeURI(encodeURIComponent(location.href)) + "&title=" + encodeURIComponent(subject));
				break;
			case 'facebook':
				window.open("http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.href));
				break;
			case 'twitter':
				window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(subject) + "&url=" + encodeURIComponent(location.href));
				break;
			default:
				alert(LOCALIZE.설명_공유에실패하였습니다());
				break;
		}
	};

	return {
		showDefalutSnsShareList : function(_main_url, _site_name, _subject, _content, _link_url, _security_link_url, _image){
			return showDefalutSnsShareList(_main_url, _site_name, _subject, _content, _link_url, _security_link_url, _image);
		},
		setSnsApi : function(_type){
			return setSnsApi(_type);
		},
		shareKakaoTalk : function(_type){
			return shareKakaoTalk(_type);
		},
		shareLine : function(){
			return shareLine();
		},
		shareBand : function(){
			return shareBand();
		},
		shareNaver : function(){
			return shareNaver();
		},
		shareFacebook : function(){
			return shareFacebook();
		},
		shareTwitter : function(){
			return shareTwitter();
		},
		copyToClipboard : function(text){
			return copyToClipboard(text);
		},
		loadKakaoApi : function(key){
			loadKakaoApi(key);
		},
		init : function(d){
			return init(d);
		}
	};

}();