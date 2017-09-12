function bootproto_change(){
  if(isFirefox = navigator.userAgent.indexOf("Firefox") > 0)
    document.getElementById('castcount').textContent = document.getElementById('time').value*8;
  else  
    document.getElementById('castcount').innerText = document.getElementById('time').value*8;
} 

function checkPay(ordid) {
    var xmlHttp;
    try {// Firefox, Opera 8.0+, Safari
      xmlHttp = new XMLHttpRequest();
    } catch (e) {// Internet Explorer
      try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("您的浏览器不支持AJAX！");
          return false;
        }
      }
    }

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4) {
        var result = xmlHttp.responseText;
        if(result == "true"){
             location="/downloadpacket.php";
        } else {
            
        }
      }
    };
    var url = "/paycheck.php";
    url = url + "?ordid=" +ordid; 
    xmlHttp.open("POST", url, true);
    xmlHttp.send(null);
 }
  
function pay(){
  document.getElementById('light').style.display='block';
  document.getElementById('fade').style.display='block';
  window.open("/pay.php?money="+document.getElementById('time').value*8
          +"&ordid="+document.getElementById('ordid').value
          +"&userid="+document.getElementById('userid').value);
}

function payok(){
  document.getElementById('light').style.display='none';
  document.getElementById('fade').style.display='none';
  checkPay( document.getElementById('ordid').value);
}

function payfailed(){
 document.getElementById('light').style.display='none';
 document.getElementById('fade').style.display='none'; 
}