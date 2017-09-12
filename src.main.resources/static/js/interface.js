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
function addoption(obj,value,txt)
{
	var oOption = document.createElement("OPTION");
	oOption.text=txt;
	oOption.value=value;
	$(obj).add(oOption);
}

function setinterface_list(listname)
{
	var ajaxobj;
	ajaxobj=new AJAXRequest;
	ajaxobj.url="/cgi-bin/index.cgi?mod=interface&act=interfacelist"	;   
	ajaxobj.content="";    
	ajaxobj.callback=function setinterface(xmlObj)
	{

			var iplist=xmlObj.responseText;
			var strs= new Array(); //定义一数组
			strs=iplist.split(";"); //字符分割      
		
			for (i=0;i<strs.length ;i++ ) 
			{
				if(strs[i]!="")
				{
					addoption(listname,strs[i],strs[i]);
						
				}
			} 		
			
			try {
					
			} catch (e) { 
			
			}
	}
	ajaxobj.send();
	
}