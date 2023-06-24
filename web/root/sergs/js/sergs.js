"use strict";

if (typeof window === "null" || typeof window === "undefined")
{
    import("../../js/classes/ExClass.js");
    import("../../js/classes/UIEx.js");
}

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

class AddEmployeeDialog extends DialogEx
{
    static #UIExType = "AddEmployeeDialog";
    static #instanceCount = 0;

    constructor()
    {
        super(ContainerEx.UIExType);
        this.autoId = this.UIExType + AddEmployeeDialog.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            super.setup(parentHTMLElement);
            this.uiEx = this;
            this.caption = "Add Employee";
            this.container.classList.add("add-employee-dialog");
            this.addDataFormEx();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Employee ID:", addContainerClass:obj=>obj.container.classList.add("employee-id"), inputType:"text", blankStyle:true, dbInfo:{table:"Employee", column:"employeeId"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Temporary", addContainerClass:obj=>obj.container.classList.add("temp-emp-id"), tooltip: "Temporary employee ID; for Plantilla Item Numbers, uncheck this item", reverse:undefined, dbInfo:{table:"Employee", column:"is_temporary_empno"}});
            this.dataFormEx.addSpacer();
            // this.dataFormEx.addLineBreak();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Position Title:", addContainerClass:obj=>obj.container.classList.add("position"), inputType:"text", blankStyle:true, dbInfo:{table:"Position", column:"position_title"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Workplace:", addContainerClass:obj=>obj.container.classList.add("workplace"), inputType:"text", blankStyle:true, dbInfo:{column:"workplace"}});
            this.dataFormEx.addSpacer();
            // this.dataFormEx.addLineBreak();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Given Name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"given_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Middle Name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"middle_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Family Name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"family_name"}});
            this.dataFormEx.addSpacer();
            // this.dataFormEx.addLineBreak();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Spouse Name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"spouse_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Ext. Name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"ext_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Suffix", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"suffix"}});
            this.dataFormEx.addSpacer();
            // this.dataFormEx.addLineBreak();
            this.dataFormEx.addControlEx(DateFieldEx.UIExType, {label:"Birth Date", addContainerClass:obj=>obj.container.classList.add("birth-date"), reverse:undefined, blankStyle:true, vertical:true, dbInfo:{table:"Person", column:"birth_date"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Birth Place", addContainerClass:obj=>obj.container.classList.add("birth-place"), inputType:"text", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Person", column:"birth_place"}});
            this.dataFormEx.addSpacer();
            // this.dataFormEx.addLineBreak();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Email Address", addContainerClass:obj=>obj.container.classList.add("email"), inputType:"email", blankStyle:true, reverse:undefined, vertical:true, dbInfo:{table:"Email_Address", column:"email_address"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Create SDO Services Account <br>using this email address", addContainerClass:obj=>obj.container.classList.add("create-account"), reverse:undefined, dbInfo:{column:"create_account"}});

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return AddEmployeeDialog.#UIExType;
    }

    get instanceCount()
    {
        return AddEmployeeDialog.#instanceCount;
    }
}

let app = new SeRGS_App(document.getElementById("sergs"));
app.dataFormExs = Array.from(document.querySelectorAll(".data-form-ex")).map(element=>("uiEx" in element ? element.uiEx : new DataFormEx().setupFromHTMLElement(element)));
app.checkboxGroupExs = Array.from(document.querySelectorAll(".checkbox-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxGroupEx().setupFromHTMLElement(element)));
app.checkboxExs = Array.from(document.querySelectorAll(".checkbox-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxEx().setupFromHTMLElement(element)));
app.radioButtonGroupExs = Array.from(document.querySelectorAll(".radio-button-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonGroupEx().setupFromHTMLElement(element)));
app.radioButtonExs = Array.from(document.querySelectorAll(".radio-button-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonEx().setupFromHTMLElement(element)));
app.buttonExs = Array.from(document.querySelectorAll(".button-ex")).map(element=>("uiEx" in element ? element.uiEx : new ButtonEx().setupFromHTMLElement(element)));
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