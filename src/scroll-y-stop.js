/**
 * ScrollStop module
 * @author Eiji Kuroda
 * @license Apache-2.0
 * Stop Scrolling when the target element appear in viewport.
 */
/* globals $sf , __PRODUCTION__ */
export default class ScrollStop{

  constructor(elm, sleep, limit = 1){
    this._elm = elm;
    this._sleep = sleep;
    this._limit = limit;
    if(typeof __PRODUCTION__ === 'undefined'){
      this._log = (msg) => window.console.log(msg);
    }else{
      this._log = (msg) => {return;};
    }
    this._observerListener = (evt) => this._observer(evt);
    this._scrollListener = (evt) => this._preventDefault(evt);
    this._stopping = false;
    this._setObservers();
    this._lastIsInview = this._isInview();
    this._y = 0;
    if(window.Modernizr && window.Modernizr.passiveeventlisteners){
      this._listener_opt = {passive: true};
    }else{
      this._listener_opt = false;
    }
  }

  _setObservers(){
    this._log('_setObservers');
    window.addEventListener('scroll', this._observerListener, this._listener_opt);
    window.addEventListener('wheel', this._observerListener, this._listener_opt);
    window.addEventListener('touchmove', this._observerListener, this._listener_opt);
    window.addEventListener('touchstart', this._observerListener, this._listener_opt);
    this._interval = window.setInterval(this._observerListener, 500);
  }

  _removeObservers(){
    this._log('_removeObservers');
    window.removeEventListener('scroll', this._observerListener, this._listener_opt);
    window.removeEventListener('wheel', this._observerListener, this._listener_opt);
    window.removeEventListener('touchmove', this._observerListener, this._listener_opt);
    window.removeEventListener('touchstart', this._observerListener, this._listener_opt);
    window.clearInterval(this._interval);
  }

  _observer(evt){
    if(this._stopping || this._lastIsInview === this._isInview()){
      return;
    }
    this._lastIsInview = this._isInview();
    if(this._lastIsInview && this._limit > 0){
      let msec = this._sleep * 1000;
      this._disableScroll(msec).then(() => this._enableScroll());
      this._lastIsInview = true;
      this._limit -= 1;
      this._log('Remain Stop Count : ' + this._limit);
    }
    if(this._limit <= 0){
      this._elm.dispatchEvent(new Event('scrollStopCanceled', {bubbles: true}));
      this._removeObservers();
    }
  }

  _isInview(){
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

  _preventDefault(evt){
    this._log('_preventDefault');
    evt.preventDefault();
    evt.returnValue = false;
  }

  _disableScroll(sleep){
    this._log('_disableScroll sleep:' + sleep + 'ms');
    this._y = this._y > 0 ? this._y : window.scrollY;
    window.scrollTo(window.scrollX, this._y);
    this._request = null;
    var disableScrollByRAF = () => {
      window.scrollTo(window.scrollX, this._y);
      this._request = window.requestAnimationFrame(disableScrollByRAF);
    };
    this._request = window.requestAnimationFrame(disableScrollByRAF);
    window.addEventListener('wheel', this._scrollListener, false);
    window.addEventListener('touchmove', this._scrollListener, false);
    this._stopping = true;
    this._elm.dispatchEvent(new Event('scrollDisabled', {bubbles: true}));
    return new Promise(function(resolve, reject){
      setTimeout(resolve, sleep);
    });
  }

  _enableScroll(){
    this._log('_enableScroll');
    window.cancelAnimationFrame(this._request);
    this._y = 0;
    window.removeEventListener('wheel', this._scrollListener, false);
    window.removeEventListener('touchmove', this._scrollListener, false);
    this._stopping = false;
    this._elm.dispatchEvent(new Event('scrollEnabled', {bubbles: true}));
  }

}
