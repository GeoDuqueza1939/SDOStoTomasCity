"use strict";

// TEMP START !!!!!!!!!!!!!!!!!!!!!!!!!
class ajaxResponse
{
    constructor(type, content)
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

const NO_NS = "NO NAMESPACE";

/**
 * Create a simple element
 * @author Geovani P. Duqueza
 * @version 1.0
 * @param {String} xmlns Namespace URI
 * @param {String} elName Element name
 * @param {String} className Class attribute value
 * @param {Element} parent Parent element/node
 * @param {Element} nextNode Next sibling element/node
 * @throws {Error} "Element name cannot be empty."
 * @returns {Element}
 */
function createSimpleElement(xmlns, elName, className, parent)
{
    var el = null;
    if (elName == "" || elName == null || elName == undefined)
        throw("Element name cannot be empty.");
    else {
        el = (xmlns == "" || xmlns == NO_NS ? document.createElement(elName.toUpperCase()) : document.createElementNS(xmlns, elName));

        if (className != "" && className != null && className != undefined)
            el.setAttribute("class", className);
    
        if (parent != null && parent != undefined) {
            if (arguments.length == 5)
                parent.insertBefore(el, arguments[4]);
            else
                parent.appendChild(el);
        }
    }

    return el;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function testAjax()
{
    postData("/mpasis/php/process.php", "test", function(){
        var response;

        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
    
            if (response.type == "Info") {
                console.log(response.content);
            }
        }
    });
}

/**
 * Creates an element with attributes
 * @author Geovani P. Duqueza
 * @version 1.0
 * @param {String} xmlns Namespace URI
 * @param {String} elName Element name
 * @param {Element} parent Parent element/node
 * @param {Element} nextNode Next sibling element/node
 * @param {String} ..arguments 
 * @throws {Error} "Element name cannot be empty."
 * @returns {Element}
 */
function createElementEx(xmlns, elName, parent, nextNode)
{   // args: xmlns, elName, parent, nextNode, argNS1, argName1, argVal1, argNS2, argName2, argVal2, ...
    var el = null;
    if (elName == "" || elName == null || elName == undefined)
        throw("Element name cannot be empty.");
    else {
        el = (xmlns == "" || xmlns == NO_NS ? document.createElement(elName.toUpperCase()) : document.createElementNS(xmlns, elName));

        if (arguments.length > 4) {
            if (arguments[0] == NO_NS || arguments[4] == NO_NS) {
                for (var i = 4 + (arguments[4] == NO_NS ? 1 : 0), length = arguments.length - (arguments.length + (arguments[4] == NO_NS ? 1 : 0)) % 2; i < length; i++) {
                    el.setAttribute(arguments[i++], arguments[i]);
                }
            }
            else { // ignore last attribute if it has no paired value
                for (var i = 4, length = arguments.length - (arguments.length + 2) % 3; i < length; i++) {
                    if (arguments[i] != "" || arguments[i] != null || arguments[i] != undefined)
                        el.setAttributeNS(arguments[i], arguments[++i], arguments[++i]);
                    else
                        el.setAttribute(arguments[++i], arguments[++i]);
                }
            }
        }

        if (parent != null && parent != undefined) {
            if (nextNode == null || nextNode == undefined)
                parent.appendChild(el);
            else
                parent.insertBefore(el, nextNode);
        }
    }

    return el;
}

/**
 * Adds text to the specified container
 * @param {String} text The text to be added.
 * @param {Element} container The element that would contain the text.
 * @param {Node} nextSibling (optional) The element/node that should come after the text.
 * @throws {Error} "Incorrect number of arguments."
 * @throws {Error} "Container element cannot be null or undefined."
 */
function addText(text, container, nextSibling = null)
{
    var textNode = null;
    if (arguments.length < 2 || arguments.length > 3) {
        throw("Incorrect number of arguments.");
    }
    else if (container == null || container == undefined) {
        throw("Container element cannot be null or undefined.");
    }
    else {
        textNode = document.createTextNode(text);
        if (nextSibling == null || nextSibling == undefined)
            container.appendChild(textNode);
        else
            container.insertBefore(textNode, nextSibling);
    }

    return textNode;
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 *      source: https://stackoverflow.com/a/35385518
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList} 
 *      source: https://stackoverflow.com/a/35385518
 */
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

/**
 * @param {*} element 
 * @return {Boolean}
 *      source: https://stackoverflow.com/a/36894871
 */
function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

// export { NO_NS, createSimpleElement, createElementEx, addText, htmlToElement, htmlToElements, isElement }

// TEMP END   !!!!!!!!!!!!!!!!!!!!!!!!!

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

class InputEx
{
    constructor(parent)
    {
        // if (parent == null || parent == undefined)
        // {
        //     throw("parent should not be null or undefined");
        // }
        // else
        // {
            this.container = createElementEx(NO_NS, "span", parent, null, "class", "input-ex");
            this.textBox = createElementEx(NO_NS, "input", this.container, null, "type", "input");
            this.label = null;
            this.status = null;

            this.statusMode = 1; // 0: not displayed; 1: marker displayed with tooltip ; 2: full status message displayed
            this.statusTimeout = 5; // seconds
            this.textBox.inputEx = this;

            this.timeout = null;

            this.colon = null;
        // }

    }

    setId(id)
    {
        this.textBox.id = id.toString().trim();
        if (this.textBox.type != "radio")
        {
            this.textBox.name = id.toString().trim();
        }
    }

    getId()
    {
        return this.textBox.id;
    }

    setGroupName(name)
    {
        this.textBox.name = name.toString().trim();
    }

    getGroupName()
    {
        return this.textBox.name;
    }

    setTooltipText(text)
    {
        this.textBox.title = text;
        if (this.label != null && this.label != undefined)
        {
            this.label.title = text;
        }
    }

    getTooltipText()
    {
        return this.textBox.title;
    }

