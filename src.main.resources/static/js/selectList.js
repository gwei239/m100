	function addSrcToDestList(srcList, destList) 
	{
    	var len = destList.length;
    	for (var i = 0; i < srcList.length; i++) {
        	if (( srcList.options[i] != null ) && ( srcList.options[i].selected )) {
            	var found = false;
            	for (var count = 0; count < len; count++) {
                	if (destList.options[count] != null) {
                    	if (srcList.options[i].value == destList.options[count].value) {
                        	found = true;
                        	//alert("found: " + i + destList.options[i].value + ":" + count + srcList.options[count].value + destList.options[i].value);
                        	break;
                    	}
                	}
            	}
            	if (found != true) {
                	destList.options[len] = new Option(srcList.options[i].text);
                	destList.options[len].value = srcList.options[i].value;
                	len++;
            	}
        	}
    	}
    	deleteFromSrcList(srcList, destList);
	}

	function addAllSrcToDestList(srcList, destList) 
	{
    	var len = destList.length;
    	for (var i = 0; i < srcList.length; i++) {
        	if (( srcList.options[i] != null )) {
            	var found = false;
            	for (var count = 0; count < len; count++) {
                	if (destList.options[count] != null) {
                    	if (srcList.options[i].value == destList.options[count].value) {
                        	found = true;
                        //	alert("found: " + i + destList.options[i].value + ":" + count + srcList.options[count].value + destList.options[i].value);
                        	break;
                    	}
                	}
            	}
            	if (found != true) {
                	destList.options[len] = new Option(srcList.options[i].text);
                	destList.options[len].value = srcList.options[i].value;
                	len++;
            	}
        	}
    	}
    	deleteAllFromSrcList(srcList, destList);
	}


	function deleteFromSrcList(srcList, destList) {
   	 	var len = srcList.options.length;
    	for (var i = (len - 1); i >= 0; i--) {
        	if ((srcList.options[i] != null) && (srcList.options[i].selected == true)) {
            	srcList.options[i] = null;
        	}
    	}
		if(srcList.options[0] != null)
			srcList.options[0].selected=true;
	}
	
	function  initSrcList(srcList, destList) {
		var len = destList.options.length;
		if(len != 0)
		 for(var i = 0; i<len; i++){
			 for(var j = 0; j<srcList.options.length; j++)
			   if(srcList.options[j].value == destList.options[i].value) {
			   		srcList.options[j] = null;	
					break;
			   }
		 }
		if(srcList.options[0] != null)
			srcList.options[0].selected=true;
		 
	}
	function selectaddoption(oSelect,text,value)
	{
		var oOption = document.createElement("OPTION");
		oOption.text=text;
		oOption.value=value;
		oSelect.add(oOption);
     }
	function initlistfromstr_ex(srcList, destList,srcstr,desstr)
	{
		var strs= new Array(); //定义一数组
		strs=srcstr.split(";"); //字符分割      
		for (i=0;i<strs.length ;i++ )    
		{    
			if(strs[i].indexOf(';')==-1)
			{
					selectaddoption(srcList,strs[i],strs[i]);
			}else
			{
				selectaddoption(srcList,strs[i].split('m')[0],strs[i].split('m')[1]);

			}
		} 
		initlistfromstr(srcList, destList,desstr);
	}
	function initlistfromstr(srcList, destList,str)
	{
		var strs= new Array(); //定义一数组
		strs=str.split(";"); //字符分割      
		for (i=0;i<strs.length ;i++ )    
		{    
			 for(var j = 0; j<srcList.options.length; j++)
			 {
					if(srcList.options[j].value==strs[i])
					{
						selectaddoption(destList,srcList.options[j].text,srcList.options[j].value);
					}
			 }
		} 
		initSrcList(srcList, destList)
	
	}
	
	function  getstr_fromlist(srcList)
	{
			
		var ret="";
		 for(var j = 0; j<srcList.options.length; j++)
		 {
					ret+=srcList.options[j].value;
					ret+=";";
		}
		return ret;					
	}

	function  dallall_fromlist(srcList)
	{
	 	var len = srcList.options.length;
    	for (var i = (len - 1); i >= 0; i--) {
        	if ((srcList.options[i] != null)) {
            	srcList.options[i] = null;
        	}
    	}			
	}
	function deleteAllFromSrcList(srcList, destList) {
    	var len = srcList.options.length;
    	for (var i = (len - 1); i >= 0; i--) {
        	if ((srcList.options[i] != null)) {
            	srcList.options[i] = null;
        	}
    	}
	}
		
	
	function setAllSelectedTrue(brandList)
	{
    	for(var k=0;k<brandList.length;++k){
        	brandList.options[k].selected=true;
		}
	}
	
	function popwin(url, target, width, height)
	{
		var param = 'height=%height%, width=%width%, status=no, location=no, ' +
					'toolbar=no, menubar=no, scrollbars=no, resizable=no, ' +
					'left=%left%, top=%top%';
	
		var x = (window.screen.width - width) / 2;
		var y = (window.screen.height - height) / 2;
		var p = param;
		p = p.replace('%width%', width)
		p = p.replace('%height%', height)
		p = p.replace('%left%', x)
		p = p.replace('%top%', y)
		window.open(url, target, p);
	}
	function addoption(obj,value,txt)
	{
		var oOption = document.createElement("OPTION");
		oOption.text=txt;
		oOption.value=value;
		document.getElementById(obj).add(oOption);
	}
	
	 function init_list_fromstr(list,str)
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