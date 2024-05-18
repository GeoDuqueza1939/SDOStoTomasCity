"use strict";

class App
{
    navbar = null;
    main = null;
    mainSections = {};
    scrim = null;
    temp = {};

    constructor(htmlContainer)
    {}

    getActiveView()
    {
        if (this.main instanceof HTMLElement && this.main.children.length > 0)
        {
            return Array.from(this.main.children).find(child=>child instanceof HTMLElement && !child.classList.contains("hidden"));
        }
        else
        {
            return undefined;
        }
    }
}

class ScrimEx
{
    constructor(parent = null)
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "scrim-ex");
        this.scrim["scrimEx"] = this;
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
        this.theadRow.appendChild(this.columnHeaders.slice(-1)[0]["colHeaderCell"]);

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
            this.rows.slice(-1)[0]["data"][headerName] = (headerName in rowData ? rowData[headerName] ?? "" : "");
            this.rows.slice(-1)[0]["td"][headerName] = htmlToElement("<td>" + this.rows.slice(-1)[0]["data"][headerName] + "</td>");
            this.rows.slice(-1)[0]["tr"].appendChild(this.rows.slice(-1)[0]["td"][headerName]);
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

        this.fRows.slice(-1)[0]["td"][colFooterName] = htmlToElement("<td" + (type(rowspan) == "number" && rowspan > 1 ? " rowspan=\"" + rowspan + "\"" : "")  + (type(colspan) == "number" && colspan > 1 ? " rowspan=\"" + colspan + "\"" : "") + ">" + colFooterText + "</td>");
        this.fRows.slice(-1)[0]["data"][colFooterName] = colFooterText;
        this.fRows.slice(-1)[0]["rowspan"][colFooterName] = rowspan;
        this.fRows.slice(-1)[0]["colspan"][colFooterName] = colspan;

        this.fRows.slice(-1)[0]["tr"].appendChild(this.fRows.slice(-1)[0]["td"][colFooterName]);
    }

    removeRow(index = this.rows.length - 1) // default: removes last row added.
    {
        this.rows.splice(index, 1)[0].tr.remove();
    }

    removeAllRows()
    {
        while (this.rows.length > 0)
        {
            this.removeRow();
        }
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

        if (!(parentEl == null || isElement(parentEl)))
        {
            console.log(parentEl, isElement(parentEl), type(parentEl));
        }

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
                this.fields.push(this.inputExs.slice(-1)[0].fields[0]);
                this.inputExs.slice(-1)[0].setLabelText(labelText);
                this.inputExs.slice(-1)[0].parentInputEx = this;
                if (this.type.indexOf("-select") >= 0)
                {
                    if (type(value) == "number" || value != "")
                    {
                        this.inputExs.slice(-1)[0].setDefaultValue(value, true);  // MAY CAUSE ISSUES IF DEVELOPER DOESN'T TRACK THE NUMBER OF ITEMS WITHOUT LABELS THAT WERE MIXED WITH LABELED ITEMS
                    }
                    this.labels.push(this.inputExs.slice(-1)[0].labels[0]);
                }
                if (tooltipText != "")
                {
                    this.inputExs.slice(-1)[0].setTooltipText(tooltipText);
                }

                if (this.statusPane != null)
                {
                    this.fieldWrapper.appendChild(this.statusPane["spacer"]);
                    this.fieldWrapper.appendChild(this.statusPane);
                }

                if (this.type == "radio-select")
                {
                    this.setGroupName(this.id);
                    this.inputExs.slice(-1)[0].fields[0].addEventListener("change", (event)=>{
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
                    this.inputExs.slice(-1)[0].reverse();
                }

                if (this.listeners.field.length > 0)
                {
                    for (const listener of this.listeners.field)
                    {
                        this.inputExs.slice(-1)[0].addEvent(listener.eventType, listener.eventFunction);
                    }
                }
                
                return this.inputExs.slice(-1)[0];
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
            case "buttons":
            case "buttonExs":
                break;
            case "button":
            case "submit":
            case "reset":
            case "buttonEx":
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
            if (this.type == "table")
            {
                th = createElementEx(NO_NS, "th", this.thead, null)
            }
            else
            {
                th = createElementEx(NO_NS, "b", this.thead, null, "class", "th")
            }
            th["inputEx"] = this;
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
        th["inputEx"] = this;

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
                    createElementEx(NO_NS, "th", this.thead, this.thead.children.slice(-1)[0], "class", "blank");
                }
                else
                {
                    createElementEx(NO_NS, "b", this.thead, this.thead.children.slice(-1)[0], "class", "th blank");
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
                this.addRowButtonEx.parentInputEx = this;
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
                if (this.useFieldSet) // && this.isMultipleInput) // fieldset will now always be paired with a legend
                {
                    this.labels.push(createElementEx(NO_NS, "legend", this.fieldWrapper, this.fields[0] ?? null));
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

    showWait(infoMsg) // gray
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
            this.listeners.field.push({"eventType":eventType,eventFunction:func});
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
            this.listeners.label.push({"eventType":eventType,eventFunction:func});
            this.labels[0].addEventListener(eventType, func);
        }
    }

    addStatusEvent(eventType, func) // THIS WONT ATTACH IF STATUS PANE IS STILL NON-EXISTENT
    {
        if (!this.isMultipleInput)
        {
            this.listeners.status.push({"eventType":eventType,eventFunction:func});
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
 * Class Old_FormEx
 * @requires NO_NS
 * @requires createElementEx
 * @requires createSimpleElement
 * @requires addText
 * @requires isElement
 * @requires InputEx
 */
class Old_FormEx
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

        this.container = createElementEx(NO_NS, "div", parentEl, null, "class", "old-form-ex");
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

        if (!MPASIS_App.isEmpty(this.id))
        {
            this.container.setAttribute("id", this.id);
        }

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

            this.headers.slice(-1)[0].innerHTML = headerText;

            if (id != "")
            {
                this.headers.slice(-1)[0].id = id;
            }

            return this.headers.slice(-1)[0];
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

        this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "old-form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), type, useFieldSet));
        this.inputExs.slice(-1)[0].parentFormEx = this;
        
        if (labelText != "")
        {
            this.inputExs.slice(-1)[0].setLabelText(labelText);
        }

        if (tooltip != "")
        {
            this.inputExs.slice(-1)[0].setTooltipText(tooltip);
        }

        if (dbColName != "")
        {
            this.dbInputEx[dbColName] = this.inputExs.slice(-1)[0];
        }

        if (dbTableName != "")
        {
            this.dbTableName[dbColName] = dbTableName;
        }

        if (value != "" || typeof(value) == "number") // the number validation is needed as JS interprets 0 == "" as true
        {
            this.inputExs.slice(-1)[0].setDefaultValue(value, true);
        }

        return this.inputExs.slice(-1)[0];
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

        this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "old-form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), "buttonExs", useFieldSet));
        
        this.inputExs.slice(-1)[0].parentFormEx = this;

        for (var i = 0; i < numOfBtns; i++)
        {
            if (i > 0)
            {
                this.addSpacer(this.inputExs.slice(-1)[0].fieldWrapper);
            }
            this.inputExs.slice(-1)[0].addItem("Button " + i, "button" + i, "Button " + i);
        }

        return this.inputExs.slice(-1)[0];
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

class Old_DialogEx
{
    constructor(parent = null, id = "")
    {
        this.scrim = createElementEx(NO_NS, "div", parent, null, "class", "old-dialog-ex scrim");
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
        this.formEx = new Old_FormEx(this.dialogBox, this.id + "-form-ex", false);

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

class MsgBox extends Old_DialogEx
{
    constructor(parent = null, message, type = "OK", ...func)
    {
        super(parent, "msgbox" + (new Date()).valueOf());
        this.scrim.classList.add("msgbox");
        this.message = message;
        this.addFormEx();
        this.messageContainer = this.formEx.addBox("message-container");
        this.messageContainer.innerHTML = message;
        
        this.btnGrp = new InputEx(this.dialogBox, "msgbox-btns" + (new Date()).valueOf(), "buttonExs");
        this.btnGrp.container.classList.add("msgbox-btns");
        this.btnGrp.setFullWidth();
        this.btnGrp.fieldWrapper.classList.add("center");

        this.returnValue = -1;
        this.default = null;
        this.cancel = null;

        this.defaultBtnFunc = clickEvent=>{
            this.returnValue = i;
            this.close();
        };

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
            this.btnGrp.fields[i].addEventListener("click", this.defaultBtnFunc);

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
        this.btnGrp.fields.slice(-1)[0].focus();
    }
}

class PositionSelectorDialog extends Old_DialogEx
{
    constructor(app = new MPASIS_App(), id = "", buttonConfig = [{label:"Close",tooltip:"Close dialog box",callbackOnClick:JobApplicationSelectorDialogEvent=>this.close()}], customPositionFilterCallback = (position, index, positions)=>{
        var i = 0;
        while (i < index && positions[i]["position_title"] != position["position_title"]) { i++; }
        return i == index && position["filled"] == 0;
    })
    {
        var selPosition = null, selParen = null, selPlantilla = null, btnGrp = null;

        super(app.main, id);
        this.app = app;

        this.scrim.classList.add("position-selector");
        this.addFormEx();
        this.formEx.setTitle("Select Position", 3);
        this.callbacks = buttonConfig.map(btn=>btn.callbackOnClick);

        [
            {id:"selected-position", label:"Position Title"},
            {id:"selected-paren-position", label:"Parenthetical Position"},
            {id:"selected-plantilla", label:"Plantilla Item Number"}
        ].forEach(field=>{
            [this.formEx.addInputEx(field.label, "select", "", "", field.id)].forEach(inputEx=>{
                inputEx.showColon();
                inputEx.addStatusPane();
            });
        });

        this.selPosition = selPosition = this.formEx.dbInputEx["selected-position"];
        this.selParen = selParen = this.formEx.dbInputEx["selected-paren-position"];
        this.selPlantilla = selPlantilla = this.formEx.dbInputEx["selected-plantilla"];

        btnGrp = this.formEx.addFormButtonGrp(buttonConfig.length);
        btnGrp.container.classList.add("position-selector-buttons");
        
        buttonConfig.forEach((btn, btnIndex)=>{
            btnGrp.inputExs[btnIndex].setLabelText(btn.label);
            btnGrp.inputExs[btnIndex].setTooltipText(btn.tooltip);
            btnGrp.inputExs[btnIndex].addEvent("click", btn.callbackOnClick);
        })

        btnGrp.inputExs[0].disable();

        selPosition.setStatusMsgTimeout(-1);
        selPosition.showWait("Loading");

        selPosition.fillItems(document.positions.filter(customPositionFilterCallback), "position_title", "plantilla_item_number");

        selPosition.resetStatus();

        selPosition.addEvent("change", positionChangeEvent=>btnGrp.inputExs[0].enable(null, selPosition.getValue() != ""));
        selPosition.addEvent("change", positionChangeEvent=>MPASIS_App.selectPosition(selPosition, selParen, selPlantilla));
        selParen.addEvent("change", parenChangeEvent=>MPASIS_App.selectParen(selPosition, selParen, selPlantilla));
        selPlantilla.addEvent("change", plantillaChangeEvent=>MPASIS_App.selectPlantilla(selPosition, selParen, selPlantilla));
    }
}

class JobApplicationSelectorDialog extends Old_DialogEx
{
    constructor(app = new MPASIS_App(), id = "", buttonConfig = [{label:"Close",tooltip:"Close dialog box",callbackOnClick:JobApplicationSelectorDialogEvent=>this.close()}])
    {
        super(app.main, id);
        this.app = app;

        this.scrim.classList.add("job-application-selector");
        this.addFormEx();
        this.formEx.setTitle("Select Job Application", 3);

        this.formEx.addInputEx("Enter an applicant name or application code", "text", "", "Type to populate list", "applicantQueryBox");
        this.getApplicantQueryBox().showColon();
        this.getApplicantQueryBox().container.classList.add("applicant-query-box");

        this.formEx.addInputEx("Choose the job application to load", "radio-select", "", "", "applicantListBox", "", true);
        this.getApplicantListBox().reverse();
        this.getApplicantListBox().setStatusMsgTimeout(-1);
        this.getApplicantListBox().showInfo("None to show");
        this.getApplicantListBox().container.classList.add("applicant-list-box");

        this.controlButtons = this.formEx.addFormButtonGrp(buttonConfig.length);
        this.controlButtons.container.classList.add("job-application-selector-buttons");
        buttonConfig.forEach((btn, btnIndex)=>{
            this.controlButtons.inputExs[btnIndex].setLabelText(btn.label);
            this.controlButtons.inputExs[btnIndex].setTooltipText(btn.tooltip ?? "");
            this.controlButtons.inputExs[btnIndex].addEvent("click", btn.callbackOnClick);
        });

        this.getApplicantListBox().runAfterFilling = ()=>{

        };

        var keyEventFunc = keyEvent=>{
            this.getApplicantListBox().clearList();

            this.getApplicantListBox().show();

            this.getApplicantListBox().setStatusMsgTimeout = -1;
            this.getApplicantListBox().showWait("Retrieving . . .");

            this.getApplicantListBox().fillItemsFromServer(MPASIS_App.processURL, "a=fetch&f=applicationsByApplicantOrCode&srcStr=" + this.getApplicantQueryBox().getValue(), "applicant_option_label", "application_code");
        }

        // this.getApplicantQueryBox().addEvent("change", keyEventFunc);
        this.getApplicantQueryBox().addEvent("keyup", keyEventFunc);
        // this.getApplicantQueryBox().addEvent("keydown", keyEventFunc);
        // this.getApplicantQueryBox().addEvent("keypress", keyEventFunc);
    }

    getApplicantListBox()
    {
        return this.formEx.dbInputEx["applicantListBox"];
    }

    getApplicantQueryBox()
    {
        return this.formEx.dbInputEx["applicantQueryBox"];
    }

    getDialogButton(index = 0)
    {
        if (type(index) == "number" && index >= 0 && index < this.controlButtons.inputExs.length)
        {
            return this.controlButtons.inputExs[index];
        }
    }
}

class JobQSEntryForm extends Old_FormEx // CODE STUB: SHOULD BE EXPANDED IMMEDIATELY
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-job-data-entry"], id, useFormElement);
        this.app = app;
    }
}

class ApplicationEntryForm extends Old_FormEx // CODE STUB: SHOULD BE EXPANDED IMMEDIATELY
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-applicant-data-entry"], id, useFormElement);
        this.app = app;
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
                        this.totalScoreDisplay = new DisplayEx(this.contentWrapper, "div", "", "N/A", "Total Points");
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
            case "textarea":
                uiEx = scoreSheet.addInputEx(scoreSheetElement.label, (this.type == "input-text" ? "text" : this.type), "", "", scoreSheetElement.dbColName, scoreSheetElement.dbTableName);
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
                uiEx.showColon();
                this.inputEx = uiEx;
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

class ScoreSheet extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-scoresheet"], id, useFormElement);
        this.app = app;
        this.setTitle("Score Sheet", 2);
        this.setFullWidth();

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
        this.loadButton.fieldWrapper.classList.add("right");

        this.loadButton.addEvent("click", this.loadApplicationBtn_Click);

        this.loadButton.setStatusMsgTimeout(-1);
        this.loadButton.showInfo("Click to begin");
        this.loadButton.statusPane.style.display = "block";

        this.loadButton.fields[0].click();
    }

    loadApplicationBtn_Click(event) // inherits the scope of the clicked button/element
    {
        var scoreSheet = null, clickedElement = null, div = null, retrieveApplicantDialog = null;

        scoreSheet = this.inputEx.parentFormEx;
        clickedElement = this; //event.srcElement; // event.target;

        this.inputEx.resetStatus();

        if (this.innerHTML == "Load Application")
        {
            retrieveApplicantDialog = new JobApplicationSelectorDialog(scoreSheet.app, "scoresheet-job-application-selector-dialog", [
                {label:"Load", tooltip:"Load selected", callbackOnClick:event=>{
                    var scoreSheetElementUI = null, weight = 0;
                    var searchResult = retrieveApplicantDialog.getApplicantListBox();

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
                                    scoreSheet.summary[criteria.id] = scoreSheet.summaryUI.container.displayTableEx.rows.slice(-1)[0]["td"]["summary_score"];
                                    weight += criteria.weight;
                                }
                            }                                
                        }
                    }

                    scoreSheet.summaryUI.container.displayTableEx.fRows[0]["td"]["summary_total_weight"].innerHTML = weight + "%";

                    var appliedPosition = document.positions.filter(position=>position["position_title"] == scoreSheet.jobApplication["position_title_applied"] || position["plantilla_item_number"] == scoreSheet.jobApplication["plantilla_item_number_applied"])[0];

                    // Education
                    if (scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education") != null && scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education").length > 0)
                    {
                        scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education")[0].getPoints();
                    }
                    
                    // Training
                    if (scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training") != null && scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training").length > 0)
                    {
                        scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training")[0].getPoints();
                    }

                    // Experience
                    if (scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience") != null && scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience").length > 0)
                    {
                        scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience")[0].getPoints();
                    }

                    // Performance
                    scoreSheetElementUI = scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "performance")[0];

                    if (MPASIS_App.isDefined(scoreSheetElementUI))
                    {
                        if ("position_req_work_exp" in scoreSheetElementUI.displays)
                        {
                            scoreSheetElementUI.displays["position_req_work_exp"].displayEx.check(scoreSheet.positionApplied["required_work_experience_years"] != null && scoreSheet.positionApplied["required_work_experience_years"] > 0);
                        }
                        if ("applicant_has_prior_exp" in scoreSheetElementUI.displays)
                        {
                            scoreSheetElementUI.displays["applicant_has_prior_exp"].displayEx.check(scoreSheet.jobApplication["relevant_work_experience"].length > 0);
                        }
                    }

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
            
                            console.log(colName);

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
                                // UNIMPLEMENTED IN DATABASE AND API!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                case "second_most_recent_performance_rating":
                                case "third_most_recent_performance_rating":
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
                        postData(MPASIS_App.processURL, "app=mpasis&a=update&jobApplication=" + packageData(jobApplication), (event)=>{
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
                }},
                {label:"Cancel", tooltip:"Close dialog", callbackOnClick:event=>{
                    retrieveApplicantDialog.close();
                }}
            ]);
            
            retrieveApplicantDialog.getDialogButton(0).disable();

            ["change", "keydown", "keyup", "keypress"].forEach(eventType=>{
                retrieveApplicantDialog.getApplicantQueryBox().addEvent(eventType, event=>retrieveApplicantDialog.getDialogButton(0).disable());
            });

            retrieveApplicantDialog.getApplicantListBox().addEvent("click", selectOptionEvent=>{
                retrieveApplicantDialog.getDialogButton(0).enable();
            });
        }
        else if (this.innerHTML == "Reset Score Sheet")
        {
            scoreSheet.app.showScrim();

            scoreSheet.resetForm();

            this.innerHTML = "Load Application";
        }
    }

    static getScoreSheetElements(positionObj, jobApplication) // COMPUTATION INCLUDES NON-EXISTENT SALARY GRADES IN THE NON-TEACHING POSITIONS (23, 25-26); CONSIDER IN FUTURE ISSUES; MAY ALSO CONFUSE DEVELOPERS DURING USE, ESPECIALLY WHEN THE NAME OF VARIABLE IS `scoreSheet`
    {
        var positionTitle, salaryGrade, positionCategory, positionRequiresExp, applicantHasPriorWorkExp, criteria;
        // console.log(positionObj, jobApplication);
        [positionTitle, salaryGrade, positionCategory, positionRequiresExp, applicantHasPriorWorkExp] = [positionObj["position_title"], positionObj["salary_grade"], positionObj["position_categoryId"], (positionObj["required_work_experience_years"] > 0), (jobApplication["relevant_work_experience"].length > 0)];

        criteria = [
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
                id:"performance",
                type:"criteria1",
                label:"Performance (FEATURE INCOMPLETE!!!)",
                dbColName:"performance",
                dbTableName:"",
                content:[
                    {id:"third_most_recent_performance_rating",type:"input-number",label:"Performance Rating (Year 1)",shortLabel:"Perf. Rating (Year 1)",dbColName:"third_most_recent_performance_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:-1,maxPoints:0,min:0,max:5,step:0.1},
                    {id:"second_most_recent_performance_rating",type:"input-number",label:"Performance Rating (Year 2)",shortLabel:"Perf. Rating (Year 2)",dbColName:"second_most_recent_performance_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:-1,maxPoints:0,min:0,max:5,step:0.1},
                    {id:"most_recent_performance_rating",type:"input-number",label:"Performance Rating (Year 3)",shortLabel:"Perf. Rating (Year 3)",dbColName:"most_recent_performance_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:-1,maxPoints:0,min:0,max:5,step:0.1},
                ],
                parentId:"null",
                score:0,
                weight:35,
                maxPoints:0,
                min:0,
                max:0,
                step:0,
                getPointsManually:function(mode = 0){
                    var ratingsTotal = 0, ratingsCount = 0;

                    for (const scoreSheetElementUI of this.contents)
                    {
                        ratingsTotal += scoreSheetElementUI.getPoints();
                        ratingsCount++;

                    }
                    
                    // return Math.trunc(ratingsTotal / ratingsCount * 20 * this.scoreSheetElement.weight / 100 * 1000) / 1000;
                    return Math.round(ratingsTotal / ratingsCount * 20 * this.scoreSheetElement.weight / 100 * 1000) / 1000;
                },
            },

        ];

        switch (positionTitle)
        {
            case "Teacher II":
            case "Teacher III":
                return criteria;
                break;
        } 

        criteria = [
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
                    {id:"educ_notes",type:"display",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"educ_notes",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"educIncrementsApplicant",type:"display",label:"Applicant's education increment level",dbColName:"educIncrementsApplicant",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"educIncrementsQS",type:"display",label:"Base increment level (Qualification Standard)",dbColName:"educIncrementsQS",dbTableName:"",content:[],parentId:"education",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
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
                notesId:"educ_notes",
                getPointsManually:function(mode = 0){
                    var score = 0, scoreSheetElementUI = null;
                    
                    var educAttainment = jobApplication["educational_attainmentIndex"];
                    var degreeTaken = jobApplication["degree_taken"];
                    var educNotes = jobApplication["educ_notes"] ?? "none";
                    var hasSpecEduc = (jobApplication["has_specific_education_required"] == null ? "N/A" : (jobApplication["has_specific_education_required"] == 1 ? "Yes" : "No"));
                    
                    var applicantEducIncrement = ScoreSheet.getEducIncrements(educAttainment, degreeTaken);
                    var incrementObj = document.mpsEducIncrement.filter(increment=>(increment["baseline_educational_attainment"] == positionObj["required_educational_attainment"]));
                    var requiredEducIncrement = incrementObj[0]["education_increment_level"];
                    var educIncrementAboveQS = applicantEducIncrement - requiredEducIncrement;

                    if (mode == 0)
                    {
                        scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "education")[0];
                        scoreSheetElementUI.displays["educational_attainment"].displayEx.setHTMLContent(jobApplication["educational_attainment"]);
                        scoreSheetElementUI.displays["degrees_taken"].contentWrapper.innerHTML = "";
                        for (const degree of degreeTaken)
                        {
                            scoreSheetElementUI.displays["degrees_taken"].contentWrapper.appendChild(htmlToElement("<li>" + MPASIS_App.convertDegreeObjToStr(degree) + "</li>"));
                        }
    
                        if (scoreSheetElementUI.displays["degrees_taken"].contentWrapper.innerHTML.trim() == "" && !scoreSheetElementUI.displays["degrees_taken"].contentWrapper.classList.contains("hidden"))
                        {
                            scoreSheetElementUI.displays["degrees_taken"].contentWrapper.classList.add("hidden");
                            scoreSheetElementUI.displays["degrees_taken"].displayEx.setVertical(false);
                            scoreSheetElementUI.displays["degrees_taken"].contentWrapper.parentElement.appendChild(document.createTextNode("(no info)"));
                        }
                        scoreSheetElementUI.displays["has_specific_education_required"].displayEx.setHTMLContent(hasSpecEduc);
                        scoreSheetElementUI.displays["educ_notes"].displayEx.setHTMLContent(educNotes);
                        scoreSheetElementUI.displays["educIncrementsApplicant"].displayEx.setHTMLContent(applicantEducIncrement.toString());
                        scoreSheetElementUI.displays["educIncrementsQS"].displayEx.setHTMLContent(requiredEducIncrement.toString());
                        scoreSheetElementUI.displays["educIncrements"].displayEx.setHTMLContent(educIncrementAboveQS.toString());
                        scoreSheetElementUI.displays["isEducQualified"].displayEx.check((hasSpecEduc == "N/A" || hasSpecEduc == "Yes") && applicantEducIncrement >= requiredEducIncrement);
                    }

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
                    {id:"train_notes",type:"display",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"train_notes",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"trainIncrementsApplicant",type:"display",label:"Applicant's training increment level",dbColName:"trainIncrementsApplicant",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"trainIncrementsQS",type:"display",label:"Base increment level (Qualification Standard)",dbColName:"trainIncrementsQS",dbTableName:"",content:[],parentId:"training",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
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
                notesId:"train_notes",
                getPointsManually:function(mode = 0){
                    var score = 0, scoreSheetElementUI = null;

                    var relevantTrainings = jobApplication["relevant_training"];
                    var trainNotes = jobApplication["train_notes"] ?? "none";
                    var relevantTrainingHours = (relevantTrainings.length > 0 ? relevantTrainings.map(training=>training["hours"]).reduce((total, nextVal)=>total + nextVal) : 0);
                    var applicantTrainingIncrement = Math.trunc(relevantTrainingHours / 8 + 1);
                    var hasSpecTraining = (jobApplication["has_specific_training"] == null ? "N/A" : (jobApplication["has_specific_training"] == 1 ? "Yes" : "No"));
                    var hasMoreTraining = (jobApplication["has_more_unrecorded_training"] == null ? "N/A" : (jobApplication["has_more_unrecorded_training"] == 1 ? "Yes" : "No"));
                    var requiredTrainingHours = positionObj["required_training_hours"];
                    var requiredTrainingIncrement = Math.trunc(requiredTrainingHours / 8 + 1);
                    var trainingIncrementAboveQS = applicantTrainingIncrement - requiredTrainingIncrement;
                    
                    if (mode == 0)
                    {
                        scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "training")[0];
                        scoreSheetElementUI.displays["relevant_training_hours"].displayEx.setHTMLContent(relevantTrainingHours.toString());
                        scoreSheetElementUI.displays["relevant_training_count"].displayEx.setHTMLContent(relevantTrainings.length.toString());
                        scoreSheetElementUI.displays["has_specific_training"].displayEx.setHTMLContent(hasSpecTraining);
                        scoreSheetElementUI.displays["has_more_unrecorded_training"].displayEx.setHTMLContent(hasMoreTraining);
                        scoreSheetElementUI.displays["train_notes"].displayEx.setHTMLContent(trainNotes);
                        scoreSheetElementUI.displays["trainIncrementsApplicant"].displayEx.setHTMLContent(applicantTrainingIncrement.toString());
                        scoreSheetElementUI.displays["trainIncrementsQS"].displayEx.setHTMLContent(requiredTrainingIncrement.toString());
                        scoreSheetElementUI.displays["trainIncrements"].displayEx.setHTMLContent(trainingIncrementAboveQS.toString());
                        scoreSheetElementUI.displays["isTrainingQualified"].displayEx.check((hasSpecTraining == "N/A" || hasSpecTraining == "Yes") && applicantTrainingIncrement >= requiredTrainingIncrement && relevantTrainingHours >= requiredTrainingHours);
                    }

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
                    {id:"work_exp_notes",type:"display",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"work_exp_notes",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"expIncrementsApplicant",type:"display",label:"Applicant's work experience increment level",dbColName:"expIncrementsApplicant",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"expIncrementsQS",type:"display",label:"Base increment level (Qualification Standard)",dbColName:"expIncrementsQS",dbTableName:"",content:[],parentId:"experience",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
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
                notesId:"work_exp_notes",
                getPointsManually:function(mode = 0){
                    var score = 0, scoreSheetElementUI = null;

                    var relevantWorkExp = jobApplication["relevant_work_experience"];
                    var workExpNotes = jobApplication["work_exp_notes"] ?? "none";
                    var relevantWorkExpDuration = (relevantWorkExp.length > 0 ? relevantWorkExp.map(workExp=>ScoreSheet.getDuration(workExp["start_date"], (workExp["end_date"] == null || workExp["end_date"] == "" ? MPASIS_App.defaultEndDate : workExp["end_date"]))).reduce(ScoreSheet.addDuration): {y:0, m:0, d:0});
                    var applicantWorkExpIncrement = Math.trunc(ScoreSheet.convertDurationToNum(relevantWorkExpDuration) * 12 / 6 + 1);
                    var hasSpecWorkExp = (jobApplication["has_specific_work_experience"] == null ? "N/A" : (jobApplication["has_specific_work_experience"] == 1 ? "Yes" : "No"));
                    var hasMoreWorkExp = (jobApplication["has_more_unrecorded_work_experience"] == null ? "N/A" : (jobApplication["has_more_unrecorded_work_experience"] == 1 ? "Yes" : "No"));
                    var requiredWorkExpYears = positionObj["required_work_experience_years"];
                    var requiredWorkExpIncrement = Math.trunc(requiredWorkExpYears * 12 / 6 + 1);
                    var workExpIncrementAboveQS = applicantWorkExpIncrement - requiredWorkExpIncrement;
                    
                    if (mode == 0)
                    {
                        scoreSheetElementUI = this.scoreSheet.scoreSheetElementUIs.filter(sseUI=>sseUI.scoreSheetElement.id == "experience")[0];
                        scoreSheetElementUI.displays["relevant_work_experience_years"].displayEx.setHTMLContent(ScoreSheet.convertDurationToString(relevantWorkExpDuration));
                        scoreSheetElementUI.displays["relevant_work_experience_count"].displayEx.setHTMLContent(relevantWorkExp.length.toString());
                        scoreSheetElementUI.displays["has_specific_work_experience"].displayEx.setHTMLContent(hasSpecWorkExp);
                        scoreSheetElementUI.displays["has_more_unrecorded_work_experience"].displayEx.setHTMLContent(hasMoreWorkExp);
                        scoreSheetElementUI.displays["work_exp_notes"].displayEx.setHTMLContent(workExpNotes);
                        scoreSheetElementUI.displays["expIncrementsApplicant"].displayEx.setHTMLContent(applicantWorkExpIncrement.toString());
                        scoreSheetElementUI.displays["expIncrementsQS"].displayEx.setHTMLContent(requiredWorkExpIncrement.toString());
                        scoreSheetElementUI.displays["expIncrements"].displayEx.setHTMLContent(workExpIncrementAboveQS.toString());
                        scoreSheetElementUI.displays["isWorkExpQualified"].displayEx.check((hasSpecWorkExp == "N/A" || hasSpecWorkExp == "Yes") && applicantWorkExpIncrement >= requiredWorkExpIncrement);
                    }

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
                    {id:"most_recent_performance_rating",type:"input-number",label:"Most recent relevant 1-year Performance Rating attained",shortLabel:"Perf. Rating",dbColName:"most_recent_performance_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:(positionCategory == 1 || !(positionRequiresExp || applicantHasPriorWorkExp) ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),maxPoints:0,min:0,max:5,step:0.1},
                    {id:"performance_cse_gwa_rating",type:"input-number",label:"CSE Rating/GWA in the highest academic/grade level earned (actual/equivalent)", shortLabel:"CSE Rating/GWA",dbColName:"performance_cse_gwa_rating",dbTableName:"Job_Application",content:[],parentId:"performance",score:1,weight:(positionCategory == 1 || positionRequiresExp || applicantHasPriorWorkExp ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),maxPoints:0,min:0,max:100,step:0.1,getPointsManually:function(mode = 0){
                        var value = (mode == 0 ? this.inputEx.getValue() : jobApplication[this.dbColName]);
                        var obj = (mode == 0 ? this.scoreSheetElement : this);

                        if (mode == 0)
                        {
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
                        }

                        return obj.score * value / (obj.weight < 0 ? 1 : obj.max / obj.weight);
                    }},
                    {
                        id:"performance_cse_honor_grad",
                        type:"input-radio-select",
                        label:"Please select the applicable item if applicant is an honor graduate",
                        label:"Honor Grad.",
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
                        getPointsManually:function(mode = 0){
                            var value = (mode == 0 ? this.inputEx.getValue() : jobApplication[this.dbColName]);
                            var obj = (mode == 0 ? this.scoreSheetElement : this);

                            if (mode == 0)
                            {
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
                            }
    
                            return obj.score * value / (obj.weight < 0 ? 1 : obj.max / obj.weight);
                        }
                    },
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"performance",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"performance_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"performance_notes",dbTableName:"Job_Application",content:[],parentId:"performance",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 10 : (positionCategory == 2 || positionCategory == 3 && salaryGrade == 24 ? 25 : 20))),
                min:0,
                max:0,
                step:0,
                notesId:"performance_notes"
            },
            {
                id:"lept",
                type:"criteria1",
                label:"PBET/LET/LEPT Rating",
                dbColName:"lept",
                dbTableName:"",
                content:[
                    {id:"lept_rating",type:"input-number",label:"Applicant's PBET/LET/LEPT Rating",shortLabel:"LEPT Rating",dbColName:"lept_rating",dbTableName:"Job_Application",content:[],parentId:"lept",score:1,weight:(positionCategory == 1 ? 10 : 0),maxPoints:0,min:0,max:100,step:0.1},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"lept",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"lept_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"lept_notes",dbTableName:"Job_Application",content:[],parentId:"lept",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 10 : 0),
                maxPoints:(positionCategory == 1 ? 10 : 0),
                min:0,
                max:0,
                step:0,
                notesId:"lept_notes"
            },
            {
                id:"coi",
                type:"criteria1",
                label:"PPST Classroom Observable Indicators",
                sublabel:"Demonstration Teaching using COT-RSP",
                dbColName:"coi",
                dbTableName:"",
                content:[
                    {id:"ppstcoi",type:"input-number",label:"Applicant's COT Rating",shortLabel:"COT Rating",dbColName:"ppstcoi",dbTableName:"Job_Application",content:[],parentId:"coi",score:1,weight:(positionCategory == 1 ? 35 : 0),maxPoints:0,min:0,max:30,step:0.1},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"coi",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"coi_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"coi_notes",dbTableName:"Job_Application",content:[],parentId:"coi",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 35 : 0),
                maxPoints:(positionCategory == 1 ? 35 : 0),
                min:0,
                max:0,
                step:0,
                notesId:"coi_notes"
            },
            {
                id:"ncoi",
                type:"criteria1",
                label:"PPST Non-Classroom Observable Indicators",
                sublabel:"Teacher Reflection",
                dbColName:"ncoi",
                dbTableName:"",
                content:[
                    {id:"ppstncoi",type:"input-number",label:"Applicant's TRF Rating",shortLabel:"TRF Rating",dbColName:"ppstncoi",dbTableName:"Job_Application",content:[],parentId:"ncoi",score:1,weight:(positionCategory == 1 ? 25 : 0),maxPoints:0,min:0,max:20,step:0.1},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"ncoi",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"ncoi_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"ncoi_notes",dbTableName:"Job_Application",content:[],parentId:"ncoi",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 25 : 0),
                maxPoints:(positionCategory == 1 ? 25 : 0),
                min:0,
                max:0,
                step:0,
                notesId:"ncoi_notes"
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
                                    {id:"number_of_citation_movs",type:"input-number",label:"Number of letters of citation/commendation presented by applicant",dbColName:"number_of_citation_movs",dbTableName:"Job_Application",content:[],parentId:"citation",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1,getPointsManually:function(mode = 0){
                                        var value = (mode == 0 ? this.inputEx.getValue() : jobApplication[this.dbColName]);
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
                                    {id:"number_of_academic_award_movs",type:"input-number",label:"Number of award certificates/MOVs presented by applicant",dbColName:"number_of_academic_award_movs",dbTableName:"Job_Application",content:[],parentId:"academic_award",score:1,weight:-1,maxPoints:0,min:0,max:"ANY",step:1,getPointsManually:function(mode = 0){
                                        var value = (mode == 0 ? this.inputEx.getValue() : jobApplication[this.dbColName]);
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
                    },
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"accomplishments",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"accomplishments_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"accomplishments_notes",dbTableName:"Job_Application",content:[],parentId:"accomplishments",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 || (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23)? 5 : 10)),
                min:0,
                max:0,
                step:0,
                notesId:"accomplishments_notes"
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
                    },
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"educationApp",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"education_app_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"education_app_notes",dbTableName:"Job_Application",content:[],parentId:"educationApp",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                maxPoints:(positionCategory == 1 || positionCategory == 5 ? 0 : (positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10)),
                min:0,
                max:0,
                step:0,
                notesId:"education_app_notes"
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
                    },
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"trainingApp",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"training_app_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"training_app_notes",dbTableName:"Job_Application",content:[],parentId:"trainingApp",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                maxPoints:(positionCategory == 1 || positionCategory == 5 ? 0 : 10),
                min:0,
                max:0,
                step:0,
                notesId:"training_app_notes"
            },
            {
                id:"potential",
                type:"criteria1",
                label:"Potential",
                sublabel:"Written Test, BEI" + (positionCategory < 3 ? "" : ", Work Sample Test"),
                dbColName:"potential",
                dbTableName:"",
                content:[
                    // {id:"score_exam",type:"input-number",label:"Written Examination",shortLabel:"Exam",dbColName:"score_exam",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade < 20 ? 10 : 5))),maxPoints:0,min:0,max:100,step:0.1},
                    // {id:"score_skill",type:"input-number",label:"Skills or Work Sample Test",shortLabel:"Skills Test",dbColName:"score_skill",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory < 3 ? 0 : (positionCategory == 5 ? -1 : (positionCategory == 3 && salaryGrade == 24 ? 5 : 10))),maxPoints:0,min:0,max:100,step:0.1},
                    // {id:"score_bei",type:"input-number",label:"Behavioral Events Interview",shortLabel:"BEI",dbColName:"score_bei",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),maxPoints:0,min:0,max:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),step:0.1},
                    {id:"score_exam",type:"input-number",label:"Written Examination",shortLabel:"Exam",dbColName:"score_exam",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade < 20 ? 10 : 10))),maxPoints:0,min:0,max:100,step:0.1},
                    {id:"score_skill",type:"input-number",label:"Skills or Work Sample Test",shortLabel:"Skills Test",dbColName:"score_skill",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory < 3 ? 0 : (positionCategory == 5 ? -1 : (positionCategory == 3 && salaryGrade == 24 ? 0 : 0))),maxPoints:0,min:0,max:100,step:0.1},
                    {id:"score_bei",type:"input-number",label:"Behavioral Events Interview",shortLabel:"BEI",dbColName:"score_bei",dbTableName:"Job_Application",content:[],parentId:"potential",score:1,weight:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 10))),maxPoints:0,min:0,max:(positionCategory == 1 ? -1 : (positionCategory == 5 ? -1 : (positionCategory == 2 && salaryGrade >= 20 ? 10 : 10))),step:0.1},
                    {id:"",type:"line-break",label:"",dbColName:"",dbTableName:"",content:[],parentId:"potential",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0},
                    {id:"potential_notes",type:"textarea",label:"Relevant documents or requirements submitted/Other remarks",dbColName:"potential_notes",dbTableName:"Job_Application",content:[],parentId:"potential",score:0,weight:-1,maxPoints:0,min:0,max:0,step:0}
                ],
                parentId:null,
                score:0,
                weight:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                maxPoints:(positionCategory == 1 ? 0 : (positionCategory == 5 ? 55 : (positionCategory == 2 || (positionCategory == 3 && salaryGrade == 24) ? 15 : 20))),
                min:0,
                max:0,
                step:0,
                notesId:"potential_notes"
            },
        ];

        return criteria;
    }

    static getEducIncrements(educAttainment = 0, degreesTaken = [{degree_typeIndex:0,degree:"",year_level_completed:null,units_earned:null,complete_academic_requirements:null,graduation_year:null}])
    {
        // // OLD CODE FROM APPLICANT DATA FORM
        // var incrementObj = document.mpsEducIncrement.filter(increment=>{                    
        //     return educAttainment < 6 && increment["baseline_educational_attainment"] == educAttainment
        //     || educAttainment >= 6 && increment["baseline_educational_attainment"] == educAttainment
        //        && ((postGradUnits == null && (increment["baseline_postgraduate_units"] == null || increment["baseline_postgraduate_units"] == 0)) || (postGradUnits != null && increment["baseline_postgraduate_units"] <= postGradUnits))
        //        && ((completeAcadReq == null && (increment["complete_academic_requirements"] || increment["complete_academic_requirements"] == null)) || (completeAcadReq != null && increment["complete_academic_requirements"] == completeAcadReq));
        // });
        // var increment = (incrementObj.length > 0 ? incrementObj.slice(-1)[0]["education_increment_level"] : -1);

        // // OLD CODE FROM OLD SCORE SHEET
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

    static getEducScore(incrementAboveQS, positionCategory, salaryGrade)
    {
        // var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

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

        while (uBoundsExclusive[i] <= incrementAboveQS)
        {
            i++;
        }

        return scores[i];
    }

    static getTrainingScore(incrementAboveQS, positionCategory, salaryGrade)
    {
        // var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

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

        while (uBoundsExclusive[i] <= incrementAboveQS)
        {
            i++;
        }

        return scores[i];
    }

    static getWorkExpScore(incrementAboveQS, positionCategory, salaryGrade)
    {
        // var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

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

        while (uBoundsExclusive[i] <= incrementAboveQS)
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
            days += daysPerMonth[(end.m == 0 ? 11 : end.m - 1)] + (end.y % 4 == 0 && end.m >= 1 || start.y % 4 == 0 && start.m <= 1 ? 1 : 0); // also adjust for leap years
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
        return (duration == null || duration == undefined ? 0 : (typeof(duration) == "string" ? NaN : duration.y + duration.m / 12 + duration.d / 365.25));
    }

    static convertDurationToString(duration)
    {
        return (isNaN(duration.y) || isNaN(duration.m) || isNaN(duration.d) ? "Invalid date(s)" + (typeof(duration) == "string" ? "\n" + duration : "") : (duration.y > 0 ? duration.y + "&nbsp;year" + (duration.y == 1 ? "" : "s") : "") + (duration.m > 0 ? (duration.y > 0 ? ", " : "") + duration.m + "&nbsp;month" + (duration.m == 1 ? "" : "s") : "") + (duration.y + duration.m > 0 && duration.d != 0 ? ", " : "") + (duration.y + duration.m > 0 && duration.d == 0 ? "" : duration.d + "&nbsp;day" + (duration.d == 1 ? "" : "s")));
    }

    static validateEligibility(eligibilities = [], requiredEligibilities = [[]])
    {
        var isEligibleInAll = [], requiredEligibilitySet = null, csProEligs = [];

        for (const requiredEligibilitySetConst of requiredEligibilities) {
            var isEligibleInOne = false;
            requiredEligibilitySet = requiredEligibilitySetConst;

            for (const eligibility of eligibilities)
            {
                if (!Array.isArray(requiredEligibilitySet))
                {
                    var temp = [];
                    if (requiredEligibilitySet.eligibilityId != null)
                    {
                        temp.push(requiredEligibilitySet.eligibilityId);
                    }
                    if (requiredEligibilitySet.eligibilityId2 != null)
                    {
                        temp.push(requiredEligibilitySet.eligibilityId2);
                    }
                    if (requiredEligibilitySet.eligibilityId3 != null)
                    {
                        temp.push(requiredEligibilitySet.eligibilityId3);
                    }
                    requiredEligibilitySet = temp;
                }

                for (const requiredEligibility of requiredEligibilitySet) {
                    isEligibleInOne = isEligibleInOne || (!isEligibleInOne && requiredEligibility == 1); // CS Sub-Pro    
                    isEligibleInOne = isEligibleInOne || (!isEligibleInOne && requiredEligibility == 2 && eligibility >= 2); // CS Pro
                    isEligibleInOne = isEligibleInOne || (!isEligibleInOne && requiredEligibility == 3 && eligibility > 3 && !(csProEligs.includes(eligibility) || csProEligs.includes(eligibility.toString()))); // Any PRC License (MAY CAUSE ISSUES WHEN NEWLY ADDED ELIGIBILITIES ARE ONLY ON THE LEVEL OF CS PRO; TO AVOID, ADD TO csProElig ARRAY)
                    isEligibleInOne = isEligibleInOne || (!isEligibleInOne && requiredEligibility == eligibility); // exact PRC License
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

        // return (isEligibleInAll.length == 0 ? "Not Required" : (isEligibleInAll.reduce((eligValue, nextEligValue)=>(eligValue && nextEligValue)) ? "" : "Not ") + "Qualified");
        return (isEligibleInAll.length == 0 ? -1 : (isEligibleInAll.reduce((eligValue, nextEligValue)=>(eligValue && nextEligValue)) ? 1 : 0));
    };

    resetForm()
    {
        window.location.reload(true);
    }
}

class IERForm extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-ier"], id, useFormElement);
        this.app = app;

        var posInfo = null, thisIERForm = this;
        
        this.container.classList.add("ier-form");

        this.setTitle("Initial Evaluation Result (IER)", 2);
        // this.setFullWidth();

        this.fetchedApplications = null; // variable to hold the fetched job applications data
        this.rowData = [];

        posInfo = this.addBox("ier-position-info", false);
        posInfo.classList.add("ier-position-info");

        [
            {id:"ier-position", label:"Position"},
            {id:"ier-position-salary-grade", label:"Salary Grade and Monthly Salary"},
            {id:"ier-position-qs", label:"Qualification Standards"}
        ].forEach(field=>{
            posInfo.appendChild(this.addDisplayEx("div", field.id, "", field.label).container);
            this.displayExs[field.id].container.classList.add(field.id);
            // this.displayExs[field.id].setFullWidth();
            this.displayExs[field.id].showColon();
        });

        this.addInputEx("Select Position", "button", "", "", "ier-select-position-button");
        this.displayExs["ier-position"].addContent(this.dbInputEx["ier-select-position-button"].container);

        [
            {id:"ier-position-qs-education", label:"Education"},
            {id:"ier-position-qs-training", label:"Training"},
            {id:"ier-position-qs-experience", label:"Experience"},
            {id:"ier-position-qs-eligibility", label:"Eligibility"}
        ].forEach(field=>{
            this.displayExs["ier-position-qs"].addContent(this.addDisplayEx("div", field.id, "", field.label).container);
        });

        posInfo.appendChild(this.addInputEx("Hide personal data", "checkbox", "", "Hide personal data", "ier-hide-personal-data").container);
        [this.dbInputEx["ier-hide-personal-data"]].forEach(field=>{
            field.container.classList.add("ier-hide-personal-data");
            field.check();
            field.reverse();
            field.addEvent("change", hidePersonalDataEvent=>{
                this.displayExs["ier-table"].container.classList.toggle("hide-personal-data", field.isChecked());
            });
        });

        this.addDisplayEx("div-table", "ier-table");
        this.displayExs["ier-table"].container.classList.add("ier-table");
        this.displayExs["ier-table"].container.classList.add("hide-personal-data");
        this.displayExs["ier-table"].setHeaders([
            {colHeaderName:"row_number", colHeaderText:"No."},
            {colHeaderName:"application_code", colHeaderText:"Application Code"},
            {colHeaderName:"applicant_name", colHeaderText:"Names of Applicant"},
            {colHeaderName:"address", colHeaderText:"Address"}, // multiple/custom
            {colHeaderName:"age", colHeaderText:"Age"},
            {colHeaderName:"sex", colHeaderText:"Sex"},
            {colHeaderName:"civil_status", colHeaderText:"Civil Status"},
            {colHeaderName:"religion", colHeaderText:"Religion"},
            {colHeaderName:"disability", colHeaderText:"Disability"}, // multiple/custom
            {colHeaderName:"ethnic_group", colHeaderText:"Ethnic Group"},
            {colHeaderName:"email_address", colHeaderText:"Email Address"}, // multiple/custom
            {colHeaderName:"contact_number", colHeaderText:"Contact No."}, // multiple/custom
            {colHeaderName:"education", colHeaderText:"Education"}, // multiple/custom
            {colHeaderName:"training_title", colHeaderText:"Title"}, // multiple/custom
            {colHeaderName:"training_hours", colHeaderText:"Hours"}, // multiple/custom
            {colHeaderName:"experience_details", colHeaderText:"Details"}, // multiple/custom
            {colHeaderName:"experience_years", colHeaderText:"Years"}, // multiple/custom
            {colHeaderName:"eligibility", colHeaderText:"Eligibility"}, // multiple/custom
            {colHeaderName:"remarks", colHeaderText:"Remarks (Qualified or Disqualified)"} // multiple/custom
        ]);

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

        this.dbInputEx["ier-select-position-button"].addEvent("click", clickEvent=>{
            var selectPositionDialog = new PositionSelectorDialog(this.app, "car-position-selector", [
                {label:"Select", tooltip:"Load selected position", callbackOnClick:positionSelectEvent=>{
                    var positionTitle = selectPositionDialog.formEx.dbInputEx["selected-position"].getValue().trim();
                    var parenPositionTitle = selectPositionDialog.formEx.dbInputEx["selected-paren-position"].getValue().trim();
                    var plantilla = selectPositionDialog.formEx.dbInputEx["selected-plantilla"].getValue().trim();
                    var positionString = positionTitle + (parenPositionTitle == "" ? " " : " (" + parenPositionTitle + ")") + (plantilla == "" ? " " : " [<i>Plantilla Item No. " + plantilla + "</i>] ");
    
                    this.dbInputEx["ier-select-position-button"].container.remove();
                    this.displayExs["ier-position"].setHTMLContent(positionString);
                    this.displayExs["ier-position"].addContent(this.dbInputEx["ier-select-position-button"].container);
                    
                    var position = document.positions.filter(position=>((position["parenthetical_title"] == parenPositionTitle || plantilla == "ANY" || plantilla == "") && position["position_title"] == positionTitle || position["plantilla_item_number"] == plantilla))[0];
                    
                    this.displayExs["ier-position-salary-grade"].setHTMLContent("SG-" + position["salary_grade"] + " (" + Intl.NumberFormat("en-PH", {style: "currency", currency: "PHP", maximumFractionDigits: 2, roundingIncrement: 5}).format(parseFloat(document.salaryGrade.filter(sg=>sg["salary_grade"] == position["salary_grade"] && sg["step_increment"] == 1)[0]["salary"])) + ")");
                    
                    var eligString = "";
                    
                    position["required_eligibility"].forEach(eligSet=>{
                        eligString += (eligSet["eligibility"] == null || eligSet["eligibility"] == "" ? "" : (eligString.trim() == "" ? "" : "; ") + eligSet["eligibility"]);
                        eligString += (eligSet["eligibility2"] == null || eligSet["eligibility2"] == "" ? "" : (eligString.trim() == "" ? "" : "/") + eligSet["eligibility2"]);
                        eligString += (eligSet["eligibility3"] == null || eligSet["eligibility3"] == "" ? "" : (eligString.trim() == "" ? "" : "/") + eligSet["eligibility3"]);
                    });
    
                    // this.displayExs["ier-position-qs-education"].setHTMLContent("<b>" + document.enumEducationalAttainment.find(educAttainment=>educAttainment["index"] == position["required_educational_attainment"])["educational_attainment"] + (position["specific_education_required"] == null || position["specific_education_required"] == "" ? "" : " (" + position["specific_education_required"] + ")") + "</b>");
                    // this.displayExs["ier-position-qs-training"].setHTMLContent("<b>" + (position["required_training_hours"] <= 0 ? "None required" : position["required_training_hours"] + (position["required_training_hours"] == 1 ? " hour" : " hours") + " of relevant training") + (position["specific_training_required"] == null || position["specific_training_required"] == "" ? "" : " (" + position["specific_training_required"] + ")") + "</b>");
                    // this.displayExs["ier-position-qs-experience"].setHTMLContent("<b>" + (position["required_work_experience_years"] <= 0 ? "None required" : position["required_work_experience_years"] + (position["required_work_experience_years"] == 1 ? " year" : " years") + " of relevant experience") + (position["specific_work_experience_required"] == null || position["specific_work_experience_required"] == "" ? "" : " (" + position["specific_work_experience_required"] + ")") + "</b>");
                    [
                        {id:"ier-position-qs-education", text:(position["specific_education_required"] == null || position["specific_education_required"] == "" ? document.enumEducationalAttainment.find(educAttainment=>educAttainment["index"] == position["required_educational_attainment"])["educational_attainment"] : position["specific_education_required"])},
                        {id:"ier-position-qs-training", text:(position["required_training_hours"] <= 0 ? "None required" : (position["specific_training_required"] == null || position["specific_training_required"] == "" ? position["required_training_hours"] + (position["required_training_hours"] == 1 ? " hour" : " hours") + " of relevant training" : position["specific_training_required"]))},
                        {id:"ier-position-qs-experience", text:(position["required_work_experience_years"] <= 0 ? "None required" : (position["specific_work_experience_required"] == null || position["specific_work_experience_required"] == "" ? position["required_work_experience_years"] + (position["required_work_experience_years"] == 1 ? " year" : " years") + " of relevant experience" : position["specific_work_experience_required"]))},
                        {id:"ier-position-qs-eligibility",text:eligString}
                    ].forEach(obj=>{
                        this.displayExs[obj.id].setHTMLContent(obj.text);
                        this.displayExs[obj.id].container.title = obj.text;
                    });
                    
                    postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=applicationsByPosition" + (positionTitle == "" ? "" : "&positionTitle=" + positionTitle) + (parenPositionTitle == "" ? "" : "&parenTitle=" + parenPositionTitle) + (plantilla == "" || plantilla == "ANY" ? "" : "&plantilla=" + plantilla), fetchJobApplicationsEvent=>{
                        var response = null, rows = [], row = null, isQualified = true;
    
                        if (fetchJobApplicationsEvent.target.readyState == 4 && fetchJobApplicationsEvent.target.status == 200)
                        {
                            response = JSON.parse(fetchJobApplicationsEvent.target.responseText);
    
                            // console.log(response);
        
                            if (response.type == "Error")
                            {
                                new MsgBox(thisIERForm.container, response.content, "Close");
                            }
                            else if (response.type == "Data")
                            {
                                thisIERForm.fetchedApplications = JSON.parse(response.content);
    
                                // console.log(thisIERForm.fetchedApplications);
    
                                this.displayExs["ier-table"].removeAllRows();
    
                                for (const jobApplication of thisIERForm.fetchedApplications)
                                {
                                    isQualified = true;
                                    row = {};
                                
                                    for (const key in jobApplication)
                                    {
                                        switch (key)
                                        {
                                            case "degree_taken":
                                            case "permanent_address":
                                                // DO NOTHING
                                                break;
                                            case "present_address":
                                                row["address"] = jobApplication["present_address"] ?? jobApplication["permanent_address"] ?? "";
                                                break;
                                            case "disability":
                                            case "email_address":
                                            case "contact_number":
                                                row[key] = (jobApplication[key].length > 0 ? jobApplication[key].map(obj=>obj[key]).join("; ") : "");
                                                break;
                                            case "educational_attainment":
                                                if (jobApplication["degree_taken"].length > 0)
                                                {
                                                    row["education"] = "<ul>\n";
                                                    
                                                    for (const degree of jobApplication["degree_taken"])
                                                    {
                                                        row["education"] += "<li>" + MPASIS_App.convertDegreeObjToStr(degree) + "</li>\n";
                                                    }
    
                                                    row["education"] += "</ul>\n";
                                                }
                                                else
                                                {
                                                    row["education"] = jobApplication[key];
                                                }
    
                                                isQualified &&= (ScoreSheet.getEducIncrements(jobApplication["educational_attainmentIndex"], jobApplication["degree_taken"]) >= ScoreSheet.getEducIncrements(position["required_educational_attainment"], []));
                                                isQualified &&= (position["specific_education_required"] == null || jobApplication["has_specific_education_required"] != 0 || jobApplication["has_specific_education_required"]);
                                                break;
                                            case "relevant_training":
                                                var totalHours = 0;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    row["training_title"] = "<ul>\n";
                                                    
                                                    for (const relevantTraining of jobApplication[key])
                                                    {
                                                        row["training_title"] += "<li>" + relevantTraining["descriptive_name"] + " (" + relevantTraining["hours"] + (relevantTraining["hours"] == 1 ? " hour" : " hours") + ")</li>\n";
                                                        totalHours += (relevantTraining["hours"] ?? 0);
                                                    }
    
                                                    row["training_title"] += "</ul>\n";
                                                    row["training_hours"] = "Total hours of training: " + totalHours + (totalHours == 1 ? "\xA0hour" : "\xA0hours");
                                                }
                                            
                                                isQualified &&= (Math.trunc(totalHours / 8) + 1 >= Math.trunc(position["required_training_hours"] / 8) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (position["specific_training_required"] == null || jobApplication["has_specific_training"] != 0 || jobApplication["has_specific_training"]);
                                                isQualified &&= (totalHours >= position["required_training_hours"]);
                                                break;
                                            case "relevant_work_experience":
                                                var totalDuration = null, duration = null;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    row["experience_details"] = "<ul>\n";
                                                    
                                                    for (const relevantWorkExp of jobApplication[key])
                                                    {
                                                        duration = ScoreSheet.getDuration(relevantWorkExp["start_date"], relevantWorkExp["end_date"] ?? MPASIS_App.defaultEndDate);
                                                        row["experience_details"] += "<li>" + relevantWorkExp["descriptive_name"] + " (" + ScoreSheet.convertDurationToString(duration) + ")</li>\n";
                                                        totalDuration = (totalDuration == null ? duration : ScoreSheet.addDuration(totalDuration, duration));
                                                    }
    
                                                    row["experience_details"] += "</ul>\n";
                                                    row["experience_years"] = ScoreSheet.convertDurationToString(totalDuration);
                                                }
                                                
                                                isQualified &&= (Math.trunc(ScoreSheet.convertDurationToNum(totalDuration) * 12 / 6) + 1 >= Math.trunc(position["required_work_experience_years"] * 12 / 6) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (position["specific_work_experience_required"] == null || jobApplication["has_specific_work_experience"] != 0 || jobApplication["has_specific_work_experience"]);
                                                break;
                                            case "relevant_eligibility":
                                                if (jobApplication[key].length > 0)
                                                {
                                                    row["eligibility"] = "<ul>\n";
    
                                                    for (const relevantEligibility of jobApplication[key])
                                                    {
                                                        row["eligibility"] += "<li>" + (relevantEligibility["eligibility_abbrev"] != null && type(relevantEligibility["eligibility_abbrev"]) == "string" && relevantEligibility["eligibility_abbrev"].trim() != "" ? relevantEligibility["eligibility_abbrev"] : relevantEligibility["eligibility"]) + "</li>\n";
                                                    }
    
                                                    row["eligibility"] += "</ul>\n";
                                                }
    
                                                var valElig = ScoreSheet.validateEligibility(jobApplication[key].map(elig=>elig.eligibilityId), position["required_eligibility"]);
    
                                                isQualified &&= (valElig != 0);
                                                break;
                                            default:
                                                row[key] = jobApplication[key];
                                                break;
                                        }                                    
                                    }
    
                                    row["remarks"] = (isQualified ? "Qualified" : "Disqualified");
                                    
                                    rows.push(row);
    
                                    row["row_number"] = this.displayExs["ier-table"].rows.length + 1;
    
                                    this.displayExs["ier-table"].addRow(row);
                                }
                            }
                            // else if (response.type == "Success")
                            // {
                            //     new MsgBox(thisIERForm.container, response.content, "OK");
                            // }
                            else if (response.type == "Debug")
                            {
                                new MsgBox(thisIERForm.container, response.content, "OK");
                                console.log(response.content);
                            }
                        }
                    });
    
                    selectPositionDialog.close();
                }},
                {label:"Cancel", tooltip:"Close dialog", callbackOnClick:positionSelectEvent=>selectPositionDialog.close()}
            ]);
        });

        this.addInputEx("Print", "buttonEx", "Print", "Print the Initial Evaluation Result form", "ier-print-button");

        this.dbInputEx["ier-print-button"].addEvent("click", this.generatePrinterFriendly);

        this.dbInputEx["ier-select-position-button"].fields[0].click();
    }

    generatePrinterFriendly(ierPrintClickEvent)
    {
        var thisIERForm = ierPrintClickEvent.target.inputEx.parentFormEx, ierForPrint = window.open("", "_blank");

        var nodeDoctype = ierForPrint.document.implementation.createDocumentType("html", "", "");
        if(ierForPrint.document.doctype) {
            ierForPrint.document.replaceChild(nodeDoctype, ierForPrint.document.doctype);
        } else {
            ierForPrint.document.insertBefore(nodeDoctype, ierForPrint.document.childNodes[0]);
        }
        ierForPrint.document.title = "Initial Evaluation Report (IER) [printer-friendly version]";
        ierForPrint.document.body.classList.add("print");

        createElementEx(NO_NS, "base", ierForPrint.document.head, null, "href", window.location.origin);

        [
            "/styles/default.css",
            "/styles/main.css",
            "/styles/ExClass.css",
            "/styles/print.css",
            "/styles/material.io/material-icons.css",
            "/mpasis/styles/main.css",
            "/mpasis/styles/print.css"
        ].forEach(cssURL=>{
            ierForPrint.document.head.appendChild(htmlToElement("<link href=\"" + cssURL + "\" type=\"text/css\" rel=\"stylesheet\">"));
        });

        
        var ierFormClone = thisIERForm.container.cloneNode(true);
        ierForPrint.document.body.appendChild(ierFormClone);

        var ierFormCloneFields = ierFormClone.querySelector(".fields");

        var signatory = new DisplayEx(ierFormCloneFields, "div", "ier-printout-signatory", "", "Prepared and certified correct by");
        signatory.showColon();
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        htmlToElements("<div class=\"name\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : document.hrRoles["hrmo"]["name"]) + "</div> <div class=\"position\">Human Resource Management Officer</div> <div class=\"date\"></div>").forEach(node=>{
            signatory.addContent(node);
            signatory.addContent(document.createTextNode(" "));
            if (node.classList.contains("name") || node.classList.contains("date"))
            {
                node.addEventListener("dblclick", fieldModeChange);
                node.title = "Please double-click to edit.";
            }
        });
        signatory.container.classList.add("ier-printout-signatory");

        var instructions = new DisplayEx(ierFormCloneFields, "div", "ier-printout-instructions", "", "Notes and Instructions for the HRMO");
        instructions.container.classList.add("ier-printout-instructions");
        instructions.showColon();

        [createElementEx(NO_NS, "ol", instructions.content)].forEach(list=>{
            [
                "For the purpose of posting the IER, <b>columns D to M</b> shall be concealed in accordance with RA No. 10163 (Data Privacy Act). The only information that shall be made public are the application codes, qualifications of the applicants in terms of Education, Training, Experience, Eligibility, and Competency (if applicable), and remark on whether Qualified or Disqualified.",
                "If the information does not apply to the applicant, please put N/A."
            ].forEach(itemText=>{
                list.appendChild(htmlToElement("<li>" + itemText + "</li>"));
            });
        });

        ierForPrint.document.getElementById("ier-form-input-ex0").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW IER IS CODED
        ierForPrint.document.getElementById("ier-form-input-ex1").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW IER IS CODED
        ierForPrint.document.getElementById("ier-form-input-ex2").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW IER IS CODED

        var printButtonGroup = new InputEx(null, "print-ier-controls", "buttonExs");
        ierForPrint.document.body.insertBefore(printButtonGroup.container, ierForPrint.document.body.children[0]);
        printButtonGroup.container.classList.add("print-controls");
        printButtonGroup.addItem("<span class=\"material-icons-round green\">print</span>", "", "Print").addEvent("click", clickPrintEvent=>{ierForPrint.print()});
        printButtonGroup.addItem("<span class=\"material-symbols-rounded red\">tab_close</span>", "", "Close Tab/Window").addEvent("click", clickPrintEvent=>{ierForPrint.close()});

        ierForPrint.alert("Please click on the print button to continue");
    }
}

class IESForm extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-ies"], id, useFormElement);
        this.app = app;
        this.container.classList.add("ies-form");

        this.setTitle("Individual Evaluation Sheet (IES)", 2);

        this.jobApplication = null;
        this.position = null;
        this.scoreSheetElements = [];

        this.loadButton = this.addInputEx("Load Application", "buttonEx");
        this.loadButton.container.classList.add("ies-load-application");
        this.loadButton.addEvent("click", this.loadApplicationBtn_Click);
        this.loadButton.setStatusMsgTimeout(-1);
        this.loadButton.showInfo("Click to begin");

        this.loadButton.fields[0].click();
    }

    loadApplicationBtn_Click(event) // inherits the scope of the clicked button/element
    {
        var iesForm = null, clickedElement = null, div = null, retrieveApplicantDialog = null;

        iesForm = this.inputEx.parentFormEx;
        clickedElement = this; //event.srcElement; // event.target;

        this.inputEx.resetStatus();

        if (this.innerHTML == "Load Application")
        {
            retrieveApplicantDialog = new JobApplicationSelectorDialog(iesForm.app, "ies-job-application-selector-dialog", [
                {label:"Load", tooltip:"Load selected", callbackOnClick:event=>{
                    var searchResult = retrieveApplicantDialog.getApplicantListBox();

                    retrieveApplicantDialog.formEx.setStatusMsgTimeout(-1);
                    retrieveApplicantDialog.formEx.showWait("Loading");

                    iesForm.app.showScrim();

                    iesForm.jobApplication = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0];

                    var filteredPositions = document.positions.filter(position=>{
                        return position["plantilla_item_number"] == iesForm.jobApplication["plantilla_item_number_applied"]
                        || (position["parenthetical_title"] == iesForm.jobApplication["parenthetical_title_applied"] && position["position_title"] == iesForm.jobApplication["position_title_applied"])
                        || position["position_title"] == iesForm.jobApplication["position_title_applied"];
                    });

                    iesForm.position = (filteredPositions.length > 0 ? filteredPositions[0] : null);

                    if (!("applicantInfo" in iesForm.displayExs))
                    {
                        div = iesForm.addDisplayEx("div", "applicantInfo");
                        div.container.classList.add("applicant-info");
    
                        console.log(iesForm.jobApplication);

                        [
                            {colName:"application_code", label:"Application Code"},
                            {colName:"applicant_name", label:"Name of Applicant"},
                            {colName:"position_title_applied", label:"Position Applied For"},
                            {colName:"place_of_assignment", label:(iesForm.position["position_categoryId"] == 1 ? "Schools Division " : "") + "Office"},
                            {colName:"contact_number", label:"Contact Number"},
                            {colName:"job_group_salary_grade", label:"Job Group/SG-Level"}
                        ].forEach(obj=>{
                            if (obj == "")
                            {
                                div.addLineBreak();
                                return;
                            }
                            var displayEx = iesForm.addDisplayEx("div", obj.colName, (obj.colName in iesForm.jobApplication ? iesForm.jobApplication[obj.colName] : ""), obj.label);
                            div.addContent(displayEx.container);
                            displayEx.showColon();
                            displayEx.container.classList.add(obj.colName);
                            if (obj.colName == "place_of_assignment" && iesForm.position["position_categoryId"] == 1)
                            {
                                displayEx.container.classList.add("sdo");
                            }
                        });
                    }

                    iesForm.displayExs["place_of_assignment"].setHTMLContent(iesForm.position["place_of_assignment"]);
                    iesForm.displayExs["contact_number"].setHTMLContent(iesForm.jobApplication["contact_number"].length > 0 ? iesForm.jobApplication["contact_number"].map(num=>num["contact_number"]).reduce((prev, next)=>prev + "; " + next) : "");
                    iesForm.displayExs["job_group_salary_grade"].setHTMLContent(document.positionCategory.filter(cat=>cat["position_categoryId"] == iesForm.position["position_categoryId"])[0]["position_category"] + " / SG-" + iesForm.position["salary_grade"]);
            
                    iesForm.addDisplayEx("div-table", "ies_table");

                    iesForm.displayExs["ies_table"].container.classList.add("ies-table");
                    
                    iesForm.displayExs["ies_table"].setHeaders([
                        {colHeaderName:"ies_criteria", colHeaderText:"Criteria"},
                        {colHeaderName:"ies_weight", colHeaderText:"Weight Allocation"},
                        {colHeaderName:"ies_details", colHeaderText:"Details of Applicant's Qualifications<br> <span class=\"subhead\">(Relevant documents submitted; additional requirements; notes of HRMPSB Members)</span>"},
                        {colHeaderName:"ies_computation", colHeaderText:"Computation"},
                        {colHeaderName:"ies_score", colHeaderText:"Actual Score"},
                    ]);

                    iesForm.displayExs["ies_table"].thead.insertBefore(htmlToElement("<tr></tr>"), iesForm.displayExs["ies_table"].thead.children[0]);
                    iesForm.displayExs["ies_table"].thead.children[1].children[0].setAttribute("rowspan", 2);
                    iesForm.displayExs["ies_table"].thead.children[0].appendChild(iesForm.displayExs["ies_table"].thead.children[1].children[0]);
                    iesForm.displayExs["ies_table"].thead.children[1].children[0].setAttribute("rowspan", 2);
                    iesForm.displayExs["ies_table"].thead.children[0].appendChild(iesForm.displayExs["ies_table"].thead.children[1].children[0]);
                    iesForm.displayExs["ies_table"].thead.children[0].appendChild(htmlToElement("<th colspan=\"3\">Applicant's Actual Qualifications</th>"));

                    [
                        {footerName:"total_label", footerText:"Total"},
                        {footerName:"weight_allocation_total", footerText:""},
                        {footerName:"", footerText:""},
                        {footerName:"", footerText:""},
                        {footerName:"total_score", footerText:""},
                    ].forEach(footer=>{
                        iesForm.displayExs["ies_table"].addFooter(footer.footerName, footer.footerText);
                    });

                    iesForm.displayExs["ies_table"].isHeaderCustomized = true;

                    iesForm.scoreSheetElements = ScoreSheet.getScoreSheetElements(iesForm.position, iesForm.jobApplication);

                    var totalWeight = 0;
                    var totalScore = 0;

                    for (const criteria of iesForm.scoreSheetElements)
                    {
                        if (criteria.weight != 0 && criteria.id != "summary")
                        {
                            var score = (MPASIS_App.isDefined(criteria.getPointsManually) ? criteria.getPointsManually(1) : IESForm.getPoints(criteria, iesForm.jobApplication));
                            totalScore += score;
                            totalWeight += criteria.weight;

                            iesForm.displayExs["ies_table"].addRow({
                                "ies_criteria":criteria.label + ("sublabel" in criteria ? (iesForm.position["position_categoryId"] == 1 ? "<br>" : "") + " <i>(" + criteria.sublabel + ")</i>" : ""),
                                "ies_weight":criteria.weight,
                                "ies_details":iesForm.jobApplication[criteria.notesId],
                                "ies_computation":IESForm.getComputationString(criteria, iesForm.jobApplication).replace(/(?:<br><br><br><br>)+/, "<br><br>").replace(/^(?:<br>)+/, ""),
                                "ies_score":score.toFixed(3)
                            });
                        }
                    }

                    iesForm.displayExs["ies_table"].fRows[0].data["weight_allocation_total"] = totalWeight;
                    iesForm.displayExs["ies_table"].fRows[0].td["weight_allocation_total"].innerHTML = totalWeight;
                    iesForm.displayExs["ies_table"].fRows[0].data["total_score"] = totalScore.toFixed(3);
                    iesForm.displayExs["ies_table"].fRows[0].td["total_score"].innerHTML = totalScore.toFixed(3);


                    iesForm.addInputEx("Print", "buttonEx", "Print", "Print the Individual Evaluation Sheet form", "ies-print-button");
                    iesForm.dbInputEx["ies-print-button"].addEvent("click", iesForm.generatePrinterFriendly);

                    retrieveApplicantDialog.close();
                    this.innerHTML = "Reset IES Form";

                    iesForm.app.closeScrim();
                }},
                {label:"Cancel", tooltip:"Close dialog", callbackOnClick:event=>{
                    retrieveApplicantDialog.close();
                }}
            ]);

            retrieveApplicantDialog.getDialogButton(0).disable();

            ["change", "keydown", "keyup", "keypress"].forEach(eventType=>{
                retrieveApplicantDialog.getApplicantQueryBox().addEvent(eventType, event=>retrieveApplicantDialog.getDialogButton(0).disable());
            });

            retrieveApplicantDialog.getApplicantListBox().addEvent("click", selectOptionEvent=>{
                retrieveApplicantDialog.getDialogButton(0).enable();
            });
        }
        else if (this.innerHTML == "Reset IES Form")
        {
            iesForm.app.showScrim();

            iesForm.resetForm();

            this.innerHTML = "Load Application";
        }
    }

    static getPoints(criteria, jobApplication){
        var points = 0;

        switch (criteria.type)
        {
            case "":
                break;
            case "input-number":
            case "input-radio-select":
                if (MPASIS_App.isDefined(criteria.getPointsManually))
                {
                    points = criteria.getPointsManually(1);
                }
                else
                {
                    points = criteria.score * (jobApplication[criteria.dbColName] ?? 0) / (criteria.weight < 0 ? 1 : criteria.max / criteria.weight);
                }
                if (points < 0)
                {
                    points = 0;
                }
                break;
            case "criteria1":
            case "criteria2":
            case "criteria3":
            case "criteria4":
                if (type(criteria.getPointsManually) == "function")
                {
                    points = criteria.getPointsManually(1);
                    if (criteria.maxPoints > 0 && points > criteria.maxPoints)
                    {
                        points = criteria.maxPoints;
                    }
                }
                else
                {
                    for (const subcriteria of criteria.content)
                    {
                        points += IESForm.getPoints(subcriteria, jobApplication);
                        if (criteria.maxPoints > 0 && points > criteria.maxPoints)
                        {
                            points = criteria.maxPoints;
                        }
                    }
                }
                break;
            default:
                break;
        }

        return points;
    }

    static getComputationString(criteria, jobApplication){
        var computationString = "";
        var points = 0;

        switch (criteria.type)
        {
            case "":
                break;
            case "input-number":
            case "input-radio-select":
                if (MPASIS_App.isDefined(criteria.getComputationStringManually) && type(criteria.getComputationStringManually) == "function")
                {
                    points = criteria.getPointsManually(1);
                    computationString = criteria.getComputationStringManually(1);
                }
                else if (criteria.weight > 0 && criteria.score > 0)
                {
                    points = IESForm.getPoints(criteria, jobApplication);
                    computationString = ("shortLabel" in criteria ? criteria.shortLabel : criteria.label) + ": " + (criteria.score == 1 ? "" : criteria.score + " &times;&nbsp;") + (jobApplication[criteria.dbColName] ?? 0) + " &divide;&nbsp;" + criteria.max + " &times;&nbsp;" + criteria.weight + " =&nbsp;" + (points == 0 ? points : points.toFixed(4));
                }
                if (points < 0)
                {
                    computationString += " (reset to 0)";
                }
                break;
            case "criteria1":
            case "criteria2":
            case "criteria3":
            case "criteria4":
                if (type(criteria.getComputationStringManually) == "function")
                {
                    points = criteria.getPointsManually(1);
                    computationString = criteria.getComputationStringManually(1);
                    if (criteria.maxPoints > 0 && points > criteria.maxPoints && criteria.weight < 0)
                    {
                        computationString += " (reset to " + criteria.maxPoints + " max)";
                    }
                }
                else
                {
                    for (const subcriteria of criteria.content)
                    {
                        points += IESForm.getPoints(subcriteria, jobApplication);
                        if (subcriteria.weight > 0)
                        {
                            computationString += IESForm.getComputationString(subcriteria, jobApplication);
                        }
                    }

                    if (criteria.maxPoints > 0 && points > criteria.maxPoints)
                    {
                        computationString += " (reset to " + criteria.maxPoints + " max)";
                    }
                }
                break;
            default:
                break;
        }

        return (computationString.trim() == "" ? "" : "<br><br>" + computationString);
    }

    resetForm()
    {
        window.location.reload(true);
    }

    generatePrinterFriendly(iesPrintClickEvent)
    {
        var thisIESForm = iesPrintClickEvent.target.inputEx.parentFormEx, iesForPrint = window.open("", "_blank");
        
        var nodeDoctype = iesForPrint.document.implementation.createDocumentType("html", "", "");
        if(iesForPrint.document.doctype) {
            iesForPrint.document.replaceChild(nodeDoctype, iesForPrint.document.doctype);
        } else {
            iesForPrint.document.insertBefore(nodeDoctype, iesForPrint.document.childNodes[0]);
        }
        iesForPrint.document.title = "Individual Evaluation Sheet (IES) [printer-friendly version]";
        iesForPrint.document.body.classList.add("print");
        
        createElementEx(NO_NS, "base", iesForPrint.document.head, null, "href", window.location.origin);
        
        [
            "/styles/default.css",
            "/styles/main.css",
            "/styles/ExClass.css",
            "/styles/print.css",
            "/styles/material.io/material-icons.css",
            "/mpasis/styles/main.css",
            "/mpasis/styles/print.css"
        ].forEach(cssURL=>{
            iesForPrint.document.head.appendChild(htmlToElement("<link href=\"" + cssURL + "\" type=\"text/css\" rel=\"stylesheet\">"));
        });
        
        var iesFormClone = thisIESForm.container.cloneNode(true);
        iesForPrint.document.body.appendChild(iesFormClone);
        
        var iesFormCloneFields = iesFormClone.querySelector(".fields");

        var conforme = new DisplayEx(iesFormCloneFields, "div", "ies-printout-conforme", "", "");
        conforme.setHTMLContent("<p>I hereby attest to the coduct of the application and assessment process in accordance with the applicable&nbsp;guidelines; and acknowledge, upon discussion with the Human Reource Merit Promotion and Selection Board (HRMPSB), the results of the comparative assessment and the points given to me based on my qualifications and submitted documentary requirements for the <strong>" + thisIESForm.displayExs["position_title_applied"].getHTMLContent() + "</strong> under <strong>" + (thisIESForm.displayExs["place_of_assignment"].getHTMLContent() == "" ? "__________" : thisIESForm.displayExs["place_of_assignment"].getHTMLContent()) +".</strong></p>" + " <p>Furthermore, I hereby affix my signature in this Form to attest to the objective and judicious conduct of the HRMPSB evaluation through Open Ranking System.</p>");
        conforme.container.classList.add("ies-printout-conforme");
        
        var signatoryApplicant = new DisplayEx(iesFormCloneFields, "div", "ies-printout-signatory-applicant", "", "");
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        htmlToElements("<div class=\"name\">" + MPASIS_App.getFullName(thisIESForm.jobApplication["given_name"], thisIESForm.jobApplication["middle_name"], thisIESForm.jobApplication["family_name"], thisIESForm.jobApplication["spouse_name"], thisIESForm.jobApplication["ext_name"]) + "</div> <div class=\"date\"></div>").forEach(node=>{
            signatoryApplicant.addContent(node);
            signatoryApplicant.addContent(document.createTextNode(" "));
            if (node.classList.contains("name"))
            {
                node.addEventListener("dblclick", fieldModeChange);
                node.title = "Please double-click to edit.";
            }
        });
        signatoryApplicant.container.classList.add("ies-printout-signatory-applicant");

        var signatoryHRMPSBChair = new DisplayEx(iesFormCloneFields, "div", "ies-printout-signatory-hrmpsb", "", "Attested");
        signatoryHRMPSBChair.showColon();
        htmlToElements("<div class=\"name\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : document.hrRoles["hrmpsb_chair"]["name"]) + "</div> <div class=\"date\"></div>").forEach(node=>{
            signatoryHRMPSBChair.addContent(node);
            signatoryHRMPSBChair.addContent(document.createTextNode(" "));
            if (node.classList.contains("name"))
            {
                node.addEventListener("dblclick", fieldModeChange);
                node.title = "Please double-click to edit.";
            }
        });
        signatoryHRMPSBChair.container.classList.add("ies-printout-signatory-hrmpsb");

        iesForPrint.document.getElementById("ies-form-input-ex0").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW IES IS CODED
        iesForPrint.document.getElementById("ies-form-input-ex1").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW IES IS CODED
        
        var printButtonGroup = new InputEx(null, "print-ies-controls", "buttonExs");
        iesForPrint.document.body.insertBefore(printButtonGroup.container, iesForPrint.document.body.children[0]);
        printButtonGroup.container.classList.add("print-controls");
        printButtonGroup.addItem("<span class=\"material-icons-round green\">print</span>", "", "Print").addEvent("click", clickPrintEvent=>{iesForPrint.print()});
        printButtonGroup.addItem("<span class=\"material-symbols-rounded red\">tab_close</span>", "", "Close Tab/Window").addEvent("click", clickPrintEvent=>{iesForPrint.close()});

        iesForPrint.alert("Please click on the print button to continue");
    }
}

