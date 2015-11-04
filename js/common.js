/**
 * common.js
 * @author jch
 */

var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
//event bind
function addEvevt(obj, type, fn) {
	if(obj.addEventListener) obj.addEventListener(type, fn, false);
	else if(obj.attachEvent) obj.attachEvent('on' + type, fn);
	else obj['on' + type] = fn;
}

//获得dom
function $$(Dom) {
	return document.getElementById(Dom);
}

//优化动画
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();