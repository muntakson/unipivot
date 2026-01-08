/**
 * site_shop 상수 값
 * @type {{WIDTH_MOBILE: number, SEEMORE_HEIGHT: {PC: number, MOBILE: number}, PROD_TYPE: {DIGITAL: string, SUBSCRIBE: string, NORMAL: string}, TAB_TYPE: {RETURN: string, QNA: string, REVIEW: string, DETAIL: string}}}
 */
const SHOP_CONST = {
    /** shopping default */
    WIDTH_MOBILE: 768,
    PROD_TYPE: {
        NORMAL: 'normal',
        DIGITAL: 'digital',
        SUBSCRIBE: 'subscribe'
    },
    TAB_TYPE: {
        DETAIL: 'detail',
        QNA: 'qna',
        REVIEW: 'review',
        RETURN: 'return'
    },
    SEEMORE_HEIGHT: {
        PC: 1050,
        MOBILE: 550
    },
    /** cart */
    CART_TYPE_NORMAL: 'normal',
    CART_TYPE_REGULARLY: 'regularly'
};

/**
 * 로그인 페이지로 리다이렉트 (코드 7 처리용) - 전역 함수
 * @returns {void}
 */
function redirectToLoginPage() {
    var back_url_base64 = window.location.href; // 전체 URL 사용

    // 로그인 팝업 사용 여부에 따른 분기
    if (typeof cm_data !== 'undefined' && cm_data.use_login_popup === 'Y') {
        if (typeof window.SITE_MEMBER !== 'undefined' && typeof window.SITE_MEMBER.openLogin === 'function') {
            window.SITE_MEMBER.openLogin(cm_data.back_url, cm_data.back_url_unit_type, 'order', cm_data.use_login_popup);
        } else {
            // 팝업 함수가 없으면 리다이렉트로 폴백
            window.location.href = '/login?back_url=' + encodeURIComponent(btoa(back_url_base64));
        }
    } else {
        window.location.href = '/login?back_url=' + encodeURIComponent(btoa(back_url_base64));
    }
}

var SITE_SHOP_DETAIL = function () {
    var $body;
    var $selected_options;
    var $prod_detail;
    var $prod_detail_content_mobile;
    var $prod_detail_content_pc;
    var $prod_detail_content_tab_mobile;
    var $prod_detail_return;
    var $prod_detail_return_mobile;
    var $first_photo_review_wrap;
    var $prod_image_list;
    var $prod_image_list_rolling;
    var $review_image_list;
    var $review_image_list_rolling;
    var $review_summary_wrap;
    var $review_summary_wrap_mobile;
    var $prod_goods_form;
    var $add_cart_alarm;
    var $confirm_order_with_cart_alarm;
    var $deliv_visit_wrap;
    var $options;
		var $prod_additional;
		var $prod_additional_options;
		var $prod_additional_options_default;
    var $prod_deliv_setting;
		var $wish_buttons;
		var selected_prod_additionals = [];
    var selected_options = []; /** [ {options:[{option_code:, value_code:, value_name:}], price:, count:, require:} ] */
    var selected_prod_additional_options = []; /** [ {options:[{option_code:, value_code:, value_name:}], price:, count:, require:} ] */
    var selected_require_options = []; /** [ { value_type:SELECT(선택형)/INPUT(입력형), option_code:, value_code:, value_name:  } ] */
    var selected_prod_additional_require_options = []; /** [ { value_type:SELECT(선택형)/INPUT(입력형), option_code:, value_code:, value_name:  } ] */
		var current_select_additional_prod_idx = 0; /** 최근 선택한 추가상품 idx(추가상품 UI 영역에 표시하기 위해 사용) **/
    var require_option_count = 0;
    var prod_additional_require_option_count = {};
    var require_input_option_count = 0;
    var prod_additional_require_input_option_count = {};
    var current_prod_idx = 0;
    var prod_stock_use = false;
    var prod_stock = 0;
    var prod_stock_unlimit = false;
    var prod_price = 0;
    var order_count = 0;
    /** 구매할 수량 (옵션이 없는 경우에만)(*/
    var isComplete = false;
    var current_content_tab = '';
    /** detail,review,qna*/
    var isUseNpMobile = false;
    /** 모바일 네이버페이 사용 유무*/
    var $deliv_type = '';
    var $deliv_pay_type = '';
    /** 배송 국가 (옵션 select 커스텀 변경) */
    var $deliv_country;

    /* 구매 수량 체크를 위한 변수 */
    var max_prod_quantity = 0;
    var max_member_quantity = 0;
    var maximum_purchase_quantity_type = 'order';
    var optional_limit = 0;
    var optional_limit_type = 'relative';

    var total_price_localize_text = '';		// 총금액 다국어 코드

    var add_order_progress_check = false;

    var use_lazy_load = true; //레이지 로드 사용여부

    var tab_type = 'Y'; // pc 버전 탭 타입

    var prod_type = SHOP_CONST.PROD_TYPE.NORMAL;

    // 상품 상세페이지 내 기획전 위젯의 cart 버튼을 클릭하여 모달을 띄우는 동작에서
    // 모달이 닫힐 시 설정 값의 초기화를 위해 변수를 설정
    var prod_idx_org = 0;
    var prod_price_org = 0;
    var require_option_count_org = 0;
    var use_lazy_load_org = true;
    var tab_type_org = 'Y';
    var is_site_page_org = true;
    var prod_type_org = SHOP_CONST.PROD_TYPE.NORMAL;

    var is_view_price = true;
    var paging_type = 'st00';
    var paging_default_type = 'st00';
    var paging_active_type = 'st00';
    var cm_data = {};
    var section_code;

    var prod_edit_time = '';
    var prod_deliv_hash = '';
    var shop_view_style = '';

    var handle_loadDelivSetting = 0;
    var prod_option_touching = false;

    var first_tab = '';
    var use_tab_list = [];

    var window_width = 1920;
    var is_mobile_width = false;

    var default_options = {
        prod_idx: 0,
        prod_price: 0,
        require_option_count: 0,
        require_input_option_count: 0,
		use_image_optimizer_on_product_detail_markup: true,
        shop_use_full_load: false,
        is_site_page: false,
        prod_type: SHOP_CONST.PROD_TYPE.NORMAL,
        is_prod_detail_page: false,
        is_price_view_permission: false,
        cm_style: '{}',
        section_code: '',
        exist_color_option: false,
        is_exist_color_option_images: false,
        first_tab: '',
        can_add_order: true,
        add_order_permission_message: '',
        add_order_permission_type: '',
        initial_is_guest: false
    };
    var options = {};

    // redirectToLoginPage 함수는 전역 스코프로 이동됨

    function ensureAddOrderPermission() {
        if (options.can_add_order !== false) {
            return true;
        }

        var wasGuestInitially = options.initial_is_guest === true;
        var isGuestNow = typeof window !== 'undefined' && window.IS_GUEST === true;
        if (wasGuestInitially && !isGuestNow) {
            return true;
        }

        var message = options.add_order_permission_message;
        if (!message) {
            if (typeof LOCALIZE !== 'undefined') {
                if (options.add_order_permission_type === 'member' && typeof LOCALIZE.설명_회원만구매가능1 === 'function') {
                    message = LOCALIZE.설명_회원만구매가능1();
                } else if (options.add_order_permission_type === 'group' && typeof LOCALIZE.설명_그룹만구매가능1 === 'function') {
                    message = LOCALIZE.설명_그룹만구매가능1();
                } else if (options.add_order_permission_type === 'admin' && typeof LOCALIZE.설명_소유자만구매가능1 === 'function') {
                    message = LOCALIZE.설명_소유자만구매가능1();
                } else if (typeof LOCALIZE.설명_회원만구매가능1 === 'function') {
                    message = LOCALIZE.설명_회원만구매가능1();
                }
            }

        }

        if (!message) {
            message = 'Purchase not permitted.';
        }

        alert(message);
        return false;
    }

    var is_init_detail = false;
    var last_refund_data;
    //결제 타입 (일반, 정기구독)
    var cart_type;

	var review_page = 1;
	var qna_page = 1;

	let use_cdn_optimized = false;


	const setImageWidthHeightBeforeLoad = async (node) => {
		console.time('loadTemplate')
		const styleFragment = window.document.createElement('style');
		styleFragment.innerHTML = `@keyframes lazyload {0% {opacity: 0;} 50% {opacity: 0.1;} 100% {opacity: 0;}}`
		node.prepend(styleFragment);

		const ORIGINAL_WIDTH_HEADER_KEY = 'x-amz-meta-original-width';
		const ORIGINAL_HEIGHT_HEADER_KEY = 'x-amz-meta-original-height';
		const imgElements = node.querySelectorAll('img') || [];
		const timeoutLimit = 1000000;
		const checkOnceSupport = checkerlistenerOption('once');
		const loadingImageJobs = Array.prototype.map.call(imgElements, (async (imgElement) => {
			let abortTimer = null;
			try {
				const srcOriginal = new URL(imgElement.src);
				const srcDefault = new URL(window.CDN_UPLOAD_URL);
				if (srcOriginal.host !== srcDefault.host || !srcOriginal.pathname.startsWith(srcDefault.pathname)) {
					throw new Error();
				}
				// WARN: srcResized 값이 콜백 내에서 계속 변경되므로(searchParams.set) 주의
				const srcResized = new URL(srcOriginal);
				srcResized.host = new URL(window.CDN_OPTIMIZED_URL).host;
				srcResized.searchParams.set('w', 0);

				const signal = typeof AbortSignal.timeout === 'function'
					? AbortSignal.timeout(timeoutLimit)
					: new AbortController()

				if (typeof signal.abort === 'function') {
					abortTimer = setTimeout(signal.abort, timeoutLimit);
				}
				const imgRes = await fetch(srcResized, { method: 'HEAD',  signal });

				const checkResized = imgRes.headers.has(ORIGINAL_WIDTH_HEADER_KEY)
					&& imgRes.headers.has(ORIGINAL_HEIGHT_HEADER_KEY);
				if (
					!imgRes.ok || !checkResized
				) {
					throw new Error();
				}

				const meta = {
					originalWidth: imgRes.headers.get(ORIGINAL_WIDTH_HEADER_KEY),
					originalHeight: imgRes.headers.get(ORIGINAL_HEIGHT_HEADER_KEY),
				}

				const imgKey = srcResized.pathname.replace(/[^a-z\d]/g, '_');
				imgElement.dataset[imgKey] = "";
				const imgSelector = `img[data-${imgKey}]`;

				const styleFragment = window.document.createElement('style');
				styleFragment.innerHTML = `${imgSelector} {opacity:0;transition:opacity 60ms ease-out;} ${imgSelector}.loaded {opacity:1;}`;
				imgElement.parentNode.prepend(styleFragment);
				srcResized.searchParams.set('w', 1920);

				if (srcResized.pathname.endsWith('.gif')){
					srcResized.searchParams.set('f', 'gif');
				}
				imgElement.src = srcResized.href;
				imgElement.style.objectFit = 'cover';
				imgElement.style.maxWidth = '100%';
				imgElement.style.height = 'auto';
				imgElement.width = (imgElement.width || meta.originalWidth);
				imgElement.height = (imgElement.height || meta.originalHeight);
				imgElement.sizes = '100vw';
				imgElement.srcset = [1536, 1280, 1080, 828, 768, 640, 576, 368]
					.map((w) => {
						srcResized.searchParams.set('w', w);
						return `${srcResized.href} ${w}w`;
					}).join(', ');
				imgElement.loading = 'lazy';

				imgElement.addEventListener('error', () => {
					imgElement.src = imgElement.dataset.original || srcOriginal.href;
					imgElement.classList.add('loaded');
					imgElement.style.removeProperty('objectFit');
					imgElement.style.removeProperty('maxWidth');
					imgElement.style.removeProperty('height');
					imgElement.removeAttribute('width');
					imgElement.removeAttribute('height');
					imgElement.removeAttribute('sizes');
					imgElement.removeAttribute('srcset');
					imgElement.removeAttribute('loading');
				});

				if (checkOnceSupport) {
					imgElement.addEventListener('load', () => imgElement.classList.add('loaded'), { once: true });
				} else {
					imgElement.onload = () => imgElement.classList.add('loaded');
				}
			} catch (e) {
				console.error(e);
				// TypeError, FetchError, AbortError, TimeoutError ... 어떤 에러든 원본 이미지로 대체
				imgElement.src = imgElement.dataset.original || imgElement.src;
				imgElement.classList.add('loaded');
				imgElement.removeAttribute('height');
			} finally {
				if (abortTimer) {
					clearTimeout(abortTimer);
				}
			}
		}));

		for ( const job of loadingImageJobs ) {
			await job;
		}
		console.timeEnd('loadTemplate')
		return node;
	}

    /*
    option 샘플
    initDetail({
        prod_idx: ,
        prod_price: ,
        require_option_count: ,
		use_image_optimizer_on_product_detail_markup: ,
        shop_use_full_load: ,
        shop_view_tab_display: ,
        is_site_page: ,
        prod_type: ,
        is_prod_detail_page: ,
        is_price_view_permission: ,
        cm_style: ,
        section_code:
        exist_color_option:
        is_empty_color_option_images:
        is_prod_wish_by_member,
        wish_count,
        is_use_wish_btn,
        is_show_wish_count,
        is_soldout,
        is_possible_use_gift
    });
    */
    var initDetail = function (_option) {
        options = $.extend({}, default_options, _option);

	    if(typeof options.shop_view_tab_display === 'undefined') {
		    options.shop_view_tab_display = options.shop_pc_tab_type_one_page === 'Y' ? 'Y' : 'N';
	    }
	    if(typeof options.shop_tab_fixed === 'undefined') {
		    options.shop_tab_fixed = options.shop_tab_type_unfixed !== 'Y' ? 'Y' : 'N';
	    }

        var prodIdx = options.prod_idx;
        var price = options.prod_price;
        var requireOptionCnt = options.require_option_count;
        var requireInputOptionCnt = options.require_input_option_count;
        use_lazy_load = options.use_image_optimizer_on_product_detail_markup;
        tab_type = options.shop_view_tab_display;
        var is_site_page = options.is_site_page;
        var _prod_type = options.prod_type;
        var is_prod_detail_page = options.is_prod_detail_page;
        var view_price = options.is_price_view_permission;
        var _cm_data = options.cm_style;
        section_code = options.section_code;
        prod_edit_time = options.prod_edit_time;
        prod_deliv_hash = options.prod_deliv_hash;
        shop_view_style = options.shop_view_style;
        first_tab = options.first_tab;
        use_tab_list = options.use_tab_list;

        window_width = window.innerWidth;
        is_mobile_width = (window_width < SHOP_CONST.WIDTH_MOBILE);
		use_cdn_optimized = options.use_cdn_optimized;

        $body = $('body');

        if (is_prod_detail_page) {
            var $target_modal = $('.modal_prod_detail_from_shopping_list');
            $prod_image_list = $target_modal.find('#prod_image_list');
            $prod_image_list_rolling = $prod_image_list.find('div.owl-carousel');
            $prod_goods_form = $target_modal.find('#prod_goods_form');
            $selected_options = $target_modal.find('#prod_selected_options');
            $options = $target_modal.find('#prod_options');
            $prod_additional = $target_modal.find('#prod_additional');
            $prod_additional_options = $target_modal.find('#prod_additional_options');
            $prod_additional_options_default = $prod_additional_options; // 기본 위치 저장
            $prod_deliv_setting = $target_modal.find('#prod_deliv_setting');
            $prod_detail = $target_modal.find('#prod_detail');
            $prod_detail_content_pc = $prod_detail.find('._prod_detail_detail_lazy_load');
            $prod_detail_content_mobile = $target_modal.find('._prod_detail_detail_lazy_load_mobile');
            $prod_detail_content_tab_mobile = $target_modal.find('.categorize-mobile .site_prod_nav_wrap');
            $add_cart_alarm = $target_modal.find('#shop_detail_add_cart_alarm');
            $confirm_order_with_cart_alarm = $target_modal.find('#shop_detail_confirm_order_with_cart_alarm');
            $deliv_visit_wrap = $target_modal.find('#deliv_visit_wrap');
	        $wish_buttons = $target_modal.find('._wish_button');
        } else {
            $prod_image_list = $('#prod_image_list');
            $prod_image_list_rolling = $('#prod_image_list').find('div.owl-carousel');
            $prod_goods_form = $('#prod_goods_form');
            $selected_options = $('#prod_selected_options');
            $options = $('#prod_options');
            $prod_additional = $('#prod_additional');
	          $prod_additional_options = $('#prod_additional_options');
            $prod_additional_options_default = $prod_additional_options; // 기본 위치 저장
            $prod_deliv_setting = $('#prod_deliv_setting');
            $prod_detail = $('#prod_detail');
            $prod_detail_content_pc = $prod_detail.find('._prod_detail_detail_lazy_load');
            $prod_detail_content_mobile = $('._prod_detail_detail_lazy_load_mobile');
            $prod_detail_content_tab_mobile = $('.categorize-mobile .site_prod_nav_wrap');
            $add_cart_alarm = $('#shop_detail_add_cart_alarm');
            $confirm_order_with_cart_alarm = $('#shop_detail_confirm_order_with_cart_alarm');
            $deliv_visit_wrap = $('#deliv_visit_wrap');
	        $wish_buttons = $('._wish_button');
        }

        $prod_detail_return = $("#prod_detail_return_body");
        $prod_detail_return_mobile = $("#prod_detail_return_body_mobile");

        $first_photo_review_wrap = $prod_detail.find('._first_photo_review_wrap');
        $review_summary_wrap = $prod_detail.find('._review_summary_wrap');
        $review_summary_wrap_mobile = $prod_detail.find('._review_summary_wrap_mobile');
        if (options.only_regularly) {
            if (!$prod_detail.hasClass('shop-style-b')) selectCartType('regularly');
        }


        is_view_price = view_price;
        current_prod_idx = prodIdx;
        prod_price = price;
        require_option_count = parseInt(requireOptionCnt);
        require_input_option_count = parseInt(requireInputOptionCnt);
	      selected_prod_additionals = [];
        selected_options = [];
	      selected_prod_additional_options = [];
        selected_require_options = [];
	      selected_prod_additional_require_options = [];
				prod_additional_require_option_count = {};
				prod_additional_require_input_option_count = {};
	    prod_additional_period_discount_data = {};
	    prod_additional_period_dc_type = {};
	    current_select_additional_prod_idx = 0;
        isComplete = true;
        //isUseNpMobile = use_np_mobile;
        cm_data = JSON.parse(_cm_data);

		// 그러니까 이 값들은, 상품 상세페이지 내 기획전 위젯의 cart 버튼을 클릭하여 모달을 띄우는 동작에서
		// 모달이 닫힐 시 설정 값의 초기화를 위해 사용하는 것이다.
        if (!is_prod_detail_page) {
            prod_idx_org = current_prod_idx;
            prod_price_org = prod_price;
            require_option_count_org = require_option_count;
            use_lazy_load_org = use_lazy_load;
            tab_type_org = tab_type;
            is_site_page_org = is_site_page;
            prod_type_org = _prod_type;
        }

	    if (options.is_use_wish_btn) {
		    toggleWishButtons($wish_buttons, options.wish_count, options.is_show_wish_count, options.is_prod_wish_by_member);
	    }

        /* 하나의 페이지에 모든 탭 열람일 경우 상품 상세설명 HTML 세팅 */
        // html설정
        var is_shop_view_tab_display = (options.shop_view_tab_display == 'Y');

        if (is_shop_view_tab_display) {
            let detail_html = null;
            let $seemore_wrap = null;

			if (use_cdn_optimized) {
				if (is_mobile_width) {
					loadTemplate('prodDetailMobile', $prod_detail_content_mobile, use_lazy_load ? setImageWidthHeightBeforeLoad : null);
				} else {
					loadTemplate('prodDetailPC', $prod_detail_content_pc, use_lazy_load ? setImageWidthHeightBeforeLoad : null);
				}
			} else {
				detail_html = IMWEB_TEMPLATE.loadSimple("prodDetailPC");
				$prod_detail_content_pc.html(detail_html);
				detail_html = IMWEB_TEMPLATE.loadSimple("prodDetailMobile");
				$prod_detail_content_mobile.html(detail_html);
			}

            $seemore_wrap = $body.find('._seemore_wrap');

            if ($seemore_wrap.length > 0) {
                $seemore_wrap.show();
                $prod_detail_content_pc.toggleClass('hide_seemore', false);
	            $prod_detail_content_mobile.toggleClass('hide_seemore', false);
            }
        }

		if (!use_cdn_optimized) {

			runLazyload();
		}

        prod_type = _prod_type;

        var hash_temp = location.hash.split('!/');

	    setTimeout(() => {
		    switch(hash_temp[0]){
			    case '#prod_detail_detail':
				    is_init_detail = true;
				    if(is_mobile_width) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.DETAIL);
				    else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.DETAIL);
				    break;
			    case '#prod_detail_review':
				    is_init_detail = true;
				    if(is_mobile_width) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.REVIEW);
				    else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.REVIEW);
				    if(hash_temp[1]){
					    SITE_SHOP_DETAIL.viewReviewDetail(hash_temp[1], 1, 'N', 'Y');
				    }
				    break;
			    case '#prod_detail_qna':
				    is_init_detail = true;
				    if(is_mobile_width) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.QNA);
				    else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.QNA);
				    if(hash_temp[1]){
					    SITE_SHOP_DETAIL.viewQnaDetail(hash_temp[1], 1, 'Y');
				    }
				    break;
			    case '#prod_detail_return':
				    is_init_detail = true;
				    if(is_mobile_width) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.RETURN);
				    else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.RETURN);
				    break;
			    default:

				    let target_tab = options.first_tab === "prod_detail"
						    ? SHOP_CONST.TAB_TYPE.DETAIL
						    : options.first_tab === "prod_review"
								    ? SHOP_CONST.TAB_TYPE.REVIEW
								    : options.first_tab === "prod_qna"
										    ? SHOP_CONST.TAB_TYPE.QNA
										    : options.first_tab === "prod_return"
												    ? SHOP_CONST.TAB_TYPE.RETURN
												    : "";

				    if(options.shop_view_tab_display === "N"){
					    if(is_mobile_width) {
						    SITE_SHOP_DETAIL.changeContentTab(target_tab, review_page, qna_page, false, false);
					    } else {
						    SITE_SHOP_DETAIL.changeContentPCTab(target_tab, review_page, qna_page, false, false);
					    }
				    }

				    checkSeemore(target_tab);
				    is_init_detail = true;
				    break;
		    }

		    /* 크리마 리뷰 사용 중일 시 위젯 호출 */
		    if(document.querySelector(".crema-product-reviews")){
			    if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
				    crema.run();
			    }
		    }
	    }, 200)

        if (cm_data.shop_view_buy_item_tooltip === 'Y') {
            $('.btn_tooltip[data-toggle="tooltip"]').tooltip({
                delay: { show: 500, hide: 1000000 }
            });
            var toggle_regularly = $("input[name='add_cart_type']");
            var $tooltip = $('.btn_tooltip[data-toggle="tooltip"]');
            var window_height = $(window).height();
            toggle_regularly.off('change').on('change', function () {
                $tooltip.css({ 'opacity': '0' });
                if ($(this).prop('checked')) {
                    if ($tooltip.length > 0) {
                        var window_height = $(window).height();
                        $.each($tooltip, function (k, v) {
                            var tooltip_y = v.getBoundingClientRect().y;
                            if (tooltip_y >= 0 && tooltip_y < window_height) {
                                $tooltip.css({ 'opacity': '1' });
                                $(v).tooltip('show');
                            }
                        });
                    }
                }
            });
            if ($tooltip.length > 0) {
                $.each($tooltip, function (k, v) {
                    var tooltip_y = v.getBoundingClientRect().y;
                    if (tooltip_y >= 0 && tooltip_y < window_height) {
                        // 툴팁이 화면 내에 보이지 않을 때 show하면 위치가 어긋나게 됨
                        setTimeout(function () {
                            $(v).tooltip('show');
                        }, 100);
                    }

                    $(window).scroll(function () {
                        if ($(v).next('.tooltip:visible').length === 0) {
                            var tooltip_y = v.getBoundingClientRect().y;
                            if (tooltip_y > 0 && tooltip_y < (window_height - $(v).height())) {
                                $(v).tooltip('show');
                            }
                        }
                    });
                });
            }
        }

        setTimesale();
        if (!is_prod_detail_page) {
            setImgZoom(30, 800, section_code);

            if ($first_photo_review_wrap.length > 0) {
                getFirstPhotoReview(1);
            }
        }

        /* resize 시 window_width 재계산 */
        let is_resizing = false;
        window.addEventListener('resize', function () {
            if (!is_resizing) {
                is_resizing = true;
                setTimeout(function () {
                    window_width = window.innerWidth;
					let was_mobile_width = is_mobile_width;
                    is_mobile_width = (window_width < SHOP_CONST.WIDTH_MOBILE);
					if(is_mobile_width != was_mobile_width){
						if(is_mobile_width){
							changeContentTab(current_content_tab);
						}else{
							/* 동영상 전체화면 시 PC 너비로 인지되는데 탭을 새로 그리면서 동영상이 다시 불러와지는 문제가 있어 예외처리 */
							if (!is_shop_view_tab_display && current_content_tab === SHOP_CONST.TAB_TYPE.REVIEW) {
								changeContentPCTab(current_content_tab);
							}
						}
						// 상단 조치로 인해 lazyload가 다시 실행되지 않아서 추가
						setTabHistory(current_content_tab);
						runLazyload();
					}
                    is_resizing = false;
                }, 100);
            }
        });

        /* debounce로 변경 */
		// const handleResize = _.debounce(function () {
		// 	window_width = window.innerWidth;
		// 	let was_mobile_width = is_mobile_width;
		// 	is_mobile_width = (window_width < SHOP_CONST.WIDTH_MOBILE /* 768w */);
		// 	if(is_mobile_width != was_mobile_width){
		// 		if(is_mobile_width){
		// 			changeContentTab(current_content_tab);
		// 		}else{
		// 			/* 동영상 전체화면 시 PC 너비로 인지되는데 탭을 새로 그리면서 동영상이 다시 불러와지는 문제가 있어 예외처리 */
		// 			if (!is_shop_view_tab_display && current_content_tab === SHOP_CONST.TAB_TYPE.REVIEW) {
		// 				changeContentPCTab(current_content_tab);
		// 			}
		// 		}
		// 		// 상단 조치로 인해 lazyload가 다시 실행되지 않아서 추가
		// 		setTabHistory(current_content_tab);
		// 		// runLazyload();
		// 	}
        // }, 100)

        // window.addEventListener('resize', handleResize);
    };

    var initProdStock = function (stock_use, stock, stock_un_limit) {
        prod_stock_use = stock_use;
        prod_stock = stock;
        prod_stock_unlimit = stock_un_limit;
    };

    var runLazyload = function () {
        if (!use_lazy_load)
            return false;

        var $seemore_wrap = $body.find('._seemore_wrap');
        // [TFR-1179] 한 페이지에 전체 노출 + 순차적 로드 + 상세정보 펼쳐보기 미사용 시 순차적 로드에 의해 다른 탭 스크롤이 밀리는 현상 방지를 위해 마지막 이미지는 레이지 로드 제외
        let is_except_last_lazy_load = options.shop_view_tab_display === 'Y' && $seemore_wrap.length == 0;
		if(is_mobile_width){
            let lazy_load_selector = 'img';
            if(is_except_last_lazy_load){
                let last_img = $prod_detail_content_mobile.find('img:last');
                last_img.attr('src', last_img.attr('data-original')).removeAttr('height');
                lazy_load_selector = 'img:not(:last)';
            }
			$prod_detail_content_mobile.find(lazy_load_selector).lazyload({		/* 상품 상세페이지 lazy load 적용, 기본 /img/no-image.png 는 한번만 불러옴 */
				placeholder: NO_IMAGE_URL,
				threshold: 100,
				effect: "fadeIn",
				load: function () {
					$(this).removeAttr('height');
					if ($seemore_wrap.length > 0) {
						// 레이지로드 이후 no-image보다 로딩된 이미지가 작아 펼쳐보기 높이 제한에 걸리지 않게 되면 펼쳐보기 해제
						setTimeout(function () {
							if ($prod_detail_content_mobile.outerHeight() < SHOP_CONST.SEEMORE_HEIGHT.MOBILE) {
								$prod_detail_content_mobile.toggleClass('hide_seemore', true);
								checkSeemore(current_content_tab);
							}
						}, 100);
					}
				}
			});
		}else{
            let lazy_load_selector = 'img';
            if(is_except_last_lazy_load){
                let last_img = $prod_detail_content_pc.find('img:last');
                last_img.attr('src', last_img.attr('data-original')).removeAttr('height');
                lazy_load_selector = 'img:not(:last)';
            }
			$prod_detail_content_pc.find(lazy_load_selector).lazyload({		/* 상품 상세페이지 lazy load 적용, 기본 /img/no-image.png 는 한번만 불러옴 */
				placeholder: NO_IMAGE_URL,
				threshold: 100,
				effect: "fadeIn",
				load: function () {
					$(this).removeAttr('height');
					if ($seemore_wrap.length > 0) {
						// 레이지로드 이후 no-image보다 로딩된 이미지가 작아 펼쳐보기 높이 제한에 걸리지 않게 되면 펼쳐보기 해제
						setTimeout(function () {
							if ($prod_detail_content_pc.outerHeight() < SHOP_CONST.SEEMORE_HEIGHT.PC) {
								$prod_detail_content_pc.toggleClass('hide_seemore', true);
								checkSeemore(current_content_tab);
							}
						}, 100);
					}
				}
			});
		}
    };

    var setImgZoom = function (margin, max_width, section_code) {
        if ($('.shop_view .xzoom').length > 0) {
            var shop_view_xzoom = $('.shop_view .xzoom, .shop_view .xzoom-gallery').xzoom({ Xoffset: margin, openOnSmall: false, defaultScale: 0, scroll: false, custom: true, hover: true });
            if (typeof shop_view_xzoom != 'undefined') {
                // 연관상품 장바구니 확인 후 닫을 시 재실행되면서 오류나는 문제 방지
                shop_view_xzoom.eventmove = function (element) {
                    var $xzoom_preview = $('.shop_view .xzoom-preview');
                    $xzoom_preview.addClass(section_code);
                    var $xzoom_preview_img = $xzoom_preview.find('img');
                    var $xzoom = $('.shop_view .xzoom');
                    var xzoom_width = $(window).width() - ($xzoom.offset().left + $xzoom.outerWidth() + margin * 2);
                    if (xzoom_width > max_width) {
                        xzoom_width = max_width;
                    }
                    var xzoom_height = xzoom_width;
                    var xzoom_preview_img_width = $xzoom_preview_img.outerWidth();
                    var xzoom_preview_img_height = $xzoom_preview_img.outerHeight();
                    if (xzoom_preview_img_width < xzoom_width || xzoom_preview_img_height < xzoom_height) {
                        shop_view_xzoom.closezoom();
                    } else {
                        $xzoom_preview.outerWidth(xzoom_width);
                        $xzoom_preview.outerHeight(xzoom_height);
                        element.bind('mousemove', shop_view_xzoom.movezoom);
                    }
                    $xzoom_preview.mouseover(shop_view_xzoom.closezoom);
                };
            }
        }
    };

    var setTimesale = function () {
        var $doz_timesale_wrap = $('#prod_goods_form ._doz_timesale_wrap');
        if ($doz_timesale_wrap.length > 0) {
            $doz_timesale_wrap.each(function () {
                var $that = $(this);
                var $doz_timesale = $that.find('._doz_timesale');
                var start_time = ($that.find('._doz_timesale').attr('data-start-time') * 1000);
                var timesale_interval = setInterval(function () {
                    var remain_ms = ($doz_timesale.attr('data-end-time') * 1000) - start_time;
                    if (remain_ms > 0) {
                        var remain_d = Math.floor(remain_ms / 86400000);
                        var remain_h = Math.floor((remain_ms % 86400000) / 3600000);
                        var remain_m = Math.floor((remain_ms % 3600000) / 60000);
                        var remain_s = Math.floor((remain_ms % 60000) / 1000);

                        var remain_hh = remain_h < 10 ? '0' + remain_h : '' + remain_h;
                        var remain_mm = remain_m < 10 ? '0' + remain_m : '' + remain_m;
                        var remain_ss = remain_s < 10 ? '0' + remain_s : '' + remain_s;

                        if (remain_d >= 1) {
	                        $doz_timesale.html(getLocalizeString('설명_상세페이지타임세일종료까지n1일n2시n3분n4초남음', [remain_d, remain_hh, remain_mm, remain_ss], "<label class='text-bold text-brand'>타임세일</span> 종료까지 <strong>%1일 %1:%2:%3</strong> 남음"));
                        } else {
                            $doz_timesale.html(getLocalizeString('설명_상세페이지타임세일종료까지n1시n2분n3초남음', [remain_hh, remain_mm, remain_ss], "<label class='text-bold text-brand'>타임세일</span> 종료까지 <strong>%1:%2:%3</strong> 남음"));
                        }
                        start_time = start_time + 1000;
                    } else {
                        /* 타임세일 종료 */
                        clearInterval(timesale_interval);
                        $that.remove();
                    }
                }, 1000);
            });
        }
    };

    /**
     * 다국어코드를 백엔드에서 호출하여 자바스크립트에 저장하는 함수
     * initDetail 피라미터 개수가 다른 히스토리를 모르겠어서 일단 따로 만들었음
     * @param code
     */
    var initLocalize = function (code) {
        total_price_localize_text = code;
    };

    /**
     * 특정상품 위시리스트 추가 처리
     * @param prod_code
     */
    var addProdWish = function (prod_code, back_url) {
        var back_url = typeof back_url == 'undefined' ? '' : back_url;
        $.ajax({
            type: 'POST',
            data: { 'prod_code': prod_code },
            url: ('/shop/add_prod_wish.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    if (res.res == 'add') {
                        if (typeof FB_PIXEL != 'undefined') FB_PIXEL.AddToWishlist();
                        if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.AddToWishlist();
	                    if (typeof NP_NDA != 'undefined') NP_NDA.AddToWishList(prod_code);
                        if (typeof TIKTOK_PIXEL != 'undefined') {
                            // TIKTOK_PIXEL.track('AddToWishlist', {
                            //     contents: [
                            //         {
                            //             content_id: options.prod_idx,
                            //             content_name: res.prod_name,
                            //             quantity: res.wish_cnt,
                            //             price: options.prod_price
                            //         },
                            //     ],
                            //     content_type: 'product',
                            //     value: options.prod_price,
                            //     currency: res.currency,
                            // });
                        }

                        if ($wish_buttons) {
                            toggleWishButtons($wish_buttons, res.wish_cnt, options.is_show_wish_count, true);
                        }
                        if ($(".wish-icon-" + prod_code).length > 0) {
                            $(".wish-icon-" + prod_code).removeClass('im-ico-like');
                            $(".wish-icon-" + prod_code).addClass('im-ico-liked');
                        }
                    } else if (res.res == 'delete') {
                        if ($wish_buttons) {
                            toggleWishButtons($wish_buttons, res.wish_cnt, options.is_show_wish_count, false);
                        }
                        if ($(".wish-icon-" + prod_code).length > 0) {
                            $(".wish-icon-" + prod_code).removeClass('im-ico-liked');
                            $(".wish-icon-" + prod_code).addClass('im-ico-like');
                        }
                        if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.addCountUserProfileAttr('wishCount', -1);
                    }
                    if ($(".wish-text-" + prod_code).length > 0) {
                        $(".wish-text-" + prod_code).text(res.wish_cnt);
                    }
                } else if (res.msg === 'NON_MEMBERS') {
                    SITE_MEMBER.openLogin(back_url);
                } else {
                    alert(res.msg);
                }
            }
        });
    };
    /**
     * 특정상품 위시정보 가져오기 (내 위시여부,위시갯수)
     * @param prod_code
     */
    var getProdWish = function (prod_code) {
        $.ajax({
            type: 'POST',
            data: { 'prod_code': prod_code },
            url: ('/shop/get_prod_wish.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                } else
                    alert(res.msg);
            }
        });
    };
    /**
     * 두개의 옵션 데이터가 같은지 확인 (순서 무관)
     * @param options1 [ {option_code: option_value} ]
     * @param options2 [ {option_code: option_value} ]
     */
    var isSameOptionList = function (options1, options2) {
        if (options1.length == options2.length) {
            var isSame = true;
            var exist = false;
            $.each(options1, function (no, data) {
                exist = false;
                $.each(options2, function (no2, data2) {
                    if (data.option_code == data2.option_code) {
                        if (data.value_code != '') {
                            if (data.value_code == data2.value_code) {
                                exist = true;
                                return false;
                            }
                        } else {
                            if (data.value_name == data2.value_name) {
                                exist = true;
                                return false;
                            }
                        }
                    }
                });
                if (!exist) {
                    isSame = false;
                    return false;
                }
            });
            return isSame;
        } else {
            return false;
        }
    };

    /**
     * 상품 이미지 롤링 시작
     */
    var startProdImageRolling = function (autoWidth) {

        var items = $prod_image_list.find('._item');
        var is_dots = false;
        is_dots = items.length > 1 ? true : false;

        if (is_dots) {
            switch (cm_data.paging_style_type) {
                case 'st00':
                    switch (cm_data.paging_default_style_type) {
                        case 'st00':
                            $prod_image_list_rolling.toggleClass('paging_type_dot paging_type_dot01', true);
                            break;
                        case 'st01':
                            $prod_image_list_rolling.toggleClass('paging_type_dot paging_type_dot02', true);
                            break;
                    }
                    break;
                case 'st01':
                    $prod_image_list_rolling.toggleClass('paging_type_big_dot', true);
                    break;
                case 'st02':
                    $prod_image_list_rolling.toggleClass('paging_type_line', true);
                    break;
                case 'st03':
                    switch (cm_data.paging_active_style_type) {
                        case 'st00':
                            $prod_image_list_rolling.toggleClass('paging_type_count paging_type_count01', true);
                            break;
                        case 'st01':
                            $prod_image_list_rolling.toggleClass('paging_type_count paging_type_count02', true);
                            break;
                        case 'st02':
                            $prod_image_list_rolling.toggleClass('paging_type_count paging_type_count03', true);
                            break;
                    }
                    break;
            }
        }

        if (autoWidth) {
            $prod_image_list_rolling.owlCarousel({
                dots: is_dots,
                navigation: true,
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true,
                animateOut: 'fadeOut',
                items: 1,
                autoHeight: true,
                autoWidth: true,
                onInitialized: function () {
                    var owl_item_list = $prod_image_list.find('.owl-item');
                    var first_url = $(items[0]).find('img').attr('src');
                    var max_width = 750;
                    // TODO: is_prod_detail_page가 명확하지 않아 장바구니 임시조치
                    // shopping_list에서 들어오면 400으로 잡아야 함
                    if ($('.modal_prod_detail_from_shopping_list').length > 0) {
                        var max_width = 400;
                    } else if ($prod_detail.width() < max_width) {
                        max_width = $prod_detail.width();
                    }
                    $.each(owl_item_list, function (key, value) {
                        var $value = $(value);
                        var image_url = $value.find('img').attr('src');
                        var image = new Image();
                        image.onload = function () {
                            var that = this;
                            // owl initialized 이후 내부적으로 resized를 하면서 크기가 어긋나는 경우가 있어 timeout을 둠
                            setTimeout(function () {
                                var org_width = that.width;
                                var org_height = that.height;
                                var width = org_width > max_width ? max_width : org_width;
                                var height = width * (org_height / org_width);
                                const new_width = getComputedStyle($prod_image_list[0]).margin == '0px -15px' ? width + 30 : width;
                                const new_height = getComputedStyle($prod_image_list[0]).margin == '0px -15px' ? height - 30 : height;
                                $value.css({ 'width': new_width + 'px', 'height': new_height + 'px' });
                                if (that.src === first_url) {
                                    // 첫 이미지 크기 세팅
                                    $prod_image_list.find('.owl-carousel').css({ 'width': `${new_width}px`, 'height': `${new_height}px` });
                                    $prod_image_list.find('.owl-height').css({ 'height': `${new_height}px` });
                                }
                            }, 5);
                        };
                        image.src = image_url;
                    });
                },
                onChanged: function () {
                    var owl = $prod_image_list_rolling.data('owlCarousel');
                    var current = 0;
                    if (typeof owl !== "undefined") current = owl._current;
                    var li_list = $prod_image_list.find('li.owl-dot');
                    li_list.find('a').removeClass('active');
                    li_list.eq(current).find('a').addClass('active');
                    if (items.length > 1) {
                        $prod_goods_form.find('header').css('margin-top', 0);
                    }
                    // 현재 이미지 너비로 슬라이드 너비 수정
                    var current_width = $(items[current]).find('img').css('width');
                    $prod_image_list.find('.owl-carousel').css({ 'width': current_width, 'height': '' });
                }
            });
        } else {
            $prod_image_list_rolling.owlCarousel({
                dots: true,
                navigation: true,
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true,
                animateOut: 'fadeOut',
                items: 1,
                autoHeight: false,
                onInitialized: function () {
                    var owl_item_list = $prod_image_list.find('.owl-item');
                    var total = owl_item_list.length;
                    var html = '';
                    html += '<span class="_numbering_variable">1</span> <span class="_numbering_total">/ ' + total + '</span>';
                    if (total <= 1) {
                        $("._carousel_count_numbering").hide();
                    }
                    else {
                        $("._carousel_count_numbering").append(html);
                    }
                },
                onChanged: function () {
                    var owl = $prod_image_list_rolling.data('owlCarousel');
                    var current = 0;
                    if (typeof owl !== "undefined") current = owl._current;
                    var now = parseInt(current);
                    var html = '';
                    html += '<span class="_numbering_variable">' + (now + 1) + '</span>';
                    $("._numbering_variable").html(html);
                }
            });
        }
    };

    /**
     * 상품 이미지 롤링 특정 위치 이동
     * @param no
     */
    function changeProdImageRolling(no) {
        var owl = $prod_image_list_rolling.data('owlCarousel');
        if (typeof owl !== "undefined") {
            owl.to(no);

            var option_img_list = $prod_image_list.find('._color_option_img');
            if (option_img_list.length) {
                $prod_image_list.attr('data-preview-type', 'prod');
                option_img_list.attr('data-visible', 'false');
            }
        }
    }

    const loadProductDetail = function (code, idx, menu_code, current_url) {
        $.ajax({
            type: 'POST',
            data: { 'idx': idx, 'menu_code': menu_code, current_url },
            url: ('/shop/load_product_detail.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    $('.shop_detail_wrap_csr_' + code).html(result.html);

		                function injectHTMLWithScripts(html, target = document.body) {
			                const wrapper = document.createElement('div');
			                wrapper.innerHTML = html;

			                // 먼저 script를 제외한 나머지 노드 삽입
			                const scripts = wrapper.querySelectorAll('script');
			                scripts.forEach(script => script.remove()); // 미리 제거

			                // 나머지 HTML 삽입
			                Array.from(wrapper.childNodes).forEach(node => target.appendChild(node));

			                // script 수동 실행
			                scripts.forEach(oldScript => {
				                const newScript = document.createElement('script');

				                // 복사: src / type / defer / async 등
				                for (const attr of oldScript.attributes) {
					                newScript.setAttribute(attr.name, attr.value);
				                }

				                // inline script일 경우 textContent 복사
				                if (!oldScript.src) {
					                newScript.textContent = oldScript.textContent;
				                }

				                // 실행
				                document.body.appendChild(newScript);
			                });
		                }

										if (result.script){
											injectHTMLWithScripts(result.script);
										}


	                // 최근 본 상품, refresh
										if (window.RECENT_PRODUCT && typeof window.RECENT_PRODUCT.refresh === 'function') {
											window.RECENT_PRODUCT.refresh();
										}

										// 상세페이지 CSR 로드 완료
										document.dispatchEvent(new CustomEvent('productDetailLoaded', {detail: {idx}}));
								}
            },
            error: function (req, status, error) {
                document.write(req.responseText);
            }
        });
    };

    const loadBookingDetail = function (code, idx, day, endDay, current_url) {
        $.ajax({
            type: 'POST',
            data: { 'idx': idx, 'day': day, 'endDay': endDay, current_url, 'widgetCode': code },
            url: ('/shop/load_booking_detail.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    $('.book_detail_wrap_csr_' + code).html(result.output);
                }
            }
        });
    };

    const loadCode = function (code) {
        $.ajax({
            type: 'POST',
            data: { 'code': code },
            url: ('/shop/load_code.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    // DOM에 콘텐츠를 추가하는 함수
                    const appendContentToDOM = function() {
                        $('.code_wrap_csr_' + code).html(result.output);

                        // script 태그를 찾아서 실행
                        const $container = $('.code_wrap_csr_' + code);
                        $container.find('script').each(function() {
                            const scriptContent = $(this).html();
                            if (scriptContent) {
                                try {
                                    // script 내용 실행
                                    setTimeout(function() {
                                        eval(scriptContent);
                                    }, 0);
                                } catch (e) {
                                    console.error('Script execution error:', e);
                                }
                            }
                        });
                    };

                    // 다른 CSR 위젯이 로드되었는지 확인
                    const checkInterval = setInterval(function () {
                        const target_now = $('[class^="shop_detail_wrap_csr_"], [class^="book_detail_wrap_csr_"]');
                        const target = target_now.length > 0 ? target_now.first() : null;


                        if (!target) {
                            clearInterval(checkInterval); // 감지 종료
                            appendContentToDOM();
                            return;
                        }


                        if (target.is(':empty')) {
                            return;
                        }
                        
                        // prod_detail 요소가 있는지 확인
                        if (!target.find('#prod_detail').length) {
														return;
                        }

                        clearInterval(checkInterval); // 감지 종료
                        appendContentToDOM();
                    }, 100); // 100ms 간격으로 검사
                }
            }
        });
    };

    var loadOption = function (type, prod_idx) {
        $.ajax({
            type: 'POST',
            data: { 'type': type, 'prod_idx': prod_idx, 'selected_require_options': selected_require_options, '__': prod_edit_time },
            url: ('/shop/load_option.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    max_prod_quantity = result.max_prod_quantity;
                    max_member_quantity = result.max_member_quantity;
                    maximum_purchase_quantity_type = result.maximum_purchase_quantity_type;
                    optional_limit = result.optional_limit;
                    optional_limit_type = result.optional_limit_type;
                    $options.html(result.option_html);

                    // 색상 옵션이 있고 + 색상 옵션의 이미지까지 있다면
                    if (options.exist_color_option && options.is_exist_color_option_images) {
                        if ($prod_image_list.find('.xzoom').length) {
                            // xzoom 사용
                            $options.find('label[data-opttype]').hover(function () {
                                var $_that = $(this);
                                var $_target_wrap = $("#btn_owl_" + $_that.attr('data-optcode'));
                                if (!$_target_wrap.length) {
                                    $_target_wrap = $("#btn_owl_0");
                                }
                                $_target_wrap.find('a').trigger('click');
                            });
                        } else {
                            // xzoom 미사용2
                            var $_color_option_img = $prod_image_list.find('._color_option_img');
                            if ($_color_option_img.length) {
                                (function () {
                                    var hover_evnets = (IS_MOBILE ? 'touchstart touchend' : 'mouseover');
                                    $options.find('label[data-opttype] ._bg').off(hover_evnets).on(hover_evnets, function (e) {
                                        // mouse over
                                        var $_that = $(this);
                                        var opt_code = $_that.attr('data-optcode');
                                        var $_target = $_color_option_img.filter('[data-optcode="' + opt_code + '"]');

                                        $_color_option_img.attr('data-visible', 'false');

                                        if ($_target.length) {
                                            if ($_target.attr('src').length == 0) {
                                                $_target.attr('src', $_target.attr('data-src'));
                                                // 이미지 load 이벤트
                                                $_target.on('load', function () {
                                                    var _width = this.naturalWidth;
                                                    var _height = this.naturalHeight;

                                                    if (_width == _height) {
                                                        var _wrap_width = $prod_image_list.width();
                                                        var _wrap_height = $prod_image_list.height();

                                                        if (_wrap_width == _wrap_height) {
                                                            $(this).attr('data-size-type', 'A');
                                                        } else if (_wrap_width > _wrap_height) {
                                                            $(this).attr('data-size-type', 'B');
                                                        } else {
                                                            $(this).attr('data-size-type', 'C');
                                                        }
                                                    } else if (_width > _height) {
                                                        $(this).attr('data-size-type', 'B');
                                                    } else {
                                                        $(this).attr('data-size-type', 'C');
                                                    }
                                                });
                                            }
                                            $prod_image_list.attr('data-preview-type', 'option');
                                            $_target.attr('data-visible', 'true');
                                        }

                                        switch (e.type) {
                                            case 'touchstart':
                                                prod_option_touching = true;
                                                break;
                                            case 'touchend':
                                                prod_option_touching = false;
                                                break;
                                        }
                                    });

                                    $options.find('label[data-opttype] ._bg').off('mouseout').on('mouseout', function (e) {
                                        // mouse out
                                        var $_that = $(this);
                                        var opt_code = $_that.attr('data-optcode');
                                        var $_target = $_color_option_img.filter('[data-optcode="' + opt_code + '"]');

                                        $prod_image_list.attr('data-preview-type', 'prod');

                                        if ($_target.length) {
                                            $_target.attr('data-visible', 'false');
                                        }
                                    });

                                    if (IS_MOBILE) {
                                        // 모바일일 경우 터치이벤트 추가
                                        var $_body = $("#doz_body");
                                        if (!$_body.hasClass('_bind_touchstart_evt')) {
                                            $_body.on('touchstart', function (e) {
                                                if (!prod_option_touching) {
                                                    $prod_image_list.attr('data-preview-type', 'prod');
                                                    if ($_color_option_img.length) {
                                                        $_color_option_img.attr('data-visible', 'false');
                                                    }
                                                }
                                            }).addClass('_bind_touchstart_evt');
                                        }
                                    }
                                })();
                            }
                        }
                    }

                    if (IS_MOBILE) {
                        addEventMobileOptionInput();
                    }

                } else {
                    alert(result.msg);
                }
            }
        });

				if($prod_additional.length > 0){
					loadProdAdditional(prod_idx);
				}
    };

		var loadProdAdditional = function (prod_idx) {
			if(is_mobile_width){
				$.ajax({
					type : 'POST',
					data : {'prod_idx' : prod_idx, 'selected_additional_prod_idx' : current_select_additional_prod_idx, '__' : prod_edit_time},
					url : (
							'/shop/load_prod_additional_mobile.cm'
					),
					dataType : 'json',
					cache : false,
					success : function(result){
						if(result.msg == 'SUCCESS'){
							// 추가 상품
							if(!result.prod_additional.prod_list.length) return;
							$prod_additional.html(result.prod_additional_sheet_contents);
							// $prod_additional.html(result.prod_additional.html);
							// $prod_additional.find('#btnProdAdditionalSelect').off('click').on('click', function(e){
							// 	e.stopPropagation();
							// 	imSheet.open({
							// 		id: 'prod_additional_sheet',
							// 		html: result.prod_additional_sheet_contents,
							// 		backdrop: 'rgba(0, 0, 0, 0.15)',
							// 		zIndex: 17001
							// 	});
							// });
						}else{
							alert(result.msg);
						}
					}
				});
			}else{
				$.ajax({
					type: 'POST',
					data: {'prod_idx': prod_idx, 'selected_additional_prod_idx': current_select_additional_prod_idx, '__': prod_edit_time },
					url: ('/shop/load_prod_additional.cm'),
					dataType: 'json',
					cache: false,
					success: function (result) {
						if (result.msg == 'SUCCESS') {
							// 추가 상품
							if(!result.prod_additional.prod_list.length) return;
							$prod_additional.html(result.prod_additional.html);
						} else {
							alert(result.msg);
						}
					}
				});
			}

    };

		var loadProdAdditionalOptions = function (product_idx, cb) {
			if(is_mobile_width){
				$.ajax({
					type: 'POST',
					data: {'prod_idx': product_idx, 'selected_require_options': selected_prod_additional_require_options, '__': prod_edit_time, 'is_additional': true },
					url: ('/shop/load_prod_additional_option_mobile.cm'),
					dataType: 'json',
					cache: false,
					success: function (result) {
						if (result.msg == 'SUCCESS') {
							prod_additional_require_option_count = {
								...prod_additional_require_option_count,
								...result.require_option_count};
							prod_additional_require_input_option_count = {
								...prod_additional_require_input_option_count,
								...result.require_input_option_count
							};
							// 모바일에서는 드롭다운이 동작하지 않도록 클릭 이벤트 대치
							$prod_additional_options.html(result.option_html).find('._form_parent:not(.disabled) ._form_select_wrap > a, ._requireInputOption').each(function(e){
								let $that = $(this);
								$that.on('click', function(e){
									e.stopPropagation();
									loadProdAdditionalOptionRequire(product_idx, $that.attr('data-option-code'));
								});
							});

							var full_input = false;
							var $form = $prod_additional_options.find('._form_parent');
							// 첫번째 선택 후 창을 닫았을때
							$form.each(function (index) {

								var is_input = $(this).children().hasClass('option_box_wrap');

								if (is_input) {
									var input_items = $(this).find('._requireInputOption');
									input_items.each(function (index) {
										if ($(this).val() != '') {
											if ((index + 1) == input_items.length) {
												full_input = true;
											}
										} else {
											return false;
										}
									});

								} else {
									var prev_is_selected = $(this).prev().find('.dropdown-item').hasClass('selected');
									var is_selected = $(this).find('.dropdown-item').hasClass('selected');
									// 이전 필수 드롭다운이 선택 되어 있을 경위
									if (prev_is_selected || full_input) {
										$(this).toggleClass('disabled', false);

										full_input = false;

										/* 드롭다운 활성화는 loadProdAdditionalOptionRequire의 시트 호출로 대체 */
									} else if (index === 0) {
										// 첫 드롭다운은 일단 true로 표시
										$(this).toggleClass('disabled', false);
									} else {
										$(this).toggleClass('disabled', true);
									}
								}
							});

							if (typeof prod_additional_require_option_count[product_idx] == 'undefined' || selected_prod_additional_require_options.length == prod_additional_require_option_count[product_idx]){
								/* 필수 옵션이 모두 선택되었을 경우 시트를 닫음 */
								imSheet.close('prod_additional_sheet');
							}else{
								loadProdAdditionalOptionRequire(product_idx);
							}

							updateSelectedOptions('prod');
						} else {
							alert(result.msg);
						}
					}
				});
			}else{
				$.ajax({
					type: 'POST',
					data: {'prod_idx': product_idx, 'selected_require_options': selected_prod_additional_require_options, '__': prod_edit_time},
					url: ('/shop/load_prod_additional_option.cm'),
					dataType: 'json',
					cache: false,
					success: function (result) {
						if (result.msg == 'SUCCESS') {
							prod_additional_require_option_count = {
								...prod_additional_require_option_count,
								...result.require_option_count};
							prod_additional_require_input_option_count = {
								...prod_additional_require_input_option_count,
								...result.require_input_option_count
							};
							$prod_additional_options.html(result.option_html);
							// PC 인라인 컨테이너 사용 후, 다른 상품 선택 시 기존 인라인 영역 정리
							try{
								if($prod_additional_options.hasClass('_prod_additional_inline_options')){
									$('._prod_additional_inline_options').not($prod_additional_options).remove();
								}
							}catch(e){}

							updateSelectedOptions('prod');
						} else {
							alert(result.msg);
						}
					}
				});
			}
		}

	/**
	 * 모바일 추가 상품 선택 시 다음 필수 옵션에 대한 html을 시트에 출력
	 * @param product_idx
	 * @param option_code
	 */
		var loadProdAdditionalOptionRequire = function(product_idx, option_code = null) {
			$.ajax({
				type: 'POST',
				data: {'prod_idx': product_idx, 'option_code': option_code, 'selected_require_options': selected_prod_additional_require_options, '__': prod_edit_time, 'is_additional': true },
				url: ('/shop/load_prod_additional_option_require.cm'),
				dataType: 'json',
				cache: false,
				success: function (result) {
					if (result.msg == 'SUCCESS') {
						prod_additional_require_option_count = {
							...prod_additional_require_option_count,
							...result.require_option_count};
						prod_additional_require_input_option_count = {
							...prod_additional_require_input_option_count,
							...result.require_input_option_count
						};

						// 현재 시트의 내용을 받아온 옵션(html)으로 변경(시트를 닫고 새로 열어줌)
						imSheet.close('prod_additional_sheet', () => {
							imSheet.open({
								id: 'prod_additional_sheet',
								html: result.prod_additional_sheet_contents,
								backdrop: 'rgba(0, 0, 0, 0.15)',
								zIndex: 17001
							});
						});
					} else {
						alert(result.msg);
					}
				}
			});
		}

		/**
		 * 모바일 추가 상품 선택 옵션에 대한 html을 시트에 출력
		 * @param product_idx
		 * @param option_code
		 */
		var loadProdAdditionalOptionOptional = function(product_idx, option_code) {
			$.ajax({
				type: 'POST',
				data: {'prod_idx': product_idx, 'option_code': option_code, '__': prod_edit_time, 'is_additional': true },
				url: ('/shop/load_prod_additional_option_optional.cm'),
				dataType: 'json',
				cache: false,
				success: function (result) {
					if (result.msg == 'SUCCESS') {
						// 현재 시트의 내용을 받아온 옵션(html)으로 변경(시트를 닫고 새로 열어줌)
						imSheet.close('prod_additional_sheet', () => {
							imSheet.open({
								id: 'prod_additional_sheet',
								html: result.prod_additional_sheet_contents,
								backdrop: 'rgba(0, 0, 0, 0.15)',
								zIndex: 17001
							});
						});
					} else {
						alert(result.msg);
					}
				}
			});
		}

		/**
		 * 추가 상품 선택 시 선택 옵션에 대한 html을 반환
		 * @param product_idx
		 * @param option_code
		 */
		var loadProdAdditionalOptionalList = function() {
			$('._prod_additional_option_optional').each((k, v) => {
				let $that = $(v);
				let product_idx = $that.attr('data-prod-idx');
				if($that.attr('data-prod-idx') > 0){
					$.ajax({
						type: 'POST',
						data: {'prod_idx': $that.attr('data-prod-idx'), '__': prod_edit_time, 'is_additional': true },
						url: ('/shop/load_prod_additional_optional_list.cm'),
						dataType: 'json',
						cache: false,
						success: function (result) {
							if (result.msg == 'SUCCESS') {
								if(is_mobile_width){
									$that.html(result.option_html).find('._form_select_wrap > a').each(function(e){
										let $form = $(this);
										$form.on('click', function(e){
											e.stopPropagation();
											loadProdAdditionalOptionOptional(product_idx, $form.attr('data-option-code'));
										});
									});
								}else{
									$that.html(result.option_html);
								}
							}
						}
					});
				}
			});
		}

    var loadDelivSetting = _.debounce(function (prod_idx, change_country, deliv_type, deliv_pay_type) {
        $deliv_country = change_country;
        $deliv_pay_type = deliv_pay_type;
            var is_design_mode = (location.pathname.indexOf('/admin/design') != -1);
            $.ajax({
                type: 'GET',
                data: { 'prod_idx': prod_idx, 'change_country': change_country, 'deliv_type': deliv_type, 'deliv_pay_type': deliv_pay_type, '__': MEMBER_HASH },
                url: (is_mobile_width ? '/shop/load_deliv_setting.cm' : '/shop/load_deliv_setting_pc.cm'),
                dataType: 'json',
                cache: !is_design_mode,
                async: false,
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        $prod_deliv_setting.html(result.deliv_html);
                        if (is_mobile_width) {
                            $prod_detail.find('._today_arrival_wrap').html(result.today_arrival_html);
                        }

                        /* 환불 정보 입력 */
                        last_refund_data = result.refund;
                        setDetailReturnHtml();

                        $prod_detail.find('._item_detail_wrap').html(result.item_detail_html);

                        if (IS_MOBILE) {
                            addEventMobileOptionInput();
                        }

                        if (typeof naver != typeof void 0 && !!naver.NaverPayButton) {
														try{
															if(!document.getElementById('naverPayWrap').innerHTML){
																makeNaverPayBtn('naverPayWrap', (
																		change_country == 'KR' || change_country == 'none' || change_country == ''
																));
															}
														} catch(e) {

														}
                        }

                        if (typeof kakaoCheckout != 'undefined' && typeof makeTalkPayButton != 'undefined') {
                            var _target_container_id = 'create-kakao-checkout-button';
                            _target_container_id = document.getElementById(_target_container_id) ? _target_container_id : 'create-kakao-checkout-button-mobile';
                            if (!document.getElementById(_target_container_id).innerHTML) {
                                makeTalkPayButton(_target_container_id, (change_country == 'KR' || change_country == 'none' || change_country == ''));
                            }
                        }

                    } else {
                        alert(result.msg);
                    }
                }
            });
    }, 100, { leading: true, trailing: false});

    /**
     * 선택형 필수 옵션 선택
     * @param type cart (장바구니변경), prod(상품상세)
     * @param option_code
     * @param value_code
     */
    var selectRequireOption = function (type, prod_idx, option_code, value_code, value_name, success) {
        var data = { 'value_type': 'SELECT', 'option_code': option_code, 'value_code': value_code, 'value_name': value_name };
        var no = findSelectedRequireOption(option_code);
        if (no == -1) {
            if (value_code == '') return;
            selected_require_options.push(data);
            /** 처음 선택된 옵션인 경우 새로 추가*/
        } else {
            if (value_code == '') {
                /** 옵션 삭제 */
                selected_require_options.splice(no, (selected_require_options.length - no));
            } else {
                selected_require_options[no] = data;
                /** 이미 선택된 옵션인 경우 기존 값 교체 */
                if (no < selected_require_options.length - 1) {
                    selected_require_options.splice(no + 1, (selected_require_options.length - (no + 1)));
                }
            }
        }
        if (selected_require_options.length == require_option_count) {
            /** 필수 옵션이 모두 선택되었을 경우*/
            selectOption(
                prod_idx, 
                {
                    options: selected_require_options,
                    require: true,
                    count: 1
                },
                function () { 
                    selected_require_options = []; 
                    loadOption(type, prod_idx);
                    success(); 
                },
                function (msg) {
                    alert(msg);
                }
            );
        } else {
            /** 필수옵션 선택이 아직 끝나지 않았을 경우 옵션 재로드 */
            loadOption(type, prod_idx);
        }
    };

    /**
     * 입력형 필수 옵션 변경시 처리
     * @param type cart (장바구니변경), prod(상품상세)
     */
    var changeRequireInputOption = function (type, prod_idx, option_code, msg, success) {
        var data = { 'value_type': 'INPUT', 'option_code': option_code, 'value_code': '', 'value_name': msg };
        var no = findSelectedRequireOption(option_code);
        if (no == -1) {
            if (msg == '') return;
            selected_require_options.push(data);
            /** 처음 입력한 옵션인 경우 새로 추가*/
        } else {
            if (msg == '') {
                /** 입력형 옵션 삭제 */
                selected_require_options.splice(no, (selected_require_options.length - no));
            } else {
                /** 기존값 교체 */
                selected_require_options[no] = data;
            }
        }
        if (selected_require_options.length == require_option_count) {
            /** 필수 옵션이 모두 선택되었을 경우*/
            selectOption(
                prod_idx,
                {
                    options: selected_require_options,
                    require: true,
                    count: 1
                },
                function () {
                    selected_require_options = [];
                    loadOption(type, prod_idx);
                    success();
                },
                function (msg) {
                    alert(msg);
                }
            );
        } else {
            if (IS_MOBILE && selected_require_options.length == require_input_option_count) loadOption(type, prod_idx);
        }
    };

		/**
     * 입력형 필수 옵션 변경시 처리
     * @param type cart (장바구니변경), prod(상품상세)
     */
    var changeProdAdditionalRequireInputOption = function (type, prod_idx, option_code, msg, success) {
        var data = { 'value_type': 'INPUT', 'option_code': option_code, 'value_code': '', 'value_name': msg };
        var no = findSelectedRequireOption(option_code);
        if (no == -1) {
            if (msg == '') return;
            selected_prod_additional_require_options.push(data);
            /** 처음 입력한 옵션인 경우 새로 추가*/
        } else {
            if (msg == '') {
                /** 입력형 옵션 삭제 */
                selected_prod_additional_require_options.splice(no, (selected_prod_additional_require_options.length - no));
            } else {
                /** 기존값 교체 */
                selected_prod_additional_require_options[no] = data;
            }
        }
        if (selected_prod_additional_require_options.length == prod_additional_require_option_count[prod_idx]) {
            /** 필수 옵션이 없거나 모두 선택되었을 경우*/
            selectProdAdditionalOption(prod_idx, selected_prod_additional_require_options, true, 1, function () {
		            if(is_mobile_width){
			            imSheet.close('prod_additional_sheet');
		            }
	              current_select_additional_prod_idx = 0;
                selected_prod_additional_require_options = [];
	              $prod_additional_options.html('');
                    $('#prod_additional_drop_menu_content').text(getLocalizeString('타이틀_추가상품', '', '추가 상품'));  // PC
                    // 인라인 컨테이너 초기화 및 원래 위치로 복구
                    try{ $('._prod_additional_inline_options').remove(); $prod_additional_options = $prod_additional_options_default; }catch(e){}
	              $('#btnProdAdditionalSelect').text(getLocalizeString('타이틀_추가상품', '', '추가 상품'));  // 모바일
                success();
            }, function (msg) {
                alert(msg);
            });
        } else {
	        loadProdAdditionalOptions(prod_idx);
        }
    };

    /**
     * 옵션 선택
     * @param options [ {value_type: SELECT/INPUT, option_code:, value_code:, value_name:} ]
     */
    var selectOption = function (prod_idx, {options, require, count, idx = 0}, success, failed) {
        var btn_buy_onclick_temp = $('._btn_buy').attr('onclick');
        var btn_regularly_onclick_temp = $('._btn_regularly').attr('onclick');
        var btn_cart_onclick_temp = $('._btn_cart').attr('onclick');
        var btn_regularly_cart_onclick_temp = $('._btn_cart.im-regularly').attr('onclick');
        $('._btn_buy').attr('onclick', 'event.cancelBubble=true');
        $('._btn_cart').attr('onclick', 'event.cancelBubble=true');
        $.ajax({
            type: 'POST',
            data: { 
                'prod_idx': prod_idx,
                'options': options,
                'require': (require ? 'Y' : 'N'),
                'count': count,
                'idx' : idx
            },
            url: ('/shop/select_option.cm'),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    prod_price = result.prod_price;

                    var no = findSelectedOption(options);
                    if (no == -1) {
                        /* 상품 구매수량 체크 */
                        var total_selected_count = getProdTotalQuantity(maximum_purchase_quantity_type);

                        if (max_prod_quantity == 0 || total_selected_count < max_prod_quantity) {
                            selected_options.push(result.selected_option);
                            /** 처음 선택된 옵션인 경우 새로 추가*/
                            success();
                        } else {
                            failed(LOCALIZE.설명_최대N개만구매가능한상품입니다(max_prod_quantity));
                        }
                    } else {
                        failed(LOCALIZE.설명_이미선택된옵션입니다());
                    }
                } else {
                    failed(result.msg);
                }
                $('._btn_buy').attr('onclick', btn_buy_onclick_temp);
                $('._btn_regularly').attr('onclick', btn_regularly_onclick_temp);
                $('._btn_cart').attr('onclick', btn_cart_onclick_temp);
                $('._btn_cart.im-regularly').attr('onclick', btn_regularly_cart_onclick_temp);
            }
        });
    };

		/**
     * 옵션 선택
     * @param options [ {value_type: SELECT/INPUT, option_code:, value_code:, value_name:} ]
     */
    var selectProdAdditionalOption = function (prod_idx, options, require, count, success, failed) {
        //$('.npay_btn_pay').attr('onclick', 'event.cancelBubble=true');
        var btn_buy_onclick_temp = $('._btn_buy').attr('onclick');
        var btn_regularly_onclick_temp = $('._btn_regularly').attr('onclick');
        var btn_cart_onclick_temp = $('._btn_cart').attr('onclick');
        var btn_regularly_cart_onclick_temp = $('._btn_cart.im-regularly').attr('onclick');
        $('._btn_buy').attr('onclick', 'event.cancelBubble=true');
        $('._btn_cart').attr('onclick', 'event.cancelBubble=true');
        $.ajax({
            type: 'POST',
            data: { 'prod_idx': prod_idx, 'options': options, 'require': (require ? 'Y' : 'N'), 'count': count },
            url: ('/shop/select_option.cm'),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    var no = findSelectedProdAdditionalOption(options);
										var prod_name = result.prod_name;
                    if (no == -1) {
                        /* 상품 구매수량 체크 */
	                    var selected_prod_data = selected_prod_additionals.find(v=>v.idx===prod_idx);
                        var total_selected_count = getProdAdditionalTotalQuantity(selected_prod_data.maximum_purchase_quantity_type);

                        if (selected_prod_data.maximum_purchase_quantity == 0 || total_selected_count < selected_prod_data.maximum_purchase_quantity) {
	                        selected_prod_additional_options.push({prod_idx, prod_name, ...result.selected_option});
                            /** 처음 선택된 옵션인 경우 새로 추가*/
                            success();
                        } else {
                            failed(LOCALIZE.설명_최대N개만구매가능한상품입니다(selected_prod_data.maximum_purchase_quantity));
                        }
                    } else {
                        failed(LOCALIZE.설명_이미선택된옵션입니다());
                    }
                } else {
                    failed(result.msg);
                }
                $('._btn_buy').attr('onclick', btn_buy_onclick_temp);
                $('._btn_regularly').attr('onclick', btn_regularly_onclick_temp);
                $('._btn_cart').attr('onclick', btn_cart_onclick_temp);
                $('._btn_cart.im-regularly').attr('onclick', btn_regularly_cart_onclick_temp);
            }
        });
    };

		var checkRequireOption = function(){
			if($('._requireOption').length > 0 || $('._requireInputOption').length > 0){		// 필수옵션이 존재할 때
				if($('._selected_require_option').length == 0) return false;		// 선택된 필수옵션이 없는 경우
			}

			return true;
		};

    var getProdTotalQuantity = function (maximum_purchase_quantity_type) {
        /* 상품 구매수량 체크 */
        var total_selected_count = 0;
        $.each(selected_options, function (idx, obj) {
            if (maximum_purchase_quantity_type === 'order') {
                total_selected_count += obj.count;
            }
        });
        return total_selected_count;
    };

    var getProdRequireTotalQuantity = function () {
        /* 필수 옵션 구매수량 체크 */
        var total_selected_count = 0;
        $.each(selected_options, function (idx, obj) {
            if (obj.require) total_selected_count += obj.count;
        });
        return total_selected_count;
    };

		var getProdAdditionalTotalQuantity = function (maximum_purchase_quantity_type) {
        /* 상품 구매수량 체크 */
        var total_selected_count = 0;
        $.each(selected_prod_additional_options, function (idx, obj) {
            if (maximum_purchase_quantity_type === 'order') {
                total_selected_count += obj.count;
            }
        });
        return total_selected_count;
    };

    var getProdAdditionalRequireTotalQuantity = function () {
        /* 필수 옵션 구매수량 체크 */
        var total_selected_count = 0;
        $.each(selected_prod_additional_options, function (idx, obj) {
            if (obj.require) total_selected_count += obj.count;
        });
        return total_selected_count;
    };

    /**
     * 선택된 옵션 삭제
     * @param optName
     * @param success
     */
    var removeSelectedOption = function (optNo, success) {
        if (optNo <= (selected_options.length - 1)) {
            selected_options.splice(optNo, 1);
            success();
        }
    };

	/**
	 * 선택된 추가 상품 삭제
	 * @param optNo
	 * @param success
	 */
	var removeSelectedProdAdditional = function (prodIdx, success) {
		if (selected_prod_additionals.length) {
			selected_prod_additionals = selected_prod_additionals.filter(data => data.idx !== prodIdx);
			/* 추가 상품의 하위 옵션도 같이 삭제 */
			selected_prod_additional_options = selected_prod_additional_options.filter(data => data.prod_idx !== prodIdx);

			success();
		}
	};

		/**
     * 선택된 추가 상품 옵션 삭제
     * @param optNo
     * @param success
     */
    var removeSelectedProdAdditionalOption = function (optNo, success) {
        if (optNo <= (selected_prod_additional_options.length - 1)) {
					var deleted = selected_prod_additional_options.splice(optNo, 1)[0];
	        if(deleted.require && selected_prod_additional_options.length === 0){
		        removeSelectedProdAdditional(deleted.prod_idx, function(){});
	        }
            success();
        }
    };

    /**
     * 해당 옵션이 현재 선택되어있는지 확인
     * @param options [{option_code:, value_code:, value_name:}]
     * */
    var findSelectedOption = function (options) {
        var found_no = -1;
        $.each(selected_options, function (no, data) {
            if (isSameOptionList(data.options, options)) {
                found_no = no;
                return false;
            }
        });
        return found_no;
    };

		/**
     * 해당 옵션이 현재 선택되어있는지 확인
     * @param options [{option_code:, value_code:, value_name:}]
     * */
    var findSelectedProdAdditionalOption = function (options) {
        var found_no = -1;
        $.each(selected_prod_additional_options, function (no, data) {
	        if(data.prod_idx != current_select_additional_prod_idx){
		        return true; // 현재 선택 중인 추가 상품이 아닌 상품의 옵션은 체크하지 않고 continue 처리
	        }
	        if (isSameOptionList(data.options, options)) {
		        found_no = no;
		        return false;
	        }
        });
        return found_no;
    };

    /**
     * 해당 필수 옵션이 현재 선택되어있는지 확인
     * @param optName
     */
    var findSelectedRequireOption = function (option_code) {
        var foundNo = -1;
        $.each(selected_require_options, function (no, data) {
            if (data.option_code == option_code) {
                foundNo = no;
                return false;
            }
        });
        return foundNo;
    };

	/**
	 * 해당 필수 옵션이 현재 선택되어있는지 확인
	 * @param optName
	 */
	var findSelectedProdAdditionalRequireOption = function (option_code) {
		var foundNo = -1;
		$.each(selected_prod_additional_require_options, function (no, data) {
			if (data.option_code == option_code) {
				foundNo = no;
				return false;
			}
		});
		return foundNo;
	};

    /**
     * 옵션 수량 및 재고 체크하는 기능
     * @param optNo
     * @param cnt
     * @returns {*}
     */
    var checkOptionCount = function (optNo, cnt) {
        // 그냥 재고 체크
        if (selected_options[optNo].use_stock && !selected_options[optNo].stock_un_limit) {
            if (cnt > selected_options[optNo].stock) {
                selected_options[optNo].count = selected_options[optNo].stock;
                return LOCALIZE.설명_현재재고부족으로N개이상구매할수없습니다(selected_options[optNo].stock + 1);
            }
        }



        if (selected_options[optNo].require) { // 필수 옵션
            if (prod_type === SHOP_CONST.PROD_TYPE.DIGITAL) {
                // 만약 디지털 상품일 경우 수량변경이 제한된다.
                selected_options[optNo].count = 1;
                return LOCALIZE.설명_디지털상품은수량을변경하실수없습니다();
            }
        } else { // 선택 옵션
            if (parseInt(selected_options[optNo].price) == 0) {
                // 가격이 0원일 경우... 0원 선택옵션 구매 시 최대 수량 제한 체크를 한다.
                switch (optional_limit_type) {
                    case 'limit':
                        if (cnt > optional_limit) {
                            selected_options[optNo].count = optional_limit;
                            return LOCALIZE.설명_해당선택옵션은최대N개까지구매가능합니다(optional_limit);
                        }
                        break;
                    case 'unique':
                        if (cnt > 1) {
                            selected_options[optNo].count = 1;
                            return LOCALIZE.설명_해당선택옵션은최대N개까지구매가능합니다(1);
                        }
                        break;
                    case 'relative':
                        var _order_cnt = order_count;
                        if (_order_cnt == 0) {
                            $.each(selected_options, function (no, data) { if (data.require) { _order_cnt += data.count; } });
                        }

                        if (cnt > _order_cnt) {
                            selected_options[optNo].count = _order_cnt;
                            return LOCALIZE.설명_0원상품갯수제한();
                        }
                        break;
                }
            }
        }

        return true;
    };

		/**
     * 옵션 수량 및 재고 체크하는 기능
     * @param optNo
     * @param cnt
     * @returns {*}
     */
    var checkProdAdditionalOptionCount = function (optNo, cnt) {
			var prod_idx = selected_prod_additional_options[optNo].prod_idx;
			var selected_prod_data = selected_prod_additionals.find(v=>v.idx===prod_idx);
        // 그냥 재고 체크
        if (selected_prod_additional_options[optNo].use_stock && !selected_prod_additional_options[optNo].stock_un_limit) {
            if (cnt > selected_prod_additional_options[optNo].stock) {
                selected_prod_additional_options[optNo].count = selected_prod_additional_options[optNo].stock;
                return LOCALIZE.설명_현재재고부족으로N개이상구매할수없습니다(selected_prod_additional_options[optNo].stock + 1);
            }
        }



        if (selected_prod_additional_options[optNo].require) { // 필수 옵션
            if (prod_type === SHOP_CONST.PROD_TYPE.DIGITAL) {
                // 만약 디지털 상품일 경우 수량변경이 제한된다.
                selected_prod_additional_options[optNo].count = 1;
                return LOCALIZE.설명_디지털상품은수량을변경하실수없습니다();
            }
        } else { // 선택 옵션
            if (parseInt(selected_prod_additional_options[optNo].price) == 0) {
                // 가격이 0원일 경우... 0원 선택옵션 구매 시 최대 수량 제한 체크를 한다.
                switch (selected_prod_data.optional_limit_type) {
                    case 'limit':
                        if (cnt > selected_prod_data.optional_limit) {
                            selected_prod_additional_options[optNo].count = selected_prod_data.optional_limit;
                            return LOCALIZE.설명_해당선택옵션은최대N개까지구매가능합니다(selected_prod_data.optional_limit);
                        }
                        break;
                    case 'unique':
                        if (cnt > 1) {
                            selected_prod_additional_options[optNo].count = 1;
                            return LOCALIZE.설명_해당선택옵션은최대N개까지구매가능합니다(1);
                        }
                        break;
                    case 'relative':
                        var _order_cnt = selected_prod_data.count;
                        if (_order_cnt == 0) {
                            $.each(selected_prod_additional_options, function (no, data) { if (data.require) { _order_cnt += data.count; } });
                        }

                        if (cnt > _order_cnt) {
                            selected_prod_additional_options[optNo].count = _order_cnt;
                            return LOCALIZE.설명_0원상품갯수제한();
                        }
                        break;
                }
            }
        }

        return true;
    };

    var increaseOptionCount = function (optNo, success) {
        var $curCount = $('#prdOption' + optNo).find('input._count');
        var curCount = $curCount.val();
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) + 1;

        var optional_result = checkOptionCount(optNo, curCount);
        if (optional_result === true) {
            selected_options[optNo].count = curCount;
        } else {
            alert(optional_result);
        }


        var is_success = true;
        //1회당 구매 가능한 수량 체크
        if (max_prod_quantity > 0) {
            var _selected_count = 0;
            if (maximum_purchase_quantity_type === 'order') {//주문단위 기준인경우
                $.each(selected_options, function (idx, obj) {
                    _selected_count += obj.count;
                });
            } else if (maximum_purchase_quantity_type !== 'order') { // 옵션별 수량 체크인 경우
                switch (maximum_purchase_quantity_type) {
                    // required_option 타입인 경우 필수옵션만 카운트
                    case 'required_option':
                        var $option = $('#prdOption' + optNo);
                        if ($option.hasClass('_selected_require_option')) {
                            _selected_count = selected_options[optNo].count;
                        }
                        break;
                    case 'optional_option':
                        var $option = $('#prdOption' + optNo);
                        if (!$option.hasClass('_selected_require_option')) {
                            _selected_count = selected_options[optNo].count;
                        }
                        break;
                    case 'prod':
                    default:
                        _selected_count = selected_options[optNo].count;
                        break;
                }
            }
            if (_selected_count > max_prod_quantity) {
                selected_options[optNo].count -= 1;
                is_success = false;
                alert(LOCALIZE.설명_최대구매수량(max_prod_quantity));
            }
        }

        if (is_success) success();
    };

    var decreaseOptionCount = function (optNo, success) {
        var $curCount = $('#prdOption' + optNo).find('input._count');
        var curCount = $curCount.val();
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) - 1;
        if (curCount < 1) curCount = 1;

        var optional_result = checkOptionCount(optNo, curCount);
        if (optional_result === true) {
            selected_options[optNo].count = curCount;
        } else {
            alert(optional_result);
        }
        success();
    };

    var increaseProdAdditionalOptionCount = function (optNo, success) {
        var $curCount = $('#prdAdditionalOption' + optNo).find('input._count');
        var curCount = $curCount.val();
				var prod_idx = selected_prod_additional_options[optNo].prod_idx;
				var selected_prod_data = selected_prod_additionals.find(v=>v.idx===prod_idx);
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) + 1;

        var optional_result = checkProdAdditionalOptionCount(optNo, curCount);
        if (optional_result === true) {
            selected_prod_additional_options[optNo].count = curCount;
        } else {
            alert(optional_result);
        }

        var is_success = true;
        //1회당 구매 가능한 수량 체크
        if (selected_prod_data.maximum_purchase_quantity > 0) {
            var _selected_count = 0;
            if (selected_prod_data.maximum_purchase_quantity_type === 'order') {//주문단위 기준인경우
                $.each(selected_prod_additional_options, function (idx, obj) {
                    _selected_count += obj.count;
                });
            } else if (selected_prod_data.maximum_purchase_quantity_type !== 'order') {
                switch (selected_prod_data.maximum_purchase_quantity_type) {
                    case 'required_option':
                        var $prodAddtionalOption = $('#prdAdditionalOption' + optNo);
                        if ($prodAddtionalOption.hasClass('_selected_require_option')) {
                            _selected_count = selected_prod_additional_options[optNo].count;
                        }
                        break;
                    case 'optional_option':
                        var $prodAddtionalOption = $('#prdAdditionalOption' + optNo);
                        if (!$prodAddtionalOption.hasClass('_selected_require_option')) {
                            _selected_count = selected_prod_additional_options[optNo].count;
                        }
                        break;
                    case 'prod':
                    default:
                        _selected_count = selected_prod_additional_options[optNo].count;
                        break;
                }
            }
            if (_selected_count > selected_prod_data.maximum_purchase_quantity) {
                selected_prod_additional_options[optNo].count -= 1;
                is_success = false;
                alert(LOCALIZE.설명_최대구매수량(selected_prod_data.maximum_purchase_quantity));
            }
        }

        if (is_success) success();
    };

    var decreaseProdAdditionalOptionCount = function (optNo, success) {
        var $curCount = $('#prdAdditionalOption' + optNo).find('input._count');
        var curCount = $curCount.val();
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) - 1;
        if (curCount < 1) curCount = 1;

        var optional_result = checkProdAdditionalOptionCount(optNo, curCount);
        if (optional_result === true) {
            selected_prod_additional_options[optNo].count = curCount;
        } else {
            alert(optional_result);
        }
        success();
    };

    const changeProdAdditionalOptionCount = function (optNo, toBeCount, success) {
        toBeCount = parseInt(toBeCount, 10);
        if (isNaN(toBeCount) || toBeCount < 1) toBeCount = 1;
  
        const optionalResult = checkProdAdditionalOptionCount(optNo, toBeCount);
        if (optionalResult === true) {
            selected_prod_additional_options[optNo].count = toBeCount;
        } else {
            alert(optionalResult);
        }
  
        const prodIdx = selected_prod_additional_options[optNo].prod_idx;
        const selectedProdData = selected_prod_additionals.find(v => v.idx === prodIdx);
  
        //1회당 구매 가능한 수량 체크
        if (!selectedProdData || selectedProdData?.maximum_purchase_quantity === undefined) {
            return;
        }

        if (selectedProdData.maximum_purchase_quantity > 0 && toBeCount > selectedProdData.maximum_purchase_quantity) {
            selected_prod_additional_options[optNo].count = selectedProdData.maximum_purchase_quantity;
            alert(LOCALIZE.설명_최대구매수량(selectedProdData.maximum_purchase_quantity));
        }
  
        if (typeof success === 'function') success();
    };

    var changeOptionCount = function (optNo, optCount, success) {
        optCount = parseInt(optCount);
        if (isNaN(optCount)) optCount = 1;
        if (optCount < 1) optCount = 1;

        var optional_result = checkOptionCount(optNo, optCount);
        if (optional_result === true) {
            selected_options[optNo].count = optCount;
        } else {
            alert(optional_result);
        }

        success();
    };

    var checkProdStock = function (cnt) {
        // 그냥 재고 체크
        if (prod_stock_use && !prod_stock_unlimit) {
            if (cnt > prod_stock) {
                order_count = prod_stock;
                return LOCALIZE.설명_현재재고부족으로N개이상구매할수없습니다(prod_stock + 1);
            }
        }

        return true;
    };

    var increaseOrderCount = function (type, success) {
        var o = $prod_detail.find('input._order_count_' + type);
        var curCount = o.val();
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) + 1;

        var checkProdStockResult = checkProdStock(curCount);
        if (checkProdStockResult === true) {
            order_count = curCount;
        } else {
            alert(checkProdStockResult);
        }

        var is_success = true;
        //1회당 구매 가능한 수량 체크
        if (max_prod_quantity > 0 && maximum_purchase_quantity_type !== 'optional_option') {
            if (order_count > max_prod_quantity) {
                order_count -= 1;
                is_success = false;
                alert(LOCALIZE.설명_최대구매수량(max_prod_quantity));
            }
        }
        o.val(order_count);

        if (is_success) success();
    };

    var decreaseOrderCount = function (type, success) {
        var o = $prod_detail.find('input._order_count_' + type);
        var curCount = o.val();
        if (isNaN(curCount))
            curCount = 1;
        else
            curCount = parseInt(curCount) - 1;

        if (curCount < 1) curCount = 1;

        var checkProdStockResult = checkProdStock(curCount);
        if (checkProdStockResult === true) {
            order_count = curCount;
        } else {
            alert(checkProdStockResult);
        }

        o.val(order_count);
        success();
    };

    var changeOrderCount = function (type, count, success, is_alert) {
        if (is_alert == void 0) is_alert = true;
        if (isNaN(count))
            count = 1;
        else
            count = parseInt(count);
        if (count < 1) count = 1;

        var checkProdStockResult = checkProdStock(count);
        if (checkProdStockResult === true) {
            order_count = count;
        } else {
            if (is_alert) alert(checkProdStockResult);
        }

        $prod_detail.find("input._order_count_" + type).val(order_count);
        success();
    };

	var increaseProdAdditionalOrderCount = function (no, type, success) {
		var selected_prod_data = selected_prod_additionals[no];
		var o = $prod_detail.find(`._area_count[data-no=${no}] input._prod_additional_order_count_${type}`);
		var curCount = o.val();
		if (isNaN(curCount))
			curCount = 1;
		else
			curCount = parseInt(curCount) + 1;

		var checkProdStockResult = checkProdAdditionalStock(no, curCount);
		if (checkProdStockResult === true) {
			selected_prod_data.count = curCount;
		} else {
			alert(checkProdStockResult);
		}

		var is_success = true;
		//1회당 구매 가능한 수량 체크
		if (selected_prod_data.maximum_purchase_quantity > 0 && selected_prod_data.maximum_purchase_quantity_type !== 'optional_option') {
			if (selected_prod_data.count > selected_prod_data.maximum_purchase_quantity) {
				selected_prod_data.count -= 1;
				is_success = false;
				alert(LOCALIZE.설명_최대구매수량(selected_prod_data.maximum_purchase_quantity));
			}
		}
		o.val(selected_prod_data.count);

		if (is_success) success();
	};

	var decreaseProdAdditionalOrderCount = function (no, type, success) {
		var selected_prod_data = selected_prod_additionals[no];
		var o = $prod_detail.find(`._area_count[data-no=${no}] input._prod_additional_order_count_${type}`);
		var curCount = o.val();
		if (isNaN(curCount))
			curCount = 1;
		else
			curCount = parseInt(curCount) - 1;

		if (curCount < 1) curCount = 1;

		var checkProdStockResult = checkProdAdditionalStock(no, curCount);
		if (checkProdStockResult === true) {
			selected_prod_data.count = curCount;
		} else {
			alert(checkProdStockResult);
		}

		o.val(selected_prod_data.count);
		success();
	};

	var changeProdAdditionalOrderCount = function (no, type, count, success, is_alert) {
		var selected_prod_data = selected_prod_additionals[no];
		if (is_alert == void 0) is_alert = true;
		if (isNaN(count))
			count = 1;
		else
			count = parseInt(count);
		if (count < 1) count = 1;

		var checkProdStockResult = checkProdAdditionalStock(no, count);
		if (checkProdStockResult === true) {
			selected_prod_data.count = count;
		} else {
			if (is_alert) alert(checkProdStockResult);
		}

		$prod_detail.find(`._area_count[data-no=${no}] input._prod_additional_order_count_${type}`).val(selected_prod_data.count);
		success();
	};

	var checkProdAdditionalStock = function (no, cnt) {
		var selected_prod_data = selected_prod_additionals[no];
		// 그냥 재고 체크
		if (selected_prod_data.stock_use && !selected_prod_data.stock_unlimit) {
			if (cnt > selected_prod_data.stock) {
				selected_prod_data.count = selected_prod_data.stock;
				return LOCALIZE.설명_현재재고부족으로N개이상구매할수없습니다(selected_prod_data.stock + 1);
			}
		}

		return true;
	};

    var selectCartType = function (type) {
        if (type === 'regularly') {
            $prod_detail.addClass('detail-regularly');
        } else {
            $prod_detail.removeClass('detail-regularly');
        }
    };

    /**
     * 옵션선택화면갱신
     * type : prod (상품상세화면용), cart (장바구니 수량 변경용)
     */
    var updateSelectedOptions = function (type) {
        var html = '';
        var total_price_html = '';

        var total_price = 0;
        var total_count = 0;
        var option_total_price = 0;
        var period_discount_price = 0;
        var show_period_discount = false;
				var membership_discount_not_involved_price = 0;  // 등급할인을 사용하지 않는 상품의 가격(등급할인 계산 과정에서 제외됨)
	      var is_use_prod_additional = selected_prod_additionals.length > 0 || selected_prod_additional_options.length > 0;
				/* 본 상품 계산 */
        if (require_option_count == 0) {
					let section_total_price = 0;

					if (typeof USE_OMS !== 'undefined' && USE_OMS === true){
						// 할인 후 수량을 곱해준다
						period_discount_price = calcPeriodDiscount(prod_price, 1);
						if(period_discount_price > prod_price){
							period_discount_price = prod_price;
						}

						period_discount_price *= order_count;

						section_total_price = order_count * prod_price;   // 본 상품 가격 총합
						section_total_price = section_total_price - period_discount_price;
						show_period_discount = true;
					} else {
						section_total_price = order_count * prod_price;   // 본 상품 가격 총합
						period_discount_price = calcPeriodDiscount(prod_price, order_count);
						if (period_discount_price > section_total_price) period_discount_price = section_total_price;
						section_total_price = section_total_price - period_discount_price;
						show_period_discount = true;
					}

            // 필수옵션이 없을 때 기본 상품 수량 조절 html 출력
            if (prod_type === SHOP_CONST.PROD_TYPE.NORMAL) {
                // 디지털, 이용권 상품은 수량 변경 할 필요가 없으므로 출력하지 않는다
                switch (type) {
                    case 'prod':
                        if (!is_view_price) break;
                        // 상품 상세페이지
                        html += '<div class="opt_block no-border order_quantity_area" style="height: auto; "> ';
                        html += '	<div class="area_tit holder">';
                        html += '		<span class="option_title inline-blocked" style="margin-bottom: 7px">' + LOCALIZE.타이틀_수량() + '</span> ';
                        html += '	</div> ';
                        html += '	<div class="area_count holder">';
                        html += '		<div class="option_btn_wrap" style="top:0;"> ';
                        html += '			<div class="option_btn_tools" style="float: none;"> ';
                        html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.decreaseOrderCount(\'mobile\', function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"><i class="btl bt-minus" aria-hidden="true"></i><span class="sr-only">minus</span></a>';
                        html += '				<input type="text" title="number" value="' + order_count + '" class="form-control _order_count_mobile" onchange="SITE_SHOP_DETAIL.changeOrderCount(\'mobile\', $(this).val(), function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"> ';
                        html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.increaseOrderCount(\'mobile\', function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"><i class="btl bt-plus" aria-hidden="true"></i><span class="sr-only">plus</span></a>';
                        html += '			</div> ';
                        html += '			<div class="area_price absolute absolute_right absolute_middle"><span>' + LOCALIZE.getCurrencyFormat(section_total_price) + '</span></div>';
                        html += '		</div> ';
                        html += '	</div> ';
                        html += '</div> ';
                        break;
                    case 'cart':
                        // 장바구니
                        html += '<div class="opt_block no-border" style="height: auto; "> ';
                        html += '	<div class="col-control row"> ';
                        html += '		<div class="col-xs-12"><span class="option_title text-bold inline-blocked" style="margin-bottom: 7px">' + LOCALIZE.타이틀_수량() + '</span></div> ';
                        html += '		<div class="col-xs-12 option_btn_wrap" style="top:0;"> ';
                        html += '			<div class="option_btn_tools" style="float: none;"> ';
                        html += '				<a href="javascript:;" onclick="SITE_SHOP_CART.changeCartDecrease(\'mobile\')"><i class="btl bt-minus" aria-hidden="true"></i><span class="sr-only">minus</span></a>';
                        html += '				<input type="text" title="number" value="' + order_count + '" class="form-control _order_count_mobile" onchange="SITE_SHOP_CART.changeCartOrderCount(\'mobile\', $(this).val())"> ';
                        html += '				<a href="javascript:;" onclick="SITE_SHOP_CART.changeCartIncrease(\'mobile\')"><i class="btl bt-plus"></i><span class="sr-only">plus</span></a>';
                        html += '			</div> ';
                        html += '		</div> ';
                        html += '	</div> ';
                        html += '</div> ';
                        break;
                }
            }
						/* 본 상품 합계에 반영 */
	          total_count += order_count;
            total_price += section_total_price;
	          if(!is_main_product_membership_discount){
		          membership_discount_not_involved_price += section_total_price;
	          }
        }

				/* 본 상품 옵션 계산 */
		    var require_class = '';
		    var quantity_changeable = false;	// 상품 옵션부분 디지털, 이용권 상품 및 선택옵션 구분 - 수량 변경 가능
	      let option_total_count = 0;
	      var option_total_price = 0;
				var option_total_period_discount_price = 0;
		    var option_price = 0;

        var prod_option_html = { "Y": "", "N": "" };
        var option_html = '';
        $.each(selected_options, function (no, data) {
            option_price = parseFloat(data.price || 0) * parseFloat(data.count);
						let option_period_discount_price = 0;
            if (data.require == true){

							if(typeof USE_OMS !== 'undefined' && USE_OMS === true){
		            option_period_discount_price = calcPeriodDiscount(data.price, 1);
		            if(option_period_discount_price > data.price){
			            option_period_discount_price = data.price;
		            }
		            option_period_discount_price *= data.count;
	            }else{
		            option_period_discount_price = calcPeriodDiscount(data.price, data.count);
		            if(option_period_discount_price > option_price){
			            option_period_discount_price = option_price;
		            }
	            }
							period_discount_price += option_period_discount_price;
							if (data.option_mix_type == 'MIX' || period_dc_type == 'percent') {
									show_period_discount = true;
									option_price = option_price - option_period_discount_price;
							}
            }
	          option_total_count += parseInt(data.count);
            option_total_price += option_price;
						option_total_period_discount_price += option_period_discount_price;

            var option_data_html = [];
            $.each(data.options, function (no2, data2) {
                option_data_html.push(RemoveTag(data2.option_name + ': ' + data2.value_name));
            });
            quantity_changeable = !(prod_type !== SHOP_CONST.PROD_TYPE.NORMAL && data.require == true);
            require_class = (data.require ? '_selected_require_option ' : '');


            // 한 개마다 초기화
            option_html = '';
            if (type == 'prod') {
                // 상품 상세페이지
                option_html += '<div class="' + require_class + (no == 0 ? '' : ' middle ') + 'opt_block" id="prdOption' + no + '">';
                option_html += '	<div class="full-width opt_product_area">';
                option_html += '		<div class="area_tit holder">';
                option_html += '		 	<span class="body_font_color_80">' + option_data_html.join(' / ') + '</span>';
                option_html += '			<a class="text-18 absolute absolute_right absolute_middle" href="javascript:;" onclick="SITE_SHOP_DETAIL.removeSelectedOption(' + no + ',\'prod\')"><i class="btl bt-times-circle"></i></a>';
                option_html += '		</div>';
                option_html += '		<div class="area_count holder">';
                option_html += '			<div class="option_btn_wrap">';
                if (quantity_changeable) {
                    option_html += '			<div class="option_btn_tools">';
                    option_html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.decreaseOptionCount(' + no + ',\'prod\')"> <i class="btl bt-minus" aria-hidden="true"></i> </a>';
                    option_html += '				<input type="text" value="' + data.count + '" class="form-control count _count" onchange="SITE_SHOP_DETAIL.changeOptionCount(' + no + ', $(this).val(),\'prod\')" />';
                    option_html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.increaseOptionCount(' + no + ',\'prod\')"> <i class="btl bt-plus"></i> </a>';
                    option_html += '			</div>';
                }
                option_html += '			</div>';
                if (quantity_changeable) {
									option_html += '			<div class="area_price absolute absolute_right absolute_middle"><span>' + LOCALIZE.getCurrencyFormat(option_price) + '</span></div>';
                } else {
									option_html += '<div class="tw-flex tw-justify-between"><div>' + LOCALIZE.타이틀_수량() + ' ' + LOCALIZE.설명_n개띄어쓰기없음(1) + '</div><div>' + LOCALIZE.getCurrencyFormat(option_price) + '</div></div>';
                }
                option_html += '		</div>';
                option_html += '	</div>';
                option_html += '</div>';
            } else {
                // 장바구니
                option_html += '<div class="' + require_class + (no == 0 ? '' : ' middle ') + 'opt_block" id="prdOption' + no + '">';
                option_html += '	<div class="full-width opt_product_area">';
                option_html += '		<div class="area_tit holder">';
                option_html += '			<span class="body_font_color_80">' + option_data_html.join(' / ') + '</span>';
                option_html += '			<a href="javascript:;" class="text-18 absolute absolute_right absolute_middle" onclick="SITE_SHOP_CART.changeCartItemRemove(' + no + ')"><i class="btl bt-times-circle"></i> </a>';
                option_html += '		</div>';
                option_html += '		<div class="area_count holder">';
                option_html += '			<div class="option_btn_wrap">';
                if (quantity_changeable) {
                    option_html += '				<div class="option_btn_tools">';
                    option_html += '					<a href="javascript:;" onclick="SITE_SHOP_CART.changeCartItemDecrease(' + no + ')"> <i class="btl bt-minus" aria-hidden="true"></i> </a>';
                    option_html += '					<input type="text" value="' + data.count + '" class="form-control count _count" onchange="SITE_SHOP_CART.changeCartItemCount(' + no + ', $(this).val())" />';
                    option_html += '					<a href="javascript:;" onclick="SITE_SHOP_CART.changeCartItemIncrease(' + no + ')"> <i class="btl bt-plus"></i> </a>';
                    option_html += '				</div>';
                }
                option_html += '			</div>';
                option_html += '			<div class="area_price absolute absolute_right absolute_middle">';
                option_html += '				<span>' + LOCALIZE.getCurrencyFormat(option_price) + '</span>';
                option_html += '			</div>';
                option_html += '		</div>';
                option_html += '	</div>';
                option_html += '</div>';
            }

            // 기존처럼 옵션 구분 없이 선택 순 출력으로 사용하려면 prod_option_html 사용하는 부분 지우고 html += option_html 하면 됨
            prod_option_html[((data.require) ? "Y" : "N")] += option_html;
        });

        html += prod_option_html["Y"];
        html += prod_option_html["N"];

	     /* 본 상품 옵션 합계에 반영 */
	      total_count += option_total_count;
        total_price += option_total_price;
		    if(!is_main_product_membership_discount){
			    membership_discount_not_involved_price += option_total_price;
		    }

				/* 추가상품 계산 */
				if(is_use_prod_additional){

					$.each(selected_prod_additionals, function (no, data) {
						let prod_additional_total_count = 0;
						var prod_additional_total_price = 0;
						var prod_additional_require_option_count_by_data_idx = prod_additional_require_option_count[data.idx] || 0;
						if (prod_additional_require_option_count_by_data_idx == 0) {

							prod_additional_total_count = parseInt(data.count);
							prod_additional_total_price = parseInt(data.count) * parseFloat(data.price);
							var prod_additional_period_discount_price = calcProdAdditionalPeriodDiscount(data.idx, data.price, data.count);
							if (prod_additional_period_discount_price > prod_additional_total_price) prod_additional_period_discount_price = prod_additional_total_price;
							// 추가상품의 경우 상품 할인 금액에 별도로 할인가를 포함하지 않고 항상 옵션가에 포함시킴
							prod_additional_total_price = prod_additional_total_price - prod_additional_period_discount_price;

							if(is_view_price){ // @TODO 본상품과 추가상품 가격없는 상품 분기 처리 필요
								// 상품 상세페이지
								html += '<div class="opt_block no-border order_quantity_area" style="height: auto; "> ';
								html += '	<div class="area_tit holder">';
								html += '		<div class="tw-flex tw-flex-col tw-gap-[12px]">';
								html += '     <span class="body_font_color_80 tw-font-bold">' + getLocalizeString('타이틀_추가상품', '', '추가 상품') + '</span>';
								html += '		 	<span class="body_font_color_80">' + data.name + '</span>';
								html += `		 	<div class="_prod_additional_option_optional goods-select-prod-additional" data-prod-idx="${data.idx}"></div>`;
								html += '		</div>';
								html += '		<a class="text-18 absolute absolute_right tw-top-0" href="javascript:;" onclick="SITE_SHOP_DETAIL.removeSelectedProdAdditional(' + data.idx + ', \'prod\')"><i class="btl bt-times-circle"></i></a> ';
								html += '	</div> ';
								html += '	<div class="area_count holder _area_count" data-no="' + no + '">';
								html += '		<div class="option_btn_wrap" style="top:0;"> ';
								if(data.prod_type === SHOP_CONST.PROD_TYPE.NORMAL){
									html += '			<div class="option_btn_tools" style="float: none;"> ';
									html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.decreaseProdAdditionalOrderCount(' + no + ', \'mobile\', function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"><i class="btl bt-minus" aria-hidden="true"></i><span class="sr-only">minus</span></a>';
									html += '				<input type="text" title="number" value="' + data.count + '" class="form-control _prod_additional_order_count_mobile" onchange="SITE_SHOP_DETAIL.changeProdAdditionalOrderCount(' + no + ', \'mobile\', $(this).val(), function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"> ';
									html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.increaseProdAdditionalOrderCount(' + no + ', \'mobile\', function(){SITE_SHOP_DETAIL.updateSelectedOptions(\'' + type + '\')})"><i class="btl bt-plus" aria-hidden="true"></i><span class="sr-only">plus</span></a>';
									html += '			</div> ';
								}
								html += ' </div>';
								if(data.prod_type === SHOP_CONST.PROD_TYPE.NORMAL){
									html += '			<div class="area_price absolute absolute_right absolute_middle"><span>' + LOCALIZE.getCurrencyFormat(prod_additional_total_price) + '</span></div>';
								}else{
									html += '<div class="tw-flex tw-justify-between"><div>' + LOCALIZE.타이틀_수량() + ' ' + LOCALIZE.설명_n개띄어쓰기없음(1) + '</div><div>' + LOCALIZE.getCurrencyFormat(prod_additional_total_price) + '</div></div>';
								}
								html += '	</div> ';
								html += '</div> ';
							}

							if(!data.membership_discount){
								membership_discount_not_involved_price += prod_additional_total_price;
							}
						}

						/* 추가상품 합계에 반영 */
						total_count += prod_additional_total_count;
						total_price += prod_additional_total_price;
					});


					/* 추가상품 옵션 계산 */
					require_class = '';
					quantity_changeable = false;	// 상품 옵션부분 디지털, 이용권 상품 및 선택옵션 구분 - 수량 변경 가능
					option_total_count = 0;
					option_total_price = 0;

					prod_option_html = { "Y": "", "N": "" };
					option_html = '';
					$.each(selected_prod_additional_options, function (no, data) {
						let prod_data = selected_prod_additionals.find(v=>v.idx===data.prod_idx);
						if(typeof prod_data === 'undefined') return true; // prod_data가 확인되지 않을 경우 continue 처리
						let option_price = parseFloat(data.price || 0) * parseFloat(data.count);
						var option_period_discount_price = 0;
						if (data.require) {
							option_period_discount_price = calcProdAdditionalPeriodDiscount(data.prod_idx, data.price, data.count);
							if (option_period_discount_price > option_price) {
								option_period_discount_price = option_price;
							}

							// 추가상품 옵션의 경우 상품 할인 금액에 별도로 할인가를 포함하지 않고 항상 옵션가에 포함시킴
							option_price = option_price - option_period_discount_price;
						}
						option_total_count += parseInt(data.count);
						option_total_price += option_price;

						if(!prod_data.membership_discount){
							membership_discount_not_involved_price += option_price;
						}

						var option_data_html = [];
						$.each(data.options, function (no2, data2) {
							option_data_html.push(RemoveTag(data2.option_name + ': ' + data2.value_name));
						});
						quantity_changeable = !(prod_data.prod_type !== SHOP_CONST.PROD_TYPE.NORMAL && data.require == true);
						require_class = (data.require ? '_selected_require_option ' : '');

						// 한 개마다 초기화
						option_html = '';
						// 상품 상세페이지
						option_html += '<div class="' + require_class + (no == 0 ? '' : ' middle ') + 'opt_block" id="prdAdditionalOption' + no + '">';
						option_html += '	<div class="full-width opt_product_area">';
						option_html += '		<div class="area_tit holder">';
						option_html += '		 	<div class="tw-flex tw-flex-col tw-gap-[12px]">';
						option_html += '        <span class="body_font_color_80 tw-font-bold">' + getLocalizeString('타이틀_추가상품', '', '추가 상품') + '</span>';
						option_html += '		 	  <span class="body_font_color_80">' + prod_data.name + ' ' + option_data_html.join(' / ') + '</span>';
						if (data.require){
							option_html += `		 		<div class="_prod_additional_option_optional goods-select-prod-additional" data-prod-idx="${data.prod_idx}"></div>`;
						}
						option_html += '		 	</div>';
						option_html += '			<a class="text-18 absolute absolute_right tw-top-0" href="javascript:;" onclick="SITE_SHOP_DETAIL.removeSelectedProdAdditionalOption(' + no + ',\'prod\')"><i class="btl bt-times-circle"></i></a>';
						option_html += '		</div>';
						option_html += '		<div class="area_count holder">';
						option_html += '			<div class="option_btn_wrap">';
						if (quantity_changeable) {
							option_html += '			<div class="option_btn_tools">';
							option_html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.decreaseProdAdditionalOptionCount(' + no + ')"> <i class="btl bt-minus" aria-hidden="true"></i> </a>';
							option_html += '				<input type="text" value="' + data.count + '" class="form-control count _count" onchange="SITE_SHOP_DETAIL.changeProdAdditionalOptionCount(' + no + ', $(this).val())" />';
							option_html += '				<a href="javascript:;" onclick="SITE_SHOP_DETAIL.increaseProdAdditionalOptionCount(' + no + ')"> <i class="btl bt-plus"></i> </a>';
							option_html += '			</div>';
						}
						option_html += '			</div>';
						if (quantity_changeable) {
							option_html += '			<div class="area_price absolute absolute_right absolute_middle"><span>' + LOCALIZE.getCurrencyFormat(option_price) + '</span></div>';
						} else {
							option_html += '<div class="tw-flex tw-justify-between"><div>' + LOCALIZE.타이틀_수량() + ' ' + LOCALIZE.설명_n개띄어쓰기없음(1) + '</div><div>' + LOCALIZE.getCurrencyFormat(option_price) + '</div></div>';
						}
						option_html += '		</div>';
						option_html += '	</div>';
						option_html += '</div>';

						// 기존처럼 옵션 구분 없이 선택 순 출력으로 사용하려면 prod_option_html 사용하는 부분 지우고 html += option_html 하면 됨
						prod_option_html[((data.require) ? "Y" : "N")] += option_html;
					});

					html += prod_option_html["Y"];
					html += prod_option_html["N"];

					total_count += option_total_count;
					total_price += option_total_price;
				}

				/* 전체 내역 표시 */

        // 선택된 옵션이 없으면 출력하지 않음
        if (total_count > 0) {
            // 하단에 결제 예상 총 금액 표기
            switch (type) {
                case 'prod':
                    // 상품 상세페이지
                    if (!is_view_price) break;
                    var membership_discount_html = '';
                    var period_discount_html = '';

                    var membership_discount_price = 0;
                    let membership_discount_target_price = total_price;

                    if(membership_discount_not_involved_price > 0){
                        // 등급할인 적용 시 전체 가격에서 등급할인 미적용 상품 가격 제외
                        membership_discount_target_price -= membership_discount_not_involved_price;
                    }

                    if (period_discount_price > 0 && show_period_discount == false) {
                        // 등급할인 적용시 즉시기간할인된 금액은 먼저 제외한 금액으로 계산
                        membership_discount_target_price -= period_discount_price;

                        // @FIXME 등급할인은 미적용인데 즉시기간은 적용된 상품의 즉시기간할인금액이 같이 마이너스되면 계산이 틀어질 수도 있어 수정필요
                    }

                    membership_discount_price = calcMembershipDiscount(membership_discount_target_price);

                    // PC 좁은화면 고려하여 user_agent가 아닌 브라우저 너비로 판단
                    var is_mobile_view = $(window).width() < 768;
                    var left_text_class = is_mobile_view ? '' : 'text-left';
                    var total_price_class = is_mobile_view ? 'non_member ' : '';

                    if (period_discount_price > 0 && show_period_discount == false) {
                        // 상품 할인금액
                        var discount_style = is_mobile_view ? 'padding-bottom: 4px;' : 'padding: 8px 0 12px';
                        period_discount_html += '<p class="text-right">';
                        period_discount_html += '	<span class="body_font_color_70 ' + left_text_class + '" style="' + discount_style + '">' + LOCALIZE.설명_상품할인금액() + '</span>';
                        period_discount_html += '	<span class="period_discount_price" style="' + discount_style + '">' + LOCALIZE.getCurrencyFormat(period_discount_price) + '</span>';
                        period_discount_html += '</p>';
                        total_price = (total_price - period_discount_price);
                    }


                    if (membership_discount_price > 0) {
                        // 회원등급 할인
                        var discount_style = is_mobile_view ? 'padding-bottom: 4px;' : 'padding: 0 0 16px 0';
                        membership_discount_html += '<p class="text-right">';
                        membership_discount_html += '	<span class="body_font_color_70 ' + left_text_class + '" style="' + discount_style + '">' + LOCALIZE.설명_회원등급할인() + '</span>';
                        membership_discount_html += '	<span class="membership_discount_price" style="' + discount_style + '">' + LOCALIZE.getCurrencyFormat(membership_discount_price) + '</span>';
                        membership_discount_html += '</p>';
                        total_price = (total_price - membership_discount_price);
                    }

                    var discount_style = is_mobile_view ? 'padding-bottom: 4px;' : 'padding: 16px 0';
                    total_price_html += '<div class="opt_block total bottom">';
                    total_price_html += period_discount_html;
                    total_price_html += membership_discount_html;
                    if (!is_mobile_view && (period_discount_price > 0 || membership_discount_price > 0)) {
                        total_price_html += '<p style="border-bottom: 1px solid rgba(0, 0, 0, 0.1); position: absolute; width: 100%; display: block;"></p>';
                    }
                    total_price_html += '	<p class="no-margin text-right">';
                    total_price_html += '		<span class="body_font_color_70 ' + left_text_class + '" style="' + discount_style + '">' + LOCALIZE.설명_결제예상금액임시(total_count) + '</span>';
                    total_price_html += '		<span class="total_price ' + total_price_class + '" style="' + discount_style + '">' + LOCALIZE.getCurrencyFormat(total_price) + '</span>';
                    total_price_html += '	</p>';
                    total_price_html += '</div>';
                    if ($prod_detail.find('._footer_price_wrap').length > 0) {
                        var $footer_price_wrap = $prod_detail.find('._footer_price_wrap');
                        $footer_price_wrap.find('._pay_label').text(LOCALIZE.설명_결제예상금액임시(total_count)).show();
                        $footer_price_wrap.find('._pay_number').text(LOCALIZE.getCurrencyFormat(total_price)).show();
                        $footer_price_wrap.find('._pay_org_label').hide();
                        $footer_price_wrap.find('._pay_org_number').hide();
                    }
                    break;
                case 'cart':
                    // 장바구니
                    if (period_discount_price > 0 && show_period_discount == false) {
                        // 상품 할인금액
                        total_price_html += '<div class="opt_block total bottom">';
                        total_price_html += '	<div class="col-xs-4 vertical-middle"> <span class="body_font_color_70 text-13">' + LOCALIZE.설명_상품할인금액() + '</span> </div>';
                        total_price_html += '	<div class="col-xs-8 vertical-middle">';
                        total_price_html += '		<p class="align_r body_font_color_50 text-13">' + total_price_localize_text + ' <span class="text-brand vertical-middle">' + LOCALIZE.getCurrencyFormat(period_discount_price) + '</span></p>';
                        total_price_html += '	</div>';
                        total_price_html += '</div>';
                        total_price = (total_price - period_discount_price);
                    }

                    total_price_html += '<div class="opt_block total bottom">';
                    total_price_html += '	<div class="col-xs-4 vertical-middle"> <span class="body_font_color_70 text-13">' + LOCALIZE.타이틀_총수량(total_count) + '</span> </div>';
                    total_price_html += '	<div class="col-xs-8 vertical-middle">';
                    total_price_html += '		<p class="align_r body_font_color_50 text-13">' + total_price_localize_text + ' <span class="text-brand vertical-middle">' + LOCALIZE.getCurrencyFormat(total_price) + '</span></p>';
                    total_price_html += '	</div>';
                    total_price_html += '</div>';
                    break;
            }
        } else {
            if (type === 'prod') {
                if ($prod_detail.find('._footer_price_wrap').length > 0) {
                    // 선택된 옵션이 없을 경우 총 상품금액이 아닌 판매가 출력
                    var $footer_price_wrap = $prod_detail.find('._footer_price_wrap');
                    $footer_price_wrap.find('._pay_org_label').show();
                    $footer_price_wrap.find('._pay_org_number').show();
                    $footer_price_wrap.find('._pay_label').hide();
                    $footer_price_wrap.find('._pay_number').hide();
                }
            }
        }

        html += total_price_html;
        $selected_options.html(html);
				loadProdAdditionalOptionalList();
    };

    /**
     * 옵션 글자 제한 체크 (네이버페이 주문형이 활성화되어 있는 상품의 경우 글자 제한)
     * @param target
     * @param limit
     */
    const checkOptionLength = function (target, limit) {
        const input_option_length_tooltip = target.parentNode.querySelector('._input_option_length_tooltip');
        if (input_option_length_tooltip) {
            if (target.value.length >= limit) {
                input_option_length_tooltip.classList.remove('tw-hidden');
            } else {
                input_option_length_tooltip.classList.add('tw-hidden');
            }
        }
    };

    var membership_discount_data = {};
		var is_main_product_membership_discount = false;
    var setMembershipSaleData = function (data, _is_main_product_membership_discount) {
        if (typeof data != 'undefined') {
            membership_discount_data = data;
	          is_main_product_membership_discount = _is_main_product_membership_discount;
        }
    };

    var calcMembershipDiscount = function (price) {
        var sale_price = 0;

        if ($.isEmptyObject(membership_discount_data)) {
            return sale_price;
        }

        if (price >= membership_discount_data['minimum']) {
            sale_price = membership_discount_data['amount'];
            if (membership_discount_data['type'] == 'percent') {
                sale_price = (price * membership_discount_data['amount']) / 100;
                if (sale_price > membership_discount_data['maximum']) {
                    sale_price = membership_discount_data['maximum'];
                }
            }
        }

        if (typeof USE_OMS !== 'undefined' && USE_OMS === true) {
            const decimalCount = LOCALIZE.getCurrencyDecimalCount();
            if (decimalCount === 0) {
                return Math.ceil(sale_price > price ? price : sale_price);
            }

            const pow = Math.pow(10, decimalCount);
            return Math.ceil((sale_price > price ? price : sale_price) * pow) / pow;
        } else {
            return sale_price > price ? price : sale_price;
        }
    };

    var period_discount_data = {};
    var setPeriodDiscountData = function (flag, data, group_list) {
        if (typeof data != 'undefined' && data != null) {
            period_discount_data = data;
            period_discount_data['switch'] = flag;
            period_discount_data['group_list'] = group_list;
        }
    };

    var period_dc_type;
    var calcPeriodDiscount = function (price, count) {
        var sale_price = 0;
        var dc_price;
        if ($.isEmptyObject(period_discount_data)) {
            return sale_price;
        }
        if (period_discount_data['switch'] === false || period_discount_data['switch'] == 'false') return sale_price;
        var group_list = period_discount_data['group_list'];

        for (var target in period_discount_data['target']) {
            var discount_data = period_discount_data['target'][target];
            if (IS_GUEST) {
                if (discount_data['group_type'] != 'guest') continue;
            } else {
                if (discount_data['group_type'] == 'group' && group_list.indexOf(discount_data['group_code']) == -1) continue;
            }
            if (discount_data['dc_type'] == 'percent') {
                if (discount_data['dc_amount'] > 100) discount_data['dc_amount'] = 100;

                if (typeof USE_OMS !== 'undefined' && USE_OMS === true){
                  const decimalCount = LOCALIZE.getCurrencyDecimalCount();
	                if (decimalCount === 0) {
                      dc_price = Math.ceil(( price * discount_data['dc_amount'] ) / 100 * count );
                  } else {
										const pow = Math.pow(10, decimalCount);
                    dc_price = Math.ceil(( ( price * discount_data['dc_amount'] ) / 100 * count ) * pow) / pow;
	                }
                } else {
	                dc_price = (price * discount_data['dc_amount']) / 100 * count;
                }
            } else {
                dc_price = discount_data['dc_amount'] * count;
            }
            if (sale_price < dc_price) {
                sale_price = dc_price;
                period_dc_type = discount_data['dc_type'];
            }
        }

        return sale_price;
    };

	var prod_additional_period_discount_data = {};
	var setProdAdditionalPeriodDiscountData = function (prod_idx, flag, data, group_list) {
		if (typeof data != 'undefined' && data != null) {
			prod_additional_period_discount_data[prod_idx] = data;
			prod_additional_period_discount_data[prod_idx]['switch'] = flag;
			prod_additional_period_discount_data[prod_idx]['group_list'] = group_list;
		}
	};

	var prod_additional_period_dc_type = {};
	var calcProdAdditionalPeriodDiscount = function (prod_idx, price, count) {
		var sale_price = 0;
		var dc_price;
		if ($.isEmptyObject(prod_additional_period_discount_data[prod_idx])) {
			return sale_price;
		}
		if (prod_additional_period_discount_data[prod_idx]['switch'] === false || prod_additional_period_discount_data[prod_idx]['switch'] == 'false') return sale_price;
		var group_list = prod_additional_period_discount_data[prod_idx]['group_list'];

		for (var target in prod_additional_period_discount_data[prod_idx]['target']) {
			var discount_data = prod_additional_period_discount_data[prod_idx]['target'][target];
			if (IS_GUEST) {
				if (discount_data['group_type'] != 'guest') continue;
			} else {
				if (discount_data['group_type'] == 'group' && group_list.indexOf(discount_data['group_code']) == -1) continue;
			}
			if (discount_data['dc_type'] == 'percent') {
				if (discount_data['dc_amount'] > 100) discount_data['dc_amount'] = 100;
				dc_price = (price * discount_data['dc_amount']) / 100 * count;
			} else {
				dc_price = discount_data['dc_amount'] * count;
			}
			if (sale_price < dc_price) {
				sale_price = dc_price;
				prod_additional_period_dc_type[prod_idx] = discount_data['dc_type'];
			}
		}

		return sale_price;
	};

    /**
     * 장바구니에 추가
     */
    var addCart = function (callback) {
        cart_type = $('input[name=add_cart_type]:checked').val();
        $.ajax({
            type: 'POST',
            data: {
                'prodIdx': current_prod_idx,
                'options': selected_options,
                'orderCount': order_count,
                'deliv_type': $deliv_type,
                'deliv_pay_type': $deliv_pay_type,
                'cart_type': cart_type,
	              'prod_additional_list': selected_prod_additionals,
	              'prod_additional_option_list': selected_prod_additional_options,
            },
            url: ('/shop/add_cart.cm'),
            dataType: 'json',
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof NP_LOG != 'undefined') NP_LOG.AddToCart();
                    if (typeof NP_NDA != 'undefined') NP_NDA.AddToCart(result.prod_code);
                    if (typeof CRITEO != 'undefined') CRITEO.AddToCart(result.prod_id, result.total_price);
                    if (typeof FB_PIXEL != 'undefined') FB_PIXEL.AddToCart(result.prod_id, result.prod_name, result.cart_price, result.currency, result.prod_count, result.total_price, result.fb_event_id, result.fb_external_id);
                    if (typeof ACE_COUNTER != 'undefined') ACE_COUNTER.AddToCart(result.prod_id, result.prod_name, result.prod_count);
                    if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddToCart(result.prod_id, result.prod_count, result.total_price, result.currency);
                    if (typeof ACE_COUNTER_PARTNER != 'undefined') ACE_COUNTER_PARTNER.AddToCart(result.prod_id, result.prod_count, result.check_quantity);
                    if (typeof AW_PRODUCT != 'undefined') AW_PRODUCT(result.prod_count);
                    if (typeof AM_PRODUCT != 'undefined') AM_PRODUCT(result.prod_count);
                    if (typeof TIKTOK_PIXEL != 'undefined') {
                        TIKTOK_PIXEL.track('AddToCart', {
                            contents: [
                                {
                                    content_id: result.prod_id,
                                    content_name: result.prod_name,
                                    quantity: result.prod_count,
                                    price: result.cart_price
                                },
                            ],
                            event_id: result.tiktok_event_id,
                            content_type: 'product',
                            value: result.total_price,
                            currency: result.currency,
                        });
                    }
                    if (result.advanced_trace_data != null) {
                        if (result.advanced_trace_data.header != '') {
                            $('head').append(result.advanced_trace_data.header);
                        }
                        if (result.advanced_trace_data.body != '') {
                            $('body').append(result.advanced_trace_data.body);
                        }
                        if (result.advanced_trace_data.footer != '') {
                            $('footer').append(result.advanced_trace_data.footer);
                        }
                    }

                    // 같은 상품이 장바구니에 존재하지 않을 경우 장바구니 카운트 증가
                    if (!result.prod_found) {
                        var $shop_cart_badge_cnt_wrap = $('._shop_cart_badge_cnt_wrap');
                        var org_cnt = 0;
                        if ($shop_cart_badge_cnt_wrap.eq(0).text() != '') org_cnt = parseInt($shop_cart_badge_cnt_wrap.eq(0).text());
                        $shop_cart_badge_cnt_wrap.text(org_cnt + 1);

                        // 카운트가 증가할때 기존에 카운트가 0이어서 ui가 안보이던 것을 다시 보이게 활성화
                        $shop_cart_badge_cnt_wrap.removeAttr('disabled');
                    }

                    callback();
                } else {
                    // 코드 7: 비회원 이용권 구매 시 로그인 페이지로
                    if (result.code === 7) {
                        redirectToLoginPage();
                    } else {
                        alert(result.msg);
                        if (result.code === 3) {
                            location.reload();
                        }
                    }
                }
            }
        });
    };

    /**
     * 바로 주문하기  추가, C3 분기를 위해 is_c3 파라미터 추가
     */
    var _addOrder = function (type, backurl, params) {
			let is_oms = params && params.is_oms ? params.is_oms : false;
			let callback = params && params.callback ? params.callback : function () {};
			let is_gift_buy = params && params.is_gift_buy ? params.is_gift_buy : false;
			let selected_freebies = params && params.selected_freebies ? params.selected_freebies : [];


			add_order_progress_check = true;
			cart_type = $('input[name=add_cart_type]:checked').val();

			var _data = {
				'backurl': backurl,
				'prodIdx': current_prod_idx,
				'optDataList': selected_options,
				'orderCount': order_count,
				'type': type,
				'deliv_type': $deliv_type,
				'deliv_pay_type': $deliv_pay_type,
				'deliv_country': $deliv_country,
				'order_type': cart_type,
				'is_gift_buy': is_gift_buy,
				'prod_additional_list': selected_prod_additionals,
				'prod_additional_option_list': selected_prod_additional_options,
				'freebie_list': cart_type !== 'regularly' ? selected_freebies : undefined,
			};

			if(is_oms){
				if (localStorage.getItem("selectedDeliveryCountry") === "undefined") {
					localStorage.removeItem("selectedDeliveryCountry");
				}
				if (typeof $deliv_country !== 'undefined') {
					localStorage.setItem("selectedDeliveryCountry", $deliv_country);
				}
				_data.infoUrl = location.origin;
			}

			_data.ace_pid = window._AcePID || window._AceMID;

			const [buyBtn, buyBtnMobile, buyBtnDialog, buyBtnMobileDialog, buyBtnRegularly, buyBtnRegularlyMobile] = [$('._btn_buy'), $('._btn_mobile_buy'), $('._btn_dialog_buy'), $('._btn_mobile_dialog_buy'), $('._btn_regularly'), $('._buy_regularly')];
			const [buyBtnText, buyBtnMobileText, buyBtnDialogText, buyBtnMobileDialogText, buyBtnRegularlyText, buyBtnRegularlyMobileText] = [buyBtn.first().text(), buyBtnMobile.first().text(), buyBtnDialog.first().text(), buyBtnMobileDialog.first().text(), buyBtnRegularly.first().text(), buyBtnRegularlyMobile.first().text()];

			const setSpinner = function ($buttons) {
				const spinner = '<div class="loading-spinner-container"><div class="loading-spinner"></div></div>';

				if (Array.isArray($buttons)) {
					for (const $button of $buttons) {
						if ($button.length > 0) {
							$button.html(spinner);
						}
					}
				} else {
					if ($buttons.length > 0) {
						$buttons.html(spinner);
					}
				}
			}

			const unsetSpinner = function ($btn, text) {
				if ($btn.length > 0) {
					$btn.html(text);
				}
			};

			$.ajax({
				type: 'POST',
				data: _data,
				// OMS path 분기
				url: is_oms ? '/shop/oms/OMS_add_order.cm' : '/shop/add_order.cm',
				dataType: 'json',
				cache: false,
				beforeSend: function () {
					// TODO 선물하기 버튼에 스피너 적용
					// 간편결제 버튼은 PG사 정책 우려로 인해 스피너 적용하지 않음
					if (is_gift_buy || type === 'npay' || type === 'talkpay') {
						add_order_progress_check = false;

						return;
					}

					// 필수옵션 선택 유효성 검사 실행
					if (!checkRequireOption()) {
						alert(LOCALIZE.설명_필수옵션이모두선택되어있지않습니다());

						add_order_progress_check = false;

						return false;
					}

					// 구매하기, 모바일 구매하기, 다이얼로그 구매하기, 모바일 다이얼로그 구매하기, 정기구독 신청, 모바일 정기구독 신청 버튼에 로딩 스피너 추가
					setSpinner([buyBtn, buyBtnMobile, buyBtnDialog, buyBtnMobileDialog, buyBtnRegularly, buyBtnRegularlyMobile]);
				},
				error: function (result) {
					// 구매하기 PC 버튼 스피너 초기화
					unsetSpinner(buyBtn, buyBtnText);
					// 구매하기 모바일 버튼 스피너 초기화
					unsetSpinner(buyBtnMobile, buyBtnMobileText);
					// 구매하기 다이얼로그 버튼 스피너 초기화
					unsetSpinner(buyBtnDialog, buyBtnDialogText);
					// 구매하기 모바일 다이얼로그 버튼 스피너 초기화
					unsetSpinner(buyBtnMobileDialog, buyBtnMobileDialogText);
					// 정기구독 신청 버튼 스피너 초기화
					unsetSpinner(buyBtnRegularly, buyBtnRegularlyText);
					// 정기구독 신청 모바일 버튼 스피너 초기화
					unsetSpinner(buyBtnRegularlyMobile, buyBtnRegularlyMobileText);

					add_order_progress_check = false;
				},
				success: function (result) {
					if (result.msg == 'SUCCESS') {
								// 페이지가 이동하는 동작의 시각적 연결성을 위해 성공 시에는 스피너를 초기화 하지 않는다.

								if (typeof AW_PRODUCT != 'undefined' && typeof AW_F_D != 'undefined') {
										AW_F_D(current_prod_idx, 'i', order_count);
										AW_PRODUCT(order_count);
								}

								if (result.advanced_kakao_trace_data != null) {
										$('body').append(result.advanced_kakao_trace_data);
								}
								fetch('/ajax/oms/OMS_auth.cm')
									.then((res) => res.json())
									.then((res) => {
										if (res.msg === 'SUCCESS') {
											window.sessionStorage.setItem('oms_token', res.token);
										}
									})
									.finally(() => callback(result))
						} else {
								add_order_progress_check = false;

								// 구매하기 PC 버튼 스피너 초기화
								unsetSpinner(buyBtn, buyBtnText);
								// 구매하기 모바일 버튼 스피너 초기화
								unsetSpinner(buyBtnMobile, buyBtnMobileText);
								// 구매하기 다이얼로그 버튼 스피너 초기화
								unsetSpinner(buyBtnDialog, buyBtnDialogText);
								// 구매하기 모바일 다이얼로그 버튼 스피너 초기화
								unsetSpinner(buyBtnMobileDialog, buyBtnMobileDialogText);
								// 정기구독 신청 버튼 스피너 초기화
								unsetSpinner(buyBtnRegularly, buyBtnRegularlyText);
								// 정기구독 신청 모바일 버튼 스피너 초기화
								unsetSpinner(buyBtnRegularlyMobile, buyBtnRegularlyMobileText);

								if (type == 'talkpay') {
										callback(result);
								} else {
										// 코드 7: 비회원 이용권 구매 시 로그인 페이지로
										if (result.code === 7) {
												redirectToLoginPage();
										} else {
												alert(result.msg.replace(/\\n/g, '\n'));
												if (result.code === 11) {
														callback(result);
												}
												if (result.code === 6) {
														location.reload();
												}
										}
								}

								if(result.code === 2){
									$('._deliv_country_selector').toggleClass('warning_select');
								}
						}

						add_order_progress_check = false;
				}
			});
    };

    var addOrder = function (type, backurl, params) {
        if (add_order_progress_check) return false;
        if (!ensureAddOrderPermission()) return false;
        if (typeof AM_PRODUCT != 'undefined') AM_PRODUCT(order_count);

            //type 이 guest_login 으로 넘어오는경우 비회원주문+로그인페이지로이동후주문 방식임 type 을 normal 로처리해야 다른 로직에 영향이 없어 이렇게 처리함
            // NOTE: 현재 addOrder 함수를 guest_login 값을 type인자로 호출하는 부분을 php코드베이스 내에서 찾을 수 없음.
            var is_guest_login = false;
            if (type == 'guest_login') {
                is_guest_login = true;
                type = 'normal';
            }

            _addOrder(type, backurl, {
							...params,
							is_oms: false, 
							callback: function(result){
                switch (type) {
                    case 'npay':
                        if (result.npay_url == '') {
                            if (result.errmsg) {
                                alert(escape_javascript(result.errmsg));
                            } else {
                                alert(LOCALIZE.설명_네이버페이상품구매실패(escape_javascript(result.errmsg)));
                            }
                            add_order_progress_check = false;
                        } else {
                            if (!!result.shopping_additional_price_msg) {
                                if (!confirm(result.shopping_additional_price_msg + '\n\n' + LOCALIZE.설명_네이버페이를계속해서진행하시겠습니까())) {
                                    add_order_progress_check = false;
                                    return false;
                                }
                            }

                            if (result.auth_type == 2) {
                                // 성인 인증이 필요할 경우
                                window.location.href = '/?mode=adult_auth_npay&data=' + result.data;
                            } else {
                                // 성인 인증이 필요하지 않는 경우
                                var npay_order_info = result['npay_order_info'];

                                if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder();
                                if (typeof FB_PIXEL != 'undefined') {
                                    FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
                                    if (result.fb_npay_switch === 'Y') FB_PIXEL.addNpayOrder(npay_order_info);
                                }

                                if (typeof TIKTOK_PIXEL != 'undefined') {
                                    TIKTOK_PIXEL.track('InitiateCheckout', {
                                        event_id: result.order_code,
                                        contents: result.prod_list.map(prod => ({
                                            content_id: prod.id,
                                            content_name: prod.name,
                                            price: prod.price,
                                        })),
                                        content_type: 'product',
                                        value: result.total_price,
                                        currency: result.currency,
                                    });
                                }

                                if (result.google_analytics_type == 'G' && result.is_ga_api_secret === false) {
                                    if (typeof GOOGLE_ANAUYTICS != 'undefined') GOOGLE_ANAUYTICS.addNpayOrder(npay_order_info);
                                }
                                if (typeof GOOGLE_ADWORDS_TRACE != 'undefined' && result.google_ads_include_npay === 'Y') GOOGLE_ADWORDS_TRACE.addNpayOrder(npay_order_info);
                                if (typeof CRITEO != 'undefined') CRITEO.npayTrackTransaction(npay_order_info);
	                            if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);
															window.location.href = result.npay_url;
                            }
                        }
                        break;
                    case 'talkpay':
                        switch (params.type) {
                            case 'onOrder':
                                if (result.msg == 'SUCCESS') {
                                    if (result.order_sheet_id) {
                                        params.onSuccess(result.order_sheet_id);
                                    } else {
                                        params.onFailure({ message: result.msg });
                                    }
                                } else {
                                    params.onFailure({ message: result.msg });
                                }
                                break;
                            case 'onPayOrder':
                                if (result.msg == 'SUCCESS') {
                                    if (typeof FB_PIXEL != 'undefined') FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
                                    if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder(result.order_code);
	                                if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                                    if (typeof TIKTOK_PIXEL != 'undefined') {
                                        TIKTOK_PIXEL.track('InitiateCheckout', {
                                            event_id: result.order_code,
                                            contents: result.prod_list.map(prod => ({
                                                content_id: prod.id,
                                                content_name: prod.name,
                                                price: prod.price,
                                            })),
                                            content_type: 'product',
                                            value: result.total_price,
                                            currency: result.currency,
                                        });
                                    }

                                    window.location.href = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code);
                                }
                                break;
                        };

                        add_order_progress_check = false;
                        break;
                    default:
                        if (typeof FB_PIXEL != 'undefined') FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
                        if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder(result.order_code);
	                    if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                        if (typeof TIKTOK_PIXEL != 'undefined') {
                            TIKTOK_PIXEL.track('InitiateCheckout', {
                                event_id: result.order_code,
                                contents: result.prod_list.map(prod => ({
                                    content_id: prod.id,
                                    content_name: prod.name,
                                    price: prod.price,
                                })),
                                content_type: 'product',
                                value: result.total_price,
                                currency: result.currency,
                            });
                        }

                        if (is_guest_login && cm_data.use_login_popup === 'N' && !options.is_using_nomember_order_login_after) {	//비회원주문시 로그인 페이지로 이동처리
                            //비회원 구매 불가 조건의 경우 로그인 페이지로 보냄. (주문 생성 x)
                            if (result.code === 11) {
                                var back_url_base64 = window.location.pathname;
                                var url_param = document.location.href.split("?");
                                if (url_param.length > 1) {
                                    back_url_base64 += "?" + url_param[1];
                                }
                                window.location.href = '/login?back_url=' + encodeURIComponent(btoa(back_url_base64));
                            } else {
                                window.location.href = '/login?shopping_order_code=' + result.order_code + '&back_url=' + encodeURIComponent(result.back_url_base64);
                            }
                        } else if (result.code === 7) {
                            // 코드 7: 비회원 이용권 구매 시 로그인 페이지로
                            redirectToLoginPage();
                        } else if(result.msg === 'SUCCESS'){
                            //일반주문이며 주문서 생성에 성공 한 경우 주문서로 이동
                            window.location.href = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code);
                        }
                        break;
                }
            }
					});
    }

    var OMS_addOrder = function (type, backurl, params) {
			if(add_order_progress_check) return false;
			if (!ensureAddOrderPermission()) return false;
			if ( typeof AM_PRODUCT != 'undefined' ) AM_PRODUCT(order_count);

			//type 이 guest_login 으로 넘어오는경우 비회원주문+로그인페이지로이동후주문 방식임 type 을 normal 로처리해야 다른 로직에 영향이 없어 이렇게 처리함
			var is_guest_login=false;
			if (type=='guest_login'){
				is_guest_login=true;
				type='normal';
			}

			_addOrder(type, backurl, {
				...params,
				is_oms: true,
				callback: function(result){
                    if (typeof Sentry !== 'undefined') {
                        Sentry.captureMessage('DEBUG: 주문서 생성', {
                            level: 'info',
                            tags: {
                                order_no: result?.c3_result?.orderNo || null,
                            },
                            extra: {
                                entry: 'detail',                              
                                ic_event_id: result.ic_event_id,
                                fb_external_id: result.fb_external_id,
                                total_price: result.total_price,
                                currency: result.currency,
                                type: type,
                                has_pixel: typeof FB_PIXEL !== 'undefined'
                            }
                        });
                    }

					switch( type ) {
						case 'npay':
							if(result.npay_url == '') {
								if ( result.errmsg ) {
									alert(escape_javascript(result.errmsg));
								} else {
									alert(LOCALIZE.설명_네이버페이상품구매실패(escape_javascript(result.errmsg)));
								}
								add_order_progress_check = false;
							} else {
								if ( !! result.shopping_additional_price_msg ) {
									if ( ! confirm(result.shopping_additional_price_msg + '\n\n' + LOCALIZE.설명_네이버페이를계속해서진행하시겠습니까()) ) {
										add_order_progress_check = false;
										return false;
									}
								}

								if ( result.auth_type == 2 ) {
									// 성인 인증이 필요할 경우
									window.location.href = '/?mode=adult_auth_npay&data=' + result.data;
								} else {
									// 성인 인증이 필요하지 않는 경우
									var npay_order_info = result['npay_order_info'];

									if ( typeof CHANNEL_PLUGIN != 'undefined' ) CHANNEL_PLUGIN.AddOrder();
									if ( typeof FB_PIXEL != 'undefined'){
										FB_PIXEL.InitiateCheckout(result.ic_event_id,result.total_price,result.currency,result.fb_external_id);
										if(result.fb_npay_switch === 'Y') FB_PIXEL.addNpayOrder(npay_order_info);
									}

									if ( result.google_analytics_type == 'G' && result.is_ga_api_secret === false ) {
										if ( typeof GOOGLE_ANAUYTICS != 'undefined') GOOGLE_ANAUYTICS.addNpayOrder(npay_order_info);
									}
									if ( typeof GOOGLE_ADWORDS_TRACE != 'undefined' && result.google_ads_include_npay === 'Y') GOOGLE_ADWORDS_TRACE.addNpayOrder(npay_order_info);
									if ( typeof CRITEO != 'undefined') CRITEO.npayTrackTransaction(npay_order_info);
									if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                                    if (typeof TIKTOK_PIXEL != 'undefined') {
                                        TIKTOK_PIXEL.track('InitiateCheckout', {
                                            event_id: result.order_code,
                                            contents: result.prod_list.map(prod => ({
                                                content_id: prod.id,
                                                content_name: prod.name,
                                                price: prod.price,
                                            })),
                                            content_type: 'product',
                                            value: result.total_price,
                                            currency: result.currency,
                                        });
                                    }

									if (typeof result.npay_url !== 'string' || result.npay_url.indexOf('pay.naver.com') < 0) return false;
									window.location.href = result.npay_url;
								}
							}
							break;
						case 'talkpay':
							switch ( params.type ) {
								case 'onOrder':
									if ( result.msg == 'SUCCESS' ) {
										if ( result.order_sheet_id ) {
											params.onSuccess(result.order_sheet_id);
										} else {
											params.onFailure({message: result.msg});
										}
									} else {
										params.onFailure({message: result.msg});
									}
									break;
								case 'onPayOrder':
									if ( result.msg == 'SUCCESS' ) {
										if ( typeof FB_PIXEL != 'undefined' ) FB_PIXEL.InitiateCheckout(result.ic_event_id,result.total_price,result.currency,result.fb_external_id);
										if ( typeof CHANNEL_PLUGIN != 'undefined' ) CHANNEL_PLUGIN.AddOrder(result.order_code);
										if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                                        if (typeof TIKTOK_PIXEL != 'undefined') {
                                            TIKTOK_PIXEL.track('InitiateCheckout', {
                                                event_id: result.order_code,
                                                contents: result.prod_list.map(prod => ({
                                                    content_id: prod.id,
                                                    content_name: prod.name,
                                                    price: prod.price,
                                                })),
                                                content_type: 'product',
                                                value: result.total_price,
                                                currency: result.currency,
                                            });
                                        }

										var shop_payment_url = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code) + '&order_no=' + encodeURIComponent(result.order_no);										
										if (result.member_code) {
											shop_payment_url += "&order_member=" + encodeURIComponent(result.member_code);
										}
										if ( result.kakaopay_only === 'Y' ) {
											shop_payment_url += "&kakaopay_only=Y";
										}
										window.location.href = shop_payment_url;
									}
									break;
							};

							add_order_progress_check = false;
							break;
						default:
							if ( typeof FB_PIXEL != 'undefined' ) FB_PIXEL.InitiateCheckout(result.ic_event_id,result.total_price,result.currency,result.fb_external_id);
							if ( typeof CHANNEL_PLUGIN != 'undefined' ) CHANNEL_PLUGIN.AddOrder(result.order_code);
							if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                            if (typeof TIKTOK_PIXEL != 'undefined') {
                                TIKTOK_PIXEL.track('InitiateCheckout', {
                                    event_id: result.order_code,
                                    contents: result.prod_list.map(prod => ({
                                        content_id: prod.id,
                                        content_name: prod.name,
                                        price: prod.price,
                                    })),
                                    content_type: 'product',
                                    value: result.total_price,
                                    currency: result.currency,
                                });
                            }

							if (is_guest_login && cm_data.use_login_popup === 'N' && !options.is_using_nomember_order_login_after){	//비회원주문시 로그인 페이지로 이동처리
															//비회원 구매 불가 조건의 경우 로그인 페이지로 보냄. (주문 생성 x)
															if(result.code === 11){
																	var back_url_base64 = window.location.pathname;
																	var url_param = document.location.href.split("?");
																	if(url_param.length > 1){
																			back_url_base64 += "?"+url_param[1];
																	}
																	window.location.href = '/login?back_url='+encodeURIComponent(btoa(back_url_base64));
															}else{
																	window.location.href = '/login?shopping_order_code=' + result.order_code + '&back_url=' + encodeURIComponent(result.back_url_base64);
															}
							} else if (result.code === 7) {
															// 코드 7: 비회원 이용권 구매 시 로그인 페이지로
															redirectToLoginPage();
							}else{  //일반주문인경우 결제화면으로 이동
								if (typeof result.c3_result === "undefined" || typeof result.c3_result.orderCode === "undefined" || typeof result.c3_result.orderNo === "undefined") return
								window.location.href
									= "/shop_payment/?order_code="
									+ encodeURIComponent(result.c3_result.orderCode)
									+ "&order_no="
									+  encodeURIComponent(result.c3_result.orderNo)
									+ (result.c3_result.memberCode ? `&order_member=${encodeURIComponent(result.c3_result.memberCode)}` : '');
							}
							break;
					}
				}
			});
    }

    /**
     * 네이버페이지 찜하기  등록
     */
    var addNPayWish = function () {
        $.ajax({
            type: 'POST',
            data: { 'prod_idx_list': [current_prod_idx] },
            url: ('/shop/add_npay_wish.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (result.mobile == 'Y')
                        window.location.href = result.npay_url;
                    else
                        window.open(result.npay_url, "", "scrollbars=yes,width=400,height=267");
                } else {
                    alert(LOCALIZE.설명_네이버페이찜등록실패(escape_javascript(result.msg)));
                }
            }
        });
    };


    var digitalFileDownload = function (order_no) {
        if (prod_type !== SHOP_CONST.PROD_TYPE.DIGITAL) return false;
        $.ajax({
            "type": "POST",
            "data": { "prod_no": current_prod_idx, "order_no": order_no, "mode": "detail" },
            "url": "/ajax/shop_digital_prod_download.cm",
            "dataType": "JSON",
            "success": function (res) {
                if (res['msg'] == 'SUCCESS') {
                    if (res['download_info_msg'].trim() == '' || confirm(res['download_info_msg'])) {
                        location.href = res['file_url'];
                    }
                } else {
                    alert(res['msg']);
                    if (typeof res['reload'] != 'undefined') {
                        location.reload();
                    }
                }
            }
        });
    };

    /**
     * OMS 디지털 상품 다운로드 (쓰로틀링 적용)
     */
    var lastOmsDownloadClick = 0;
    var handleOmsDigitalDownload = function (e, href) {
        if (e) e.preventDefault();
        
        var now = new Date().getTime();
        if (now - lastOmsDownloadClick < 1000) {
            return;
        }
        
        lastOmsDownloadClick = now;
        window.location.href = href;
    };
    /**
     * 모바일에서 구매하기 클릭시 옵션 표시 처리
     * @param type	buy 구매하기, regularly 정기구독, gift 선물하기
     */
    var showMobileOptions = function (type) {
        if (!options.is_price_view_permission && window.IS_GUEST) {
            const backUrl = encodeURIComponent(base64Encode(window.location.href));
            if (cm_data.use_login_popup === 'Y') {
                window.SITE_MEMBER.openLogin(
                    backUrl,
                    'payment',
                    function () {
											if (window.USE_OMS === true) {
												OMS_addOrder(
													'normal',
													encodeURIComponent(base64Encode(window.location.href))
												)
											} else {
												addOrder(
													'normal',
													encodeURIComponent(base64Encode(window.location.href))
												);
											}
										},
                    'N',
                    'payment',
                );
            } else {
                window.location.href = '/login?back_url=' + backUrl;
            }
            return;
        }
        if (type === 'regularly') {
            $('input[name=add_cart_type]:checked').val('regularly');
            // 모바일 구매/옵션 바텀시트 여는 코드
            $prod_detail.addClass('open detail-regularly');
        } else {
            $('input[name=add_cart_type]:checked').val('normal');
            // 모바일 구매/옵션 바텀시트 여는 코드
            $prod_detail.addClass('open');
			$prod_detail.find('._btn_restock').css('display', 'flex');
        }
        showMobileFirstSelect();
        var full_input = false;
        var $form = $options.find('._form_parent');
        // 첫번째 선택 후 창을 닫았을때
        $form.each(function (index) {

            var is_input = $(this).children().hasClass('option_box_wrap');

            if (is_input) {
                var input_items = $(this).find('._requireInputOption');
                input_items.each(function (index) {
                    if ($(this).val() != '') {
                        if ((index + 1) == input_items.length) {
                            full_input = true;
                        }
                    } else {
                        return false;
                    }
                });

            } else {
                var prev_is_selected = $(this).prev().find('.dropdown-item').hasClass('selected');
                var is_selected = $(this).find('.dropdown-item').hasClass('selected');
                // 이전 필수 드롭다운이 선택 되어 있을 경위
                if (prev_is_selected || full_input) {
                    $(this).toggleClass('disabled', false);

                    full_input = false;

                    if (!is_selected) {
                        var current = 0;
                        var $current_form_select = $(this).eq(current);
                        var $current_form_dropdown_toggle = $current_form_select.find('.dropdown-toggle');

                        $current_form_dropdown_toggle.attr('aria-expanded', true);
                        $current_form_dropdown_toggle.toggleClass('active', true);
                        $current_form_select.attr('data-val', true);

                        setTimeout(function () {
                            $current_form_dropdown_toggle.dropdown('toggle');
                        }, 10);

                        $current_form_dropdown_toggle.off('click').on('click', function () {
                            $current_form_dropdown_toggle.attr('aria-expanded', false);
                            $current_form_dropdown_toggle.toggleClass('active', false);
                            $current_form_select.attr('data-val', false);
                        });
                    }
                } else if (index === 0) {
                    // 첫 드롭다운은 일단 true로 표시
                    $(this).toggleClass('disabled', false);
                } else {
                    $(this).toggleClass('disabled', true);
                }
            }
        });
        // 모달 또는 바텀시트 표시될 때 전체스크롤 등의 동작 막는 코드
        $('html').addClass('mobile-shop-open');
        $('body').addClass('mobile-nav-on modal-open');
        $('header#doz_header_wrap').addClass('bg-back');
        $('.categorize-mobile .site_prod_nav_wrap').addClass('bg-back');

        // 실시간 상담 부분
        $('#ch-plugin, #kakao-talk-channel-chat-button, .talk_banner_wrap, #fb-root').hide();

	    if (options.is_possible_use_gift) {
		    handleMobileGiftFooterUI(true, type);
	    }
    };
    const changeValueChecked = function () {
        $("input:radio[name='add_cart_type']:radio[value='normal']").prop('checked', false);
        $("input:radio[name='add_cart_type']:radio[value='regularly']").prop('checked', true);
    };
    /**
     * 조합형 + 필수 옵션일 때 첫번째 셀렉트 박스는 show 처리
     */
    var showMobileFirstSelect = function () {
        var $form_select = $options.find('._first_form_select');
        if ($form_select.length) {
            var current = 0;
            var $current_form_select = $form_select.eq(current);
            var $current_form_dropdown_toggle = $current_form_select.find('.dropdown-toggle');

            $current_form_dropdown_toggle.attr('aria-expanded', true);
            $current_form_dropdown_toggle.toggleClass('active', true);
            $current_form_select.attr('data-val', true);

            setTimeout(function () {
                $current_form_dropdown_toggle.dropdown('toggle');
            }, 50);

            $current_form_dropdown_toggle.off('click').on('click', function () {
                $current_form_dropdown_toggle.attr('aria-expanded', false);
                $current_form_dropdown_toggle.toggleClass('active', false);
                $current_form_select.attr('data-val', false);
            });
            $form_select.parent('._form_parent').nextAll().toggleClass('disabled', true);
        }
    };

    /**
     * 모바일에서 구매하기 클릭시 옵션 숨기기 처리
     */
    var hideMobileOptions = function () {
        $prod_detail.removeClass('open detail-regularly');
        $('html').removeClass('mobile-shop-open');
        $('body').removeClass('mobile-nav-on modal-open');
        $('header#doz_header_wrap').removeClass('bg-back');
        $('.categorize-mobile .site_prod_nav_wrap').removeClass('bg-back');

        // 실시간 상담 부분
        $('#ch-plugin, #kakao-talk-channel-chat-button, .talk_banner_wrap, #fb-root').show();
				$prod_detail.find('._btn_restock').hide();

		if (options.is_possible_use_gift) {
			handleMobileGiftFooterUI(false);
		}
    };

    /**
     * PC B타입에서 구매하기/장바구니 클릭 시 옵션 표시 처리, 옵션 표시되어있으면 구매하기/장바구니
     * @param type order: 구매하기, cart: 장바구니, gift: 선물하기
     * @param backurl 비회원 구매 시 로그인 등에서 사용될 back url
     */
    var showPCOptions = function (type, backurl = location.href, is_c3 = false){
        if (backurl == undefined) backurl = location.href;
        if ($prod_detail.hasClass('open')) {
					// 바텀시트가 열려 있으면
            if(type == 'cart'){
                SITE_SHOP_DETAIL.addCart();
            } else if (type == 'gift') {
							  if (is_c3) {
									SITE_SHOP_DETAIL.OMS_addGiftOrder('normal', backurl);
								} else {
									SITE_SHOP_DETAIL.addGiftOrder('normal', backurl);
								}
            } else {
                if (is_c3) {
                    SITE_SHOP_DETAIL.OMS_addOrder('normal', backurl);
                }else{
                    SITE_SHOP_DETAIL.addOrder('normal', backurl);
                }
            }
        } else {
					// 바텀시트가 안열려 있으면
            $prod_detail.find('._btn_npay').hide();
            $prod_detail.find('._btn_kakaopay').hide();
			$prod_detail.find('._btn_restock').show();
            $prod_detail.addClass('open');
            var $add_cart_type = $prod_detail.find('input[name=add_cart_type]:checked');
            if ($add_cart_type.length > 0) {
                if ($add_cart_type.val() === 'regularly') {
                    $prod_detail.addClass('detail-regularly');
                }
            }

			if (options.is_possible_use_gift) {
				handlePCGiftFooterUI(true, type);
			}
        }
    };

    var hidePCOptions = function () {
        $prod_detail.removeClass('open detail-regularly');
        $prod_detail.find('._btn_npay').show();
        $prod_detail.find('._btn_kakaopay').show();
		$prod_detail.find('._btn_restock').hide();

	    if (options.is_possible_use_gift) {
		    handlePCGiftFooterUI(false);
	    }
    };

	var handlePCGiftFooterUI = function (isOpen, type) {
		const $root = $('._buy_footer_fixed');

		const $footerPriceWrap = $root.find('._footer_price_wrap');
		const $btnCart = $root.find('._btn_cart');
		const $btnGift = $root.find('._btn_gift');
		const $btnBuy = $root.find('._btn_buy');
		const $btnDialogSoldout = $root.find('._btn_dialog_soldout');
		const $btnDialogBuy = $root.find('._btn_dialog_buy');
		const $btnDialogGift = $root.find('._btn_dialog_gift');

		const hideAll = () => {
			$footerPriceWrap.hide();
			$btnCart.hide();
			$btnGift.hide();
			$btnBuy.hide();
			$btnDialogSoldout.hide();
			$btnDialogBuy.hide();
			$btnDialogGift.hide();
		}

		const isSoldout = options.is_soldout;

		hideAll();

		if (isOpen) {
			if (isSoldout) {
				$btnDialogSoldout.show();
			} else {
				$footerPriceWrap.show();
				$btnCart.show();

				switch(type) {
					case 'order':
						$btnDialogBuy.show();
						break;
					case 'gift':
						$btnDialogGift.show();
						break;
					case 'cart':
						$btnGift.show();
						$btnBuy.show();
						break;
				}
			}
		} else {
			$footerPriceWrap.show();
			$btnCart.show();
			$btnGift.show();
			$btnBuy.show();
		}
	}

	const handleMobileGiftFooterUI = (isOpen, type) => {
		const $root = $('._mobile-gift-footer');
		const $socialBtnRoot = $('._social_m_position');

		const $btnGift = $root.find('._btn_mobile_gift');
		const $btnBuy = $root.find('._btn_mobile_buy');
		const $btnNPay = $root.find('._btn_mobile_npay');
		const $btnKakaoPay = $root.find('._btn_mobile_kakaopay');
		const $btnDialogSoldout = $root.find('._btn_mobile_dialog_soldout');
		const $btnDialogCart = $root.find('._btn_mobile_dialog_cart');
		const $btnDialogBuy = $root.find('._btn_mobile_dialog_buy');
		const $btnDialogGift = $root.find('._btn_mobile_dialog_gift');

		const hideAll = () => {
			$btnGift.hide();
			$btnBuy.hide();
			$btnNPay.hide();
			$btnKakaoPay.hide();
			$btnDialogSoldout.hide();
			$btnDialogCart.hide();
			$btnDialogBuy.hide();
			$btnDialogGift.hide();
			$socialBtnRoot.hide();
		}

		hideAll();

		const isSoldout = options.is_soldout;

        if (isOpen) {
            if (isSoldout) {
                $btnDialogSoldout.show();
            } else {
                switch(type) {
                    case 'buy':
                        $btnDialogCart.show();
                        $btnDialogBuy.show();
                        if ($socialBtnRoot.find('._social_pay').children().length > 0) $socialBtnRoot.show();
                        break;
                    case 'gift':
                        $btnDialogGift.show();
                        break;
                }
            }
        } else {
            $btnGift.show();
            $btnBuy.show();
            $btnNPay.show();
            $btnKakaoPay.show();
        }
    }

    var socialBtnResize = function () {
        var $social_box = $('._social_pay');
        var $pc_position = $('._social_pc_position');
        var $m_position = $('._social_m_position');
        var w_width = $(window).width();

        if (w_width > 787) {
            $pc_position.append($social_box);
        } else {
            $m_position.append($social_box);
        }

        $(window).resize(function () {
            w_width = $(window).width();
            if (w_width > 787) {
                $pc_position.append($social_box);
                if ($('html').hasClass('mobile-shop-open')) {
                    hideMobileOptions();
                }
                if ($('._style_b_clse').length) {
                    $('._style_b_clse').removeAttr('onclick');
                    $('._style_b_clse').attr('onclick', 'SITE_SHOP_DETAIL.hidePCOptions()');
                }
            } else {
                $m_position.append($social_box);
                if ($('._style_b_clse').length) {
                    $('._style_b_clse').removeAttr('onclick');
                    $('._style_b_clse').attr('onclick', 'SITE_SHOP_DETAIL.hideMobileOptions()');
                }
            }
        });
    };

	const externalwidgetWrapResize = function(move_target, pc_position, mo_position){
		const $target = $(`.${move_target}`);
		const $pc_position = $(`.${pc_position}`);
		const $m_position = $(`.${mo_position}`);
		let w_width = $(window).width();

        if($('body').hasClass('device_type_m')) {
            w_width = 768;
        }

		if(w_width > 768){
			$pc_position.append($target);
		}else{
			$m_position.append($target);
		}

		$(window).resize(function(){
			w_width = $(window).width();
			if(w_width > 768){
                if(!($pc_position.find($target).length)) {
                    $pc_position.append($target);
                    if($('html').hasClass('mobile-shop-open')){
                        hideMobileOptions();
                    }
                    if($('._style_b_clse').length){
                        $('._style_b_clse').removeAttr('onclick');
                        $('._style_b_clse').attr('onclick', 'SITE_SHOP_DETAIL.hidePCOptions()');
                    }
                }
			}else{
                if(!($m_position.find($target).length)){
                    $m_position.append($target);
                    if($('._style_b_clse').length){
                        $('._style_b_clse').removeAttr('onclick');
                        $('._style_b_clse').attr('onclick', 'SITE_SHOP_DETAIL.hideMobileOptions()');
                    }
                }
			}
		});
	};

	/**
	 * qna 상세페이지 모달
	 * @param idx
	 * @param qna_page
	 * @param is_hash		주소창에 직접 입력 또는 최신글 위젯 등 상세페이지 외부에서 바로 넘어왔는지 여부, Y/N
	 */
	var viewQnaDetail = function(idx,qna_page,is_hash){
		$(function(){
			$.ajax({
				type : 'POST',
				data : {idx : idx, qna_page : qna_page},
				url : ('/ajax/qna_detail_view.cm'),
				dataType : 'json',
				async : false,
				cache : false,
				success : function(res){
					if(res.msg === 'SUCCESS'){
						$.cocoaDialog.open({
							type : 'prod_detail', custom_popup : res.html, width : 800});
						if(checkUseHistory()){
							// 모달 히스토리 커스텀(IE 10 이상)
							var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
							var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
							if(current_url !== back_url && is_hash !== 'Y'){
								history.pushState(null, null, current_url);
							}
							history.replaceState(null, null, current_url + "#prod_detail_qna!/" + res.idx);
						}else{
							location.hash = "prod_detail_qna!/" + res.idx;
						}
						$(window).off('hashchange').on('hashchange',function(){
							var hash_qna_spilt = location.hash.split('!/')[1];
							if(!hash_qna_spilt){
								$.cocoaDialog.close();
							}else{
								if(checkUseHistory()){
									var hash_spilt_tab = location.hash.split('!/')[0];
									if(hash_spilt_tab === '#prod_detail_review'){
										viewReviewDetail(hash_qna_spilt);
									}else if(hash_spilt_tab === '#prod_detail_qna'){
										viewQnaDetail(hash_qna_spilt);
									}
								}
							}
						});
						$('.modal_prod_detail').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
              $('html').toggleClass('modal-scroll-control', false);
							if(is_hash !== 'Y'){
								removeQnawHash();
							}
						});
					}else{
						alert(res.msg);
					}
				}
			});
		});
	};
    /**
     * qna 상세페이지 모달
     * @param idx
     * @param qna_page
     * @param is_hash		주소창에 직접 입력 또는 최신글 위젯 등 상세페이지 외부에서 바로 넘어왔는지 여부, Y/N
     */
    var viewQnaDetail = function (idx, qna_page, is_hash) {
        $(function () {
            $.ajax({
                type: 'POST',
                data: { idx: idx, qna_page: qna_page },
                url: ('/ajax/qna_detail_view.cm'),
                dataType: 'json',
                async: false,
                cache: false,
                success: function (res) {
                    if (res.msg === 'SUCCESS') {
                        $.cocoaDialog.open({
                            type: 'prod_detail', custom_popup: res.html, width: 800
                        });
                        if (checkUseHistory()) {
                            // 모달 히스토리 커스텀(IE 10 이상)
                            var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
                            var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
                            if (current_url !== back_url && is_hash !== 'Y') {
                                history.pushState(null, null, current_url);
                            }
                            history.replaceState(null, null, current_url + "#prod_detail_qna!/" + res.idx);
                        } else {
                            location.hash = "prod_detail_qna!/" + res.idx;
                        }
                        $(window).off('hashchange').on('hashchange', function () {
                            var hash_qna_spilt = location.hash.split('!/')[1];
                            if (!hash_qna_spilt) {
                                $.cocoaDialog.close();
                            } else {
                                if (checkUseHistory()) {
                                    var hash_spilt_tab = location.hash.split('!/')[0];
                                    if (hash_spilt_tab === '#prod_detail_review') {
                                        viewReviewDetail(hash_qna_spilt);
                                    } else if (hash_spilt_tab === '#prod_detail_qna') {
                                        viewQnaDetail(hash_qna_spilt);
                                    }
                                }
                            }
                        });
                        $('.modal_prod_detail').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            $('html').toggleClass('modal-scroll-control', false);
                            if (is_hash !== 'Y') {
                                removeQnawHash();
                            }
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });
    };

    var removeQnawHash = function () {
        $(window).off('hashchange');
        var hash_qna_spilt = location.hash.split('!/')[1];
        if (hash_qna_spilt) {
            if (checkUseHistory()) {
                history.back();
            } else {
                location.href = '#prod_detail_qna';
            }
        }
    };

    /**
     *  리뷰 모달 html 변경 (앞 뒤 버튼으로 호출)
     * @param idx
     */
    var changeReviewDetail = function (idx) {
        $.ajax({
            type: 'POST',
            data: { idx: idx, review_page: 1, only_photo: "Y" },
            url: ('/ajax/review_detail_change.cm'),
            dataType: 'json',
            async: false,
            cache: false,
            success: function (res) {
                if (res.msg === 'SUCCESS') {
                    $('._review_modal_body').html(res.html);
                    if (IS_MOBILE) {
                        // setReviewSwipe(res.prev_idx, res.next_idx);
                        $body.find('.modal.review').after(res.btn_html);
                        $body.find('._btn_nav_wrap').off('click').on('click', function () {
                            $(this).remove();
                        });
                        $body.find('#review_detail_close').off('click').on('click', function () {
                            $('._btn_nav_wrap').remove();
                        });
                        setReviewBtnAnimation();
                        setReviewClass(idx);
                    }
                    setReviewCarousel();
                    $(window).resize(function () {
                        setReviewCarousel();
                    });
                    if (res.review_code != '') SHOP_REVIEW_COMMENT.getReviewCommentHtml(res.review_code, 'modal');
                } else {
                    alert(res.msg);
                }
            }
        });
    };

    /**
     * 리뷰 상세페이지 모달
     * @param idx
     * @param review_page
     * @param only_photo
     * @param is_hash		주소창에 직접 입력 또는 최신글 위젯 등 상세페이지 외부에서 바로 넘어왔는지 여부, Y/N
     */
    var viewReviewDetail = function (idx, review_page, only_photo, is_hash) {
        $(function () {
            $.ajax({
                type: 'POST',
                data: { idx: idx, review_page: review_page, only_photo: only_photo },
                url: ('/ajax/review_detail_view.cm'),
                dataType: 'json',
                async: false,
                cache: false,
                success: function (res) {
                    if (res.msg === 'SUCCESS') {
                        $.cocoaDialog.open({ type: 'prod_detail review', custom_popup: res.html, width: 800 });
                        if (checkUseHistory()) {
                            // 모달 히스토리 커스텀(IE 10 이상)
                            var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
                            var back_url = document.referrer.indexOf('#') === -1 ? document.referrer : document.referrer.substr(0, document.referrer.indexOf('#'));
                            if (current_url !== back_url && is_hash !== 'Y') {
                                history.pushState(null, null, current_url);
                            }
                            history.replaceState(null, null, current_url + "#prod_detail_review!/" + res.idx);
                        } else {
                            location.hash = "prod_detail_review!/" + res.idx;
                        }
                        $(window).off('hashchange').on('hashchange', function () {
                            var hash_review_spilt = location.hash.split('!/')[1];
                            if (!hash_review_spilt) {
                                $.cocoaDialog.close();
                            } else {
                                if (checkUseHistory()) {
                                    var hash_spilt_tab = location.hash.split('!/')[0];
                                    if (hash_spilt_tab === '#prod_detail_qna') {
                                        viewQnaDetail(hash_review_spilt);
                                    } else if (hash_spilt_tab === '#prod_detail_review') {
                                        viewReviewDetail(hash_review_spilt);
                                    }
                                }
                            }
                        });
                        $('.modal_prod_detail').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            $('html').toggleClass('modal-scroll-control', false);
                            if (is_hash !== 'Y') {
                                removeReviewHash();
                            }
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });
    };

    var removeReviewHash = function () {
        $(window).off('hashchange');
        var hash_review_spilt = location.hash.split('!/')[1];
        if (hash_review_spilt) {
            if (checkUseHistory()) {
                history.back();
            } else {
                location.href = '#prod_detail_review';
            }
        }
    };



    /**
     *
     */
    var getOnlyPhotoReview = function (only_photo_switch, is_mobile, is_one_page, rating) {
		    let $target_html;
        const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);
        let isMobile = is_mobile === 'Y';
        if (isMobile !== isMobile_width) {
            isMobile = !isMobile;
        }
        const device_name = isMobile ? 'mobile' : 'pc';
        const one_page_mode = is_one_page === 'Y';
        const ajax_target = `/shop/prod_review_${device_name}_html.cm`;

        if (one_page_mode) $target_html = $(`._detail_review_wrap${device_name === 'pc'? '' : '_' + device_name} ._review_wrap`);
		    else $target_html = $(`.product_review${device_name === 'pc'? '' : '_' + device_name}`);

        if ($target_html.length) {
            var $icon_picture = $('.icon-picture');
            $.ajax({
                type: 'POST',
                data: {
                  'prod_idx': current_prod_idx,
                  'only_photo': only_photo_switch,
                  'rating': rating,
                },
                url: (ajax_target),
                dataType: 'html',
                cache: false,
                async: false,
                success: function (result) {
                    $target_html.html(result);
                    if ($icon_picture.hasClass('active')) {
                        $icon_picture.removeClass('active');
                    } else {
                        $icon_picture.addClass('active');
                    }
                }
            });
        }
    };

    const getStarRatingReview = function (only_photo_switch, is_mobile, is_one_page, rating) {
      let $target_html;
      const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);
      let isMobile = is_mobile === 'Y';
      if (isMobile !== isMobile_width) {
        isMobile = !isMobile;
      }
      const device_name = isMobile ? 'mobile' : 'pc';
      const one_page_mode = is_one_page === 'Y';
      const ajax_target = `/shop/prod_review_${device_name}_html.cm`;

      if (one_page_mode) $target_html = $(`._detail_review_wrap${device_name === 'pc'? '' : '_' + device_name} ._review_wrap`);
      else $target_html = $(`.product_review${device_name === 'pc'? '' : '_' + device_name}`);

      if ($target_html.length) {
        var $icon_picture = $('.icon-picture');
        $.ajax({
          type: 'POST',
          data: {
            'prod_idx': current_prod_idx,
            'only_photo': only_photo_switch,
            'rating' : rating,
          },
          url: (ajax_target),
          dataType: 'html',
          cache: false,
          async: false,
          success: function (result) {
            $target_html.html(result);
            const $rating = $('.icon-picture');
          }
        });
      }
    }

    var getFirstPhotoReview = function (page) {
        if ($first_photo_review_wrap.length) {
            var is_cache = false;
            var callback = function (result) {
                $first_photo_review_wrap.html(result);
                if (!is_cache) IMWEB_SESSIONSTORAGE.set("PROD_REVIEW_PC_PHOTO_" + current_prod_idx + "_" + page, result.replace(/\t+/g, '').trim(), 60);
            };

            var html = IMWEB_SESSIONSTORAGE.get("PROD_REVIEW_PC_PHOTO_" + current_prod_idx + "_" + page);
            if (html) {
                is_cache = true;
                callback(html);
            } else {
                $.ajax({
                    type: 'POST',
                    data: { prod_idx: current_prod_idx, page: page },
                    url: '/shop/prod_photo_review_pc_html.cm',
                    dataType: 'html',
                    cache: false,
                    async: false,
                    success: callback
                });
            }
        }
    };

    var viewPhotoReviewMore = function (is_mobile, is_one_page) {
        if (is_mobile !== 'Y') {
            // 모바일에서는 구매평 내부에서만 호출하므로 탭 전환 필요 없음
            changeContentPCTab(SHOP_CONST.TAB_TYPE.REVIEW, review_page, qna_page, false);
        }
        getOnlyPhotoReview('Y', is_mobile, is_one_page);
        if (is_mobile !== 'Y') {
            if (is_one_page === 'Y') {
                $('._detail_review_wrap')[0].scrollIntoView();
            } else {
                $('._prod_detail_detail_lazy_load')[0].scrollIntoView();
            }
        } else {
            if (is_one_page === 'Y') {
                $('._detail_review_wrap_mobile')[0].scrollIntoView();
            } else {
                $('._prod_detail_detail_lazy_load_mobile')[0].scrollIntoView();
            }
        }
    };

    var getReviewSummary = function (target) {
        if ($review_summary_wrap_mobile.length) {
            $.ajax({
                type: 'POST',
                data: { 'prod_idx': current_prod_idx, 'type': 'mobile' },
                url: ('/shop/prod_review_summary_html.cm'),
                dataType: 'html',
	              cache: false,
                async: false,
                success: function (result) {
                    if(target) {
                        target.style.display = 'block';
                        target.innerHTML = result;
                    } else {
                        $review_summary_wrap_mobile.html(result);
                        $review_summary_wrap_mobile.show();
                    }
                    startReviewImageRolling('mobile');
                }
            });
        }

        if (!IS_MOBILE) {
            if ($review_summary_wrap.length) {
                var pc_type = $prod_detail.width() > 991 ? 'pc' : 'tablet';

                $.ajax({
                    type: 'POST',
                    data: { 'prod_idx': current_prod_idx, 'type': pc_type },
                    url: ('/shop/prod_review_summary_html.cm'),
                    dataType: 'html',
	                  cache: false,
                    async: false,
                    success: function (result) {
                        $review_summary_wrap.html(result);
                        if ($prod_detail.width() <= 991) {
                            $review_summary_wrap.removeClass('review_summary_wrap');
                            $review_summary_wrap.addClass('review_summary_wrap_tablet');
                        }
                        $review_summary_wrap.show();
                        startReviewImageRolling(pc_type);
                    }
                });
            }
        }
    };

    var startReviewImageRolling = function (type) {
        if (type === 'mobile') {
            $review_image_list = $review_summary_wrap_mobile.find('.review_image_list');
        } else {
            $review_image_list = $review_summary_wrap.find('.review_image_list');
        }
        $review_image_list_rolling = $review_image_list.find('div.owl-carousel');

        var navtext_left = $('<i class="btl bt-angle-left" style="position: absolute; font-size: 20px; left: -25px; top: 45px;"></i>');
        var navtext_right = $('<i class="btl bt-angle-right" style="position: absolute; font-size: 20px; right: -25px; top: 45px;"></i>');

        var margin = type === 'mobile' ? 5 : 10;
        var items = 4;


        var img_width = Math.floor(($review_image_list.innerWidth() - (margin * (items - 1))) / items);
        if (type === 'tablet') {
            if (img_width > 150) {
                // img_width가 150보다 크면 개수 자체를 150에 맞춰서 재계산
                items = Math.ceil($review_image_list.innerWidth() / (150 + margin / 2));
                img_width = Math.floor(($review_image_list.innerWidth() - (margin * (items - 1))) / items);
            }
        }
        $('._review_carousel_image').each(function () {
            $(this).css('width', img_width);
            $(this).css('height', img_width);
        });

        $review_image_list_rolling.owlCarousel({
            dots: false,
            nav: type === 'pc',
            navText: [navtext_left, navtext_right],
            slideSpeed: 300,
            paginationSpeed: 400,
            animateOut: 'fadeOut',
            autoWidth: true,
            items: items,
            margin: margin
        });
    };


    /**
     * 한페이지 전체 노출에서 리뷰 삭제 코드
     * @param prod_code
     * @param only_photo
     * @returns {boolean}
     */

    const deleteReviewInTabDisplay = function (prod_code, only_photo) {

        if (options.shop_view_tab_display !== "Y") return false;

        $.ajax({
            type: 'POST',
            data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page, 'only_photo': only_photo },
            url: ('/shop/prod_review_pc_html.cm'),
            dataType: 'html',
            cache: false,
            async: true,
            success: function (result) {
                $('.categorize ._review_wrap').html(result);
            }
        });

        $.ajax({
            type: 'POST',
            data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page, 'only_photo': only_photo },
            url: ('/shop/prod_review_mobile_html.cm'),
            dataType: 'html',
            cache: false,
            async: true,
            success: function (result) {
                $('.categorize-mobile ._review_wrap').html(result);
            }
        });

    }

    /**
     *  pc 상세페이지 탭 이벤트 처리
     * @param type 탭 type
     * @param r_p
     * @param q_p
     * @param paging_on 스크롤 조정 //deprecated
     * @param only_photo
     * @param shop_view_body_width
     * @param rating
     */
    var changeContentPCTab = function (type, r_p, q_p, paging_on, only_photo, rating = 0, shop_view_body_width) {
        var $site_prod_nav_wrap = $('.categorize .site_prod_nav_wrap');

        $site_prod_nav_wrap.find(`a`).removeClass('active');

        current_content_tab = type;

        $site_prod_nav_wrap.find(`a._${type}`).addClass('active');

		var review_paging = false;
		var qna_paging = false;

		if(parseInt(r_p) > 0){
			if(review_page != parseInt(r_p) && type == SHOP_CONST.TAB_TYPE.REVIEW){
				review_paging = true;
			}
			review_page = parseInt(r_p);
		}else{
			r_p = review_page;
		}
		if(parseInt(q_p) > 0){
			if(qna_page != parseInt(q_p) && type == SHOP_CONST.TAB_TYPE.QNA){
				qna_paging = true;
			}
			qna_page = parseInt(q_p);
		}else{
			q_p = qna_page;
		}

	    if(options.shop_view_tab_display !== "Y" || review_paging || qna_paging){
		    switch (true) {
			    case use_cdn_optimized && (type === SHOP_CONST.TAB_TYPE.DETAIL): {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap.html()){
						    $review_summary_wrap.empty();
						    $review_summary_wrap.hide();
					    }
				    }
					$prod_detail_content_pc.empty();
					loadTemplate('prodDetailPC', $prod_detail_content_pc, async(node) => {
						if(use_lazy_load){
							await setImageWidthHeightBeforeLoad(node);
						}
						return node;
					}).then(() => {
						// 크리마 리뷰 사용 중일 시 위젯 호출
						if(document.querySelector(".crema-product-reviews")){
							if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
								crema.run();
							}
						}
            setTimeout(()=>{
              document.querySelectorAll('#prod_detail table._table_responsive').forEach((table)=>{
                if (table.classList.contains('table')) return;

                table.classList.add('table');
                table.outerHTML = `<div class="table-responsive">${table.outerHTML}</div>`;
              });
            }, 0);
					});
				    if (typeof shop_view_body_width != 'undefined') {
					    $prod_detail_content_pc.css({ 'width': shop_view_body_width + '%' });
				    }

				    $prod_detail_content_pc.toggleClass('product_detail', true);
				    $prod_detail_content_pc.toggleClass('product_review', false);
				    $prod_detail_content_pc.toggleClass('product_qna', false);
				    $prod_detail_content_pc.toggleClass('product_return', false);
				    break;
				}
				case type === SHOP_CONST.TAB_TYPE.DETAIL: {
					if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap.html()){
						    $review_summary_wrap.empty();
						    $review_summary_wrap.hide();
					    }
				    }
				    var pc_detail_html = IMWEB_TEMPLATE.loadSimple("prodDetailPC");
				    $prod_detail_content_pc.html(pc_detail_html);
				    if (typeof shop_view_body_width != 'undefined') {
					    $prod_detail_content_pc.css({ 'width': shop_view_body_width + '%' });
				    }
				    if (use_lazy_load) {
					    runLazyload();
				    }
					// 크리마 리뷰 사용 중일 시 위젯 호출
					if(document.querySelector(".crema-product-reviews")){
						if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
							crema.run();
						}
					}

				    $prod_detail_content_pc.toggleClass('product_detail', true);
				    $prod_detail_content_pc.toggleClass('product_review', false);
				    $prod_detail_content_pc.toggleClass('product_qna', false);
				    $prod_detail_content_pc.toggleClass('product_return', false);
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.REVIEW: {
				    if (!$review_summary_wrap.html()) {
					    getReviewSummary();
				    }
				    $.ajax({
					    type: 'POST',
					    data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page, 'only_photo': only_photo, 'is_mobile' : SHOP_CONST.IS_MOBILE, 'rating' : rating },
					    url: ('/shop/prod_review_pc_html.cm'),
					    dataType: 'html',
					    cache: false,
					    async: false,
					    success: function (result) {

							if ($('._external_widget_review_mo_position')) {
								$('._external_widget_review_mo_position').remove();
							}

							if (tab_type === 'Y') {
							    $('.categorize ._review_wrap').html(result);
						    } else {
                                // 구조 변경 이후 해당 부분 아닌데, 이부분에 코드 추가됨
							    $prod_detail_content_pc.html(result).css({ 'width': '100%' });
						    }
					    }
				    });

				    $prod_detail_content_pc.toggleClass('product_detail', false);
				    $prod_detail_content_pc.toggleClass('product_review', true);
				    $prod_detail_content_pc.toggleClass('product_qna', false);
				    $prod_detail_content_pc.toggleClass('product_return', false);
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.QNA: {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap.html()){
						    $review_summary_wrap.empty();
						    $review_summary_wrap.hide();
					    }
				    }
				    $.ajax({
					    type: 'POST',
					    data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page },
					    url: ('/shop/prod_qna_pc_html.cm'),
					    dataType: 'html',
					    cache: false,
					    async: false,
					    success: function (result) {
						    if (tab_type === 'Y') {
							    $('.categorize ._qna_wrap').html(result);
						    } else {
							    $prod_detail_content_pc.html(result).css({ 'width': '100%' });
						    }
					    }
				    });

				    $prod_detail_content_pc.toggleClass('product_detail', false);
				    $prod_detail_content_pc.toggleClass('product_review', false);
				    $prod_detail_content_pc.toggleClass('product_qna', true);
				    $prod_detail_content_pc.toggleClass('product_return', false);
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.RETURN: {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap.html()){
						    $review_summary_wrap.empty();
						    $review_summary_wrap.hide();
					    }
				    }
				    if (last_refund_data) {
					    const prod_detail_return_html = last_refund_data.use_shop_return ? IMWEB_TEMPLATE.loadSimple("prodReturnPc", last_refund_data) : IMWEB_TEMPLATE.loadSimple("prodReturnDisable", null);
					    if (tab_type === 'Y') {
						    var $_target = $('.categorize ._return_wrap');
					    }else{
						    var $_target = $prod_detail_content_pc;
					    }
					    $_target.empty();
					    $_target.html(prod_detail_return_html).css({ 'width': '100%' });
				    }

				    $prod_detail_content_pc.toggleClass('product_detail', false);
				    $prod_detail_content_pc.toggleClass('product_review', false);
				    $prod_detail_content_pc.toggleClass('product_qna', false);
				    $prod_detail_content_pc.toggleClass('product_return', true);
				    break;
				}
		    }
	    }

	    let margin_top = 0;
	    let prod_tab_target;
	    if(options.shop_view_tab_display !== "Y"){
		    prod_tab_target = document.querySelector('#prod_tab_target');
		    if(options.shop_tab_fixed !== "Y"){
			    margin_top = -1 * getFixedHeaderHeight() + 'px';
		    }else if(review_paging){
			    margin_top = (-1 * document.querySelector('#fixed_tab ._prod_detail_tab_fixed').getBoundingClientRect().height) + 'px';
		    }
	    }else{
		    prod_tab_target = document.querySelector(`#prod_detail_${type}_target`);
		    margin_top = (-1 * document.querySelector('#fixed_tab ._prod_detail_tab_fixed').getBoundingClientRect().height) + 'px';
	    }
	    if(review_paging){
		    prod_tab_target = document.querySelector('.categorize ._prod_detail_review_board_target');
	    }

	    if(review_paging || qna_paging || is_init_detail){
			if(prod_tab_target){
				prod_tab_target.style.top = margin_top;
				prod_tab_target.scrollIntoView();
			}
		    if(is_init_detail){
			    setTabHistory(type);
			    setTimeout(() => {
				    checkSeemore(type);
			    }, 200);
		    }
	    }

    };

    /**
     * 상세정보 탭 변경 처리
     * @param type
     * @param r_p
     * @param q_p
     * @param paging_on 스크롤 조정 //deprecated
     * @param only_photo
     * @param rating
     */
    var changeContentTab = function (type, r_p, q_p, paging_on, only_photo, rating = 0) {
        if (current_content_tab != '') {
            $('.active').parent('li').removeClass('activeborder');
            $prod_detail_content_tab_mobile.find('a').removeClass('active');
        }
        current_content_tab = type;
        $prod_detail_content_tab_mobile.find('a._' + type).addClass('active');
        $('.table-cell > .active').parent('li').addClass('activeborder');

        var $seemore_wrap = $body.find('._seemore_wrap');

	    var review_paging = false;
	    var qna_paging = false;

	    if(parseInt(r_p) > 0){
		    if(review_page != parseInt(r_p) && type == SHOP_CONST.TAB_TYPE.REVIEW){
			    review_paging = true;
		    }
		    review_page = parseInt(r_p);
	    }else{
		    r_p = review_page;
	    }
	    if(parseInt(q_p) > 0){
		    if(qna_page != parseInt(q_p) && type == SHOP_CONST.TAB_TYPE.QNA){
			    qna_paging = true;
		    }
		    qna_page = parseInt(q_p);
	    }else{
		    q_p = qna_page;
	    }

	    if(options.shop_view_tab_display !== "Y" || review_paging || qna_paging){
		    switch (true) {
			    case use_cdn_optimized && (type === SHOP_CONST.TAB_TYPE.DETAIL): {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap_mobile.html()){
						    $review_summary_wrap_mobile.empty();
						    $review_summary_wrap_mobile.hide();
					    }
				    }

					$prod_detail_content_mobile.empty();
					loadTemplate('prodDetailMobile', $prod_detail_content_mobile, async (node) => {
						if (use_lazy_load) {
							await setImageWidthHeightBeforeLoad(node);
						}
						if (node.children.length > 0) {
							if (window.IS_MOBILE && $('#prod_deliv_setting .countryList').length == 1) { // 국가 설정이 복수인 경우는 국가 설정 UI가 그려지면서 loadDelivSetting을 함께 실행
								loadDelivSetting(current_prod_idx, $('#prod_deliv_setting .countryList').val(), $('#deliv_type').val(), $('#deliv_pay_type').val());
							}
						} else {
							$prod_detail_content_mobile.html('<div style="text-align: center; padding: 50px 0;"><div class="body_font_color_40" style="font-size: 18px; margin:30px"><div> </div>');
						}
						return node;
					}).then(() => {
						setMobileVideoRatio();
						// 크리마 리뷰 사용 중일 시 위젯 호출
						if(document.querySelector(".crema-product-reviews")){
							if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
								crema.run();
							}
						}
            setTimeout(()=>{
              document.querySelectorAll('#prod_detail table._table_responsive').forEach((table)=>{
                if (table.classList.contains('table')) return;

                table.classList.add('table');
                table.outerHTML = `<div class="table-responsive">${table.outerHTML}</div>`;
              });
            }, 0);
					});

				    $prod_detail_content_mobile.toggleClass('product_detail_mobile', true);
				    $prod_detail_content_mobile.toggleClass('product_review_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_qna_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_return_mobile', false);
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.DETAIL: {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap_mobile.html()){
						    $review_summary_wrap_mobile.empty();
						    $review_summary_wrap_mobile.hide();
					    }
				    }

				    var mobile_detail_html = IMWEB_TEMPLATE.loadSimple('prodDetailMobile');
				    if (mobile_detail_html) {
					    if (use_lazy_load) {
                            $prod_detail_content_mobile.html(mobile_detail_html);
                            runLazyload();
					    } else {
						    $prod_detail_content_mobile.html(mobile_detail_html);
					    }
					    if (IS_MOBILE && $('#prod_deliv_setting .countryList').length == 1) { // 국가 설정이 복수인 경우는 국가 설정 UI가 그려지면서 loadDelivSetting을 함께 실행
						    loadDelivSetting(current_prod_idx, $('#prod_deliv_setting .countryList').val(), $('#deliv_type').val(), $('#deliv_pay_type').val());
					    }
				    } else {
					    $prod_detail_content_mobile.html('<div style="text-align: center; padding: 50px 0;"><div class="body_font_color_40" style="font-size: 18px; margin:30px"><div> </div>');
				    }
				    setMobileVideoRatio();

					// 크리마 리뷰 사용 중일 시 위젯 호출
				    if(document.querySelector(".crema-product-reviews")){
					    if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
						    crema.run();
					    }
				    }

				    $prod_detail_content_mobile.toggleClass('product_detail_mobile', true);
				    $prod_detail_content_mobile.toggleClass('product_review_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_qna_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_return_mobile', false);
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.REVIEW: {
				    $.ajax({
					    type: review_paging ? 'POST' : 'GET',
					    data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page, 'only_photo': only_photo, 'member_hash': MEMBER_HASH, 'is_mobile' : SHOP_CONST.IS_MOBILE, 'rating' : rating },
					    url: ('/shop/prod_review_mobile_html.cm'),
					    dataType: 'html',
					    async: false,
					    success: function (result) {
						    if ($('._external_widget_review_pc_position')) {
							    $('._external_widget_review_pc_position').remove();
						    }
						    if (!$review_summary_wrap_mobile.html()) {
							    getReviewSummary();
						    }
						    if (tab_type === 'Y') {
							    $('.categorize-mobile ._review_wrap').html(result);
						    }else{
							    $prod_detail_content_mobile.html(result);
						    }

						    $prod_detail_content_mobile.toggleClass('product_detail_mobile', false);
						    $prod_detail_content_mobile.toggleClass('product_review_mobile', true);
						    $prod_detail_content_mobile.toggleClass('product_qna_mobile', false);
						    $prod_detail_content_mobile.toggleClass('product_return_mobile', false);
					    }
				    });
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.QNA: {
				    $.ajax({
					    type: 'POST',
					    data: { 'prod_idx': current_prod_idx, 'review_page': review_page, 'qna_page': qna_page },
					    url: ('/shop/prod_qna_mobile_html.cm'),
					    dataType: 'html',
					    cache: false,
					    async: false,
					    success: function (result) {
						    if (options.shop_view_tab_display !== "Y"){
							    if($review_summary_wrap_mobile.html()){
								    $review_summary_wrap_mobile.empty();
								    $review_summary_wrap_mobile.hide();
							    }
						    }
						    if (tab_type === 'Y') {
							    $('.categorize-mobile ._qna_wrap').html(result);
						    } else {
							    $prod_detail_content_mobile.html(result).css({ 'width': '100%' });
						    }
						    $prod_detail_content_mobile.toggleClass('product_detail_mobile', false);
						    $prod_detail_content_mobile.toggleClass('product_review_mobile', false);
						    $prod_detail_content_mobile.toggleClass('product_qna_mobile', true);
						    $prod_detail_content_mobile.toggleClass('product_return_mobile', false);
					    }
				    });
				    break;
				}
			    case type === SHOP_CONST.TAB_TYPE.RETURN: {
				    if (options.shop_view_tab_display !== "Y"){
					    if($review_summary_wrap_mobile.html()){
						    $review_summary_wrap_mobile.empty();
						    $review_summary_wrap_mobile.hide();
					    }
				    }
				    if (last_refund_data) {
					    const prod_detail_return_html = last_refund_data.use_shop_return ? IMWEB_TEMPLATE.loadSimple("prodReturnMobile", last_refund_data) : IMWEB_TEMPLATE.loadSimple("prodReturnDisable", null);
					    if (tab_type === 'Y') {
						    var $_target = $('.categorize-mobile ._return_wrap');
					    }else{
						    var $_target = $prod_detail_content_mobile;
					    }
					    $_target.empty();
					    $_target.html(prod_detail_return_html).css({ 'width': '100%' });
				    }
				    $prod_detail_content_mobile.toggleClass('product_detail_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_review_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_qna_mobile', false);
				    $prod_detail_content_mobile.toggleClass('product_return_mobile', true);
				    break;
				}
		    }
	    }

		let margin_top = 0;
		let prod_tab_target;
		if(options.shop_view_tab_display !== "Y"){
			prod_tab_target = document.querySelector('#prod_tab_target_mobile');
			if(options.shop_tab_fixed !== "Y"){
				margin_top = -1 * getFixedHeaderHeight() + 'px';
			}else if(review_paging){
				margin_top = (-1 * document.querySelector('#fixed_tab_mobile ._prod_detail_tab_fixed').getBoundingClientRect().height) + 'px';
			}
		}else{
			prod_tab_target = document.querySelector(`#prod_detail_${type}_target_mobile`);
			margin_top = (-1 * document.querySelector('#fixed_tab_mobile ._prod_detail_tab_fixed').getBoundingClientRect().height) + 'px';
		}
	    if(review_paging){
		    prod_tab_target = document.querySelector('.categorize-mobile ._prod_detail_review_board_target');
	    }

		if(review_paging || qna_paging || is_init_detail){
			if(prod_tab_target){
				prod_tab_target.style.top = margin_top;
				prod_tab_target.scrollIntoView();
			}
			if(is_init_detail){
				setTabHistory(type);
				setTimeout(() => {
					checkSeemore(type);
				}, 200);
			}
		}
    };

	var getFixedHeaderHeight = function(){
		let margin_top = 0;
		let $fixed_header_disable;
		if(document.querySelector('#inline_header_fixed')){
			if (!IS_MOBILE) {
				$fixed_header_disable = $('#inline_header_fixed');
			} else {
				$fixed_header_disable = $('#inline_header_mobile').find('._fixed_header_section');
			}
		}else{
			if (!IS_MOBILE) {
				$fixed_header_disable = $('#inline_header_normal').find('._fixed_header_section');
			} else {
				$fixed_header_disable = $('#inline_header_mobile').find('._fixed_header_section');
			}
		}
		for ( var i = 0; i < $fixed_header_disable.length; i++ ) {
			var target = $fixed_header_disable[i].getBoundingClientRect();
			margin_top += target.height;
		}
		return margin_top;
	};

    /**
     * 상세정보 펼쳐보기 버튼 노출 처리
     */
    let checkSeemore = function (type) {
        const $seemore_wrap = $body.find('._seemore_wrap');
        if($seemore_wrap.length === 0) return;

        // 탭 노출 방식이 한 페이지 노출 방식이거나 탭 노출 방식이 아니면서 상세정보 탭일 때만 펼쳐보기 노출
        if(options.shop_view_tab_display == "Y" || (options.shop_view_tab_display == "N" && type == SHOP_CONST.TAB_TYPE.DETAIL)) {
			// template 이 변환되는 시점이 비동기가 되어 당장 사이즈를 알 수가 없다.
            // if((!is_mobile_width && $prod_detail_content_pc.outerHeight() > SHOP_CONST.SEEMORE_HEIGHT.PC) || (is_mobile_width && $prod_detail_content_mobile.outerHeight() > SHOP_CONST.SEEMORE_HEIGHT.MOBILE)) {
                $prod_detail_content_pc.toggleClass('hide_seemore', false);
                $prod_detail_content_mobile.toggleClass('hide_seemore', false);
                $seemore_wrap.show();
				return;
            // }
        }
		$prod_detail_content_pc.toggleClass('hide_seemore', true);
		$prod_detail_content_mobile.toggleClass('hide_seemore', true);
		$seemore_wrap.hide();
    };

    var setTabHistory = function (type) {
        if (!$('body').hasClass('admin')) {
            if (checkUseHistory()) {
                var current_url = location.href.indexOf('#') === -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
                switch (type) {
                    case SHOP_CONST.TAB_TYPE.DETAIL:
                        history.replaceState(null, null, current_url + "#prod_detail_detail");
                        break;
                    case SHOP_CONST.TAB_TYPE.REVIEW:
                        history.replaceState(null, null, current_url + "#prod_detail_review");
                        break;
                    case SHOP_CONST.TAB_TYPE.QNA:
                        history.replaceState(null, null, current_url + "#prod_detail_qna");
                        break;
                    case SHOP_CONST.TAB_TYPE.RETURN:
                        history.replaceState(null, null, current_url + "#prod_detail_return");
                        break;
                    default:
                        let target_tab = options.first_tab === "prod_detail" ? SHOP_CONST.TAB_TYPE.DETAIL : options.first_tab === "prod_review" ? SHOP_CONST.TAB_TYPE.REVIEW : options.first_tab === "prod_qna" ? SHOP_CONST.TAB_TYPE.QNA : options.first_tab === "prod_return" ? SHOP_CONST.TAB_TYPE.RETURN : "";

                        history.replaceState(null, null, current_url + `#prod_detail_${target_tab}`);
                        break;
                }
            } else {
                switch (type) {
                    case SHOP_CONST.TAB_TYPE.DETAIL:
                        location.hash = "prod_detail_detail";
                        break;
                    case SHOP_CONST.TAB_TYPE.REVIEW:
                        location.hash = "prod_detail_review";
                        break;
                    case SHOP_CONST.TAB_TYPE.QNA:
                        location.hash = "prod_detail_qna";
                        break;
                    case SHOP_CONST.TAB_TYPE.RETURN:
                        location.hash = "prod_detail_return";
                        break;
                    default:
                        let target_tab = options.first_tab === "prod_detail" ? SHOP_CONST.TAB_TYPE.DETAIL : options.first_tab === "prod_review" ? SHOP_CONST.TAB_TYPE.REVIEW : options.first_tab === "prod_qna" ? SHOP_CONST.TAB_TYPE.QNA : options.first_tab === "prod_return" ? SHOP_CONST.TAB_TYPE.RETURN : "";

                        location.hash = `prod_detail_${target_tab}`;
                        break;
                }
            }
        }
    };

    var setMobileVideoRatio = function () {
        // 동영상 크기 값이 입력되어 있을 시 모바일에서도 입력된 크기 기준으로 비율 계산해서 반영
        var $fr_video = $prod_detail_content_mobile.find('.fr-video.fr-dvb');
		if ($fr_video.length > 0) {
            $fr_video.each(function (k, v) {
                var $fr_video_iframe = $(v).find('iframe');
                if ($fr_video_iframe.length > 0) {
					var origin_width = $fr_video_iframe[0].style.width;
                    var origin_height = $fr_video_iframe[0].style.height;
					if (origin_width != '' && origin_height != '') {
                        // px 단위일 때만 비율 보정
                        var origin_width_split = origin_width.split('px');
                        var origin_height_split = origin_height.split('px');
						if (origin_width_split.length === 2 && origin_height_split.length === 2) {
                            var video_ratio = (origin_height_split[0] / origin_width_split[0]) * 100;
                            $(v).css('padding-bottom', video_ratio + '%');
                        }
                    }
                }
            });
        }
    };

    var hideAddCartAlarm = function () {
        $add_cart_alarm.hide();
    };

    var moveCart = function () {
        cart_type = $('input[name=add_cart_type]:checked').val();
        if (cart_type == 'regularly') {
            window.location.href = '/shop_cart?type=regularly';
        } else {
            window.location.href = '/shop_cart';
        }
    };

    var changeInput = function () {
        $(document).on('keypress', 'input._requireInputOption', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');
                if ($next.length != 0) {
                    $next.focus().click();
                } else {
                    e.target.blur();
                }
            }
        });
    };

    var changeTab = function (type) {
        $('._detail_detail_wrap').hide();
        $('._detail_review_wrap').hide();
        $('._detail_qna_wrap').hide();
        $('._detail_' + type + '_wrap').show();
    };

    var countryCodeChange = function (country) {
        $.ajax({
            type: 'POST',
            data: { 'country': country },
            url: ('/shop/country_code_change.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg != "SUCCESS") {
                    alert(result.msg);
                }
            }
        });
    };

    var DetailItemMake = function (idx, change_country, deliv_type, deliv_pay_type) {
        var is_design_mode = (location.pathname.indexOf('/admin/design') != -1);
        $deliv_country = change_country;
        $deliv_pay_type = deliv_pay_type;
        $.ajax({
            type: 'GET',
            data: { 'idx': idx, 'change_country': change_country, 'deliv_type': deliv_type, 'deliv_pay_type': deliv_pay_type, '__': MEMBER_HASH },
            url: ('/shop/prod_detail_make.cm'),
            dataType: 'json',
            cache: !is_design_mode,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    $prod_detail.find('._item_detail_wrap').html(result.html);

                    /* 환불 정보 입력 */
                    last_refund_data = result.refund;
                    setDetailReturnHtml();

                    if (typeof naver != typeof void 0 && !!naver.NaverPayButton) {
												try{
													NaverPayButton('naverPayWrap', change_country == 'KR' || change_country == 'none' || change_country == '');
												}catch(e) {

												}
                    }

                    if (typeof kakaoCheckout != 'undefined' && typeof makeTalkPayButton != 'undefined') {
												try{
                          makeTalkPayButton('create-kakao-checkout-button', (change_country == 'KR' || change_country == 'none' || change_country == ''));
												}catch(e) {

												}
                    }
                }
            }
        });
    };
    function setDetailReturnHtml() {
        if (!last_refund_data) return;
        if (options.shop_view_tab_display == 'Y') {
            let prod_detail_return_html = null;
            prod_detail_return_html = last_refund_data.use_shop_return ? IMWEB_TEMPLATE.loadSimple("prodReturnPc", last_refund_data) : IMWEB_TEMPLATE.loadSimple("prodReturnDisable", null);
            $prod_detail_return.html(prod_detail_return_html);
            prod_detail_return_html = last_refund_data.use_shop_return ? IMWEB_TEMPLATE.loadSimple("prodReturnMobile", last_refund_data) : IMWEB_TEMPLATE.loadSimple("prodReturnDisable", null);
            $prod_detail_return_mobile.html(prod_detail_return_html);
        } else {
            if (current_content_tab !== SHOP_CONST.TAB_TYPE.RETURN) return;
            SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.RETURN);
            SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.RETURN);
        }
    }
    /**
     * 모바일 옵션 input클릭시 입력키보드 때문에 css예외처리가 필요하여 클래스 추가.
     */
    var addEventMobileOptionInput = function () {
        $options.find('input.form-control').focus(function () {
            if (!$('body').hasClass('mobile_focus_on')) {
                $('body').addClass('mobile_focus_on');
            }
        });
        $options.find('input').blur(function () {
            if ($('body').hasClass('mobile_focus_on')) {
                $('body').removeClass('mobile_focus_on');
            }
        });
    };

    /**
     * 쇼핑 카테고리 목록에서 상품 상세페이지 레이어팝업 띄우는 함수
	 * @param idx
	 * @param back_url
	 * @param is_prod_detail_page: 상품상세페이지에서 레이어팝업 - 상품 상세 Dialog - 을 띄울 경우 'Y'
	 * @param is_mobile
	 * @param prod_idx_org
     */
    var openProdDetailFromShoppingList = function (idx, back_url, is_prod_detail_page, is_mobile, prod_idx_org) {
        $.ajax({
            type: 'GET',
            data: { 'idx': idx, 'is_prod_detail_page': is_prod_detail_page },
            url: ('/shop/prod_detail_from_shopping_list.cm'),
            dataType: 'html',
            cache: true,
            async: false,
            success: function (result) {
                $.cocoaDialog.open({ type: 'prod_detail_from_shopping_list', custom_popup: result, 'close_block': false });
                const currentUrl = location.href;
                history.replaceState(null, null, currentUrl + '?idx=' + idx);
                $('.modal_prod_detail_from_shopping_list').addClass('custom_tooltip');

                if (is_prod_detail_page == 'Y' && is_mobile) {
                    var $mobile_action_btn_wrap = $('._mobile_action_btn_wrap');
                    $mobile_action_btn_wrap.hide();
                }

				// 모달이 닫힐 때 실행되는 콜백 붙이는 부분
                $('.modal_prod_detail_from_shopping_list').on('hidden.bs.modal', function (e) {
                    $('.modal_prod_detail_from_shopping_list').find('.modal-content').html(''); // close 해도 html 이 남아있어서 스크립트가 재실행이 안 되므로 html 을 삭제시킴
                    $('html').removeClass('mobile-shop-open');
                    history.replaceState(null, null, currentUrl);

                    if (is_prod_detail_page == 'Y') {
                        initDetail({
                            prod_idx: prod_idx_org,
                            prod_price: prod_price_org,
                            require_option_count: require_option_count_org,
							use_image_optimizer_on_product_detail_markup: use_lazy_load_org,
                            shop_use_full_load: use_lazy_load_org,
                            shop_view_tab_display: tab_type_org,
                            is_site_page: is_site_page_org,
                            prod_type: prod_type_org,
                            is_prod_detail_page: false,
                            is_price_view_permission: is_view_price,
                            cm_style: options.cm_style,
                            section_code: section_code
                        });

                        if (is_mobile) $mobile_action_btn_wrap.show();
                    }
                });

                if (checkUseHistory()) { // 뒤로가기 누를 경우 모달만 꺼지고 현재 페이지에 남아있도록
                    history.pushState(null, null, location.href);
                    window.onpopstate = function () {
                        if ($('.modal_prod_detail_from_shopping_list').hasClass('in')) {
                            $.cocoaDialog.close();
                        }
                    };
                }

				// 최근 본 상품, refresh
				if (window.RECENT_PRODUCT && typeof window.RECENT_PRODUCT.refresh === 'function') {
					window.RECENT_PRODUCT.refresh();
				}
            }
        });
    };
    var getReviewCountFromShoppingList = function (prod_code_list) {
        $.ajax({
            type: 'POST',
            data: { 'prod_code_list': prod_code_list },
            url: ('/shop/get_review_count_from_shopping_list.cm'),
            dataType: 'json',
            cache: false,
            async: true,
            success: function (res) {
                // $('"#' +  + '"').find("._review_count_text").text(res.review_count);
                // $(prod_code).find("._wish_count_text").text(res.wish_count);
            }
        });
    };

    /**
     * review, qna 권한이 buyer일때 체크 모달
     * @param prod_code
     * @param type
     */
    var openBuyerReview = function (prod_code) {
        $.ajax({
            type: 'POST',
            data: { 'prod_code': prod_code },
            url: ('/shop/open_buyer_review.cm'),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    $.cocoaDialog.open({
                        type: 'eduModal', custom_popup: result.html, width: 800, hide_event: function () {
                        }
                    });
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    var deleteReviewImage = function (obj) {
        var box_obj = obj.parent().parent();
        obj.parent().remove();
        if (box_obj.find('.file-add').length == 0) box_obj.hide();
    };

    /**
     * 상품상세 페이지에 뿌려지는 review, qna 의 카운트 가져오기.
     * @param prod_code
     */
    var getReviewQnaCount = function (prod_code) {
        $.ajax({
            type: 'POST',
            data: { 'prod_code': prod_code },
            url: ('/shop/get_review_qna_count.cm'),
            dataType: 'json',
            cache: false,
            async: true,
            success: function (res) {
                setReviewQnaCountText($("._review_count_text"), res.review_count);
                setReviewQnaCountText($("._qna_count_text"), res.qna_count);
            }
        });
    };

    var setReviewQnaCountText = function ($target, count) {
        $target.text(count);
    };

    var getCurrentProdNo = function () {
        return current_prod_idx;
    };

    var saveSelectedProd = function () {
        if (typeof window.sessionStorage === "undefined") {
            return false;
        }

        // 초기화
        var session_storage_keys = Object.keys(sessionStorage);
        session_storage_keys.forEach(function (_key) {
            if (_key.indexOf('PROD_SELECTED_OPTION_') !== -1) {
                sessionStorage.removeItem(_key);
            }
        });

        // 마지막으로 본 것만 남도록 추가
        sessionStorage.setItem("LAST_SELECTED_PROD", current_prod_idx);
        sessionStorage.setItem(("PROD_SELECTED_OPTION_" + current_prod_idx), JSON.stringify({
            'prodIdx': current_prod_idx,
            'optDataList': selected_options,
            'orderCount': order_count
        }));
    };

    /**
     * 로그인 이전에 선택한 옵션이 세션에 저장되어 있을 경우 로그인 후 해당 옵션을 다시 설정해줌
     * @param is_set
     * @returns {boolean}
     */
    var setSelectedProd = function (is_set) {
        if (typeof window.sessionStorage === "undefined") {
            return false;
        }

        var selected_data = JSON.parse(sessionStorage.getItem("PROD_SELECTED_OPTION_" + current_prod_idx));
        var last_prod_idx = sessionStorage.getItem("LAST_SELECTED_PROD");

        // 초기화
        var session_storage_keys = Object.keys(sessionStorage);
        session_storage_keys.forEach(function (_key) {
            if (_key.indexOf('PROD_SELECTED_OPTION_') !== -1) {
                sessionStorage.removeItem(_key);
            }
        });

        // 마지막으로 본 상품이랑 일치하지 않는경우 리셋하고 끝
        if (last_prod_idx != current_prod_idx) return false;
        if (typeof selected_data == "undefined") return false;
        if (selected_data == null) return false;
        if (Object.keys(selected_data).length <= 0) return false;
        if (!is_set) return false;

        for (var _key in selected_data) {
            switch (_key) {
                case "optDataList":
                    selected_options = selected_data[_key];
                    break;
                case "orderCount":
                    order_count = selected_data[_key];
                    break;
            }
        }
        updateSelectedOptions('prod');
        if (IS_MOBILE) {
            showMobileOptions(options.only_regularly ? 'regularly' : 'buy');
        } else {
            showPCOptions('order');
        }
    };

    var openCouponDownload = function () {
        $.ajax({
            type: 'POST',
            data: {},
            url: ('/shop/open_coupon_download.cm'),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    $.cocoaDialog.open({ type: 'site_alert', custom_popup: result.html, width: 800 });
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    var setReviewCarousel = function () {
        var checkWidth = $(window).width();
        var owl = $('._review_modal_body .owl-carousel');
        if (checkWidth > 768) {
            owl.owlCarousel({
                'loop': owl.children().length > 1,
                'margin': 0,
                'nav': false,
                'items': 1
            });
        }
    };

    var setReviewClass = function (idx) {
        if (idx <= 0) {
            $body.toggleClass('no-images', true);
            $body.find('.modal_prod_detail.review .modal-content').toggleClass('clearfix', true);
        } else {
            $body.toggleClass('no-images', false);
            $body.find('.modal_prod_detail.review .modal-content').toggleClass('clearfix', false);
        }
    };

    var setReviewBtnAnimation = function () {
        var $btn_nav = $body.find('._btn_nav');
        setTimeout(function () {
            $btn_nav.attr('aria-hidden', true);
        }, 3000);
        $body.find('.modal-left').off('touchstart').on('touchstart', function () {
            $btn_nav.attr('aria-hidden', false);
            setTimeout(function () {
                $btn_nav.attr('aria-hidden', true);
            }, 3000);
        });
    };

    var setReviewSwipe = function (prev_idx, next_idx) {
        $body.find('._review_modal_body').swipe({
            swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                if (direction == 'left') {
                    if (next_idx > 0) {
                        $('body').find('._btn_nav_wrap').remove();
                        changeReviewDetail(next_idx);
                    }
                } else if (direction == 'right') {
                    if (prev_idx > 0) {
                        $('body').find('._btn_nav_wrap').remove();
                        changeReviewDetail(prev_idx);
                    }
                }
            },
            threshold: 0,
            allowPageScroll: 'vertical',
            excludedElements: 'button, a, textarea, input'
        });
    };

    var dispatchSeeMoreEvent = function (expanded) {
        try {
            document.dispatchEvent(new CustomEvent('imweb:prod_detail:seemore', {
                detail: {
                    expanded: expanded
                }
            }));
        } catch (e) {
            // CustomEvent 미지원 환경 대비
        }
    };

    var showSeeMoreButton = function () {
        $prod_detail_content_pc.toggleClass('active', true);
        $prod_detail_content_mobile.toggleClass('active', true);
        dispatchSeeMoreEvent(true);
    };
    var hideSeeMoreButton = function () {
        $prod_detail_content_pc.toggleClass('active', false);
        $prod_detail_content_mobile.toggleClass('active', false);
        dispatchSeeMoreEvent(false);
    };

    var openRequireSelect = function (option_code) {
        var $form_select = $('._form_select_wrap_' + option_code);
        var $goods_wrap = $body.find('#goods_wrap');
        $form_select.addClass('open');
        if ($('body').hasClass('mobile_focus_on')) {
            $('body').removeClass('mobile_focus_on');
        }
        var top = Math.floor($form_select.offset().top); // 셀렉트 박스의 위치
        var scroll_top = Math.floor($goods_wrap.scrollTop()); // 컨테이너의 스크롤 top 위치
        var position_top = $('#option_' + option_code).position().top;
        var height = Math.floor($('.opt-group').height()); // 스크롤 영역의 높이
        var default_value = 180;

        $form_select.parent('._form_parent').nextAll().toggleClass('disabled', true);
        if (top - height >= default_value) {
            $goods_wrap.animate({ scrollTop: position_top - 50 }, 0);
            if (scroll_top >= default_value) {
                $goods_wrap.animate({ scrollTop: position_top + $('.option_box_wrap').outerHeight() }, 0);
            }
        }
    };

    var addRegularlyCart = function () {
        addCart(function () {
            $add_cart_alarm.show();
        });
    };

	var toggleWishButtons = function($wishButtons, wishCount, showWishCount, isActive) {
		const handleRoot = ($root) => {
			if (isActive) {
				$root.addClass('active');
			} else {
				$root.removeClass('active');
			}
		}

		const handleIcon = ($root) => {
			const $icon = $($root).find('._wish_button_icon');

			if (isActive) {
				$icon.removeClass('im-ico-like');
				$root.addClass('active');
				$icon.addClass('im-ico-liked');
			} else {
				$icon.removeClass('im-ico-liked');
				$root.removeClass('active');
				$icon.addClass('im-ico-like');
			}
		}

		const handleText = ($root) => {
			const $label = $($root).find('._wish_button_count_label');

			if (showWishCount) {
				$label.text(wishCount);
			} else {
				$label.text('');
			}
		}

		$wishButtons.each(($idx, root) => {
			const $root = $(root);

			handleRoot($root);
			handleIcon($root);
			handleText($root);
		});
	}


	/**
	 * 
	 * @returns {Promise}
	 * 사은품 선택 다이얼로그를 띄우고, 사은품 선택이 완료되면 resolve 를 호출한다. 이때 유저가 선택한 사은품을 획득한다.
	 */
	async function selectFreebieAsync () {
		cart_type = document.querySelector('#prod_period input[name=add_cart_type]:checked')?.value || 'normal';
		if (cart_type === 'regularly' || !checkRequireOption()) {
			// 정기결제 상품은 사은품 선택을 하지 않는다.
			return Promise.resolve([]);
		}

		// selected_options
		const items = [
			...(selected_options.filter(optionSelected => optionSelected.require).length === 0  
			// 옵션이 없거나, 필수 옵션이 없으면 본품을 추가한다.
				? [{
						prodIdx: current_prod_idx,
						// prod code는 브라우저에서 채워넣는다.
						prodCode: null,
						optionDetailCode: "",
						prodOptions: [],
						qty: order_count,
					}] 
				: []),
			...(selected_options.map((option) => {
				return {
					prodIdx: current_prod_idx,
					prodCode: null,
					qty: option.count,
					optionDetailCode: option.option_mix_type === "SINGLE" ? undefined : option.option_detail_code,
					prodOptions: option.options.filter(option => option.value_type === 'SELECT').map((option) => {
						return {
							optionCode: option.option_code,
							valueCode: option.value_code,
						}
					}),
				}
			}))
		];

		// selected_prod_additionals
		// selected_prod_additional_options
		const item_additional = selected_prod_additionals.flatMap((additional) => {
			const additionalOptions = selected_prod_additional_options
				.filter(option => option.prod_idx === additional.idx);

			if (additionalOptions.length === 0) {
				return [{
					prodIdx: additional.idx,
					prodCode: null,
					optionDetailCode: '',
					prodOptions: [],
					qty: additional.count,
				}]
			}
			return additionalOptions.map((option) => {
				return {
					prodIdx: additional.idx,
					prodCode: null,
					optionDetailCode: option.option_detail_code,
					prodOptions: option.options.filter(option => option.value_type === 'SELECT').map((option) => {
						return {
							optionCode: option.option_code,
							valueCode: option.value_code,
						}
					}),
					qty: option.count,
				}
			});
		})

		return new Promise((resolve) => {
			// TODO: 사려고 하는 상품의 정보를 전달해줘야 함.
			document.dispatchEvent(new CustomEvent('@im/fo-prod-detail-freebie:openDialogSelectFreebie', { detail : {
				callback: resolve, 
				orderItems: [...items, ...item_additional],
			} } ))
		})
	}

	/**
	 * 장바구니에 상품이 있는지 체크해서 있으면 장바구니 상품 구매유도 알럿을 띄우고 아니면 바로 주문으로 이동하는 메소드입니다.
	 * type: "guest_login" | "npay" | "talkpay" | "normal"
	 */
	function confirmOrderWithCartItems(type, backurl, params) {
		if (!ensureAddOrderPermission()) {
			return;
		}
		if (!options.is_price_view_permission && 
			window.IS_GUEST && 
			cm_data.use_login_popup === 'Y' && 
			options.is_using_nomember_order_login_after
		) {
			// 구매 권한이 전체가 아닌 상품을 비회원이 구매 하려는 경우 사이트 공통 디자인이 로그인 모달을 사용중이라면 비회원 바로구매 기능이 켜져있는 경우 로그인 모달을 띄워준다.
			// 비회원 바로 구매기능이 켜져있지 않다면, site_ui.cls 의 getAnchor 함수를 통해 로그인이 모달이 필요한 상황에 로그인 모달을 표시할 수 있지만,
			// 비회원 바로 구매기능이 켜져있는 경우에는 로그인 모달을 보여주는 처리를 해주고 있지 않기 때문.
			// site_ui.cls 의 getAnchor 함수에서 해당 로직을 처리하지 않는 이유는 getAnchor 함수는 $params 인자로 받는 도착지 url의 상품 또는 상품 카테고리에 대한 정보를 얻을 수 없기 때문
			window.SITE_MEMBER.openLogin(
				encodeURIComponent(base64Encode(window.location.href)),
				'payment',
				_confirmOrderWithCartItems,
				'N',
				'payment',
			);
		} else {
			_confirmOrderWithCartItems()
		}


		function proceedToOrder () {
			if(typeof params.onMoveOrder === 'function') {
				// params.onMoveOrder 는 talkpay 주문시 전달되는 콜백 함수
				params.onMoveOrder()
			} else if (window.USE_OMS === true) {
				if (type === 'guest_login' || type === 'npay' || type === 'talkpay') {
					OMS_addOrder(type, backurl, params);
				} else {
					// TODO: 사은품 가능 여부 체크 후 선택 UI등 표시
					selectFreebieAsync()
						.then((selected_freebies) => {
							params.selected_freebies = selected_freebies || [];
							OMS_addOrder(type, backurl, params)
						});
				}
			} else {
				addOrder(type, backurl, params);
			}
		}

		async function _confirmOrderWithCartItems () {
			// "regularly" | "normal"
			cart_type = document.querySelector('#prod_period input[name=add_cart_type]:checked')?.value || 'normal';
			params = params || {}; // 기본값 설정

			if (!ensureAddOrderPermission()) {
				return;
			}


			// 장바구니가 비어있는지 체크 api 호출
			const res = await fetch('/shop/check_cart_empty.cm', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: serializeToUrlencoded({
					'prodIdx': current_prod_idx,
					'options': selected_options,
					'orderCount': order_count,
					'deliv_type': $deliv_type,
					'deliv_pay_type': $deliv_pay_type,
					'cart_type': cart_type
				})
			});
			const result = await res.json();

			// 통신이 실패했거나, 장바구니가 비어있거나, 정기결제 상품이거나, 게스트일 경우 바로 주문으로 이동
			if (!res.ok || result.isGuest || result.msg !== 'SUCCESS' || result.cart_count === 0 || cart_type === 'regularly' ) {
				proceedToOrder();
				return;
			}
			// 카트에 상품이 있으며 정기결제 상품이 아닐 경우 장바구니 추가 구매유도 알럿을 띄움
			// 장바구니 추가 구매유도 다이얼로그 띄우기
			$confirm_order_with_cart_alarm.show();
			$confirm_order_with_cart_alarm.off('click').click(function (e) {
				if(this === e.target) {
					$(this).hide()
				}
			})
			$confirm_order_with_cart_alarm.find('#move_to_cart').off('click').click(function () {
				if (typeof params.onMoveCart === 'function') {
					params.onMoveCart();
				} else {
					addCart(function () {
						moveCart();
					});
				}
				$confirm_order_with_cart_alarm.hide();
			});
			$confirm_order_with_cart_alarm.find('#buy_now').off('click').click(function () {
				proceedToOrder();
				$confirm_order_with_cart_alarm.hide()
			});
		}
	}

	function getThumbnailBadgeStyleByPosition({ badgeColor, badgePosition, imageWidth = ''}) {
		const BADGE_POSITION_LEFT_TOP = 'left_top';
		const BADGE_POSITION_BOTTOM = 'bottom';

		const containerWidth = imageWidth;
		if (!containerWidth) return '';

		// 최소/최대 프레임 너비 설정
		const MIN_FRAME_WIDTH = 120;
		const MAX_FRAME_WIDTH = 800;

		// 프레임 너비 기준
		const frameWidth = Math.max(MIN_FRAME_WIDTH, Math.min(MAX_FRAME_WIDTH, containerWidth));

		// 프레임 너비에 따른 비율 계산
		// 기준 frameWidth: 308px
		const leftTopFontRatio = 0.035;   // frameWidth × 0.035 (308px일 때 약 10.78px)
		const leftTopPaddingRatio = 0.015; // frameWidth × 0.015 (308px일 때 약 4.62px)
		const bottomFontRatio = 0.04;     // frameWidth × 0.04 (308px일 때 약 12.32px)
		const bottomPaddingRatio = 0.02;  // frameWidth × 0.02 (308px일 때 약 6.16px)

		// 실제 크기 계산
		let leftTopFontSize = Math.round(frameWidth * leftTopFontRatio * 1000) / 1000;
		let leftTopPadding = Math.round(frameWidth * leftTopPaddingRatio * 1000) / 1000;
		let bottomFontSize = Math.round(frameWidth * bottomFontRatio * 1000) / 1000;
		let bottomPadding = Math.round(frameWidth * bottomPaddingRatio * 1000) / 1000;

		// 최소/최대 값 제한
		leftTopFontSize = Math.max(10, Math.min(13, leftTopFontSize));   // min: 9px / max: 13px
		leftTopPadding = Math.max(3, Math.min(6, leftTopPadding));     // min: 3px / max: 6px
		bottomFontSize = Math.max(12, Math.min(14, bottomFontSize));   // min: 12px / max: 14px
		bottomPadding = Math.max(4, Math.min(8, bottomPadding));       // min: 4px / max: 8px

		// badgeLeftTopGapSize 추가 (기존 로직 보존)
		const badgeLeftTopGapSize = roundTo3(leftTopFontSize * (8 / 28));

		if (badgePosition === BADGE_POSITION_LEFT_TOP) {
			const style = [
				'position: absolute',
				'border-radius: 3px',
				`top: ${badgeLeftTopGapSize}px`,
				`left: ${badgeLeftTopGapSize}px`,
				`padding: ${leftTopPadding}px`,
				'color: #FFF',
				'vertical-align: middle',
				'display: inline-flex',
				'align-items: center',
				'justify-content: center',
				`background-color: ${badgeColor}`,
				'z-index: 10',
				`font-size: ${leftTopFontSize}px;`
			].join('; ');
			return style;
		}

		if (badgePosition === BADGE_POSITION_BOTTOM) {
			const style = [
				'position: absolute',
				'left: 0',
				'bottom: 0',
				'width: 100%',
				`padding: ${bottomPadding}px`,
				'color: #FFF',
				'vertical-align: middle',
				'display: inline-flex',
				'align-items: center',
				'justify-content: center',
				`background-color: ${badgeColor}`,
				'z-index: 10',
				`font-size: ${bottomFontSize}px;`
			].join('; ');
			return style;
		}

		return '';
	}

	function roundTo3(val) {
		return Math.round(val * 1000) / 1000;
	}

    return {
        addProdWish: function (prod_code, back_url) {
            addProdWish(prod_code, back_url);
        },
        /** type (prod/cart) */
        increaseOptionCount: function (optNo, type) {
            increaseOptionCount(optNo, function () {
                updateSelectedOptions(type);
            });
        },
        /** type (prod/cart) */
        decreaseOptionCount: function (optNo, type) {
            decreaseOptionCount(optNo, function () {
                updateSelectedOptions(type);
            });
        },
	      /** type (prod/cart) */
        increaseProdAdditionalOptionCount: function (optNo) {
            increaseProdAdditionalOptionCount(optNo, function () {
                updateSelectedOptions('prod');
            });
        },
        /** type (prod/cart) */
        decreaseProdAdditionalOptionCount: function (optNo) {
            decreaseProdAdditionalOptionCount(optNo, function () {
                updateSelectedOptions('prod');
            });
        },
        changeProdAdditionalOptionCount: function (optNo, toBeCount) {
            changeProdAdditionalOptionCount(optNo, toBeCount, function () {
                updateSelectedOptions('prod');
            });
        },
        // initDetail : function(prodIdx, price, requireOptionCnt, use_np_mobile, use_lazyload, tab_type,is_site_page, prod_type, is_prod_detail_page, view_price, cm_data, section_code){
        // 	initDetail(prodIdx, price, requireOptionCnt, use_np_mobile, use_lazyload, tab_type,is_site_page, prod_type, is_prod_detail_page, view_price, cm_data, section_code);
        // },
        initDetail: function (option) {
            initDetail(option);
        },
        initProdStock: function (stock_use, stock, stock_un_limit) {
            initProdStock(stock_use, stock, stock_un_limit);
        },
        initLocalize: function (code) {
            initLocalize(code);
        },
        selectOption: function (prod_idx, {options, require, count, idx = null}, success, failed) {
            selectOption(
                prod_idx,
                {
                    options: options,
                    require : require,
                    count : count,
                    idx : idx
                },
                function () {
                    success();
                },
                function (msg) {
                    failed(msg);
                }
            );
        },
        removeSelectedOption: function (optNo, type) {
            removeSelectedOption(optNo, function () {
                selected_require_options = [];		// 선택된 필수 옵션 초기화
                loadOption(type, current_prod_idx);		// 옵션을 다시 로드함
                updateSelectedOptions(type);
            });
        },
	      removeSelectedProdAdditional: function (prodIdx, type) {
		      removeSelectedProdAdditional(prodIdx, function () {
                loadProdAdditional(current_prod_idx);		// 옵션을 다시 로드함
	              updateSelectedOptions(type);
            });
        },
	      removeSelectedProdAdditionalOption: function (optNo, type) {
		      removeSelectedProdAdditionalOption(optNo, function () {
                loadProdAdditional(current_prod_idx);		// 옵션을 다시 로드함
	              updateSelectedOptions(type);
            });
        },
        selectRequireOption: function (type, prod_idx, option_code, value_code, value_name, success) {
            selectRequireOption(type, prod_idx, option_code, value_code, value_name, function () {
                success();
            });
        },
	      selectProdAdditionalRequireOption: (prod_idx, option_code, value_code, value_name, success) => {
			      var data = { 'value_type': 'SELECT', 'option_code': option_code, 'value_code': value_code, 'value_name': value_name };
			      var no = findSelectedProdAdditionalRequireOption(option_code);
						/* @TODO selected_require_options 세분화해야 함(아니면 option_code만으로 구분 가능하게 처리하거나 -> length 비교하므로 분리되어야 하는 게 맞음 */
			      if (no == -1) {
				      if (value_code == '') return;
				      /** 처음 선택된 옵션인 경우 새로 추가*/
				      selected_prod_additional_require_options.push(data);
			      } else {
				      if (value_code == '') {
					      /** 옵션 삭제 */
					      selected_prod_additional_require_options.splice(no, (selected_prod_additional_require_options.length - no));
				      } else {
					      selected_prod_additional_require_options[no] = data;
					      /** 이미 선택된 옵션인 경우 기존 값 교체 */
					      if (no < selected_prod_additional_require_options.length - 1) {
						      selected_prod_additional_require_options.splice(no + 1, (selected_prod_additional_require_options.length - (no + 1)));
					      }
				      }
			      }
			      if (selected_prod_additional_require_options.length == prod_additional_require_option_count[prod_idx]) {
				      /** 필수 옵션이 모두 선택되었을 경우*/
				      selectProdAdditionalOption(prod_idx, selected_prod_additional_require_options, true, 1, function () {
								if(is_mobile_width){
									imSheet.close('prod_additional_sheet');
								}
					      current_select_additional_prod_idx = 0;
					      selected_prod_additional_require_options = [];
					      $prod_additional_options.html('');
					      $('#prod_additional_drop_menu_content').text(getLocalizeString('타이틀_추가상품', '', '추가 상품'));  // PC
					      $('#btnProdAdditionalSelect').text(getLocalizeString('타이틀_추가상품', '', '추가 상품'));  // 모바일
					      success();
				      }, function (msg) {
					      alert(msg);
				      });
			      } else {
				      /** 필수옵션 선택이 아직 끝나지 않았을 경우 옵션 재로드 */
				      loadProdAdditionalOptions(prod_idx);
			      }
	      },
		    selectAdditionalProduct: (product_idx, price, name, maximum_purchase_quantity, member_maximum_purchase_quantity, maximum_purchase_quantity_type, optional_limit, optional_limit_type, stock_use, stock, stock_unlimit, option_mix_type, prod_type, period_discount_flag, period_discount_data, period_discout_group_list, membership_discount) => {
					// 수량을 조절할 수 없는 상품(디지털/이용권 상품인데 옵션이 없는 경우)이 이미 추가된 상태에서 다시 선택할 시 얼럿 노출
			    const prod_additional_found = selected_prod_additionals.find(v=>v.idx===product_idx);
			    if(prod_type !== SHOP_CONST.PROD_TYPE.NORMAL && prod_additional_found){
						if(selected_prod_additional_options.filter((option) => option.prod_idx == product_idx).length === 0){
							// 옵션이 있다면 기존에 추가 시에 옵션도 함께 등록되게 됨
							alert(getLocalizeString("설명_이미선택된상품입니다", "", "이미 선택된 상품입니다."));
							return false;
						}
			    }

                let unselected = [];
                Object.keys(prod_additional_require_option_count).map((key) => {
                        if (prod_additional_require_option_count[key] > 0) {
                            if(selected_prod_additional_options.filter((option) => option.prod_idx == key)[0]?.options?.length < prod_additional_require_option_count[key]){
                                unselected.push(key);
                            }
                        }
                    }
                );

                if(unselected.length > 0){
                    Object.keys(unselected).map((key) => {
                        if (prod_additional_require_option_count[key] > 0) {
                            selected_prod_additionals = selected_prod_additionals.filter((prod_additional) => prod_additional.idx != key);
                            selected_prod_additional_options = selected_prod_additional_options.filter((option) => option.prod_idx != key);
                            delete prod_additional_require_option_count[key];
                        }
                    });
                }

					// @TODO 기존 추가 상품 옵션 초기화, 추가 상품 완료가 안되었다면 selected_prod_additionals에서도 빠져야 함
			    selected_prod_additional_require_options = [];
			    if(prod_additional_found) {
				    prod_additional_found.count++;
			    }else{
				    selected_prod_additionals.push({idx: product_idx, price, name, maximum_purchase_quantity, member_maximum_purchase_quantity, maximum_purchase_quantity_type, optional_limit, optional_limit_type, stock_use, stock, stock_unlimit, option_mix_type, prod_type, membership_discount, count: 1});
						setProdAdditionalPeriodDiscountData(product_idx, period_discount_flag, period_discount_data, period_discout_group_list);
			    }
			    current_select_additional_prod_idx = product_idx;
			    if(is_mobile_width){
						// 상품을 선택했을 때 1depth에는 옵션 목록을 띄우고 2depth에는 다음 옵션 시트를 띄움
						// @TODO 1depth 모든 옵션 추가(선택 옵션 포함) > 열리지는 않게 처리하면 될 듯
				    loadOption('prod', current_prod_idx);		// 옵션을 다시 로드함
				    loadProdAdditionalOptions(product_idx);
			    }else{
			    // PC: 메인 옵션은 리로드하지 않음 (리로드시 추가상품 영역이 다시 그려져 인라인 옵션이 사라짐)
				    // PC: 클릭한 추가상품 바로 아래에 옵션을 그리기 위해 임시 컨테이너를 삽입
				    try{
				        var $clicked = $(event && event.currentTarget ? event.currentTarget : null);
				        var $listItem = ($clicked && $clicked.length) ? $clicked.closest('.list-item') : $();
				        if($listItem.length){
				            var $inline = $('<div class="_prod_additional_inline_options"></div>');
				            $listItem.after($inline);
				            $prod_additional_options = $inline;
				        }else{
				            $prod_additional_options = $prod_additional_options_default;
				        }
				    }catch(e){
				        $prod_additional_options = $prod_additional_options_default;
				    }

				    loadProdAdditionalOptions(product_idx);
			    }
		    },
        selectOptionalOption: function (prod_idx, option_code, value_code, value_name, success) {
            selectOption(
                prod_idx,
                {
                    options:[
                        { 
                            'value_type': 'SELECT',
                            'option_code': option_code,
                            'value_code': value_code,
                            'value_name': value_name
                        }
                    ],
                    require: false,
                    count: 1
                },
                function () {
                    success();
                },
                function (msg) {
                    alert(msg);
                }
            );
        },
	      selectProdAdditionalOptionalOption: function (prod_idx, option_code, value_code, value_name, success) {
            selectProdAdditionalOption(prod_idx, [{
                'value_type': 'SELECT',
                'option_code': option_code,
                'value_code': value_code,
                'value_name': value_name
            }], false, 1, function () {
                success();
		            if(is_mobile_width){
			            imSheet.close('prod_additional_sheet');
		            }
            }, function (msg) {
                alert(msg);
            });
        },
        /** type (prod/cart) */
        changeOptionCount: function (optNo, optCount, type) {
            changeOptionCount(optNo, optCount, function () {
                updateSelectedOptions(type);
            });
        },
        "getCurrentProdNo": function () {
            return getCurrentProdNo();
        },
        "saveSelectedProd": function () {
            saveSelectedProd();
        },
        "setSelectedProd": function (is_set) {
            setSelectedProd(is_set);
        },
        addOrder: function (type, backurl, params) {
            addOrder(type, backurl, params);
        },
        addGiftOrder: function (type, backurl, params = {}) {
            // 선물하기 구매 플래그 활성화
			params.is_gift_buy = true;
            this.addOrder(type, backurl, params);
        },
        addCart: function () {
            addCart(function () {
                $add_cart_alarm.show();
            });
        },
        "digitalFileDownload": function (order_no) {
            digitalFileDownload(order_no);
        },
        "handleOmsDigitalDownload": function (e, href) {
            handleOmsDigitalDownload(e, href);
        },
        updateSelectedOptions: function (type) {
            updateSelectedOptions(type);
        },
        checkOptionLength: function (target, limit) {
            checkOptionLength(target, limit);
        },
        getSelectedOption: function () {
            return selected_options;
        },
        changeOrderCount: function (type, count, success, is_alert) {
            return changeOrderCount(type, count, success, is_alert);
        },
		    changeProdAdditionalOrderCount: function (no, type, count, success, is_alert) {
			    return changeProdAdditionalOrderCount(no, type, count, success, is_alert);
		    },
        selectCartType: function (type) {
            return selectCartType(type);
        },
        checkProdStock: function (cnt) {
            return checkProdStock(cnt);
        },
        increaseOrderCount: function (type, success) {
            return increaseOrderCount(type, success);
        },
        decreaseOrderCount: function (type, success) {
            return decreaseOrderCount(type, success);
        },
		    increaseProdAdditionalOrderCount: function (no, type, success) {
			    return increaseProdAdditionalOrderCount(no, type, success);
		    },
		    decreaseProdAdditionalOrderCount: function (no, type, success) {
			    return decreaseProdAdditionalOrderCount(no, type, success);
		    },
        showMobileOptions: function (type) {
            return showMobileOptions(type);
        },
        changeValueChecked: function (type) {
            return changeValueChecked(type);
        },
        showMobileFirstSelect: function () {
            return showMobileFirstSelect();
        },
        hideMobileOptions: function () {
            return hideMobileOptions();
        },
        showPCOptions: function (type, backurl) {
            return showPCOptions(type, backurl, false);
        },
        hidePCOptions: function () {
            return hidePCOptions();
        },
        socialBtnResize: function () {
            return socialBtnResize();
        },
		externalwidgetWrapResize : function(target, pc_position, mo_position) {
			return externalwidgetWrapResize(target, pc_position, mo_position);
		},
        changeContentTab: function (type, r_p, q_p, paging_on, only_photo, rating = 0) {
            return changeContentTab(type, r_p, q_p, paging_on, only_photo, rating);
        },
        deleteReviewInTabDisplay: function (prod_code, only_photo) {
            deleteReviewInTabDisplay(prod_code, only_photo);
        },
        changeContentPCTab: function (type, r_p, q_p, paging_on, only_photo,  rating = 0 , shop_view_body_width) {
            return changeContentPCTab(type, r_p, q_p, paging_on, only_photo, rating, shop_view_body_width);
        },
        removeReviewHash: function () {
            return removeReviewHash();
        },
        removeQnawHash: function () {
            return removeQnawHash();
        },
        getOnlyPhotoReview: function (only_photo_switch, is_mobile, is_one_page, rating) {
            return getOnlyPhotoReview(only_photo_switch, is_mobile, is_one_page, rating);
        },
        getStarRatingReview: function (only_photo_switch, is_mobile, is_one_page, rating) {
            return getStarRatingReview(only_photo_switch, is_mobile, is_one_page, rating);
        },
        getFirstPhotoReview: function (page) {
            return getFirstPhotoReview(page);
        },
        viewPhotoReviewMore: function (is_mobile, is_one_page) {
            return viewPhotoReviewMore(is_mobile, is_one_page);
        },
        getReviewSummary: function (target) {
            return getReviewSummary(target);
        },
        changeReviewDetail: function (idx) {
            return changeReviewDetail(idx);
        },
        viewReviewDetail: function (idx, r_p, only_photo, is_hash) {
            return viewReviewDetail(idx, r_p, only_photo, is_hash);
        },
        "setMembershipSaleData": function (data, is_main_product_membership_discount) {
            setMembershipSaleData(data, is_main_product_membership_discount);
        },
        "setPeriodDiscountData": function (flag, $data2, group_list) {
            setPeriodDiscountData(flag, $data2, group_list);
        },
		    "setProdAdditionalPeriodDiscountData": function (no, flag, $data2, group_list) {
			    setProdAdditionalPeriodDiscountData(no, flag, $data2, group_list);
		    },
        viewQnaDetail: function (idx, q_p, is_hash) {
            return viewQnaDetail(idx, q_p, is_hash);
        },
        changeProdImageRolling: function (no) {
            return changeProdImageRolling(no);
        },
        startProdImageRolling: function (autoWidth) {
            return startProdImageRolling(autoWidth);
        },
        setOrderCount: function (count) {
            order_count = count;
        },
        getOrderCount: function () {
            return order_count;
        },
        addNPayWish: function () {
            return addNPayWish();
        },
        hideAddCartAlarm: function () {
            hideAddCartAlarm();
        },
        moveCart: function () {
            moveCart();
        },
        loadProductDetail: function (code, prod_idx, menu_code, current_url) {
            loadProductDetail(code, prod_idx, menu_code, current_url);
        },
		    loadBookingDetail: function (code, idx, day, endDay, current_url) {
			    loadBookingDetail(code, idx, day, endDay, current_url);
		    },
		    loadCode: function (code) {
			    loadCode(code);
		    },
        loadOption: function (type, prod_idx) {
            return loadOption(type, prod_idx);
        },
        loadDelivSetting: function (prod_idx, change_country, deliv_type, deliv_pay_type) {
            return loadDelivSetting(prod_idx, change_country, deliv_type, deliv_pay_type);
        },
        changeRequireInputOption: function (type, prod_idx, option_code, msg, success) {
            changeRequireInputOption(type, prod_idx, option_code, msg, function () {
                success();
            });
        },
	      changeProdAdditionalRequireInputOption: function (type, prod_idx, option_code, msg, success) {
		        changeProdAdditionalRequireInputOption(type, prod_idx, option_code, msg, function () {
                success();
            });
        },
        changeInput: function () {
            changeInput();
        },
        changeTab: function (type) {
            changeTab(type);
        },
        countryCodeChange: function (country) {
            countryCodeChange(country);
        },
        DetailItemMake: function (idx, change_country, deliv_type, deliv_pay_type) {
            return DetailItemMake(idx, change_country, deliv_type, deliv_pay_type);
        },
        addDelivType: function (type) {
	        $deliv_type = type;
        },
        addDelivPayType: function (type) {
            $deliv_pay_type = type;
        },
        visitFormMake: function () {
            $deliv_visit_wrap.show();
        },
        openProdDetailFromShoppingList: function (idx, back_url, is_prod_detail_page, is_mobile, prod_idx_org) {
            return openProdDetailFromShoppingList(idx, back_url, is_prod_detail_page, is_mobile, prod_idx_org);
        },
        'getReviewQnaCount': function (prod_code) {
            return getReviewQnaCount(prod_code);
        },
        'setReviewQnaCountText': function ($target, count) {
            return setReviewQnaCountText($target, count);
        },
        getReviewCountFromShoppingList: function (prod_code_list) {
            return getReviewCountFromShoppingList(prod_code_list);
        },
        openBuyerReview: function (prod_code) {
            return openBuyerReview(prod_code);
        },
        deleteReviewImage: function (obj) {
            return deleteReviewImage(obj);
        },
        openCouponDownload: function () {
            return openCouponDownload();
        },
        setReviewCarousel: function () {
            return setReviewCarousel();
        },
        setReviewClass: function (idx) {
            return setReviewClass(idx);
        },
        setReviewBtnAnimation: function () {
            return setReviewBtnAnimation();
        },
        setReviewSwipe: function (prev_idx, next_idx) {
            return setReviewSwipe(prev_idx, next_idx);
        },
        showSeeMoreButton: function () {
            return showSeeMoreButton();
        },
        hideSeeMoreButton: function () {
            return hideSeeMoreButton();
        },
        openRequireSelect: function (option_code) {
            return openRequireSelect(option_code);
        },
        addRegularlyCart: function () {
            return addRegularlyCart();
        },
	    toggleWishButtons: function($wishButtons, wishCount, isActive) {
			return toggleWishButtons($wishButtons, wishCount, isActive);
	    },
        // C3 메서드 추가
		OMS_addOrder : function(type, backurl, params){
			selectFreebieAsync()
				.then((selected_freebies) => {
					params.selected_freebies = selected_freebies || [];
					OMS_addOrder(type, backurl, params);
				});
		},
		OMS_showPCOptions : function(type, backurl){
			return showPCOptions(type, backurl, true);
		},
		OMS_addGiftOrder: function (type, backurl, params = {}) {
			params.is_gift_buy = true; // 선물하기 구매 플래그 활성화
			if (type === 'guest_login') {
				OMS_addOrder(type, backurl, params)
				return;
			}

			selectFreebieAsync()
				.then((selected_freebies) => {
					params.selected_freebies = selected_freebies || [];
					OMS_addOrder(type, backurl, params)
				});
		},
		confirmOrderWithCartItems: function (type, backurl, params) {
			// type: "guest_login" | "npay" | "talkpay" | "normal"
				confirmOrderWithCartItems(type, backurl, params);
		},
		hideConfirmOrderWithCartItems: function () {
			if($confirm_order_with_cart_alarm) $confirm_order_with_cart_alarm.hide();
		},
		getThumbnailBadgeStyleByPosition: function ({ badgeColor, badgePosition, imageWidth = ''}){
			return getThumbnailBadgeStyleByPosition({ badgeColor, badgePosition, imageWidth});
		},
		selectFreebieAsync: selectFreebieAsync.bind(this),
    };
}();

var SITE_SHOP_CART = function () {
    var selectedCartItem = [];
    var $cartItemCheckboxList;
    var $cartAllCheckBox;
    var $shop_cart_list;
    var $shop_cart_wish_list;
    var $shop_cart_wish_list_empty;
    var $changeCartItemLayer;
    var $total_price;

    var $cart_list_wrap;
    var $global_select;
    var $cart_result_container;

    var is_cart_changed = false;
    var currentCartCode = '';
    var current_backurl = '';
    var currentChangeCartItemCode = '';
		var $deliv_country = '';
    var add_order_progress_check = false;
    var cart_type = '';

    var initCart = function (cart_code, backurl, is_regularly, is_c3 = false){
        currentCartCode = cart_code;
        current_backurl = backurl;
        $shop_cart_list = $('#shop_cart_list');
        $changeCartItemLayer = $('#shop_cart_change_layer');
        $shop_cart_wish_list = $('#shop_cart_wish_list');
        $shop_cart_wish_list_empty = $('#shop_cart_wish_list_empty');

        $cart_list_wrap = $shop_cart_list.find('._cart_list_wrap');
        $global_select = $shop_cart_list.find('._global_select');
        var cart_type = SHOP_CONST.CART_TYPE_NORMAL;
        if (is_regularly == 'Y') cart_type = SHOP_CONST.CART_TYPE_REGULARLY;
        cartListMake(backurl, cart_type, is_c3);
    };

    /**
     * 선택한 항목의 가격 계산
     */
    var getSelectedPrice = function (is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'item_list': selectedCartItem, 'is_regularly': is_regularly },
            url: ('/shop/get_cart_price.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    setCartPriceHtml(res['price_data']);
										window.document.dispatchEvent(new CustomEvent('@im/fo-prod-detail-freebie:cartChange'));
                } else {
                    if (res.res_code != 1) {
                        alert(res.msg);
                    }
                    is_cart_changed = false;
                }
            }
        });
    };

    var setCartPriceHtml = function (data) {
        $total_price = $cart_list_wrap.find('._cart_main_total_price');
        $cart_result_container = $cart_list_wrap.find('._cart_result_container');
        var $mobile_cart_result_container = $cart_list_wrap.find('._shop_table').find('._cart_result_container');
        var $pc_cart_result_container = $cart_list_wrap.find('._cart_result_table').find('._cart_result_container');

        $cart_list_wrap.find('._cart_count').text(data['count']);
        $cart_result_container.find('._cart_price').html(data['price']);
        $cart_result_container.find('._cart_deliv_price').html(data['deliv_price']);
        $cart_result_container.find('._cart_membership_discount').html(data['sale_price']);
        $cart_result_container.find('._cart_add_point').html(data['add_point']);
        $cart_list_wrap.find('._cart_membership_field').toggle(data['membership_price_exist']);
        $cart_list_wrap.find('._cart_period_field').toggle(data['period_price_exist']);
        $cart_list_wrap.find('._cart_deliv_price_field').toggle(data['count'] !== data['no_deliv_count']);
        $cart_list_wrap.find('._cart_period_discount').html(data['period_price']);
        if (data['membership_price_exist'] === false && data['period_price_exist'] === false && (data['count'] === data['no_deliv_count'])) {
            $cart_list_wrap.find('.im-ico-equals-plain').hide();
            $pc_cart_result_container.find('._cart_price_field').hide();
        } else {
            if (data['only_deliv_price_after']) {
                $cart_list_wrap.find('._cart_deliv_price_field').show();
                $cart_list_wrap.find('.im-ico-equals-plain').show();
                $pc_cart_result_container.find('._cart_price_field').show();
                $mobile_cart_result_container.find('._plus_deliv_price').hide();
            } else {
                $cart_list_wrap.find('.im-ico-equals-plain').show();
                $pc_cart_result_container.find('._cart_price_field').show();
            }
        }

        $total_price.html(data['total_price']);
        $cart_list_wrap.find('._cart_result_table').show();
    };

    /**
     * 상품 위시리스트 추가 처리
     * @param cart_item_list
     */
    var addProdWish = function (cart_item_list, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'type': 'add', 'cart_item_list': cart_item_list, 'is_regularly': is_regularly },
            url: ('/shop/add_prod_wish_cart.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    for (var i = 0; i < cart_item_list.length; i++) {
                        if (typeof FB_PIXEL != 'undefined') FB_PIXEL.AddToWishlist();
                        $shop_cart_list.find("._wish_status_" + cart_item_list[i]).addClass('check');
                    }
                    loadProdWishList();
                } else
                    alert(res.msg);
            }
        });
    };

    /**
     * 위시리스트 가져오기
     * @param prod_code
     */
    var loadProdWishList = function () {
			var is_design_mode = (location.pathname.indexOf('/admin/design') != -1);
        $.ajax({
            type: 'POST',
            data: { 'type': 'cart', 'is_design_mode': is_design_mode ? 'Y' : 'N' },
            url: ('/shop/get_prod_wish_list.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    if (res.count > 0) {
                        $shop_cart_wish_list_empty.hide();
                        $shop_cart_wish_list.show().html(res.html);
                        setTimesale();
                    } else {
                        $shop_cart_wish_list_empty.show();
                        $shop_cart_wish_list.hide();
                    }
		                // 크리마 리뷰 사용 중일 시 위젯 호출
		                if(document.querySelector(".crema-product-reviews-score")){
			                if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
				                crema.run();
			                }
		                }
                } else
                    alert(res.msg);
            }
        });
    };

    /**
     * 위시리스트 제거
     * @param cart_item_list
     */
    var deleteProdWish = function (cart_item_list, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'type': 'delete', 'cart_item_list': cart_item_list, 'is_regularly': is_regularly },
            url: ('/shop/add_prod_wish_cart.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    for (var i = 0; i < cart_item_list.length; i++) {
                        $shop_cart_list.find("._wish_status_" + cart_item_list[i]).removeClass('check');
                    }
                    loadProdWishList();
                } else
                    alert(res.msg);
            }
        });
    };

    /**
     * 위시리스트 제거 (상품코드사용
     * @param prod_code
     */
    var deleteProdWishByProdCode = function (prod_code) {
        $.ajax({
            type: 'POST',
            data: { 'type': 'delete_prodcode', 'prod_code': prod_code },
            url: ('/shop/add_prod_wish_cart.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    if ($('#wish-item-' + prod_code).length > 0) {
                        $('#wish-item-' + prod_code).remove();
                    } else {
                        window.location.reload();
                    }
                } else
                    alert(res.msg);
            }
        });
    };

    /**
     * 특정 카트 아이템 삭제
     */
    var removeCartItem = function (item_codeList, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'item_codeList': item_codeList, 'is_regularly': is_regularly },
            url: ('/shop/remove_cart_item.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof AW_DEL != 'undefined') {
                        for (var i = 0; i < item_codeList.length; i++) {
                            var itme_info = result.delete_cart_info[item_codeList[i]];
                            AW_DEL(itme_info['prod_no'], itme_info['count']);
                        }
                    }
                    if (typeof AM_DEL != 'undefined') {
                        for (var i = 0; i < item_codeList.length; i++) {
                            var itme_info = result.delete_cart_info[item_codeList[i]];
                            AM_DEL(itme_info['prod_no'], itme_info['count']);
                        }
                    }
                    if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.updateChannelProfileAttr('cart');
                    if (is_regularly == 'Y') window.location.href = "/shop_cart?type=regularly";
                    else window.location.href = "/shop_cart";
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    /**
     *  품절된 상품만 삭제
     * @param item_codeList
     * @param is_regularly
     */
    var removeSelectedCartSoldOutItem = function (item_codeList, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'item_codeList': item_codeList, 'is_regularly': is_regularly },
            url: ('/shop/remove_cart_soldout_item.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof AW_DEL != 'undefined') {
                        for (var i = 0; i < item_codeList.length; i++) {
                            var item_info = result.delete_cart_info[item_codeList[i]];
                            if (typeof item_info != 'undefined') AW_DEL(item_info['prod_no'], item_info['count']);
                        }
                    }
                    if (typeof AM_DEL != 'undefined') {
                        for (var i = 0; i < item_codeList.length; i++) {
                            var item_info = result.delete_cart_info[item_codeList[i]];
                            if (typeof item_info != 'undefined') AM_DEL(item_info['prod_no'], item_info['count']);
                        }
                    }
                    if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.updateChannelProfileAttr('cart');
                    if (is_regularly == 'Y') window.location.href = "/shop_cart?type=regularly";
                    else window.location.href = "/shop_cart";
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    /**
     * 특정 카트 아이템 삭제
     */
    var removeCartItemOption = function (item_code, optionNo, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'item_code': item_code, 'optionNo': optionNo, 'is_regularly': is_regularly },
            url: ('/shop/remove_cart_item_option.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    window.location.reload();
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    /**
     * 체크박스 전체 선택 제어
     * @param bool b
     */
    var toggleAllCheckCartItem = function (b, is_regularly) {
        $cart_list_wrap.find('._cartItemCheckbox').each(function () {
            $(this).prop('checked', (b === true));
        });
        CartItemChanged(is_regularly);
    };

    /**
     * 체크박스 선택 제어
     */
    var toggleCheckCartItem = function (is_regularly) {
        var $cartItemCheckbox = $cart_list_wrap.find('._cartItemCheckbox');
        var $cartItemCheckboxSeleted = $cart_list_wrap.find('._cartItemCheckbox:checked');
        $cart_list_wrap.find('._all_check').prop('checked', ($cartItemCheckbox.length == $cartItemCheckboxSeleted.length));
        CartItemChanged(is_regularly);
    };

    /**
     * 체크박스 변경시 재계산
     */
    var CartItemChanged = function (is_regularly) {
        // 초기화
        selectedCartItem = [];
        $cart_list_wrap.find('._cartItemCheckbox:checked').each(function () {
            selectedCartItem.push($(this).val());
        });
        getSelectedPrice(is_regularly);
    };

    /**
     * 전체 선택인지 아닌지 체크
     */
    var toggleAllSelectCk = function () {
        var $cartItemSelectCount = 0;
        $cartItemCheckboxList = $shop_cart_list.find("input._cartItemCheckbox");
        $cartAllCheckBox = $shop_cart_list.find("input._all_check");
        $cartItemCheckboxList.each(function () {
            if ($(this).is(":checked") === true) {
                $cartItemSelectCount++;
            }
        });
        if ($cartItemCheckboxList.length == $cartItemSelectCount) {
            $cartAllCheckBox.prop('checked', true);
        } else {
            $cartAllCheckBox.prop('checked', false);
        }
    };

    /**
     * 카트 전체 주문하기, C3 분기 추가
     * @param direct true/false (선택유무와 상관없이 바로 주문)
		 * TODO: 실행시 유저가 받을 사은품을 전달받아 페이로드에 담도록 한다.
     */
    var addOrderWithCart = async function (type, item_code, backurl, direct, is_oms, params, is_gift_buy){
			if (is_cart_changed) return false;
			if (add_order_progress_check) return false;
			if (currentCartCode == '') {
				alert(LOCALIZE.설명_장바구니가비어있습니다());
				return false;
			}

			//type 이 guest_login 으로 넘어오는경우 비회원주문+로그인페이지로이동후주문 방식임 type 을 normal 로처리해야 다른 로직에 영향이 없어 이렇게 처리함
			var is_guest_login = false;
			if (type == 'guest_login') {
				is_guest_login = true;
				type = 'normal';
			}

			var item_code_list = [];
			if (item_code == '')
				item_code_list = selectedCartItem;
			else
				item_code_list = [item_code];

			if (item_code_list.length <= 0) {
				alert(LOCALIZE.설명_주문하실상품을선택해주세요());
				return false;
			}

			add_order_progress_check = true;

			if(is_oms){
				if (localStorage.getItem("selectedDeliveryCountry") === "undefined") {
					localStorage.removeItem("selectedDeliveryCountry");
				}
				if (typeof $deliv_country !== 'undefined') {
					localStorage.setItem("selectedDeliveryCountry", $deliv_country);
				}
			}

			const [orderBtn, orderRegularlyBtn, orderGiftBtn] = [$('._btn_order'), $('._btn_order_regularly'), $('._btn_order_gift')];
			const [orderBtnText, orderRegularlyBtnText, orderGiftBtnText] = [orderBtn.first().text(), orderRegularlyBtn.first().text(), orderGiftBtn.first().text()];

			const setSpinner = function ($buttons) {
				const spinner = '<div class="loading-spinner-container"><div class="loading-spinner"></div></div>';

				if (Array.isArray($buttons)) {
					for (const $button of $buttons) {
						if ($button.length > 0) {
							$button.html(spinner);
						}
					}
				} else {
					if ($buttons.length > 0) {
						$buttons.html(spinner);
					}
				}
			}

			const unsetSpinner = function ($btn, text) {
				if ($btn.length > 0) {
					$btn.text(text);
				}
			}

			// 간편결제 버튼은 PG사 정책 우려로 인해 스피너 적용하지 않음
			if (type !== 'npay' && type !== 'talkpay') {
				// 주문하기, 정기구독 버튼에 로딩 스피너 추가
				setSpinner([orderBtn, orderRegularlyBtn, orderGiftBtn]);
			}

			const { freebiesUserSelected, selectedAllFreebiesRequired } = await new Promise((resolve) => {
				// OMS 주문이 아니거나 정기구독인 경우 사은품 선택 없이 바로 진행
				if (!is_oms || type === 'regularly') {
					resolve({ freebiesUserSelected: [], selectedAllFreebiesRequired: true });
					return;
				}

				// 네이버페이, 톡체크아웃인 경우 안내 후 사은품 없이 진행
				if (type === 'npay' || type === 'talkpay') {
					resolve({ freebiesUserSelected: [], selectedAllFreebiesRequired: true });
					return;
				}

				// 일반 OMS 주문인 경우 사은품 선택 이벤트 발송
				window.document.dispatchEvent(new CustomEvent('@im/fo-prod-detail-freebie:freebiesUserSelectedOnCart' + (window.IS_MOBILE ? 'Mobile' : ''), {
					detail: {
						// (args: { freebiesUserSelected: Freebie[]; selectedAllFreebiesRequired: boolean }) => void
						resolveCallback: resolve
					}
				}))
				// INFO: 사은품 선택이 이미 완료 혹은 미완료인 상태로 위의 콜백이 호출되므로 즉시 resolve가 이루어지도록 설계됨. 500ms 후에도 resolve가 호출되지 않으면
				// 사은품 선택이 실패한 것으로 간주하고 주문 버튼 리셋
				setTimeout(() => {
					unsetSpinner(orderBtn, orderBtnText);
					add_order_progress_check = false;
				}, 500)
			})

			if (!selectedAllFreebiesRequired) {
				// 일반 주문에서만 사은품 관련 처리 - 정기구독에서의 사은품은 스팩아웃
				unsetSpinner(orderBtn, orderBtnText);
				alert('아직 사은품을 선택하지 않았습니다. 사은품을 선택해주세요.');
				add_order_progress_check = false;
				return false;
			}

			const url = is_oms ? '/shop/oms/OMS_add_order_cart.cm' : "/shop/add_order_cart.cm";
			const headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			const body = serializeToUrlencoded({
				'type': type,
				'cart_code': currentCartCode,
				'item_code_list': item_code_list,
				'backurl': backurl,
				'direct': (direct ? 'Y' : 'N'),
				'is_gift_buy': is_gift_buy,
				freebie_list: (type !== 'npay' && type !== 'talkpay') ? freebiesUserSelected : undefined,
				ace_pid: is_oms ?  (window._AcePID || window._AceMID) : undefined,
				'infoUrl': is_oms ? location.origin : undefined,
			})

			try {
				const response = await fetch(url, { method: 'POST', headers, body });
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const result = await response.json();
				add_order_progress_check = false;

				if (result.msg == 'SUCCESS') {
                    if (typeof Sentry !== 'undefined') {
                        Sentry.captureMessage('DEBUG: 주문서 생성', {
                            level: 'info',
                            tags: {
                                order_no: result?.c3_result?.orderNo || null,
                            },
                            extra: {                                
                                entry: 'cart',
                                ic_event_id: result.ic_event_id,
                                fb_external_id: result.fb_external_id,
                                total_price: result.total_price,
                                currency: result.currency,
                                type: type,
                                has_pixel: typeof FB_PIXEL !== 'undefined'
                            }
                        });
                    }

					switch (type) {
						case 'npay': {
							if (result.npay_url == '') {
								if (result.errmsg) {
									alert(escape_javascript(result.errmsg));
								} else {
									alert(LOCALIZE.설명_네이버페이상품구매실패(escape_javascript(result.errmsg)));
								}
							} else {
								if (!!result.shopping_additional_price_msg) {
									alert(result.shopping_additional_price_msg);
								}
								if (result.advanced_kakao_trace_data != null) {
									$('body').append(result.advanced_kakao_trace_data);
								}
								if (result.auth_type == 2) {
										// 성인 인증이 필요할 경우
										window.location.href = '/?mode=adult_auth_npay&data=' + result.data;
								} else {
									// 성인 인증이 필요하지 않는 경우
									// 네이버 페이 구매시 전환추적 추가
									var npay_order_info = result['npay_order_info'];
									if (typeof FB_PIXEL != 'undefined') {
										FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
										if (result.fb_npay_switch === 'Y') FB_PIXEL.addNpayOrder(npay_order_info);
									}
									if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder();
									if (result.google_analytics_type == 'G' && result.is_ga_api_secret === false) {
										if (typeof GOOGLE_ANAUYTICS != 'undefined') GOOGLE_ANAUYTICS.addNpayOrder(npay_order_info);
									}
									if (typeof GOOGLE_ADWORDS_TRACE != 'undefined' && result.google_ads_include_npay === 'Y') GOOGLE_ADWORDS_TRACE.addNpayOrder(npay_order_info);
									if (typeof CRITEO != 'undefined') CRITEO.npayTrackTransaction(npay_order_info);
									if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                                    if (typeof TIKTOK_PIXEL != 'undefined') {
                                        TIKTOK_PIXEL.track('InitiateCheckout', {
                                            event_id: result.order_code,
                                            contents: result.prod_list.map(prod => ({
                                                content_id: prod.id,
                                                content_name: prod.name,
                                                price: prod.price,
                                            })),
                                            content_type: 'product',
                                            value: result.total_price,
                                            currency: result.currency,
                                        });
                                    }


									window.location.href = result.npay_url;
								}
							}
							break;
						}
						case 'talkpay': {
							switch (params.type) {
								case 'onOrder':
									if (result.msg == 'SUCCESS') {
										if (result.order_sheet_id) {
											params.onSuccess(result.order_sheet_id);
										} else {
											params.onFailure({ message: result.msg });
										}
									} else {
										params.onFailure({ message: result.msg });
									}
									break;
								case 'onPayOrder':
									if (result.msg == 'SUCCESS') {
											if (typeof FB_PIXEL != 'undefined') FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
											if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder();
										if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                                        if (typeof TIKTOK_PIXEL != 'undefined') {
                                            TIKTOK_PIXEL.track('InitiateCheckout', {
                                                event_id: result.order_code,
                                                contents: result.prod_list.map(prod => ({
                                                    content_id: prod.id,
                                                    content_name: prod.name,
                                                    price: prod.price,
                                                })),
                                                content_type: 'product',
                                                value: result.total_price,
                                                currency: result.currency,
                                            });
                                        }

										var shop_payment_url = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code) + '&order_no=' + encodeURIComponent(result.order_no);										
										if (result.member_code) {
											shop_payment_url += "&order_member=" + encodeURIComponent(result.member_code);
										}
										if ( result.kakaopay_only === 'Y' ) {
											shop_payment_url += "&kakaopay_only=Y";
										}
										window.location.href = shop_payment_url;
									}
									break;
							};
							break;
						}
						default: {
							if (typeof FB_PIXEL != 'undefined') FB_PIXEL.InitiateCheckout(result.ic_event_id, result.total_price, result.currency, result.fb_external_id);
							if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.AddOrder();
							if (typeof NP_NDA != 'undefined') NP_NDA.BeginCheckout(result.prod_code_list);

                            if (typeof TIKTOK_PIXEL != 'undefined') {
                                TIKTOK_PIXEL.track('InitiateCheckout', {
                                    event_id: result.order_code,
                                    contents: result.prod_list.map(prod => ({
                                        content_id: prod.id,
                                        content_name: prod.name,
                                        price: prod.price,
                                    })),
                                    content_type: 'product',
                                    value: result.total_price,
                                    currency: result.currency,
                                });
                            }

							if (is_guest_login) {	//비회원주문시 로그인 페이지로 이동처리
								window.location.href = '/login?shopping_order_code=' + result.order_code + '&back_url=' + encodeURIComponent(result.back_url_base64);
							}
							else {	//일반주문인경우 결제화면으로 이동
								if (is_oms) {
									if (typeof result.c3_result === "undefined" || typeof result.c3_result.orderCode === "undefined" || typeof result.c3_result.orderNo === "undefined") return
									var shop_payment_url = "/shop_payment/?order_code=" + encodeURIComponent(result.c3_result.orderCode) + "&order_no=" + encodeURIComponent(result.c3_result.orderNo);

									if (result.c3_result.memberCode) {
										shop_payment_url += "&order_member=" + encodeURIComponent(result.c3_result.memberCode);
									}
									window.location.href = shop_payment_url;
								} else {
									window.location.href = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code);
								}
							}
						}
					}
				} else {
					// 주문하기 버튼에 로딩 스피너 제거
					unsetSpinner(orderBtn, orderBtnText);
					// 정기구독 버튼에 로딩 스피너 제거
					unsetSpinner(orderRegularlyBtn, orderRegularlyBtnText);
					// 선물하기 버튼에 로딩 스피너 제거
					unsetSpinner(orderGiftBtn, orderGiftBtnText);

					if (type == 'talkpay') {
						switch (params.type) {
							case 'onOrder': {
								params.onFailure({ message: result.msg });
								break;
							}
							case 'onPayOrder': {
								alert(result.msg);
								break;
							}
						}
					} else {
						if(result.code === 2){
							$('._deliv_country_selector').toggleClass('warning_select');
						}
						// 코드 7: 비회원 이용권 구매 시 로그인 페이지로
						if (result.code === 7) {
							redirectToLoginPage();
						} else {
							alert(result.msg.replace(/\\n/g, '\n'));
							// 코드 11: 기존 로직 유지
							if (is_guest_login && result.code === 11) {
								var back_url_base64 = window.location.pathname;
								var url_param = document.location.href.split("?");
								if (url_param.length > 1) {
									back_url_base64 += "?" + url_param[1];
								}
								window.location.href = '/login?back_url=' + encodeURIComponent(btoa(back_url_base64));
							}
						}
					}
				}

			} catch (e) {
				add_order_progress_check = false;
				// 주문하기 버튼에 로딩 스피너 제거
				unsetSpinner(orderBtn, orderBtnText);
				// 정기구독 버튼에 로딩 스피너 제거
				unsetSpinner(orderRegularlyBtn, orderRegularlyBtnText);
				// 선물하기 버튼에 로딩 스피너 제거
				unsetSpinner(orderGiftBtn, orderGiftBtnText);
			}
    };

    var addOrderRegularly = function (backurl, params, is_c3 = false){
        addOrderWithCart('regularly', '', backurl, false, is_c3, params);
    };

    /**
     * 카트 전체 네이버찜등록
     */
    var addNPayWishWithCart = function (item_code) {
        if (currentCartCode == '') {
            alert(LOCALIZE.설명_장바구니가비어있습니다());
            return false;
        }
        $.ajax({
            type: 'POST',
            data: { 'cart_code': currentCartCode, 'item_code': item_code },
            url: ('/shop/add_npay_wish_cart.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (result.npay_url == '')
                        alert(LOCALIZE.설명_네이버페이찜등록실패(escape_javascript(result.errmsg)));
                    else {
                        if (result.mobile == 'Y')
                            window.location.href = result.npay_url;
                        else
                            window.open(result.npay_url);
                    }
                } else {
                    alert(result.msg);
                }
            }
        });
    };
    /**
     * 장바구니 옵션변경 화면 표시
     */
    var showChangeCartItem = function (item_code, is_regularly) {
        $.ajax({
            type: 'POST',
            data: { 'item_code': item_code, 'is_regularly': is_regularly },
            url: ('/shop/change_cart_item_request.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    $changeCartItemLayer.find('div.container-fluid').html(result.html);
                    $changeCartItemLayer.show();

                    SITE_SHOP_DETAIL.initDetail({
                        prod_idx: result.prodIdx,
                        prod_price: result.price,
                        require_option_count: result.require_option_count,
						use_image_optimizer_on_product_detail_markup: false,
                        shop_use_full_load: false,
                    });

                    SITE_SHOP_DETAIL.initProdStock(result.prod_stock.stock_use, result.prod_stock.stock_no_option, result.prod_stock.stock_unlimit);
                    SITE_SHOP_CART.changeCartLoadOption(result.prodIdx);
                    var selected_option_count = result.selected_option_list.length;
                    var cnt = 0;
                    currentChangeCartItemCode = item_code;
                    $.each(result.selected_option_list, function (no, data) {
                        SITE_SHOP_DETAIL.selectOption(
                            result.prodIdx,
                            {
                                options: data.options,
                                require: data.require,
                                count: data.count,
                                idx: data.idx
                            },
                            function () {
                                cnt++;
                                if (cnt >= selected_option_count){
                                    SITE_SHOP_DETAIL.updateSelectedOptions('cart');
                                } 
                            },
                            function () {
                                cnt++;
                                if (cnt >= selected_option_count) {
                                    SITE_SHOP_DETAIL.updateSelectedOptions('cart');
                                }
                            }
                        );
                    });
                    if (result.require_option_count == 0) {
                        SITE_SHOP_CART.changeCartOrderCount("pc", result.count, false);
                        SITE_SHOP_CART.changeCartOrderCount("mobile", result.count, false);
                    }
                } else {
                    alert(result.msg);
                }
            }
        });
    };
    var hideChangeCartItem = function () {
        $changeCartItemLayer.find('div.container-fluid').empty();
        $changeCartItemLayer.hide();
        currentChangeCartItemCode = '';
    };
    /**
     * 장바구니 옵션 변경 완료 처리
     */
    var changeCartItemComplete = function (current_ul, is_c3 = false) {
        var is_regularly = 'N';
        if (cart_type == SHOP_CONST.CART_TYPE_REGULARLY) {
            is_regularly = 'Y';
        }
        if (currentChangeCartItemCode != '') {
            changeCartItemData({
                "mode": "detail",
                "item_code": currentChangeCartItemCode,
                "options": SITE_SHOP_DETAIL.getSelectedOption(),
                "order_count": SITE_SHOP_DETAIL.getOrderCount(),
                "is_regularly": is_regularly,
                "current_ul": current_ul
            }, is_c3);
        }
    };

    var changeCartItemDelivType = function (item_code, deliv_type, is_regularly, is_c3 = false) {
        changeCartItemData({
            "mode": "delivery",
            "item_code": item_code,
            "deliv_type": deliv_type,
            "is_regularly": is_regularly
        }, is_c3);
    };

    var changeCartItemDelivPayType = function (item_code, deliv_pay_type, is_regularly, is_c3 = false) {
        changeCartItemData({
            "mode": "delivery",
            "item_code": item_code,
            "deliv_pay_type": deliv_pay_type,
            "is_regularly": is_regularly
        }, is_c3);
    };

    var changeCartItemData = function (dt, is_c3 = false) {
        if (typeof dt['item_code'] == 'undefined') return false;
        $.ajax({
            type: 'POST',
            data: dt,
			url : is_c3 ? '/shop/oms/OMS_change_cart_item.cm' : '/shop/change_cart_item.cm',
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof AW_INOUT != 'undefined') {
                        AW_INOUT(result.prod_no, result.after_count);
                    }
                    if (typeof AM_INOUT !== 'undefined') {
                        AM_INOUT(result.prod_no, result.after_count);
                    }
                    if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.updateChannelProfileAttr('cart');
                    var cart_type = 'N';
                    if (dt['is_regularly'] == 'Y') {
                        cart_type = SHOP_CONST.CART_TYPE_REGULARLY;
                    }
                    $changeCartItemLayer.hide();
                    cartListMake(dt['current_url'], cart_type, is_c3);
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    var countryCodeChange = function (country) {
			$deliv_country = country;
        $.ajax({
            type: 'POST',
            data: { 'country': country },
            url: ('/shop/country_code_change.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result.msg != "SUCCESS") {
                    alert(result.msg);
                } else {
                    window.location.reload();
                }
            }
        });
    };

    /**
     * 장바구니 목록 생성 -  C3 바로구매 분기 추가
     * @param current_full_url
     * @param type		normal 일반구매, regularly 정기구독
     */
    var cartListMake = function (current_full_url, type, is_c3 = false) {
        selectedCartItem = [];
        $.ajax({
            type: 'POST',
            data: { 'current_full_url': current_full_url, 'type': type },
			url : is_c3 ? '/shop/oms/OMS_get_cart_list_make.cm' : '/shop/get_cart_list_make.cm',
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    $cart_list_wrap.html('');
										const range = document.createRange();
										// <script type="module"> 태그가 .html() 으로 삽입되면 모듈이 로드되지 않으므로, createContextualFragment를 사용하여 HTML을 삽입
										const table_fragment = range.createContextualFragment(res.table_html);
										$cart_list_wrap[0].appendChild(table_fragment);
                    if (res.global_select_html !== '') {
                        $global_select.html(res.global_select_html);
												$deliv_country = $global_select.find('[selected]').val();
                    } else {
                        $global_select.remove();
                    }
                    if (res.cart_item_count > 0) {
                        $('.pay-box').show();
                        $shop_cart_list.removeClass('cart_empty_wrap');
                        fixedShopTableHeader();
                        resizeShopTableHeader();
                    } else {
                        $('.pay-box').hide();
                        $shop_cart_list.addClass('cart_empty_wrap');
                    }
                    cart_type = type;
                    if (type === SHOP_CONST.CART_TYPE_REGULARLY) {
                        currentCartCode = res.cart_code;
                        $shop_cart_list.find('._btn_order').hide();
                        $shop_cart_list.find('._btn_order_gift').hide();
                        $shop_cart_list.find('._btn_order_regularly').css('display', 'flex');
                        $shop_cart_list.find('._social_pay').hide();
                        $('#cart_normal_tab').removeClass('active');
                        $('#cart_regularly_tab').addClass('active');
                    } else {
                        currentCartCode = res.cart_code;
                        $shop_cart_list.find('._btn_order_regularly').hide();
                        $shop_cart_list.find('._btn_order').css('display', 'flex');
                        $shop_cart_list.find('._btn_order_gift').css('display', 'flex');
                        $shop_cart_list.find('._social_pay').show();
                        $('#cart_regularly_tab').removeClass('active');
                        $('#cart_normal_tab').addClass('active');
                    }
                    getSelectedPrice(type === SHOP_CONST.CART_TYPE_REGULARLY);
                } else
                    alert(res.msg);

                is_cart_changed = false;
            },
            error: function () {
                alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
            }
        });
    };

    var fixedShopTableHeader = function () {
        var window_width = window.innerWidth;
        if (window_width < 768) {
            var section_fixed_height = getMobileSectionFixedHeight();
            var $cart_list_thead = $cart_list_wrap.find('._shop_table thead');
            $cart_list_thead.css('top', section_fixed_height + 'px');
        }
    };

    var getMobileSectionFixedHeight = function () {
        /* 기본 top을 0px로 설정 시 1px 가량의 여백이 생겨 뒤가 비쳐보이는 경우가 있어 -1px로 설정 */
        var section_fixed_height = -1;
        var $fixed_header_disable = $('#inline_header_mobile').find('._fixed_header_section');
        for (var i = 0; i < $fixed_header_disable.length; i++) {
            var target = $fixed_header_disable[i].getBoundingClientRect();
            section_fixed_height += target.height;
        }
        var prev_fixed_section = $shop_cart_list.parents('div[doz_type="section"]').prevAll('._fixed_section[doz_mobile_hide="N"]')[0];
        if (typeof prev_fixed_section !== 'undefined') {
            section_fixed_height += prev_fixed_section.getBoundingClientRect().height;
        }
        return section_fixed_height;
    };

    var resizeShopTableHeader = function () {
        var is_resizing = false;
        $(window).resize(function () {
            if (!is_resizing) {
                is_resizing = true;
                setTimeout(function () {
                    fixedShopTableHeader();
                    is_resizing = false;
                }, 100);
            }
        });
    };

    var setTimesale = function () {
        var $doz_timesale_wrap = $shop_cart_wish_list.find('._doz_timesale_wrap');
        if ($doz_timesale_wrap.length > 0) {
            $doz_timesale_wrap.each(function () {
                var $that = $(this);
                var start_time = ($that.find('._doz_timesale').attr('data-start-time') * 1000);
                var $doz_timesale = $that.find('._doz_timesale');
                var timesale_interval = setInterval(function () {
                    var remain_ms = ($doz_timesale.attr('data-end-time') * 1000) - start_time;
                    if (remain_ms > 0) {
                        var remain_d = Math.floor(remain_ms / 86400000);
                        var remain_h = Math.floor((remain_ms % 86400000) / 3600000);
                        var remain_m = Math.floor((remain_ms % 3600000) / 60000);
                        var remain_s = Math.floor((remain_ms % 60000) / 1000);

                        var remain_hh = remain_h < 10 ? '0' + remain_h : '' + remain_h;
                        var remain_mm = remain_m < 10 ? '0' + remain_m : '' + remain_m;
                        var remain_ss = remain_s < 10 ? '0' + remain_s : '' + remain_s;
                        if (remain_d >= 1) {
                            $doz_timesale.text(getLocalizeString('설명_종료까지n1일n2시n3분n4초남음', [remain_d, remain_hh, remain_mm, remain_ss], '종료까지 %1일 %2:%3:%4'));
                        } else {
                            $doz_timesale.text(getLocalizeString('설명_종류까지n1시n2분n3초남음', [remain_hh, remain_mm, remain_ss], '종료까지 %1:%2:%3 남음'));
                        }
                        start_time = start_time + 1000;
                    } else {
                        /* 타임세일 종료 */
                        clearInterval(timesale_interval);
                        $that.remove();
                    }
                }, 1000);
            });
        }
    };

    return {
        initCart: function (cart_code, backurl, is_regularly) {
            initCart(cart_code, backurl, is_regularly);
        },
        loadProdWishList: function () {
            loadProdWishList();
        },
        deleteProdWish: function (cart_item, is_regularly) {
            deleteProdWish([cart_item], is_regularly);
        },
        deleteProdWishByProdCode: function (prod_code) {
            deleteProdWishByProdCode(prod_code);
        },
        addProdWish: function (cart_item, is_regularly) {
            addProdWish([cart_item], is_regularly);
        },
        addProdWishMulti: function (is_regularly) {
            if (selectedCartItem.length == 0) {
                alert(LOCALIZE.설명_선택한항목이없습니다());
                return false;
            }
            addProdWish(selectedCartItem, is_regularly);
        },
        removeCartItemOption: function (item_code, optionNo, is_regularly) {
            removeCartItemOption(item_code, optionNo, is_regularly);
        },
        removeCartItem: function (item_code, is_regularly) {
            removeCartItem([item_code], is_regularly);
        },
        removeSelectedCartItem: function (is_regularly) {
            if (selectedCartItem.length == 0) {
                alert(LOCALIZE.설명_선택한상품이없습니다());
                return false;
            }
            removeCartItem(selectedCartItem, is_regularly);
        },
        removeSelectedCartSoldOutItem: function (is_regularly) {
            if (selectedCartItem.length == 0) {
                alert(LOCALIZE.설명_선택한상품이없습니다());
                return false;
            }
            removeSelectedCartSoldOutItem(selectedCartItem, is_regularly);
        },
        "toggleCheckCartItem": function (is_regularly) {
            toggleCheckCartItem(is_regularly);
        },
        "toggleAllCheckCartItem": function (b, is_regularly) {
            toggleAllCheckCartItem(b, is_regularly);
        },
        addOrderWithCart: function (type, item_code, backurl, params) {
            addOrderWithCart(type, item_code, backurl, false, false, params);
        },
        addOrderWithCartDirect: function (type, item_code, backurl) {
            addOrderWithCart(type, item_code, backurl, true, false);
        },
        addOrderRegularly: function (backurl, params) {
            addOrderRegularly(backurl, params, false);
        },
        showChangeCartItem: function (item_code, is_regularly) {
            showChangeCartItem(item_code, is_regularly);
        },
        hideChangeCartItem: function () {
            hideChangeCartItem();
        },
        changeCartSelectRequireOption: function (prod_idx, option_code, value_code, value_name) {
            SITE_SHOP_DETAIL.selectRequireOption('cart', prod_idx, option_code, value_code, value_name, function () {
                SITE_SHOP_DETAIL.updateSelectedOptions('cart');
            });
        },
        changeCartChangeRequireInputOption: function (prod_idx, option_code, msg) {
            SITE_SHOP_DETAIL.changeRequireInputOption(prod_idx, option_code, msg, function () {
                SITE_SHOP_DETAIL.updateSelectedOptions('cart');
            });
        },
        changeCartSelectOptionalOption: function (prod_idx, option_code, value_code, value_name) {
            SITE_SHOP_DETAIL.selectOptionalOption(prod_idx, option_code, value_code, value_name, function () {
                SITE_SHOP_DETAIL.updateSelectedOptions('cart');
            });
        },
        changeCartItemIncrease: function (optNo, reload) {
            SITE_SHOP_DETAIL.increaseOptionCount(optNo, 'cart');
        },
        changeCartItemDecrease: function (optNo) {
            SITE_SHOP_DETAIL.decreaseOptionCount(optNo, 'cart');
        },
        changeCartIncrease: function (type) {
            var o = $changeCartItemLayer.find('input._order_count_' + type);
            var curCount = o.val();
            if (isNaN(curCount))
                curCount = 1;
            else
                curCount = parseInt(curCount) + 1;

            var res = SITE_SHOP_DETAIL.checkProdStock(curCount);
            if (res === true) {
                o.val(curCount);
                SITE_SHOP_DETAIL.setOrderCount(curCount);
            } else {
                alert(res);
            }

            SITE_SHOP_DETAIL.updateSelectedOptions('cart');
        },
        changeCartDecrease: function (type) {
            var o = $changeCartItemLayer.find('input._order_count_' + type);
            var curCount = o.val();
            if (isNaN(curCount))
                curCount = 1;
            else
                curCount = parseInt(curCount) - 1;
            if (curCount < 1) curCount = 1;

            var res = SITE_SHOP_DETAIL.checkProdStock(curCount);
            if (res === true) {
                o.val(curCount);
                SITE_SHOP_DETAIL.setOrderCount(curCount);
            } else {
                alert(res);
            }

            SITE_SHOP_DETAIL.updateSelectedOptions('cart');
        },
        changeCartOrderCount: function (type, count, is_alert) {
            if (is_alert == void 0) is_alert = true;

            if (isNaN(count))
                count = 1;
            else
                count = parseInt(count);
            if (count < 1) count = 1;

            var res = SITE_SHOP_DETAIL.checkProdStock(count);
            if (res === true) {
                $changeCartItemLayer.find("input._order_count_" + type).val(count);
                SITE_SHOP_DETAIL.setOrderCount(count);
            } else {
                if (is_alert) alert(res);
            }

            SITE_SHOP_DETAIL.updateSelectedOptions('cart');
        },
        changeCartItemRemove: function (optNo) {
            SITE_SHOP_DETAIL.removeSelectedOption(optNo, 'cart');
        },
        changeCartItemCount: function (optNo, optCount) {
            SITE_SHOP_DETAIL.changeOptionCount(optNo, optCount, 'cart');
        },
        "changeCartItemDelivType": function (item_code, deliv_type, is_regularly) {
            changeCartItemDelivType(item_code, deliv_type, is_regularly);
        },
        "changeCartItemDelivPayType": function (item_code, deliv_pay_type, is_regularly) {
            changeCartItemDelivPayType(item_code, deliv_pay_type, is_regularly);
        },
        changeCartItemComplete: function (current_ul) {
            changeCartItemComplete(current_ul);
        },
        addNPayWishWithCart: function (item_code) {
            addNPayWishWithCart(item_code);
        },
        addSelectedCartItem: function (item_code) {
            selectedCartItem.push(item_code);
        },
        changeCartLoadOption: function (prod_idx) {
            SITE_SHOP_DETAIL.loadOption('cart', prod_idx);
        },
        cartListMake: function (current_full_url, type) {
            cartListMake(current_full_url, type);
        },
        countryCodeChange: function (country) {
            countryCodeChange(country);
        },
        toggleAllSelectCk: function () {
            toggleAllSelectCk();
        },
        // C3 에 주문을 생성하는 endpoint를 바라보는 함수
		C3_initCart : function(cart_code, backurl, is_regularly){
			initCart(cart_code, backurl, is_regularly, true);
		},
		OMS_addOrderWithCart : function(type, item_code, backurl, params, is_gift_buy = false){
			addOrderWithCart(type, item_code, backurl, false, true, params, is_gift_buy);
		},
		OMS_addOrderWithCartDirect : function(type, item_code, backurl){
			addOrderWithCart(type, item_code, backurl, true, true);
		},
		C3_cartListMake : function(current_full_url, type){
			cartListMake(current_full_url, type, true);
		},
		C3_changeCartItemComplete : function(current_ul){
			changeCartItemComplete(current_ul, true);
		},
		C3_changeCartItemDelivType: function(item_code, deliv_type,is_regularly){
			changeCartItemDelivType(item_code, deliv_type,is_regularly, true);
		},
		C3_changeCartItemDelivPayType: function(item_code, deliv_pay_type,is_regularly) {
			changeCartItemDelivPayType(item_code, deliv_pay_type,is_regularly, true);
		},
    };
}();

var SITE_SHOP_REVIEW = function () {
    var $review_wrap;
    var $mobile_review_wrap;
    var $mobile_form;
    var $rating;
    var $star;
    var $m_rating;
    var $m_star;
    var $comment_body;
    var $comment_area;
    var review_body;
    var $review_container;
    var $review_form;
    var body_input;
    var placeholderText;
    var isIOS, isSafari, $fr_m_custom, $write_header, m_sticky_container_trigger_top, $toolbarContainer;
    var images = {};
    var add_review_wrap;
    var is_submit = false;

		// 이미지 엑박 여부를 확인하는 함수
		const isImageBroken = (img) => {
			return img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0);
		}

		// 이미지를 다시 로드하는 함수
		const reloadImage = (img, src) => {
			setTimeout(() => {
				img.src = src + "?t=" + new Date().getTime(); // 캐시를 피하기 위해 쿼리 스트링 추가
			}, 1000);
		}

    var init = function (code) {
        $review_wrap = $('._review_wrap');
        $review_form = $('#review_form');
        $rating = $('#rating');
        $star = $('._star');
        $review_form.find('._btn_add_image').toggleClass('no-margin', true);
        review_body = $('#review_modal_body');
        $review_container = $('#review_container');
        body_input = $('#body_input');
        placeholderText = $('#placeholderText').val();
        $review_form.find('#review_image_upload_btn').fileupload({
            url: '/ajax/review_image_upload.cm',
            formData: { temp: 'Y', target: 'site_review', type: 'image' },
            dataType: 'json',
            singleFileUploads: true,
            limitMultiFileUploads: 1,
            start: function (e, data) {
            },
            progress: function (e, data) {
            },
            done: function (e, data) {
                $.each(data.result.files, function (e, tmp) {
                    if (tmp.error == null) {
                        $review_form.find("#review_image_box").show();
                        $review_form.find('._btn_add_image').toggleClass('no-margin', false);
												const url = CDN_OPTIMIZED_URL + tmp.url + '?w=300';
                        images[tmp.code] = tmp.url;
                        const html = '<span class="file-add _img_' + tmp.code + '"><input type="hidden" name="img" value="' + tmp.name + '"><div class="img-thumb-wrap"><img id="review_' + tmp.url + '" src="' + url + '"></div><a class="del" href="javascript:;" onclick="SITE_SHOP_REVIEW.deleteReviewImage(\'' + tmp.code + '\')"><i class="btm bt-times vertical-middle" aria-hidden="true"></i></a></span>';
                        $review_form.find("#review_image_box ._btn_add_image").before(html);

		                    const reviewImage = document.getElementById(`review_${tmp.url}`);
												reviewImage.style.display = 'none';

		                    // 이미지 로드 완료 후 확인
		                    reviewImage.onload = reviewImage.onerror = function() {
			                    if (isImageBroken(reviewImage)) {
				                    reloadImage(reviewImage, reviewImage.src);
			                    } else {
				                    reviewImage.style.display = 'block';
			                    }
		                    };

		                    // 만약 이미 이미지가 로드되었으면 즉시 확인
		                    if (reviewImage.complete) {
			                    if (isImageBroken(reviewImage)) {
				                    reloadImage(reviewImage, reviewImage.src);
			                    } else {
				                    reviewImage.style.display = 'block';
			                    }
		                    }
                    } else {
                        alert(tmp.error);
                    }
                });
            },
            fail: function (e, data) {
                alert(getLocalizeString("설명_업로드에실패하였습니다", "", "업로드에 실패 하였습니다."));
            }
        });
    };

    var deleteReviewImage = function (code) {
        if (typeof images[code] != 'undefined') {
            delete images[code];
        }
        $("span._img_" + code).remove();
    };

    var openAddReview = function (idx, prod_code, prod_order_code, is_c3 = false) {
        $.cocoaDialog.close();
        $('#myModalReview').modal("hide");//review_remind 모달 id분리로 인한 처리
        $.ajax({
            type: 'POST',
            data: { 'idx': idx, 'prod_code': prod_code, 'prod_order_code': prod_order_code },
            url: ('/shop/open_add_review.cm'),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                if (result.msg === 'SUCCESS') {
                    $.cocoaDialog.open({
                        type: 'add_review', custom_popup: result.html, 'close_block': true, width: 800, hide_event: function () {
                            images = {};
                        }
                    });
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    var convertReviewImage = function (image_list) {
        $review_form.find('._btn_add_image').toggleClass('no-margin', false);
        for (var i = 0; i < image_list.length; i++) {
            let html;
			images[i] = image_list[i];
	        if (images[i].indexOf('.mp4') > -1) {
		        html = '<span class="file-add _img_' + i + '"><input type="hidden" name="img" value="' + i + '"><div class="img-thumb-wrap tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-[8px] tw-bg-[#F8F9FB]"><img style="border-width: 0px; width: 24px; height: 24px;" src="' + VENDOR_DOMAIN + '/images/circle-warning.png"><p class="tw-text-[10px] tw-leading-[15px] tw-text-center !tw-mb-0 tw-text-[#717680]">동영상은<br/>표시할 수 없습니다.</p></div><a class="del" href="javascript:;" onclick="SITE_SHOP_REVIEW.deleteReviewImage(\'' + i + '\')"><i class="btm bt-times vertical-middle" aria-hidden="true"></i></a></span>';
	        } else {
                html = '<span class="file-add _img_' + i + '"><input type="hidden" name="img" value="' + i + '"><div class="img-thumb-wrap"><img src="' + CDN_UPLOAD_URL + image_list[i] + '"></div><a class="del" href="javascript:;" onclick="SITE_SHOP_REVIEW.deleteReviewImage(\'' + i + '\')"><i class="btm bt-times vertical-middle" aria-hidden="true"></i></a></span>';
	        }
            $review_form.find("#review_image_box ._btn_add_image").before(html);
        }
    };

    function resizeStickyContainer() {
        var s_top = $(this).scrollTop();
        if (isIOS && isSafari) {
            $write_header.css({ '-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px' });
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
            $fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
            if (s_top > m_sticky_container_trigger_top) {
                $toolbarContainer.css({ '-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px' });
                review_body.find('.fr-view').css('padding-top', '90px');
            } else {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 'auto' });
                review_body.find('.fr-view').css('padding-top', '');
            }
        } else {
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
        }
        $toolbarContainer.find('.fr-toolbar').css('width', review_body.find('.fr-view').width());
        if ($(window).width() >= 768) {
            if ($review_container.hasClass('bg_on'))
                $review_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 487);
            else
                $review_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 180);
        }
    }

    var initMobileReview = function () {
        $mobile_review_wrap = $('#prod_detail_content_mobile');
        $mobile_form = $mobile_review_wrap.find('#mobile_review_form');
        $m_rating = $mobile_form.find('#mobile_rating');
        $m_star = $mobile_form.find('._star');
        $mobile_form.find("#mobile_review_image_box").hide();

        $mobile_form.find('#mobile_review_image_upload_btn').setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#mobile_review_image_box").show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#mobile_review_image_box").append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
        autosize($('.textarea_block textarea'));
    };

    var changeRating = function (t, n) {

        if (t == 'desktop') {
            $rating.val(n + 1);
            $star.each(function (e) {
                if (n <= 0 && e == 0) {
                    if (n == -1) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }
                } else {
                    $(this).removeClass('active');
                    if (e <= n) {
                        $(this).addClass('active');
                    }
                }
            });
        } else {
            $m_rating.val(n + 1);
            $m_star.each(function (e) {
                if (n <= 0 && e == 0) {
                    if (n == -1) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }
                } else {
                    $(this).removeClass('active');
                    if (e <= n) {
                        $(this).addClass('active');
                    }
                }
            });
        }
    };

    var reviewFormShow = function (t) {
        var sub_form = $("._sub_form_" + t);

        sub_form.data('show', 'Y');
        sub_form.show();
        var comment_add_body = sub_form.find('._comment_add_body_' + t);

        $('body').off('mouseup.sub_comment')
            .on('mouseup.sub_comment', function (e) {
                var $c_target = $(e.target);
                var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
                if ($s_form.length == 0) {

                    var text = comment_add_body.val();
                    sub_form.data('show', 'N');
                    if (text == '') {
                        $('body').off('mouseup.sub_comment');
                        reviewFormHide();
                    }
                }
            });
    };

    var reviewEditShow = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.siblings().hide();

        editor_form.data('show', 'Y');
        editor_form.show();
        autosize.update(editor_form.find('textarea'));

    };

    var reviewEditHide = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.hide();
    };

    var reviewFormHide = function () {
        $("._sub_review_form").hide();
    };

    var reviewDelete = function (t, c, r_p, only_photo, buyer_permission) {
        only_photo = only_photo == 'Y' ? true : false;
        $.ajax({
            type: 'POST',
            data: { code: t, prod_code: c },
            url: ('/shop/check_review_point.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    var msg = buyer_permission == 'Y' ? LOCALIZE.설명_삭제하시겠습니까삭제후재등록불가() : LOCALIZE.설명_삭제하시겠습니까();
                    if (res.alert_msg != '' && res.alert_msg != null) msg = res.alert_msg;
                    if (confirm(msg)) {
                        $.ajax({
                            type: 'POST',
                            data: { code: t, prod_code: c, change_member_point: res.change_member_point },
                            url: ('/shop/delete_review.cm'),
                            dataType: 'json',
                            success: function (result) {
                                if (result.msg == 'SUCCESS') {
                                    if (IS_MOBILE) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.REVIEW, r_p);
                                    else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.REVIEW, r_p, 0, false, only_photo);


                                    SITE_SHOP_DETAIL.deleteReviewInTabDisplay(c, only_photo);
                                    SITE_SHOP_DETAIL.getReviewQnaCount(c);


                                    $.cocoaDialog.close();
                                } else
                                    alert(result.msg);
                            }
                        });
                    }
                } else
                    alert(res.msg);
            }
        });
    };

    var reviewHide = function (t, c, r_p) {
        if (confirm(LOCALIZE.설명_숨기시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: t, prod_code: c, is_visible: false },
                url: ('/shop/delete_review.cm'),
                dataType: 'json',
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        if (IS_MOBILE) SITE_SHOP_DETAIL.changeContentTab(SHOP_CONST.TAB_TYPE.REVIEW, r_p);
                        else SITE_SHOP_DETAIL.changeContentPCTab(SHOP_CONST.TAB_TYPE.REVIEW, r_p);
                        $.cocoaDialog.close();
                    } else
                        alert(result.msg);
                }
            });
        }
    };

    var CheckSecret = function (code, secret_pass, callback) {
        $.ajax({
            type: 'post',
            data: { code: code, secret_pass: secret_pass, type: 'review' },
            url: '/ajax/check_review_pass.cm',
            dataType: 'json',
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof callback == 'function')
                        callback();
                } else {
                    alert(result.msg);
                }
            }
        });
    };
    var EditReviewShow = function (t, c, idx) {
        var $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" onclick="event.cancelBubble = true;" tabindex="0" style="position:absolute;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }
        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                CheckSecret(t, secret_pass, function () {
                    SITE_SHOP_REVIEW.openAddReview(idx, c);
                });
                $show_secret_password.remove();
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
					$show_secret_password.remove();
                    $('body').off('click.show_secret');
                }
            });
    };

    var reviewDeleteShow = function (t, c, only_photo) {
        var $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" onclick="event.cancelBubble = true;" tabindex="0" style="position:absolute;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }
        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                CheckSecret(t, secret_pass, function () {
                    reviewDelete(t, c, '', only_photo);
                });
				$show_secret_password.remove();
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
					$show_secret_password.remove();
                    $('body').off('click.show_secret');
                }
            });
    };

    var imageUploadInit = function (n) {

        const $wrapper = $('.categorize, .categorize-mobile');
        $("#sub_review_image_box_" + n).hide();
        //$("#editor_review_image_box_"+n).hide();

        $('#sub_review_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#sub_review_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#sub_review_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

        $('#editor_review_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#editor_review_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#editor_review_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
    };

    var submit = function () {
        if (is_submit) return false;
        is_submit = true;
        var data = $review_form.serializeObject();
        data.body = data.body.replace('/(?!br\\s*\\/?)[^>]+>/gi', '&gt;').replace('/<(?!img\\s*\\/?)[^>]/gi', '&lt;');
        data.images = images;
        $.ajax({
            type: 'POST',
            data: data,
            url: ('/shop/add_review.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg == 'SUCCESS') {
                    IMWEB_SESSIONSTORAGE.clear("PROD_REVIEW.*");
                    reviewCompleted(res.received_point, res.check_received_point);
                    if (typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.CompleteReview();
                } else {
                    is_submit = false;
                    alert(res.msg);
                }
            }
        });
    };

    var reviewCompleted = function (received_point, check_received_point) {
        $.cocoaDialog.close();
        $.ajax({
            type: 'POST',
            data: { 'received_point': received_point, 'check_received_point': check_received_point },
            url: ('/shop/add_review_completed.cm'),
            dataType: 'html',
            async: false,
            cache: false,
            success: function (html) {
                $.cocoaDialog.open({
                    type: 'prod_review_completed',
                    custom_popup: html,
                    'close_block': false,
                    hide_event: function () {
                        location.reload();
                    }
                });
            }
        });
    };

    var reviewCancel = function () {
        if (isIOS && isSafari) {
            var s_top = $(this).scrollTop();
            $write_header.css({ '-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': 0 });
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
            $fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
            if (s_top > m_sticky_container_trigger_top) {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': $write_header.height() + 'px' });
            } else {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 'auto' });
            }
        }
        history.go(-1);
    };


    var createHtml = function (prod_idx, review_page, qna_page, paging_on, only_photo, rating) {
        const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);

        $review_wrap = $('._review_wrap');

        const qna_url = isMobile_width ? '/shop/prod_review_mobile_html.cm' : '/shop/prod_review_pc_html.cm';

        if ($review_wrap.length && !($review_wrap.hasClass('one_page_mode'))) {
            review_page = review_page || 0;
            qna_page = qna_page || 0;

            var is_method_get = (review_page == 0 && qna_page == 0);

            $.ajax({
                type: (is_method_get ? 'GET' : 'POST'),
                data: { prod_idx: prod_idx, review_page: review_page, qna_page: qna_page, only_photo: only_photo, rating: rating },
                url: qna_url,
                dataType: 'html',
                success: function (result) {
                    $review_wrap.html(result);

                    if(isMobile_width) {
                        SITE_SHOP_DETAIL.getReviewSummary(document.querySelector(".detail_review_wrap_mobile ._review_summary_wrap_mobile"));
                    }
                }
            });
        }

    };

    var checkReviewData = function () {
        var check = Object.keys(images).length > 0 || review_body.val() != '';
        if (check) {
            if (confirm(LOCALIZE.설명_작성한내용이모두사라집니다())) {
                $.cocoaDialog.close();
            } else {
                return false;
            }
        } else {
            $.cocoaDialog.close();
        }
    };

    var addBlockPost = function (login_member_code, review_code) {
        if (confirm(getLocalizeString('설명_게시글차단안내', '', '게시글을 차단하시겠습니까? 작성자의 다른 글과 댓글도 확인할 수 없습니다.'))) {
            addBlock(login_member_code, review_code, 'post');
        }
    };

    var addBlockComment = function (login_member_code, review_code) {
        if (confirm(getLocalizeString('설명_님을차단안내', '', '댓글을 차단하시겠습니까? 작성자의 다른 댓글도 확인할 수 없습니다.'))) {
            addBlock(login_member_code, review_code, 'comment');
        }
    };

    var switchToBlockCancelButton = function (login_member_code, review_code, review_member_code, type) {
        var onclick;
        switch (type) {
            case 'comment':
                onclick = "SITE_SHOP_REVIEW.deleteBlockComment('" + login_member_code + "','" + review_code + "','" + review_member_code + "'); event.stopPropagation();";
                break;
            case 'post':
                onclick = "SITE_SHOP_REVIEW.deleteBlockPost('" + login_member_code + "','" + review_code + "','" + review_member_code + "'); event.stopPropagation();";
                break;
        }

        $('._review_button._block_' + review_member_code)
            .text(getLocalizeString("설명_차단해제", "", "차단해제"))
            .attr("onclick", onclick);

    };

    var switchToBlockCancelBody = function (review_member_code) {
        $('._review_body._block_' + review_member_code)
            .html("<p class='text-gray'><i aria-hidden='true' class='icon icon-exclamation' style='margin-right: 5px;'></i>" + getLocalizeString("설명_차단한작성자의구매평입니다", "", "차단한 작성자의 구매평입니다.") + "</p>")
            .attr('block', 'true');

        //이미지 안보이게 수정
        $('._review_img._block_' + review_member_code).css('display', 'none');

        //모달 리뷰 차단하였을 경우 이미지 변경
        $('._block_no_img._block_' + review_member_code)
            .css('display', 'block');
    };

    var addBlock = function (login_member_code, review_code, type) {
        $.ajax({
            type: 'POST',
            data: {
                'login_member_code': login_member_code,
                'review_code': review_code,
                'type': type,
            },
            url: ('/shop/add_review_block.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg === 'SUCCESS') {
                    switchToBlockCancelButton(login_member_code, review_code, res.review_member_code, type);
                    switchToBlockCancelBody(res.review_member_code);

                    $('._block_review_command_' + res.review_member_code).css("display", "none");
                    SHOP_REVIEW_COMMENT.getReviewCommentHtml(review_code, 'accordion', $(this));
                } else {
                    alert(res.msg);
                }
            }
        });
    };

    var deleteBlockPost = function (login_member_code, review_code, block_member_code) {
        if (confirm(getLocalizeString('설명_게시글차단해제안내', '', '게시글을 차단 해제하시겠습니까? 작성자의 다른 글과 댓글을 다시 확인할 수 있습니다.'))) {
            deleteBlock(login_member_code, review_code, block_member_code, 'post');
        }
    };

    var deleteBlockComment = function (login_member_code, review_code, block_member_code) {
        var block_review_list_code = [];

        if (confirm(getLocalizeString('설명_님을차단해제안내', '', '댓글을 차단 해제하시겠습니까? 작성자의 다른 댓글을 다시 확인할 수 있습니다.'))) {
            deleteBlock(login_member_code, review_code, block_member_code, 'comment');
        }
    };

    var deleteBlock = function (login_member_code, review_code, block_member_code, type) {
        var block_review_list_code = [];

        block_review_list_code = get_block_review_list_code(block_member_code);

        $.ajax({
            type: 'POST',
            data: {
                'login_member_code': login_member_code,
                'review_code': review_code,
                'block_review_list_code': block_review_list_code,
                'type': type
            },
            url: ('/shop/delete_review_block.cm'),
            dataType: 'json',
            success: function (res) {
                if (res.msg === 'SUCCESS') {
                    switchToBlockButton(login_member_code, review_code, res.review_member_code, type);
                    switchToBlockBody(res.review_member_code, block_review_list_code, res.block_review_data);

                    $('._block_review_command_' + res.review_member_code).css("display", "block");

                    SHOP_REVIEW_COMMENT.getReviewCommentHtml(review_code, 'accordion', $(this));
                } else {
                    alert(res.msg);
                }
            }
        });
    };

    var switchToBlockButton = function (login_member_code, review_code, review_member_code, type) {
        var onclick;
        switch (type) {
            case 'comment':
                onclick = "SITE_SHOP_REVIEW.deleteBlockComment('" + login_member_code + "','" + review_code + "'); event.stopPropagation();";
                break;
            case 'post':
                onclick = "SITE_SHOP_REVIEW.deleteBlockPost('" + login_member_code + "','" + review_code + "'); event.stopPropagation();";
                break;
        }

        $('._review_button._block_' + review_member_code)
            .text(getLocalizeString("설명_차단", "", "차단"))
            .attr("onclick", "SITE_SHOP_REVIEW.addBlockPost('" + login_member_code + "','" + review_code + "'); event.stopPropagation();");
    };

    var switchToBlockBody = function (review_member_code, block_review_list_code, block_review_data) {
        //일반 이미지
        $('._review_img._block_' + review_member_code).removeAttr('style');

        block_review_list_code.forEach(block_review_code => {
            $('._review_body._review_code_' + block_review_code)
                .html(block_review_data[block_review_code]['body'].replace(/(\n|\r\n)/g, '<br>'))
                .attr('block', 'false');
        });
        //모달 리뷰 이미지
        $('._block_no_img._block_' + review_member_code)
            .css('display', 'none');
    };

    var get_block_review_list_code = function (block_member_code) {
        //차단 리스트 review code 가져오기
        var block_review_list_code = [];

        $("._review_body._block_" + block_member_code + "[block='true']").each(function () {
            block_review_list_code.push($(this).attr('block-review-code'));
        });

        return block_review_list_code;
    };

    return {
        init: function (code) {
            init(code);
        },
        deleteReviewImage: function (code) {
            deleteReviewImage(code);
        },
        openAddReview: function (idx, prod_code, prod_order_code) {
            return openAddReview(idx, prod_code, prod_order_code);
        },
        convertReviewImage: function (image_list) {
            return convertReviewImage(image_list);
        },
        initMobileReview: function () {
            initMobileReview();
        },
        submit: function () {
            submit();
        },
        reviewCompleted: function (received_point, check_received_point) {
            reviewCompleted(received_point, check_received_point);
        },
        reviewCancel: function () {
            reviewCancel();
        },
        changeRating: function (t, n) {
            changeRating(t, n);
        },
        FormShow: function (t) {
            reviewFormShow(t);
        },
        Delete: function (t, c, r_p, only_photo, buyer_permission) {
            reviewDelete(t, c, r_p, only_photo, buyer_permission);
        },
        EditShow: function (t) {
            reviewEditShow(t);
        },
        EditReviewShow: function (t, c, idx) {
            EditReviewShow(t, c, idx);
        },
        DeleteShow: function (t, c, only_photo) {
            reviewDeleteShow(t, c, only_photo);
        },
        Hide: function (t, c, r_p) {
            reviewHide(t, c, r_p);
        },
        EditHide: function (t) {
            reviewEditHide(t);
        },
        imageUploadInit: function (n) {
            imageUploadInit(n);
        },
        createHtml: function (prod_idx, review_page, qna_page, paging_on, only_photo) {
            createHtml(prod_idx, review_page, qna_page, paging_on, only_photo);
        },
        checkReviewData: function () {
            checkReviewData();
        },
        addBlockPost: function (login_member_code, review_code) {
            addBlockPost(login_member_code, review_code);
        },
        addBlockComment: function (login_member_code, review_code) {
            addBlockComment(login_member_code, review_code);
        },
        deleteBlockPost: function (login_member_code, review_code, block_member_code) {
            deleteBlockPost(login_member_code, review_code, block_member_code);
        },
        deleteBlockComment: function (login_member_code, review_code, block_member_code) {
            deleteBlockComment(login_member_code, review_code, block_member_code);
        },
		C3_openAddReview : function(idx,prod_code,prod_order_code){
			return openAddReview(idx,prod_code,prod_order_code, true);
		},
    };
}();

var SHOP_REVIEW_COMMENT = function () {
    var $review_comment_wrap;
    var $form;
    var $secret;
    var review_code;
    var device;
    var load_type; // 아코디언인지, 모달인지 체크

    var init = function (code, type, device_type) {
        device = device_type;
        load_type = type;
        review_code = code;
        $form = $('.categorize-mobile #' + device + "_" + load_type + '_review_form_' + code + ', .categorize.review-box #' + device + "_" + load_type + '_review_form_' + code);
        $secret = $('._secret_btn');
        $secret.on('click', function () {
            if ($secret.hasClass('active')) {
                $secret.removeClass('active');
                $('#use_secret_review').val('N');
            } else {
                $secret.addClass('active');
                $('#use_secret_review').val('Y');
            }
        });

        $form.each(function(){
            const $this = $(this);
            $this.find('#review_image_upload_btn_' + code).setUploadImage({
                url : '/shop/upload_image.cm',
                dropZone : 'icon_img_upload_wrap',
                singleFileUploads : true,
                formData : {temp : 'Y'}
            }, function(res, data){
                $this.find("#review_comment_image_box_" + code).show();
                $.each(data, function(e, tmp){
                    if(tmp.error == "" || tmp.error == null){
                        var url = CDN_UPLOAD_URL + tmp.url;
                        var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                        $this.find("#review_comment_image_box_" + code).append(html);
                    }else{
                        alert(tmp.error);
                    }
                });
            })
        });
    };

    var imageUploadInit = function (idx) {

        const $wrapper = $('.categorize-mobile, .categorize.review-box');

        $wrapper.each(function(){
           const $this = $(this);

            $this.find("#sub_review_image_box_" + idx).hide();

            $this.find('#sub_review_image_upload_btn_' + idx).setUploadImage({
                url: '/shop/upload_image.cm',
                dropZone: 'icon_img_upload_wrap',
                singleFileUploads: true,
                formData: { temp: 'Y' }
            }, function (res, data) {
                $(".categorize #sub_review_image_box_" + idx).show();
                $(".categorize-mobile #sub_review_image_box_" + idx).show();
                $.each(data, function (e, tmp) {
                    if (tmp.error == "" || tmp.error == null) {
                        var url = CDN_UPLOAD_URL + tmp.url;
                        var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                        $this.find("#sub_review_image_box_" + idx).append(html);
                    } else {
                        alert(tmp.error);
                    }
                });
            });

            $this.find('#editor_review_image_upload_btn_' + idx).setUploadImage({
                url: '/shop/upload_image.cm',
                dropZone: 'icon_img_upload_wrap',
                singleFileUploads: true,
                formData: { temp: 'Y' }
            }, function (res, data) {
                $(".categorize #editor_review_image_box_" + idx).show();
                $(".categorize-mobile #editor_review_image_box_" + idx).show();
                $.each(data, function (e, tmp) {
                    if (tmp.error == "" || tmp.error == null) {
                        var url = CDN_UPLOAD_URL + tmp.url;
                        var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.url + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                        $this.find("#editor_review_image_box_" + idx).append(html);
                    } else {
                        alert(tmp.error);
                    }
                });
            });

        });
    };

    var getReviewCommentHtml = function (code, type, object) {
        if (type == 'accordion') {
            $review_comment_wrap = $('.review_comment_wrap_' + code);
            if (!object.hasClass('active')) {
                $.ajax({
                    type: 'POST',
                    data: { 'code': code, 'type': type },
                    url: ('/shop/get_review_comment_list.cm'),
                    dataType: 'json',
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result.msg === 'SUCCESS') {
                            $review_comment_wrap.html(result.html);
                            $review_comment_wrap.show();
                        } else {
                            alert(result.msg);
                        }
                    }
                });
            } else {
                $review_comment_wrap.hide();
            }
        } else {
            $review_comment_wrap = $('#review_comment_section_' + code);
            $.ajax({
                type: 'POST',
                data: { 'code': code, 'type': type },
                url: ('/shop/get_review_comment_list.cm'),
                dataType: 'json',
                async: false,
                cache: false,
                success: function (result) {
                    if (result.msg === 'SUCCESS') {
                        $review_comment_wrap.html(result.html);
                    } else {
                        alert(result.msg);
                    }
                }
            });
        }
    };
    var submit = function (t, type, i) {
		// mobile 및 pc 에서 같은 id 값 공유 해당 부분 수정 필요...
		const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);
		const isModal = document.querySelector('#cocoaModal').classList.contains('review');
        let data = {};
		switch (type) {
            case 'main': // pc 리뷰 댓글
	            if (isModal) {
					data = $('#_modal_review_form_' + review_code).serializeObject();
					break;
	            }
	            if (isMobile_width) {
		            data = $('.categorize-mobile #' + $form.attr('id')).serializeObject();
	            } else {
		            data = $('.categorize.review-box #' + $form.attr('id')).serializeObject();
	            }
                break;
            case 'sub_form': //pc 리뷰 대댓글
	            if (isModal) {
		            data = $('#sub_review_form_' + i).serializeObject();
		            break;
	            }
	            if (isMobile_width) {
					data = $('.categorize-mobile #sub_review_form_' + i).serializeObject();
	            } else {
					data = $('.categorize.review-box #sub_review_form_' + i).serializeObject();
	            }
                break;
            case 'editor': // pc 리뷰 댓글 수정
	            if (isModal) {
					data = $('#sub_review_editor_form_' + i).serializeObject();
					break;
	            }
                if (isMobile_width) {
		            data = $('.categorize-mobile #sub_review_editor_form_' + i).serializeObject();
	            } else {
		            data = $('.categorize.review-box #sub_review_editor_form_' + i).serializeObject();
	            }
                break;
            case 'mobile': // Mobile 리뷰 댓글
                data = $('#mobile_review_form').serializeObject();
                break;
            case 'mobile_sub_form': // Mobile 리뷰 대댓글
                data = $('#mobile_sub_review_form_' + i).serializeObject();
                break;
            case 'mobile_editor': // Mobile 리뷰 댓글 수정
                data = $('#mobile_sub_review_editor_form_' + i).serializeObject();
                break;
        }
        if (!t.hasClass("btn-writing")) {
            t.addClass("btn-writing");
        }
        $.ajax({
            type: 'POST',
            data: { data: data, review_code: review_code },
            url: ('/shop/add_review_comment.cm'),
            dataType: 'json',
            async: false,
            cache: false,
            success: function (result) {
                if (t.hasClass("btn-writing")) {
                    t.removeClass("btn-writing");
                }
                if (result.msg == 'SUCCESS') {
                    if (load_type == 'modal') {
                        $('#comment_count').text(" " + result.comment_count);
                        getReviewCommentHtml(review_code, 'modal', t);
                    } else {
                        $('.categorize #comment_count_' + review_code).text(" " + result.comment_count);
                        $('.categorize #comment_count_inner_' + review_code).text(" " + result.comment_count);
                        $('.categorize-mobile #comment_count_' + review_code).text(result.comment_count);
                        $('.categorize-mobile #comment_count_inner_' + review_code).text(" " + result.comment_count);
                        getReviewCommentHtml(review_code, 'accordion', t);
                    }
                    $("div[id^='sub_review_image_box_']").hide();
                } else
                    alert(result.msg);
            }
        });
    };
    var EditHide = function (idx) {
        var editor_form = $("._sub_form_editor_" + idx);
        editor_form.hide();
        $('.tools').show();
        editor_form.siblings('._comment_body').show();
        editor_form.closest('.comment_area').siblings().show();
        editor_form.closest('.comment_area').css('padding-top', '');
        editor_form.css('margin-top', '');
    };

    var EditShow = function (idx) {
        var editor_form = $("._sub_form_editor_" + idx);
        editor_form.siblings().hide();
        editor_form.closest('.comment_area').siblings().hide();
        editor_form.closest('.comment_area').css('padding-top', 0);
        editor_form.css('margin-top', 0);
        editor_form.data('show', 'Y');
        editor_form.show();
        autosize.update(editor_form.find('textarea'));
    };

    var reviewFormHide = function () {
        $("._sub_review_form").hide();
    };

    var FormShow = function (idx) {
        var sub_form = $("._sub_form_" + idx);

        sub_form.data('show', 'Y');
        sub_form.show();
        var comment_add_body = sub_form.find('._comment_add_body_' + idx);

        $('body').off('mouseup.sub_comment')
            .on('mouseup.sub_comment', function (e) {
                var $c_target = $(e.target);
                var $s_form = $c_target.closest('._sub_form_' + idx + ', ._show_sub_form_btn_' + idx);
                if ($s_form.length == 0) {

                    var text = comment_add_body.val();
                    sub_form.data('show', 'N');
                    if (text == '') {
                        $('body').off('mouseup.sub_comment');
                        reviewFormHide();
                    }
                }
            });
    };

    var reviewCommentDelete = function (code) {
        if (confirm(LOCALIZE.설명_삭제하시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: code, review_code: review_code },
                url: ('/shop/delete_review_comment.cm'),
                async: false,
                dataType: 'json',
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        if (load_type == 'modal') {
                            $('#comment_count').text(result.comment_count);
                            getReviewCommentHtml(review_code, 'modal', $(this));
                        } else {
                            $('.categorize #comment_count_' + review_code).text(result.comment_count);
                            $('.categorize #comment_count_inner_' + review_code).text(result.comment_count);
                            $('.categorize-mobile #comment_count_' + review_code).text(result.comment_count);
                            $('.categorize-mobile #comment_count_inner_' + review_code).text(result.comment_count);
                            getReviewCommentHtml(review_code, 'accordion', $(this));
                        }


                    } else
                        alert(result.msg);
                }
            });
        }
    };
    return {
        init: function (code, type, device_type) {
            init(code, type, device_type);
        },
        imageUploadInit: function (idx) {
            imageUploadInit(idx);
        },
        getReviewCommentHtml: function (code, type, object) {
            getReviewCommentHtml(code, type, object);
        },
        submit: function (t, type, i) {
            submit(t, type, i);
        },
        Delete: function (code) {
            reviewCommentDelete(code);
        },
        EditShow: function (idx) {
            EditShow(idx);
        },
        EditHide: function (idx) {
            EditHide(idx);
        },
        FormShow: function (idx) {
            FormShow(idx);
        }
    };
}();

var SITE_QNA_COMMENT = function () {
    var $form;
    var $secret;
    var $qna_comment_section;
    var qna_code;

    var init = function (code) {
        qna_code = code;
        var $comment_area = $('.comment_textarea');
        $secret = $('._secret_btn');
        $secret.on('click', function () {
            if ($secret.hasClass('active')) {
                $secret.removeClass('active');
                $('#use_secret_qna').val('N');
            } else {
                $secret.addClass('active');
                $('#use_secret_qna').val('Y');
            }
        });

        $form = $('#qna_form');
        $form.find('#qna_image_upload_btn').setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#qna_image_box").show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#qna_image_box").append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

    };

    var QnaCommentDelete = function (code, is_visible) {
        if (confirm(LOCALIZE.설명_삭제하시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: code, is_visible: is_visible },
                url: ('/shop/delete_qna_comment.cm'),
                async: false,
                dataType: 'json',
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        getQnaCommentHtml(qna_code);
                    } else
                        alert(result.msg);
                }
            });
        }
    };

    var imageUploadInit = function (idx) {
        $form = $('#qna_form');
        $form.find('#qna_image_upload_btn').setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#qna_image_box").show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#qna_image_box").append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

        $("#sub_qna_image_box_" + idx).hide();

        $('#sub_qna_image_upload_btn_' + idx).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#sub_qna_image_box_" + idx).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#sub_qna_image_box_" + idx).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

        $('#editor_qna_image_upload_btn_' + idx).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#editor_qna_image_box_" + idx).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#editor_qna_image_box_" + idx).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
    };


    var getQnaCommentHtml = function (qna_code) {
        $qna_comment_section = $('#qna_comment_section');
        $.ajax({
            type: 'POST',
            data: { qna_code: qna_code },
            url: ('/ajax/get_qna_comment_list.cm'),
            dataType: 'html',
            cache: false,
            success: function (result) {
                $qna_comment_section.html(result);
            }
        });
    };
    var submit = function (t, type, i) {
        switch (type) {
            case 'main': // 1:1 문의 페이지에서 바로 작성하는 폼
                var data = $form.serializeObject();
                break;
            case 'sub_form': // 등록되어 있는 qna에 답변을 다는 폼
                var data = $('#sub_qna_form_' + i).serializeObject();
                break;
            case 'editor': // 등록되어 있는 qna를 수정하는 폼
                var data = $('#sub_qna_editor_form_' + i).serializeObject();
                break;
        }
        if (!t.hasClass("btn-writing")) {
            t.addClass("btn-writing");
        }
        $.ajax({
            type: 'POST',
            data: { data: data, type: type },
            url: ('/shop/add_qna_comment.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (t.hasClass("btn-writing")) {
                    t.removeClass("btn-writing");
                }
                if (result.msg == 'SUCCESS') {
                    getQnaCommentHtml(qna_code);
                    $("div[id^='sub_qna_image_box_']").hide();
                } else
                    alert(result.msg);
            }
        });
    };
    var EditShow = function (idx) {
        var editor_form = $("._sub_form_editor_" + idx);
        editor_form.siblings().hide();
        editor_form.closest('.comment_area').siblings().hide();
        editor_form.closest('.comment_area').css('padding-top', 0);
        editor_form.css('margin-top', 0);
        editor_form.data('show', 'Y');
        editor_form.show();
        autosize.update(editor_form.find('textarea'));

    };

    var EditHide = function (idx) {
        var editor_form = $("._sub_form_editor_" + idx);
        editor_form.hide();
        $('.tools').show();
        editor_form.siblings('._comment_body').show();
        editor_form.closest('.comment_area').siblings().show();
        editor_form.closest('.comment_area').css('padding-top', '');
        editor_form.css('margin-top', '');
    };

    var qnaFormHide = function () {
        $("._sub_qna_form").hide();
    };

    var FormShow = function (idx) {
        var sub_form = $("._sub_form_" + idx);

        sub_form.data('show', 'Y');
        sub_form.show();
        var comment_add_body = sub_form.find('._comment_add_body_' + idx);

        $('body').off('mouseup.sub_comment')
            .on('mouseup.sub_comment', function (e) {
                var $c_target = $(e.target);
                var $s_form = $c_target.closest('._sub_form_' + idx + ', ._show_sub_form_btn_' + idx);
                if ($s_form.length == 0) {

                    var text = comment_add_body.val();
                    sub_form.data('show', 'N');
                    if (text == '') {
                        $('body').off('mouseup.sub_comment');
                        qnaFormHide();
                    }
                }
            });
    };
    return {
        init: function (code) {
            init(code);
        },
        imageUploadInit: function (idx) {
            imageUploadInit(idx);
        },
        getQnaCommentHtml: function (qna_code) {
            getQnaCommentHtml(qna_code);
        },
        submit: function (t, type, i) {
            submit(t, type, i);
        },
        Delete: function (code, is_visible) {
            QnaCommentDelete(code, is_visible);
        },
        EditShow: function (idx) {
            EditShow(idx);
        },
        EditHide: function (idx) {
            EditHide(idx);
        },
        FormShow: function (idx) {
            FormShow(idx);
        }
    };
}();

var SITE_SHOP_QNA = function () {
    var $qna_wrap;
    var $mobile_qna_wrap;
    var $form;
    var $mobile_form;
    var $comment_body;
    var $qna_image_box;
    var $comment_area;
    var $secret;
    var $m_secret;
    var qna_body;
    var $qna_container;
    var $qna_form;
    var body_input;
    var $show_secret_password;
    var isIOS, isSafari, $fr_m_custom, $write_header, m_sticky_container_trigger_top, $toolbarContainer;

    var init = function (code, qna_secret_type) {
        $qna_wrap = $('._qna_wrap');
        $qna_form = $('#qna_form');
        qna_body = $('#qna_body');
        $qna_container = $('#qna_container');
        $secret = $('._secret_btn');
        $qna_form.find("#qna_image_box").hide();
        body_input = $('#body_input');
        if (qna_secret_type == 'secret') {
            $secret.addClass('active');
            $('._secret').val('Y');
        } else {
            $secret.on('click', function () {
                if ($secret.hasClass('active')) {
                    $secret.removeClass('active');
                    $('._secret').val('N');
                } else {
                    $secret.addClass('active');
                    $('._secret').val('Y');
                }
            });
        }
        if ($('._secret').val() != '') {//수정일 경우 비밀글 체크
            if ($('._secret').val() == 'Y') {
                $secret.addClass('active');
                $('._secret').val('Y');
            } else {
                $secret.removeClass('active');
                $('._secret').val('N');
            }
        }


        if (IE_VERSION < 10) {
            CKEDITOR.replace('qna_body', {
                filebrowserImageUploadUrl: '/ajax/post_image_upload.cm?board_code=' + code
            });
        } else {
            if (android_version() == 4) {
                qna_body.addClass('legacy_webview');
            }
            var image_insert_key2 = 'image_insert_key2';
            setFroala('#qna_body', {
                code: '',
                // 파일 첨부, 비디오, 테이블 제외
                toolbarButtons: {
                    'moreText': {
                        'buttons': ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'strikeThrough', 'backgroundColor', 'clearFormatting', '|', 'align', 'formatOL', 'formatUL', '|', image_insert_key2, 'insertLink', '|', 'undo', 'redo', 'html', 'emoticons'],
                        'buttonsVisible': 50
                    }
                },
                toolbarButtonsMobile: {
                    'moreText': {
                        'buttons': [image_insert_key2, 'insertLink', '|', "fontSize", "bold", "italic", "underline", "strikeThrough", "align", "textColor", "clearFormatting", '|', "formatOL", "formatUL"],
                        'buttonsVisible': 50
                    }
                },
                image_upload_url: "/ajax/post_image_upload.cm",
                image_insert_key: image_insert_key2,
                image_align: 'center',
                image_display: 'block',
                toolbarStickyOffset: 38,
                heightMin: 200,
                heightMax: 600,
                mobile_custom: true,
                linkAlwaysBlank: true
            });
        }

        isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        $fr_m_custom = $qna_container.find('._fr-m-custom');
        $write_header = $qna_container.find('._write_header');
        m_sticky_container_trigger_top = $fr_m_custom.offset().top - $fr_m_custom.height();
        $toolbarContainer = $fr_m_custom.find('#toolbarContainer');
        if (isIOS && isSafari) {
            $write_header.css('position', 'absolute');
        }
        var timeoutTime = isIOS && isSafari ? 100 : 10;
        var resize_time;
        resizeStickyContainer();
        $(window).off('scroll.mobile_write resize.mobile_write').on('scroll.mobile_write resize.mobile_write', function () {
            var s_top = $(this).scrollTop();
            if (isIOS && isSafari) {
                $write_header.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 0 });
                if (s_top > m_sticky_container_trigger_top) {
                    $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 0 });
                }
            }
            if (resize_time) {
                clearTimeout(resize_time);
            }
            resize_time = setTimeout(function () {
                resizeStickyContainer();
            }, timeoutTime);
        });
        autosize($('.textarea_block textarea'));
    };

    function resizeStickyContainer() {
        var s_top = $(this).scrollTop();
        if (isIOS && isSafari) {
            $write_header.css({ '-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px' });
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
            $fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
            if (s_top > m_sticky_container_trigger_top) {
                $toolbarContainer.css({ '-webkit-transition': 'top 100ms', 'transition': 'top 100ms', 'top': s_top + 'px' });
                qna_body.find('.fr-view').css('padding-top', '90px');
            } else {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 'auto' });
                qna_body.find('.fr-view').css('padding-top', '');
            }
        } else {
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
        }
        $toolbarContainer.find('.fr-toolbar').css('width', qna_body.find('.fr-view').width());
        if ($(window).width() >= 768) {
            if ($qna_container.hasClass('bg_on'))
                $qna_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 487);
            else
                $qna_container.find('#toolbarContainer').toggleClass('pc_sticky_toolbar', s_top > 180);
        }
    }

    var initMobileQna = function () {
        $mobile_qna_wrap = $('#prod_detail_content_mobile');
        $mobile_form = $mobile_qna_wrap.find('#mobile_qna_form');
        $m_secret = $mobile_form.find('._secret_btn');
        $mobile_form.find("#mobile_qna_image_box").hide();

        $m_secret.on('click', function () {
            if ($m_secret.hasClass('active')) {
                $m_secret.removeClass('active');
                $mobile_form.find('._secret').val('N');
            } else {
                $m_secret.addClass('active');
                $mobile_form.find('._secret').val('Y');
            }
        });

        $mobile_form.find('#mobile_qna_image_upload_btn').setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#mobile_qna_image_box").show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#mobile_qna_image_box").append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
        autosize($('.textarea_block textarea'));
    };

    var qnaFormShow = function (t) {
        var sub_form = $("._sub_form_" + t);

        sub_form.data('show', 'Y');
        sub_form.show();
        var comment_add_body = sub_form.find('._comment_add_body_' + t);

        $('body').off('mouseup.sub_comment')
            .on('mouseup.sub_comment', function (e) {
                var $c_target = $(e.target);
                var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
                if ($s_form.length == 0) {

                    var text = comment_add_body.val();
                    sub_form.data('show', 'N');
                    if (text == '') {
                        $('body').off('mouseup.sub_comment');
                        qnaFormHide();
                    }
                }
            });
    };

    var EditQnaShow = function (t, c, idx) {
        $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            var left = $(window).width() >= 768 ? 200 : ($(window).width() - 325) / 2;
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" tabindex="0" style="position:absolute;left:' + left + 'px;top:80px;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }
        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                CheckSecret(t, secret_pass, function () {
                    window.location.href = "?prod_code=" + c + "&qmode=write&back_url=&idx=" + idx;
                });
                $show_secret_password.hide();
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
                    $show_secret_password.hide();
                    $('body').off('click.show_secret');
                }
            });
    };

    var ViewQnaShow = function (t, c, idx, qna_page) {
        $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            var left = $(window).width() >= 768 ? 200 : ($(window).width() - 325) / 2;
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" tabindex="0" style="position:absolute;left:' + left + 'px;top:80px;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }
        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                CheckSecret(t, secret_pass, function () {
                    SITE_SHOP_DETAIL.viewQnaDetail(idx, qna_page);
                    $show_secret_password.hide();
                });
                $show_secret_password.hide();
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
                    $show_secret_password.hide();
                    $('body').off('click.show_secret');
                }
            });
    };

    var CheckSecret = function (code, secret_pass, callback) {
        $.ajax({
            type: 'post',
            data: { code: code, secret_pass: secret_pass, type: 'qna' },
            url: '/ajax/check_review_pass.cm',
            dataType: 'json',
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    if (typeof callback == 'function')
                        callback();
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    var qnaEditShow = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.siblings().hide();

        editor_form.data('show', 'Y');
        editor_form.show();
        autosize.update(editor_form.find('textarea'));

    };

    var qnaEditHide = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.hide();
    };

    var qnaFormHide = function () {
        $("._sub_qna_form").hide();
    };

    var qnaDelete = function (code, prod_code, secret_pass, q_p) {
        if (confirm(LOCALIZE.설명_삭제하시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: code, prod_code: prod_code, secret_pass: secret_pass, qna_page: q_p },
                url: ('/shop/delete_qna.cm'),
                dataType: 'json',
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        if (IS_MOBILE) SITE_SHOP_DETAIL.changeContentTab('qna', 0, q_p);
                        else SITE_SHOP_DETAIL.changeContentPCTab('qna', 0, q_p);
                        if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.addCountUserProfileAttr('qnaCount', -1);

                        SITE_SHOP_DETAIL.getReviewQnaCount(prod_code);

                        $.cocoaDialog.close();
                    } else
                        alert(result.msg);
                }
            });
        }
    };

    var qnaModify = function (idx, prod_code, secret_pass, is_book, code) {
        $.ajax({
            type: 'POST',
            data: { idx: idx, prod_code: prod_code, secret_pass: secret_pass, is_book: is_book, code: code },
            url: ('/shop/show_secret_qna.cm'),
            dataType: 'json',
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    qnaEditShow(idx);
                } else
                    alert(result.msg);
            }
        });
    };

    var qnaShow = function (idx, prod_code, secret_pass, is_book, code) {
        $.ajax({
            type: 'POST',
            data: { idx: idx, prod_code: prod_code, secret_pass: secret_pass, is_book: is_book, code: code },
            url: ('/shop/show_secret_qna.cm'),
            dataType: 'json',
            success: function (result) {
                if (result.msg == 'SUCCESS') {
                    $("._comment_body_" + idx).html(result.html);
                    $('._comment_body_' + idx).closest('.comment_area').find('#_show_content_btn').hide();		// 보기 버튼 제거
                    if (result.isSubComment) {
                        for (var i in result.sub_comment) {
                            var sub_data = result.sub_comment[i];
                            $("._comment_child_" + idx + "_" + sub_data.idx).html(sub_data.html);
                        }
                    }
                } else
                    alert(result.msg);
            }
        });
    };

    var qnaConfirmShow = function (e, idx, prod_code, type, code) {
        $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            var left = $(window).width() >= 768 ? 200 : ($(window).width() - 325) / 2;
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" tabindex="0" style="position:absolute;left:' + left + 'px;top:80px;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }

        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                $show_secret_password.hide();
                switch (type) {
                    case 'show':
                        qnaShow(idx, prod_code, secret_pass, 'N', code);
                        break;
                    case 'modify':
                        qnaModify(idx, prod_code, secret_pass, 'N', code);
                        break;
                    case 'delete':
                        qnaDelete(code, prod_code, secret_pass);
                        break;

                }
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
                    $show_secret_password.hide();
                    $('body').off('click.show_secret');
                }
            });
    };

    var imageUploadInit = function (n) {
        $("#sub_qna_image_box_" + n).hide();

        $('#sub_qna_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#sub_qna_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#sub_qna_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

        $('#editor_qna_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#editor_qna_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#editor_qna_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
    };

    var submit = function () {
        if (IE_VERSION < 10) {
            var body = CKEDITOR.instances.qna_body.getData();
            body_input.val(body);
            $qna_form.submit();
        } else {
            if (qna_body.hasClass('fr-code-view'))
                FroalaEditor('#qna_body').codeView.toggle();
            var body = FroalaEditor('#qna_body').html.get(true);
            body_input.val(body);
            $qna_form.submit();
        }
    };

    var qnaCancel = function () {
        if (isIOS && isSafari) {
            var s_top = $(this).scrollTop();
            $write_header.css({ '-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': 0 });
            $fr_m_custom.toggleClass('m_sticky_container', s_top > m_sticky_container_trigger_top);
            $fr_m_custom.toggleClass('m_sticky_container_ios', s_top > m_sticky_container_trigger_top);
            if (s_top > m_sticky_container_trigger_top) {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'position': 'fixed', 'top': $write_header.height() + 'px' });
            } else {
                $toolbarContainer.css({ '-webkit-transition': 'none', 'transition': 'none', 'top': 'auto' });
            }
        }
        history.go(-1);
    };

    var createHtml = function (prod_idx, review_page, qna_page, paging_on) {
        const isMobile_width = (window.innerWidth < SHOP_CONST.WIDTH_MOBILE);
        const review_url = isMobile_width ? "/shop/prod_qna_mobile_html.cm" : "/shop/prod_qna_pc_html.cm";

        $qna_wrap = $('._qna_wrap');
        if ($qna_wrap.length) {
            var is_cache = false;
            var callback = function (result) {
                $qna_wrap.html(result);
                if (!is_cache) IMWEB_SESSIONSTORAGE.set(`${isMobile_width ? "PROD_QNA_MOBILE_" : "PROD_QNA_PC_"}` + prod_idx + "_" + review_page + '_' + qna_page, result.replace(/\t+/g, '').trim(), 60);
            };

            var html = IMWEB_SESSIONSTORAGE.get(`${isMobile_width ? "PROD_QNA_MOBILE_" : "PROD_QNA_PC_"}` + prod_idx + "_" + review_page + '_' + qna_page);
            if (html) {
                is_cache = true;
                callback(html);
            } else {
                $.ajax({
                    type: 'POST',
                    data: { prod_idx: prod_idx, review_page: review_page, qna_page: qna_page },
                    url: review_url,
                    dataType: 'html',
                    cache: false,
                    success: callback
                });
            }
        }
    };

    var qnaHide = function (t, c, q_p) {
        if (confirm(LOCALIZE.설명_숨기시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: t, prod_code: c, is_visible: false },
                url: ('/shop/delete_qna.cm'),
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        if (IS_MOBILE) SITE_SHOP_DETAIL.changeContentTab('qna', q_p);
                        else SITE_SHOP_DETAIL.changeContentPCTab('qna', q_p);
                        if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.addCountUserProfileAttr('qnaCount', -1);
                        $.cocoaDialog.close();
                    } else
                        alert(result.msg);
                }
            });
        }
    };

    var qnaDeleteShow = function (qna_code, prod_code) {
        var $show_secret_password = $('#show_secret_password');
        var $show_link = $(event.target);
        if ($show_secret_password.length == 0) {
            var left = $(window).width() >= 768 ? 200 : ($(window).width() - 325) / 2;
            $show_secret_password = $('<div class="remove-pop" id="show_secret_password" tabindex="0" style="position:absolute;left:' + left + 'px;top:80px;z-index:99999;"><p>' + LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요() + '</p><div class="input_area"><input type="password" placeholder="' + LOCALIZE.설명_비밀번호() + '"><button class="btn btn-primary _confirm">' + LOCALIZE.버튼_확인닫기() + '</button></div></div>').hide();
            $show_link.after($show_secret_password);
        }
        $show_secret_password.find('input').val('');
        $show_secret_password.show();
        $show_secret_password.off('click', '._confirm')
            .on('click', '._confirm', function () {
                var secret_pass = $show_secret_password.find('input').val();
                CheckSecret(qna_code, secret_pass, function () {
                    qnaDelete(qna_code, prod_code, secret_pass);
                });
                $show_secret_password.hide();
            });
        $('body').off('mousedown.show_secret')
            .on('mousedown.show_secret', function (e) {
                var $tmp = $(e.target).closest('#show_secret_password');
                if ($tmp.length == 0) {
                    $show_secret_password.hide();
                    $('body').off('click.show_secret');
                }
            });
    };


    return {
        init: function (code, qna_secret_type) {
            init(code, qna_secret_type);
        },
        initMobileQna: function () {
            initMobileQna();
        },
        submit: function () {
            submit();
        },
        qnaCancel: function () {
            qnaCancel();
        },
        FormShow: function (t) {
            qnaFormShow(t);
        },
        EditQnaShow: function (t, c, idx) {
            EditQnaShow(t, c, idx);
        },
        ViewQnaShow: function (t, c, idx, qna_page) {
            ViewQnaShow(t, c, idx, qna_page);
        },
        Delete: function (code, prod_code, q_p) {
            qnaDelete(code, prod_code, q_p);
        },
        EditShow: function (t) {
            qnaEditShow(t);
        },
        EditHide: function (t) {
            qnaEditHide(t);
        },
        imageUploadInit: function (n) {
            imageUploadInit(n);
        },
        createHtml: function (prod_idx, review_page, qna_page, paging_on) {
            createHtml(prod_idx, review_page, qna_page, paging_on);
        },
        confirmShow: function (e, idx, prod_code, type, code) {
            qnaConfirmShow(e, idx, prod_code, type, code);
        },
        Hide: function (t, c, q_p) {
            qnaHide(t, c, q_p);
        },
        DeleteShow: function (qna_code, prod_code) {
            qnaDeleteShow(qna_code, prod_code);
        },
    };
}();

var SITE_PERSONAL_QNA = function () {
    var $personal_qna_wrap;
    var $mobile_qna_wrap;
    var $form;
    var $mobile_form;
    var $comment_body;
    var $qna_image_box;


    var $comment_area;
    var $secret;

    var init = function () {
        $form = $('#qna_form');
        $secret = $form.find('._secret');

        $secret.on('click', function () {
            if ($secret.hasClass('active')) {
                $secret.removeClass('active');
                $form.find('#secret').val('N');
            } else {
                $secret.addClass('active');
                $form.find('#secret').val('Y');
            }
        });

        $('#qna_image_upload_btn').setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#qna_image_box").show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#qna_image_box").append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
        autosize($('.textarea_block textarea'));
    };

    var submit = function (t, type, i) {
        switch (type) {
            case 'main': // 1:1 문의 페이지에서 바로 작성하는 폼
                var data = $form.serializeObject();
                break;
            case 'sub_form': // 등록되어 있는 qna에 답변을 다는 폼
                var data = $('#sub_qna_form_' + i).serializeObject();
                break;
            case 'editor': // 등록되어 있는 qna를 수정하는 폼
                var data = $('#sub_qna_editor_form_' + i).serializeObject();
                break;
        }
        if (!t.hasClass("btn-writing")) {
            t.addClass("btn-writing");
        }
        $.ajax({
            type: 'POST',
            data: { data: data, type: type, personal_qna: 'Y' },
            url: ('/shop/add_qna.cm'),
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (t.hasClass("btn-writing")) {
                    t.removeClass("btn-writing");
                }
                if (result.msg == 'SUCCESS') {
                    createHtml(result.page);
                } else
                    alert(result.msg);
            }
        });
    };

    var Delete = function (code, prod_code) {
        if (confirm(LOCALIZE.설명_삭제하시겠습니까())) {
            $.ajax({
                type: 'POST',
                data: { code: code, prod_code: prod_code },
                url: ('/shop/delete_qna.cm'),
                dataType: 'json',
                success: function (result) {
                    if (result.msg == 'SUCCESS') {
                        if (typeof CHANNEL_PLUGIN != 'undefined') CHANNEL_PLUGIN.addCountUserProfileAttr('qnaCount', -1);
                        createHtml();
                    } else
                        alert(result.msg);
                }
            });
        }
    };

    var FormShow = function (t) {
        var sub_form = $("._sub_form_" + t);

        sub_form.data('show', 'Y');
        sub_form.show();
        var comment_add_body = sub_form.find('._comment_add_body_' + t);

        $('body').off('mouseup.sub_comment')
            .on('mouseup.sub_comment', function (e) {
                var $c_target = $(e.target);
                var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
                if ($s_form.length == 0) {

                    var text = comment_add_body.val();
                    sub_form.data('show', 'N');
                    if (text == '') {
                        $('body').off('mouseup.sub_comment');
                        FormHide();
                    }
                }
            });
    };

    var FormHide = function () {
        $("._sub_qna_form").hide();
    };

    var EditShow = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.siblings('.block-postmeta').find('.write').hide();
        editor_form.siblings('.block-postmeta').find('.comment_area').hide();
        editor_form.data('show', 'Y');
        editor_form.show();
    };

    var EditHide = function (t) {
        var editor_form = $("._sub_form_editor_" + t);
        editor_form.hide();
        editor_form.siblings('.block-postmeta').find('.write').show();
        editor_form.siblings('.block-postmeta').find('.comment_area').show();
    };

    var imageUploadInit = function (n) {
        $("#sub_image_box_" + n).hide();

        $('#sub_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#sub_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#sub_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });

        $('#editor_image_upload_btn_' + n).setUploadImage({
            url: '/shop/upload_image.cm',
            dropZone: 'icon_img_upload_wrap',
            singleFileUploads: true,
            formData: { temp: 'Y' }
        }, function (res, data) {
            $("#editor_image_box_" + n).show();
            $.each(data, function (e, tmp) {
                if (tmp.error == "" || tmp.error == null) {
                    var url = CDN_UPLOAD_URL + tmp.url;
                    var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><div class="file-add-bg" style="background: url(' + url + ') no-repeat center center;"></div><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
                    $("#editor_image_box_" + n).append(html);
                } else {
                    alert(tmp.error);
                }
            });
        });
    };

    var createHtml = function (page) {
        $personal_qna_wrap = $('._personal_qna_wrap');
        $.ajax({
            type: 'POST',
            data: { page: page },
            url: ('/shop/personal_qna_list.cm'),
            dataType: 'html',
            cache: false,
            success: function (result) {
                $personal_qna_wrap.html(result);
            }
        });
    };

    return {
        init: function () {
            init();
        },
        submit: function (t, type, i) {
            submit(t, type, i);
        },
        Delete: function (code, prod_code) {
            Delete(code, prod_code);
        },
        FormShow: function (t) {
            FormShow(t);
        },
        EditShow: function (t) {
            EditShow(t);
        },
        EditHide: function (t) {
            EditHide(t);
        },
        imageUploadInit: function (n) {
            imageUploadInit(n);
        },
        createHtml: function (page) {
            createHtml(page);
        }
    };
}();
