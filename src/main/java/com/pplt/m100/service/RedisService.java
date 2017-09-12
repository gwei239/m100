package com.pplt.m100.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.vo.MailObj;

@Service
public class RedisService {
	@Autowired
	private RedisTemplate<Object, Object> redisTemplate;
	
	public UserEntity getUserBySession(String session){
		UserEntity user = null;
		try{
			user = UserEntity.getUserFromMap((Map<String,Object>)redisTemplate.opsForValue().get(session));
		}catch(Exception e){
			System.out.println(e.getMessage());
			return null;
		}
		return user;
	}
	
	public void setUserBySession(String session,UserEntity user,long expirtTimeOut){
		try{
			redisTemplate.opsForValue().set(session, user.getMap(), expirtTimeOut, TimeUnit.SECONDS);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	

	public void setUserByMail(String mail,UserEntity user){
		try{
			redisTemplate.opsForValue().set(mail, user.getMap());
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public UserEntity getUserByMail(String mail){
		UserEntity user = null;
		try{
			user = UserEntity.getUserFromMap((Map<String,Object>)redisTemplate.opsForValue().get(mail));
		}catch(Exception e){
			System.out.println(e.getMessage());
			return null;
		}
		return user;
	}
	
	public String getSession(long userId){
		String session = null;
		try{
			session = (String)redisTemplate.opsForValue().get("session:"+userId);
		}catch(Exception e){
			System.out.println(e.getMessage());
			return null;
		}
		return session;
	}
	
	public void setSession(long userId,String session){
		try{
			redisTemplate.opsForValue().set("session:"+userId, session);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public List<String> getContactByUserid(long userId){
		List<String> mails = null;
		try{
				mails = (List<String>)redisTemplate.opsForValue().get("contact:"+userId);	
		}catch(Exception e){
			System.out.println(e.getMessage());
			return new ArrayList<String>();
		}
		if(mails == null) return new ArrayList<String>();
		
		return mails;
	}
	
	public void setContactByUserid(long userId,List<String> mails){
		try{
			redisTemplate.opsForValue().set("contact:"+userId, mails);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public void setSessionByReplaceSession(String replaceSession,String session,long explateTimeout){
		try{
			redisTemplate.opsForValue().set(replaceSession, session,explateTimeout,TimeUnit.SECONDS);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public String getSessionByReplaceSession(String replaceSession){
		String session = null;
		try{
			session = (String)redisTemplate.opsForValue().get(replaceSession);
		}catch(Exception e){
			System.out.println(e);
			return null;
		}
		return session;
	}
	
	public MailObj getMail(String keyMail){
		MailObj mail = null;
		try{
			mail = MailObj.getMailFromMap((Map<String,Object>)redisTemplate.opsForValue().get("mail:"+keyMail));
		}catch(Exception e){
			System.out.println(e.getMessage());
			return null;
		}
		return mail;
	}
	
	public void setMail(String keyMail,MailObj mail){
		try{
			redisTemplate.opsForValue().set("mail:"+keyMail, mail.getMap());
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public void delete(String key){
		try{
			redisTemplate.delete(key);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	public UserEntity checkSessionLogin(String session){
		UserEntity user = this.getUserBySession(session);
		return user;
	}
}
