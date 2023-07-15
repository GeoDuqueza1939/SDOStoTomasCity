"user strict";

class ElementEx
{
    static #NO_NS = "NO_NAMESPACE";

    static get NO_NS()
    {
        return this.#NO_NS;
    }

    /**
     * Creates an element with attributes
     * @author Geovani P. Duqueza
     * @version 1.1
     * @param {String} elName Element name
     * @param {String} xmlns Namespace URI
     * @param {Element} parent Parent element/node
     * @param {Element} nextNode Next sibling element/node
     * @param {String} ..arguments 
     * @throws {Error} "Element name cannot be empty."
     * @returns {Element}
     */
    static create(elName, xmlns, parent, nextNode)
    {   // args: elName, xmlns, parent, nextNode, argNS1, argName1, argVal1, argNS2, argName2, argVal2, ...
        let el = null;
        if (this.type(elName) === "string" && elName.trim() !== "")
        {
            el = (xmlns === null || xmlns === undefined || xmlns === "" || xmlns === this.NO_NS ? document.createElement(elName.toUpperCase()) : document.createElementNS(xmlns, elName));
    
            if (arguments.length > 4) {
                if (arguments[1] === this.NO_NS || arguments[4] === this.NO_NS) {
                    for (let i = 4 + (arguments[4] === this.NO_NS ? 1 : 0), length = arguments.length - (arguments.length + (arguments[4] === this.NO_NS ? 1 : 0)) % 2; i < length; i++) {
                        el.setAttribute(arguments[i++], arguments[i]);
                    }
                }
                else { // ignore last attribute if it has no paired value
                    for (let i = 4, length = arguments.length - (arguments.length + 2) % 3; i < length; i++) {
                        if (arguments[i] !== "" || arguments[i] !== null || arguments[i] !== undefined)
                            el.setAttributeNS(arguments[i], arguments[++i], arguments[++i]);
                        else
                            el.setAttribute(arguments[++i], arguments[++i]);
                    }
                }
            }
    
            if (parent !== null && parent !== undefined) {
                if (nextNode === null || nextNode === undefined)
                    parent.appendChild(el);
                else
                    parent.insertBefore(el, nextNode);
            }
        }
        else
        {
            throw new TypeError("Element name should be a non-blank string.");
        }
    
        return el;
    }    

    /**
     * Create a simple element
     * @author Geovani P. Duqueza
     * @version 1.1
     * @param {String} elName Element name
     * @param {String} xmlns Namespace URI
     * @param {String} className Class attribute value
     * @param {Element} parent Parent element/node
     * @param {Element} nextNode Next sibling element/node
     * @throws {Error} "Element name cannot be empty."
     * @returns {Element}
     */
    static createSimple(elName, xmlns, className, parent)
    {
        let el = null;
        if (this.type(elName) === "string" && elName.trim() !== "")
        {
            el = (xmlns === null || xmlns === undefined || xmlns === "" || xmlns === this.NO_NS ? document.createElement(elName.toUpperCase()) : document.createElementNS(xmlns, elName));
    
            if (className !== "" && className !== null && className !== undefined)
                el.setAttribute("class", className);

            if (parent !== null && parent !== undefined) {
                if (arguments.length === 5)
                    parent.insertBefore(el, arguments[4]);
                else
                    parent.appendChild(el);
            }
        }
        else
        {
            throw new TypeError("Element name should be a non-blank string.");
        }
    
        return el;    
    }

    /**
     * Adds text to the specified element
     * @param {String} text The text to be added.
     * @param {Element} htmlElement The element that would contain the text.
     * @param {Node} nextSibling (optional) The element/node that should come after the text.
     * @throws {Error} "Incorrect number of arguments."
     * @throws {Error} "Container element cannot be null or undefined."
     */
    static addText(text, htmlElement, nextSibling = null)
    {
        let textNode = null;
        if (arguments.length < 2 || arguments.length > 3) {
            throw new SyntaxError("Incorrect number of arguments.");
        }
        else if (this.isElement(htmlElement)) {
            textNode = document.createTextNode(text);
            if (nextSibling === null || nextSibling === undefined)
            {
                htmlElement.appendChild(textNode);
            }
            else
            {
                htmlElement.insertBefore(textNode, nextSibling);
            }
        }
        else {
            throw new TypeError("Invalid container specified. Container should be an instance of HTMLElement");
        }
    
        return textNode;    
    }

    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     *      source: https://stackoverflow.com/a/35385518
     */
    static htmlToElement(html) {
        let template = document.createElement("template");
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    /**
     * @param {String} HTML representing any number of sibling elements
     * @return {NodeList} 
     *      source: https://stackoverflow.com/a/35385518
     */
    static htmlToElements(html) {
        let template = document.createElement("template");
        template.innerHTML = html;
        return template.content.childNodes;
    }

    /**
     * @param {*} element 
     * @return {Boolean}
     *      original source: https://stackoverflow.com/a/36894871
     */
    static isElement(element) {
        return element instanceof Element || element instanceof HTMLElement || element instanceof Document || element instanceof HTMLDocument || this.type(element).includes("element");
    }

    /**
     * @author Geovani P. Duqueza
     * @version 1.0
     * @param {*} object
     * @return {Boolean}
     */
    static isNode(object) {
        return object instanceof Node;
    }

    /**
     * Checks if object is a text node
     * @author Geovani P. Duqueza
     * @version 1.0
     * @param {*} object
     * @return {Boolean}
     */
    static isTextNode(object) {
        return this.isNode(object) && object.nodeType === Node.TEXT_NODE;
    }

    /**
     * Checks type of variable
     * original source: https://stackoverflow.com/a/55692897
     * @param {Any} obj 
     */
    static type(obj) {
        return Object.prototype.toString.apply(obj).replace(/\[object (.+)\]/i, '$1').toLowerCase();
    };    

    /**
     * Checks if object is a text node
     * @author Geovani P. Duqueza
     * @version 1.0
     * @param {Node} node1
     * @param {Node} node2
     * @return {undefined}
     */
    static switch(node1, node2)
    {
        if (ElementEx.isNode(node1) && ElementEx.isNode(node2))
        {
            if (node1.parentNode === null && node2.parentNode === null)
            {
                throw new ReferenceError("At least one node should have a parent.");
            }
            else
            {
                let node = (node1.parentNode === null || node2.nextSibling === node1 ? [node2, node1] : [node1, node2]); // [0] always has a parentNode
                let [parent, previous, next] = [node[1].parentNode, node[1].previousSibling, node[1].nextSibling];

                node[0].parentNode.replaceChild(node[1], node[0]);

                if (next !== null)
                {
                    parent.insertBefore(node[0], next);
                }
                else if (previous !== null && previous !== node[0])
                {
                    parent.insertBefore(node[0], previous);
                    parent.insertBefore(previous, node[0]);
                }
                else if (parent !== null)
                {
                    parent.appendChild(node[0]);
                }
            }
        }
        else
        {
            throw new TypeError("Arguments should be Nodes.");
        }
    }

    static replace(element, newTagName)
    {
        let newElement = null;

        if (element instanceof HTMLElement && element.tagName.toLowerCase() !== newTagName.toLowerCase())
        {
            newElement = ElementEx.create(newTagName, ElementEx.NO_NS);
        }

        for (const key in element)
        {
            try
            {
                if (element[key] !== null && element[key] !== undefined && element[key] !== "")
                {
                    newElement[key] = element[key];
                }
            }
            catch (ex)
            {
                // do nothing
            }

            if (newElement.getAttributeNames().map(attr=>attr.toLowerCase()).includes(key.toLowerCase()) && !element.getAttributeNames().map(attr=>attr.toLowerCase()).includes(key.toLowerCase()))
            {
                newElement.removeAttribute(key);
            }
        }

        element.replaceWith(newElement);

        return newElement;
    }
}

class UIEx
{
    static #UIExType = "UIEx";
    static #instanceCount = 0;
    #type = "";
    #container = null;
    autoId = "";
    // dbInfo = {}; // { column:"column_name", table:"table_name" }
    spacer = [];
    parentUIEx = null;
    parentDataFormEx = null;
    parentDialogEx = null;

    constructor()
    {
        if (UIEx.UIExType !== arguments[0])
        {
            throw new TypeError("This class cannot be instantiated directly.");
        }

        this.autoId = this.UIExType + UIEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        throw new TypeError("This method/property is not yet implemented! [UIEx.setup()]");
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement()})
    {
        throw new TypeError("This method/property is not yet implemented! [UIEx.setupFromConfig()]");
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        throw new TypeError("This method/property is not yet implemented! [UIEx.setupFromHTMLElement()]");
    }

