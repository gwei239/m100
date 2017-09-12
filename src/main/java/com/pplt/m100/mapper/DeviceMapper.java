package com.pplt.m100.mapper;

import java.util.List;

import com.pplt.m100.entity.DeviceEntity;

public interface DeviceMapper {
	
	List<DeviceEntity> getAll();
	
	DeviceEntity getOne(Long id);
	
	void insert(DeviceEntity device);

}