function formatstate(val,row){   
	if (val ==1){   
		return '<span style="color:green;">启用</span>';   
	 } else {   
		return '<span style="color:red;">停用</span>';   
	 }   
}  
	 
$(function(){

	$('#dg').datagrid({
		height:"500",
        width:"100%",
		nowrap: false,
		striped: true,			 
		url:'/filemanager.list',
		sortName: 'createtime',
		sortOrder: 'desc',
		method:"post",
		fitColumns:true,
		loadMsg:"正在载入数据,请稍侯!",
		idField:'id',			
		pagination:true,
		rownumbers:true,
		queryParams:{   
			starttime: $("#starttime").datetimebox('getValue'),   
			endtime: $("#endtime").datetimebox('getValue'),   
			filename: $('#filename').val(),
			recvuser: $('#recvuser').val()					
		},
		view: detailview,
		detailFormatter:function(index,row){
			return '<div id="ddv-' + index + '" style="padding:5px 0"></div>';
		},
		onExpandRow: function(index,row){
			$('#ddv-'+index).panel({
				border:false,
				cache:false,
				href:'/filemanager.explode?fileuuid='+row.fileuuid,
				onLoad:function(){
					$('#dg').datagrid('fixDetailRowHeight',index);
				}
			});
			$('#dg').datagrid('fixDetailRowHeight',index);
		}
	 
	});
	
	var p = $('#dg').datagrid('getPager');
	$(p).pagination({
		onBeforeRefresh:function(){
			 
		}
	});
});
	
function duibi(a, b) {
	var arr = a.split("-");
	var starttime = new Date(arr[0], arr[1], arr[2]);
	var starttimes = starttime.getTime();

	var arrs = b.split("-");
	var lktime = new Date(arrs[0], arrs[1], arrs[2]);
	var lktimes = lktime.getTime();

	if (starttimes >= lktimes) {

		alert('开始时间大于结束时间，请检查');
		return false;
	}
	else  if(lktimes-starttimes>24*60*60*1000*180)
	{
		alert('不能查询时间间隔超过180天的数据，请重新输入开始和结束时间');
		return false;
	}else
	{
		return true;
	}
}
	
function  onSearch(){
	 if(duibi($("#starttime").datetimebox('getValue'),$("#endtime").datetimebox('getValue'))==false)
		  return;
	 $('#dg').datagrid('load',{  	  
		starttime: $("#starttime").datetimebox('getValue'),   
		endtime: $("#endtime").datetimebox('getValue'),   
		filename: $('#filename').val(),
		recvuser: $('#recvuser').val()
	});   
	$('#dg').datagrid('reload');	// reload the user data

}

function OnAdd(){
	$('#dlg').dialog('open').dialog('setTitle','配置编辑');
	$('#fm').form('clear');
	url = getcurrenturl()+'?act=save';
	}
 
function OnDelete(){ 
	var ids ="";
	var rows = $('#dg').datagrid('getSelections');
	if (rows){
		for(var i=0; i<rows.length; i++){
			ids+=(rows[i].fileuuid)+",";
		}
		$.messager.confirm('操作提醒','你确定要删除以下记录吗？',function(r){
			if (r){
					$.post('filemanager.del',{id:ids},function(result){
					if (result.success){
						$('#dg').datagrid('reload');	// reload the user data
					} else {
						$.messager.show({	// show error message
							title: 'Error',
							msg: result.msg
						});
					}
				},'json');
			}
		});
	}
}

function getindex(fileuuid){
	var rows = $('#dg').datagrid('getRows');
	if (rows){
		for(var i=0; i<rows.length; i++){
				if(rows[i].fileuuid==fileuuid)
				return i;
		}
	}
	return 0;
}

function OnDeleteOnemail(fileuuid,mail){ 
	$.messager.confirm('操作提醒','你确定要删除以下记录吗？',function(r){
		if (r){
			$.post('/filemanager.delsenduser?mail='+mail+'&fileuuid='+fileuuid,{id:fileuuid},function(result){
				if (result.success){
					//	$('#dg').datagrid('reload');	// reload the user data
					var index = getindex(fileuuid);
					$('#ddv-'+index).panel({
						border:false,
						cache:false,
						href:'/filemanager.explode?fileuuid='+fileuuid,
						onLoad:function(){
						$('#dg').datagrid('fixDetailRowHeight',index);
						}
					});
					$('#dg').datagrid('fixDetailRowHeight',index);
				} else {
					$.messager.show({	// show error message
						title: 'Error',
						msg: result.msg
					});
				}
			},'json');
		}
	});	 
}
 
function Oneditright(fileuuid,usermail){	 
	var url = '/userfileright.php?fileuuid='+fileuuid+'&usermail='+usermail;	 
	if(window.showModalDialog!=undefined){
		window.showModalDialog(url, window, "status: no; dialogWidth: 500px;" +"dialogHeight: 400px; center: yes;" + "help: no; scroll: no;");

	}else{ 
 		window.open(url,"modal",'height=400px,width=500px, toolbar=no,center=yes,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
	}
	var index = getindex(fileuuid);
 	$('#ddv-'+index).panel({
		border:false,
		cache:false,
		href:'/filemanager.explode?fileuuid='+fileuuid,
		onLoad:function(){
			$('#dg').datagrid('fixDetailRowHeight',index);
		}
	});

} 

function dateFormatter (value) {
    var date = new Date(value);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1);
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}