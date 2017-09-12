

				 
				 
var debug=0;				
function setCookie(name,value,expiry,path,domain,secure)
{
	var nameString = name + "=" + value;
	if(expiry==null)
	{
		var expiryString ="";
	}else
	{
		 var LargeExpDate = new Date (); 
		 LargeExpDate.setTime(LargeExpDate.getTime() + (expiry*1000*60));		
		 var expiryString=" ;expires = "+ LargeExpDate.toGMTString();
	}
	var pathString = " ;path = /"; 
		//(path == null) ? "" : " ;path = "+ path;
	var domainString = (domain == null) ? "" : " ;domain = "+ domain;
	var secureString = (secure) ?";secure" :"";
	document.cookie = nameString + expiryString + pathString + domainString + secureString;
}

function getCookie (name)
{
	var CookieFound = false;
	var start = 0;
	var end = 0;
	var CookieString = document.cookie;
	var i = 0;

	while (i <= CookieString.length) {
	start = i ;
	end = start + name.length;
	if (CookieString.substring(start, end) == name){
	CookieFound = true;
	break; 
	}
	i++;
	}

	if (CookieFound){
	start = end + 1;
	end = CookieString.indexOf(";",start);
	if (end < start)
	end = CookieString.length;
	return unescape(CookieString.substring(start, end));
	}
	return "";
}

function deleteCookie(name)
{
	var expires = new Date();
	expires.setTime(expires.getTime() - 1);
	setCookie(name, "", expires, null, null, false);
} 


function write_language(id)
{
	document.write(get_language_txt(id));				
}
function set_language_txt(varname,id)
{
	var element =document.getElementById(varname);

	if(element==null)
		return ;
	element.value=get_language_txt(id);	
	
				
}
function set_language(lang)
{
	setCookie("langguage",lang);
}

function get_language_txt(id)
{		
		var lang=getCookie("langguage");
		if(typeof(lang) == "undefined"||lang==null||lang=="")
			lang ="cn";
	
		if(typeof(syslanguage[id])=="undefined"||typeof(syslanguage[id][lang]) == "undefined") 
		{
			if(debug==1)
		    	alert('langguage :'+lang+',id:'+id+' undefine  text!');
				return id ;
		}else
		{
			var txt=syslanguage[id][lang];	
			return  txt;
		}
}
