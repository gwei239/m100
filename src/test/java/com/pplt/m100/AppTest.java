package com.pplt.m100;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import com.pplt.m100.service.PayService;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class AppTest{

	@Autowired
	private PayService payService;
	
	@Test
	public void testPay(){
		String r = payService.getPayUrl("werf@csf.com", "1257765623", 10);
		System.out.println(r);
	}
	
	@Test
	public void testPayed(){
		payService.payed("358441493109454086", "0");
	}
	
}
