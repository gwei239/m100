package com.pplt.m100;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.alibaba.fastjson.JSON;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.service.HandleService;
import com.pplt.m100.vo.HandleMessage;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class HandleTest{

	@Autowired
	private HandleService handleService;	
	@Autowired
	private RedisTemplate redisTemplate; 	
	
	@Test
	public void testLogin(){	
		HandleMessage m = handleService.login("gaowei@test.com", "12345678"); 
		System.out.println(JSON.toJSONString(m));
	}
	
	@Test
	public void testIslogin(){	
		HandleMessage m = handleService.isLogin("YjNlNDg1MjgtZWJlMS00ZDk3LTg1ZjctMmY0ZGMwYzc5MGVm"); 
		System.out.println(JSON.toJSONString(m));
	}
	
	@Test
	public void testLoginout(){	
		HandleMessage m = handleService.logout("YjNlNDg1MjgtZWJlMS00ZDk3LTg1ZjctMmY0ZGMwYzc5MGVm"); 
		System.out.println(JSON.toJSONString(m));
	}
	
	@Test
	public void testRedis(){
		UserEntity user = new UserEntity("gaowei", "12345678", "gaower@test.com");
		redisTemplate.opsForValue().set("gaowei", user);
		
		UserEntity user1 = (UserEntity)redisTemplate.opsForValue().get("gaowei");
	}
	
}
