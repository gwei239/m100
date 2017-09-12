/*! ResponsiveSlides.js v1.54
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

/**
* @namespace 为增加全局方法,增加 XS 命名空间
* @example XS.isLogin
*/
window.XS = {};
$(function(){
	/**
	  * 本函数用于侧屏广告
	  * @param hike 加息率
	  *
	  * @author yoko
	  * @date 2015.02.12
	  */
	 $.fn.sideAd = function(options){
		 	var defaults = {
		         hike : ""
		     };
		    var options = $.extend(defaults, options);
		    var _this = $(this);
		    var indexAd = '<div class="J_sideAd" id="J_sideAd"><span>'+options.hike+'</span><a href="javascript:;" class="J_sideClose"></a></div>';
		    _this.append(indexAd);
		    var a=1;
		    windowWH(".J_sideAd");
		    $(".J_sideAd").animate({"bottom":"0"},1000);
		    $(window).resize(function(){
		    	a=2;
		        windowWH(".J_sideAd");
		    });
		    $(".J_sideClose").bind("click",function(){
		    	$(".J_sideAd").animate({"bottom":"-260"},1000,function(){
		    		$(".J_sideAd").remove();
		    	});
		    })
		    $(".J_sideAd").bind("click",function(){
		    	location.href = "/xsi/coupon/listUnusedCoupons.do";
		    })
		    $(".pop-confirm").bind("click",function(){
		        options.callback(this);
		    })
		    //position
		    function windowWH(bg){
		        var wWidth = $(window).width();
		        var wHeight = $(window).height();
		        var popWidth = parseInt($(bg).css("width"));
		        var popHeight = parseInt($(bg).css("height"));
		        var leftWidth = (wWidth-parseInt($(".row-fluid").css("width")))/2;
		        if(a == 2){
		        	if(leftWidth < popWidth){
			        	$(bg).css({"left":"0","bottom":"0"});
			        }else{
			        	$(bg).css({"left":(wWidth-960)/2-(popWidth+20),"bottom":"0"});
			        }
		        }else{
		        	if(leftWidth < popWidth){
			        	$(bg).css({"left":"0","bottom":"-260px"});
			        }else{
			        	$(bg).css({"left":(wWidth-960)/2-(popWidth+20),"bottom":"-260px"});
			        }
		        }
		        
		    }
		    //IE6
		    window.onscroll=function ()
		    {
		        var pop=document.getElementById('J_sideAd');
		        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		        var isIE=!!window.ActiveXObject;
		        if(isIE&&!window.XMLHttpRequest){
		            pop.style.top=scrollTop+(document.documentElement.clientHeight-popCon.offsetHeight)/2+'px';
		        }
		    }
		}
	 	//$("body").sideAd({"hike":"0.99%"});
	
	
	
	/**
	 * 判断是否为IE6，如是并弹出温馨提示
	 *
	 * @author yoko
	 * @date 2014-06-19
	 */
	if(navigator.userAgent.indexOf("MSIE 6.0") > 0)
	 {
		 var ie6Cookie = document.cookie.split(";");
		 for(var i=0;i<ie6Cookie.length;i++){ 
			 var arr=ie6Cookie[i].split("="); 
			 //找到名称为userId的cookie，并返回它的值 
			 if("ie6"!=arr[0]){ 
				 $(this).newPop({"popTitle":"温馨提示","content":"您正在使用 Internet Explorer 6 浏览网页，如果您升级到 Internet Explorer 8 或转换到另外一个浏览器，本站将能为您提供更好的服务。","callback" : function(ca){
					 $("#bg,#pop").remove();
					 document.cookie = "ie6=true;";
				 }});
			 }
		 } 
		 
	 }
	$.ajax({
		url:"/xsi/common/cklogin.do",
		cache: false,
		dataType:"json",
		error:function(){
		},
		success:function(data){
			var result = data.result;
			var c;
			if(result == true || result == 'true'){
				var c = data.nickName;
				var b = '<a href="/xsi/index/accountIndex.do">'+ c +'</a> | <a href="/logout.do">退出</a>';
				$(".login-link").show();
				$(".login-link").html(b);
				 $(".reg-now").css("backgroundImage","../images/common/back-top-bg.png");
         $(".reg-now").hover(function(){
          $(".reg-now").css("background-position","0px -511px");
         },function(){
          $(".reg-now").css("background-position","0px -564px");
         });
         $(".reg-now").css("background-position","0px -564px");
				$(".reg-now").attr("href","/xsi/index/accountIndex.do");
				/*$(".login-hike").html("<a href='/xsi/coupon/listUnusedCoupons.do' style='color:red;'><s class='icon hick-icon'></s>红包</a>");*/
				$.ajax({
					url:"/xsi/message/notReadMessageNumber.do",
					cache: false,
					dataType:"json",
					error:function(){
					},
					success:function(data){
						if(data.notReadMessageTotal == "0" || data.notReadMessageTotal == 0){
							$(".login-news a").removeClass("show");
							$(".login-news").show().html("<a href='/xsi/message/listforMessage.do'><s class='icon icon-news'></s>消息</a>");
						}else{
							$(".login-news a").addClass("show");
							$(".login-news").show().html("<a href='/xsi/message/listforMessage.do' class='show'><s class='icon icon-news'></s>消息</a>");
						}
					}
				});
			}else {
				var a = '<a href="/login.html">登录</a> | <a href="/register.html">注册</a>';
				$(".login-link").show();
				$(".login-link").html(a);
				
				$(".reg-now").attr("href","/register.html");
			}
		}
	});
});

