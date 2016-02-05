//Mao Yiran 2013.1.22
//全局变量

//通用接口
//0-调试用 打印object的内容 格式：alert(print_r(res["data"]));
function print_r(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += print_r(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

//1-检查对象是否具有类名
function hasClass(element, className){
	element = typeof element == 'object' ? element : document.getElementById(element);
    var pattern = new RegExp("(^| )" + className + "( |$)");
    return element.className.match(pattern); 
}

//2-为对象添加类名
function addClass(element,className){
	element = typeof element == 'object' ? element : document.getElementById(element);
	if(!hasClass(element, className)){
		if(element.className == ""){
            element.className = className;
        }else{
            element.className += " " + className;
        }
	}
}

//3-删除对象类名
function removeClass(element, className) {
	element = typeof element == 'object' ? element : document.getElementById(element);
    if (hasClass(element, className)) {
		var pattern = RegExp("(^| )" + className + "( |$)");
        element.className = element.className.replace(pattern, "$1");
        element.className = element.className.replace(/ $/, "");
	}
}

//4-将对象设置为不可见/可见
function setInvisible(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	addClass(element,'invisible');
}
function setVisible(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	removeClass(element,'invisible');
}

//5-将对象设置为隐藏/显示
function setHide(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	addClass(element,'hide');
}
function setShow(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	removeClass(element,'hide');
}

//6-为对象添加/去除动画
function setAnimated(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	addClass(element,'animated');
}
function setStatic(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	setTimeout(function(){
		removeClass(element,'animated');
	},700);
}

//7-输入框自动适应高度
//完整版 限制最高高度，超过后增加滚动条
/* (function($){
	$.fn['autoTextarea'] = function(options) {
		var defaults={
			maxHeight:null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
			minHeight:$(this).css('height').replace("px","") //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
		};
		var opts = $.extend({},defaults,options);
		return $(this).each(function() {
			$(this).bind("paste cut keydown keyup focus blur",function(){
				var height,style=this.style;
				this.style.height =  opts.minHeight + 'px';
				style.overflowY = 'hidden';
				if (this.scrollHeight > opts.minHeight) {
					if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
						height = opts.maxHeight;
						style.overflowY = 'scroll';
					} else {
						height = this.scrollHeight;
					}
					style.height = height  + 'px';
				}
			});
		});
	};
})(jq); */

//8-检查是否输入框内有内容
function hasContent(content){
	if(content.replace(/^\s+|\s+$/g,"")=='')
		return false;
	return true;
}

//9-改变类名
function changeClass(element,fromClass,toClass){
	element = typeof element == 'object' ? element : document.getElementById(element);
	removeClass(element,fromClass);
	addClass(element,toClass);
}

//10-阻止浏览器冒泡事件
function cancelEvent(e){
	e = e ? e : window.event;
	if(e.stopPropagation)
		e.stopPropagation();
	if(e.preventDefault)
		e.preventDefault();
	e.cancelBubble = true;
	e.cancel = true;
	e.returnValue = false;
	return false;
}

//11-获取图片大小
/* var imgLoad = function(url,imgResize){
	var img = new Image();
	
	img.src = url;
	if(img.complete){
		imgResize(img.width, img.height);
	} else{
		img.onload = function() {
			imgResize(img.width, img.height);
			img.onload = null;
		}
	}
}
 */
 
 //12-添加任意监听器
function hookEvent(element, eventName, callback)  //针对不同浏览器加入事件监听器
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)   //firefox safari Opera 使用 addEventListener
  {
    if(eventName == 'mousewheel')           
      element.addEventListener('DOMMouseScroll', callback, false);  //firefox 
    element.addEventListener(eventName, callback, false); //opera safari
  }
  else if(element.attachEvent)   //IE 使用attachEvent
    element.attachEvent("on" + eventName, callback);
}

//13-解绑任意监听器
function unhookEvent(element, eventName, callback)
{
	if(typeof(element) == "string")
		element = document.getElementById(element);
	if(element == null)
		return;
	if(element.removeEventListener)
	{
		if(eventName == 'mousewheel')
		    element.removeEventListener('DOMMouseScroll', callback, false);  
		element.removeEventListener(eventName, callback, false);
	}
	else if(element.detachEvent)
		element.detachEvent("on" + eventName, callback);
}

//14-获取服务器时间
function getServerTime(){
	var http = new XMLHttpRequest;   
	http.open("HEAD", "1", false);   
	// http.send(null);   
	// return new Date(http.getResponseHeader("Date"));
	return new Date();
}

//15-操作cookie
function delCookie(name){
    if(cval=getCookie(name)){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
}

function setCookie(name,value,days){
    var exp  = new Date();
    exp.setTime(exp.getTime() + days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;
}

//16-为了正确实现跳转，获取当前地址
function getQueryString(name){
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if(location.href.indexOf("?")==-1 || location.href.indexOf(name+'=')==-1) return '';
 
    // 获取链接中参数部分
    var queryString = location.href.substring(location.href.indexOf("?")+1);
 
    // 分离参数对 ?key=value&key2=value2,有可能会有多层?，所以根据?和&切割（临时是否会有其他问题）
    var parameters = queryString.split(/[?&]/);
 
    var pos, paraName, paraValue;
    for(var i=0; i<parameters.length; i++)
    {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if(pos == -1) { continue; }
 
        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
 
        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if(paraName == name)
        {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
}