var SITE_SEARCH = function(){
	var init = function() {
		const $numericInput = $('input[type=text][data-inputmode=numeric]');
		const $numericInputMin = $numericInput.filter('[data-numeric-type=min]');
		const $numericInputMax = $numericInput.filter('[data-numeric-type=max]');

		/**
		 * 가격 입력 정책
		 * - 가격 입력은 소수 둘째 자리까지 입력이 가능하도록 구현
		 * - 음수는 입력이 불가능함
		 */
		$numericInput.on('input', function(e) {
			const refineValue = e.target.value
				.replace(/[^\d.]/g, '') // 숫자와 소수점만 허용 처리
				.replace(/^\./, '') // 맨 앞 소수점 입력 불가 처리
				.replace(/\.{2,}/g, '.') // 소수점 연속 입력 불가 처리
				.replace(/(\d*\.\d*)\.(\d*)/, '$1$2'); // 소수점 두번 이상 입력 방지 처리

			e.target.value = refineValue
				.replace(/(\d+\.?\d{0,2}).*/, '$1'); // 소수점 둘째 자리까지만 처리
		});

		$numericInput.on('blur', function(e) {
			const refineValue = e.target.value
				.replace(/\.$/, ''); // 마지막이 소수점으로 끝날경우 제거

			const numericValue = parseFloat(refineValue);

			e.target.value = Number.isNaN(numericValue) ? '' : numericValue;
		});

		$numericInput.on('keydown', function(e) {
			if (e.key === 'Enter') {
				/** 검색인 경우, 강제 blur 이벤트 발생 및 form submit 처리 */
				e.target.blur();

				$('#s_form').submit();
			}
		});

		/**
		 * 최소 가격 입력 정책
		 * - 최소 가격이 최대 가격보다 작거나 같아야 함
		 */
		$numericInputMin.on('blur', function(e) {
			const minValue = parseFloat(e.target.value);
			const maxValue = parseFloat($numericInputMax.val());

			if (Number.isNaN(minValue) || Number.isNaN(maxValue)) {
				return;
			}

			e.target.value = Math.min(Math.max(0, minValue), maxValue);
		});

		/**
		 * 최대 가격 입력 정책
		 * - 최대 가격은 최소 가격보다 크거나 같아야 함
		 */
		$numericInputMax.on('blur', function(e) {
			const minValue = parseFloat($numericInputMin.val());
			const maxValue = parseFloat(e.target.value);

			if (Number.isNaN(minValue) || Number.isNaN(maxValue)) {
				return;
			}

			e.target.value = Math.max(minValue, maxValue);
		});
	}

	var openSearch = function(data){
		$.cocoaDialog.close();
		var $s_form = $('#s_form');
		var keyword = '';
		var type = '';
		if($s_form.length >0 ){
			keyword = $s_form.find('input[name=keyword]').val().trim();
			type = $s_form.find('input[name=type]').val();
		}
		$.ajax({
			type: 'POST',
			data: {'keyword':keyword, 'type': type,'data':data},
			url: ('/dialog/search.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'widget_search', custom_popup: $html});
				$html.find('input[name=keyword]').off("focus").on("focus", function (e) {
					// IE
					if (this.createTextRange) {
						var range = this.createTextRange();
						range.move('character', this.value.length);    // input box 의 글자 수 만큼 커서를 뒤로 옮김
						range.select();
					}
					else if (this.selectionStart || this.selectionStart== '0')
						this.selectionStart = this.value.length;
				});
			}
		});
	};

	$.urlParam = function(name){
		var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
		return results[1] || 0;
	}

	var search = function(){
		var $s_form = $('#s_form');
		var $_keyword = $s_form.find('input[name=keyword]');
		$_keyword.val($_keyword.val().trim());

		var $_category_code = $s_form.find('select[name=category_code]');
		if ($_category_code.length) {
			const val = $_category_code.val();
			if (val === '') {
				$_category_code.prop('disabled', true);
			}
		}

		var $_min_price = $s_form.find('input[name=min_price]');
		if ($_min_price.length) {
			const val = $_min_price.val().trim();
			if (val === '') {
				$_min_price.prop('disabled', true);
			} else {
				$_min_price.val(val);
			}
		}

		var $_max_price = $s_form.find('input[name=max_price]');
		if ($_max_price.length) {
			const val = $_max_price.val().trim();
			if (val === '') {
				$_max_price.prop('disabled', true);
			} else {
				$_max_price.val(val);
			}
		}

		$s_form.submit();

		// form 전송 후 disabled 해제 (원래대로)
		$_category_code.prop('disabled', false);
		$_min_price.prop('disabled', false);
		$_max_price.prop('disabled', false);
	};

	var inlineSearch = function(code){
		var $s_form = $('#inline_s_form_' + code);
		var $_keyword = $s_form.find('input[name=keyword]');
		$_keyword.val($_keyword.val().trim());
		$s_form.submit();
	};

	var searchDialog = function(){
		var $sd_form = $('#sd_form');
		var $_keyword = $sd_form.find('input[name=keyword]');
		$_keyword.val($_keyword.val().trim());
		$sd_form.submit();
	};

	var changeType = function(type){
		var $s_form = $('#s_form');
		var $type = $s_form.find('._type');
		$type.val(type);
		$s_form.submit();
	};
	var changeSort = function(type){
		var $s_form = $('#s_form');
		var $sort = $s_form.find('._sort');
		$sort.val(type);
		$s_form.submit();
	};

	var popularSearch = function(code, keyword) {
		var $s_form = $('#inline_s_form_' + code);
		var $_keyword = $s_form.find('input[name=keyword]');
		$_keyword.val(keyword);

		$s_form.submit();
		setTimeout(()=>{
			$_keyword.val('')
		},0);
	}

	return {
		'init' : function() {
			init();
		},
		'inlineSearch' : function(code){
			inlineSearch(code);
		},
		'openSearch' : function(data){
			openSearch(data);
		},
		'search' : function(){
			search();
		},
		'searchDialog' : function(){
			searchDialog();
		},
		'changeType' : function(type){
			changeType(type);
		},
		'changeSort' : function(type){
			changeSort(type);
		},
		'popularSearch' : function(code, keyword) {
			popularSearch(code, keyword);
		}
	}

}();
