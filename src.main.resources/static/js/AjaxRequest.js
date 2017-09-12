// AJAX类
function AJAXRequest() {
	var xmlObj = false;
	var CBfunc,ObjSelf;
	ObjSelf=this;
	try { xmlObj=new XMLHttpRequest; }
	catch(e) {
		try { xmlObj=new ActiveXObject("MSXML2.XMLHTTP"); }
		catch(e2) {
			try { xmlObj=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e3) { xmlObj=false; }
		}
	}
	if (!xmlObj) return false;
	this.method="POST";
	this.url;
	this.async=true;
	this.content="";
	this.callback=function(cbobj) {return;}
	this.send=function() {
		if(!this.method||!this.url||!this.async) return false;
		xmlObj.open (this.method, this.url, this.async);
		if(this.method=="POST") xmlObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlObj.onreadystatechange=function() {
			if(xmlObj.readyState==4) {
				if(xmlObj.status==200) {
					ObjSelf.callback(xmlObj);
				}
			}
		}
		if(this.method=="POST") xmlObj.send(this.content);
		else xmlObj.send(null);
	}
}

function AutoRequest(url,content)
{
	
	var ajaxobj=new AJAXRequest;
	ajaxobj.url=url	;   
	ajaxobj.content=content;    
	ajaxobj.callback=function(xmlObj) 
	{
			
	}
	ajaxobj.send();
}


function AutoRun(url,element,content)
{
	
	var ajaxobj=new AJAXRequest;
	ajaxobj.url=url	;   
	ajaxobj.content=content;    
	ajaxobj.callback=function(xmlObj) 
	{
		if(xmlObj.responseText != "")
			document.getElementById(element).innerHTML=xmlObj.responseText;
	}
	ajaxobj.send();
}




/*
	定时请求服务器，刷新客户端的文本
	url :服务器的处理的url 
	content:get 数据
	element:显示的文档节点
	time:定时时间

*/
function ajax_refreshtxt_byget(url,content,element,time)
{
	
	var jscode;
	if(content==null)
	 jscode="AutoRun('"+url+"','"+element+"')";
	else
	 jscode="AutoRun('"+url+"','"+element+"','"+content+"')";
	setInterval(jscode,time);
}