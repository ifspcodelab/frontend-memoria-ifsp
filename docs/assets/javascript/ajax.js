
Ajax_motor = (Ajax)=>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200) {
            Ajax.response = this.responseText;
        }
    }
    xhttp.open(Ajax.method, Ajax.url, true);
    xhttp.send();
};

var Ajax = function (method, url){
    this.method = method;
    this.url = url;
    this.response = null;
    Ajax_motor(this);
};

Ajax.prototype.setInHTML = function (selector){
    let ajax = this;
    Ajax_motor(ajax);
    document.querySelector(selector).innerHTML = ajax.response;
    return ajax.response;
};