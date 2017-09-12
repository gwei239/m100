package com.pplt.m100;

import java.io.IOException;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.filters.RemoteIpFilter;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfiguration {
    @Bean
    public RemoteIpFilter remoteIpFilter() {
        return new RemoteIpFilter();
    }
    
    @Bean
    public FilterRegistrationBean testFilterRegistration() {

        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new MyFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("paramName", "paramValue");
        registration.setName("MyFilter");
        registration.setOrder(1);
        return registration;
    }
    
    public class MyFilter implements Filter {
		public void destroy() {
			// TODO Auto-generated method stub
		}

		public void doFilter(ServletRequest srequest, ServletResponse sresponse, FilterChain filterChain)
				throws IOException, ServletException {
			// TODO Auto-generated method stub
			HttpServletRequest request = (HttpServletRequest) srequest;
			
			// DEBUG**************************************************DEBUG
			StringBuilder sb = new StringBuilder();
			sb.append("请求：" + request.getRequestURI());
			Map<String, String[]> paramMap = request.getParameterMap();
			if (!paramMap.isEmpty())
				sb.append("?");
			for (String key : paramMap.keySet()) {
				sb.append(key).append("=").append(paramMap.get(key)[0]).append("&");
			}
			System.out.println(sb.toString());
			System.out.println("**************************************************");
			// DEBUG**************************************************DEBUG

			filterChain.doFilter(srequest, sresponse);
			
		}

		public void init(FilterConfig arg0) throws ServletException {
			// TODO Auto-generated method stub
		}
    }
}



