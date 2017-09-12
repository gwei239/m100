function checkactivxinstall()
{
	var obj;
	try{
			obj= new ActiveXObject("eClientMonitor.CMObject");
			
	}
	catch(ex)
	{
			return 0;
			//alert(ex.message);
		//	alert("你还没有安装控件需要安装控件后才能登录系统")
	}
	return 1;
}
if(!checkactivxinstall())
{

	document.write("系统检测到你还没有安装控件,系统需要安装控件后才能访问!<br>");
	document.write("<a href='/js/client.exe'>控件下载地址</a>");
}