(function ($, window, i) {
  $.fn.responsiveSlides = function (options) {

    // Default settings
    var settings = $.extend({
      "auto": true,             // Boolean: Animate automatically, true or false
      "speed": 500,             // Integer: Speed of the transition, in milliseconds
      "timeout": 4000,          // Integer: Time between slide transitions, in milliseconds
      "pager": false,           // Boolean: Show pager, true or false
      "nav": false,             // Boolean: Show navigation, true or false
      "random": false,          // Boolean: Randomize the order of the slides, true or false
      "pause": false,           // Boolean: Pause on hover, true or false
      "pauseControls": true,    // Boolean: Pause when hovering controls, true or false
      "prevText": "Previous",   // String: Text for the "previous" button
      "nextText": "Next",       // String: Text for the "next" button
      "maxwidth": "",           // Integer: Max-width of the slideshow, in pixels
      "navContainer": "",       // Selector: Where auto generated controls should be appended to, default is after the <ul>
      "manualControls": "",     // Selector: Declare custom pager navigation
      "namespace": "rslides",   // String: change the default namespace used
      "before": $.noop,         // Function: Before callback
      "after": $.noop           // Function: After callback
    }, options);

    return this.each(function () {

      // Index for namespacing
      i++;

      var $this = $(this),

        // Local variables
        vendor,
        selectTab,
        startCycle,
        restartCycle,
        rotate,
        $tabs,

        // Helpers
        index = 0,
        $slide = $this.children(),
        length = $slide.size(),
        fadeTime = parseFloat(settings.speed),
        waitTime = parseFloat(settings.timeout),
        maxw = parseFloat(settings.maxwidth),

        // Namespacing
        namespace = settings.namespace,
        namespaceIdx = namespace + i,

        // Classes
        navClass = namespace + "_nav " + namespaceIdx + "_nav",
        activeClass = namespace + "_here",
        visibleClass = namespaceIdx + "_on",
        slideClassPrefix = namespaceIdx + "_s",

        // Pager
        $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

        // Styles for visible and hidden slides
        visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
        hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1},

        // Detect transition support
        supportsTransitions = (function () {
          var docBody = document.body || document.documentElement;
          var styles = docBody.style;
          var prop = "transition";
          if (typeof styles[prop] === "string") {
            return true;
          }
          // Tests for vendor specific prop
          vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
          prop = prop.charAt(0).toUpperCase() + prop.substr(1);
          var i;
          for (i = 0; i < vendor.length; i++) {
            if (typeof styles[vendor[i] + prop] === "string") {
              return true;
            }
          }
          return false;
        })(),

        // Fading animation
        slideTo = function (idx) {
          settings.before(idx);
          // If CSS3 transitions are supported
          if (supportsTransitions) {
            $slide
              .removeClass(visibleClass)
              .css(hidden)
              .eq(idx)
              .addClass(visibleClass)
              .css(visible);
            index = idx;
            setTimeout(function () {
              settings.after(idx);
            }, fadeTime);
          // If not, use jQuery fallback
          } else {
            $slide
              .stop()
              .fadeOut(fadeTime, function () {
                $(this)
                  .removeClass(visibleClass)
                  .css(hidden)
                  .css("opacity", 1);
              })
              .eq(idx)
              .fadeIn(fadeTime, function () {
                $(this)
                  .addClass(visibleClass)
                  .css(visible);
                settings.after(idx);
                index = idx;
              });
          }
        };

      // Random order
      if (settings.random) {
        $slide.sort(function () {
          return (Math.round(Math.random()) - 0.5);
        });
        $this
          .empty()
          .append($slide);
      }

      // Add ID's to each slide
      $slide.each(function (i) {
        this.id = slideClassPrefix + i;
      });

      // Add max-width and classes
      $this.addClass(namespace + " " + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css("max-width", maxw);
      }

      // Hide all slides, then show first one
      $slide
        .hide()
        .css(hidden)
        .eq(0)
        .addClass(visibleClass)
        .css(visible)
        .show();

      // CSS transitions
      if (supportsTransitions) {
        $slide
          .show()
          .css({
            // -ms prefix isn't needed as IE10 uses prefix free version
            "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
            "transition": "opacity " + fadeTime + "ms ease-in-out"
          });
      }

      // Only run if there's more than one slide
      if ($slide.size() > 1) {

        // Make sure the timeout is at least 100ms longer than the fade
        if (waitTime < fadeTime + 100) {
          return;
        }

        // Pager
        if (settings.pager && !settings.manualControls) {
          var tabMarkup = [];
          $slide.each(function (i) {
            var n = i + 1;
            tabMarkup +=
              "<li>" +
              "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" +
              "</li>";
          });
          $pager.append(tabMarkup);

          // Inject pager
          if (options.navContainer) {
            $(settings.navContainer).append($pager);
          } else {
            $this.after($pager);
          }
        }

        // Manual pager controls
        if (settings.manualControls) {
          $pager = $(settings.manualControls);
          $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
        }

        // Add pager slide class prefixes
        if (settings.pager || settings.manualControls) {
          $pager.find('li').each(function (i) {
            $(this).addClass(slideClassPrefix + (i + 1));
          });
        }

        // If we have a pager, we need to set up the selectTab function
        if (settings.pager || settings.manualControls) {
          $tabs = $pager.find('a');

          // Select pager item
          selectTab = function (idx) {
            $tabs
              .closest("li")
              .removeClass(activeClass)
              .eq(idx)
              .addClass(activeClass);
          };
        }

        // Auto cycle
        if (settings.auto) {

          startCycle = function () {
            rotate = setInterval(function () {

              // Clear the event queue
              $slide.stop(true, true);

              var idx = index + 1 < length ? index + 1 : 0;

              // Remove active state and set new if pager is set
              if (settings.pager || settings.manualControls) {
                selectTab(idx);
              }

              slideTo(idx);
            }, waitTime);
          };

          // Init cycle
          startCycle();
        }

        // Restarting cycle
        restartCycle = function () {
          if (settings.auto) {
            // Stop
            clearInterval(rotate);
            // Restart
            startCycle();
          }
        };

        // Pause on hover
        if (settings.pause) {
          $this.hover(function () {
            clearInterval(rotate);
          }, function () {
            restartCycle();
          });
        }

        // Pager click event handler
        if (settings.pager || settings.manualControls) {
          $tabs.bind("click", function (e) {
            e.preventDefault();

            if (!settings.pauseControls) {
              restartCycle();
            }

            // Get index of clicked tab
            var idx = $tabs.index(this);

            // Break if element is already active or currently animated
            if (index === idx || $("." + visibleClass).queue('fx').length) {
              return;
            }

            // Remove active state from old tab and set new one
            selectTab(idx);

            // Do the animation
            slideTo(idx);
          })
            .eq(0)
            .closest("li")
            .addClass(activeClass);

          // Pause when hovering pager
          if (settings.pauseControls) {
            $tabs.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

        // Navigation
        if (settings.nav) {
          var navMarkup =
            "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" +
            "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";

          // Inject navigation
          if (options.navContainer) {
            $(settings.navContainer).append(navMarkup);
          } else {
            $this.after(navMarkup);
          }

          var $trigger = $("." + namespaceIdx + "_nav"),
            $prev = $trigger.filter(".prev");

          // Click event handler
          $trigger.bind("click", function (e) {
            e.preventDefault();

            var $visibleClass = $("." + visibleClass);

            // Prevent clicking if currently animated
            if ($visibleClass.queue('fx').length) {
              return;
            }

            //  Adds active class during slide animation
            //  $(this)
            //    .addClass(namespace + "_active")
            //    .delay(fadeTime)
            //    .queue(function (next) {
            //      $(this).removeClass(namespace + "_active");
            //      next();
            //  });

            // Determine where to slide
            var idx = $slide.index($visibleClass),
              prevIdx = idx - 1,
              nextIdx = idx + 1 < length ? index + 1 : 0;

            // Go to slide
            slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            if (settings.pager || settings.manualControls) {
              selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            }

            if (!settings.pauseControls) {
              restartCycle();
            }
          });

          // Pause when hovering navigation
          if (settings.pauseControls) {
            $trigger.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

      }

      // Max-width fallback
      if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
        var widthSupport = function () {
          $this.css("width", "100%");
          if ($this.width() > maxw) {
            $this.css("width", maxw);
          }
        };

        // Init fallback
        widthSupport();
        $(window).bind("resize", function () {
          widthSupport();
        });
      }

    });

  };
})(jQuery, this, 0);


/*
 本函数（createTop）是创建并放在body里面的回到顶部的效果
 @param id  是回到顶部整个大div的id
 @param ele 要打进body的element元素
 @警告：点击的元素的class名必须为.top
 @example  createTop("#gotoTop","<div class='gototop' id='gotoTop'><a href='javascript:;' class='wechat'></a><a href='javascript:;' class='top'></a><div class='weixin'></div></div>");
 @author xukuikui
 @date 2014-06-05
 */

function createTop(id,ele){//返回顶部
    var oDivcon=$(ele);
    $(document.body).append(oDivcon);
    $(id).gotoTop();

}
$.fn.gotoTop=function(){
    var _this=this;
    var Timer=null;
    var bStop=true;
    $(_this).find('.top').click(function(){
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        clearInterval(Timer);
        Timer=setInterval(function(){
            var speed=(0-scrollTop)/7;
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
            bStop=false;
            scrollTop+=speed;
            document.documentElement.scrollTop=scrollTop;
            document.body.scrollTop=scrollTop;
            if(scrollTop==0)
            {
                clearInterval(Timer);
            }
        },30);

    });
    $(_this).find('.wechat').hover(function(){
        $('.weixin').show();
    },function(){
        $('.weixin').hide();
    });

    $(window).scroll(function(){
        top();

    });
    $(window).load(function(){
        top();

    });
    $(window).resize(function(){
        top();

    });
    function top(){
        //返回顶部
        if(bStop)
        {
            clearInterval(Timer);
        }
        bStop=true;
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        var documentHeight=document.documentElement.clientHeight*2/3;
        var documentHeight2=document.documentElement.clientHeight*1/4;
        if(scrollTop>=documentHeight2)
        {
            if(window.navigator.userAgent.toLowerCase().indexOf('msie 6.0')!=-1){

                $(_this).css({'top':(scrollTop+documentHeight-50)+'px'});
            }else{

                $(_this).css({'top':(documentHeight-50)+'px'});
            }
            $(_this).show();
        }
        else
        {
            $(_this).hide();

        }
    }
};
/**
 * 本函数用于弹出层
 * @param popTitle 弹层标题
 * @param content  弹层内容
 * @callback 参数为确定按钮class，可写点击确定后需要执行的效果
 *
 * @author yoko
 * @date 2014.06.05
 */
$.fn.newPop = function(options){
    var defaults = {
        popTitle : "标题",
        content : "内容",
        callback : function(){}
    };
    var options = $.extend(defaults, options);
    var _this = $(this);
    var bg = "<div id='bg'></div>";
    var pop = "<div class='pop' id='pop'>"
        + "<div class='pop-hd'>"
        + "<span>"+options.popTitle+"</span>"
        + "<s class='pop-close'></s>"
        + "</div>"
        + "<div class='pop-bd'>"
        + "<p>"+options.content+"</p>"
        + "</div>"
        + "<div class='pop-ft'><input type='button' value='确定' class='pop-confirm btn btn-primary' style='width:90px;'/><input type='button' value='关闭' class='pop-close btn btn-success' style='width:90px;'/></div>"
        + "</div>";


    $("body").append(pop+=bg);
    windowWH("#pop");
    $(window).resize(function(){
        windowWH("#pop");
    });
    $(".pop-close").bind("click",function(){
        $("#bg,#pop").remove();
    })
    $(".pop-confirm").bind("click",function(){
        options.callback(this);
    })
    //position
    function windowWH(bg){
        var wWidth = $(window).width();
        var wHeight = $(window).height();
        var popWidth = parseInt($(bg).css("width"));
        var popHeight = parseInt($(bg).css("height"));
        $("#bg").css({"height":wHeight,"width":wWidth});
        $(bg).css({"left":(wWidth-popWidth)/2,"top":(wHeight-popHeight)/2});
    }
    //IE6
    window.onscroll=function ()
    {
        var pop=document.getElementById('pop');
        var bg=document.getElementById('bg');
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        var isIE=!!window.ActiveXObject;
        if(isIE&&!window.XMLHttpRequest){
            pop.style.top=scrollTop+(document.documentElement.clientHeight-popCon.offsetHeight)/2+'px';
            bg.style.top=scrollTop+'px';
        }
    }
}
/**
 * 本函数用于tab切换
 * @param current   导航当前class
 * @param hover     导航hover效果class
 *
 * @author yoko
 * @date 2014.07.22
 */
$.fn.tab = function(options){
    var defaults = {
        current : "a",
        hover : "",
        callback : function(){}
    };
    var options = $.extend(defaults, options);
    var _this = $(this);
    _this.find("a:eq(0)").addClass(options.current);
    _this.find("li:eq(0)").show();
    //tab导航hover
    if(options.hover != ""){
        _this.children("a").hover(function(){
            $(this).addClass(options.hover);
        },function(){
            $(this).removeClass(options.hover);
        })
    }
    //点击tab导航
    _this.children("a").click(function(){
        var index = $(this).index();
        _this.find("a").eq(index).addClass(options.current).siblings().removeClass(options.current);
        _this.find("li").eq(index).show().siblings().hide();
    })
}

/*
*本插件（answerHelp）问题帮助，鼠标移上去显示的内容
*@example 账户余额 $("#balanceHelp").answerHelp(),在操作的属性增加title，data-answer两个属性，
*如title="当前可支配金额（不含已加入向上计划的金额）" data-answer="true"
*@author xukuikui
*@date 2014-06-05
*/
$.fn.answerHelp=function(){//问题解答
    var _this=this;
    $(_this).hover(function(){
        if($(_this).attr("data-answer") === "true"){
            var oDivcon=$("<div class='help-answer'><span></span>"+$(_this).attr("data_title")+"</div>");
            $(document.body).append(oDivcon);
            var l=$(_this).offset().left-108;
            var t=$(_this).offset().top+26;
            oDivcon.css({'left':l+'px','top':t+'px'});
        }else{
            return;
        }
    },function(){
        $(".help-answer").remove();

    });
}
/**
* 本函数用于实现我的账户左侧导航的收起展开
* @author Cross
* @date 2014-06-05
*/
$.fn.nav = function(options){
    /*var defaults = {
        speed : 5000
    };
    var options = $.extend(defaults, options);*/
    var _this = $(this);
    //click
    _this.find("dt").click(function(){
        var dd = $(this).next("dd").css("display");
        if(dd == "block"){
            $(this).siblings("dd").hide();
            $(this).children("s").removeClass("icon-arrow-down").addClass("icon-arrow-right");
        }else{
            $(this).siblings("dd").show();
            $(this).children("s").removeClass("icon-arrow-right").addClass("icon-arrow-down");
        }
    });
};
/**
* 本函数用于实现下拉框的展开
* @author xukuikui
* @date 2014-07-25
*/
$.fn.pulldown=function(){
    $(this).hover(function(){
        $(this).addClass("active");
		$(this).find(".pulldown").show();
    },function(){
        $(this).removeClass("active");
		$(this).find(".pulldown").hide();
    });

};
function isMobile(mobile){
	var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	if (mobile == null) {
		return false;
	}
	return reg.test(mobile);
}

function isEmail(email){
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	if (email == null) {
		return false;
	}
	return reg.test(email);
}
//检查身份证是否是正确格式
function checkCard(cId) {
	var pattern;
	if (cId.length == 15) {
		pattern = /^\d{15}$/;// 正则表达式,15位且全是数字
		if (pattern.exec(cId) == null) {
			return false;
		}
		if (!isdate("19" + cId.substring(6, 8), cId.substring(8, 10), cId
				.substring(10, 12))) {
			return false;
		}
	} else if (cId.length == 18) {
		pattern = /^\d{17}(\d|x|X)$/;// 正则表达式,18位且前17位全是数字，最后一位只能数字,x,X
		if (pattern.exec(cId) == null) {
			return false;
		}
		if (!isdate(cId.substring(6, 10), cId.substring(10, 12), cId.substring(
				12, 14))) {
			return false;
		}
		var strJiaoYan = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3",
				"2" ];
		var intQuan = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];
		var intTemp = 0;
		for (var i = 0; i < cId.length - 1; i++)
			intTemp += cId.substring(i, i + 1) * intQuan[i];
		intTemp %= 11;
		if (cId.substring(cId.length - 1, cId.length).toUpperCase() != strJiaoYan[intTemp]) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}
//检查年月日是否是合法日期
function isdate(intYear, intMonth, intDay) {
	if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay))
		return false;
	if (intMonth > 12 || intMonth < 1)
		return false;
	if (intDay < 1 || intDay > 31)
		return false;
	if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11)
			&& (intDay > 30))
		return false;
	if (intMonth == 2) {
		if (intDay > 29)
			return false;
		if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0))
				&& (intDay > 28))
			return false;
	}
	return true;
}

