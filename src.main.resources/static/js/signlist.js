	
function signlist_init(list,str)
{
	var iplist=str;
	var strs= new Array(); //定义一数组
	strs=iplist.split(";"); //字符分割      
		
	for (i=0;i<strs.length ;i++ ) 
	{
		if(strs[i]!="")
		{
			addoption(list,strs[i],strs[i]);
		}
	} 

}


function signlist_del(list)
{

	var len = $(list).length;	
	for (var i = (len - 1); i >= 0; i--) {
		if (($(list).options[i] != null) && ($(list).options[i].selected == true)) {

			$(list).options[i] = null;
		}
	}


}
function check_exist(listobj,text)
{
	var len = $(listobj).length;	
	for (var i = (len - 1); i >= 0; i--) {
		if (($(listobj).options[i].text== text) ) {

			return true;
		}
	}
			return false;
}

function signlist_add(list,addobj,checkfunc)
{
	
	if(checkfunc!=null)
	{	
		if(checkfun($(addobj).value)!=0)
			return ;
	}
	if($(addobj).value=="")
	{
		alert("添加不能为空");
		return;
	}
	if(check_exist(list,$(addobj).value)==true)
	{
		alert("记录已经存在！");
		return;
	}
	
	
	var oOption = document.createElement("OPTION");
	oOption.text=$(addobj).value;
	oOption.value=$(addobj).value;	
	$(list).add(oOption);	

}

function  signlist_get(srcList)
{
		
	var ret="";
	 for(var j = 0; j<$(srcList).options.length; j++)
	 {
				ret+=$(srcList).options[j].value;
				ret+=";";
	}
	return ret;					
}
