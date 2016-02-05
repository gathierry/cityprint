colors = ['#d89dd7','#a860c9','#3ebee0','#54c6ca','#62c36c','#a3d900','#f5dc37','#febc06','#ff9cb2','#ffa5b4','#f1bae1'];
currentColorIndex = getServerTime().getDay();
bgInterval = null;
switchTimer = null;
attentionDelay = null;
slogan = "a c for your team".split("");
j=0;
viewWidth = 1002;

var ie = function () {
    var v = 4, //原作者的此处代码是3，考虑了IE5的情况，我改为4。
        div = document.createElement('div'),
        i = div.getElementsByTagName('i');
    do {
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
    } while (i[0]);
    return v > 5 ? v : false; //如果不是IE，之前返回undefined，现改为返回false。
}();
time = ie?0:600;

$(document).ready(function() {
    loginLoad();
    $(window).resize(function() {
        loginInit();
    });
    if(window.location.hash.substring(1,9) == 'register'){
    	switchLoginRegister();
    }
	
	$sceneViewportLis = $('#colorwork-scene .scene-viewport li');
	carouselInterval = startViewCarousel();
	
	$('.scene-viewport,.scene-nav').on('mouseover',function(){
		if(carouselInterval){
			clearInterval(carouselInterval);
			carouselInterval = null;
		}
	});					
	
	$('.scene-viewport, .scene-nav').on('mouseout',function(){
		if(!carouselInterval){
			carouselInterval = startViewCarousel();
		}
	});

	$('.scene-nav li a').click(function(){
		if(!$(this).hasClass('nav-active')){
			var x0 = parseInt($('#colorwork-scene .scene-nav li a').filter('.nav-active').html());
			var x = parseInt($(this).html());
			moveToView(x<x0?x+4:x);
		}
	});
});

function loginLoad(){
	//判断浏览器大小加载
	loginInit();
	hookEvent(window.document, 'keydown', submitController);
	hookEvent(window.document,'mouseover',closeLocaleMenu);
	hookEvent(window.document,'click',lightUpInput);
	$("#colorwork-scene, #main-container").css('background-color',colors[currentColorIndex]);
	addClass("main-container","container-animation");
	setShow("login");
	setTimeout(function(){removeClass("login-box","login-box-before-init")},20);
	setTimeout(function(){changeBackgroundColor();},100);
	setTimeout(function(){removeClass("switcher","switcher-before-init")},600);
	setTimeout(function(){showSlogan()},1500);
	var loginEmail = document.getElementById('login-email');
	var email = getQueryString('email');
	if(email){
		loginEmail.value = email;
		hidePlaceholder(loginEmail);
	}
	loginEmail.focus();
}

function loginInit(){
	if(window.innerHeight) { // all except IE
		var width = window.innerWidth;
		var height = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		// IE 6 Strict Mode
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
	} else if (document.body) { // other
		var width = document.body.clientWidth;
		var height = document.body.clientHeight;
	}
	
	if(height<650){
		document.getElementById("login").className = "small-screen";
		//document.getElementById("footer").style.height= height - 100 - 350 < 90? "90px":height - 100 - 350+"px";
	}
	else if(height>=650&&height<800){
		document.getElementById("login").className = "normal-screen";
		//document.getElementById("footer").style.height= height - 120 - 420 < 90? "90px":height - 120 - 420+"px";
	}
	else{
		document.getElementById("login").className = "large-screen";
		//document.getElementById("footer").style.height= height - 140 - 490 < 90? "90px":height - 140 - 490+"px";
	}
	
	if(width < viewWidth) document.getElementById("login").style.width = viewWidth + "px";
	else document.getElementById("login").style.width = "";
}

//写成了回调形式的函数
function showSlogan(){
	if(j<slogan.length){
		if(slogan[j]=='c'){
			cloud = document.createElement("span");
			addClass(cloud,"cloud");
			cloud.innerHTML = slogan[j];
			document.getElementById('slogan-content').appendChild(cloud);
		}	
		else
			document.getElementById('slogan-content').innerHTML += slogan[j];
		j++;
		setTimeout(function(){showSlogan();},150);
	}
}

