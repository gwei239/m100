/**
* @fileOverview 验证密码强度
*
* @author 
* @date 2013.12.06
* @version 0.1
*/

$(document).ready(function(){
    $('.J_password_first').keyup(function() {  
        var val = $(this).val();
        if(val.length > 5){
            $("li",".J_psd_strength").eq(0).removeClass("red");
            $("li",".J_psd_strength").eq(1).removeClass("yellow");
            $("li",".J_psd_strength").eq(2).removeClass("blue");
            isDigit(val);
        }else{
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).removeClass("yellow");
            $("li",".J_psd_strength").eq(2).removeClass("blue");
        }
        
    });

    function isDigit(s) {  
        var pattern_d = /^\d+$/;                //全数字  
        var pattern_s = /^[A-Za-z]+$/           //全字符  
        var pattern_w = /^\w+$/;                //数字或者字符  
        var pattern_W = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*\\;',./_+|{}\[\]:"<>?])[\da-zA-Z~!@#$%^&*\\;',./_+|{}\[\]:"<>?]{6,}$/  //6位以上                 //全非数字也非字符  
        var pattern_r = /^\w+\W+[\w\W]*\w+$/    //以字母或者数字开头结尾的字符串 
        var x = 0;
        var y = 0;

        if(pattern_W.exec(s)) {  
            x = 5;
            y = 5;
        }  
        if(pattern_w.exec(s)) {  
            y = 1;  
        }  
        if(pattern_d.exec(s)) {  
            x = 1;  
            y = 0;  
        }  
        if(pattern_s.exec(s)) {  
            x = 2;  
            y = 0;  
        }
        if(pattern_r.exec(s)) {  
            x = 3;  
            y = 2;  
        }
        if( y === 0 && x === 0) {
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).removeClass("yellow");
            $("li",".J_psd_strength").eq(2).removeClass("blue");
        }
        if( y === 5 && x === 5) {
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).addClass("yellow");
            $("li",".J_psd_strength").eq(2).addClass("blue");
        }
        if( x > 0 && y === 0) {
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).removeClass("yellow");
            $("li",".J_psd_strength").eq(2).removeClass("blue");
        }
        if( x === 0 && y === 1) {
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).addClass("yellow");
            $("li",".J_psd_strength").eq(2).removeClass("blue");
        }
        if( y === 2) {
            $("li",".J_psd_strength").eq(0).addClass("red");
            $("li",".J_psd_strength").eq(1).addClass("yellow");
            $("li",".J_psd_strength").eq(2).addClass("blue");
        }
    };
});