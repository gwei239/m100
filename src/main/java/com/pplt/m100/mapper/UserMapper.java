package com.pplt.m100.mapper;

import java.util.List;

import com.pplt.m100.entity.UserEntity;

public interface UserMapper {
	
	List<UserEntity> getAll();
	
	UserEntity getOne(Long id);
	
	UserEntity getOneByMail(String mail);

	void insert(UserEntity user);

	void update(UserEntity user);

	void delete(Long id);
	
	List<UserEntity> getByUser(UserEntity user);

}