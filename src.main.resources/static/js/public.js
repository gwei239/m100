/*
	x page base class.
*/
Namespace.register("x");
Namespace.register("x.pagebase");
x.pagebase = {
	totalPages:		1,
	tbMain: 		null,
	bshowSearch: 	false,								// current search status
	
	// make table colorful
	renderTable: function() {										
		for (var i = 1; i < $('tbMain').rows.length; i++) {
			for (var j = 0; j < $('tbMain').rows[i].cells.length; j++) {
				$('tbMain').rows[i].cells[j].className = 'tbMain_td' + (i % 2);
			}
		}	
	},
	
	// show/hide search box
	onShowSearch: function() {
		if (this.bshowSearch) {
			this.bshowSearch = false;
			$('tbSearch').style.display = 'none';
		} else {
			this.bshowSearch = true;
			$('tbSearch').style.display = '';
			$('name').focus();
		}
	},	
	
	onAdd: function() {
		$('act').value = 'add';
		$('form').submit();
	},
	
	onDelete: function(id) {
		if (confirm('确定删除该记录?')) {
			$('act').value = 'del';
			$('id').value = id;
			$('form').submit();
		}
	},
	
	onBatchDelete: function() {
		var i	= 0;
		var id	= '';
		if (confirm('确定批量删除记录?')) {
			$('act').value = 'del';
			for (i = 0; i < $('tbMain').rows.length - 1; i++) {
				if ($('select' + i).checked) {
					id += $F('select' + i) + ',';
				}
			}
			
			if (id != '') {
				id = id.substr(0, id.length - 1);
				$('id').value = id;
				$('form').submit();
			}		
		}
	},
	
	onDeleteAll: function() {
		if (confirm('确定清空数据库记录?')) {
			$('act').value = 'delall';
			$('id').value = '';
			$('form').submit();
		}
	},
		
	onEdit: function(id) {
		$('act').value = 'edit';
		$('id').value = id;
		$('form').submit();
	},

	onShow: function(id) {
		$('act').value = 'show';
		$('id').value = id;
		$('form').submit();
	},
	onLoadUser: function() {
		$('act').value = 'user_input_up';
		$('form').submit();
	},

	onUserEdit: function(id) {
		$('act').value = 'menu';
		$('id').value = id;
		$('form').submit();
	},
	onuseraccount:function(id,name){
		$('act').value = 'user_account_list';
		$('id').value = id;
		$('hname').value = name;
		$('form').submit();
		},				
	onLogininfor:function(id,name){
		$('act').value = 'getlogininfor';
		$('id').value = id;
		$('hname').value = name;
		$('form').submit();
		},
	onOnlineLogininfor:function(session,name){
		$('act').value = 'getonlinelogininfor';
		$('session').value = session;
		$('hname').value = name;
		$('form').submit();
		},	
	onShowNonLocal: function(userid, name, usertype, serverid){
		$('act').value = 'show';
		$('userid').value = userid;
		$('hname').value = name;
		$('usertype').value = usertype;
		$('serverid').value = serverid;

		$('form').submit();
	},
	
	
	onSelectAll: function(doSelect) {
		var i = 0;
		for (i = 0; i < $('tbMain').rows.length - 1; i++) {
			if($('select' + i).disabled == false)
				$('select' + i).checked = doSelect;
		}
	},
	
	onReverseSelect: function() {	
		var i = 0;
		$('chkAll').checked = false;
		for (i = 0; i < $('tbMain').rows.length - 1; i++) {
			$('select' + i).checked = !$('select' + i).checked;
		}
	},	
	
	changePage: function(page) {
		$('act').value 			= 'list';
		//$('form').method		= 'GET';
		$('pagecurrent').value 	= page;
		$('form').submit();		
	},
	
	lastPage: function() {
	//	$('act').value 			= 'list';
		//$('form').method		= 'GET';
		$('pagecurrent').value	= this.totalPages;
		$('form').submit();		
	},
	
	firstPage: function() {
	//	$('act').value 			= 'list';
		//$('form').method		= 'GET';
		$('pagecurrent').value 	= 1;
		$('form').submit();
	},
	
	previousPage: function() {
	//	$('act').value 			= 'list';
		//$('form').method		= 'GET';
		$('pagecurrent').value 	= parseInt($('pagecurrent').value) - 1;
		$('form').submit();
	},
	
	nextPage: function() {
//		$('act').value 			= 'list';
		//$('form').method		= 'GET';
		$('pagecurrent').value 	= parseInt($('pagecurrent').value) + 1;
		$('form').submit();
	},
	
	// initialize sortable table
	initTable: function() {
	},
	
	// initialize page navigator
	initPage: function() {
		$('pagebar').innerHTML = this.getPageCode(this.recordCount, 
												this.pageNum, 
												this.currentPage)
	},
		
	
	getPageCode: function(recordCount, pageNum, pageCurrent) {
		
		var tmpSummary = '当前第%curpage%/%totalpage%页 共%totalrecord%条记录 ';
		var tmp1stPage = '<a href="javascript: page.firstPage();" title="首页">' +
						'<img src="/images/pageicon_first.gif" align="absmiddle"/></a> ';
		var tmpPrevPage = '<a href="javascript: page.previousPage();" title="前一页">' + 
						'<img src="/images/pageicon_prev.gif" align="absmiddle" /></a> ';
		var tmpNextPage = '<a href="javascript: page.nextPage();" title="下一页">' + 
						'<img src="/images/pageicon_next.gif" align="absmiddle" /></a> ';
		var tmpLastPage = '<a href="javascript: page.lastPage();" title="末页">' + 
						'<img src="/images/pageicon_last.gif" align="absmiddle" /></a> '; 
	


		var tmp1stPage_disabled = '<img src="/images/pageicon_first_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpPrevPage_disabled = '<img src="/images/pageicon_prev_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpNextPage_disabled = '<img src="/images/pageicon_next_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
		var tmpLastPage_disabled = '<img src="/images/pageicon_last_disabled.gif" align="absmiddle" />&nbsp;&nbsp;' ;


		

		var htmlOut = '';
		this.totalPages = Math.ceil(recordCount / pageNum) || 1;
		
		htmlOut += tmpSummary.applyTemplate({
							curpage: 		pageCurrent,
							totalpage:		this.totalPages,
							totalrecord:	recordCount});
		
		if (pageCurrent > 1) {
			htmlOut += tmp1stPage;
			htmlOut += tmpPrevPage;
		}else
		{
		
			htmlOut += tmp1stPage_disabled;
			htmlOut += tmpPrevPage_disabled;
		}
		
		if (pageCurrent != this.totalPages && this.totalPages != 1) {
			htmlOut += tmpNextPage;
			htmlOut += tmpLastPage;
		}else
		{
			htmlOut += tmpNextPage_disabled;
			htmlOut += tmpLastPage_disabled;
			
		}
		
		htmlOut += '跳到第 <select name="selectPage" id="selectPage"> ';
		for (var i = 1; i <= this.totalPages; i++) {
			if (i == pageCurrent)
				htmlOut += '<option value="' + i + '" selected>' + i + '</option>';
			else
				htmlOut += '<option value="' + i + '">' + i + '</option>';
		}
		htmlOut += '</select>页 ' +
					'<a href="javascript: page.changePage($F(\'selectPage\'));" title="跳转">' + 
					'<img src="/images/pageicon_go.gif" align="absmiddle" /></a>';
		//document.writeln(htmlOut);
		return htmlOut;
	}

}

var tabSelector = {
	selected: null,
	
	over: function(elem) {
		elem.className = 'active';
	},
	
	out: function(elem) {
		if (elem != this.selected) {
			elem.className = '';
		}
	},
	
	onclick: function(elem) {
		if (this.selected) {
			this.selected.className = '';
		}
		this.selected = elem;
	}
}
