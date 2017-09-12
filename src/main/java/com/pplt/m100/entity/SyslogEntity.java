package com.pplt.m100.entity;

import java.io.Serializable;
import java.sql.Timestamp;

public class SyslogEntity  implements Serializable{
	private static final long serialVersionUID = 1L;
	private Long id;
	private Integer type;
	private Integer module;
	private Timestamp time;
	private String logcontent;
	
	public SyslogEntity(Integer module,Integer type,String logcontent,Timestamp time){
		this.time = time;
		this.module = module;
		this.logcontent = logcontent;
		this.type = type;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getModule() {
		return module;
	}
	public void setModule(Integer module) {
		this.module = module;
	}
	public Timestamp getTime() {
		return time;
	}
	public void setTime(Timestamp time) {
		this.time = time;
	}
	public String getLogcontent() {
		return logcontent;
	}
	public void setLogcontent(String logcontent) {
		this.logcontent = logcontent;
	}
	
}
