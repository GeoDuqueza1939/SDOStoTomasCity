"use strict";

class ScrimEx
{
    constructor(parent = null)
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "scrim-ex");
        this.scrim["scrimEx"] = this;
        // this.content = null;
        this.scrimEvents = [];
    }

    setHTMLContent(htmlContent)
    {
        this.scrim.innerHTML = htmlContent;

    }

    addContent(content)
    {
        this.scrim.appendChild(content);
    }

    getContent()
    {
        return this.scrim.innerHTML;
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
        this.container = createElementEx(NO_NS, (typeText == "span" ? "span" : "div"), parent, null, "class", "display-ex");
        this.content = createElementEx(NO_NS, typeText, this.container, null, "class", "content");
        this.label = null;
        this.colon = null;
        this.type = typeText;

        this.setHTMLContent(contentText);
        this.setLabelText(labelText);
        this.setTooltipText(tooltip);

        [this.container, this.content].forEach(el=>el["displayEx"] = this);
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
                this.label["displayEx"] = this;
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
            return this.label;
        }

        return null;
    }

    getLabelText()
    {
        if (this.label != null)
        {
            return this.label.innerHTML.replace(/<span class="colon.+/, "");
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
        this.container.classList.toggle("vertical", vertical);
    }

    isVertical()
    {
        return this.container.classList.contains("vertical");
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
            this.container.classList.toggle("reversed", reverse);
        }
    }

    isReversed()
    {
        return this.container.classList.contains("reversed");
    }

    setInline(inline = true)
    {
        if (inline)
        {
            this.container.classList.remove("vertical");
            this.container.classList.remove("full-width");
        }

        this.container.classList.toggle("inline", inline);
    }

    isInline()
    {
        return this.container.classList.contains("inline");
    }

    setFullWidth(fullWidth = true)
    {
        if (fullWidth)
        {
            this.container.classList.remove("inline");  
        }

        this.container.classList.toggle("full-width", fullWidth);
    }

    isFullWidth()
    {
        return this.container.classList.contains("full-width");
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

        this.container = createElementEx(NO_NS, (typeStr == "table" ? "div" : "span"), parentEl, null, "class", "input-ex");
        this.useFieldSet = useFieldSet;
        // will contain the input element with its label or other InputEx elements
        this.fieldWrapper = createElementEx(NO_NS, (useFieldSet ? "fieldset" : (typeStr == "table" ? "div" : "span")), this.container, null, "class", "fields");
        this.parentDialogEx = null;
        this.parentFormEx = null;
        this.parentDisplayEx = null;
        this.parentInputEx = null;
        this.inputExs = []; // references to multiple InputEx children (for multiple input types)
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
        this.statusMarker = null;
        this.statusMsg = null;

        this.isMultipleInput = false;
        this.disabled = false;
        this.isFilling = false;
        this.runAfterFilling = null; // function to run after filling items from server; should be assigned before running fillItemsFromServer
        this.spacer = null; // a reference to a single space textnode that shall come before this InputEx object
        this.extendableList = false;
        this.extendableListAddBtnEx = null;
        this.hiddenDisplay = null;

        this.table = null;
        this.thead = null; // the headers list shall be appended with an empty header, which shall contain the column for the delete buttons
        this.tbody = null;
        this.tableTypes = []; // InputEx types for each column; if table headers and tableTypes don't match in lengths, defaults shall be used to compensate ("" for table headers and "text" for tableTypes)
        this.tableDBColNames = []; // names that define the column the data are to be stored in
        this.tableDefaultValues = []; // mismatched default values to types might result to undefined behavior!
        this.tableInitFunctions = []; // if not null, each function is run after a table field is created
        this.removeRowOverride = false;
        this.addRowButtonEx = null;
        this.tableDBKeyName = ""; // may or may not be a member of tableDBColNames
        
        this.type = typeStr;
        switch(typeStr)
        {
            case "table":
                this.isMultipleInput = true;
                this.table = createElementEx(NO_NS, "table", this.fieldWrapper, nextSibling);
                this.tbody = createElementEx(NO_NS, "tbody", this.table, nextSibling);
                this.table.inputEx = this;
                break;
            case "inline-table":
                this.isMultipleInput = true;
                this.table = createElementEx(NO_NS, "span", this.fieldWrapper, nextSibling, "class", "table");
                this.tbody = createElementEx(NO_NS, "span", this.table, nextSibling, "class", "tbody");
                this.table.inputEx = this;
                break;
            case "select":
                this.fields.push(createElementEx(NO_NS, "select", this.fieldWrapper, nextSibling, "id", idStr, "name", idStr));
                this.fields[0].inputEx = this;
                addText("", createElementEx(NO_NS, "option", this.fields[0], nextSibling));
                break;
            case "radio-select": // group of radio buttons
            case "checkbox-select": // group of check boxes
            case "buttons": // a group of button inputs
            case "buttonExs": // a group of button elements
                this.isMultipleInput = true;
                break;
            case "buttonEx": // button element
                this.fields.push(createElementEx(NO_NS, "button", this.fieldWrapper, nextSibling, "id", idStr, "name", idStr, "type", "button"));
                this.fields[0].inputEx = this;
                break;
            case "textarea":
                this.fields.push(createElementEx(NO_NS, "textarea", this.fieldWrapper, nextSibling, "id", idStr, "name", idStr));
                this.setFullWidth();
                this.fields[0].inputEx = this;
                break;
            case "combo": // input with a datalist
                nextSibling = this.datalist = createElementEx(NO_NS, "datalist", this.fieldWrapper, nextSibling, "id", idStr + "-datalist", "name", idStr + "-datalist");
                typeStr = "text";
            default:
                this.fields.push(createElementEx(NO_NS, "input", this.fieldWrapper, nextSibling, "id", idStr, "name", idStr, "type", typeStr));
                if (this.datalist != null)
                {
                    this.fields[0].setAttribute("list", idStr + "-datalist");
                }
                this.fields[0].inputEx = this;
                break;
        }

        [this.container, this.fieldWrapper].forEach(el=>el["inputEx"] = this);

        this.data = null;
    }

    // METHODS THAT QUERY OR CHANGE THE STRUCTURE OF INPUTEX
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
            this.inlineTextboxEx.setDefaultValue(value, true);
            this.inlineTextboxEx.setTooltipText(tooltip);

            if (actionOnSelect != null)
            {
                this.handleInlineTextboxExOnCheck = actionOnSelect;
                this.fields[0].addEventListener("change", this.handleInlineTextboxExOnCheck);
                this.handleInlineTextboxExOnCheck();
            }

            return this.inlineTextboxEx;
        }

        return null;
    }

    addOtherOption(labelText, value, tooltipText, inlineLabel = "", selectHandler = null) // use this in runAfterFilling if items are filled using fillItemsFromServer
    {
        if (this.type == "radio-select" || this.type == "checkbox-select") // consider if this can be extended to other multiple InputEx option types
        {
            this.otherOptionEx = this.addItem(labelText, value, tooltipText);
            this.otherOptionEx.addInlineTextboxEx(inlineLabel, "", tooltipText, selectHandler);

            if (this.isReversed())
            {
                this.otherOptionEx.reverse();
            }

            return this.otherOptionEx;
        }
        
        return null;
    }

    addItem(labelText, value = "", tooltipText = "") // only for select and combo (will add to datalist), radio-select, multiple-radio-select, buttons, and buttonExs
    {
        var invalidArgsStr = "";

        invalidArgsStr += (typeof(labelText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "labelText:" + labelText);
        invalidArgsStr += (typeof(value) == "string" || typeof(value) == "number" ? "" : (invalidArgsStr == "" ? "" : "; ") + "value:" + value);
        invalidArgsStr += (typeof(tooltipText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "tooltipText:" + tooltipText);

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        labelText = labelText.trim();
        tooltipText = tooltipText.trim();

        switch (this.type)
        {
            case "select":
                var option = createElementEx(NO_NS, "option", this.fields[0], null, "value", value);
                addText(labelText, option);
                if (tooltipText != "")
                {
                    option.title = tooltipText; // HAS NO EFFECT!!!
                }
                return option;
                break;
            case "combo":
                var option = createElementEx(NO_NS, "option", this.datalist, null, "value", labelText, "data-value", value);
                // addText(labelText, option);
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
                this.inputExs[this.inputExs.length - 1].parentInputEx = this;
                if (this.type.indexOf("-select") >= 0)
                {
                    if (value != "")
                    {
                        this.inputExs[this.inputExs.length - 1].setDefaultValue(value, true);  // MAY CAUSE ISSUES IF DEVELOPER DOESN'T TRACK THE NUMBER OF ITEMS WITHOUT LABELS THAT WERE MIXED WITH LABELED ITEMS
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

    getItemAt(index = 0)
    {
        if (Number.isInteger(index) && index >= 0 && (index < this.inputExs.length || (this.type == "select" && index < this.fields[0].length - 1) || (this.type == "combo" && index < this.datalist.length)))
        {
            switch (this.type)
            {
                case "select":
                case "combo":
                    return (this.type == "select" ? this.fields[0] : this.datalist).getElementsByTagName("option")[index + (this.type == "select" ? 1 : 0)];
                    break;
                case "radio-select":
                case "checkbox-select":
                case "buttons":
                case "buttonExs":
                    return this.inputExs[index];
                    break;
            }    
        }

        return null;
    }

    removeItemAt(index = 0)
    {
        if (Number.isInteger(index) && index >= 0 && index < this.inputExs.length)
        {
            switch (this.type)
            {
                case "select":
                case "combo":
                    (this.type == "select" ? this.fields[0] : this.datalist).getElementsByTagName("option")[index + (this.type == "select" ? 1 : 0)].remove();
                    break;
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

                    this.fillItems(data, labelColName, valueColName, tooltipColName);

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
                    new MsgBox(this.container, "DEBUG: " + response.content, "OK");
                }
            }
        });
    }

    fillItems(dataRows, labelColName = "", valueColName = "", tooltipColName = "")
    {
        this.isFilling = true;
        for (const dataRow of dataRows) {
            var label = (dataRow[labelColName] ?? "").toString();
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
                case "radio-select":
                case "checkbox-select":
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
                case "select":
                case "combo":
                    Array.from((this.type == "select" ? this.fields[0] : this.datalist).children).forEach((option)=>{
                        option.remove();
                    });
                    if (this.type == "select")
                    {
                        addText("", createElementEx(NO_NS, "option", this.fields[0], null));
                    }
                    break;
                default:
                    break;
            }
        }
    }

    setWidth(width = "none")
    {
        if (typeof(width) != "string" && typeof(width) != "null")
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

        this.container.classList.toggle("full-width", setting);
    }

    isFullWidth()
    {
        return this.container.classList.contains("full-width");
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
        if (!this.type.includes("table"))
        {
            this.container.classList.toggle("vertical", setting);
        }
    }

    isVertical()
    {
        return this.container.classList.contains("vertical");
    }

    reverse() // change actual order of label and field; toggle setting
    {
        if (this.isMultipleInput || this.type.startsWith("button"))
        {
            this.inputExs.forEach((inputEx)=>{
                inputEx.reverse();
            });
        }
        else if (this.labels.length > 0)
        {
            if (this.isReversed())
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

        this.container.classList.toggle("reversed");
    }

    isReversed() // single-input element types only
    {
        return this.container.classList.contains("reversed");
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
            case "submit":
            case "reset":
            case "buttonEx":
            case "buttons":
            case "buttonExs":
                break;
            default:
                this.container.classList.toggle("blank-style");
                break;
        }
    }

    setHeaders(...headerTexts)
    {
        var invalidArgsStr = "", th = null;

        if (this.type != "table" && this.type != "inline-table")
        {
            return null;
        }    

        if (this.thead != null)
        {
            this.thead.remove();
        }

        if (this.type == "table")
        {
            this.thead = createElementEx(NO_NS, "thead", this.table, this.tbody);
        }
        else
        {
            this.thead = createElementEx(NO_NS, "span", this.table, this.tbody, "class", "thead");
        }

        headerTexts.forEach((headerText, i)=>{
            invalidArgsStr += (typeof(headerText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "headerTexts[" + i + "]:" + headerText);
            // addText(headerText, createElementEx(NO_NS, "b", this.thead, null, "class", "th");
            if (this.type == "table")
            {
                th = createElementEx(NO_NS, "th", this.thead, null)
            }
            else
            {
                th = createElementEx(NO_NS, "b", this.thead, null, "class", "th")
            }
            th.innerHTML = headerText;
        });

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        if (this.type == "table")
        {
            createElementEx(NO_NS, "th", this.thead, null, "class", "tail");
        }
        else
        {
            createElementEx(NO_NS, "b", this.thead, null, "class", "th tail");
        }

        return this.thead;
    }

    getHeaders()
    {
        return (this.thead != null && this.thead.children.length > 1 ? Array.from(this.thead.children).map(th=>th.innerHTML).slice(0,-1) : []);
    }

    setTypes(...types)
    {
        var invalidArgsStr = "", diff = (this.thead == null || this.thead.children.length <= 1 ? 0 : this.thead.children.length - 1 - types.length);

        if (this.type != "table" && this.type != "inline-table")
        {
            return null;
        }    

        types.forEach((type, i)=>{
            invalidArgsStr += (typeof(type) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "types[" + i + "]:" + type);
            if (diff < 0 && this.thead.children.length - 2 < i)
            {
                if (this.type == "table")
                {
                    createElementEx(NO_NS, "th", this.thead, this.thead.children[this.thead.children.length - 1], "class", "blank");
                }
                else
                {
                    createElementEx(NO_NS, "b", this.thead, this.thead.children[this.thead.children.length - 1], "class", "th blank");
                }
            }
            this.tableTypes.push(type);
        });

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }

        while(this.tableTypes.length < this.thead.children.length - 1)
        {
            this.tableTypes.push("text");
        }

        return this.tableTypes;
    }

    setDBColNames(...dbColNames) // run only after setTypes()
    {
        var invalidArgsStr = "";

        if ((this.type != "table" && this.type != "inline-table") || this.tableTypes.length == 0)
        {
            return null;
        }    

        dbColNames.forEach((dbColName, i)=>{
            invalidArgsStr += (typeof(dbColName) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "dbColNames[" + i + "]:" + dbColName);
        });

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }
        else if (this.tableTypes.length != dbColNames.length)
        {
            throw("Mismatch in tableTypes and dbColNames");
        }

        this.tableDBColNames = dbColNames;

        return this.tableDBColNames;
    }

    setDBKeyName(dbKeyName)
    {
        var invalidArgsStr = "";

        if ((this.type != "table" && this.type != "inline-table") || this.tableTypes.length == 0)
        {
            return null;
        }    

        if (typeof(dbKeyName) != "string" || dbKeyName.trim() == "")
        {
            throw("Incorrect argument types: dbKeyName:" + dbKeyName);
        }

        if (this.tableDBKeyName == "")
        {
            this.tableDBKeyName = dbKeyName;

            this.inputExs.forEach(inputRow=>{
                inputRow[this.tableDBKeyName] = null;
            });
        }
        else
        {
            this.inputExs.forEach(inputRow=>{
                inputRow[dbKeyName] = inputRow[this.tableDBKeyName];

                delete inputRow[this.tableDBKeyName];
            });

            this.tableDBKeyName = dbKeyName;
        }
        

        return this.tableDBKeyName;
    }

    setInitFunctions(...functions) // run only after setTypes()
    {
        var invalidArgsStr = "";

        if ((this.type != "table" && this.type != "inline-table") || this.tableTypes.length == 0)
        {
            return null;
        }    

        functions.forEach((func, i)=>{
            invalidArgsStr += (typeof(func) == "function" || func == null ? "" : (invalidArgsStr == "" ? "" : "; ") + "functions[" + i + "]:" + func);
        });

        if (invalidArgsStr.trim() != "")
        {
            throw("Incorrect argument types: " + invalidArgsStr);
        }
        else if (this.tableTypes.length != functions.length)
        {
            throw("Mismatch in tableTypes and functions");
        }

        this.tableInitFunctions = functions;

        return this.tableInitFunctions;
    }

    addRow(number = 1, removeRowCallback = null)
    {
        var tr = null, td = null, inputRow = [], fieldEx = null;

        if (typeof(number) != "number" || !Number.isInteger(number) || number < 0)
        {
            throw("Incorrect argument types: number:" + number);
        }

        if (this.type != "table" && this.type != "inline-table")
        {
            return null;
        }    

        if (this.tableTypes.length == 0)
        {
            this.setTypes("text");
        }

        for (var count = 0; count < number; count++)
        {
            if (this.type == "table")
            {
                tr = createElementEx(NO_NS, "tr", this.tbody, null);
            }
            else
            {
                tr = createElementEx(NO_NS, "span", this.tbody, null, "class", "tr");
            }
            inputRow = [];
    
            this.tableTypes.forEach((type, i)=>{
                if (this.type == "table")
                {
                    td = createElementEx(NO_NS, "td", tr, null);
                }
                else
                {
                    td = createElementEx(NO_NS, "span", tr, null, "class", "td");
                }
                if (type == 'displayEx')
                {
                    fieldEx = new DisplayEx(td, "span", this.id + (this.inputExs.length * this.tableTypes.length + i));
                    if (this.tableDefaultValues.length > 0)
                    {
                        fieldEx.setHTMLContent(this.tableDefaultValues[i]);
                    }
                }
                else
                {
                    fieldEx = new InputEx(td, this.id + (this.inputExs.length * this.tableTypes.length + i), this.tableTypes[i]);
                    if (this.tableDefaultValues.length > 0)
                    {
                        fieldEx.setDefaultValue(this.tableDefaultValues[i]);
                    }
                    fieldEx.parentInputEx = this;
                }
                fieldEx.setFullWidth();
                if (this.tableDBColNames.length == 0)
                {
                    inputRow.push(fieldEx);
                }
                else
                {
                    inputRow[this.tableDBColNames[i]] = fieldEx;
                }
                fieldEx["td"] = td;
                fieldEx["tr"] = tr;
                if (this.tableInitFunctions.length != 0 && this.tableInitFunctions[i] != null && this.tableInitFunctions[i] != undefined)
                {
                    this.tableInitFunctions[i](fieldEx);
                }
            });
    
            if (this.tableDBKeyName != "")
            {
                inputRow[this.tableDBKeyName] = null;
            }
            this.inputExs.push(inputRow);
    
            if (this.type == "table")
            {
                td = createElementEx(NO_NS, "td", tr, null, "class", "remove-row-btn-cell");
            }
            else
            {
                td = createElementEx(NO_NS, "span", tr, null, "class", "td remove-row-btn-cell");
            }
            // Remove Row Button
            fieldEx = new InputEx(td, this.id + ((this.inputExs.length + 1) * this.tableTypes.length), "buttonEx");
            fieldEx.container.classList.add("remove-row-btn");
            fieldEx.setLabelText("<span class=\"material-icons-round\">close</span>");
            fieldEx.parentInputEx = this;
            tr["removeBtn"] = fieldEx;
            tr["inputRow"] = inputRow;
            fieldEx["tr"] = tr;
            fieldEx["inputRow"] = inputRow;
            fieldEx.addEvent("click", function(removeRowClickEvent){
                var removeRowCallbackDefault = ()=>{
                    this.inputEx.parentInputEx.inputExs.splice(this.inputEx.parentInputEx.inputExs.findIndex(inputRow=>inputRow == this.inputEx["inputRow"]), 1);
                    this.inputEx["tr"].remove();
                };
                if (this.inputEx.parentInputEx.removeRowOverride)
                {
                    (typeof(removeRowCallback) == "function" ? removeRowCallback : removeRowCallbackDefault)();
                }
                else
                {
                    new MsgBox(this.inputEx["tr"], "Do you really want to delete this row?", "YESNO", (typeof(removeRowCallback) == "function" ? removeRowCallback : removeRowCallbackDefault));
                }
            });
        }

        return (number == 1 ? inputRow : this.inputExs);
    }

    removeRow(index) // uses the removeRowCallback or the default callback supplied in addRow via the remove button
    {
        if (typeof(index) != "number" || !Number.isInteger(index) || index < 0 || index >= this.inputExs.length)
        {
            throw("Incorrect argument types: number:" + number);
        }

        if (this.type != "table" && this.type != "inline-table")
        {
            return null;
        }    

        for (const key in this.inputExs[index])
        {
            this.inputExs[index][key]["tr"]["removeBtn"].fields[0].click();
            break;
        }
    }

    removeAllRows()
    {
        if (this.type != "table" && this.type != "inline-table")
        {
            return null;
        }    
        
        this.removeRowOverride = true;
        while (this.inputExs.length > 0)
        {
            this.removeRow(0);
        }
        this.removeRowOverride = false;
    }

    createAddRowButton()
    {
        if (this.type == "table" || this.type == "inline-table")
        {
            if (this.addRowButtonEx == null)
            {
                this.addRowButtonEx = new InputEx(this.fieldWrapper, this.id + "-add-row-button-ex", "buttonEx");
                this.addRowButtonEx.setLabelText("+Add a row");
                this.addRowButtonEx.addEvent("click", clickEvent=>{
                    this.addRow();
                });
            }
    
            return this.addRowButtonEx;
        }

        return null;
    }

    // METHODS THAT QUERY OR MANIPULATE THE HANDLED DATA OF INPUTEX
    getId()
    {
        return this.id;
    }

    setValue(...values) // ALWAYS USE STRING VALUES IN CHECKBOX MULTIPLE
    {
        // validate at least the first value
        if (typeof(values[0]) != "string" && typeof(values[0]) != "number" && (this.type == "checkbox-select" && Object.prototype.toString.call(values[0]) != "[object Array]") && ((this.type == "table" || this.type == "inline-table") && (typeof(values[0]) != "string" || Object.prototype.toString.call(values[1]) != "[object Array]")))
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
                    if (inputEx.fields[0].value == values[0])
                    {
                        inputEx.check();
                    }
                    else
                    {
                        inputEx.uncheck();
                    }
                }
                break;
            case "checkbox-select":
                for (const inputEx of this.inputExs) {
                    if (values[0].includes(inputEx.fields[0].value) || values[0].map(value=>value.toString()).includes(inputEx.fields[0].value))
                    {
                        inputEx.check();
                    }
                    else
                    {
                        inputEx.uncheck();
                    }
                }
                break;
            case "inline-table": // giving mismatching values will result in undefined behavior!!!!!!!!!
            case "table": // giving mismatching values will result in undefined behavior!!!!!!!!!
                this.removeAllRows();
                
                if (values[0] != "")
                {
                    this.setDBKeyName(values[0]);
                }

                for (const row of values[1])
                {
                    var inputRow = this.addRow();
                    for (const key in row)
                    {
                        if (values[0] != "" && key == values[0] && (inputRow[key] == null || inputRow[key] == undefined)) // primary key
                        {
                            inputRow[key] = row[key];
                        }
                        else if (row[key] != null && row[key] != undefined)
                        {
                            if (inputRow[key].type == "checkbox" || inputRow[key].type == "radio")
                            {
                                inputRow[key].check(row[key] == 1);
                            }
                            else
                            {
                                inputRow[key].setDefaultValue(row[key], true);
                            }
                            inputRow[key].enable();
                        }
                    }
                }
                break;
            case "buttons":
            case "buttonExs":
                break;
            case "select":
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
        var value = null;

        switch (this.type)
        {
            case "radio-select":
                if (this.otherOptionEx != null && this.otherOptionEx.isChecked())
                {   
                    value = this.otherOptionEx.getValue();
                    return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                }

                for (const inputEx of this.inputExs) {
                    if (inputEx.isChecked())
                    {
                        value = inputEx.getValue();
                        return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                    }
                }
                break;
            case "checkbox-select":
                var values = [];
                for (const inputEx of this.inputExs) {
                    // console.log(inputEx + "\n" + inputEx.isChecked() + inputEx.fields[0].checked);
                    if (inputEx.isChecked())
                    {
                        value = inputEx.getValue();
                        values.push((isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value))));
                    }
                }
                return values;
                break;
            case "radio":
            case "checkbox":
                if (this.inlineTextboxEx != null && this.isChecked())
                {
                    value = this.inlineTextboxEx.getValue();
                    return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                }
                else if (this.isChecked())
                {
                    value = this.fields[0].value.trim();
                    return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                }
                break;
            case "inline-table":
            case "table":
                return this.inputExs.map(inputRow=>{
                    var dataRow = {};
                    for (const key in inputRow)
                    {
                        dataRow[key] = (typeof(inputRow[key]) == "string" || typeof(inputRow[key]) == "number" || inputRow[key] == null || inputRow[key] == undefined 
                            ? inputRow[key] 
                            : (inputRow[key].type == "checkbox" || inputRow[key].type == "radio" 
                                ? inputRow[key].isChecked() 
                                : (inputRow[key].type == "select" || inputRow[key].type == "combo"
                                    ? inputRow[key].getDataValue()
                                    : inputRow[key].getValue()
                                )
                            )
                        );
                    }
                    return dataRow;
                });
                break;
            case "buttons":
            case "buttonExs":
                break;
            case "select":
                if (this.fields[0].children.length > 0) // UNNECESSARY IF
                {
                    value = Array.from(this.fields[0].children).find(option=>option.value == this.fields[0].value).innerHTML;
                    return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                }
                break;
            case "password":
                return this.fields[0].value;
                break;
            case "text":
                return this.fields[0].value;
                break;
            case "combo":
            case "buttonEx":
            case "button":
            case "submit":
            case "reset":
            default:
                value = this.fields[0].value;
                return (isNaN(value) || typeof(value) == "string" && value.trim() == "" ? value : (parseInt(value) == parseFloat(value) ? parseInt(value) : parseFloat(value)));
                break;
        }

        return null;
    }

    getDataValue()
    {
        var textValue = this.getValue();

        if (textValue != "" && this.type == "combo" && this.datalist.children.length > 0) // KEEP THE IF-ELSE FOR NOW, IN CASE THERE'S A NEED TO DEBUG
        {
            return Array.from(this.datalist.children).find(option=>option.value == textValue).getAttribute("data-value");
        }
        else if (textValue != "" && this.type == "select")
        {
            return this.fields[0].value;
        }

        return null;
    }

    resetValue()
    {
        switch (this.type)
        {
            case "table":
                for (const inputExRow of this.inputExs)
                {
                    for (const key in inputExRow)
                    {
                        inputExRow[key].resetValue();
                    }
                }
            default:
                this.setValue(this.defaultValue ?? "");
                break;
        }
    }

    setDefaultValue(value, setAsValue = false)
    {        
        if (this.type != "table" && this.type != "inline-table")
        {
            this.defaultValue = value;
            
            if (setAsValue)
            {
                this.setValue(value);
            }
        }
    }

    getDefaultValue()
    {
        return this.defaultValue;
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

        return null;
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

        return null;
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

        return null;
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

    // METHODS THAT QUERY OR CHANGE THE STATE OF INPUTEX
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

    addStatusPane()
    {
        if (this.statusPane == null || this.statusPane == undefined)
        {
            this.statusPane = createSimpleElement(NO_NS, "span", "status-pane", this.fieldWrapper);
            this.statusPane["spacer"] = document.createTextNode(" ");
            this.fieldWrapper.insertBefore(this.statusPane["spacer"], this.statusPane);
        }

        return this.statusPane;
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
        if (typeof(msg) == "string") // && msg.trim() != "") // allowed blank text
        {
            if (this.statusPane == null || this.statusPane == undefined)
            {
                this.addStatusPane();
            }
            else
            {
                this.resetStatus();
            }
        
            this.statusMarker = createElementEx(NO_NS, "span", this.statusPane, null, "class", "status-marker");
            this.statusPane.appendChild(document.createTextNode(" "));
            this.statusMsg = createElementEx(NO_NS, "span", this.statusPane, null, "class", "status-message");
            
            this.statusMarker.setAttribute("title", msg);
            this.statusMsg.innerHTML = msg;
            this.statusPane.classList.add(status);
            // this.statusMarker.innerHTML = (status == "success" ? "\u2713" : (status == "error" ? "\u2717" : (status == "info" ? "\u2139" : (status == "wait" ? "" : "*"))));
            this.statusMarker.innerHTML = (status == "success" ? "\u2713" : (status == "error" ? "\u2717" : (status == "info" ? getUnicodeCharacter(0x1f6c8) : (status == "wait" ? "" : "*"))));

            // clear any existing timers
            clearTimeout(this.statusTimer);
            this.statusTimer = null;

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

    showWait(infoMsg) // blue
    {
        this.setStatusMessage(infoMsg, "wait");
    }

    resetStatus()
    {
        if (this.statusPane != null && this.statusPane != undefined)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.setAttribute("class", "status-pane");
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
            else if (this.statusPane.classList.contains("wait"))
            {
                return "wait";
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

    addEvent(eventType, func, index = -1, addEventListenerOption = false) // single and multiple inputs except for buttons and buttonExs
    {
        if (!this.isMultipleInput || this.type == "combo")
        {
            this.listeners.field[eventType] = func;
            this.fields[0].addEventListener(eventType, this.listeners.field[eventType], addEventListenerOption);
        }
        else if (this.type != "buttons" && this.type != "buttonExs" && (index == null || index == undefined || index == -1))
        {
            for (const inputEx of this.inputExs) {
                inputEx.addEvent(eventType, func, index, addEventListenerOption);
            }
        }
        else if (typeof(index) == "number" && Number.parseInt(index) >= 0)
        {
            this.inputExs[index].addEvent(eventType, func);
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

    showColon(show = true) // single-input only
    {
        if (this.colon != null)
        {
            this.colon.classList.toggle("hidden", !show);
        }
    }

    hideColon() // single-input only
    {
        this.showColon(false);
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

        this.container = createElementEx(NO_NS, "div", parentEl, null, "class", "form-ex");
        this.useFormElement = useFormElement; // will contain the input element with its label or other InputEx elements
        this.fieldWrapper = createElementEx(NO_NS, (useFormElement ? "form" : "div"), this.container, null, "class", "fields");
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
        this.statusMarker = null;
        this.statusMsg = null;
        this.formMode = 0; // 0: Adding/Creating Record; 1: Editing; 2: Viewing

        [this.container, this.fieldWrapper].forEach(el=>el["formEx"] = this);
    }

    setTitle(titleText = "", headingLevel = 1) // blank titleText removes the form title header
    {
        return this.addHeader(titleText, headingLevel, "", true);
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
        invalidArgsStr += (typeof(value) == "string" || typeof(value) == "number" ? "" : (invalidArgsStr == "" ? "" : "; ") + "value:" + value);
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
        if (typeof(value) == "string")
        {
            value = value.trim();
        }
        tooltip = tooltip.trim();
        dbColName = dbColName.trim();
        dbTableName = dbTableName.trim();

        this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), type, useFieldSet));
        this.inputExs[this.inputExs.length - 1].parentFormEx = this;
        
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

        if (value != "" || typeof(value) == "number") // the number validation is needed as JS interprets 0 == "" as true
        {
            this.inputExs[this.inputExs.length - 1].setDefaultValue(value, true);
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
        }

        return this.statusPane;
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
        if (typeof(msg) == "string") // && msg.trim() != "") // allowed blank text
        {
            if (this.statusPane == null || this.statusPane == undefined)
            {
                this.addStatusPane();
            }
            else
            {
                this.resetStatus();
            }
        
            this.statusMarker = createElementEx(NO_NS, "span", this.statusPane, null, "class", "status-marker");
            this.statusPane.appendChild(document.createTextNode(" "));
            this.statusMsg = createElementEx(NO_NS, "span", this.statusPane, null, "class", "status-message");
            
            this.statusMarker.setAttribute("title", msg);
            this.statusMsg.innerHTML = msg;
            this.statusPane.classList.add(status);
            // this.statusMarker.innerHTML = (status == "success" ? "\u2713" : (status == "error" ? "\u2717" : (status == "info" ? "\u2139" : (status == "wait" ? "" : "*"))));
            this.statusMarker.innerHTML = (status == "success" ? "\u2713" : (status == "error" ? "\u2717" : (status == "info" ? getUnicodeCharacter(0x1f6c8) : (status == "wait" ? "" : "*"))));

            // clear any existing timers
            clearTimeout(this.statusTimer);
            this.statusTimer = null;

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

    showWait(infoMsg) // blue
    {
        this.setStatusMessage(infoMsg, "wait");
    }

    resetStatus()
    {
        if (this.statusPane != null && this.statusPane != undefined)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.setAttribute("class", "status-pane");
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
            else if (this.statusPane.classList.contains("wait"))
            {
                return "wait";
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

        this.container.classList.toggle("full-width", setting);
    }

    isFullWidth()
    {
        return this.container.classList.contains("full-width");
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

    gridDisplay(enable = true, gridTemplateColumns = "auto auto")
    {
        if (enable)
        {
            this.fieldWrapper.style.display = "grid";
            this.fieldWrapper.style.gridTemplateColumns = gridTemplateColumns;
        }
        else
        {
            this.fieldWrapper.style.display = null;
            this.fieldWrapper.style.gridTemplateColumns = null;
        }
    }
}

class DialogEx
{
    constructor(parent = null, id = "")
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "dialog-ex scrim");
        this.dialogBox = createElementEx(NO_NS, "div", this.scrim, null, "class", "dialog");
        this.closeBtn = createElementEx(NO_NS, "button", this.dialogBox, null, "type", "button", "class", "close-btn", "title", "Close");
        this.closeBtn.innerHTML = "<span class=\"material-icons-round\">close</span>";
        this.closeBtn.addEventListener("click", (event)=>{
            this.close();
        });
        this.formEx = null;
        this.id = id;
        [this.scrim, this.dialogBox, this.closeBtn].forEach(el=>el["dialogEx"] = this);
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
            this.btnGrp.fields[i].addEventListener("click", (clickEvent)=>{
                this.returnValue = i;
                this.close();
            });

            if (i < func.length && func[i] != null)
            {
                this.btnGrp.fields[i].addEventListener("click", func[i]);
            }

            // this.btnGrp.fields[this.btnGrp.fields.length - 1 - i].addEventListener("click", (clickEvent)=>{
            //     this.returnValue = i;
            //     this.close();
            // });

            // if (i > 0 && i < func.length + 1 && func[i - 1] != null)
            // {
            //     this.btnGrp.fields[this.btnGrp.fields.length - 1 - i].addEventListener("click", func[i - 1]);
            // }
        }
        this.btnGrp.fields[this.btnGrp.fields.length - 1].focus();
    }
}

class ScoreSheetElement
{
    constructor(parent = null, id = "", type = "", label = "", dbColName = "", dbTableName = "", score = 0, weight = 0, min = 0, max = 0, step = 1, content = [], updateCallBack = null)
    {
        this.parent = parent; // parent ScoreSheetElement; will be useful for input items under criteria
        this.id = id;
        this.type = type; // criteria1 | criteria2 | criteria3 | h1 | h2 | h3 | h4 | h5 | h6 | display | display-check | display-list | display-list-_ | input-_
        this.label = label;
        this.dbColName = dbColName;
        this.dbTableName = dbTableName;
        this.content = content;
        this.score = score;
        this.weight = weight;
        this.min = min;
        this.max = max;
        this.step = 1;
        this.updatePoints = updateCallBack; // a function that will be attached to input elements
    }

    addContent(item)
    {
        if (type(item) == "object")
        {
            this.content.push(item);

            return item;
        }

        return null;
    }

    countContentItems()
    {
        return this.content.length;
    }
}

class SubscoreDisplay extends DisplayEx
{
    constructor(scoreSheet, criteria)
    {
        super(scoreSheet.fieldWrapper, "div");
        this.container.classList.add("subscore-display");
        scoreSheet.displayExs[criteria.id] = this;
        
        this.criteria = criteria;
        this.title = this.addHeader(criteria.name + " (<i>max: " + criteria.weight + " points</i>)", 3);
        this.displays = [];
        this.fields = [];
        this.totalScoreDisplay = new DisplayEx(this.content, "div", "", "0", "Total Points");
        this.totalScoreDisplay.showColon();
        this.totalScoreDisplay.container.classList.add("subscore-display-points");

        if ("contents" in criteria)
        {
            for (const content of criteria["contents"])
            {
                switch (content.type)
                {
                    case "display":
                    case "display-list":
                    case "display-check":
                        var displayEx = new DisplayEx(null, "div", content.dbColName ?? "", "N/A", content.label, "");
                        this.addContent(displayEx.container);
                        displayEx.showColon();
                        displayEx.setFullWidth();
                        break;
                    case "display-list-A":
                        var displayEx = new DisplayEx(null, "div", content.dbColName ?? "", "", content.label, "");
                        displayEx.showColon();
                        this.addContent(displayEx.container);
                        var list = createElementEx(NO_NS, "ol", null, null, "type", "A");
                        for (const item of content.contents)
                        {
                            if (item.type == "list-item")
                            {
                                addText(item.contents, createElementEx(NO_NS, "li", list));
                            }
                        }
                        displayEx.addContent(list);
                        break;
                    case "input-number":
                        var inputEx = new InputEx(null, content.dbColName, "number");
                        inputEx.setLabelText(content.label);                        
                        this.addContent(inputEx.container);
                        if ("max" in content)
                        {
                            inputEx.setMin(content["min"]);
                        }
                        if ("min" in content)
                        {
                            inputEx.setMax(content["max"]);
                        }
                        if ("step" in content)
                        {
                            inputEx.setStep(content["step"]);
                        }
                        inputEx.fields[0].classList.add("right");
                        inputEx.setFullWidth();
                        inputEx.showColon();
                        inputEx.setBlankStyle();
                        break;
                    case "header-1":
                    case "header-2":
                    case "header-3":
                    case "header-4":
                    case "header-5":
                    case "header-6":
                        addText(content["content"], createElementEx(NO_NS, "h" + content.type[content.type.length - 1], this.content));
                        break;
                    case "lineBreak":
                        this.addLineBreak();
                        break;
                }
            }
        }
    }

    addHeader(headerText, level)
    {
        var header = createElementEx(NO_NS, "h" + level, this.content);
        header.innerHTML = headerText;

        return header;
    }

    addContent(content, parent = null)
    {
        super.addContent(content, parent);

        super.addContent(this.totalScoreDisplay.container, parent);

        return content;
    }
}

class ScoreSheet extends FormEx
{
    constructor(parentEl = null, id = "", useFormElement = true)
    {
        super(parentEl, id, useFormElement);
        this.setTitle("Score Sheet", 2); //.style.gridColumn = "span 12";
        this.setFullWidth();
        // this.gridDisplay(true, "auto auto auto auto auto auto auto auto auto auto auto auto");

        this.displayExs = [];
        this.data = [];
        this.dataLoaded = null;

        this.jobApplication = null;
        this.positionApplied = null;
        this.criteria = null;

        this.loadButton = this.addInputEx("Load Application", "buttonEx");
        this.loadButton.setFullWidth();
        // this.loadButton.container.style.gridColumn = "span 12";
        this.loadButton.fieldWrapper.classList.add("right");

        this.loadButton.addEvent("click", this.loadApplicationBtn_Click);

        
    }

    loadApplicationBtn_Click(event) // inherits the scope of the clicked button/element
    {
        var scoreSheet = null, clickedElement = null, div = null;

        scoreSheet = this.inputEx.parentFormEx;
        clickedElement = this; //event.srcElement; // event.target;

        var retrieveApplicantDialog = null;
        if (this.innerHTML == "Load Application")
        {
            retrieveApplicantDialog = new DialogEx(scoreSheet.fieldWrapper);
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

            searchResult.runAfterFilling = ()=>{
                retrieveApplicantDialogBtnGrp.inputExs[0].addEvent("click", loadApplicationDialogClickEvent=>{
                    if (searchResult.getValue() == "" || searchResult.getValue() == null)
                    {
                        retrieveApplicantDialog.formEx.raiseError("Please select an item to load before continuing");
                        return;
                    }
                    
                    scoreSheet.jobApplication = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0];
                    
                    // console.log(scoreSheet);
                    console.log(scoreSheet.jobApplication);

                    if (!("applicantInfo" in scoreSheet.displayExs))
                    {
                        div = scoreSheet.addDisplayEx("div", "applicantInfo");
                        div.setFullWidth();
                        div.container.style.gridColumn = "span 12";
                        div.content.style.display = "grid";
                        div.content.style.gridTemplateColumns = "auto auto";
                        div.content.style.gridGap = "0.5em";            
    
                        [
                            {colName:"application_code", label:"Application Code"},
                            // "",
                            {colName:"applicant_name", label:"Applicant's Name"},
                            {colName:"present_school", label:"School"},
                            {colName:"present_position", label:"Present Position"},
                            {colName:"present_designation", label:"Designation"},
                            {colName:"present_district", label:"District"},
                            {colName:"position_title_applied", label:"Position Applied For"}
                        ].forEach(obj=>{
                            if (obj == "")
                            {
                                div.addLineBreak();
                                return;
                            }
                            var inputEx = scoreSheet.addInputEx(obj.label, "text", "", "", obj.colName);
                            inputEx.setVertical();
                            div.addContent(inputEx.container);
                            inputEx.enable(null, inputEx != scoreSheet.dbInputEx["application_code"] && inputEx != scoreSheet.dbInputEx["applicant_name"] && inputEx != scoreSheet.dbInputEx["position_title_applied"]);
                            inputEx.fields[0].style.color = "black";

                            if (obj.colName == "application_code")
                            {
                                div.addContent(this.inputEx.container);
                                this.inputEx.container.style.gridColumn = "span 1";        
                            }
                        });
                    }
            
                    scoreSheet.dbInputEx["application_code"].setDefaultValue(scoreSheet.jobApplication["application_code"], true);
                    scoreSheet.dbInputEx["applicant_name"].setDefaultValue(scoreSheet.jobApplication["applicant_name"], true);
                    scoreSheet.dbInputEx["position_title_applied"].setDefaultValue(scoreSheet.jobApplication["position_title_applied"], true);

                    scoreSheet.positionApplied = document.positions.find(position=>position["plantilla_item_number"] == scoreSheet.jobApplication["plantilla_item_number_applied"] || (position["position_title"] == scoreSheet.jobApplication["position_title_applied"] && position["parenthetical_title"] == scoreSheet.jobApplication["parenthetical_title_applied"]) || position["position_title"] == scoreSheet.jobApplication["position_title_applied"]);
                    scoreSheet.criteria = ScoreSheet.getCriteria(scoreSheet.positionApplied);

                    for (const criteria of scoreSheet.criteria)
                    {
                        if (criteria.weight > 0)
                        {
                            div = new SubscoreDisplay(scoreSheet, criteria);
                        }
                    }

                    // // Education
                    // var educAttainment = scoreSheet.jobApplication["educational_attainmentIndex"];
                    // var degreeTaken = scoreSheet.jobApplication["degree_taken"];

                    // var highestPostGradDegrees = degreeTaken.filter(degree=>{ // in terms of education increment
                    //     switch (educAttainment)
                    //     {
                    //         case 0: case 1: case 2: case 3: case 4: case 5:
                    //             return false;
                    //             break;
                    //         case 6:
                    //             return degree["degree_typeIndex"] > 6 && degree["degree_typeIndex"] < 8;
                    //             break;
                    //         case 7:
                    //             return degree["degree_typeIndex"] > 7 && degree["degree_typeIndex"] < 9;
                    //             break;
                    //         default: // highest educational increment
                    //             break;
                    //     }
                    // });
                    // var highestPostGradDegree = (highestPostGradDegrees.length == 0 ? null : highestPostGradDegrees.reduce((prevRow, nextRow)=>{
                    //     var test = prevRow["degree_typeIndex"] < nextRow["degree_typeIndex"]
                    //     || prevRow["degree_typeIndex"] == nextRow["degree_typeIndex"]
                    //     && (prevRow["units_earned"] <= nextRow["units_earned"] || prevRow["units_earned"] == "")
                    //     || (nextRow["complete_academic_requirements"] ?? 0);
        
                    //     return ( test
                    //         ? nextRow
                    //         : prevRow
                    //     );
                    // }));
        
                    // var postGradUnits = (highestPostGradDegree == null || educAttainment <= 5 || educAttainment >= 8 ? null : highestPostGradDegree["units_earned"]);
                    // postGradUnits = (postGradUnits == "" ? null : postGradUnits);
                    // var completeAcadReq = (highestPostGradDegree == null ? 0 : highestPostGradDegree["complete_academic_requirements"]); //TEMPORARY
                    // // var completeAcadReq = highestPostGradDegree["complete_academic_requirements"]; // DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!

                    // var appliedPosition = document.positions.filter(position=>position["position_title"] == scoreSheet.jobApplication["position_title_applied"] || position["plantilla_item_number"] == scoreSheet.jobApplication["plantilla_item_number_applied"])[0];
                    // var hasSpecEduc = (scoreSheet.jobApplication["has_specific_education_required"] == null ? "n/a" : (scoreSheet.jobApplication["has_specific_education_required"] == 1 ? "Yes" : "No"));
                    
                    // var incrementObj = document.mpsEducIncrement.filter(increment=>(
                    //     increment["baseline_educational_attainment"] == educAttainment
                    //     && (postGradUnits == null
                    //     || (postGradUnits != null && increment["baseline_postgraduate_units"] <= postGradUnits))
                    //     && increment["complete_academic_requirements"] == completeAcadReq
                    // ));
                    // var applicantEducIncrement = incrementObj[0]["education_increment_level"];
                    // incrementObj = document.mpsEducIncrement.filter(increment=>(
                    //     increment["baseline_educational_attainment"] == appliedPosition["required_educational_attainment"]
                    // ));
                    // var requiredEducIncrement = incrementObj[0]["education_increment_level"];
                    // var educIncrementAboveQS = applicantEducIncrement - requiredEducIncrement;

                    // scoreSheet.displayExs["education"].displays["educational_attainment"].setHTMLContent(scoreSheet.jobApplication["educational_attainment"]);
                    // scoreSheet.displayExs["education"].displays["postgraduate_units"].setHTMLContent(postGradUnits == null ? "none" : postGradUnits.toString());
                    // scoreSheet.displayExs["education"].displays["has_specific_education_required"].setHTMLContent(hasSpecEduc);
                    // scoreSheet.displayExs["education"].displays["educIncrements"].setHTMLContent(educIncrementAboveQS.toString());

                    // scoreSheet.displayExs["education"].totalPoints.setHTMLContent(this.getEducScore(educIncrementAboveQS, appliedPosition["position_categoryId"], appliedPosition["salary_grade"]).toString());

                    // // Training
                    // var relevantTrainings = scoreSheet.jobApplication["relevant_training"];
                    // var relevantTrainingHours = (relevantTrainings.length > 0 ? relevantTrainings.map(training=>training["hours"]).reduce((total, nextVal)=>total + nextVal) : 0);
                    // var applicantTrainingIncrement = Math.trunc(relevantTrainingHours / 8 + 1);
                    // var hasSpecTraining = (scoreSheet.jobApplication["has_specific_training"] == null ? "n/a" : (scoreSheet.jobApplication["has_specific_training"] == 1 ? "Yes" : "No"));
                    // var hasMoreTraining = (scoreSheet.jobApplication["has_more_unrecorded_training"] == null ? "n/a" : (scoreSheet.jobApplication["has_more_unrecorded_training"] == 1 ? "Yes" : "No"));
                    // var requiredTrainingHours = appliedPosition["required_training_hours"];
                    // var requiredTrainingIncrement = Math.trunc(requiredTrainingHours / 8 + 1);
                    // var trainingIncrementAboveQS = applicantTrainingIncrement - requiredTrainingIncrement;
                    
                    // scoreSheet.displayExs["training"].displays["relevant_training_hours"].setHTMLContent(relevantTrainingHours.toString());
                    // scoreSheet.displayExs["training"].displays["relevant_training_count"].setHTMLContent(relevantTrainings.length.toString());
                    // scoreSheet.displayExs["training"].displays["has_specific_training"].setHTMLContent(hasSpecTraining);
                    // scoreSheet.displayExs["training"].displays["has_more_unrecorded_training"].setHTMLContent(hasMoreTraining);
                    // scoreSheet.displayExs["training"].displays["trainIncrements"].setHTMLContent(trainingIncrementAboveQS.toString());

                    // scoreSheet.displayExs["training"].totalPoints.setHTMLContent(this.getTrainingScore(trainingIncrementAboveQS, appliedPosition["position_categoryId"], appliedPosition["salary_grade"]).toString());
                    
                    // // Experience
                    // var relevantWorkExp = scoreSheet.jobApplication["relevant_work_experience"];
                    // var relevantWorkExpDuration = (relevantWorkExp.length > 0 ? relevantWorkExp.map(workExp=>this.getDuration(workExp["start_date"], (workExp["end_date"] == null || workExp["end_date"] == "" ? this.defaultEndDate : workExp["end_date"]))).reduce(this.addDuration): {y:0, m:0, d:0});
                    // var applicantWorkExpIncrement = Math.trunc(this.convertDurationToNum(relevantWorkExpDuration) * 12 / 6 + 1);
                    // var hasSpecWorkExp = (scoreSheet.jobApplication["has_specific_work_experience"] == null ? "n/a" : (scoreSheet.jobApplication["has_specific_work_experience"] == 1 ? "Yes" : "No"));
                    // var hasMoreWorkExp = (scoreSheet.jobApplication["has_more_unrecorded_work_experience"] == null ? "n/a" : (scoreSheet.jobApplication["has_more_unrecorded_work_experience"] == 1 ? "Yes" : "No"));
                    // var requiredWorkExpYears = appliedPosition["required_work_experience_years"];
                    // var requiredWorkExpIncrement = Math.trunc(requiredWorkExpYears * 12 / 6 + 1);
                    // var workExpIncrementAboveQS = applicantWorkExpIncrement - requiredWorkExpIncrement;
                    
                    // scoreSheet.displayExs["experience"].displays["relevant_work_experience_years"].setHTMLContent(this.convertDurationToString(relevantWorkExpDuration));
                    // scoreSheet.displayExs["experience"].displays["relevant_work_experience_count"].setHTMLContent(relevantWorkExp.length.toString());
                    // scoreSheet.displayExs["experience"].displays["has_specific_work_experience"].setHTMLContent(hasSpecWorkExp);
                    // scoreSheet.displayExs["experience"].displays["has_more_unrecorded_work_experience"].setHTMLContent(hasMoreWorkExp);
                    // scoreSheet.displayExs["experience"].displays["expIncrements"].setHTMLContent(workExpIncrementAboveQS.toString());

                    // scoreSheet.displayExs["experience"].totalPoints.setHTMLContent(this.getTrainingScore(workExpIncrementAboveQS, appliedPosition["position_categoryId"], appliedPosition["salary_grade"]).toString());

                    // var div = scoreSheet.displayExs["educationApp"];

                    // var divHeader = div.content.children[0];
                    
                    // div.container.appendChild(divHeader);
                    // div.container.appendChild(div.totalPoints.container);
                    // div.content.innerHTML = "";
                    // div.content.appendChild(divHeader);
                    // div.totalPoints.setHTMLContent("0");
                    // div.fields = [];

                    // if (appliedPosition["required_work_experience_years"] != null && appliedPosition["required_work_experience_years"] != 0 || appliedPosition["specific_work_experience_required"] != null)
                    // {
                    //     div.addContent(scoreSheet.addHeader("Guide (for positions with experience requirement):", 6));

                    //     var list = createElementEx(NO_NS, "ol", null, null, "type", "A", "style", "font-size: 0.8em");
                
                    //     div.addContent(list);
                
                    //     [
                    //         "Action Plan approved by the Head of Office",
                    //         "Accomplishment Report verified by the Head of Office",
                    //         "Certification of utilization/adoption signed by the Head of Office"
                    //     ].forEach(text=>{
                    //         addText(text, createElementEx(NO_NS, "li", list));
                    //     });
                
                    //     [
                    //         "Relevant",
                    //         {colName:"number_of_app_educ_r_actionplan", label:"A only"},
                    //         {colName:"number_of_app_educ_r_actionplan_ar", label:"A and B"},
                    //         {colName:"number_of_app_educ_r_actionplan_ar_adoption", label:"All MOVs"},
                    //         "Not Relevant",
                    //         {colName:"number_of_app_educ_nr_actionplan", label:"A only"},
                    //         {colName:"number_of_app_educ_nr_actionplan_ar", label:"A and B"},
                    //         {colName:"number_of_app_educ_nr_actionplan_ar_adoption", label:"All MOVs"}
                    //     ].forEach(obj=>{
                    //         if (obj == "")
                    //         {
                    //             div.addLineBreak();
                    //             return;
                    //         }
                    //         else if (typeof(obj) == "string")
                    //         {
                    //             div.addContent(scoreSheet.addHeader("<big>" + obj + ":</big>", 6));
                    //             return;
                    //         }
                    //         var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
                    //         field.setFullWidth();
                    //         field.showColon();
                    //         field.setBlankStyle();
                    //         field.setMin(0);
                    //         field.setMax(999);
                    //         field.setWidth("3em");
                    //         field.setLabelWidth("9em");
                    //         field.fields[0].classList.add("right");
                    //         div.fields[obj.colName] = field;
                    //         div.addContent(field.container);

                    //         div.fields[obj.colName].addEvent("change", changeEvent=>{
                    //             var total = scoreSheet.displayExs["educationApp"].fields["number_of_app_nr_educ_actionplan"].getValue() * 1
                    //                 + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_nr_actionplan_ar"].getValue() * 3
                    //                 + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_nr_actionplan_ar_adoption"].getValue() * 5
                    //                 + scoreSheet.displayExs["educationApp"].fields["number_of_app_r_educ_actionplan"].getValue() * 5
                    //                 + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_r_actionplan_ar"].getValue() * 7
                    //                 + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_r_actionplan_ar_adoption"].getValue() * 10;

                    //             scoreSheet.displayExs["educationApp"].totalPoints.setHTMLContent((total > scoreSheet.criteria["educationApp"].weight ? 10 : total).toString());
                    //         });
                    //     });
                    // }
                    // else
                    // {
                    //     var field = scoreSheet.addInputEx("GWA in the highest academic level earned", "number", "1", "", "app_educ_gwa");
                    //     field.showColon();
                    //     field.setBlankStyle();
                    //     field.setMin(1);
                    //     field.setMax(100);
                    //     field.setStep(0.1);
                    //     field.setWidth("3.5em");
                    //     field.fields[0].classList.add("right");
                    //     // div.fields.push(field);
                    //     div.fields["app_educ_gwa"] = field;
                    //     div.addContent(field.container);                   
                        
                    //     div.fields["app_educ_gwa"].addEvent("change", changeEvent=>{
                    //         scoreSheet.displayExs["educationApp"].totalPoints.setHTMLContent((Math.round(div.fields["app_educ_gwa"].getValue() / 100 * scoreSheet.criteria["educationApp"].weight * 100) / 100).toString());
                    //     });
                    // }

                    // div.addContent(div.totalPoints.container);

                    // for (const key in scoreSheet.jobApplication)
                    // {
                    //     switch (key)
                    //     {
                    //         case "applicant_name": case "applicant_option_label": case "application_code":
                    //         case "age": case "birth_date": case "birth_place": case "civil_status": case "civil_statusIndex":
                    //         case "degree_taken": case "educational_attainment": case "educational_attainmentIndex":
                    //         case "ethnicityId":
                    //         case "given_name": case "middle_name": case "family_name": case "spouse_name": case "ext_name":
                    //         case "has_more_unrecorded_training":
                    //         case "has_more_unrecorded_work_experience":
                    //         case "has_specific_competency_required":
                    //         case "has_specific_education_required":
                    //         case "has_specific_training":
                    //         case "has_specific_work_experience":
                    //         case "parenthetical_title_applied":
                    //         case "permanent_addressId":
                    //         case "personId":
                    //         case "plantilla_item_number_applied":
                    //         case "position_title_applied":
                    //         case "present_addressId":
                    //         case "relevant_eligibility":
                    //         case "relevant_training":
                    //         case "relevant_work_experience":
                    //         case "religionId":
                    //         case "sex":
                    //             // do nothing
                    //             break;
                    //         case "most_recent_performance_rating":
                    //         case "number_of_citation_movs":
                    //         case "number_of_academic_award_movs":
                    //         case "number_of_awards_external_office_search":
                    //         case "number_of_awards_external_org_level_search":
                    //         case "number_of_awards_central_co_level_search":
                    //         case "number_of_awards_central_national_search":
                    //         case "number_of_awards_regional_ro_level_search":
                    //         case "number_of_awards_regional_national_search":
                    //         case "number_of_awards_division_sdo_level_search":
                    //         case "number_of_awards_division_national_search":
                    //         case "number_of_awards_school_school_level_search":
                    //         case "number_of_awards_school_sdo_level_search":
                    //         case "number_of_research_proposal_only":
                    //         case "number_of_research_proposal_ar":
                    //         case "number_of_research_proposal_ar_util":
                    //         case "number_of_research_proposal_ar_util_adopt":
                    //         case "number_of_research_proposal_ar_util_cite":
                    //         case "number_of_smetwg_issuance_cert":
                    //         case "number_of_smetwg_issuance_cert_output":
                    //         case "number_of_speakership_external_office_search":
                    //         case "number_of_speakership_external_org_level_search":
                    //         case "number_of_speakership_central_co_level_search":
                    //         case "number_of_speakership_central_national_search":
                    //         case "number_of_speakership_regional_ro_level_search":
                    //         case "number_of_speakership_regional_national_search":
                    //         case "number_of_speakership_division_sdo_level_search":
                    //         case "number_of_speakership_division_national_search":
                    //         case "neap_facilitator_accreditation":
                    //         case "app_educ_gwa":
                    //         case "number_of_app_educ_r_actionplan":
                    //         case "number_of_app_educ_r_actionplan_ar":
                    //         case "number_of_app_educ_r_actionplan_ar_adoption":
                    //         case "number_of_app_educ_nr_actionplan":
                    //         case "number_of_app_educ_nr_actionplan_ar":
                    //         case "number_of_app_educ_nr_actionplan_ar_adoption":
                    //         case "number_of_app_train_relevant_cert_ap":
                    //         case "number_of_app_train_relevant_cert_ap_arlocal":
                    //         case "number_of_app_train_relevant_cert_ap_arlocal_arother":
                    //         case "number_of_app_train_not_relevant_cert_ap":
                    //         case "number_of_app_train_not_relevant_cert_ap_arlocal":
                    //         case "number_of_app_train_not_relevant_cert_ap_arlocal_arother":
                    //         case "score_exam":
                    //         case "score_skill":
                    //         case "score_bei":
                    //         case "lept_rating":
                    //         case "ppstcoi":
                    //         case "ppstncoi":
                    //         case "trainer_award_level":
                    //             // console.log(key);
                    //             if (key in scoreSheet.dbInputEx)
                    //             {
                    //                 scoreSheet.dbInputEx[key].setDefaultValue(scoreSheet.jobApplication[key] ?? "", true);
                    //             }
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    // }

                    retrieveApplicantDialog.close();
                    this.innerHTML = "Reset Score Sheet";
                });
            };

            searchBox.addEvent("keyup", keyupEvent=>{
                searchResult.clearList();

                searchResult.show();
                retrieveApplicantDialogBtnGrp.inputExs[0].enable();

                searchResult.setStatusMsgTimeout = -1;
                searchResult.showWait("Retrieving . . .");

                searchResult.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=applicationsByApplicantOrCode&srcStr=" + searchBox.getValue(), "applicant_option_label", "application_code");
            });
        }
        else if (this.innerHTML == "Reset Score Sheet")
        {
            scoreSheet.resetForm();

            this.innerHTML = "Load Application";
        }

    }

    addDisplayEx(typeText = "div", id = "", contentText = "", labelText = "", tooltip = "")
    {
        var newDisplayEx = null;
        if (typeof(id) == "string" && id != "")
        {
            newDisplayEx = new DisplayEx(this.fieldWrapper, typeText, id, contentText, labelText, tooltip);
            this.displayExs[id] = newDisplayEx;
        }
        else
        {
            newDisplayEx = new DisplayEx(this.fieldWrapper, typeText, this.id + this.displayExs.length, contentText, labelText, tooltip);
            this.displayExs.push(newDisplayEx);
        }
        return newDisplayEx;
    }

    static getCriteria(positionObj) // COMPUTATION INCLUDES NON-EXISTENT SALARY GRADES IN THE NON-TEACHING POSITIONS (23, 25-26); CONSIDER IN FUTURE ISSUES; MAY ALSO CONFUSE DEVELOPERS DURING USE, ESPECIALLY WHEN THE NAME OF VARIABLE IS `scoreSheet`
    {
        var salaryGrade, positionCategory, positionRequiresExp;
        console.log(positionObj);
        [salaryGrade, positionCategory, positionRequiresExp] = [positionObj["salary_grade"], positionObj["position_categoryId"], typeof(positionObj["required_work_experience_years"]) == "number"];

        var criteria = [
            new ScoreSheetElement(
                null, "education", "criteria1", "Education", "education", "", 0,
                (positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10), 0, 
                (positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10), 1, [
                    new ScoreSheetElement("education", "educational_attainment", "display", "Highest level of education attained", "educational_attainment"),
                    new ScoreSheetElement("education", "degrees_taken", "display-list", "Degrees taken", "degrees_taken", "", 1, 1, 0, 0, 0, []),
                    new ScoreSheetElement("education", "postgraduate_units", "display", "Units taken towards the completion of a Postgraduate Degree", "postgraduate_units"),
                    new ScoreSheetElement("education", "has_specific_education_required", "display", "Has taken education required for the position", "has_specific_education_required"),
                    new ScoreSheetElement("education", "", "line-break"),
                    new ScoreSheetElement("education", "educIncrements", "display", "Number of increments above the Qualification Standard", "educIncrements"),
                    new ScoreSheetElement("education", "isEducQualified", "display-check", "Applicant is qualified", "isEducQualified")
                ], null
            ),
            new ScoreSheetElement(
                null, "training", "criteria1", "Training", "training", "", 0,
                (positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10), 0,
                (positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10), 1, [
                    new ScoreSheetElement("training", "relevant_training_hours", "display", "Total number of relevant training hours", "relevant_training_hours"),
                    new ScoreSheetElement("training", "relevant_training_count", "display", "Number of relevant trainings considered", "relevant_training_count"),
                    new ScoreSheetElement("training", "has_specific_training", "display", "Has undergone required training for the position", "has_specific_training"),
                    new ScoreSheetElement("training", "has_more_unrecorded_training", "display", "Has unconsidered trainings", "has_more_unrecorded_training"),
                    new ScoreSheetElement("training", "", "line-break"),
                    new ScoreSheetElement("training", "trainIncrements", "display", "Number of increments above the Qualification Standard", "trainIncrements"),
                    new ScoreSheetElement("training", "isTrainingQualified", "display-check", "Applicant is qualified", "isTrainingQualified")
                ], null
            ),
            new ScoreSheetElement(
                null, "experience", "criteria1", "Experience", "experience", "", 0,
                (positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10), 0,
                (positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10), 1, [
                    new ScoreSheetElement("experience", "relevant_work_experience_years", "display", "Total number of years of relevant work experience", "relevant_work_experience_years"),
                    new ScoreSheetElement("experience", "relevant_work_experience_count", "display", "Number of relevant employment considered", "relevant_work_experience_count"),
                    new ScoreSheetElement("experience", "has_specific_work_experience", "display", "Has the required work experience for the position", "has_specific_work_experience"),
                    new ScoreSheetElement("experience", "has_more_unrecorded_work_experience", "display", "Has unconsidered employment", "has_more_unrecorded_work_experience"),
                    new ScoreSheetElement("experience", "", "line-break"),
                    new ScoreSheetElement("experience", "expIncrements", "display", "Number of increments above the Qualification Standard", "expIncrements"),
                    new ScoreSheetElement("experience", "isWorkExpQualified", "display-check", "Applicant is qualified", "isWorkExpQualified")
                ], null
            ),
            new ScoreSheetElement(
                null, "performance", "criteria1", "Performance", "performance", "", 0,
                (positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                0, 5, 0.1, [
                    new ScoreSheetElement("performance", "most_recent_performance_rating", "input-number", "Most recent relevant 1-year Performance Rating attained", "most_recent_performance_rating", "Job_Application", 1, (positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))), 0, 5, 0.1)
                ], null
            ),
            new ScoreSheetElement(
                null, "lept", "criteria1", "PBET/LET/LEPT Rating", "lept", "", 0,
                (positionCategory == 1 ? 10 : 0),
                0, 100, 0.1, [
                    new ScoreSheetElement("lept", "lept_rating", "input-number", "Applicant's PBET/LET/LEPT Rating", "lept_rating", "Job_Application", 1, (positionCategory == 1 ? 10 : 0), 0, 100, 0.1)
                ], null
            ),
            new ScoreSheetElement(
                null, "coi", "criteria1", "PPST Classroom Observable Indicators", "coi", "", 0,
                (positionCategory == 1 ? 35 : 0),
                0, 30, 0.1, [
                    new ScoreSheetElement("coi", "ppstcoi", "input-number", "Applicant's COT Rating", "ppstcoi", "Job_Application", 1, (positionCategory == 1 ? 35 : 0), 0, 30, 0.1)
                ], null
            ),
            new ScoreSheetElement(
                null, "ncoi", "criteria1", "PPST Non-Classroom Observable Indicators", "ncoi", "", 0,
                (positionCategory == 1 ? 25 : 0),
                0, 20, 0.1, [
                    new ScoreSheetElement("ncoi", "ppstncoi", "input-number", "Applicant's TRF Rating", "ppstncoi", "Job_Application", 1, (positionCategory == 1 ? 25 : 0), 0, 20, 0.1)
                ], null
            ),
            new ScoreSheetElement(
                null, "accomplishments", "criteria1", "Outstanding Accomplishments", "accomplishments", "", 0,
                (positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)), 0,
                (positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)), 1, [
                    new ScoreSheetElement(
                        "accomplishments", "awards", "criteria2", "Awards and Recognition", "awards", "", 0,
                        1, 0,
                        (positionCategory == 1 ? 0 : (positionCategory == 2 ? 7 : (positionCategory == 3 ? 2 : 4))), 1, [
                            new ScoreSheetElement(
                                "awards", "citation", "criteria3", "Citation or Commendation", "citation", "", 0,
                                1, 0,
                                999, 1, [
                                    new ScoreSheetElement("citation", "number_of_citation_movs", "input-number", "Number of letters of citation/commendation presented by applicant", "number_of_citation_movs", "Job_Application", 1, -1, 0, 999, 1)
                                ], null
                            )
                        ], null
                    )
                ], null
            )
        ];

        var criteria = [
            {
                id:"education",
                type:"criteria",
                name:"Education",
                weight:(positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10),
                max:(positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10),
                min:0,
                raw:false,
                contents:[
                    {type:"display",label:"Highest level of education attained",dbColName:"educational_attainment"},
                    {type:"display-list",label:"Degrees taken",dbColName:"degrees_taken"},
                    {type:"display",label:"Units taken towards the completion of a Postgraduate Degree",dbColName:"postgraduate_units"},
                    {type:"display",label:"Has taken education required for the position",dbColName:"has_specific_education_required"},
                    {type:"lineBreak"},
                    {type:"display",label:"Number of increments above the Qualification Standard",dbColName:"educIncrements"},
                    {type:"display-check",label:"Applicant is qualified",dbColName:"isEducQualified"}
                ]
            },
            {   
                id:"training",
                type:"criteria",
                name:"Training",
                weight:(positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10),
                max:(positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10),
                min:0,
                raw:false,
                contents:[
                    {type:"display",label:"Total number of relevant training hours",dbColName:"relevant_training_hours"},
                    {type:"display",label:"Number of relevant trainings considered",dbColName:"relevant_training_count"},
                    {type:"display",label:"Has undergone required training for the position",dbColName:"has_specific_training"},
                    {type:"display",label:"Has unconsidered trainings",dbColName:"has_more_unrecorded_training"},
                    {type:"lineBreak"},
                    {type:"display",label:"Number of increments above the Qualification Standard",dbColName:"trainIncrements"},
                    {type:"display-check",label:"Applicant is qualified",dbColName:"isTrainingQualified"}
                ]
            },
            {
                id:"experience",
                type:"criteria",
                name:"Experience",
                weight:(positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10),
                max:(positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10),
                min:0,
                raw:false,
                contents:[
                    {type:"display",label:"Total number of years of relevant work experience",dbColName:"relevant_work_experience_years"},
                    {type:"display",label:"Number of relevant employment considered",dbColName:"relevant_work_experience_count"},
                    {type:"display",label:"Has the required work experience for the position",dbColName:"has_specific_work_experience"},
                    {type:"display",label:"Has unconsidered employment",dbColName:"has_more_unrecorded_work_experience"},
                    {type:"lineBreak"},
                    {type:"display",label:"Number of increments above the Qualification Standard",dbColName:"expIncrements"},
                    {type:"display-check",label:"Applicant is qualified",dbColName:"isWorkExpQualified"}
                ]
            },
            {
                id:"performance",
                type:"criteria",
                name:"Performance",
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                max:5,
                min:0, // if no performance rating has been presented
                raw:true,
                contents:[
                    {type:"input-number",label:"Most recent relevant 1-year Performance Rating attained",dbColName:"most_recent_performance_rating",dbTableName:"Job_Application",max:5,min:0,step:0.1}
                ]
            },
            {
                id:"lept",
                type:"criteria",
                name:"PBET/LET/LEPT Rating",
                weight:(positionCategory == 1 ? 10 : 0),
                max:100,
                min:0,
                raw:true,
                contents:[
                    {type:"input-number",label:"Applicant's PBET/LET/LEPT Rating",dbColName:"lept_rating",dbTableName:"Job_Application",score:1,max:100,min:0,step:0.1}
                ]
            },
            {
                id:"ppstcoi",
                type:"criteria",
                name:"PPST Classroom Observable Indicators",
                weight:(positionCategory == 1 ? 35 : 0),
                max:30, // highest possible score in COT
                min:0,
                raw:true,
                contents:[
                    {type:"input-number",label:"Applicant's COT Rating",dbColName:"ppstcoi",dbTableName:"Job_Application",score:1,max:30,min:0,step:0.1}
                ]
            },
            {
                id:"ppstncoi",
                type:"criteria",
                name:"PPST Non-Classroom Observable Indicators",
                weight:(positionCategory == 1 ? 25 : 0),
                max:20, // highest possible score in the TRF
                min:0,
                raw:true,
                contents:[
                    {type:"input-number",label:"Applicant's TRF Rating",dbColName:"ppstncoi",dbTableName:"Job_Application",score:1,max:20,min:0,step:0.1}
                ]
            },
            {
                id:"accomplishments",
                type:"criteria",
                name:"Outstanding Accomplishments",
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                max:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                min:0,
                raw:false,
                subcriteria:{
                    awards:{
                        type:"subcriteria",
                        name:"Awards and Recognition",
                        maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 2 ? 7 : (positionCategory == 3 ? 2 : 4))),
                        max:999,
                        min:0,
                        raw:false,
                        subcriteria:{
                            citation:{
                                type:"subcriteria",
                                name:"Citation or Commendation",
                                raw:false,
                                contents:[
                                    {type:"input-number",label:"Number of letters of citation/commendation presented by applicant",dbColName:"number_of_citation_movs",dbTableName:"Job_Application",score:"manual",max:999,min:0}
                                ]
                            },    
                            academicAward:{
                                type:"subcriteria",
                                max:"Academic or Inter-School Award MOVs",
                                raw:false,
                                contents:[
                                    {type:"input-number",label:"Number of award certificates/MOVs presented by applicant",dbColName:"number_of_academic_award_movs",dbTableName:"Job_Application",score:"manual",max:999,min:0}
                                ]
                            },   
                            outstandingEmployee:{
                                type:"subcriteria",
                                name:"Outstanding Employee Award MOVs",
                                raw:false,
                                contents:[
                                    {type:"header-6",contents:"Number of awards from external institution"},
                                    {type:"input-number",label:"Local office search",dbColName:"number_of_awards_external_office_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                                    {type:"input-number",label:"Organization-level search or higher",dbColName:"number_of_awards_external_org_level_search",dbTableName:"Job_Application",score:4,max:999,min:0},
                                    {type:"header-6",contents:"Number of awards from the Central Office",max:999,min:0},
                                    {type:"input-number",label:"Central Office search",dbColName:"number_of_awards_central_co_level_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                                    {type:"input-number",label:"National-level search or higher",dbColName:"number_of_awards_central_national_search",dbTableName:"Job_Application",score:4,max:999,min:0},
                                    {type:"header-6",contents:"Number of awards from the Regional Office"},
                                    {type:"input-number",label:"Regional Office search",dbColName:"number_of_awards_regional_ro_level_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                                    {type:"input-number",label:"National-level search or higher",dbColName:"number_of_awards_regional_national_search",dbTableName:"Job_Application",score:4,max:999,min:0},
                                    {type:"header-6",contents:"Number of awards from the Schools Division Office"},
                                    {type:"input-number",label:"Division-/provincial-/city-level search",dbColName:"number_of_awards_division_sdo_level_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                                    {type:"input-number",label:"National-level search or higher",dbColName:"number_of_awards_division_national_search",dbTableName:"Job_Application",score:4,max:999,min:0},
                                    {type:"header-6",contents:"Number of awards from schools"},
                                    {type:"input-number",label:"School-/municipality-/district-level search",dbColName:"number_of_awards_school_school_level_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                                    {type:"input-number",label:"Division-level search or higher",dbColName:"number_of_awards_school_sdo_level_search",dbTableName:"Job_Application",score:4,max:999,min:0}
                                ]
                            },
                            trainerAward:{
                                type:"subcriteria",
                                name:"Awards as Trainer/Coach",
                                raw:false,
                                contents:[
                                    {
                                        type:"input-radio-select",
                                        label:"Please select the applicant's highest level of award as a trainer or coach",
                                        dbColName:"trainer_award_level",
                                        dbTableName:"Job_Application",
                                        score:1,
                                        items:[
                                            {type:"input-radio-select-item",label:"None",value:0},
                                            {type:"input-radio-select-item",label:"Champion or Highest Placer in the Division/Provincial Level",value:1,max:999,min:0},
                                            {type:"input-radio-select-item",label:"Champion or Highest Placer in the Regional Level",value:2,max:999,min:0},
                                            {type:"input-radio-select-item",label:"Champion or Highest Placer in the National Level",value:3,max:999,min:0}
                                        ]
                                    }
                                ]
                            }        
                        }
                    },
                    research:{
                        type:"subcriteria",
                        name:"Research and Innovation",
                        maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 2 ? 4 : (positionCategory == 3 ? 5 : 4))),
                        max:999,
                        min:0,
                        raw:false,
                        contents:[
                            {
                                type:"display-list-A",
                                label:"Guide",
                                contents:[
                                    {type:"list-item",contents:"Proposal"},
                                    {type:"list-item",contents:"Accomplishment Report"},
                                    {type:"list-item",contents:"Certification of Utilization"},
                                    {type:"list-item",contents:"Certification of Adoption"},
                                    {type:"list-item",contents:"Proof of Citation by Other Researchers"}
                                ]
                            },
                            {type:"input-number",label:"A only",dbColName:"number_of_research_proposal_only",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"A and B",dbColName:"number_of_research_proposal_ar",dbTableName:"Job_Application",score:2,max:999,min:0},
                            {type:"input-number",label:"A, B, and C",dbColName:"number_of_research_proposal_ar_util",dbTableName:"Job_Application",score:3,max:999,min:0},
                            {type:"input-number",label:"A, B, C, and D",dbColName:"number_of_research_proposal_ar_util_adopt",dbTableName:"Job_Application",score:4,max:999,min:0},
                            {type:"input-number",label:"A, B, C, and E",dbColName:"number_of_research_proposal_ar_util_cite",dbTableName:"Job_Application",score:4,max:999,min:0}
                        ]
                    },
                    smetwg:{
                        type:"subcriteria",
                        name:"Subject Matter Expert/Membership in National Technical Working Groups (TWGs) or Committees",
                        maxPoints:(positionCategory == 1 ? 0 : 3),
                        max:999,
                        min:0,
                        raw:false,
                        contents:[
                            {
                                type:"display-list-A",
                                label:"Guide",
                                contents:[
                                    {type:"list-item",contents:"Issuance/Memorandum"},
                                    {type:"list-item",contents:"Certificate"},
                                    {type:"list-item",contents:"Output/Adoption by the organization"}
                                ]
                            },
                            {type:"input-number",label:"A and B only",dbColName:"number_of_smetwg_issuance_cert",dbTableName:"Job_Application",score:2,max:999,min:0},
                            {type:"input-number",label:"All MOVs",dbColName:"number_of_smetwg_issuance_cert_output",dbTableName:"Job_Application",score:3,max:999,min:0}
                        ]
                    },
                    speakership:{
                        type:"subcriteria",
                        name:"Resource Speakership/Learning Facilitation",
                        maxPoints:(positionCategory == 1 ? 0 : 2),
                        max:999,
                        min:0,
                        raw:false,
                        contents:[
                            {type:"header-6",content:"Number of resource speakership/learning facilitation from external institution"},
                            {type:"input-number",label:"Local office-level",dbColName:"number_of_speakership_external_office_search",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"Organization-level",dbColName:"number_of_speakership_external_org_level_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                            {type:"header-6",content:"Number of resource speakership/learning facilitation from the Central Office"},
                            {type:"input-number",label:"Central Office-level",dbColName:"number_of_speakership_central_co_level_search",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"National-level or higher",dbColName:"number_of_speakership_central_national_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                            {type:"header-6",content:"Number of resource speakership/learning facilitation from the Regional Office"},
                            {type:"input-number",label:"Regional Office level",dbColName:"number_of_speakership_regional_ro_level_search",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"National-level or higher",dbColName:"number_of_speakership_regional_national_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                            {type:"header-6",content:"Number of resource speakership/learning facilitation from the Schools Division Office"},
                            {type:"input-number",label:"School/municipal/district",dbColName:"number_of_speakership_division_sdo_level_search",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"Division-level or higher",dbColName:"number_of_speakership_division_national_search",dbTableName:"Job_Application",score:2,max:999,min:0},
                        ]
                    },
                    neap:{
                        type:"subcriteria",
                        name:"NEAP Accredited Learning Facilitator",
                        maxPoints:(positionCategory == 1 ? 0 : 2),
                        max:999,
                        min:0,
                        raw:false,
                        contents:[
                            {
                                type:"input-radio-select",
                                label:"Please select the applicant's highest level of accreditation as NEAP Learning Facilitator",
                                dbColName:"neap_facilitator_accreditation",
                                dbTableName:"Job_Application",
                                score:1,
                                items:[
                                    {type:"input-radio-select-item",label:"None",value:"0"},
                                    {type:"input-radio-select-item",label:"Accredited by Regional Trainer",value:"1"},
                                    {type:"input-radio-select-item",label:"Accredited by National Trainer",value:"1.5"},
                                    {type:"input-radio-select-item",label:"Accredited by National Assessor",value:"2"}
                                ]
                            }
                        ]
                    }
                }
            },
            {
                id:"educationApp",
                type:"criteria",
                name:"Application of Education",
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                max:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                min:0,
                raw:false, // true for position with no experience requirement
                subcriteria:{
                    research:{
                        type:"subcriteria",
                        name:"Positions with Experience Requirement",
                        maxPoints:(positionRequiresExp ? (positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)) : 0),
                        max:999,
                        min:0,
                        raw:false,
                        contents:[
                            {
                                type:"display-list-A",
                                label:"<b>Guide (for positions with experience requirement)</b>",
                                contents:[
                                    {type:"list-item",contents:"Action Plan approved by the Head of Office"},
                                    {type:"list-item",contents:"Accomplishment Report verified by the Head of Office"},
                                    {type:"list-item",contents:"Certification of utilization/adoption signed by the Head of Office"}
                                ]
                            },
                            {type:"header-6",content:"Relevant"},
                            {type:"input-number",label:"A Only",dbColName:"number_of_app_educ_r_actionplan",dbTableName:"Job_Application",score:5,max:999,min:0},
                            {type:"input-number",label:"A and B",dbColName:"number_of_app_educ_r_actionplan_ar",dbTableName:"Job_Application",score:7,max:999,min:0},
                            {type:"input-number",label:"All MOVs",dbColName:"number_of_app_educ_r_actionplan_ar_adoption",dbTableName:"Job_Application",score:10,max:999,min:0},
                            {type:"header-6",content:"Not Relevant"},
                            {type:"input-number",label:"A Only",dbColName:"number_of_app_educ_nr_actionplan",dbTableName:"Job_Application",score:1,max:999,min:0},
                            {type:"input-number",label:"A and B",dbColName:"number_of_app_educ_nr_actionplan_ar",dbTableName:"Job_Application",score:3,max:999,min:0},
                            {type:"input-number",label:"All MOVs",dbColName:"number_of_app_educ_nr_actionplan_ar_adoption",dbTableName:"Job_Application",score:5,max:999,min:0}
                        ]
                    }
                }
            },
            {
                id:"trainingApp",
                type:"criteria",
                name:"Application of Learning and Development",
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                max:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                min:0,
                raw:false,
                contents:[
                    {
                        type:"display-list-A",
                        label:"Guide",
                        contents:[
                            {type:"list-item",contents:"Certificate of Training"},
                            {type:"list-item",contents:"Action Plan/Re-entry Action Plan/Job Embedded Learning/Impact Project signed by Head of Office"},
                            {type:"list-item",contents:"Accomplishment Report adopted by local level"},
                            {type:"list-item",contents:"Accomplisment Report adopted by different local level/higher level"}
                        ]
                    },
                    {type:"header-6",content:"Relevant"},
                    {type:"input-number",label:"A and B",dbColName:"number_of_app_train_relevant_cert_ap",dbTableName:"Job_Application",score:5,max:999,min:0},
                    {type:"input-number",label:"A, B, and C",dbColName:"number_of_app_train_relevant_cert_ap_arlocal",dbTableName:"Job_Application",score:7,max:999,min:0},
                    {type:"input-number",label:"All MOVs",dbColName:"number_of_app_train_relevant_cert_ap_arlocal_arother",dbTableName:"Job_Application",score:10,max:999,min:0},
                    {type:"header-6",content:"Not Relevant"},
                    {type:"input-number",label:"A and B",dbColName:"number_of_app_train_not_relevant_cert_ap",dbTableName:"Job_Application",score:1,max:999,min:0},
                    {type:"input-number",label:"A, B, and C",dbColName:"number_of_app_train_not_relevant_cert_ap_arlocal",dbTableName:"Job_Application",score:3,max:999,min:0},
                    {type:"input-number",label:"All MOVs",dbColName:"number_of_app_train_not_relevant_cert_ap_arlocal_arother",dbTableName:"Job_Application",score:5,max:999,min:0}
                ]
            },
            {
                id:"potential",
                type:"criteria",
                name:"Potential",
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                max:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                min:0,
                raw:false,
                contents:[
                    {type:"input-number",label:"Written Examination",dbColName:"score_exam",dbTableName:"Job_Application",score:1,weight:5,max:100,min:0},
                    {type:"input-number",label:"Skills or Work Sample Test",dbColName:"score_skill",dbTableName:"Job_Application",score:1,weight:10,max:100,min:0},
                    {type:"input-number",label:"Behavioral Events Interview",dbColName:"score_bei",dbTableName:"Job_Application",score:1,weight:5,max:5,min:0}
                ]
            }
        ];

        return criteria;
    }

    static getEducScore(incrementAboveQS, positionObj)
    {
        var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

        var uBoundsExclusive = [2, 4, 6, 8, 10], scores = [0, 1, 2, 3, 4, 5];
        if (positionCategory < 4)
        {
            scores = [0, 2, 4, 6, 8, 10];
        }
        else if (positionCategory > 4)
        {
            uBoundsExclusive = [1, 2, 3, 4, 5];
        }
        else if (positionCategory == 4 && salaryGrade <= 9)
        {
            uBoundsExclusive[0]--; // check page 4 of Enclosure No. 5 of DO 007 s 2023 for this tiny detail
        }
        else if (salaryGrade == 24)
        {
            uBoundsExclusive = [4, 6, 8, 9, 10];
            scores = [0, 2, 4, 6, 8, 10];
        }

        var i = 0;

        while (uBoundsExclusive[i] < incrementAboveQS)
        {
            i++;
        }

        return scores[i];
    }

    static getTrainingScore(incrementAboveQS, positionObj)
    {
        var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

        var uBoundsExclusive = [1, 2, 3, 4, 5], scores = [0, 1, 2, 3, 4, 5];
        if (positionCategory < 4)
        {
            uBoundsExclusive = [2, 4, 6, 8, 10];
            scores = [0, 2, 4, 6, 8, 10];
        }
        else if (salaryGrade >= 10 && salaryGrade <= 22 || salaryGrade == 27)
        {
            scores = [0, 2, 4, 6, 8, 10];
        }

        var i = 0;

        while (uBoundsExclusive[i] < incrementAboveQS)
        {
            i++;
        }

        return scores[i];
    }

    static getWorkExpScore(incrementAboveQS, positionObj)
    {
        var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

        var uBoundsExclusive = [2, 4, 6, 8, 10], scores = [0, 3, 6, 9, 12, 15];
        if (positionCategory < 4)
        {
            scores = [0, 2, 4, 6, 8, 10];
        }
        else if (positionCategory > 4 || salaryGrade <= 9)
        {
            scores = [0, 4, 8, 12, 16, 20];
        }

        var i = 0;

        while (uBoundsExclusive[i] < incrementAboveQS)
        {
            i++;
        }

        return scores[i];
    }

    resetForm()
    {
        window.location.reload(true);
    }
}

// export { ScrimEx, DisplayEx, InputEx, FormEx, DialogEx, MsgBox };