$(function() {
	//必须为邮箱或者手机号
	jQuery.validator.addMethod("rightusername", function(value, element) {
		   if(value == null || '' == value) return false;
		   value = $.trim(value);
		   var length = value.length;
	       var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		   return this.optional(element) || (length == 11 && mobile.test(value)) || /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,5}$/.test(value);
	}, "邮件地址格式错误，请输入正确的邮件地址！");
	//身份证验证
	jQuery.validator.addMethod("isIdCardNo", function(value, element) {
	    value = $.trim(value);
	    return this.optional(element) || checkCard(value);
	}, "请正确输入您的身份证号码");
	
	// 电话号码验证
	jQuery.validator.addMethod("isPhone", function(value, element) {
	    value = $.trim(value);
	    var tel = /^0\d{2,3}[-]?\d{8}$|^0\d{3}[-]?\d{7}$/;
	    return this.optional(element) || (tel.test(value));
	}, "请正确填写您的电话号码");
	
	// 昵称验证
	jQuery.validator.addMethod("nickname", function(value, element) {
	    value = $.trim(value);
	    return this.optional(element) || (/^[\u4e00-\u9fa5\w]+$/.test(value));
	}, "昵称可以包含中文，英文字母、数字和下划线组成");
	
	// 手机验证
	jQuery.validator.addMethod("isMobile", function(value, element) {
	    value = $.trim(value);
	    var length = value.length;
	    var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	    return this.optional(element) || (length == 11 && mobile.test(value));
	}, "请正确填写您的手机号码");
	
	// 邮政编码验证
	jQuery.validator.addMethod("isZipCode", function(value, element) {
	    value = $.trim(value);
	    var tel = /^[0-9]{6}$/;
	    return this.optional(element) || (tel.test(value));
	}, "请正确填写您的邮政编码");
	
	jQuery.validator.addMethod("isPassWord",function(value,element){
        return this.optional(element) || /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{8,16}$/.test(value);
    },"密码不能有空格,长度在8-16个字符之间") ;
	//整数
	jQuery.validator.addMethod("isInteger", function(value, element) {
	    value = $.trim(value);
	    return this.optional(element) || (/^[1-9]+$/.test(value));
	}, "请输入正确的金额");
	//浮点数
	jQuery.validator.addMethod("isFloat", function(value, element) {
	    value = $.trim(value);
	    return this.optional(element) || (/^(([1-9]{1}\d{0,9})|([0]{1}))(\.(\d){1,2})?$/.test(value));
	}, "请输入正确的金额");
	// 是否是手机或者电话
	jQuery.validator.addMethod("isPhoneOrMobile", function(value, element) {
	    value = $.trim(value);
	    var tel = /^0\d{2,3}[-]?\d{8}$|^0\d{3}[-]?\d{7}$/;
	    var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	    return this.optional(element) || tel.test(value) || mobile.test(value);
	}, "请正确填写您的工作电话");
	//昵称验证
    jQuery.validator.addMethod("nickname", function(value, element){
    	//if(value == null || '' == value) return false;
        //return this.optional(element) || (/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value));
    	return this.optional(element) || (/^[\u4e00-\u9fa5\w]+$/.test(value));
    }, "昵称可以包含中文、英文字母、数字、下划线组成");
    //是否邮箱
	jQuery.validator.addMethod("isEmail", function(value, element) {
	    //lyq修改  2013-08-30
	    // var myreg = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/;
	//	var myreg = /^([a-zA-Z0-9_-\.])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		var myreg =  new RegExp("^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,5}$");
	    return this.optional(element) || myreg.test($.trim(value));
	}, "请输入正确的邮箱地址");
	//长度
	jQuery.validator.addMethod("checkCharLength",function(value,element){
   	 return this.optional(element)||(getLength($.trim(value))<=32&&getLength($.trim(value))>=4);
   },"长度请保持4-32个字符以内");
	
 
	$("#loginform").validate({
		rules: {
			username: {
				required: true,
				rightusername: true
			},
			password: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			username: {
				required: "邮件地址不能为空，请输入邮件地址！",
				rightusername : "邮件地址格式错误，请输入正确的邮件地址！"
			},
			password: {
				required: "请输入正确的密码",
				minlength: "请输入正确的密码"
			}
		}
	});
	
 
	
	
       
	//修改二级密码
	$('#updatepassword').validate({

		rules: {
			oldpwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12]
			},
			newpwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12] 
			},
			querypwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12],
				equalTo: "#password" 
			}
		},
		messages: {
			oldpwd: {
				required: "请输入原二级密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12"
			},
			newpwd: {
				required: "请输入新二级密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12"
			},
			querypwd: {
				required: "请输入确认新二级密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12",
				equalTo: "两次密码不一致" 
			}
		}
	});
	//修改登录密码
	$('#updatepwd').validate({
		rules: {
			oldpwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12]
			},
			newpwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12]
				
			},
			password: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12],
				equalTo: "#password" 
			}
		},
	messages: {
			oldpwd: {	
				required: "请输入原登录密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12"
			},
			newpwd: {
				required: "请输入新登录密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12"
			},
			password:{
				required: "请确认新登录密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12",
				equalTo:"两次密码不一致"
			}
		}
	});
	//注册表单
	$('#registerform').validate({
		rules: {
			username: {
				required: true,
				rightusername:true,
				maxlength: 32,
           
				remote: {
					    url: "/registerValidate",  //后台处理程序
					    type: "post",               //数据发送方式
					    dataType: "json",           //接受数据格式   
					    data: {
					    	checkvalue: this.value
					    }
					    
		        }
			},
			remoteValidateCode: {
				required: true,
                minlength: 6,
                maxlength: 6
			},
			nickname :{
				required: true,
				nickname: true,
                checkCharLength:true,
				remote: {
					    url: "/registerValidate",  //后台处理程序
					    type: "post",               //数据发送方式
					    dataType: "json",           //接受数据格式   
					    data: {
					    	checkvalue: this.value
					    }
					    
		        }
			},
//			province:{
//				required: true
//			},
//			city:{
//				required: true
//			},
			password: {
				required: true,
				isPassWord:true,
                minlength: 8,
                maxlength: 16
			},
			confirmPassword: {
				required: true,
				isPassWord:true,
                minlength: 6,
                maxlength: 12,
                equalTo: "#password"
			},
			verifycode:{
				required: true,
                minlength: 4,
                maxlength: 4,
                remote:"/xsi/register/ckv.do?type=register"
			},
			agreeCheckBox :{
				required: true
			}
		},
		messages: {
			username: {
				required: "邮件地址不能为空，请输入邮件地址！",
				rightusername:"邮件地址格式错误，请输入正确的邮件地址！",
				maxlength: "邮箱地址过长",
                remote: "当前邮箱/手机号已经注册，请重新输入"
			},
			nickname :{
				required: "请输入昵称",
				nickname: "昵称可以由中文、英文字母、数字、下划线组成",
                checkCharLength:"昵称长度请保持4-32位",
                remote:"当前昵称不可用，请重新输入"
			},
//			province:{
//				required: "请选择省份"
//			},city:{
//				required: "请选择城市"
//			},
			password: {
				required: "密码不能为空！",
				isPassWord:"密码不能有空格,长度在8-16个字符之间",
                minlength: "密码长度大于8字符",
                maxlength: "密码长度小于16字符"
			},
			confirmPassword: {
				required: "确认密码不能为空！",
				isPassWord:"密码不能有空格,长度在8-16个字符之间",
                minlength: "密码长度大于8字符",
                maxlength: "密码长度小于16字符",
                equalTo: "两次密码输入不一致，请重新输入"
			},
			verifycode:{
				required: "请输入验证码",
                minlength: "请输入正确的验证码",
                maxlength: "请输入正确的验证码",
                remote:"验证码不正确，请重新输入"
			},
			agreeCheckBox :{
				required: "请仔细阅读协议后同意提交"
			}
		}
	});
	 
	 
	//设置新二级密码
	$('#resettxPwd').validate({
		rules: {
			pwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12] 
			},
			querypwd: {
				required: true,
				isPassWord:true,
				rangelength: [6, 12],
				equalTo: "#password" 
			}
		},
	messages: {
			pwd: {
				required:"请输入新二级密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12"
			},
			querypwd: {
				required: "请输入确认新二级密码",
				isPassWord:"密码不能有空格",
				rangelength:"密码长度大于6小于12",
				equalTo: "两次密码不一致!" 
			}
		}
	});
	//找回二级密码，验证输入手机验证码
	$('#tellvlidate').validate({
		rules: {
			validateNum: {
				required: true
			}
		},
		messages: {
			validateNum: {
				required: "请输入手机验证码"
			}
		}
	});
	//忘记密码，验证输入手机验证码
