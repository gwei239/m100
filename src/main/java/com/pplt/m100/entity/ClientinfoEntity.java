package com.pplt.m100.entity;

import java.io.Serializable;

public class ClientinfoEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private Long ID;
	private String info;
	
	public ClientinfoEntity(String info){
		this.info = info;
	}
	public Long getID() {
		return ID;
	}
	public void setID(Long iD) {
		ID = iD;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	
}
