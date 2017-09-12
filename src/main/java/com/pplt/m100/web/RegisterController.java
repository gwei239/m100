package com.pplt.m100.web;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.entity.UserpayEntity;
import com.pplt.m100.service.PayService;
import com.pplt.m100.service.UserService;
import com.pplt.m100.util.IdUtil;
import com.pplt.m100.util.Md5Util;

@Controller
public class RegisterController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PayService payService;

	@RequestMapping("/register.php")
	public String register() {
		return "register";
	}
	
	@RequestMapping("/registerValidate")
	@ResponseBody
	public String registerValidate(String username, String nickname) {
		boolean hasUser = userService.hasUser(nickname, username);
		return !hasUser+"";
	}

	@RequestMapping("/registerSubmit.do")
	@ResponseBody
	public Map<String,Object> registerSubmit(String username, String nickname, String password, HttpSession session) {
		Map<String,Object> result = new HashMap<String,Object>();
		if(userService.hasUser(null, username)){
			result.put("result", false);
			result.put("message", "该邮箱地址已经被注册，请使用其他的邮箱地址!");
			return result;
		}
		if(userService.hasUser(nickname, null)){
			result.put("result", false);
			result.put("message", "该名称已经被注册，请使用其他的名称!");
			return result;
		}
		UserEntity user = new UserEntity(nickname, Md5Util.md5Hex(password), username);
		user.setEnable(1);
		userService.saveUser(user);
		session.setAttribute("userid", username);
		result.put("result", true);
		result.put("message", "");
		return result;
	}
	
	@RequestMapping("/registerok.php")
	public String registerok(HttpSession session) {
		String username = (String)session.getAttribute("userid");
		if(null == username)return "";
		return "registerok";
	}
	
	@RequestMapping("/downloadpacket.php")
	public String downloadpacket(Model model, HttpSession session) {
		String username = (String)session.getAttribute("userid");
		if(null == username)return "";
		
		String orderid = (String)session.getAttribute("orderid");
		if(null == orderid){
			model.addAttribute("statue", 0);
		}else{
			UserpayEntity pay = payService.getUserpayByOrdid(orderid);
			if(null != pay && 1 == pay.getStatue()){
				UserEntity user = userService.getUserByMail(username);
				model.addAttribute("statue", 1);
				model.addAttribute("paymoney", pay.getPaymoney());
				model.addAttribute("out_trade_no", pay.getOrdid());
				model.addAttribute("endtime", user.getEndtime());
			}else{
				model.addAttribute("statue", 0);
			}			
		}
		
		model.addAttribute("clientinstallList", userService.getAllClientinstall());		
		return "downloadpacket";
	}
	
	@RequestMapping("/advanceduser.php")
	public String advanceduser(Model model, HttpSession session, String userid) {
		if(null != userid && !"".equals(userid)){
			session.setAttribute("userid", userid);
		}
		String username = (String)session.getAttribute("userid");
		if(null == username)return "";
		UserEntity user = userService.getUserByMail(username);
		model.addAttribute("userid",username);
		String orderid = IdUtil.getOrderId(user.getId());
		model.addAttribute("orderid",orderid);
		session.setAttribute("orderid", orderid);
		return "advanceduser";
	}
	
	@RequestMapping("/pay.php")
	public String pay(Model model, HttpSession session, Integer money, String ordid, String userid) {
		model.addAttribute("payUrl",payService.getPayUrl(userid, ordid, money));
		return "pay";
	}
	
	@RequestMapping("/paycheck.php")
	@ResponseBody
	public String paycheck(String ordid) {		
		return "" + payService.isPayed(ordid);
	}
	
	@RequestMapping("/pay_notify.php")
	@ResponseBody
	public String payNotify(HttpServletRequest req) {
		try {
			InputStream xml = req.getInputStream();
			SAXReader saxReader = new SAXReader();

	        Document document = saxReader.read(xml);

	        // 获取根元素
	        Element root = document.getRootElement();
	        System.out.println("Root: " + root.getName());
	        
	        Element payIdElement = root.element("payId");
	        String payId = payIdElement.getTextTrim();
	        Element orderIdElement = root.element("orderId");
	        String orderId = orderIdElement.getTextTrim();
	        Element payResultElement = root.element("payResult");
	        String payResult = payResultElement.getTextTrim();
	        if(this.payService.payed(orderId, payResult)){
	        	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><msgResp><msgType>PayResultNotifyResp</msgType><msgVer>1.0</msgVer><returnCode>0</returnCode><returnMsg></returnMsg></msgResp>";
	        }
	        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><msgResp><msgType>PayResultNotifyResp</msgType><msgVer>1.0</msgVer><returnCode>1</returnCode><returnMsg>fail</returnMsg></msgResp>";
		} catch (Exception e) {
			e.printStackTrace();
			return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><msgResp><msgType>PayResultNotifyResp</msgType><msgVer>1.0</msgVer><returnCode>1</returnCode><returnMsg>fail</returnMsg></msgResp>";
		}
	}
		  
//    @RequestMapping(value="/delete/{id}")
//    public void delete(@PathVariable("id") Long id) {
//    	userMapper.delete(id);
//    }
    
    
}