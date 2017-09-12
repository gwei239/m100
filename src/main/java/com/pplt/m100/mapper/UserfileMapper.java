package com.pplt.m100.mapper;

import java.util.List;
import java.util.Map;

import com.pplt.m100.entity.UserfileEntity;
import com.pplt.m100.vo.UserFilePage;

public interface UserfileMapper {
		
	void insert(UserfileEntity userfile);
	
	UserfileEntity findOneByFileuuid(UserfileEntity userfile);
	
	void update(UserfileEntity userfile);
		
	List<UserfileEntity> findUserFile(UserFilePage userFilePage);
	
	Integer findUserFileCount(UserFilePage userFilePage);
	
	void delFiles(Map<String,String> param);
}