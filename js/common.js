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