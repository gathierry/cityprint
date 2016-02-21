"use strict"

var colors = ['#d89dd7','#a860c9','#3ebee0','#54c6ca','#62c36c','#a3d900','#f5dc37','#febc06','#ff9cb2','#ffa5b4','#f1bae1'];
var currentColorIndex = 0;
var bgInterval = null;
var switchTimer = null;
var informationDelay = null;
var time = 600;
var viewWidth = 1002;
var slogan = "Leave footprint on c".split("");
var j = 0;
var dic = { 
      "alreadyUsedUsername":'The username has been signed up',
      "goRegisterCityprint":'Sign up',
      "login":'Sign in',
      "mismatchPassword":'Email or password is incorrect',
      "noConfirmPassword":'Please confirm password',
      "noPassword":'Please enter password',
      "notExistUsername":'The username has not been signed up',
      "noUsername":'Please enter your username',
      "pleaseWait":'Please wait',
      "register":'Sign up',
      "registerCityprint":"Register Cityprint",
      "wrongConfirmPassword":'Please confirm your password correctly',
      "wrongPasswordLength":'Password must contain 6 to 16 characters',
      "wrongUsername":'Please enter correct username',  
}; 

$(document).ready(function() {
    loginLoad();
    $(window).resize(function() {
        loginInit();
    });
});

function loginLoad(){
	loginInit();
	$("#main-body").css('background-color',colors[currentColorIndex]);
	addClass("main-body","body-animation");
	setShow("login");
	setTimeout(function(){removeClass("login-box","login-box-before-init")},20);
	setTimeout(function(){changeBackgroundColor();},100);
	setTimeout(function(){removeClass("switcher","switcher-before-init")},600);
	setTimeout(function(){showSlogan()},1500);
	document.getElementById('login-username').focus();
}

function loginInit(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	if(height<650){
		document.getElementById("login").className = "small-screen";
	}
	else if(height>=650&&height<800){
		document.getElementById("login").className = "normal-screen";
	}
	else{
		document.getElementById("login").className = "large-screen";
	}
	
	if(width < viewWidth) document.getElementById("login").style.width = viewWidth + "px";
	else document.getElementById("login").style.width = "";
}

function changeBackgroundColor(){
	if(bgInterval == null)
		bgInterval = setInterval(function(){
			currentColorIndex = currentColorIndex < colors.length? currentColorIndex + 1 : 0; 	
			$("#main-body").css('background-color',colors[currentColorIndex]);
		},2000);
}

function showSlogan(){
	if(j < slogan.length){
		if(slogan[j] == 'c'){
			var cloud = document.createElement("span");
			addClass(cloud,"cloud");
			cloud.innerHTML = slogan[j];
			document.getElementById('slogan').appendChild(cloud);
		}	
		else
			document.getElementById('slogan').innerHTML += slogan[j];
		j++;
		setTimeout(function(){showSlogan();},150);
	}
}

