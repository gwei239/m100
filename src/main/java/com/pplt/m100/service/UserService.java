package com.pplt.m100.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pplt.m100.entity.ClientinstallEntity;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.mapper.ClientinstallMapper;
import com.pplt.m100.mapper.UserMapper;

@Service
public class UserService {

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private ClientinstallMapper clientinstallMapper;
	
	public UserEntity getUserByMail(String mail){
		return userMapper.getOneByMail(mail);
	}
	
	public boolean hasUser(String name,String mail){
		UserEntity user = new UserEntity(name, null, mail);
		List<UserEntity> users = userMapper.getByUser(user);
		if(users.isEmpty())return false;		
		return true;
	}
	
	public void saveUser(UserEntity user){
		userMapper.insert(user);
	}
	
	public List<ClientinstallEntity> getAllClientinstall(){
		return clientinstallMapper.getAll();
	}
	
	public void updateUser(UserEntity user){
		userMapper.update(user);
	}
}
