"use strict";

if (typeof window === "null" || typeof window === "undefined") // imports to aid VSCode Intellisense
{
    import("../../js/classes/ExClass.js");
    import("../../js/classes/UIEx.js");
    import("../../js/libs/jsbn/jsbn.js");
    import("../../js/libs/jsbn/jsbn2.js");
    import("../../js/libs/jsbn/rsa.js");
    import("../../js/libs/jsbn/rsa2.js");
    import("../../js/libs/jsbn/rng.js");
    import("../../js/libs/jsbn/prng4.js");
    import("../../js/libs/jsbn/base64.js");
    import("../../js/libs/jsbn/sha1.js");
}

class Ajax
{
    static postData(procUrl, data, func)
    {
        var xmlhttp;
        xmlhttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
        xmlhttp.onreadystatechange = func;
        
        xmlhttp.open("POST", procUrl, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);
    }
    
    static packageData(objData, rsaKey = null)
    {
        let data = JSON.stringify(objData);

        data = data.replace(/'/g, "''");

        return data;
    }
    
}

class SeRGS_App extends App
{
    static processURL = "/sergs/api.php";
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
                Ajax.postData(SeRGS_App.processURL, "app=sergs&a=logout", postEvent=>{
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

            if (td.headerName !== "separation_date")
            {
                SeRGS_App.resetSalaryValue(td.parentElement);
            }            
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

    static getSalarySteps(designation = "", dateStart = "", dateEnd = "")
    {
        if (designation === null || dateStart === null || dateEnd === null || designation === undefined || dateStart === undefined || dateEnd === undefined || designation === "" || dateStart === "" || dateEnd === "")
        {
            return [];
        }

        let position = SeRGS_App.enum["positions"].find(position=>position["position_title"] === designation);
        let salaryGrade = (position === null || position === undefined ? null : position["salary_grade"]);
        let salarySteps = (salaryGrade === null || salaryGrade === undefined ? [] : SeRGS_App.enum["salaryGrade"].filter(sg=>salaryGrade === sg["salary_grade"] && (new Date(sg["effectivity_date"])) <= (new Date(dateStart))));

        // console.log(salarySteps);

        return salarySteps;
    }

    static getSalaryStepValue(td = new HTMLTableCellElement())
    {
        let salarySteps = SeRGS_App.getSalarySteps(td.parentElement.rowInfo.td["designation"].textContent, td.parentElement.rowInfo.td["date_start"].textContent, td.parentElement.rowInfo.td["date_end"].textContent);

        let salaryStep = salarySteps.find(sg=>parseFloat(sg["salary"]) === parseFloat(td.children[0].value));

        return (salaryStep === null || salaryStep === undefined ? null : salaryStep["step_increment"]);
    }

    static resetSalaryValue(tr = new HTMLTableCellElement())
    {
        let salaryList = this.getSalarySteps(tr.rowInfo.td["designation"].textContent, tr.rowInfo.td["date_start"].textContent, tr.rowInfo.td["date_end"].textContent).map(step => parseFloat(step['salary']));
        
        if (salaryList.length !== 0 && !salaryList.includes(parseFloat(tr.rowInfo.td["salary"].children[0].value)) && tr.rowInfo.td["salary"].childNodes[0].textContent !== "")
        {
            new MessageBox().setup(app.main, "SeRGS Dialog", "The salary specified on this record/row does not match <br>any of the salaries for this position that were effective <br>during the service duration. <br><br>Do you want to delete this salary?", [
                { text:"Yes", buttonType:"button", addStyle:obj=>{console.log(obj);}, clickCallback:clickEvent=>{
                    tr.rowInfo.td["salary"].childNodes[0].textContent = "";
                    tr.rowInfo.td["salary"].children[0].removeAttribute("value");
                    tr.rowInfo.td["salary"].children[1].removeAttribute("value");
                    clickEvent.target.uiEx.parentUIEx.parentDialogEx.close();
                }},
                { text:"No", buttonType:"button", clickCallback:clickEvent=>{
                    clickEvent.target.uiEx.parentUIEx.parentDialogEx.close();
                }},
            ]);
        }
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
                    if (cell.headerName === "date_end" && row.rowInfo.td["date_start"].textContent !== "")
                    {
                        if (cell.textContent.trim() === "")
                        {
                            cell.innerHTML = "present" + cell.innerHTML;
                        }
                        else if (cell.textContent.trim() === "present")
                        {
                            cell.children[0].value = null;
                        }
                    }
                    break;
                case "designation":
                    cell.removeEventListener("keyup", TableEx.editableCellNavigation);
                    cell.removeEventListener("focus", TableEx.editableCellFocusEvent);
                    cell.removeEventListener("blur", TableEx.editableCellBlurEvent);
                    
                    ElementEx.create("input", ElementEx.NO_NS, cell, null, "type", "hidden", "name", "designationList[]").value = cell.children[0].value;
                    cell.children[0].addEventListener("blur", event=>{
                        this.deactivateCombo(cell, "designation", "designationList", td => td.children[1].value = td.children[0].value);
                        
                        SeRGS_App.resetSalaryValue(row);
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
                        let salarySteps = this.getSalarySteps(row.rowInfo.td["designation"].textContent, row.rowInfo.td["date_start"].textContent, row.rowInfo.td["date_end"].textContent);

                        this.activateCombo(cell, salarySteps.map(step=>"SG" + step['salary_grade'] + "-Step " + step["step_increment"] + " (effective on " + step["effectivity_date"] + ")"), salarySteps.map(step=>step["salary"]), "salary", "salaryStep");

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

    static morphAddEmployeeLoadSRButton(select = new HTMLSelectElement(), isForEditor = true)
    {
        document.getElementById('sr-load-sr').uiEx.control.disabled = !isForEditor && select.value === '-1';
        document.getElementById('sr-load-sr').uiEx.control.innerHTML = (isForEditor && select.value === '-1' ? 'Add Employee' : 'Load Service Record');
        document.getElementById('sr-load-sr').uiEx.control.type = (isForEditor && select.value === '-1' ? 'button' : 'submit');
        if (isForEditor && select.value == -1)
        {
            document.getElementById('sr-load-sr').uiEx.control.setAttribute("onclick", "SeRGS_App.addEmployeeLoadSRButton(this);");
        }
        else
        {
            document.getElementById('sr-load-sr').uiEx.control.removeAttribute("onclick");
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
            let rowData = {};

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

class UserEditor extends DialogEx
{
    constructor()
    {
        super();
    }

    setup(parentHTMLElement = new HTMLElement(), app = new App(), id = "", mode = 0, userData = null)
    {
        let thisDialog = this;
        super.setup(parentHTMLElement);
        // console.log(this);

        this.mode = mode; // 0: add user; 1: edit user
        this.app = app;

        this.scrim.classList.add("user-editor");
        this.caption = (mode ? "Edit" : "Add") + " User";
        this.captionHeaderLevel = 3;

        this.data = {
            username:(mode == 1 && userData !== null && userData !== undefined ? userData["username"] : null),
            employeeId:(mode == 1 && userData !== null && userData !== undefined ? userData["employeeId"] : null),
            personId:(mode == 1 && userData !== null && userData !== undefined ? userData["personId"] : null)
        }
        
        this.addDataFormEx();
        // this.formEx.setTitle((mode ? "Edit" : "Add") + " User", 3);
        this.dataFormEx.id = "user-editor-form";
        this.dataFormEx.container.name = "user-editor-form";
        this.dataFormEx.container.setAttribute("method", "POST");

        this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"app", name:"app", inputType:"hidden", value:"MPaSIS"});
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"a", name:"a", inputType:"hidden", value:(this.mode == 0 ? "add" : "update")});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Employee ID:", id:"employeeId", name:"employeeId", value:(mode == 1 && userData !== null && userData !== undefined ? userData["employeeId"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("employee-id"), inputType:"text", dbInfo:{table:"User", column:"employeeId"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Temporary account only", id:"temp_user", name:"temp_user", check:(mode == 1 && userData !== null && userData !== undefined && "temp_user" in userData && userData["temp_user"] === 1), addContainerClass:obj=>obj.container.classList.add("temp-user"), tooltip:"Temporary accounts are accounts that are not bound to employee information", reverse:undefined, dbInfo:{column:"temp_user"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Given Name:", id:"given_name", name:"given_name", value:(mode == 1 && userData !== null && userData !== undefined ? userData["given_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", dbInfo:{table:"Person", column:"given_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Middle Name:", id:"middle_name", name:"middle_name", value:(mode == 1 && userData !== null && userData !== undefined ? userData["middle_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"middle_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Family Name:", id:"family_name", name:"family_name", value:(mode == 1 && userData !== null && userData !== undefined ? userData["family_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"family_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Spouse Name:", id:"spouse_name", name:"spouse_name", value:(mode == 1 && userData !== null && userData !== undefined ? userData["spouse_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) For married women only", dbInfo:{table:"Person", column:"spouse_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Ext. Name:", id:"ext_name", name:"ext_name", value:(mode == 1 && userData !== null && userData !== undefined ? userData["ext_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) Extension Name, e.g., Jr., III", dbInfo:{table:"Person", column:"ext_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Username:", id:"username", name:"username", value:(mode == 1 && userData !== null && userData !== undefined ? userData["username"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), disable:obj=>obj.control.disabled = (this.mode === 1), inputType:"text", dbInfo:{table:"All_User", column:"username"}});
        this.dataFormEx.addSpacer();

        this.dataFormEx.addContainerEx(FrameEx.UIExType, {caption:"Access Levels:", addContainerClass:obj=>obj.container.classList.add("user-editor-access-levels"), dbInfo:{column:"user-editor-access-levels"}});

        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"SeRGS:", id:"sergs_access_level", name:"sergs_access_level", value:(mode == 1 && userData !== null && userData !== undefined ? userData["sergs_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:10, dbInfo:{table:"All_User", column:"sergs_access_level"}});
        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"OPMS:", id:"opms_access_level", name:"opms_access_level", value:(mode == 1 && userData !== null && userData !== undefined ? userData["opms_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:10, dbInfo:{table:"All_User", column:"opms_access_level"}});
        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"MPaSIS:", id:"mpasis_access_level", name:"mpasis_access_level", value:(mode == 1 && userData !== null && userData !== undefined ? userData["mpasis_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:4, dbInfo:{table:"All_User", column:"mpasis_access_level"}});
        this.dataFormEx.addSpacer();

        this.dataFormEx.dbControls["temp_user"].addEvent("change", event=>{
            this.dataFormEx.dbControls["employeeId"].control.disabled = this.dataFormEx.dbControls["temp_user"].checked;
        });

        this.addStatusPane();

        this.setupDialogButtons([
            {text:"Save", buttonType:"button", tooltip:"Save employee information", clickCallback:function(clickEvent){
                let dialog = this.uiEx.parentUIEx.parentDialogEx;
                let form = dialog.dataFormEx;

                let person = {};
                let user = {};
                let error = "";
    
                for (const dbColName in form.dbControls) {
                    let value = form.dbControls[dbColName].value;
                    if (dbColName == "temp_user")
                    {
                        user[dbColName] = form.dbControls[dbColName].checked;
                    }
                    else if ((value !== null && value !== undefined/* && !MPASIS_App.isEmptySpaceString(value)*/) || typeof(value) == "number")
                    {
                        if (form.dbInfo["Person"].includes(dbColName))
                        {
                            person[dbColName] = (MPASIS_App.isEmptySpaceString(value) ? null : value);
                        }
                        else
                        {
                            user[dbColName] = (MPASIS_App.isEmptySpaceString(value) ? null : value);
                        }
                    }
                    
                    if (dbColName == "employeeId" && (user["employeeId"] === null || user["employeeId"] === undefined) && !form.dbControls["temp_user"].checked)
                    {
                        error += "Employee ID should not be blank for non-temporary user accounts.<br>";
                    }
                    else if (dbColName == "given_name" && (person["given_name"] === null || person["given_name"] === undefined) && form.dbControls["temp_user"].checked)
                    {
                        error += "Given Name should not be blank.<br>";
                    }
                    else if (dbColName == "username" && (user["username"] === null || user["username"] === undefined))
                    {
                        error += "Username should not be blank.<br>";
                    }
                }
    
                user["personId"] = dialog.data["personId"];
    
                if (error != "")
                {
                    dialog.raiseError(error);
                }
                else
                {
                    // // DEBUG
                    // console.log(form.dbControls, person, user, MPASIS_App.processURL);
    
                    // return;
                    // // DEBUG
    
                    Ajax.postData(SeRGS_App.processURL, "app=sergs&a=" + (form.mode == 0 ? "add" : "update") + "&person=" + packageData(person) + "&user=" + packageData(user), async (event)=>{
                        let response;
    
                        if (event.target.readyState == 4 && event.target.status == 200)
                        {
                            response = JSON.parse(event.target.responseText);
    
                            if (response.type == "Error")
                            {
                                dialog.raiseError(response.content);
                            }
                            else if (response.type == "Success")
                            {
                                dialog.showSuccess(response.content);
                                if ("searchButton" in dialog.app.temp)
                                {
                                    dialog.app.temp["searchButton"].fields[0].click();
                                }
                                await sleep(3000);
                                dialog.close();
                            }
                            else if (response.type == "Debug")
                            {
                                new MsgBox(form.container.parentElement, response.content, "OK");
                                console.log(response.content);
                            }
                            else
                            {
                                console.log(response.content, event.target);
                            }
                        }
                    });
                }
            }}, {text:"Close", buttonType:"button", tooltip:"Close dialog", clickCallback:function(clickEvent){
                this.uiEx.parentUIEx.parentDialogEx.close();
            }}
        ]);

        this.buttonGrpEx.controlExs[0].control.setAttribute("form", "add-employee-dialog");
        this.buttonGrpEx.controlExs[1].control.setAttribute("form", "add-employee-dialog");

        // TEMP
        this.dataFormEx.dbControls["employeeId"].control.disabled = true;
        this.dataFormEx.dbControls["temp_user"].control.disabled = true;
        if (this.mode == 1)
            return;
            this.dataFormEx.dbControls["temp_user"].check();
        // TEMP

        return this;
    }
}

class PasswordEditor extends DialogEx
{
    constructor()
    {
        super();
    }

    setup(app = new App(), id = "", requireCurrentPassword = false, requireChange = false, async = true) // password change when requireCurrentPassword is false will only push through if the user is properly logged in
    {
        // super(app.main, id);
        let thisPasswordEditor = this;
        super.setup(app.main);
        console.log(app);

        this.app = app;

        this.scrim.classList.add("password-editor");
        this.caption = "Change Password";
        this.captionHeaderLevel = 3;

        this.addDataFormEx();

        this.dataFormEx.id = "passord-editor-form";
        this.dataFormEx.container.name = "password-editor-form";
        this.dataFormEx.container.setAttribute("method", "POST");

        let passwordRetypeFunc = passwordRetypeEvent=>{
            let newPass = this.dataFormEx.dbControls["new_password"].value;
            let newPass2 = this.dataFormEx.dbControls["retype_new_password"].value;
            let newPassBlank = newPass === "" && newPass2 === "";
            let passMatch = newPass !== "" && newPass === newPass2;
            let allFilled = newPass !== "" && newPass2 !== "" && (!requireCurrentPassword || this.dataFormEx.dbControls["password"].value !== "");

            this.buttonGrpEx.controlExs[0].enable(passMatch && allFilled);

            if (newPassBlank || passMatch && allFilled)
            {
                this.resetStatus();
            }
            else if (passMatch && !allFilled)
            {
                this.raiseError("All password fields are required");
            }
            else
            {
                this.raiseError("New passwords do not match");
            }
        };

        [
            {label:"Current Password:", type:"password", colName:"password", table:"All_User", tooltip:"Type your old password"},
            {label:"New Password:", type:"password", colName:"new_password", table:"All_User", tooltip:"Type new password"},
            {label:"Retype New Password:", type:"password", colName:"retype_new_password", table:"All_User", tooltip:"Retype new password"}
        ].forEach((field, index)=>{
            if (requireCurrentPassword || field.colName != "password")
            {
                if (index > (requireCurrentPassword ? 0 : 1))
                {
                    this.dataFormEx.addSpacer();
                }
                this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:field.label, id:field.colName, name:field.colName, value:"", addContainerClass:obj=>obj.container.classList.add(field.colName), inputType:field.type, tooltip:field.tooltip, dbInfo:{table:field.table, column:field.colName}});
            }

            if (field.colName in this.dataFormEx.dbControls)
            {
                this.dataFormEx.dbControls[field.colName].addEvent("change", passwordRetypeFunc);
                this.dataFormEx.dbControls[field.colName].addEvent("keydown", passwordRetypeFunc);
                this.dataFormEx.dbControls[field.colName].addEvent("keypress", passwordRetypeFunc);
                this.dataFormEx.dbControls[field.colName].addEvent("keyup", passwordRetypeFunc);
            }
        });

        console.log(this);

        this.addStatusPane();
        this.statusTimeOut = -1;

        this.setupDialogButtons([
            {text:"Save", buttonType:"button", tooltip:"Save employee information", clickCallback:function(changePasswordEvent){
                let passwordDetails = {
                    requireCurrentPassword:requireCurrentPassword,
                    password:(requireCurrentPassword ? this.uiEx.parentUIEx.parentDialogEx.dataFormEx.dbControls["password"].value : null),
                    new_password:this.uiEx.parentUIEx.parentDialogEx.dataFormEx.dbControls["new_password"].value,
                    user:this.uiEx.parentUIEx.parentDialogEx.app.currentUser
                }
    
                // // DEBUG
                // console.log(passwordDetails);

                window.location = this.processURL + "?a=update&update=pswd&data=" + Ajax.packageData(passwordDetails);
    
                return;
                // // DEBUG
    
                Ajax.postData(SeRGS_App.processURL, "a=update&update=pswd&data=" + Ajax.packageData(passwordDetails), updatePasswordEvent=>{
                    let response;
    
                    if (updatePasswordEvent.target.readyState == 4 && updatePasswordEvent.target.status == 200)
                    {
                        response = JSON.parse(updatePasswordEvent.target.responseText);
    
                        if (response.type == "Error")
                        {
                            new MsgBox(thisPasswordEditor.app.main, response.content, "Close");
                        }
                        else if (response.type == "Debug")
                        {
                            new MsgBox(thisPasswordEditor.app.main, response.content, "Close");
                            console.log(response.content);
                        }
                        else if (response.type == "Success")
                        {
                            new MsgBox(thisPasswordEditor.app.main, response.content, "OK", ()=>{
                                thisPasswordEditor.app.navClick("signout");
                            });
                        }
                    }
                });
            }}, {text:"Cancel", buttonType:"button", tooltip:"Close dialog", clickCallback:function(clickEvent){
                this.uiEx.parentUIEx.parentDialogEx.close();
            }}
        ]);

        this.buttonGrpEx.controlExs[0].disable();

        // var btnGrp = this.formEx.addFormButtonGrp(2);
        // btnGrp.container.classList.add("password-editor-buttons");
        // this.dialogBox.appendChild(btnGrp.container);

        // btnGrp.inputExs[0].setLabelText("Save");
        // btnGrp.inputExs[0].setTooltipText("Save new password");
        // btnGrp.inputExs[0].disable()
        // btnGrp.inputExs[0].addEvent("click", );

        // btnGrp.inputExs[1].setLabelText("Cancel");
        // btnGrp.inputExs[1].setTooltipText("");
        // btnGrp.inputExs[1].addEvent("click", changePasswordEvent=>{
        //     this.close();
        // });

        if (requireChange)
        {
            // btnGrp.inputExs[1].setInline();
            // btnGrp.inputExs[1].hide();
            // this.closeBtn.classList.add("hidden");
        }
    }
}
