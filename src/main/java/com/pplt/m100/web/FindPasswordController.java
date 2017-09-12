package com.pplt.m100.web;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;
import javax.imageio.ImageIO;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.pplt.m100.configure.OtherProperties;
import com.pplt.m100.entity.UserEntity;
import com.pplt.m100.service.RedisService;
import com.pplt.m100.service.UserService;
import com.pplt.m100.util.Md5Util;

@Controller
public class FindPasswordController {
	@Autowired
	private UserService userService;
	@Autowired
	private JavaMailSender mailSender;
	@Autowired
	private OtherProperties properties;	
	@Autowired
	private RedisService redisService; 	
	
    private static final int IMG_HEIGHT = 100;// 图片高度
    private static final int IMG_WIDTH = 30; // 图片宽度   
    private static final int CODE_LEN = 4; // 验证码长度
	
	@RequestMapping("/findpassword.php")
	public String register() {
		return "findpassword";
	}
	
	@RequestMapping("/imageverify.php")
	@ResponseBody
	public void imageverify(HttpSession httpSession,HttpServletResponse response) throws IOException {
		  // 用于绘制图片，设置图片的长宽和图片类型（RGB)
        BufferedImage bi = new BufferedImage(IMG_HEIGHT, IMG_WIDTH, BufferedImage.TYPE_INT_RGB);
        // 获取绘图工具
        Graphics graphics = bi.getGraphics();
        graphics.setColor(new Color(100, 230, 200)); // 使用RGB设置背景颜色
        graphics.fillRect(0, 0, 100, 30); // 填充矩形区域

        // 验证码中所使用到的字符
        char[] codeChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456".toCharArray();
        String captcha = ""; // 存放生成的验证码
        Random random = new Random();
        for(int i = 0; i < CODE_LEN; i++) { // 循环将每个验证码字符绘制到图片上
            int index = random.nextInt(codeChar.length);
            // 随机生成验证码颜色
            graphics.setColor(new Color(random.nextInt(150), random.nextInt(200), random.nextInt(255)));
            // 将一个字符绘制到图片上，并制定位置（设置x,y坐标）
            graphics.drawString(codeChar[index] + "", (i * 20) + 15, 20);
            captcha += codeChar[index];
        }
        // 将生成的验证码code放入sessoin中
        httpSession.setAttribute("code", captcha);
        // 通过ImageIO将图片输出
        response.setContentType("image/PNG");
        ImageIO.write(bi, "PNG", response.getOutputStream());
	}
	
	@RequestMapping("/findpassword.sendmail")
	@ResponseBody
	public String sendMail(HttpSession httpSession,String imagepass,String email) throws MessagingException{
		if(!httpSession.getAttribute("code").toString().equalsIgnoreCase(imagepass)){
			return "图片校验失败，请输入正确的图片校验码！";
		}
		UserEntity user = userService.getUserByMail(email);
		if(null == user){
			return "该邮箱未在系统注册，不能找回密码";
		} 
		String codec = Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes());
		String toname = email.substring(0,email.indexOf("@"));
		
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
		helper.setTo(email);
		helper.setSubject("密码找回邮件");
		StringBuffer sb = new StringBuffer("<html><head><title>卓望数码注册邀请</title></head><body>");
		sb.append(toname).append("先生/女士：<p>");
		sb.append("系统已经为你申请找回密码，<a href='https://").append(properties.getHost());
		sb.append("/setnewpassword.php?email=").append(email).append("&&codec=");
		sb.append(codec).append("' target='_blank'>请点击此链接重置您的密码</a></body></html>");
		helper.setText(sb.toString(), true);		
		try{
			mailSender.send(mimeMessage);
		}catch(Exception e){
			System.out.println(e);
			return "密码找回邮件发送失败，请重新申请！";
		}
		user.setCodec(codec);
		userService.updateUser(user);
		return "密码找回邮件发送成功，请登录你的邮箱收取密码重置的邮件！";
	}

	@RequestMapping("/setnewpassword.php")
	public String setNewPassword(String email,String codec, Model model) {
		UserEntity user = userService.getUserByMail(email);
		if(null == user) return "该邮箱未在系统注册，不能重设密码";
		if(!codec.equals(user.getCodec())) return "校验码不正确或已经过期！不能重设密码";
		model.addAttribute("email", email);
		model.addAttribute("codec", codec);
		return "setnewpassword";
	}
	
	@RequestMapping("/setnewpassword.sumbit")
	@ResponseBody
	public String setNewPasswordSumbit(String email,String codec,String password){
		UserEntity user = userService.getUserByMail(email);
		if(null == user) return "该邮箱未在系统注册，不能重设密码";
		if(!codec.equals(user.getCodec())) return "校验码不正确或已经过期！不能重设密码";
		user.setPassword(Md5Util.md5Hex(password));
		user.setCodec(null);
		userService.updateUser(user);
		redisService.setUserByMail(email, user);
		return "已经重新设置新密码请用新密码登录";		
	}
}
