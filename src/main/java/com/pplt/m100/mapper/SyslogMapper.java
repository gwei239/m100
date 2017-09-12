package com.pplt.m100.mapper;

import java.util.List;

import com.pplt.m100.entity.SyslogEntity;

public interface SyslogMapper {

	List<SyslogEntity> getAll();
	
	SyslogEntity getOne(long id);
	
	void insert(SyslogEntity syslog);
}