class CARForm extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        var posInfo = null, thisCARForm = null;

        super(app.mainSections["main-car"], id, useFormElement);
        this.app = app;
        thisCARForm = this;

        this.container.classList.add("car-form");

        this.setTitle("Comparative Assessment Result (CAR)", 2);

        this.position = null;
        this.positions = [];
        this.jobApplications = [];
        this.scoreSheetElements = [];
        this.carTable = null;

        this.addInputEx("Select Position", "button", "", "", "car-select-position-button");
        this.dbInputEx["car-select-position-button"].container.classList.add("car-select-position-button");

        posInfo = this.addBox("car-position-info", false);
        posInfo.classList.add("car-position-info");

        [
            {id:"position",type:"div",label:"Position",tooltip:"Selected position"},
            {type:"spacer-div"},
            {id:"plantilla_item_numbers",type:"div",label:"Plantilla Item Number",tooltip:"Plantilla item number(s)"},
            {id:"place_of_assignment",type:"div",label:"Office/Bureau/Service/Unit where the vacancy exists",tooltip:"Place of Assignment"},
            {type:"spacer-div"},
            {id:"final_deliberation_date",type:"text",label:"Date of Final Deliberation",tooltip:"Date of Final Deliberation"}
        ].forEach(field=>{
            if (field.type == "div")
            {
                posInfo.appendChild(this.addDisplayEx("div", field.id, "", field.label, field.tooltip).container);
                this.displayExs[field.id].showColon();
                this.displayExs[field.id].container.classList.add(field.id);
            }
            else if (field.type == "spacer-div")
            {
                posInfo.appendChild(htmlToElement("<span class=\"spacer\"></span>"));
            }
            else
            {
                posInfo.appendChild(this.addInputEx(field.label, field.type, "", field.tooltip, field.id, "Position").container);
                this.dbInputEx[field.id].showColon();
                this.dbInputEx[field.id].container.classList.add(field.id);
            }
        });

        this.dbInputEx["final_deliberation_date"].addEvent("focus", function(event){this.type = "date";});
        this.dbInputEx["final_deliberation_date"].addEvent("blur", function(event){this.type = "text";});

        posInfo.appendChild(this.addInputEx("Hide personal data", "checkbox", "", "Hide personal data", "car-hide-personal-data").container);
        [this.dbInputEx["car-hide-personal-data"]].forEach(field=>{
            field.container.classList.add("car-hide-personal-data");
            field.check();
            field.reverse();
            field.addEvent("change", hidePersonalDataEvent=>{
                this.displayExs["car-table"].container.classList.toggle("hide-personal-data", field.isChecked());
            });
        });

        this.carTable = this.addDisplayEx("div-table", "car-table");
        this.carTable.container.classList.add("car-table");
        this.carTable.container.classList.add("hide-personal-data");

        this.carTable.setHeaders([
            {colHeaderName:"row_number",colHeaderText:"No."},
            {colHeaderName:"applicant_name",colHeaderText:"Name of Applicant"},
            {colHeaderName:"application_code",colHeaderText:"Application Code"},
            {colHeaderName:"education",colHeaderText:"Education"},
            {colHeaderName:"training",colHeaderText:"Training"},
            {colHeaderName:"experience",colHeaderText:"Experience"},
            {colHeaderName:"performance",colHeaderText:"Performance"},
            {colHeaderName:"accomplishments",colHeaderText:"Outstanding Accomplishments"},
            {colHeaderName:"educationApp",colHeaderText:"Application of Education"},
            {colHeaderName:"trainingApp",colHeaderText:"Application of L&D"},
            {colHeaderName:"potential",colHeaderText:"Potential"},
            {colHeaderName:"total",colHeaderText:"Total"},
            {colHeaderName:"remarks",colHeaderText:"Remarks"},
            {colHeaderName:"for_bi",colHeaderText:"Yes"},
            {colHeaderName:"not_for_bi",colHeaderText:"No"},
            {colHeaderName:"for_appointment",colHeaderText:"For Appointment<br> <span class=\"subhead\">(To be filled-out by the Appointing Officer/Authority; Please sign opposite the name of the applicant)</span>"},
            {colHeaderName:"for_probation",colHeaderText:"For Probation<br> <span class=\"subhead\">Please identify period of Probation (6 months or 1 year) in accordance with section F of DO 019, s.2022</span>"}
        ]);

        this.carTable.isHeaderCustomized = true;

        this.carTable.thead.insertBefore(htmlToElement("<tr></tr>"), this.carTable.thead.children[0]);
        this.carTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[0]);
        this.carTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[0]);
        this.carTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[0]);
        this.carTable.thead.children[0].appendChild(htmlToElement("<th colspan=\"9\">Comparative Assessment Results</th>"));
        this.carTable.thead.children[1].children[9].setAttribute("rowspan", 2);
        this.carTable.thead.children[1].children[9].style.minWidth = "8em";
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[9]);
        this.carTable.thead.children[0].appendChild(htmlToElement("<th colspan=\"2\">For Background Investigation (Y/N)</th>"));
        this.carTable.thead.children[1].children[11].setAttribute("rowspan", 2);
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[11]);
        this.carTable.thead.children[1].children[11].setAttribute("rowspan", 2);
        this.carTable.thead.children[0].appendChild(this.carTable.thead.children[1].children[11]);

        this.dbInputEx["car-select-position-button"].addEvent("click", clickEvent=>{
            var selectPositionDialog = new PositionSelectorDialog(this.app, "car-position-selector", [
                {label:"Select", tooltip:"Load selected position", callbackOnClick:positionSelectEvent=>{
                    var positionTitle = selectPositionDialog.formEx.dbInputEx["selected-position"].getValue().trim();
                    var parenPositionTitle = selectPositionDialog.formEx.dbInputEx["selected-paren-position"].getValue().trim();
                    var plantilla = selectPositionDialog.formEx.dbInputEx["selected-plantilla"].getValue().trim();
                    var positionString = positionTitle + (parenPositionTitle == "" ? " " : " (" + parenPositionTitle + ")") + (plantilla == "" ? " " : " [<i>Plantilla Item No. " + plantilla + "</i>] ");

                    var positions = document.positions.filter(position=>(position["plantilla_item_number"] == plantilla || ((position["parenthetical_title"] == parenPositionTitle && parenPositionTitle != "" && parenPositionTitle != null) || plantilla == "ANY" || plantilla == "") && position["position_title"] == positionTitle));

                    this.positions = positions;

                    this.displayExs["position"].setHTMLContent(positions[0]["position_title"] + (positions[0]["parenthetical_title"] == "" || positions[0]["parenthetical_title"] == null ? "" : " (" + positions[0]["parenthetical_title"] + ")"));
                    this.displayExs["position"].setTooltipText(positions[0]["position_title"] + (positions[0]["parenthetical_title"] == "" || positions[0]["parenthetical_title"] == null ? "" : " (" + positions[0]["parenthetical_title"] + ")"));
                    this.displayExs["plantilla_item_numbers"].setHTMLContent(positions.map(position=>position["plantilla_item_number"]).reduce((prev, next)=>prev + "; " + next));
                    this.displayExs["plantilla_item_numbers"].setTooltipText(positions.map(position=>position["plantilla_item_number"]).reduce((prev, next)=>prev + "; " + next));

                    this.displayExs["place_of_assignment"].setHTMLContent(positions[0]["place_of_assignment"]);
                    this.displayExs["place_of_assignment"].setTooltipText(positions[0]["place_of_assignment"]);
                    this.dbInputEx["final_deliberation_date"].setDefaultValue(positions[0]["final_deliberation_date"] ?? "", true);
                    this.dbInputEx["final_deliberation_date"].setTooltipText(positions[0]["final_deliberation_date"] ?? "");


                    postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=applicationsByPosition" + (positionTitle == "" ? "" : "&positionTitle=" + positionTitle) + (parenPositionTitle == "" ? "" : "&parenTitle=" + parenPositionTitle) + (plantilla == "" || plantilla == "ANY" ? "" : "&plantilla=" + plantilla), fetchJobApplicationsEvent=>{
                        var response = null, rows = [], row = null, isQualified = true;

                        if (fetchJobApplicationsEvent.target.readyState == 4 && fetchJobApplicationsEvent.target.status == 200)
                        {
                            response = JSON.parse(fetchJobApplicationsEvent.target.responseText);

                            // console.log(response);
        
                            if (response.type == "Error")
                            {
                                new MsgBox(app.main, response.content, "Close");
                            }
                            else if (response.type == "Data")
                            {
                                thisCARForm.jobApplications = JSON.parse(response.content);

                                thisCARForm.carTable.removeAllRows();

                                thisCARForm.jobApplications = thisCARForm.jobApplications.filter(jobApplication=>{
                                    isQualified = true;

                                    for (const key in jobApplication)
                                    {
                                        switch (key)
                                        {
                                            case "educational_attainment":
                                                isQualified &&= (ScoreSheet.getEducIncrements(jobApplication["educational_attainmentIndex"], jobApplication["degree_taken"]) >= ScoreSheet.getEducIncrements(positions[0]["required_educational_attainment"], []));
                                                isQualified &&= (positions[0]["specific_education_required"] == null || jobApplication["has_specific_education_required"] != 0 || jobApplication["has_specific_education_required"]);
                                                break;
                                            case "relevant_training":
                                                var totalHours = 0;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    for (const relevantTraining of jobApplication[key])
                                                    {
                                                        totalHours += (relevantTraining["hours"] ?? 0);
                                                    }
                                                }
                                            
                                                isQualified &&= (Math.trunc(totalHours / 8) + 1 >= Math.trunc(positions[0]["required_training_hours"] / 8) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (positions[0]["specific_training_required"] == null || jobApplication["has_specific_training"] != 0 || jobApplication["has_specific_training"]);
                                                isQualified &&= totalHours >= positions[0]["required_training_hours"];
                                                break;
                                            case "relevant_work_experience":
                                                var totalDuration = null, duration = null;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    for (const relevantWorkExp of jobApplication[key])
                                                    {
                                                        duration = ScoreSheet.getDuration(relevantWorkExp["start_date"], relevantWorkExp["end_date"] ?? MPASIS_App.defaultEndDate);
                                                        totalDuration = (totalDuration == null ? duration : ScoreSheet.addDuration(totalDuration, duration));
                                                    }
                                                }
                                                
                                                isQualified &&= (Math.trunc(ScoreSheet.convertDurationToNum(totalDuration) * 12 / 6) + 1 >= Math.trunc(positions[0]["required_work_experience_years"] * 12 / 6) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (positions[0]["specific_work_experience_required"] == null || jobApplication["has_specific_work_experience"] != 0 || jobApplication["has_specific_work_experience"]);
                                                break;
                                            case "relevant_eligibility":
                                                var valElig = ScoreSheet.validateEligibility(jobApplication[key].map(elig=>elig.eligibilityId), positions[0]["required_eligibility"]);

                                                isQualified &&= (valElig != 0);
                                                break;
                                            default:
                                                break;
                                        }                                    
                                    }

                                    return isQualified;
                                });

                                for (const jobApplication of thisCARForm.jobApplications)
                                {
                                    var score = 0;
                                    row = {};
                                    row["total"] = 0;

                                    row["applicant_name"] = jobApplication["applicant_name"];
                                    row["application_code"] = jobApplication["application_code"];

                                    var filteredPositions = [];
                                    
                                    filteredPositions = document.positions.filter(position=>position["plantilla_item_number"] == jobApplication["plantilla_item_number_applied"]);

                                    if (filteredPositions.length <= 0)
                                    {
                                        filteredPositions = document.positions.filter(position=>(position["parenthetical_title"] == jobApplication["parenthetical_title_applied"] && position["position_title"] == jobApplication["position_title_applied"]));
                                    }
            
                                    if (filteredPositions.length <= 0)
                                    {
                                        filteredPositions = document.positions.filter(position=>position["position_title"] == jobApplication["position_title_applied"]);
                                    }
            
                                    var position = (filteredPositions.length > 0 ? filteredPositions[0] : null);

                                    thisCARForm.scoreSheetElements = ScoreSheet.getScoreSheetElements(position, jobApplication); // criteria needs to be reselected for every position to properly return all scores

                                    for (const criteria of thisCARForm.scoreSheetElements)
                                    {
                                        if (criteria.id != "summary" && criteria.weight != 0)
                                        {
                                            score = (MPASIS_App.isDefined(criteria.getPointsManually) ? criteria.getPointsManually(1) : IESForm.getPoints(criteria, jobApplication));
                                            row[criteria.id] = score.toFixed(3);
                                            row["total"] += score;
                                        }

                                    }
                                
                                    rows.push(row);
                                }

                                rows.sort((row1, row2)=>row2["total"] - row1["total"]);
                                
                                for (const row of rows)
                                {      
                                    var isTopRank = false;

                                    row["row_number"] = thisCARForm.carTable.rows.length + 1;
                                    isTopRank = (row["row_number"] <= positions.length * 5 && row["total"] > 0); // also don't include "zero" totals; MAY CHANGE DEPENDING ON HR POLICY
                                    row["total"] = "<b>" + row["total"].toFixed(3) + "</b>";
                                    thisCARForm.carTable.addRow(row);

                                    if (isTopRank)
                                    {
                                        thisCARForm.carTable.rows.slice(-1)[0]["tr"].classList.add("top-rank");
                                    }
                                }

                                selectPositionDialog.close();

                                thisCARForm.dbInputEx["car-control-buttons"].getItemAt(1).enable();
                            }
                            // else if (response.type == "Success")
                            // {
                            //     new MsgBox(thisIERForm.container, response.content, "OK");
                            // }
                            else if (response.type == "Debug")
                            {
                                new MsgBox(thisCARForm.container, response.content, "OK");
                                console.log(response.content);
                            }
                        }
                    });
                }},
                {label:"Cancel", tooltip:"Close dialog", callbackOnClick:positionSelectEvent=>selectPositionDialog.close()}
            ]);
        });

        var carControlButtons = this.addInputEx("", "buttonExs", "", "", "car-control-buttons");
        carControlButtons.container.classList.add("car-control-buttons");
        carControlButtons.addItem("Update", "Update", "Update field values to database").disable();
        [carControlButtons.addItem("Print", "Print", "Print the Comparative Assessment Result form")].forEach(field=>{
            field.disable();
            field.addEvent("click", this.generatePrinterFriendly);
        });

        // this.addInputEx("Print", "buttonEx", "Print", "Print the Comparative Assessment Result form", "car-print-button");

        // this.dbInputEx["car-print-button"].addEvent("click", this.generatePrinterFriendly);
    }

    generatePrinterFriendly(carPrintClickEvent)
    {
        var thisCARForm = carPrintClickEvent.target.inputEx.parentInputEx.parentFormEx, carForPrint = window.open("", "_blank");
        
        var nodeDoctype = carForPrint.document.implementation.createDocumentType("html", "", "");
        if(carForPrint.document.doctype) {
            carForPrint.document.replaceChild(nodeDoctype, carForPrint.document.doctype);
        } else {
            carForPrint.document.insertBefore(nodeDoctype, carForPrint.document.childNodes[0]);
        }
        carForPrint.document.title = "Comparative Assessment Result (CAR) [printer-friendly version]";
        carForPrint.document.body.classList.add("print");
        
        createElementEx(NO_NS, "base", carForPrint.document.head, null, "href", window.location.origin);
        
        [
            "/styles/default.css",
            "/styles/main.css",
            "/styles/ExClass.css",
            "/styles/print.css",
            "/styles/material.io/material-icons.css",
            "/mpasis/styles/main.css",
            "/mpasis/styles/print.css"
        ].forEach(cssURL=>{
            carForPrint.document.head.appendChild(htmlToElement("<link href=\"" + cssURL + "\" type=\"text/css\" rel=\"stylesheet\">"));
        });
        
        var carFormClone = thisCARForm.container.cloneNode(true);
        carForPrint.document.body.appendChild(carFormClone);
        
        var carFormCloneFields = carFormClone.querySelector(".fields");

        var signatory = new DisplayEx(carFormCloneFields, "div", "car-printout-signatory");
        signatory.container.classList.add("car-printout-signatory");

        var signatoryHRMPSB = new DisplayEx(carFormCloneFields, "div", "car-printout-signatory-hrmpsb", "", "Prepared by the HRMPSB <br><i>(All members should affix signature)</i>");
        signatory.addContent(signatoryHRMPSB.container);
        signatoryHRMPSB.container.classList.add("hrmpsb");

        var signatoryHRMPSBMember = [];
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        [0, 1, 2, 3, 4].forEach(i=>{
            var member = (document.hrRoles === null || document.hrRoles === undefined ? null : (i == 4 ? document.hrRoles["hrmpsb_chair"] : document.hrRoles["hrmpsb_members"].filter(member=>member["level" + (thisCARForm.positions[0]["salary_grade"] >= 10 ? 2 : 1)]).reverse()[i]));
            signatoryHRMPSBMember.push(new DisplayEx(null, "div", "car-printout-signatory-hrmpsb-" + (i == 4 ? "chair" : "member")));
            htmlToElements("<div class=\"name-position\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : member["name"] + "<br>" + member["position"]) + "</div> <div class=\"hrmpsb-role\">HRMPSB " + (i == 4 ? "Chairperson" : "Member") + "</div>").forEach(node=>{
                signatoryHRMPSBMember[i].addContent(node);
                signatoryHRMPSBMember[i].addContent(document.createTextNode(" "));
                if (node.classList.contains("name-position"))
                {
                    node.addEventListener("dblclick", fieldModeChange);
                    node.title = "Please double-click to edit.";
                }
            });
            signatoryHRMPSBMember[i].container.classList.add(i == 4 ? "chair" : "member");
            signatoryHRMPSB.addContent(signatoryHRMPSBMember[i].container);
            signatoryHRMPSB.addContent(document.createTextNode(" "));
        });

        var signatoryAppointer = new DisplayEx(carFormCloneFields, "div", "car-printout-signatory-appointer", "", "Appointment conferred by:<br>&nbsp;");
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        htmlToElements("<div class=\"name-position\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : document.hrRoles["appointing_officer"]["name"] + "<br>" + document.hrRoles["appointing_officer"]["position"]) + "</div> <div class=\"hrmpsb-role\">Appointing Authority</div>").forEach(node=>{
            signatoryAppointer.addContent(node);
            signatoryAppointer.addContent(document.createTextNode(" "));
            if (node.classList.contains("name-position"))
            {
                node.addEventListener("dblclick", fieldModeChange);
                node.title = "Please double-click to edit.";
            }
        });
        // signatoryAppointer.showColon();
        signatory.addContent(signatoryAppointer.container);
        signatoryAppointer.container.classList.add("appointer");

        carForPrint.document.getElementById("car-form-input-ex0").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW CAR IS CODED
        carForPrint.document.getElementById("car-form-input-ex2").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW CAR IS CODED
        carForPrint.document.getElementById("car-form-input-ex3").parentElement.parentElement.parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW CAR IS CODED
        
        var printButtonGroup = new InputEx(null, "print-car-controls", "buttonExs");
        carForPrint.document.body.insertBefore(printButtonGroup.container, carForPrint.document.body.children[0]);
        printButtonGroup.container.classList.add("print-controls");
        printButtonGroup.addItem("<span class=\"material-icons-round green\">print</span>", "", "Print").addEvent("click", clickPrintEvent=>{carForPrint.print()});
        printButtonGroup.addItem("<span class=\"material-symbols-rounded red\">tab_close</span>", "", "Close Tab/Window").addEvent("click", clickPrintEvent=>{carForPrint.close()});
    
        carForPrint.alert("Please click on the print button to continue");
    }
}

