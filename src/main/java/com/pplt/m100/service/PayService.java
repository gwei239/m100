package com.pplt.m100.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.entity.UserpayEntity;
import com.pplt.m100.mapper.UserMapper;
import com.pplt.m100.mapper.UserpayMapper;
import com.pplt.m100.util.IdUtil;
import com.pplt.m100.vo.PayToken;

@Service
public class PayService {
	private static final Logger logger = LoggerFactory.getLogger(PayService.class);
	
	private String sellerId = "P-wfwj-001";
	private String token_url = "http://pay.aplusunion.cn/cashier/token.do?sellerId={0}&userId={1}";
	private String callbackURL = "http://210.75.5.251/pay_return.php";
	private String key = "70061a623e8a1d90";

	@Autowired
	private UserpayMapper userpayMapper;

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private RedisService redisService;
	
	public UserpayEntity getUserpayByOrdid(String ordid){
		return userpayMapper.getOneByOrdid(ordid);
	}
	
	public String getPayUrl(String userid, String orderid, Integer money){		
		String resultJSON = restTemplate.getForEntity(token_url, String.class, sellerId, userid).getBody();
		PayToken result = null;
		try {
			result = objectMapper.readValue(resultJSON, PayToken.class);
		} catch (Exception e) {
			logger.error("获取PayToken失败,"+e.getMessage());
		}
		if(null == result || 0 != result.getReturnCode()){
			logger.error("获取PayToken失败.");
			return null;
		}				
		String orderDate = new SimpleDateFormat("YYYYMMddHHmmss").format(new Date(System.currentTimeMillis()));
		String period = "30";
		String periodUnit = "01";
		String productId = "0001";
		String productName = "卓望加密安全服务";
		StringBuilder sb = new StringBuilder(orderid).append(orderDate).append(period).append(periodUnit).append(productId)
				.append(productName).append(money*100).append(sellerId).append(userid).append(result.getPayerToken())
				.append(callbackURL).append(key);		
		String signature = IdUtil.md5Password(sb.toString()).toUpperCase();
		
		UserpayEntity pay = userpayMapper.getOneByOrdid(orderid);
		if(null == pay){
			UserpayEntity userpay = new UserpayEntity(orderid, money, userid);
			userpayMapper.insert(userpay);
		}
		if(null != pay && 1 == pay.getStatue()){
			return null;
		}
		
		StringBuilder payUrl = null;
		try {
			payUrl = new StringBuilder("http://pay.aplusunion.cn/cashier/www/queryitem.do?orderId=").append(orderid)
					.append("&orderDate=").append(orderDate).append("&period=").append(period).append("&periodUnit=").append(periodUnit)
					.append("&productId=").append(productId).append("&productName=").append(URLEncoder.encode(productName, "UTF-8")).append("&fee=").append(money*100)
					.append("&sellerId=").append(sellerId).append("&userId=").append(userid).append("&PayerToken=").append(result.getPayerToken())
					.append("&Signature=").append(signature).append("&callbackURL=").append(URLEncoder.encode(callbackURL, "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage());
			return null;
		}
		return payUrl.toString();
	}
	
	public boolean payed(String orderid,String payResult){
		if(null == payResult || "1".equals(payResult.trim())){
			logger.error("支付失败,payResult="+payResult);
			return false;
		} 
		
		UserpayEntity pay = userpayMapper.getOneByOrdid(orderid);
		if(null == pay || (null != pay && 1 == pay.getStatue())){
			logger.error("支付失败，userpay不存在或已支付，orderid="+orderid);
			return false;
		} 
		
		pay.setStatue(1);
		userpayMapper.update(pay);
		UserEntity user = userMapper.getOneByMail(pay.getUserid());
		user.setType(1);
		Calendar endtime = Calendar.getInstance();
		endtime.setTime(user.getEndtime());
		Calendar today = Calendar.getInstance();
		today.setTimeInMillis(System.currentTimeMillis());
		if(endtime.before(today)){
			today.add(Calendar.YEAR, pay.getPaymoney()/8);
			user.setEndtime(new Timestamp(today.getTimeInMillis()));
		}else{
			endtime.add(Calendar.YEAR, pay.getPaymoney()/8);
			user.setEndtime(new Timestamp(endtime.getTimeInMillis()));
		}
		userMapper.update(user);
		redisService.setUserByMail(user.getMail(), user);
		return true;
		
	}
	
	public boolean isPayed(String orderid){
		UserpayEntity pay = userpayMapper.getOneByOrdid(orderid);
		if(null != pay && 1 == pay.getStatue()) return true;
		return false;
	}
	
}
