
	function item(groupid,type,deviceid,routeid,routerstate,devicename,routername)
	{
			this.groupid=groupid;
			this.type=type;
			this.deviceid=deviceid;
			this.routeid=routeid;
			this.routerstate=routerstate;
			this.routername=routername;

			this.routerstate=routerstate;
		//    			alert(routername);
	}
	function init_router_from_str(st)
	{
		var str= new Array(); //定义一数组
		str=st.split(","); //字符分割      
		router_array[router_array.length]=new item(str[0],str[1],str[2],str[3],str[4],str[5],str[6]);
	
	}
	function init_routerarray_from_str(routerstr)
	{
		var strs= new Array(); //定义一数组
		strs=routerstr.split(";"); //字符分割      
		for (i=0;i<strs.length ;i++ ) 
		{

			if(strs[i]!="")
			{
				init_router_from_str(strs[i]);
			}
		} 
	}

	function getgroupon_count(id)
	{
			var ret=0;
			for (i=0;i<router_array.length ;i++ ) 
			{
					if(router_array[i].groupid!=id)
						continue;
					if(router_array[i].state==0)
						continue;
					if(router_array[i].state!=2)
						ret++;
			}
			return ret;
	
	}
	
	function getgroupoff_count(id)
	{
			var ret=0;
			for (i=0;i<router_array.length ;i++ ) 
			{
					if(router_array[i].groupid==2)
						continue;
					if(router_array[i].state==0)
						continue;

					if(router_array[i].state==2)
						ret++;
			}
			return ret;
	}


