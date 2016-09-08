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
/***/ function(module, exports) {

	/**
	 * ScrollStop module
	 * @author Eiji Kuroda
	 * @license Apache-2.0
	 * Stop Scrolling when the target element appear in viewport.
	 */
	/* globals $sf , __PRODUCTION__ */
	var ScrollStop = function ScrollStop(elm, sleep, limit){
	  var __ = this;
	
	  __.setObservers = function(){
	    __.log('_setObservers');
	    window.addEventListener('scroll', __.observer, __.listenerOpt);
	    window.addEventListener('wheel', __.observer, __.listenerOpt);
	    window.addEventListener('touchmove', __.observer, __.listenerOpt);
	    window.addEventListener('touchstart', __.observer, __.listenerOpt);
	    __.interval = window.setInterval(__.observer, 500);
	  };
	
	  __.removeObservers = function(){
	    __.log('_removeObservers');
	    window.removeEventListener('scroll', __.observer, __.listenerOpt);
	    window.removeEventListener('wheel', __.observer, __.listenerOpt);
	    window.removeEventListener('touchmove', __.observer, __.listenerOpt);
	    window.removeEventListener('touchstart', __.observer, __.listenerOpt);
	    window.clearInterval(__.interval);
	  };
	
	  __.observer = function(evt){
	    if(__.stopping || __.lastIsInview === __.isInview()){
	      return;
	    }
	    __.lastIsInview = __.isInview();
	    if(__.lastIsInview && __.limit > 0){
	      var msec = __.sleep * 1000;
	      __.disableScroll(msec).then(function(){__.enableScroll();});
	      __.lastIsInview = true;
	      __.limit -= 1;
	      __.log('Remain Stop Count : ' + __.limit);
	    }
	    if(__.limit <= 0){
	      __.elm.dispatchEvent(new Event('scrollStopCanceled', {bubbles: true}));
	      __.removeObservers();
	    }
	  };
	
	  __.isInview = function(){
	    __.log('_isInview');
	    var stageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	    var bounds = __.elm.getBoundingClientRect();
	    var top = bounds.top;
	    var bottom = bounds.top + bounds.height;
	    __.log('top:' + top + ',bottom:' + bottom + ', stageHeight:' + stageHeight);
	    var isInview = top >= 0 && bottom < stageHeight;
	    __.log('isInview : ' + isInview);
	    return isInview;
	  };
	
	  __.preventDefault = function(evt){
	    __.log('_preventDefault');
	    evt.preventDefault();
	    evt.returnValue = false;
	  };
	
	  __.disableScroll = function(_sleep){
	    __.log('_disableScroll sleep:' + _sleep + 'ms');
	    __.y = __.y > 0 ? __.y : window.scrollY;
	    window.scrollTo(window.scrollX, __.y);
	    __.request = null;
	    var disableScrollByRAF = function(){
	      window.scrollTo(window.scrollX, __.y);
	      __.request = window.requestAnimationFrame(disableScrollByRAF);
	    };
	    __.request = window.requestAnimationFrame(disableScrollByRAF);
	    window.addEventListener('wheel', __.preventDefault, false);
	    window.addEventListener('touchmove', __.preventDefault, false);
	    __.stopping = true;
	    __.elm.dispatchEvent(new Event('scrollDisabled', {bubbles: true}));
	    return new Promise(function(resolve, reject){
	      setTimeout(resolve, _sleep);
	    });
	  };
	
	  __.enableScroll = function(){
	    __.log('_enableScroll');
	    window.cancelAnimationFrame(__.request);
	    __.y = 0;
	    window.removeEventListener('wheel', __.preventDefault, false);
	    window.removeEventListener('touchmove', __.preventDefault, false);
	    __.stopping = false;
	    __.elm.dispatchEvent(new Event('scrollEnabled', {bubbles: true}));
	  };
	
	  /** */
	  (function init(){
	    __.elm = elm;
	    __.sleep = sleep;
	    __.limit = limit;
	    if(typeof __PRODUCTION__ === 'undefined'){
	      __.log = function(msg){window.console.log(msg);};
	    }else{
	      __.log = function(msg){return;};
	    }
	    __.stopping = false;
	    __.setObservers();
	    __.lastIsInview = __.isInview();
	    __.y = 0;
	    if(window.Modernizr && window.Modernizr.passiveeventlisteners){
	      __.listenerOpt = {passive: true};
	    }else{
	      __.listenerOpt = false;
	    }
	  })();
	
	  return __;
	};
	
	module.exports = ScrollStop;


/***/ }
/******/ ]);
//# sourceMappingURL=scroll-y-stop.js.map