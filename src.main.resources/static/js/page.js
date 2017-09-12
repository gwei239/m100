var listarray=new Array();
var pagejsonarray=new Array();
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



function  onretrun()
{
	document.getElementById('act').value = 'list';
	document.getElementById('pagecurrent').value = 1;		
	document.getElementById('form1').submit();


}	
function getselect_number()
{
		var i	= 0;
		var id	= 0;
		for (i = 0; i < document.getElementById('tbMain').rows.length - 2; i++)
		{
			if(document.getElementById('select' + i)==null)
					continue;
			if (document.getElementById('select' + i).checked)
			{
				id ++;
			}
		}
		return id;		
}


String.prototype.applyTemplate = function(obj) {
	var str = this;
	for (key in obj) {
		var reg = new RegExp("%" + key + "%", "g");
		str = str.replace(reg, obj[key]);
		reg = null;
	}
	return str;
}
var totalPages=0;
	function getobject(str)
	{
		return document.getElementById(str);
	}
	function getobjvalue(str)
	{
		return document.getElementById(str).value;
	}
	function changePage(page) {

		getobject('pagecurrent').value 	= page;
		getobject('form1').submit();		
	}

	function lastPage () {
		getobject('pagecurrent').value	= this.totalPages;
		getobject('form1').submit();		
	}	

	 function firstPage() {
			getobject('pagecurrent').value 	= 1;
			getobject('form1').submit();
	}

	function previousPage() {
 		getobject('pagecurrent').value 	= parseInt(getobject('pagecurrent').value) - 1;
		getobject('form1').submit();
	}

	function nextPage () {
		getobject('pagecurrent').value 	= parseInt(getobject('pagecurrent').value) + 1;
		getobject('form1').submit();
	}

	function onSelectAll(doSelect) {
	var i = 0;
	for (i = 0; i < document.getElementById('tbMain').rows.length; i++) {
		if(document.getElementById('select' + i)==null)
					continue;
		if(document.getElementById('select' + i).disabled == false)
			document.getElementById('select' + i).checked = doSelect;
	}
	}
	function getaction(act)
	{
		
	}
	function onAdd(){
		document.getElementById('act').value = 'add';
		document.getElementById('form1').submit();
	}
	
	function onDelete(id) {
		var confirmstr='确定删除该记录?';
		if (confirm(confirmstr)) {
			if(document.getElementById('act').value== 'select')	
				document.getElementById('act').value = 'selectdel';
			else
				document.getElementById('act').value = 'del';
			document.getElementById('id').value = id;
			document.getElementById('form1').submit();
		}
	}
	
	function idselect()
	{
			var i	= 0;
			var id	= '';
			for (i = 0; i < document.getElementById('tbMain').rows.length; i++)
			{
				if(document.getElementById('select' + i)==null)
					continue;
				if (document.getElementById('select' + i).checked)
				{
					id += document.getElementById('select' + i).value + ',';
				}
			}
			return id;
	}
	
	function onBatchDelete () {
		var i	= 0;
		var id	= '';
		var confirmstr='确定删除该记录?';
		if(getselect_number()>1)
			confirmstr='确定删除批量记录?';
			
		if(getselect_number()==0)
		{
			alert("请选择需要删除的记录!");
			return ;
		}	
			
		if (confirm(confirmstr)) {
			if(document.getElementById('act').value== 'select')	
				document.getElementById('act').value = 'selectdel';
			else
				document.getElementById('act').value = 'del';
			for (i = 0; i < document.getElementById('tbMain').rows.length - 2; i++) {
				if(document.getElementById('select' + i)==null)
					continue;
				if (document.getElementById('select' + i).checked) {
					id += document.getElementById('select' + i).value + ',';
				}
				
			}
				
			if (id != '') {
				id = id.substr(0, id.length - 1);
				document.getElementById('id').value = id;
				document.getElementById('form1').submit();
			}		
		}
	}
	function onStartIpsec()
	{
		document.getElementById('act').value = 'start';
		var id =idselect();
		if (id != '') {
			id = id.substr(0, id.length - 1);
			document.getElementById('id').value = id;
			document.getElementById('form1').submit();
		}		
	}
		function onStopIpsec()
	{
		document.getElementById('act').value = 'stop';
		var id =idselect();
		if (id != '') {
			id = id.substr(0, id.length - 1);
			document.getElementById('id').value = id;
			document.getElementById('form1').submit();
		}		
	}
	 function onDeleteAll(){
		if (confirm('确定清空记录?')) {
			if(document.getElementById('act').value== 'select')	
				document.getElementById('act').value = 'selectdelall';
			else
				document.getElementById('act').value = 'delall';
			if(document.getElementById('id')!=null)
				document.getElementById('id').value = '';
			document.getElementById('form1').submit();
		}
	}
		
	function onEdit(id) {
		document.getElementById('act').value = 'edit';
		document.getElementById('id').value = id;
		document.getElementById('form1').submit();
	}

	
	function initPage(recordCount, pageCurrent,pageNum) {
		

		
		var tmpSummary = '当前第%curpage%页 共%totalpage%页 每页%pageNum%条记录 共%totalrecord%条记录 ';
		var tmp1stPage = '<a href="javascript: firstPage();" title="首页">' +
						'<img src="/images/pageicon_first.gif" align="absmiddle"/></a> ';
		var tmpPrevPage = '<a href="javascript:previousPage();" title="前一页">' + 
						'<img src="/images/pageicon_prev.gif" align="absmiddle" /></a> ';
		var tmpNextPage = '<a href="javascript: nextPage();" title="下一页">' + 
						'<img src="/images/pageicon_next.gif" align="absmiddle" /></a> ';
		var tmpLastPage = '<a href="javascript: lastPage();" title="末页">' + 
						'<img src="/images/pageicon_last.gif" align="absmiddle" /></a> '; 
	


		var tmp1stPage_disabled = '<img src="/images/pageicon_first_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpPrevPage_disabled = '<img src="/images/pageicon_prev_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpNextPage_disabled = '<img src="/images/pageicon_next_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpLastPage_disabled = '<img src="/images/pageicon_last_disabled.gif" align="absmiddle" />&nbsp;&nbsp;' ;


		

		var htmlOut = '';
		 totalPages = Math.ceil(recordCount / pageNum) || 1;
		htmlOut += tmpSummary.applyTemplate({
							curpage: 		pageCurrent,
							totalpage:		totalPages,
							pageNum:        pageNum,
							totalrecord:	recordCount});
		
		if (pageCurrent > 1) {
			htmlOut += tmp1stPage;
			htmlOut += tmpPrevPage;
		}else
		{
		
			htmlOut += tmp1stPage_disabled;
			htmlOut += tmpPrevPage_disabled;
		}
		
		if (pageCurrent != totalPages && totalPages != 1) {
			htmlOut += tmpNextPage;
			htmlOut += tmpLastPage;
		}else
		{
			htmlOut += tmpNextPage_disabled;
			htmlOut += tmpLastPage_disabled;
			
		}
		
		htmlOut += '跳到第 <select name="selectPage" id="selectPage"> ';
		for (var i = 1; i <= totalPages; i++) {
			if (i == pageCurrent)
				htmlOut += '<option value="' + i + '" selected>' + i + '</option>';
			else
				htmlOut += '<option value="' + i + '">' + i + '</option>';
		}
		htmlOut += '</select>页 ' +
					'<a href="javascript: changePage(document.getElementById(\'selectPage\').value);" title="跳转">' + 
					'<img src="/images/pageicon_go.gif" align="absmiddle" /></a>';
		//document.writeln(htmlOut);
		document.getElementById('pagebar').innerHTML=htmlOut;
	

	}