//	$('#forgetPwdReset2_form').validate({
//		rules: {
//			validatePhone_code: {
//				required: true
//			}
//		},
//		messages: {
//			validatePhone_code: {
//				required: "请输入手机验证码"
//			}
//		}
//	});
	
	//忘记密码，验证输入手机验证码
	$('#modify_email_frist').validate({
		rules: {
			identifycode: {
				required: true
			}
		},
		messages: {
			identifycode: {
				required: "请输验证码"
			}
		}
	});
	//忘记密码，验证输入手机验证码
	$('#updatePasswordForm').validate({
		rules: {
			newPasswordText: {
				required: true,
				rangelength: [6, 12]
			},
			reEntryPasswordText: {
				required: true,
				rangelength: [6, 12],
				equalTo: "#newPasswordText" 
			}
		},
		messages: {
			newPasswordText: {
				required: "请输入新密码",
				rangelength:"密码长度大于6小于12"
			},
			reEntryPasswordText: {
				required: "请输入确认密码",
				rangelength:"密码长度大于6小于12",
				equalTo: "两次输入密码不一致"  
			}
		}
	});
	
      
	 
	//提现
	$('#formhuifu').validate({
		rules: {
			 
			sbank1: {
				required: true
			} 
		},
		messages: {
			 
			sbank1: {
				required:"请选择开户银行"
			}
		}
	});
});

