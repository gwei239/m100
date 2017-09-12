package com.pplt.m100.web;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.entity.UserfileEntity;
import com.pplt.m100.service.FileManagerService;
import com.pplt.m100.service.RedisService;
import com.pplt.m100.vo.Right;
import com.pplt.m100.vo.UserFilePage;

@Controller
public class FileManageController {
	@Autowired
	private FileManagerService fileService;
	@Autowired
	private RedisService redisService;
	
	@RequestMapping("/filemanager.php")
	public String register(String user, HttpSession httpSession, Model model) {
		if(!StringUtils.isEmpty(user)){
			String session = redisService.getSessionByReplaceSession(user);
			if(StringUtils.isEmpty(session)){
				model.addAttribute("info", "会话无效，请重新打开文件管理链接！");
				return "errorpage";
			}else{
				redisService.delete(user);
				httpSession.setAttribute("usersession", session);
				return "filemanager";
			}
		}else{
			String usersession = (String)httpSession.getAttribute("usersession");
			if(StringUtils.isEmpty(usersession)){
				model.addAttribute("info", "会话无效，请重新打开文件管理链接！");
				return "errorpage";
			}else{
				UserEntity userEntity = null;
				if((userEntity=redisService.getUserBySession(usersession))==null){
					model.addAttribute("info", "会话已经失效，请重新登录用户！");
					return "errorpage";
				}else{
//					model.addAttribute("session", usersession);
//					model.addAttribute("userid", userEntity.getId());
					return "filemanager";
				}
			}
		}
	}
	
	@RequestMapping("/filemanager.list")
	@ResponseBody
	public Map<String,Object> getFileList(UserFilePage userFilePage,HttpSession httpSession){
		UserEntity user = getUser(httpSession);
		if(null == user) return null;
		userFilePage.setUserid(user.getId());
		userFilePage.setTableName(fileService.getUserFileTableFromUserId(user.getId()));
		List<UserfileEntity> fileList = fileService.getUserFile(userFilePage.initPage());
		for(UserfileEntity file : fileList){
			file.setRemovestr("<img src='/css/icons/edit_remove.png' onclick=OnDeleteOne('"+file.getFileuuid()+"');></img>");
		}
		Map<String,Object> ret = new HashMap<String,Object>();
		ret.put("rows", fileList);
		ret.put("total", fileService.getUserFileCount(userFilePage));
		return ret;
	}
	
