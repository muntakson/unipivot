/**
 * Gambit Smooth Scroll Javascript Library
 * Author Benjamin Intal - Gambit Technologies Inc
 * Version 3.2
 * License: Proprietary, Gambit Technologies Inc.
 */

/* globals GambitSmoothScroll, safari */

( function() {

	this.GambitSmoothScroll = function( settings ) {

		var key;
		var defaults = {
			'amount': 150,
			'speed': 900,
			'force': 10
		};

		if ( 'undefined' === typeof settings ) {
			settings = {};
		}

		for ( key in defaults ) {
			if ( ! settings.hasOwnProperty( key ) ) {
				settings[ key ] = defaults[ key ];
			}
		}

		// Disable in mobile because we don't need smooth scrolling there
		if ( navigator.userAgent.match( /Mobi|Android/ ) ) {
			return;
		}

		this.settings = settings;
		this.startedAsTrackpad = false;
		this.start();
	};

	/**
	 * Finds the element with differing scroll height and client height (and unwanted classes). If it fails, return false.
	 */
	GambitSmoothScroll.prototype.parent_scroll = function( el ) {

		var styles;

		// Keep looping while the scroll height and client height is equal, or the element has the wpb_wrapper class.
		while ( 'BODY' !== el.tagName && 'HTML' !== el.tagName ) {

			styles = getComputedStyle( el );
			if ( el.scrollHeight > el.clientHeight && 'hidden' !== styles.overflowY && 'visible' !== styles.overflowY ) {
				return el;
			}

			el = el.parentNode;
		}
		return false;
	};

	/**
	 * Start our plugin
	 */
	GambitSmoothScroll.prototype.start = function() {
		document.addEventListener( 'DOMContentLoaded', function() {
			window.addEventListener( 'wheel', this.overrideScroll.bind( this ), {passive: false} );
		}.bind( this ) );
	};

	/**
	 * Stops the current scroll
	 */
	GambitSmoothScroll.prototype.stop = function() {
		if ( 'undefined' !== typeof this.scrollInterval ) {
			this.startedAsTrackpad = false;
			clearInterval( this.scrollInterval );
			this.scrollInterval = undefined;
		}
	};

	/**
	 * Performs the smooth page scroll
	 *
	 * @param object scrollableElement The DOM element to apply the scroll to. If null, the scroll will be applied in the body.
	 */
	GambitSmoothScroll.prototype.newScroll = function( isDown, scrollableElement, timestamp ) {
		var multiplier;

		// If the scroll went the opposite way, reset the scroll as if from full stop
		if ( isDown !== this.isDown && 'undefined' !== typeof this.isDown ) {
			this.stop();
		}
		this.isDown = isDown;

		// If we have changed scroll targets, then do a full stop.
		if ( this.prevScrollableElement !== scrollableElement ) {
			this.stop();
		}
		this.prevScrollableElement = scrollableElement;

		// If called to scroll from a full stop, create our scroller loop
		if ( 'undefined' === typeof this.scrollInterval ) {

			this.startingSpeed = this.settings.amount;
			this.scrollInterval = setInterval( function() {

				// Perform the scroll
				var scrollBy = ( this.isDown ? 1 : -1 ) * this.startingSpeed / this.settings.force;
				if ( ! scrollableElement ) {
					window.scrollBy( 0, scrollBy );
				} else {
					scrollableElement.scrollTop += scrollBy;
				}

				// Stop the scroller when the scroll becomes too small
				this.startingSpeed *= 1 - ( 900 / this.settings.speed ) / 10; // 0.9;
				if ( Math.abs( scrollBy ) < 1 ) {
					this.stop();
				}

			}.bind( this ), 16.666666667 ); // 60fps

			// If called while the page is still scrolling, add more momentum to the current scroll
		} else {

			// Base the momentum multiplier on the delta time to avoid super fast scrolls
			multiplier = 1 + ( timestamp - this.prevTimestamp ) / 40 * 0.7;

			// Limit the amount
			this.startingSpeed = Math.max( this.startingSpeed * multiplier, this.settings.amount );
			this.startingSpeed = Math.min( this.startingSpeed, 300 );
		}

		this.prevTimestamp = timestamp;
	};

	/**
	 * Stops the default scroll behavior and does our own thing
	 */
	GambitSmoothScroll.prototype.overrideScroll = function( e ) {

		var skipFirefoxMacCheck;

		// Normalize wheel delta scroll
		var delta = e.wheelDelta ? -e.wheelDelta / 120 : ( e.detail || e.deltaY ) / 3;

		// Determine what elements could scroll and see if they do.
		var scrollPercentage, scrollableElement = this.parent_scroll( e.target );

		/**
		 * For some odd reason, Safari 9-10 changed their scroll value, making our plugin think
		 * it is running on trackpads all the time even when it is not.
		 * We should multiply the delta value by 10 to set it right to the recognized values.
		 * Trackpad values are even lower, so this fix should be foolproof, but must be done only on Safari.
		 * This detection code recognizes newer builds of Safari, so this should not affect older Safari builds.
		 */
		var isSafari = ( function( p ) {
			return '[object SafariRemoteNotification]' === p.toString();
		} )( ! window.safari || safari.pushNotification );

		// Add the value for newer Safari browsers.
		if ( isSafari && ( Math.abs( delta ) < 1 ) ) {
			delta *= 10;
		}

		/**
		 * Basically, when we check the delta variable, trackpads give out a value of < 1 && < -1
		 * mouse wheel scrolls give out a value >= 1 || <= -1
		 * We can use this to turn OFF smooth scrolling for trackpads.
		 *
		 * IMPORTANT: Firefox in Mac somehow handles things differently.
		 * the skipCheck variable handles things for FF in Macs
		 */
		// Special for Firefox-Mac
		skipFirefoxMacCheck = false;
		if ( 'undefined' !== typeof window.mozInnerScreenX ) {
			if ( navigator.platform.indexOf( 'Mac' ) !== -1 ) {
				this.startedAsTrackpad = false;
				skipFirefoxMacCheck = true;
				if ( e.deltaY === parseInt( e.deltaY, 10 ) ) {
					this.startedAsTrackpad = true;
					return;
				}
			}
		}


		if ( 'undefined' !== typeof this.trackpadTimeout ) {
			clearTimeout( this.trackpadTimeout );
			this.trackpadTimeout = undefined;
		}

		// If delta is less than 1, assume that we are using a trackpad and do the normal behavior
		if ( ( Math.abs( delta ) < 1 || this.startedAsTrackpad ) && ! skipFirefoxMacCheck ) {

			this.trackpadTimeout = setTimeout( function() {
				this.startedAsTrackpad = false;
				this.trackpadTimeout = undefined;
			}.bind( this ), 200 );

			this.startedAsTrackpad = true;

			return true;
		}

		// If the code reaches here, then scrolling will be smoothened

		// Disable normal scrolling
		e = e || window.event;
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		e.returnValue = false;

		// If we are going to scroll inside an element, check if it ended (scrolling up when at the top or down when at the bottom). If it ended, scroll the body again.
		if ( scrollableElement ) {
			scrollPercentage = ( scrollableElement.scrollTop + scrollableElement.offsetHeight ) / scrollableElement.scrollHeight * 100;

			// Scroll the body instead of this element.
			if ( scrollableElement.scrollTop <= 0 && delta < 0 ) {
				scrollableElement = null;
			} else if ( scrollPercentage >= 100 && delta > 0 ) {
				scrollableElement = null;
			}
		}

		// Perform our own scrolling
		this.newScroll( delta > 0, scrollableElement, e.timeStamp );
	};

}() );