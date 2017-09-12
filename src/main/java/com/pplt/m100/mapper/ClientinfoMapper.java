package com.pplt.m100.mapper;

import java.util.List;

import com.pplt.m100.entity.ClientinfoEntity;

public interface ClientinfoMapper {
	
	void insert(ClientinfoEntity clientinfoEntity);
	
	List<ClientinfoEntity> getAll();
	
	ClientinfoEntity getOne(long id);
}