	@RequestMapping("/filemanager.explode")
	public void getExplode(String fileuuid,HttpServletResponse response) throws IOException{
		if(StringUtils.isEmpty(fileuuid)) return;
		String tableName = fileService.getUserFileTableFromFileuuid(fileuuid);
		UserfileEntity query = new UserfileEntity(fileuuid, tableName);
		UserfileEntity file = fileService.getOneByFileuuid(query);
		if(null == file) return;		
		JSONArray acceptList = JSON.parseArray(file.getAcceptlist());
		if(null == acceptList) return;		
		StringBuffer sb = new StringBuffer("<table class='dv-table' border='0' style='width:100%;'>");
		for(int i=0; i<acceptList.size(); i++){
			JSONObject obj = acceptList.getJSONObject(i);
			String usermail = obj.getString("usermail");
			sb.append("<tr><td style='border-right:none;width:10%'></td>");
//			sb.append("<td style='border-right:none;width:5%;' class='dv-label'></td>");
			sb.append("<td style='border-right:none;width:70%;'>");
			sb.append("接收者:"+usermail);
			JSONObject right = obj.getJSONObject("right");
			if(right.getIntValue("copy") != 0){
				sb.append("-拷贝准许:是");
			}else{
				sb.append("-拷贝准许:否");
			}
			if(right.getIntValue("print") != 0){
				sb.append("-打印准许:是");
			}else{
				sb.append("-打印准许:否");
			}
			if(right.getIntValue("capture") != 0){
				sb.append("-截屏准许:是<br>");
			}else{
				sb.append("-截屏准许:否<br>");
			}
			if(right.getIntValue("delete") != 0){
				sb.append("立即准许:是");
			}else{
				sb.append("立即删除:否");
			}
			sb.append("-准许打开次数");
			sb.append(right.getIntValue("opencount"));
			sb.append("-已经打开次数");
			sb.append(right.getIntValue("hasnums"));
			sb.append("-准许使用时间");
			sb.append(right.getString("time"));
			sb.append("</td><td style='border-right:none;width:9%;'><img  title='修改' onclick='javascript:Oneditright(\"");
			sb.append(fileuuid).append("\",\"").append(usermail).append("\");'")
			.append("src='/css/icons/pencil.png'>  <a onclick='javascript:Oneditright(\"").append(fileuuid)
			.append("\",\"").append(usermail).append("\");'>修改</a></td>").append("<td style='border-right:none;width:9%;'>")
			.append("<img title='删除' onclick='javascript:OnDeleteOnemail(\"").append(fileuuid).append("\",\"").append(usermail)
			.append("\");'  src='/css/icons/edit_remove.png'>").append(" <a onclick='javascript:OnDeleteOnemail(\"").append(fileuuid)
			.append("\",\"").append(usermail).append("\");'>删除</a></tb><td  style='border-right:none;width:10%;'  ></td></tr>");
		}
		sb.append("</table>");
		OutputStream out =null;
		try {
			out = response.getOutputStream();
			out.write(sb.toString().getBytes());
		} catch (IOException e) {
			System.out.println(e);
		}finally{
			if(null != out){
				out.flush();
				out.close();
			}
		}
	}
	
	@RequestMapping("/filemanager.del")
	@ResponseBody
	public Map<String,Object> delFile(String id){
		Map<String,Object> ret = new HashMap<String,Object>();
		if(!StringUtils.isEmpty(id)){
			String[] ids = id.split(",");
			fileService.delFileByFileuuids(ids);
			ret.put("success", true);
		}else{
			ret.put("success", false);
			ret.put("msg", "参数错误");
		}
		return ret;
	}
	
	@RequestMapping("/userfileright.php")
	public String userFileRight(String fileuuid, String usermail, Model model){
		UserfileEntity query = new UserfileEntity(fileuuid, fileService.getUserFileTableFromFileuuid(fileuuid));
		UserfileEntity file = fileService.getOneByFileuuid(query);
		JSONArray acceptList = JSON.parseArray(file.getAcceptlist());
		for(int i=0; i<acceptList.size(); i++){
			JSONObject obj = acceptList.getJSONObject(i);
			if(usermail.equals(obj.getString("usermail"))){
				JSONObject right = obj.getJSONObject("right");
				model.addAttribute("right", right);
				if(null != right.getString("time")){
					String[] timearray = right.getString("time").split("-");
					model.addAttribute("starttime", timearray[0]);
					model.addAttribute("endtime", timearray[1]);
				}else{
					model.addAttribute("starttime", "");
					model.addAttribute("endtime", "");
				}
			}		
		}
		model.addAttribute("fileuuid", fileuuid);
		model.addAttribute("usermail", usermail);
		return "userfileright";
	}
	
	@RequestMapping("/userfileright.update")
	@ResponseBody
	public String updateRight(Right right){
		fileService.updateFileRight(right);
		return "修改成功！";
	}
	
	@RequestMapping("/filemanager.delsenduser")
	@ResponseBody
	public Map<String,Object> delSendUser(String mail, String fileuuid){
		Map<String,Object> ret = new HashMap<String,Object>();
		fileService.delMailInSendfile(fileuuid, mail);
		ret.put("success", true);
		return ret;
	}
	
	private UserEntity getUser(HttpSession httpSession){
		String usersession = (String)httpSession.getAttribute("usersession");
		if(StringUtils.isEmpty(usersession)){
			return null;
		}
		return redisService.getUserBySession(usersession);
	}
}
