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

function packageData(objData)
{
    return JSON.stringify(objData).replace(/'/g, /''/);
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

class ScrimEx
{
    constructor(parent = null)
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "scrim-ex", "style", "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #0008;");
        this.scrim["scrimEx"] = this;
        this.content = null;
        this.scrimEvents = [];
    }

    addContent(content)
    {
        this.content = content;
    }

    getContent()
    {
        return this.content;
    }

    addScrimEvent(eventType, func)
    {
        this.scrim.addEventListener(eventType, func);
        this.scrimEvents.push(func);
    }

    removeScrimEvent(eventType, func)
    {
        this.scrim.removeEventListener(eventType, this.scrimEvents.splice(this.scrimEvents.indexOf(func), 1)[0]);
    }

    destroy()
    {
        this.scrim.remove();
    }
}

class DisplayEx
{
    constructor(parent = null, typeText = "span", idStr = "", contentText = "", labelText = "", tooltip = "")
    {
        if (typeof(idStr) == "string" && idStr.trim() != "")
        {
            this.id = idStr;
        }
        this.container = createElementEx(NO_NS, (typeText == "span" ? "span" : "div"), parent, null, "class", "display-ex-container", "style", "display: inline-block;");
        this.content = createElementEx(NO_NS, typeText, this.container, null, "class", "display-ex", "style", "display: " + (typeText == "fieldset" ? "" : "inline-") + "block;");
        this.label = null;
        this.colon = null;
        this.type = typeText;
        this.inline = false;
        this.fullWidth = false;
        this.vertical = false;
        this.reversed = false;

        this.setHTMLContent(contentText);
        this.setLabelText(labelText);
        this.setTooltipText(tooltip);
    }

    setHTMLContent(htmlContent)
    {
        if (typeof(htmlContent) == "string")
        {
            this.content.innerHTML = htmlContent;
        }
    }

    addContent(content, parent = null)
    {
        if (Object.prototype.toString.call(parent) != "[object HTMLInputElement]")
        {
            parent = this.content;
        }

        parent.appendChild(content);

        return content;
    }

    addLineBreak(num = 1, parent = null)
    {
        while (num-- > 0)
        {
            this.addContent(createElementEx(NO_NS, "br"));
        }
    }

    getHTMLContent()
    {
        return this.content.innerHTML;
    }

    getContent()
    {
        return this.content.children;
    }

    setLabelText(labelText)
    {
        if (typeof(labelText) == "string" && labelText.trim() != "")
        {
            if (this.label == null)
            {
                this.label = createElementEx(NO_NS, (this.type == "fieldset" ? "legend" : "label"), (this.type == "fieldset" ? this.content : this.container), (this.type == "fieldset" ? this.content.children[0] : this.content));
                this.label.style.display = (this.vertical ? "block" : (this.inline ? "inline" : "inline-block"));
                if (this.type == "fieldset")
                {
                    this.content.insertBefore(document.createTextNode(" "), this.content.children[1]);
                }
                else
                {
                    this.container.insertBefore(document.createTextNode(" "), this.content);
                }
            }
            this.label.innerHTML = labelText;
            this.label.appendChild(this.colon = htmlToElement("<span class=\"colon hidden\">:</span>"));
            this.label.displayEx = this;

        }
    }

    getLabelText()
    {
        if (this.label != null)
        {
            return this.label.innerHTML;
        }

        return "";
    }

    setTooltipText(tooltipText)
    {
        if (typeof(tooltipText) == "string" && tooltipText.trim() != "")
        {
            this.container.title = tooltipText;
        }
    }

    getTooltipText()
    {
        if (this.container.title != null && this.container.title != undefined)
        {
            return this.container.title;
        }

        return "";
    }

    setVertical(vertical = true)
    {
        if (vertical)
        {
            this.container.style.display = (this.fullWidth ? "" : "inline-") + "flex";
            this.content.style.display = "block";
            if (this.label != null)
            {
                this.label.style.display = "block";
            }
            this.container.style.flexDirection = "column";
        }
        else
        {
            this.container.style.display = (this.fullWidth ? "" : "inline-") + "block";
            this.content.style.display = "inline-block";
            if (this.label != null)
            {
                this.label.style.display = "inline-block";
            }
            this.container.style.flexDirection = null;
        }
        this.vertical = vertical;
    }

    isVertical()
    {
        return this.vertical;
    }

    reverse(reverse = true)
    {
        if (this.label != null)
        {
            if (reverse)
            {
                this.container.insertBefore(this.content, this.label);
                this.container.appendChild(this.label);
            }
            else
            {
                this.container.insertBefore(this.content, this.label);
                this.container.appendChild(this.label);
            }
            this.reversed = reverse;
        }
    }

    isReversed()
    {
        return this.reversed;
    }

    setInline(inline = true)
    {
        if (inline)
        {
            this.container.style.display = "inline";
            this.content.style.display = "inline";
            if (this.label != null)
            {
                this.label.style.display = "inline";
            }

            this.vertical = false;
            this.fullWidth = false;
        }
        else
        {
            this.container.style.display = "inline-block";
            this.content.style.display = "inline-block";
            if (this.label != null)
            {
                this.label.style.display = "inline-block";
            }
        }
        this.inline = inline;
    }

    isInline()
    {
        return this.inline;
    }

    setFullWidth(fullWidth = true)
    {
        if (fullWidth)
        {
            this.container.style.display = (this.vertical ? "flex" : "block");
            this.content.style.display = (this.vertical ? "" : "inline-") + "block";
            if (this.label != null)
            {
                this.label.style.display = (this.vertical ? "" : "inline-") + "block";
            }

            this.inline = false;
        }
        else
        {
            this.container.style.display = "inline-" + (this.vertical ? "flex" : "block");
            this.content.style.display = (this.vertical ? "" : "inline-") + "block";
            if (this.label != null)
            {
                this.label.style.display = (this.vertical ? "" : "inline-") + "block";
            }
        }
        this.fullWidth = fullWidth;
    }

    isFullWidth()
    {
        return this.fullWidth;
    }

    showColon(show = true)
    {
        if (this.colon != null)
        {
            this.colon.classList.toggle("hidden", !show);
        }
    }

    hideColon()
    {
        this.showColon(false);
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
        this.hiddenDisplay = null;
        
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

        this.dataToFill = null;
        this.blankStyle = false;
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

    getDataValue()
    {
        var textValue = this.getValue();

        if (this.type == "combo" && textValue != "")
        {
            for (const option of Array.from(this.datalist.children)) {
                if (option.value == textValue)
                {
                    return option.getAttribute("data-value");
                }
            }
        }
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

        if (this.type != "radio-select" && this.type != "checkbox-select")//(!this.isMultipleInput)
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

    addItem(labelText, value = "", tooltipText = "") // only for combo (will add to datalist), radio-select, multiple-radio-select, buttons, and buttonExs
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
            case "combo":
                var option = createElementEx(NO_NS, "option", this.datalist, null, "value", labelText, "data-value", value);
                if (tooltipText != "")
                {
                    option.title = tooltipText; // HAS NO EFFECT!!!
                }
                return option;
                break;
            case "radio-select":
            case "checkbox-select":
            case "buttons":
            case "buttonExs":
                if (this.inputExs.length > 0)
                {
                    this.fieldWrapper.appendChild(document.createTextNode(" ")); // CONSIDER ADDING A REFERENCE TO THIS AS A "SPACER" JUST LIKE THE STATUSPANE SPACER BELOW
                }
                this.inputExs.push(new InputEx(this.fieldWrapper, this.id + (this.type.indexOf("-select") >= 0 ? this.inputExs.length : ""), (this.type.indexOf("-select") >= 0 ? this.type.slice(0, this.type.indexOf("-")) : this.type.slice(0, this.type.indexOf("s")))));
                this.fields.push(this.inputExs[this.inputExs.length - 1].fields[0]);
                this.inputExs[this.inputExs.length - 1].setLabelText(labelText);
                if (this.type.indexOf("-select") >= 0)
                {
                    if (value != "")
                    {
                        this.inputExs[this.inputExs.length - 1].setValue(value);  // MAY CAUSE ISSUES IF DEVELOPER DOESN'T TRACK THE NUMBER OF ITEMS WITHOUT LABELS THAT WERE MIXED WITH LABELED ITEMS
                    }
                    this.labels.push(this.inputExs[this.inputExs.length - 1].labels[0]);
                    // this.inputExs[this.inputExs.length - 1].setFullWidth();
                }
                if (tooltipText != "")
                {
                    this.inputExs[this.inputExs.length - 1].setTooltipText(tooltipText);
                }

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                if (this.type == "radio-select")
                {
                    this.setGroupName(this.id);
                    this.inputExs[this.inputExs.length - 1].fields[0].addEventListener("change", (event)=>{
                        for (const inputEx of this.inputExs)
                        {
                            if (inputEx.handleInlineTextboxExOnCheck != null)
                            {
                                inputEx.handleInlineTextboxExOnCheck();
                            }
                        }
                    });
                }

                return this.inputExs[this.inputExs.length - 1];
                break;
        }
    }

    addItems(...labelStrs) // only for combo (will add to datalist), radio-select, multiple-radio-select, buttons, and buttonExs; no tooltip
    {
        labelStrs.forEach(labelText=>{
            this.addItem(labelText);
        });
    }

