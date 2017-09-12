setTimeout(function(){
	var conf = {};
	try{
		conf = tianji_config;
	}catch(e){}
	$CKE.pop.innerHTML = '<div class="jiadiv_01" > \
		<div style="width:100%;background:#F2F2F2;border-bottom:1px solid #E5E5E5;line-height:200%;padding-left:5px;font-size:12px"><table  width=100% ><tr><td align=left ><b style="font-size:12px">分享到...<\/b><\/td><td align=right ><b style="font-size:12px;" >'+(conf.siteName?conf.siteName.replace(/^(.{7}).*/,'$1...')+'&nbsp;&nbsp;':'')+'<\/b><\/td><\/tr><\/table><\/div> \
		<div class="jiadiv_02" style="width:100%;"> \
<a href="#" onclick="jt_copyUrl();return false;" class="jiatitle"><span class="jtico jtico_copy">复制网址</span><input type="hidden" value="复制" /></a>\
<a href="#" onclick="tianji_sendto(\'email\');return false;" class="jiatitle"><span class="jtico jtico_email">邮件</span><input type="hidden" value="邮件" /></a>\
<a href="#" onclick="tianji_sendto(\'qzone\');return false;" class="jiatitle"><span class="jtico jtico_qzone">QQ空间</span><input type="hidden" value="QQ空间" /></a>\
<a href="#" onclick="tianji_sendto(\'tsina\');return false;" class="jiatitle"><span class="jtico jtico_tsina">新浪微博</span><input type="hidden" value="新浪微博" /></a>\
<a href="#" onclick="tianji_sendto(\'msn\');return false;" class="jiatitle"><span class="jtico jtico_msn">MSN</span><input type="hidden" value="MSN" /></a>\
<a href="#" onclick="tianji_sendto(\'tqq\');return false;" class="jiatitle"><span class="jtico jtico_tqq">腾讯微博</span><input type="hidden" value="腾讯微博" /></a>\
<a href="#" onclick="tianji_sendto(\'renren\');return false;" class="jiatitle"><span class="jtico jtico_renren">人人网</span><input type="hidden" value="人人网" /></a>\
<a href="#" onclick="tianji_sendto(\'kaixin001\');return false;" class="jiatitle"><span class="jtico jtico_kaixin001">开心网</span><input type="hidden" value="开心网" /></a>\
<a href="#" onclick="tianji_sendto(\'t163\');return false;" class="jiatitle"><span class="jtico jtico_t163">网易微博</span><input type="hidden" value="网易微博" /></a>\
<a href="#" onclick="tianji_sendto(\'tsohu\');return false;" class="jiatitle"><span class="jtico jtico_tsohu">搜狐微博</span><input type="hidden" value="搜狐微博" /></a>\
<a href="#" onclick="tianji_sendto(\'xiaoyou\');return false;" class="jiatitle"><span class="jtico jtico_xiaoyou">腾讯朋友</span><input type="hidden" value="腾讯朋友" /></a>\
<a href="#" onclick="tianji_sendto(\'tieba\');return false;" class="jiatitle"><span class="jtico jtico_tieba">百度贴吧</span><input type="hidden" value="百度贴吧" /></a>\
<a href="#" onclick="tianji_sendto(\'taobao\');return false;" class="jiatitle"><span class="jtico jtico_taobao">淘江湖</span><input type="hidden" value="淘江湖" /></a>\
<a href="#" onclick="tianji_sendto(\'baidu\');return false;" class="jiatitle"><span class="jtico jtico_baidu">百度搜藏</span><input type="hidden" value="百度搜藏" /></a>\
<a href="#" onclick="tianji_sendto(\'douban\');return false;" class="jiatitle"><span class="jtico jtico_douban">豆瓣</span><input type="hidden" value="豆瓣" /></a>\
<a href="#" onclick="$CKE.center(this);return false;" class="jiatitle"><span class="jtico jtico_more" >查看更多(110)</span><input type="hidden" value="更多" /></a>\
			<div style="clear:both"></div>\
		<\/div> \
		<div class="ckepopBottom" style="width:100%;"> \
			<div style="float:left;font-size:10px"><a href="http://tj.see-say.com/what-is-tianji.asp" class="link_01" style="color:#333333;" target="_blank">这是什么工具?</a></div>\
				<div style="float:right;font-size:11px;margin:0 5px 0 0;">\
					<img src="http://tj.see-say.com/code/images/img_012.gif" border="none" />\
					<a href="http://tj.see-say.com/" style="color:#333333;padding:0 3px;" class="link_01" target="_blank">TianJi</a>\
				</div>\
			<div style="clear:both"></div>\
		</div>\
	</div>'
//$CKE.over();
},0)
