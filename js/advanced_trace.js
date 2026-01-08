var ADVANCED_TRACE = function(){
	var appendCode = function(type,replace_variable){
		$(function(){
			var is_cache = false;
			var callback = function(res){
				if(res.msg == 'SUCCESS'){
					if(res.advanced_trace_data != null){

						if(res.advanced_trace_data.header != ''){
							$('head').append(res.advanced_trace_data.header);
						}
						if(res.advanced_trace_data.body != ''){
							$('body').append(res.advanced_trace_data.body);
						}
						if(res.advanced_trace_data.footer != ''){
							$('footer').append(res.advanced_trace_data.footer);
						}
					}

					if ( ! is_cache ) {
						IMWEB_SESSIONSTORAGE.set('ADVANCED_TRACE_CODE_' + type + '_' + JSON.stringify(replace_variable), res, 60);
					}
				} else {
					alert(res.msg);
				}
			};

			var trace_code = IMWEB_SESSIONSTORAGE.get('ADVANCED_TRACE_CODE_' + type + '_' + JSON.stringify(replace_variable));
			if ( trace_code ) {
				is_cache = true;
				callback(trace_code);
			} else {
				$.ajax({
					type : 'POST',
					data : {'type' : type, replace_variable : replace_variable},
					url : ('/ajax/get_advanced_trace_code.cm'),
					dataType : 'json',
					success : callback
				});
			}
		});
	};
	return {
		"appendCode" : function(type,replace_variable){
			appendCode(type,replace_variable);
		}
	}
}();