function checkUsernameExist(){
	var isLoginBox = hasClass("login-box","in-place");
	var username = isLoginBox?document.getElementById('login-username').value:document.getElementById('register-username').value;
	var informationBar = isLoginBox?document.getElementById("login-information"):document.getElementById("register-information");
	
	if(!isUsername(username)){
		showInformation(informationBar,dic["wrongUsername"]);
		return;
	}
    
    $.ajax({ url: "",
             data: {nameExist: username, mode: "json"},
             dataType: "json",
             type: "GET",
             success: function(message){
                if(message.usernameExist == "false" && isLoginBox){
                    showInformation(informationBar,dic["notExistUsername"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic["goRegisterCityprint"]+"</span>");
                }
                else if(message.usernameExist == "true" && !isLoginBox){
                    showInformation(informationBar,dic["alreadyUsedUsername"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic["login"]+"</span>");
                }
             },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    });
}

function isUsername(username){
	return /^[a-z0-9_-]{6,16}$/.test(username);
}

function showInformation(informationBar,content){
    informationBar.innerHTML = content;
}

function showInformation(informationBar,content){
    if(informationDelay!=null) clearTimeout(informationDelay);
    
	informationBar.innerHTML = content;
	setShow(informationBar);

	informationDelay = setTimeout(function(){
	    removeClass(informationBar,"information-hide");
			informationDelay = setTimeout(function(){
				addClass(informationBar,"information-hide");
				informationDelay = setTimeout(function(){
					setHide(informationBar);
				},time);
			},5000);
	},20);
}

function clearInformation(informationBar){
    informationBar.innerHTML = "";
}

function submitLogin(){
	var username = document.getElementById("login-username").value;
	var password = document.getElementById("login-password").value;
	var informationBar = document.getElementById("login-information");
	
	if(!hasContent(username)){
		showInformation(informationBar,dic["noUsername"]);
		return;
	}else if(!hasContent(password)){
        showInformation(informationBar,dic["noPassword"]);
		return;
	}else if(!isUsername(username)){
        showInformation(informationBar,dic["wrongUsername"]);
		return;
	}

    $.ajax({ url: "",
             data: {Username: username, Password: password, mode: "json"},
             dataType: "json",
             type: "GET",
             success: function(message){
                if(message.usernameExist == "false"){
                    showInformation(informationBar,dic["notExistUsername"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic["goRegisterCityprint"]+"</span>");
                }
                else{
                    if(message.recordExist == "false") showInformation(informationBar,dic["mismatchPassword"]);
                    else location.href = message.url;
                }
             },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    });
}

function submitRegister(){
	var username = document.getElementById("register-username").value;
	var password = document.getElementById("register-password").value;
    var confirmpassword = document.getElementById("register-password-confirm").value;
	var informationBar = document.getElementById("register-information");
    
	if(!hasContent(username)){
		showInformation(informationBar,dic["noUsername"]);
		return;
	}else if(!hasContent(password)){
		showInformation(informationBar,dic["noPassword"]);
		return;
    }else if(!hasContent(confirmpassword)){
		showInformation(informationBar,dic["noConfirmPassword"]);
		return;
	}else if(password.length>16||password.length<6){
        showInformation(informationBar,dic["wrongPasswordLength"]);
		return;
	}else if(password != confirmpassword){
        showInformation(informationBar,dic["wrongConfirmPassword"]);
		return;
    }
	
    $.ajax({ url: "",
             data: {Username: username, Password: password, mode: "json"},
             dataType: "json",
             type: "POST",
             success: function(message){
                if(message.usernameExist == "true"){
                    showInformation(informationBar,dic["alreadyUsedUsername"]+"<span class='hyperlink underline' onclick='switchLoginRegister()'>"+dic["login"]+"</span>");
                }
                else{
                    location.href = message.url;
                }
             },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    });
}

function switchLoginRegister(){
    if(switchTimer!=null) clearTimeout(switchTimer);
	if(hasClass('login-box','in-place')){
		setShow('register-box');
		setTimeout(function(){
			removeClass('login-box','in-place');
			removeClass('slogan','slogan-in-place');
			addClass('register-box','in-place');
			addClass('switch-arrow','to-right');
			document.getElementById('switch-label').innerHTML = dic['login'];
			if(hasContent(document.getElementById("login-username").value)){
					document.getElementById("register-username").value = document.getElementById("login-username").value;
			}
			switchTimer = setTimeout(function(){
				setHide('login-box');
				document.getElementById("register-username").focus();
			},time);
		},20);
	}
	else{
		setShow('login-box');
		setTimeout(function(){
			removeClass('register-box','in-place');
			addClass('login-box','in-place');
			addClass('slogan','slogan-in-place');
			removeClass('switch-arrow','to-right');
			document.getElementById('switch-label').innerHTML = dic['register'];
			if(hasContent(document.getElementById("register-username").value)){
					document.getElementById("login-username").value = document.getElementById("register-username").value;
			}
			switchTimer = setTimeout(function(){
				setHide('register-box');
				document.getElementById('login-username').focus();
			},time);
		},20);
	}
}

function setHide(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	addClass(element,'hide');
}

function setShow(element){
	element = typeof element == 'object' ? element : document.getElementById(element);
	removeClass(element,'hide');
}

function hasContent(content){
	if(content.replace(/^\s+|\s+$/g,"")=='')
		return false;
	return true;
}

function hasClass(element, className){
	element = typeof element == 'object' ? element : document.getElementById(element);
    var pattern = new RegExp("(^| )" + className + "( |$)");
    return element.className.match(pattern); 
}

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

function removeClass(element, className) {
	element = typeof element == 'object' ? element : document.getElementById(element);
    if (hasClass(element, className)) {
		var pattern = RegExp("(^| )" + className + "( |$)");
        element.className = element.className.replace(pattern, "$1");
        element.className = element.className.replace(/ $/, "");
	}
}


