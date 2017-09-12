package com.pplt.m100.vo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class MailObj  implements Serializable{
	private static final long serialVersionUID = 1L;
	private Integer havesend;
	private String from;
	
	public MailObj(){}
	
	public Map<String,Object> getMap(){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("havesend", this.havesend);
		map.put("from", this.from);
		return map;
	}
	
	public static MailObj getMailFromMap(Map<String,Object> map){
		MailObj mail = new MailObj();
		mail.havesend = (Integer)map.get("havesend");
		mail.from = (String)map.get("from");
		return mail;
	}
	
	public Integer getHavesend() {
		return havesend;
	}
	public void setHavesend(Integer havesend) {
		this.havesend = havesend;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
}
