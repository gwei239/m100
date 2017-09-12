package com.pplt.m100.entity;

import java.io.Serializable;

public class DeviceEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long id;
	private String name;
	private String deviceinfo;
	private String createtime;
	private Long userid;
	private String type;
	
	public DeviceEntity(){}
	public DeviceEntity(Long userid,String name,String type,String deviceinfo,String createtime){
		this.userid = userid;
		this.name = name;
		this.type = type;
		this.deviceinfo = deviceinfo;
		this.createtime = createtime;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDeviceinfo() {
		return deviceinfo;
	}
	public void setDeviceinfo(String deviceinfo) {
		this.deviceinfo = deviceinfo;
	}
	public String getCreatetime() {
		return createtime;
	}
	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}
	public Long getUserid() {
		return userid;
	}
	public void setUserid(Long userid) {
		this.userid = userid;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
}
