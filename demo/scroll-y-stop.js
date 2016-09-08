/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ScrollStop trigger function
	 * @author Eiji Kuroda
	 * @license Apache-2.0
	 * Stop Scrolling when the target element appear in viewport.
	 */
	
	// import ScrollStop from './scroll-y-stop.js';
	
	var ScrollStop = __webpack_require__(1).default;
	
	document.addEventListener('DOMContentLoaded', function(){
	  var target = document.querySelector('#target');
	  var ss = new ScrollStop(target, 1.0, 5);
	  target.addEventListener('scrollDisabled', function(){
	    target.style.backgroundColor = '#FFFF00';
	  }, false);
	  target.addEventListener('scrollEnabled', function(){
	    target.style.backgroundColor = '#00FF99';
	  }, false);
	}, false);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * ScrollStop module
	 * @author Eiji Kuroda
	 * @license Apache-2.0
	 * Stop Scrolling when the target element appear in viewport.
	 */
	/* globals $sf , __PRODUCTION__ */
	var ScrollStop = function () {
	  function ScrollStop(elm, sleep) {
	    var _this = this;
	
	    var limit = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	
	    _classCallCheck(this, ScrollStop);
	
	    this._elm = elm;
	    this._sleep = sleep;
	    this._limit = limit;
	    if (typeof __PRODUCTION__ === 'undefined') {
	      this._log = function (msg) {
	        return window.console.log(msg);
	      };
	    } else {
	      this._log = function (msg) {
	        return;
	      };
	    }
	    this._observerListener = function (evt) {
	      return _this._observer(evt);
	    };
	    this._scrollListener = function (evt) {
	      return _this._preventDefault(evt);
	    };
	    this._stopping = false;
	    this._setObservers();
	    this._lastIsInview = this._isInview();
	    this._y = 0;
	    if (window.Modernizr && window.Modernizr.passiveeventlisteners) {
	      this._listener_opt = { passive: true };
	    } else {
	      this._listener_opt = false;
	    }
	  }
	
	  _createClass(ScrollStop, [{
	    key: '_setObservers',
	    value: function _setObservers() {
	      this._log('_setObservers');
	      window.addEventListener('scroll', this._observerListener, this._listener_opt);
	      window.addEventListener('wheel', this._observerListener, this._listener_opt);
	      window.addEventListener('touchmove', this._observerListener, this._listener_opt);
	      window.addEventListener('touchstart', this._observerListener, this._listener_opt);
	      this._interval = window.setInterval(this._observerListener, 500);
	    }
	  }, {
	    key: '_removeObservers',
	    value: function _removeObservers() {
	      this._log('_removeObservers');
	      window.removeEventListener('scroll', this._observerListener, this._listener_opt);
	      window.removeEventListener('wheel', this._observerListener, this._listener_opt);
	      window.removeEventListener('touchmove', this._observerListener, this._listener_opt);
	      window.removeEventListener('touchstart', this._observerListener, this._listener_opt);
	      window.clearInterval(this._interval);
	    }
	  }, {
	    key: '_observer',
	    value: function _observer(evt) {
	      var _this2 = this;
	
	      if (this._stopping || this._lastIsInview === this._isInview()) {
	        return;
	      }
	      this._lastIsInview = this._isInview();
	      if (this._lastIsInview && this._limit > 0) {
	        var msec = this._sleep * 1000;
	        this._disableScroll(msec).then(function () {
	          return _this2._enableScroll();
	        });
	        this._lastIsInview = true;
	        this._limit -= 1;
	        this._log('Remain Stop Count : ' + this._limit);
	      }
	      if (this._limit <= 0) {
	        this._elm.dispatchEvent(new Event('scrollStopCanceled', { bubbles: true }));
	        this._removeObservers();
	      }
	    }
	  }, {
	    key: '_isInview',
	    value: function _isInview() {
	      this._log('_isInview');
	      var stageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	      var bounds = this._elm.getBoundingClientRect();
	      var top = bounds.top;
	      var bottom = bounds.top + bounds.height;
	      this._log('top:' + top + ',bottom:' + bottom + ', stageHeight:' + stageHeight);
	      var isInview = top >= 0 && bottom < stageHeight;
	      this._log('isInview : ' + isInview);
	      return isInview;
	    }
	  }, {
	    key: '_preventDefault',
	    value: function _preventDefault(evt) {
	      this._log('_preventDefault');
	      evt.preventDefault();
	      evt.returnValue = false;
	    }
	  }, {
	    key: '_disableScroll',
	    value: function _disableScroll(sleep) {
	      var _this3 = this;
	
	      this._log('_disableScroll sleep:' + sleep + 'ms');
	      this._y = this._y > 0 ? this._y : window.scrollY;
	      window.scrollTo(window.scrollX, this._y);
	      this._request = null;
	      var disableScrollByRAF = function disableScrollByRAF() {
	        window.scrollTo(window.scrollX, _this3._y);
	        _this3._request = window.requestAnimationFrame(disableScrollByRAF);
	      };
	      this._request = window.requestAnimationFrame(disableScrollByRAF);
	      window.addEventListener('wheel', this._scrollListener, false);
	      window.addEventListener('touchmove', this._scrollListener, false);
	      this._stopping = true;
	      this._elm.dispatchEvent(new Event('scrollDisabled', { bubbles: true }));
	      return new Promise(function (resolve, reject) {
	        setTimeout(resolve, sleep);
	      });
	    }
	  }, {
	    key: '_enableScroll',
	    value: function _enableScroll() {
	      this._log('_enableScroll');
	      window.cancelAnimationFrame(this._request);
	      this._y = 0;
	      window.removeEventListener('wheel', this._scrollListener, false);
	      window.removeEventListener('touchmove', this._scrollListener, false);
	      this._stopping = false;
	      this._elm.dispatchEvent(new Event('scrollEnabled', { bubbles: true }));
	    }
	  }]);
	
	  return ScrollStop;
	}();
	
	exports.default = ScrollStop;

/***/ }
/******/ ]);
//# sourceMappingURL=scroll-y-stop.js.map