class RQAForm extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        var posInfo = null, thisRQAForm = null;

        super(app.mainSections["main-car-rqa"], id, useFormElement);
        this.app = app;
        thisRQAForm = this;

        this.container.classList.add("rqa-form");

        this.setTitle("Comparative Assessment Result - Registry of Qualified Applicants (CAR-RQA)", 2);

        this.position = null;
        this.positions = [];
        this.jobApplications = [];
        this.scoreSheetElements = [];
        this.rqaTable = null;

        this.addInputEx("Select Position", "button", "", "", "rqa-select-position-button");
        this.dbInputEx["rqa-select-position-button"].container.classList.add("rqa-select-position-button");

        posInfo = this.addBox("rqa-position-info", false);
        posInfo.classList.add("rqa-position-info");

        [
            {id:"position",type:"div",label:"Position",tooltip:"Selected position"},
            // {type:"spacer-div"},
            {id:"place_of_assignment",type:"div",label:"Schools Division Office",tooltip:"Place of Assignment"},
            {id:"final_deliberation_date",type:"text",label:"Date of Final Deliberation",tooltip:"Date of Final Deliberation"},
            // {type:"spacer-div"},
            // {type:"spacer-div"}
        ].forEach(field=>{
            if (field.type == "div")
            {
                posInfo.appendChild(this.addDisplayEx("div", field.id, "", field.label, field.tooltip).container);
                this.displayExs[field.id].showColon();
                this.displayExs[field.id].container.classList.add(field.id);
            }
            else if (field.type == "spacer-div")
            {
                posInfo.appendChild(htmlToElement("<span class=\"spacer\"></span>"));
            }
            else
            {
                posInfo.appendChild(this.addInputEx(field.label, field.type, "", field.tooltip, field.id, "Position").container);
                this.dbInputEx[field.id].showColon();
                this.dbInputEx[field.id].container.classList.add(field.id);
            }
        });


        this.dbInputEx["final_deliberation_date"].addEvent("focus", function(event){this.type = "date";});
        this.dbInputEx["final_deliberation_date"].addEvent("blur", function(event){this.type = "text";});

        posInfo.appendChild(this.addInputEx("Hide personal data", "checkbox", "", "Hide personal data", "rqa-hide-personal-data").container);
        [this.dbInputEx["rqa-hide-personal-data"]].forEach(field=>{
            field.container.classList.add("rqa-hide-personal-data");
            field.check();
            field.reverse();
            field.addEvent("change", hidePersonalDataEvent=>{
                this.displayExs["rqa-table"].container.classList.toggle("hide-personal-data", field.isChecked());
            });
        });

        posInfo.appendChild(this.addInputEx("Hide zero (0) scores", "checkbox", "", "Hide zero (0) scores", "rqa-hide-zero-scores").container);
        [this.dbInputEx["rqa-hide-zero-scores"]].forEach(field=>{
            field.container.classList.add("rqa-hide-zero-scores");
            field.check();
            field.reverse();
            field.addEvent("change", hidePersonalDataEvent=>{
                this.displayExs["rqa-table"].container.classList.toggle("hide-zero-scores", field.isChecked());
            });
        });

        this.rqaTable = this.addDisplayEx("div-table", "rqa-table");
        this.rqaTable.container.classList.add("rqa-table");
        this.rqaTable.container.classList.add("hide-personal-data");
        this.rqaTable.container.classList.add("hide-zero-scores");

        this.rqaTable.setHeaders([
            {colHeaderName:"row_number",colHeaderText:"No."},
            {colHeaderName:"applicant_name",colHeaderText:"Name of Applicant"},
            {colHeaderName:"application_code",colHeaderText:"Application Code"},
            {colHeaderName:"education",colHeaderText:"Education <br>(10&nbsp;pts)"},
            {colHeaderName:"training",colHeaderText:"Training <br>(10&nbsp;pts)"},
            {colHeaderName:"experience",colHeaderText:"Experience <br>(10&nbsp;pts)"},
            {colHeaderName:"lept",colHeaderText:"PBET/LET/LEPT Rating <br>(10&nbsp;pts)"},
            {colHeaderName:"coi",colHeaderText:"PPST COIs (Classroom Observation) <br>(35&nbsp;pts)"},
            {colHeaderName:"ncoi",colHeaderText:"PPST NCOIs (Teacher Reflection) <br>(25&nbsp;pts)"},
            {colHeaderName:"total",colHeaderText:"Total <br>(100&nbsp;pts)"},
            {colHeaderName:"remarks",colHeaderText:"Remarks"},
            {colHeaderName:"for_bi",colHeaderText:"Yes"},
            {colHeaderName:"not_for_bi",colHeaderText:"No"},
            {colHeaderName:"for_appointment",colHeaderText:"For Appointment<br> <span class=\"subhead\">(To be filled-out by the Appointing Officer/Authority; Please sign opposite the name of the applicant)</span>"},
            {colHeaderName:"for_probation",colHeaderText:"Status of Appointment<br> <span class=\"subhead\">(Based on availability of PBET/LET/LEPT)</span>"}
        ]);

        this.rqaTable.isHeaderCustomized = true;

        this.rqaTable.thead.insertBefore(htmlToElement("<tr></tr>"), this.rqaTable.thead.children[0]);
        this.rqaTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[0]);
        this.rqaTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[0]);
        this.rqaTable.thead.children[1].children[0].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[0]);
        this.rqaTable.thead.children[0].appendChild(htmlToElement("<th colspan=\"7\">Comparative Assessment Results</th>"));
        this.rqaTable.thead.children[1].children[7].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[1].children[7].style.minWidth = "8em";
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[7]);
        this.rqaTable.thead.children[0].appendChild(htmlToElement("<th colspan=\"2\">For Background Investigation (Y/N)</th>"));
        this.rqaTable.thead.children[1].children[9].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[9]);
        this.rqaTable.thead.children[1].children[9].setAttribute("rowspan", 2);
        this.rqaTable.thead.children[0].appendChild(this.rqaTable.thead.children[1].children[9]);

        this.dbInputEx["rqa-select-position-button"].addEvent("click", clickEvent=>{
            var selectPositionDialog = new PositionSelectorDialog(this.app, "rqa-position-selector", [
                {label:"Select", tooltip:"Load selected position", callbackOnClick:positionSelectEvent=>{
                    var positionTitle = selectPositionDialog.formEx.dbInputEx["selected-position"].getValue().trim();
                    var parenPositionTitle = selectPositionDialog.formEx.dbInputEx["selected-paren-position"].getValue().trim();
                    var plantilla = selectPositionDialog.formEx.dbInputEx["selected-plantilla"].getValue().trim();
                    var positionString = positionTitle + (parenPositionTitle == "" ? " " : " (" + parenPositionTitle + ")") + (plantilla == "" ? " " : " [<i>Plantilla Item No. " + plantilla + "</i>] ");

                    var positions = document.positions.filter(position=>(position["plantilla_item_number"] == plantilla || ((position["parenthetical_title"] == parenPositionTitle && parenPositionTitle != "" && parenPositionTitle != null) || plantilla == "ANY" || plantilla == "") && position["position_title"] == positionTitle));
                    this.positions = positions;

                    this.displayExs["position"].setHTMLContent(positions[0]["position_title"] + (positions[0]["parenthetical_title"] == "" || positions[0]["parenthetical_title"] == null ? "" : " (" + positions[0]["parenthetical_title"] + ")"));
                    this.displayExs["position"].setTooltipText(positions[0]["position_title"] + (positions[0]["parenthetical_title"] == "" || positions[0]["parenthetical_title"] == null ? "" : " (" + positions[0]["parenthetical_title"] + ")"));

                    this.displayExs["place_of_assignment"].setHTMLContent(positions[0]["place_of_assignment"]);
                    this.displayExs["place_of_assignment"].setTooltipText(positions[0]["place_of_assignment"]);
                    this.dbInputEx["final_deliberation_date"].setDefaultValue(positions[0]["final_deliberation_date"] ?? "", true);
                    this.dbInputEx["final_deliberation_date"].setTooltipText(positions[0]["final_deliberation_date"] ?? "");

                    postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=applicationsByPosition" + (positionTitle == "" ? "" : "&positionTitle=" + positionTitle) + (parenPositionTitle == "" ? "" : "&parenTitle=" + parenPositionTitle) + (plantilla == "" || plantilla == "ANY" ? "" : "&plantilla=" + plantilla), fetchJobApplicationsEvent=>{
                        var response = null, rows = [], row = null, isQualified = true;

                        if (fetchJobApplicationsEvent.target.readyState == 4 && fetchJobApplicationsEvent.target.status == 200)
                        {
                            response = JSON.parse(fetchJobApplicationsEvent.target.responseText);

                            // console.log(response);
        
                            if (response.type == "Error")
                            {
                                new MsgBox(thisRQAForm.app.main, response.content, "Close");
                            }
                            else if (response.type == "Data")
                            {
                                thisRQAForm.jobApplications = JSON.parse(response.content);

                                thisRQAForm.rqaTable.removeAllRows();

                                thisRQAForm.jobApplications = thisRQAForm.jobApplications.filter(jobApplication=>{
                                    isQualified = true;

                                    for (const key in jobApplication)
                                    {
                                        switch (key)
                                        {
                                            case "educational_attainment":
                                                isQualified &&= (ScoreSheet.getEducIncrements(jobApplication["educational_attainmentIndex"], jobApplication["degree_taken"]) >= ScoreSheet.getEducIncrements(positions[0]["required_educational_attainment"], []));
                                                isQualified &&= (positions[0]["specific_education_required"] == null || jobApplication["has_specific_education_required"] != 0 || jobApplication["has_specific_education_required"]);
                                                break;
                                            case "relevant_training":
                                                var totalHours = 0;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    for (const relevantTraining of jobApplication[key])
                                                    {
                                                        totalHours += (relevantTraining["hours"] ?? 0);
                                                    }
                                                }
                                            
                                                isQualified &&= (Math.trunc(totalHours / 8) + 1 >= Math.trunc(positions[0]["required_training_hours"] / 8) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (positions[0]["specific_training_required"] == null || jobApplication["has_specific_training"] != 0 || jobApplication["has_specific_training"]);
                                                break;
                                            case "relevant_work_experience":
                                                var totalDuration = null, duration = null;
                                                if (jobApplication[key].length > 0)
                                                {
                                                    for (const relevantWorkExp of jobApplication[key])
                                                    {
                                                        duration = ScoreSheet.getDuration(relevantWorkExp["start_date"], relevantWorkExp["end_date"] ?? MPASIS_App.defaultEndDate);
                                                        totalDuration = (totalDuration == null ? duration : ScoreSheet.addDuration(totalDuration, duration));
                                                    }
                                                }
                                                
                                                isQualified &&= (Math.trunc(ScoreSheet.convertDurationToNum(totalDuration) * 12 / 6) + 1 >= Math.trunc(positions[0]["required_work_experience_years"] * 12 / 6) + 1); // MAY ALSO BE SIMPLIFIED MATHEMATICALLY
                                                isQualified &&= (positions[0]["specific_work_experience_required"] == null || jobApplication["has_specific_work_experience"] != 0 || jobApplication["has_specific_work_experience"]);
                                                break;
                                            case "relevant_eligibility":
                                                var valElig = ScoreSheet.validateEligibility(jobApplication[key].map(elig=>elig.eligibilityId), positions[0]["required_eligibility"]);

                                                isQualified &&= (valElig != 0);
                                                break;
                                            default:
                                                break;
                                        }                                    
                                    }

                                    return isQualified;
                                });

                                for (const jobApplication of thisRQAForm.jobApplications)
                                {
                                    var score = 0;
                                    row = {};
                                    row["total"] = 0;

                                    row["applicant_name"] = jobApplication["applicant_name"];
                                    row["application_code"] = jobApplication["application_code"];

                                    var filteredPositions = [];
                                    
                                    filteredPositions = document.positions.filter(position=>position["plantilla_item_number"] == jobApplication["plantilla_item_number_applied"]);

                                    if (filteredPositions.length <= 0)
                                    {
                                        filteredPositions = document.positions.filter(position=>(position["parenthetical_title"] == jobApplication["parenthetical_title_applied"] && position["position_title"] == jobApplication["position_title_applied"]));
                                    }
            
                                    if (filteredPositions.length <= 0)
                                    {
                                        filteredPositions = document.positions.filter(position=>position["position_title"] == jobApplication["position_title_applied"]);
                                    }
            
                                    var position = (filteredPositions.length > 0 ? filteredPositions[0] : null);

                                    thisRQAForm.scoreSheetElements = ScoreSheet.getScoreSheetElements(position, jobApplication); // criteria needs to be reselected for every position to properly return all scores

                                    for (const criteria of thisRQAForm.scoreSheetElements)
                                    {
                                        if (criteria.id != "summary" && criteria.weight != 0)
                                        {
                                            score = (MPASIS_App.isDefined(criteria.getPointsManually) ? criteria.getPointsManually(1) : IESForm.getPoints(criteria, jobApplication));
                                            row[criteria.id] = score.toFixed(3);
                                            row["total"] += score;
                                        }

                                    }
                                
                                    rows.push(row);
                                }

                                rows.sort((row1, row2)=>row2["total"] - row1["total"]);
                                
                                for (const row of rows)
                                {      
                                    // var isQualified = (row["total"] >= 70); // MAY CHANGE DEPENDING ON HR POLICY
                                    var isQualified = (row["total"] >= 0); // MAY CHANGE DEPENDING ON HR POLICY
                                    
                                    if (isQualified)
                                    {
                                        row["row_number"] = thisRQAForm.rqaTable.rows.length + 1;
                                        row["total"] = "<b>" + row["total"].toFixed(3) + "</b>";
                                        thisRQAForm.rqaTable.addRow(row);

                                        if (row["total"] === "<b>0.000</b>")
                                        {
                                            thisRQAForm.rqaTable.rows.slice(-1)[0]["tr"].classList.add("zero-score");
                                        }
                                    }
                                }

                                selectPositionDialog.close();

                                thisRQAForm.dbInputEx["rqa-control-buttons"].getItemAt(1).enable();
                            }
                            // else if (response.type == "Success")
                            // {
                            //     new MsgBox(thisIERForm.container, response.content, "OK");
                            // }
                            else if (response.type == "Debug")
                            {
                                new MsgBox(thisRQAForm.container, response.content, "OK");
                                console.log(response.content);
                            }
                        }
                    });
                }},
                {label:"Cancel", tooltip:"Close dialog", callbackOnClick:positionSelectEvent=>selectPositionDialog.close()}
            ], (position, index, positions)=>{
                var i = 0;
                while (i < index && positions[i]["position_title"] != position["position_title"]) { i++; }
                return i == index && position["filled"] == 0 && position["position_categoryId"] == 1;
            });
        });

        var rqaControlButtons = this.addInputEx("", "buttonExs", "", "", "rqa-control-buttons");
        rqaControlButtons.container.classList.add("rqa-control-buttons");
        rqaControlButtons.addItem("Update", "Update", "Update field values to database").disable();
        [rqaControlButtons.addItem("Print", "Print", "Print the Comparative Assessment Result form")].forEach(field=>{
            field.disable();
            field.addEvent("click", this.generatePrinterFriendly);
        });

        thisRQAForm = this;
    }

    generatePrinterFriendly(rqaPrintClickEvent)
    {
        var thisRQAForm = rqaPrintClickEvent.target.inputEx.parentInputEx.parentFormEx, rqaForPrint = window.open("", "_blank");

        var nodeDoctype = rqaForPrint.document.implementation.createDocumentType("html", "", "");
        if(rqaForPrint.document.doctype) {
            rqaForPrint.document.replaceChild(nodeDoctype, rqaForPrint.document.doctype);
        } else {
            rqaForPrint.document.insertBefore(nodeDoctype, rqaForPrint.document.childNodes[0]);
        }
        rqaForPrint.document.title = "Comparative Assessment Result - Registry of Qualified Applicants (CAR-RQA) [printer-friendly version]";
        rqaForPrint.document.body.classList.add("print");
        
        createElementEx(NO_NS, "base", rqaForPrint.document.head, null, "href", window.location.origin);
        
        [
            "/styles/default.css",
            "/styles/main.css",
            "/styles/ExClass.css",
            "/styles/print.css",
            "/styles/material.io/material-icons.css",
            "/mpasis/styles/main.css",
            "/mpasis/styles/print.css"
        ].forEach(cssURL=>{
            rqaForPrint.document.head.appendChild(htmlToElement("<link href=\"" + cssURL + "\" type=\"text/css\" rel=\"stylesheet\">"));
        });
        
        var rqaFormClone = thisRQAForm.container.cloneNode(true);
        rqaForPrint.document.body.appendChild(rqaFormClone);
        
        var rqaFormCloneFields = rqaFormClone.querySelector(".fields");
        
        var signatory = new DisplayEx(rqaFormCloneFields, "div", "rqa-printout-signatory");
        signatory.container.classList.add("rqa-printout-signatory");

        var signatoryHRMPSB = new DisplayEx(rqaFormCloneFields, "div", "rqa-printout-signatory-hrmpsb", "", "Prepared by the HRMPSB <br><i>(All members should affix signature)</i>");
        signatory.addContent(signatoryHRMPSB.container);
        signatoryHRMPSB.container.classList.add("hrmpsb");
        
        var signatoryHRMPSBMember = [];
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        
        [0, 1, 2, 3, 4].forEach(i=>{
            var member = (document.hrRoles === null || document.hrRoles === undefined ? null : (i == 4 ? document.hrRoles["hrmpsb_chair"] : document.hrRoles["hrmpsb_members"].filter(member=>member["level" + (thisRQAForm.positions[0]["salary_grade"] >= 10 ? 2 : 1)]).reverse()[i]));
            signatoryHRMPSBMember.push(new DisplayEx(null, "div", "rqa-printout-signatory-hrmpsb-" + (i == 4 ? "chair" : "member")));
            htmlToElements("<div class=\"name-position\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : member["name"] + "<br>" + member["position"]) + "</div> <div class=\"hrmpsb-role\">HRMPSB " + (i == 4 ? "Chairperson" : "Member") + "</div>").forEach(node=>{
                signatoryHRMPSBMember[i].addContent(node);
                signatoryHRMPSBMember[i].addContent(document.createTextNode(" "));
                if (node.classList.contains("name-position"))
                {
                    node.addEventListener("dblclick", fieldModeChange);
                    node.title = "Please double-click to edit.";
                }
            });
            signatoryHRMPSBMember[i].container.classList.add(i == 4 ? "chair" : "member");
            signatoryHRMPSB.addContent(signatoryHRMPSBMember[i].container);
            signatoryHRMPSB.addContent(document.createTextNode(" "));
        });

        var signatoryAppointer = new DisplayEx(rqaFormCloneFields, "div", "rqa-printout-signatory-appointer", "", "Appointment conferred by:<br>&nbsp;");
        var fieldModeChange = event=>{
            if (event.target.isContentEditable)
            {
                event.target.removeAttribute("contenteditable");
            }
            else
            {
                event.target.setAttribute("contenteditable", true);
            }
        };
        htmlToElements("<div class=\"name-position\">" + (document.hrRoles === null || document.hrRoles === undefined ? "" : document.hrRoles["appointing_officer"]["name"] + "<br>" + document.hrRoles["appointing_officer"]["position"]) + "</div> <div class=\"hrmpsb-role\">Appointing Authority</div>").forEach(node=>{
            signatoryAppointer.addContent(node);
            signatoryAppointer.addContent(document.createTextNode(" "));
            if (node.classList.contains("name-position"))
            {
                node.addEventListener("dblclick", fieldModeChange);
                node.title = "Please double-click to edit.";
            }
        });
        // signatoryAppointer.showColon();
        signatory.addContent(signatoryAppointer.container);
        signatoryAppointer.container.classList.add("appointer");
        
        rqaForPrint.document.getElementById("rqa-form-input-ex0").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW RQA IS CODED
        rqaForPrint.document.getElementById("rqa-form-input-ex2").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW RQA IS CODED
        rqaForPrint.document.getElementById("rqa-form-input-ex3").parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW RQA IS CODED
        rqaForPrint.document.getElementById("rqa-form-input-ex4").parentElement.parentElement.parentElement.parentElement.remove(); // MAY CHANGE DEPENDING ON HOW RQA IS CODED
        
        var printButtonGroup = new InputEx(null, "print-rqa-controls", "buttonExs");
        rqaForPrint.document.body.insertBefore(printButtonGroup.container, rqaForPrint.document.body.children[0]);
        printButtonGroup.container.classList.add("print-controls");
        printButtonGroup.addItem("<span class=\"material-icons-round green\">print</span>", "", "Print").addEvent("click", clickPrintEvent=>{rqaForPrint.print()});
        printButtonGroup.addItem("<span class=\"material-symbols-rounded red\">tab_close</span>", "", "Close Tab/Window").addEvent("click", clickPrintEvent=>{rqaForPrint.close()});

        rqaForPrint.alert("Please click on the print button to continue");
    }
}

