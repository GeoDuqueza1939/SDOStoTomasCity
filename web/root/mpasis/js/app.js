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

class OldInputEx
{
    constructor(parent)
    {
        // if (parent == null || parent == undefined)
        // {
        //     throw("parent should not be null or undefined");
        // }
        // else
        // {
            this.container = createElementEx(NO_NS, "span", parent, null, "class", "old-input-ex");
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

    setFullWidth(setting)
    {
        this.container.classList.toggle("full-width", setting);
    }

    isFullWidth()
    {
        return this.container.classList.contains("full-width");
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

class OldDialogEx
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
            textBox = new OldInputEx(null);
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

/**
 * Class InputEx
 * @requires NO_NS
 * @requires createElementEx
 * @requires createSimpleElement
 * @requires addText
 * @requires isElement
 */
class InputEx
{
    constructor(parentEl = null, idStr = "", typeStr = "text", useFieldSet = false)
    {
        var invalidArgsStr = "";
        var nextSibling = null;

        invalidArgsStr += (parentEl == null || isElement(parentEl) ? "" : "parentEl:" + parentEl);
        invalidArgsStr += (typeof(idStr) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "idStr:" + idStr);
        invalidArgsStr += (typeof(typeStr) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "typeStr:" + typeStr);
        invalidArgsStr += (typeof(useFieldSet) == "boolean" ? "" : (invalidArgsStr == "" ? "" : "; ") + "useFieldSet:" + useFieldSet);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        this.container = createElementEx(NO_NS, "span", parentEl, null, "class", "input-ex");
        this.container.style.userSelect = "none"; // MAY BE TRANSFERRED TO CSS INSTEAD
        this.setFullWidth(false);
        this.useFieldSet = useFieldSet; // will contain the input element with its label or other InputEx elements
        this.fieldWrapper = createElementEx(NO_NS, (useFieldSet ? "fieldset" : "span"), this.container, null, "class", "input-ex-fields-wrapper", "style", "display: block;");
        this.inputExs = []; // references to multiple InputEx chhildren (for multiple input types)
        this.fields = []; // groups of input element; index 0 will point to single input types
        this.labels = []; // label elements for input elements; legend element for fieldset
        this.colon = null;
        this.datalist = null;
        this.listeners = {
            field: {},
            label: {},
            status: {}
        };
        this.statusPane = null; // a status pane for displaying success, error, or info messages.
        this.id = idStr.trim(); // use to set the id; will also set the name of a single field or a serve as a name prefix for field groups; SHOULDN'T BE CHANGED
        this.name = this.id;
        
        this.values = [];
        this.statusMode = 1; // 0: not displayed; 1: marker displayed with tooltip ; 2: full status message displayed
        this.statusTimer = null; // will store the timeout for auto-resetting status
        this.statusTimeout = 5; // seconds; < 0 will disable the creation of statusTimer
        this.isMultipleInput = false;
        this.reversed = false;
        this.disabled = false;
        this.isFilling = false;
        this.runAfterFilling = null; // function to run after filling items from server; should be assigned before running fillItemsFromServer
        this.spacer = ""; // a reference a single space textnode that shall come before this InputEx object
        
        this.type = typeStr;
        switch(typeStr)
        {
            case "radio-multiple": // group of radio buttons
            case "checkbox-multiple": // group of check boxes
            case "buttons": // a group of button inputs
            case "buttonExs": // a group of button elements
                this.isMultipleInput = true;
                break;
            case "buttonEx": // button element
                this.fields.push(createElementEx(NO_NS, "button", this.fieldWrapper, null, "id", idStr, "name", idStr, "type", "button"));
                this.fields[0].inputEx = this;
                break;
            case "textarea":
                this.fields.push(createElementEx(NO_NS, "textarea", this.fieldWrapper, null, "id", idStr, "name", idStr, "style", "display: block; width: 100%;"));
                this.setFullWidth();
                this.fields[0].style.fontSize = "inherit";
                this.fields[0].inputEx = this;
                break;
            case "combo": // input with a datalist
                nextSibling = this.datalist = createElementEx(NO_NS, "datalist", this.fieldWrapper, null, "id", idStr + "-datalist", "name", idStr + "-datalist");
                typeStr = "text";
            default:
                this.fields.push(createElementEx(NO_NS, "input", this.fieldWrapper, nextSibling, "id", idStr, "name", idStr, "type", typeStr));
                if (this.datalist != null)
                {
                    this.fields[0].setAttribute("list", idStr + "-datalist");
                }
                if (this.type != "button")
                {
                    this.fields[0].style.fontSize = "inherit";
                }
                this.fields[0].inputEx = this;
                break;
        }
    }

    setValue(...values) // ALWAYS USE STRING VALUES IN CHECKBOX MULTIPLE
    {
        // validate at least the first value
        if (typeof(values[0]) != "string" && typeof(values[0]) != "number")
        {
            throw("Invalid argument type: values:" + values.toString());
        }

        if (typeof(values[0]) == "string")
        {
            values[0] = values[0].trim();
        }

        switch (this.type)
        {
            case "radio-multiple":
                for (const inputEx of this.inputExs) {
                    if (inputEx.getValue() == values[0])
                    {
                        inputEx.check();
                    }
                }
                break;
            case "checkbox-multiple":
                for (const inputEx of this.inputExs) {
                    if (values.includes(inputEx.getValue()))
                    {
                        inputEx.check();
                    }
                }
                break;
            case "buttons":
            case "buttonExs":
                break;
            case "combo":
            case "buttonEx": // value attribute is still set but is not displayed
            case "button":
            case "submit":
            case "reset":
            default:
                this.fields[0].value = values[0];
                break;
        }
    }

    getValue()
    {
        switch (this.type)
        {
            case "radio-multiple":
                for (const inputEx of this.inputExs) {
                    if (inputEx.isChecked())
                    {
                        return inputEx.getValue();
                    }
                }
                break;
            case "checkbox-multiple":
                var values = [];
                for (const inputEx of this.inputExs) {
                    console.log(inputEx + "\n" + inputEx.isChecked() + inputEx.fields[0].checked);
                    if (inputEx.isChecked())
                    {
                        values.push(inputEx.getValue());
                    }
                }
                return values;
                break;
            case "buttons":
            case "buttonExs":
                break;
            case "combo":
            case "buttonEx":
            case "button":
            case "submit":
            case "reset":
            default:
                return this.fields[0].value.trim();
                break;
        }

        return "";
    }

    check(doCheck = true) // single input only
    {
        if (!this.isMultipleInput && (this.type == "radio" || this.type == "checkbox"))
        {
            // this.fields[0].toggleAttribute("checked", doCheck); // hard-coded HTML check attributes confuse the browser
            this.fields[0].checked = doCheck;
        }
    }

    uncheck() // single input only
    {
        this.check(false);
    }

    isChecked() // single input only
    {
        return (!this.isMultipleInput && (this.type == "radio" || this.type == "checkbox") && (this.fields[0].checked)) //|| this.fields[0].hasAttribute("checked"))); // hard-coded HTML check attributes confuse the browser
    }

    setLabelText(labelText) // legend for fieldset of non-single input
    {
        if (typeof(labelText) != "string")
        {
            throw("Invalid argument type: labelText:" + labelText);
        }

        labelText = labelText.trim();

        if (this.type == "button" || this.type == "submit" || this.type == "reset")
        {
            this.setValue(labelText);
        }
        else if (this.type == "buttonEx")
        {
            this.fields[0].innerHTML = labelText;
        }
        else if (!this.type.startsWith("button"))
        {
            if (this.labels.length == 0)
            {
                if (this.useFieldSet && this.isMultipleInput)
                {
                    this.labels.push(createElementEx(NO_NS, "legend", this.fieldWrapper));
                }
                else
                {
                    this.labels.push(createElementEx(NO_NS, "label", this.fieldWrapper, this.fields[0], "for", this.id));
                }
            }
            this.fieldWrapper.insertBefore(document.createTextNode(" "), this.fields[0]);
            this.labels[0].innerHTML = labelText;
            this.labels[0].appendChild(this.colon = htmlToElement("<span class=\"colon hidden\">:</span>"));
            // this.labels[0].style.userSelect = "none"; // MAY BE TRANSFERRED TO CSS INSTEAD
        }
    }

    getLabelText() // legend for fieldset of non-single input
    {
        if (this.type == "button" || this.type == "submit" || this.type == "reset")
        {
            return this.getValue();
        }
        else if (this.type == "buttonEx")
        {
            return this.fields[0].innerHTML;
        }
        else if (this.labels.length == 1 && !this.type.startsWith("button"))
        {
            return this.labels[0].innerHTML;
        }

        return "";
    }

    setPlaceholderText(placeholderText) // single input only
    {
        if (typeof(placeholderText) != "string")
        {
            throw("Invalid argument type: placeholderText:" + placeholderText);
        }

        placeholderText = placeholderText.trim();

        if (!this.isMultipleInput && !this.type.startsWith("button") && this.type != "reset" && this.type != "submit")
        {
            this.fields[0].placeholder = placeholderText;
        }
    }

    getPlaceholderText() // single input only
    {
        if (!this.isMultipleInput && !this.type.startsWith("button") && this.type != "reset" && this.type != "submit")
        {
            return this.fields[0].placeholder;
        }
        else
        {
            return "";
        }
    }

    require(setting = true)
    {
        if (!this.isMultipleInput)
        {
            this.fields[0].required = setting;
        }
    }

    isRequired()
    {
        return this.fields[0].required;
    }

    getId()
    {
        return this.id;
    }

    setTooltipText(tooltipText)
    {
        if (typeof(tooltipText) != "string" && typeof(tooltipText) != "number")
        {
            throw("Invalid argument type: tooltipText:" + tooltipText);
        }

        if (typeof(tooltipText) == "string")
        {
            tooltipText = tooltipText.trim();
        }

        if (!this.isMultipleInput)
        {
            if (tooltipText == "")
            {
                if (this.fields[0].hasAttribute("title"))
                {
                    this.fields[0].removeAttribute("title");
                }
            }
            else
            {
                this.fields[0].title = tooltipText;
            }
        }
        
        if (this.labels.length > 0)
        {
            if (tooltipText == "")
            {
                if (this.labels[0].hasAttribute("title"))
                {
                    this.labels[0].removeAttribute("title");
                }
            }
            else
            {
                this.labels[0].title = tooltipText;
            }
        }
    }

    getToolTipText() // single-input element types only
    {
        if (!this.isMultipleInput)
        {
            return this.fields[0].title;
        }
        else if (this.labels.length > 0)
        {
            return this.labels[0].title;
        }

        return "";
    }

    setParent(parentEl, nextSibling = null)
    {
        var invalidArgsStr = "";

        invalidArgsStr += (isElement(parentEl) ? "" : "parentEl:" + parentEl);
        invalidArgsStr += (nextSibling == null || isElement(nextSibling) ? "" : (invalidArgsStr == "" ? "" : "; ") + "nextSibling:" + nextSibling);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        if (nextSibling == null)
        {
            parentEl.insertBefore(this.container, nextSibling);
        }
        else
        {
            parentEl.appendChild(this.container);
        }
    }

    getParent()
    {
        return this.container.parentElement;
    }

    enable(index = null, doEnable = true) // null index means all inputs should be enabled
    {
        var invalidArgsStr = "";

        invalidArgsStr += (index == null || (typeof(index) == "number" && (index == 0 || Number.isInteger(this)) && index >= 0 && index < this.fields.length) ? "" : "index:" + index);
        invalidArgsStr += (typeof(doEnable) == "boolean" ? "" : (invalidArgsStr == "" ? "" : ", ") + "doEnable:" + doEnable);

        if (invalidArgsStr != "")
        {
            throw("Invalid argument type: " + invalidArgsStr);
        }

        if (this.isMultipleInput && index == null)
        {
            this.inputExs.forEach((inputEx)=>{
                inputEx.enable();
            });

            index = 0;
        }
        else
        {
            if (index == null)
            {
                index = 0;
            }
    
            this.fields[index].toggleAttribute("disabled", !doEnable);
        }

        if (this.labels.length > index)
        {
            this.labels[index].toggleAttribute("disabled", !doEnable);
        }

        this.disabled = !doEnable;
    }
    
    disable(index = null)
    {
        this.enable(index, false);
    }

    isDisabled()
    {
        return this.disabled;
    }

    setGroupName(nameStr)
    {
        if (typeof(nameStr) != "string")
        {
            throw("Invalid argument type: nameStr:" + nameStr);
        }

        this.name = nameStr.trim();

        if (this.isMultipleInput)
        {
            this.inputExs.forEach((inputEx)=>{
                inputEx.setGroupName(this.name);
            });
        }
        else
        {
            this.fields[0].name = this.name;
            if (this.labels.length > 0)
            {
                this.labels[0].for = this.name;
            }
        }
    }

    getGroupName()
    {
        return this.name;
    }

    addItem(labelText, value = "", tooltipText = "") // only for combo (will add to datalist), radio-multiple, and multiple-single-select
    {
        var invalidArgsStr = "";

        invalidArgsStr += (typeof(labelText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "labelText:" + labelText);
        invalidArgsStr += (typeof(value) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "value:" + value);
        invalidArgsStr += (typeof(tooltipText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "tooltipText:" + tooltipText);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        labelText = labelText.trim();
        tooltipText = tooltipText.trim();

        switch (this.type)
        {
            case "radio-multiple":
                if (this.inputExs.length > 0)
                {
                    this.fieldWrapper.appendChild(document.createTextNode(" "));
                }
                this.inputExs.push(new InputEx(this.fieldWrapper, this.id + this.inputExs.length, "radio"));
                this.fields.push(this.inputExs[this.inputExs.length - 1].fields[0]);
                this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
                this.inputExs[this.inputExs.length - 1].setValue(value);
                this.labels.push(this.inputExs[this.inputExs.length - 1].labels[0]);
                // this.inputExs[this.inputExs.length - 1].setFullWidth();
                if (tooltipText != "")
                {
                    this.inputExs[this.inputExs.length - 1].setTooltipText(tooltipText);
                }
                this.inputExs[this.inputExs.length - 1].setGroupName(this.id);

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                break;
            case "checkbox-multiple":
                if (this.inputExs.length > 0)
                {
                    this.fieldWrapper.appendChild(document.createTextNode(" "));
                }
                this.inputExs.push(new InputEx(this.fieldWrapper, this.id + this.inputExs.length, "checkbox"));
                this.fields.push(this.inputExs[this.inputExs.length - 1].fields[0]);
                this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
                this.inputExs[this.inputExs.length - 1].setValue(value);
                this.labels.push(this.inputExs[this.inputExs.length - 1].labels[0]);
                // this.inputExs[this.inputExs.length - 1].setFullWidth();
                if (tooltipText != "")
                {
                    this.inputExs[this.inputExs.length - 1].setTooltipText(tooltipText);
                }

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                break;
            case "combo":
                [createElementEx(NO_NS, "option", this.datalist, null, "value", labelText, "data-value", value)].forEach(option=>{
                    if (tooltipText != "")
                    {
                        option.title = tooltipText; // HAS NO EFFECT!!!
                    }
                });
                break;
            case "buttons":
                if (this.inputExs.length > 0)
                {
                    this.fieldWrapper.appendChild(document.createTextNode(" "));
                }
                this.inputExs.push(new InputEx(this.fieldWrapper, this.id + this.inputExs.length, "button"));
                this.fields.push(this.inputExs[this.inputExs.length - 1].fields[0]);
                this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
                if (tooltipText != "")
                {
                    this.inputExs[this.inputExs.length - 1].setTooltipText(tooltipText);
                }

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                break;
            case "buttonExs":
                if (this.inputExs.length > 0)
                {
                    this.fieldWrapper.appendChild(document.createTextNode(" "));
                }
                this.inputExs.push(new InputEx(this.fieldWrapper, this.id + this.inputExs.length, "buttonEx"));
                this.fields.push(this.inputExs[this.inputExs.length - 1].fields[0]);
                this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
                if (tooltipText != "")
                {
                    this.inputExs[this.inputExs.length - 1].setTooltipText(tooltipText);
                }

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                break;
        }
    }

    addItems(...labelStrs) // only for combo (will add to datalist), radio-multiple, and multiple-single-select; no tooltip
    {
        labelStrs.forEach(labelText=>{
            this.addItem(labelText);
        });
    }

    fillItemsFromServer(url, postQueryString, labelColName = "", valueColName = "", tooltipColName = "")
    {
        postData(url, postQueryString, (event)=>{
            var response;
            var data = null;

            if (event.target.readyState == 4 && event.target.status == 200)
            {
                response = JSON.parse(event.target.responseText);

                if (response.type == "Error")
                {
                    this.raiseError("AJAX Error: " + response.content);
                }
                else if (response.type == "Data")
                {
                    data = JSON.parse(response.content);

                    data.forEach(dataRow=>{
                        var label = dataRow[labelColName].toString();
                        var value = (dataRow[valueColName] ?? "").toString();
                        var tooltip = (dataRow[tooltipColName] ?? "").toString();
                        this.addItem(label, value, tooltip);
                        if (this.isReversed())
                        {
                            this.inputExs[this.inputExs.length - 1].reverse();
                        }
                    });

                    if (this.runAfterFilling != null)
                    {
                        this.runAfterFilling();
                    }
                }
            }
        });
    }

    setWidth(width = "none")
    {
        if (typeof(width) != "string")
        {
            throw("Invalid argument type: width:" + width);
        }

        width = width.trim();

        if (this.isMultipleInput)
        {
            this.inputExs.forEach(inputEx=>{
                inputEx.setWidth(width);
            });
        }
        else if (width == "none")
        {
            this.fields[0].style.width = null;
        }
        else
        {
            this.fields[0].style.width = width;
        }
    }

    getWidth()
    {
        return this.fields[0].style.width;
    }

    setFullWidth(setting = true)
    {
        if (typeof(setting) != "boolean")
        {
            throw("Invalid argument type: setting:" + setting);
        }

        var flex = (this.container.style.display.match(/flex/) > 0);

        this.container.style.display = (setting ? (flex ? "flex" : "block") : "inline-" + (flex ? "flex" : "block"));
    }

    isFullWidth()
    {
        // return this.container.classList.contains("full-width");
        return (this.container.style.display == "block" || this.container.style.display == "flex");
    }

    setLabelWidth(width = "none")
    {
        if (typeof(width) != "string")
        {
            throw("Invalid argument type: width:" + width);
        }

        width = width.trim();

        if (this.isMultipleInput)
        {
            this.inputExs.forEach(inputEx=>{
                inputEx.setLabelWidth(width);
            });
        }
        else if (this.labels.length > 0)
        {
            if (width == "none")
            {
                this.labels[0].style.display = null;
                this.labels[0].style.width = null;
            }
            else
            {
                this.labels[0].style.display = "inline-block";
                this.labels[0].style.width = width;
            }
        }
    }

    getLabelWidth()
    {
        return (this.labels.length > 0 ? this.labels[0].style.width : "");
    }

    setVertical(setting = true)
    {
        // this.container.classList.toggle("vertical", setting);
        if (setting)
        {
            this.fieldWrapper.style.display = "flex";
            this.fieldWrapper.style.flexDirection = "column";
        }
        else
        {
            this.fieldWrapper.style.display = null;
            this.fieldWrapper.style.flexDirection = null;
        }
    }

    isVertical()
    {
        // return this.container.classList.contains("vertical");
        return (this.fieldWrapper.style.display == "flex" && this.fieldWrapper.style.flexDirection == "column")
    }

    reverse() // change actual order of label and field; toggle setting
    {
        console.log()
        if (this.isMultipleInput || this.type.startsWith("button") || this.labels.length <= 0)
        {
            this.inputExs.forEach((inputEx)=>{
                inputEx.reverse();
            });
        }
        else
        {
            if (this.reversed)
            {
                this.fieldWrapper.insertBefore(this.labels[0], this.fields[0]);
                this.fieldWrapper.appendChild(this.fields[0]);
            }
            else
            {
                this.fieldWrapper.insertBefore(this.fields[0], this.labels[0]);
                this.fieldWrapper.appendChild(this.labels[0]);
            }

        }

        this.reversed = !this.reversed;
    }

    isReversed() // single-input element types only
    {
        return this.reversed;
    }

    addStatusPane()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            this.statusPane = createSimpleElement(NO_NS, "span", "status-pane", this.fieldWrapper);
            this.statusPane["spacer"] = document.createTextNode(" ");
            this.fieldWrapper.insertBefore(this.statusPane["spacer"], this.statusPane);
            this.statusPane.style.fontSize = "0.8em";
            this.statusPane.style.fontStyle = "italic";
            this.statusPane.style.fontFamily = "serif";
        }
    }

    removeStatusPane()
    {
        if (isElement(this.statusPane))
        {
            this.statusPane.remove();
            this.statusPane = null;
        }
    }

    setStatusMode(setting = 1)
    {
        if (Number.isInteger(setting) && (setting == 0 || setting == 1 || setting == 2))
        {
            this.statusMode = setting;
        }
        else
        {
            throw("Invalid argument: setting:" + setting);
        }
    }

    getStatusMode()
    {
        return this.statusMode;
    }

    setStatusMessage(msg, status = "info")
    {
        if (typeof(msg) == "string" && msg.trim() != "")
        {
            if (this.statusPane == null || this.statusPane == undefined)
            {
                this.addStatusPane();
            }
            else
            {
                this.resetStatus();
            }
        
            this.statusPane.innerHTML = "<span class=\"status-marker\" title=\"" + msg + "\">*</span> <span class=\"status-message\">" + msg + "</span>";

            // clear any existing timers
            clearTimeout(this.statusTimer);
            this.statusTimer = null;

            this.statusPane.classList.add(status);

            this.statusPane.style.color = (status == "error" ? "red" : (status == "success" ? "green" : "blue"));

            if (this.statusTimeout >= 0)
            {
                this.statusTimer = setTimeout(()=>{
                    this.resetStatus();
                }, this.statusTimeout * 1000);
            }

        }
        else
        {
            throw("Invalid argument: msg:" + msg);
        }
    }

    raiseError(errMsg) // red
    {
        this.setStatusMessage(errMsg, "error");
    }

    showSuccess(successMsg) // green
    {
        this.setStatusMessage(successMsg, "success");
    }

    showInfo(infoMsg) // blue
    {
        this.setStatusMessage(infoMsg, "info");
    }

    resetStatus()
    {
        if (this.statusPane != null && this.statusPane != undefined)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.classList.remove("success", "error", "info");
            this.statusPane.style.color = null;
        }
    }
    
    getStatus()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            if (this.statusPane.classList.contains("success"))
            {
                return "success";
            }
            else if (this.statusPane.classList.contains("info"))
            {
                return "info";
            }
            else if (this.statusPane.classList.contains("error"))
            {
                return "error";
            }
        }
        else
        {
            return "no status";
        }
    }

