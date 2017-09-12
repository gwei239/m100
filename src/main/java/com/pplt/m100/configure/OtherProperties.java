package com.pplt.m100.configure;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "m100")
public class OtherProperties {
	private String host;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
		
	}
	
}
