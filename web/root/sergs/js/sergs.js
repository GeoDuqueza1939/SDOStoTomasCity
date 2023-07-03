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
        super(DialogEx.UIExType);
        this.autoId = this.UIExType + AddEmployeeDialog.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            super.setup(parentHTMLElement);
            this.container.uiEx = this;
            this.caption = "Add Employee";
            this.container.classList.add("add-employee-dialog");
            this.addDataFormEx();
            this.dataFormEx.id = "add-employee-dialog";
            this.dataFormEx.container.name = "add-employee-dialog";
            this.dataFormEx.container.setAttribute("method", "POST");
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"app", name:"app", inputType:"hidden", value:"SeRGS"});
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"a", name:"a", inputType:"hidden", value:"addEmployeeSubmit"});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Employee ID:", id:"employeeId", name:"employeeId", addContainerClass:obj=>obj.container.classList.add("employee-id"), inputType:"text", dbInfo:{table:"Employee", column:"employeeId"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Temporary employee ID", id:"is_temporary_empno", name:"is_temporary_empno", addContainerClass:obj=>obj.container.classList.add("temp-emp-id"), tooltip: "Temporary employee ID; for Plantilla Item Numbers, uncheck this item", reverse:undefined, dbInfo:{table:"Employee", column:"is_temporary_empno"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Given Name:", id:"given_name", name:"given_name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", dbInfo:{table:"Person", column:"given_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Middle Name:", id:"middle_name", name:"middle_name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"middle_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Family Name:", id:"family_name", name:"family_name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"family_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Spouse Name:", id:"spouse_name", name:"spouse_name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) For married women only", dbInfo:{table:"Person", column:"spouse_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Ext. Name:", id:"ext_name", name:"ext_name", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) Extension Name, e.g., Jr., III", dbInfo:{table:"Person", column:"ext_name"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Post-Nominal Degrees:", id:"post_nominal", name:"post_nominal", addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) Post-Nominal Degrees, e.g., LPT, PhD, EdD, MD, etc.", dbInfo:{table:"Person", column:"post_nominal"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(DateFieldEx.UIExType, {label:"Birth Date:", id:"birth_date", name:"birth_date", addContainerClass:obj=>obj.container.classList.add("birth-date"), dbInfo:{table:"Person", column:"birth_date"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Birth Place:", id:"birth_place", name:"birth_place", addContainerClass:obj=>obj.container.classList.add("birth-place"), inputType:"text", dbInfo:{table:"Person", column:"birth_place"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Email Address:", id:"email_address", name:"email_address", addContainerClass:obj=>obj.container.classList.add("email"), inputType:"email", dbInfo:{table:"Email_Address", column:"email_address"}});
            this.dataFormEx.addSpacer();
            this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Create SDO Services Account <br>using this email address", id:"create_account", name:"create_account", addContainerClass:obj=>obj.container.classList.add("create-account"), reverse:undefined, dbInfo:{table:"_", column:"create_account"}});

            this.addStatusPane();
        
            this.setupDialogButtons([
                {text:"Save", buttonType:"submit", tooltip:"Save employee information"/*, clickCallback:function(clickEvent){
                    console.log(this.uiEx.parentUIEx.parentDialogEx.dataFormEx.dbValues); // TEMP
                }*/}, {text:"Cancel", buttonType:"button", tooltip:"Close dialog", clickCallback:function(clickEvent){
                    this.uiEx.parentUIEx.parentDialogEx.close();
                }}
            ]);

            this.buttonGrpEx.controlExs[0].control.setAttribute("form", "add-employee-dialog");
            this.buttonGrpEx.controlExs[1].control.setAttribute("form", "add-employee-dialog");

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

class DeleteServiceRecordEntryDialog extends DialogEx
{
    static #UIExType = "AddEmployeeDialog";
    static #instanceCount = 0;

    constructor()
    {
        super(DialogEx.UIExType);
        this.autoId = this.UIExType + DeleteServiceRecordEntryDialog.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), row = new HTMLTableRowElement(), deleteRecordButton = new HTMLButtonElement())
    {
        try
        {
            super.setup(parentHTMLElement);
            this.container.uiEx = this;
            this.caption = "Delete Service Record Entry";
            this.container.classList.add("delete-service-record-entry-dialog");
            let container = new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"This will delete the following service record entry:"});
            this.addExContent(container);
            container.addContent(ElementEx.create("br"));
            container.addContent(ElementEx.create("br"));

            Array.from(row.children).forEach(cell=>{
                if (cell.children.length > 0 && cell.children[0] instanceof HTMLInputElement && cell.children[0].type === "date")
                {
                    cell.innerHTML = cell.children[0].value.replace(/(\d\d\d\d)-(\d\d)-(\d\d)/, "$2\/$3\/$1");
                }
            });

            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Inclusive Dates:"}).setHTMLContent(row.rowInfo.td["date-from"].innerHTML + " &ndash; " + row.rowInfo.td["date-to"].innerHTML));
            container.addContent(document.createTextNode(" "));
            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Designation:"}).setHTMLContent(row.rowInfo.td["designation"].innerHTML));
            container.addContent(document.createTextNode(" "));
            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Office/Station/Place:"}).setHTMLContent(row.rowInfo.td["station"].innerHTML));

            this.addStatusPane();
        
            this.setupDialogButtons([
                {text:"Continue", buttonType:"button", tooltip:"Delete the specified service record entry", clickCallback:function(clickEvent){
                    row.uiEx.rows.splice(row.uiEx.rows.findIndex(rowInfo=>rowInfo === row.rowInfo), 1)[0].tr.remove();
                    deleteRecordButton.disabled = true;
                    this.uiEx.parentUIEx.parentDialogEx.close();
                }}, {text:"Cancel", buttonType:"button", tooltip:"Close dialog", clickCallback:function(clickEvent){
                    this.uiEx.parentUIEx.parentDialogEx.close();
                }}
            ]);

            this.buttonGrpEx.controlExs[0].control.focus();

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
        return DeleteServiceRecordEntryDialog.#UIExType;
    }

    get instanceCount()
    {
        return DeleteServiceRecordEntryDialog.#instanceCount;
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
var errorMsg; // HACK
var loadData; // HACK
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
if (errorMsg !== null && errorMsg !== undefined && ElementEx.type(errorMsg) === "function")
{
    errorMsg();
}
if (loadData !== null && loadData !== undefined && ElementEx.type(loadData) === "function")
{
    loadData();
}
