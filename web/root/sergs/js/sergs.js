"use strict";

// import "../../js/classes/ExClass.js";

class SeRGS_App extends App
{
    static processURL = "/sergs/php/process.php";

    constructor(container)
    {
        super(container);

        this.navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        this.main = Array.from(container.querySelectorAll("main"))[0];
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");
        this.currentUser = JSON.parse(SeRGS_App.getCookie("user"));
        
        var app = this;
    }
    
    navClick(viewId)
    {
        switch(viewId)
        {
            case "sdo-home":
                console.log("Going Home");
                SeRGS_App.setCookie("current_view", "", -1);
                window.location = "/";
                break;
            case "signout":
                SeRGS_App.setCookie("user", "", -1);
                SeRGS_App.setCookie("current_view", "", -1);
                postData(SeRGS_App.processURL, "app=sergs&a=logout", postEvent=>{
                    window.location.reload(true);
                });
                break;
            default:
                SeRGS_App.setCookie("current_view", viewId, 1);
                this.activateView(viewId);
                break;
        }
    }

    static setCookie(cname, cvalue, exdays)
    {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
    }
    
    static getCookie(cname)
    {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
}

let app = new SeRGS_App(document.getElementById("sergs"));
app.dataFormExs = Array.from(document.querySelectorAll(".data-form-ex")).map(element=>("uiEx" in element ? element.uiEx : new DataFormEx().setupFromHTMLElement(element)));
app.checkboxGroupExs = Array.from(document.querySelectorAll(".checkbox-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxGroupEx().setupFromHTMLElement(element)));
app.checkboxExs = Array.from(document.querySelectorAll(".checkbox-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxEx().setupFromHTMLElement(element)));
app.radioButtonGroupExs = Array.from(document.querySelectorAll(".radio-button-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonGroupEx().setupFromHTMLElement(element)));
app.radioButtonExs = Array.from(document.querySelectorAll(".radio-button-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonEx().setupFromHTMLElement(element)));
app.dropDownExs = Array.from(document.querySelectorAll(".drop-down-ex")).map(element=>("uiEx" in element ? element.uiEx : new DropDownEx().setupFromHTMLElement(element)));
app.divExs = Array.from(document.querySelectorAll(".div-ex")).map(element=>("uiEx" in element ? element.uiEx : new DivEx().setupFromHTMLElement(element)));
var pageRun; // HACK
if (pageRun !== null && pageRun !== undefined && ElementEx.type(pageRun) === "function")
{
    pageRun(app);
}
[app.getActiveView()].forEach(view=>{
    if (view !== null && view !== undefined)
    {
        // console.log(view);
    }
});