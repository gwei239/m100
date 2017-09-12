package com.pplt.m100.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.pplt.m100.entity.UserfileEntity;
import com.pplt.m100.mapper.UserfileMapper;
import com.pplt.m100.vo.Right;
import com.pplt.m100.vo.UserFilePage;

@Service
public class FileManagerService {
	@Autowired
	private RedisService redisService;
	
	@Autowired
	private UserfileMapper userfileMapper;
	
	public String getUserFileTableFromUserId(long userid){
		return "userfile_" + String.valueOf(userid%1000+1000).substring(1, 4);
	}
	
	public String getUserFileTableFromFileuuid(String fileuuid){
		return "userfile_"+fileuuid.substring(0, 3);
	}
	
	public List<UserfileEntity> getUserFile(UserFilePage userFilePage){
		return userfileMapper.findUserFile(userFilePage);
	}
	
	public Integer getUserFileCount(UserFilePage userFilePage){
		return userfileMapper.findUserFileCount(userFilePage);
	}
	
	public UserfileEntity getOneByFileuuid(UserfileEntity query){
		return userfileMapper.findOneByFileuuid(query);
	}
	
	public void delFileByFileuuids(String[] fileuuids){
		for(String fileuuid: fileuuids){
			Map<String,String> param = new HashMap<String,String>();
			if(!StringUtils.isEmpty(fileuuid)){
				param.put("tablename", getUserFileTableFromFileuuid(fileuuid));
				param.put("fileuuid", fileuuid);
				userfileMapper.delFiles(param);
			}
		}
	}
	
	public void updateFileRight(Right right){
		String tablename =  getUserFileTableFromFileuuid(right.getFileuuid());
		UserfileEntity file = userfileMapper.findOneByFileuuid(new UserfileEntity(right.getFileuuid(),tablename));
		if(null == file)return;
		file.setTablename(tablename);
		JSONArray acceptList = JSON.parseArray(file.getAcceptlist());
		if(null == acceptList) return;
		for(int i=0; i<acceptList.size(); i++){
			JSONObject accept = acceptList.getJSONObject(i);
			if(accept.getString("usermail").equals(right.getUsermail())){
				JSONObject obj = accept.getJSONObject("right");
				obj.remove("copy"); 
				obj.put("copy", right.getCopy()==null?0:1);
				obj.remove("print");
				obj.put("print", right.getPrint()==null?0:1);
				obj.remove("capture"); 
				obj.put("capture", right.getCapture()==null?0:1);
				obj.remove("delete"); 
				obj.put("delete", right.getDelete()==null?0:1);
				obj.remove("opencount"); 
				obj.put("opencount", right.getOpencount());
				obj.remove("time");
				obj.put("time", right.getTime());
			}
		}
		file.setAcceptlist(acceptList.toJSONString());
		userfileMapper.update(file);
	}
	
	public void delMailInSendfile(String fileuuid,String usermail){
		String tablename =  getUserFileTableFromFileuuid(fileuuid);
		UserfileEntity file = userfileMapper.findOneByFileuuid(new UserfileEntity(fileuuid,tablename));
		if(null == file)return;
		file.setTablename(tablename);
		JSONArray acceptList = JSON.parseArray(file.getAcceptlist());
		if(null == acceptList) return;
		JSONArray newAcceptList = new JSONArray();
		for(int i=0; i<acceptList.size(); i++){
			JSONObject accept = acceptList.getJSONObject(i);
			if(!accept.getString("usermail").equals(usermail)){
				newAcceptList.add(accept);
			}
		}
		file.setAcceptlist(newAcceptList.toJSONString());
		userfileMapper.update(file);
	}
}