//增加0s的延迟使得key已经被输入，再判断内容。
function hidePlaceholder(element){
	setTimeout(function(){
		label = element.nextElementSibling?element.nextElementSibling:element.nextSibling.nodeType==3?element.nextSibling.nextSibling:element.nextSibling;
		if (label==null) return;
		if(hasContent(element.value)){
			setHide(label);
			stopBackgroundColor();
		}
		else
			setShow(label);
	},0);
}

function changeBackgroundColor(){
	if(bgInterval==null)
		bgInterval = setInterval(function(){
			currentColorIndex = currentColorIndex < colors.length? currentColorIndex + 1 : 0; 	
			$("#colorwork-scene, #main-container").css('background-color',colors[currentColorIndex]);
		},2000);
}

function stopBackgroundColor(){
	if(bgInterval!=null){
		clearInterval(bgInterval);
		bgInterval=null;
	}
}

function switchLoginRegister(){
	if(switchTimer!=null) clearTimeout(switchTimer);
	if(hasClass('login-box','in-place')){
		setShow('register-box');
		setTimeout(function(){
			removeClass('login-box','in-place');
			removeClass('slogan-content','slogan-in-place');
			addClass('register-box','in-place');
			addClass('switch-arrow','to-right');
			document.getElementById('switch-label').innerHTML = dic['login'];
			if(hasContent(document.getElementById("login-email").value)){
					document.getElementById("register-email").value = document.getElementById("login-email").value;
					hidePlaceholder(document.getElementById("register-email"));
			}
			switchTimer = setTimeout(function(){
				setHide('login-box');
				document.getElementById("register-name").focus();
			},time);
		},20);
	}
	else{
		setShow('login-box');
		setTimeout(function(){
			removeClass('register-box','in-place');
			addClass('login-box','in-place');
			addClass('slogan-content','slogan-in-place');
			removeClass('switch-arrow','to-right');
			document.getElementById('switch-label').innerHTML = dic['register'];
			if(hasContent(document.getElementById("register-email").value)){
					document.getElementById("login-email").value = document.getElementById("register-email").value;
					hidePlaceholder(document.getElementById("login-email"));
			}
			switchTimer = setTimeout(function(){
				setHide('register-box');
				document.getElementById('login-email').focus();
			},time);
		},20);
	}
}

function showAttention(attentionBar,content){
	if(attentionDelay!=null)
		clearTimeout(attentionDelay);
	attentionBar.innerHTML = content;
	setShow(attentionBar);
	//display the attention bar though hide under css3 browser, wait 20ms
	attentionDelay = setTimeout(function(){
				//show attention for 2s
				removeClass(attentionBar,"attention-hide");
				attentionDelay = setTimeout(function(){
							addClass(attentionBar,"attention-hide");
							attentionDelay = setTimeout(function(){
										setHide(attentionBar);
									},time);
						},5000);
			},20);
}

function isEmail(email){
	return /^[\w\.\-_\+]+@[\w\.\-_]+(\.\w{2,3})+$/.test(email);
}

function isContainerChild(target, container) {
	if (target == container) return true;
	while (target = target.parentNode) if (target == container) return true;
	return false;
}

function openForgetLink(){
	var email = document.getElementById('login-email').value;
	setCookie('email',email,1);
	window.location = "/forget_password";
}

function closeLocaleMenu(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	if(!isContainerChild(target,document.getElementById("locale")))
		removeClass('locale-menu','open');
}

function lightUpInput(e){
	input = hasClass('login-box','in-place')?document.getElementById('login-box'):document.getElementById('register-box');
	e = e || window.event;
	var target = e.target || e.srcElement;
	if(isContainerChild(target,input))
		addClass(input,"box-selected");
	else
		removeClass(input,"box-selected");
}

