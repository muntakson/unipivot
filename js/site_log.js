var SITE_VISIT_LOG = function(){

	var getDeviceUUID = function(){
		let du = new DeviceUUID().parse();
		let dua = [
			du.language,
			du.platform,
			du.os,
			du.browser,
			du.version,
			du.isDesktop,
			du.isMobile,
			du.isTablet,
			du.isWindows,
			du.isLinux,
			du.isLinux64,
			du.isMac,
			du.isiPad,
			du.isiPhone,
			du.isiPod,
			du.isSmartTV,
		];

		return dua;
	}

	var addVisitLog = function(referer, token, token_key, menu_code, first_visit){
		$.ajax({
			type : 'POST',
			data : {'referer' : referer, 'token' : token, 'token_key':token_key, 'menu_code':menu_code, 'dua': getDeviceUUID().join(':'),'first_visit':first_visit?'Y':'N'},
			url : ('/backpg/add_visit_log.cm'),
			dataType : 'json',
			success : function(res){
			}
		});
	};

	var addProdViewLog = function(prodCode, token, token_key){
		$.ajax({
			type : 'POST',
			data : {'prod_code' : prodCode, 'token' : token, 'token_key':token_key, 'dua': getDeviceUUID().join(':')},
			url : ('/backpg/add_prod_view_log.cm'),
			dataType : 'json',
			success : function(res){
			}
		});
	};

	var getToken = function(callback){
		$.ajax({
			type : 'POST',
			data : {},
			url : ('/backpg/get_visit_token.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					callback(res.log_token, res.log_token_key, res.reffrer);
				}
			}
		});
	};

	return {
		'addVisitLog' : function(referer, token, token_key, menu_code, first_visit){
			addVisitLog(referer, token, token_key, menu_code, first_visit);
		},
		'addProdViewLog' : function(prodCode, token, token_key){
			addProdViewLog(prodCode, token, token_key);
		},
		'getToken' : function(callback){
			getToken(callback);
		}
	}
}();