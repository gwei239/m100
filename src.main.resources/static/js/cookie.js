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

