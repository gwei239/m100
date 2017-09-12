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
var jsonajaxobj=null;
function json_request(url,method,func)
{
	if(jsonajaxobj==null)
		jsonajaxobj=new AJAXRequest;
	jsonajaxobj.url=url	;   
	jsonajaxobj.method=method;   
	jsonajaxobj.callback=function(xmlObj) 
	{
				func(xmlObj.responseText);
	}
	jsonajaxobj.send();
}
var oldjsonvalue;
 
function json2form(json)
{
	if(json==null)
		return ;
	oldjsonvalue=json;
	form=document["form1"];
	for (i = 0, max = form.elements.length; i < max; i++) {
        e = form.elements[i];
		if(json[e.name]==null)
			continue;
		switch (e.type) {
		 case 'radio':
			if(json[e.name]==e.value)
				e.checked=true;
		  break;
        case 'checkbox':
      
			if(json[e.name]==1||json[e.name]==true)
					e.checked=true;
			break;
			
        case 'hidden':
        case 'password':
        case 'text':
        case 'button':
        case 'file':
        case 'image':
        case 'reset':
        case 'submit':
        default:
			e.value=json[e.name];
        }
	
	}
}

function form2json()
{
	form=document["form1"];
    json = '{';
    isarray = false;
    for (i = 0, max = form.elements.length; i < max; i++) {
        e = form.elements[i];
        name = e.name;
	
        if (name.substring(name.length - 2) == '[]') {
            name = name.substring(0, name.length - 2);
            lastarr = name;
            if (isarray == false) {
                json += '"' + name + '":[';
            }
            isarray = true;
        } else {
            if (isarray) {
                json = json.substring(0, json.length - 1) + '],';
            }
            isarray = false;
        }
	
        switch (e.type) {
        case 'checkbox':
			if(e.checked==true)
			{
				 json += '"' + e.name + '":"1",';
			}else
			{
				json += '"' + e.name + '":"0",';
			}
			break;
        case 'radio':
            if (!e.checked) {
			//     json += '"' + e.name + '":0'
			break;}
        case 'hidden':
		case 'select-one':
        case 'password':
        case 'text':   
			
		/*	 if(oldjsonvalue!=null)
			{
				alert(oldjsonvalue[e.name]);
				if(oldjsonvalue[e.name]==null)
					break;
			}*/
			if(e.name=="json"||e.name=="act"||e.name=="")
				break;

            if (!isarray) {
                json += '"' + name + '":';
            }
		
			json += '"' + e.value.replace(new RegExp('(["\\\\])', 'g'), '\\$1') + '",';
            break;

        case 'button':
        case 'file':
        case 'image':
        case 'reset':
        case 'submit':
        default:
        }
    };
    
    return json.substring(0, json.length - 1) + '}';
}
	