    getStatusMessage()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            return "No Status";
        }
        else
        {
            return this.statusPane.innerHTML;
        }
    }

    setStatusMsgTimeout(seconds)
    {
        if (typeof(seconds) == "number")
        {
            this.statusTimeout = seconds;
        }
    }

    getStatusMsgTimeout()
    {
        return this.statusTimeout;
    }

    addEvent(eventType, func) // single input only
    {
        if (!this.isMultipleInput)
        {
            this.listeners.field[eventType] = func;
            this.fields[0].addEventListener(eventType, this.listeners.field[eventType]);
        }
    }

    addLabelEvent(eventType, func)
    {
        if (!this.isMultipleInput)
        {
            this.listeners.label[eventType] = func;
            this.labels[0].addEventListener(eventType, this.listeners.label[eventType]);
        }
    }

    addStatusEvent(eventType, func)
    {
        if (!this.isMultipleInput)
        {
            this.listeners.status[eventType] = func;
            this.statusPane.addEventListener(eventType, this.listeners.status[eventType]);
        }
    }

    removeEvent(eventType, func)
    {
        if (eventType in this.listeners.field)
        {
            this.fields[0].removeEventListener(eventType, this.listeners.field[eventType]);
        }
    }

    removeLabelEvent(eventType, func)
    {
        if (eventType in this.listeners.label)
        {
            this.labels[0].removeEventListener(eventType, this.listeners.label[eventType]);
        }
    }

    removeStatusEvent(eventType, func)
    {
        if (eventType in this.listeners.status)
        {
            this.statusPane.removeEventListener(eventType, this.listeners.status[eventType]);
        }
    }

    setMin(num = 0)
    {
        if (this.type == "number" || this.type == "range" || this.type == "date" || this.type == "datetime-local" || this.type == "month" || this.type == "time" || this.type == "week")
        {
            this.fields[0].min = num;
        }
    }

    setMax(num = 9)
    {
        if (this.type == "number" || this.type == "range" || this.type == "date" || this.type == "datetime-local" || this.type == "month" || this.type == "time" || this.type == "week")
        {
            this.fields[0].max = num;
        }
    }

    showColon() // single-input only
    {
        if (this.colon != null)
        {
            this.colon.style.display = "initial";
            this.colon.style.visibility = "visible";
        }
    }

    hideColon() // single-input only
    {
        if (this.colon != null)
        {
            this.colon.style.display = "none";
            this.colon.style.visibility = "hidden";
        }
    }

    showColons() // for items only
    {
        this.inputExs.forEach((inputEx)=>{
            inputEx.showColon();
        });
    }

    hideColons() // for items only
    {
        this.inputExs.forEach((inputEx)=>{
            inputEx.hideColon();
        });
    }

    destroy()
    {
        this.container.remove();
    }
}

