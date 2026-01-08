const SITE_ANIMATION = (() => {
	const body = document.body;
	const widgets = body.querySelectorAll('div[doz_type="widget"]');
	const aniClass = 'ds_animated';

	const init = (dsAnimation, load) => {
		document.addEventListener('DOMContentLoaded', () => {
			startAnimation(dsAnimation, load);
		});
	};

	const addCustomListener = (eventType, element, widgetKey, callback) => {
		const eventName = `${eventType}.${widgetKey}`;
		element.addEventListener(eventType, callback);

		return { eventName, eventType, element, callback };
	};

	const startAnimation = (dsAnimation, load) => {
		widgets.forEach(widget => {
			const widgetData = widget.querySelector('._widget_data');

			if (!widgetData) return; // 위젯이 DB에 없는 경우 리턴

			if (widgetData.classList.contains('_ds_animated_except')) return;

			if (dsAnimation === 'Y') {
				widgetData.classList.add(aniClass);
			} else if (!widgetData.classList.contains('wg_animated')) {
				return;
			}

			const widgetKey = widget.id;

			if (dsAnimation === 'Y' && load === 'Y') {
				scrollAnimation(widget, dsAnimation, "N");
			}

			const onScrollOrResize = () => {
				setTimeout(() => {
					scrollAnimation(widget, dsAnimation, load);
				}, 100);
			};

			// 각각의 이벤트 타입에 대해 리스너 추가
			addCustomListener('load', window, widgetKey, onScrollOrResize);
			addCustomListener('resize', window, widgetKey, onScrollOrResize);
			addCustomListener('scroll', window, widgetKey, onScrollOrResize);
		});
	};

	const scrollAnimation = (widget, dsAnimation, load) => {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const bottomOfWindow = window.scrollY + windowHeight;
		let bottomOfObject = widget.getBoundingClientRect().top + window.scrollY;
		let deviceType = windowWidth < 992 ? 'mobile' : 'pc';

		if (windowWidth <= 1024 && windowWidth >= 767) {
			const offset = widget.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
			bottomOfObject = offset * 0.85;
		}

		// widget의 데이터를 들고 오기 위해 해당 obj 찾기
		let obj = widget.querySelector('._widget_data[data-widget-parent-is-mobile="N"]');
		if (deviceType === 'mobile') {
			obj = widget.querySelector('._widget_data');
		}

		if (!obj) return;

		const wgExceptionType = obj.getAttribute('data-widget-type');

		if (wgExceptionType === "booking") {
			const widgetAnimationDone = obj.getAttribute('data-animation-done');
			if (widgetAnimationDone === 'Y') return; // 이미 애니메이션이 완료된 위젯은 리턴
		}

		const wgAniClass = obj.getAttribute('data-widget-anim');
		const wgAniDuration = obj.getAttribute('data-widget-anim-duration');
		const wgAniDelay = obj.getAttribute('data-widget-anim-delay');

		// widget type 이 icon, button 인 경우 wg_animated 클래스를 찾아야 함
		if (wgExceptionType === 'icon' || wgExceptionType === 'button') {
			obj = deviceType === 'mobile'
				? widget.querySelectorAll('.wg_animated')
				: widget.querySelectorAll('div[data-widget-parent-is-mobile="N"] .wg_animated');
		}

		if (!obj) return;

		const wgData = {
			wgExceptionType,
			wgAniClass,
			wgAniDuration,
			wgAniDelay,
			aniClass,
			dsAnimation
		}

		const attachAnimationEndListener = (element) => {
			// 이미 애니메이션이 완료된 경우 리턴
			if (element.getAttribute('data-animation-done') === 'Y') return;

			if (element.classList.contains('wg_animated')) {
				element.addEventListener('animationend', () => {
					element.classList.remove(wgAniClass);
					element.classList.remove(aniClass);
					element.style.opacity = '1';
					element.setAttribute('data-animation-done', 'Y');
				}, { once: true });
			}
		};

		if (wgExceptionType === 'icon' || wgExceptionType === 'button') {
			obj.forEach(item => {
				animationFunction(item, wgData, bottomOfWindow, bottomOfObject, deviceType, load);
			});
		} else {
			animationFunction(obj, wgData, bottomOfWindow, bottomOfObject, deviceType, load);
			if (wgExceptionType === 'booking') {
				// 에니메이션이 끝나면, 애니메이션 관련된 class 제거
				attachAnimationEndListener(obj);
			}
		}
	};

	const animationFunction = (wgObj, wgData, bottomOfWindow, bottomOfObject, deviceType, load) => {
		if (!wgObj || !wgData) return;

		const { wgExceptionType, wgAniClass, wgAniDuration, wgAniDelay, aniClass, dsAnimation } = wgData;

		if (wgObj.classList.contains('wg_animated')) {
			wgObj.classList.remove(aniClass);
			if (bottomOfWindow > bottomOfObject) {
				wgObj.classList.add(wgAniClass);
				wgObj.style.animationDuration = `${wgAniDuration}s`;
				wgObj.style.webkitAnimationDuration = `${wgAniDuration}s`;
				wgObj.style.animationDelay = `${wgAniDelay}s`;

				if (!wgAniClass.includes('fadeIn')) {
					wgObj.style.opacity = '1';
				}
				wgObj.style.visibility = 'visible';

			} else {
				if (deviceType !== 'mobile' && load !== 'Y') {
					wgObj.classList.remove(wgAniClass);
				}

				if (!wgAniClass.includes('fadeIn')) {
					wgObj.style.opacity = '0';
				}
				wgObj.style.visibility = 'hidden';
			}

		} else {
			if (dsAnimation !== 'Y' || body.classList.contains('shop_mypage')) return;

			if (bottomOfWindow > bottomOfObject) {
				wgObj.classList.add(aniClass);
				if (wgExceptionType === 'code') {
					wgObj.classList.remove(aniClass);
				}
			} else {
				if (deviceType !== 'mobile' && load !== 'Y') {
					wgObj.classList.remove(aniClass);
					wgObj.style.opacity = '0';
					if (wgExceptionType === 'code') {
						wgObj.style.opacity = '1';
					}
				}
			}

			wgObj.style.visibility = 'visible';
		}
	}


	return {
		init: (dsAnimation, load) => {
			init(dsAnimation, load);
		}
	};
})();