    setLabelText(text)
    {
        if ((text == null || text == undefined || text.trim() == ""))
        {
            if (this.label != null && this.label != undefined)
            {
                this.label.remove();
            }
        }
        else
        {
            if (this.label == null || this.label == undefined)
            {
                this.label = createElementEx(NO_NS, "label", this.container, this.textBox);
    
                if (this.getId() != null && this.getId() != undefined && this.getId().trim() != "")
                {
                    this.label.setAttribute("for", this.getId());
                }
    
                this.container.insertBefore(document.createTextNode(" "), this.textBox);
            }
    
            this.label.innerHTML = text;

            this.colon = createElementEx(NO_NS, "span", this.label);

            addText(":", this.colon);
        }
    }

    setChecked(on)
    {
        if (on)
        {
            this.textBox.setAttribute("checked", true);
        }
        else
        {
            this.textBox.removeAttribute("checked");
        }
    }

    getLabelText()
    {
        return (this.label == null || this.label == undefined ? "" : this.label.innerHTML);
    }

    setType(type)
    {
        this.textBox.type = type;
    }

    getType()
    {
        return this.textBox.type;
    }

    setValue(val)
    {
        this.textBox.value = val;
    }

    getValue(val)
    {
        return this.textBox.value.trim();
    }

    isChecked()
    {
        return this.textBox.checked;
    }

    uncheck()
    {
        this.textBox.checked = false;
    }

    setPlaceholderText(text)
    {
        this.textBox.placeholder = text;
    }

    getPlaceholderText()
    {
        return this.textBox.placeholder;
    }

    setWidth(val)
    {
        this.textBox.style.width = val;
    }

    getWidth()
    {
        return this.textBox.style.width;
    }

    setLabelWidth(val)
    {
        this.label.style.width = val;
    }

    getLabelWidth()
    {
        return this.label.style.width;
    }

    setVertical(setting)
    {
        this.container.classList.toggle("vertical", setting);
    }

    getVertical()
    {
        return this.container.classList.contains("vertical");
    }

    setReversed(setting)
    {
        this.container.classList.toggle("reversed", setting);
    }

    getReversed()
    {
        return this.container.classList.contains("reversed");
    }

    addStatusPane()
    {
        if (this.status == null || this.status == undefined)
        {
            // this.container.appendChild(document.createTextNode(" "));
            this.status = createElementEx(NO_NS, "span", this.container, null, "status-pane");
        }
    }

    removeStatusPane()
    {
        if (this.status != null && this.status != undefined)
        {
            this.status.remove();
        }
    }

    setStatusMode(setting)
    {
        if (setting == 0 || setting == 1 || setting == 2)
        {
            this.statusMode = setting;
        }
    }

    getStatusMode()
    {
        return this.statusMode;
    }

    setStatusMessage(msg)
    {
        if (msg != null && msg != undefined && (" " + msg).trim() != "")
        {
            if (this.status == null || this.status == undefined)
            {
                this.addStatusPane();
            }
            else
            {
                this.resetStatus();
            }
        
            this.status.innerHTML = "<span class=\"status-marker\" title=\"" + msg + "\">*</span> <span class=\"status-message\">" + msg + "</span>";

            clearTimeout(this.timeout);

            this.timeout = null;
        }
    }

    raiseError(errMsg) // red
    {
        this.setStatusMessage(errMsg);

        this.status.classList.add("error");

        this.timeout = setTimeout(()=>{
            this.resetStatus();
        }, this.statusTimeout * 1000);
    }

    showSuccess(successMsg) // green
    {
        this.setStatusMessage(successMsg);

        this.status.classList.add("success");

        this.timeout = setTimeout(()=>{
            this.resetStatus();
        }, this.statusTimeout * 1000);
    }

    showInfo(infoMsg) // blue
    {
        this.setStatusMessage(infoMsg);

        this.status.classList.add("info");

        this.timeout = setTimeout(()=>{
            this.resetStatus();
        }, this.statusTimeout * 1000);
    }

    resetStatus()
    {
        if (this.status != null && this.status != undefined)
        {
            this.status.innerHTML = "";
            this.status.classList.remove("success", "error", "info");
        }
    }

    getStatus()
    {
        if (this.status == null || this.status == undefined)
        {
            if (this.status.classList.contains("success"))
            {
                return "success";
            }
            else if (this.status.classList.contains("info"))
            {
                return "info";
            }
            else if (this.status.classList.contains("error"))
            {
                return "error";
            }
        }
        else
        {
            return "no status";
        }
    }

    getStatusMsg()
    {
        if (this.status == null || this.status == undefined)
        {
            return "No Status";
        }
        else
        {
            return this.status.innerHTML;
        }
    }

    setStatusMsgTimeout(timeout) // TO IMPLEMENT!!!!!!!!!!!!!!!!!!!!!!!!
    {}

    getStatusMsgTimeout() // TO IMPLEMENT!!!!!!!!!!!!!!!!!!!!!!!!
    {}

    addEvent(eventType, func)
    {
        this.textBox.addEventListener(eventType, func);
    }

    addEventToLabel(event, func)
    {
        this.label.addEventListener(eventType, func);
    }

    addEventToStatus(event, func)
    {
        this.status.addEventListener(eventType, func);
    }

    setMin(num)
    {
        if (this.textBox.type == "number")
        {
            this.textBox.min = num;
        }
    }

    setMax(num)
    {
        if (this.textBox.type == "number")
        {
            this.textBox.max = num;
        }
    }

    hideColon()
    {
        if (this.colon != null && this.colon != undefined)
        {
            this.colon.classList.add("hidden");
        }
    }

