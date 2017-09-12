$(function(){
	
	var url = document.location.href;
	
	//用户来源
	var utmSourceFlag;
	if(url.indexOf("utmSourceFlag") >= 0){
		utmSourceFlag = url.substring(url.indexOf("utmSourceFlag")+14,url.length);
		$.ajax({
			url : "/xsi/register/userSource.do?utmSourceFlag="+utmSourceFlag+"&_="+Math.random(),
			cache:false ,
			type : "POST",
			dataType:"json",
			error : function() {
			},
			success : function(data) {
			},
			beforeSend : function() {
			}
		});
	}
});

function getLength(str) { 
    var len = str.length; 
    var reLen = 0; 
    for (var i = 0; i < len; i++) {        
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) { 
            // 全角    
            reLen += 2; 
        } else { 
            reLen++; 
        } 
    } 
    return reLen;    
}
function loadimage(){
    document.getElementById("randImage").src = "./image.jsp?rdtype=REGISTER_RANDOM_CODE&_="+Math.random();
}

function openServiceItems(type){
    if (type == 0) {
      //  url = "/service.html";
        window.open ('/service.html', 'newwindow', 'height=500, width=600, top=200,left=500, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no') 
    }
    else {
        //url = "/privacy.html";
        window.open ('/privacy.html', 'newwindow', 'height=500, width=600, top=200,left=500, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no') 
    }
    //window.open(url, 'regconfirm', 'height=584,width=718,toolbar=no,menubar=no,scrollbars=no,resizable=false,location=no,status=no');
    return true;
}
$(function (){
//	PC.initProvince("areaProvince_live", "");
//	PC.initCity("areaProvince_live", "areaCity_live", "");
// 	 $("#remoteValidateCode").focus(function(){
// 		 $('#sendphonemsg').empty(); 
		
	
// 	 })
	
	var options = {
			beforeSubmit : function() {
				//disable submit button
				//遮罩
				$('#user_info_submit').attr('disabled','disabled');
				//$("#user_info_submit").css("background","#ccc");
				$(".load").css('display',"block");
				
			},
			error : function(data) {
				//error message
				$('#error_msg').html("注册失败，请重试");
				$('#user_info_submit').removeAttr('disabled');
				$('#user_info_submit').css('display','visibility');
				$(".load").css("display","none");
			},
			success : function(data) {
				var result =  data.result;
				if(result == 'true' || result == true){
					setTimeout(function(){
						document.location.href = "/registerok.php";
					},3000);
 
						document.location.href = "/registerok.php";
			 
				}else{
					var message = eval('(' +data+ ')').message;
					$('#error_msg').html(message).show();
					$('#user_info_submit').removeAttr('disabled');
					$('#user_info_submit').css('display','visibility');
					$(".load").css('display',"none");
			    }
			}
	};
	$('#registerform').ajaxForm(options); 
});
function remotevalidatecode() {
	 var v = $('#username').val();
	 if(v == null || v == '' || (!isMobile(v) && !isEmail(v))){
		 $('#sendphonemsg').html('请输入邮箱或者手机号后重试');
		// $('#sendphonemsg').css("display",'block');
		 return;
	 }
	 var errorfunc = function(){
		 $('#sendphonemsg').html('激活码发送失败，请重试');
		// $('#sendphonemsg').css("display",'none');
	 }
	 var sucfunc = function(data){
		 var code = data.code;
		 var result = data.result;
		 if(result == 'true' || result == true){
			 $('#randomcode').val(code);
			 $('#sendphonemsg').html('激活码发送成功，请查阅邮件或者手机短信进行校验, 10分钟内有效');
			 /*
			 $("#sendremotecodebutton").css({
				"background" : "none",
				"backgroundColor" : "#f7f7f7"
			 });
			 */
			 $('#sendphonemsg').css("display",'block');
			 timer = setInterval("enablesend()", 1000);
			 $("#sendremotecodebutton").attr("value", 60 + "s后重新发送");
			 $(".remoteValidateCode").html("");

		 }else{
			 $("#sendremotecodebutton").removeAttr('disabled');
			 $("#sendremotecodebutton").attr("value", "获取激活码");
			
			 $('#sendphonemsg').html('激活码发送失败，请重试');
			 
		 }
	 }
	 var beforefunc = function(){
		 $('#sendremotecodebutton').attr('disabled', 'disabled');
		 $('#sendremotecodebutton').css("border","1px solid #ccc");
	 }
	 $.ajax({
			url : "/xsi/common/ckuname.do?username="+v+"&_="+Math.random(),
			type : "POST",
			//火狐浏览器返回json问题
			dataType:"text",
			error : function() {
				 $('#sendphonemsg').html('激活码发送失败，请重试');
			},
			success : function(data) {
				if(data == true || data == 'true'){
					sendvalidatecode($('#sendremotecodebutton'),"REGISTER", v, errorfunc, sucfunc, beforefunc);
				}
				else{
// 					输入未注册的用户名时不好去掉这个提示
// 					$('#sendphonemsg').css('该用户名已被注册');
				}
			},
			beforeSend : function() {
			}
		});
}


var i = 59;
function enablesend() {
	if (i <= 0) {
		$("#sendphonemsg").html("");
		$("#sendremotecodebutton").removeAttr('disabled');
		$("#sendremotecodebutton").attr("value", "获取激活码");
		i = 59;
		clearInterval(timer);
		/*
		$("#sendremotecodebutton").css({
			"background" : "url(/theme_new/images/Countdown.png) repeat-x",
			"backgroundColor" : "none"
		 });
		 */
	} else {
		$("#sendremotecodebutton").attr("value", i + "s后重新发送");
		i--;
	}


}

function isMobile(mobile){
    var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (mobile == null) {
        return false;
    }
    return reg.test(mobile);
}
function isEmail(email){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (email == null) {
        return false;
    }
    return reg.test(email);
}

//激活码
function sendvalidatecode(obj, type, username, errorfunc, sucfunc, beforefunc) {
    if(username == null || type == null){
        alert("发送失败，请检查输入正确后重试");
        return;
    }
    if (!isMobile(username) && !isEmail(username) ) {
        //手机验证码
        alert("请输入正确的手机号或者邮箱后发送");
        return;
    }
    $.ajax({
        url : "/xsi/common/sendvcode.do?username=" + username + "&type="+type,
        type : "POST",
        error : function() {
            errorfunc();
        },
        success : function(data) {
            sucfunc(data);
        },
        beforeSend : function() {
            beforefunc();
        }
    });
}