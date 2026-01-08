(function(modules) {
	'use strict';

	const { root, document, $ } = modules;

	const utils = (function() {
		const http = (url, params = undefined) => {
			return new Promise((resolve, reject) => {
				$.ajax({
					url,
					data: params,
					cache: false,
					async: true,
					type: 'POST',
					dataType: 'json',
					success: function(res) {
						const isSuccess = res.msg === 'SUCCESS';

						if (!isSuccess) {
							return reject(res);
						}

						resolve(res);
					},
				});
			});
		}

		const bind = (instance, fn) => {
			return function(...args) {
				fn.call(instance, ...args);
			};
		}

		const isLogin = () => {
			/**
			 * 로그인 여부 체크
			 * @ref FO, global_vars.sub
			 */
			return !window.IS_GUEST;
		}

		const getMemberHash = () => {
			/**
			 * 해싱된 멤버 키
			 * @ref FO, global_vars.sub
			 */
			return window.MEMBER_HASH;
		}

		return { http, bind, isLogin, getMemberHash };
	})();

	const localize = (function() {
		const 타이틀_최근본상품 = () => {
			return getLocalizeString('타이틀_최근본상품', undefined, '최근 본 상품');
		}

		return { 타이틀_최근본상품 };
	})();

	const cookie = (function() {
		const get = (key) => {
			return `; ${document.cookie}`
				.split(`; ${key}=`)[1]
				?.split(';')[0] ?? null;
		}

		const has = (key) => {
			return get(key) !== null;
		}

		const set = (key, value = '', maxAge = undefined) => {
			document.cookie = `${key}=${value}; path=/;${maxAge ? ` max-age=${maxAge}` : ''}`;
		}

		const remove = (key) => {
			document.cookie = `${key}=''' path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		}

		return { get, has, set, remove };
	})();

	const keyStore = (function() {
		const PREFIX = '_rp';
		const SEPARATOR = '_';

		const generateCacheExpiresKey = () => {
			return [PREFIX, 'c', utils.getMemberHash()].join(SEPARATOR);
		}

		const generateMemberKeyByMemberHash = () => {
			return [PREFIX, 'm', utils.getMemberHash()].join(SEPARATOR);
		}

		return {
			CACHE_KEY: generateCacheExpiresKey(),
			MEMBER_KEY: generateMemberKeyByMemberHash(),
		};
	})();

	const apis = (function() {
		const CONSTANTS = {
			HTTP_ERROR_CODE: {
				NOT_ENABLED_SITE: 'not enabled site',
				NEED_TO_LOGIN: 'need to login',
				FAIL_TO_SEARCH: 'Fail to Search',
			},
		};

		const getRecentProducts = async () => {
			try {
				const res = await utils.http('/ajax/shop/get_recent_view_prod_list.cm');

				return res['recent_view_prod_list'];
			} catch (e) {
				const errorCode = e.message;

				/** 조회 실패인 경우, 빈 배열 처리 */
				if (errorCode === CONSTANTS.HTTP_ERROR_CODE.FAIL_TO_SEARCH) {
					return [];
				}

				throw e;
			}
		}

		return { getRecentProducts };
	})();

	const cache = (function() {
		const MAX_READ_COUNT = 5;
		const MAX_CACHE_COUNT = 100;

		const storage = window.localStorage;

		const encode = (source) => {
			return btoa(encodeURIComponent(source));
		}

		const decode = (source) => {
			return decodeURIComponent(atob(source));
		}

		const isExpires = () => {
			return !cookie.has(keyStore.CACHE_KEY);
		}

		const isEmpty = () => {
			return get().length === 0;
		}

		const get = () => {
			try {
				const currentRecentProducts = storage.getItem(keyStore.MEMBER_KEY);

				if (currentRecentProducts === null) {
					return [];
				}

				return JSON.parse(decode(currentRecentProducts)) ?? [];
			} catch (e) {
				return [];
			}
		}

		const set = (recentProducts) => {
			storage.setItem(keyStore.MEMBER_KEY, encode(JSON.stringify(recentProducts)));
		}

		const clear = () => {
			storage.removeItem(keyStore.MEMBER_KEY);

			cookie.remove(keyStore.CACHE_KEY);
		}

		const has = (recentProdeucts, targetRecentProduct) => {
			return recentProdeucts.some(recentProduct => recentProduct.code === targetRecentProduct.code);
		}

		const read = () => {
			if (isExpires()) {
				return [];
			}

			return get().slice(0, MAX_READ_COUNT);
		}

		const write = (recentProducts) => {
			set(recentProducts.slice(0, MAX_CACHE_COUNT));

			/** 데이터가 수정된 경우 cache 시간 증가(1시간) */
			cookie.set(keyStore.CACHE_KEY, '1', 60 * 60);
		}

		const add = (recentProducts) => {
			const currentRecentProducts = get();

			const targetRecentProducts = recentProducts.reduce((acc, cur) => {
				if (has(currentRecentProducts, cur)) {
					return acc;
				}

				acc.push(cur);

				return acc;
			}, []);

			write([
				...targetRecentProducts,
				...currentRecentProducts,
			]);
		}

		return {
			isExpires,
			isEmpty,
			clear,
			read,
			write,
			add,
		};
	})();

	const renderer = (function () {
		const CONSTANTS = {
			ROOT: 'recent-product-root',
		};

		const refine = (strings) => {
			return strings.map(string => string.replace(/[\r\n\t]+/g, '').trim());
		}

		const combine = (chunks, args) => {
			return chunks.reduce((acc, cur, index) => `${acc}${cur}${args[index] ?? ''}`, '');
		}

		const html = (tags, ...args) => {
			return combine(refine(tags), refine(args));
		}

		const createContentHtml = (children) => {
			return html`
				<div class="recent-product">
					<div class="recent-product__inner">
						<p class="recent-product__title">${localize.타이틀_최근본상품()}</p>
						${children}
					</div>
				</div>
			`;
		}

		const createProductItemContainerHtml = (children) => {
			return html`
				<div class="recent-product__item-container">
					${children}
				</div>
			`;
		}

		const createProductItemHtml = (product) => {
			return html`
				<a class="recent-product__item-root" href="${product.link_url}" data-code="${product.code}">
					<div class="recent-product__item-img-wrapper">
						<img src="${product.thumbnail}" alt="${product.name}" class="recent-product__item-img" />
					</div>
					<p class="recent-product__item-name">${product.name}</p>
				</a>
			`;
		}

		const createRootElement = () => {
			const $root = document.createElement('div');

			$root.setAttribute('id', CONSTANTS.ROOT);

			$root.style.setProperty('display', 'contents');

			return $root;
		}

		const render = (products) => {
			const $root = createRootElement();
			const recentProductsHtml = createContentHtml(
				createProductItemContainerHtml(
					products.map(product => createProductItemHtml(product)).join(''),
				),
			);

			$root.innerHTML = recentProductsHtml;

			document.body.appendChild($root);
		}

		const destroy = () => {
			const $root = document.getElementById(CONSTANTS.ROOT);

			if ($root) {
				$root.remove();
			}
		}

		return { render, destroy };
	})();

	function RecentProduct() {
		this.recentProductQueue = [];
		this.mount = false;
	}

	RecentProduct.prototype.isNonMember = function() {
		return !utils.isLogin();
	}

	RecentProduct.prototype.enqueueRecentProduct = function(recentProduct) {
		this.recentProductQueue.push(recentProduct);
	}

	RecentProduct.prototype.clearRecentProductQueue = function() {
		this.recentProductQueue = [];
	}

	RecentProduct.prototype.hasRecentProductQueue = function() {
		return this.recentProductQueue.length !== 0;
	}

	RecentProduct.prototype.isEmpty = function(recentProducts) {
		return recentProducts.length === 0;
	}

	RecentProduct.prototype.prepare = async function() {
		/** 만료 되었을 경우 clear */
		if (cache.isExpires()) {
			cache.clear();

			const recentProducts = await apis.getRecentProducts();

			cache.write(recentProducts);
		}

		/** 상품 상세에서 데이터를 추가한 경우, 캐시에 저장 */
		if (this.hasRecentProductQueue()) {
			cache.add(this.recentProductQueue);

			this.clearRecentProductQueue();
		}
	}

	RecentProduct.prototype.getRecentProducts = async function() {
		return cache.read();
	}

	RecentProduct.prototype.show = async function() {
		if (this.mount) {
			return;
		}

		this.mount = true;

		try {
			await this.prepare();

			const recentProducts = await this.getRecentProducts();

			if (this.isEmpty(recentProducts)) {
				return;
			}

			renderer.destroy();
			renderer.render(recentProducts);
		} catch (e) {
			console.error(e.message);
		}
	}

	RecentProduct.prototype.refresh = async function() {
		if (!this.mount) {
			return;
		}

		try {
			renderer.destroy();

			await this.prepare();

			const recentProducts = await this.getRecentProducts();

			if (this.isEmpty(recentProducts)) {
				return;
			}

			renderer.render(recentProducts);
		} catch (e) {
			console.error(e.message);
		}
	}

	const recentProduct = new RecentProduct();

	const plugin = function() {}

	plugin.show = utils.bind(recentProduct, function() {
		if (this.isNonMember()) {
			return;
		}

		this.show();
	});

	plugin.refresh = utils.bind(recentProduct, function() {
		if (this.isNonMember()) {
			return;
		}

		this.refresh();
	});

	plugin.enqueueRecentProduct = utils.bind(recentProduct, function(recentProduct) {
		if (this.isNonMember()) {
			return;
		}

		this.enqueueRecentProduct(recentProduct);
	});

	root.RECENT_PRODUCT = plugin;
})(function(root) {
	const modules = {
		root,
		document: root.document,
		$ : root.$,
	};

	return modules;
}(window));