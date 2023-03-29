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
                                    this.mainSections[mainSectionId].innerHTML = "<h2>My Account</h2>";
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
                                                    resultsBox.innerHTML = JSON.parse(response.content);
                                                }
                                                // else
                                                // {
                                                //     resultsBox.innerHTML = response.content;
                                                // }
                                            }                                                                            });
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
                                                        errMsg.innerHTML = JSON.parse(response.content);
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