/**
 * Class FormEx
 * @requires NO_NS
 * @requires createElementEx
 * @requires createSimpleElement
 * @requires addText
 * @requires isElement
 * @requires InputEx
 */
class FormEx
{
    constructor(parentEl = null, id = "", useFormElement = true)
    {
        var invalidArgsStr = "";

        invalidArgsStr += (parentEl == null || isElement(parentEl) ? "" : (invalidArgsStr == "" ? "" : "; ") + "parentEl:" + parentEl);
        invalidArgsStr += (typeof(id) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "id:" + id);
        invalidArgsStr += (typeof(useFormElement) == "boolean" ? "" : (invalidArgsStr == "" ? "" : "; ") + "useFormElement:" + useFormElement);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        id = id.trim();

        this.container = createElementEx(NO_NS, "div", parentEl, null, "class", "form-ex", "style", "display: inline-block;");
        this.container.style.userSelect = "none"; // MAY BE TRANSFERRED TO CSS INSTEAD
        this.useFormElement = useFormElement; // will contain the input element with its label or other InputEx elements
        this.fieldWrapper = createElementEx(NO_NS, (useFormElement ? "form" : "div"), this.container, null, "class", "form-ex-fields-wrapper", "style", "display: block;");
        this.headers = [];
        this.inputExs = [];
        this.dbInputEx = {};
        this.dbTableName = {};
        this.divs = {};
        this.statusPane = null; // a status pane for displaying success, error, or info messages.
        this.func = {
            submit: null,
            afterSubmit: null,
            reset: null,
        };
        this.id = id.trim();
        this.statusMode = 1; // 0: not displayed; 1: marker displayed with tooltip ; 2: full status message displayed
        this.statusTimer = null; // will store the timeout for auto-resetting status
        this.statusTimeout = 5; // seconds; < 0 will disable the creation of statusTimer
    }