function startViewCarousel(){
	return setInterval(moveToNext,5000);
}

function moveToNext(){
	var x0 = parseInt($('#colorwork-scene .scene-nav li a').filter('.nav-active').html());
	moveToView(x0+1);
}

function moveToView(x){
	var $navdots = $('#colorwork-scene .scene-nav li a');
	var x0 = parseInt($navdots.filter('.nav-active').html());
	var count = 0; 
	$sceneViewportLis.animate({
								"left": "-=" + viewWidth*(x-x0)
							}, {duration:1000,complete:function(){
												count++;
												if(count == 4){
													for(var i = x0;i < x; i++){
														$($sceneViewportLis[(i-1)%4]).css("left","+=" + viewWidth*4);
													}
													$($navdots[x0-1]).removeClass('nav-active');
													$($navdots[(x-1)%4]).addClass('nav-active');
												}
											}
								});
}

//====================================AJAX===============================================
function getXmlHttpObject(){
	var xmlHttp=null;
	try{ // Firefox, Opera 8.0+, Safari
	xmlHttp=new XMLHttpRequest();
	}catch (e){// Internet Explorer
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e){
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}

function submitController(e){
	var key = e.which || e.keyCode;
	if(key!=13) return;
	if(hasClass("login-box","in-place"))
		submitLogin();
	else
		submitRegister();
} 

function submitLogin(){
	var email = document.getElementById("login-email").value;
	var password = document.getElementById("login-password").value;
	var button = document.getElementById("login-btn");
	var isAutoLogin = document.getElementById("remember-me").checked;
	var attention = document.getElementById("login-attention");
	
	if(!hasContent(email)){
		showAttention(attention,dic["noEmail"]);
		return;
	}else if(!hasContent(password)){
		showAttention(attention,dic["noPassword"]);
		return;
	}else if(!isEmail(email)){
		showAttention(attention,dic["wrongEmail"]);
		return;
	}
	
	button.disabled = true;
	button.innerHTML = dic['pleaseWait'];

	var Data= "Email="+escape(encodeURIComponent(email))+"&Password="+escape(encodeURIComponent(password))+"&isAutoLogin="+escape(encodeURIComponent(isAutoLogin));
	xmlHttp=getXmlHttpObject();
	xmlHttp.open("POST", "/login/check", true);
	xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded"); 
	xmlHttp.send(Data);
	xmlHttp.onreadystatechange = function () {
		if(xmlHttp.readyState == 4){ 
			if (xmlHttp.status == 200){
				var res = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res["errcode"] == 100){
					var url=getCallbackUrl('url');
					if(url!='')
						location.href=url;
					else
						location.href="./";
				}else{
					if(res["errcode"]==108)
						showAttention(attention,dic["notExistEmail"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic['goRegisterColorwork']+"</span>");
					else
						showAttention(attention,dic["mismatchPassword"]);
					
					button.disabled = false;
					button.innerHTML = dic['login'];
				}
			}
		}
	}
}

function getCallbackUrl() {
	var url = location.href;
    var k = url.indexOf('url=');
    if( -1 == k) {
        return '';
    }
    else {
        return url.substr(k+4);
    }
}

function submitRegister(){
	var username = document.getElementById("register-name").value;
	var email = document.getElementById("register-email").value;
	var password = document.getElementById("register-password").value;
	var button = document.getElementById("register-btn");
	if(document.getElementById("register-code")){
		var code = document.getElementById("register-code").value;
	}
	var attention = document.getElementById("register-attention");
	if(!hasContent(username)){
		showAttention(attention,dic["emptyName"]);
		return;
	}else if(!hasContent(email)){
		showAttention(attention,dic["noEmail"]);
		return;
	}else if(!hasContent(password)){
		showAttention(attention,dic["noPassword"]);
		return;
	}else if(password.length>16||password.length<6){
		showAttention(attention,dic["wrongPasswordLength"]);
		return;
	}else if(!isEmail(email)){
		showAttention(attention,dic["wrongEmail"]);
		return;
	}else if(!hasClass("code-box","hide")){
		if(!hasContent(code)){
			showAttention(attention,dic["pleaseEnterVericode"]);
			return;
		}
	}
	
	button.disabled = true;
	button.innerHTML = dic['pleaseWait'];
	
	var Data= "username="+escape(encodeURIComponent(username))+"&email="+escape(encodeURIComponent(email))+"&password="+escape(encodeURIComponent(password))+"&telephone="+escape(encodeURIComponent(""));
	Data += hasClass("code-box","hide")?"" : "&code="+escape(encodeURIComponent(code));
	
	xmlHttp=getXmlHttpObject();
	xmlHttp.open("POST", "/register/submit", true);
	xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded"); 
	xmlHttp.send(Data);
	xmlHttp.onreadystatechange = function () {
		if(xmlHttp.readyState == 4){ 
			if (xmlHttp.status == 200){
				var res = xmlHttp.responseText;
				res = eval('('+res+')');
				if (res["errcode"]==100){
					var url=getCallbackUrl('url');
					if(url!='')
						location.href=url;
					else
						location.href="./";
				}
				else{
					if (res["errcode"]==110){
						showAttention(attention,dic["alreadyUsedEmail"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic['login']+"</span>");
					}
					else{
						if(res["errcode"] == 109)
							showAttention(attention,dic["wrongVericode"]);
						else if(res["errcode"] == 115){
							showAttention(attention,dic["pleaseEnterVericode"]);
							verifyCode = new Image();
							verifyCode.className = "verify-code";
							verifyCode.id="verify-code";
							verifyCode.title=dic["changeVericode"];
							verifyCode.onclick=function(){verifyCode.src = "/verify_code?" + Math.random()};
							document.getElementById("code-box").appendChild(verifyCode);
							setShow("code-box");
						}
						verifyCode.src = "/verify_code";
					}
					button.disabled = false;
					button.innerHTML = dic["registerColorwork"];
				}
			}
		}
	}
}

function checkCode(){
	var checknum = document.getElementById("register-code").value;
	var attention = document.getElementById("register-attention");
	
	if(!/^\d{4}$/.test(checknum)){
		showAttention(attention,dic["wrongVericode"]);
		return;
	}
	var Data="checknum="+escape(encodeURIComponent(checknum));
	xmlHttp=getXmlHttpObject();
	xmlHttp.open("POST", "/register/checkcode", true);
	xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded"); 
	xmlHttp.send(Data);
	xmlHttp.onreadystatechange = function () {
		if(xmlHttp.readyState == 4){ 
			if (xmlHttp.status == 200){
				var res = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res["errcode"] == 109)
					showAttention(attention,dic["wrongVericode"]);
			}
		}
	}
}

function checkEmailExist(){
	var isLoginBox = hasClass("login-box","in-place");
	var email = isLoginBox?document.getElementById('login-email').value:document.getElementById('register-email').value;
	var attention = isLoginBox?document.getElementById("login-attention"):document.getElementById("register-attention");
	
	if(!isEmail(email)){
		showAttention(attention,dic["wrongEmail"]);
		return;
	}
	var Data="email="+escape(encodeURIComponent(email));
	xmlHttp=getXmlHttpObject();
	xmlHttp.open("POST", "/register/checkemail", true);
	xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded"); 
	xmlHttp.send(Data);
	xmlHttp.onreadystatechange = function () {
		if(xmlHttp.readyState == 4){ 
			if (xmlHttp.status == 200){
				var res = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res["errcode"] == 100&&isLoginBox)
					showAttention(attention,dic["notExistEmail"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic['goRegisterColorwork']+"</span>");
				else if(res["errcode"] == 110&&!isLoginBox)
					showAttention(attention,dic["alreadyUsedEmail"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic['login']+"</span>");
			}
		}
	}
}