    showColon()
    {
        if (this.colon != null && this.colon != undefined)
        {
            this.colon.classList.remove("hidden");
        }
    }
}

class DialogEx
{
    constructor(container)
    {
        this.nodes = {};
        this.textNodes = [];
        this.br = [];
        this.btn = [];
        this.btnGrp = {}; // nodeKey of container as key, value is array of buttons contained;

        this.scrim = createElementEx(NO_NS, "div", container, null, "class", "dialog-ex-scrim");
        this.dialogBox = createElementEx(NO_NS, "div", this.scrim, null, "class", "dialog-ex");
        this.closeBtn = createElementEx(NO_NS, "button", this.dialogBox, null, "type", "button", "class", "dialog-ex-closeBtn");
        this.closeBtn.innerHTML = "<span class=\"material-icons-round\">close</span>";
        this.closeBtn.addEventListener("click", (event)=>{
            this.close();
        });
    }

    /**
     * Adds an element or node to the dialogEx
     * @param {String} nodekey The key that will represent the element or node to insert.
     * @param {Node} node The element or node to add.
     * @param {String} parentNodeKey (optional) The key that represents the parent that will contain the element or node to be added. Use a blank string to refer to the root element of the dialogEx.
     * @param {String} nextSiblingNodeKey (optional) The key that represents the sibling that will come next to the element or node to be added. Use a blank string to refer to none.
     * @throws {Error} "`node` cannot be null or undefined."
     * @throws {Error} "`parentNodeKey` not found."
     * @throws {Error} "`nextSiblingNodeKey` not found."
     * @throws {Error} "`nodeKey` already exists."
     */
    addNode(nodeKey, node, parentNodeKey = "", nextSiblingNodeKey = "")
    {
        var parent = null;
        var nextSibling = null;

        if (node == null || node == undefined)
        {
            throw("`node` cannot be null or undefined.");
        }
        else
        {
            if (parentNodeKey == "")
            {
                parent = this.dialogBox;
            }
            else
            {
                if (parentNodeKey in this.nodes)
                {
                    parent = this.nodes[parentNodeKey];
                }
                else
                {
                    throw("`" + parentNodeKey + "` not found.");
                }
            }

            if (nextSiblingNodeKey != "")
            {
                if (nextSiblingNodeKey in this.nodes)
                {
                    nextSibling = this.nodes[nextSiblingNodeKey];
                }
                else
                {
                    throw("`" + nextSiblingNodeKey + "` not found.");
                }
            }

            if (nodeKey in this.nodes)
            {
                throw("`" + nodeKey + "` already exists.");
            }

            this.nodes[nodeKey] = node;

            if (nextSibling == null)
            {
                parent.appendChild(node);
            }
            else
            {
                parent.insertBefore(node, nextSibling);
            }
        }
    }

    getNode(nodeKey)
    {
        return (nodeKey in this.nodes ? this.nodes[nodeKey] : null);
    }

    removeNode(nodeKey)
    {
        if (nodeKey in this.nodes)
        {
            this.nodes[nodeKey].remove();

            delete this.nodes[nodeKey];
        }
    }

    addLineBreak(parentNodeKey)
    {
        var nodeKey = "br" + this.br.length;

        this.br.push(createElementEx(NO_NS, "br"));

        this.addNode(nodeKey, this.br[this.br.length - 1], parentNodeKey);

        return nodeKey;
    }

    addTextBoxEx(nodeKey = "", type = "", id = "", labelText = "", parentNodeKey = "", nextSiblingNodeKey = "")
    {
        var textBox = null;

        if (nodeKey == "" || type == "" || id == "" || labelText == "")
        {
            throw("`nodeKey`, `type`, `id`, and `labelText` cannot be empty strings.")
        }
        else
        {
            textBox = new InputEx(null);
            this.addNode(nodeKey, textBox.container, parentNodeKey, nextSiblingNodeKey);
            textBox.setType(type);
            textBox.setId(id);
            textBox.setLabelText(labelText);
        }

        return textBox;
    }

    addButtonGrp(numOfBtns, nodeKey = "", parentNodeKey = "", nextSiblingNodeKey = "")
    {
        if (numOfBtns == null || numOfBtns == undefined)
        {
            throw("`numOfBtns` should be an integer.");
        }

        try
        {
            nodeKey = nodeKey.trim();
        }
        catch (ex)
        {
            console.log(ex);
            return;
        }

        if (nodeKey == "")
        {
            nodeKey = "btnGrp" + this.btnGrp.length;
        }

        var btnGrpNodeKey = nodeKey;

        this.addNode(nodeKey, createElementEx(NO_NS, "div", null, null, "class", "dialog-ex-button-group"), parentNodeKey, nextSiblingNodeKey);

        this.btnGrp[btnGrpNodeKey] = [];

        for (var i = 0; i < numOfBtns; i++)
        {
            if (i > 0)
            {
                this.addTextNode("", " ", btnGrpNodeKey);
            }
            nodeKey = "btn" + this.btn.length;
            this.addNode(nodeKey, createElementEx(NO_NS, "button", null, null, "type", "button"), btnGrpNodeKey);
            this.btn.push(this.nodes[nodeKey]);
            this.btnGrp[btnGrpNodeKey].push(this.nodes[nodeKey]);
        }

        return btnGrpNodeKey;
    }

    getBtnGrp(nodeKey)
    {
        return this.btnGrp[nodeKey];
    }

    addTextNode(nodeKey = "", text = " ", parentNodeKey = "", nextSiblingNodeKey = "")
    {
        if (nodeKey == "")
        {
            nodeKey = "text" + this.textNodes.length;
        }

        this.textNodes.push(document.createTextNode(text));

        return this.addNode(nodeKey, this.textNodes[this.textNodes.length - 1], parentNodeKey, nextSiblingNodeKey);
    }

    addStatusPane()
    {}

