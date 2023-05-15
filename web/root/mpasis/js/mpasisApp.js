"use strict";

// import "../../js/classes/ExClass.js";

function getUnicodeCharacter(cp) {

    if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
        return String.fromCharCode(cp);
    } else if (cp >= 0x10000 && cp <= 0x10FFFF) {

        // we substract 0x10000 from cp to get a 20-bits number
        // in the range 0..0xFFFF
        cp -= 0x10000;

        // we add 0xD800 to the number formed by the first 10 bits
        // to give the first byte
        var first = ((0xffc00 & cp) >> 10) + 0xD800

        // we add 0xDC00 to the number formed by the low 10 bits
        // to give the second byte
        var second = (0x3ff & cp) + 0xDC00;

        return String.fromCharCode(first) + String.fromCharCode(second);
    }
}

class MPASIS_App
{
    static processURL = "/mpasis/php/process.php";

    constructor(container)
    {
        // change nav links into click event listeners
        this.navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        this.main = Array.from(container.querySelectorAll("main"))[0];
        this.mainSections = {};
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");
        this.defaultEndDate = "2023-04-05";// (new Date()).toLocaleDateString();
        this.scrim = null;
        this.temp = {};
        this.currentUser = JSON.parse(this.getCookie("user"));
        
        var app = this;

        this.forms = {
            jobData:null,
            applicantData:null,
            scoreSheet:null,
            scoreSheetOld:null,
            ier:null,
            ies:null
        };

        for (const navLI of Array.from(this.navbar.querySelectorAll("li"))) {
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

        this.showScrim();

        // load some initial data
        postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=initial-data", postEvent=>{
            var response;

            if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
            {
                response = JSON.parse(postEvent.target.responseText);

                if (response.type == "Error")
                {
                    new MsgBox(app.main, "ERROR: " + response.content, "CLOSE");
                }
                else if (response.type == "Data")
                {
                    var data = JSON.parse(response.content);

                    document.positions = data["positions"];
                    document.salaryGrade = data["salary_grade"];
                    document.mpsEducIncrement = data["mps_increment_table_education"];
                    document.enumEducationalAttainment = data["enum_educational_attainment"];
                    document.positionCategory = data["position_category"];
            
                    if (this.getCookie("current_view") == "" || this.getCookie("current_view") == undefined)
                    {
                        this.setCookie("current_view", "dashboard", 1);
                    }
            
                    this.activateView(this.getCookie("current_view"));
            
                    this.closeScrim();
                }                    
            }
        });
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
                    this.setCookie("user", "", -1);
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
        var el = null;

        this.mainSections["main-" + viewId] = createElementEx(NO_NS, "section", this.main, null, "id", "main-" + viewId);

