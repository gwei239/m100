package com.pplt.m100.vo;

public class PayToken {
	private Integer returnCode;
	private String payerToken;
	
	public PayToken(){
		super();
	}
	
	public Integer getReturnCode() {
		return returnCode;
	}
	public void setReturnCode(Integer returnCode) {
		this.returnCode = returnCode;
	}
	public String getPayerToken() {
		return payerToken;
	}
	public void setPayerToken(String payerToken) {
		this.payerToken = payerToken;
	}		
}