function enablestr(varvalue)
{
	html='<td class="descri_right" title="'+varvalue+'">';
	if(varvalue==1)
		html+='<font class="nowarning" >启用</font></td>';
	else
		html+='<font class="warning" >禁用</font></td>';
	return html;
}

function list_item(title,varname,transfunc,width,act,icon)
{
	this.title=title;
	this.varname=varname;
	this.transfunc=transfunc;
	this.width=width;
	this.act=act;
	this.icon=icon;
}
function addlist(title,varname,transfunc,width,act,icon)
{
		listarray[listarray.length]=new list_item(title,varname,transfunc,width,act,icon);
}


function initlist_item(listdiv,jsonarray,tablename,keyvaluefunc)
{
	pagejsonarray=jsonarray;
	var html='<table border="0" cellspacing="1" cellpadding="1" id="tbMain" width="100%" style="border-left:#8ca0b8 1px solid;border-right:#8ca0b8 1px solid;border-bottom:#8ca0b8 1px solid;" >';
	html+='<tr>  <td colspan="'+(listarray.length+2)+'"  style=" background:url(/images/indextitlebg.gif) repeat-x;font-weight:bold; padding-left:20px; font-size:12px;" height="28">'+tablename+'</td></tr>'
	html+='<tr class="title"><td class="right" width="30" >';
	html+='<input type="checkbox" name="chkAll" id="chkAll" onClick="javascript: onSelectAll(this.checked);" /></td>';

	for (i in listarray)
	{
		if(listarray[i].width==null)
			html+='<td class="right">'+listarray[i].title+'</td>';
		else
			html+='<td class="right" width="'+ listarray[i].width+'">'+listarray[i].title+'</td>';
	}
	html+='</tr>';
	for(var i in jsonarray)
	{		
		 
			if(keyvaluefunc==null)
				html+='<tr><td class="descri_right"><input type="checkbox" name="select'+i+'" id="select'+i+'" value="'+ jsonarray[i]["id"]+'" ></td>';
			else
				html+='<tr><td class="descri_right"><input type="checkbox" name="select'+i+'" id="select'+i+'" value="'+keyvaluefunc(jsonarray[i])+'" ></td>';
			for (j in listarray)
			{
				if(listarray[j].transfunc!=null)
				{
					if(listarray[j].varname=="i")
						html+=listarray[j].transfunc(i);
					else
						html+=listarray[j].transfunc(jsonarray[i][listarray[j].varname]);

				}else if(listarray[j].act==null)
				{
					if(jsonarray[i][listarray[j].varname]!=null)
						html+='<td class="descri_right" title="'+jsonarray[i][listarray[j].varname]+'">'+jsonarray[i][listarray[j].varname]+'</td>';
					else
						html+='<td class="descri_right" title=""></td>';
				}else
				{
					if(listarray[j].varname!="i")
						html+='<td class="descri_right"><img src="'+listarray[j].icon+'"  onclick="'+listarray[j].act+'(\''+jsonarray[i][listarray[j].varname]+'\');"/></td>';
					else
						html+='<td class="descri_right"><img src="'+listarray[j].icon+'"  onclick="'+listarray[j].act+'(\''+i+'\');"/></td>';
				}
			}
			html+='</tr>';
	}
	html+='</table>';

	document.getElementById(listdiv).innerHTML=html;

}