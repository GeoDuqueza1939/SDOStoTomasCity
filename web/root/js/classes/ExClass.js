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
        if (type(htmlContent) == "string" || type(htmlContent) == "number")
        {
            this.content.innerHTML = htmlContent;
        }
    }

    addContent(content, parent = null, addToBeginning = false)
    {
        if (Object.prototype.toString.call(parent) != "[object HTMLInputElement]")
        {
            parent = this.content;
        }

        if (addToBeginning && parent.childNodes.length > 0)
        { 
            parent.insertBefore(content, parent.childNodes[0]);
        }
        else
        {
            parent.appendChild(content);
        }

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

class DisplayCheckEx extends DisplayEx
{
    constructor(parent = null, typeText = "span", idStr = "", contentText = "", labelText = "", tooltip = "")
    {
        super(parent, typeText, idStr, contentText, labelText, tooltip);
        this.checked = false;

        [this.container, this.content].forEach(el=>el["displayCheckEx"] = this);
    }

    check(doCheck = true)
    {
        this.checked = doCheck;
        this.setHTMLContent(doCheck ? "<span class=\"green\">\u2714</span>" : "<span class=\"red\">\u2718</span>");
    }

    uncheck()
    {
        this.check(false);
    }
}

class DisplayTableEx extends DisplayEx
{
    constructor(parent = null, typeText = "div", idStr = "", contentText = "", labelText = "", tooltip = "")
    {
        super(parent, typeText, idStr, contentText, labelText, tooltip);
        this.table = htmlToElement("<table></table>");
        this.thead = null;
        this.theadRow = null;
        this.tbody = htmlToElement("<tbody></tbody>");
        this.tfoot = null;
        this.tfootRow = null;
        this.rows = []; // {tr:null, td:{}, data:{}} // each td and data shall use the colHeaderNames as keys
        this.fRows = []; // {tr:null, td:{}, data:{}} // each td and data shall use the colHeaderNames as keys
        
        this.addContent(this.table);
        this.table.appendChild(this.tbody);

        this.columnHeaders = []; // {colHeaderName ("required"), colHeaderText}

        this.isHeaderCustomized = false;

        [this.container, this.content].forEach(el=>el["displayTableEx"] = this);
    }

    setHeaders(headers = [{colHeaderName:"", colHeaderText:""}], replace = false)
    {
        if (replace)
        {
            this.columnHeaders = [];
            if (this.thead != null && this.thead != undefined)
            {
                this.thead.innerHTML = "";
                this.theadRow = null;
            }
        }

        if (this.columnHeaders.length == 0)
        {
            headers.forEach((header, index)=>{
                try
                {
                    this.addHeader(header.colHeaderName, header.colHeaderText);
                }
                catch (ex)
                {
                    alert("Error in setting header: Please see console for details\n\n" + ex);
                    console.log("Incorrect or invalid data format: header:", header);
                }
            });

            for (const row of this.rows)
            {
                for (const key in row.dataRow)
                {
                    if (!(key in headers.map(header=>header.colHeaderName))) // trim extra columns from each row
                    {
                        delete row[key];
                    }
                }
            }

            return this.columnHeaders;
        }

        return null;
    }
    
    addHeader(colHeaderName, colHeaderText = "")
    {
        if (this.isHeaderCustomized)
        {
            throw("Table header has been manually modified. Either continue with manual modifications or use the `DisplayTableEx.setHeader` method with the `replace` function set to `true`.");
        }

        if (this.thead == null || this.thead == undefined)
        {
            this.thead = htmlToElement("<thead></thead>");
            this.table.insertBefore(this.thead, this.tbody);
        }

        if (this.theadRow == null || this.theadRow == undefined)
        {
            this.theadRow = htmlToElement("<tr></tr>");
            this.thead.appendChild(this.theadRow);
        }

        this.columnHeaders.push({colHeaderName:colHeaderName, colHeaderText:colHeaderText, colHeaderCell:htmlToElement("<th>" + colHeaderText + "</th>")});
        this.theadRow.appendChild(this.columnHeaders[this.columnHeaders.length - 1]["colHeaderCell"]);

        this.rows.forEach((row, index)=>{ // add missing key in each row
            if (!(colHeaderName in row["data"]))
            {
                row["data"][colHeaderName] = "";
            }
            row["td"][colHeaderName] = htmlToElement("<td>" + row["data"][colHeaderName] + "</td>");
            row["tr"].appendChild(row["td"][colHeaderName]);
        });
    }

    addRow(rowData = {})
    {
        this.rows.push({
            tr:createElementEx(NO_NS, "tr", this.tbody),
            td:{},
            data:{}
        });

        this.columnHeaders.map(header=>header.colHeaderName).forEach((headerName)=>{
            this.rows[this.rows.length - 1]["data"][headerName] = (headerName in rowData ? rowData[headerName] : "");
            this.rows[this.rows.length - 1]["td"][headerName] = htmlToElement("<td>" + this.rows[this.rows.length - 1]["data"][headerName] + "</td>");
            this.rows[this.rows.length - 1]["tr"].appendChild(this.rows[this.rows.length - 1]["td"][headerName]);
        });
    }

    addFooter(colFooterName, colFooterText = "", rowspan = 1, colspan = 1)
    {
        if (this.tfoot == null || this.tfoot == undefined)
        {
            this.tfoot = htmlToElement("<tfoot></tfoot>");
            this.table.appendChild(this.tfoot);
        }

        if (this.tfootRow == null || this.tfootRow == undefined)
        {
            this.tfootRow = htmlToElement("<tr></tr>");
            this.tfoot.appendChild(this.tfootRow);
            this.fRows.push({tr:this.tfootRow, td:{}, data:{}, rowspan:{}, colspan:{}});
        }

        if (this.rows.length > 0 && type(rowspan) == "number" && Object.keys(this.rows[0]["td"]).length < this.fRows.length + rowspan)
        {
            throw("New footer layout length should not exceed the number of columns in the table body");
        }

        this.fRows[this.fRows.length - 1]["td"][colFooterName] = htmlToElement("<td" + (type(rowspan) == "number" && rowspan > 1 ? " rowspan=\"" + rowspan + "\"" : "")  + (type(colspan) == "number" && colspan > 1 ? " rowspan=\"" + colspan + "\"" : "") + ">" + colFooterText + "</td>");
        this.fRows[this.fRows.length - 1]["data"][colFooterName] = colFooterText;
        this.fRows[this.fRows.length - 1]["rowspan"][colFooterName] = rowspan;
        this.fRows[this.fRows.length - 1]["colspan"][colFooterName] = colspan;

        this.fRows[this.fRows.length - 1]["tr"].appendChild(this.fRows[this.fRows.length - 1]["td"][colFooterName]);
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
            field: [],
            label: [],
            status: []
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
        this.isMultipleOption = false;
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
                this.isMultipleOption = true;
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
                this.isMultipleOption = true;
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
                    if (type(value) == "number" || value != "")
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

                if (this.isReversed())
                {
                    this.inputExs[this.inputExs.length - 1].reverse();
                }

                if (this.listeners.field.length > 0)
                {
                    for (const listener of this.listeners.field)
                    {
                        this.inputExs[this.inputExs.length - 1].addEvent(listener.eventType, listener.eventFunction);
                    }
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
        if (this.isMultipleInput || this.isMultipleOption)
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

    setSimpleStyle()
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
                this.container.classList.toggle("simple-style");
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
            // this.listeners.field[eventType] = func;
            this.listeners.field.push({"eventType":eventType,eventFunction:func});
            // this.fields[0].addEventListener(eventType, this.listeners.field[eventType], addEventListenerOption);
            this.fields[0].addEventListener(eventType, func, addEventListenerOption);
        }
        else if (this.type != "buttons" && this.type != "buttonExs" && (index == null || index == undefined || index == -1))
        {
            this.listeners.field.push({"eventType":eventType,eventFunction:func});
            for (const inputEx of this.inputExs) {
                inputEx.addEvent(eventType, func, index, addEventListenerOption);
            }
        }
        else if (typeof(index) == "number" && Number.parseInt(index) >= 0)
        {
            this.inputExs[index].addEvent(eventType, func);
        }
    }

    addLabelEvent(eventType, func) // THIS WONT ATTACH IF LABEL IS STILL NON-EXISTENT
    {
        if (!this.isMultipleInput)
        {
            // this.listeners.label[eventType] = func;
            this.listeners.label.push({"eventType":eventType,eventFunction:func});
            // this.labels[0].addEventListener(eventType, this.listeners.label[eventType]);
            this.labels[0].addEventListener(eventType, func);
        }
    }

    addStatusEvent(eventType, func) // THIS WONT ATTACH IF STATUS PANE IS STILL NON-EXISTENT
    {
        if (!this.isMultipleInput)
        {
            // this.listeners.status[eventType] = func;
            this.listeners.status.push({"eventType":eventType,eventFunction:func});
            // this.statusPane.addEventListener(eventType, this.listeners.status[eventType]);
            this.statusPane.addEventListener(eventType, func);
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
        this.displayExs = [];        
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

    addDisplayEx(typeText = "div", id = "", contentText = "", labelText = "", tooltip = "")
    {
        var newDisplayEx = null;
        if (typeof(id) == "string" && id != "")
        {
            if (typeText == "div-table")
            {
                newDisplayEx = new DisplayTableEx(this.fieldWrapper, "div", id, contentText, labelText, tooltip);
            }
            else
            {
                newDisplayEx = new DisplayEx(this.fieldWrapper, typeText, id, contentText, labelText, tooltip);
            }
            this.displayExs[id] = newDisplayEx;
        }
        else
        {
            if (typeText == "div-table")
            {
                newDisplayEx = new DisplayTableEx(this.fieldWrapper, "div", this.id + this.displayExs.length, contentText, labelText, tooltip);
            }
            else
            {
                newDisplayEx = new DisplayEx(this.fieldWrapper, typeText, this.id + this.displayExs.length, contentText, labelText, tooltip);
            }
            this.displayExs.push(newDisplayEx);
        }
        return newDisplayEx;
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

class ScoreSheetElementUI
{
    constructor(scoreSheet = new ScoreSheet(), scoreSheetElement, parentScoreSheetElementUI = null)
    {
        var span = null, div = null, uiEx = null;

        this.type = scoreSheetElement.type ?? "";
        this.container = null;
        this.contentWrapper = null;
        this.label = null;
        this.totalScoreDisplay = null;

        this.scoreSheetElement = scoreSheetElement;
        this.parentScoreSheetElementUI = parentScoreSheetElementUI;
        this.inputEx = null;
        this.displayEx = null;
        this.contents = []; // DisplayExs and InputExs
        this.displays = []; // DisplayExs
        this.fields = []; // InputExs
        this.scoreSheet = scoreSheet;

        this.isComputingPoints = false;

        this.getPointsManually = null; // function to manually extract the points; useful when the awarding of points can ONLY be based on a rubrics
        var scoreChange = scoreChangeEvent=>{
            // DO NOT DELETE THE FOLLOWING LINES!!!!!!!!!!!!!!!!!!!!!

            // var scoreSheetElementUI = this;

            // while (scoreSheetElementUI.parentScoreSheetElementUI != null && scoreSheetElementUI.parentScoreSheetElementUI != undefined)
            // {
            //     scoreSheetElementUI = scoreSheetElementUI.parentScoreSheetElementUI;
            // }

            // scoreSheetElementUI.getPoints();

            this.scoreSheet.summaryUI.getPoints();
        };

        switch (this.type)
        {
            case "summary":
            case "criteria1":
            case "criteria2":
            case "criteria3":
            case "criteria4":
                if (scoreSheetElement.weight != 0)
                {
                    uiEx = (this.type == "criteria1" || this.type == "summary" ? scoreSheet.addDisplayEx("div" + (this.type == "summary" ? "-table" : ""), scoreSheetElement.id) : new DisplayEx(null, "div", scoreSheetElement.dbColName));
                    this.container = uiEx.container;
                    this.contentWrapper = uiEx.content;
                    this.label = createElementEx(NO_NS, "h" + ((this.type == "summary" ? 1 : parseInt(this.type.replace("criteria", ""))) + 2));
                    this.label.innerHTML = scoreSheetElement.label + (this.type == "criteria1" ? " <small style=\"font-weight: normal;\">(<i>max:\xa0" + scoreSheetElement.weight + "\xa0points</i>)</small>" : "");
                    uiEx.addContent(this.label, null, true);
                    if (this.type == "criteria1")
                    {
                        this.totalScoreDisplay = new DisplayEx(this.contentWrapper, "div", "", "n/a", "Total Points");
                        this.totalScoreDisplay.showColon();
                        this.totalScoreDisplay.container.classList.add("main-criteria-points");
                        uiEx.container.classList.add("main-criteria");
                    }
                    uiEx.container.classList.add(this.type);
                    uiEx.container.classList.add(this.scoreSheetElement.id);
                    uiEx.setFullWidth();
                    this.container.scoreSheetElementUI = this;
                    this.contentWrapper.scoreSheetElementUI = this;
                    this.label.scoreSheetElementUI = this;
                    
                    if ("getPointsManually" in scoreSheetElement && type(scoreSheetElement.getPointsManually) == "function")
                    {
                        this.getPointsManually = scoreSheetElement.getPointsManually;
                    }
                }
                break;
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
                this.container = this.contentWrapper = this.label = createSimpleElement(NO_NS, this.type, null);
                this.label.innerHTML = scoreSheetElement.label;
                this.container.scoreSheetElementUI = this;
            break;
            case "display":
                if (scoreSheetElement.weight != 0)
                {
                    uiEx = new DisplayEx(null, "div", scoreSheetElement.dbColName, "", scoreSheetElement.label);
                    this.container = uiEx.container;
                    this.contentWrapper = uiEx.content;
                    this.container.scoreSheetElementUI = this;
                    this.contentWrapper.scoreSheetElementUI = this;
                    if (type(scoreSheetElement.label) == "string" && scoreSheetElement.label != "")
                    {
                        this.label = uiEx.setLabelText(scoreSheetElement.label);
                        uiEx.showColon();
                        uiEx.setFullWidth();
                        this.label.scoreSheetElementUI = this;
                    }
                    this.displayEx = uiEx;
                }
                break;
            case "display-check":
                if (scoreSheetElement.weight != 0)
                {
                    uiEx = new DisplayCheckEx(null, "div", scoreSheetElement.dbColName, "", scoreSheetElement.label);
                    this.container = uiEx.container;
                    this.contentWrapper = uiEx.content;
                    this.container.scoreSheetElementUI = this;
                    this.contentWrapper.scoreSheetElementUI = this;
                    if (type(scoreSheetElement.label) == "string" && scoreSheetElement.label != "")
                    {
                        this.label = uiEx.setLabelText(scoreSheetElement.label);
                        uiEx.showColon();
                        uiEx.setFullWidth();
                        this.label.scoreSheetElementUI = this;
                    }
                    uiEx.uncheck();
                    this.displayEx = uiEx;
                }
                break;
            case "display-list-bullet-disc":
                if (scoreSheetElement.weight != 0)
                {
                    uiEx = new DisplayEx(null, "div", scoreSheetElement.dbColName, "", scoreSheetElement.label);
                    this.container = uiEx.container;
                    this.contentWrapper = htmlToElement("<ul type=\"disc\"></ul>");
                    uiEx.content.appendChild(this.contentWrapper);
                    this.container.scoreSheetElementUI = this;
                    this.contentWrapper.scoreSheetElementUI = this;
                    if (type(scoreSheetElement.label) == "string" && scoreSheetElement.label != "")
                    {
                        this.label = uiEx.setLabelText(scoreSheetElement.label);
                        uiEx.showColon();
                        uiEx.setFullWidth();
                        uiEx.setVertical();
                        this.label.scoreSheetElementUI = this;
                    }
                    this.displayEx = uiEx;
                }
                break;
            case "display-list-upper-alpha":
                if (scoreSheetElement.weight != 0)
                {
                    uiEx = new DisplayEx(null, "div", scoreSheetElement.dbColName, "", scoreSheetElement.label);
                    this.container = uiEx.container;
                    this.contentWrapper = htmlToElement("<ol type=\"A\"></ol>");
                    uiEx.content.appendChild(this.contentWrapper);
                    this.container.scoreSheetElementUI = this;
                    this.contentWrapper.scoreSheetElementUI = this;
                    if (type(scoreSheetElement.label) == "string" && scoreSheetElement.label != "")
                    {
                        this.label = uiEx.setLabelText(scoreSheetElement.label);
                        uiEx.showColon();
                        uiEx.setFullWidth();
                        uiEx.setVertical();
                        this.label.scoreSheetElementUI = this;
                    }
                    this.displayEx = uiEx;
                }
                break;
            case "input-text":
                break;
            case "input-number":
                uiEx = scoreSheet.addInputEx(scoreSheetElement.label, "number", 0, "", scoreSheetElement.dbColName, scoreSheetElement.dbTableName);
                this.container = uiEx.container;
                this.contentWrapper = uiEx.fieldWrapper;
                this.label = uiEx.labels[0];
                this.container.scoreSheetElementUI = this;
                this.contentWrapper.scoreSheetElementUI = this;
                if (this.label != null)
                {
                    this.label.scoreSheetElementUI = this;
                }
                uiEx.fields[0].scoreSheetElementUI = this;
                if ("min" in scoreSheetElement)
                {
                    uiEx.setMin(scoreSheetElement.min);
                }
                if ("max" in scoreSheetElement)
                {
                    uiEx.setMax(scoreSheetElement.max == "ANY" ? 999 : scoreSheetElement.max);
                }
                if ("step" in scoreSheetElement)
                {
                    uiEx.setStep(scoreSheetElement.step);
                }
                uiEx.showColon();
                // uiEx.setFullWidth();
                // uiEx.setInline();
                uiEx.fields[0].classList.add("right");
                uiEx.setStatusMsgTimeout(-1);
                if ("getPointsManually" in scoreSheetElement && type(scoreSheetElement.getPointsManually) == "function")
                {
                    this.getPointsManually = scoreSheetElement.getPointsManually;
                }
                uiEx.addEvent("keypress", scoreChange);
                uiEx.addEvent("keydown", scoreChange);
                uiEx.addEvent("keyup", scoreChange);
                uiEx.addEvent("change", scoreChange);
                this.inputEx = uiEx;
                break;
            case "input-radio-select":
                uiEx = scoreSheet.addInputEx(scoreSheetElement.label, "radio-select", 0, "", scoreSheetElement.dbColName, scoreSheetElement.dbTableName);
                this.container = uiEx.container;
                this.contentWrapper = uiEx.fieldWrapper;
                this.label = uiEx.labels[0];
                this.container.scoreSheetElementUI = this;
                this.contentWrapper.scoreSheetElementUI = this;
                if (this.label != null)
                {
                    this.label.scoreSheetElementUI = this;
                }
                uiEx.reverse();
                uiEx.setVertical();
                uiEx.showColon();
                uiEx.setStatusMsgTimeout(-1);
                if ("getPointsManually" in scoreSheetElement && type(scoreSheetElement.getPointsManually) == "function")
                {
                    this.getPointsManually = scoreSheetElement.getPointsManually;
                }
                uiEx.addEvent("change", scoreChange);
                this.inputEx = uiEx;
                break;
            case "summary-header":
                if (parentScoreSheetElementUI.type == "summary")
                {
                    parentScoreSheetElementUI.container.displayTableEx.addHeader(scoreSheetElement.id, scoreSheetElement.label);
                }
                break;
            case "summary-footer":
                if (parentScoreSheetElementUI.type == "summary")
                {
                    parentScoreSheetElementUI.container.displayTableEx.addFooter(scoreSheetElement.id, scoreSheetElement.label);
                }
                break;
            case "list-item":
                if (parentScoreSheetElementUI.type.includes("display-list"))
                {
                    this.container = this.contentWrapper = createElementEx(NO_NS, "li", parentScoreSheetElementUI.contentWrapper);
                    this.container.innerHTML = scoreSheetElement.label;
                }
                break;
            case "input-list-item":
                if (parentScoreSheetElementUI.type == "input-radio-select" || parentScoreSheetElementUI.type == "input-checkbox-select" || parentScoreSheetElementUI.type == "input-select" || parentScoreSheetElementUI.type == "input-combo")
                {
                    parentScoreSheetElementUI.container.inputEx.addItem(scoreSheetElement.label, scoreSheetElement.score);
                }
                break;
            case "line-break":
                this.container = this.contentWrapper = createElementEx(NO_NS, "br");
                break;
            default:
                break;
        }

        if ("content" in scoreSheetElement && type(scoreSheetElement.content) == "array")
        {
            for (const content of scoreSheetElement.content)
            {
                if (content.weight != 0)
                {
                    uiEx = new ScoreSheetElementUI(scoreSheet, content, this);
                    if (!content.type.includes("-item") && content.type != "summary-header" && content.type != "summary-footer")
                    {
                        this.contentWrapper.appendChild(uiEx.container);
                        this.contents.push(uiEx);
                        if (content.type.includes("display"))
                        {
                            this.displays[(content.dbColName == "" ? content.id : content.dbColName)] = uiEx;
                        }
                        else if (content.type.includes("input") && !content.type.includes("-item"))
                        {
                            this.fields[(content.dbColName == "" ? content.id : content.dbColName)] = uiEx;
                        }
                    }
                }
            }
        }

        if (this.type == "criteria1")
        {
            this.contentWrapper.appendChild(this.totalScoreDisplay.container);
        }
    }

    addHeader(headerText, level)
    {
        var header = createElementEx(NO_NS, "h" + level, this.content);
        header.innerHTML = headerText;

        return header;
    }

    // addContent(content, parent = null)
    // {
    //     super.addContent(content, parent);

    //     super.addContent(this.totalScoreDisplay.container, parent);

    //     return content;
    // }

    getPoints()
    {
        var points = 0;

        switch (this.type)
        {
            case "":
                break;
            case "input-number":
            case "input-radio-select":
                if (this.getPointsManually == null)
                {
                    points = this.scoreSheetElement.score * this.inputEx.getValue() / (this.scoreSheetElement.weight < 0 ? 1 : this.scoreSheetElement.max / this.scoreSheetElement.weight);
                }
                else
                {
                    points = this.getPointsManually();
                }
                if (points < 0)
                {
                    points = 0;
                }
                this.inputEx.setStatusMsgTimeout(-1);
                this.inputEx.showInfo("points: " + points);
                break;
            case "criteria1":
            case "criteria2":
            case "criteria3":
            case "criteria4":
                if (this.getPointsManually == null)
                {
                    for (const scoreSheetElementUI of this.contents)
                    {
                        points += scoreSheetElementUI.getPoints();
                        if (this.scoreSheetElement.maxPoints > 0 && points > this.scoreSheetElement.maxPoints)
                        {
                            points = this.scoreSheetElement.maxPoints;
                        }
                    }
                }
                else if (type(this.getPointsManually) == "function")
                {
                    points = this.getPointsManually();
                    if (this.scoreSheetElement.maxPoints > 0 && points > this.scoreSheetElement.maxPoints)
                    {
                        points = this.scoreSheetElement.maxPoints;
                    }
                }

                if (this.type == "criteria1")
                {
                    this.totalScoreDisplay.setHTMLContent(Math.round(points * 1000) / 1000);
                    this.scoreSheet.summary[this.scoreSheetElement.id].innerHTML = points.toFixed(3);
                }
                break;
            case "summary":
                if (!this.isComputingPoints)
                {
                    this.isComputingPoints = true;

                    for (const criteria of this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.type == "criteria1"))
                    {
                        points += criteria.getPoints();
                    }
    
                    this.scoreSheet.summary["summary_total_score"].innerHTML = points.toFixed(3);

                    this.isComputingPoints = false;
                }
                break;
            default:
                break;
        }

        return points;
    }
}

class ScoreSheet extends FormEx
{
    static defaultEndDate = "2023-04-05";// (new Date()).toLocaleDateString();
    static processURL = "/mpasis/php/process.php";

    constructor(parentEl = null, id = "", useFormElement = true)
    {
        super(parentEl, id, useFormElement);
        this.setTitle("Score Sheet", 2); //.style.gridColumn = "span 12";
        this.setFullWidth();
        // this.gridDisplay(true, "auto auto auto auto auto auto auto auto auto auto auto auto");

        this.displayExs = [];
        this.data = [];
        this.dataLoaded = null;
        this.scoreSheetElementUIs = [];

        // this.ratingSummary = null;
        this.summaryUI = null;
        this.summary = {};

        this.jobApplication = null;
        this.positionApplied = null;
        this.scoreSheetElements = null; // includes the criteria and some display elements

        this.loadButton = this.addInputEx("Load Application", "buttonEx");
        this.loadButton.setFullWidth();
        // this.loadButton.container.style.gridColumn = "span 12";
        this.loadButton.fieldWrapper.classList.add("right");

        this.loadButton.addEvent("click", this.loadApplicationBtn_Click);

        this.loadButton.setStatusMsgTimeout(-1);
        this.loadButton.showInfo("Click to begin");
        // this.loadButton.container.classList.add("right");
        this.loadButton.statusPane.style.display = "block";
    }

    loadApplicationBtn_Click(event) // inherits the scope of the clicked button/element
    {
        var scoreSheet = null, clickedElement = null, div = null;

        scoreSheet = this.inputEx.parentFormEx;
        clickedElement = this; //event.srcElement; // event.target;

        this.inputEx.resetStatus();

        var retrieveApplicantDialog = null;
        if (this.innerHTML == "Load Application")
        {
            retrieveApplicantDialog = new DialogEx(scoreSheet.fieldWrapper);
            var form = retrieveApplicantDialog.addFormEx();
            form.setFullWidth();
            
            var searchBox = form.addInputEx("Enter an applicant name or code", "text", "", "Type to populate list");
            searchBox.setFullWidth();
            // searchBox.setVertical();
            searchBox.showColon();
            searchBox.container.style.marginBottom = "0.5em";
            searchBox.fields[0].style.display = "block";
            searchBox.fields[0].style.width = "100%";

            var searchResult = form.addInputEx("Choose the job application to load", "radio-select", "load-applicant", "", "", "", true);
            searchResult.setFullWidth();
            searchResult.setVertical();
            searchResult.reverse();
            searchResult.hide();

            searchResult.fieldWrapper.style.maxHeight = "15em";
            searchResult.fieldWrapper.style.overflowY = "auto";

            var retrieveApplicantDialogBtnGrp = form.addFormButtonGrp(2);
            retrieveApplicantDialogBtnGrp.setFullWidth();
            retrieveApplicantDialogBtnGrp.container.style.marginTop = "0.5em";
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
                if (!retrieveApplicantDialogBtnGrp.inputExs[0].isClickListenerAttached)
                {
                    retrieveApplicantDialogBtnGrp.inputExs[0].addEvent("click", loadApplicationDialogClickEvent=>{
                        var scoreSheetElementUI = null, weight = 0;

                        if (searchResult.getValue() == "" || searchResult.getValue() == null)
                        {
                            retrieveApplicantDialog.formEx.raiseError("Please select an item to load before continuing");
                            return;
                        }

                        retrieveApplicantDialog.formEx.setStatusMsgTimeout(-1);
                        retrieveApplicantDialog.formEx.showWait("Loading");
                        
                        this.scrim = new ScrimEx(this.inputEx.parentFormEx.container);
                        this.scrim.addContent(htmlToElement("<span class=\"status-pane wait\"><span class=\"status-marker\"></span> <span class=\"status-message\">Please wait</span></span>"));
            
                        scoreSheet.jobApplication = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0];
                        
                        if (!("applicantInfo" in scoreSheet.displayExs))
                        {
                            div = scoreSheet.addDisplayEx("div", "applicantInfo");
                            div.setFullWidth();
                            div.container.style.gridColumn = "span 12";
                            div.content.style.display = "grid";
                            div.content.style.gridTemplateColumns = "auto auto";
                            div.content.style.gridGap = "0.5em 1em";            
        
                            [
                                {colName:"application_code", label:"Application Code"},
                                {colName:"applicant_name", label:"Applicant's Name"},
                                {colName:"present_school", label:"School", tableName:"Job_Application"},
                                {colName:"present_position", label:"Present Position", tableName:"Job_Application"},
                                {colName:"present_designation", label:"Designation", tableName:"Job_Application"},
                                {colName:"present_district", label:"District", tableName:"Job_Application"},
                                {colName:"position_title_applied", label:"Position Applied For"}
                            ].forEach(obj=>{
                                if (obj == "")
                                {
                                    div.addLineBreak();
                                    return;
                                }
                                var inputEx = scoreSheet.addInputEx(obj.label, "text", "", "", obj.colName, obj.tableName);
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
                        scoreSheet.scoreSheetElements = ScoreSheet.getScoreSheetElements(scoreSheet.positionApplied, scoreSheet.jobApplication);

                        for (const criteria of scoreSheet.scoreSheetElements)
                        {
                            if (criteria.weight != 0)
                            {
                                div = new ScoreSheetElementUI(scoreSheet, criteria);

                                if (div.scoreSheetElement.id == "summary")
                                {
                                    scoreSheet.summaryUI = div;

                                    scoreSheet.summary["summary_total_score"] = scoreSheet.summaryUI.container.displayTableEx.fRows[0]["td"]["summary_total_score"];
                                }
                                else
                                {
                                    scoreSheet.scoreSheetElementUIs.push(div);
                                    scoreSheet.fieldWrapper.appendChild(scoreSheet.summaryUI.container);

                                    if (scoreSheet.summaryUI != null && scoreSheet.summaryUI != undefined)
                                    {
                                        scoreSheet.summaryUI.container.displayTableEx.addRow({"summary_criteria":criteria.label, "summary_weight":criteria.weight + "%","summary_score":0});
                                        scoreSheet.summary[criteria.id] = scoreSheet.summaryUI.container.displayTableEx.rows[scoreSheet.summaryUI.container.displayTableEx.rows.length - 1]["td"]["summary_score"];
                                        weight += criteria.weight;
                                    }
                                }                                
                            }
                        }

                        scoreSheet.summaryUI.container.displayTableEx.fRows[0]["td"]["summary_total_weight"].innerHTML = weight + "%";

                        var appliedPosition = document.positions.filter(position=>position["position_title"] == scoreSheet.jobApplication["position_title_applied"] || position["plantilla_item_number"] == scoreSheet.jobApplication["plantilla_item_number_applied"])[0];

                        // Education
                        scoreSheetElementUI = scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education")[0].getPoints();
                        
                        // Training
                        scoreSheetElementUI = scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training")[0].getPoints();

                        // Experience
                        scoreSheetElementUI = scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience")[0].getPoints();

                        // Performance
                        scoreSheetElementUI = scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "performance")[0];

                        scoreSheetElementUI.displays["position_req_work_exp"].displayEx.check(scoreSheet.positionApplied["required_work_experience_years"] != null && scoreSheet.positionApplied["required_work_experience_years"] > 0);
                        scoreSheetElementUI.displays["applicant_has_prior_exp"].displayEx.check(scoreSheet.jobApplication["relevant_work_experience"].length > 0);

                        for (const key in scoreSheet.dbInputEx)
                        {
                            switch (key)
                            {
                                case "application_code":
                                case "applicant_name":
                                case "position_title_applied":
                                case "present_designation":
                                case "present_district":
                                case "present_position":
                                case "present_school":
                                    // do nothing
                                    break;
                                default:
                                    if (key in scoreSheet.jobApplication)
                                    {
                                        scoreSheet.dbInputEx[key].setDefaultValue(scoreSheet.jobApplication[key] ?? (scoreSheet.dbInputEx[key].type == "number" || scoreSheet.dbInputEx[key].type == "radio-select" ? 0 : ""), true);
                                    }
                                    else
                                    {
                                        console.log(key, " is not in jobApplication");
                                    }
                                    break;
                            }
                        }

                        var applicantDataBtnGrp = scoreSheet.addFormButtonGrp(2);
                        applicantDataBtnGrp.setFullWidth();
                        applicantDataBtnGrp.container.style.gridColumn = "1 / span 12";
                        applicantDataBtnGrp.inputExs[0].setLabelText("Save");
                        applicantDataBtnGrp.inputExs[0].setTooltipText("");
                        applicantDataBtnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
                            var jobApplication = {};
                
                            if (scoreSheet.dbInputEx["application_code"].getValue() == "")
                            {
                                new MsgBox(scoreSheet.container, "Please load an application to use the scoresheet.", "OK");
                
                                return;
                            }
                
                            for (const colName in scoreSheet.dbInputEx) {
                                var tableName = scoreSheet.dbTableName[colName];
                                var dbInputEx = scoreSheet.dbInputEx[colName];
                
                                switch (colName)
                                {
                                    case "applicant_name": case "applicant_option_label":
                                    case "age": case "birth_date": case "birth_place": case "civil_status": case "civil_statusIndex":
                                    case "degree_taken": case "educational_attainment": case "educational_attainmentIndex":
                                    case "ethnicityId":
                                    case "given_name": case "middle_name": case "family_name": case "spouse_name": case "ext_name":
                                    case "has_more_unrecorded_training":
                                    case "has_more_unrecorded_work_experience":
                                    case "has_specific_competency_required":
                                    case "has_specific_education_required":
                                    case "has_specific_training":
                                    case "has_specific_work_experience":
                                    case "permanent_addressId":
                                    case "personId":
                                    case "present_addressId":
                                    case "relevant_eligibility":
                                    case "relevant_training":
                                    case "relevant_work_experience":
                                    case "religionId":
                                    case "sex":
                                        break;
                                    default:
                                        jobApplication[colName] = dbInputEx.getValue();
                                        break;
                                }
                            }
                            
                            // console.log(scoreSheet.dbTableName, scoreSheet.dbInputEx);
                
                            // DEBUG
                            // console.log(jobApplication);
                            
                            // new MsgBox(scoreSheet.container, "Application Code:" + jobApplication["application_code"] + " has been updated!", "OK");
                
                            // return;
                            // DEBUG
                
                            // DATA SETS PACKAGED IN JSON THAT HAVE SINGLE QUOTES SHOULD BE MODIFIED AS PACKAGED TEXT ARE NOT AUTOMATICALLY FIXED BY PHP AND SQL
                            postData(ScoreSheet.processURL, "app=mpasis&a=update&jobApplication=" + packageData(jobApplication), (event)=>{
                                var response;
                
                                if (event.target.readyState == 4 && event.target.status == 200)
                                {
                                    response = JSON.parse(event.target.responseText);
                
                                    if (response.type == "Error")
                                    {
                                        new MsgBox(scoreSheet.container, response.content, "Close");
                                    }
                                    else if (response.type == "Success")
                                    {
                                        new MsgBox(scoreSheet.container, response.content, "OK");
                                    }
                                }
                            });
                        });
                        applicantDataBtnGrp.inputExs[1].setLabelText("Reset");
                        applicantDataBtnGrp.inputExs[1].setTooltipText("");
                        applicantDataBtnGrp.inputExs[1].addEvent("click", (event)=>{
                            window.location.reload(true);
                        }); // TO IMPLEMENT IN FORMEX/INPUTEX
                        applicantDataBtnGrp.container.style.gridColumn = "1 / span 12";
                        applicantDataBtnGrp.fieldWrapper.classList.add("right");
                        applicantDataBtnGrp.setStatusMsgTimeout(20);                
                                        
                        // update total points for all criteria
                        // for (const criteria of scoreSheet.scoreSheetElementUIs)
                        // {
                        //     if (criteria.scoreSheetElement.id != "education" && criteria.scoreSheetElement.id != "training" && criteria.scoreSheetElement.id != "experience")
                        //     {
                        //         criteria.getPoints();
                        //     }
                        // }

                        scoreSheet.summaryUI.getPoints();

                        retrieveApplicantDialog.close();
                        this.innerHTML = "Reset Score Sheet";

                        this.scrim.destroy();
                    });
                }
                retrieveApplicantDialogBtnGrp.inputExs[0].isClickListenerAttached = true;
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

            this.scrim = new ScrimEx(this.inputEx.parentFormEx.container);
            this.scrim.addContent(htmlToElement("<span class=\"status-pane wait\"><span class=\"status-marker\"></span> <span class=\"status-message\">Please wait</span></span>"));    

            scoreSheet.resetForm();

            this.innerHTML = "Load Application";
        }

    }

    static getScoreSheetElements(positionObj, jobApplication) // COMPUTATION INCLUDES NON-EXISTENT SALARY GRADES IN THE NON-TEACHING POSITIONS (23, 25-26); CONSIDER IN FUTURE ISSUES; MAY ALSO CONFUSE DEVELOPERS DURING USE, ESPECIALLY WHEN THE NAME OF VARIABLE IS `scoreSheet`
    {
        var salaryGrade, positionCategory, positionRequiresExp, applicantHasPriorWorkExp;
        // console.log(positionObj, jobApplication);
        [salaryGrade, positionCategory, positionRequiresExp, applicantHasPriorWorkExp] = [positionObj["salary_grade"], positionObj["position_categoryId"], (positionObj["required_work_experience_years"] > 0), (jobApplication["relevant_work_experience"].length > 0)];

        var criteria = [
            {
                id:"summary",
                type:"summary",
                label:"Summary of Ratings",
                dbColName:"summary",
                dbTableName:"",
                content:[
                    {id:"summary_criteria",type:"summary-header",label:"Criteria",dbColName:"summary_criteria",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"summary_weight",type:"summary-header",label:"Weight",dbColName:"summary_weight",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"summary_score",type:"summary-header",label:"Score",dbColName:"summary_score",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"summary_total_label",type:"summary-footer",label:"Grand Total:",dbColName:"summary_total_label",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"summary_total_weight",type:"summary-footer",label:"0%",dbColName:"summary_total_weight",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"summary_total_score",type:"summary-footer",label:"0.000",dbColName:"summary_total_score",dbTableName:"",content:[],parentId:"summary",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:-1,
                maxPoints:0,
                min:0,
                max:0,
                step:0
            },
            {
                id:"education",
                type:"criteria1",
                label:"Education",
                dbColName:"education",
                dbTableName:"",
                content:[
                    {id:"educational_attainment",type:"display",label:"Highest level of education attained",dbColName:"educational_attainment",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"degrees_taken",type:"display-list-bullet-disc",label:"Degrees taken",dbColName:"degrees_taken",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"has_specific_education_required",type:"display",label:"Has taken education required for the position",dbColName:"has_specific_education_required",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"educIncrements",type:"display",label:"Number of increments above the Qualification Standard",dbColName:"educIncrements",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"isEducQualified",type:"display-check",label:"Applicant is qualified",dbColName:"isEducQualified",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10),
                maxPoints:(positionCategory == 5 || (positionCategory == 4 && salaryGrade != 24) ? 5 : 10),
                min:0,
                max:0,
                step:0,
                getPointsManually:function(){
                    var score = 0;
                    var scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education")[0];

                    var educAttainment = jobApplication["educational_attainmentIndex"];
                    var degreeTaken = jobApplication["degree_taken"];
                    var hasSpecEduc = (jobApplication["has_specific_education_required"] == null ? "n/a" : (jobApplication["has_specific_education_required"] == 1 ? "Yes" : "No"));
                    
                    var applicantEducIncrement = ScoreSheet.getEducIncrements(educAttainment, degreeTaken);
                    var incrementObj = document.mpsEducIncrement.filter(increment=>(increment["baseline_educational_attainment"] == positionObj["required_educational_attainment"]));
                    var requiredEducIncrement = incrementObj[0]["education_increment_level"];
                    var educIncrementAboveQS = applicantEducIncrement - requiredEducIncrement;

                    scoreSheetElementUI.displays["educational_attainment"].displayEx.setHTMLContent(jobApplication["educational_attainment"]);
                    scoreSheetElementUI.displays["degrees_taken"].contentWrapper.innerHTML = "";
                    for (const degree of degreeTaken)
                    {
                        var degreeStr = degree["degree"]
                            + " ("
                            + (type(degree["graduation_year"]) == "number" && degree["graduation_year"] != null && degree["graduation_year"] != undefined ? "graduated in " + degree["graduation_year"]
                                : (type(degree["complete_academic_requirements"]) == "boolean" && degree["complete_academic_requirements"] || type(degree["complete_academic_requirements"]) == "number" && degree["complete_academic_requirements"] != 0 ? "complete academic requirements"
                                    : (type(degree["units_earned"]) == "number" && degree["units_earned"] != null && degree["units_earned"] != undefined ? degree["units_earned"] + " units earned"
                                        : (type(degree["year_level_completed"]) == "number" && degree["year_level_completed"] != null && degree["year_level_completed"] != undefined ? degree["year_level_completed"] + " year" + (degree["year_level_completed"] == 1 ? "" : "s") + " completed" : "no info")
                                    )
                                )
                            )
                            + ")";
                        
                            scoreSheetElementUI.displays["degrees_taken"].contentWrapper.appendChild(htmlToElement("<li>" + degreeStr + "</li>"));
                    }

                    if (scoreSheetElementUI.displays["degrees_taken"].contentWrapper.innerHTML.trim() == "" && !scoreSheetElementUI.displays["degrees_taken"].contentWrapper.classList.contains("hidden"))
                    {
                        scoreSheetElementUI.displays["degrees_taken"].contentWrapper.classList.add("hidden");
                        scoreSheetElementUI.displays["degrees_taken"].displayEx.setVertical(false);
                        scoreSheetElementUI.displays["degrees_taken"].contentWrapper.parentElement.appendChild(document.createTextNode("(no info)"));
                    }
                    scoreSheetElementUI.displays["has_specific_education_required"].displayEx.setHTMLContent(hasSpecEduc);
                    scoreSheetElementUI.displays["educIncrements"].displayEx.setHTMLContent(educIncrementAboveQS.toString());
                    scoreSheetElementUI.displays["isEducQualified"].displayEx.check((hasSpecEduc == "n/a" || hasSpecEduc == "Yes") && applicantEducIncrement >= requiredEducIncrement);

                    score = ScoreSheet.getEducScore(educIncrementAboveQS, positionObj["position_categoryId"], positionObj["salary_grade"]);
                    
                    return score;
                }
            },
            {
                id:"training",
                type:"criteria1",
                label:"Training",
                dbColName:"training",
                dbTableName:"",
                content:[
                    {id:"relevant_training_hours",type:"display",label:"Total number of relevant training hours",dbColName:"relevant_training_hours",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"relevant_training_count",type:"display",label:"Number of relevant trainings considered",dbColName:"relevant_training_count",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"has_specific_training",type:"display",label:"Has undergone required training for the position",dbColName:"has_specific_training",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"has_more_unrecorded_training",type:"display",label:"Has unconsidered trainings",dbColName:"has_more_unrecorded_training",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"trainIncrements",type:"display",label:"Number of increments above the Qualification Standard",dbColName:"trainIncrements",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"isTrainingQualified",type:"display-check",label:"Applicant is qualified",dbColName:"isTrainingQualified",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10),
                maxPoints:(positionCategory == 5 || (positionCategory == 4 && (salaryGrade <= 9 || salaryGrade == 24)) ? 5 : 10),
                min:0,
                max:0,
                step:0,
                getPointsManually:function(){
                    var score = 0;
                    var scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training")[0];

                    var relevantTrainings = jobApplication["relevant_training"];
                    var relevantTrainingHours = (relevantTrainings.length > 0 ? relevantTrainings.map(training=>training["hours"]).reduce((total, nextVal)=>total + nextVal) : 0);
                    var applicantTrainingIncrement = Math.trunc(relevantTrainingHours / 8 + 1);
                    var hasSpecTraining = (jobApplication["has_specific_training"] == null ? "n/a" : (jobApplication["has_specific_training"] == 1 ? "Yes" : "No"));
                    var hasMoreTraining = (jobApplication["has_more_unrecorded_training"] == null ? "n/a" : (jobApplication["has_more_unrecorded_training"] == 1 ? "Yes" : "No"));
                    var requiredTrainingHours = positionObj["required_training_hours"];
                    var requiredTrainingIncrement = Math.trunc(requiredTrainingHours / 8 + 1);
                    var trainingIncrementAboveQS = applicantTrainingIncrement - requiredTrainingIncrement;
                    
                    scoreSheetElementUI.displays["relevant_training_hours"].displayEx.setHTMLContent(relevantTrainingHours.toString());
                    scoreSheetElementUI.displays["relevant_training_count"].displayEx.setHTMLContent(relevantTrainings.length.toString());
                    scoreSheetElementUI.displays["has_specific_training"].displayEx.setHTMLContent(hasSpecTraining);
                    scoreSheetElementUI.displays["has_more_unrecorded_training"].displayEx.setHTMLContent(hasMoreTraining);
                    scoreSheetElementUI.displays["trainIncrements"].displayEx.setHTMLContent(trainingIncrementAboveQS.toString());
                    scoreSheetElementUI.displays["isTrainingQualified"].displayEx.check((hasSpecTraining == "n/a" || hasSpecTraining == "Yes") && applicantTrainingIncrement >= requiredTrainingIncrement);

                    score = ScoreSheet.getTrainingScore(trainingIncrementAboveQS, positionObj["position_categoryId"], positionObj["salary_grade"]);
                    
                    return score;
                }
            },
            {
                id:"experience",
                type:"criteria1",
                label:"Experience",
                dbColName:"experience",
                dbTableName:"",
                content:[
                    {id:"relevant_work_experience_years",type:"display",label:"Total number of years of relevant work experience",dbColName:"relevant_work_experience_years",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"relevant_work_experience_count",type:"display",label:"Number of relevant employment considered",dbColName:"relevant_work_experience_count",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"has_specific_work_experience",type:"display",label:"Has the required work experience for the position",dbColName:"has_specific_work_experience",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"has_more_unrecorded_work_experience",type:"display",label:"Has unconsidered employment",dbColName:"has_more_unrecorded_work_experience",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"expIncrements",type:"display",label:"Number of increments above the Qualification Standard",dbColName:"expIncrements",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"isWorkExpQualified",type:"display-check",label:"Applicant is qualified",dbColName:"isWorkExpQualified",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10),
                maxPoints:(positionCategory > 3 ? (salaryGrade > 9 ? 15 : 20) : 10),
                min:0,
                max:0,
                step:0,
                getPointsManually:function(){
                    var score = 0;
                    var scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience")[0];

                    var relevantWorkExp = jobApplication["relevant_work_experience"];
                    var relevantWorkExpDuration = (relevantWorkExp.length > 0 ? relevantWorkExp.map(workExp=>ScoreSheet.getDuration(workExp["start_date"], (workExp["end_date"] == null || workExp["end_date"] == "" ? ScoreSheet.defaultEndDate : workExp["end_date"]))).reduce(ScoreSheet.addDuration): {y:0, m:0, d:0});
                    var applicantWorkExpIncrement = Math.trunc(ScoreSheet.convertDurationToNum(relevantWorkExpDuration) * 12 / 6 + 1);
                    var hasSpecWorkExp = (jobApplication["has_specific_work_experience"] == null ? "n/a" : (jobApplication["has_specific_work_experience"] == 1 ? "Yes" : "No"));
                    var hasMoreWorkExp = (jobApplication["has_more_unrecorded_work_experience"] == null ? "n/a" : (jobApplication["has_more_unrecorded_work_experience"] == 1 ? "Yes" : "No"));
                    var requiredWorkExpYears = positionObj["required_work_experience_years"];
                    var requiredWorkExpIncrement = Math.trunc(requiredWorkExpYears * 12 / 6 + 1);
                    var workExpIncrementAboveQS = applicantWorkExpIncrement - requiredWorkExpIncrement;
                    
                    scoreSheetElementUI.displays["relevant_work_experience_years"].displayEx.setHTMLContent(ScoreSheet.convertDurationToString(relevantWorkExpDuration));
                    scoreSheetElementUI.displays["relevant_work_experience_count"].displayEx.setHTMLContent(relevantWorkExp.length.toString());
                    scoreSheetElementUI.displays["has_specific_work_experience"].displayEx.setHTMLContent(hasSpecWorkExp);
                    scoreSheetElementUI.displays["has_more_unrecorded_work_experience"].displayEx.setHTMLContent(hasMoreWorkExp);
                    scoreSheetElementUI.displays["expIncrements"].displayEx.setHTMLContent(workExpIncrementAboveQS.toString());
                    scoreSheetElementUI.displays["isWorkExpQualified"].displayEx.check((hasSpecWorkExp == "n/a" || hasSpecWorkExp == "Yes") && applicantWorkExpIncrement >= requiredWorkExpIncrement);

                    score = ScoreSheet.getWorkExpScore(workExpIncrementAboveQS, positionObj["position_categoryId"], positionObj["salary_grade"]);
                    
                    return score;
                }
            },
            {
                id:"performance",
                type:"criteria1",
                label:"Performance",
                dbColName:"performance",
                dbTableName:"",
                content:[
                    {id:"position_req_work_exp",type:"display-check",label:"Position applied requires prior work experience (non-entry level)",dbColName:"position_req_work_exp",dbTableName:"",content:[],parentId:"performance",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"applicant_has_prior_exp",type:"display-check",label:"Applicant has prior work experience",dbColName:"applicant_has_prior_exp",dbTableName:"",content:[],parentId:"performance",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"performance",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"most_recent_performance_rating",type:"input-number",label:"Most recent relevant 1-year Performance Rating attained",dbColName:"most_recent_performance_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:(positionCategory == 1 || !(positionRequiresExp || applicantHasPriorWorkExp) ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),maxPoints:0,min:0,max:5,step:0.1},
                    {id:"performance_cse_gwa_rating",type:"input-number",label:"CSE Rating/GWA in the highest academic/grade level earned (actual/equivalent)",dbColName:"performance_cse_gwa_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:(positionCategory == 1 || positionRequiresExp || applicantHasPriorWorkExp ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),maxPoints:0,min:0,max:100,step:0.1,getPointsManually:function(){
                        var value = this.inputEx.getValue();
                        var scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "performance")[0];

                        if (value == 0)
                        {
                            scoreSheetElementUI.fields["performance_cse_honor_grad"].inputEx.enable();
                        }
                        else
                        {
                            scoreSheetElementUI.fields["performance_cse_honor_grad"].inputEx.disable();
                            scoreSheetElementUI.fields["performance_cse_honor_grad"].inputEx.setDefaultValue(0, true);
                        }

                        return this.scoreSheetElement.score * value / (this.scoreSheetElement.weight < 0 ? 1 : this.scoreSheetElement.max / this.scoreSheetElement.weight);
                    }},
                    {
                        id:"performance_cse_honor_grad",
                        type:"input-radio-select",
                        label:"Please select the applicable item if applicant is an honor graduate",
                        dbColName:"performance_cse_honor_grad",
                        dbTableName:"Job_Application",
                        content:[
                            {id:"",type:"input-list-item",label:"None",dbColName:"",dbTableName:"",content:[],parentId:"performance_cse_honor_grad",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"input-list-item",label:"Cum Laude",dbColName:"",dbTableName:"",content:[],parentId:"performance_cse_honor_grad",score:18,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"input-list-item",label:"Magna Cum Laude",dbColName:"",dbTableName:"",content:[],parentId:"performance_cse_honor_grad",score:19,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"input-list-item",label:"Summa Cum Laude",dbColName:"",dbTableName:"",content:[],parentId:"performance_cse_honor_grad",score:20,weight:-1,maxPoints:0,min:0,max:0,step:0}
                        ],
                        parentId:"performance",
                        score:1,
                        weight:(positionCategory == 1 || positionRequiresExp || applicantHasPriorWorkExp ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                        maxPoints:0,
                        min:0,
                        max:20,
                        step:0,
                        getPointsManually:function(){
                            var value = this.inputEx.getValue();
                            var scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "performance")[0];

                            if (value == 0)
                            {
                                scoreSheetElementUI.fields["performance_cse_gwa_rating"].inputEx.enable();
                            }
                            else
                            {
                                scoreSheetElementUI.fields["performance_cse_gwa_rating"].inputEx.disable();
                                scoreSheetElementUI.fields["performance_cse_gwa_rating"].inputEx.setDefaultValue(0, true);
                            }
    
                            return this.scoreSheetElement.score * value / (this.scoreSheetElement.weight < 0 ? 1 : this.scoreSheetElement.max / this.scoreSheetElement.weight);
                        }
                    }
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                min:0,
                max:0,
                step:0
            },
            {
                id:"lept",
                type:"criteria1",
                label:"PBET/LET/LEPT Rating",
                dbColName:"lept",
                dbTableName:"",
                content:[
                    {id:"lept_rating",type:"input-number",label:"Applicant's PBET/LET/LEPT Rating",dbColName:"lept_rating",dbTableName:"Job_Application",content:[],parentId:"lept",score:1,weight:(positionCategory == 1 ? 10 : 0),maxPoints:0,min:0,max:100,step:0.1}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 10 : 0),
                maxPoints:(positionCategory == 1 ? 10 : 0),
                min:0,
                max:0,
                step:0
            },
            {
                id:"coi",
                type:"criteria1",
                label:"PPST Classroom Observable Indicators",
                dbColName:"coi",
                dbTableName:"",
                content:[
                    {id:"ppstcoi",type:"input-number",label:"Applicant's COT Rating",dbColName:"ppstcoi",dbTableName:"Job_Application",content:[],parentId:"coi",score:1,weight:(positionCategory == 1 ? 35 : 0),maxPoints:0,min:0,max:30,step:0.1}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 35 : 0),
                maxPoints:(positionCategory == 1 ? 35 : 0),
                min:0,
                max:0,
                step:0
            },
            {
                id:"ncoi",
                type:"criteria1",
                label:"PPST Non-Classroom Observable Indicators",
                dbColName:"ncoi",
                dbTableName:"",
                content:[
                    {id:"ppstncoi",type:"input-number",label:"Applicant's TRF Rating",dbColName:"ppstncoi",dbTableName:"Job_Application",content:[],parentId:"ncoi",score:1,weight:(positionCategory == 1 ? 25 : 0),maxPoints:0,min:0,max:20,step:0.1}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 25 : 0),
                maxPoints:(positionCategory == 1 ? 25 : 0),
                min:0,
                max:0,
                step:0
            },
            {
                id:"accomplishments",
                type:"criteria1",
                label:"Outstanding Accomplishments",
                dbColName:"accomplishments",
                dbTableName:"",
                content:[
                    {
                        id:"awards",
                        type:"criteria2",
                        label:"Awards and Recognition",
                        dbColName:"awards",
                        dbTableName:"",
                        content:[
                            {
                                id:"citation",
                                type:"criteria3",
                                label:"Citation or Commendation",
                                dbColName:"citation",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_citation_movs",type:"input-number",label:"Number of letters of citation/commendation presented by applicant",dbColName:"number_of_citation_movs",dbTableName:"Job_Application",content:[],parentId:"citation",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1,getPointsManually:function(){
                                        var value = this.inputEx.getValue();
                                        return (value > 2 ? 4 : (value < 1 ? 0 : value + 1));
                                    }}
                                ],
                                parentId:"awards",
                                score:0,
                                weight:(positionCategory > 3 ? -1 : 0),
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"academic_award",
                                type:"criteria3",
                                label:"Academic or Inter-School Award MOVs",
                                dbColName:"academic_award",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_academic_award_movs",type:"input-number",label:"Number of award certificates/MOVs presented by applicant",dbColName:"number_of_academic_award_movs",dbTableName:"Job_Application",content:[],parentId:"academic_award",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1,getPointsManually:function(){
                                        var value = this.inputEx.getValue();
                                        return (value > 2 ? 4 : (value < 1 ? 0 : value + 1));
                                    }}
                                ],
                                parentId:"awards",
                                score:0,
                                weight:(positionCategory > 2 ? -1 : 0),
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"outstanding_emp_award",
                                type:"criteria3",
                                label:"Outstanding Employee Award MOVs",
                                dbColName:"outstanding_emp_award",
                                dbTableName:"",
                                content:[
                                    {
                                        id:"outstanding_emp_award_external",
                                        type:"criteria4",
                                        label:"Number of awards from external institution",
                                        dbColName:"outstanding_emp_award_external",
                                        dbTableName:"",
                                        content:[
                                            {id:"number_of_awards_external_office_search",type:"input-number",label:"Local office search",dbColName:"number_of_awards_external_office_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_external",score:(positionCategory == 3 ? 1 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                            {id:"number_of_awards_external_org_level_search",type:"input-number",label:"Organization-level search or higher",dbColName:"number_of_awards_external_org_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_external",score:(positionCategory == 3 ? 2 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                        ],
                                        parentId:"outstanding_emp_award",
                                        score:0,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    },    
                                    {
                                        id:"outstanding_emp_award_co",
                                        type:"criteria4",
                                        label:"Number of awards from the Central Office",
                                        dbColName:"outstanding_emp_award_co",
                                        dbTableName:"",
                                        content:[
                                            {id:"number_of_awards_central_co_level_search",type:"input-number",label:"Central Office search",dbColName:"number_of_awards_central_co_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_co",score:(positionCategory == 3 ? 1 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                            {id:"number_of_awards_central_national_search",type:"input-number",label:"National-level search or higher",dbColName:"number_of_awards_central_national_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_co",score:(positionCategory == 3 ? 2 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                        ],
                                        parentId:"outstanding_emp_award",
                                        score:0,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    },        
                                    {
                                        id:"outstanding_emp_award_ro",
                                        type:"criteria4",
                                        label:"Number of awards from the Regional Office",
                                        dbColName:"outstanding_emp_award_ro",
                                        dbTableName:"",
                                        content:[
                                            {id:"number_of_awards_regional_ro_level_search",type:"input-number",label:"Regional Office search",dbColName:"number_of_awards_regional_ro_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_ro",score:(positionCategory == 3 ? 1 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                            {id:"number_of_awards_regional_national_search",type:"input-number",label:"National-level search or higher",dbColName:"number_of_awards_regional_national_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_ro",score:(positionCategory == 3 ? 2 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                        ],parentId:"outstanding_emp_award",
                                        score:0,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    },        
                                    {
                                        id:"outstanding_emp_award_sdo",
                                        type:"criteria4",
                                        label:"Number of awards from the Schools Division Office",
                                        dbColName:"outstanding_emp_award_sdo",
                                        dbTableName:"",
                                        content:[
                                            {id:"number_of_awards_division_sdo_level_search",type:"input-number",label:"Division-/provincial-/city-level search",dbColName:"number_of_awards_division_sdo_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_sdo",score:(positionCategory == 3 ? 1 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                            {id:"number_of_awards_division_national_search",type:"input-number",label:"Regional-level search or higher",dbColName:"number_of_awards_division_national_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_sdo",score:(positionCategory == 3 ? 2 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                        ],
                                        parentId:"outstanding_emp_award",
                                        score:0,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    },    
                                    {
                                        id:"outstanding_emp_award_school",
                                        type:"criteria4",
                                        label:"Number of awards from schools",
                                        dbColName:"outstanding_emp_award_school",
                                        dbTableName:"",
                                        content:[
                                            {id:"number_of_awards_school_school_level_search",type:"input-number",label:"School-/municipality-/district-level search",dbColName:"number_of_awards_school_school_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_school",score:(positionCategory == 3 ? 1 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                            {id:"number_of_awards_school_sdo_level_search",type:"input-number",label:"Division-level search or higher",dbColName:"number_of_awards_school_sdo_level_search",dbTableName:"Job_Application",content:[],parentId:"outstanding_emp_award_school",score:(positionCategory == 3 ? 2 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                        ],
                                        parentId:"outstanding_emp_award",
                                        score:0,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    }
                                ],
                                parentId:"awards",
                                score:0,
                                weight:(positionCategory > 1 ? -1 : 0),
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"trainer_award",
                                type:"criteria3",
                                label:"Awards as Trainer/Coach",
                                dbColName:"trainer_award",
                                dbTableName:"",
                                content:[
                                    {
                                        id:"trainer_award_level",
                                        type:"input-radio-select",
                                        label:"Please select the applicant's highest level of award as a trainer or coach",
                                        dbColName:"trainer_award_level",
                                        dbTableName:"Job_Application",
                                        content:[
                                            {id:"",type:"input-list-item",label:"None",dbColName:"",dbTableName:"",content:[],parentId:"trainer_award_level",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                            {id:"",type:"input-list-item",label:"Champion or Highest Placer in the Division/Provincial Level",dbColName:"",dbTableName:"",content:[],parentId:"trainer_award_level",score:1,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                            {id:"",type:"input-list-item",label:"Champion or Highest Placer in the Regional Level",dbColName:"",dbTableName:"",content:[],parentId:"trainer_award_level",score:2,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                            {id:"",type:"input-list-item",label:"Champion or Highest Placer in the National Level",dbColName:"",dbTableName:"",content:[],parentId:"trainer_award_level",score:3,weight:-1,maxPoints:0,min:0,max:0,step:0}
                                        ],
                                        parentId:"trainer_award",
                                        score:1,
                                        weight:-1,
                                        maxPoints:0,
                                        min:0,
                                        max:0,
                                        step:0
                                    }
                                ],
                                parentId:"awards",
                                score:0,
                                weight:(positionCategory == 2 ? -1 : 0),
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            }
                        ],
                        parentId:"accomplishments",
                        score:0,
                        weight:(positionCategory > 1 ? -1 : 0),
                        maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 2 ? 7 : (positionCategory == 3 ? 2 : 4))),
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"research",
                        type:"criteria2",
                        label:"Research and Innovation",
                        dbColName:"research",
                        dbTableName:"",
                        content:[
                            {
                                id:"research_guide",
                                type:"display-list-upper-alpha",
                                label:"Guide",
                                dbColName:"",
                                dbTableName:"",
                                content:[
                                    {id:"",type:"list-item",label:"Proposal",dbColName:"",dbTableName:"",content:[],parentId:"research_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Accomplishment Report",dbColName:"",dbTableName:"",content:[],parentId:"research_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Certification of Utilization",dbColName:"",dbTableName:"",content:[],parentId:"research_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Certification of Adoption",dbColName:"",dbTableName:"",content:[],parentId:"research_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Proof of Citation by Other Researchers",dbColName:"",dbTableName:"",content:[],parentId:"research_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                                ],
                                parentId:"research",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {id:"number_of_research_proposal_only",type:"input-number",label:"A only",dbColName:"number_of_research_proposal_only",dbTableName:"Job_Application",content:[],parentId:"research",score:(positionCategory == 3 ? 2 : 1),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_research_proposal_ar",type:"input-number",label:"A and B",dbColName:"number_of_research_proposal_ar",dbTableName:"Job_Application",content:[],parentId:"research",score:(positionCategory == 3 ? 3 : 2),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_research_proposal_ar_util",type:"input-number",label:"A, B, and C",dbColName:"number_of_research_proposal_ar_util",dbTableName:"Job_Application",content:[],parentId:"research",score:(positionCategory == 3 ? 4 : 3),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_research_proposal_ar_util_adopt",type:"input-number",label:"A, B, C, and D",dbColName:"number_of_research_proposal_ar_util_adopt",dbTableName:"Job_Application",content:[],parentId:"research",score:(positionCategory == 3 ? 5 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_research_proposal_ar_util_cite",type:"input-number",label:"A, B, C, and E",dbColName:"number_of_research_proposal_ar_util_cite",dbTableName:"Job_Application",content:[],parentId:"research",score:(positionCategory == 3 ? 5 : 4),weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                        ],
                        parentId:"accomplishments",
                        score:0,
                        weight:(positionCategory > 1 ? -1 : 0),
                        maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 2 ? 4 : (positionCategory == 3 ? 5 : 4))),
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"smetwg",
                        type:"criteria2",
                        label:"Subject Matter Expert/Membership in National Technical Working Groups (TWGs) or Committees",
                        dbColName:"smetwg",
                        dbTableName:"",
                        content:[
                            {
                                id:"smetwg_guide",
                                type:"display-list-upper-alpha",
                                label:"Guide",
                                dbColName:"smetwg_guide",
                                dbTableName:"",
                                content:[
                                    {id:"",type:"list-item",label:"Issuance/Memorandum",dbColName:"",dbTableName:"",content:[],parentId:"smetwg_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Certificate",dbColName:"",dbTableName:"",content:[],parentId:"smetwg_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Output/Adoption by the organization",dbColName:"",dbTableName:"",content:[],parentId:"smetwg_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                                ],
                                parentId:"smetwg",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {id:"number_of_smetwg_issuance_cert",type:"input-number",label:"A and B only",dbColName:"number_of_smetwg_issuance_cert",dbTableName:"Job_Application",content:[],parentId:"smetwg",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_smetwg_issuance_cert_output",type:"input-number",label:"All MOVs",dbColName:"number_of_smetwg_issuance_cert_output",dbTableName:"Job_Application",content:[],parentId:"smetwg",score:3,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                        ],
                        parentId:"accomplishments",
                        score:0,
                        weight:(positionCategory > 1 ? -1 : 0),
                        maxPoints:(positionCategory == 1 ? 0 : 3),
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"speakership",
                        type:"criteria2",
                        label:"Resource Speakership/Learning Facilitation",
                        dbColName:"speakership",
                        dbTableName:"",
                        content:[
                            {
                                id:"speakership_external",
                                type:"criteria4",
                                label:"Number of resource speakership/learning facilitation from external institution",
                                dbColName:"speakership_external",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_speakership_external_office_level",type:"input-number",label:"Local office-level speakership",dbColName:"number_of_speakership_external_office_level",dbTableName:"Job_Application",content:[],parentId:"speakership_external",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_speakership_external_org_level_level",type:"input-number",label:"Organization-level speakership or higher",dbColName:"number_of_speakership_external_org_level",dbTableName:"Job_Application",content:[],parentId:"speakership_external",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"speakership",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"speakership_co",
                                type:"criteria4",
                                label:"Number of resource speakership/learning facilitation from the Central Office",
                                dbColName:"speakership_co",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_speakership_central_co_level",type:"input-number",label:"Central Office-level speakership",dbColName:"number_of_speakership_central_co_level",dbTableName:"Job_Application",content:[],parentId:"speakership_co",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_speakership_central_national_level",type:"input-number",label:"National-level speakership or higher",dbColName:"number_of_speakership_central_national_level",dbTableName:"Job_Application",content:[],parentId:"speakership_co",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"speakership",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"speakership_ro",
                                type:"criteria4",
                                label:"Number of resource speakership/learning facilitation from the Regional Office",
                                dbColName:"speakership_ro",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_speakership_regional_ro_level",type:"input-number",label:"Regional Office-level speakership",dbColName:"number_of_speakership_regional_ro_level",dbTableName:"Job_Application",content:[],parentId:"speakership_ro",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_speakership_regional_national_level",type:"input-number",label:"National-level speakership or higher",dbColName:"number_of_speakership_regional_national_level",dbTableName:"Job_Application",content:[],parentId:"speakership_ro",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"speakership",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"speakership_sdo",
                                type:"criteria4",
                                label:"Number of resource speakership/learning facilitation from the Schools Division Office",
                                dbColName:"speakership_sdo",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_speakership_division_sdo_level",type:"input-number",label:"Division-/provincial-/city-level speakership",dbColName:"number_of_speakership_division_sdo_level",dbTableName:"Job_Application",content:[],parentId:"speakership_sdo",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_speakership_division_regional_level",type:"input-number",label:"Regional-level speakership or higher",dbColName:"number_of_speakership_division_regional_level",dbTableName:"Job_Application",content:[],parentId:"speakership_sdo",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"speakership",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"speakership_school",
                                type:"criteria4",
                                label:"Number of resource speakership/learning facilitation from schools",
                                dbColName:"speakership_school",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_speakership_school_school_level",type:"input-number",label:"School/municipal/district speakership",dbColName:"number_of_speakership_school_school_level",dbTableName:"Job_Application",content:[],parentId:"speakership_school",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_speakership_school_sdo_level",type:"input-number",label:"Division-level speakership or higher",dbColName:"number_of_speakership_school_sdo_level",dbTableName:"Job_Application",content:[],parentId:"speakership_school",score:2,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"speakership",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            }
                        ],
                        parentId:"accomplishments",
                        score:0,
                        weight:(positionCategory > 1 ? -1 : 0),
                        maxPoints:(positionCategory == 1 ? 0 : 2),
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"neap",
                        type:"criteria2",
                        label:"NEAP Accredited Learning Facilitator",
                        dbColName:"neap",
                        dbTableName:"",
                        content:[
                            {
                                id:"neap_facilitator_accreditation",
                                type:"input-radio-select",
                                label:"Please select the applicant's highest level of accreditation as NEAP Learning Facilitator",
                                dbColName:"neap_facilitator_accreditation",
                                dbTableName:"Job_Application",
                                content:[
                                    {id:"",type:"input-list-item",label:"None",dbColName:"",dbTableName:"",content:[],parentId:"neap_facilitator_accreditation",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"input-list-item",label:"Accredited by Regional Trainer",dbColName:"",dbTableName:"",content:[],parentId:"neap_facilitator_accreditation",score:1,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"input-list-item",label:"Accredited by National Trainer",dbColName:"",dbTableName:"",content:[],parentId:"neap_facilitator_accreditation",score:1.5,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"input-list-item",label:"Accredited by National Assessor",dbColName:"",dbTableName:"",content:[],parentId:"neap_facilitator_accreditation",score:2,weight:-1,maxPoints:0,min:0,max:0,step:0}
                                ],
                                parentId:"neap",
                                score:1,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            }
                        ],
                        parentId:"accomplishments",
                        score:0,
                        weight:(positionCategory > 1 ? -1 : 0),
                        maxPoints:(positionCategory == 1 ? 0 : 2),
                        min:0,
                        max:0,
                        step:0
                    }        
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                min:0,
                max:0,
                step:0
            },
            {
                id:"educationApp",
                type:"criteria1",
                label:"Application of Education",
                dbColName:"educationApp",
                dbTableName:"",
                content:[
                    {
                        id:"educationApp_exp_required",
                        type:"criteria4",
                        label:"For Positions with Experience Requirement",
                        dbColName:"educationApp_exp_required",
                        dbTableName:"",
                        content:[
                            {
                                id:"educationApp_exp_required_guide",
                                type:"display-list-upper-alpha",
                                label:"Guide",
                                dbColName:"educationApp_exp_required_guide",
                                dbTableName:"",
                                content:[
                                    {id:"",type:"list-item",label:"Action Plan approved by the Head of Office",dbColName:"",dbTableName:"",content:[],parentId:"educationApp_exp_required_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Accomplishment Report verified by the Head of Office",dbColName:"",dbTableName:"",content:[],parentId:"educationApp_exp_required_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                                    {id:"",type:"list-item",label:"Certification of utilization/adoption signed by the Head of Office",dbColName:"",dbTableName:"",content:[],parentId:"educationApp_exp_required_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                                ],
                                parentId:"educationApp_exp_required",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"educationApp_exp_required_relevant",
                                type:"criteria4",
                                label:"Relevant",
                                dbColName:"educationApp_exp_required_relevant",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_app_educ_r_actionplan",type:"input-number",label:"A Only",dbColName:"number_of_app_educ_r_actionplan",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_relevant",score:5,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_app_educ_r_actionplan_ar",type:"input-number",label:"A and B",dbColName:"number_of_app_educ_r_actionplan_ar",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_relevant",score:7,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_app_educ_r_actionplan_ar_adoption",type:"input-number",label:"All MOVs",dbColName:"number_of_app_educ_r_actionplan_ar_adoption",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_relevant",score:10,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"educationApp_exp_required_guide",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            },
                            {
                                id:"educationApp_exp_required_not_relevant",
                                type:"criteria4",
                                label:"Not Relevant",
                                dbColName:"educationApp_exp_required_not_relevant",
                                dbTableName:"",
                                content:[
                                    {id:"number_of_app_educ_nr_actionplan",type:"input-number",label:"A Only",dbColName:"number_of_app_educ_nr_actionplan",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_not_relevant",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_app_educ_nr_actionplan_ar",type:"input-number",label:"A and B",dbColName:"number_of_app_educ_nr_actionplan_ar",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_not_relevant",score:3,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                                    {id:"number_of_app_educ_nr_actionplan_ar_adoption",type:"input-number",label:"All MOVs",dbColName:"number_of_app_educ_nr_actionplan_ar_adoption",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_required_not_relevant",score:5,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                                ],
                                parentId:"educationApp_exp_required_guide",
                                score:0,
                                weight:-1,
                                maxPoints:0,
                                min:0,
                                max:0,
                                step:0
                            }
                        ],
                        parentId:"educationApp",
                        score:0,
                        weight:(positionRequiresExp ? -1 : 0),
                        maxPoints:(positionRequiresExp ? (positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)) : 0),
                        min:0,
                        max:0,
                        step:0
                    },            
                    {
                        id:"educationApp_exp_not_required",
                        type:"criteria4",
                        label:"For Positions with No Experience Requirement",
                        dbColName:"educationApp_exp_not_required",
                        dbTableName:"",
                        content:[
                            {id:"app_educ_gwa",type:"input-number",label:"Applicant’s GWA in the highest academic/grade level earned (actual/equivalent)",dbColName:"app_educ_gwa",dbTableName:"Job_Application",content:[],parentId:"educationApp_exp_not_required",score:1,weight:(positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10),maxPoints:0,min:0,max:100,step:0}
                        ],
                        parentId:"educationApp",
                        score:0,
                        weight:(positionRequiresExp ? 0 : -1),
                        maxPoints:(positionRequiresExp ? (positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)) : 0),
                        min:0,
                        max:0,
                        step:0
                    }
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                maxPoints:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                min:0,
                max:0,
                step:0
            },
            {
                id:"trainingApp",
                type:"criteria1",
                label:"Application of Learning and Development",
                dbColName:"trainingApp",
                dbTableName:"",
                content:[
                    {
                        id:"trainingApp_guide",
                        type:"display-list-upper-alpha",
                        label:"Guide",
                        dbColName:"trainingApp_exp_guide",
                        dbTableName:"",
                        content:[
                            {id:"",type:"list-item",label:"Certificate of Training",dbColName:"",dbTableName:"",content:[],parentId:"trainingApp_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"list-item",label:"Action Plan/Re-entry Action Plan/Job Embedded Learning/Impact Project signed by Head of Office",dbColName:"",dbTableName:"",content:[],parentId:"trainingApp_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"list-item",label:"Accomplishment Report adopted by local level",dbColName:"",dbTableName:"",content:[],parentId:"trainingApp_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                            {id:"",type:"list-item",label:"Accomplishment Report adopted by different local level/higher level",dbColName:"",dbTableName:"",content:[],parentId:"trainingApp_guide",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                        ],
                        parentId:"trainingApp",
                        score:0,
                        weight:-1,
                        maxPoints:0,
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"trainingApp_relevant",
                        type:"criteria4",
                        label:"Relevant",
                        dbColName:"trainingApp_relevant",
                        dbTableName:"",
                        content:[
                            {id:"number_of_app_train_relevant_cert_ap",type:"input-number",label:"A and B",dbColName:"number_of_app_train_relevant_cert_ap",dbTableName:"Job_Application",content:[],parentId:"trainingApp_relevant",score:5,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_app_train_relevant_cert_ap_arlocal",type:"input-number",label:"A, B, and C",dbColName:"number_of_app_train_relevant_cert_ap_arlocal",dbTableName:"Job_Application",content:[],parentId:"trainingApp_relevant",score:7,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_app_train_relevant_cert_ap_arlocal_arother",type:"input-number",label:"All MOVs",dbColName:"number_of_app_train_relevant_cert_ap_arlocal_arother",dbTableName:"Job_Application",content:[],parentId:"trainingApp_relevant",score:10,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                        ],
                        parentId:"trainingApp_guide",
                        score:0,
                        weight:-1,
                        maxPoints:0,
                        min:0,
                        max:0,
                        step:0
                    },
                    {
                        id:"trainingApp_not_relevant",
                        type:"criteria4",
                        label:"Not Relevant",
                        dbColName:"trainingApp_not_relevant",
                        dbTableName:"",
                        content:[
                            {id:"number_of_app_train_not_relevant_cert_ap",type:"input-number",label:"A and B",dbColName:"number_of_app_train_not_relevant_cert_ap",dbTableName:"Job_Application",content:[],parentId:"trainingApp_not_relevant",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_app_train_not_relevant_cert_ap_arlocal",type:"input-number",label:"A, B, and C",dbColName:"number_of_app_train_not_relevant_cert_ap_arlocal",dbTableName:"Job_Application",content:[],parentId:"trainingApp_not_relevant",score:3,weight:-1,maxPoints:0,min:0,max:"ANY",step:1},
                            {id:"number_of_app_train_not_relevant_cert_ap_arlocal_arother",type:"input-number",label:"All MOVs",dbColName:"number_of_app_train_not_relevant_cert_ap_arlocal_arother",dbTableName:"Job_Application",content:[],parentId:"trainingApp_not_relevant",score:5,weight:-1,maxPoints:0,min:0,max:"ANY",step:1}
                        ],
                        parentId:"trainingApp_guide",
                        score:0,
                        weight:-1,
                        maxPoints:0,
                        min:0,
                        max:0,
                        step:0
                    }
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                maxPoints:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                min:0,
                max:0,
                step:0
            },
            {
                id:"potential",
                type:"criteria1",
                label:"Potential",
                dbColName:"potential",
                dbTableName:"",
                content:[
                    {id:"score_exam",type:"input-number",label:"Written Examination",dbColName:"score_exam",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade < 20 ? 10 : 5))),maxPoints:0,min:0,max:100,step:0.1},
                    {id:"score_skill",type:"input-number",label:"Skills or Work Sample Test",dbColName:"score_skill",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory < 3 ? 0 : (positionCategory == 5 ? -1 : (positionCategory == 3 && salaryGrade == 24 ? 5 : 10))),maxPoints:0,min:0,max:100,step:0.1},
                    {id:"score_bei",type:"input-number",label:"Behavioral Events Interview",dbColName:"score_bei",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),maxPoints:0,min:0,max:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),step:0.1}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                min:0,
                max:0,
                step:0
            },
        ];

        return criteria;
    }

    static getEducIncrements(educAttainment = 0, degreesTaken = [{degree_typeIndex:0,degree:"",year_level_completed:null,units_earned:null,complete_academic_requirements:null,graduation_year:null}])
    {
        if (type(educAttainment) != "number")
        {
            throw("Invalid argument type: educAttainment:" + educAttainment);
        }

        if (degreesTaken == null || degreesTaken == undefined || (type(degreesTaken) == "array" && degreesTaken.length == 0))
        {
            return (educAttainment == 8 ? 31 : (educAttainment == 7 ? 21 : educAttainment)); // GIVES SOME "BENEFIT OF THE DOUBT" WHILE THE DEGREE INFORMATION IS UNAVAILABLE
        }
        else
        {
            var highestDegree = null, highestIncrement = -1;

            for (const degree of degreesTaken)
            {
                if (highestDegree == null || highestIncrement < this.getEducIncrementFromDegree(degree))
                {
                    highestDegree = degree;
                    highestIncrement = this.getEducIncrementFromDegree(degree);
                }
            }

            return highestIncrement;
        }
    }

    static getEducIncrementFromDegree(degree = {degree_typeIndex:0,degree:"",year_level_completed:null,units_earned:null,complete_academic_requirements:null,graduation_year:null})
    {
        var minUnitsPerSem = 21; // ASSUMED NUMBER OF UNITS PER SEMESTER; CHANGE TO REFLECT POLICY
        var degreeName = null, degreeType = null, degreeGradYear  = null, degreeCAR = null, degreeUnits = null, degreeYearLevel = null;

        try
        {
            degreeName = degree["degree"]; // NOT USED
            degreeType = degree["degree_typeIndex"]; // 6-8
            degreeGradYear = degree["graduation_year"];
            degreeCAR = degree["complete_academic_requirements"];
            degreeUnits = degree["units_earned"];
            degreeYearLevel = degree["year_level_completed"];
    
            if (degreeType >= 6)
            {
                if (type(degreeGradYear) == "number" && degreeGradYear > 0)
                {
                    return (degreeType > 7 ? 31 : (degreeType > 6 ? 21 : degreeType)); // a graduate of a degree
                }
                else if (degreeType == 6)
                {
                    if (type(degreeYearLevel) == "number" && degreeYearLevel >= 2 || type(degreeUnits) == "number" && degreeUnits >= minUnitsPerSem * 4)
                    {
                        return 5; // finished the 2nd year of college
                    }
                    else
                    {
                        return 4; // HS graduate only or finished less than two years in college
                    }
                }
                else if ((type(degreeCAR) == "number" && degreeCAR != 0) || (type(degreeCAR) == "boolean" && degreeCAR))
                {
                    return (degreeType > 7 ? 30 : 20); // assumes no degrees higher than a doctorate
                }
                else if (type(degreeUnits) == "number" && degreeUnits > 0)
                {
                    if (degreeType > 7)
                    {
                        return 21 + degreeUnits / 3;
                    }
                    else
                    {
                        return 6 + ((degreeUnits < 3 ? 3 : degreeUnits) - 3) / 3; // REVISE IF NEEDED
                    }
                }
            }
        }
        catch (ex)
        {
            console.log("ERROR [static ScoreSheet.getEducIncrementFromDegree()]: " + ex);
        }

        return 0; // increments from degree are not applicable or the degree information is incomplete or invalid
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

    static getDuration(startDate, endDate)
    {
        var err = "";

        [startDate, endDate] = [new Date(startDate), new Date(endDate)];

        if (startDate == "Invalid Date")
        {
            err += (err == "" ? "" : "\n") + "Invalid Start Date";
        }

        if (endDate == "Invalid Date")
        {
            err += (err == "" ? "" : "\n") + "Invalid End Date";
        }

        if (err != "")
        {
            return err;
        }

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
    }

    static addDuration(duration1, duration2)
    {
        var years, months, days;
        [years, months, days] = [duration1.y + duration2.y, duration1.m + duration2.m, duration1.d + duration2.d];

        if (isNaN(years) || isNaN(months) || isNaN(days))
        {
            return {y:0, m:0, d:0};
        }

        months += Math.trunc(days / 30);
        days %= 30;

        years += Math.trunc(months / 12);
        months %= 12;

        return {y:years, m:months, d:days};
    }

    static convertDurationToNum(duration)
    {
        return (typeof(duration) == "string" ? NaN : duration.y + duration.m / 12 + duration.d / 365.25);
    }

    static convertDurationToString(duration)
    {
        return (isNaN(duration.y) || isNaN(duration.m) || isNaN(duration.d) ? "Invalid date(s)" + (typeof(duration) == "string" ? "\n" + duration : "") : (duration.y > 0 ? duration.y + "&nbsp;year" + (duration.y == 1 ? "" : "s") : "") + (duration.m > 0 ? (duration.y > 0 ? ", " : "") + duration.m + "&nbsp;month" + (duration.m == 1 ? "" : "s") : "") + (duration.y + duration.m > 0 && duration.d != 0 ? ", " : "") + (duration.y + duration.m > 0 && duration.d == 0 ? "" : duration.d + "&nbsp;day" + (duration.d == 1 ? "" : "s")));
    }

    resetForm()
    {
        window.location.reload(true);
    }
}

class IERForm extends FormEx
{
    constructor(parentEl = null, id = "", useFormElement = true)
    {
        super(parentEl, id, useFormElement);

        var posInfo = null

        this.setTitle("Initial Evaluation Result (IER)", 2);
        this.setFullWidth();

        posInfo = this.addBox("ier-position-info", false);

        [
            {id:"ier-selected-position", label:"Position Title"},
            {id:"ier-selected-paren-position", label:"Parenthetical Position"},
            {id:"ier-selected-plantilla", label:"Plantilla Item Number"}
        ].forEach(field=>{
            this.addInputEx(field.label, "select", "", "", field.id);
            this.dbInputEx[field.id].setFullWidth();
            this.dbInputEx[field.id].showColon();
            posInfo.appendChild(this.dbInputEx[field.id].container);
            this.dbInputEx[field.id].setSimpleStyle();
        });

        [
            {id:"ier-position", label:"Position"},
            {id:"ier-position-salary-grade", label:"Salary Grade and Monthly Salary"},
            {id:"ier-position-qs", label:"Qualification Standards"}
        ].forEach(field=>{
            posInfo.appendChild(this.addDisplayEx("div", field.id, "", field.label).container);
            this.displayExs[field.id].setFullWidth();
            this.displayExs[field.id].showColon();    
        });

        this.displayExs["ier-position-qs"].setVertical();
        this.displayExs["ier-position-qs"].content.style.paddingLeft = "2em";

        [
            {id:"ier-position-qs-education", label:"Education"},
            {id:"ier-position-qs-training", label:"Training"},
            {id:"ier-position-qs-experience", label:"Experience"},
            {id:"ier-position-qs-eligibility", label:"Eligibility"}
        ].forEach(field=>{
            this.displayExs["ier-position-qs"].addContent(this.addDisplayEx("div", field.id, "", field.label).container);
            this.displayExs[field.id].setFullWidth();
            this.displayExs[field.id].showColon();    
        });

        this.addDisplayEx("div-table", "ier-table");
        this.displayExs["ier-table"].container.classList.add("ier-table");
        this.displayExs["ier-table"].setHeaders([
            {colHeaderName:"row-number", colHeaderText:"No."},
            {colHeaderName:"application-code", colHeaderText:"Application Code"},
            {colHeaderName:"applicant-name", colHeaderText:"Names of Applicant"},
            {colHeaderName:"address", colHeaderText:"Address"},
            {colHeaderName:"age", colHeaderText:"Age"},
            {colHeaderName:"sex", colHeaderText:"Sex"},
            {colHeaderName:"civil-status", colHeaderText:"Civil Status"},
            {colHeaderName:"religion", colHeaderText:"Religion"},
            {colHeaderName:"disability", colHeaderText:"Disability"},
            {colHeaderName:"ethnic-group", colHeaderText:"Ethnic Group"},
            {colHeaderName:"email-address", colHeaderText:"Email Address"},
            {colHeaderName:"contact-number", colHeaderText:"Contact No."},
            {colHeaderName:"education", colHeaderText:"Education"},
            {colHeaderName:"training-title", colHeaderText:"Title"},
            {colHeaderName:"training-hours", colHeaderText:"Hours"},
            {colHeaderName:"experience-details", colHeaderText:"Details"},
            {colHeaderName:"experience-years", colHeaderText:"Years"},
            {colHeaderName:"eligibility", colHeaderText:"Eligibility"},
            {colHeaderName:"remarks", colHeaderText:"Remarks (Qualified or Disqualified)"}
        ]);

        this.displayExs["ier-table"].table.classList.add("bordered");
        this.displayExs["ier-table"].thead.insertBefore(htmlToElement("<tr></tr>"), this.displayExs["ier-table"].theadRow);
        [["old", 0], ["old", 0], ["old", 0], ["new", "Personal Information", 9], ["old", 9], ["new", "Training", 2], ["new", "Experience", 2], ["old", 13], ["old", 13]].forEach(header=>{
            if (header[0] == "new")
            {
                this.displayExs["ier-table"].thead.children[0].appendChild(htmlToElement("<th colspan=\"" + header[2] + "\">" + header[1] + "</th>"));
            }
            else
            {
                this.displayExs["ier-table"].theadRow.children[header[1]].setAttribute("rowspan", "2");
                this.displayExs["ier-table"].thead.children[0].appendChild(this.displayExs["ier-table"].theadRow.children[header[1]]);
            }
        });

        this.displayExs["ier-table"].isHeaderCustomized = true;

        this.dbInputEx["ier-selected-position"].setStatusMsgTimeout(-1);
        this.dbInputEx["ier-selected-position"].showWait("Loading");

        this.dbInputEx["ier-selected-position"].fillItems(document.positions.filter((position, index, positions)=>{
            var i = 0;
            while (i < index && positions[i]["position_title"] != position["position_title"]) { i++; }
            return i == index && position["filled"] == 0;
        }), "position_title", "plantilla_item_number");

        this.dbInputEx["ier-selected-position"].resetStatus();

        this.dbInputEx["ier-selected-position"].addEvent("change", positionChange=>{
            this.dbInputEx["ier-selected-paren-position"].setValue("");
            this.dbInputEx["ier-selected-paren-position"].clearList();
            this.dbInputEx["ier-selected-paren-position"].fillItems(document.positions.filter(position=>(position["position_title"] == this.dbInputEx["ier-selected-position"].getValue())), "parenthetical_title", "plantilla_item_number", "");
            
            this.dbInputEx["ier-selected-plantilla"].setValue("");
            this.dbInputEx["ier-selected-plantilla"].clearList();
            this.dbInputEx["ier-selected-plantilla"].fillItems(document.positions.filter(position=>(position["position_title"] == this.dbInputEx["ier-selected-position"].getValue() && (this.dbInputEx["ier-selected-paren-position"].getValue() == "" || position["parenthetical_title"] == this.dbInputEx["ier-selected-paren-position"].getValue()))), "plantilla_item_number", "plantilla_item_number", "");
            var option = this.dbInputEx["ier-selected-plantilla"].addItem("ANY");
            option.parentElement.insertBefore(option, option.parentElement.children[0]);
        });
        this.dbInputEx["ier-selected-paren-position"].addEvent("change", changeEvent=>{
            this.dbInputEx["ier-selected-plantilla"].setValue("");
            this.dbInputEx["ier-selected-plantilla"].clearList();
            this.dbInputEx["ier-selected-plantilla"].fillItems(document.positions.filter(position=>(position["position_title"] == this.dbInputEx["ier-selected-position"].getValue() && (this.dbInputEx["ier-selected-paren-position"].getValue() == "" || position["parenthetical_title"] == this.dbInputEx["ier-selected-paren-position"].getValue()))), "plantilla_item_number", "plantilla_item_number", "");
            var option = this.dbInputEx["ier-selected-plantilla"].addItem("ANY");
            option.parentElement.insertBefore(option, option.parentElement.children[0]);
        });
    }
}

// export { ScrimEx, DisplayEx, InputEx, FormEx, DialogEx, MsgBox };