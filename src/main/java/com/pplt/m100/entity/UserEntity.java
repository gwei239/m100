package com.pplt.m100.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

public class UserEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	private long id;
	private String name;
	private Timestamp lastaccesstime;
	private String lastloginip;
	private String truename;
	private String mail;
	private String telephone;
	private String password;
	private Integer sex;
	private String birthday;
	private Integer enable;
	private Integer type;
	private String codec;
	private Timestamp endtime;
	private String right;

	public UserEntity() {
		super();
	}

	public UserEntity(String name, String password, String mail) {
		super();
		this.password = password;
		this.name = name;
		this.mail = mail;
	}
	
	public Map<String,Object> getMap(){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("id", this.id);
		map.put("name", this.name);
		map.put("lastaccesstime", this.lastaccesstime);
		map.put("lastloginip", this.lastloginip);
		map.put("truename", this.truename);
		map.put("mail", this.mail);
		map.put("telephone", this.telephone);
		map.put("password", this.password);
		map.put("sex", this.sex);
		map.put("birthday", this.birthday);
		map.put("enable", this.enable);
		map.put("type", this.type);
		map.put("codec", this.codec);
		map.put("endtime", this.endtime);
		map.put("right", this.right);
		return map;
	}
	
	public static UserEntity getUserFromMap(Map<String,Object> map){
		UserEntity user = new UserEntity();
		user.id = (Long)map.get("id");
		user.name = (String)map.get("name");
		user.lastaccesstime = (Timestamp)map.get("lastaccesstime");
		user.lastloginip = (String)map.get("lastloginip");
		user.truename = (String)map.get("truename");
		user.mail = (String)map.get("mail");
		user.telephone = (String)map.get("telephone");
		user.password = (String)map.get("password");
		user.sex = (Integer)map.get("sex");
		user.birthday = (String)map.get("birthday");
		user.enable = (Integer)map.get("enable");
		user.type = (Integer)map.get("type");
		user.codec = (String)map.get("codec");
		user.endtime = (Timestamp)map.get("endtime");
		user.right = (String)map.get("right");
		return user;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Timestamp getLastaccesstime() {
		return lastaccesstime;
	}

	public void setLastaccesstime(Timestamp lastaccesstime) {
		this.lastaccesstime = lastaccesstime;
	}

	public String getLastloginip() {
		return lastloginip;
	}

	public void setLastloginip(String lastloginip) {
		this.lastloginip = lastloginip;
	}

	public String getTruename() {
		return truename;
	}

	public void setTruename(String truename) {
		this.truename = truename;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getSex() {
		return sex;
	}

	public void setSex(Integer sex) {
		this.sex = sex;
	}

	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}

	public Integer getEnable() {
		return enable;
	}

	public void setEnable(Integer enable) {
		this.enable = enable;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getCodec() {
		return codec;
	}

	public void setCodec(String codec) {
		this.codec = codec;
	}

	public Timestamp getEndtime() {
		return endtime;
	}

	public void setEndtime(Timestamp endtime) {
		this.endtime = endtime;
	}

	public String getRight() {
		return right;
	}

	public void setRight(String right) {
		this.right = right;
	}

}