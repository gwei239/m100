package com.pplt.m100.mapper;

import com.pplt.m100.entity.UserpayEntity;

public interface UserpayMapper {

	
	UserpayEntity getOne(Long id);

	UserpayEntity getOneByOrdid(String ordid);
	
	void insert(UserpayEntity userpay);

	void update(UserpayEntity userpay);

}
