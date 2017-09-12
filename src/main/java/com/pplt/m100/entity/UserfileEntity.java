package com.pplt.m100.entity;

import java.io.Serializable;
import java.sql.Timestamp;

public class UserfileEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	private long userid;
	private String fileuuid;
	private Timestamp createtime;
	private String filename;
	private String filepass;
	private String acceptlist;
	private String tablename;
	private String removestr;
	
	public UserfileEntity(){}
	
	public UserfileEntity(String fileuuid, String tablename){
		this.fileuuid = fileuuid;
		this.tablename = tablename;
	}
	
	public long getUserid() {
		return userid;
	}
	public void setUserid(long userid) {
		this.userid = userid;
	}
	public String getFileuuid() {
		return fileuuid;
	}
	public void setFileuuid(String fileuuid) {
		this.fileuuid = fileuuid;
	}
	public Timestamp getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Timestamp createtime) {
		this.createtime = createtime;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public String getFilepass() {
		return filepass;
	}
	public void setFilepass(String filepass) {
		this.filepass = filepass;
	}
	public String getAcceptlist() {
		return acceptlist;
	}
	public void setAcceptlist(String acceptlist) {
		this.acceptlist = acceptlist;
	}

	public String getTablename() {
		return tablename;
	}

	public void setTablename(String tablename) {
		this.tablename = tablename;
	}

	public String getRemovestr() {
		return removestr;
	}

	public void setRemovestr(String removestr) {
		this.removestr = removestr;
	}
	
}