/*
* 只能放头尾特效实现
*/
/**
 * 格式化时间，去T,后台传过来的时间格式2016-12-03T22:58:52
 * time:时间，isHour true，false，不传，就默认为false
 * @author xukuikui
 * @date 2014-08-06

 */
XS.getStandardTime = function(time,isHour){
    isHour = isHour || false;
    var arrTime = time.split('T');
    
    if(isHour){
        return arrTime[0];
    }else{
        if(arrTime[1] == undefined){
            arrTime[1]="";
        }
        return arrTime[0]+' '+arrTime[1];
    }
}

$(function(){
	// 展开收起
	$("#qq-group").pulldown();
	$("#nav-pull").pulldown();
});



/**
* number 价格的数值
* places 保留几位小数
* symbol 货币单位
* thousand   alert(formatMoney(4999.99,2, "€", ".", ",")); // €4.999,99
* decimal
* XS.formatMoney(12345.99,2,"");      // " 12,345.99"
* @author qiuye
* @date 2014-08-06
* 
*/
XS.formatMoney = function (number,places, symbol, thousand, decimal) {
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "$";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var  
          negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  };

/**
* @price  需要变换的货币价格
* XS.moneyFormatNo('12,345.99');  //12345.99
* @author qiuye
* @date 2014-08-06
*/
XS.moneyFormatNo = function (price) {
   return parseFloat(price.replace(/[^0-9-.]/g, '')); 
};