    setTitle(titleText = "", headingLevel = 1) // blank titleText removes the form title header
    {
        this.addHeader(titleText, headingLevel, "", true);
    }
    
    getTitle()
    {
        if (this.headers.length > 0 && this.headers[0] != null)
        {
            return this.headers[0].innerHTML;
        }

        return "";
    }

    addHeader(headerText = "", headingLevel = 2, id = "", isTitle = false)
    {
        var invalidArgsStr = "";

        invalidArgsStr += (typeof(headerText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "headerText:" + headerText);
        invalidArgsStr += (typeof(headingLevel) == "number" && Number.isInteger(headingLevel) && headingLevel > 0 && headingLevel <= 6 ? "" : (invalidArgsStr == "" ? "" : "; ") + "headingLevel:" + headingLevel);
        invalidArgsStr += (typeof(id) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "id:" + id);
        invalidArgsStr += (typeof(isTitle) == "boolean" ? "" : (invalidArgsStr == "" ? "" : "; ") + "isTitle:" + isTitle);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        headerText = headerText.trim();
        id = id.trim();

        if (isTitle)
        {
            if (headerText == "")
            {
                if (this.headers.length > 0)
                {
                    this.headers[0].remove();
                    this.headers[0] = null;
                }
            }
            else
            {
                if (this.headers.length == 0)
                {
                    this.headers.push(createElementEx(NO_NS, "h" + headingLevel, this.container, this.fieldWrapper));
                }
    
                this.headers[0].innerHTML = headerText;

                return this.headers[0];
            }
        }
        else if (headerText != "")
        {
            if (this.headers.length == 0)
            {
                this.headers.push(null); // reserve space for the title
            }

            this.headers.push(createElementEx(NO_NS, "h" + headingLevel, this.fieldWrapper));

            this.headers[this.headers.length - 1].innerHTML = headerText;

            if (id != "")
            {
                this.headers[this.headers.length - 1].id = id;
            }

            return this.headers[this.headers.length - 1];
        }
    }

    addInputEx(labelText = "", type = "text", value = "", tooltip = "", dbColName = "", dbTableName = "", useFieldSet = false) // should return a reference to the InputEx object created
    {
        var invalidArgsStr = "";

        invalidArgsStr += (typeof(labelText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "labelText:" + labelText);
        invalidArgsStr += (typeof(type) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "type:" + type);
        invalidArgsStr += (typeof(value) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "value:" + value);
        invalidArgsStr += (typeof(tooltip) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "tooltip:" + tooltip);
        invalidArgsStr += (typeof(dbColName) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "dbColName:" + dbColName);
        invalidArgsStr += (typeof(dbTableName) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "dbTableName:" + dbTableName);
        invalidArgsStr += (typeof(useFieldSet) == "boolean" ? "" : (invalidArgsStr == "" ? "" : "; ") + "useFieldSet:" + useFieldSet);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        labelText = labelText.trim();
        type = type.trim();
        value = value.trim();
        tooltip = tooltip.trim();
        dbColName = dbColName.trim();
        dbTableName = dbTableName.trim();

        this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), type, useFieldSet));
        
