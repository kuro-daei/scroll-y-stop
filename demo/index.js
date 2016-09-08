/**
 * ScrollStop trigger function
 * @author Eiji Kuroda
 * @license Apache-2.0
 * Stop Scrolling when the target element appear in viewport.
 */

// import ScrollStop from './scroll-y-stop.js';

var ScrollStop = require('../index.js');

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
