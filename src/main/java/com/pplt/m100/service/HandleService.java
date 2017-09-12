package com.pplt.m100.service;

import java.net.URLEncoder;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.pplt.m100.configure.OtherProperties;
import com.pplt.m100.entity.ClientinfoEntity;
import com.pplt.m100.entity.ClientupdateEntity;
import com.pplt.m100.entity.DeviceEntity;
import com.pplt.m100.entity.SyslogEntity;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.entity.UserfileEntity;
import com.pplt.m100.mapper.ClientinfoMapper;
import com.pplt.m100.mapper.ClientupdateMapper;
import com.pplt.m100.mapper.DeviceMapper;
import com.pplt.m100.mapper.SyslogMapper;
import com.pplt.m100.mapper.UserfileMapper;
import com.pplt.m100.util.Md5Util;
import com.pplt.m100.vo.HandleMessage;
import com.pplt.m100.vo.MailObj;

@Service
public class HandleService {
	private static final HashMap<String,Integer> errCode = new HashMap<String,Integer>();
	private static final HashMap<Integer,String> errMessage = new HashMap<Integer,String>();
	static{
		errCode.put("SUCCESS", 0);
		errCode.put("ERROR_NO_HANDLE_ACCESS", -199);
		errCode.put("ERROR_AUGUMENT", -200);
		errCode.put("ERROR_LOGIN_PASSWORD", -201);
		errCode.put("ERROR_USERNOLOGIN", -202);
		errCode.put("ERROR_USERHAVELOGIN", -203);
		errCode.put("ERROR_USERLOGIN_TIMEOUT", -204);
		errCode.put("ERROR_USERNORIGHT_ACCESS", -205);
		errCode.put("ERROR_NO_UPDATE_INFOR_ERROR", -206);
		errCode.put("ERROR_CHANGE_PASS_OLD_ERROR", -207);
		errCode.put("ERROR_LOGIN_DISABLE", -208);
		errCode.put("ERROR_SERVER_EXPIRATION", -209);
		errMessage.put(0, "sucess");
		errMessage.put(-200, "input arugument error");
		errMessage.put(-201, "user login user password error");
		errMessage.put(-199, "system unhandled access error");
		errMessage.put(-203, "user have login now");
		errMessage.put(-204, "user login timeout");
		errMessage.put(-205, "user have not right to access file");
		errMessage.put(-206, "no packet update info");
		errMessage.put(-202, "user not login");
		errMessage.put(-207, "user change password oldpassword error");
		errMessage.put(-208, "user login  error user disabled");
		errMessage.put(-209, "server error server expiration");
	}
	private static final long EXPIRT_TIMEOUT = 3000;	
	@Autowired
	private RedisService redisService; 	
	@Autowired
	private UserService userService; 	
	@Autowired
	private SyslogMapper syslogMapper;	
	@Autowired
	private ClientinfoMapper clientinfoMapper;	
	@Autowired
	private ClientupdateMapper clientupdateMapper;	
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private UserfileMapper userfileMapper;
	@Autowired
	private OtherProperties properties;
	@Autowired
	private FileManagerService fileService;
	