    removeItemAt(index = 0)
    {
        if (Number.isInteger(index) && index >= 0 && index < this.inputExs.length)
        {
            switch (this.type)
            {
                case "radio-select":
                case "checkbox-select":
                case "buttons":
                case "buttonExs":
                    var inputEx = this.inputExs[index];
                    var spacer = inputEx.container.previousSibling;
        
                    if (this.inputExs.length > 1 && index > 0 && spacer != null && spacer != undefined && spacer.nodeName == "#text" && spacer.nodeType == 3 && spacer.textContent.trim() == "")
                    {
                        spacer.remove();
                    }
        
                    this.inputExs.splice(index, 1);
                    this.fields.splice(index, 1);

                    if (inputEx.labels.length == 1)
                    {
                        this.labels.splice(this.labels.findIndex(label=>label == inputEx.labels[0]), 1);
                    }

                    inputEx.container.remove();

                    break;
            }    
        }
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
                    this.resetStatus();
                    this.raiseError("AJAX Error: " + response.content);
                }
                else if (response.type == "Info")
                {
                    this.resetStatus();
                    this.showInfo(response.content);
                }
                else if (response.type == "Data")
                {
                    this.resetStatus();
                    data = JSON.parse(response.content);

                    this.data = data;

                    data.forEach(dataRow=>{
                        var label = (labelColName in dataRow ? dataRow[labelColName].toString() : "");
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
                else if (response.type == "Debug")
                {
                    this.resetStatus();
                    console.log("DEBUG: " + response.content);
                    new MsgBox(this.fieldWrapper, "DEBUG: " + response.content, "OK");
                }
            }
        });
    }

    fillItems(dataRows, labelColName = "", valueColName = "", tooltipColName = "")
    {
        this.isFilling = true;
        for (const dataRow of dataRows) {
            var label = dataRow[labelColName].toString();
            var value = (dataRow[valueColName] ?? "").toString();
            var tooltip = (dataRow[tooltipColName] ?? "").toString();
            this.addItem(label, value, tooltip);
            if (this.isReversed())
            {
                this.inputExs[this.inputExs.length - 1].reverse();
            }
        }
        this.isFilling = false;
    }

    setWidth(width = "none")
    {
        if (typeof(width) != "string")
        {
            throw("Invalid argument type: width:" + width);
        }

        width = width.trim();

        if (this.isMultipleInput && this.type != "combo")
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

    setBlankStyle()
    {
        switch (this.type)
        {
            case "checkbox":
            case "radio":
            case "checkbox-select":
            case "radio-select":
            case "button":
            case "buttonEx":
            case "buttons":
            case "buttonExs":
                break;
            default:
                this.fields[0].style.borderTop = "0 none";
                this.fields[0].style.borderLeft = "0 none";
                this.fields[0].style.borderRight = "0 none";
                this.fields[0].style.borderBottomWidth = "3px";
                break;
        }
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

    setStep(num = 1)
    {
        if (this.type == "number" || this.type == "range" || this.type == "date" || this.type == "datetime-local" || this.type == "month" || this.type == "time" || this.type == "week")
        {
            this.fields[0].step = num;
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

    hide(doHide = true)
    {
        this.container.classList.toggle("hidden", doHide);
        var display = this.hiddenDisplay;
        this.hiddenDisplay = (doHide ? this.container.style.display : null);
        this.container.style.display = (doHide ? null : display);
    }

    show()
    {
        this.hide(false);
    }

    isHidden()
    {
        this.container.classList.contains("hidden");
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
        this.boxes = {};
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
        this.formMode = 0; // 0: Adding/Creating Record; 1: Editing; 2: Viewing
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

    addBox(name = "", useSpan = false, parent = this.fieldWrapper)
    {
        if (typeof(name) == "string" && name.trim() != "")
        {
            if (isElement(parent))
            {
                this.boxes[name] = createElementEx(NO_NS, (useSpan ? "span" : "div"), parent, null);
                return this.boxes[name];
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

    // submitForm(url, query) // always post method
    // {}

    resetForm()
    {
        if (this.func.reset != null || this.func.reset != undefined)
        {
            this.func.reset();
        }
    }
}

class DialogEx
{
    constructor(parent = null, id = "")
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "dialog-ex-scrim", "style", "z-index: 10;");
        this.dialogBox = createElementEx(NO_NS, "div", this.scrim, null, "class", "dialog-ex");
        this.closeBtn = createElementEx(NO_NS, "button", this.dialogBox, null, "type", "button", "class", "dialog-ex-closeBtn", "title", "Close");
        this.closeBtn.innerHTML = "<span class=\"material-icons-round\" style=\"font-size: 1em; padding: 0; margin: 0;\">close</span>";
        this.closeBtn.addEventListener("click", (event)=>{
            this.close();
        });
        this.formEx = null;
        this.id = id;

        this.scrim.style = "position: fixed; top: 0; left: 0; bottom: 0; right: 0; background-color: #0008; display: flex; overflow: hidden; align-items: center; justify-content: center; font-size: 0.86em;";
        this.dialogBox.style = "border: 2px outset;  background-color: lightgray;  max-height: 50em;  max-width: 80%;  padding: 2em;  line-height: 2;";
        this.closeBtn.style = "break-after: always; float: right; padding: 0; margin:-2em -2em 0 0;";
    }

    addFormEx()
    {
        this.formEx = new FormEx(this.dialogBox, this.id + "-form-ex", false);

        return this.formEx;
    }

    gridDisplay(enable = true, gridTemplateColumns = "auto auto")
    {
        if (enable)
        {
            this.dialogBox.style.display = "grid";
            this.dialogBox.style.gridTemplateColumns = gridTemplateColumns;
        }
        else
        {
            this.dialogBox.style.display = null;
            this.dialogBox.style.gridTemplateColumns = null;
        }
    }

    close()
    {
        this.scrim.remove();
    }
}

class MsgBox extends DialogEx
{
    constructor(parent = null, message, type = "OK", ...func)
    {
        super(parent, "msgbox" + (new Date()).valueOf());
        this.message = message;
        this.addFormEx();
        this.messageContainer = this.formEx.addBox("message-container");
        this.messageContainer.innerHTML = message;
        
        this.btnGrp = new InputEx(this.dialogBox, "msgbox-btns" + (new Date()).valueOf(), "buttonExs");
        this.btnGrp.setFullWidth();
        this.btnGrp.fieldWrapper.classList.add("center");

        this.returnValue = -1;
        this.default = null;
        this.cancel = null;

        switch (type)
        {
            case "RETRYIGNORECANCEL":
                this.btnGrp.addItems("Retry", "Ignore", "Cancel");
                break;
            case "YESNO":
                this.btnGrp.addItems("Yes", "No");
                break;
            case "OKCANCEL":
                this.btnGrp.addItems("OK", "Cancel");
                break;
            case "CLOSE":
                this.btnGrp.addItems("Close");
                break;
            default: // OK
                this.btnGrp.addItems("OK");
                break;
        }

        for (var i = 0; i < this.btnGrp.fields.length; i++)
        {
            this.btnGrp.fields[this.btnGrp.fields.length - 1 - i].addEventListener("click", (clickEvent)=>{
                this.returnValue = i;
                this.close();
            });

            if (i > 0 && i < func.length + 1 && func[i - 1] != null)
            {
                this.btnGrp.fields[this.btnGrp.fields.length - 1 - i].addEventListener("click", func[i - 1]);
            }
        }
        this.btnGrp.fields[this.btnGrp.fields.length - 1].focus();
    }
}

class MPASIS_App
{
    constructor(container)
    {
        // change nav links into click event listeners
        this.navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        this.main = Array.from(container.querySelectorAll("main"))[0];
        this.mainSections = {};
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");
        this.processURL = "/mpasis/php/process.php";

        this.forms = {};

        for (const navLI of Array.from(this.navbar.querySelectorAll('li'))) {
            for (const link of Array.from(navLI.children)) {
                if (link.tagName == "A")
                {
                    link.removeAttribute("href");
                    
                    link.addEventListener("click", (clickEvent)=>{
                        this.navClick(navLI.id);
                    });
                }
            };
        };

        if (this.getCookie("current_view") == "" || this.getCookie("current_view") == undefined)
        {
            this.setCookie("current_view", "dashboard", 1);
        }

        // console.log(this.getCookie("current_view"));

        this.activateView(this.getCookie("current_view"));

        // document.getElementById(this.getCookie("current_view")).querySelectorAll("a")[0].click();
    }

    navClick(viewId)
    {
        switch(viewId)
        {
            case "sdo-home":
                console.log("Going Home");
                this.setCookie("current_view", "", -1);
                window.location = "/";
                break;
            case "signout":
                postData(window.location.href, "app=mpasis&a=logout", (postEvent)=>{
                    this.setCookie("current_view", "", -1);
                    window.location.reload(true);
                });
            default:
                this.setCookie("current_view", viewId, 1);
                this.activateView(viewId);
                break;
        }
    }

    activateView(viewId)
    {
        if (!("main-" + viewId in this.mainSections))
        {
            this.constructView(viewId);
        }
        
        if (viewId != "sdo-home" && viewId != "signout")
        {
            for (var keyId in this.mainSections)
            {
                this.mainSections[keyId].classList.toggle("hidden", (keyId != "main-" + viewId));
            }
        }
    }

    async constructView(viewId)
    {
        this.mainSections["main-" + viewId] = createElementEx(NO_NS, "section", this.main, null, "id", "main-" + viewId);

        switch(viewId)
        {
            case "dashboard":
                break;
            case "applicant":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Applicant Data</h2>";
                break;
            case "applicant-data-entry":
                this.constructApplicantDataForm();
                break;
            case "applicant-scoresheet":
                this.constructScoreSheet();
                break;
            case "job":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Job Openings</h2>";
                break;
            case "job-data-entry":
                this.constructJobDataForm();
                break;
            case "job-data-search":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Job Search</h2>";
                break;
            case "evaluation":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Evaluation</h2>";
                break;
            case "scores":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Scores and Rankings</h2>";
                break;
            case "tools":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Assessment Tools</h2>";
                break;
            case "account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Account</h2>";
                break;
            case "my-account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>My Account</h2>Change my username<br>Change my password<br>";
                break;
            case "other-account":
                var otherAccountFormEx = new FormEx(this.mainSections["main-" + viewId], "other-account-form-ex", false);

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
                    postData(this.processURL, "app=mpasis&a=fetch&f=tempuser&k=" + searchBox.getValue() + "%", (event)=>{
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
                                var viewer = otherAccountFormEx.boxes["list-users"];
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
                            postData(this.processURL, "app=mpasis&a=addTempUser&person=" + packageData(person) + "&tempUser=" + packageData(tempUser), (event)=>{
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
                
                var div = otherAccountFormEx.addBox("list-users");

                div.classList.add("query-results-users");

                break;
            case "settings":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Settings</h2>";
                break;
            default:
                break;
        }
    }

    constructJobDataForm()
    {
        this.forms["jobData"] = null;
        var field = null;
        var header = null;

        this.forms["jobData"] = new FormEx(this.mainSections["main-job-data-entry"], "job-data-form");
        this.forms["jobData"].fieldWrapper.style.display = "grid";
        this.forms["jobData"].fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
        this.forms["jobData"].fieldWrapper.style.gridAutoFlow = "column";
        this.forms["jobData"].fieldWrapper.style.gridGap = "1em";

        this.forms["jobData"].setFullWidth();
        this.forms["jobData"].setTitle("Job Data Entry", 2);

        field = this.forms["jobData"].addInputEx("Position Title", "text", "", "", "position_title", "Position");
        field.container.style.gridColumn = "1 / span 6";
        field.setVertical();
        field.showColon();

        this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Parenthetical Position Title", "text", "", "Enter in cases of parenthetical position titles, \ne.g., in \"Administrative Assistant (Secretary)\", \n\"Secretary\" is a parenthetical title.", "parenthetical_title", "Position");
        field.container.style.gridColumn = "7 / span 6";
        field.setPlaceholderText("(optional");
        field.setVertical();
        field.showColon();

        this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Salary Grade", "number", "1", "", "salary_grade", "Position");
        field.container.style.gridColumn = "1 / span 3";
        field.setVertical();
        field.showColon();
        field.setMin(0);
        field.setMax(33);
        field.addStatusPane();
        field.setStatusMsgTimeout(20);
        field.addEvent("change", (changeEvent)=>{
            postData(this.processURL, "app=mpasis&a=getSalaryFromSG&sg=" + changeEvent.target.inputEx.getValue(), (event)=>{
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

        this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Plantilla Item No.", "textarea", "", "", "plantilla_item_number", "Position");
        field.container.style.gridColumn = "4 / span 9";
        field.setFullWidth(false);
        field.setVertical();
        field.showColon();

        this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Please select the position category", "radio-select", "", "", "position_categoryId", "Position", true);
        field.container.style.gridColumn = "1 / span 12";
        field.reverse();
        field.runAfterFilling = function(){
            this.inputExs[0].check();
        };
        field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=positionCategory", "position_category", "position_categoryId", "description");
        
        this.forms["jobData"].addSpacer();
        
        header = this.forms["jobData"].addHeader("Qualification Standards", 3);
        header.style.marginBottom = "0";
        header.style.gridColumn = "1 / span 12";

        header = this.forms["jobData"].addHeader("Education", 4);
        header.style.gridColumn = "1 / span 12";

        field = this.forms["jobData"].addInputEx("Please select the minimum required educational attainment", "radio-select", "", "", "required_educational_attainment", "Position", true);
        field.container.style.gridColumn = "1 / span 6";
        field.container.style.gridRow = "span 4";
        field.reverse();
        field.setVertical();
        field.runAfterFilling = function(){
            this.inputExs[0].check();
        };
        field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=educLevel", "educational_attainment", "index", "description");
        
        // this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Position requires specific education", "checkbox", "", "", "requires-spec-education");
        field.labels[0].style.fontWeight = "bold";
        field.reverse();
        field.container.style.gridColumn = "7 / span 6";
        
        var specEduc = this.forms["jobData"].addInputEx("Please enter a description of the required education. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_education_required", "Position");
        specEduc.container.style.gridColumn = "7 / span 6";
        specEduc.container.style.gridRow = "span 3";
        specEduc.fields[0].style.height = "7em";
        specEduc.setVertical();
        specEduc.showColon();
        specEduc.disable();

        field.addEvent("change", (event)=>{
            specEduc.enable(0, event.target.inputEx.isChecked());
        });

        header = this.forms["jobData"].addHeader("Training", 4);
        header.style.gridColumn = "1 / span 12";
        
        field = this.forms["jobData"].addInputEx("Total hours of relevant training", "number", "0", "", "required_training_hours", "Position");
        field.container.style.gridColumn = "1 / span 6";
        field.container.style.gridRow = "span 3";
        // field.setVertical();
        field.showColon();
        field.setMin(0);
        field.setMax(999);
        field.setFullWidth();

        field = this.forms["jobData"].addInputEx("Position requires specific training", "checkbox", "", "", "requires-spec-training");
        field.labels[0].style.fontWeight = "bold";
        field.reverse();
        field.container.style.gridColumn = "7 / span 6";
        
        var specTraining = this.forms["jobData"].addInputEx("Please enter a description of the required training. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_training_required", "Position");
        specTraining.container.style.gridColumn = "7 / span 6";
        specTraining.container.style.gridRow = "span 2";
        specTraining.fields[0].style.height = "4em";
        specTraining.setVertical();
        specTraining.showColon();
        specTraining.disable();

        field.addEvent("change", (event)=>{
            specTraining.enable(0, event.target.inputEx.isChecked());
        });

        header = this.forms["jobData"].addHeader("Work Experience", 4);
        header.style.gridColumn = "1 / span 12";
        
        field = this.forms["jobData"].addInputEx("Total years of relevant work experience", "number", "0", "", "required_work_experience_years", "Position");
        field.container.style.gridColumn = "1 / span 6";
        field.container.style.gridRow = "span 3";
        // field.setVertical();
        field.showColon();
        field.setMin(0);
        field.setMax(99);
        field.setFullWidth();

        field = this.forms["jobData"].addInputEx("Position requires specific work experience", "checkbox", "", "", "requires-spec-work-exp");
        field.labels[0].style.fontWeight = "bold";
        field.reverse();
        field.container.style.gridColumn = "7 / span 6";
        
        var specExp = this.forms["jobData"].addInputEx("Please enter a description of the required work experience. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "specific_work_experience_required", "Position");
        specExp.container.style.gridColumn = "7 / span 6";
        specExp.container.style.gridRow = "span 2";
        specExp.fields[0].style.height = "4em";
        specExp.setVertical();
        specExp.showColon();
        specExp.disable();

        field.addEvent("change", (event)=>{
            specExp.enable(0, event.target.inputEx.isChecked());
        });

        header = this.forms["jobData"].addHeader("Career Service Eligibilities", 4);
        header.style.gridColumn = "1 / span 12";

        var eligField = this.forms["jobData"].addInputEx("Please select all the eligibilities required for this position", "checkbox-select", "", "", "required_eligibility", "Required_Eligibility", true);
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
                    newElig["eligibility"] = newEligText.getValue().trim();
                    if (newElig["eligibility"] == "")
                    {
                        addEligForm.raiseError("Eligibility name should not be blank.");
                    }
                    else
                    {
                        if (newElig["description"] != "")
                        {
                            newElig["description"] = descText.getValue().trim();
                        }

                        postData(this.processURL, "app=mpasis&a=add&eligibilities=" + packageData([newElig]), (event)=>{
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

                                        eligField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");
                                        
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
        eligField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");

        header = this.forms["jobData"].addHeader("Competency", 4);
        header.style.gridColumn = "1 / span 12";

        field = this.forms["jobData"].addInputEx("Position requires specific competency/competencies", "checkbox", "", "", "requires-competency");
        field.labels[0].style.fontWeight = "bold";
        field.reverse();
        field.container.style.gridColumn = "1 / span 12";
        
        var competency = this.forms["jobData"].addInputEx("Please enter a description of the required competencies, if applicable. This will guide evaluators in qualifying some applicants.", "textarea", "", "", "competency", "Position");
        competency.container.style.gridColumn = "1 / span 12";
        competency.container.style.gridRow = "span 2";
        competency.fields[0].style.height = "4em";
        competency.setVertical();
        competency.showColon();
        competency.disable();

        field.addEvent("change", (event)=>{
            competency.enable(0, event.target.inputEx.isChecked());
        });

        var jobDataBtnGrp = this.forms["jobData"].addFormButtonGrp(2);
        jobDataBtnGrp.setFullWidth();
        jobDataBtnGrp.container.style.gridColumn = "1 / span 12";
        jobDataBtnGrp.inputExs[0].setLabelText("Save");
        jobDataBtnGrp.inputExs[0].setTooltipText("");
        jobDataBtnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
            var plantillaItems = this.forms["jobData"].dbInputEx["plantilla_item_number"].getValue().replace(/\r/g,"").split("\n");
            plantillaItems = plantillaItems.map((value)=>{
                return value.trim();
            });

            plantillaItems = (this.forms["jobData"].dbInputEx["plantilla_item_number"].getValue().trim() == "" ? [] : plantillaItems);

            var positions = [];
            var position = null;

            plantillaItems.forEach((plantillaItem)=>{
                position = {};

                // console.log(this.forms["jobData"].dbInputEx);

                for (const key in this.forms["jobData"].dbInputEx) {
                    if (key == "plantilla_item_number")
                    {
                        position[key] = plantillaItem;
                    }
                    else if (key == "requires-spec-education" || key == "requires-spec-training" || key == "requires-spec-work-exp" || key == "requires-competency" || (key == "specific_education_required" && !this.forms["jobData"].dbInputEx["requires-spec-education"].isChecked()) || (key == "specific_training_required" && !this.forms["jobData"].dbInputEx["requires-spec-training"].isChecked()) || (key == "specific_work_experience_required" && !this.forms["jobData"].dbInputEx["requires-spec-work-exp"].isChecked()) || (key == "competency" && !this.forms["jobData"].dbInputEx["requires-competency"].isChecked()))
                    {}
                    else
                    {
                        position[key] = this.forms["jobData"].dbInputEx[key].getValue();
                    }
                }
                
                positions.push(position);
            });
            
            // DATA SETS PACKAGED IN JSON THAT HAVE SINGLE QUOTES SHOULD BE MODIFIED AS PACKAGED TEXT ARE NOT AUTOMATICALLY FIXED BY PHP AND SQL
            postData(this.processURL, "app=mpasis&a=add&positions=" + packageData(positions), (event)=>{
                var response;

                if (event.target.readyState == 4 && event.target.status == 200)
                {
                    response = JSON.parse(event.target.responseText);

                    if (response.type == "Error")
                    {
                        // this.forms["jobData"].raiseError(response.content);
                        new MsgBox(this.forms["jobData"].container, response.content, "OK");
                    }
                    else if (response.type == "Success")
                    {
                        // this.forms["jobData"].showSuccess(response.content);
                        new MsgBox(this.forms["jobData"].container, response.content, "OK");
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

        var status = this.forms["jobData"].addStatusPane();
        status.style.gridColumn = "1 / span 7";

        return this.forms["jobData"];
    }

    constructApplicantDataForm()
    {
        if (!("applicantData" in this.forms))
        {
            var header = null, field = null, applicant = null, searchedApplicants = null, row = null, getAppliedPosition;
            document.positions = [];
            document.mpsEducIncrement = [];

            document.scrim = new ScrimEx(this.main);

            this.forms["applicantData"] = new FormEx(this.mainSections["main-applicant-data-entry"], "applicant-data-form-ex", true);
            this.forms["applicantData"].setFullWidth();

            this.forms["applicantData"].fieldWrapper.style.display = "grid";
            this.forms["applicantData"].fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
            this.forms["applicantData"].fieldWrapper.style.gridAutoFlow = "column";
            this.forms["applicantData"].fieldWrapper.style.gridGap = "1em";

            this.forms["applicantData"].formMode = 0;
            
            header = this.forms["applicantData"].setTitle("Applicant Data Entry", 2);

            header = this.forms["applicantData"].addHeader("Position Applied", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            var positionField = this.forms["applicantData"].addInputEx("Position Title", "combo", "", "Please select the position title from the drop-down menu. You may type on the text box to filter the positions.", "position_title_applied", "Job_Application");
            positionField.container.style.gridColumn = "1 / span 4";
            positionField.setVertical();
            
            var parenField = this.forms["applicantData"].addInputEx("Parenthetical Title", "combo", "", "Please select the parenthetical position titles available from the drop-down menu. You may type on the text box to filter the entries.", "parenthetical_title_applied", "Job_Application");
            parenField.setPlaceholderText("(optional)");
            parenField.container.style.gridColumn = "5 / span 4";
            parenField.setVertical();

            var plantillaField = this.forms["applicantData"].addInputEx("Plantilla Item Number", "combo", "", "Please select the plantilla item numbers available from the drop-down menu or select ANY instead. You may type on the text box to filter the entries.", "plantilla_item_number_applied", "Job_Application");
            plantillaField.container.style.gridColumn = "9 / span 4";
            plantillaField.setVertical();

            getAppliedPosition = function(positionsArray, positionField, parenField, plantillaField){
                if (plantillaField.getValue() == "ANY")
                {
                    return positionsArray.find(position=>position["position_title"] == positionField.getValue());
                }
                else if (plantillaField.getValue() != "")
                {
                    return positionsArray.find(position=>position["plantilla_item_number"] == plantillaField.getValue());
                }
            }

            header = this.forms["applicantData"].addHeader("Personal Information", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";
            
            var searchExistingApplicant = this.forms["applicantData"].addInputEx("Search for existing applicants", "combo", "", "Type some names to search for possible matches", "", "");
            searchExistingApplicant.container.classList.add("right");
            searchExistingApplicant.container.style.gridColumn = "1 / span 12";
            searchExistingApplicant.addStatusPane();
            searchExistingApplicant.statusPane.style.display = "block";
            searchExistingApplicant.statusPane.style.height = "1.5em";
            searchExistingApplicant.showColon();

            field = this.forms["applicantData"].addInputEx("Given Name", "text", "", "First Name", "given_name", "Person");
            field.container.style.gridColumn = "1 / span 4";
            field.setVertical();
            
            field = this.forms["applicantData"].addInputEx("Middle Name", "text", "", "Middle Name", "middle_name", "Person");
            field.setPlaceholderText("(optional)");
            field.container.style.gridColumn = "5 / span 4";
            field.setVertical();

            field = this.forms["applicantData"].addInputEx("Family Name", "text", "", "Last Name", "family_name", "Person");
            field.container.style.gridColumn = "9 / span 4";
            field.setVertical();

            field = this.forms["applicantData"].addInputEx("Spouse's Name", "text", "", "Spouse's Name; for married women", "spouse_name", "Person");
            field.setPlaceholderText("(optional)");
            field.container.style.gridColumn = "1 / span 4";
            field.setVertical();

            field = new DisplayEx(this.forms["applicantData"].fieldWrapper, "span", "", " "); // A sort of make-shift spacer
            field.container.style.gridColumn = "5 / span 4";


            field = this.forms["applicantData"].addInputEx("Ext. Name", "text", "", "Extension Name (e.g., Jr., III, etc.)", "ext_name", "Person");
            field.setPlaceholderText("(optional)");
            field.container.style.gridColumn = "9 / span 4";
            field.setVertical();

            field = this.forms["applicantData"].addInputEx("Address", "textarea", "", "Present/Permanent Address", "address", "Address"); // use present address for now; prefer localization
            field.container.style.gridColumn = "1 / span 12";
            field.setVertical();

            field = this.forms["applicantData"].addInputEx("Age", "number", "", "Age", "age", "Person");
            field.container.style.gridColumn = "1 / span 4";
            field.setVertical();
            field.setMin(10);
            field.setMax(999);
            field.setValue(18);

            field = this.forms["applicantData"].addInputEx("Sex", "combo", "", "Sex", "sex", "Person");
            field.container.style.gridColumn = "5 / span 4";
            field.setVertical();
            field.addItem("Male");
            field.addItem("Female");

            field = this.forms["applicantData"].addInputEx("Civil Status", "combo", "", "Civil Status", "civil_status", "Person"); // Cross-reference
            field.container.style.gridColumn = "9 / span 4";
            field.setVertical();
            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=civilStatus", "civil_status", "index", "description");

            field = this.forms["applicantData"].addInputEx("Religion", "combo", "", "Religious Affiliation", "religion", "Person"); // Cross-reference; Allow adding new
            field.container.style.gridColumn = "1 / span 4";
            field.setVertical();
            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=religion", "religion", "religionId", "description");

            field = this.forms["applicantData"].addInputEx("Disability", "combo", "", "Disability; if multiple, please separate with semi-colons", "disability", "Person_Disability"); // Multiple cross-reference; Allow adding new
            field.container.style.gridColumn = "5 / span 4";
            field.setVertical();
            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=disability", "disability", "disabilityId", "description");

            field = this.forms["applicantData"].addInputEx("Ethnic Group", "combo", "", "Ethnic Group", "ethnicity", "Person"); // Cross-reference; Allow adding new
            field.container.style.gridColumn = "9 / span 4";
            field.setVertical();
            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=ethnicGroup", "ethnic_group", "ethnicityId", "description");

            field = this.forms["applicantData"].addInputEx("Email Address", "email", "", "Email address; if multiple, please separate with semi-colons", "email_address", "Email_Address"); // Multiple cross-reference; Allow adding new
            field.container.style.gridColumn = "1 / span 6";
            field.setVertical();

            field = this.forms["applicantData"].addInputEx("Contact Number", "text", "", "Contact numbers; if multiple, please separate with semi-colons", "contact_number", "Contact_Number");
            field.container.style.gridColumn = "7 / span 6";
            field.setVertical();

            header = this.forms["applicantData"].addHeader("Educational Attainment", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            var educField = this.forms["applicantData"].addInputEx("Please choose the highest level completed", "radio-select", "1", "Highest finished educational level", "educational_attainment", "Person", true);
            educField.container.style.gridColumn = "1 / span 6";
            educField.container.style.gridRow = "span 3";
            educField.setVertical();
            educField.showColon();
            educField.reverse();

            var postGradUnitsField = this.forms["applicantData"].addInputEx("Post-Graduate Units", "number", "0", "Post-graduate units taken toward the completion of the next post-graduate degree", "postgraduate_units", "Person");
            postGradUnitsField.container.style.gridColumn = "7 / span 6";
            postGradUnitsField.setVertical();
            postGradUnitsField.setMin(0);
            postGradUnitsField.setMax(999);
            postGradUnitsField.setValue(0);
            postGradUnitsField.disable();

            var completeAcadReqField = this.forms["applicantData"].addInputEx("Complete Academic Requirements completed towards a post-graduate degree", "checkbox", "", "Mark this if applicant has completed all academic requirements but has not yet received the post-graduate degree.", "complete_academic_requirements", "Person");
            completeAcadReqField.container.style.gridColumn = "7 / span 6";
            completeAcadReqField.reverse();
            completeAcadReqField.disable();

            var displaySpecEduc = new DisplayEx(this.forms["applicantData"].fieldWrapper, "fieldset", "", "", "Specific Educational Requirements of the Position", "The position applied requires this specific educational attainment.");
            displaySpecEduc.container.style.gridColumn = "7 / span 6";
            var reqSpecEduc = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
            addText("NONE", reqSpecEduc);
            displaySpecEduc.addContent(reqSpecEduc);
            displaySpecEduc.addLineBreak(2);
            var specEducAttained = this.forms["applicantData"].addInputEx("Applicant possesses this specific educational requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required education.", "has_specific_education_required", "Job_Application");
            displaySpecEduc.addContent(specEducAttained.container);
            specEducAttained.reverse();
            specEducAttained.disable();

            var displayEducIncrement = new DisplayEx(this.forms["applicantData"].fieldWrapper, "div", "educ-increment-display-ex", "", "Education Increment Level");
            displayEducIncrement.container.style.gridColumn = "1 / span 12";
            displayEducIncrement.container.style.fontSize = "1.2em";
            displayEducIncrement.container.style.fontStyle = "italic";
            displayEducIncrement.container.classList.add("right");
            displayEducIncrement.label.style.fontWeight = "bold";
            displayEducIncrement.showColon();
            var attainedEducIncrement = createElementEx(NO_NS, "span", null, null, "class", "attained-educ-increment", "title", "The applicant's increment level in education");
            addText("0", attainedEducIncrement);
            var requiredEducIncrement = createElementEx(NO_NS, "span", null, null, "class", "required-educ-increment", "title", "The position's required education increment level");
            addText("0", requiredEducIncrement);
            displayEducIncrement.addContent(attainedEducIncrement);
            displayEducIncrement.addContent(document.createTextNode(" / "));
            displayEducIncrement.addContent(requiredEducIncrement);
            displayEducIncrement.addContent(document.createTextNode(" "));
            var remarkEduc = createElementEx(NO_NS, "span", null, null, "class", "remark");
            addText("(Not Required)", remarkEduc);
            displayEducIncrement.addContent(remarkEduc);

            var computeEducIncrementLevel = ()=>{
                var educAttainment = educField.getValue();
                var postGradUnits = (postGradUnitsField.isDisabled() || educAttainment <= 5 || educAttainment >= 8 ? null : postGradUnitsField.getValue());
                var completeAcadReq = (!completeAcadReqField.isDisabled() && completeAcadReqField.isChecked() ? 1 : 0);
                var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);

                var incrementObj = document.mpsEducIncrement.filter(increment=>(
                    increment["baseline_educational_attainment"] == educAttainment
                    && (postGradUnits == null
                    || (postGradUnits != null && increment["baseline_postgraduate_units"] <= postGradUnits))
                    && increment["complete_academic_requirements"] == completeAcadReq
                ));

                // console.log([educAttainment, postGradUnits, completeAcadReq]);                
                // console.log(incrementObj[incrementObj.length - 1]);
                
                var increment = (incrementObj.length > 0 ? incrementObj[incrementObj.length - 1]["education_increment_level"] : -1);
            
                if (appliedPosition != null && increment >= Number.parseInt(requiredEducIncrement.innerHTML) && (specEducAttained.isDisabled() || specEducAttained.isChecked()))
                {
                    remarkEduc.innerHTML = "(Qualified)";
                    remarkEduc.style.color = "green";
                }
                else
                {
                    remarkEduc.innerHTML = "(Not Qualified)";
                    remarkEduc.style.color = "red";
                }

                return increment;
            };

            completeAcadReqField.addEvent("change", changeEvent=>{
                postGradUnitsField.enable(null, !completeAcadReqField.isChecked());
                attainedEducIncrement.innerHTML = computeEducIncrementLevel();
            });

            postGradUnitsField.addEvent("change", changeEvent=>{
                attainedEducIncrement.innerHTML = computeEducIncrementLevel();
            });

            specEducAttained.addEvent("change", changeEvent=>{
                attainedEducIncrement.innerHTML = computeEducIncrementLevel();
            });

            educField.runAfterFilling = function(){
                for (const inputEx of educField.inputExs)
                {
                    inputEx.addEvent("change", changeEvent=>{
                        if (educField.getValue() > 5 && educField.getValue() < 8)
                        {
                            postGradUnitsField.enable(null, !completeAcadReqField.isChecked());
                            completeAcadReqField.enable();
                            completeAcadReqField.setLabelText("Complete Academic Requirements completed towards a " + (educField.getValue() == 6 ? "Master's Degree" : "Doctorate"));
                        }
                        else
                        {
                            postGradUnitsField.disable();
                            completeAcadReqField.disable();
                            completeAcadReqField.setLabelText("Complete Academic Requirements completed towards a post-graduate degree");
                        }

                        attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                    });
                }
/* 
                this.addOtherOption("Other", "-1", "Please specify another level of education", "<i>(Please specify):</i>", function(event){
                    if (Object.prototype.toString.call(this) == "[object Object]")
                    {
                        this.inlineTextboxEx.enable(null, this.isChecked());
                    }
                    else if (Object.prototype.toString.call(this) == "[object HTMLInputElement]")
                    {
                        this.inputEx.inlineTextboxEx.enable(null, this.inputEx.isChecked());
                    }
                });
*/
            };
            educField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=educLevel", "educational_attainment", "index", "description");

            header = this.forms["applicantData"].addHeader("Training", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            var trainingDiv = createElementEx(NO_NS, "fieldset", this.forms["applicantData"].fieldWrapper, null);
            trainingDiv.style.gridColumn = "1 / span 12";
            var trainingContainer = createElementEx(NO_NS, "table", trainingDiv, null, "style", "width: 100%; border-collapse: collapse;");
            row = createElementEx(NO_NS, "tr", createElementEx(NO_NS, "thead", trainingContainer, null), null, "style", "font-size: 0.8em;");
            addText("Training Name/Description", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "background-color: lightgray;"));
            addText("Hours", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 5em; background-color: lightgray;"));
            createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 0.5em; border: none;")
            trainingContainer = createElementEx(NO_NS, "tbody", trainingContainer, null);

            row = createElementEx(NO_NS, "tr", createElementEx(NO_NS, "tfoot", trainingContainer.parentElement, null), null, "style", "font-size: 0.8em;");
            addText("Total number of hours of training:", createElementEx(NO_NS, "td", row, null, "class", "bordered right", "style", "background-color: lightgray;"));
            var totalTrainingHours = createElementEx(NO_NS, "td", row, null, "class", "bordered right", "style", "width: 5em; background-color: lightgray; font-weight: bold; font-size: 0.8em;");
            addText("0 hours", totalTrainingHours);

            var addTrainingBtn = new InputEx(trainingDiv, "add-applicant-training", "buttonEx");
            addTrainingBtn.setLabelText("+Add a row");
            var trainingInputExs = [];

            var moreTraining = new InputEx(trainingDiv, "has_more_unrecorded_training", "checkbox");    
            moreTraining.setLabelText("There are more training certificates and/or MOVs presented for this application that were no longer included in this list for encoding.");
            moreTraining.reverse();

            var displaySpecTraining = new DisplayEx(this.forms["applicantData"].fieldWrapper, "fieldset", "", "", "Specific Training Requirements of the Position", "The position applied requires this specific training.");
            displaySpecTraining.container.style.gridColumn = "1 / span 12";
            var reqSpecTraining = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
            addText("NONE", reqSpecTraining);
            displaySpecTraining.addContent(reqSpecTraining);
            displaySpecTraining.addLineBreak(2);
            var specTrainingAttained = this.forms["applicantData"].addInputEx("Applicant possesses this specific training requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required training.", "has_specific_training", "Job_Application");
            displaySpecTraining.addContent(specTrainingAttained.container);
            specTrainingAttained.reverse();
            specTrainingAttained.disable();

            var computeTrainingIncrementLevel = ()=>{
                var totals = trainingInputExs.map(training=>{
                    return training["trainingHoursInputEx"].getValue();
                });

                var total = (totals.length > 0 ? totals.reduce((total, value)=>Number.parseInt(total) + Number.parseInt(value)) : 0);
                totalTrainingHours.innerHTML = total + (total > 1 ? " hours" : " hour");

                var increment = Math.trunc(total / 8) + 1;

                increment = (increment > 31 ? 31 : increment);

                var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);

                if (appliedPosition != null && appliedPosition["required_training_hours"] <= total && increment >= Number.parseInt(requiredTrainingIncrement.innerHTML) && (specTrainingAttained.isDisabled() || specTrainingAttained.isChecked()))
                {
                    remarkTraining.innerHTML = "(Qualified)";
                    remarkTraining.style.color = "green";
                }
                else
                {
                    remarkTraining.innerHTML = "(Not Qualified)";
                    remarkTraining.style.color = "red";
                }

                return increment;
            };

            addTrainingBtn.addEvent("click", (clickEvent)=>{
                row = createElementEx(NO_NS, "tr", trainingContainer);

                var timestamp = (new Date()).valueOf();
                trainingInputExs.push({
                    "trainingInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "training-" + timestamp, "text"),
                    "trainingHoursInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "trainingHours-" + timestamp, "number")
                });

                trainingInputExs[trainingInputExs.length - 1]["trainingHoursInputEx"].setValue("0");

                trainingInputExs[trainingInputExs.length - 1]["trainingHoursInputEx"].addEvent("change", changeEvent=>{
                    attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
                });

                var removeRowBtn = new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (trainingInputExs.length - 1), "buttonEx");
                removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 50%; color: red;\">close</span></b>");
                removeRowBtn.fields[0].style.borderRadius = "1em";
                removeRowBtn.fields[0].style.padding = 0;
                removeRowBtn.fields[0].style.fontSize = "0.5em";
                removeRowBtn["row"] = row;
                removeRowBtn["rowData"] = trainingInputExs[trainingInputExs.length - 1];
                removeRowBtn.addEvent("click", (removeClickEvent)=>{
                    var msg = new MsgBox(this.forms["applicantData"].fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                        trainingInputExs.splice(trainingInputExs.indexOf(removeRowBtn.rowData), 1);
                        removeRowBtn.row.remove();
                        attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
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
                trainingInputExs[trainingInputExs.length - 1].trainingHoursInputEx.fields[0].style.textAlign = "right";
            });
            specTrainingAttained.addEvent("change", changeEvent=>{
                attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
            });

            var displayTrainingIncrement = new DisplayEx(this.forms["applicantData"].fieldWrapper, "div", "training-increment-display-ex", "", "Training Increment Level");
            displayTrainingIncrement.container.style.gridColumn = "1 / span 12";
            displayTrainingIncrement.container.style.fontSize = "1.2em";
            displayTrainingIncrement.container.style.fontStyle = "italic";
            displayTrainingIncrement.container.classList.add("right");
            displayTrainingIncrement.label.style.fontWeight = "bold";
            displayTrainingIncrement.showColon();
            var attainedTrainingIncrement = createElementEx(NO_NS, "span", null, null, "class", "attained-training-increment", "title", "The applicant's increment level in training");
            addText("0", attainedTrainingIncrement);
            var requiredTrainingIncrement = createElementEx(NO_NS, "span", null, null, "class", "required-training-increment", "title", "The position's required training increment level");
            addText("0", requiredTrainingIncrement);
            displayTrainingIncrement.addContent(attainedTrainingIncrement);
            displayTrainingIncrement.addContent(document.createTextNode(" / "));
            displayTrainingIncrement.addContent(requiredTrainingIncrement);
            displayTrainingIncrement.addContent(document.createTextNode(" "));
            var remarkTraining = createElementEx(NO_NS, "span", null, null, "class", "remark");
            addText("(Not Required)", remarkTraining);
            displayTrainingIncrement.addContent(remarkTraining);
            
            header = this.forms["applicantData"].addHeader("Work Experience", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            var workExpDiv = createElementEx(NO_NS, "fieldset", this.forms["applicantData"].fieldWrapper, null);
            workExpDiv.style.gridColumn = "1 / span 12";
            var workExpContainer = createElementEx(NO_NS, "table", workExpDiv, null, "style", "width: 100%; border-collapse: collapse;");
            row = createElementEx(NO_NS, "tr", createElementEx(NO_NS, "thead", workExpContainer, null), null, "style", "font-size: 0.8em;");
            addText("Work Experience Details", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "background-color: lightgray;"));
            addText("Start Date", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 8em; background-color: lightgray;"));
            addText("End Date", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 8em; background-color: lightgray;"));
            addText("Duration", createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 8em; background-color: lightgray;"));
            createElementEx(NO_NS, "th", row, null, "class", "bordered", "style", "width: 0.5em; border: none;")
            workExpContainer = createElementEx(NO_NS, "tbody", workExpContainer, null);

            row = createElementEx(NO_NS, "tr", createElementEx(NO_NS, "tfoot", workExpContainer.parentElement, null), null, "style", "font-size: 0.8em;");
            addText("Cumulative duration of work experience:", createElementEx(NO_NS, "td", row, null, "class", "bordered right", "style", "background-color: lightgray;", "colspan", 3));
            var totalWorkExpDuration = createElementEx(NO_NS, "td", row, null, "class", "bordered right", "style", "width: 5em; background-color: lightgray; font-weight: bold; font-size: 0.8em;");
            addText("0 days", totalWorkExpDuration);

            var addWorkExpBtn = new InputEx(workExpDiv, "add-applicant-workExp", "buttonEx");
            addWorkExpBtn.setLabelText("+Add a row");
            var workExpInputExs = [];

            var moreWorkExp = new InputEx(workExpDiv, "has_more_unrecorded_work_experience", "checkbox");    
            moreWorkExp.setLabelText("There are more work experience information that were no longer included in this list for encoding.");
            moreWorkExp.reverse();

            var displaySpecWorkExp = new DisplayEx(this.forms["applicantData"].fieldWrapper, "fieldset", "", "", "Specific Work Experience Requirements of the Position", "The position applied requires this specific work experience.");
            displaySpecWorkExp.container.style.gridColumn = "1 / span 12";
            var reqSpecWorkExp = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
            addText("NONE", reqSpecWorkExp);
            displaySpecWorkExp.addContent(reqSpecWorkExp);
            displaySpecWorkExp.addLineBreak(2);
            var specWorkExpAttained = this.forms["applicantData"].addInputEx("Applicant possesses this specific work experience requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required work experience.", "has_specific_work_experience", "Job_Application");
            displaySpecWorkExp.addContent(specWorkExpAttained.container);
            specWorkExpAttained.reverse();
            specWorkExpAttained.disable();

            var displayWorkExpIncrement = new DisplayEx(this.forms["applicantData"].fieldWrapper, "div", "work-exp-increment-display-ex", "", "Work Experience Increment Level");
            displayWorkExpIncrement.container.style.gridColumn = "1 / span 12";
            displayWorkExpIncrement.container.style.fontSize = "1.2em";
            displayWorkExpIncrement.container.style.fontStyle = "italic";
            displayWorkExpIncrement.container.classList.add("right");
            displayWorkExpIncrement.label.style.fontWeight = "bold";
            displayWorkExpIncrement.showColon();
            var attainedWorkExpIncrement = createElementEx(NO_NS, "span", null, null, "class", "attained-work-exp-increment", "title", "The applicant's increment level in work experience");
            addText("0", attainedWorkExpIncrement);
            var requiredWorkExpIncrement = createElementEx(NO_NS, "span", null, null, "class", "required-work-exp-increment", "title", "The position's required work experience increment level");
            addText("0", requiredWorkExpIncrement);
            displayWorkExpIncrement.addContent(attainedWorkExpIncrement);
            displayWorkExpIncrement.addContent(document.createTextNode(" / "));
            displayWorkExpIncrement.addContent(requiredWorkExpIncrement);
            displayWorkExpIncrement.addContent(document.createTextNode(" "));
            var remarkWorkExp = createElementEx(NO_NS, "span", null, null, "class", "remark");
            addText("(Not Required)", remarkWorkExp);
            displayWorkExpIncrement.addContent(remarkWorkExp);

            var diffDate = (startDate, endDate)=>{
                [startDate, endDate] = [new Date(startDate), new Date(endDate)];
                var start = {m:startDate.getMonth(), d:startDate.getDate(), y:startDate.getFullYear()};
                var end = {m:endDate.getMonth(), d:endDate.getDate(), y:endDate.getFullYear()};

                var years, months, days, leapCount;

                [years, months, days] = [end.y - start.y, end.m - start.m, end.d - start.d + 1];
                // leapCount = Math.trunc(years / 4) + (years < 4 && (start.y % 4 == 0 || end.y % 4 < start.y % 4) ? 1 : 0);
                const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                if (days <= 0)
                {
                    months--;
                    days += daysPerMonth[(end.m == 0 ? 12 : end.m - 1)] + (end.y % 4 == 0 && end.m >= 1 || start.y % 4 == 0 && start.m <= 1 ? 1 : 0); // also adjust for leap years
                }

                if (months < 0)
                {
                    years--;
                    months += 12;
                }

                if (years < 0)
                {
                    days = Math.trunc((endDate - startDate) / 1000 / 60 / 60 / 24);
                    days -= (days == 0 ? 1 : 0);
                    months = 0;
                    years = 0;
                }

                if (days >= daysPerMonth[(end.m == 0 ? 12 : end.m - 1)] + (end.y % 4 == 0 && end.m >= 1 || start.y % 4 == 0 && start.m <= 1 ? 1 : 0))
                {
                    days -= daysPerMonth[(end.m == 0 ? 12 : end.m - 1)] + (end.y % 4 == 0 && end.m >= 1 || start.y % 4 == 0 && start.m <= 1 ? 1 : 0);
                    months++;

                    if (months >= 12)
                    {
                        months -= 12;
                        years++;
                    }
                }

                return {y:years, m:months, d:days};
            };

            var computeWorkExpIncrement = ()=>{ // APPROXIMATION ONLY!!!
                var totals = workExpInputExs.map(workExp=>{
                    var defaultEnd = "2023-04-04";// (new Date()).toLocaleDateString();
                    var start = workExp["workExpStartDateInputEx"].getValue();
                    var end = workExp["workExpEndDateInputEx"].getValue();
                    end = (end == "" ? defaultEnd : end);

                    // var duration = Date.parse(end) - Date.parse(start);
                    var dur = diffDate(start, end);

                    workExp["workExpDuration"].setHTMLContent((isNaN(dur.y) || isNaN(dur.m) || isNaN(dur.d) ? "Invalid date(s)" : (dur.y > 0 ? dur.y + "&nbsp;year" + (dur.y == 1 ? "" : "s") : "") + (dur.m > 0 ? (dur.y > 0 ? ", " : "") + dur.m + "&nbsp;month" + (dur.m == 1 ? "" : "s") : "") + (dur.y + dur.m > 0 && dur.d != 0 ? ", " : "") + (dur.y + dur.m > 0 && dur.d == 0 ? "" : dur.d + "&nbsp;day" + (dur.d == 1 ? "" : "s"))));

                    return dur;
                });

                var total = (totals.length > 0 ? totals.reduce((totalDuration, duration)=>{
                    var years, months, days;
                    [years, months, days] = [totalDuration.y + duration.y, totalDuration.m + duration.m, totalDuration.d + duration.d];

                    months += Math.trunc(days / 30);
                    days %= 30;

                    years += Math.trunc(months / 12);
                    months %= 12;

                    return {y:years, m:months, d:days};
                }) : {y:0, m:0, d:0});
                
                totalWorkExpDuration.innerHTML = (total.y > 0 ? total.y + "&nbsp;year" + (total.y == 1 ? "" : "s") : "") + (total.m > 0 ? (total.y > 0 ? ", " : "") + total.m + "&nbsp;month" + (total.m == 1 ? "" : "s") : "") + (total.y + total.m > 0 && total.d != 0 ? ", " : "") + (total.y + total.m > 0 && total.d == 0 ? "" : total.d + "&nbsp;day" + (total.d == 1 ? "" : "s"));

                var increment = Math.trunc((total.y * 12 + total.m + total.d / 30) / 6) + 1;

                if (increment >= Number.parseInt(requiredWorkExpIncrement.innerHTML) && (specWorkExpAttained.isDisabled() || specWorkExpAttained.isChecked()))
                {
                    remarkWorkExp.innerHTML = "(Qualified)";
                    remarkWorkExp.style.color = "green";
                }
                else
                {
                    remarkWorkExp.innerHTML = "(Not Qualified)";
                    remarkWorkExp.style.color = "red";
                }

                return increment;
            };

            addWorkExpBtn.addEvent("click", clickEvent=>{
                row = createElementEx(NO_NS, "tr", workExpContainer);

                var timestamp = (new Date()).valueOf();
                workExpInputExs.push({
                    "workExpInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExp-" + timestamp, "text"),
                    "workExpStartDateInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExpStart-" + timestamp, "date"),
                    "workExpEndDateInputEx": new InputEx(createElementEx(NO_NS, "td", row, null, "class", "bordered"), "workExpEnd-" + timestamp, "date"),
                    "workExpDuration": new DisplayEx(createElementEx(NO_NS, "td", row, null, "class", "bordered right", "style", "font-size: 0.8em;"), "div", "workExpDuration-" + timestamp, "0 days")
                });

                workExpInputExs[workExpInputExs.length - 1]["workExpEndDateInputEx"].setTooltipText("Leave blank if still employed");

                workExpInputExs[workExpInputExs.length - 1]["workExpStartDateInputEx"].addEvent("change", changeEvent=>{
                    attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                });
                workExpInputExs[workExpInputExs.length - 1]["workExpEndDateInputEx"].addEvent("change", changeEvent=>{
                    attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                });
                
                var removeRowBtn = new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (workExpInputExs.length - 1), "buttonEx")
                removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 50%; color: red;\">close</span></b>");
                removeRowBtn.fields[0].style.borderRadius = "1em";
                removeRowBtn.fields[0].style.padding = 0;
                removeRowBtn.fields[0].style.fontSize = "0.5em";
                removeRowBtn["row"] = row;
                removeRowBtn["rowData"] = workExpInputExs[workExpInputExs.length - 1];
                removeRowBtn.addEvent("click", (removeClickEvent)=>{
                    var msg = new MsgBox(this.forms["applicantData"].fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                        workExpInputExs.splice(workExpInputExs.indexOf(removeRowBtn.rowData), 1);
                        removeRowBtn.row.remove();
                        attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                    });
                });

                workExpInputExs[workExpInputExs.length - 1].workExpInputEx.setFullWidth();
                workExpInputExs[workExpInputExs.length - 1].workExpInputEx.setPlaceholderText("Enter a descriptive name for the work experience");
                workExpInputExs[workExpInputExs.length - 1].workExpInputEx.fields[0].style.width = "100%";
                workExpInputExs[workExpInputExs.length - 1].workExpStartDateInputEx.setFullWidth();
                workExpInputExs[workExpInputExs.length - 1].workExpStartDateInputEx.fields[0].style.width = "100%";
                workExpInputExs[workExpInputExs.length - 1].workExpEndDateInputEx.setFullWidth();
                workExpInputExs[workExpInputExs.length - 1].workExpEndDateInputEx.fields[0].style.width = "100%";

            });

            specWorkExpAttained.addEvent("change", changeEvent=>{
                attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
            });            

            header = this.forms["applicantData"].addHeader("Eligibility", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            field = this.forms["applicantData"].addInputEx("Please select all the career service eligibility that the applicant possesses", "checkbox-select", "", "CS Eligibility", "eligibilityId", "Person", true);
            field.container.style.gridColumn = "1 / span 12";
            field.setVertical();
            field.showColon();
            field.reverse();

            var displayEligQualification = new DisplayEx(this.forms["applicantData"].fieldWrapper, "div", "eligibility-qualification-display-ex", "", "Eligibility", "The applicant's qualification according to possessed eligibility");
            displayEligQualification.container.style.gridColumn = "1 / span 12";
            displayEligQualification.container.style.fontSize = "1.2em";
            displayEligQualification.container.style.fontStyle = "italic";
            displayEligQualification.container.classList.add("right");
            displayEligQualification.label.style.fontWeight = "bold";
            displayEligQualification.showColon();
            var remarkElig = createElementEx(NO_NS, "span", null, null, "class", "remark");
            addText("Not Required", remarkElig);
            displayEligQualification.addContent(remarkElig);

            var validateEligibility = (eligibilities = [], requiredEligibilities = [[]])=>{
                var isEligibleInAll = [];

                for (const requiredEligibilitySet of requiredEligibilities) {
                    var isEligibleInOne = false;

                    for (const eligibility of eligibilities)
                    {
                        for (const requiredEligibility of requiredEligibilitySet) {
                            if (!isEligibleInOne && requiredEligibility == 1) // CS Sub-Pro
                            {
                                isEligibleInOne = true;
                            }

                            if (!isEligibleInOne && requiredEligibility == 2 && eligibility >= 2) // CS Pro
                            {
                                isEligibleInOne = true;
                            }

                            if (!isEligibleInOne && requiredEligibility == 3 && eligibility > 3) // Any PRC License
                            {
                                isEligibleInOne = true;
                            }

                            if (!isEligibleInOne && requiredEligibility == eligibility) // exact PRC License
                            {
                                isEligibleInOne = true;
                            }
                            
                            if (isEligibleInOne)
                            {
                                break;
                            }
                        }
                        
                        if (isEligibleInOne)
                        {
                            break;
                        }
                    }
                    
                    isEligibleInAll.push(isEligibleInOne);
                }

                return (isEligibleInAll.length == 0 ? "Not Required" : (isEligibleInAll.reduce((eligValue, nextEligValue)=>(eligValue && nextEligValue)) ? "" : "Not ") + "Qualified");
            };

            field.runAfterFilling = function(){
                var parentEx = this;

                this.removeItemAt(this.inputExs.findIndex(inputEx=>Number.parseInt(inputEx.fields[0].value) == 3)); // Remove RA 1080 entry which is only used as a general/umbrella requirement for positions

                this.setAsExtendableList(true, "+Add missing eligibility", clickEvent=>{
                    var addEligibilityBtn = clickEvent.target.inputEx;
                    var addEligDialog = new DialogEx(field.fieldWrapper, "add-eligibility-dialog-ex");
                    var addEligForm = addEligDialog.addFormEx();

                    var newEligText = addEligForm.addInputEx("New Eligibility", "text", "");
                    addEligForm.addLineBreak();
                    var descText = addEligForm.addInputEx("Description", "text", "");
                    addEligForm.addLineBreak();
                    var btnGrp = addEligForm.addFormButtonGrp(2);
                    btnGrp.setFullWidth();
                    btnGrp.fieldWrapper.classList.add("right");
                    btnGrp.inputExs[0].setLabelText("Save");
                    btnGrp.inputExs[0].setTooltipText("");
                    btnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                        var newElig = {};
                        newElig["eligibility"] = newEligText.getValue().trim();
                        if (newElig["eligibility"] == "")
                        {
                            addEligForm.raiseError("Eligibility name should not be blank.");
                        }
                        else
                        {
                            if (newElig["description"] != "")
                            {
                                newElig["description"] = descText.getValue().trim();
                            }

                            postData(this.processURL, "app=mpasis&a=add&eligibilities=" + packageData([newElig]), (event)=>{
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

                                            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");
                                            
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
                
                for (const inputEx of parentEx.inputExs) {
                    inputEx.addEvent("change", changeEvent=>{
                        var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);
                        var requiredEligibilities = [];
                        
                        if (appliedPosition != null)
                        {
                            for (const reqElig of appliedPosition["required_eligibility"]) {
                                requiredEligibilities.push([]);
                                var requiredEligibility = requiredEligibilities[requiredEligibilities.length - 1];
                                requiredEligibility.push(reqElig["eligibilityId"]);
                                if (reqElig["eligibilityId2"] != null && reqElig["eligibilityId2"] != undefined && (typeof(reqElig["eligibilityId2"]) == "string" && reqElig["eligibilityId2"].trim() != ""))
                                {
                                    requiredEligibility.push(reqElig["eligibilityId2"]);
                                }
                                if (reqElig["eligibilityId3"] != null && reqElig["eligibilityId3"] != undefined && (typeof(reqElig["eligibilityId3"]) == "string" && reqElig["eligibilityId3"].trim() != ""))
                                {
                                    requiredEligibility.push(reqElig["eligibilityId3"]);
                                }
                            }
                        }

                        var validElig = validateEligibility(parentEx.getValue(), requiredEligibilities);
        
                        remarkElig.innerHTML = validateEligibility(parentEx.getValue(), requiredEligibilities);
                        remarkElig.style.color = (validElig == "Qualified" ? "green" : (validElig == "Not Qualified" ? "red" : null));
                    });
                }
                
            };
            field.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");

            header = this.forms["applicantData"].addHeader("Competency", 3);
            header.style.gridColumn = "1 / span 12";
            header.style.marginBottom = "0";

            var displayCompetency = new DisplayEx(this.forms["applicantData"].fieldWrapper, "fieldset", "", "", "Competency", "The position applied requires this specific competency.");
            displayCompetency.container.style.gridColumn = "1 / span 12";
            var reqCompetency = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
            addText("NONE", reqCompetency);
            displayCompetency.addContent(reqCompetency);
            displayCompetency.addLineBreak(2);
            var competencyAttained = this.forms["applicantData"].addInputEx("Applicant possesses this specific competency requirement", "checkbox", "", "Mark this checkbox if applicant possesses this competency.", "has_specific_competency_required", "Job_Application");
            displayCompetency.addContent(competencyAttained.container);
            competencyAttained.reverse();
            competencyAttained.disable();

            var displayCompetencyQualification = new DisplayEx(this.forms["applicantData"].fieldWrapper, "div", "competency-qualification-display-ex", "", "Competency", "The applicant's qualification according to possessed competency");
            displayCompetencyQualification.container.style.gridColumn = "1 / span 12";
            displayCompetencyQualification.container.style.fontSize = "1.2em";
            displayCompetencyQualification.container.style.fontStyle = "italic";
            displayCompetencyQualification.container.classList.add("right");
            displayCompetencyQualification.label.style.fontWeight = "bold";
            displayCompetencyQualification.showColon();
            var remarkCompetency = createElementEx(NO_NS, "span", null, null, "class", "remark");
            addText("Not Required", remarkCompetency);
            displayCompetencyQualification.addContent(remarkCompetency);

            var searchApplicant = (searchEvent)=>{
                searchEvent.target.inputEx.showInfo("Searching . . .");

                postData(this.processURL, "app=mpasis&a=fetch&f=searchApplicationByName&name=" + searchEvent.target.inputEx.getValue(), (postEvent)=>{
                    var response;

                    if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
                    {
                        response = JSON.parse(postEvent.target.responseText);

                        if (response.type == "Error")
                        {
                            searchEvent.target.inputEx.raiseError(response.content);
                        }
                        else if (response.type == "Data")
                        {
                            var results = JSON.parse(response.content);
                            var option = null;
                            
                            searchEvent.target.inputEx.resetStatus();
                            searchEvent.target.inputEx.clearList();

                            searchedApplicants = results;

                            if (results.length == 0)
                            {
                                // searchEvent.target.inputEx.showSuccess("No results found");
                            }
                            else
                            {
                                for (const key in results) {
                                    var label = results[key]["application_code"] + " " + results[key]["given_name"] + (results[key]["middle_name"] == null || results[key]["middle_name"].trim() == "" ? "" : " " + results[key]["middle_name"]) + (results[key]["family_name"] == null || results[key]["family_name"].trim() == "" ? "" : " " + results[key]["family_name"]) + (results[key]["spouse_name"] == null || results[key]["spouse_name"].trim() == "" ? "" : " " + results[key]["spouse_name"]) + (results[key]["ext_name"] == null || results[key]["ext_name"].trim() == "" ? "" : ", " + results[key]["ext_name"]);
                                    option = searchEvent.target.inputEx.addItem(label);
                                }
                            }
                            // console.log(results);
                        }
                    }
                });
            };

            searchExistingApplicant.addEvent("change", searchApplicant);
            searchExistingApplicant.addEvent("keydown", searchApplicant);
            searchExistingApplicant.addEvent("input", (event)=>{
                for (const option of Array.from(event.target.inputEx.datalist.children)) {
                    if (option.value == event.target.inputEx.getValue())
                    {
                        // alert(option.value.match(/^\d+/)[0]);
                        applicant = searchedApplicants[option.value.match(/^\d+/)[0]];
                        console.log(applicant);
                    }
                }
            });

            postData(this.processURL, "app=mpasis&a=fetch&f=applicant-data-entry-initial", (postEvent)=>{
                var response;

                if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
                {
                    response = JSON.parse(postEvent.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(this.forms["applicantData"].container, "Error: " + response.content, "CLOSE");
                    }
                    else if (response.type == "Data")
                    {
                        var data = JSON.parse(response.content);
                        // console.log(data);
                        document.positions = data["positions"];
                        document.mpsEducIncrement = data["mps_increment_table_education"];
                        
                        document.scrim.destroy();
                        positionField.fillItems(document.positions.filter((position, index, positions)=>{
                            var i = 0;
                            while (i < index && positions[i]["position_title"] != position["position_title"]) { i++; }
                            return i == index && position["filled"] == 0;
                        }), "position_title", "", ""); // removes duplicate positions
                    }
                }
            });

            positionField.addEvent("change", (changeEvent)=>{
                parenField.setValue("");
                parenField.clearList();
            //     await parenField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=parenTitles&positionTitle=" + positionField.getValue(), "parenthetical_title", "", "");
                parenField.fillItems(document.positions.filter(position=>(position["position_title"] == positionField.getValue())), "parenthetical_title", "", "");
                
                plantillaField.setValue("");
                plantillaField.clearList();
            //     await plantillaField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=plantilla&positionTitle=" + positionField.getValue() + (parenField.getValue().trim() == "" ? "" : "&parenTitle=" + parenField.getValue()), "plantilla_item_number", "", "");
                plantillaField.fillItems(document.positions.filter(position=>(position["position_title"] == positionField.getValue() && position["parenthetical_title"] == parenField.getValue())), "plantilla_item_number", "", "");
                var option = plantillaField.addItem("ANY");
                option.parentElement.insertBefore(option, option.parentElement.children[0]);
            });
            parenField.addEvent("change", changeEvent=>{
                plantillaField.setValue("");
                plantillaField.clearList();
                // await plantillaField.fillItemsFromServer(this.processURL, "app=mpasis&a=fetch&f=plantilla&positionTitle=" + positionField.getValue() + (parenField.getValue().trim() == "" ? "" : "&parenTitle=" + parenField.getValue()), "plantilla_item_number", "", "");
                plantillaField.fillItems(document.positions.filter(position=>(position["position_title"] == positionField.getValue() && position["parenthetical_title"] == parenField.getValue())), "plantilla_item_number", "", "");
                var option = plantillaField.addItem("ANY");
                option.parentElement.insertBefore(option, option.parentElement.children[0]);
            });
            plantillaField.addEvent("change", changeEvent=>{
                var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);

                if (appliedPosition["required_educational_attainment"] == 0)
                {
                    remarkEduc.innerHTML = "(Not Required)";
                    remarkEduc.style.color = null;
                }
                else
                {
                    remarkEduc.innerHTML = "(Not Qualified)";
                    remarkEduc.style.color = "red";
                }
                if (appliedPosition["specific_education_required"] != null && appliedPosition["specific_education_required"] != "")
                {
                    reqSpecEduc.innerHTML = appliedPosition["specific_education_required"];
                    specEducAttained.enable();
                }
                else
                {
                    reqSpecEduc.innerHTML = "NONE";
                    specEducAttained.disable();
                }
                if (appliedPosition["required_training_hours"] == 0)
                {
                    remarkTraining.innerHTML = "(Not Required)"
                    remarkTraining.style.color = null;
                }
                else
                {
                    remarkTraining.innerHTML = "(Not Qualified)";
                    remarkTraining.style.color = "red";
                }
                if (appliedPosition["specific_training_required"] != null && appliedPosition["specific_training_required"] != "")
                {
                    reqSpecTraining.innerHTML = appliedPosition["specific_training_required"];
                    specTrainingAttained.enable();
                }
                else
                {
                    reqSpecTraining.innerHTML = "NONE";
                    specTrainingAttained.disable();
                }
                if (appliedPosition["required_work_experience_years"] == 0)
                {
                    remarkWorkExp.innerHTML = "(Not Required)"
                    remarkWorkExp.style.color = null;
                }
                else
                {
                    remarkWorkExp.innerHTML = "(Not Qualified)";
                    remarkWorkExp.style.color = "red";
                }
                if (appliedPosition["specific_work_experience_required"] != null && appliedPosition["specific_work_experience_required"] != "")
                {
                    reqSpecWorkExp.innerHTML = appliedPosition["specific_work_experience_required"];
                    specWorkExpAttained.enable();
                }
                else
                {
                    reqSpecWorkExp.innerHTML = "NONE";
                    specWorkExpAttained.disable();
                }
                if (appliedPosition["competency"] != null && appliedPosition["competency"] != "")
                {
                    reqCompetency.innerHTML = appliedPosition["competency"];
                    competencyAttained.enable();
                }
                else
                {
                    reqCompetency.innerHTML = "NONE";
                    competencyAttained.disable();
                }
                requiredEducIncrement.innerHTML = document.mpsEducIncrement.find(increment=>increment["baseline_educational_attainment"] == appliedPosition["required_educational_attainment"])["education_increment_level"];
                requiredTrainingIncrement.innerHTML = Math.trunc(appliedPosition["required_training_hours"] / 8) + 1;
                requiredWorkExpIncrement.innerHTML = Math.trunc(appliedPosition["required_work_experience_years"] * 12 / 6) + 1;
                remarkElig.innerHTML = (appliedPosition["required_eligibility"].length == 0 ? "Not Required" : "Not Qualified");
                remarkElig.style.color = (appliedPosition["required_eligibility"].length == 0 ? null : "red");

            });
        }

        var inlineScoreSheet = new FormEx(this.forms["applicantData"].fieldWrapper, "inline-score-sheet");
        inlineScoreSheet.container.style.gridColumn = "1 / span 12";
        

        header = inlineScoreSheet.addHeader("Score Sheet", 2);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Education", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Training", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Experience", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Performance", 3);
        header.style.gridColumn = "1 / span 12";
        // header.style.marginBottom = "0";

        field = inlineScoreSheet.addInputEx("Applicant's most recent performance rating", "text", "", "Please enter the applicant's most recent performance rating.", "performance_rating", "Job_Application");
        field.container.style.gridColumn = "1 / span 12";
        field.setWidth("4em");
        field.setFullWidth();
        field.showColon();

        header = inlineScoreSheet.addHeader("Outstanding Accomplishments", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("1. Awards and Recognition", 4);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("a. Citation and Commendation", 5);
        header.style.gridColumn = "1 / span 12";
        // header.style.marginBottom = "0";

        field = inlineScoreSheet.addInputEx("Number of citation and/or commendation letters presented by applicant", "number", "0", "Enter the number of letters of citation and commendation presented by the applicant.", "number_of_citations", "Job_Application");
        field.container.style.gridColumn = "1 / span 12";
        field.setWidth("3em");
        field.setFullWidth();
        field.fields[0].classList.add("right");
        field.setMin(0);
        field.setMax(500);
        field.showColon();

        header = inlineScoreSheet.addHeader("b. Academic or Inter-School Awards MOVs", 5);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        field = inlineScoreSheet.addInputEx("Number of academic or inter school awards MOVs presented", "number", "0", "Enter the number of academic or inter-school awards presented by the applicant.", "number_of_awards", "Job_Application");
        field.container.style.gridColumn = "1 / span 12";
        field.setWidth("3em");
        field.setFullWidth();
        field.fields[0].classList.add("right");
        field.setMin(0);
        field.setMax(500);
        field.showColon();

        header = inlineScoreSheet.addHeader("c. Outstanding Employee Award MOVs", 5);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        field = inlineScoreSheet.addInputEx("Choose the category of the applicant", "combo", "", "Select the category of the applicate to view more appropriate options on the awards", "outstanding_employee_award", "Job_Applicant");
        field.addItems("Applicants from external institution", "Applicants from the Central Office", "Applicants from the Regional Office", "Applicants from the SDO", "Applicants from Schools");
        field.setWidth("20em");
        field.showColon();

        header = inlineScoreSheet.addHeader("2. Research and Innovation", 4);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";
        
        header = inlineScoreSheet.addHeader("3. Subject Matter Expert/Membership in National TWGs or Committees", 4);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";
        
        header = inlineScoreSheet.addHeader("4. Resource Speakership/Learning Facilitation", 4);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";
        
        header = inlineScoreSheet.addHeader("5. NEAP Accredited Learning Facilitator", 4);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";
        
        header = inlineScoreSheet.addHeader("Application of Education", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";
        
        header = inlineScoreSheet.addHeader("Application of Learning and Development", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Potential", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        header = inlineScoreSheet.addHeader("Psychosocial Attributes", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        
        var applicantDataBtnGrp = this.forms["applicantData"].addFormButtonGrp(2);
        applicantDataBtnGrp.setFullWidth();
        applicantDataBtnGrp.container.style.gridColumn = "1 / span 12";
        applicantDataBtnGrp.inputExs[0].setLabelText("Save");
        applicantDataBtnGrp.inputExs[0].setTooltipText("");
        applicantDataBtnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
            var applicantDataForm = this.forms["applicantData"];

            if (this.forms["applicantData"].dbInputEx["position_title_applied"].getValue().trim() == "" || this.forms["applicantData"].dbInputEx["plantilla_item_number_applied"].getValue().trim() == "" || this.forms["applicantData"].dbInputEx["given_name"].getValue().trim() == "")
            {
                new MsgBox(this.forms["applicantData"].container, "Please fill out some of the fields before submission");
                return;
            }

            var jobApplication = {};
            jobApplication["personalInfo"] = {};
            jobApplication["personalInfo"]["addresses"] = [];
            jobApplication["personalInfo"]["disabilities"] = [];
            jobApplication["personalInfo"]["email_addresses"] = [];
            jobApplication["personalInfo"]["contact_numbers"] = [];
            jobApplication["relevantTraining"] = [];
            jobApplication["relevantWorkExp"] = [];
            jobApplication["relevantEligibility"] = [];

            // console.log(colName);
            for (const colName in this.forms["applicantData"].dbInputEx) {
                var tableName = this.forms["applicantData"].dbTableName[colName];
                var dbInputEx = this.forms["applicantData"].dbInputEx[colName];
                
                if (tableName == "Person")
                {
                    if (colName == "civil_status")
                    {
                        jobApplication["personalInfo"][colName] = dbInputEx.getDataValue();
                    }
                    else if (colName == "ethnicity")
                    {
                        jobApplication["personalInfo"][colName] = dbInputEx.getValue();
                        // jobApplication["personalInfo"][colName] = {
                        //     "ethnicityId":(dbInputEx.getDataValue() ?? null),
                        //     "ethnic_group":dbInputEx.getValue()
                        // };
                    }
                    else if (colName == "eligibilityId" || colName == "postgraduate_units" && dbInputEx.isDisabled())
                    {
                        // do nothing
                    }
                    else if (colName == "complete_academic_requirements" && !dbInputEx.isDisabled())
                    {
                        jobApplication["personalInfo"][colName] = (dbInputEx.isChecked() ? 1 : 0);
                    }
                    else if (dbInputEx.getValue().trim() != "")
                    {
                        jobApplication["personalInfo"][colName] = dbInputEx.getValue();
                    }
                }
                else if (tableName == "Address")
                {
                    jobApplication["personalInfo"]["addresses"] = [dbInputEx.getValue()];
                }
                else if (tableName == "Person_Disability")
                {
                    jobApplication["personalInfo"]["disabilities"] = dbInputEx.getValue().split(";").map(disability=>disability.trim()).filter(disability=>disability!="");
                }
                else if (tableName == "Email_Address")
                {
                    jobApplication["personalInfo"]["email_addresses"] = dbInputEx.getValue().split(";").map(email_address=>email_address.trim()).filter(email_address=>email_address!="");
                }
                else if (tableName == "Contact_Number")
                {
                    jobApplication["personalInfo"]["contact_numbers"] = dbInputEx.getValue().split(";").map(contact_number=>contact_number.trim()).filter(contact_number=>contact_number!="");
                }
                else // if (tableName == "Job_Application")
                {
                    if (colName.indexOf("has_specific_") == 0 && !dbInputEx.isDisabled())
                    {
                        jobApplication[colName] = (dbInputEx.isChecked() ? 1 : 0);
                    }
                    else if (colName == "plantilla_item_number_applied" && dbInputEx.getValue() == "ANY")
                    {
                        // do nothing
                    }
                    else if (dbInputEx.getValue().trim() != "")
                    {   
                        jobApplication[colName] = dbInputEx.getValue();
                    }
                }
            }
            jobApplication["relevantEligibility"] = this.forms["applicantData"].dbInputEx["eligibilityId"].getValue();
            for (const training of trainingInputExs)
            {
                jobApplication["relevantTraining"].push({"descriptive_name":training["trainingInputEx"].getValue(), "hours":training["trainingHoursInputEx"].getValue()});
            }
            for (const workExp of workExpInputExs)
            {
                jobApplication["relevantWorkExp"].push({"descriptive_name":workExp["workExpInputEx"].getValue(), "start_date":workExp["workExpStartDateInputEx"].getValue(), "end_date":workExp["workExpEndDateInputEx"].getValue()});
            }

            if (!moreTraining.isDisabled())
            {
                jobApplication["has_more_unrecorded_training"] = (moreTraining.isChecked() ? 1 : 0);
            }

            if (!moreWorkExp.isDisabled())
            {
                jobApplication["has_more_unrecorded_work_experience"] = (moreWorkExp.isChecked() ? 1 : 0);
            }

            console.log(jobApplication);
            // DATA SETS PACKAGED IN JSON THAT HAVE SINGLE QUOTES SHOULD BE MODIFIED AS PACKAGED TEXT ARE NOT AUTOMATICALLY FIXED BY PHP AND SQL
            postData(this.processURL, "app=mpasis&a=add&jobApplication=" + packageData(jobApplication), (event)=>{
                var response;

                if (event.target.readyState == 4 && event.target.status == 200)
                {
                    response = JSON.parse(event.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(applicantDataForm.container, response.content, "OK");
                    }
                    else if (response.type == "Success")
                    {
                        new MsgBox(applicantDataForm.container, response.content, "OK");
                    }
                }
            });
        });
        applicantDataBtnGrp.inputExs[1].setLabelText("Reset");
        applicantDataBtnGrp.inputExs[1].setTooltipText("");
        applicantDataBtnGrp.inputExs[1].addEvent("click", (event)=>{}); // TO IMPLEMENT IN FORMEX/INPUTEX
        applicantDataBtnGrp.container.style.gridColumn = "1 / span 12";
        applicantDataBtnGrp.fieldWrapper.classList.add("right");
        applicantDataBtnGrp.setStatusMsgTimeout(20);

        var status = this.forms["applicantData"].addStatusPane();
        status.style.gridColumn = "1 / span 7";

        return this.forms["applicantData"];
    }

    constructScoreSheet()
    {
        var field = null, div = null;

        if (this.forms["scoreSheet"] != null && this.forms["scoreSheet"] != undefined)
        {

            return this.forms["scoreSheet"];
        }

        var scoreSheet = this.forms["scoreSheet"] = new FormEx(this.mainSections["main-applicant-scoresheet"], "scoresheet");
        scoreSheet.setFullWidth();
        scoreSheet["displayExs"] = [];
        scoreSheet.addDisplayEx = function(typeText = "div", id = "", contentText = "", labelText = "", tooltip = ""){
            var newDisplayEx = new DisplayEx(this.fieldWrapper, typeText, id, contentText, labelText, tooltip);
            if (typeof(id) == "string" && id != "")
            {
                this.displayExs[id] = newDisplayEx;
            }
            else
            {
                this.displayExs.push(new DisplayEx(this.fieldWrapper, typeText, this.id + this.displayExs.length, contentText, labelText, tooltip));
            }
            return newDisplayEx;
        };

        scoreSheet.loadedApplicant = null;

        scoreSheet.addHeader("Score Sheet", 2, "scoresheet-title", true);

        var loadApplicant = scoreSheet.addInputEx("Load Applicant", "buttonEx");
        loadApplicant.setFullWidth();
        loadApplicant.fieldWrapper.classList.add("right");

        var applicantInfo = scoreSheet.addDisplayEx("div", "applicantInfo");
        applicantInfo.setFullWidth();
        applicantInfo.content.style.display = "grid";
        applicantInfo.content.style.gridTemplateColumns = "auto auto";
        applicantInfo.content.style.gridGap = "0.5em";

        var applicantName = scoreSheet.addInputEx("Applicant's Name", "text");
        var school = scoreSheet.addInputEx("School", "text", "");
        var presentPosition = scoreSheet.addInputEx("Present Position", "text");
        var designation = scoreSheet.addInputEx("Designation", "text");
        var district = scoreSheet.addInputEx("District", "text");
        var positionApplied = scoreSheet.addInputEx("Position Applied For", "text");

        [applicantName, school, presentPosition, designation, district, positionApplied].forEach(inputEx=>{
            inputEx.setVertical();
            applicantInfo.addContent(inputEx.container);
            inputEx.container.style.gridColumn = "span 1";
            inputEx.disable();
            inputEx.fields[0].style.color = "black";
        });

        [
            {divId:"educ", text:"Education"},
            {divId:"train", text:"Training"},
            {divId:"exp", text:"Experience"},
            {divId:"perf", text:"Performance"},
            {divId:"accompl", text:"Outstanding Accomplishments"},
            {divId:"appEduc", text:"Application of Education"},
            {divId:"appTrain", text:"Application of Learning and Development"},
            {divId:"potent", text:"Potential"},
            {divId:"psych", text:"Psychosocial Attributes"}
        ].forEach(header=>{
            var mainDisplayEx = scoreSheet.addDisplayEx("div", header.divId)
            mainDisplayEx.addContent(scoreSheet.addHeader(header.text, 3));
            scoreSheet.headers[scoreSheet.headers.length - 1].style.marginTop = 0;
            scoreSheet.headers[scoreSheet.headers.length - 1].style.borderBottom = "1px solid";
            mainDisplayEx.displays = [];
            mainDisplayEx.fields = [];
        });

        for (const key in scoreSheet.displayExs) {
            var displayEx = scoreSheet.displayExs[key];
            if (key !== "applicantInfo")
            {
                displayEx.setFullWidth();
                displayEx.setVertical();
                // displayEx.content.style.display = "grid";
                // displayEx.content.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
                // displayEx.content.style.gridGap = "0.5em";
                displayEx.content.style.border = "0.15em solid gray";
                displayEx.content.style.borderRadius = "1em";
                displayEx.content.style.margin = "1em 0";
                displayEx.content.style.padding = "1em";
            }
        }

        div = scoreSheet.displayExs.educ;

        [
            "Highest level of education attained",
            "Units taken towards the completion of a Postgraduate Degree",
            "Has taken education required for the position",
            "",
            "Number of increments above the Qualification Standard"
        ].forEach(label=>{
            if (label == "")
            {
                div.addLineBreak();
                return;
            }
            var displayEx = new DisplayEx(div.content, "span", "educAttained", "", label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays.push(displayEx);
        });

        div = scoreSheet.displayExs.train;

        [
            "Total number of relevant training hours",
            "Number of relevant trainings considered",
            "Has undergone required training for the position",
            "Has unconsidered trainings",
            "",
            "Number of Increments above the Qualification Standard"
        ].forEach(label=>{
            var displayEx = new DisplayEx(div.content, "span", "trainAttained", "", label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays.push(displayEx);
        });

        div = scoreSheet.displayExs.exp;

        [
            "Total number of years of relevant work experience",
            "Number of relevant employment considered",
            "Has the required work experience for the position",
            "Has unconsidered employment",
            "",
            "Number of Increments above the Qualification Standard"
        ].forEach(label=>{
            var displayEx = new DisplayEx(div.content, "span", "trainAttained", "", label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays.push(displayEx);
        });

        div = scoreSheet.displayExs.perf;

        field = scoreSheet.addInputEx("Most recent relevant 1-year Performance Rating attained", "number", "3");
        field.showColon();
        field.setBlankStyle();
        field.setMin(1);
        field.setMax(5);
        field.setStep(0.01);
        field.setWidth("3.5em");
        field.fields[0].classList.add("right");
        div.addContent(field.container);

        div = scoreSheet.displayExs.accompl;

        div.addContent(scoreSheet.addHeader("1. Awards and Recognition", 4));
        div.addContent(scoreSheet.addHeader("a. Citation and Commendation", 5));

        field = scoreSheet.addInputEx("Number of letters of citation/commendation presented by applicant", "number", "0");
        field.showColon();
        field.setBlankStyle();
        field.setMin(0);
        field.setMax(999);
        field.setWidth("4em");
        field.fields[0].classList.add("right");
        div.addContent(field.container);

        div.addContent(scoreSheet.addHeader("b. Academic or Inter-School Award MOVs", 5));

        field = scoreSheet.addInputEx("Number of award certificates/MOVs presented by applicant", "number", "0");
        field.showColon();
        field.setBlankStyle();
        field.setMin(0);
        field.setMax(999);
        field.setWidth("4em");
        field.fields[0].classList.add("right");
        div.addContent(field.container);

        div.addContent(scoreSheet.addHeader("c. Outstanding Employee Award", 5));

        var awardCategoryfield = scoreSheet.addInputEx("", "combo");
        awardCategoryfield.showColon();
        awardCategoryfield.setBlankStyle();
        awardCategoryfield.setPlaceholderText("Choose the applicant's category");
        awardCategoryfield.setTooltipText("Select a category to see more options");
        awardCategoryfield.setWidth("20em");
        awardCategoryfield.addItem("Applicant from an external institution", "1");
        awardCategoryfield.addItem("Applicant from the Central Office", "2");
        awardCategoryfield.addItem("Applicant from the Regional Office", "3");
        awardCategoryfield.addItem("Applicant from the SDO", "4");
        awardCategoryfield.addItem("Applicant from School", "5");
        div.addContent(awardCategoryfield.container);

        awardCategoryfield.addEvent("change", awarderChangeEvent=>{
            
        });

        // Add total points line
        for (const key in scoreSheet.displayExs) {
            if (key !== "applicantInfo")
            {
                var displayEx = new DisplayEx(scoreSheet.displayExs[key].content, "span", "", "", "Total Points");
                displayEx.showColon();
                displayEx.setFullWidth();
                displayEx.setHTMLContent("0");
                displayEx.container.classList.add("right");
                displayEx.container.style.marginTop = "1em";
                displayEx.container.style.borderTop = "1px solid";
                displayEx.container.style.fontSize = "1.1em";
                displayEx.container.style.fontStyle = "italic";
                displayEx.content.style.fontWeight = "bold";

                scoreSheet.displayExs[key].setPoints = (pointValue, runAfter = null, params = null)=>{
                    displayEx.setHTMLContent(pointValue);
                    if (typeof(runAfter) && runAfter != null)
                    {
                        runAfter(params);
                    }
                };

                scoreSheet.displayExs[key].getPoints = ()=>{
                    displayEx.getContent();
                };

                scoreSheet.displayExs[key].displays.push(displayEx);
            }
        }

        loadApplicant.addEvent("click", loadApplicantClickEvent=>{
            var retrieveApplicantDialog = null;
            if (loadApplicantClickEvent.target.innerHTML == "Load Applicant")
            {
                retrieveApplicantDialog = new DialogEx(scoreSheet.fieldWrapper, "scoresheet-load-applicant");
                var form = retrieveApplicantDialog.addFormEx();
                
                var searchBox = form.addInputEx("Enter an applicant name or code", "text", "", "Type to populate list");
                searchBox.setFullWidth();
                searchBox.showColon();

                var searchResult = form.addInputEx("Choose the job application to load", "radio-select", "load-applicant", "", "", "", true);
                searchResult.setFullWidth();
                searchResult.setVertical();
                searchResult.reverse();
                searchResult.hide();

                var retrieveApplicantDialogBtnGrp = form.addFormButtonGrp(2);
                retrieveApplicantDialogBtnGrp.setFullWidth();
                retrieveApplicantDialogBtnGrp.fieldWrapper.classList.add("right");
                retrieveApplicantDialogBtnGrp.inputExs[0].setLabelText("Load");
                retrieveApplicantDialogBtnGrp.inputExs[0].setTooltipText("Load Selected");
                retrieveApplicantDialogBtnGrp.inputExs[0].disable();

                retrieveApplicantDialogBtnGrp.inputExs[1].setLabelText("Cancel");
                retrieveApplicantDialogBtnGrp.inputExs[1].setTooltipText("");
                retrieveApplicantDialogBtnGrp.inputExs[1].addEvent("click", cancelRetrieveDialogClickEvent=>{
                    retrieveApplicantDialog.close();
                });

                searchResult.runAfterFilling = function(){
                    // alert(JSON.stringify(this.data));
                    // alert.log(this.data[0]);
                };

                searchBox.addEvent("keyup", keyupEvent=>{
                    searchResult.clearList();

                    searchResult.show();
                    retrieveApplicantDialogBtnGrp.inputExs[0].enable();

                    searchResult.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=applicantionsByApplicantOrCode&srcStr=" + searchBox.getValue(), "applicant_option_label", "application_code");
                });

                // clickEvent.target.innerHTML = "Reset Form";
            }
            else if (clickEvent.target.innerHTML == "Reset Form")
            {
                scoreSheet.resetForm();

                clickEvent.target.innerHTML = "Load Applicant";
            }
        });

        scoreSheet.func["reset"] = function(){
            
        };

        return scoreSheet;
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    getCookie(cname) {
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
}

var app = new MPASIS_App(document.getElementById("mpasis"));
