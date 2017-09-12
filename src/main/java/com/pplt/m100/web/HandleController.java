package com.pplt.m100.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pplt.m100.service.HandleService;
import com.pplt.m100.vo.HandleMessage;

@RestController
public class HandleController {
	@Autowired
	private HandleService handleService;
	
	@RequestMapping("/handle/handle.php")
	public HandleMessage handle(String act,String name,String pass,String session,String filerequestjson,String rightjson,String fileid
			,String oldpass,String newpass,String version,String module,String type,String content,String info,String lastcount,String infor) {
		if(StringUtils.isEmpty(act)){
			return new HandleMessage(-200,"input arugument error");		
		}
		if("login".equals(act)){
			return handleService.login(name, pass);
		}
		if("logout".equals(act)){
			return handleService.logout(session);
		}
		if("islogin".equals(act)){
			return handleService.isLogin(session);
		}
		if("requestsendfile".equals(act)){
			return handleService.requestSendFile(session, filerequestjson);
		}
		if("setfileright".equals(act)){
			return handleService.setFileRight(session, rightjson);
		}
		if("getfileinfor".equals(act)){
			return handleService.getFileInfo(session, fileid);
		}
		if("changepass".equals(act)){
			return handleService.changePass(session, oldpass, newpass);
		}
		if("getlastuserlist".equals(act)){
			return handleService.getLastUserList(session, lastcount);
		}
		if("updatainfor".equals(act)){
			return handleService.updateinfo(version);
		}
		if("clientlog".equals(act)){
			return handleService.clientlog(module, type, content);
		}
		if("clieninfo".equals(act)){
			return handleService.clientinfo(info);
		}
		if("adddevicer".equals(act)){
			return handleService.adddevicer(session, infor);
		}
		if("getfilemanagerurl".equals(act)){
			return handleService.getFileManagerUrl(session);
		}
		if("getdevicemanagerurl".equals(act)){
			return handleService.getDeviceManagerUrl(session);
		}
		if("getaccountpayurl".equals(act)){
			return handleService.getAccountPayUrl(session);
		}
		return new HandleMessage(-199,"system unhandled access error");
	}
}
