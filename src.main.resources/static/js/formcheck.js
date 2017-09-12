/**
将提示信息显示在对应的span右侧偏移220
输入：input对象，提示内容，提示样式类别
返回：
**/
 

 function  getsize_str(size)
 {
		if(size<1024)
			return size+"K";
		if(size<(1024*1024))
			return (size/1024,2).toFixed(2)+"M";
		if(size<(1024*1024*1024))
			return  (size/(1024*1024)).toFixed(2)+"G";
		if(size<(1024*1024*1024*1024))
			return  (size/(1024*1024*1024)).toFixed(2)+"T";		
 
 }
/**
去掉值中的空格.
输入：value 字符串
返回：去除空格后的字符串
**/
function trim(value) {
	 return	 value.replace(/(^\s*)|(\s*$)/g, ""); 
}

/**
去掉整个form中文本输入框中的空格.
输入：表单名
返回：
**/
function trimform(form)
{  
 var formobj =document[form];
 for (var i=0;i<formobj.length;i++) 
 { 
 	if(formobj.elements[i].value!=null&&formobj.elements[i].value!=undefined)
 	    formobj.elements[i].value=trim(formobj.elements[i].value);  
  } 
} 


/**
判断数值是否为空.
输入：value 字符串
返回：true 为空
返回：false 不为空
**/
function isEmpty(value) {
	if( value == null || trim(value) == "")
	return true;
	else 
	return false;
}

/**
判断是否为正数数值.
输入：value 字符串
返回：ture 不为空且为正数数值，否则返回 false
**/
function checkNumber(value) {
	var strRef = "1234567890";
	var tempChar;
	if(isEmpty(value))return false;
	for (i=0;i<value.length;i++) {
	  tempChar= value.substring(i,i+1);
	  if (strRef.indexOf(tempChar,0)==-1) {	
		  return false; 
	  }
	}
	return true;
}

/**
判断是否为数值.
输入：value 字符串
返回：不为空且为数值则返回 ture，否则返回 false
**/
function checkNegative(value) {
    strRef = "1234567890-";
    if (isEmpty(value))
        return false;
    for (i = 0; i < value.length; i++) {
        tempChar = value.substring(i, i + 1);
        if (strRef.indexOf(tempChar, 0) ==  - 1)
            return false;
        else {
            if (i > 0) {
                if (value.substring(i, i + 1) == "-")
                    return false;
            }
        }
    }
    return true;
}


function checkMobile(value)
{
 var reg0=/^13\d{9}$/g;   //130--139。
 var reg1=/^15\d{9}$/g;  //15?号段。
 var reg2 =/^\d+$/;
 var my=false;
 if(reg0.test(value)) { my=true; return my;}
 if(reg1.test(value)) { my=true; return my;}
 if(reg2.test(value)) { my=true; return my;}
 
}

/**
判断是否为规定钱的格式：xxx.xxx
输入：value 字符串
返回：不为空且为固定格式返回 ture，否则返回 false
**/
function checkMoney(value) {
    strRef = "1234567890.";
    if (isEmpty(value))
        return false;
    for (i = 0; i < value.length; i++) {
        tempChar = value.substring(i, i + 1);
        if (strRef.indexOf(tempChar, 0) ==  - 1)
            return false;
        else {
            tempLen = value.indexOf(".");
            if (tempLen !=  - 1) {
                strLen = value.substring(tempLen + 1, value.length);
                if (strLen.length > 2)
                    return false;
            }
        }
    }
    return true;
}

/**
判断是否为闰年
输入：year 数字
返回：是返回 ture，否则返回 false
**/
function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return true;
    }
    return false;
}

