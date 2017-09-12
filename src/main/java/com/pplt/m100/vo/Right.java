package com.pplt.m100.vo;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Right {
	private Integer copy;
	private Integer print;
	private Integer capture;
	private Integer delete;
	private int opencount;
	private String starttime;
	private String endtime;
	private String fileuuid;
	private String usermail;
	
	public String getTime(){
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
		DateFormat dateFormatOld = new SimpleDateFormat("yyyy-MM-dd");
		if(null != starttime && null != endtime){
			Date sta = null;
			Date end = null;
			try {
				sta = dateFormatOld.parse(starttime);
				end = dateFormatOld.parse(endtime);
			} catch (ParseException e) {
			}
			if(sta ==null){
				try {
					sta = dateFormat.parse(starttime);
				} catch (ParseException e) {
				}
			}
			if(end ==null){
				try {
					end = dateFormat.parse(endtime);
				} catch (ParseException e) {
				}
			}
			if(null != sta && null != end) 
				return dateFormat.format(sta)+"-"+dateFormat.format(end);		
		}
		return null;
	}
		
	public Integer getCopy() {
		return copy;
	}
	public void setCopy(Integer copy) {
		this.copy = copy;
	}
	public Integer getPrint() {
		return print;
	}
	public void setPrint(Integer print) {
		this.print = print;
	}
	public Integer getCapture() {
		return capture;
	}
	public void setCapture(Integer capture) {
		this.capture = capture;
	}
	public Integer getDelete() {
		return delete;
	}
	public void setDelete(Integer delete) {
		this.delete = delete;
	}
	public int getOpencount() {
		return opencount;
	}
	public void setOpencount(int opencount) {
		this.opencount = opencount;
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
	public String getFileuuid() {
		return fileuuid;
	}
	public void setFileuuid(String fileuuid) {
		this.fileuuid = fileuuid;
	}
	public String getUsermail() {
		return usermail;
	}
	public void setUsermail(String usermail) {
		this.usermail = usermail;
	}
}
