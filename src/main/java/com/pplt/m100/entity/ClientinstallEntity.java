package com.pplt.m100.entity;

import java.io.Serializable;

public class ClientinstallEntity  implements Serializable{
	private static final long serialVersionUID = 1L;
	private Long id;
	private String lastpacketversion;
	private String updateconf;
	private Byte[] updatepacket;
	private String systemversion;
	private String name;
	
	public ClientinstallEntity(){}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLastpacketversion() {
		return lastpacketversion;
	}

	public void setLastpacketversion(String lastpacketversion) {
		this.lastpacketversion = lastpacketversion;
	}

	public String getUpdateconf() {
		return updateconf;
	}

	public void setUpdateconf(String updateconf) {
		this.updateconf = updateconf;
	}

	public Byte[] getUpdatepacket() {
		return updatepacket;
	}

	public void setUpdatepacket(Byte[] updatepacket) {
		this.updatepacket = updatepacket;
	}

	public String getSystemversion() {
		return systemversion;
	}

	public void setSystemversion(String systemversion) {
		this.systemversion = systemversion;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
}
