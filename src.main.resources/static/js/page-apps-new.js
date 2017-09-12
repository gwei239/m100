(function $$(a){
	(function(){
		var c=1,d=function(b){
			if(c){
				c=0;
				var d=a(".slide_image_list").find(".c");
				a(".slide_image_list").find(".c").index();
				var e=a(".slide_image_list li").eq(b),b=a(".slide_dot_list li").eq(b);
				b.siblings().removeClass("c");
				b.addClass("c");
				e.css("z-index","2");
				d.fadeOut(500,function(){
					e.css("z-index","3");
					e.siblings().css("z-index","1");
					d.removeClass("c");
					d.show();
					e.addClass("c");
					c=1
				})
			}
		};
		setInterval(function(){
			if(c==1){
				var b=a(".slide_image_list").find(".c").index()+1;
				b==3&&(b=0);
				d(b)
			}
		}
		,
		4E3);
		a(".jie_app_content .prev").on("click",function(){
			var b=a(".slide_image_list").find(".c").index()-1;
			b==-1&&(b=2);
			d(b)
		});
		a(".jie_app_content .next").on("click",function(){
			var b=a(".slide_image_list").find(".c").index()+1;
			b==3&&(b=0);
			d(b)
		});
		a(".slide_dot_list li").on("click",function(){
			var b=a(this).index();
			d(b)
		})
	})();
	(function(){
		var c=!1,d=!1;
		a("body").append('<div class="tagfloat"><div id="" class="tag_bg"></div></div>');
		var b=a(".download_button_list").html();
		a(".tagfloat .tag_bg").append(b);
		var f=a(".tagfloat");
		a(window).scrollTop()>552&&!c&&(c=!0,f.fadeIn(1E3,function(){
			c=!1
		}));
		a(window).scroll(function(){
			a(window).scrollTop();
			a(window).scrollTop()>552?c||(c=!0,f.fadeIn(0,function(){
				c=!1
			})):d||(d=!0,f.fadeOut(0,function(){
				d=!1
			}))
		})
	})();
	a(".app_btn_list .other_btn").on("click",function(){
		a(this).parent().addClass("c")
	});
	a(".app_btn_list .close_btn").on("click",function(c){
		c.stopPropagation();
		a(this).parent().parent().removeClass("c")
	});
	a(".app_btn_list li").hover(function(){},function(){
		a(this).removeClass("c")
	})
})(jQuery);