package com.pplt.m100.entity;

import java.io.Serializable;

public class UserpayEntity implements Serializable{

	private static final long serialVersionUID = 1L;
	private Long id;
	private String ordid;
	private Integer statue;
	private Integer paymoney;
	private String userid;
	
	public UserpayEntity(){}
	
	public UserpayEntity(String ordid, Integer paymoney, String userid){
		this.ordid=ordid;
		this.statue=0;
		this.paymoney=paymoney;
		this.userid=userid;		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrdid() {
		return ordid;
	}

	public void setOrdid(String ordid) {
		this.ordid = ordid;
	}

	public Integer getStatue() {
		return statue;
	}

	public void setStatue(Integer statue) {
		this.statue = statue;
	}

	public Integer getPaymoney() {
		return paymoney;
	}

	public void setPaymoney(Integer paymoney) {
		this.paymoney = paymoney;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	

}