    get id()
    {
        if (ElementEx.isElement(this.container))
        {
            return (this.container !== null && this.container.id !== null && this.container.id !== "" ? this.container.id : null);
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set id(id = "")
    {
        if (ElementEx.isElement(this.container))
        {
            this.container.id = id;
        }
        else if (ElementEx.type(id) === "string" && id.trim() !== "")
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
        else
        {
            throw new TypeError("Id should be a non-blank string");
        }
    }

    get type()
    {
        return this.#type;
    }

    set type(type = "")
    {
        if (ElementEx.type(type) === "string" && type.trim() !== "")
        {
            this.#type = type;
        }
        else
        {
            throw new TypeError("Type should be a non-blank string");
        }
    }

    get caption()
    {
        throw new TypeError("This method/property is not yet implemented! [UIEx.caption]");
    }

    set caption(caption = "")
    {
        throw new TypeError("This method/property is not yet implemented! [UIEx.caption]");
    }

    get container()
    {
        return this.#container;
    }

    set container(container = new HTMLElement())
    {
        if (ElementEx.isElement(container))
        {
            if (ElementEx.isElement(this.#container))
            {
                throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
            }
            else
            {
                this.#container = container;
            }
        }
        else
        {
            throw new TypeError("Container should be an HTML Element.");
        }
    }

    static get UIExTextClasses()
    {
        return [
            "LabelEx"
        ];
    }

    static get UIExControlClasses()
    {
        return [
            "TextboxEx",
            "NumberFieldEx",
            "DateFieldEx",
            "TimeFieldEx",
            "DateTimeFieldEx",
            "InputButtonEx",
            "ButtonEx",
            "ComboEx",
            "DropDownEx",
            "ListBoxEx",
            "RadioButtonEx",
            "CheckboxEx",
            "RadioButtonGroupEx",
            "CheckboxGroupEx"
        ];
    }

    static get UIExContainerClasses()
    {
        return [
            "SpanEx",
            "DivEx",
            "FrameEx",
            "TableEx",
            "DataFormEx",
            "DialogEx"
        ];
    }

    static get UIExType()
    {
        return this.#UIExType;
    }
    
    get UIExType()
    {
        return UIEx.#UIExType;
    }

    get instanceCount()
    {
        return UIEx.#instanceCount;
    }

    resetUIEx()
    {
        this.#type = "";
        this.#container = null;
    }

    destroy()
    {
        if (ElementEx.isElement(this.container))
        {
            this.container.remove();
            this.resetUIEx();
        }
    }
}

class LabelEx extends UIEx
{
    static #UIExType = "LabelEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(UIEx.UIExType);
        this.autoId = this.UIExType + LabelEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), type = "label", caption = "")
    {
        try
        {
            type = (ElementEx.type(type) === "string" && type.trim() !== "" ? type : "label");
            this.setupFromHTMLElement(ElementEx.createSimple(type, ElementEx.NO_NS, "label-ex", (ElementEx.isElement(parentHTMLElement) ? parentHTMLElement : null)));
            this.caption = (ElementEx.type(caption) === "string" ? caption : "");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), type:"label", caption:"", id:""})
    {
        try
        {
            this.setup(config.parentHTMLElement, config.type, config.caption);

            if ("id" in config && ElementEx.type(config.id) === "string" && config.id.trim() !== "")
            {
                this.id = config.id.trim();
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLLabelElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains("label-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;
                super.type = htmlElement.tagName.toLowerCase();
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"label-ex\"");
            }

            return this;
        }
    }

    get type()
    {
        if (ElementEx.isElement(this.container))
        {
            return super.type;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set type(type = "")
    {
        throw new SyntaxError("Unable to change value of read-only property.");
    }

    get caption()
    {
        if (ElementEx.isElement(this.container))
        {
            return this.container.innerHTML;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set caption(caption = "")
    {
        this.container.innerHTML = caption;
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return LabelEx.#UIExType;
    }

    get instanceCount()
    {
        return LabelEx.#instanceCount;
    }
}

class ContainerEx extends UIEx
{
    static #UIExType = "ContainerEx";
    static #instanceCount = 0;
    #labelEx = null;
    autoId = "";
    
    constructor()
    {
        if (ContainerEx.UIExType === arguments[0])
        {
            super(UIEx.UIExType);
            this.autoId = this.UIExType + ContainerEx.#instanceCount++;
        }
        else
        {
            throw new TypeError("This class cannot be instantiated directly.");
        }
    }
    
    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple((this.type === "frame" ? "fieldset" : this.type), ElementEx.NO_NS, this.type + "-ex", (ElementEx.isElement(parentHTMLElement) ? parentHTMLElement : null)))

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", id:""})
    {
        try
        {
            this.setup(config.parentHTMLElement);

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                        // do nothing
                        break;
                    case "caption":
                        this[key] = (ElementEx.type(config.caption) === "string" ? config.caption : "");
                        break;
                    case "id":
                        this[key] = config[key].trim();
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else if (ElementEx.type(config[key]) === "function")
                        {
                            config[key](this);
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node) && node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                    {
                        this.labelEx = new LabelEx().setupFromHTMLElement(node);
                    }
                });
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }

            return this;
        }
    }

    setHTMLContent(html = "")
    {
        if (ElementEx.isElement(this.container))
        {
            if (this.labelEx !== null)
            {
                this.labelEx.container.remove();
                if (this.spacer.length > 0)
                {
                    this.spacer[0].remove();
                }
            }

            this.container.innerHTML = html;

            if (this.labelEx !== null)
            {
                if (this.spacer.length == 0)
                {
                    this.spacer.push(document.createTextNode(" "));
                }

                this.container.prepend(this.labelEx.container, this.spacer[0]);
            }

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addContent(content = new Node())
    {
        if (ElementEx.isElement(this.container))
        {
            this.container.appendChild(content);
            if (!("uiEx" in content))
            {
                content.uiEx = this;
            }

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addExContent(exContent = new UIEx())
    {
        if (ElementEx.isElement(this.container))
        {
            this.addContent(exContent.container);
            exContent.parentUIEx = this;

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get captionHeaderLevel()
    {
        if (this.labelEx !== null && this.labelEx.container.tagName[0].toLowerCase() === "h")
        {
            return Number.parseInt(this.labelEx.container.tagName[1]);
        }
        else
        {
            return 0;
        }
    }
    
    set captionHeaderLevel(level = 0)
    {
        if (this.captionHeaderLevel !== level)
        {
            let newTag = ElementEx.replace(this.labelEx.container, (level > 0 && level < 7 ? "h" + level : "span"));

            this.labelEx.resetUIEx();
            this.labelEx.setupFromHTMLElement(newTag);
        }
    }

    get caption()
    {
        return (this.labelEx === null ? "" : this.labelEx.caption);
    }

    set caption(caption = "")
    {
        if (caption === "")
        {
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.destroy();
                this.labelEx = null;
            }
        }
        else
        {
            if (this.labelEx === null)
            {
                this.labelEx = new LabelEx().setup(this.container, "span");
                if (this.labelEx.container !== this.container.childNodes[0])
                {
                    if (this.spacer.length === 0)
                    {
                        this.spacer.push(document.createTextNode(" "));
                    }

                    this.container.prepend(this.labelEx.container, this.spacer[0]);
                }
                this.labelEx.parentUIEx = this;
            }
    
            this.labelEx.caption = caption;
        }
    }

    get labelEx()
    {
        return this.#labelEx;
    }

    set labelEx(labelEx = new LabelEx())
    {
        this.#labelEx = labelEx;
    }

    get vertical()
    {
        return (this.container instanceof HTMLElement && this.container.classList.contains("vertical"));
    }

    set vertical(setting = true)
    {
        if (this.container instanceof HTMLElement)
        {
            this.container.classList.toggle("vertical", setting);
            if (this.container.classList.length == 0)
            {
                this.container.removeAttribute("class");
            }
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ContainerEx.#UIExType;
    }

    get instanceCount()
    {
        return ContainerEx.#instanceCount;
    }

    resetUIEx()
    {
        let type = this.type;
        this.spacer = [];
        this.caption = "";
        this.container.remove();
        super.resetUIEx();
        this.type = type;
    }
}

class SpanEx extends ContainerEx
{
    static #UIExType = "SpanEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "span";
        this.autoId = this.UIExType + SpanEx.#instanceCount++;
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return SpanEx.#UIExType;
    }

    get instanceCount()
    {
        return SpanEx.#instanceCount;
    }
}

class DivEx extends ContainerEx
{
    static #UIExType = "DivEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "div";
        this.autoId = this.UIExType + DivEx.#instanceCount++;
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DivEx.#UIExType;
    }

    get instanceCount()
    {
        return DivEx.#instanceCount;
    }
}

class FrameEx extends ContainerEx
{
    static #UIExType = "FrameEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "frame";
        this.autoId = this.UIExType + FrameEx.#instanceCount++;
    }

    get caption()
    {
        return super.caption;
    }

    set caption(caption = "")
    {
        if (caption === "")
        {
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.destroy();
                this.labelEx = null;
            }
        }
        else
        {
            if (this.labelEx === null)
            {
                this.labelEx = new LabelEx().setup(this.container, "legend");
                if (this.labelEx.container !== this.container.childNodes[0])
                {
                    if (this.spacer.length === 0)
                    {
                        this.spacer.push(document.createTextNode(" "));
                    }
                    
                    this.container.prepend(this.labelEx.container, this.spacer[0]);
                }
                this.labelEx.parentUIEx = this;
            }
    
            this.labelEx.caption = caption;
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return FrameEx.#UIExType;
    }

    get instanceCount()
    {
        return FrameEx.#instanceCount;
    }
}

class TableEx extends ContainerEx
{
    static #UIExType = "TableEx";
    static #instanceCount = 0;
    autoId = "";
    thead = null;
    tbody = null;
    tfoot = null;
    headers = {}; // information on all table headers
    dataHeaders = []; // header names of the actual headers that describe the data below them the most
    rows = []; // {tr:null, td:[], data:[]}
    footers = {};
    
    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "table";
        this.autoId = this.UIExType + TableEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), type = "table")
    {
        if (ElementEx.isElement(this.table))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            this.type = type = (type === "div" || type === "span" ? type : "table");
            this.table = ElementEx.createSimple(this.type, ElementEx.NO_NS, (this.type === "table" ? "" : "table ") + "table-ex", (ElementEx.isElement(parentHTMLElement) ? parentHTMLElement : null));
            this.tbody = ElementEx.create((this.type === "table" ? "tbody" : this.type), ElementEx.NO_NS, this.table);

            if (this.type !== "table")
            {
                this.tbody.classList.add("tbody");
            }

            this.table.uiEx = this;
            this.tbody.uiEx = this;

            return this;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", id:"", type:""})
    {
        try
        {
            this.setup(config.parentHTMLElement, config.type);

            if ("id" in config && ElementEx.type(config.id) === "string" && config.id.trim() !== "")
            {
                this.id = config.id.trim();
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.table))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else if (ElementEx.isElement(htmlElement) && (htmlElement instanceof HTMLTableElement || htmlElement.classList.contains("table") || htmlElement.classList.contains("table-ex")))
        {
            this.table = htmlElement;
            this.table.classList.add("table-ex");
            this.table.uiEx = this;
            let tableSections = Array.from(this.table.children);
            let invalidSections = tableSections.filter(tableSection=>!(tableSection instanceof HTMLTableSectionElement || tableSection instanceof HTMLTableCaptionElement || tableChild.classList.contains("caption") || tableChild.classList.contains("thead") || tableChild.classList.contains("tbody") || tableChild.classList.contains("tfoot")));

            if (invalidSections.length > 0)
            {
                throw new SyntaxError("Invalid table structure");
            }

            for (const tableSection of tableSections)
            {
                if (tableSection instanceof HTMLTableCaptionElement || tableSection.classList.contains("caption"))
                {
                    this.labelEx = new LabelEx().setupFromHTMLElement(tableSection);
                    this.labelEx.parentUIEx = this;
                }
                else if (tableSection.tagName.toLowerCase() === "thead" || tableSection.classList.contains("thead"))
                {
                    this.thead = tableSection;
                    this.thead.uiEx = this;

                    let level = 1, maxLevel = this.thead.children.length, tr = this.thead.firstElementChild;
                    let setupHeaderCell = (cell, parentHeader = null)=>{
                        let headerInfo = null, colSpan = 0, maxDepth = 0;

                        // console.log(cell, parentHeader, cell instanceof HTMLTableCellElement, cell.classList.contains("th"), cell.classList.contains("td"));
                        if (cell instanceof HTMLTableCellElement || cell.classList.contains("th") || cell.classList.contains("td"))
                        {
                            headerInfo = {
                                name:cell.dataset.headerName,
                                tr:cell.parentElement,
                                th:cell,
                                parentHeader:(parentHeader instanceof HTMLTableCellElement  || cell.classList.contains("th") || cell.classList.contains("td") ? parentHeader : null),
                                subheaders:[],
                                level:Array.from(this.thead.children).findIndex(tr=>Array.from(tr.children).includes(cell)) + 1,
                                contenteditable:("contenteditable" in cell.dataset && cell.dataset.contenteditable === "true"),
                                colSpan:(cell.hasAttribute("colspan") ? parseInt(cell.getAttribute("colspan")) : 1),
                                descendantDepth:0,
                            }

                            this.headers[headerInfo.name] = headerInfo;

                            cell.classList.add("processed");
                            
                            if (headerInfo.level + (cell.hasAttribute("rowspan") ? parseInt(cell.getAttribute("rowspan")) : 1) - 1 === maxLevel)
                            {
                                this.dataHeaders.push(headerInfo.name);
                            }
                            else
                            {
                                colSpan = headerInfo.colSpan;
    
                                for (const th of Array.from(headerInfo.tr.nextElementSibling.children))
                                {
                                    if (th.classList.contains("processed"))
                                    {
                                        continue;
                                    }

                                    let childHeaderInfo = setupHeaderCell(th, cell);
                                    colSpan -= childHeaderInfo.colSpan;
                                    headerInfo.subheaders.push(childHeaderInfo);
                                    maxDepth = Math.max(maxDepth, childHeaderInfo.descendantDepth)
                                    
                                    if (colSpan === 0)
                                    {
                                        break;
                                    }
                                }

                                headerInfo.descendantDepth += maxDepth + 1;
                            }
                            
                            return headerInfo; 
                        }
                        else
                        {
                            throw new TypeError("Invalid table structure.");
                        }
                    };
                    
                    for (const cell of Array.from(this.thead.children[0].children))
                    {
                        setupHeaderCell(cell);
                    }

                    for (const key in this.headers)
                    {
                        let header = this.headers[key];
                        header.th.classList.remove("processed");
                        if (header.th.classList.length === 0)
                        {
                            header.th.removeAttribute("class");
                        }
                        header.th.uiEx = this;
                    }
                }
                else if (tableSection.tagName.toLowerCase() === "tbody" || tableSection.classList.contains("tbody"))
                {
                    this.tbody = tableSection;
                    this.tbody.uiEx = this;

                    for (const tr of Array.from(this.tbody.children))
                    {
                        [{ tr:tr, td:{}, data:{} }].forEach(rowInfo=>{
                            this.rows.push(rowInfo);
                            tr.rowInfo = rowInfo;
                            tr.uiEx = this;

                            let indexOffset = 0;

                            Array.from(tr.children).forEach((td, index)=>{
                                if (td instanceof HTMLTableCellElement)
                                {
                                    index -= indexOffset;
                                    rowInfo["td"][this.dataHeaders[index]] = td;
                                    rowInfo["data"][this.dataHeaders[index]] = td.textContent;
                                    td.uiEx = this;
                                    td.headerName = this.dataHeaders[index];
                                    if (td.headerName !== null && td.headerName !== undefined && "contenteditable" in this.headers[td.headerName] && this.headers[td.headerName].contenteditable)
                                    {
                                        td.tabIndex = 0;
                                        td.addEventListener("focus", TableEx.editableCellFocusEvent);
                                        td.addEventListener("blur", TableEx.editableCellBlurEvent);
                                        td.addEventListener("keyup", TableEx.editableCellNavigation);
                                        ElementEx.create("input", ElementEx.NO_NS, td, null, "type", "hidden", "name", td.headerName + "[]", "value", td.textContent);
                                    }
                                }
                                else
                                {
                                    indexOffset++;
                                }
                            });
                        });
                    }
                }
                else if (tableSection.tagName.toLowerCase() === "tfoot" || tableSection.classList.contains("tfoot"))
                {
                    this.tfoot = tableSection;
                    this.tfoot.uiEx = this;

                    // ADD CODE FOR SCANNING TFOOT ELEMENT
                }
            }

            return this;
        }
        else
        {
            throw new TypeError("Invalid table element.");
        }
    }

    // static #checkStructure(htmlElement = new HTMLTableElement())
    // {
    //     isValid = true;

    //     if (ElementEx.isElement(htmlElement) && (htmlElement.classList.contains("table-ex") || htmlElement instanceof HTMLTableElement))
    //     {
    //         Array.from(htmlElement.children).filter(tableChild=>{
    //             tableChild.classList.contains("thead") || tableChild.
    //         });
    //     }
    // }

    get captionHeaderLevel()
    {
        return 0;
    }
    
    set captionHeaderLevel(level = 0)
    {
        // DO NOTHING
    }

    get caption()
    {
        return super.caption;
    }

    set caption(caption = "")
    {
        if (caption === "")
        {
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.destroy();
                this.labelEx = null;
            }
        }
        else
        {
            if (this.labelEx === null)
            {
                this.labelEx = new LabelEx().setup(this.table, "caption");
                this.table.prepend(this.labelEx.container);
                this.labelEx.parentUIEx = this;
            }
    
            this.labelEx.caption = caption;
        }
    }

    setupHeaders(headers = [{name:"", text:"", subheaders:[], contenteditable:false}])
    {
        let addHeader = null, tr = null, maxDepth = 0;

        if (ElementEx.isElement(this.thead))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            addHeader = (header = {name:"", text:"", subheaders:[]})=>{
                let maxDescendantDepth = 0, childDescendantDepth = 0, subheaderColSpan = 0, currentLevel = 0;

                if (!ElementEx.isElement(this.thead))
                {
                    this.thead = ElementEx.create((this.type === "table" ? "thead" : this.type), ElementEx.NO_NS, this.table, this.tbody);
                    this.thead.uiEx = this;

                    if (this.type !== "table")
                    {
                        this.thead.classList.add("thead");
                    }

                    tr = ElementEx.create((this.type === "table" ? "tr" : this.type), ElementEx.NO_NS, this.thead);
                    tr.uiEx = this;

                    if (this.type !== "table")
                    {
                        tr.classList.add("tr");
                    }
                }
                else if (tr === null || tr === undefined)
                {
                    throw new ReferenceError("Missing row reference");
                }

                currentLevel = Array.from(this.thead.children).findIndex(row=>tr === row) + 1;

                this.headers[header.name] = {
                    name:header.name,
                    tr:tr,
                    th:ElementEx.create((this.type === "table" ? "th" : this.type), ElementEx.NO_NS, tr),
                    parentHeader:null,
                    subheaders:[],
                    level:currentLevel,
                    contenteditable:("contenteditable" in header && ElementEx.type(header["contenteditable"]) === "boolean" ? header["contenteditable"] : false),
                    descendantDepth:0, // 0 for no subheaders
                    colSpan:0,
                }

                this.headers[header.name].th.innerHTML = header.text;
                this.headers[header.name].th.headerInfo = this.headers[header.name]; // reference to header info
                this.headers[header.name].th.uiEx = this;
                if (this.type !== "table")
                {
                    this.headers[header.name].th.classList.add("th");
                }

                if (header.subheaders === null || header.subheaders === undefined || header.subheaders.length === 0)
                {
                    this.dataHeaders.push(header.name);
                    this.headers[header.name].colSpan = 1;
                }
                else
                {
                    if (currentLevel === this.thead.children.length)
                    {
                        [ElementEx.create((this.type === "table" ? "tr" : this.type), ElementEx.NO_NS, this.thead)].forEach(trow=>{
                            if (this.type !== "table")
                            {
                                trow.classList.add("tr");
                            }
                        });
                    }

                    tr = tr.nextSibling;
                    currentLevel++;

                    for (const subheader of header.subheaders)
                    {
                        [childDescendantDepth, subheaderColSpan] = addHeader(subheader);

                        this.headers[header.name].subheaders.push(this.headers[subheader.name]);
                        this.headers[subheader.name].parentHeader = this.headers[header.name];

                        this.headers[header.name].colSpan += subheaderColSpan;
                        
                        maxDescendantDepth = Math.max(childDescendantDepth, maxDescendantDepth);
                    }
                    this.headers[header.name].descendantDepth += maxDescendantDepth + 1;

                    tr = tr.previousSibling;
                    currentLevel--;
                }
                return [this.headers[header.name].descendantDepth, this.headers[header.name].colSpan];
            };

            for (const header of headers)
            {
                let depth;
                [depth, ] = addHeader(header);

                maxDepth = Math.max(depth, maxDepth);
            }
            
            maxDepth++;

            for (const key in this.headers)
            {
                let rowspan = (maxDepth - this.headers[key].level - this.headers[key].descendantDepth == 0 || this.headers[key].descendantDepth == 0 ? maxDepth - this.headers[key].level - this.headers[key].descendantDepth + 1 : 1);

                if (this.headers[key].colSpan > 1)
                {
                    this.headers[key].th.setAttribute("colspan", this.headers[key].colSpan);
                }

                if (rowspan > 1)
                {
                    this.headers[key].th.setAttribute("rowspan", rowspan);
                }
            }
        }
    }

    setupFooters(footers = [{name:"", content:"", colSpan:1}]) // content is either a text node or an element
    {
        if (ElementEx.isElement(this.table))
        {
            if (ElementEx.isElement(this.tfoot))
            {
                throw new ReferenceError("The footer already exists.");
            }
            else
            {
                this.tfoot = ElementEx.create("tfoot", ElementEx.NO_NS, this.table);
                this.tfoot.uiEx = this;

                [ElementEx.create("tr", ElementEx.NO_NS, this.tfoot)].forEach(tr=>{
                    let footerColCount = 0;

                    tr.uiEx = this;

                    footers.forEach(footer=>{
                        footerColCount += ("colSpan" in footer && !isNaN(Number.parseInt(footer.colSpan)) && footer.colSpan > 1 ? footer.colSpan : 1);

                        if (footerColCount > this.dataHeaders.length)
                        {
                            throw new RangeError("Total footer column span width exceeds table width.");
                        }
                        
                        this.footers[footer.name] = {
                            tr:tr,
                            td:ElementEx.create((this.type === "table" ? "td" : this.type), ElementEx.NO_NS, tr),
                            colSpan:footer.colSpan,
                        }

                        this.footers[footer.name].td.uiEx = this;

                        if (this.type === "table")
                        {
                            this.footers[footer.name].td.classList.add("td");
                        }

                        if ("colSpan" in footer && !isNaN(Number.parseInt(footer.colSpan)) && footer.colSpan > 1)
                        {
                            this.footers[footer.name].td.setAttribute("colspan", footer.colSpan);
                        }
                        
                        if (ElementEx.type(footer.content) === "string")
                        {
                            this.footers[footer.name].td.innerHTML = footer.content;
                        }
                        else if (ElementEx.isElement(footer.content) || ElementEx.isTextNode(footer.content))
                        {
                            this.footers[footer.name].td.appendChild(footer.content);
                        }
                    });
                });
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addRow(rowData = {}) // will extract the data to be inserted using the names in the dataHeaders member variable
    {
        let row = {
            tr:ElementEx.create("tr", ElementEx.NO_NS, this.tbody),
            td:{},
            data:{}
        };

        this.rows.push(row);
        row.tr.rowInfo = row;
        row.tr.uiEx = this;

        if (typeof(rowData) !== "object" || rowData === null || rowData === undefined)
        {
            rowData = {};
        }

        this.dataHeaders.forEach(headerName=>{
            row.data[headerName] = (headerName in rowData ? rowData[headerName] ?? "" : "");
            row.td[headerName] = ElementEx.htmlToElement("<td>" + row.data[headerName] + "</td>");
            row.td[headerName].uiEx = this;
            row.td[headerName].headerName = headerName;
            row.tr.appendChild(row.td[headerName]);
            if (this.headers[headerName].contenteditable)
            {
                row.td[headerName].tabIndex = 0;
                row.td[headerName].addEventListener("focus", TableEx.editableCellFocusEvent);
                row.td[headerName].addEventListener("blur", TableEx.editableCellBlurEvent);
                row.td[headerName].addEventListener("keyup", TableEx.editableCellNavigation);
                ElementEx.create("input", ElementEx.NO_NS, row.td[headerName], null, "type", "hidden", "name", headerName + "[]", "value", row.data[headerName]);
            }
        });

        return row.tr;
    }

    static editableCellFocusEvent(event = new Event())
    {
        if (this.children.length > 0)
        {
            let el = Array.from(this.children).find(element=>{
                return (element instanceof HTMLInputElement && element.type === "hidden")
            });
            if (el !== null && el !== undefined)
            {
                el.remove();
            }
        }
        this.contentEditable = "true";

        var el = this;
        var range = document.createRange();
        var sel = window.getSelection();
        
        range.selectNodeContents(el);
        
        sel.removeAllRanges();
        sel.addRange(range);
    }

    static editableCellBlurEvent(event = new Event())
    {
        this.contentEditable = "inherit";
        this.append(ElementEx.htmlToElement("<input type=\"hidden\" name=\"" + this.headerName + "[]\" value=\"" + this.textContent + "\">"));
    }

    static editableCellNavigation(event = new KeyboardEvent())
    {
        let td = this;
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

    deleteRowIndex(i = 0)
    {
        if (i >= this.rows.length || i < 0)
        {
            throw new RangeError("Row index specified is out of bounds.");
        }
        else
        {
            this.rows.splice(i, 1)[0].tr.remove();
        }
    }

    deleteRow(tr = new HTMLTableRowElement())
    {
        try
        {
            this.deleteRowIndex(this.getRowIndex(tr));
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setHTMLContent(htmlContent = "", dataHeader = "") // add HTML content to the last row under a specified dataHeader; will add a row if no rows are present
    {
        let rowIndex = 0;

        if (this.tbody.children.length === 0)
        {
            this.addRow({});
        }

        rowIndex = this.tbody.children.length - 1;

        if (this.dataHeaders.includes(dataHeader))
        {
            this.rows[rowIndex].data[dataHeader] = htmlContent;
            this.rows[rowIndex].td[dataHeader].innerHTML = htmlContent;
        }
        else
        {
            throw new TypeError("Invalid dataHeader specified.");
        }
    }

    addContent(content = new Node(), dataHeader = "") // add content to the last row under a specified dataHeader; will add a row if no rows are present
    {
        let rowIndex = 0;
        
        if (this.tbody.children.length === 0)
        {
            this.addRow({});
        }

        rowIndex = this.tbody.children.length - 1;
        
        if (this.dataHeaders.includes(dataHeader))
        {
            this.rows[rowIndex].td[dataHeader].append(content);
            this.rows[rowIndex].data[dataHeader] = this.rows[rowIndex].td[dataHeader].innerHTML;
        }        
        else
        {
            throw new TypeError("Invalid dataHeader specified.");
        }
    }

    addExContent(exContent = new UIEx(), dataHeader = "") // add a UIEx component to the last row under a specified dataHeader; will add a row if no rows are present
    {
        try
        {
            exContent.parentUIEx = this;
            this.addContent(exContent.container, dataHeader);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    insertHTMLContent(htmlContent = "", rowIndex = 0, columnIndex = 0) // for manual insertion of HTML code; will cause the addition of rows if the specified row is beyond the row count; will raise an RangeError if a column proves to be beyond the column count
    {
        if (columnIndex >= this.dataHeaders.length || columnIndex < 0)
        {
            throw new RangeError("The specified columnIndex is out of range.");
        }

        while (rowIndex >= this.rows.length)
        {
            this.addRow({});
        }

        this.rows[rowIndex].data[this.dataHeaders[columnIndex]] = htmlContent;
        this.rows[rowIndex].td[this.dataHeaders[columnIndex]].innerHTML = htmlContent;
    }

    insertContent(content = new Node(), rowIndex = 0, columnIndex = 0) // for manual insertion of data; will cause the addition of rows if the specified row is beyond the row count; will raise an RangeError if a column proves to be beyond the column count
    {
        if (columnIndex >= this.dataHeaders.length || columnIndex < 0)
        {
            throw new RangeError("The specified columnIndex is out of range.");
        }

        while (rowIndex >= this.rows.length)
        {
            this.addRow({});
        }

        this.rows[rowIndex].td[this.dataHeaders[columnIndex]].append(content);
        this.rows[rowIndex].data[this.dataHeaders[columnIndex]] = this.rows[rowIndex].td[this.dataHeaders[columnIndex]].innerHTML;
    }

    insertExContent(exContent = new UIEx(), rowIndex = 0, columnIndex = 0) // for manual insertion of UIEx components; will cause the addition of rows if the specified row is beyond the row count; will raise an EvalError if a column proves to be beyond the column count
    {
        try
        {
            exContent.parentUIEx = this;
            this.insertContent(exContent.container, rowIndex, columnIndex);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get table()
    {
        return super.container;
    }

    set table(table = new HTMLTableElement())
    {
        if (ElementEx.isElement(table) && (table.classList.contains("table-ex") || table instanceof HTMLTableElement))
        {
            super.container = table;
            table.classList.add("table-ex");            
        }
        else
        {
            throw new TypeError("Invalid table.");
        }
    }

    getRowIndex(tr = new HTMLTableRowElement())
    {
        let rowIndex = this.rows.findIndex(row=>row.tr === tr);

        if (rowIndex < 0)
        {
            throw new RangeError("The specified row does not belong to this table.");
        }

        return rowIndex;
    }

    rowCanMoveUp(tr = new HTMLTableRowElement())
    {
        try
        {
            let rowIndex = this.getRowIndex(tr);
            return rowIndex > 0 && rowIndex <= this.rows.length - 1;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    rowCanMoveDown(tr = new HTMLTableRowElement())
    {
        try
        {
            let rowIndex = this.getRowIndex(tr);
            return rowIndex >= 0 && rowIndex < this.rows.length - 1;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    moveRowUp(tr = new HTMLTableRowElement())
    {
        try
        {
            let rowIndex = -1;
            if (this.rowCanMoveUp(tr))
            {
                rowIndex = this.getRowIndex(tr);
                tr.after(tr.previousElementSibling);
                this.rows[rowIndex] = this.rows[rowIndex - 1];
                this.rows[rowIndex - 1] = tr.rowInfo;
            }
        }
        catch (ex)
        {
            throw ex;
        }
    }

    moveRowDown(tr = new HTMLTableRowElement())
    {
        try
        {
            let rowIndex = -1;
            if (this.rowCanMoveDown(tr))
            {
                rowIndex = this.getRowIndex(tr);
                tr.before(tr.nextElementSibling);
                this.rows[rowIndex] = this.rows[rowIndex + 1];
                this.rows[rowIndex + 1] = tr.rowInfo;
            }
        }
        catch (ex)
        {
            throw ex;
        }
    }

    switchRows(tr1 = new HTMLTableRowElement(), tr2 = new HTMLTableRowElement())
    {
        try
        {
            let [i1, i2] = [this.getRowIndex(tr1), this.getRowIndex(tr2)];

            if (i1 >= 0 && i2 >= 0)
            {
                this.rows[i1] = tr2.rowInfo;
                this.rows[i2] = tr1.rowInfo;
                ElementEx.switch(tr1, tr2);
            }
        }
        catch (ex)
        {
            throw ex;
        }
    }

    moveRowToPosition(tr = new HTMLTableRowElement(), rowPosition = 0)
    {
        try
        {
            let oldRowIndex = this.getRowIndex(tr);
    
            if (rowPosition < 0 || rowPosition >= this.tbody.children.length)
            {
                throw new RangeError("The specified rowPosition is out of range.");
            }
    
            this.rows.splice(oldRowIndex, 1);
            this.rows.splice(rowPosition, 0, tr.rowInfo);
            this.tbody.insertBefore(tr, this.tbody.children[rowPosition + (oldRowIndex <= rowPosition ? 1 : 0)]);
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
        return TableEx.#UIExType;
    }

    get instanceCount()
    {
        return TableEx.#instanceCount;
    }
}

class ControlEx extends UIEx
{
    static #UIExType = "ControlEx";
    static #instanceCount = 0;
    #labelEx = null;
    autoId = "";
    #control = null;
    #statusPane = null;
    #statusTimeOut = 3;
    #statusResetTimeOut = null;
    #eventCallbacks = {}; // {click:[], keyup:[], keydown:[], ...}
    
    constructor()
    {
        if (ControlEx.UIExType === arguments[0])
        {
            super(UIEx.UIExType);
            this.autoId = this.UIExType + ControlEx.#instanceCount++;
        }
        else
        {
            throw new TypeError("This class cannot be instantiated directly.");
        }
    }

    get labelEx()
    {
        return this.#labelEx;
    }

    set labelEx(labelEx = new LabelEx())
    {
        this.#labelEx = labelEx;
    }

    get control()
    {
        return this.#control;
    }

    set control(control = new HTMLElement())
    {
        this.#control = control;
    }

    get statusPane()
    {
        return this.#statusPane;
    }

    set statusPane(statusPane = new HTMLElement())
    {
        if (!(this.#statusPane instanceof HTMLElement))
        {
            this.#statusPane = statusPane;
        }
    }

    get id()
    {
        if (ElementEx.isElement(this.control))
        {
            return (this.control !== null && this.control.id !== null && this.control.id !== "" ? this.control.id : "");
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set id(id = "")
    {
        if (ElementEx.isElement(this.control))
        {
            // if (ElementEx.type(id) === "string" && id.trim() !== "")
            // {
                id = (id === null || id === undefined || id.trim() === "" ? this.autoId : id);
                this.control.id = id;
                
                if (this.labelEx !== null && this.labelEx !== undefined)
                {
                    this.labelEx.container.htmlFor = id;
                }
            // }
            // else
            // {
            //     throw new TypeError("Id should be a non-blank string");
            // }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get name()
    {
        if (ElementEx.isElement(this.control))
        {
            return (this.control !== null && this.control.name !== null && this.control.name !== "" ? this.control.name : "");
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set name(name = "")
    {
        if (ElementEx.isElement(this.control))
        {
            if (ElementEx.type(name) === "string" && name.trim() !== "")
            {
                this.control.name = name;
            }
            else
            {
                throw new TypeError("Name should be a non-blank string");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get label()
    {
        return this.caption;
    }

    set label(caption = "")
    {
        this.caption = caption;
    }

    get caption()
    {
        return (this.labelEx === null ? "" : this.labelEx.caption);
    }

    set caption(caption = "")
    {
        if (ElementEx.isElement(this.control))
        {
            if (caption === "")
            {
                if (this.labelEx !== null && this.labelEx !== undefined)
                {
                    this.labelEx.destroy();
                    this.labelEx = null;
                }
            }
            else
            {
                if (this.labelEx === null)
                {
                    this.labelEx = new LabelEx().setup(this.container);
                    this.id = this.id;

                    if (this.labelEx.container !== this.container.childNodes[0])
                    {
                        if (this.spacer.length === 0)
                        {
                            this.spacer.push(document.createTextNode(" "));
                        }
                        this.container.insertBefore(this.spacer[0], this.container.childNodes[0]);
                        this.container.insertBefore(this.labelEx.container, this.container.childNodes[0]);
                    }
                    this.labelEx.parentUIEx = this;
                }
        
                this.labelEx.caption = caption;
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get tooltip()
    {
        return (ElementEx.isElement(this.control) ? this.control.title : "");
    }

    set tooltip(tooltip = "")
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(tooltip) !== "string" || tooltip.trim() !== ""))
            {
                this.control.title = tooltip;
                this.control.title = this.control.title.trim();
            }
            else
            {
                this.control.removeAttribute("title");
            }
        }

        if (ElementEx.isElement(this.container))
        {
            if ((ElementEx.type(tooltip) !== "string" || tooltip.trim() !== ""))
            {
                this.container.title = tooltip;
                this.container.title = this.container.title.trim();
            }
            else
            {
                this.container.removeAttribute("title");
            }
        }

        if (this.labelEx !== null && this.labelEx !== undefined)
        {
            if ((ElementEx.type(tooltip) !== "string" || tooltip.trim() !== ""))
            {
                this.labelEx.container.title = tooltip;
                this.labelEx.container.title = this.labelEx.container.title.trim();
            }
            else
            {
                this.labelEx.container.removeAttribute("title");
            }
        }
    }

    get text() // for text values
    {
        throw new TypeError("This method/property is not yet implemented! [ControlEx.text]");
    }
    
    set text(text = "")
    {
        throw new TypeError("This method/property is not yet implemented! [ControlEx.text]");
    }

    get value() // for non-text values; may vary depending on subclass
    {
        throw new TypeError("This method/property is not yet implemented! [ControlEx.value]");
    }

    set value(value = "")
    {
        throw new TypeError("This method/property is not yet implemented! [ControlEx.value]");
    }

    get reversed()
    {
        return this.labelEx !== null && this.labelEx !== undefined && Array.from(this.container.children).findIndex(node => node === this.labelEx.container) > Array.from(this.container.children).findIndex(node => node === this.control);
    }

    reverse()
    {
        if (this.labelEx !== null && this.labelEx !== undefined)
        {
            const [a, b] = (this.reversed ? [this.control, this.labelEx.container] : [this.labelEx.container, this.control]);

            b.before(a);
            this.container.prepend(b);
        }
    }

    get vertical()
    {
        return (this.container instanceof HTMLElement && this.container.classList.contains("vertical"));
    }

    set vertical(setting = true)
    {
        if (this.container instanceof HTMLElement)
        {
            this.container.classList.toggle("vertical", setting);
            if (this.container.classList.length == 0)
            {
                this.container.removeAttribute("class");
            }
        }
    }

    get autofocus()
    {
        if (this.control instanceof HTMLInputElement || this.control instanceof HTMLSelectElement || this.control instanceof HTMLButtonElement)
        {
            return this.control.autofocus;
        }

        return false;
    }

    set autofocus(setting = true)
    {
        if (this.control instanceof HTMLInputElement || this.control instanceof HTMLSelectElement || this.control instanceof HTMLButtonElement)
        {
            this.control.autofocus = setting;
        }
    }

    focus()
    {
        console.log(this.UIExType);
        if (this.control instanceof HTMLInputElement || this.control instanceof HTMLSelectElement || this.control instanceof HTMLButtonElement)
        {
            this.control.focus();
        }
    }

    addStatusPane()
    {
        if (this.control instanceof HTMLElement)
        {
            if (this.spacer.length === 0)
            {
                this.spacer.push(document.createTextNode(" "));
            }

            this.spacer.push(document.createTextNode(" "));

            this.statusPane = ElementEx.createSimple("span", ElementEx.NO_NS, "status-pane", this.container);
            this.statusPane.before(this.spacer.slice(-1)[0]);
        }
    }

    setStatus(statusMsg = "", statusType = "information")
    {
        if (!(this.statusPane instanceof HTMLElement))
        {
            this.addStatusPane();
        }
        this.statusPane.classList.add(statusType);
        this.statusPane.innerHTML = statusMsg;

        this.#statusResetTimeOut = window.setTimeout(() => {
            this.resetStatus();
            this.#statusResetTimeOut = null;
        }, this.statusTimeOut * 1000);
    }

    showInfo(statusMsg = "")
    {
        this.setStatus(statusMsg, "information");
    }
    
    showSuccess(statusMsg = "")
    {
        this.setStatus(statusMsg, "success");
    }
    
    showSuccess(statusMsg = "")
    {
        this.setStatus(statusMsg, "wait");
    }
    
    showWarning(statusMsg = "")
    {
        this.setStatus(statusMsg, "warning");
    }
    
    raiseError(statusMsg = "")
    {
        this.setStatus(statusMsg, "error");
    }

    resetStatus()
    {
        if (this.statusPane instanceof HTMLElement)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.setAttribute("class", "status-pane");
        }
    }

    get statusTimeOut()
    {
        return this.#statusTimeOut;
    }

    set statusTimeOut(duration = 5)
    {
        if (ElementEx.type(duration) === "number")
        {
            this.#statusTimeOut = duration;
        }
    }

    get eventCallbacks()
    {
        return this.#eventCallbacks;
    }

    addEvent(eventType = "click", callback = event=>{})
    {
        const eventTypes = ["click", "keydown", "keyup", "keypress", "change", "focus", "blur"]; //  add more if necessary

        if (!eventTypes.includes(eventType))
        {
            throw new SyntaxError("Unknown event type.");
        }

        if (ElementEx.type(callback) !== "function")
        {
            throw new TypeError("Callback should be a function.");
        }    
        
        if (ElementEx.isElement(this.control))
        {
            if (this.eventCallbacks[eventType] === null || this.eventCallbacks[eventType] === undefined)
            {
                this.eventCallbacks[eventType] = [];
            }

            this.eventCallbacks[eventType].push(callback);

            this.control.addEventListener(eventType, this.eventCallbacks[eventType].slice(-1)[0]);
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    removeEvent(eventType = "click", callback = event=>{})
    {
        let callbackIndex = this.eventCallbacks[eventType].findIndex(event=>callback === event);
        if (callbackIndex > -1)
        {
            this.control.removeEventListener(eventType, this.eventCallbacks[eventType].splice(callbackIndex, 1));
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ControlEx.#UIExType;
    }

    get instanceCount()
    {
        return ControlEx.#instanceCount;
    }
}

class TextboxEx extends ControlEx
{
    static #UIExType = "TextboxEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "textbox";
        this.autoId = this.UIExType + TextboxEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), inputType = "text")
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, "textbox-ex", parentHTMLElement));
            this.control = ElementEx.create("input", ElementEx.NO_NS, this.container, null, "type", inputType);
            this.inputType = inputType;
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:"", inputType:"text"}) // the key `text` refers to the default text value
    {
        try
        {
            this.setup(config.parentHTMLElement);

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                        // do nothing
                        break;
                    case "label":
                    case "id":
                    case "text":
                    case "inputType":
                        this[key] = config[key].trim();
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else if (ElementEx.type(config[key]) === "function")
                        {
                            config[key](this);
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.tagName.toLowerCase() === "input" && (this.control === null || this.control === undefined))
                        {
                            this.control = node;
                            this.control.uiEx = this;

                            // if ("type" in node)
                            // {
                            //     this.inputType = node.type;
                            // }

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get text() // for text values
    {
        return this.value;
    }
    
    set text(text = "")
    {
        this.value = text;
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return this.control.value.trim();
    }

    set value(value = "")
    {
        this.control.value = (ElementEx.type(value) === "string" ? value : value.toString()).trim();
    }

    get inputType()
    {
        return (ElementEx.isElement(this.control) ? this.control.type : null);
    }

    set inputType(inputType = "text")
    {
        if (ElementEx.isElement(this.control))
        {
            this.control.type = inputType;
        }
        else
        {
            // do nothing; THIS IF-ELSE STATEMENT IS A HACK!!!!!!!!!!
        }
    }

    get blankStyle()
    {
        return (this.container instanceof HTMLElement && this.container.classList.contains("blank"));
    }

    set blankStyle(setting = true)
    {
        if (this.container instanceof HTMLElement)
        {
            this.container.classList.toggle("blank", setting);
            if (this.container.classList.length == 0)
            {
                this.container.removeAttribute("class");
            }
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return TextboxEx.#UIExType;
    }

    get instanceCount()
    {
        return TextboxEx.#instanceCount;
    }
}

class NumberFieldEx extends TextboxEx
{
    static #UIExType = "NumberFieldEx";
    static #instanceCount = 0;
    autoId = "";
    blankIsZero = false;
    
    constructor()
    {
        super(TextboxEx.UIExType);
        this.type = "numberfield";
        this.autoId = this.UIExType + NumberFieldEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setup(parentHTMLElement, "number");
            this.container.classList.remove(this.type + "-ex");
            this.type = "numberfield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:""}) // the key `text` refers to the default text value
    {
        try
        {
            this.type = "textbox";
            super.setupFromConfig(config);
            this.container.classList.remove(this.type + "-ex");
            this.type = "numberfield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setupFromHTMLElement(htmlElement);
            this.container.classList.remove(this.type + "-ex");
            this.type = "numberfield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get text()
    {
        return this.control.value;
    }

    set text(text = "")
    {
        super.text = text;
    }

    get value() // for non-text values; may vary depending on subclass
    {
        let i = this.valueInt, f = this.valueFloat;

        return (i === f ? i : f);
    }

    get valueInt()
    {
        return Number.parseInt((this.control.value === "" && this.blankIsZero ? "0" : this.control.value).trim());
    }

    get valueFloat()
    {
        return Number.parseFloat((this.control.value === "" && this.blankIsZero ? "0" : this.control.value).trim());
    }

    set value(value = "")
    {
        super.value = value;
    }

    get min()
    {
        if (ElementEx.isElement(this.control))
        {
            return this.control.min;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set min(number = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if (ElementEx.type(number) === "number" || (ElementEx.type(number) === "string" && !isNaN(Number.parseFloat(number))))
            {
                this.control.min = number;
            }
            else
            {
                throw new TypeError("Invalid number specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get max()
    {
        if (ElementEx.isElement(this.control))
        {
            return this.control.max;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set max(number = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if (ElementEx.type(number) === "number" || (ElementEx.type(number) === "string" && !isNaN(Number.parseFloat(number))))
            {
                this.control.max = number;
            }
            else
            {
                throw new TypeError("Invalid number specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get step()
    {
        if (ElementEx.isElement(this.control))
        {
            return this.control.step;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set step(number = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if (ElementEx.type(number) === "number" || (ElementEx.type(number) === "string" && !isNaN(Number.parseFloat(number))))
            {
                this.control.step = number;
            }
            else
            {
                throw new TypeError("Invalid number specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get size()
    {
        if (ElementEx.isElement(this.control))
        {
            return this.control.step;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set size(numberOfChars = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if (ElementEx.type(numberOfChars) === "number" || (ElementEx.type(numberOfChars) === "string" && !isNaN(Number.parseFloat(numberOfChars))))
            {
                this.control.size = numberOfChars;
            }
            else
            {
                throw new TypeError("Invalid number specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return NumberFieldEx.#UIExType;
    }

    get instanceCount()
    {
        return NumberFieldEx.#instanceCount;
    }
}

class DateFieldEx extends NumberFieldEx
{
    static #UIExType = "DateFieldEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(NumberFieldEx.UIExType);
        this.type = "datefield";
        this.autoId = this.UIExType + DateFieldEx.#instanceCount++;

        delete this["blankIsZero"];
        // THE FOLLOWING DON'T WORK; MIGHT AS WELL DELETE THEM
        delete this["valueInt"];
        delete this["get valueInt"];
        delete this["set valueInt"];
        delete this["valueFloat"];
        delete this["get valueFloat"];
        delete this["set valueFloat"];
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setup(parentHTMLElement);
            this.inputType = "date";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:""}) // the key `text` refers to the default text value
    {
        try
        {
            this.type = "textbox";
            super.setupFromConfig(config);
            this.inputType = "date";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setupFromHTMLElement(htmlElement);
            this.inputType = "date";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return new Date(this.text);
    }

    set value(value = "")
    {
        super.value = value;
    }

    get min()
    {
        return super.min;
    }

    set min(date = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(date) === "date" && date.toString() !== "Invalid Date") || new Date(date).toString() !== "Invalid Date")
            {
                this.control.min = date;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get max()
    {
        return super.max;
    }

    set max(date = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(date) === "date" && date.toString() !== "Invalid Date") || new Date(date).toString() !== "Invalid Date")
            {
                this.control.max = date;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DateFieldEx.#UIExType;
    }

    get instanceCount()
    {
        return DateFieldEx.#instanceCount;
    }
}

class TimeFieldEx extends NumberFieldEx
{
    static #UIExType = "TimeFieldEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(NumberFieldEx.UIExType);
        this.type = "timefield";
        this.autoId = this.UIExType + TimeFieldEx.#instanceCount++;

        delete this["blankIsZero"];
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setup(parentHTMLElement);
            this.inputType = "time";
            this.container.classList.remove(this.type + "-ex");
            this.type = "timefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:""}) // the key `text` refers to the default text value
    {
        try
        {
            this.type = "textbox";
            super.setupFromConfig(config);
            this.inputType = "time";
            this.container.classList.remove(this.type + "-ex");
            this.type = "timefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setupFromHTMLElement(htmlElement);
            this.inputType = "time";
            this.container.classList.remove(this.type + "-ex");
            this.type = "timefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return new Date(new Date() + " " + this.text);
    }

    set value(value = "")
    {
        super.value = value;
    }

    get min()
    {
        return super.min;
    }

    set min(time = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(time) === "date" && time.toString() !== "Invalid Date") || new Date(new Date() + " " + time).toString() !== "Invalid Date")
            {
                this.control.min = time;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get max()
    {
        return super.max;
    }

    set max(time = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(time) === "date" && time.toString() !== "Invalid Date") || new Date(new Date() + " " + time).toString() !== "Invalid Date")
            {
                this.control.max = time;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return TimeFieldEx.#UIExType;
    }

    get instanceCount()
    {
        return TimeFieldEx.#instanceCount;
    }
}

class DateTimeFieldEx extends NumberFieldEx
{
    static #UIExType = "DateTimeFieldEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(NumberFieldEx.UIExType);
        this.type = "datetimefield";
        this.autoId = this.UIExType + DateTimeFieldEx.#instanceCount++;

        delete this["blankIsZero"];
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setup(parentHTMLElement);
            this.inputType = "datetime-local";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datetimefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:""}) // the key `text` refers to the default text value
    {
        try
        {
            this.type = "textbox";
            super.setupFromConfig(config);
            this.inputType = "datetime-local";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datetimefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            this.type = "textbox";
            super.setupFromHTMLElement(htmlElement);
            this.inputType = "datetime-local";
            this.container.classList.remove(this.type + "-ex");
            this.type = "datetimefield";
            this.container.classList.add(this.type + "-ex");

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return new Date(this.text);
    }

    set value(value = "")
    {
        super.value = value;
    }

    get min()
    {
        return super.min;
    }

    set min(time = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(time) === "date" && time.toString() !== "Invalid Date") || new Date(new Date() + " " + time).toString() !== "Invalid Date")
            {
                this.control.min = time;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get max()
    {
        return super.max;
    }

    set max(time = null)
    {
        if (ElementEx.isElement(this.control))
        {
            if ((ElementEx.type(time) === "date" && time.toString() !== "Invalid Date") || new Date(new Date() + " " + time).toString() !== "Invalid Date")
            {
                this.control.max = time;
            }
            else
            {
                throw new TypeError("Invalid date specified.");
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DateTimeFieldEx.#UIExType;
    }

    get instanceCount()
    {
        return DateTimeFieldEx.#instanceCount;
    }
}

class InputButtonEx extends ControlEx
{
    static #UIExType = "InputButtonEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "input-button";
        this.autoId = this.UIExType + InputButtonEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), buttonType = "button")
    {
        if (ElementEx.type(buttonType) !== "string" || (buttonType !== "button" && buttonType !== "submit" && buttonType !== "reset"))
        {
            throw new SyntaxError("Specified buttonType is invalid.");
        }

        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, "input-button-ex", parentHTMLElement));
            this.control = ElementEx.create("input", ElementEx.NO_NS, this.container, null, "type", buttonType, "id", this.autoId);
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", id:"", buttonType:"button", clickCallback:clickEvent=>{}}) // the key `text` refers to the default text value
    {
        try
        {
            this.setup(config.parentHTMLElement);

            if ("caption" in config)
            {
                this.caption = config.caption.trim();
            }

            if ("id" in config)
            {
                this.id = config.id.trim();
            }

            if ("buttonType" in config)
            {
                if (ElementEx.type(config.buttonType) !== "string" || (config.buttonType !== "button" && config.buttonType !== "submit" && config.buttonType !== "reset"))
                {
                    throw new SyntaxError("Specified buttonType is invalid.");
                }

                this.buttonType = config.buttonType.trim();
            }

            if ("clickCallback" in config)
            {
                this.addEvent("click", config.clickCallback);
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.tagName.toLowerCase() === "input" && (this.control === null || this.control === undefined))
                        {
                            this.control = node;
                            this.control.uiEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get label()
    {
        return super.caption;
    }

    set label(label = "")
    {
        try
        {
            super.caption = label;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get caption()
    {
        return this.value;
    }

    set caption(caption = "")
    {
        this.value = caption;
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return this.control.value.trim();
    }

    set value(value = "")
    {
        this.control.value = (ElementEx.type(value) === "string" ? value : value.toString()).trim();
    }

    get buttonType()
    {
        return (ElementEx.isElement(this.control) ? this.control.type : null);
    }

    set buttonType(buttonType = "button")
    {
        if (ElementEx.isElement(this.control))
        {
            this.control.type = buttonType;
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return InputButtonEx.#UIExType;
    }

    get instanceCount()
    {
        return InputButtonEx.#instanceCount;
    }
}

class ButtonEx extends ControlEx
{
    static #UIExType = "ButtonEx";
    static #instanceCount = 0;
    autoId = "";
    
    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "button";
        this.autoId = this.UIExType + ButtonEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), buttonType = "button")
    {
        if (ElementEx.type(buttonType) !== "string" || (buttonType !== "button" && buttonType !== "submit" && buttonType !== "reset"))
        {
            throw new SyntaxError("Specified buttonType is invalid.");
        }

        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, "button-ex", parentHTMLElement));
            this.control = ElementEx.create("button", ElementEx.NO_NS, this.container, null, "type", buttonType, "id", this.autoId);
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", id:"", buttonType:"button", clickCallback:clickEvent=>{}}) // the key `text` refers to the default text value
    {
        try
        {
            this.setup(config.parentHTMLElement);

            if ("caption" in config)
            {
                this.caption = config.caption.trim();
            }

            if ("id" in config)
            {
                this.id = config.id.trim();
            }

            if ("buttonType" in config)
            {
                if (ElementEx.type(config.buttonType) !== "string" || (config.buttonType !== "button" && config.buttonType !== "submit" && config.buttonType !== "reset"))
                {
                    throw new SyntaxError("Specified buttonType is invalid.");
                }

                this.buttonType = config.buttonType.trim();
            }

            if ("clickCallback" in config)
            {
                this.addEvent("click", config.clickCallback);
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.tagName.toLowerCase() === "button" && (this.control === null || this.control === undefined))
                        {
                            this.control = node;
                            this.control.uiEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else if (node instanceof HTMLScriptElement)
                        {
                            // DO NOTHING
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get label()
    {
        return super.caption;
    }

    set label(label = "")
    {
        try
        {
            super.caption = label;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get caption()
    {
        return this.control.innerHTML;
    }

    set caption(caption = "")
    {
        this.control.innerHTML = caption;
    }

    addCaptionContent(content = new Node())
    {
        if (ElementEx.isElement(this.control))
        {
            this.control.appendChild(content);
            content.uiEx = this;

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return this.control.value.trim();
    }

    set value(value = "")
    {
        this.control.value = (ElementEx.type(value) === "string" ? value : value.toString()).trim();
    }

    get buttonType()
    {
        return (ElementEx.isElement(this.control) ? this.control.type : null);
    }

    set buttonType(buttonType = "button")
    {
        if (ElementEx.isElement(this.control))
        {
            this.control.type = buttonType;
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ButtonEx.#UIExType;
    }

    get instanceCount()
    {
        return ButtonEx.#instanceCount;
    }
}

class ButtonGroupEx extends ControlEx
{
    static #UIExType = "ButtonGroupEx";
    static #instanceCount = 0;
    autoId = "";
    #containerEx = null;
    #controlExs = [];
    
    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "input-button"; // button or input-button
        this.autoId = this.UIExType + ButtonGroupEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), type = "input-button")
    {
        try
        {
            this.type = type;
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, this.type + "-group-ex" + " span-ex", parentHTMLElement));

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", type:"input-button", buttonsInfo:[]}) // the key `text` refers to the default text value
    {
        try
        {
            this.setup(config.parentHTMLElement, config.type ?? "input-button");

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                    case "type":
                        // do nothing
                        break;
                    case "buttonsInfo":
                        for (const buttonInfo of config.buttonsInfo)
                        {
                            this.addButton(buttonInfo.text, buttonInfo.buttonType, buttonInfo.tooltip, buttonInfo.clickCallback);
                        }
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-group-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;
                this.containerEx = new SpanEx();
                this.containerEx.setupFromHTMLElement(this.container);

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && node.classList.contains("caption") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("button-ex"))
                        {
                            this.controlExs.push(new ButtonEx().setupFromHTMLElement(node));
                            this.controlExs.slice(-1)[0].parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("input-button-ex"))
                        {
                            this.controlExs.push(new InputButtonEx().setupFromHTMLElement(node));
                            this.controlExs.slice(-1)[0].parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get containerEx()
    {
        return this.#containerEx;
    }

    set containerEx(containerEx = new ContainerEx())
    {
        if (containerEx instanceof ContainerEx)
        {
            this.#containerEx = containerEx;
        }
        else
        {
            throw new TypeError("Argument should be a ContainerEx subclass.");
        }
    }

    get controlExs()
    {
        return this.#controlExs;
    }

    get id()
    {
        if (ElementEx.isElement(this.container))
        {
            return this.containerEx.id;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set id(id = "")
    {
        if (ElementEx.isElement(this.container))
        {
            id = (id === null || id === undefined || id.trim() === "" ? this.autoId : id);
            this.containerEx.id = id;
            
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.container.htmlFor = id;
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addButton(text = "", buttonType = "button", tooltip = "", clickCallback = clickEvent=>{})
    {
        let button = null;
        if (this.spacer.length == 0)
        {
            this.spacer.push(document.createTextNode(" "));
        }
        this.spacer.push(document.createTextNode(" "));
        this.container.appendChild(this.spacer.slice(-1)[0]);
        if (this.type === "button")
        {
            button = new ButtonEx().setupFromConfig({parentHTMLElement:this.container, caption:text, buttonType:buttonType, tooltip:tooltip});
        }
        else
        {
            button = new InputButtonEx().setupFromConfig({parentHTMLElement:this.container, caption:text, buttonType:buttonType, tooltip:tooltip});
        }
        button.addEvent("click", clickCallback);
        button.parentUIEx = this;
        this.controlExs.push(button);
        button.id = button.id;
        // this.id = this.id; // autogenerate id before assigning it as a group name
        // button.name = this.id;
        // if (value !== null && value !== undefined)
        // {
        //     button.value = value;
        // }
        if (this.controlExs.length > 1)
        {
            if (this.controlExs[0].reversed)
            {
                button.reverse();
            }
        }
    }

    addButtons(...buttons)
    {
        buttons.forEach(button=>this.addButton(button.text, button.buttonType, button.tooltip, button.clickCallback));
    }

    addStatusPane()
    {
        if (!(this.statusPane instanceof HTMLElement))
        {
            if (this.spacer.length === 0)
            {
                this.spacer.push(document.createTextNode(" "));
            }

            this.spacer.push(document.createTextNode(" "));

            this.statusPane = ElementEx.createSimple("span", ElementEx.NO_NS, "status-pane", this.container);
            this.statusPane.before(this.spacer.slice(-1)[0]);
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ButtonGroupEx.#UIExType;
    }

    get instanceCount()
    {
        return ButtonGroupEx.#instanceCount;
    }
}

class ComboEx extends TextboxEx
{
    static #UIExType = "ComboEx";
    static #instanceCount = 0;
    autoId = "";
    #datalist = null;

    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "textbox";
        this.autoId = this.UIExType + ComboEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, "textbox-ex", parentHTMLElement));
            this.control = ElementEx.create("input", ElementEx.NO_NS, this.container, null, "type", "text");
            this.datalist = ElementEx.create("datalist", ElementEx.NO_NS, this.container, null, "id", (this.id === "" ? this.autoId : this.id) + "-datalist");
            this.control.setAttribute("list", (this.id === "" ? this.autoId : this.id) + "-datalist");
            this.datalist.uiEx = this;
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:"", datalist:[{text:"", value:"", altList:""}]}) // the key `text` refers to the default text value
    {
        try
        {
            super.setupFromConfig(config);
            this.container.classList.add("combo-ex");

            if ("datalist" in config)
            {
                config.datalist.forEach(data=>{
                    this.addItem(data.text, data.value, data.altList);
                });
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            super.setupFromHTMLElement(htmlElement);
            this.container.classList.add("combo-ex");

            Array.from(this.container.children).forEach(node=>{
                if (!ElementEx.isElement(this.datalist) && ElementEx.isElement(node) && node instanceof HTMLDataListElement)
                {
                    this.datalist = node;
                    this.datalist.uiEx = this;
                }
            });

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get datalist()
    {
        return this.#datalist;
    }

    set datalist(datalist = new HTMLDataListElement())
    {
        if (this.#datalist instanceof HTMLDataListElement)
        {
            throw new ReferenceError("This object is already setup. It cannot be setup again unless reset.");
        }
        else if (datalist instanceof HTMLDataListElement)
        {
            this.#datalist = datalist;
        }
        else
        {
            throw new TypeError("Invalid datalist.");
        }
    }

    get text() // returns the text in the textbox input control
    {
        return this.control.value.trim();
    }
    
    set text(text = "")
    {
        this.control.value = text.trim();
    }

    get text2()
    {
        let selected = Array.from(this.datalist.children).find(data=>data.value.trim() === this.control.value.trim());

        return (selected === null || selected === undefined ? "" : selected.innerHTML.trim());
    }

    set text2(selectedOptionText = "")
    {
        let selected = Array.from(this.datalist.children).find(data=>data.value !== null && data.value !== undefined && data.innerHTML.trim() === selectedOptionText.trim());

        this.control.value = (selected === null || selected === undefined ? this.control.value : selected.value.trim());
    }

    get textValue() // returns either the selected option value or null
    {
        let selected = this.selectedOption;

        return (selected === null || selected === undefined ? null : selected.value.trim());
    }

    set textValue(value = "")
    {
        let selected = Array.from(this.datalist.children).find(data=>data.value !== null && data.value !== undefined && data.value.trim() === value.trim());

        this.control.value = (selected === null || selected === undefined || selected.value === null || selected.value === undefined ? this.control.value : selected.value.trim());
    }

    get value() // 
    {
        let selected = this.selectedOption;

        return (selected === null || selected === undefined || selected.getAttribute("data-value") === null || selected.getAttribute("data-value") === undefined ? "" : selected.getAttribute("data-value").trim());
    }

    set value(dataValue = "")
    {
        let selected = Array.from(this.datalist.children).find(data=>data.getAttribute("data-value") !== null && data.getAttribute("data-value") !== undefined && data.getAttribute("data-value").trim() === dataValue.trim());

        this.control.value = (selected === null || selected === undefined || selected.value === null || selected.value === undefined ? this.control.value : selected.value.trim());
    }

    get selectedIndex()
    {
        return Array.from(this.datalist.children).findIndex(data=>data.value.trim() === this.control.value.trim());
    }

    get selectedOption()
    {
        return Array.from(this.datalist.children).find(data=>data.value.trim() === this.control.value.trim());
    }

    select(index = -1)
    {
        let selected = null;
        if (index >= 0 && index < this.datalist.children.length)
        {
            selected = this.datalist.children[index];

            this.text = selected.value;
        }

        return selected;
    }

    addItem(text = "", value = "", altText = "")
    {
        let option = ElementEx.create("option", ElementEx.NO_NS, this.datalist);
        option.uiEx = this;

        if (text === null || text === undefined)
        {
            throw new TypeError("Invalid option text specified.");
        }
        else
        {
            if (text !== null && text !== undefined && (ElementEx.type(text) !== "string" || text.trim() !== ""))
            {
                option.value = text;
            }

            if (value !== null && value !== undefined && (ElementEx.type(value) !== "string" || value.trim() !== ""))
            {
                option.setAttribute("data-value", value);
            }

            if (altText !== null && altText !== undefined && (ElementEx.type(altText) !== "string" || altText.trim() !== ""))
            {
                option.innerHTML = altText;
            }
        }

        return option;
    }

    addItems(...items)
    {
        items.forEach(item=>this.addItem(item.value, item.text, item.dataValue));
    }

    removeItem(index = -1)
    {
        throw new TypeError("This method/property is not yet implemented! [ComboEx.removeItem()]");
    }

    removeAllItems()
    {
        throw new TypeError("This method/property is not yet implemented! [ComboEx.removeAllItems()]");
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ComboEx.#UIExType;
    }

    get instanceCount()
    {
        return ComboEx.#instanceCount;
    }
}

class DropDownEx extends ControlEx
{
    static #UIExType = "DropDownEx";
    static #instanceCount = 0;
    autoId = "";

    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "select";
        this.autoId = this.UIExType + DropDownEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, "drop-down-ex", parentHTMLElement));
            this.control = ElementEx.create("select", ElementEx.NO_NS, this.container, null);
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:"", datalist:[{text:"", value:"", altText:""}]}) // the key `text` refers to the default text value
    {
        try
        {
            this.setup(config.parentHTMLElement);
            if ("label" in config)
            {
                this.label = config.label;
            }

            if ("id" in config)
            {
                this.id = config.id;
            }

            if ("text" in config)
            {
                this.text = config.text.trim();
            }

            if ("datalist" in config)
            {
                config.datalist.forEach(data=>{
                    this.addItem(data.text, data.value, data.altText);
                });
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains("drop-down-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            if (this.control instanceof HTMLElement)
                            {
                                this.id = this.id;
                            }
                        }
                        else if (node.tagName.toLowerCase() === "select" && (this.control === null || this.control === undefined))
                        {
                            this.control = node;
                            this.control.uiEx = this;

                            if ("type" in node)
                            {
                                this.inputType = node.type;
                            }

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"drop-down-ex\"");
            }
        }
    }

    get text() // returns the text displayed in the select control
    {
        return this.options[this.control.selectedIndex].innerHTML;
    }
    
    set text(text = "")
    {
        this.select(this.options.findIndex(option=>option.innerHTML === text.trim()));
    }

    get value()
    {
        return this.options[this.control.selectedIndex].value;
    }

    set value(value = "")
    {
        this.select(this.options.findIndex(option=>option.value === value.trim()));
    }

    get selectedIndex()
    {
        return this.control.selectedIndex;
    }

    get selectedOption()
    {
        return (this.selectedOptions.length > 0 ? this.selectedOptions[0] : null);
    }

    get selectedOptions()
    {
        return Array.from(this.control.selectedOptions);
    }

    get options()
    {
        return Array.from(this.control.options);
    }

    select(index = -1)
    {
        this.control.selectedIndex = index;

        return this.selectedOption;
    }

    addItem(text = "", value = null, altText = "")
    {
        let option = ElementEx.create("option", ElementEx.NO_NS, this.control);
        option.uiEx = this;

        if (text === null || text === undefined)
        {
            throw new TypeError("Invalid option text specified.");
        }
        else
        {
            if (text !== null && text !== undefined && (ElementEx.type(text) !== "string" || text.trim() !== ""))
            {
                option.innerHTML = text;
            }

            if (value !== null && value !== undefined)
            {
                option.value = value;
            }

            if (altText !== null && altText !== undefined && (ElementEx.type(altText) !== "string" || altText.trim() !== ""))
            {
                option.setAttribute("data-alt-text", altText);
            }
        }

        return option;
    }

    addItems(...items)
    {
        items.forEach(item=>this.addItem(item.text, item.value, item.altText));
    }

    removeItem(index = -1)
    {
        throw new TypeError("This method/property is not yet implemented! [DropDownEx.removeItem()]");
    }

    removeAllItems()
    {
        throw new TypeError("This method/property is not yet implemented! [DropDownEx.removeAllItems()]");
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DropDownEx.#UIExType;
    }

    get instanceCount()
    {
        return DropDownEx.#instanceCount;
    }
}

class ListBoxEx extends DropDownEx
{
    static #UIExType = "ListBoxEx";
    static #instanceCount = 0;
    autoId = "";

    constructor()
    {
        super(ControlEx.UIExType);
        this.autoId = this.UIExType + ListBoxEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            super.setup(parentHTMLElement);
            if (ElementEx.isElement(this.container))
            {
                this.container.classList.add("list-box-ex");
                this.container.uiEx = this;
            }
            if (ElementEx.isElement(this.control))
            {
                this.control.multiple = true;
                this.control.title = "Use `CTRL+Click` for multiple selection.";
                this.control.uiEx = this;
            }
            
            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", text:"", datalist:[{text:"", value:"", altText:""}]}) // the key `text` refers to the default text value
    {
        try
        {
            super.setupFromConfig(config);
            if (ElementEx.isElement(this.container))
            {
                this.container.classList.add("list-box-ex");
                this.container.uiEx = this;
            }
            if (ElementEx.isElement(this.control))
            {
                this.control.multiple = true;
                this.control.title = "Use `CTRL+Click` for multiple selection.";
                this.control.uiEx = this;
            }
            
            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }
    
    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            super.setupFromHTMLElement(htmlElement);
            if (ElementEx.isElement(this.container))
            {
                this.container.classList.add("list-box-ex");
                this.container.uiEx = this;
            }
            if (ElementEx.isElement(this.control))
            {
                this.control.multiple = true;
                this.control.title = "Use `CTRL+Click` for multiple selection.";
                this.control.uiEx = this;
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    get selectedIndeces()
    {
        return this.selectedOptions.map(selOption=>this.options.findIndex(option => option === selOption));
    }

    select(index = -1, doSelect = true)
    {
        if (index >= 0 && index < this.options.length)
        {
            this.options[index].selected = doSelect;
        }

        return this.selectedOptions;
    }

    selectMultiple(indeces = [], doSelect = true)
    {
        for (const index of indeces)
        {
            this.select(index, doSelect);
        }

        return this.selectedOptions;
    }

    selectAll(doSelect = true)
    {
        for (const option of this.options)
        {
            option.selected  = doSelect;
        }

        return this.selectedOptions;
    }

    deselect(index = -1)
    {
        return this.select(index, false);
    }

    deselectAll()
    {
        return this.selectAll(false);
    }

    deselectMultiple(indeces = [], doSelect = true)
    {
        return this.selectMultiple(indeces, doSelect);
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return ListBoxEx.#UIExType;
    }

    get instanceCount()
    {
        return ListBoxEx.#instanceCount;
    }
}

class RadioButtonEx extends ControlEx
{
    static #UIExType = "RadioButtonEx";
    static #instanceCount = 0;
    autoId = "";

    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "radio";
        this.autoId = this.UIExType + RadioButtonEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), label = "", checked = false)
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("span", ElementEx.NO_NS, this.type + "-ex", parentHTMLElement));
            this.control = ElementEx.create("input", ElementEx.NO_NS, this.container, null, "type", this.type);
            // this.inputType = inputType;
            this.id = this.id;
            this.check(checked);
            this.control.uiEx = this;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), label:"", id:"", checked:false})
    {
        try
        {
            this.setup(config.parentHTMLElement);

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                        // do nothing
                        break;
                    case "label":
                    case "id":
                        this[key] = config[key];
                        break;
                    case "checked":
                        this.check(config.checked);
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else if (ElementEx.type(config[key]) === "function")
                        {
                            config[key](this);
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains(this.type + "-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.tagName.toLowerCase() === "input" && (this.control === null || this.control === undefined))
                        {
                            this.control = node;
                            this.control.uiEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get inputType()
    {
        return (ElementEx.isElement(this.control) ? this.control.type : null);
    }

    set inputType(inputType = "text")
    {
        if (ElementEx.isElement(this.control))
        {
            this.control.type = inputType;
        }
    }

    check(doCheck = true)
    {
        if (ElementEx.type(doCheck) === "boolean")
        {
            this.control.checked = doCheck;
        }
        else
        {
            throw new TypeError("Argument should be boolean.");
        }
    }

    uncheck()
    {
        this.check(false);
    }

    get checked()
    {
        return this.control.checked;
    }

    get value() // for non-text values; may vary depending on subclass
    {
        return this.control.value.trim();
    }

    set value(value = "")
    {
        this.control.value = (ElementEx.type(value) === "string" ? value : value.toString()).trim();
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return RadioButtonEx.#UIExType;
    }

    get instanceCount()
    {
        return RadioButtonEx.#instanceCount;
    }
}

class CheckboxEx extends RadioButtonEx
{
    static #UIExType = "CheckboxEx";
    static #instanceCount = 0;
    autoId = "";

    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "checkbox";
        this.autoId = this.UIExType + CheckboxEx.#instanceCount++;
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return CheckboxEx.#UIExType;
    }

    get instanceCount()
    {
        return CheckboxEx.#instanceCount;
    }
}

class RadioButtonGroupEx extends ControlEx
{
    static #UIExType = "RadioButtonGroupEx";
    static #instanceCount = 0;
    autoId = "";
    #containerEx = null;
    #controlExs = [];
    #optionType = "";
 
    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "radio-button-group";
        this.optionType = "radio";
        this.autoId = this.UIExType + RadioButtonGroupEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), label = "", containerType = "span")
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple((containerType === "frame" ? "fieldset" : containerType), ElementEx.NO_NS, containerType.toLowerCase() + "-ex " + this.type + "-ex", parentHTMLElement));
            this.label = label;

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), containerType:"span", label:"", id:"", items:[{text:"", value:"", isChecked:false, tooltip:"", }]})
    {
        try
        {
            this.setup(config.parentHTMLElement, config.label ?? "", config.containerType ?? "span");

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                    case "label":
                    case "containerType":
                        // do nothing
                        break;
                    case "items":
                        config.items.forEach(data=>{
                            this.addItem(data.text, data.value, data.isChecked, data.tooltip ?? "");
                        });
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && htmlElement.classList.contains((this.type === "fieldset" ? "frame" : this.type) + "-ex"))
            {
                this.container = htmlElement;
                switch (htmlElement.tagName.toLowerCase())
                {
                    case "span":
                        this.containerEx = new SpanEx();
                        break;
                    case "div":
                        this.containerEx = new DivEx();
                        break;
                    case "fieldset":
                        this.containerEx = new FrameEx();
                        break;
                    default:
                        throw new TypeError("Allowed containers can only be either a SPAN, a DIV, or a FIELDSET.");
                }
                this.containerEx.setupFromHTMLElement(this.container);
                this.containerEx.parentUIEx = this;
                this.container.uiEx = this;

                Array.from(this.container.children).forEach(node=>{
                    if (ElementEx.isElement(node))
                    {
                        if (node.classList.contains("label-ex") && (this.labelEx === null || this.labelEx === undefined))
                        {
                            this.labelEx = new LabelEx().setupFromHTMLElement(node);
                            this.labelEx.parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (node.classList.contains("status-pane") && (this.statusPane === null || this.statusPane === undefined))
                        {
                            this.statusPane = node;
                            this.statusPane.uiEx = this;
                        }
                        else if (this.UIExType === "RadioButtonGroupEx" && node.classList.contains("radio-ex"))
                        {
                            this.controlExs.push(new RadioButtonEx().setupFromHTMLElement(node));
                            this.controlExs.slice(-1)[0].parentUIEx = this;

                            this.id = this.id;
                        }
                        else if (this.UIExType === "CheckboxGroupEx" && node.classList.contains("checkbox-ex"))
                        {
                            this.controlExs.push(new CheckboxEx().setupFromHTMLElement(node));
                            this.controlExs.slice(-1)[0].parentUIEx = this;

                            this.id = this.id;
                        }
                        else
                        {
                            throw new SyntaxError("Element to be configured has extra elements, which may only be added after configuration as a UIEx object.");
                        }
                    }
                });

                return this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should have the class name \"" + this.type + "-ex\"");
            }
        }
    }

    get containerEx()
    {
        return this.#containerEx;
    }

    set containerEx(containerEx = new ContainerEx())
    {
        if (containerEx instanceof ContainerEx)
        {
            this.#containerEx = containerEx;
        }
        else
        {
            throw new TypeError("Argument should be a ContainerEx subclass.");
        }
    }

    get optionType()
    {
        return this.#optionType;
    }
    
    set optionType(optionType = "radio")
    {
        this.#optionType = optionType;
    }

    get id()
    {
        if (ElementEx.isElement(this.container))
        {
            return this.containerEx.id;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    set id(id = "")
    {
        if (ElementEx.isElement(this.container))
        {
            id = (id === null || id === undefined || id.trim() === "" ? this.autoId : id);
            this.containerEx.id = id;
            
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.container.htmlFor = id;
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get name()
    {
        return this.id;
    }

    get labelEx()
    {
        return this.#containerEx.labelEx;
    }

    set labelEx(labelEx = new LabelEx())
    {
        this.#containerEx.labelEx = labelEx;
    }

    get caption()
    {
        return (this.labelEx === null ? "" : this.labelEx.caption);
    }

    set caption(caption = "")
    {
        if (ElementEx.isElement(this.container))
        {
            if (caption === "")
            {
                if (this.labelEx !== null && this.labelEx !== undefined)
                {
                    this.labelEx.destroy();
                    this.labelEx = null;
                }
            }
            else
            {
                if (this.labelEx === null)
                {
                    this.labelEx = new LabelEx().setup(this.container, (this.containerEx.type === "frame" ? "legend" : "label"));
                    this.id = this.id;

                    if (this.labelEx.container !== this.container.childNodes[0])
                    {
                        if (this.spacer.length === 0)
                        {
                            this.spacer.push(document.createTextNode(" "));
                        }
                        this.container.insertBefore(this.spacer[0], this.container.childNodes[0]);
                        this.container.insertBefore(this.labelEx.container, this.container.childNodes[0]);
                    }
                    this.labelEx.parentUIEx = this;
                }
        
                this.labelEx.caption = caption;
            }
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    get controlExs()
    {
        return this.#controlExs;
    }

    get selectedIndex()
    {
        return this.controlExs.findIndex(controlEx=>controlEx.checked);
    }

    get selectedValue()
    {
        let selected = this.selectedOption;

        return (selected === null || selected === undefined ? null : selected.value);
    }

    get selectedValues()
    {
        return this.selectedOptions.map(option => option.value);
    }

    get selectedOption()
    {
        let selected = this.selectedOptions;

        return (selected.length > 0 ? selected[0] : null);
    }

    get selectedOptions()
    {
        return this.controlExs.filter(controlEx => controlEx.checked);
    }

    get options()
    {
        return this.controlExs;
    }

    get value()
    {
        return this.selectedValue;
    }

    set value(value = "")
    {
        let found = false;
        if (value !== null && value !== undefined)
        {
            for (const option of this.options)
            {
                if (option.value === value.toString())
                {
                    option.check();
                    found = true;
                }
            }

            if (!found)
            {
                this.select(-1);
                console.warn("WARNING: Option not found.");
            }
        }
    }

    get text()
    {
        return this.selectedOption.label;
    }

    set text(text = "")
    {
        let found = false;
        if (text !== null && text !== undefined)
        {
            for (const option of this.options)
            {
                if (option.label === text.toString())
                {
                    option.check();
                    found = true;
                }
            }

            if (!found)
            {
                this.select(-1);
                console.warn("WARNING: Option not found.");
            }
        }
    }

    select(index = -1)
    {
        if (index >= 0 && index < this.controlExs.length)
        {
            this.controlExs[index].check();
        }
        else
        {
            this.selectedOptions.forEach(option => option.uncheck());
        }
    }

    addItem(text = "", value = "", isChecked = false, tooltip = "")
    {
        let item = null;
        if (this.spacer.length == 0)
        {
            this.spacer.push(document.createTextNode(" "));
        }
        this.spacer.push(document.createTextNode(" "));
        this.container.appendChild(this.spacer.slice(-1)[0]);
        item = new RadioButtonEx().setupFromConfig({parentHTMLElement:this.container, label:text, checked:isChecked, tooltip:tooltip});
        item.parentUIEx = this;
        this.controlExs.push(item);
        item.id = item.id;
        this.id = this.id; // autogenerate id before assigning it as a group name
        item.name = this.id;
        if (value !== null && value !== undefined)
        {
            item.value = value;
        }
        if (this.controlExs.length > 1)
        {
            if (this.controlExs[0].reversed)
            {
                item.reverse();
            }
        }
    }

    addItems(...items)
    {
        items.forEach(item=>this.addItem(item.text, item.value, item.isChecked, item.tooltip));
    }

    removeItem(index = -1)
    {
        if (index >= 0 && index < this.controlExs.length)
        {
            this.controlExs.splice(index, 1)[0].destroy();
        }
    }

    removeAllItems()
    {
        while (this.controlExs.length > 0)
        {
            this.removeItem(0);
        }
    }

    get reversed()
    {
        return this.controlExs.length > 0 && this.controlExs[0].reversed;
    }

    reverse()
    {
        this.controlExs.forEach(controlEx=>controlEx.reverse());
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return RadioButtonGroupEx.#UIExType;
    }

    get instanceCount()
    {
        return RadioButtonGroupEx.#instanceCount;
    }
}

class CheckboxGroupEx extends RadioButtonGroupEx
{
    static #UIExType = "CheckboxGroupEx";
    static #instanceCount = 0;
    autoId = "";

    constructor()
    {
        super(ControlEx.UIExType);
        this.type = "checkbox-group";
        this.optionType = "checkbox";
        this.autoId = this.UIExType + CheckboxGroupEx.#instanceCount++;
    }

    get value()
    {
        return this.selectedValues;
    }

    set value(values = [])
    {
        let found = false;

        for (const value of values)
        {
            if (value !== null && value !== undefined)
            {
                for (const option of this.options)
                {
                    if (option.value === value.toString())
                    {
                        option.check();
                        found = true;
                    }
                }
            }
        }
        
        if (!found)
        {
            this.select(-1);
            console.warn("WARNING: Option(s) not found.");
        }
    }

    get text()
    {
        return this.selectedOption.label;
    }

    set text(text = "")
    {
        let found = false;
        if (text !== null && text !== undefined)
        {
            for (const option of this.options)
            {
                if (option.label === text.toString())
                {
                    option.check();
                    found = true;
                }
            }

            if (!found)
            {
                this.select(-1);
                console.warn("WARNING: Option not found.");
            }
        }
    }

    select(index = -1)
    {
        if (index >= 0 && index < this.controlExs.length)
        {
            this.controlExs[index].check();
        }
    }

    deselect(index = -1)
    {
        if (index >= 0 && index < this.controlExs.length)
        {
            this.controlExs[index].uncheck();
        }
    }

    selectMultiple(indeces = []) // selects all indeces found or unchecks everything
    {
        if (indeces.length > 0)
        {
            this.controlExs.forEach((controlEx, index)=>controlEx.check(indeces.includes(index)));
        }
        else
        {
            super.select(-1);
        }
    }

    deselectMultiple(indeces = []) // unchecks all indeces found
    {
        for (const index of indeces)
        {
            this.deselect(index);
        }
    }

    selectAll()
    {
        this.controlExs.forEach((controlEx, index)=>controlEx.check());
    }

    deselectAll()
    {
        this.controlExs.forEach((controlEx, index)=>controlEx.uncheck());
    }

    addItem(text = "", value = "", isChecked = false, tooltip = "")
    {
        let item = null;
        if (this.spacer.length == 0)
        {
            this.spacer.push(document.createTextNode(" "));
        }
        this.spacer.push(document.createTextNode(" "));
        this.container.appendChild(this.spacer.slice(-1)[0]);
        item = new CheckboxEx().setupFromConfig({parentHTMLElement:this.container, label:text, checked:isChecked, tooltip:tooltip});
        item.parentUIEx = this;
        this.controlExs.push(item);
        item.id = item.id;
        this.id = this.id; // autogenerate id before assigning it as a group name
        item.name = this.id;
        if (value !== null && value !== undefined)
        {
            item.value = value;
        }
        if (this.controlExs.length > 1)
        {
            if (this.controlExs[0].reversed)
            {
                item.reverse();
            }
        }
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return CheckboxGroupEx.#UIExType;
    }

    get instanceCount()
    {
        return CheckboxGroupEx.#instanceCount;
    }
}

class DataFormEx extends ContainerEx
{
    static #UIExType = "DataFormEx";
    static #instanceCount = 0;
    autoId = "";
    #dataForm = null;
    #headers = [];
    #labelExs = [];
    #containerExs = [];
    #dbContainers = {};
    #controlExs = [];
    #dbControls = {};
    #uiExs = [];
    #dbUIExs = {};
    #dbInfo = {};
    #buttonGrpEx = null;

    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "data-form";
        this.autoId = this.UIExType + DataFormEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), containerType = "form")
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple((containerType === "span" || containerType === "div" ? containerType : "form"), ElementEx.NO_NS, "data-form-ex", parentHTMLElement));

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), title:"", titleHeadingLevel:1, id:"", containerType:"form"})
    {
        try
        {
            this.setup(config.parentHTMLElement, ("containerType" in config && (config.containerType === "span" || config.containerType === "div") ? config.containerType : "form"));
            
            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                    case "useFormElement":
                    case "titleHeadingLevel":
                        // do nothing
                        break;
                    case "title":
                        this.setTitle(config.title, ("titleHeadingLevel" in config ? config.titleHeadingLevel : 1));
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }
    
            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        if (ElementEx.isElement(this.container))
        {
            throw new TypeError("This object is already setup. It cannot be setup again unless reset.");
        }
        else
        {
            if (ElementEx.isElement(htmlElement) && (htmlElement instanceof HTMLSpanElement || htmlElement instanceof HTMLDivElement || htmlElement instanceof HTMLFormElement) && htmlElement.classList.contains("data-form-ex"))
            {
                this.container = htmlElement;
                this.container.uiEx = this;
                this.container.dataFormEx = this;
            }
            else
            {
                throw new SyntaxError("Element to be configured should be either a Div, a Span, or a Form element with the class name \"" + this.type + "-ex\"");
            }
        }

        return this;
    }

    get title()
    {
        return (this.headers.length > 0 && ElementEx.isElement(this.headers[0]) ? this.headers[0].innerHTML : "");
    }

    set title(title = "")
    {
        this.setTitle(title);
    }

    setTitle(title = "", headingLevel = 1)
    {
        return this.addHeader(title, headingLevel, true);
    }

    addHeader(header = "", headingLevel = 2, isTitle = false)
    {
        let h = null, titleElementExists = null;
        
        if (this.headers.length === 0)
        {
            this.headers.push(h);
        }

        titleElementExists = this.headers.length > 0 && ElementEx.isElement(this.headers[0]);

        if (ElementEx.type(header) === "string" && header !== "") // Valid header text
        {
            if (isTitle && titleElementExists)
            {
                h = this.headers[0];
            }
            else
            {
                h = ElementEx.create("h" + (headingLevel < 1 ? 1 : (headingLevel > 6 ? 6 : headingLevel)), ElementEx.NO_NS, this.container);
                if (isTitle)
                {
                    this.headers[0] = h;
                    this.container.prepend(h);
                }
                else
                {
                    this.headers.push(h);
                }
            }

            h.innerHTML = header.trim();
        }
        else if (isTitle && titleElementExists) // Invalid header text
        {
            this.headers[0].remove();
            this.headers[0] = null;
        }

        return h;
    }

    removeHeader(index = 0)
    {
        if (index >= 0 && index < this.headers.length)
        {
            if (index === 0)
            {
                this.setTitle("");
            }
            else
            {
                this.headers.splice(index, 1)[0].remove();
            }
        }
    }

    removeAllHeaders(includeTitle = false)
    {
        while (this.headers.length > 1)
        {
            this.removeHeader(1);
        }

        if (includeTitle)
        {
            this.setTitle();
        }
    }

    addLabelEx(config = {parentHTMLElement:this.container})
    {
        let labelEx = new Function("return new " + exType + "()")();
        labelEx.parentDataFormEx = this;

        if (!("parentHTMLElement" in config))
        {
            config.parentHTMLElement = this.container;
        }

        if (config === null || config === undefined)
        {
            labelEx.setup(this.container);
        }
        else
        {
            labelEx.setupFromConfig(config);
        }

        this.labelExs.push(labelEx);

        return labelEx;
    }

    // addControlEx(labelText = "", type = "text", value = "", tooltip = "", dbColName = "", dbTableName = "", useFieldSet = false) // should return a reference to the ControlEx object created
    // {
    //     var invalidArgsStr = "";

    //     invalidArgsStr += (typeof(labelText) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "labelText:" + labelText);
    //     invalidArgsStr += (typeof(type) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "type:" + type);
    //     invalidArgsStr += (typeof(value) == "string" || typeof(value) == "number" ? "" : (invalidArgsStr == "" ? "" : "; ") + "value:" + value);
    //     invalidArgsStr += (typeof(tooltip) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "tooltip:" + tooltip);
    //     invalidArgsStr += (typeof(dbColName) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "dbColName:" + dbColName);
    //     invalidArgsStr += (typeof(dbTableName) == "string" ? "" : (invalidArgsStr == "" ? "" : "; ") + "dbTableName:" + dbTableName);
    //     invalidArgsStr += (typeof(useFieldSet) == "boolean" ? "" : (invalidArgsStr == "" ? "" : "; ") + "useFieldSet:" + useFieldSet);

    //     if (invalidArgsStr.trim() != "")
    //     {
    //         throw("Incorrect argument types: " + invalidArgsStr);
    //     }

    //     labelText = labelText.trim();
    //     type = type.trim();
    //     if (typeof(value) == "string")
    //     {
    //         value = value.trim();
    //     }
    //     tooltip = tooltip.trim();
    //     dbColName = dbColName.trim();
    //     dbTableName = dbTableName.trim();

    //     this.inputExs.push(new InputEx(this.fieldWrapper, (this.id == "" ? "old-form-ex-input-ex-" : this.id + "-input-ex" + this.inputExs.length), type, useFieldSet));
    //     this.inputExs.slice(-1)[0].parentFormEx = this;
        
    //     if (labelText != "")
    //     {
    //         this.inputExs.slice(-1)[0].setLabelText(labelText);
    //     }

    //     if (tooltip != "")
    //     {
    //         this.inputExs.slice(-1)[0].setTooltipText(tooltip);
    //     }

    //     if (dbColName != "")
    //     {
    //         this.dbInputEx[dbColName] = this.inputExs.slice(-1)[0];
    //     }

    //     if (dbTableName != "")
    //     {
    //         this.dbTableName[dbColName] = dbTableName;
    //     }

    //     if (value != "" || typeof(value) == "number") // the number validation is needed as JS interprets 0 == "" as true
    //     {
    //         this.inputExs.slice(-1)[0].setDefaultValue(value, true);
    //     }

    //     return this.inputExs.slice(-1)[0];
    // }

    addControlEx(exType = "TextboxEx", config = {parentHTMLElement:this.container})
    {
        if (UIEx.UIExControlClasses.includes(exType))
        {
            let controlEx = new Function("return new " + exType + "()")();
            let dbInfo = null;

            controlEx.parentDataFormEx = this;

            if ("dbInfo" in config)
            {
                dbInfo = config["dbInfo"];
                delete config["dbInfo"];
            }

            if (!("parentHTMLElement" in config))
            {
                config.parentHTMLElement = this.container;
            }

            if (config === null || config === undefined)
            {
                controlEx.setup(this.container);
            }
            else
            {
                controlEx.setupFromConfig(config);
            }

            if ("parentContainerEx" in config)
            {
                config.parentContainerEx.addContent(controlEx.container);
            }

            if (dbInfo !== null && dbInfo !== undefined && "column" in dbInfo)
            {
                this.dbControls[dbInfo.column] = controlEx;
                if ("table" in dbInfo)
                {
                    if (!(dbInfo.table in this.#dbInfo))
                    {
                        this.#dbInfo[dbInfo.table] = [];
                    }

                    if (!this.#dbInfo[dbInfo.table].includes(dbInfo.column))
                    {
                        this.#dbInfo[dbInfo.table].push(dbInfo.column);
                    }
                }
            }

            this.controlExs.push(controlEx);

            return controlEx;
        }
        else
        {
            throw new TypeError("Invalid exType. [DataFormEx.addControlEx():exType = " + exType + "]");
        }
    }

    addContainerEx(exType = "SpanEx", config = {parentHTMLElement:this.container})
    {
        if (UIEx.UIExContainerClasses.includes(exType))
        {
            let containerEx = new Function("return new " + exType + "()")();
            let dbInfo = null;

            containerEx.parentDataFormEx = this;

            if ("dbInfo" in config)
            {
                dbInfo = config["dbInfo"];
                delete config["dbInfo"];
            }

            if (!("parentHTMLElement" in config))
            {
                config.parentHTMLElement = this.container;
            }

            if (config === null || config === undefined)
            {
                containerEx.setup(this.container);
            }
            else
            {
                containerEx.setupFromConfig(config);
            }

            if ("parentContainerEx" in config)
            {
                config.parentContainerEx.addContent(containerEx.container);
            }

            if (dbInfo !== null && dbInfo !== undefined && "column" in dbInfo)
            {
                this.dbContainers[dbInfo.column] = containerEx;
                if ("table" in dbInfo)
                {
                    if (!(dbInfo.table in this.#dbInfo))
                    {
                        this.#dbInfo[dbInfo.table] = [];
                    }

                    if (!this.#dbInfo[dbInfo.table].includes(dbInfo.column))
                    {
                        this.#dbInfo[dbInfo.table].push(dbInfo.column);
                    }
                }
            }

            this.containerExs.push(containerEx);

            return containerEx;
        }
        else
        {
            throw new TypeError("Invalid exType. [DataFormEx.addContainerEx():exType = " + exType + "]");
        }
    }

    addSpacer(count = 1)
    {
        while (count-- > 0)
        {
            this.container.append(" ");
        }
    }

    addLineBreak(count = 1)
    {
        while (count-- > 0)
        {
            this.container.append(ElementEx.create("br"));
        }
    }

    get values()
    {
        let values = {};
        for (const key in this.dbControls)
        {
            switch (this.dbControls[key].type)
            {
                case "radio":
                case "checkbox":
                    values[key] = this.dbControls[key].checked;
                    break;
                case "textbox":
                    values[key] = this.dbControls[key].text;
                    break;
                default:
                    values[key] = this.dbControls[key].value;
                    break;
            }
        }
        return values;
    }

    set values(values = {column1:"value1",colume2:"value2"}) // column and value pairs
    {
        if (ElementEx.type(values) === "object")
        {
            for (const key in values)
            {
                if (key in this.dbControls)
                {
                    switch (this.dbControls[key].type)
                    {
                        case "input-button":
                        case "button":
                            break;
                        case "radio":
                        case "checkbox":
                            this.dbControls[key].check(values[key]);
                            break;
                        case "textbox":
                            this.dbControls[key].text = values[key];
                            break;
                        default:
                            this.dbControls[key].value = values[key];
                            break;
                    }
                }
                else if (key in this.dbContainers)
                {
                    switch (this.dbContainers[key].type)
                    {
                        case "table":
                            for (const rowData of values[key])
                            {
                                this.dbContainers[key].addRow(rowData);
                            }
                            break;
                        default:
                            this.dbContainers[key].setHTMLContent(values[key]);
                            break;
                    }
                }
                else
                {
                    console.warn("WARNING: Key `" + key + "` not found.");
                }
            }
        }
    }

    get dbValues()
    {
        let dbValues = {};
        let values = this.values;

        for (const table in this.#dbInfo)
        {
            dbValues[table] = {};

            for (const column of this.#dbInfo[table])
            {
                dbValues[table][column] = values[column];
            }
        }

        return dbValues;
    }

    submit()
    {}

    clear()
    {}

    get headers()
    {
        return this.#headers;
    }

    get labelExs()
    {
        return this.#labelExs;
    }

    get controlExs()
    {
        return this.#controlExs;
    }

    get containerExs()
    {
        return this.#containerExs;
    }

    get dbControls()
    {
        return this.#dbControls;
    }

    get dbContainers()
    {
        return this.#dbContainers;
    }

    get dbInfo()
    {
        return this.#dbInfo;
    }

    setupDataFormButtons(buttonsInfo = [{text:"Text1", clickCallback:clickEvent=>{}, tooltip:""}])
    {
        if (buttonsInfo.length > 0 && (this.#buttonGrpEx === null || this.#buttonGrpEx === undefined))
        {
            this.#buttonGrpEx = new ButtonGroupEx();
        }

        this.buttonGrpEx.setupFromConfig({parentHTMLElement:this.container, buttonsInfo:buttonsInfo, type:"button"});
        this.buttonGrpEx.container.classList.add("data-form-buttons");
        this.buttonGrpEx.parentDataFormEx = this;
    }

    get buttonGrpEx()
    {
        return this.#buttonGrpEx;
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DataFormEx.#UIExType;
    }

    get instanceCount()
    {
        return DataFormEx.#instanceCount;
    }
}

class DialogEx extends ContainerEx
{
    static #UIExType = "DialogEx";
    static #instanceCount = 0;
    autoId = "";
    #dialogBox = null;
    #closeBtn = null;
    #title = null;
    #dataFormEx = null;
    #dialogContentEx = null;
    #buttonGrpEx = null;
    #statusPane = null;
    #statusTimeOut = 3;
    #statusResetTimeOut = null;
    #escapeKeyEnabled = false;
    #app = null;

    constructor()
    {
        super(ContainerEx.UIExType);
        this.type = "dialog";
        this.autoId = this.UIExType + DialogEx.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement())
    {
        try
        {
            this.setupFromHTMLElement(ElementEx.createSimple("div", ElementEx.NO_NS, "dialog-ex scrim", parentHTMLElement));
            this.#dialogBox = ElementEx.createSimple("div", ElementEx.NO_NS, "dialog", this.container);
            this.#closeBtn = ElementEx.create("button", ElementEx.NO_NS, this.dialogBox, null, "type", "button", "class", "close-btn", "title", "Close");
            this.closeBtn.innerHTML = "<span class=\"material-icons-round\">close</span>";
            this.closeBtn.addEventListener("click", (event)=>{
                this.close();
            });
            this.#dataFormEx = null;
            this.#dialogContentEx = new DivEx().setup(this.dialogBox);
            this.#dialogContentEx.container.classList.add("dialog-content");
            [this.scrim, this.dialogBox, this.closeBtn].forEach(el=>el["dialogEx"] = this);

            this.#enableEscapeKey();

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromConfig(config = {parentHTMLElement:new HTMLElement(), caption:"", id:""})
    {
        try
        {
            this.setup(config.parentHTMLElement);

            for (const key in config)
            {
                switch (key)
                {
                    case "parentHTMLElement":
                        // do nothing
                        break;
                    case "caption":
                        this[key] = (ElementEx.type(config.caption) === "string" ? config.caption : "");
                        break;
                    case "id":
                        this[key] = config[key].trim();
                        break;
                    default:
                        if (key in this)
                        {
                            if (ElementEx.type(config[key]) === "function")
                            {
                                config[key](this);
                            }
                            else if (ElementEx.type(this[key]) === "function")
                            {
                                this[key](config[key]);
                            }
                            else
                            {
                                this[key] = config[key];
                            }
                        }
                        else if (ElementEx.type(config[key]) === "function")
                        {
                            config[key](this);
                        }
                        else
                        {
                            console.warn("WARNING: The key '" + key + "' does not exist in `class " + this.UIExType + "`.");
                        }
                        break;
                }
            }

            this.#enableEscapeKey();

            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    setupFromHTMLElement(htmlElement = new HTMLElement())
    {
        try
        {
            super.setupFromHTMLElement(htmlElement);

            Array.from(this.container.children).forEach(node=>{
                if (ElementEx.isElement(node) && node.classList.contains("label-ex"))
                {
                    
                }
            });
            
            this.#enableEscapeKey();
            
            return this;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    // addFormEx()
    // {
    //     this.formEx = new Old_FormEx(this.dialogBox, this.id + "-form-ex", false);

    //     return this.formEx;
    // }

    addDataFormEx()
    {
        this.dataFormEx = new DataFormEx().setup(this.dialogBox);
        this.#dialogContentEx.addExContent(this.dataFormEx);
        this.dataFormEx.parentDialogEx = this;

        return this.dataFormEx;
    }

    // gridDisplay(enable = true, gridTemplateColumns = "auto auto")
    // {
    //     if (enable)
    //     {
    //         this.dialogBox.style.display = "grid";
    //         this.dialogBox.style.gridTemplateColumns = gridTemplateColumns;
    //     }
    //     else
    //     {
    //         this.dialogBox.style.display = null;
    //         this.dialogBox.style.gridTemplateColumns = null;
    //     }
    // }

    setHTMLContent(html = "")
    {
        if (ElementEx.isElement(this.dialogBox))
        {
            // this.closeBtn.remove();

            // if (this.labelEx !== null)
            // {
            //     this.labelEx.container.remove();
            //     if (this.spacer.length > 0)
            //     {
            //         this.spacer[0].remove();
            //     }
            // }

            // if (this.buttonGrpEx !== null)
            // {
            //     this.buttonGrpEx.remove();
            // }

            // this.dialogBox.innerHTML = html;
            this.#dialogContentEx.setHTMLContent(html);

            // if (this.labelEx !== null)
            // {
            //     if (this.spacer.length == 0)
            //     {
            //         this.spacer.push(document.createTextNode(" "));
            //     }

            //     if (this.labelEx !== null)
            //     {
            //         this.dialogBox.prepend(this.labelEx.container, this.spacer[0]);
            //     }

            //     this.dialogBox.prepend(this.closeBtn);

            //     if (this.buttonGrpEx !== null)
            //     {
            //         this.dialogBox.append(this.buttonGrpEx);
            //     }
            // }

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addContent(content = new Node())
    {
        if (ElementEx.isElement(this.dialogBox))
        {
            // this.dialogBox.appendChild(content);
            this.#dialogContentEx.addContent(content);
            // if (!("uiEx" in content))
            // {
            //     content.uiEx = this;
            // }

            // if (this.buttonGrpEx !== null)
            // {
            //     this.dialogBox.append(this.buttonGrpEx.container);
            // }

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addExContent(exContent = new UIEx())
    {
        if (ElementEx.isElement(this.dialogBox))
        {
            // this.addContent(exContent.container);
            this.#dialogContentEx.addContent(exContent.container);
            exContent.parentUIEx = this;

            // if (this.buttonGrpEx !== null)
            // {
            //     this.dialogBox.append(this.buttonGrpEx.container);
            // }

            return this;
        }
        else
        {
            throw new ReferenceError("This UIEx object is not yet setup.");
        }
    }

    addSpacer(count = 1)
    {
        while (count-- > 0)
        {
            this.addContent(document.createTextNode(" "));
        }
    }

    addLineBreak(count = 1)
    {
        while (count-- > 0)
        {
            this.addContent(ElementEx.create("br"));
        }
    }
    
    get scrim()
    {
        return this.container;
    }

    get dialogBox()
    {
        return this.#dialogBox;
    }

    get caption()
    {
        return (this.labelEx === null ? "" : this.labelEx.caption);
    }

    set caption(caption = "")
    {
        if (caption === "")
        {
            if (this.labelEx !== null && this.labelEx !== undefined)
            {
                this.labelEx.destroy();
                this.labelEx = null;
            }
        }
        else
        {
            if (this.labelEx === null)
            {
                this.labelEx = new LabelEx().setup(this.dialogBox, "span");
                this.labelEx.container.classList.add("dialog-caption");
                if (this.labelEx.container !== this.container.childNodes[0])
                {
                    if (this.spacer.length === 0)
                    {
                        this.spacer.push(document.createTextNode(" "));
                    }

                    this.dialogBox.prepend(this.closeBtn, this.labelEx.container, this.spacer[0]);
                }
                this.labelEx.parentUIEx = this;
                this.labelEx.parentDialogEx = this;
            }
    
            this.labelEx.caption = caption;
        }
    }

    get closeBtn()
    {
        return this.#closeBtn;
    }

    setupDialogButtons(buttonsInfo = [{text:"Text1", clickCallback:clickEvent=>{}, tooltip:""}])
    {
        if (buttonsInfo.length > 0 && (this.#buttonGrpEx === null || this.#buttonGrpEx === undefined))
        {
            this.#buttonGrpEx = new ButtonGroupEx();
        }

        this.buttonGrpEx.setupFromConfig({parentHTMLElement:this.dialogBox, buttonsInfo:buttonsInfo, type:"button", buttonType:"button"});
        this.buttonGrpEx.container.classList.add("dialog-buttons");
        this.buttonGrpEx.parentDialogEx = this;
    }

    get buttonGrpEx()
    {
        return this.#buttonGrpEx;
    }

    get app()
    {
        return this.#app;
    }

    set app(app = new App())
    {
        this.#app = app;
    }

    get statusPane()
    {
        return this.#statusPane;
    }

    set statusPane(statusPane = new HTMLElement())
    {
        if (!(this.#statusPane instanceof HTMLElement))
        {
            this.#statusPane = statusPane;
        }
    }

    addStatusPane()
    {
        this.statusPane = ElementEx.createSimple("span", ElementEx.NO_NS, "status-pane", this.#dialogContentEx.container);
    }

    setStatus(statusMsg = "", statusType = "information")
    {
        if (!(this.statusPane instanceof HTMLElement))
        {
            this.addStatusPane();
        }

        this.#dialogContentEx.addContent(this.statusPane);

        this.statusPane.classList.add(statusType);
        this.statusPane.innerHTML = statusMsg;

        this.#statusResetTimeOut = window.setTimeout(() => {
            this.resetStatus();
            this.#statusResetTimeOut = null;
        }, this.statusTimeOut * 1000);
    }

    showInfo(statusMsg = "")
    {
        this.setStatus(statusMsg, "information");
    }
    
    showSuccess(statusMsg = "")
    {
        this.setStatus(statusMsg, "success");
    }
    
    showWait(statusMsg = "")
    {
        this.setStatus(statusMsg, "wait");
    }
    
    showWarning(statusMsg = "")
    {
        this.setStatus(statusMsg, "warning");
    }
    
    raiseError(statusMsg = "")
    {
        this.setStatus(statusMsg, "error");
    }

    resetStatus()
    {
        if (this.statusPane instanceof HTMLElement)
        {
            this.statusPane.innerHTML = "";
            this.statusPane.setAttribute("class", "status-pane");
        }
    }

    get statusTimeOut()
    {
        return this.#statusTimeOut;
    }

    set statusTimeOut(duration = 5)
    {
        if (ElementEx.type(duration) === "number")
        {
            this.#statusTimeOut = duration;
        }
    }

    #enableEscapeKey()
    {
        if (this.dialogBox instanceof HTMLElement && !this.#escapeKeyEnabled)
        {
            this.dialogBox.addEventListener("keydown", event=>{
                if (event.key === "Escape")
                {
                    this.close();
                }
            });
            this.dialogBox.tabIndex = 0;
            this.dialogBox.focus();

            this.#escapeKeyEnabled = true;
        }
    }

    close()
    {
        this.scrim.remove();
    }

    static get UIExType()
    {
        return this.#UIExType;
    }

    get UIExType()
    {
        return DialogEx.#UIExType;
    }

    get instanceCount()
    {
        return DialogEx.#instanceCount;
    }
}

class MessageBox extends DialogEx
{
    static #UIExType = "MessageBox";
    static #instanceCount = 0;

    constructor()
    {
        super(DialogEx.UIExType);
        this.autoId = this.UIExType + MessageBox.#instanceCount++;
    }

    setup(parentHTMLElement = new HTMLElement(), caption = "", message = "", buttonsInfo = [{text:"Close", buttonType:"button", tooltip:"Close message box", clickCallback:clickEvent=>this.close()}])
    {
        try
        {
            super.setup(parentHTMLElement);
            this.container.uiEx = this;
            this.caption = (ElementEx.type(caption) === "string" && caption.trim() !== "" ? caption : "Message");
            this.container.classList.add("message-box");
            let container = new DivEx().setupFromConfig({parentHTMLElement:this.container});
            this.addExContent(container);
            container.setHTMLContent(message);

            this.setupDialogButtons(buttonsInfo);
            
            buttonsInfo.forEach((buttonInfo, index)=>this.buttonGrpEx.controlExs[index].control.setAttribute("form", "message-box"));

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
        return MessageBox.#UIExType;
    }

    get instanceCount()
    {
        return MessageBox.#instanceCount;
    }
}

class SelectorLink
{
    #label = "";
    #endOfListLabel = "";
    #list = []; // string array
    #value = []; // string array
    #selectedList = []; // string array
    #selectedValue = []; // string array
    isExtensible = false;
    #parent = null;
    #link = null;
    #data = []; // option elements and text nodes

    constructor(parentHTMLElement = new HTMLElement(), label = "", isExtensible = false, endOfListLabel = "")
    {
        this.isExtensible = isExtensible;
        this.#label = label;
        this.#endOfListLabel = endOfListLabel;
        if (parentHTMLElement instanceof HTMLElement)
        {
            this.#parent = parentHTMLElement;
        }
        else
        {
            throw new TypeError("Specified parent is not an HTML element.");
        }
        this.#generateLink();
    }

    #generateDropDown() // add items before generating dropdown
    {
        if (this.isExtensible || this.#data.length === 0)
        {
            let dropDown = ElementEx.createSimple("select", ElementEx.NO_NS, "selector-link-select", this.#parent);
            let br = null;

            this.#data.push(dropDown);
            dropDown.focus();
            let index = this.#data.length - 1;
            if (this.isExtensible)
            {
                br = ElementEx.create("br");
                dropDown.after(br);
            }
            
            this.list.filter(item=>!this.selectedList.includes(item)).forEach(item=>{
                let option = ElementEx.create("option", ElementEx.NO_NS);
                option.text = item;
                option.value = this.value[this.list.findIndex(listItem=>listItem === item)];
                dropDown.add(option);
            });

            dropDown.addEventListener("blur", blurEvent=>{
                let textNode = document.createTextNode(dropDown.options[dropDown.selectedIndex].text);
                let upBtn = null, downBtn = null, deleteBtn = null;
                
                textNode.value = dropDown.value;

                this.#data[index] = textNode;

                dropDown.replaceWith(textNode);
                // if (this.isExtensible)
                // {
                    this.selectedList.push(textNode.textContent);
                // }
                // dropDown = null;

                if (br !== null && br !== undefined)
                {
                    textNode.br = br;
                }

                textNode.deleteBtn = deleteBtn = ElementEx.create("button", ElementEx.NO_NS, this.#parent, textNode.nextSibling, "type", "button", "class", "selector-link-deleter", "title", "Remove item");
                deleteBtn.innerHTML = "<span class=\"material-icons-round\">close</span>";
                deleteBtn.addEventListener("click", clickDeleteEvent=>{
                    if (br instanceof HTMLBRElement)
                    {
                        br.remove();
                        br = null;
                    }
                    this.#data = this.#data.filter(dropDownCheck=>dropDownCheck !== textNode);
                    textNode.remove();
                    this.selectedList = this.selectedList.filter(item=>item !== textNode.textContent);
                    if (this.isExtensible)
                    {
                        this.#link.innerHTML = "+" + this.label;
                        upBtn.remove();
                        downBtn.remove();
                    }
                    // textNode = null;

                    if (!this.isExtensible)
                    {
                        this.#generateLink();
                    }
                    else if (this.#data.length > 0 && this.#data.findIndex(node=>node === textNode) < this.#data.length && this.#data.slice(-1)[0].br !== null && this.#data.slice(-1)[0].br !== undefined)
                    {
                        this.#data.slice(-1)[0].br.after(deleteBtn);
                    }
                    deleteBtn.replaceWith(this.#link);
                });

                if (this.isExtensible)
                {
                    textNode.upBtn = upBtn = ElementEx.create("button", ElementEx.NO_NS, this.#parent, deleteBtn, "type", "button", "class", "selector-link-move-up", "title", "Move item upward");
                    upBtn.innerHTML = "<span class=\"material-icons-round\">arrow_upward</span>";
                    upBtn.addEventListener("click", upClickEvent=>{
                        let i = this.#data.findIndex(node=>node === textNode);
                        if (i > 0)
                        {
                            this.#switchSelectedItems(i, i - 1);
                        }
                    });
                    
                    textNode.downBtn = downBtn = ElementEx.create("button", ElementEx.NO_NS, this.#parent, deleteBtn, "type", "button", "class", "selector-link-move-down", "title", "Move item downward");
                    downBtn.innerHTML = "<span class=\"material-icons-round\">arrow_downward</span>";
                    downBtn.addEventListener("click", upClickEvent=>{
                        let i = this.#data.findIndex(node=>node === textNode);
                        if (i < this.selectedList.length - 1)
                        {
                            this.#switchSelectedItems(i, i + 1);
                        }
                    });
                }
            });

            if (this.isExtensible)
            {
                this.#generateLink();
            }
        }
        else
        {
            throw new ReferenceError("Drop down already exists.");
        }
    }

    // #destroyDropDown()
    // {
    //     if (this.#dropDown === null || this.#dropDown === undefined)
    //     {
    //         throw new ReferenceError("Drop down doesn't exist.");
    //     }
    //     else
    //     {
    //         this.#dropDown.remove();
    //         this.#dropDown = null;

    //         if (this.isExtensible || this.#dropDown === null || this.#dropDown === undefined)
    //         {
    //             this.#generateLink();
    //         }
    //     }
    // }

    #generateLink()
    {
        if (this.isExtensible || this.#link === null || this.#link === undefined)
        {
            this.#link = ElementEx.htmlToElement("<a class=\"selector-link-a\" href=\"#\" title=\"Click to " + this.label.toLowerCase() + "\">+" + this.label + "</a>");
            this.#link.selectorLink = this;
            this.#parent.append(this.#link);

            this.#link.addEventListener("click", event=>{
                this.#destroyLink();
            });
        }
        else
        {
            throw new ReferenceError("Hyperlink already exists.");
        }
    }

    #destroyLink()
    {
        if (this.#link === null || this.#link === undefined)
        {
            throw new ReferenceError("Hyperlink doesn't exist.");
        }
        else if (this.list.length <= this.selectedList.length)
        {
            if (this.#endOfListLabel !== "")
            {
                this.#link.innerHTML = "&times;" + this.#endOfListLabel;
            }
        }
        else
        {
            this.#link.remove();
            this.#link = null;

            if (this.isExtensible || this.#link === null || this.#link === undefined)
            {
                this.#generateDropDown();
            }
        }
    }

    addItem(item = "", value = "")
    {
        this.list.push(item);
        this.value.push(value);
    }

    addItems(...items)
    {
        for (const item of items)
        {
            this.addItem(item);
        }
    }

    #switchSelectedItems(index1, index2)
    {
        if (index1 !== index2 && index1 >= 0 && index2 >= 0 && index1 < this.selectedList.length && index2 < this.selectedList.length)
        {
            let temp = this.#data[index1];
            this.#data[index1] = this.#data[index2];
            this.#data[index2] = temp;
            this.selectedList[index1] = this.#data[index1].textContent;
            this.selectedList[index2] = this.#data[index2].textContent;
            ElementEx.switch(this.#data[index1], this.#data[index2]);
            ElementEx.switch(this.#data[index1].deleteBtn, this.#data[index2].deleteBtn);
            ElementEx.switch(this.#data[index1].upBtn, this.#data[index2].upBtn);
            ElementEx.switch(this.#data[index1].downBtn, this.#data[index2].downBtn);
            ElementEx.switch(this.#data[index1].br, this.#data[index2].br);
        }
    }

    get label()
    {
        return this.#label;
    }

    get value()
    {
        return this.#value;
    }

    get list()
    {
        return this.#list;
    }

    set list(itemList = [])
    {
        this.#list = itemList;
    }

    set selectedList(itemList = [])
    {
        this.#selectedList = itemList;
    }

    get selectedList()
    {
        return this.#selectedList;
    }

    get selectedValue()
    {
        return this.#data.map(textNode=>textNode.value);
    }

    get selected()
    {
        return this.#data.map(textNode=>({text:textNode.textContent, value:textNode.value}));
    }
}

class AssignRoles extends DialogEx
{
    #rolesTableEx = null;
    #selectorLinks = {};

    constructor()
    {
        super();
    }
    
    setup(parentHTMLElement = new HTMLElement())
    {
        super.setup(parentHTMLElement);
        let thisDialog = this;

        this.scrim.classList.add("assign-roles");

        this.caption = "Assign Roles";
        this.captionHeaderLevel = 3;
        this.setupDialogButtons([
            {text:"OK", clickCallback:event=>{
                let hrRoles = {};

                for (const key in this.#selectorLinks)
                {
                    hrRoles[key] = this.#selectorLinks[key].selected.map(item=>({name:item.text, personId:item.value}));
                }

                console.log(hrRoles);
            }, tooltip:"Assign roles and close dialog."},
            {text:"Cancel", clickCallback:event=>thisDialog.close(), tooltip:"Close dialog and discard any changes."}
        ]);

        this.#rolesTableEx = new TableEx();
        this.rolesTableEx.setup(this.dialogBox);
        this.addExContent(this.rolesTableEx);
        this.rolesTableEx.setupHeaders([{name:"role", text:"Role"}, {name:"assigned_staff", text:"Assigned Staff/Officer"}]);
        [
            ["appointing_officer", "Appointing Authority:", "Assign"],
            ["hrmo", "HRMO:", "Assign"],
            ["hrmpsb_chair", "HRMPSB Chairperson:", "Assign"],
            ["hrmpsb_secretariat", "HRMPSB Secretariat:", "Add"],
            ["hrmpsb_member_level1", "HRMPSB Members (<i>Level 1</i>):", "Add"],
            ["hrmpsb_member_level2", "HRMPSB Members (<i>Level 2</i>):", "Add"],
            ["hrmpsb_member_level3", "HRMPSB Members (<i>Level 3</i>):", "Add"],
        ].forEach(key=>{
            this.rolesTableEx.addRow({"role":key[1]});
            this.#selectorLinks[key[0]] = new SelectorLink(this.rolesTableEx.rows.slice(-1)[0].td["assigned_staff"], key[2], key[2] === "Add", "Nothing to add");
            for (const item of [{name:"Dr. Neil G. Angeles, Ed.D.",personId:0}, {name:"Jessamae O. Castromero",personId:1}, {name:"Dr. Roselyn Q. Golfo, Ph.D.",personId:2}, {name:"Guillerma L. Bilog, Ed.D.",personId:3}, {name:"Carina V. Pedragosa",personId:4}, {name:"Catalina M. Calinawan",personId:5}, {name:"Jaime Tolentino",personId:6}])
            {
                this.#selectorLinks[key[0]].addItem(item.name, item.personId);
            }
        });
    }

    get rolesTableEx()
    {
        return this.#rolesTableEx;
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
        // super(app.main, id);
        super.setup(parentHTMLElement);
        let thisDialog = this;
        console.log(app.main);

        this.mode = mode; // 0: add user; 1: edit user
        this.app = app;

        this.scrim.classList.add("user-editor");
        this.caption = (mode ? "Edit" : "Add") + " User";
        this.captionHeaderLevel = 3;

        this.data = {
            username:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["username"] : null),
            employeeId:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["employeeId"] : null),
            personId:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["personId"] : null)
        }
        
        this.addDataFormEx();
        // this.formEx.setTitle((mode ? "Edit" : "Add") + " User", 3);
        this.dataFormEx.id = "user-editor-form";
        this.dataFormEx.container.name = "user-editor-form";
        this.dataFormEx.container.setAttribute("method", "POST");

        // [
        //     {label:"Employee ID", type:"input", colName:"employeeId", table:"User", tooltip:""},
        //     {label:"Temporary account only", type:"checkbox", colName:"temp_user", table:"", tooltip:"Temporary accounts are accounts that are not bound to employee information"},
        //     {label:"Given Name", type:"input", colName:"given_name", table:"Person", tooltip:"Enter the applicant's given name. This is required."},
        //     {label:"Middle Name", type:"input", colName:"middle_name", table:"Person", tooltip:"Enter the applicant's middle name. For married women, please enter the maiden middle name. Leave blank for none."},
        //     {label:"Family Name", type:"input", colName:"family_name", table:"Person", tooltip:"Enter the applicant's family name. For married women, please enter the maiden last name."},
        //     {label:"Spouse Name", type:"input", colName:"spouse_name", table:"Person", tooltip:"For married women, please enter the spouse's last name. Leave blank for none."},
        //     {label:"Ext. Name", type:"input", colName:"ext_name", table:"Person", tooltip:"Enter the applicant's extension name (e.g., Jr., III, etc.). Leave blank for none."},
        //     {label:"Username", type:"input", colName:"username", table:"All_User", tooltip:""}
        // ].forEach(field=>{
        //     this.dataFormEx.addControlEx(field.label, field.type, (mode == 1 && field.colName != "temp_user" && MPASIS_App.isDefined(userData) ? userData[field.colName] ?? "" : ""), field.tooltip, field.colName, field.table);
        //     this.dataFormEx.dbInputEx[field.colName].container.classList.add(field.colName);
        //     if (field.colName.includes("_name"))
        //     {
        //         // this.formEx.dbInputEx[field.colName].setWidth("11em");
        //     }
        //     if (field.colName == "employeeId")
        //     {
        //         // this.formEx.dbInputEx[field.colName].setWidth("9em");
        //         this.formEx.dbInputEx[field.colName].showColon();
        //     }
        //     if (field.type == "checkbox")
        //     {
        //         this.formEx.dbInputEx[field.colName].reverse();
        //     }
        //     else if (field.colName == "username")
        //     {
        //         this.formEx.dbInputEx[field.colName].showColon();
        //     }
        //     if (this.mode != 0 && field.colName == "temp_user")
        //     {
        //         this.formEx.dbInputEx[field.colName].check(userData[field.colName]);
        //     }
        //     this.formEx.addSpacer();
        // });

        this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"app", name:"app", inputType:"hidden", value:"MPaSIS"});
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"a", name:"a", inputType:"hidden", value:(this.mode == 0 ? "add" : "update")});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Employee ID:", id:"employeeId", name:"employeeId", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["employeeId"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("employee-id"), inputType:"text", dbInfo:{table:"User", column:"employeeId"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Temporary account only", id:"temp_user", name:"temp_user", check:(mode == 1 && MPASIS_App.isDefined(userData) && "temp_user" in userData && userData["temp_user"] === 1), addContainerClass:obj=>obj.container.classList.add("temp-user"), tooltip:"Temporary accounts are accounts that are not bound to employee information", reverse:undefined, dbInfo:{column:"temp_user"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Given Name:", id:"given_name", name:"given_name", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["given_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", dbInfo:{table:"Person", column:"given_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Middle Name:", id:"middle_name", name:"middle_name", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["middle_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"middle_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Family Name:", id:"family_name", name:"family_name", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["family_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional)", dbInfo:{table:"Person", column:"family_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Spouse Name:", id:"spouse_name", name:"spouse_name", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["spouse_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) For married women only", dbInfo:{table:"Person", column:"spouse_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Ext. Name:", id:"ext_name", name:"ext_name", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["ext_name"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), inputType:"text", tooltip:"(optional) Extension Name, e.g., Jr., III", dbInfo:{table:"Person", column:"ext_name"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Username:", id:"username", name:"username", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["username"] ?? "" : ""), addContainerClass:obj=>obj.container.classList.add("name"), disable:obj=>obj.control.disabled = (this.mode === 1), inputType:"text", dbInfo:{table:"All_User", column:"username"}});
        this.dataFormEx.addSpacer();

        this.dataFormEx.addContainerEx(FrameEx.UIExType, {caption:"Access Levels:", addContainerClass:obj=>obj.container.classList.add("user-editor-access-levels"), dbInfo:{column:"user-editor-access-levels"}});
        // this.dataFormEx.displayExs["user-editor-access-levels"].showColon();
        // this.dataFormEx.dbContainers["user-editor-access-levels"].container.classList.add("user-editor-access-levels");

        // [
        //     {label:"SeRGS", type:"number", colName:"sergs_access_level", table:"All_User", tooltip:"Access level for the Service Record Generation System"},
        //     {label:"OPMS", type:"number", colName:"opms_access_level", table:"All_User", tooltip:"Access level for the Online Performance Management System"},
        //     {label:"MPaSIS", type:"number", colName:"mpasis_access_level", table:"All_User", tooltip:"Access level for the Merit Promotion and Selection Information System"}
        // ].forEach(field=>{
        //     this.formEx.addInputEx(field.label, field.type, (mode == 1 && MPASIS_App.isDefined(userData) ? userData[field.colName] ?? 0 : 0), field.tooltip, field.colName, field.table);
        //     this.formEx.displayExs["user-editor-access-levels"].addContent(this.formEx.dbInputEx[field.colName].container);
        //     this.formEx.dbInputEx[field.colName].setMin(0);
        //     this.formEx.dbInputEx[field.colName].setMax(field.label == "MPaSIS" ? 4 : 10);
        //     this.formEx.dbInputEx[field.colName].fields[0].classList.add("right");
        //     this.formEx.addSpacer();
        // });

        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"SeRGS:", id:"sergs_access_level", name:"sergs_access_level", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["sergs_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:10, dbInfo:{table:"All_User", column:"sergs_access_level"}});
        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"OPMS:", id:"opms_access_level", name:"opms_access_level", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["opms_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:10, dbInfo:{table:"All_User", column:"opms_access_level"}});
        this.dataFormEx.addControlEx(NumberFieldEx.UIExType, {label:"MPaSIS:", id:"mpasis_access_level", name:"mpasis_access_level", value:(mode == 1 && MPASIS_App.isDefined(userData) ? userData["mpasis_access_level"] ?? 0 : 0), parentHTMLElement:this.dataFormEx.dbContainers["user-editor-access-levels"].container, addContainerClass:obj=>obj.container.classList.add("access-level"), min:0, max:4, dbInfo:{table:"All_User", column:"mpasis_access_level"}});
        this.dataFormEx.addSpacer();

        this.dataFormEx.dbControls["temp_user"].addEvent("change", event=>{
            this.dataFormEx.dbControls["employeeId"].control.disabled = this.dataFormEx.dbControls["temp_user"].checked;
        });

        this.addStatusPane();

        this.setupDialogButtons([
            {text:"Save", buttonType:"button", tooltip:"Save employee information", clickCallback:function(clickEvent){
                let dialog = this.uiEx.parentUIEx.parentDialogEx;
                let form = dialog.dataFormEx;

                var person = {};
                var user = {};
                var error = "";
    
                for (const dbColName in form.dbControls) {
                    var value = form.dbControls[dbColName].value;
                    if (dbColName == "temp_user")
                    {
                        user[dbColName] = form.dbControls[dbColName].checked;
                    }
                    else if ((MPASIS_App.isDefined(value)/* && !MPASIS_App.isEmptySpaceString(value)*/) || typeof(value) == "number")
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
    
                    postData(MPASIS_App.processURL, "app=mpasis&a=" + (form.mode == 0 ? "add" : "update") + "&person=" + packageData(person) + "&user=" + packageData(user), async (event)=>{
                        var response;
    
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

        // var dialog = this;
        // var form = this.formEx;
        // var btnGrp = form.addFormButtonGrp(2);
        // btnGrp.container.classList.add("user-editor-buttons");
        // form.addStatusPane();
        // btnGrp.inputExs[0].setLabelText("Save");
        // btnGrp.inputExs[0].setTooltipText("");
        /*
        btnGrp.inputExs[0].addEvent("click", (event)=>{
            var person = {};
            var user = {};
            var error = "";

            for (const dbColName in form.dbInputEx) {
                var value = form.dbInputEx[dbColName].getValue();
                if (dbColName == "temp_user")
                {
                    user[dbColName] = form.dbInputEx[dbColName].isChecked();
                }
                else if ((MPASIS_App.isDefined(value) && !MPASIS_App.isEmptySpaceString(value)) || typeof(value) == "number")
                {
                    if (form.dbTableName[dbColName] == "Person")
                    {
                        person[dbColName] = value;
                    }
                    else
                    {
                        user[dbColName] = value;
                    }
                }
                else if (dbColName == "employeeId" && !form.dbInputEx["temp_user"].isChecked())
                {
                    error += "Employee ID should not be blank for non-temporary user accounts.<br>";
                }
                else if (dbColName == "given_name" && form.dbInputEx["temp_user"].isChecked())
                {
                    error += "Given Name should not be blank.<br>";
                }
                else if (dbColName == "username")
                {
                    error += "Username should not be blank.<br>";
                }
            }

            user["personId"] = dialog.data["personId"];

            if (error != "")
            {
                form.raiseError(error);
            }
            else
            {
                // // DEBUG
                // console.log(form.dbInputEx, person, user, MPASIS_App.processURL);

                // return;
                // // DEBUG

                postData(MPASIS_App.processURL, "app=mpasis&a=" + (form.mode == 0 ? "add" : "update") + "&person=" + packageData(person) + "&user=" + packageData(user), async (event)=>{
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
                            dialog.app.temp["searchButton"].fields[0].click();
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
        });
        */
        // btnGrp.inputExs[1].setLabelText("Close");
        // btnGrp.inputExs[1].setTooltipText("");
        // btnGrp.inputExs[1].addEvent("click", event=>{
        //     this.close();
        // });

        // form.container.parentElement.appendChild(btnGrp.container);

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
