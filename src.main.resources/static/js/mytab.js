String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"");}
var isObject=function(p){return"object"==typeof(p)}
var $=function(p,doc){return isObject(p)?p:(doc||document).getElementById(p);}
var getElementsByClassName=function(className,obj){obj=$(obj)||document;var objs=obj.all||obj.getElementsByTagName("*");var o,i,arr=[];var classNames="";className=","+className+",";for(i=0;o=objs[i];i++){classNames=","+o.className.split(/\s+/).join(",")+",";if(classNames.indexOf(className)>=0){arr.push(o);}}
delete objs;return arr;}
function showTab(tab,idx){tab=$(tab);getElementsByClassName("active",tab)[0].className="tab";getElementsByClassName("show",tab)[0].className="display";getElementsByClassName("tab",tab)[idx].className="tab active";getElementsByClassName("display",tab)[idx].className="display show";}