/**
判断是否固定日期的格式：mm-dd 并没有超过范围
输入：value 字符串
返回：不为空且为固定格式返回 ture，否则返回 false
**/
function checkDate(value) {
    var datetime;
    var year, month, day;
    var gone, gtwo;
    if (trim(value) != "") {
        datetime = trim(value);
        if (datetime.length == 10) {
            year = datetime.substring(0, 4);
            if (isNaN(year) == true) {
                return false;
            }
            gone = datetime.substring(4, 5);
            month = datetime.substring(5, 7);
            if (isNaN(month) == true) {
                return false;
            }
            gtwo = datetime.substring(7, 8);
            day = datetime.substring(8, 10);
            if (isNaN(day) == true) {
                return false;
            }
            if ((gone == "-") && (gtwo == "-")) {
                if (month < 1 || month > 12) {
                    return false;
                }
                if (day < 1 || day > 31) {
                    return false;
                }
                else {
                    if (month == 2) {
                        if (isLeapYear(year) && day > 29) {
                            return false;
                        }
                        if (!isLeapYear(year) && day > 28) {
                            return false;
                        }
                    }
                    if ((month == 4 || month == 6 || month == 9 || month == 11)
                        && (day > 30)) {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
    return true;
}

/**
判断是否固定时间的格式：xx:xx:xx
输入：value 字符串
返回：不为空且为固定格式返回 ture，否则返回 false
**/
function checkTime(value) {
	var regtime=/^((0[0-9]|[0-9])|1[0-9]|2[0-3]):((0[0-9]|[0-9])|[1-5][0-9]):((0[0-9]|[0-9])|[1-5][0-9])$/g;
	if(!regtime.test(value))
	   return false;
	return true;
}

/**
判断是否固定URL的格式：如 http[s]://xxx.xxx.xxx 字符不能超过范围
输入：url 字符串
返回：为固定格式返回 ture，否则返回 false
**/
 function checkURL(url) {
    var urlrule = /^http[s]{0,1}:\/\/[A-Za-z0-9]+[\.\/=\?%\-&_~`@:+!]*([^\"\\\'])*$/;
    if(!urlrule.test(trim(url))) {
        return false;
    }
    return true;
 }

/**
 * 判断是否固定URI的格式：uri必须以'/'开始
 * 输入：uri 字符串
 * 返回：为固定格式返回 ture，否则返回 false
 * **/
 function checkURI(uri) {
     if(trim(uri).length != 0 && trim(uri).charAt(0) != '/') 
		 return false;
     return true;
	  } 

/**
固定格式数字证书序列号检查：只能包含十六进制字符[a-fA-F0-9]
输入：str 字符串
返回：为固定格式则返回 ture，否则返回 false
**/
function checkCertsn(str) {
	var regcertsn = /^[a-fA-F0-9]*$/g;
	if(!regcertsn.test(str)) {
		return false;
	   }
	  
	return true;
}

/**
固定格式字符串检查：字母开头，只能包含"." "_" "@"和字母
输入：str 字符串
返回：为固定格式则返回 ture，否则返回 false
**/


function checkName(str) {
	if(typeof(str)!='string') {
			str = str.value;
		}
		for(var i = 0; i < str.length; i++) {
				if(str.charAt(i)=='.'||str.charAt(i)=='_'||str.charAt(i)=='@') {
				
				}else {
					if(str.charCodeAt(i) < 127 && !str.substr(i,1).match(/^\w+$/ig)){
						return false;
					}
				}
		}
		return true;
}

/**
固定格式字符串检查：字母开头，只能包含"." "_" ":"和字母
输入：str 字符串
返回：为固定格式则返回 ture，否则返回 false
**/
function checkUserName(str) {
	if(typeof(str)!='string') {
			str = str.value;
		}
		for(var i = 0; i < str.length; i++) {
				if(str.charAt(i)==':'||str.charAt(i)=='.'||str.charAt(i)=='_'||str.charAt(i)==' ') {
				
				}else {
					if(str.charCodeAt(i) < 127 && !str.substr(i,1).match(/^\w+$/ig)){
						return false;
					}
				}
		}
		return true;
}

/**
路径格式检查：
输入：str 字符串
返回：符合固定格式则返回 ture，否则返回 false
**/
function checkDir(str) {
	if(!str)
		return true;

	if(typeof(str)!='string'){
		str = str.value;
	}

	var rule = /^([^\"\'*?<>|])*$/;
	if(!rule.test(str)) {
		return false;
	}

	return true;
}

/**
文件名格式检查：
输入：str 字符串
返回：符合固定格式则返回 ture，否则返回 false
**/
function checkFile(str) {
	if(!str)
		return true;

	if(typeof(str)!='string') {
		str = str.value;
	}

	var rule = /^([^\"\\\:\'*?<>|])*$/;
	if(!rule.test(str)) {
		return false;
	}

	return true;
}

/**
IP格式检查：xxx.xxx.xxx.xxx
输入：ip 字符串
返回：符合固定格式则返回 ture，否则返回 false
**/
function checkIP(ip) {
    re=/(\d+)\.(\d+)\.(\d+)\.(\d+)/g
    if(!re.test(ip)) {
        return false;
    }
	ip = ip.split(".");
	if(ip.length!=4) {
		return false;
	}
	
	if(ip[0]<0||ip[0]>255||checkNumber(ip[0])==false) {
		return false;
	}
	if(ip[1]<0||ip[1]>255||checkNumber(ip[1])==false) {
		return false;
	}
	if(ip[2]<0||ip[2]>255||checkNumber(ip[2])==false) {
		return false;
	}
	if(ip[3]<0||ip[3]>255||checkNumber(ip[3])==false) {
		return false;
	}
	return true;
}

/**
端口格式检查：不为空，都为数值，65535范围内
输入：value 字符串
返回：符合固定格式则返回 ture，否则返回 false
**/
function checkPort(value) {
    if (isEmpty(value))
        return false;
    if (!checkNumber(value))
        return false;
    if (parseInt(value) > 65535 || parseInt(value) < 0)
        return false;
    return true;
}

/**
子网掩码格式检查：
输入：mask 字符串
返回：符合固定格式则返回 ture，否则返回 false
**/
function checkMask(mask) {
        var amask = mask.split(".");
        var closed = false;
        var bit;

        if (amask.length != 4)                             
                return false;               

        for (var i = 0; i < 4; i++) {
				if (amask[i] == '')
					return false;

                for (var j = 8; j >= 0; j--) {
                        bit = (1 << j) - 1;
                        if (closed && (amask[i] & bit == bit)) {
                                return false;
                        }
                        if ((bit & amask[i]) != bit && closed == false) {
                                closed = true;
                        }
                }
        }
        return true;
}

 



/**
检查一个ip是否在一个子网中，而且不能是子网和广播地址
输入：ip 字符串 IP地址
输入：subnet 字符串 子网IP地址
输入：mask 字符串 子网掩码
返回：1，2，3
**/
function checkIpinSubnet(ip,subnet,mask) {
	if (checkIP(ip)==false || checkIP(subnet)==false || checkMask(mask)==false){
		return false;
	}
	var issubip = 0;
	var isbrdip = 0;
	ip_array = ip.split(".");
	subnet_array = subnet.split(".");
	mask_array = mask.split(".");
	for (var i=0;i<4;i++) {
		if ((ip_array[i] & mask_array[i]) != (subnet_array[i] & mask_array[i])) {
			return 1;
			break;
		}
		//ip地址和掩码的非做与操作的结果如果为0，则ip地址是一个子网地址
		//ip地址和掩马做或操作的结果如果是255，则ip地址是一个广播地址
		if((ip_array[i] & (mask_array[i] ^255)) == 0)
			issubip++;
		if((ip_array[i] | mask_array[i]) == 255)
			isbrdip++;
	}
	if(4 == issubip || 4 == isbrdip)
		return 2;
	else 
		return 3;
}

/**
IP格式检查：为xxx.xxx.xxx.xxx/24或xxx.xxx.xxx.xxx/xxx.xxx.xxx.xxx格式
输入：ip 字符串
返回：为固定格式则返回 ture，否则返回 false
**/
function checkIPNet(ip) {
	ip_array = ip.split("/");
	if (ip_array.length != 2) {
  	return false;
  }
	if (checkIP(ip_array[0])==false) {
	  return false;
	}
	if ((!checkNumber(ip_array[1]) || ip_array[1]<0 || ip_array[1]>32) && (!checkMask(ip_array[1]))) {
		return false;
	}
	return true;
}


/**
port格式检查：为xx-xx
输入：ip_ip 字符串
返回：为固定格式则返回 ture，否则返回 false
**/
function checkport2port(ip_ip) {
	str = ip_ip.split("-");
	if (str.length !=2) {
		return false;
	}
	if((!checkPort(str[0]))||(!checkPort(str[1]))) {
	  return false;
	}
	
	if(str[0]>str[1]||str[0]==str[1])
	{
	    return false;
	}
	return true;
}

function checkIP2IP(ip_ip) {
	str = ip_ip.split("-");
	if (str.length !=2) {
		return false;
	}
	if((!checkIP(str[0]))||(!checkIP(str[1]))) {
	  return false;
	}
	ip1 = str[0].split(".");
	ip2 = str[1].split(".");

	for (i=0;i<4;i++) {
		var k1=parseInt(ip1[i]);
		var k2=parseInt(ip2[i]);
	  if (k1>k2) {
	    return false;
	    break;
	  }
	}
	return true;
}/**
主机IP及子网掩码检查
输入： ip 点分十进制IP字符串
输入： mask 点分十进制mask字符串
返回：符合条件则返回 ture，否则返回 false
**/
function CheckHostByMask(hostip, mask) {
    var h = hostip.split(".");
    var m = mask.split(".");
    if (m.length != 4 || h.length != 4) return false;
    for (var i = 0; i < 4; i++) {
        if ((parseInt(h[i]) | parseInt(m[i])) != m[i]) {
            return false;
        }
    }
    return true;
}

/**
设置所有的span 以前为红色的颜色为黑色
**/
function  resetRedSpan() {
	 	var origLength =document.all.length;
		for (var i = 0; i < origLength; i++) {
 		   if(document.all[i].tagName == "SPAN" && document.all[i].className=="warning") {
			   document.all[i].innerHTML="";
			}
		}
}

/**
主机名称格式检查：
输入：str 字符串 主机名字
返回：符合格式返回 ture ，否则返回 false
**/
function checkHostName(str) {

	var reg = /[\^\$\*\\\+\?\{\}\[\]!@#%&:;"'\/><,=|~\u4e00-\u9fa5]+/g;
    if (str.match(reg)) {
		return false;
	}
	return true;
}

/**
主机检查：
返回：
**/
function checkHost(str) {

	if(checkHostName(str)==false&&checkIP(str)==false) {	
		return false;
	}
	return true;
}

/**
mac地址检查：
输入：mac 字符串 mac地址
返回：符合格式返回 ture，否则返回 false
**/
function checkMAC(mac) {
    //正则表达式解释：只能是("两个0-9或a-fA-F字符"+":")*5+"两个0-9或a-fA-F字符"******shuangda
    var re=/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/g
    if (!re.test(mac)) {
        return false;
    }
    return true;
}

/**
将点分十进制IP字符串转为long型
输入：str 点分十进制IP字符串
返回：返回long型值
**/
function ip2Long(str) {
    var ip = 0;
    var array = str.split(".");
    ip = parseInt(ip) + parseInt(array[0]) * 16777216;
    ip = parseInt(ip) + parseInt(array[1]) * 65536;
    ip = parseInt(ip) + parseInt(array[2]) * 256;
    ip = parseInt(ip) + parseInt(array[3]);
    return parseInt(ip);
}

function generalCheck(value)
{
	var rule = /^([^\"\\\'])*$/g;
	if(!rule.test(trim(value)))
		return false;
	return true;
}


/**
判断对象内的属性是否存在
输入：obj 对象名
输入：attr 属性名
返回：如存在返回 ture，否则返回 false
**/
function checkObjAttr(obj,attr) {
	if((typeof obj[attr] == 'unknown') || (obj[attr] === void 0))
		return false;
	return true;
}


function checkEmpty(value)
{
	  if (isEmpty(value))
        return false;
		return true;
}
    
 

function getobj(str)
{
	 
	 return document.getElementById(str);
}
function getobjvalue(str)
{
		
	 return document.getElementById(str).value;
}
function isobjempty(str)
{
	return isEmpty(getobjvalue(str));

}
var $F=getobjvalue;
var $O=getobj;

String.prototype.applyTemplate = function(obj) {
	var str = this;
	for (key in obj) {
		var reg = new RegExp("%" + key + "%", "g");
		str = str.replace(reg, obj[key]);
		reg = null;
	}
	return str;
}
function removeIndex(array, index) {
    var removed = false;
	if (index >= array.length)
		return;
	
    for (var i = index + 1, n = index; i < array.length; i++, n++) {
		array[n] = array[i];
    }
    array.length--;
}
	 function check_exist(listobj,text,value)
	{
		var len = $(listobj).length;	
		for (var i = (len - 1); i >= 0; i--) {
			if (($(listobj).options[i].text==text&&$(listobj).options[i].value==value) ) {
	
				return true;
			}
		}
				return false;
}
function initonelistfromstr(list,str)
{
	var iplist=str;
	var strs= new Array(); //定义一数组
	strs=iplist.split(";"); //字符分割      

	for (i=0;i<strs.length ;i++ ) 
	{
		if(strs[i]!="")
		{
			if(check_exist(list,strs[i],strs[i])==false)
			{
				var oOption = document.createElement("OPTION");
				oOption.text=strs[i];
				oOption.value=strs[i];
				
				$(list).add(oOption);
			}
				
		}
	} 

}
function getstrfromlist(list)
{
	ret ="";
	for(i=0;i<document.getElementById(list).options.length ;i++)
	{
		ret+=document.getElementById(list).options[i].text +';'
	}
	return ret;
}
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

function setinterface_list(listname,checkeditem)
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
			if(checkeditem!="")
				document.getElementById(listname).value=checkeditem;
			
			try {
					
			} catch (e) { 
			
			}
	}
	ajaxobj.send();
	
}
/**
获取当前对象的位置，返回位置
**/
function XgetPosition(e){
    var left = 0;
    var top  = 0;
    while(e.offsetParent){
        left += e.offsetLeft;
        top  += e.offsetTop;
        e= e.offsetParent;
    }
    left += e.offsetLeft;
    top  += e.offsetTop;
    return {x:left, y:top};
}


function list_addoption(listname,varname,varvalue)
{
	var oOption = document.createElement("OPTION");
	oOption.text=varname;
	oOption.value=varvalue;	
	document.getElementById(listname).add(oOption);



}
function list_cleanoption(listname)
{
	var len =document.getElementById(listname).length;	
	for (var i = (len - 1); i >= 0; i--) {
		if (document.getElementById(listname).options[i] != null  ) {

			document.getElementById(listname).options[i] = null;
		}
	}
}
function checkConfirm(value1,value2)
{
	
	if (value1==value2)
		return true;
	return false;
}

function checkform_item(errorstr,checkfunc,formitem)
{
	
	if($O(formitem)!=null )
	{
		if(arguments.length==3&&checkfunc($F(arguments[2]))==true)
			return false;
		if(arguments.length==4&&checkfunc($F(arguments[2]),$F(arguments[3]))==true)
			return false;

		if($O(formitem+"span")!=null)
		{	
			$O(formitem).focus();
			$O(formitem+"span").className="warning";
			$O(formitem+"span").innerText=errorstr;
		}
		 
		return true;
	}
	return false;
	
}

function formatstate(val,row)
{   
	if (val ==1){   
		return '<span style="color:green;">启用</span>';   
	 } else {   
		return '<span style="color:red;">停用</span>';   
	 }   
}  

function getcurrenturl()
{
	var str=document.location.href;
	if(str.substr(str.length-1,1)=="#")
		return str.substr(0,str.length-1);
	return str;
}
function geturldomain()
{
	var str=document.location.href;
	return str.substr(0,str.lastIndexOf("."));
}
