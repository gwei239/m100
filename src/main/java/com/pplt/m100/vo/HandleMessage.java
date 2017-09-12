package com.pplt.m100.vo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class HandleMessage extends JSONObject {
	private static final long serialVersionUID = 1L;
	public static final Object EMPTY_OBJECT = new Object();

	public HandleMessage(int ret, String errormessage) {
		setRet(ret);
		setErrorMessage(errormessage);
		System.out.println("response:" + JSON.toJSONString(this));
		System.out.println("**********************************************");
	}

	public HandleMessage(int ret, String errormessage, Object retjson) {
		setRet(ret);
		setErrorMessage(errormessage);
		setRetJson(retjson);
		System.out.println("response:" + JSON.toJSONString(this));
		System.out.println("**********************************************");
	}

	public Object getRet() {
		return get("ret");
	}

	public void setRet(Object ret) {
		put("ret", ret);
	}

	public String getResultMsg() {
		return getString("errormessage");
	}

	public void setErrorMessage(String errormessage) {
		put("errormessage", errormessage);
	}


	public Object getRetJson() {
		return get("retjson");
	}

	public void setRetJson(Object retjson) {
		put("retjson", retjson);
	}

}