class MPASIS_Settings_Form extends Old_FormEx
{
    constructor(app = new MPASIS_App(), id = "", useFormElement = true)
    {
        super(app.mainSections["main-settings"], id, useFormElement);
        this.app = app;
        var thisMPASISSettingForm = this;

        this.setTitle("Settings", 2);
        this.container.classList.add("mpasis-settings");

        this.addHeader("Roles", 3);

        // this.addInputEx("Add/Edit Roles", "buttonEx", "Add/Edit Roles", "", "mpasis-settings-edit-roles");
        // this.addSpacer();
        // this.addInputEx("Add/Edit Selection Boards", "buttonEx", "Add/Edit Selection Boards", "", "mpasis-settings-edit-selection-boards");
        // this.addSpacer();
        this.addInputEx("Assign Roles", "buttonEx", "Assign Roles", "", "mpasis-settings-assign-roles");

        this.dbInputEx["mpasis-settings-assign-roles"].addEvent("click", event=>{
            new AssignRoles().setup(app.main);
        });
        

        // this.dbInputEx["mpasis-settings-edit-selection-boards"].addEvent("click", event=>{
            // new EditSelectionBoard(thisMPASISSettingForm.app, "edit-selection-board-dialog");
        // });
    }
}
// export { ScrimEx, DisplayEx, InputEx, Old_FormEx, Old_DialogEx, MsgBox };
