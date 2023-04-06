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
        this.inlineTextboxEx = null;
        this.handleInlineTextboxExOnCheck = null; // function
        this.defaultValue = null;
        this.otherOptionEx = null;
        
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
        this.extendableList = false;
        this.extendableListAddBtnEx = null;
        
        this.type = typeStr;
        switch(typeStr)
        {
            case "radio-select": // group of radio buttons
            case "checkbox-select": // group of check boxes
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
                this.isMultipleInput = true;
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
            case "radio-select":
                for (const inputEx of this.inputExs) {
                    if (inputEx.getValue() == values[0])
                    {
                        inputEx.check();
                    }
                }
                break;
            case "checkbox-select":
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
            case "radio-select":
                if (this.otherOptionEx != null && this.otherOptionEx.isChecked())
                {
                    return this.otherOptionEx.getValue();
                }

                for (const inputEx of this.inputExs) {
                    if (inputEx.isChecked())
                    {
                        return inputEx.getValue();
                    }
                }
                break;
            case "checkbox-select":
                var values = [];
                for (const inputEx of this.inputExs) {
                    // console.log(inputEx + "\n" + inputEx.isChecked() + inputEx.fields[0].checked);
                    if (inputEx.isChecked())
                    {
                        values.push(inputEx.getValue());
                    }
                }
                return values;
                break;
            case "radio":
            case "checkbox":
                if (this.inlineTextboxEx != null && this.isChecked())
                {
                    return this.inlineTextboxEx.getValue();
                }
                else if (this.isChecked())
                {
                    return this.fields[0].value.trim();
                }
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

    setDefaultValue(value)
    {
        this.defaultValue = value;
    }

    getDefaultValue()
    {
        return this.defaultValue;
    }

    /**
     * Adds an inline textbox when the InputEx type is `radio` or `checkbox`
     * @param {String} labelText (optional) Text displayed along with the textbox.
     * @param {function} actionOnSelect (optional) A function with the signature that defines what to do with this InputEx when the parent InputEx changes value
    */
    addInlineTextboxEx(labelText = "", value = "", tooltip = "", actionOnSelect = null)
    {
        if (this.type == "radio" || this.type == "checkbox")
        {
            this.inlineTextboxEx = new InputEx(this.labels[0], this.id + "-inline-text-ex", "text");
            this.inlineTextboxEx.setLabelText("&nbsp;" + labelText);
            this.inlineTextboxEx.setValue(value);
            this.inlineTextboxEx.setTooltipText(tooltip);

            if (actionOnSelect != null)
            {
                this.handleInlineTextboxExOnCheck = actionOnSelect;
                this.fields[0].addEventListener("change", this.handleInlineTextboxExOnCheck);
                this.handleInlineTextboxExOnCheck();
            }

            return this.inlineTextboxEx;
        }
    }

    addOtherOption(labelText, value, tooltipText, inlineLabel = "", selectHandler = null) // better to add this in runAfterFilling function
    {
        if (this.type == "radio-select" || this.type == "checkbox-select") // consider if this can be extended to other multiple InputEx option types
        {
            // this.timeIntervalAddOther = setInterval(()=>{
            //     if (!this.isFilling)
            //     {
                    this.otherOptionEx = this.addItem(labelText, value, tooltipText);
                    this.otherOptionEx.addInlineTextboxEx(inlineLabel, "", tooltipText, selectHandler);

                    if (this.isReversed())
                    {
                        this.otherOptionEx.reverse();
                    }

                    // clearInterval(this.timeIntervalAddOther);
                    // this.timeIntervalAddOther = undefined;
                    // delete this.timeIntervalAddOther;
            //     }
            // }, 1000);

            return this.otherOptionEx;
        }
    }

    setAsExtendableList(setting = true, btnLabelText = "", clickFunc = null) // better to add this in runAfterFilling function
    {
        if ((this.type == "radio-select" || this.type == "checkbox-select") && setting)
        {
            if (this.extendableListAddBtnEx == null || this.extendableListAddBtnEx == undefined)
            {
                this.extendableListAddBtnEx = new InputEx(this.fieldWrapper, this.id + "-add-item-ex-btn", "buttonEx");
                this.extendableListAddBtnEx.setLabelText(btnLabelText);
                this.extendableListAddBtnEx.addEvent("click", clickFunc);
            }
            else
            {
                this.fieldWrapper.appendChild(this.extendableListAddBtnEx.container);
            }
            this.extendableList = setting;
        }
        else
        {
            
        }
    }

    clearList()
    {
        if (this.isMultipleInput)
        {
            switch (this.type)
            {
                case 'radio-select':
                case 'checkbox-select':
                    while (this.inputExs.length > 0)
                    {
                        this.inputExs.pop().destroy();
                    }
                    if (this.otherOptionEx != null)
                    {
                        this.otherOptionEx.destroy();
                        this.otherOptionEx = null;
                    }
                    if (this.extendableListAddBtnEx != null)
                    {
                        // this.extendableListAddBtnEx.destroy(); // do not throw reference away!!!!
                    }
                    this.dbInputEx = [];
                    break;
                case 'combo':
                    // this.datalist.innerHTML = "";
                    Array.from(this.datalist.children).forEach((option)=>{
                        option.remove();
                    });
                    break;
                default:
                    break;
            }
        }
    }

    check(doCheck = true) // single input only
    {
        if (!this.isMultipleInput && (this.type == "radio" || this.type == "checkbox"))
        {
            // this.fields[0].toggleAttribute("checked", doCheck); // hard-coded HTML check attributes confuse the browser
            this.fields[0].checked = doCheck;

            if (this.handleInlineTextboxExOnCheck != null || this.handleInlineTextboxExOnCheck != undefined)
            {
                this.handleInlineTextboxExOnCheck();
            }

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
            this.labels[0].inputEx = this;
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

        if (!this.isMultipleInput || this.type == "combo" && !this.type.startsWith("button") && this.type != "reset" && this.type != "submit")
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

    addItem(labelText, value = "", tooltipText = "") // only for combo (will add to datalist), radio-select, and multiple-radio-select
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
            case "radio-select":
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

                this.inputExs[this.inputExs.length - 1].fields[0].addEventListener("change", (event)=>{
                    for (const inputEx of this.inputExs)
                    {
                        if (inputEx.handleInlineTextboxExOnCheck != null)
                        {
                            inputEx.handleInlineTextboxExOnCheck();
                        }
                    }
                });

                return this.inputExs[this.inputExs.length - 1];

                break;
            case "checkbox-select":
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

                return this.inputExs[this.inputExs.length - 1];

                break;
            case "combo":
                var option = createElementEx(NO_NS, "option", this.datalist, null, "value", labelText, "data-value", value);
                if (tooltipText != "")
                {
                    option.title = tooltipText; // HAS NO EFFECT!!!
                }
                return option;
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

                return this.inputExs[this.inputExs.length - 1];

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

                return this.inputExs[this.inputExs.length - 1];

                break;
        }
    }

    addItems(...labelStrs) // only for combo (will add to datalist), radio-select, and multiple-radio-select; no tooltip
    {
        labelStrs.forEach(labelText=>{
            this.addItem(labelText);
        });
    }

    fillItemsFromServer(url, postQueryString, labelColName = "", valueColName = "", tooltipColName = "")
    {
        this.isFilling = true;

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

                    this.isFilling = false;
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
        if (!this.isMultipleInput || this.type == "combo")
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
        this.events = { // contain event listener functions that shall be automatically attached to each inputEx objects
            click: null,
            change: null,
            keyup: null,
            keypress: null // may automatically add more during run-time
        }; 
        this.id = id.trim();
        this.statusMode = 1; // 0: not displayed; 1: marker displayed with tooltip ; 2: full status message displayed
        this.statusTimer = null; // will store the timeout for auto-resetting status
        this.statusTimeout = 5; // seconds; < 0 will disable the creation of statusTimer
        this.formMode = 0; // 0: Adding/Creating Record; 1: Editing
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

            return this.statusPane;
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

class MsgBox extends DialogEx
{
    constructor(parent = null, message, type = "OK", yesFunc = null)
    {
        super(parent, "msgbox" + (new Date()).valueOf());
        this.message = message;
        this.messageContainer = createElementEx(NO_NS, "span", this.dialogBox);
        this.messageContainer.innerHTML = message;
        this.btnGrp = null;

        switch (type)
        {
            case "YESNO":
                this.btnGrp = new InputEx(this.dialogBox, "msgbox-btns" + (new Date()).valueOf(), "buttonExs");
                this.btnGrp.setFullWidth();
                this.btnGrp.fieldWrapper.classList.add("center");
                this.btnGrp.addItems("Yes", "No");
                this.btnGrp.fields[0].addEventListener("click", yesFunc);
                this.btnGrp.fields[0].addEventListener("click", ()=>{
                    this.close();
                });
                this.btnGrp.fields[1].addEventListener("click", ()=>{
                    this.close();
                });
                break;
        default: // OK
            this.btnGrp = new InputEx(this.dialogBox, "msgbox-btns" + (new Date()).valueOf(), "buttonExs");
            this.btnGrp.setFullWidth();
            this.btnGrp.fieldWrapper.classList.add("center");
            this.btnGrp.addItems("OK");
            this.btnGrp.fields[0].addEventListener("click", ()=>{
                this.close();
            });
            break;
        }
    }

    sayYes()
    {

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
                            link.addEventListener("click", async (clickEvent0)=>{
                                for (var id in this.mainSections)
                                {
                                    this.mainSections[id].classList.toggle("hidden", (id != mainSectionId));
                                }

                                setCookie("current_view", value.id, 1);

                                if (this.mainSections[mainSectionId].innerHTML.trim() == "")
                                {
                                    var applicantDataForm = null, header = null, field = null, applicant = null, searchedApplicants = null;
                                    document.positions = [];

                                    applicantDataForm = new FormEx(this.mainSections[mainSectionId], "applicant-data-form-ex", true);
                                    applicantDataForm.setFullWidth();

                                    postData("/mpasis/php/process.php", "a=fetch&f=positions", (postEvent)=>{
                                        var response;

                                        if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
                                        {
                                            response = JSON.parse(postEvent.target.responseText);

                                            if (response.type == "Error")
                                            {
                                                new MsgBox(applicantDataForm.container, "Error: " + response.content, "OK");
                                                // console.log(response.content);
                                            }
                                            else if (response.type == "Data")
                                            {
                                                document.positions = JSON.parse(response.content);

                                                console.log(document.positions);
                                            }
                                        }
                                    });

                                    applicantDataForm.fieldWrapper.style.display = "grid";
                                    applicantDataForm.fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
                                    applicantDataForm.fieldWrapper.style.gridAutoFlow = "column";
                                    applicantDataForm.fieldWrapper.style.gridGap = "1em";
                                    
                                    header = applicantDataForm.setTitle("Applicant Data Entry", 2);

                                    header = applicantDataForm.addHeader("Position Applied", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "1";
                                    header.style.marginBottom = "0";

                                    var positionField = applicantDataForm.addInputEx("Position Title", "combo", "", "Please select the position title from the drop-down menu. You may type on the text box to filter the positions.", "position_title", "Position");
                                    positionField.container.style.gridColumn = "1 / span 4";
                                    positionField.container.style.gridRow = "2";
                                    positionField.setVertical();
                                    positionField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=positionTitles", "position_title", "", "");
                                    positionField.addEvent("change", async (event)=>{
                                        parenField.setValue("");
                                        await parenField.clearList();
                                        await parenField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=parenTitles&positionTitle=" + positionField.getValue(), "parenthetical_title", "", "");
                                        
                                        plantillaField.setValue("");
                                        await plantillaField.clearList();
                                        await plantillaField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=plantilla&positionTitle=" + positionField.getValue() + (parenField.getValue().trim() == "" ? "" : "&parenTitle=" + parenField.getValue()), "plantilla_item_number", "", "");
                                        plantillaField.addItem("ANY");
                                    });
                                    
                                    var parenField = applicantDataForm.addInputEx("Parenthetical Title", "combo", "", "Please select the parenthetical position titles available from the drop-down menu. You may type on the text box to filter the entries.", "parenthetical_title", "Position");
                                    parenField.setPlaceholderText("(optional)");
                                    parenField.container.style.gridColumn = "5 / span 4";
                                    parenField.container.style.gridRow = "2";
                                    parenField.setVertical();
                                    parenField.addEvent("change", async (event)=>{
                                        plantillaField.setValue("");
                                        await plantillaField.clearList();
                                        await plantillaField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=plantilla&positionTitle=" + positionField.getValue() + (parenField.getValue().trim() == "" ? "" : "&parenTitle=" + parenField.getValue()), "plantilla_item_number", "", "");
                                        plantillaField.addItem("ANY");
                                    });

                                    var plantillaField = applicantDataForm.addInputEx("Plantilla Item Number", "combo", "", "Please select the plantilla item numbers available from the drop-down menu or select ANY instead. You may type on the text box to filter the entries.", "plantilla_item_number", "Position");
                                    plantillaField.container.style.gridColumn = "9 / span 4";
                                    plantillaField.container.style.gridRow = "2";
                                    plantillaField.setVertical();

                                    var searchExistingApplicant = applicantDataForm.addInputEx("Search for existing applicants", "combo", "", "Type some names to search for possible matches", "", "");
                                    searchExistingApplicant.container.style = "grid-column: 1 / span 12; grid-row: 3";
                                    searchExistingApplicant.addStatusPane();
                                    searchExistingApplicant.showColon();
                                    searchExistingApplicant.addEvent("input", (event)=>{
                                        for (const option of Array.from(event.target.inputEx.datalist.children)) {
                                            if (option.value == event.target.inputEx.getValue())
                                            {
                                                alert(option.value.match(/^\d+/)[0]);
                                                applicant = searchedApplicants[option.value.match(/^\d+/)[0]];
                                                console.log(applicant);
                                            }
                                        }
                                    });

                                    var searchApplicant = function(changeEvent){
                                        changeEvent.target.inputEx.showInfo("Searching . . .");

                                        postData("/mpasis/php/process.php", "a=fetch&f=searchApplicationByName&name=" + this.inputEx.getValue(), (postEvent)=>{
                                            var response;

                                            if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
                                            {
                                                response = JSON.parse(postEvent.target.responseText);

                                                if (response.type == "Error")
                                                {
                                                    changeEvent.target.inputEx.raiseError(response.content);
                                                }
                                                else if (response.type == "Data")
                                                {
                                                    var results = JSON.parse(response.content);
                                                    var option = null;
                                                    
                                                    changeEvent.target.inputEx.resetStatus();
                                                    changeEvent.target.inputEx.clearList();

                                                    searchedApplicants = results;

                                                    if (results.length == 0)
                                                    {
                                                        // changeEvent.target.inputEx.showSuccess("No results found");
                                                    }
                                                    else
                                                    {
                                                        for (const key in results) {
                                                            var label = results[key]["application_code"] + " " + results[key]["given_name"] + (results[key]["middle_name"] == null || results[key]["middle_name"].trim() == "" ? "" : " " + results[key]["middle_name"]) + (results[key]["family_name"] == null || results[key]["family_name"].trim() == "" ? "" : " " + results[key]["family_name"]) + (results[key]["spouse_name"] == null || results[key]["spouse_name"].trim() == "" ? "" : " " + results[key]["spouse_name"]) + (results[key]["ext_name"] == null || results[key]["ext_name"].trim() == "" ? "" : ", " + results[key]["ext_name"]);
                                                            option = changeEvent.target.inputEx.addItem(label);
                                                        }
                                                    }
                                                    // console.log(results);
                                                }
                                            }
                                        });
                                    };

                                    searchExistingApplicant.addEvent("change", searchApplicant);
                                    searchExistingApplicant.addEvent("keydown", searchApplicant);

                                    header = applicantDataForm.addHeader("Personal Information", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "4";
                                    header.style.marginBottom = "0";
                                    
                                    field = applicantDataForm.addInputEx("Given Name", "text", "", "First Name", "given_name", "Person");
                                    field.container.style.gridColumn = "1 / span 4";
                                    field.container.style.gridRow = "5";
                                    field.setVertical();
                                    
                                    field = applicantDataForm.addInputEx("Middle Name", "text", "", "Middle Name", "middle_name", "Person");
                                    field.container.style.gridColumn = "5 / span 4";
                                    field.container.style.gridRow = "5";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Family Name", "text", "", "Last Name", "last_name", "Person");
                                    field.container.style.gridColumn = "9 / span 4";
                                    field.container.style.gridRow = "5";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Spouse's Name", "text", "", "Spouse's Name; for married woman", "spouse_name", "Person");
                                    field.container.style.gridColumn = "1 / span 4";
                                    field.container.style.gridRow = "6";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Ext. Name", "text", "", "Extension Name (e.g., Jr., III, etc.)", "ext_name", "Person");
                                    field.container.style.gridColumn = "9 / span 4";
                                    field.container.style.gridRow = "6";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Address", "textarea", "", "Address", "text", "Address");
                                    field.container.style.gridColumn = "1 / span 12";
                                    field.container.style.gridRow = "7";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Age", "number", "", "Age", "age", "Person");
                                    field.container.style.gridColumn = "1 / span 4";
                                    field.container.style.gridRow = "8";
                                    field.setVertical();
                                    field.setMin(10);
                                    field.setMax(999);
                                    field.setValue(18);

                                    field = applicantDataForm.addInputEx("Sex", "combo", "", "Sex", "sex", "Person");
                                    field.container.style.gridColumn = "5 / span 4";
                                    field.container.style.gridRow = "8";
                                    field.setVertical();
                                    field.addItem("Male", "male");
                                    field.addItem("Female", "female");

                                    field = applicantDataForm.addInputEx("Civil Status", "combo", "", "Civil Status", "civil_status", "ENUM_Civil_Status");
                                    field.container.style.gridColumn = "9 / span 4";
                                    field.container.style.gridRow = "8";
                                    field.setVertical();
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=civilStatus", "civil_status", "index", "description");

                                    field = applicantDataForm.addInputEx("Religion", "combo", "", "Religious Affiliation", "religion", "Religion");
                                    field.container.style.gridColumn = "1 / span 4";
                                    field.container.style.gridRow = "9";
                                    field.setVertical();
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=religion", "religion", "id", "description");

                                    field = applicantDataForm.addInputEx("Disability", "combo", "", "Disability; if multiple, please separate with semi-colons", "disability", "Disability");
                                    field.container.style.gridColumn = "5 / span 4";
                                    field.container.style.gridRow = "9";
                                    field.setVertical();
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=disability", "disability", "id", "description");

                                    field = applicantDataForm.addInputEx("Ethnic Group", "combo", "", "Ethnic Group", "ethnic_group", "Ethnic_Group");
                                    field.container.style.gridColumn = "9 / span 4";
                                    field.container.style.gridRow = "9";
                                    field.setVertical();
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=ethnicGroup", "ethnic_group", "id", "description");

                                    field = applicantDataForm.addInputEx("Email Address", "email", "", "Email address", "email_address", "Person");
                                    field.container.style.gridColumn = "1 / span 6";
                                    field.container.style.gridRow = "10";
                                    field.setVertical();

                                    field = applicantDataForm.addInputEx("Contact Number", "text", "", "Contact numbers; if multiple, please separate with semi-colons", "ext_name", "Person");
                                    field.container.style.gridColumn = "7 / span 6";
                                    field.container.style.gridRow = "10";
                                    field.setVertical();

                                    header = applicantDataForm.addHeader("Educational Attainment", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "11";
                                    header.style.marginBottom = "0";

                                    field = applicantDataForm.addInputEx("Please choose the highest level completed", "radio-select", "1", "Highest finished educational level", "educational_attainment", "Person", true);
                                    field.container.style.gridColumn = "1 / span 6";
                                    field.container.style.gridRow = "12 / span 3";
                                    field.setVertical();
                                    field.showColon();
                                    field.reverse();
                                    // field.runAfterFilling = function(){
                                    //     this.addOtherOption("Other", "-1", "Please specify another level of education", "<i>(Please specify):</i>", function(event){
                                    //         if (Object.prototype.toString.call(this) == "[object Object]")
                                    //         {
                                    //             this.inlineTextboxEx.enable(null, this.isChecked());
                                    //         }
                                    //         else if (Object.prototype.toString.call(this) == "[object HTMLInputElement]")
                                    //         {
                                    //             this.inputEx.inlineTextboxEx.enable(null, this.inputEx.isChecked());
                                    //         }
                                    //     });
                                    // };
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=educLevel", "educational_attainment", "index", "description");

                                    field = applicantDataForm.addInputEx("Post-Graduate Units", "number", "0", "Post-graduate units taken toward the completion of the next post-graduate degree", "postgraduate_units", "Person");
                                    field.container.style.gridColumn = "7 / span 6";
                                    field.container.style.gridRow = "12";
                                    field.setVertical();
                                    field.setMin(0);
                                    field.setMax(999);
                                    field.setValue(0);

                                    field = applicantDataForm.addInputEx("Please choose all relevant specific courses/education taken by applicant", "checkbox-select", "1", "Specific courses/education taken", "specific_education", "Specific_Education", true);
                                    field.container.style.gridColumn = "7 / span 6";
                                    field.container.style.gridRow = "13 / span 2";
                                    field.setVertical();
                                    field.showColon();
                                    field.reverse();
                                    field.runAfterFilling = function(){
                                        this.setAsExtendableList(true, "+Add other relevant education");
                                        var parentEx = field;
                                        this.extendableListAddBtnEx.addEvent("click", (clickEvent)=>{
                                            var addEducDialog = new DialogEx(parentEx.fieldWrapper, "add-educ");
                                            var addEducForm = addEducDialog.addFormEx();
                                            
                                            addEducForm.addInputEx("Education", "text", "", "Please enter the course to be added.", "specific_education", "Specific_Education");
                                            addEducForm.addLineBreak();
                                            addEducForm.addInputEx("Description", "text", "", "Description", "description", "Specific_Education");
                                            addEducForm.addLineBreak();
                                            var addEducBtnGrp = addEducForm.addFormButtonGrp(2);
                                            addEducBtnGrp.setFullWidth();
                                            addEducBtnGrp.fieldWrapper.classList.add("right");
                                            addEducBtnGrp.inputExs[0].setLabelText("Add");
                                            addEducBtnGrp.inputExs[0].setTooltipText("");
                                            addEducBtnGrp.inputExs[0].addEvent("click", (clickEvent2)=>{
                                                var specEduc = {};
                                                for (const colName in addEducForm.dbInputEx)
                                                {
                                                    if (addEducForm.dbTableName[colName] == "Specific_Education")
                                                    {
                                                        specEduc[colName] = addEducForm.dbInputEx[colName].getValue();
                                                    }
                                                }

                                                console.log(JSON.stringify([specEduc]).replace("'", "''"));

                                                if  (specEduc["specific_education"].trim() != "")
                                                {
                                                    postData("/mpasis/php/process.php", "a=add&specEducs=" + JSON.stringify([specEduc]).replace("'", "''"), (htEvent)=>{
                                                        var response;

                                                        if (htEvent.target.readyState == 4 && htEvent.target.status == 200)
                                                        {
                                                            response = JSON.parse(htEvent.target.responseText);

                                                            if (response.type == "Error")
                                                            {
                                                                addEducForm.raiseError(response.content);
                                                            }
                                                            else
                                                            {
                                                                addEducForm.showSuccess(response.content);
                                                                parentEx.clearList();
                                                                parentEx.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=specEduc", "specific_education", "id", "description");
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                            addEducBtnGrp.inputExs[1].setLabelText("Close");
                                            addEducBtnGrp.inputExs[1].setTooltipText("");
                                            addEducBtnGrp.inputExs[1].addEvent("click", (clickEvent2)=>{
                                                addEducDialog.close();
                                            });
                                            addEducForm.addStatusPane();
                                            addEducForm.dbInputEx["specific_education"].fields[0].focus();
                                        })
                                    };
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=specEduc", "specific_education", "id", "description");

                                    header = applicantDataForm.addHeader("Training", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "15";
                                    header.style.marginBottom = "0";

                                    var trainingDiv = createElementEx(NO_NS, "fieldset", applicantDataForm.fieldWrapper, null);
                                    trainingDiv.style.gridColumn = "1 / span 12";
                                    trainingDiv.style.gridRow = "16";
                                    var trainingContainer = createElementEx(NO_NS, "table", trainingDiv, null, "style", "width: 100%; border-collapse: collapse;");
                                    [createElementEx(NO_NS, "tr", createElementEx(NO_NS, "thead", trainingContainer, null), null)].forEach(row=>{
                                        addText("Training Name/Description", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "background-color: lightgray;"));
                                        addText("Hours", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 5em; background-color: lightgray;"));
                                        createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 0.5em; border: none;")
                                    });
                                    trainingContainer = createElementEx(NO_NS, "tbody", trainingContainer, null);

                                    var addTrainingBtn = new InputEx(trainingDiv, "add-applicant-training", "buttonEx");
                                    addTrainingBtn.setLabelText("+Add a row");
                                    var trainingInputExs = [];
                                    addTrainingBtn.addEvent("click", (event)=>{
                                        [createElementEx(NO_NS, "tr", trainingContainer)].forEach((row, index)=>{
                                            var timestamp = (new Date()).valueOf();
                                            trainingInputExs.push({
                                                "trainingInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "training-" + timestamp, "text"),
                                                "trainingHoursInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "trainingHours-" + timestamp, "number")
                                            });
                                            [new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (trainingInputExs.length - 1), "buttonEx")].forEach(removeRowBtn=>{
                                                removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 1em; color: red;\">close</span></b>");
                                                removeRowBtn.fields[0].style.borderRadius = "1em";
                                                removeRowBtn.fields[0].style.padding = 0;
                                                removeRowBtn.fields[0].style.fontSize = "0.5em";
                                                removeRowBtn["row"] = row;
                                                removeRowBtn["rowData"] = trainingInputExs[trainingInputExs.length - 1];
                                                removeRowBtn.addEvent("click", async function(removeClickEvent){
                                                    var msg = new MsgBox(applicantDataForm.fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                                                        trainingInputExs.splice(trainingInputExs.indexOf(this.inputEx.rowData), 1);
                                                        this.inputEx.row.remove();
                                                    });

                                                });
                                            });
                                        });
                                        trainingInputExs[trainingInputExs.length - 1].trainingInputEx.setFullWidth();
                                        trainingInputExs[trainingInputExs.length - 1].trainingInputEx.setPlaceholderText("Enter a descriptive name for the training");
                                        trainingInputExs[trainingInputExs.length - 1].trainingInputEx.fields[0].style.width = "100%";
                                        trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.setFullWidth();
                                        trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.setPlaceholderText("hours");
                                        trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.setMin(0);
                                        trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.setMax(999);
                                        trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.fields[0].style.width = "100%";

                                    });
                                    var field = new InputEx(trainingDiv, "more-training", "checkbox");    
                                    field.setLabelText("There are more training certificates and/or MOVs that were no longer included in this list for encoding.");
                                    field.reverse();
                                    
                                    header = applicantDataForm.addHeader("Work Experience", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "17";
                                    header.style.marginBottom = "0";

                                    var workExpDiv = createElementEx(NO_NS, "fieldset", applicantDataForm.fieldWrapper, null);
                                    workExpDiv.style.gridColumn = "1 / span 12";
                                    workExpDiv.style.gridRow = "18";
                                    var workExpContainer = createElementEx(NO_NS, "table", workExpDiv, null, "style", "width: 100%; border-collapse: collapse;");
                                    [createElementEx(NO_NS, "tr", createElementEx(NO_NS, "thead", workExpContainer, null), null)].forEach(row=>{
                                        addText("Work Experience Details", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "background-color: lightgray;"));
                                        addText("Start Date", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 8em; background-color: lightgray;"));
                                        addText("End Date", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 8em; background-color: lightgray;"));
                                        createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 0.5em; border: none;")
                                    });
                                    workExpContainer = createElementEx(NO_NS, "tbody", workExpContainer, null);

                                    var addTrainingBtn = new InputEx(workExpDiv, "add-applicant-workExp", "buttonEx");
                                    addTrainingBtn.setLabelText("+Add a row");
                                    var workExpInputExs = [];
                                    addTrainingBtn.addEvent("click", (event)=>{
                                        [createElementEx(NO_NS, "tr", workExpContainer)].forEach((row, index)=>{
                                            var timestamp = (new Date()).valueOf();
                                            workExpInputExs.push({
                                                "workExpInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExp-" + timestamp, "text"),
                                                "workExpStartYearInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExpHours-" + timestamp, "date"),
                                                "workExpEndYearInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExpHours-" + timestamp, "date")
                                            });
                                            [new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (workExpInputExs.length - 1), "buttonEx")].forEach(removeRowBtn=>{
                                                removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 5em; color: red;\">close</span></b>");
                                                removeRowBtn.fields[0].style.borderRadius = "1em";
                                                removeRowBtn.fields[0].style.padding = 0;
                                                removeRowBtn.fields[0].style.fontSize = "0.5em";
                                                removeRowBtn["row"] = row;
                                                removeRowBtn["rowData"] = workExpInputExs[workExpInputExs.length - 1];
                                                removeRowBtn.addEvent("click", function(removeClickEvent){
                                                    var msg = new MsgBox(applicantDataForm.fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                                                        workExpInputExs.splice(workExpInputExs.indexOf(this.inputEx.rowData), 1);
                                                        this.inputEx.row.remove();
                                                    });                                                   
                                                });
                                            });
                                        });
                                        workExpInputExs[workExpInputExs.length - 1].workExpInputEx.setFullWidth();
                                        workExpInputExs[workExpInputExs.length - 1].workExpInputEx.setPlaceholderText("Enter a descriptive name for the workExp");
                                        workExpInputExs[workExpInputExs.length - 1].workExpInputEx.fields[0].style.width = "100%";
                                        workExpInputExs[workExpInputExs.length - 1].workExpStartYearInputEx.setFullWidth();
                                        workExpInputExs[workExpInputExs.length - 1].workExpStartYearInputEx.fields[0].style.width = "100%";
                                        workExpInputExs[workExpInputExs.length - 1].workExpEndYearInputEx.setFullWidth();
                                        workExpInputExs[workExpInputExs.length - 1].workExpEndYearInputEx.fields[0].style.width = "100%";

                                    });
                                    field = new InputEx(workExpDiv, "more-workExp", "checkbox");    
                                    field.setLabelText("There are more work experience information that were no longer included in this list for encoding.");
                                    field.reverse();

                                    header = applicantDataForm.addHeader("Eligibility", 3);
                                    header.style.gridColumn = "1 / span 12";
                                    header.style.gridRow = "19";
                                    header.style.marginBottom = "0";

                                    field = applicantDataForm.addInputEx("Please select all the career service eligibility that the applicant possesses", "checkbox-select", "", "CS Eligibility", "eligibilityId", "Person", true);
                                    field.container.style.gridColumn = "1 / span 12";
                                    field.container.style.gridRow = "20";
                                    field.setVertical();
                                    field.showColon();
                                    field.reverse();
                                    field.runAfterFilling = function(){
                                        this.setAsExtendableList(true, "+Add missing eligibility", (clickEvent)=>{
                                            var addEligibilityBtn = clickEvent.target.inputEx;
                                            var addEligDialog = new DialogEx(field.fieldWrapper, "add-eligibility-dialog-ex");
                                            var addEligForm = addEligDialog.addFormEx();
                                            var newEligText = addEligForm.addInputEx("New Eligibility", "text", "");
                                            addEligForm.addLineBreak();
                                            var descText = addEligForm.addInputEx("Description", "text", "");
                                            addEligForm.addLineBreak();
                                            var btnGrp = addEligForm.addFormButtonGrp(2);
                                            btnGrp.inputExs[0].setLabelText("Save");
                                            btnGrp.inputExs[0].setTooltipText("");
                                            btnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                                                var newElig = {};
                                                newElig["name"] = newEligText.getValue().trim();
                                                if (newElig["name"] == "")
                                                {
                                                    addEligForm.raiseError("Eligibility name should not be blank.");
                                                }
                                                else
                                                {
                                                    if (newElig["description"] != "")
                                                    {
                                                        newElig["description"] = descText.getValue().trim();
                                                    }

                                                    postData("/mpasis/php/process.php", "a=add&eligibilities=" + JSON.stringify([newElig]).replace("'", "''"), (event)=>{
                                                        var response;

                                                        if (event.target.readyState == 4 && event.target.status == 200)
                                                        {
                                                            response = JSON.parse(event.target.responseText);

                                                            if (response.type == "Error")
                                                            {
                                                                addEligForm.raiseError(response.content);
                                                            }
                                                            else if (response.type = "Data")
                                                            {
                                                                addEligForm.showSuccess(response.content);

                                                                var timeout = setTimeout(()=>{
                                                                    
                                                                    addEligDialog.close();
                                                                    clearTimeout(timeout);
                                                                    timeout = null;

                                                                    while (field.inputExs.length > 0)
                                                                    {
                                                                        var last = field.inputExs.pop();

                                                                        last.destroy();
                                                                    }

                                                                    addEligibilityBtn.destroy();

                                                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=eligibilities", "name", "id", "description");
                                                                    
                                                                }, 5000);
                                                            }
                                                        }
                                                    });
                                                }

                                            });
                                            btnGrp.inputExs[1].setLabelText("Close");
                                            btnGrp.inputExs[1].setTooltipText("");
                                            btnGrp.inputExs[1].addEvent("click", (clickEvent)=>{
                                                addEligDialog.close();
                                            });
                                            var stat = addEligForm.addStatusPane();
                                            
                                        });
                                    };
                                    field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=eligibilities", "name", "id", "description");
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

                                        field = jobDataForm.addInputEx("Please select the position category", "radio-select", "", "", "category", "Position", true);
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

                                        field = jobDataForm.addInputEx("Please select the minimum required educational attainment", "radio-select", "", "", "required_educational_attainment", "Position", true);
                                        field.container.style.gridColumn = "1 / span 6";
                                        field.container.style.gridRow = "span 4";
                                        field.reverse();
                                        field.setVertical();
                                        field.runAfterFilling = function(){
                                            this.inputExs[0].check();
                                        };
                                        field.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=educLevel", "educational_attainment", "index", "description");
                                        
                                        // jobDataForm.addSpacer();

                                        field = jobDataForm.addInputEx("Position requires specific education", "checkbox", "", "", "requires-spec-education");
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

                                        field = jobDataForm.addInputEx("Position requires specific training", "checkbox", "", "", "requires-spec-training");
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

                                        field = jobDataForm.addInputEx("Position requires specific work experience", "checkbox", "", "", "requires-spec-work-exp");
                                        field.labels[0].style.fontWeight = "bold";
                                        field.reverse();
                                        field.container.style.gridColumn = "7 / span 6";
                                        
                                        var specExp = jobDataForm.addInputEx("Please enter a description of the required work experience. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_work_experience_required", "Position");
                                        specExp.container.style.gridColumn = "7 / span 6";
                                        specExp.container.style.gridRow = "span 2";
                                        specExp.fields[0].style.height = "4em";
                                        specExp.setVertical();
                                        specExp.showColon();
                                        specExp.disable();

                                        field.addEvent("change", (event)=>{
                                            specExp.enable(0, event.target.inputEx.isChecked());
                                        });

                                        header = jobDataForm.addHeader("Career Service Eligibilities", 4);
                                        header.style.gridColumn = "1 / span 12";

                                        var eligField = jobDataForm.addInputEx("Please select all the eligibilities required for this position", "checkbox-select", "", "", "required_eligibility", "Required_Eligibility", true);
                                        eligField.container.style.gridColumn = "1 / span 12";
                                        // eligField.container.style.gridRow = "span 4";
                                        eligField.reverse();
                                        eligField.setVertical();
                                        eligField.runAfterFilling = function(){
                                            // this.inputExs[0].check();
                                            var addEligibilityBtn = null;
                                            var eligField = this;

                                            addEligibilityBtn = new InputEx(this.fieldWrapper, "add-eligibility-input-ex", "buttonEx", false);
                                            addEligibilityBtn.setLabelText("+Add Missing Eligibility");
                                            addEligibilityBtn.addEvent("click", (clickEvent)=>{
                                                var addEligDialog = new DialogEx(this.fieldWrapper, "add-eligibility-dialog-ex");
                                                var addEligForm = addEligDialog.addFormEx();
                                                var newEligText = addEligForm.addInputEx("New Eligibility", "text", "");
                                                addEligForm.addLineBreak();
                                                var descText = addEligForm.addInputEx("Description", "text", "");
                                                addEligForm.addLineBreak();
                                                var btnGrp = addEligForm.addFormButtonGrp(2);
                                                btnGrp.inputExs[0].setLabelText("Save");
                                                btnGrp.inputExs[0].setTooltipText("");
                                                btnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                                                    var newElig = {};
                                                    newElig["name"] = newEligText.getValue().trim();
                                                    if (newElig["name"] == "")
                                                    {
                                                        addEligForm.raiseError("Eligibility name should not be blank.");
                                                    }
                                                    else
                                                    {
                                                        if (newElig["description"] != "")
                                                        {
                                                            newElig["description"] = descText.getValue().trim();
                                                        }
    
                                                        postData("/mpasis/php/process.php", "a=add&eligibilities=" + JSON.stringify([newElig]).replace("'", "''"), (event)=>{
                                                            var response;
    
                                                            if (event.target.readyState == 4 && event.target.status == 200)
                                                            {
                                                                response = JSON.parse(event.target.responseText);
    
                                                                if (response.type == "Error")
                                                                {
                                                                    addEligForm.raiseError(response.content);
                                                                }
                                                                else if (response.type = "Data")
                                                                {
                                                                    addEligForm.showSuccess(response.content);
    
                                                                    var timeout = setTimeout(()=>{
                                                                        
                                                                        addEligDialog.close();
                                                                        clearTimeout(timeout);
                                                                        timeout = null;

                                                                        while (eligField.inputExs.length > 0)
                                                                        {
                                                                            var last = eligField.inputExs.pop();

                                                                            last.destroy();
                                                                        }

                                                                        addEligibilityBtn.destroy();

                                                                        eligField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=eligibilities", "name", "id", "description");
                                                                        
                                                                    }, 5000);
                                                                }
                                                            }
                                                        });
                                                    }

                                                });
                                                btnGrp.inputExs[1].setLabelText("Close");
                                                btnGrp.inputExs[1].setTooltipText("");
                                                btnGrp.inputExs[1].addEvent("click", (clickEvent)=>{
                                                    addEligDialog.close();
                                                });
                                                var stat = addEligForm.addStatusPane();
                                                
                                            });
                                        };
                                        eligField.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=eligibilities", "name", "id", "description");

                                        header = jobDataForm.addHeader("Competency", 4);
                                        header.style.gridColumn = "1 / span 12";

                                        field = jobDataForm.addInputEx("Position requires specific competency/competencies", "checkbox", "", "", "requires-competency");
                                        field.labels[0].style.fontWeight = "bold";
                                        field.reverse();
                                        field.container.style.gridColumn = "1 / span 12";
                                        
                                        var competency = jobDataForm.addInputEx("Please enter a description of the required competencies, if applicable. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "competency", "Position");
                                        competency.container.style.gridColumn = "1 / span 12";
                                        competency.container.style.gridRow = "span 2";
                                        competency.fields[0].style.height = "4em";
                                        competency.setVertical();
                                        competency.showColon();
                                        competency.disable();

                                        field.addEvent("change", (event)=>{
                                            competency.enable(0, event.target.inputEx.isChecked());
                                        });

                                        var jobDataBtnGrp = jobDataForm.addFormButtonGrp(2);
                                        jobDataBtnGrp.setFullWidth();
                                        jobDataBtnGrp.container.style.gridColumn = "1 / span 12";
                                        jobDataBtnGrp.inputExs[0].setLabelText("Save");
                                        jobDataBtnGrp.inputExs[0].setTooltipText("");
                                        jobDataBtnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                                            var plantillaItems = jobDataForm.dbInputEx["plantilla_item_number"].getValue().replace("\r","").split("\n");
                                            plantillaItems = plantillaItems.map((value)=>{
                                                return value.trim();
                                            });

                                            plantillaItems = (jobDataForm.dbInputEx["plantilla_item_number"].getValue().trim() == "" ? [] : plantillaItems);

                                            var positions = [];
                                            var position = null;

                                            plantillaItems.forEach((plantillaItem)=>{
                                                position = {};

                                                // console.log(jobDataForm.dbInputEx);

                                                for (const key in jobDataForm.dbInputEx) {
                                                    if (key == "plantilla_item_number")
                                                    {
                                                        position[key] = plantillaItem;
                                                    }
                                                    else if (key == "requires-spec-education" || key == "requires-spec-training" || key == "requires-spec-work-exp" || key == "requires-competency" || (key == "specific_education_required" && !jobDataForm.dbInputEx["requires-spec-education"].isChecked()) || (key == "specific_training_required" && !jobDataForm.dbInputEx["requires-spec-training"].isChecked()) || (key == "specific_work_experience_required" && !jobDataForm.dbInputEx["requires-spec-work-exp"].isChecked()) || (key == "competency" && !jobDataForm.dbInputEx["requires-competency"].isChecked()))
                                                    {}
                                                    else
                                                    {
                                                        position[key] = jobDataForm.dbInputEx[key].getValue();
                                                    }
                                                }
                                                
                                                positions.push(position);
                                            });
                                            
                                            // DATA SETS PACKAGED IN JSON THAT HAVE SINGLE QUOTES SHOULD BE MODIFIED AS PACKAGED TEXT ARE NOT AUTOMATICALLY FIXED BY PHP AND SQL
                                            postData("/mpasis/php/process.php", "a=add&positions=" + JSON.stringify(positions).replace("'", "''"), (event)=>{
                                                var response;
    
                                                if (event.target.readyState == 4 && event.target.status == 200)
                                                {
                                                    response = JSON.parse(event.target.responseText);
    
                                                    if (response.type == "Error")
                                                    {
                                                        jobDataForm.raiseError(response.content);
                                                    }
                                                    else if (response.type == "Success")
                                                    {
                                                        jobDataForm.showSuccess(response.content);
                                                    }
                                                }
                                            });
                                            // console.log(positions);
                                        });
                                        jobDataBtnGrp.inputExs[1].setLabelText("Reset");
                                        jobDataBtnGrp.inputExs[1].setTooltipText("");
                                        jobDataBtnGrp.inputExs[1].addEvent("click", (event)=>{}); // TO IMPLEMENT IN FORMEX/INPUTEX
                                        jobDataBtnGrp.container.style.gridColumn = "8 / span 5";
                                        jobDataBtnGrp.setStatusMsgTimeout(20);


                                        var status = jobDataForm.addStatusPane();
                                        status.style.gridColumn = "1 / span 7";
                                    }
                                });
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
                                                postData("/mpasis/php/process.php", "a=addTempUser&person=" + JSON.stringify(person).replace("'", "''") + "&tempUser=" + JSON.stringify(tempUser).replace("'", "''"), (event)=>{
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