        if (labelText != "")
        {
            this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
        }

        if (tooltip != "")
        {
            this.inputExs[this.inputExs.length - 1].setTooltipText(tooltip);
        }

        if (dbColName != "")
        {
            this.dbInputEx[dbColName] = this.inputExs[this.inputExs.length - 1];
        }

        if (dbTableName != "")
        {
            this.dbTableName[dbColName] = dbTableName;
        }

        if (value != "")
        {
            this.inputExs[this.inputExs.length - 1].setValue(value);
        }

        // this.inputExs[this.inputExs.length - 1].spacer = document.createTextNode(" ");
        // this.fieldWrapper.insertBefore(this.inputExs[this.inputExs.length - 1].spacer, this.inputEx[this.inputEx.length - 1].container);
        return this.inputExs[this.inputExs.length - 1];
    }

    addFormButtonGrp(numOfBtns, useFieldSet = false) // inputEx buttons for submitting data, resetting the form, or any other custom function
    {
        if (!Number.isInteger(numOfBtns))
        {
            throw("Invalid arguments: numOfBtns:" + numOfBtns);
        }

        this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), "buttonExs", useFieldSet));

        for (var i = 0; i < numOfBtns; i++)
        {
            if (i > 0)
            {
                this.addSpacer(this.inputExs[this.inputExs.length - 1].fieldWrapper);
            }
            this.inputExs[this.inputExs.length - 1].addItem("Button " + i, "button" + i, "Button " + i);
        }

        return this.inputExs[this.inputExs.length - 1];
    }

    addDiv(name = "", parent = this.fieldWrapper)
    {
        if (typeof(name) == "string" && name.trim() != "")
        {
            if (isElement(parent))
            {
                this.divs[name] = createElementEx(NO_NS, "div", parent, null);
                return this.divs[name];
            }
            else
            {
                throw("Invalid argument: parent:" + parent.toString());
            }
        }
        else
        {
            throw("Invalid argument: name:" + name);
        }
    }

    addStatusPane() // to be placed at the end of the form, after the button group
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            this.statusPane = createSimpleElement(NO_NS, "div", "status-pane", this.fieldWrapper);
            this.statusPane.style.fontSize = "0.8em";
            this.statusPane.style.fontStyle = "italic";
            this.statusPane.style.fontFamily = "serif";
        }
    }

    removeStatusPane()
    {
        if (isElement(this.statusPane))
        {
            this.statusPane.remove();
            this.statusPane = null;
        }
    }

    setStatusMode(setting = 1)
    {
        if (Number.isInteger(setting) && (setting == 0 || setting == 1 || setting == 2))
        {
            this.statusMode = setting;
        }
        else
        {
            throw("Invalid argument: setting:" + setting);
        }
    }

    getStatusMode()
    {
        return this.statusMode;
    }

    setStatusMessage(msg, status = "info")
    {
        if (typeof(msg) == "string" && msg.trim() != "")
        {
            if (this.statusPane == null || this.statusPane == undefined)
            {
                this.addStatusPane();
            }
            else
            {
                this.resetStatus();
            }
        
            this.statusPane.innerHTML = "<span class=\"status-marker\" title=\"" + msg + "\">*</span> <span class=\"status-message\">" + msg + "</span>";

            // clear any existing timers
            clearTimeout(this.statusTimer);
            this.statusTimer = null;

            this.statusPane.classList.add(status);

            this.statusPane.style.color = (status == "error" ? "red" : (status == "success" ? "green" : "blue"));

            if (this.statusTimeout >= 0)
            {
                this.statusTimer = setTimeout(()=>{
                    this.resetStatus();
                }, this.statusTimeout * 1000);
            }

        }
        else
        {
            throw("Invalid argument: msg:" + msg);
        }
    }

    raiseError(errMsg) // red
    {
        this.setStatusMessage(errMsg, "error");
    }

    showSuccess(successMsg) // green
    {
        this.setStatusMessage(successMsg, "success");
    }

    showInfo(infoMsg) // blue
    {
        this.setStatusMessage(infoMsg, "info");
    }

    resetStatus()
    {
        if (this.statusPane != null && this.statusPane != undefined)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.classList.remove("success", "error", "info");
            this.statusPane.style.color = null;
        }
    }
    
    getStatus()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            if (this.statusPane.classList.contains("success"))
            {
                return "success";
            }
            else if (this.statusPane.classList.contains("info"))
            {
                return "info";
            }
            else if (this.statusPane.classList.contains("error"))
            {
                return "error";
            }
        }
        else
        {
            return "no status";
        }
    }

    getStatusMessage()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            return "No Status";
        }
        else
        {
            return this.statusPane.innerHTML;
        }
    }

    setStatusMsgTimeout(seconds)
    {
        if (typeof(seconds) == "number")
        {
            this.statusTimeout = seconds;
        }
    }

    getStatusMsgTimeout()
    {
        return this.statusTimeout;
    }

    addSpacer(parent = this.fieldWrapper)
    {
        var spacer = document.createTextNode(" ");
        
        parent.appendChild(spacer);

        return spacer;
    }

    addLineBreak(parent = this.fieldWrapper)
    {
        return createElementEx(NO_NS, "br", parent);
    }

    setFullWidth(setting = true)
    {
        if (typeof(setting) != "boolean")
        {
            throw("Invalid argument type: setting:" + setting);
        }

        var flex = (this.container.style.display.match(/flex/) > 0);

        this.container.style.display = (setting ? (flex ? "flex" : "block") : "inline-" + (flex ? "flex" : "block"));
    }

    isFullWidth()
    {
        // return this.container.classList.contains("full-width");
        return (this.container.style.display == "block" || this.container.style.display == "flex");
    }

    submitForm(url, query) // always post method
    {}

    resetForm()
    {}
}

