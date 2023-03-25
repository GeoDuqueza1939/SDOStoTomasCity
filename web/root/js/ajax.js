"use strict";

class ajaxResponse
{
    contructor(type, content)
    {
        this.type = type;
        this.content = content;
    }
}

function postData(procUrl, data, func)
{
    var xmlhttp;
    xmlhttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    xmlhttp.onreadystatechange = func;
    
    xmlhttp.open("POST", procUrl, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}