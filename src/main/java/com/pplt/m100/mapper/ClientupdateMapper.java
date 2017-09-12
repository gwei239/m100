package com.pplt.m100.mapper;

import com.pplt.m100.entity.ClientupdateEntity;

public interface ClientupdateMapper {
	ClientupdateEntity getOneByVersion(String version);
}
