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

// export { ScrimEx, DisplayEx, InputEx, FormEx, DialogEx, MsgBox };