package com.pplt.m100.vo;

import org.springframework.util.StringUtils;

public class UserFilePage{
	private Integer page;
	private Integer rows;
	private String sort;
	private String order;
	private String starttime;
	private String endtime;
	private String filename;
	private String recvuser;
	private Integer startNum;
	private Long userid;
	private String tablename;
	
	public UserFilePage initPage(){
		if(null != page && null != rows){
			startNum = (page-1)*rows;
		}
		if(!StringUtils.isEmpty(filename)){
			this.filename = "%"+filename+"%";
		}
		if(!StringUtils.isEmpty(recvuser)){
			this.recvuser = "%"+recvuser+"%";
		}
		return this;
	}
	
	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public Integer getRows() {
		return rows;
	}
	public void setRows(Integer rows) {
		this.rows = rows;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	public String getStarttime() {
		return starttime;
	}
	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}
	public String getEndtime() {
		return endtime;
	}
	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}
	public Integer getStartNum() {
		return startNum;
	}
	public void setStartNum(Integer startNum) {
		this.startNum = startNum;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public String getRecvuser() {
		return recvuser;
	}
	public void setRecvuser(String recvuser) {
		this.recvuser = recvuser;
	}

	public String getTableName() {
		return tablename;
	}

	public void setTableName(String tablename) {
		this.tablename = tablename;
	}

	public Long getUserid() {
		return userid;
	}

	public void setUserid(Long userid) {
		this.userid = userid;
	}
	
}