    close()
    {
        this.scrim.remove();
    }
}

class MPASIS_App
{
    constructor(container)
    {
        // change nav links into click event listeners
        var navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        var main = Array.from(container.querySelectorAll("main"))[0];
        this.mainSections = {};
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");

        Array.from(navbar.querySelectorAll('li')).forEach((value, index, array)=>{
            var mainSectionId = "main-" + value.id;
            Array.from(value.children).forEach((link)=>{
                if (link.tagName == "A")
                {
                    link.removeAttribute("href");

                    if (!(mainSectionId in this.mainSections))
                    {
                        this.mainSections[mainSectionId] = createElementEx(NO_NS, "section", main, null, "id", mainSectionId);
                    }

                    switch(value.id)
                    {
                        case 'sdo-home':
                            link.addEventListener("click", ()=>{
                                setCookie("current_view", "", -1);
                                window.location = "/";
                            });
                            break;
                        case 'dashboard':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Dashboard</h2>";
                                }
                            });
                            break;
                        case 'applicant':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }
    
                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Applicant Data</h2>";
                                }
                            });
                            break;
                        case 'applicant-data-entry':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Applicant Data Entry</h2>";
                                }
                            });
                            break;
                        case 'applicant-data-search':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Applicant Search</h2>";
                                }
                            });
                            break;
                        case 'job':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {                                
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Job Openings</h2>";
                                }
                            });
                            break;
                        case 'job-data-entry':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Job Data Entry</h2>";

                                    var entryForm = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "job-data-entry-form");

                                    var positionTitle = new InputEx(entryForm);
                                    positionTitle.setType("text");
                                    positionTitle.setId("position-title");
                                    positionTitle.setLabelText("Position Title");

                                    createElementEx(NO_NS, "br", entryForm);

                                    var parentheticalTitle = new InputEx(entryForm);
                                    parentheticalTitle.setType("text");
                                    parentheticalTitle.setId("parenthetical-title");
                                    parentheticalTitle.setLabelText("Parenthetical Position Title");
                                    parentheticalTitle.setPlaceholderText("(optional)");                                    
                                    parentheticalTitle.setTooltipText("Enter in cases of parenthetical position titles, \ne.g., in \"Administrative Assistant (Secretary)\", \n\"Secretary\" is a parenthetical title.");

                                    createElementEx(NO_NS, "br", entryForm);

                                    createElementEx(NO_NS, "label", entryForm, null, "for", "plantilla-item-nos").innerHTML = "Plantilla Item Nos. (<i>enter in separate lines</i>):";
                                    createElementEx(NO_NS, "br", entryForm);
                                    var plantillaItemNos = createElementEx(NO_NS, "textarea", entryForm, null, "id", "plantilla-item-nos", "name", "plantilla-item-nos", "rows", 10, "style", "display: block; width: 100%;");

                                    createElementEx(NO_NS, "br", entryForm);

                                    var salaryGrade = new InputEx(entryForm);
                                    salaryGrade.setType("number");
                                    salaryGrade.setId("salary-grade");
                                    salaryGrade.setLabelText("Salary Grade");
                                    salaryGrade.setMin(0);
                                    salaryGrade.setMax(33);
                                    salaryGrade.setValue(1);
                                    salaryGrade.setWidth("3em");
                                    salaryGrade.addStatusPane();
                                    salaryGrade.setStatusMsgTimeout(10);
                                    salaryGrade.addEvent("change", (event)=>{
                                        postData("/mpasis/php/process.php", "a=getSalaryFromSG&sg=" + event.target.inputEx.getValue(), function(){
                                            var response;
                                            var salaryGrade = document.getElementById("salary-grade").inputEx;

                                            if (this.readyState == 4 && this.status == 200) {
                                                response = JSON.parse(this.responseText);
                                                
                                                if (response.type == "Error") {
                                                    salaryGrade.raiseError(response.content);
                                                }
                                                else if (response.type == "Salary") {
                                                    if (response.content == null)
                                                    {
                                                        salaryGrade.resetStatus();
                                                    }
                                                    else
                                                    {
                                                        salaryGrade.showInfo("<i>Monthly Salary: \u20b1" + parseFloat(response.content).toFixed(2) + "</i>");
                                                    }
                                                }
                                            }
                                        });
                                    });

                                    createElementEx(NO_NS, "br", entryForm);
                                    createElementEx(NO_NS, "br", entryForm);

                                    var catFieldSet = createElementEx(NO_NS, "fieldset", entryForm, null, "id", "category");
                                    addText("Please select the position category:", createElementEx(NO_NS, "legend", catFieldSet));

                                    addText("Fetching categories...", createElementEx(NO_NS, "div", catFieldSet, null, "class", "categories-container"));

                                    var cat = [];

                                    postData("/mpasis/php/process.php", "a=fetch&f=positionCategory", (event)=>{
                                        var response;

                                        if (event.target.readyState == 4 && event.target.status == 200)
                                        {
                                            response = JSON.parse(event.target.responseText);

                                            if (response.type == "Error")
                                            {
                                                alert("AJAX Error:" + response.content);
                                            }
                                            else if (response.type == "Data")
                                            {
                                                container = document.getElementsByClassName("categories-container")[0];

                                                container.innerHTML = "";

                                                var categories = JSON.parse(response.content);

                                                categories.forEach((category, index)=>{
                                                    cat.push(new InputEx(container));
                                                    cat[cat.length - 1].setType("radio");
                                                    cat[cat.length - 1].setId("cat" + index);
                                                    cat[cat.length - 1].setGroupName("cat");
                                                    cat[cat.length - 1].setLabelText(category["category"]);
                                                    cat[cat.length - 1].setValue(category["id"]);
                                                    cat[cat.length - 1].hideColon();
                                                    cat[cat.length - 1].setReversed();
                                                });
            
                                                cat[0].setChecked(true);
                                            }
                                        }
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    addText("Qualification Standards", createElementEx(NO_NS, "h3", entryForm));

                                    addText("Education", createElementEx(NO_NS, "h4", entryForm));

                                    var educFieldSet = createElementEx(NO_NS, "fieldset", entryForm, null, "id", "educational-attainment");
                                    addText("Please select the minimum required educational attainment:", createElementEx(NO_NS, "legend", educFieldSet));

                                    addText("Fetching education levels...", createElementEx(NO_NS, "div", educFieldSet, null, "class", "educ-container"));

                                    var educ = [];

                                    postData("/mpasis/php/process.php", "a=fetch&f=educLevel", (event)=>{
                                        var response;

                                        if (event.target.readyState == 4 && event.target.status == 200)
                                        {
                                            response = JSON.parse(event.target.responseText);

                                            if (response.type == "Error")
                                            {
                                                console.log("AJAX Error:" + response.content);
                                            }
                                            else if (response.type == "Data")
                                            {
                                                container = document.getElementsByClassName("educ-container")[0];

                                                container.innerHTML = "";

                                                var educLevels = JSON.parse(response.content);

                                                educLevels.forEach((educLevel, index, txtArr)=>{
                                                    educ.push(new InputEx(container));
                                                    educ[educ.length - 1].setType("radio");
                                                    educ[educ.length - 1].setId("educ" + index);
                                                    educ[educ.length - 1].setGroupName("educ");
                                                    educ[educ.length - 1].setLabelText(educLevel["educational_attainment"]);
                                                    educ[educ.length - 1].setValue(educLevel["index"]);
                                                    educ[educ.length - 1].hideColon();
                                                    educ[educ.length - 1].setReversed();
                                                });
            
                                                educ[0].setChecked(true);
                                            }
                                        }
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    var requiresSpecEduc = new InputEx(entryForm);
                                    requiresSpecEduc.setType("checkbox");
                                    requiresSpecEduc.setId("req-spec-educ");
                                    requiresSpecEduc.setLabelText("Position requires specific education");
                                    requiresSpecEduc.hideColon();
                                    requiresSpecEduc.setReversed();
                                    requiresSpecEduc.addEvent("change", (event)=>{
                                        specEducContainer.classList.toggle("hidden", !event.target.checked);
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    var specEducContainer = createElementEx(NO_NS, "div", entryForm, null, "class", "hidden");
                                    createElementEx(NO_NS, "label", specEducContainer, null, "for", "spec-educ").innerHTML = "Please enter a description of the required education. This will guide evaluators in qualifying some applicants:";
                                    createElementEx(NO_NS, "br", specEducContainer);
                                    var specEduc = createElementEx(NO_NS, "textarea", specEducContainer, null, "id", "spec-educ", "name", "spec-educ", "rows", 3, "style", "display: block; width: 100%;");

                                    createElementEx(NO_NS, "br", entryForm);

                                    addText("Training", createElementEx(NO_NS, "h4", entryForm));

                                    var trainingHours = new InputEx(entryForm);
                                    trainingHours.setType("number");
                                    trainingHours.setId("training-hours");
                                    trainingHours.setLabelText("Total hours of relevant training");
                                    trainingHours.setMin(0);
                                    trainingHours.setMax(999);
                                    trainingHours.setValue(0);

                                    createElementEx(NO_NS, "br", entryForm);
                                    createElementEx(NO_NS, "br", entryForm);

                                    var requiresSpecTraining = new InputEx(entryForm);
                                    requiresSpecTraining.setType("checkbox");
                                    requiresSpecTraining.setId("req-spec-training");
                                    requiresSpecTraining.setLabelText("Position requires specific training");
                                    requiresSpecTraining.hideColon();
                                    requiresSpecTraining.setReversed();
                                    requiresSpecTraining.addEvent("change", (event)=>{
                                        specTrainingContainer.classList.toggle("hidden", !event.target.checked);
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    var specTrainingContainer = createElementEx(NO_NS, "div", entryForm, null, "class", "hidden");
                                    createElementEx(NO_NS, "label", specTrainingContainer, null, "for", "spec-training").innerHTML = "Please enter a description of the required training. This will guide evaluators in qualifying some applicants:";
                                    createElementEx(NO_NS, "br", specTrainingContainer);
                                    var specTraining = createElementEx(NO_NS, "textarea", specTrainingContainer, null, "id", "spec-training", "name", "spec-training", "rows", 3, "style", "display: block; width: 100%;");

                                    createElementEx(NO_NS, "br", entryForm);

                                    addText("Work Experience", createElementEx(NO_NS, "h4", entryForm));

                                    var expYears = new InputEx(entryForm);
                                    expYears.setType("number");
                                    expYears.setId("exp-years");
                                    expYears.setLabelText("Total years of relevant training");
                                    expYears.setMin(0);
                                    expYears.setMax(99);
                                    expYears.setValue(0);

                                    createElementEx(NO_NS, "br", entryForm);
                                    createElementEx(NO_NS, "br", entryForm);

                                    var requiresSpecExp = new InputEx(entryForm);
                                    requiresSpecExp.setType("checkbox");
                                    requiresSpecExp.setId("req-spec-exp");
                                    requiresSpecExp.setLabelText("Position requires specific work experience");
                                    requiresSpecExp.hideColon();
                                    requiresSpecExp.setReversed();
                                    requiresSpecExp.addEvent("change", (event)=>{
                                        specExpContainer.classList.toggle("hidden", !event.target.checked);
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    var specExpContainer = createElementEx(NO_NS, "div", entryForm, null, "class", "hidden");
                                    createElementEx(NO_NS, "label", specExpContainer, null, "for", "spec-exp").innerHTML = "Please enter a description of the required work experience. This will guide evaluators in qualifying some applicants:";
                                    createElementEx(NO_NS, "br", specExpContainer);
                                    var specExp = createElementEx(NO_NS, "textarea", specExpContainer, null, "id", "spec-exp", "name", "spec-exp", "rows", 3, "style", "display: block; width: 100%;");

                                    createElementEx(NO_NS, "br", entryForm);

                                    addText("Career Service Eligibilities", createElementEx(NO_NS, "h4", entryForm));

                                    var elig = [];
                                    
                                    [createElementEx(NO_NS, "fieldset", entryForm, null, "id", "eligibilities")].forEach((fieldSet, index, arr)=>{
                                        addText("Please select all the eligibilities required for this position:", createElementEx(NO_NS, "legend", fieldSet));

                                        addText("Fetching eligibilities...", createElementEx(NO_NS, "div", fieldSet, null, "class", "eligibility-container"));

                                        var fetchEligFunc = function(){
                                            var response;

                                            var fieldSet = document.getElementById("eligibilities");
                                            var container = fieldSet.querySelector(".eligibility-container");

                                            if (this.readyState == 4 && this.status == 200) {
                                                response = JSON.parse(this.responseText);
                                                
                                                if (response.type == "Error") {
                                                    container.innerHTML = response.content;
                                                }
                                                else if (response.type == "Data") {
                                                    container.innerHTML = "";

                                                    if (JSON.parse(response.content).length == 0)
                                                    {
                                                        container.innerHTML = "No eligibilities fetched. Please add at least one.";
                                                    }

                                                    elig = [];

                                                    JSON.parse(response.content).forEach((eligibility, index, arr)=>{
                                                        elig.push(new InputEx(container));
                                                        elig[elig.length - 1].setType("checkbox");
                                                        elig[elig.length - 1].setId("eligibility" + eligibility['id']);
                                                        elig[elig.length - 1].setLabelText(eligibility['name']);
                                                        elig[elig.length - 1].setTooltipText(eligibility['description']);
                                                        elig[elig.length - 1].setValue(eligibility['id']);
                                                        elig[elig.length - 1].hideColon();
                                                        elig[elig.length - 1].setReversed();
                                                    });

                                                    [createElementEx(NO_NS, "button", container, null, "type", "button")].forEach((button, index, arr)=>{
                                                        addText("+Add Missing Eligibility", button);
                                                        button.addEventListener("click", (event)=>{
                                                            var dialog = new DialogEx(fieldSet);
                                                            var eligText, descText;
                
                                                            eligText = dialog.addTextBoxEx("eligText", "text", "new-eligibility", "Eligibility to be Added");
                                                            eligText.setLabelWidth("auto");
                
                                                            dialog.addLineBreak();
                
                                                            descText = dialog.addTextBoxEx("descText", "text", "description", "Description (optional)");
                                                            descText.setLabelWidth("auto");
                
                                                            dialog.addButtonGrp(2, "control-buttons");
                
                                                            dialog.getBtnGrp("control-buttons").forEach((btn, i)=>{
                                                                btn.innerHTML = (i == 0 ? "Save" : "Cancel");
                                                                
                                                                btn.addEventListener("click", (i == 0 ? (event)=>{
                                                                    var eligibility = eligText.getValue();
                                                                    var description = descText.getValue();
                
                                                                    postData("/mpasis/php/process.php", "a=add&eligibilities=" + JSON.stringify([{"name":eligibility,"description":description}]), (event)=>{
                                                                        var response;
                                                                        
                                                                        if (event.target.readyState == 4 && event.target.status == 200) {
                                                                            response = JSON.parse(event.target.responseText);
                                                                            
                                                                            if (response.type == "Error") {
                                                                                console.log("AJAX Error: " + response.content);
                                                                            }
                                                                            else if (response.type == "Success") {
                                                                                console.log("Info: " + response.content);
                                                                                dialog.close();
                
                                                                                postData("/mpasis/php/process.php", "a=fetch&f=eligibilities", fetchEligFunc);
                                                                            }
                                                                        }
                                                                    });
                
                                                                } : (event)=>{
                                                                    dialog.close();
                                                                }));
                                                            });
                                                            
                                                        });
                                                    });
                                                }
                                            }
                                        };

                                        postData("/mpasis/php/process.php", "a=fetch&f=eligibilities", fetchEligFunc);
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    addText("Competency", createElementEx(NO_NS, "h4", entryForm));

                                    var requiresCompetency = new InputEx(entryForm);
                                    requiresCompetency.setType("checkbox");
                                    requiresCompetency.setId("req-competency");
                                    requiresCompetency.setLabelText("Position requires specific competency/competencies");
                                    requiresCompetency.hideColon();
                                    requiresCompetency.setReversed();
                                    requiresCompetency.addEvent("change", (event)=>{
                                        competencyContainer.classList.toggle("hidden", !event.target.checked);
                                    });

                                    createElementEx(NO_NS, "br", entryForm);

                                    var competencyContainer = createElementEx(NO_NS, "div", entryForm, null, "class", "hidden");
                                    createElementEx(NO_NS, "label", competencyContainer, null, "for", "competency").innerHTML = "Please enter a description of the required competencies, if applicable. This will guide evaluators in qualifying some applicants:";
                                    createElementEx(NO_NS, "br", competencyContainer);
                                    var competency = createElementEx(NO_NS, "textarea", competencyContainer, null, "id", "competency", "name", "competency", "rows", 3, "style", "display: block; width: 100%;");

                                    var submitBtn, clearBtn;

                                    [createElementEx(NO_NS, "div", entryForm, null, "class", "right")].forEach((btnContainer)=>{
                                        submitBtn = createElementEx(NO_NS, "button", btnContainer, null, "type", "button");
                                        submitBtn.innerHTML = "Submit";
                                        submitBtn.addEventListener("click", (event)=>{
                                            var plantillaItems = plantillaItemNos.value.replace("\r","").split("\n");
                                            plantillaItems = plantillaItems.map((value)=>{
                                                return value.trim();
                                            });

                                            plantillaItems = (plantillaItemNos.value.trim() == "" ? [] : plantillaItems);

                                            var positions = [];

                                            plantillaItems.forEach((plantillaItem)=>{
                                                var position = {};
                                                position["required_eligibility"] = [];
                                                
                                                position["plantilla_item_number"] = plantillaItem;
                                                position["position_title"] = positionTitle.getValue();
                                                position["parenthetical_title"] = parentheticalTitle.getValue();
                                                position["salary_grade"] = salaryGrade.getValue();
                                                for (var i = 0; i < cat.length; i++)
                                                {
                                                    if (cat[i].isChecked())
                                                    {
                                                        position["category"] = cat[i].getValue();
                                                        break;
                                                    }
                                                }                                                
                                                for (var i = 0; i < educ.length; i++)
                                                {
                                                    if (educ[i].isChecked())
                                                    {
                                                        position["required_educational_attainment"] = educ[i].getValue();
                                                        break;
                                                    }
                                                }
                                                if (requiresSpecEduc.isChecked())
                                                {
                                                    position["specific_education_required"] = specEduc.value.trim();
                                                }
                                                position["required_training_hours"] = trainingHours.getValue();
                                                if (requiresSpecTraining.isChecked())
                                                {
                                                    position["specific_training_required"] = specTraining.value.trim();
                                                }
                                                position["required_training_hours"] = expYears.getValue();
                                                if (requiresSpecExp.isChecked())
                                                {
                                                    position["specific_work_experience_required"] = specExp.value.trim();
                                                }
                                                for (var i = 0; i < elig.length; i++)
                                                {
                                                    if (elig[i].isChecked())
                                                    {
                                                        position["required_eligibility"].push(elig[i].getValue());
                                                    }
                                                }
                                                if (requiresCompetency.isChecked())
                                                {
                                                    position["competency"] = competency.value.trim();
                                                }

                                                positions.push(position);
                                            });
                                            
                                            postData("/mpasis/php/process.php", "a=add&positions=" + JSON.stringify(positions), function(){
                                                var response;

                                                if (this.readyState == 4 && this.status == 200) {
                                                    response = JSON.parse(this.responseText);
                                                    
                                                    if (response.type == "Error") {
                                                        alert(response.content);
                                                    }
                                                    else if (response.type == "Success") {
                                                        alert(response.content);
                                                    }
                                                }                                                                            
                                            });
                                        });
                                        btnContainer.appendChild(document.createTextNode(" "));
                                        clearBtn = createElementEx(NO_NS, "button", btnContainer, null, "type", "button");
                                        clearBtn.innerHTML = "Clear";
                                        clearBtn.addEventListener("click", (event)=>{
                                            plantillaItemNos.value = "";
                                            positionTitle.setValue("");
                                            parentheticalTitle.setValue("");
                                            salaryGrade.setValue("");
                                            educ[0].setChecked(true);
                                            requiresSpecEduc.uncheck();
                                            specEduc.value = "";
                                            trainingHours.setValue(0);
                                            requiresSpecTraining.uncheck();
                                            specTraining.value = "";
                                            expYears.setValue(0);
                                            requiresSpecExp.uncheck();
                                            specExp.value = "";
                                            elig.forEach((checkbox)=>{
                                                checkbox.setChecked(false);
                                            });
                                            requiresCompetency.uncheck();
                                            competency.value = "";
                                        });
                                    });
                                }
                            });
                            break;
                        case 'job-data-search':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Job Search</h2>";
                                }
                            });
                            break;
                        case 'evaluation':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {    
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Evaluation</h2>";
                                }
                            });
                            break;
                        case 'scores':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }
                                
                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Scores and Rankings</h2>";
                                }
                            });
                            break;
                        case 'tools':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Assessment Tools</h2>";
                                }
                            });
                            break;
                        case 'account':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Account</h2>";
                                }
                            });
                            break;
                        case 'my-account':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }
                                
                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>My Account</h2>Change my username<br>Change my password<br>";

                                    
                                }
                            });
                            break;
                        case 'other-account':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    var el = null;
                                    var searchBox = null;
                                    var searchBtn = null;
                                    var addBtn = null;
                                    var errMsg = null;
                                    var resultsBox = null;

                                    this.mainSections[mainSectionId].innerHTML = "<h2>Other Account</h2>";

                                    el = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "user-management-controls center", "title");
                                    searchBox = createElementEx(NO_NS, "input", el, null, "type", "text", "name", "search-user", "id", "search-user", "value", "", "placeholder", "Enter the username to search.", "Enter a username or use * to return all users.");
                                    addText(" ", el);
                                    (el = createElementEx(NO_NS, "button", el, null, "type", "button")).addEventListener("click", (event)=>{
                                        // console.log("[a=fetch&f=user&k=" + (searchBox.value.trim() == "" ? "all" : searchBox.value.trim()) + "]");
                                        postData("/mpasis/php/process.php", "a=fetch&f=user&k=" + (searchBox.value.trim() == "" ? "all" : searchBox.value.trim()), function(){
                                            var response;

                                            if (this.readyState == 4 && this.status == 200) {
                                                response = JSON.parse(this.responseText);
                                                
                                                if (response.type == "Error") {
                                                    errMsg.innerHTML = response.content;
                                                }
                                                else if (response.type == "Data") {
                                                    resultsBox.innerHTML = JSON.parse(response.content)[0]["username"] + "<br>";
                                                }
                                                // else
                                                // {
                                                //     resultsBox.innerHTML = response.content;
                                                // }
                                            }
                                        });
                                    });
                                    addText("Search Accounts", el);

                                    addText(" ", el.parentElement);

                                    (el = createElementEx(NO_NS, "button", el.parentElement, null, "type", "button")).addEventListener("click", (event)=>{
                                        var dialog = {};
                                        dialog['dialogScrim'] = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "dialog-scrim");
                                        dialog['dialogBox'] = createElementEx(NO_NS, "div", dialog['dialogScrim'], null, "class", "dialog");
                                        dialog['closeBtn'] = createElementEx(NO_NS, "button", dialog['dialogBox'], null, "type", "button", "class", "dialog-closeBtn");
                                        dialog['closeBtn'].innerHTML = "<span class=\"material-icons-round\">close</span>";
                                        dialog['closeBtn'].addEventListener("click", function(event){
                                            dialog['dialogScrim'].remove();
                                        });
                                        addText(" ", dialog['dialogBox']);
                                        addText("Given Name:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "given-name"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['givenName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "given-name", "id", "given-name", "title", "Enter the applicant's given name.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Middle Name:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "middle-name"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['middleName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "middle-name", "id", "middle-name", "title", "Enter the applicant's middle name. For married women, please enter the maiden middle name. Leave blank for none.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Family Name:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "family-name"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['familyName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "family-name", "id", "family-name", "title", "Enter the applicant's family name. For married women, please enter the maiden last name.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Spouse's Name:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "spouse-name"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['spouseName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "spouse-name", "id", "spouse-name", "title", "For married women, please enter the spouse's last name. Leave blank for none.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Ext. Name:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "ext-name"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['extName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "ext-name", "id", "ext-name", "title", "Enter the applicant's extension name. Leave blank for none.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);

                                        addText(" ", dialog['dialogBox']);
                                        addText("Username:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "username"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['userName'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "text", "name", "username", "id", "username", "title", "Please enter a usernme. Make sure to use only letters, digits, periods, and underscores.");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Password:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "password"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['password'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "password", "name", "password", "id", "password", "title", "Please enter a temporary password. Suggested: 1234", "value", "1234");
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);
                                        addText(" ", dialog['dialogBox']);
                                        addText("Access Level:", createElementEx(NO_NS, "label", dialog['dialogBox'], null, "for", "access-level"));
                                        addText(" ", dialog['dialogBox']);
                                        dialog['accessLevel'] = createElementEx(NO_NS, "input", dialog['dialogBox'], null, "type", "number", "min", 0, "max", 4, "name", "access-level", "id", "access-level", "title", "Please enter this user's access level. Default: 1", "value", 1);
                                        createElementEx(NO_NS, "br", dialog['dialogBox']);

                                        el = createElementEx(NO_NS, "div", dialog['dialogBox'], null, "class", "dialog-btn-grp")

                                        dialog['submitBtn'] = createElementEx(NO_NS, "button", el, null, "type", "button", "class", "dialog-submitBtn");
                                        dialog['submitBtn'].innerHTML = "Submit";
                                        dialog['submitBtn'].addEventListener("click", function(event){
                                            var givenName = dialog['givenName'].value.trim();
                                            var middleName = dialog['middleName'].value.trim();
                                            var familyName = dialog['familyName'].value.trim();
                                            var spouseName = dialog['spouseName'].value.trim();
                                            var extName = dialog['extName'].value.trim();
                                            var userName = dialog['userName'].value.trim();
                                            var password = dialog['password'].value.trim();
                                            var accessLevel = dialog['accessLevel'].value.trim();
                                            var personFieldStr = "";
                                            var personValueStr = "";

                                            var person = {};
                                            var tempUser = {};
                                            
                                            if (givenName != "")
                                            {
                                                person["given_name"] = givenName;
                                            }
                                            else
                                            {
                                                dialog["errMsg"].innerHTML = "Given Name should not be blank.";
                                                return;
                                            }

                                            if (middleName != "")
                                            {
                                                person["middle_name"] = middleName;
                                            }

                                            if (familyName != "")
                                            {
                                                person["family_name"] = familyName;
                                            }

                                            if (spouseName != "")
                                            {
                                                person["spouse_name"] = spouseName;
                                            }

                                            if (extName != "")
                                            {
                                                person["ext_name"] = extName;
                                            }

                                            if (userName != "")
                                            {
                                                tempUser["username"] = userName;
                                            }
                                            else
                                            {
                                                dialog["errMsg"].innerHTML = "Username should not be blank.";
                                                return;
                                            }
                                            
                                            if (password != "")
                                            {
                                                tempUser["password"] = password;
                                            }
                                            else
                                            {
                                                dialog["errMsg"].innerHTML = "Password should not be blank.";
                                                return;
                                            }

                                            tempUser["mpasis_access_level"] = (accessLevel == "" ? 0 : accessLevel);

                                            postData("/mpasis/php/process.php", "a=addTempUser&person=" + JSON.stringify(person) + "&tempUser=" + JSON.stringify(tempUser), function(){
                                                var response;
                                                var errMsg = document.getElementsByClassName("dialog")[0].querySelector(".error-message");

                                                if (this.readyState == 4 && this.status == 200) {
                                                    response = JSON.parse(this.responseText);
                                                    
                                                    if (response.type == "Error") {
                                                        errMsg.innerHTML = response.content;
                                                    }
                                                    else if (response.type == "Success") {
                                                        errMsg.innerHTML = response.content;
                                                    }
                                                }                                                                            
                                            });
                                        });

                                        addText(" ", el);

                                        dialog['cancelBtn'] = createElementEx(NO_NS, "button", el, null, "type", "button", "class", "dialog-cancelBtn");
                                        dialog['cancelBtn'].innerHTML = "Cancel";
                                        dialog['cancelBtn'].addEventListener("click", function(event){
                                            dialog['closeBtn'].click();
                                        });

                                        addText(" ", dialog['dialogBox']);

                                        dialog['errMsg'] = createElementEx(NO_NS, "div", dialog['dialogBox'], null, "class", "error-message");
                                    });
                                    addText("Add New Account", el);

                                    addText(" ", this.mainSections[mainSectionId]);

                                    errMsg = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "error-message");

                                    addText(" ", this.mainSections[mainSectionId]);

                                    resultsBox = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "query-results-users");
                                }
                            });
                            break;
                        case 'signout':
                            link.addEventListener("click", ()=>{
                                postData(window.location.href, "a=logout", (result)=>{
                                    setCookie("current_view", "", -1);
                                    window.location.reload(true);
                                });
                            });
                            break;
                        case 'settings':
                            link.addEventListener("click", ()=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                {
                                    this.mainSections[mainSectionId].innerHTML = "<h2>Settings</h2>";
                                }
                            });
                            break;
                    }
                }
            });
        });

        if (getCookie("current_view") == "")
        {
            setCookie("current_view", "dashboard", 1);
        }

        // console.log(getCookie("current_view"));

        document.getElementById(getCookie("current_view")).querySelectorAll("a")[0].click();
    }
}

var app = new MPASIS_App(document.getElementById("mpasis"));