        switch(viewId)
        {
            case "dashboard":
                break;
            case "applications":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Applications</h2>";
                el = htmlToElement("<ul></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"applicant-data-entry", label:"Applicant Data Entry"},
                    {viewId:"scoresheet", label:"Score Sheet"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.activateView(obj.viewId);
                    });
                });
                break;
            case "applicant-data-entry":
                this.constructApplicantDataForm();
                break;
            case "scoresheet-old":
                this.constructScoreSheetOld();
                break;
            case "scoresheet":
                this.constructScoreSheet();
                break;
            case "job":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Job Openings</h2>";
                el = htmlToElement("<ul></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"job-data-entry", label:"Data Entry"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.activateView(obj.viewId);
                    });
                });
                break;
            case "job-data-entry":
                this.constructJobDataForm();
                break;
            case "job-data-search":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Job Search</h2>";
                break;
            case "evaluation":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Evaluation</h2>";
                el = htmlToElement("<ul></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"scoresheet", label:"Score Sheet"},
                    {viewId:"ier", label:"Initial Evaluation Result (IER)"},
                    {viewId:"ies", label:"Individual Evaluation Sheet (IES)"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.activateView(obj.viewId);
                    });
                });
                break;
            case "scores": // NOT USED
                this.mainSections["main-" + viewId].innerHTML = "<h2>Scores and Rankings</h2>";
                break;
            case "ier":
                this.constructIER();
                break;
            case "ies":
                this.constructIES();
                break;
            case "account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Account</h2>";
                el = htmlToElement("<ul></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"my-account", label:"Edit My Account"},
                    {viewId:"other-account", label:"View/Edit Other Accounts"},
                    {viewId:"signout", label:"Sign Out"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    if (obj.viewId == "signout")
                    {
                        itemLink.addEventListener("click", event=>this.navClick(obj.viewId));
                    }
                    else
                    {
                        itemLink.addEventListener("click", event=>this.activateView(obj.viewId));
                    }
                });
                break;
            case "my-account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>My Account</h2>";
                el = htmlToElement("<ul></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {dialogId:"edit-user", label:"Edit my account details"},
                    {dialogId:"change-password", label:"Change my password"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        switch (obj.dialogId)
                        {
                            case "edit-user":
                                new UserEditor(this.main, "my-user-editor", 1, this.currentUser);
                                break;
                            case "change-password":
                                new PasswordEditor(this.main, "my-password-editor", true);
                                break;
                        }
                    });
                });
                break;
            case "other-account":
                var otherAccountFormEx = new FormEx(this.mainSections["main-" + viewId], "other-account-form-ex", false);

                otherAccountFormEx.setTitle("Other Account", 2);

                var searchBox = otherAccountFormEx.addInputEx("", "text", "", "Wildcards:\n\n    % - zero, one, or more characters\n    _ - one character");
                searchBox.setPlaceholderText("Enter a name or username to search");
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
                    postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=users&k=" + searchBox.getValue() + "%", (event)=>{
                        var response;

                        if (event.target.readyState == 4 && event.target.status == 200)
                        {
                            response = JSON.parse(event.target.responseText);

                            if (response.type == "Error")
                            {
                                otherAccountFormEx.raiseError("ERROR: " + response.content);
                            }
                            if (response.type == "Debug")
                            {
                                otherAccountFormEx.showInfo(response.content);
                                new MsgBox(app.main, response.content);
                                console.log("response.content: ", response.content);
                            }
                            else if (response.type == "Data")
                            {
                                var viewer = otherAccountFormEx.displayExs["list-users"];
                                var data = JSON.parse(response.content);

                                viewer.removeAllRows();

                                for (const row of data.filter(row=>row["username"] != this.currentUser["username"])) {
                                    viewer.addRow({
                                        "person_name":MPASIS_App.getFullName(row["given_name"], row["middle_name"], row["family_name"], row["spouse_name"], row["ext_name"], true, true),
                                        "username":row["username"],
                                        "control":""
                                    });
                                    var controlButtons = new InputEx(null, "", "buttonExs");
                                    controlButtons.container.classList.add("account-controls");
                                    controlButtons.addItem("<span class=\"material-icons-round blue\">edit</span>", "", "Edit Account");
                                    controlButtons.addItem("<span class=\"material-icons-round red\">close</span>", "", "Delete Account");
                                    controlButtons.inputExs.forEach((btn, index)=>{
                                        switch (index)
                                        {
                                            case 0:
                                                btn.addEvent("click", clickEditAccountEvent=>{
                                                    this.temp["searchButton"] = btnGrp.inputExs[0];
                                                    var editUserDialog = new UserEditor(this.main, "mpasis-other-account-user-editor", 1, row);
                                                });
                                                break;
                                            case 1:
                                                btn.addEvent("click", clickEditAccountEvent=>{
                                                    this.temp["searchButton"] = btnGrp.inputExs[0];
                                                    var deleteUserDialog = new MsgBox(this.main, "Do you really want to delete the user: " + row["username"] + "?", "YESNO", ()=>{
                                                        deleteUserDialog.btnGrp.inputExs[0].fields[0].removeEventListener("click", deleteUserDialog.defaultBtnFunc);

                                                        postData(MPASIS_App.processURL, "a=delete&username=" + row["username"] + "&temp_user=" + row["temp_user"], async deleteUserEvent=>{
                                                            var response;

                                                            if (deleteUserEvent.target.readyState == 4 && deleteUserEvent.target.status == 200)
                                                            {
                                                                response = JSON.parse(deleteUserEvent.target.responseText);

                                                                if (response.type == "Error")
                                                                {
                                                                    new MsgBox(app.main, "ERROR: " + response.content);
                                                                }
                                                                else if (response.type == "Success")
                                                                {
                                                                    new MsgBox(app.main, response.content);
                                                                    await sleep(3000);
                                                                    app.temp["searchButton"].fields[0].click();
                                                                }
                                                                else if (response.type == "Debug")
                                                                {
                                                                    new MsgBox(app.main, response.content);
                                                                    console.log("response.content: ", response.content);
                                                                }
                                                            }
                                                        });

                                                        this.temp["searchButton"].fields[0].click();
                                                    });
                                                });
                                                break;
                                        }
                                    });
                                    viewer.rows[viewer.rows.length - 1]["td"]["control"].appendChild(controlButtons.container);
                                }
                            }
                        }
                    });
                });
                btnGrp.inputExs[1].setLabelText("Add New Account");
                btnGrp.inputExs[1].setTooltipText("");
                btnGrp.inputExs[1].addEvent("click", (event)=>{
                    var addUserDialog = new UserEditor(this.main, "mpasis-other-account-user-editor", 0);
                });

                otherAccountFormEx.addStatusPane();
                otherAccountFormEx.setStatusMsgTimeout(10);
                
                otherAccountFormEx.addDisplayEx("div-table", "list-users");
                otherAccountFormEx.displayExs["list-users"].container.classList.add("query-results-users");
                otherAccountFormEx.displayExs["list-users"].setHeaders([
                    {colHeaderName:"person_name", colHeaderText:"Name"},
                    {colHeaderName:"username", colHeaderText:"Username"},
                    {colHeaderName:"control", colHeaderText:"Controls"}
                ]);
        
                break;
            case "settings":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Settings</h2>";
                break;
            default:
                console.log(viewId);
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
            postData(MPASIS_App.processURL, "app=mpasis&a=getSalaryFromSG&sg=" + changeEvent.target.inputEx.getValue(), (event)=>{
                var response;
                var sgField = changeEvent.target.inputEx;

                if (event.target.readyState == 4 && event.target.status == 200) {
                    response = JSON.parse(event.target.responseText);
                    
                    if (response.type == "Error") {
                        sgField.raiseError("ERROR: " + response.content);
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

        field = this.forms["jobData"].addInputEx("Plantilla Item Nos. (one item per line)", "textarea", "", "", "plantilla_item_number", "Position");
        field.container.style.gridColumn = "4 / span 9";
        field.setPlaceholderText("Please enter multiple plantilla item numbers on one line each");
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
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=positionCategory", "position_category", "position_categoryId", "description");
        
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
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=educLevel", "educational_attainment", "index", "description");
        
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
        eligField.reverse();
        eligField.setVertical();
        eligField.runAfterFilling = function(){
            var addEligibilityBtn = null;
            var eligField = this;

            addEligibilityBtn = new InputEx(this.fieldWrapper, "add-eligibility-input-ex", "buttonEx", false);
            addEligibilityBtn.setLabelText("+Add Missing Eligibility");
            addEligibilityBtn.addEvent("click", (clickEvent)=>{
                var addEligDialog = new DialogEx(this.container, "add-eligibility-dialog-ex");
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
                    newElig["eligibility"] = newEligText.getValue();
                    if (newElig["eligibility"] == "")
                    {
                        addEligForm.raiseError("Eligibility name should not be blank.");
                    }
                    else
                    {
                        if (newElig["description"] != "")
                        {
                            newElig["description"] = descText.getValue();
                        }

                        postData(MPASIS_App.processURL, "app=mpasis&a=add&eligibilities=" + packageData([newElig]), (event)=>{
                            var response;

                            if (event.target.readyState == 4 && event.target.status == 200)
                            {
                                response = JSON.parse(event.target.responseText);

                                if (response.type == "Error")
                                {
                                    addEligForm.raiseError("ERROR: " + response.content);
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

                                        eligField.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");
                                        
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
        eligField.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");

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
                return value;
            });

            plantillaItems = (this.forms["jobData"].dbInputEx["plantilla_item_number"].getValue() == "" ? [] : plantillaItems);

            var positions = [];
            var position = null;

            plantillaItems.forEach((plantillaItem)=>{
                position = {};

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
            postData(MPASIS_App.processURL, "app=mpasis&a=add&positions=" + packageData(positions), (event)=>{
                var response;

                if (event.target.readyState == 4 && event.target.status == 200)
                {
                    response = JSON.parse(event.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(this.forms["jobData"].container, "ERROR: " + response.content, "OK");
                    }
                    else if (response.type == "Success")
                    {
                        new MsgBox(this.forms["jobData"].container, response.content, "OK");
                    }
                }
            });
        });
        jobDataBtnGrp.inputExs[1].setLabelText("Reset");
        jobDataBtnGrp.inputExs[1].setTooltipText("");
        jobDataBtnGrp.inputExs[1].addEvent("click", (event)=>{
            window.location.reload(true);
        }); // TO IMPLEMENT IN FORMEX/INPUTEX
        jobDataBtnGrp.container.style.gridColumn = "8 / span 5";
        jobDataBtnGrp.setStatusMsgTimeout(20);

        var status = this.forms["jobData"].addStatusPane();
        status.style.gridColumn = "1 / span 7";

        return this.forms["jobData"];
    }

    constructApplicantDataForm()
    {
        var applicantDataForm = null, header = null, field = null, applicant = null, searchedApplicants = null, row = null, getAppliedPosition;

        if (this.forms["applicantData"] != null && this.forms["applicantData"] != undefined)
        {
            return this.forms["applicantData"];
        }

        document.positions = [];
        document.salaryGrade = [];
        document.mpsEducIncrement = [];
        document.enumEducationalAttainment = [];

        document.scrim = new ScrimEx(this.main);

        applicantDataForm = this.forms["applicantData"] = new FormEx(this.mainSections["main-applicant-data-entry"], "applicant-data-form-ex", true);
        applicantDataForm.setFullWidth();

        applicantDataForm.fieldWrapper.style.display = "grid";
        applicantDataForm.fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
        applicantDataForm.fieldWrapper.style.gridAutoFlow = "column";
        applicantDataForm.fieldWrapper.style.gridGap = "1em";
        applicantDataForm.fieldWrapper.style.alignItems = "center";
        applicantDataForm.dataLoaded = [];

        applicantDataForm.formMode = 0; // 0: creation; 1: update
        
        header = applicantDataForm.setTitle("Applicant Data Entry", 2);

        header = applicantDataForm.addHeader("Position Applied", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var positionField = applicantDataForm.addInputEx("Position Title", "combo", "", "Please select the position title from the drop-down menu. You may type on the text box to filter the positions.", "position_title_applied", "Job_Application");
        positionField.container.style.gridColumn = "1 / span 4";
        positionField.setVertical();
        
        var parenField = applicantDataForm.addInputEx("Parenthetical Title", "combo", "", "Please select the parenthetical position titles available from the drop-down menu. You may type on the text box to filter the entries.", "parenthetical_title_applied", "Job_Application");
        parenField.setPlaceholderText("(optional)");
        parenField.container.style.gridColumn = "5 / span 4";
        parenField.setVertical();

        var plantillaField = applicantDataForm.addInputEx("Plantilla Item Number", "combo", "", "Please select the plantilla item numbers available from the drop-down menu or select ANY instead. You may type on the text box to filter the entries.", "plantilla_item_number_applied", "Job_Application");
        plantillaField.container.style.gridColumn = "9 / span 4";
        plantillaField.setVertical();

        getAppliedPosition = function(positionsArray, positionField = new InputEx(), parenField = new InputEx(), plantillaField = new InputEx()){
            return document.positions.filter(position=>((position["parenthetical_title"] == parenField.getValue().trim() || plantillaField.getValue().trim() == "ANY" || plantillaField.getValue().trim() == "") && position["position_title"] == positionField.getValue().trim() || position["plantilla_item_number"] == plantillaField.getValue().trim()))[0];
        }

        header = applicantDataForm.addHeader("Personal Information", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var loadApplicant = applicantDataForm.addInputEx("Load Existing Applicant", "buttonEx");
        loadApplicant.container.style.gridColumn = "1 / span 8";
        
        field = applicantDataForm.addInputEx("Application Code", "text", "", "Application Code", "application_code", "Job_Application");
        field.container.style.gridColumn = "9 / span 4";
        field.setVertical();

        field = applicantDataForm.addInputEx("Given Name", "text", "", "First Name", "given_name", "Person");
        field.container.style.gridColumn = "1 / span 4";
        field.setVertical();
        
        field = applicantDataForm.addInputEx("Middle Name", "text", "", "Middle Name", "middle_name", "Person");
        field.setPlaceholderText("(optional)");
        field.container.style.gridColumn = "5 / span 4";
        field.setVertical();

        field = applicantDataForm.addInputEx("Family Name", "text", "", "Last Name", "family_name", "Person");
        field.container.style.gridColumn = "9 / span 4";
        field.setVertical();

        field = applicantDataForm.addInputEx("Spouse's Name", "text", "", "Spouse's Name; for married women", "spouse_name", "Person");
        field.setPlaceholderText("(optional)");
        field.container.style.gridColumn = "1 / span 4";
        field.setVertical();

        field = new DisplayEx(applicantDataForm.fieldWrapper, "span", "", " "); // A sort of make-shift spacer
        field.container.style.gridColumn = "5 / span 4";


        field = applicantDataForm.addInputEx("Ext. Name", "text", "", "Extension Name (e.g., Jr., III, etc.)", "ext_name", "Person");
        field.setPlaceholderText("(optional)");
        field.container.style.gridColumn = "9 / span 4";
        field.setVertical();

        field = applicantDataForm.addInputEx("Address", "textarea", "", "Present/Permanent Address", "address", "Address"); // use present address for now; prefer localization
        field.container.style.gridColumn = "1 / span 12";
        field.setVertical();

        field = applicantDataForm.addInputEx("Age", "number", "", "Age", "age", "Person");
        field.container.style.gridColumn = "1 / span 4";
        field.setVertical();
        field.setMin(10);
        field.setMax(999);

        field = applicantDataForm.addInputEx("Sex", "select", "", "Sex", "sex", "Person");
        field.container.style.gridColumn = "5 / span 4";
        field.setVertical();
        field.addItem("Male", 1);
        field.addItem("Female", 2);

        field = applicantDataForm.addInputEx("Civil Status", "select", "", "Civil Status", "civil_status", "Person"); // Cross-reference
        field.container.style.gridColumn = "9 / span 4";
        field.setVertical();
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=civilStatus", "civil_status", "index", "description");

        field = applicantDataForm.addInputEx("Religion", "combo", "", "Religious Affiliation", "religion", "Person"); // Cross-reference; Allow adding new
        field.container.style.gridColumn = "1 / span 4";
        field.setVertical();
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=religion", "religion", "religionId", "description");

        field = applicantDataForm.addInputEx("Disability", "combo", "", "Disability; if multiple, please separate with semi-colons", "disability", "Person_Disability"); // Multiple cross-reference; Allow adding new
        field.container.style.gridColumn = "5 / span 4";
        field.setVertical();
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=disability", "disability", "disabilityId", "description");

        field = applicantDataForm.addInputEx("Ethnic Group", "combo", "", "Ethnic Group", "ethnicity", "Person"); // Cross-reference; Allow adding new
        field.container.style.gridColumn = "9 / span 4";
        field.setVertical();
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=ethnicGroup", "ethnic_group", "ethnicityId", "description");

        field = applicantDataForm.addInputEx("Email Address", "email", "", "Email address; if multiple, please separate with semi-colons", "email_address", "Email_Address"); // Multiple cross-reference; Allow adding new
        field.container.style.gridColumn = "1 / span 6";
        field.setVertical();

        field = applicantDataForm.addInputEx("Contact Number", "text", "", "Contact numbers; if multiple, please separate with semi-colons", "contact_number", "Contact_Number");
        field.container.style.gridColumn = "7 / span 6";
        field.setVertical();

        header = applicantDataForm.addHeader("Educational Attainment", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var educField = applicantDataForm.addInputEx("Please choose the highest level completed", "radio-select", "1", "Highest finished educational level", "educational_attainment", "Person", true);
        educField.container.style.gridColumn = "1 / span 12";
        educField.setVertical();
        educField.showColon();
        educField.reverse();

        var degreeTable = applicantDataForm.addInputEx("Degrees Taken by Applicant", "table", "", "", "degree_taken", "Degree_Taken", true);
        degreeTable.container.style.gridColumn = "1 / span 12";
        degreeTable.setHeaders("Type", "Degree Name", "Year/Level Completed", "Units Earned", "Complete Academic Requirements", "Graduation Year");
        Array.from(degreeTable.thead.children).forEach((th, i)=>{
            if (i < degreeTable.thead.children.length - 1)
            {
                th.style.border = "1px solid";
                th.style.backgroundColor = "lightgray";
                th.style.fontSize = (i > 1 ? "0.6em" : "0.75em");
                th.style.textAlign = "center";
                th.style.verticalAlign = "middle";
            }
        });
        degreeTable.setTypes("select", "text", "number", "number", "checkbox", "number");
        degreeTable.setDBColNames("degree_typeIndex", "degree", "year_level_completed", "units_earned", "complete_academic_requirements", "graduation_year");
        degreeTable.setDBKeyName("degree_takenId");

        var displaySpecEduc = new DisplayEx(applicantDataForm.fieldWrapper, "fieldset", "", "", "Specific Educational Requirements of the Position", "The position applied requires this specific educational attainment.");
        displaySpecEduc.setFullWidth();
        displaySpecEduc.container.style.gridColumn = "1 / span 12";
        var reqSpecEduc = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
        addText("NONE", reqSpecEduc);
        displaySpecEduc.addContent(reqSpecEduc);
        displaySpecEduc.addLineBreak(2);
        var specEducAttained = applicantDataForm.addInputEx("Applicant possesses this specific educational requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required education.", "has_specific_education_required", "Job_Application");
        displaySpecEduc.addContent(specEducAttained.container);
        specEducAttained.reverse();
        specEducAttained.disable();

        var displayEducIncrement = new DisplayEx(applicantDataForm.fieldWrapper, "div", "educ-increment-display-ex", "", "Education Increment Level");
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
            var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);
            var increment = ScoreSheet.getEducIncrements(parseInt(educField.getValue()), degreeTable.getValue());
            
            requiredEducIncrement.innerHTML = (appliedPosition == null ? 0 : ScoreSheet.getEducIncrements(appliedPosition["required_educational_attainment"], []));

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

        specEducAttained.addEvent("change", changeEvent=>{
            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
        });

        educField.runAfterFilling = function(){
            educField["previousValue"] = educField.getValue();

            for (const inputEx of educField.inputExs)
            {
                inputEx.addEvent("change", changeEvent=>{
                    degreeTable.addRowButtonEx.enable(null, (inputEx.getValue() >= 4 && inputEx.getValue() <= 8));

                    if (degreeTable.inputExs.length > 0)
                    {
                        new MsgBox(educField.fieldWrapper,
                            "You are trying to switch educational attainments while degrees have already been added. This will result in some incompatible degrees being deleted from the list. Do you still want to continue?",
                            "YESNO",
                            yes=>{
                                var educAttainment = inputEx.getValue();
                                degreeTable.removeRowOverride = true;
                                for (var i = 0; i < degreeTable.inputExs.length; i++)
                                {
                                    var degree = degreeTable.inputExs[i];

                                    if (educAttainment < 4 || (educAttainment < 6 && degree["degree_typeIndex"].getDataValue() > 6) || (educAttainment < 7 && degree["degree_typeIndex"].getDataValue() > 7))
                                    {
                                        degree["degree_typeIndex"]["tr"]["removeBtn"].fields[0].click();
                                        i--;
                                    }
                                }
                                degreeTable.removeRowOverride = false;
                                educField["previousValue"] = inputEx.getValue();

                                attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                            }, no=>{
                                educField.setValue(educField["previousValue"] ?? "");

                                attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                            });
                    }
                    else
                    {
                        educField["previousValue"] = educField.getValue();

                        attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                    }
                });
            }
        };

        header = applicantDataForm.addHeader("Training", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var trainingDiv = createElementEx(NO_NS, "fieldset", applicantDataForm.fieldWrapper, null);
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

        var displaySpecTraining = new DisplayEx(applicantDataForm.fieldWrapper, "fieldset", "", "", "Specific Training Requirements of the Position", "The position applied requires this specific training.");
        displaySpecTraining.setFullWidth();
        displaySpecTraining.container.style.gridColumn = "1 / span 12";
        var reqSpecTraining = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
        addText("NONE", reqSpecTraining);
        displaySpecTraining.addContent(reqSpecTraining);
        displaySpecTraining.addLineBreak(2);
        var specTrainingAttained = applicantDataForm.addInputEx("Applicant possesses this specific training requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required training.", "has_specific_training", "Job_Application");
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

            requiredTrainingIncrement.innerHTML = (appliedPosition == null ? 0 : Math.trunc(appliedPosition["required_training_hours"] / 8) + 1);

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

            trainingInputExs[trainingInputExs.length - 1]["trainingHoursInputEx"].setDefaultValue(0, true);

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
                if (removeRowBtn.removeRowOverride)
                {
                    trainingInputExs.splice(trainingInputExs.indexOf(removeRowBtn.rowData), 1);
                    removeRowBtn.row.remove();
                    attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
                }
                else
                {
                    var msg = new MsgBox(applicantDataForm.fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                        trainingInputExs.splice(trainingInputExs.indexOf(removeRowBtn.rowData), 1);
                        removeRowBtn.row.remove();
                        attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
                    });
                }
            });

            for (const key in trainingInputExs[trainingInputExs.length - 1])
            {
                trainingInputExs[trainingInputExs.length - 1][key]["removeRowBtn"] = removeRowBtn;
            }

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

        var displayTrainingIncrement = new DisplayEx(applicantDataForm.fieldWrapper, "div", "training-increment-display-ex", "", "Training Increment Level");
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
        
        header = applicantDataForm.addHeader("Work Experience", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var workExpDiv = createElementEx(NO_NS, "fieldset", applicantDataForm.fieldWrapper, null);
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

        var displaySpecWorkExp = new DisplayEx(applicantDataForm.fieldWrapper, "fieldset", "", "", "Specific Work Experience Requirements of the Position", "The position applied requires this specific work experience.");
        displaySpecWorkExp.setFullWidth();
        displaySpecWorkExp.container.style.gridColumn = "1 / span 12";
        var reqSpecWorkExp = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
        addText("NONE", reqSpecWorkExp);
        displaySpecWorkExp.addContent(reqSpecWorkExp);
        displaySpecWorkExp.addLineBreak(2);
        var specWorkExpAttained = applicantDataForm.addInputEx("Applicant possesses this specific work experience requirement", "checkbox", "", "Mark this checkbox if applicant has attained this required work experience.", "has_specific_work_experience", "Job_Application");
        displaySpecWorkExp.addContent(specWorkExpAttained.container);
        specWorkExpAttained.reverse();
        specWorkExpAttained.disable();

        var displayWorkExpIncrement = new DisplayEx(applicantDataForm.fieldWrapper, "div", "work-exp-increment-display-ex", "", "Work Experience Increment Level");
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

        var computeWorkExpIncrement = ()=>{ // APPROXIMATION ONLY!!!
            var totals = workExpInputExs.map(workExp=>{
                var start = workExp["workExpStartDateInputEx"].getValue();
                var end = workExp["workExpEndDateInputEx"].getValue();
                end = (end == "" ? this.defaultEndDate : end);

                var dur = ScoreSheet.getDuration(start, end);

                workExp["workExpDuration"].setHTMLContent(ScoreSheet.convertDurationToString(dur));

                return dur;
            });

            var total = (totals.length > 0 ? totals.reduce(ScoreSheet.addDuration) : {y:0, m:0, d:0});
            
            totalWorkExpDuration.innerHTML = (total.y > 0 ? total.y + "&nbsp;year" + (total.y == 1 ? "" : "s") : "") + (total.m > 0 ? (total.y > 0 ? ", " : "") + total.m + "&nbsp;month" + (total.m == 1 ? "" : "s") : "") + (total.y + total.m > 0 && total.d != 0 ? ", " : "") + (total.y + total.m > 0 && total.d == 0 ? "" : total.d + "&nbsp;day" + (total.d == 1 ? "" : "s"));

            var increment = Math.trunc((total.y * 12 + total.m + total.d / 30) / 6) + 1;

            var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);

            requiredWorkExpIncrement.innerHTML = (appliedPosition == null ? 0 : Math.trunc(appliedPosition["required_work_experience_years"] * 12 / 6) + 1);

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
                if (removeRowBtn.removeRowOverride)
                {
                    workExpInputExs.splice(workExpInputExs.indexOf(removeRowBtn.rowData), 1);
                    removeRowBtn.row.remove();
                    attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                }
                else
                {
                    var msg = new MsgBox(applicantDataForm.fieldWrapper, "Do you really want to delete this row?", "YESNO", (msgEvent)=>{
                        workExpInputExs.splice(workExpInputExs.indexOf(removeRowBtn.rowData), 1);
                        removeRowBtn.row.remove();
                        attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                    });
                }
            });

            for (const key in workExpInputExs[workExpInputExs.length - 1])
            {
                workExpInputExs[workExpInputExs.length - 1][key]["removeRowBtn"] = removeRowBtn;
            }

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

        header = applicantDataForm.addHeader("Eligibility", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        field = applicantDataForm.addInputEx("Please select all the career service eligibility that the applicant possesses", "checkbox-select", "", "CS Eligibility", "eligibilityId", "Person", true);
        field.container.style.gridColumn = "1 / span 12";
        field.setVertical();
        field.showColon();
        field.reverse();

        var displayEligQualification = new DisplayEx(applicantDataForm.fieldWrapper, "div", "eligibility-qualification-display-ex", "", "Eligibility", "The applicant's qualification according to possessed eligibility");
        displayEligQualification.container.style.gridColumn = "1 / span 12";
        displayEligQualification.container.style.fontSize = "1.2em";
        displayEligQualification.container.style.fontStyle = "italic";
        displayEligQualification.container.classList.add("right");
        displayEligQualification.label.style.fontWeight = "bold";
        displayEligQualification.showColon();
        var remarkElig = createElementEx(NO_NS, "span", null, null, "class", "remark");
        addText("Not Required", remarkElig);
        displayEligQualification.addContent(remarkElig);

        field.runAfterFilling = function(){
            var parentEx = this;
            MPASIS_App.processURL = "/mpasis/php/process.php";

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
                    newElig["eligibility"] = newEligText.getValue();
                    if (newElig["eligibility"] == "")
                    {
                        addEligForm.raiseError("Eligibility name should not be blank.");
                    }
                    else
                    {
                        if (newElig["description"] != "")
                        {
                            newElig["description"] = descText.getValue();
                        }

                        postData(MPASIS_App.processURL, "app=mpasis&a=add&eligibilities=" + packageData([newElig]), (event)=>{
                            var response;

                            if (event.target.readyState == 4 && event.target.status == 200)
                            {
                                response = JSON.parse(event.target.responseText);

                                if (response.type == "Error")
                                {
                                    addEligForm.raiseError("ERROR: " + response.content);
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

                                        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");
                                        
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
                inputEx["changeElig"] = changeEvent=>{
                    var appliedPosition = getAppliedPosition(document.positions, positionField, parenField, plantillaField);
                    var requiredEligibilities = [];
                    
                    if (appliedPosition != null)
                    {
                        for (const reqElig of appliedPosition["required_eligibility"]) {
                            requiredEligibilities.push([]);
                            var requiredEligibility = requiredEligibilities[requiredEligibilities.length - 1];
                            requiredEligibility.push(reqElig["eligibilityId"]);
                            if (reqElig["eligibilityId2"] != null && reqElig["eligibilityId2"] != undefined && (typeof(reqElig["eligibilityId2"]) == "string" && reqElig["eligibilityId2"] != ""))
                            {
                                requiredEligibility.push(reqElig["eligibilityId2"]);
                            }
                            if (reqElig["eligibilityId3"] != null && reqElig["eligibilityId3"] != undefined && (typeof(reqElig["eligibilityId3"]) == "string" && reqElig["eligibilityId3"] != ""))
                            {
                                requiredEligibility.push(reqElig["eligibilityId3"]);
                            }
                        }
                    }

                    var validElig = ScoreSheet.validateEligibility(parentEx.getValue(), requiredEligibilities);
    
                    remarkElig.innerHTML = (validElig < 0 ? "Not Required" : (validElig > 0 ? "" : "Not ") + "Qualified");
                    remarkElig.style.color = (validElig > 0 ? "green" : (validElig == 0 ? "red" : null));
                };

                inputEx.addEvent("change", inputEx["changeElig"]);
            }
            
        };
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=eligibilities", "eligibility", "eligibilityId", "description");

        header = applicantDataForm.addHeader("Competency", 3);
        header.style.gridColumn = "1 / span 12";
        header.style.marginBottom = "0";

        var displayCompetency = new DisplayEx(applicantDataForm.fieldWrapper, "fieldset", "", "", "Competency", "The position applied requires this specific competency.");
        displayCompetency.setFullWidth();
        displayCompetency.container.style.gridColumn = "1 / span 12";
        var reqCompetency = createElementEx(NO_NS, "span", null, null, "class", "req-spec-educ", "style", "font-weight: bold;");
        addText("NONE", reqCompetency);
        displayCompetency.addContent(reqCompetency);
        displayCompetency.addLineBreak(2);
        var competencyAttained = applicantDataForm.addInputEx("Applicant possesses this specific competency requirement", "checkbox", "", "Mark this checkbox if applicant possesses this competency.", "has_specific_competency_required", "Job_Application");
        displayCompetency.addContent(competencyAttained.container);
        competencyAttained.reverse();
        competencyAttained.disable();

        var displayCompetencyQualification = new DisplayEx(applicantDataForm.fieldWrapper, "div", "competency-qualification-display-ex", "", "Competency", "The applicant's qualification according to possessed competency");
        displayCompetencyQualification.container.style.gridColumn = "1 / span 12";
        displayCompetencyQualification.container.style.fontSize = "1.2em";
        displayCompetencyQualification.container.style.fontStyle = "italic";
        displayCompetencyQualification.container.classList.add("right");
        displayCompetencyQualification.label.style.fontWeight = "bold";
        displayCompetencyQualification.showColon();
        var remarkCompetency = createElementEx(NO_NS, "span", null, null, "class", "remark");
        addText("Not Required", remarkCompetency);
        displayCompetencyQualification.addContent(remarkCompetency);

        loadApplicant.addEvent("click", loadApplicantClickEvent=>{
            var retrieveApplicantDialog = null;
            if (loadApplicantClickEvent.target.innerHTML == "Load Existing Applicant")
            {
                retrieveApplicantDialog = new DialogEx(applicantDataForm.fieldWrapper, "scoresheet-load-applicant");
                var form = retrieveApplicantDialog.addFormEx();
                
                var searchBox = form.addInputEx("Enter an applicant name or application code", "text", "", "Type to populate list");
                searchBox.setFullWidth();
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
    
                var retrieveApplicantDialogBtnGrp = form.addFormButtonGrp(3);
                retrieveApplicantDialogBtnGrp.setFullWidth();
                retrieveApplicantDialogBtnGrp.container.style.marginTop = "0.5em";
                retrieveApplicantDialogBtnGrp.fieldWrapper.classList.add("right");

                retrieveApplicantDialogBtnGrp.inputExs[0].setLabelText("New Application");
                retrieveApplicantDialogBtnGrp.inputExs[0].setTooltipText("Load selected applicant information for a new application");
                retrieveApplicantDialogBtnGrp.inputExs[0].disable();

                retrieveApplicantDialogBtnGrp.inputExs[1].setLabelText("Edit Application");
                retrieveApplicantDialogBtnGrp.inputExs[1].setTooltipText("Load selected applicant information for updating");
                retrieveApplicantDialogBtnGrp.inputExs[1].disable();

                retrieveApplicantDialogBtnGrp.inputExs[2].setLabelText("Cancel");
                retrieveApplicantDialogBtnGrp.inputExs[2].setTooltipText("");
                retrieveApplicantDialogBtnGrp.inputExs[2].addEvent("click", cancelRetrieveDialogClickEvent=>{
                    retrieveApplicantDialog.close();
                });

                var retrieveApplicant = (applicationObj, newApplication = false)=>{
                        
                        console.log(applicationObj, applicantDataForm.dbInputEx);

                        if (!newApplication)
                        {
                            applicantDataForm.dbInputEx["position_title_applied"].setDefaultValue(applicationObj["position_title_applied"] ?? "", true);
                            applicantDataForm.dbInputEx["parenthetical_title_applied"].setDefaultValue(applicationObj["parenthetical_title_applied"] ?? "", true);
                            applicantDataForm.dbInputEx["plantilla_item_number_applied"].setDefaultValue(applicationObj["plantilla_item_number_applied"] ?? "ANY", true);
                            plantillaChange();
                        }

                        for (const key in applicationObj)
                        {
                            if (key in applicantDataForm.dbInputEx)
                            {
                                switch (key)
                                {
                                    case "position_title_applied":
                                    case "parenthetical_title_applied":
                                    case "plantilla_item_number_applied":
                                        // do nothing; whatever needs to be done here needs to be done earlier
                                        break;
                                    case "sex":
                                        applicantDataForm.dbInputEx[key].setDefaultValue((applicationObj[key] == "Male" ? 1 : (applicationObj[key] == "Female" ? 2 : "")), true);
                                        break;
                                    case "civil_status":
                                        applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj["civil_statusIndex"], true);
                                        break;
                                    case "disability":
                                    case "email_address":
                                    case "contact_number":
                                        if (applicationObj[key].length > 0)
                                        {
                                            applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj[key].map(number=>number[key]).join(";"), true);
                                        }
                                        break;
                                    case "degree_taken":
                                        break;
                                    case "educational_attainment":
                                        applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj["educational_attainmentIndex"], true);
                                        applicantDataForm.dbInputEx["degree_taken"].setDefaultValue(applicationObj["degree_taken"]);
                                        applicantDataForm.dbInputEx["degree_taken"].setValue("degree_takenId", applicationObj["degree_taken"]);
                                        attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                                        break;
                                    default:
                                        if (!newApplication && !applicantDataForm.dbInputEx[key].isDisabled() && (applicantDataForm.dbInputEx[key].type == "checkbox" || applicantDataForm.dbInputEx[key] == "radio"))
                                        {
                                            applicantDataForm.dbInputEx[key].check(applicationObj[key] == 1);
                                        }
                                        else if (!newApplication || key != "application_code")
                                        {
                                            applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj[key] ?? "", true);
                                        }
                                        break;
                                }
                            }
                            else
                            {
                                switch (key)
                                {
                                    case "present_address":
                                        applicantDataForm.dbInputEx["address"].setDefaultValue(applicationObj["permanent_address"] ?? applicationObj["present_address"] ?? "", true);
                                        break;
                                    case "ethnic_group":
                                        applicantDataForm.dbInputEx["ethnicity"].setDefaultValue(applicationObj[key] ?? "", true);
                                        break;
                                    case "relevant_training":
                                        while(trainingInputExs.length > 0)
                                        {
                                            trainingInputExs[trainingInputExs.length - 1]["trainingInputEx"]["removeRowBtn"].removeRowOverride = true;
                                            trainingInputExs[trainingInputExs.length - 1]["trainingInputEx"]["removeRowBtn"].fields[0].click();
                                        }

                                        for (const training of applicationObj[key])
                                        {
                                            addTrainingBtn.fields[0].click();
                                            trainingInputExs[trainingInputExs.length - 1]["trainingInputEx"].setDefaultValue(training["descriptive_name"], true);
                                            trainingInputExs[trainingInputExs.length - 1]["trainingHoursInputEx"].setDefaultValue(training["hours"], true);
                                        }
                                        attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
                                        break;
                                    case "has_more_unrecorded_training":
                                        moreTraining.check(applicationObj[key] == 1);
                                        break;
                                    case "has_more_unrecorded_work_experience":
                                        moreWorkExp.check(applicationObj[key] == 1);
                                        break;
                                    case "relevant_work_experience":
                                        while(workExpInputExs.length > 0)
                                        {
                                            workExpInputExs[workExpInputExs.length - 1]["workExpInputEx"]["removeRowBtn"].removeRowOverride = true;
                                            workExpInputExs[workExpInputExs.length - 1]["workExpInputEx"]["removeRowBtn"].fields[0].click();
                                        }

                                        for (const workExp of applicationObj[key])
                                        {
                                            addWorkExpBtn.fields[0].click();
                                            workExpInputExs[workExpInputExs.length - 1]["workExpInputEx"].setDefaultValue(workExp["descriptive_name"], true);
                                            workExpInputExs[workExpInputExs.length - 1]["workExpStartDateInputEx"].setDefaultValue(workExp["start_date"], true);
                                            workExpInputExs[workExpInputExs.length - 1]["workExpEndDateInputEx"].setDefaultValue(workExp["end_date"], true);
                                            workExpInputExs[workExpInputExs.length - 1]["workExpDuration"].setHTMLContent(ScoreSheet.convertDurationToString(ScoreSheet.getDuration(workExp["start_date"], workExp["end_date"])));
                                        }
                                        attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
                                        break;
                                    case "relevant_eligibility":
                                        applicantDataForm.dbInputEx["eligibilityId"].setDefaultValue(applicationObj[key].map(elig=>elig["eligibilityId"]), true);
                                        applicantDataForm.dbInputEx["eligibilityId"].inputExs[1]["changeElig"]();
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        if (!newApplication)
                        {
                            applicantDataForm.dbInputEx["application_code"].disable();
                        }

                        applicantDataBtnGrp.inputExs[0].setLabelText(newApplication ? "Save" : "Update");

                        loadApplicant.setLabelText("Reset Form");
                };

                searchResult.runAfterFilling = ()=>{
                    retrieveApplicantDialogBtnGrp.inputExs[0].addEvent("click", loadApplicationDialogClickEvent=>{
                        if (typeof(searchResult.getValue()) == "string" && searchResult.getValue() == "" || searchResult.getValue() == null)
                        {
                            retrieveApplicantDialog.formEx.raiseError("Please select an item to load before continuing");
                            return;
                        }
                        else
                        {
                            applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0]
                            retrieveApplicant(applicantDataForm.dataLoaded, true);
                        }
                        
                        retrieveApplicantDialog.close();
                    });

                    retrieveApplicantDialogBtnGrp.inputExs[1].addEvent("click", loadApplicationDialogClickEvent=>{
                        if (typeof(searchResult.getValue()) == "string" && searchResult.getValue() == "" || searchResult.getValue() == null)
                        {
                            retrieveApplicantDialog.formEx.raiseError("Please select an item to load before continuing");
                            return;
                        }
                        else
                        {
                            applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0]
                            retrieveApplicant(applicantDataForm.dataLoaded, false);
                        }
                        
                        retrieveApplicantDialog.close();
                    });
                };
                
                searchBox.addEvent("keyup", keyupEvent=>{
                    searchResult.clearList();

                    searchResult.show();
                    retrieveApplicantDialogBtnGrp.inputExs[0].enable();
                    retrieveApplicantDialogBtnGrp.inputExs[1].enable();

                    searchResult.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=applicationsByApplicantOrCode&srcStr=" + searchBox.getValue(), "applicant_option_label", "application_code");
                });
            }
            else if (loadApplicantClickEvent.target.innerHTML == "Reset Form")
            {
                // applicantDataForm.resetForm();
                this.showScrim();
                window.location.reload(true);

                loadApplicantClickEvent.target.innerHTML = "Load Existing Applicant";
            }
        });

        postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=initial-data", (postEvent)=>{
            var response;

            if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
            {
                response = JSON.parse(postEvent.target.responseText);

                if (response.type == "Error")
                {
                    new MsgBox(applicantDataForm.container, "ERROR: " + response.content, "CLOSE");
                }
                else if (response.type == "Data")
                {
                    var data = JSON.parse(response.content);

                    document.positions = data["positions"];
                    document.salaryGrade = data["salary_grade"];
                    document.mpsEducIncrement = data["mps_increment_table_education"];
                    document.enumEducationalAttainment = data["enum_educational_attainment"];
                    document.positionCategory = data["position_category"];
                    
                    document.scrim.destroy();

                    positionField.fillItems(document.positions.filter((position, index, positions)=>{
                        var i = 0;
                        while (i < index && positions[i]["position_title"] != position["position_title"]) { i++; }
                        return i == index && position["filled"] == 0;
                    }), "position_title", "", ""); // removes duplicate positions

                    educField.fillItems(document.enumEducationalAttainment, "educational_attainment", "index", "description");
                    educField.runAfterFilling();

                    degreeTable.setInitFunctions(function(inputEx){
                        inputEx["td"].style.border = "1px solid";
                        inputEx.setWidth("100%");
                        inputEx.fillItems(document.enumEducationalAttainment, "educational_attainment", "index", "description");
                        for (const option of Array.from(inputEx.fields[0].children))
                        {
                            if (option.hasAttribute("value") && option.value < 6)
                            {
                                option.remove();
                            }
                        }
                        inputEx.addEvent("change", selectDegreeTypeChangeEvent=>{
                            inputEx["tr"]["inputRow"]["degree"].enable(null, inputEx.getValue() != "");
                            inputEx["tr"]["inputRow"]["degree"].resetValue();
                            inputEx["tr"]["inputRow"]["year_level_completed"].disable();
                            inputEx["tr"]["inputRow"]["year_level_completed"].resetValue();
                            inputEx["tr"]["inputRow"]["units_earned"].disable();
                            inputEx["tr"]["inputRow"]["units_earned"].resetValue();
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].disable();
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].resetValue();
                            inputEx["tr"]["inputRow"]["graduation_year"].disable();
                            inputEx["tr"]["inputRow"]["graduation_year"].resetValue();
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        });
                    }, function(inputEx){
                        inputEx["td"].style.border = "1px solid";
                        inputEx.setWidth("100%");
                        inputEx.disable();
                        var degreeNameChange = degreeNameEvent=>{
                            var setting = (inputEx.getValue() != "");
                            inputEx["tr"]["inputRow"]["year_level_completed"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["units_earned"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].enable(null, setting && inputEx["tr"]["inputRow"]["degree_typeIndex"].getValue() != "Bachelor's Degree");
                            inputEx["tr"]["inputRow"]["graduation_year"].enable(null, setting);
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        };
                        inputEx.addEvent("change", degreeNameChange);
                        inputEx.addEvent("keydown", degreeNameChange);
                        inputEx.addEvent("keyup", degreeNameChange);
                        inputEx.addEvent("keypress", degreeNameChange);
                        inputEx.addEvent("blur", degreeNameChange);
                    }, function(inputEx){
                        inputEx["td"].style.border = "1px solid";
                        inputEx.setTooltipText("Leave blank to make the other options available");
                        inputEx.setMin(0);
                        inputEx.setMax(8);
                        inputEx.setWidth("100%");
                        inputEx.fields[0].classList.add("right");
                        inputEx.disable();
                        var unitsEarnedChange = unitsEarnedEvent=>{
                            var setting = (inputEx.getValue() == "" && inputEx["tr"]["inputRow"]["units_earned"].getValue() == "");
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].enable(null, setting && inputEx["tr"]["inputRow"]["degree_typeIndex"].getValue() != "Bachelor's Degree");
                            inputEx["tr"]["inputRow"]["graduation_year"].enable(null, setting);
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        };
                        inputEx.addEvent("change", unitsEarnedChange);
                        inputEx.addEvent("keydown", unitsEarnedChange);
                        inputEx.addEvent("keyup", unitsEarnedChange);
                        inputEx.addEvent("keypress", unitsEarnedChange);
                        inputEx.addEvent("blur", unitsEarnedChange);
                        inputEx.addEvent("blur", blurEvent=>{
                            if (inputEx.getValue() == 0)
                            {
                                inputEx.setValue("");
                            }
                        });
                    }, function(inputEx){
                        inputEx["td"].style.border = "1px solid";
                        inputEx.setTooltipText("Leave blank to make the other options available");
                        inputEx.setMin(0);
                        inputEx.setMax(999);
                        inputEx.setWidth("100%");
                        inputEx.fields[0].classList.add("right");
                        inputEx.disable();
                        var unitsEarnedChange = unitsEarnedEvent=>{
                            var setting = (inputEx.getValue() == "" && inputEx["tr"]["inputRow"]["year_level_completed"].getValue() == "");
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].enable(null, setting && inputEx["tr"]["inputRow"]["degree_typeIndex"].getValue() != "Bachelor's Degree");
                            inputEx["tr"]["inputRow"]["graduation_year"].enable(null, setting);
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        };
                        inputEx.addEvent("change", unitsEarnedChange);
                        inputEx.addEvent("keydown", unitsEarnedChange);
                        inputEx.addEvent("keyup", unitsEarnedChange);
                        inputEx.addEvent("keypress", unitsEarnedChange);
                        inputEx.addEvent("blur", unitsEarnedChange);
                        inputEx.addEvent("blur", blurEvent=>{
                            if (inputEx.getValue() == 0)
                            {
                                inputEx.setValue("");
                            }
                        });
                    }, function(inputEx){
                        inputEx["td"].style.textAlign = "center";
                        inputEx["td"].style.border = "1px solid";
                        inputEx["td"].title = "Leave blank to make the other options available";
                        inputEx.setTooltipText("Leave blank to make the other options available");
                        inputEx.disable();
                        var carChange = carEvent=>{
                            var setting = !inputEx.isChecked();
                            inputEx["tr"]["inputRow"]["year_level_completed"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["units_earned"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["graduation_year"].enable(null, setting);
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        };
                        inputEx.addEvent("change", carChange);
                        inputEx.addEvent("keydown", carChange);
                        inputEx.addEvent("keyup", carChange);
                        inputEx.addEvent("keypress", carChange);
                        inputEx.addEvent("blur", carChange);
                    }, function(inputEx){
                        inputEx["td"].style.border = "1px solid";
                        inputEx.setTooltipText("Leave blank to make the other options available");
                        inputEx.setMin(1901);
                        inputEx.setMax((new Date()).getUTCFullYear());
                        inputEx.setWidth("100%");
                        inputEx.fields[0].classList.add("right");
                        inputEx.disable();
                        var gradChange = gradEvent=>{
                            var setting = (inputEx.getValue() == "");
                            inputEx["tr"]["inputRow"]["year_level_completed"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["units_earned"].enable(null, setting);
                            inputEx["tr"]["inputRow"]["complete_academic_requirements"].enable(null, setting && inputEx["tr"]["inputRow"]["degree_typeIndex"].getValue() != "Bachelor's Degree");
                            attainedEducIncrement.innerHTML = computeEducIncrementLevel();
                        };
                        inputEx.addEvent("change", gradChange);
                        inputEx.addEvent("keydown", gradChange);
                        inputEx.addEvent("keyup", gradChange);
                        inputEx.addEvent("keypress", gradChange);
                        inputEx.addEvent("blur", gradChange);
                    });
                    degreeTable.createAddRowButton().disable();
                }
            }
        });

        positionField.addEvent("change", positionChangeEvent=>{
            MPASIS_App.selectPosition(positionField, parenField, plantillaField);
        });

        parenField.addEvent("change", parenChangeEvent=>{
            MPASIS_App.selectParen(positionField, parenField, plantillaField);
        });

        plantillaField.addEvent("change", plantillaChangeEvent=>{
            MPASIS_App.selectPlantilla(positionField, parenField, plantillaField);
        });

        var plantillaChange = changeEvent=>{
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
            requiredEducIncrement.innerHTML = ScoreSheet.getEducIncrements(appliedPosition["required_educational_attainment"], []);
            requiredTrainingIncrement.innerHTML = Math.trunc(appliedPosition["required_training_hours"] / 8) + 1;
            requiredWorkExpIncrement.innerHTML = Math.trunc(appliedPosition["required_work_experience_years"] * 12 / 6) + 1;
            remarkElig.innerHTML = (appliedPosition["required_eligibility"].length == 0 ? "Not Required" : "Not Qualified");
            remarkElig.style.color = (appliedPosition["required_eligibility"].length == 0 ? null : "red");

        };
        plantillaField.addEvent("change", plantillaChange);
        
        var applicantDataBtnGrp = applicantDataForm.addFormButtonGrp(2);
        applicantDataBtnGrp.setFullWidth();
        applicantDataBtnGrp.container.style.gridColumn = "1 / span 12";
        applicantDataBtnGrp.inputExs[0].setLabelText("Save");
        applicantDataBtnGrp.inputExs[0].setTooltipText("");
        applicantDataBtnGrp.inputExs[0].addEvent("click", (clickEvent)=>{
            if (applicantDataForm.dbInputEx["position_title_applied"].getValue() == "" || applicantDataForm.dbInputEx["plantilla_item_number_applied"].getValue() == "" || applicantDataForm.dbInputEx["application_code"].getValue() == "" || applicantDataForm.dbInputEx["given_name"].getValue() == "")
            {
                new MsgBox(applicantDataForm.container, "Please fill out some of the fields before submission");
                return;
            }

            var jobApplication = {};
            jobApplication["personalInfo"] = {};
            jobApplication["personalInfo"]["addresses"] = [];
            jobApplication["personalInfo"]["disabilities"] = [];
            jobApplication["personalInfo"]["email_addresses"] = [];
            jobApplication["personalInfo"]["contact_numbers"] = [];
            jobApplication["personalInfo"]["degree_taken"] = [];
            jobApplication["relevantTraining"] = [];
            jobApplication["relevantWorkExp"] = [];
            jobApplication["relevantEligibility"] = [];

            for (const colName in applicantDataForm.dbInputEx) {
                var tableName = applicantDataForm.dbTableName[colName];
                var dbInputEx = applicantDataForm.dbInputEx[colName];
                
                if (tableName == "Person")
                {
                    if (colName == "civil_status")
                    {
                        jobApplication["personalInfo"][colName] = dbInputEx.getDataValue();
                    }
                    else if (colName == "ethnicity")
                    {
                        jobApplication["personalInfo"][colName] = dbInputEx.getValue();
                    }
                    else if (colName == "eligibilityId" || colName == "postgraduate_units" && dbInputEx.isDisabled())
                    {
                        // do nothing
                    }
                    else if (colName == "complete_academic_requirements" && !dbInputEx.isDisabled())
                    {
                        jobApplication["personalInfo"][colName] = (dbInputEx.isChecked() ? 1 : 0);
                    }
                    else if (dbInputEx.getValue() != "")
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
                else if (tableName == "Degree_Taken")
                {
                    jobApplication["personalInfo"]["degree_taken"] = dbInputEx.getValue();
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
                    else if (dbInputEx.getValue() != "")
                    {   
                        jobApplication[colName] = dbInputEx.getValue();
                    }
                }
            }
            
            jobApplication["relevantEligibility"] = applicantDataForm.dbInputEx["eligibilityId"].getValue();
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

            // console.log(applicantDataForm.dataLoaded);
            // if (applicantDataBtnGrp.inputExs[0].getLabelText() == "Update")
            if ("personId" in applicantDataForm.dataLoaded)
            {
                jobApplication["personalInfo"]["personId"] = applicantDataForm.dataLoaded["personId"];
                // for (const key in applicantDataForm.dataLoaded)
                // {
                //     if (!(key in jobApplication))
                //     {
                //         jobApplication[key] = applicantDataForm.dataLoaded[key]; // load missing data from previously loaded dataset
                //     }
                // }
            }

            for (const degree of jobApplication["personalInfo"]["degree_taken"])
            {
                delete degree["degree_takenId"]; // Database entries are deleted anyway, so this will all only cause errors.
            }

            // DEBUG
            console.log(jobApplication);
            
            // return;
            // DEBUG

            // DATA SETS PACKAGED IN JSON THAT HAVE SINGLE QUOTES SHOULD BE MODIFIED AS PACKAGED TEXT ARE NOT AUTOMATICALLY FIXED BY PHP AND SQL
            postData(MPASIS_App.processURL, "app=mpasis&a=add&jobApplication=" + packageData(jobApplication), (event)=>{
                var response;

                if (event.target.readyState == 4 && event.target.status == 200)
                {
                    response = JSON.parse(event.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(applicantDataForm.container, "ERROR: " + response.content, "OK");
                    }
                    else if (response.type == "Success")
                    {
                        new MsgBox(applicantDataForm.container, response.content, "OK", ()=>{
                            window.location.reload(true);
                        });
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

        var status = applicantDataForm.addStatusPane();
        status.style.gridColumn = "1 / span 7";

        return applicantDataForm;
    }

    constructScoreSheetOld()
    {
        var scoreSheet = null, field = null, div = null, subDiv = null;

        if (this.forms["scoreSheetOld"] != null && this.forms["scoreSheetOld"] != undefined)
        {
            return this.forms["scoreSheet"];
        }

        scoreSheet = this.forms["scoreSheetOld"] = new FormEx(this.mainSections["main-scoresheet-old"], "score-sheet-old");
        scoreSheet.setFullWidth();
        scoreSheet["displayExs"] = [];
        scoreSheet["data"] = [];
        scoreSheet["dataLoaded"] = null;

        scoreSheet.criteria = {
            education:{
                type:"regular",
                name:"Education",
                weight:5,
                raw:false
            },
            training:{
                type:"regular",
                name:"Training",
                weight:10,
                raw:false
            },
            experience:{
                type:"regular",
                name:"Experience",
                weight:15,
                raw:false
            },
            performance:{
                type:"regular",
                name:"Performance",
                weight:20,
                raw:true
            },
            accomplishments:{
                type:"category",
                name:"Outstanding Accomplishments",
                weight:10, // maximum
                raw:false,
                subcriteria:{
                    awards:{
                        type:"category",
                        name:"Awards and Recognition",
                        weight:4,
                        raw:false,
                        subcriteria:{
                            citation:{
                                type:"regular",
                                name:"Citation or Commendation",
                                weight:4,
                                raw:false
                            },    
                            academicAward:{
                                type:"regular",
                                name:"Academic or Inter-School Award MOVs",
                                weight:4,
                                raw:false
                            },   
                            outstandingEmployee:{
                                type:"regular",
                                name:"Outstanding Employee Award MOVs",
                                weight:4,
                                raw:false
                            }    
                        }
                    },
                    research:{
                        type:"regular",
                        name:"Research and Innovation",
                        weight:4,
                        raw:false
                    },
                    smetwg:{
                        type:"regular",
                        name:"Subject Matter Expert/Membership in National Technical Working Groups (TWGs) or Committees",
                        weight:3,
                        raw:false
                    },
                    speakership:{
                        type:"regular",
                        name:"Resource Speakership/Learning Facilitation",
                        weight:2,
                        raw:false
                    },
                    neap:{
                        type:"regular",
                        name:"NEAP Accredited Learning Facilitator",
                        weight:2,
                        raw:false
                    }
                }
            },
            educationApp:{
                type:"regular",
                name:"Application of Education",
                weight:10,
                raw:false // true for position with no experience requirement
            },
            trainingApp:{
                type:"regular",
                name:"Application of Learning and Development",
                weight:10,
                raw:false
            },
            potential:{
                type:"category",
                name:"Potential",
                weight:20,
                raw:false,
                subcriteria:{
                    exam:{
                        type:"regular",
                        name:"Writtem Examination",
                        weight:5,
                        raw:true
                    },
                    skillTest:{
                        type:"regular",
                        name:"Skills or Work Sample Tests",
                        weight:10,
                        raw:true
                    },
                    bei:{
                        type:"regular",
                        name:"Behavioral Events Interview",
                        weight:5,
                        raw:false
                    }
                }
            }
        };

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

        scoreSheet.addHeader("Score Sheet (Old)", 2, "scoresheet-title", true);

        var loadApplicant = scoreSheet.addInputEx("Load Application", "buttonEx");
        loadApplicant.setFullWidth();
        loadApplicant.fieldWrapper.classList.add("right");

        var applicantInfo = scoreSheet.addDisplayEx("div", "applicantInfo");
        applicantInfo.setFullWidth();
        applicantInfo.content.style.display = "grid";
        applicantInfo.content.style.gridTemplateColumns = "auto auto";
        applicantInfo.content.style.gridGap = "0.5em";

        [
            {colName:"application_code", label:"Application Code"},
            "",
            {colName:"applicant_name", label:"Applicant's Name"},
            {colName:"present_school", label:"School"},
            {colName:"present_position", label:"Present Position"},
            {colName:"present_designation", label:"Designation"},
            {colName:"present_district", label:"District"},
            {colName:"position_title_applied", label:"Position Applied For"}
        ].forEach(obj=>{
            if (obj == "")
            {
                applicantInfo.addLineBreak();
                return;
            }
            var inputEx = scoreSheet.addInputEx(obj.label, "text", "", "", obj.colName);
            inputEx.setVertical();
            applicantInfo.addContent(inputEx.container);
            inputEx.enable(null, inputEx != scoreSheet.dbInputEx["application_code"] && inputEx != scoreSheet.dbInputEx["applicant_name"] && inputEx != scoreSheet.dbInputEx["position_title_applied"]);
            inputEx.fields[0].style.color = "black";
        });

        for (const key in scoreSheet.criteria)
        {
            var mainDisplayEx = scoreSheet.addDisplayEx("div", key)
            mainDisplayEx.addContent(scoreSheet.addHeader(scoreSheet.criteria[key].name + " <i>(" + scoreSheet.criteria[key].weight + " points)</i>", 3));
            scoreSheet.headers[scoreSheet.headers.length - 1].style.marginTop = 0;
            scoreSheet.headers[scoreSheet.headers.length - 1].style.borderBottom = "1px solid";
            mainDisplayEx.displays = [];
            mainDisplayEx.fields = [];
        }

        for (const key in scoreSheet.displayExs)
        {
            var displayEx = scoreSheet.displayExs[key];
            if (key !== "applicantInfo")
            {
                displayEx.setFullWidth();
                displayEx.setVertical();
                displayEx.content.style.border = "0.15em solid gray";
                displayEx.content.style.borderRadius = "1em";
                displayEx.content.style.margin = "1em 0";
                displayEx.content.style.padding = "1em";
            }
        }

        div = scoreSheet.displayExs.education;

        [
            {colName:"educational_attainment", label:"Highest level of education attained"},
            {colName:"postgraduate_units", label:"Units taken towards the completion of a Postgraduate Degree"},
            {colName:"has_specific_education_required", label:"Has taken education required for the position"},
            "",
            {colName:"educIncrements", label:"Number of increments above the Qualification Standard"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            var displayEx = new DisplayEx(div.content, "span", "education", "", obj.label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays[obj.colName] = displayEx;
        });

        div = scoreSheet.displayExs.training;

        [
            {colName:"relevant_training_hours", label:"Total number of relevant training hours"},
            {colName:"relevant_training_count", label:"Number of relevant trainings considered"},
            {colName:"has_specific_training", label:"Has undergone required training for the position"},
            {colName:"has_more_unrecorded_training", label:"Has unconsidered trainings"},
            "",
            {colName:"trainIncrements", label:"Number of Increments above the Qualification Standard"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            var displayEx = new DisplayEx(div.content, "span", "training", "", obj.label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays[obj.colName] = displayEx;
        });

        div = scoreSheet.displayExs.experience;

        [
            {colName:"relevant_work_experience_years", label:"Total number of years of relevant work experience"},
            {colName:"relevant_work_experience_count", label:"Number of relevant employment considered"},
            {colName:"has_specific_work_experience", label:"Has the required work experience for the position"},
            {colName:"has_more_unrecorded_work_experience", label:"Has unconsidered employment"},
            "",
            {colName:"expIncrements", label:"Number of Increments above the Qualification Standard"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            var displayEx = new DisplayEx(div.content, "span", "experience", "", obj.label);
            displayEx.showColon();
            displayEx.setFullWidth();
            div.displays[obj.colName] = displayEx;
        });

        div = scoreSheet.displayExs.performance;

        field = scoreSheet.addInputEx("Most recent relevant 1-year Performance Rating attained", "number", "", "", "most_recent_performance_rating");
        field.showColon();
        field.setBlankStyle();
        field.setMin(1);
        field.setMax(5);
        field.setStep(0.1);
        field.setWidth("3.5em");
        field.fields[0].classList.add("right");
        div.fields["most_recent_performance_rating"] = field;
        div.addContent(field.container);

        field.addEvent("change", changeEvent=>{
            var values = [];

            values.push(scoreSheet.displayExs["performance"].fields["most_recent_performance_rating"].getValue() / 5 * scoreSheet.criteria["performance"].weight);

            var value = (values.length > 0 ? values.reduce((total, nextValue)=>{ return Number.parseFloat(total) + Number.parseFloat(nextValue); }) : 0);

            scoreSheet.displayExs["performance"].totalPoints.setHTMLContent((isNaN(value) ? "0" : Math.round(value).toString()));
        });

        div = scoreSheet.displayExs.accomplishments;
        
        div.fields["subcriteria"] = [];

        div.addContent(scoreSheet.addHeader("1. Awards and Recognition", 4));

        div.fields["subcriteria"]["awards"] = [];

        div.addContent(scoreSheet.addHeader("a. Citation and Commendation", 5));
        

        field = scoreSheet.addInputEx("Number of letters of citation/commendation presented by applicant", "number", "0", "", "number_of_citation_movs");
        field.setFullWidth();
        field.showColon();
        field.setBlankStyle();
        field.setMin(0);
        field.setMax(999);
        field.setWidth("4em");
        field.fields[0].classList.add("right");
        div.fields["number_of_citation_movs"] = field;
        div.fields["subcriteria"]["awards"]["number_of_citation_movs"] = field;
        div.addContent(field.container);

        div.addContent(scoreSheet.addHeader("b. Academic or Inter-School Award MOVs", 5));

        field = scoreSheet.addInputEx("Number of award certificates/MOVs presented by applicant", "number", "0", "", "number_of_academic_award_movs");
        field.setFullWidth();
        field.showColon();
        field.setBlankStyle();
        field.setMin(0);
        field.setMax(999);
        field.setWidth("4em");
        field.fields[0].classList.add("right");
        div.fields["number_of_academic_award_movs"] = field;
        div.fields["subcriteria"]["awards"]["number_of_academic_award_movs"] = field;
        div.addContent(field.container);

        div.addContent(scoreSheet.addHeader("c. Outstanding Employee Award MOVs", 5));

        [
            "Number of awards from external institution",
            {colName:"number_of_awards_external_office_search", label:"Local office search", weight:2, subcriteria:"awards"},
            {colName:"number_of_awards_external_org_level_search", label:"Organization-level search or higher", weight:4, subcriteria:"awards"},
            "Number of awards from the Central Office",
            {colName:"number_of_awards_central_co_level_search", label:"Central Office search", weight:2, subcriteria:"awards"},
            {colName:"number_of_awards_central_national_search", label:"National-level search or higher", weight:4, subcriteria:"awards"},
            "Number of awards from the Regional Office",
            {colName:"number_of_awards_regional_ro_level_search", label:"Regional Office search", weight:2, subcriteria:"awards"},
            {colName:"number_of_awards_regional_national_search", label:"National-level search or higher", weight:4, subcriteria:"awards"},
            "Number of awards from the Schools Division Office",
            {colName:"number_of_awards_division_sdo_level_search", label:"Division-/provincial-/city-level search", weight:2, subcriteria:"awards"},
            {colName:"number_of_awards_division_national_search", label:"National-level search or higher", weight:4, subcriteria:"awards"},
            "Number of awards from schools",
            {colName:"number_of_awards_school_school_level_search", label:"School-/municipality-/district-level search", weight:2, subcriteria:"awards"},
            {colName:"number_of_awards_school_sdo_level_search", label:"Division-level search or higher", weight:4, subcriteria:"awards"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            else if (typeof(obj) == "string")
            {
                div.addContent(scoreSheet.addHeader("<big>" + obj + ":</big>", 6));
                return;
            }
            var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
            field.showColon();
            field.setFullWidth();
            field.setMin(0);
            field.setMax(999);
            field.setWidth("3em");
            field.setLabelWidth("20em");
            field.setBlankStyle();
            field.fields[0].classList.add("right");
            field["weight"] = obj.weight;
            div.fields[obj.colName] = field;
            div.fields["subcriteria"][obj.subcriteria][obj.colName] = field;
            div.addContent(field.container);
        });

        div.addContent(scoreSheet.addHeader("2. Research and Innovation", 4));

        div.fields["subcriteria"]["research"] = [];

        subDiv = scoreSheet.addDisplayEx("div", "researchCriteriaGuide");

        div.addContent(scoreSheet.addHeader("Guide:", 6));

        var list = createElementEx(NO_NS, "ol", null, null, "type", "A", "style", "font-size: 0.8em");

        div.addContent(list);

        [
            "Proposal",
            "Accomplishment Report",
            "Certification of Utilization",
            "Certification of Adoption",
            "Proof of Citation by Other Researchers"
        ].forEach(text=>{
            addText(text, createElementEx(NO_NS, "li", list));
        });

        [
            {colName:"number_of_research_proposal_only", label:"A only", weight:1, subcriteria:"research"},
            {colName:"number_of_research_proposal_ar", label:"A and B", weight:2, subcriteria:"research"},
            {colName:"number_of_research_proposal_ar_util", label:"A, B, and C", weight:3, subcriteria:"research"},
            {colName:"number_of_research_proposal_ar_util_adopt", label:"A, B, C, and D", weight:4, subcriteria:"research"},
            {colName:"number_of_research_proposal_ar_util_cite", label:"A, B, C, and E", weight:4, subcriteria:"research"},
        ].forEach(obj=>{
            var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
            field.setFullWidth();
            field.showColon();
            field.setBlankStyle();
            field.setMin(0);
            field.setMax(999);
            field.setWidth("3em");
            field.setLabelWidth("9em");
            field.fields[0].classList.add("right");
            field["weight"] = obj.weight;
            div.fields[obj.colName] = field;
            div.fields["subcriteria"][obj.subcriteria][obj.colName] = field;
            div.addContent(field.container);
        });

        div.addContent(scoreSheet.addHeader("3. Subject Matter Expert/Membership in National TWGs or Committees", 4));

        div.fields["subcriteria"]["smetwg"] = [];

        div.addContent(scoreSheet.addHeader("Guide:", 6));

        var list = createElementEx(NO_NS, "ol", null, null, "type", "A", "style", "font-size: 0.8em");

        div.addContent(list);

        [
            "Issuance/Memorandum",
            "Certificate",
            "Output/Adoption by the organization"
        ].forEach(text=>{
            addText(text, createElementEx(NO_NS, "li", list));
        });

        [
            {colName:"number_of_smetwg_issuance_cert", label:"A and B only", weight:2, subcriteria:"smetwg"},
            {colName:"number_of_smetwg_issuance_cert_output", label:"All MOVs", weight:3, subcriteria:"smetwg"}
        ].forEach(obj=>{
            var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
            field.setFullWidth();
            field.showColon();
            field.setBlankStyle();
            field.setMin(0);
            field.setMax(999);
            field.setWidth("3em");
            field.setLabelWidth("9em");
            field.fields[0].classList.add("right");
            field["weight"] = obj.weight;
            div.fields[obj.colName] = field;
            div.fields["subcriteria"][obj.subcriteria][obj.colName] = field;
            div.addContent(field.container);
        });

        div.addContent(scoreSheet.addHeader("4. Resource Speakership/Learning Facilitation", 4));

        div.fields["subcriteria"]["speakership"] = [];

        [
            "Number of resource speakership/learning facilitation from external institution",
            {colName:"number_of_speakership_external_office_search", label:"Local office-level", weight:1, subcriteria:"speakership"},
            {colName:"number_of_speakership_external_org_level_search", label:"Organization-level", weight:2, subcriteria:"speakership"},
            "Number of resource speakership/learning facilitation from the Central Office",
            {colName:"number_of_speakership_central_co_level_search", label:"Central Office-level", weight:1, subcriteria:"speakership"},
            {colName:"number_of_speakership_central_national_search", label:"National-level or higher", weight:2, subcriteria:"speakership"},
            "Number of resource speakership/learning facilitation from the Regional Office",
            {colName:"number_of_speakership_regional_ro_level_search", label:"Regional Office level", weight:1, subcriteria:"speakership"},
            {colName:"number_of_speakership_regional_national_search", label:"National-level or higher", weight:2, subcriteria:"speakership"},
            "Number of resource speakership/learning facilitation from the Schools Division Office",
            {colName:"number_of_speakership_division_sdo_level_search", label:"School/municipal/district", weight:1, subcriteria:"speakership"},
            {colName:"number_of_speakership_division_national_search", label:"Division-level or higher", weight:2, subcriteria:"speakership"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            else if (typeof(obj) == "string")
            {
                div.addContent(scoreSheet.addHeader("<big>" + obj + ":</big>", 6));
                return;
            }
            var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
            field.showColon();
            field.setFullWidth();
            field.setMin(0);
            field.setMax(999);
            field.setWidth("3em");
            field.setLabelWidth("13.5em");
            field.setBlankStyle();
            field.fields[0].classList.add("right");
            field["weight"] = obj.weight;
            div.fields[obj.colName] = field;
            div.fields["subcriteria"][obj.subcriteria][obj.colName] = field;
            div.addContent(field.container);
        });
        
        div.addContent(scoreSheet.addHeader("5. NEAP-Accredited Learning Facilitator", 4));
        
        div.fields["subcriteria"]["neap"] = [];

        // MAY NEED TO ADD MULTIPLE FACILITATOR INSTANCES ALONG WITH DESCRIPTIVE NAMES OR DETAILS
        field = scoreSheet.addInputEx("Please select the applicant's highest level of accreditation as NEAP Learning Facilitator", "radio-select", "", "", "neap_facilitator_accreditation");
        field.addItem("None", "0");
        field.addItem("Accredited by Regional Trainer", "1");
        field.addItem("Accredited by National Trainer", "1.5");
        field.addItem("Accredited by National Assessor", "2");
        field.setVertical();
        field.reverse();
        field.setDefaultValue(0, true);
        div.fields["neap_facilitator_accreditation"] = field;
        div.fields["subcriteria"]["neap"]["neap_facilitator_accreditation"] = field;
        div.addContent(field.container);

        scoreSheet.displayExs["accomplishments"]["computeScore"] = fields=>{
            var total = 0;
            
            for (const awardKey in fields) {
                var subtotal = 0;
                var value = 0, max = 0;

                if (awardKey == "subcriteria")
                {
                    break;
                }
                for (const key in fields[awardKey]) {
                    var weight = (isNaN(Number.parseFloat(fields[awardKey][key].weight)) ? 1 : Number.parseFloat(fields[awardKey][key].weight));

                    value = Number.parseFloat(fields[awardKey][key].getValue());
                    value = (value == "" ? 0 : value);

                    if (key == "number_of_citation_movs" || key == "number_of_academic_award_movs")
                    {
                        value = (value > 3 ? 4 : (value > 0 ? value + 1 : 0));
                    }

                    switch (awardKey)
                    {
                        case "awards": case "research":
                            max = 4;
                            break;
                        case "smetwg":
                            max = 3;
                            break;
                        default:
                            max = 2;
                            break;
                    }

                    subtotal += value * weight;
                    
                    if (subtotal >= max)
                    {
                        subtotal = max;
                        break;
                    }
                }


                total += subtotal;

                if (total >= 10)
                {
                    total = 10;
                    break;
                }
            }

            scoreSheet.displayExs["accomplishments"].totalPoints.setHTMLContent(total.toString());
        };

        for (const colName in scoreSheet.displayExs["accomplishments"].fields) {
            if (colName != "subcriteria")
            {
                div.fields[colName].addEvent("change", changeEvent=>{
                    scoreSheet.displayExs["accomplishments"]["computeScore"](scoreSheet.displayExs["accomplishments"].fields["subcriteria"]);
                });
            }
        }

        div = scoreSheet.displayExs.educationApp;

        div = scoreSheet.displayExs.trainingApp;

        div.addContent(scoreSheet.addHeader("Guide:", 6));

        var list = createElementEx(NO_NS, "ol", null, null, "type", "A", "style", "font-size: 0.8em");

        div.addContent(list);

        [
            "Certificate of Training",
            "Action Plan/Re-entry Action Plan/Job Embedded Learning/Impact Project signed by Head of Office",
            "Accomplishment Report adopted by local level",
            "Accomplisment Report adopted by different local level/higher level"
        ].forEach(text=>{
            addText(text, createElementEx(NO_NS, "li", list));
        });

        [
            "Relevant",
            {colName:"number_of_app_train_relevant_cert_ap", label:"A and B"},
            {colName:"number_of_app_train_relevant_cert_ap_arlocal", label:"A, B, and C"},
            {colName:"number_of_app_train_relevant_cert_ap_arlocal_arother", label:"All MOVs"},
            "Not Relevant",
            {colName:"number_of_app_train_not_relevant_cert_ap", label:"A and B"},
            {colName:"number_of_app_train_not_relevant_cert_ap_arlocal", label:"A, B, and C"},
            {colName:"number_of_app_train_not_relevant_cert_ap_arlocal_arother", label:"All MOVs"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            else if (typeof(obj) == "string")
            {
                div.addContent(scoreSheet.addHeader("<big>" + obj + ":</big>", 6));
                return;
            }
            var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
            field.setFullWidth();
            field.showColon();
            field.setBlankStyle();
            field.setMin(0);
            field.setMax(999);
            field.setWidth("3em");
            field.setLabelWidth("7em");
            field.fields[0].classList.add("right");
            div.fields[obj.colName] = field;
            div.addContent(field.container);

            div.fields[obj.colName].addEvent("change", changeEvent=>{
                var total = scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_relevant_cert_ap"].getValue() * 5
                    + scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_relevant_cert_ap_arlocal"].getValue() * 7
                    + scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_relevant_cert_ap_arlocal_arother"].getValue() * 10
                    + scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_not_relevant_cert_ap"].getValue() * 1
                    + scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_not_relevant_cert_ap_arlocal"].getValue() * 3
                    + scoreSheet.displayExs["trainingApp"].fields["number_of_app_train_not_relevant_cert_ap_arlocal_arother"].getValue() * 5;

                scoreSheet.displayExs["trainingApp"].totalPoints.setHTMLContent((total > scoreSheet.criteria["educationApp"].weight ? 10 : total).toString());
            });
        });

        div = scoreSheet.displayExs.potential;

        [
            {colName:"score_exam", label:"Written Examination", tooltip:"Score in the written examination"},
            "",
            {colName:"score_skill", label:"Skills or Work Sample Test", tooltip:"Score in the skills test"},
            "",
            {colName:"score_bei", label:"Behavioral Events Interview", tooltip:"Score in the interview"}
        ].forEach(obj=>{
            if (obj == "")
            {
                div.addLineBreak();
                return;
            }
            var field = scoreSheet.addInputEx(obj.label, "number", "0", obj.tooltip, obj.colName);
            field.setFullWidth();
            field.setBlankStyle();
            field.setMin(0);
            field.setMax(obj.colName == "score_bei" ? scoreSheet.criteria["potential"].subcriteria.bei.weight : 100);
            field.setStep(0.1);
            field.setWidth("3.5em");
            field.setLabelWidth("15em");
            field.fields[0].classList.add("right");
            field.showColon();
            div.fields.push(field);
            div.addContent(field.container);

            field.addEvent("change", changeEvent=>{
                var values = [];

                values.push(scoreSheet.displayExs["potential"].fields[0].getValue() / 100 * scoreSheet.criteria["potential"].subcriteria.exam.weight);
                values.push(scoreSheet.displayExs["potential"].fields[1].getValue() / 100 * scoreSheet.criteria["potential"].subcriteria.skillTest.weight);
                values.push(scoreSheet.displayExs["potential"].fields[2].getValue());

                var value = (values.length > 0 ? values.reduce((total, nextValue)=>{ return Number.parseFloat(total) + Number.parseFloat(nextValue); }) : 0);

                scoreSheet.displayExs["potential"].totalPoints.setHTMLContent((isNaN(value) ? "0" : Math.round(value).toString()));
            });
        });

        for (const key in scoreSheet.displayExs["performance"].fields)
        {
            var field = scoreSheet.displayExs["performance"].fields[key];
            field.addEvent("change", changeEvent=>{
                var values = [];

                values.push(scoreSheet.displayExs["performance"].fields[key].getValue() / 5 * scoreSheet.criteria["performance"].weight);

                var value = (values.length > 0 ? values.reduce((total, nextValue)=>{ return Number.parseFloat(total) + Number.parseFloat(nextValue); }) : 0);

                scoreSheet.displayExs["performance"].totalPoints.setHTMLContent((isNaN(value) ? "0" : Math.round(value).toString()));
            });
        }

        // Add total points line
        for (const key in scoreSheet.displayExs) {
            if (key != "applicantInfo" && key != "researchCriteriaGuide" && key != "smeTwgCriteriaGuide")
            {
                scoreSheet.displayExs[key]["totalPoints"] = new DisplayEx(scoreSheet.displayExs[key].content, "span", "", "", "Total Points");
                var displayEx = scoreSheet.displayExs[key]["totalPoints"];
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
            if (loadApplicantClickEvent.target.innerHTML == "Load Application")
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

                searchResult.runAfterFilling = ()=>{
                    retrieveApplicantDialogBtnGrp.inputExs[0].addEvent("click", loadApplicationDialogClickEvent=>{
                        if (searchResult.getValue() == "" || searchResult.getValue() == null)
                        {
                            retrieveApplicantDialog.formEx.raiseError("Please select an item to load before continuing");
                            return;
                        }
                        
                        // Education
                        scoreSheet.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0];
                        scoreSheet.dbInputEx["application_code"].setDefaultValue(scoreSheet.dataLoaded["application_code"], true);
                        scoreSheet.dbInputEx["applicant_name"].setDefaultValue(scoreSheet.dataLoaded["applicant_name"], true);
                        scoreSheet.dbInputEx["position_title_applied"].setDefaultValue(scoreSheet.dataLoaded["position_title_applied"], true);
                        
                        var educAttainment = scoreSheet.dataLoaded["educational_attainmentIndex"];
                        var degreeTaken = scoreSheet.dataLoaded["degree_taken"];

                        var highestPostGradDegrees = degreeTaken.filter(degree=>{ // in terms of education increment
                            switch (educAttainment)
                            {
                                case 0: case 1: case 2: case 3: case 4: case 5:
                                    return false;
                                    break;
                                case 6:
                                    return degree["degree_typeIndex"] > 6 && degree["degree_typeIndex"] < 8;
                                    break;
                                case 7:
                                    return degree["degree_typeIndex"] > 7 && degree["degree_typeIndex"] < 9;
                                    break;
                                default: // highest educational increment
                                    break;
                            }
                        });
                        var highestPostGradDegree = (highestPostGradDegrees.length == 0 ? null : highestPostGradDegrees.reduce((prevRow, nextRow)=>{
                            var test = prevRow["degree_typeIndex"] < nextRow["degree_typeIndex"]
                            || prevRow["degree_typeIndex"] == nextRow["degree_typeIndex"]
                            && (prevRow["units_earned"] <= nextRow["units_earned"] || prevRow["units_earned"] == "")
                            || (nextRow["complete_academic_requirements"] ?? 0);
            
                            return ( test
                                ? nextRow
                                : prevRow
                            );
                        }));
            
                        var postGradUnits = (highestPostGradDegree == null || educAttainment <= 5 || educAttainment >= 8 ? null : highestPostGradDegree["units_earned"]);
                        postGradUnits = (postGradUnits == "" ? null : postGradUnits);
                        var completeAcadReq = (highestPostGradDegree == null ? 0 : highestPostGradDegree["complete_academic_requirements"]); //TEMPORARY
                        // var completeAcadReq = highestPostGradDegree["complete_academic_requirements"]; // DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!

                        var appliedPosition = document.positions.filter(position=>position["position_title"] == scoreSheet.dataLoaded["position_title_applied"] || position["plantilla_item_number"] == scoreSheet.dataLoaded["plantilla_item_number_applied"])[0];
                        var hasSpecEduc = (scoreSheet.dataLoaded["has_specific_education_required"] == null ? "n/a" : (scoreSheet.dataLoaded["has_specific_education_required"] == 1 ? "Yes" : "No"));
                        
                        var applicantEducIncrement = ScoreSheet.getEducIncrements(educAttainment, degreeTaken);
                        var requiredEducIncrement = ScoreSheet.getEducIncrements(appliedPosition["required_educational_attainment"], []);
                        var educIncrementAboveQS = applicantEducIncrement - requiredEducIncrement;

                        scoreSheet.displayExs["education"].displays["educational_attainment"].setHTMLContent(scoreSheet.dataLoaded["educational_attainment"]);
                        scoreSheet.displayExs["education"].displays["postgraduate_units"].setHTMLContent(postGradUnits == null ? "none" : postGradUnits.toString());
                        scoreSheet.displayExs["education"].displays["has_specific_education_required"].setHTMLContent(hasSpecEduc);
                        scoreSheet.displayExs["education"].displays["educIncrements"].setHTMLContent(educIncrementAboveQS.toString());

                        scoreSheet.displayExs["education"].totalPoints.setHTMLContent(ScoreSheet.getEducScore(educIncrementAboveQS, appliedPosition).toString());

                        // Training
                        var relevantTrainings = scoreSheet.dataLoaded["relevant_training"];
                        var relevantTrainingHours = (relevantTrainings.length > 0 ? relevantTrainings.map(training=>training["hours"]).reduce((total, nextVal)=>total + nextVal) : 0);
                        var applicantTrainingIncrement = Math.trunc(relevantTrainingHours / 8 + 1);
                        var hasSpecTraining = (scoreSheet.dataLoaded["has_specific_training"] == null ? "n/a" : (scoreSheet.dataLoaded["has_specific_training"] == 1 ? "Yes" : "No"));
                        var hasMoreTraining = (scoreSheet.dataLoaded["has_more_unrecorded_training"] == null ? "n/a" : (scoreSheet.dataLoaded["has_more_unrecorded_training"] == 1 ? "Yes" : "No"));
                        var requiredTrainingHours = appliedPosition["required_training_hours"];
                        var requiredTrainingIncrement = Math.trunc(requiredTrainingHours / 8 + 1);
                        var trainingIncrementAboveQS = applicantTrainingIncrement - requiredTrainingIncrement;
                        
                        scoreSheet.displayExs["training"].displays["relevant_training_hours"].setHTMLContent(relevantTrainingHours.toString());
                        scoreSheet.displayExs["training"].displays["relevant_training_count"].setHTMLContent(relevantTrainings.length.toString());
                        scoreSheet.displayExs["training"].displays["has_specific_training"].setHTMLContent(hasSpecTraining);
                        scoreSheet.displayExs["training"].displays["has_more_unrecorded_training"].setHTMLContent(hasMoreTraining);
                        scoreSheet.displayExs["training"].displays["trainIncrements"].setHTMLContent(trainingIncrementAboveQS.toString());

                        scoreSheet.displayExs["training"].totalPoints.setHTMLContent(ScoreSheet.getTrainingScore(trainingIncrementAboveQS, appliedPosition).toString());
                        
                        // Experience
                        var relevantWorkExp = scoreSheet.dataLoaded["relevant_work_experience"];
                        var relevantWorkExpDuration = (relevantWorkExp.length > 0 ? relevantWorkExp.map(workExp=>ScoreSheet.getDuration(workExp["start_date"], (workExp["end_date"] == null || workExp["end_date"] == "" ? this.defaultEndDate : workExp["end_date"]))).reduce(ScoreSheet.addDuration): {y:0, m:0, d:0});
                        var applicantWorkExpIncrement = Math.trunc(ScoreSheet.convertDurationToNum(relevantWorkExpDuration) * 12 / 6 + 1);
                        var hasSpecWorkExp = (scoreSheet.dataLoaded["has_specific_work_experience"] == null ? "n/a" : (scoreSheet.dataLoaded["has_specific_work_experience"] == 1 ? "Yes" : "No"));
                        var hasMoreWorkExp = (scoreSheet.dataLoaded["has_more_unrecorded_work_experience"] == null ? "n/a" : (scoreSheet.dataLoaded["has_more_unrecorded_work_experience"] == 1 ? "Yes" : "No"));
                        var requiredWorkExpYears = appliedPosition["required_work_experience_years"];
                        var requiredWorkExpIncrement = Math.trunc(requiredWorkExpYears * 12 / 6 + 1);
                        var workExpIncrementAboveQS = applicantWorkExpIncrement - requiredWorkExpIncrement;
                        
                        scoreSheet.displayExs["experience"].displays["relevant_work_experience_years"].setHTMLContent(ScoreSheet.convertDurationToString(relevantWorkExpDuration));
                        scoreSheet.displayExs["experience"].displays["relevant_work_experience_count"].setHTMLContent(relevantWorkExp.length.toString());
                        scoreSheet.displayExs["experience"].displays["has_specific_work_experience"].setHTMLContent(hasSpecWorkExp);
                        scoreSheet.displayExs["experience"].displays["has_more_unrecorded_work_experience"].setHTMLContent(hasMoreWorkExp);
                        scoreSheet.displayExs["experience"].displays["expIncrements"].setHTMLContent(workExpIncrementAboveQS.toString());

                        scoreSheet.displayExs["experience"].totalPoints.setHTMLContent(ScoreSheet.getWorkExpScore(workExpIncrementAboveQS, appliedPosition).toString());

                        var div = scoreSheet.displayExs["educationApp"];

                        var divHeader = div.content.children[0];
                        
                        div.container.appendChild(divHeader);
                        div.container.appendChild(div.totalPoints.container);
                        div.content.innerHTML = "";
                        div.content.appendChild(divHeader);
                        div.totalPoints.setHTMLContent("0");
                        div.fields = [];

                        if (appliedPosition["required_work_experience_years"] != null && appliedPosition["required_work_experience_years"] != 0 || appliedPosition["specific_work_experience_required"] != null)
                        {
                            div.addContent(scoreSheet.addHeader("Guide (for positions with experience requirement):", 6));

                            var list = createElementEx(NO_NS, "ol", null, null, "type", "A", "style", "font-size: 0.8em");
                    
                            div.addContent(list);
                    
                            [
                                "Action Plan approved by the Head of Office",
                                "Accomplishment Report verified by the Head of Office",
                                "Certification of utilization/adoption signed by the Head of Office"
                            ].forEach(text=>{
                                addText(text, createElementEx(NO_NS, "li", list));
                            });
                    
                            [
                                "Relevant",
                                {colName:"number_of_app_educ_r_actionplan", label:"A only"},
                                {colName:"number_of_app_educ_r_actionplan_ar", label:"A and B"},
                                {colName:"number_of_app_educ_r_actionplan_ar_adoption", label:"All MOVs"},
                                "Not Relevant",
                                {colName:"number_of_app_educ_nr_actionplan", label:"A only"},
                                {colName:"number_of_app_educ_nr_actionplan_ar", label:"A and B"},
                                {colName:"number_of_app_educ_nr_actionplan_ar_adoption", label:"All MOVs"}
                            ].forEach(obj=>{
                                if (obj == "")
                                {
                                    div.addLineBreak();
                                    return;
                                }
                                else if (typeof(obj) == "string")
                                {
                                    div.addContent(scoreSheet.addHeader("<big>" + obj + ":</big>", 6));
                                    return;
                                }
                                var field = scoreSheet.addInputEx(obj.label, "number", "0", "", obj.colName);
                                field.setFullWidth();
                                field.showColon();
                                field.setBlankStyle();
                                field.setMin(0);
                                field.setMax(999);
                                field.setWidth("3em");
                                field.setLabelWidth("9em");
                                field.fields[0].classList.add("right");
                                div.fields[obj.colName] = field;
                                div.addContent(field.container);

                                div.fields[obj.colName].addEvent("change", changeEvent=>{
                                    var total = scoreSheet.displayExs["educationApp"].fields["number_of_app_nr_educ_actionplan"].getValue() * 1
                                        + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_nr_actionplan_ar"].getValue() * 3
                                        + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_nr_actionplan_ar_adoption"].getValue() * 5
                                        + scoreSheet.displayExs["educationApp"].fields["number_of_app_r_educ_actionplan"].getValue() * 5
                                        + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_r_actionplan_ar"].getValue() * 7
                                        + scoreSheet.displayExs["educationApp"].fields["number_of_app_educ_r_actionplan_ar_adoption"].getValue() * 10;

                                    scoreSheet.displayExs["educationApp"].totalPoints.setHTMLContent((total > scoreSheet.criteria["educationApp"].weight ? 10 : total).toString());
                                });
                            });
                        }
                        else
                        {
                            var field = scoreSheet.addInputEx("GWA in the highest academic level earned", "number", "1", "", "app_educ_gwa");
                            field.showColon();
                            field.setBlankStyle();
                            field.setMin(1);
                            field.setMax(100);
                            field.setStep(0.1);
                            field.setWidth("3.5em");
                            field.fields[0].classList.add("right");
                            div.fields["app_educ_gwa"] = field;
                            div.addContent(field.container);                   
                            
                            div.fields["app_educ_gwa"].addEvent("change", changeEvent=>{
                                scoreSheet.displayExs["educationApp"].totalPoints.setHTMLContent((Math.round(div.fields["app_educ_gwa"].getValue() / 100 * scoreSheet.criteria["educationApp"].weight * 100) / 100).toString());
                            });
                        }

                        div.addContent(div.totalPoints.container);

                        for (const key in scoreSheet.dataLoaded)
                        {
                            switch (key)
                            {
                                case "applicant_name": case "applicant_option_label": case "application_code":
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
                                case "parenthetical_title_applied":
                                case "permanent_addressId":
                                case "personId":
                                case "plantilla_item_number_applied":
                                case "position_title_applied":
                                case "present_addressId":
                                case "relevant_eligibility":
                                case "relevant_training":
                                case "relevant_work_experience":
                                case "religionId":
                                case "sex":
                                    // do nothing
                                    break;
                                case "most_recent_performance_rating":
                                case "number_of_citation_movs":
                                case "number_of_academic_award_movs":
                                case "number_of_awards_external_office_search":
                                case "number_of_awards_external_org_level_search":
                                case "number_of_awards_central_co_level_search":
                                case "number_of_awards_central_national_search":
                                case "number_of_awards_regional_ro_level_search":
                                case "number_of_awards_regional_national_search":
                                case "number_of_awards_division_sdo_level_search":
                                case "number_of_awards_division_national_search":
                                case "number_of_awards_school_school_level_search":
                                case "number_of_awards_school_sdo_level_search":
                                case "number_of_research_proposal_only":
                                case "number_of_research_proposal_ar":
                                case "number_of_research_proposal_ar_util":
                                case "number_of_research_proposal_ar_util_adopt":
                                case "number_of_research_proposal_ar_util_cite":
                                case "number_of_smetwg_issuance_cert":
                                case "number_of_smetwg_issuance_cert_output":
                                case "number_of_speakership_external_office_search":
                                case "number_of_speakership_external_org_level_search":
                                case "number_of_speakership_central_co_level_search":
                                case "number_of_speakership_central_national_search":
                                case "number_of_speakership_regional_ro_level_search":
                                case "number_of_speakership_regional_national_search":
                                case "number_of_speakership_division_sdo_level_search":
                                case "number_of_speakership_division_national_search":
                                case "neap_facilitator_accreditation":
                                case "app_educ_gwa":
                                case "number_of_app_educ_actionplan":
                                case "number_of_app_educ_actionplan_ar":
                                case "number_of_app_educ_actionplan_ar_adoption":
                                case "number_of_app_train_relevant_cert_ap":
                                case "number_of_app_train_relevant_cert_ap_arlocal":
                                case "number_of_app_train_relevant_cert_ap_arlocal_arother":
                                case "number_of_app_train_not_relevant_cert_ap":
                                case "number_of_app_train_not_relevant_cert_ap_arlocal":
                                case "number_of_app_train_not_relevant_cert_ap_arlocal_arother":
                                case "score_exam":
                                case "score_skill":
                                case "score_bei":
                                    if (key in scoreSheet.dbInputEx)
                                    {
                                        scoreSheet.dbInputEx[key].setDefaultValue(scoreSheet.dataLoaded[key] ?? "", true);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }

                        retrieveApplicantDialog.close();
                    });
                };
                
                searchBox.addEvent("keyup", keyupEvent=>{
                    searchResult.clearList();

                    searchResult.show();
                    retrieveApplicantDialogBtnGrp.inputExs[0].enable();

                    searchResult.fillItemsFromServer("/mpasis/php/process.php", "a=fetch&f=applicationsByApplicantOrCode&srcStr=" + searchBox.getValue(), "applicant_option_label", "application_code");
                });

                // clickEvent.target.innerHTML = "Reset Form";
            }
            else if (clickEvent.target.innerHTML == "Reset Form")
            {
                scoreSheet.resetForm();

                clickEvent.target.innerHTML = "Load Application";
            }
        });

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
            postData(MPASIS_App.processURL, "app=mpasis&a=update&jobApplication=" + packageData(jobApplication), (event)=>{
                var response;

                if (event.target.readyState == 4 && event.target.status == 200)
                {
                    response = JSON.parse(event.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(scoreSheet.container, "ERROR: " + response.content, "OK");
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

        document.scrim = new ScrimEx(this.main);

        postData(MPASIS_App.processURL, "app=mpasis&a=fetch&f=initial-data", (postEvent)=>{
            var response;

            if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
            {
                response = JSON.parse(postEvent.target.responseText);

                if (response.type == "Error")
                {
                    new MsgBox(this.forms["scoreSheetOld"].container, "ERROR: " + response.content, "CLOSE");
                }
                else if (response.type == "Data")
                {
                    var data = JSON.parse(response.content);
                    document.positions = data["positions"];
                    document.salaryGrade = data["salary_grade"];
                    document.mpsEducIncrement = data["mps_increment_table_education"];
                    document.enumEducationalAttainment = data["enum_educational_attainment"];
                    document.positionCategory = data["position_category"];
                    
                    document.scrim.destroy();
                }
            }
        });

        scoreSheet.func["reset"] = function(){
            
        };

        return scoreSheet;
    }

    constructScoreSheet()
    {
        if (this.forms["scoreSheet"] != null && this.forms["scoreSheet"] != undefined)
        {
            return this.forms["scoreSheet"];
        }

        this.forms["scoreSheet"] = new ScoreSheet(this.mainSections["main-scoresheet"], "score-sheet");

        return this.forms["scoreSheet"];
    }

    constructIER()
    {
        if (this.forms["ier"] != null && this.forms["ier"] != undefined)
        {
            return this.forms["ier"];
        }

        this.forms["ier"] = new IERForm(this.mainSections["main-ier"], "ier-form");

        return this.forms["ier"];
    }

    constructIES()
    {
        if (this.forms["ies"] != null && this.forms["ies"] != undefined)
        {
            return this.forms["ies"];
        }

        this.forms["ies"] = new IESForm(this.mainSections["main-ies"], "ies-form");

        return this.forms["ies"];
    }

    showScrim()
    {
        this.scrim = new ScrimEx(this.main);
        this.scrim.addContent(htmlToElement("<span class=\"status-pane wait\"><span class=\"status-marker\"></span> <span class=\"status-message\">Please wait</span></span>"));
    }

    closeScrim()
    {
        this.scrim.destroy();
    }

    setCookie(cname, cvalue, exdays)
    {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
    }
    
    getCookie(cname)
    {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    static isDefined(value)
    {
        return value != null && value != undefined;
    }

    static isEmptyString(value) // checks if value is empty string
    {
        return type(value) == "string" && value == "";
    }

    static isEmptySpaceString(value) // checks if value is a string of space characters
    {
        return type(value) == "string" && (value == "" || value.trim() == "");
    }

    static isEmpty(value)
    {
        return !this.isDefined(value) || this.isEmptyString(value);
    }

    static getFullName(givenName, middleName, familyName, spouseName, extName, lastNameFirst = false, middleInitialOnly = false)
    {
        var nameArr = null;

        if (!MPASIS_App.isDefined(givenName) || MPASIS_App.isEmptySpaceString(givenName))
        {
            throw("Invalid argument: givenName:" + givenName);
        }

        nameArr = [givenName, middleName, familyName, spouseName, extName];

        if (lastNameFirst)
        {
            for (var i = nameArr.length - 2; i > 0; i--)
            {
                var lastName = nameArr.splice(i, 1)[0];

                if (MPASIS_App.isDefined(lastName) && !MPASIS_App.isEmptySpaceString(lastName))
                {
                    nameArr.unshift(lastName + ", ");
                    break;
                }
            }

            if (middleInitialOnly && nameArr.length > 3)
            {
                nameArr[2] = this.getNameInitials(nameArr[2]);
            }
        }
        else if (middleInitialOnly)
        {
            nameArr[1] = this.getNameInitials(nameArr[1]);
        }
        
        return nameArr.filter(name=>this.isDefined(name) && !this.isEmptySpaceString(name)).join(" ");
    }

    static getNameInitials(nameStr)
    {
        return (!this.isDefined(nameStr) || this.isEmptySpaceString(nameStr) ? "" : nameStr.split(" ").map(name=>name[0] + ".").join(" "));
    }

    static convertDegreeObjToStr(degree)
    {
        return degree["degree"]
            + " ("
            + (type(degree["graduation_year"]) == "number" && degree["graduation_year"] != null && degree["graduation_year"] != undefined ? "graduated in " + degree["graduation_year"]
                : (type(degree["complete_academic_requirements"]) == "boolean" && degree["complete_academic_requirements"] || type(degree["complete_academic_requirements"]) == "number" && degree["complete_academic_requirements"] != 0 ? "complete academic requirements"
                    : (type(degree["units_earned"]) == "number" && degree["units_earned"] != null && degree["units_earned"] != undefined ? degree["units_earned"] + " units earned"
                        : (type(degree["year_level_completed"]) == "number" && degree["year_level_completed"] != null && degree["year_level_completed"] != undefined ? degree["year_level_completed"] + " year" + (degree["year_level_completed"] == 1 ? "" : "s") + " completed" : "no info")
                    )
                )
            )
            + ")";
    }

    static selectPosition(positionField = new InputEx(), parenField = new InputEx(), plantillaField = new InputEx())
    {
        parenField.setValue("");
        parenField.clearList();
        parenField.fillItems(document.positions.filter(position=>(position["position_title"] == positionField.getValue() && position["parenthetical_title"] != null && position["parenthetical_title"] != "")), "parenthetical_title", "plantilla_item_number");

        this.selectParen(positionField, parenField, plantillaField);
    }

    static selectParen(positionField = new InputEx(), parenField = new InputEx(), plantillaField = new InputEx())
    {
        plantillaField.setValue(""); // for `combo` text input box only; unnecessary for select element; keep code for future use
        plantillaField.clearList();
        plantillaField.fillItems(document.positions.filter(position=>(position["position_title"] == positionField.getValue() && (parenField.getValue() == "" || position["parenthetical_title"] == parenField.getValue()))), "plantilla_item_number", "plantilla_item_number");
        var option = plantillaField.addItem("ANY");
        option.parentElement.insertBefore(option, option.parentElement.children[(plantillaField.type == "combo" ? 0 : 1)]);

        if (Array.from((plantillaField.type == "combo" ? plantillaField.datalist : plantillaField.fields[0]).children).length == (plantillaField.type == "combo" ? 2 : 3))
        {
            plantillaField.setValue((plantillaField.type == "combo" ? plantillaField.datalist : plantillaField.fields[0]).children[(plantillaField.type == "combo" ? 1 : 2)].value); // select the only plantilla item number available
        }
    }

    static selectPlantilla(positionField = new InputEx(), parenField = new InputEx(), plantillaField = new InputEx())
    {
        var selectedPlantilla = plantillaField.getValue();
        parenField.setValue(""); // for `combo` text input box only; unnecessary for select element; keep code for future use
        parenField.clearList();
        var temp = document.positions.filter(position=>((((selectedPlantilla == "ANY" || selectedPlantilla == "") && position["position_title"] == positionField.getValue()) || position["plantilla_item_number"] == selectedPlantilla) && position["parenthetical_title"] != null && position["parenthetical_title"] != ""));
        parenField.fillItems(temp, "parenthetical_title", "plantilla_item_number", "");
        if (parenField.type == "combo")
        {
            var filteredOptions = Array.from(parenField.datalist.children).filter(option=>option.getAttribute("data-value") == selectedPlantilla);
            parenField.setValue((filteredOptions.length > 0 ? filteredOptions[0].value : ""));
        }
        else
        {
            parenField.setValue(selectedPlantilla);
        }
    }
}

var app = new MPASIS_App(document.getElementById("mpasis"));

if (app.currentUser["first_signin"] && app.currentUser["first_signin"] != 0)
{
    var passChange = new PasswordEditor(app.main, "my-password-editor", false, true);

    passChange.formEx.setStatusMsgTimeout(-1);
    passChange.formEx.showInfo("Please set your new password");
}