	public HandleMessage login(String name,String pass){
		UserEntity user = null;
		if(StringUtils.isEmpty(pass) || StringUtils.isEmpty(pass)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		if((user=userVerify(name,pass)) == null){
			return new HandleMessage(errCode.get("ERROR_LOGIN_PASSWORD"),errMessage.get(errCode.get("ERROR_LOGIN_PASSWORD")));			
		}
		if(null == user || user.getEnable() != 1){
			return new HandleMessage(errCode.get("ERROR_LOGIN_DISABLE"),errMessage.get(errCode.get("ERROR_LOGIN_DISABLE")));					
		}
		String oldSession = redisService.getSession(user.getId());
		if(null != oldSession){
			redisService.delete(oldSession);
			redisService.delete("session:"+user.getId());
		}
		Timestamp today = new Timestamp(System.currentTimeMillis());
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String session = Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
		user.setLastaccesstime(today);
		redisService.setUserBySession(session, user, EXPIRT_TIMEOUT);
		redisService.setSession(user.getId(), session);
		Map<String,String> retjson = new HashMap<String,String>();
		retjson.put("session", session);
		retjson.put("systemtime", dateFormat.format(today));
		if(user.getEndtime().after(today) && user.getType() == 1){
			user.setType(0);
		}else{
			retjson.put("userttype", user.getType()+"");
		}
		retjson.put("endtime", dateFormat.format(user.getEndtime()));
		retjson.put("userright", user.getRight());
		userService.updateUser(user);
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")), retjson);		
	}
	
	public HandleMessage logout(String session){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = redisService.getUserBySession(session);
		if(null != user){
			redisService.delete("session:"+user.getId());
			redisService.delete(session);
		}
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));	
	}
	
	public HandleMessage isLogin(String session){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = redisService.getUserBySession(session);
		if(null == user){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		long now = System.currentTimeMillis()/1000;
		long lastaccesstime = user.getLastaccesstime().getTime()/1000;
		if(now - lastaccesstime > EXPIRT_TIMEOUT){
			redisService.delete(session);
			return new HandleMessage(errCode.get("ERROR_USERLOGIN_TIMEOUT"),errMessage.get(errCode.get("ERROR_USERLOGIN_TIMEOUT")));
		}
		user.setLastaccesstime(new Timestamp(System.currentTimeMillis()));
		redisService.setUserBySession(session, user, EXPIRT_TIMEOUT);
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));	 
	}
	
	public HandleMessage clientlog(String module, String type, String content){
		if(StringUtils.isEmpty(module)||StringUtils.isEmpty(type)||StringUtils.isEmpty(content)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		try{
			SyslogEntity syslog = new SyslogEntity(Integer.parseInt(module), Integer.parseInt(type), content, new Timestamp(System.currentTimeMillis()));
			syslogMapper.insert(syslog);			
		}catch(Exception e){
			System.out.println(e.getMessage());
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));
	}
	
	public HandleMessage clientinfo(String info){
		if(StringUtils.isEmpty(info)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		ClientinfoEntity clientinfoEntity = new ClientinfoEntity(info);
		clientinfoMapper.insert(clientinfoEntity);
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));
	}
	
	public HandleMessage updateinfo(String version){
		if(StringUtils.isEmpty(version)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		ClientupdateEntity clientupdateEntity = clientupdateMapper.getOneByVersion(version);
		if(null == clientupdateEntity){
			return new HandleMessage(errCode.get("ERROR_NO_UPDATE_INFOR_ERROR"),errMessage.get(errCode.get("ERROR_NO_UPDATE_INFOR_ERROR")));
		}
		Map<String,String> retjson = new HashMap<String,String>();
		retjson.put("updateurl", "https://"+properties.getHost()+"/getupdatefile.php?id="+clientupdateEntity.getId());
		retjson.put("updateconf", clientupdateEntity.getUpdateconf());
		retjson.put("lastpacketversion", clientupdateEntity.getLastpacketversion());
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);
	}
	
	public HandleMessage adddevicer(String session,String infor){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		DeviceEntity device = new DeviceEntity();
		device.setUserid(user.getId());
		try{
			JSONObject deviceinfo = JSON.parseObject(infor);
			if(null != deviceinfo){
				device.setName(deviceinfo.getString("name"));
				device.setType(deviceinfo.getString("type"));
				device.setDeviceinfo(deviceinfo.getString("deceiveinfo"));
				device.setCreatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Timestamp(System.currentTimeMillis())));
				deviceMapper.insert(device);
			}
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));	
	}
	
	public HandleMessage requestSendFile(String session,String filerequestjson){
		if(StringUtils.isEmpty(session) || StringUtils.isEmpty(filerequestjson)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		JSONArray fileJsons = JSON.parseArray(filerequestjson);
		List<UserfileEntity> userfileList = new LinkedList<UserfileEntity>();
		List<Map<String,String>> retjson = new LinkedList<Map<String,String>>();
		List<String> mails = new ArrayList<String>();
		for(int i=0; i<fileJsons.size(); i++){
			JSONObject jsonb = fileJsons.getJSONObject(i);
			UserfileEntity userfile = new UserfileEntity();
			userfile.setUserid(user.getId());
			userfile.setFilename(jsonb.getString("filename"));
			
			JSONArray acceptList = jsonb.getJSONArray("acceptlist");
			for(int j=0; j<acceptList.size(); j++){
				String mail = acceptList.getJSONObject(j).getString("usermail");
				if(!mails.contains(mail)){
					mails.add(mail);
				}
			}
			
			userfile.setAcceptlist(acceptList.toJSONString());			
			userfile.setFileuuid(String.valueOf(user.getId()%1000+1000).substring(1,4)
					+Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes()));
			userfile.setFilepass(Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes()));
			userfile.setCreatetime(new Timestamp(System.currentTimeMillis()));
			userfileList.add(userfile);
			
			Map<String,String> map = new HashMap<String,String>();
			map.put("filename", userfile.getFilename());
			map.put("fileuuid", userfile.getFileuuid());
			map.put("filepass", userfile.getFilepass());
			retjson.add(map);			
		}
		fileRequestDBOpertate(user,userfileList);
		addNewContact(user.getId(),mails);
		sendMail2Contact(user.getMail(),mails);
		
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);	
	}
	
	public HandleMessage setFileRight(String session, String rightjson){
		if(StringUtils.isEmpty(session) || StringUtils.isEmpty(rightjson)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		JSONArray files = JSON.parseArray(rightjson);
		for(int i=0; i<files.size(); i++){
			JSONObject obj = files.getJSONObject(i);
			String fileuuid = obj.getString("fileuuid");
			
			String userFileTable = fileService.getUserFileTableFromFileuuid(fileuuid);
			UserfileEntity query = new UserfileEntity(fileuuid,userFileTable);
			UserfileEntity oldFile = userfileMapper.findOneByFileuuid(query);
			JSONArray acceptList = JSON.parseArray(oldFile.getAcceptlist());
			for(int j=0; j<acceptList.size(); j++){
				JSONObject accept = acceptList.getJSONObject(j);
				if(accept.getString("usermail").equals(user.getMail())){
					accept.put("right", obj.get("right"));
				}
			}
			oldFile.setAcceptlist(acceptList.toJSONString());
			oldFile.setTablename(userFileTable);
			userfileMapper.update(oldFile);
		}		
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));	
	}
	
	public HandleMessage getFileInfo(String session, String fileid){
		if(StringUtils.isEmpty(session) || StringUtils.isEmpty(fileid)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		String userFileTable = fileService.getUserFileTableFromFileuuid(fileid);
		UserfileEntity userFile = userfileMapper.findOneByFileuuid(new UserfileEntity(fileid, userFileTable));
		if(null == userFile){
			return new HandleMessage(errCode.get("ERROR_USERNORIGHT_ACCESS"),errMessage.get(errCode.get("ERROR_USERNORIGHT_ACCESS")));
		}
		JSONArray userRight = new JSONArray();
		int iscreate = 0;
		if(userFile.getUserid() == user.getId()){
			userRight = JSON.parseArray(userFile.getAcceptlist());
			iscreate = 1;
		}else{
			JSONArray acceptList = JSON.parseArray(userFile.getAcceptlist());
			if(!checkUserRight(user.getMail(),acceptList,userRight)){
				return new HandleMessage(errCode.get("ERROR_USERNORIGHT_ACCESS"),errMessage.get(errCode.get("ERROR_USERNORIGHT_ACCESS")));
			}
		}
		Map<String,Object> retjson = new HashMap<String,Object>();
		retjson.put("iscreate", iscreate);
		retjson.put("userright", userRight);
		retjson.put("filepass", userFile.getFilepass());
		retjson.put("systemtime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
		
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);	
	}
	
	public HandleMessage changePass(String session,String oldpass,String newpass){
		if(StringUtils.isEmpty(session) || StringUtils.isEmpty(oldpass) || StringUtils.isEmpty(newpass)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		if(!Md5Util.md5Hex(oldpass).equals(user.getPassword())){
			return new HandleMessage(errCode.get("ERROR_CHANGE_PASS_OLD_ERROR"),errMessage.get(errCode.get("ERROR_CHANGE_PASS_OLD_ERROR")));
		}
		user.setPassword(Md5Util.md5Hex(newpass));
		userService.updateUser(user);
		redisService.setUserBySession(session, user, EXPIRT_TIMEOUT);
		redisService.setUserByMail(user.getMail(), user);		
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")));	
	}
	
	public HandleMessage getLastUserList(String session,String lastcount){
		if(StringUtils.isEmpty(session) || StringUtils.isEmpty(lastcount)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		List<String> mails = redisService.getContactByUserid(user.getId());
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),mails);	
	}
	
	public HandleMessage getFileManagerUrl(String session){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		String replaceSession = "replace"+Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
		redisService.setSessionByReplaceSession(replaceSession, session, EXPIRT_TIMEOUT);
		Map<String,String> retjson = new HashMap<String,String>();
		retjson.put("url", "https://"+properties.getHost()+"/filemanager.php?user="+URLEncoder.encode(replaceSession));
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);	
	}
	
	public HandleMessage getAccountPayUrl(String session){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		String replaceSession = "replace"+Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
		redisService.setSessionByReplaceSession(replaceSession, session, EXPIRT_TIMEOUT);
		Map<String,String> retjson = new HashMap<String,String>();
		retjson.put("url", "https://"+properties.getHost()+"/accountpay.php?user="+URLEncoder.encode(replaceSession));
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);	
	}
	
	public HandleMessage getDeviceManagerUrl(String session){
		if(StringUtils.isEmpty(session)){
			return new HandleMessage(errCode.get("ERROR_AUGUMENT"),errMessage.get(errCode.get("ERROR_AUGUMENT")));
		}
		UserEntity user = null;
		if((user=redisService.checkSessionLogin(session)) == null){
			return new HandleMessage(errCode.get("ERROR_USERNOLOGIN"),errMessage.get(errCode.get("ERROR_USERNOLOGIN")));
		}
		String replaceSession = "replace"+Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
		redisService.setSessionByReplaceSession(replaceSession, session, EXPIRT_TIMEOUT);
		Map<String,String> retjson = new HashMap<String,String>();
		retjson.put("url", "https://"+properties.getHost()+"/devicemanager.php?user="+URLEncoder.encode(replaceSession));
		return new HandleMessage(errCode.get("SUCCESS"), errMessage.get(errCode.get("SUCCESS")),retjson);
	}
	
	
	private UserEntity userVerify(String name,String pass){
		UserEntity user = redisService.getUserByMail(name);
		if(null == user){
			user = userService.getUserByMail(name);
		}
		if(null != user){
			String decodePass = Md5Util.md5Hex(pass);
			if(decodePass.equals(user.getPassword())){
				return user;
			}
		}
		return null;
	}
	
	private void fileRequestDBOpertate(UserEntity user,List<UserfileEntity> userfileList){
		String tableName = fileService.getUserFileTableFromUserId(user.getId());
		for(UserfileEntity userfile : userfileList){
			userfile.setTablename(tableName);
			userfileMapper.insert(userfile);
		}
	}
	
	private void addNewContact(long userid,List<String> mails){
		List<String> old = redisService.getContactByUserid(userid);
		old.addAll(mails);
		if(old.size() > 15){
			old = old.subList(14, old.size()-1);
		}
		redisService.setContactByUserid(userid, mails);	
	}
	
	private void sendMail2Contact(String userMail, List<String> mails){
		for(String mail : mails){
			UserEntity user = redisService.getUserByMail(mail);
			if(null == user){
				MailObj obj = redisService.getMail(mail);
				if(null == obj){
					obj = new MailObj();
					obj.setHavesend(0);
					obj.setFrom(userMail);
					redisService.setMail(mail, obj);
				}
			}
		}
	}
	
	private boolean checkUserRight(String userMail,JSONArray acceptList,JSONArray userRight){
		for(int i=0; i<acceptList.size(); i++){
			JSONObject obj = acceptList.getJSONObject(i);
			if(obj.getString("usermail").equals(userMail)){
				userRight.add(obj);
				return true;
			}
		}
		return false;
	}
	
}
