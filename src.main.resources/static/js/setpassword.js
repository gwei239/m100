function check(){	
	trimform("form1");
	if(checkform_item("登录密码不能为空，请输入登录密码！",checkEmpty,"password")) 
		return false; 
	if(checkform_item("登录确认密码不能为空，请输入登录确认密码！",checkEmpty,"confirmpass")) 
		return false; 
	if(checkform_item("登录确认密码与登录密码不一致！",checkConfirm,"password","confirmpass")) 
		return false; 
	if(document.getElementById("password").value.length<8||document.getElementById("password").value.length>16){	
			document.getElementById("password").focus();
			document.getElementById("passwordspan").className="warning";
			document.getElementById("passwordspan").innerText="密码长度为8-16位";
			return false;
	}
	form1.submit();	
}

function reinitdoc(){
	if(window.parent!=null&&window.parent.reinitIframe!=null){
		window.parent.reinitIframe();		 
	}	
}

function initPage(){
	//init_check("form1",checkelement);
	//json2form(<?if(isset($obj)) echo json_encode_ex($obj);?>);
	reinitdoc();
}