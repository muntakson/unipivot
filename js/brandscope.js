// BrandScope 초기화 및 메서드 사용을 위한 래퍼 함수
(function (window, document, script, BrandScope, firstScript) {
	window.BrandScope = window.BrandScope || {
		init: function () {
			(window.BrandScope.q = window.BrandScope.q || [])
				.push(['init'].concat(Array.prototype.slice.call(arguments)))
		},
		identify: function () {
			(window.BrandScope.q = window.BrandScope.q || [])
				.push(['identify'].concat(Array.prototype.slice.call(arguments)))
		},
		track: function () {
			(window.BrandScope.q = window.BrandScope.q || [])
				.push(['track'].concat(Array.prototype.slice.call(arguments)))
		},
		getImwebClientInfo: function () {
			(window.BrandScope.q = window.BrandScope.q || [])
				.push(['getImwebClientInfo'].concat(Array.prototype.slice.call(arguments)))
		},
		sessionResetByLogout: function () {
			(window.BrandScope.q = window.BrandScope.q || [])
				.push(['sessionResetByLogout'].concat(Array.prototype.slice.call(arguments)))
		},
	}

	// BrandScope SDK 스크립트 로드
	BrandScope = window.BrandScope
	// BrandScope 스크립트 동적 로딩
	script = document.createElement('script')
	script.type = 'module'
	script.async = true
	script.src = (typeof TEST_SERVER !== 'undefined' && TEST_SERVER)
		? '//cdn-brandscope.imtest.me/bs.umd.js'
		: '//static.imweb.me/brand-scope/bs.umd.js';
	// BrandScope 스크립트 삽입
	firstScript = document.getElementsByTagName('script')[0]
	firstScript.parentNode.insertBefore(script, firstScript)
})(window, document);



(function initBrandScope() {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initBrandScope);
		return;
	}

	// 상품 상세 위젯이 있을 경우 위젯에서 상품 데이터와 함께 초기화
	const hasShopViewWidget = !!document.querySelector('[data-widget-type="shop_view"]');
	if (hasShopViewWidget) {
		return;
	}

	BrandScope.init({
		props: {
			ownership: 'behavior-tracking-analytics',
		}
	});

})()