/**
* 验证码倒计时效果
* 
* @obj dom元素
* @second 倒计时秒数
* countDown("#elm",60);
* 
* @author cross
* @date 2014-08-06
*/
XS.countDown = function (obj,second) {
	// 如果秒数还是大于0，则表示倒计时还没结束
    if(second>=0){
          // 获取默认按钮上的文字
          if(typeof buttonDefaultValue === 'undefined' ){
            buttonDefaultValue =  obj.defaultValue;
        }
        // 按钮置为不可点击状态
        obj.disabled = true;            
        // 按钮里的内容呈现倒计时状态
        obj.value = second+'秒重新获取';
        // 时间减一
        second--;
        // 一秒后重复执行
        setTimeout(function(){XS.countDown(obj,second);},1000);
    // 否则，按钮重置为初始状态
    }else{
    	obj.removeAttribute('disabled');
    	obj.value = "获取验证码";
    	//obj.style.background = "#00B4E7";
    }
};
/**
* 获取url参数
* 
* @author cross
* @date 2014-08-06
*/
XS.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return 1;
}
/**
* 移除百分号
* 
* @author cross
* @date 2014-08-06
*/
XS.delPercent = function (str) {
  if(str.toString().indexOf("%")>0){
    return str.replace(/%/g, "");
  }else{
    return str;
  }
    
}