class DialogEx
{
    constructor(parent = null, id = "")
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "dialog-ex-scrim");
        this.dialogBox = createElementEx(NO_NS, "div", this.scrim, null, "class", "dialog-ex");
        this.closeBtn = createElementEx(NO_NS, "button", this.dialogBox, null, "type", "button", "class", "dialog-ex-closeBtn");
        this.closeBtn.innerHTML = "<span class=\"material-icons-round\">close</span>";
        this.closeBtn.addEventListener("click", (event)=>{
            this.close();
        });
        this.formEx = null;
        this.id = id;
    }

    addFormEx()
    {
        this.formEx = new FormEx(this.dialogBox, this.id + "-form-ex", false);

        return this.formEx;
    }

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

                                var personalInfoForm = createElementEx(NO_NS, "div", this.mainSections[mainSectionId], null, "class", "justify");
                                
                                addText("Personal Information", createElementEx(NO_NS, "h3", personalInfoForm));

                                var givenName = new OldInputEx(personalInfoForm);
                                givenName.setType("text");
                                givenName.setId("given-name");
                                givenName.setLabelText("Given Name");
                                givenName.setVertical(true);
                                givenName.hideColon();

                                addText(" ", personalInfoForm);

                                var middleName = new OldInputEx(personalInfoForm);
                                middleName.setType("text");
                                middleName.setId("middle-name");
                                middleName.setLabelText("Middle Name");
                                middleName.setVertical(true);
                                middleName.hideColon();

                                addText(" ", personalInfoForm);

                                var familyName = new OldInputEx(personalInfoForm);
                                familyName.setType("text");
                                familyName.setId("family-name");
                                familyName.setLabelText("Family Name");
                                familyName.setVertical(true);
                                familyName.hideColon();

                                addText(" ", personalInfoForm);

                                var spouseName = new OldInputEx(personalInfoForm);
                                spouseName.setType("text");
                                spouseName.setId("spouse-name");
                                spouseName.setLabelText("Spouse's Name");
                                spouseName.setVertical(true);
                                spouseName.setTooltipText("For married women only");
                                spouseName.hideColon();

                                addText(" ", personalInfoForm);

                                var extName = new OldInputEx(personalInfoForm);
                                extName.setType("text");
                                extName.setId("ext-name");
                                extName.setLabelText("Ext. Name");
                                extName.setVertical(true);
                                extName.setWidth("5em");
                                extName.hideColon();

                                createElementEx(NO_NS, "br", personalInfoForm);
                                createElementEx(NO_NS, "br", personalInfoForm);

                                var address = new OldInputEx(personalInfoForm);
                                address.setType("text");
                                address.setId("address");
                                address.setLabelText("Address");
                                address.setVertical(true);
                                address.setFullWidth(true);
                                address.hideColon();

                                createElementEx(NO_NS, "br", personalInfoForm);

                                var age = new OldInputEx(personalInfoForm);
                                age.setType("number");
                                age.setId("age");
                                age.setLabelText("Age");
                                age.setMin(10);
                                age.setMax(969);
                                age.setValue(18);
                                age.setVertical(true);
                                age.hideColon();

                                addText(" ", personalInfoForm);

                                var sex = new OldInputEx(personalInfoForm); // should change to select input control
                                sex.setType("text");
                                sex.setId("sex");
                                sex.setLabelText("Sex");
                                sex.setVertical(true);
                                sex.setWidth("5em");
                                sex.hideColon();               
                                
                                addText(" ", personalInfoForm);

                                var civilStatus = new OldInputEx(personalInfoForm);
                                civilStatus.setType("text");
                                civilStatus.setId("civil-status");
                                civilStatus.setLabelText("Civil Status");
                                civilStatus.setVertical(true);
                                civilStatus.hideColon();

                                addText(" ", personalInfoForm);

                                var religion = new OldInputEx(personalInfoForm);
                                religion.setType("text");
                                religion.setId("religion");
                                religion.setLabelText("Religion");
                                religion.setVertical(true);
                                religion.hideColon();

                                addText(" ", personalInfoForm);

                                var disability = new OldInputEx(personalInfoForm);
                                disability.setType("text");
                                disability.setId("disability");
                                disability.setLabelText("Disability");
                                disability.setVertical(true);
                                disability.hideColon();
                                
                                addText(" ", personalInfoForm);

                                var ethnicGroup = new OldInputEx(personalInfoForm);
                                ethnicGroup.setType("text");
                                ethnicGroup.setId("ethnic-group");
                                ethnicGroup.setLabelText("Ethnic Group");
                                ethnicGroup.setVertical(true);
                                ethnicGroup.hideColon();

                                addText(" ", personalInfoForm);

                                var email = new OldInputEx(personalInfoForm);
                                email.setType("email");
                                email.setId("email");
                                email.setLabelText("Email Address");
                                email.setVertical(true);
                                email.hideColon();

                                addText(" ", personalInfoForm);

                                var contactNo = new OldInputEx(personalInfoForm);
                                contactNo.setType("text");
                                contactNo.setId("contact-number");
                                contactNo.setLabelText("Contact Number");
                                contactNo.setVertical(true);
                                contactNo.hideColon();

                                addText("Educational Attainment", createElementEx(NO_NS, "h3", personalInfoForm));

                                
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
                                    var jobDataForm = null;
                                    var field = null;
                                    var header = null;

                                    for (var id in this.mainSections)
                                    {
                                        this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                    }
    
                                    setCookie("current_view", value.id, 1);
    
                                    if (this.mainSections[mainSectionId].innerHTML.trim() == '')
                                    {
                                        jobDataForm = new FormEx(this.mainSections[mainSectionId], "job-data-form");
                                        jobDataForm.fieldWrapper.style.display = "grid";
                                        jobDataForm.fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
                                        jobDataForm.fieldWrapper.style.gridAutoFlow = "column";
                                        jobDataForm.fieldWrapper.style.gridGap = "1em";

                                        jobDataForm.setFullWidth();
                                        jobDataForm.setTitle("Job Data Entry", 2);

                                        field = jobDataForm.addInputEx("Position Title", "text", "", "", "position_title", "Position");
                                        field.container.style.gridColumn = "1 / span 6";
                                        field.setVertical();
                                        field.showColon();

                                        jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Parenthetical Position Title", "text", "", "Enter in cases of parenthetical position titles, \ne.g., in \"Administrative Assistant (Secretary)\", \n\"Secretary\" is a parenthetical title.", "parenthetical_title", "Position");
                                        field.container.style.gridColumn = "7 / span 6";
                                        field.setPlaceholderText("(optional");
                                        field.setVertical();
                                        field.showColon();

                                        jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Salary Grade", "number", "1", "", "salary_grade", "Position");
                                        field.container.style.gridColumn = "1 / span 3";
                                        field.setVertical();
                                        field.showColon();
                                        field.setMin(0);
                                        field.setMax(33);
                                        field.addStatusPane();
                                        field.setStatusMsgTimeout(20);
                                        field.addEvent("change", (changeEvent)=>{
                                            postData("/mpasis/php/process.php", "a=getSalaryFromSG&sg=" + changeEvent.target.inputEx.getValue(), (event)=>{
                                                var response;
                                                var sgField = changeEvent.target.inputEx;
    
                                                if (event.target.readyState == 4 && event.target.status == 200) {
                                                    response = JSON.parse(event.target.responseText);
                                                    
                                                    if (response.type == "Error") {
                                                        sgField.raiseError(response.content);
                                                    }
                                                    else if (response.type == "Salary") {
                                                        if (response.content == null)
                                                        {
                                                            sgField.resetStatus();
                                                        }
                                                        else
                                                        {
                                                            sgField.showInfo("<i>Monthly Salary: \u20b1" + parseFloat(response.content).toFixed(2) + "</i>");
                                                        }
                                                    }
                                                }
                                            });
                                        });
    
                                        jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Plantilla Item No.", "textarea", "", "", "plantilla_item_number", "Position");
                                        field.container.style.gridColumn = "4 / span 9";
                                        field.setFullWidth(false);
                                        field.setVertical();
                                        field.showColon();

                                        jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Please select the position category", "radio-multiple", "", "", "category", "Position", true);
                                        field.container.style.gridColumn = "1 / span 12";
                                        field.reverse();
                                        field.runAfterFilling = function(){
                                            this.inputExs[0].check();
                                        };
                                        field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=positionCategory", "category", "id", "description");
                                        
                                        jobDataForm.addSpacer();
                                        
                                        header = jobDataForm.addHeader("Qualification Standards", 3);
                                        header.style.marginBottom = "0";
                                        header.style.gridColumn = "1 / span 12";

                                        header = jobDataForm.addHeader("Education", 4);
                                        header.style.gridColumn = "1 / span 12";

                                        field = jobDataForm.addInputEx("Please select the minimum required educational attainment", "radio-multiple", "", "", "required_educational_attainment", "Position", true);
                                        field.container.style.gridColumn = "1 / span 6";
                                        field.container.style.gridRow = "span 4";
                                        field.reverse();
                                        field.setVertical();
                                        field.runAfterFilling = function(){
                                            this.inputExs[0].check();
                                        };
                                        field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=educLevel", "educational_attainment", "index", "description");
                                        
                                        // jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Position requires specific education", "checkbox");
                                        field.labels[0].style.fontWeight = "bold";
                                        field.reverse();
                                        field.container.style.gridColumn = "7 / span 6";
                                        
                                        var specEduc = jobDataForm.addInputEx("Please enter a description of the required education. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_education_required", "Position");
                                        specEduc.container.style.gridColumn = "7 / span 6";
                                        specEduc.container.style.gridRow = "span 3";
                                        specEduc.fields[0].style.height = "7em";
                                        specEduc.setVertical();
                                        specEduc.showColon();
                                        specEduc.disable();

                                        field.addEvent("change", (event)=>{
                                            specEduc.enable(0, event.target.inputEx.isChecked());
                                        });

                                        header = jobDataForm.addHeader("Training", 4);
                                        header.style.gridColumn = "1 / span 12";
                                        
                                        field = jobDataForm.addInputEx("Total hours of relevant training", "number", "0", "", "required_training_hours", "Position");
                                        field.container.style.gridColumn = "1 / span 6";
                                        field.container.style.gridRow = "span 3";
                                        // field.setVertical();
                                        field.showColon();
                                        field.setMin(0);
                                        field.setMax(999);
                                        field.setFullWidth();

                                        field = jobDataForm.addInputEx("Position requires specific training", "checkbox");
                                        field.labels[0].style.fontWeight = "bold";
                                        field.reverse();
                                        field.container.style.gridColumn = "7 / span 6";
                                        
                                        var specTraining = jobDataForm.addInputEx("Please enter a description of the required training. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_training_required", "Position");
                                        specTraining.container.style.gridColumn = "7 / span 6";
                                        specTraining.container.style.gridRow = "span 2";
                                        specTraining.fields[0].style.height = "4em";
                                        specTraining.setVertical();
                                        specTraining.showColon();
                                        specTraining.disable();

                                        field.addEvent("change", (event)=>{
                                            specTraining.enable(0, event.target.inputEx.isChecked());
                                        });

                                        header = jobDataForm.addHeader("Work Experience", 4);
                                        header.style.gridColumn = "1 / span 12";
                                        
                                        field = jobDataForm.addInputEx("Total years of relevant work experience", "number", "0", "", "required_work_experience_years", "Position");
                                        field.container.style.gridColumn = "1 / span 6";
                                        field.container.style.gridRow = "span 3";
                                        // field.setVertical();
                                        field.showColon();
                                        field.setMin(0);
                                        field.setMax(99);
                                        field.setFullWidth();

                                        field = jobDataForm.addInputEx("Position requires specific work experience", "checkbox");
                                        field.labels[0].style.fontWeight = "bold";
                                        field.reverse();
                                        field.container.style.gridColumn = "7 / span 6";
                                        
                                        var specExp = jobDataForm.addInputEx("Please enter a description of the required work experience. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_training_required", "Position");
                                        specExp.container.style.gridColumn = "7 / span 6";
                                        specExp.container.style.gridRow = "span 2";
                                        specExp.fields[0].style.height = "4em";
                                        specExp.setVertical();
                                        specExp.showColon();
                                        specExp.disable();

                                        field.addEvent("change", (event)=>{
                                            specExp.enable(0, event.target.inputEx.isChecked());
                                        });
                                    }
                                });
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

                                    var positionTitle = new OldInputEx(entryForm);
                                    positionTitle.setType("text");
                                    positionTitle.setId("position-title");
                                    positionTitle.setLabelText("Position Title");

                                    createElementEx(NO_NS, "br", entryForm);

                                    var parentheticalTitle = new OldInputEx(entryForm);
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

                                    var salaryGrade = new OldInputEx(entryForm);
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
                                                    cat.push(new OldInputEx(container));
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
                                                    educ.push(new OldInputEx(container));
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

                                    var requiresSpecEduc = new OldInputEx(entryForm);
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

                                    var trainingHours = new OldInputEx(entryForm);
                                    trainingHours.setType("number");
                                    trainingHours.setId("training-hours");
                                    trainingHours.setLabelText("Total hours of relevant training");
                                    trainingHours.setMin(0);
                                    trainingHours.setMax(999);
                                    trainingHours.setValue(0);

                                    createElementEx(NO_NS, "br", entryForm);
                                    createElementEx(NO_NS, "br", entryForm);

                                    var requiresSpecTraining = new OldInputEx(entryForm);
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

                                    var expYears = new OldInputEx(entryForm);
                                    expYears.setType("number");
                                    expYears.setId("exp-years");
                                    expYears.setLabelText("Total years of relevant training");
                                    expYears.setMin(0);
                                    expYears.setMax(99);
                                    expYears.setValue(0);

                                    createElementEx(NO_NS, "br", entryForm);
                                    createElementEx(NO_NS, "br", entryForm);

                                    var requiresSpecExp = new OldInputEx(entryForm);
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
                                                        elig.push(new OldInputEx(container));
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
                                                            var dialog = new OldDialogEx(fieldSet);
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

                                    var requiresCompetency = new OldInputEx(entryForm);
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
                            link.addEventListener("click", (event)=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == "")
                                {
                                    var otherAccountFormEx = new FormEx(this.mainSections[mainSectionId], "other-account-form-ex", false);

                                    otherAccountFormEx.setTitle("Other Account", 2);

                                    var searchBox = otherAccountFormEx.addInputEx("", "text", "", "Wildcards:\n\n    % - zero, one, or more characters\n    _ - one character");
                                    searchBox.setPlaceholderText("Enter the username to search");
                                    searchBox.setWidth("75%");
                                    searchBox.fieldWrapper.classList.add("center");
                                    searchBox.setFullWidth();

                                    otherAccountFormEx.addSpacer();

                                    otherAccountFormEx.setFullWidth();

                                    var btnGrp = otherAccountFormEx.addFormButtonGrp(2);
                                    btnGrp.setFullWidth();
                                    btnGrp.fieldWrapper.classList.add("center");
                                    btnGrp.inputExs[0].setLabelText("Search Accounts");
                                    btnGrp.inputExs[0].setTooltipText("");
                                    btnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                                        postData("/mpasis/php/process.php", "a=fetch&f=tempuser&k=" + searchBox.getValue() + "%", (event)=>{
                                            var response;

                                            if (event.target.readyState == 4 && event.target.status == 200)
                                            {
                                                response = JSON.parse(event.target.responseText);

                                                if (response.type == "Error")
                                                {
                                                    otherAccountFormEx.raiseError(response.content);
                                                }
                                                else if (response.type == "Data")
                                                {
                                                    var viewer = otherAccountFormEx.divs["list-users"];
                                                    var data = JSON.parse(response.content);

                                                    viewer.innerHTML = "";

                                                    for (const row of data) {
                                                        viewer.innerHTML += row["username"] + "<br>";
                                                    }
                                                }
                                            }
                                        });
                                    });
                                    btnGrp.inputExs[1].setLabelText("Add New Account");
                                    btnGrp.inputExs[1].setTooltipText("");
                                    btnGrp.inputExs[1].addEvent("click", (event)=>{
                                        var addUserDialog = new DialogEx(otherAccountFormEx.container, "add-user");
                                        var form = addUserDialog.addFormEx();
                                        form.addInputEx("Given Name", "text", "", "Enter the applicant's given name.", "given_name", "Person");
                                        form.addLineBreak();
                                        form.addInputEx("Middle Name", "text", "", "Enter the applicant's middle name. For married women, please enter the maiden middle name. Leave blank for none.", "middle_name", "Person");
                                        form.addLineBreak();
                                        form.addInputEx("Family Name", "text", "", "Enter the applicant's family name. For married women, please enter the maiden last name.", "family_name", "Person");
                                        form.addLineBreak();
                                        form.addInputEx("Spouse Name", "text", "", "For married women, please enter the spouse's last name. Leave blank for none.", "spouse_name", "Person");
                                        form.addLineBreak();
                                        form.addInputEx("Ext. Name", "text", "", "Enter the applicant's extension name (e.g., Jr., III, etc.). Leave blank for none.", "ext_name", "Person");
                                        form.addLineBreak();
                                        form.addLineBreak();
                                        form.addInputEx("Username", "text", "", "Please enter a username. Make sure to use only letters, digits, periods, and underscores.", "username", "Temp_User");
                                        form.addLineBreak();
                                        form.addInputEx("Password", "password", "1234", "Please enter a temporary password. Default: 1234", "password", "Temp_User");
                                        form.addLineBreak();
                                        var input = form.addInputEx("Access Level", "number", "1", "Please enter this user's MPASIS access level. Default: 1", "mpasis_access_level", "Temp_User");
                                        input.setMin(0);
                                        input.setMax(4);
                                        form.addLineBreak();
                                        // form.addLineBreak();
                                        var btnGrp = form.addFormButtonGrp(2);
                                        btnGrp.setFullWidth();
                                        btnGrp.fieldWrapper.classList.add("center");
                                        form.addStatusPane();
                                        btnGrp.inputExs[0].setLabelText("Save");
                                        btnGrp.inputExs[0].setTooltipText("");
                                        btnGrp.inputExs[0].addEvent("click", (event)=>{
                                            var person = {};
                                            var tempUser = {};
                                            var error = "";

                                            for (const dbColName in form.dbInputEx) {
                                                var value = form.dbInputEx[dbColName].getValue();
                                                if ((typeof(value) == "string" && value != "") || typeof(value) == "number")
                                                {
                                                    if (form.dbTableName[dbColName] == "Person")
                                                    {
                                                        person[dbColName] = value;
                                                    }
                                                    else
                                                    {
                                                        tempUser[dbColName] = value;
                                                    }
                                                }
                                                else if (dbColName == "given_name")
                                                {
                                                    error += "Given Name should not be blank.<br>";
                                                }
                                                else if (dbColName == "username")
                                                {
                                                    error += "Username should not be blank.<br>";
                                                }
                                                else if (dbColName == "username")
                                                {
                                                    error += "Password should not be blank.<br>";
                                                }
                                            }

                                            if (error != "")
                                            {
                                                form.raiseError(error);
                                            }
                                            else
                                            {
                                                postData("/mpasis/php/process.php", "a=addTempUser&person=" + JSON.stringify(person) + "&tempUser=" + JSON.stringify(tempUser), (event)=>{
                                                    var response;

                                                    if (event.target.readyState == 4 && event.target.status == 200)
                                                    {
                                                        response = JSON.parse(event.target.responseText);

                                                        if (response.type == "Error")
                                                        {
                                                            form.raiseError(response.content);
                                                        }
                                                        else if (response.type == "Success")
                                                        {
                                                            form.showSuccess(response.content);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                        btnGrp.inputExs[1].setLabelText("Close");
                                        btnGrp.inputExs[1].setTooltipText("");
                                        btnGrp.inputExs[1].addEvent("click", (event)=>{
                                            addUserDialog.close();
                                        });
                                    });

                                    otherAccountFormEx.addStatusPane();
                                    otherAccountFormEx.setStatusMsgTimeout(10);
                                    
                                    var div = otherAccountFormEx.addDiv("list-users");

                                    div.classList.add("query-results-users");
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

        if (getCookie("current_view") == "" || getCookie("current_view") == undefined)
        {
            setCookie("current_view", "dashboard", 1);
        }

        // console.log(getCookie("current_view"));

        document.getElementById(getCookie("current_view")).querySelectorAll("a")[0].click();
    }
}

var app = new MPASIS_App(document.getElementById("mpasis"));
