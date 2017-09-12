function checkelement(element){ 
	trimform("form1");
	if(element=="email") return (checkempty("email","请输入注册的邮箱！")&&checkobjemail("email","邮箱格式不正确！"));
	if(element=="imagepass") return (checkempty("imagepass","请输入图片校验码！"));
	return 2;
}
 
function check(){
	var formobj =document["form1"];
	for (var i=0;i<formobj.length;i++) { 
		if(checkelement(formobj.elements[i].name)==false)
			return false;	
	} 
	//document.getElementById('json').value=form2json();
	form1.submit();	
}

function reinitdoc(){
	if(window.parent!=null&&window.parent.reinitIframe!=null){
		window.parent.reinitIframe();		 
	}	
}

function initPage(){
	init_check("form1",checkelement);
	//json2form(<?if(isset($obj)) echo json_encode_ex($obj);?>);
	reinitdoc();
}