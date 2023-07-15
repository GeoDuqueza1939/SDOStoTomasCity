"use strict";

if (typeof window === "null" || typeof window === "undefined")
{
    import("../../js/classes/ExClass.js");
    import("../../js/classes/UIEx.js");
}

class SeRGS_App extends App
{
    static processURL = "/sergs/php/process.php";
    static enum = {};

    constructor(container)
    {
        super(container);

        this.navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        this.main = Array.from(container.querySelectorAll("main"))[0];
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");
        this.currentUser = JSON.parse(SeRGS_App.getCookie("user"));
        
        // var app = this;
        [document.getElementById('sr-table-entry')].forEach(srTableElement=>{
            if (srTableElement instanceof HTMLTableElement || srTableElement instanceof HTMLElement && srTableElement.classList.contains("table-ex"))
            {
                [new TableEx().setupFromHTMLElement(srTableElement)].forEach(srTable=>{
                    // console.log(srTable);
                    Array.from(srTable.tbody.children).forEach(row=>{
                        SeRGS_App.attachRowEventListeners(row);
                    });
                });
            }
        });

        this.dataFormExs = Array.from(document.querySelectorAll(".data-form-ex")).map(element=>("uiEx" in element ? element.uiEx : new DataFormEx().setupFromHTMLElement(element)));
        this.checkboxGroupExs = Array.from(document.querySelectorAll(".checkbox-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxGroupEx().setupFromHTMLElement(element)));
        this.radioButtonGroupExs = Array.from(document.querySelectorAll(".radio-button-group-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonGroupEx().setupFromHTMLElement(element)));
        this.checkboxExs = Array.from(document.querySelectorAll(".checkbox-ex")).map(element=>("uiEx" in element ? element.uiEx : new CheckboxEx().setupFromHTMLElement(element)));
        this.radioButtonExs = Array.from(document.querySelectorAll(".radio-button-ex")).map(element=>("uiEx" in element ? element.uiEx : new RadioButtonEx().setupFromHTMLElement(element)));
        this.buttonExs = Array.from(document.querySelectorAll(".button-ex")).map(element=>("uiEx" in element ? element.uiEx : new ButtonEx().setupFromHTMLElement(element)));
        this.dropDownExs = Array.from(document.querySelectorAll(".drop-down-ex")).map(element=>("uiEx" in element ? element.uiEx : new DropDownEx().setupFromHTMLElement(element)));
        this.divExs = Array.from(document.querySelectorAll(".div-ex")).map(element=>("uiEx" in element ? element.uiEx : new DivEx().setupFromHTMLElement(element)));

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

    static activateTextbox(td = new HTMLTableCellElement, textboxName = "text")
    {
        if (td instanceof HTMLTableCellElement)
        {
            let textbox = td.children[0];
            textbox.type = "text";
            textbox.name = textboxName + "[]";
            textbox.id = textboxName;
            textbox.style.border = "0 none";

            td.childNodes[0].textContent = "";
            td.tabIndex = -1;
            textbox.focus();
            Array.from(document.getElementsByClassName("sr-delete-record")).forEach(srDeleteRecord=>srDeleteRecord.children[0]["active_cell"] = td);
        }
    }

    static deactivateTextbox(td = new HTMLTableCellElement(), textboxName = "combo")
    {
        if (td instanceof HTMLTableCellElement && td.children.length > 0)
        {
            let textbox = td.children[0];
            if (td.childNodes[0] === td.children[0])
            {
                td.prepend("");
            }
            td.childNodes[0].textContent = textbox.value;
            textbox.type = "hidden";
            textbox.name = textboxName + "[]";
            textbox.removeAttribute("id");
            textbox.removeAttribute("style");
            if (td.childNodes[0].textContent.trim() === "")
            {
                textbox.value = "";
            }
            
            this.activateDelRecButton(false, td);
            td.tabIndex = 0;
        }
    }

    static activateDateInput(td = new HTMLTableCellElement())
    {
        if (td instanceof HTMLTableCellElement)
        {
            if (!(td.children.length > 0 && td.children[0] instanceof HTMLInputElement))
            {
                let dateInput = ElementEx.create("input", ElementEx.NO_NS, null, null, "type", "date", "style", "border: 0 none;");
                dateInput.value = td.innerHTML.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/, "$3-$1-$2");
                td.innerHTML = "";
                td.append(dateInput);
                td.tabIndex = -1;
                dateInput.addEventListener("blur", event=>this.deactivateDateInput(td));
                dateInput.focus();
                Array.from(document.getElementsByClassName("sr-delete-record")).forEach(srDeleteRecord=>srDeleteRecord.children[0]["active_cell"] = td);
            }
        }
    }

    static deactivateDateInput(td = new HTMLTableCellElement())
    {
        if (td instanceof HTMLTableCellElement && td.children.length > 0 && td.children[0] instanceof HTMLInputElement && td.children[0].type === "date")
        {
            td.innerHTML = (td.children[0].value === "" && td.headerName === "date_end" && td.previousElementSibling.textContent !== "" ? "present" : td.children[0].value.replace(/(\d\d\d\d)-(\d\d)-(\d\d)/, "$2\/$3\/$1"));
            td.innerHTML += "<input type=\"hidden\" name=\"" + td.headerName + "[]\" value=\"" + (td.textContent === "present" ? "" : td.textContent) + "\">";
            this.activateDelRecButton(false, td);
            td.tabIndex = 0;
        }
    }

    static activateSelect(td = new HTMLTableCellElement, optionTextArray = [], optionValueArray = [])
    {
        if (td instanceof HTMLTableCellElement)
        {
            let select = ElementEx.create("select", ElementEx.NO_NS, null, null, "style", "border: 0 none;");
            if (td.headerName === "designation" && td.textContent.trim() !== "" && !SeRGS_App.enum["position_titles"].includes(td.textContent.trim()))
            {
                SeRGS_App.enum["position_titles"].unshift(td.textContent.trim());
            }
            optionTextArray.forEach((optionText, index)=>{
                ElementEx.create("option", ElementEx.NO_NS, select, null);
                Array.from(select.children).slice(-1)[0].innerHTML = optionText;
                if (optionValueArray !== null && optionValueArray !== undefined && Array.isArray(optionValueArray) && optionValueArray.length === optionTextArray.length)
                {
                    Array.from(select.children).slice(-1)[0].value = optionValueArray[index];
                }
            });
            select.prepend(ElementEx.create("option", ElementEx.NO_NS));
            
            if (td.textContent.trim() === "")
            {
                select.selectedIndex = 0;
            }
            else
            {
                select.selectedIndex = optionTextArray.findIndex(text=>text === td.textContent.trim()) + 1;
            }
            td.innerHTML = "";
            td.append(select);
            td.tabIndex = -1;
            select.addEventListener("blur", event=>this.deactivateSelect(td));
            select.focus();
            Array.from(document.getElementsByClassName("sr-delete-record")).forEach(srDeleteRecord=>srDeleteRecord.children[0]["active_cell"] = td);
        }
    }

    static deactivateSelect(td = new HTMLTableCellElement())
    {
        if (td instanceof HTMLTableCellElement && td.children.length > 0)
        {
            td.innerHTML = td.children[0].selectedOptions[0].textContent + "<input type=\"hidden\" name=\"" + td.headerName + "[]\" value=\"" + td.children[0].value + "\">";
            this.activateDelRecButton(false, td);
            td.tabIndex = 0;
        }
    }

    static activateCombo(td = new HTMLTableCellElement, optionTextArray = [], optionValueArray = [], comboName = "combo", listName = "combo-datalist")
    {
        if (td instanceof HTMLTableCellElement)
        {
            let combo = td.children[0];
            let comboDataList = ElementEx.create("datalist", ElementEx.NO_NS, null, null, "id", listName, "name", listName + "[]");
            combo.type = "text";
            combo.name = comboName + "[]";
            combo.id = comboName;
            combo.setAttribute("list", listName);
            combo.style.border = "0 none";

            optionTextArray.forEach((optionText, index)=>{
                ElementEx.create("option", ElementEx.NO_NS, comboDataList, null);
                Array.from(comboDataList.children).slice(-1)[0].innerHTML = optionText;
                if (optionValueArray !== null && optionValueArray !== undefined && Array.isArray(optionValueArray) && optionValueArray.length === optionTextArray.length)
                {
                    Array.from(comboDataList.children).slice(-1)[0].value = optionValueArray[index];
                }
            });

            td.childNodes[0].textContent = "";
            td.replaceChild(comboDataList, td.children[1]);
            td.tabIndex = -1;
            combo.focus();
            Array.from(document.getElementsByClassName("sr-delete-record")).forEach(srDeleteRecord=>srDeleteRecord.children[0]["active_cell"] = td);
        }
    }

    static deactivateCombo(td = new HTMLTableCellElement(), comboName = "combo", listName = "combo-datalist", callbackGetValue = (td = new HTMLTableCellElement()) => Array.from(td.children[1].options).findIndex(option => { return option.value === td.childNodes[0].textContent || option.innerHTML === td.childNodes[0].textContent; }))
    {
        if (td instanceof HTMLTableCellElement && td.children.length > 0)
        {
            let combo = td.children[0];
            if (td.childNodes[0] === td.children[0])
            {
                td.prepend("");
            }
            td.childNodes[0].textContent = combo.value;
            combo.type = "hidden";
            combo.name = comboName + "[]";
            combo.removeAttribute("id");
            combo.removeAttribute("list");
            combo.removeAttribute("style");
            if (td.childNodes[0].textContent.trim() === "")
            {
                combo.value = "";
            }
            
            let comboValue = ElementEx.create("input", ElementEx.NO_NS, null, null, "type", "hidden", "name", listName + "[]");

            comboValue.value = callbackGetValue(td);

            td.replaceChild(comboValue, td.children[1]);

            this.activateDelRecButton(false, td);
            td.tabIndex = 0;
        }
    }

    static getSalaryStepValue(td = new HTMLTableCellElement())
    {
        let position = SeRGS_App.enum["positions"].find(position=>position["position_title"] === td.parentElement.rowInfo.td["designation"].textContent);
        let salaryGrade = (position === null || position === undefined ? null : position["salary_grade"]);
        let salarySteps = (salaryGrade === null || salaryGrade === undefined ? [] : SeRGS_App.enum["salaryGrade"].filter(sg=>salaryGrade === sg["salary_grade"] && (new Date(sg["effectivity_date"])) <= (new Date(td.parentElement.rowInfo.td["date_start"].textContent))));
        let salaryStep = salarySteps.find(sg=>parseFloat(sg["salary"]) === parseFloat(td.children[0].value));

        return (salaryStep === null || salaryStep === undefined ? null : salaryStep["step_increment"]);
    }

    static async activateDelRecButton(setting = true, td = null)
    {
        await window.setTimeout(()=>{
            Array.from(document.getElementsByClassName("sr-delete-record")).forEach(srDeleteRecord=>{
                if (td instanceof HTMLTableCellElement)
                {
                    td.parentElement.classList.toggle("selected", setting);
                }
                srDeleteRecord.children[0].disabled = !setting;
                srDeleteRecord.children[0]["active_cell"] = (setting ? td : null);
            });
        }, 1000);
    }

    static arrowMove(event = new KeyboardEvent(), td = new HTMLTableCellElement)
    {
        let rowIndex = Array.from(td.parentElement.parentElement.children).findIndex(row=>row === td.parentElement);
        let cellIndex = Array.from(td.parentElement.children).findIndex(cell=>cell === td);
        let nextTD = null;
        let range = document.getSelection().getRangeAt(0);
        let isCollapsed = range.commonAncestorContainer === td || range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        let hasChildren = (td.childNodes.length > 0);

        let canMoveToPrevious = (!hasChildren || (isCollapsed && range.startContainer === td.childNodes[0] && range.startOffset === 0 && td["lastStart"] === range.startOffset));
        let canMoveToNext = (!hasChildren || (isCollapsed && range.startContainer === Array.from(td.childNodes).slice(-1)[0] && range.endOffset >= Array.from(td.childNodes).slice(-1)[0].textContent.length && td["lastEnd"] === range.endOffset));

        if (event.key === "ArrowUp" && rowIndex > 0 && canMoveToPrevious)
        {
            nextTD = td.parentElement.parentElement.children[rowIndex - 1].rowInfo.td[td["headerName"]];
        }
        else if (event.key === "ArrowDown" && rowIndex < td.parentElement.parentElement.children.length - 1 && canMoveToNext)
        {
            nextTD = td.parentElement.parentElement.children[rowIndex + 1].rowInfo.td[td["headerName"]];
        }
        else if (event.key === "ArrowLeft" && canMoveToPrevious)
        {
            if (cellIndex > 0)
            {
                nextTD = td.previousElementSibling;
            }
            else if (rowIndex > 0)
            {
                nextTD = Array.from(td.parentElement.parentElement.children[rowIndex - 1].children).slice(-1)[0];
            }
        }
        else if (event.key === "ArrowRight" && canMoveToNext)
        {
            if (cellIndex < td.parentElement.children.length - 1)
            {
                nextTD = td.nextElementSibling;
            }
            else if (rowIndex < td.parentElement.parentElement.children.length - 1)
            {
                nextTD = td.parentElement.parentElement.children[rowIndex + 1].children[0];
            }
        }
        else if (event.key === "F2" && hasChildren && (!isCollapsed || range.commonAncestorContainer === td))
        {
            document.getSelection().collapseToStart();
        }

        if (nextTD)
        {
            nextTD.focus();
            document.getSelection().selectAllChildren(nextTD);

            delete td["lastStart"];
            delete td["lastEnd"];
        }
        else
        {
            td["lastStart"] = range.startOffset;
            td["lastEnd"] = range.endOffset;
        }
    }

    static addNewRow()
    {
        let row = document.getElementById('sr-table-entry').uiEx.addRow();
        
        this.attachRowEventListeners(row);

        row.rowInfo.td["date_end"].innerHTML = row.rowInfo.td["date_end"].innerHTML.replace("present", "");

        row.children[0].focus();

        Array.from(document.getElementsByClassName('sr-save-update')).forEach(srSaveUpdateBtnEx=>srSaveUpdateBtnEx.children[0].disabled = false);
    }

    static attachRowEventListeners(row = new HTMLTableRowElement())
    {
        Array.from(row.children).forEach((cell, index)=>{
            switch(cell.headerName)
            {
                case "date_start":
                case "date_end":
                case "separation_date":
                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.addEventListener("focus", event=>this.activateDateInput(cell));
                    if (cell.headerName === "date_end" && cell.textContent.trim() === "" && row.rowInfo.td["date_start"].textContent !== "")
                    {
                        cell.innerHTML = "present" + cell.innerHTML;
                    }
                    break;
                case "designation":
                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.removeEventListener("focus", TableEx.editableCellFocusEvent);
                    cell.removeEventListener("blur", TableEx.editableCellBlurEvent);
                    
                    ElementEx.create("input", ElementEx.NO_NS, cell, null, "type", "hidden", "name", "designationList[]").value = cell.children[0].value;
                    cell.children[0].addEventListener("blur", event=>{
                        this.deactivateCombo(cell, "designation", "designationList", td => td.children[1].value = td.children[0].value);
                        row.rowInfo.td["salary"].childNodes[0].textContent = "";
                        row.rowInfo.td["salary"].children[0].removeAttribute("value");
                        row.rowInfo.td["salary"].children[1].removeAttribute("value");
                    });
                    cell.addEventListener("focus", event=>this.activateCombo(cell, SeRGS_App.enum["position_titles"], [], "designation", "designationList"));
                    if (cell.textContent.trim() !== "" && !SeRGS_App.enum["position_titles"].includes(cell.textContent))
                    {
                        SeRGS_App.enum["position_titles"].unshift(cell.textContent);
                    }
                    break;
                case "status":
                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.removeEventListener("focus", TableEx.editableCellFocusEvent);
                    cell.removeEventListener("blur", TableEx.editableCellBlurEvent);
                    cell.addEventListener("focus", event=>{
                        this.activateSelect(cell, SeRGS_App.enum["appointmentStatus"].map(stat=>stat["appointment_status"]), SeRGS_App.enum["appointmentStatus"].map(stat=>stat["index"]));
                        if (cell.textContent.trim() === "")
                        {
                            cell.children[0].value = -1;
                        }    
                    });
                    if (cell.textContent.trim() === "")
                    {
                        cell.children[0].value = -1;
                    }
                    else if (cell.textContent === cell.children[0].value)
                    {
                        cell.children[0].value = SeRGS_App.enum["appointmentStatus"].find(stat=>stat["appointment_status"] === cell.children[0].value)["index"];
                    }
                    break;
                case "salary":
                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.removeEventListener("focus", TableEx.editableCellFocusEvent);
                    cell.removeEventListener("blur", TableEx.editableCellBlurEvent);
                    
                    ElementEx.create("input", ElementEx.NO_NS, cell, null, "type", "hidden", "name", "salaryStep[]");
                    cell.children[1].value = this.getSalaryStepValue(cell);
                    
                    cell.childNodes[0].textContent = (isNaN(parseFloat(cell.childNodes[0].textContent)) ? cell.childNodes[0].textContent : Intl.NumberFormat("en-PH", { style:"currency", currency:"PHP" }).format(cell.childNodes[0].textContent));
                    cell.children[0].addEventListener("blur", event=>{
                        this.deactivateCombo(cell, "salary", "salaryStep", SeRGS_App.getSalaryStepValue);
                        cell.children[0].removeAttribute("min");
                        cell.childNodes[0].textContent = (isNaN(parseFloat(cell.children[0].value)) ? cell.children[0].value : Intl.NumberFormat("en-PH", { style:"currency", currency:"PHP" }).format(cell.children[0].value));
                    });
                    cell.addEventListener("focus", event=>{
                        let position = SeRGS_App.enum["positions"].find(position=>position["position_title"] === row.rowInfo.td["designation"].textContent);
                        let salaryGrade = (position === null || position === undefined ? null : position["salary_grade"]);
                        let salarySteps = (salaryGrade === null || salaryGrade === undefined ? [] : SeRGS_App.enum["salaryGrade"].filter(sg=>salaryGrade === sg["salary_grade"] && (new Date(sg["effectivity_date"])) <= (new Date(row.rowInfo.td["date_start"].textContent))));

                        // console.log(position, salaryGrade, salarySteps.map(step=>step["salary"]), salarySteps.map(step=>step["step_increment"]));

                        this.activateCombo(cell, salarySteps.map(step=>"SG" + salaryGrade + "-Step " + step["step_increment"]), salarySteps.map(step=>step["salary"]), "salary", "salaryStep");

                        cell.children[0].type = "number";
                        cell.children[0].setAttribute("min", 0);
                        cell.children[0].style.width = "6em";
                    });
                    break;
                case "lwop_count":
                    cell.childNodes[0].textContent = (isNaN(parseFloat(cell.childNodes[0].textContent)) ? cell.childNodes[0].textContent : Intl.NumberFormat("en-PH", { style:"currency", currency:"PHP" }).format(cell.childNodes[0].textContent));
                    if (cell.childNodes[0] === cell.children[0])
                    {
                        cell.prepend("None");
                    }
                    else if (cell.childNodes[0].textContent.trim() === "0" || cell.childNodes[0].textContent.trim() === "")
                    {
                        cell.childNodes[0].textContent = "None";
                    }
                    if (cell.childNodes[0].textContent = "None")
                    {
                        cell.children[0].value = 0;
                    }
                    cell.children[0].addEventListener("blur", event=>{
                        this.deactivateTextbox(cell, "lwop_count");
                        cell.children[0].removeAttribute("min");
                        if (cell.childNodes[0].textContent.trim() === "0" || cell.childNodes[0].textContent.trim() === "")
                        {
                            cell.childNodes[0].textContent = "None";
                            cell.children[0].value = 0;
                        }
                    });

                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.removeEventListener("focus", TableEx.editableCellFocusEvent);
                    cell.removeEventListener("blur", TableEx.editableCellBlurEvent);
                    cell.addEventListener("focus", event=>{
                        if (cell.childNodes[0].textContent === "None")
                        {
                            cell.childNodes[0].textContent = "0";
                        }
                        this.activateTextbox(cell, "lwop_count");

                        cell.children[0].type = "number";
                        cell.children[0].setAttribute("min", 0);
                        cell.children[0].style.width = "6em";
                    });
                    break;
                case "branch":
                    if (cell.textContent.trim() === "")
                    {
                        if (cell.childNodes[0] instanceof HTMLElement)
                        {
                            cell.prepend("NM");
                            cell.children[0].value = "NM";
                        }
                        else
                        {
                            cell.childNodes[0].textContent = "NM";
                        }
                    }
                    break;
                default:
                    break;
            }
            
            cell.addEventListener("focus", event=>{
                this.activateDelRecButton(true, cell);

                Array.from(document.getElementsByClassName("sr-save-update")).forEach(saveBtnEx=>{
                    if (saveBtnEx.children[0].disabled) saveBtnEx.children[0].disabled = false;
                });
            });
            cell.addEventListener("blur", event=>this.activateDelRecButton(false, cell));
        });
    }

    static morphAddEmployeeLoadSRButton(select = new HTMLSelectElement())
    {
        document.getElementById('sr-add-new-emp').uiEx.control.disabled = false;
        document.getElementById('sr-add-new-emp').uiEx.control.innerHTML = (select.value == -1 ? 'Add Employee' : 'Load Service Record');
        document.getElementById('sr-add-new-emp').uiEx.control.type = (select.value == -1 ? 'button' : 'submit');
        if (select.value == -1)
        {
            document.getElementById('sr-add-new-emp').uiEx.control.setAttribute("onclick", "SeRGS_App.addEmployeeLoadSRButton(this);");
        }
        else
        {
            document.getElementById('sr-add-new-emp').uiEx.control.removeAttribute("onclick");
        }
        document.getElementById('sr-emp-birth-date').uiEx.setHTMLContent(select.selectedOptions[0].dataset.birthDate);
        document.getElementById('sr-emp-birth-place').uiEx.setHTMLContent(select.selectedOptions[0].dataset.birthPlace);
    }

    static addEmployeeLoadSRButton(button = new HTMLButtonElement())
    {
        if (button.innerHTML === 'Add Employee')
        {
            new AddEmployeeDialog().setup(document.getElementById('sergs').querySelector('main'));
        }
        // else if (button.innerHTML === 'Load Service Record')
        // {
        //     this.loadSR(document.getElementById('emp-id').value, document.getElementById('sr-table-entry'));
        // }
    }

    // static loadSR(employeeId = "", srTableEx = new TableEx())
    // {
    //     if (ElementEx.type(employeeId) === "string" && employeeId !== "")
    //     {
    //         // console.log(employeeId, srTableEx);
    //         Array.from(document.getElementsByClassName("sr-add-record")).forEach(srAddRecord=>srAddRecord.children[0].disabled = false);
    //         Array.from(document.getElementsByClassName("sr-revert-cancel")).forEach(srAddRecord=>srAddRecord.children[0].disabled = false);
    //         // document.getElementsByClassName("sr-add-record")[0].children[0].click();
    //         // document.getElementsByClassName("sr-add-record")[0].children[0].click();
    //         // document.getElementsByClassName("sr-add-record")[0].children[0].click();
    //     }
    // }

    static updateSR()
    {
        let srTableEx = document.getElementById("sr-table-entry").uiEx;

        let srData = srTableEx.rows.map(rowInfo=>{
            var rowData = {};

            for (const key in rowInfo.td)
            {
                switch (key)
                {
                    case "date_start":
                    case "date_end":
                    case "separation_date":
                        rowData[key] = rowInfo.td[key].textContent.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/, "$3-$1-$2");
                        break;
                    default:
                        rowData[key] = rowInfo.td[key].textContent;
                        break;
                }
            }

            return rowData;
        });

        // ADD CODE FOR SUBMITTING SERVICE RECORD DATA TO SERVER

        console.log(srData);
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
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"a", name:"a", inputType:"hidden", value:"add"});
            this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"add", name:"add", inputType:"hidden", value:"employee"});
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

            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Inclusive Dates:"}).setHTMLContent(row.rowInfo.td["date_start"].innerHTML + " &ndash; " + row.rowInfo.td["date_end"].innerHTML));
            container.addContent(document.createTextNode(" "));
            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Designation:"}).setHTMLContent(row.rowInfo.td["designation"].innerHTML));
            container.addContent(document.createTextNode(" "));
            container.addExContent(new DivEx().setupFromConfig({parentHTMLElement:this.container, caption:"Office/Station/Place:"}).setHTMLContent(row.rowInfo.td["station"].innerHTML));

            this.addStatusPane();
        
            this.setupDialogButtons([
                {text:"Continue", buttonType:"button", tooltip:"Delete the specified service record entry", clickCallback:function(clickEvent){
                    row.uiEx.rows.splice(row.uiEx.rows.findIndex(rowInfo=>rowInfo === row.rowInfo), 1)[0].tr.remove();
                    Array.from(document.getElementsByClassName('sr-delete-record')).forEach(srSaveUpdateBtnEx=>srSaveUpdateBtnEx.children[0].disabled = true);
                    Array.from(document.getElementsByClassName('sr-save-update')).forEach(srSaveUpdateBtnEx=>srSaveUpdateBtnEx.children[0].disabled = false);
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
