	function tablelist(tablediv,varname,column)
	{
		this.tablediv =tablediv;
		this.column=column;	
		this.varname=varname;
		this.datasource=new Array();
		this.idsource=new Array();
	}
	
	
	tablelist.prototype.getnamefromlist_byid =function (listname,id)
	{
			var len = document.getElementById(listname).length;	
			for (var i=0;i<len;i++)
			{	
				if(document.getElementById(listname ).options[i].value==id)
					return document.getElementById(listname).options[i].text;
			}
			return null;
	}
	
	tablelist.prototype.selectall=function()
	{
		var checked =document.getElementById('selectall' +this.varname).checked;
		for(i=0;i<this.idsource.length;i++)	
		{
				if(document.getElementById('select' +this.varname+ i).disabled == false)
					document.getElementById('select' +this.varname+ i).checked = checked;
		}
	}
	tablelist.prototype.readdatasource_fromidsourcestr=function(str)
	{
			
			var netlist=str;
			var strs= new Array(); //定义一数组
			strs=netlist.split(";"); //字符分割      
			
			for (i=0;i<strs.length ;i++ ) 
			{
				if(strs[i]!="")
				{
					var netitem=new Array();
					netitem =strs[i].split("|");
					var obj_item=new Array();
					for(j=0;j<netitem.length;j++)
					{
						obj_item.push(this.getnamefromlist_byid(arguments[j+1],netitem[j]));
					}
					this.idsource .push(strs[i]);
					this.datasource.push(obj_item);
				}				
			} 
	}
	
	tablelist.prototype.inittable=function(del_ex)
	{
		
		
		var html='<table  id="'+this.varname+'table" class="datetable" border="0" cellspacing="0" cellpadding="0" width="80%" >';
		html+='<tr class="tabtitle">';
		
		html+='<td class="tabright" width="30" ><input type="checkbox" id="selectall'+this.varname+'" onClick="'+this.varname+'.selectall();" /</td>'
		
		for(i=0;i<this.column.length;i++)
		{
			html+='<td class="tabright">'+this.column[i]+'</td>';
		}
		html+='<td class="tabright" width="40">删除</td>';
		html+='</tr>';
		
		for(j=0;j<this.datasource.length;j++)
		{
			html+='<tr><td class="descri_tabright"><input type="checkbox"  id="select'+this.varname+j+'" value="'+j+'"' 
				
			if(del_ex!=1&&document.getElementById("select"+this.varname+j)!=null
			&&document.getElementById("select"+this.varname+j).checked==true)
				html+="checked";
			html+='></td>';
				
			for(i=0;i<this.column.length;i++)
			{
				html+='<td class="descri_tabright" title="'+this.datasource[j][i]+'">'+this.datasource[j][i]+'</td>';
			}
				html+='<td class="descri_tabright"><img src="/images/icon_delete_row.gif" onClick="'+this.varname+'.delcolumn('+j+');"/></td></tr>'     
			}
			
		html+="</table>";
		document.getElementById(this.tablediv).innerHTML=html;
		
		
	}
	
	tablelist.prototype.delcolumn=function(column)
	{
			this.idsource.splice(column,1);
			this.datasource.splice(column,1);
			this.inittable();
	}
	

	tablelist.prototype.getselect_txt=function(list)
	{
			return this.getnamefromlist_byid(list,$(list).value);
	}
	
	tablelist.prototype.addcolumn=function()
	{
		var id="";
		var txtarray=new Array();
		for(i=0;i<arguments.length;i++)
		{
			
			if(i==(arguments.length-1))
			{	
				id+=$(arguments[i]).value;
			}
			else
			{	
				id+=$(arguments[i]).value+'|';
			}	
			txtarray.push(this.getselect_txt(arguments[i]));

		}
		
		for(i=0;i<this.idsource.length;i++)
		{
			//	alert(this.idsource[i]+':'+id);
			if(this.idsource[i]==id)
			{
				alert("该规则已经存在！");
				return;	
			}
		}
		this.idsource.push(id);
		this.datasource.push(txtarray);
		this.inittable();
	}


	tablelist.prototype.delcolumn_ex=function()
	{
		var i	= 0;		
		leng =this.datasource.length;
		for (i = leng-1; i>-1; i--)
		{
			if (document.getElementById('select'+this.varname+ i).checked)
			{
				this.idsource.splice(i,1);
				this.datasource.splice(i,1);
		
			}
		}
				this.inittable(1);		

	}
	
	tablelist.prototype.delallcolumn=function()
	{
		this.idsource =new Array();
		this.datasource =new Array();
		this.inittable();
	}

	tablelist.prototype.getvalue_fromtable=function()
	{
		var valueret="";	
		for(i=0;i<this.idsource.length;i++)
		{
			valueret +=	this.idsource[i]+';';
		}
		return valueret;
	}