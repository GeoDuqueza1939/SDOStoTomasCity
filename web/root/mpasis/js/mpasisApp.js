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

class MPASIS_App extends App
{
    static processURL = "/mpasis/php/process.php";
    // static defaultEndDate = "2023-04-05";// (new Date()).toLocaleDateString();
    // static defaultEndDate = "2024-03-15"; // Teacher I SPIMS
    // static defaultEndDate = (new Date()).toLocaleDateString();
    static defaultEndDate = "2024-05-16";

    constructor(container)
    {
        super(container);

        // change nav links into click event listeners
        this.navbar = Array.from(container.querySelectorAll("#navbar"))[0];
        this.main = Array.from(container.querySelectorAll("main"))[0];
        // this.mainSections = {};
        this.mainSections["main-dashboard"] = document.getElementById("main-dashboard");
        // this.scrim = null;
        // this.temp = {};
        this.currentUser = JSON.parse(MPASIS_App.getCookie("user"));
        
        var app = this;

        this.forms = {
            jobData:null,
            applicantData:null,
            scoreSheet:null,
            ier:null,
            ies:null,
            car:null,
            rqa:null
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
                    document.hrRoles = data["hr_roles"];
            
                    if (MPASIS_App.getCookie("current_view") == "" || MPASIS_App.getCookie("current_view") == undefined)
                    {
                        MPASIS_App.setCookie("current_view", "dashboard", 1);
                    }
            
                    this.activateView(MPASIS_App.getCookie("current_view"));
            
                    this.closeScrim();
                }                    
            }
        });

        if (this.currentUser["first_signin"] && this.currentUser["first_signin"] != 0)
        {
            var passChange = new PasswordEditor(this, "my-password-editor", false, true);
        
            passChange.formEx.setStatusMsgTimeout(-1);
            passChange.formEx.showInfo("Please set your new password");
        }
    }

    navClick(viewId)
    {
        switch(viewId)
        {
            case "sdo-home":
                console.log("Going Home");
                MPASIS_App.setCookie("current_view", "", -1);
                window.location = "/";
                break;
            case "signout":
                MPASIS_App.setCookie("user", "", -1);
                MPASIS_App.setCookie("current_view", "", -1);
                postData(MPASIS_App.processURL, "app=mpasis&a=logout", postEvent=>{
                    // var response;

                    // if (postEvent.target.readyState == 4 && postEvent.target.status == 200)
                    // {
                    //     response = JSON.parse(postEvent.target.responseText);

                    //     if (response.type == "Error")
                    //     {
                    //         console.log("ERROR: " + response.content);
                    //         MPASIS_App.setCookie("user", "", -1);
                    //         MPASIS_App.setCookie("current_view", "", -1);
                    //         window.location.reload(true);
                    //     }
                    //     else if (response.type == "Debug")
                    //     {
                    //         console.log("DEBUG: " + response.content);
                    //     }
                    //     else if (response.type == "Success")
                    //     {
                            // console.log(response.content);
                            // MPASIS_App.setCookie("user", "", -1);
                            // MPASIS_App.setCookie("current_view", "", -1);
                            window.location.reload(true);
                    //     }
                    // }
                });
                break;
            default:
                MPASIS_App.setCookie("current_view", viewId, 1);
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
                el = htmlToElement("<ul class=\"card-link\"></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"applicant-data-entry", label:"Applicant Data Entry"},
                    {viewId:"scoresheet", label:"Score Sheet"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.navClick(obj.viewId);
                    });
                });
                break;
            case "applicant-data-entry":
                this.constructApplicantDataForm();
                break;
            case "scoresheet":
                this.constructScoreSheet();
                break;
            case "job":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Job Openings</h2>";
                el = htmlToElement("<ul class=\"card-link\"></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"job-data-entry", label:"Data Entry"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.navClick(obj.viewId);
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
                el = htmlToElement("<ul class=\"card-link\"></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"scoresheet", label:"Score Sheet"},
                    {viewId:"ier", label:"Initial Evaluation Result (IER)"},
                    {viewId:"ies", label:"Individual Evaluation Sheet (IES)"},
                    {viewId:"car", label:"Comparative Assessment Result (CAR)"},
                    {viewId:"car-rqa", label:"Comparative Assessment Result - Registry of Qualified Applicants (CAR-RQA)"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>{
                        this.navClick(obj.viewId);
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
            case "car":
                this.constructCAR();
                break;
            case "car-rqa":
                this.constructCARRQA();
                break;
            case "account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>Account</h2>";
                el = htmlToElement("<ul class=\"card-link\"></ul>");
                this.mainSections["main-" + viewId].appendChild(el);
                [
                    {viewId:"my-account", label:"Edit My Account"},
                    {viewId:"other-account", label:"View/Edit Other Accounts"},
                    {viewId:"signout", label:"Sign Out"}
                ].forEach(obj=>{
                    var item = createElementEx(NO_NS, "li", el);
                    var itemLink = createElementEx(NO_NS, "a", item, null, "class", "js-link");
                    addText(obj.label, itemLink);
                    itemLink.addEventListener("click", event=>this.navClick(obj.viewId));
                });
                break;
            case "my-account":
                this.mainSections["main-" + viewId].innerHTML = "<h2>My Account</h2>";
                this.mainSections["main-" + viewId].appendChild(htmlToElement("<p class=\"center\">Welcome to your account settings, " + this.currentUser["username"] + "!</p>"));

                el = htmlToElement("<ul class=\"card-link\"></ul>");
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
                                new UserEditor().setup(this.main, this, "my-user-editor", 1, this.currentUser);
                                break;
                            case "change-password":
                                new PasswordEditor(this, "my-password-editor", true);
                                break;
                        }
                    });
                });
                break;
            case "other-account":
                var otherAccountFormEx = new Old_FormEx(this.mainSections["main-" + viewId], "other-account-form-ex", false);

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
                                    controlButtons.addItem("<span class=\"material-icons-round red\">lock_open</span>", "", "Reset Password");
                                    controlButtons.addItem("<span class=\"material-icons-round red\">close</span>", "", "Delete Account");
                                    controlButtons.inputExs.forEach((btn, index)=>{
                                        switch (index)
                                        {
                                            case 0:
                                                btn.addEvent("click", clickEditAccountEvent=>{
                                                    this.temp["searchButton"] = btnGrp.inputExs[0];
                                                    var editUserDialog = new UserEditor().setup(this.main, this, "mpasis-other-account-user-editor", 1, row);
                                                });
                                                break;
                                            case 1:
                                                btn.addEvent("click", clickEditAccountEvent=>{
                                                    this.temp["searchButton"] = btnGrp.inputExs[0];
                                                    var resetPass = new MsgBox(this.main, "Do you want to reset the password of " + row["username"] + "?", "YESNO", ()=>{
                                                        postData(MPASIS_App.processURL, "a=resetPassd&username=" + row["username"], updatePasswordEvent=>{
                                                            var response;
                                            
                                                            if (updatePasswordEvent.target.readyState == 4 && updatePasswordEvent.target.status == 200)
                                                            {
                                                                response = JSON.parse(updatePasswordEvent.target.responseText);
                                            
                                                                if (response.type == "Error")
                                                                {
                                                                    new MsgBox(app.main, "ERROR: " + response.content, "Close");
                                                                }
                                                                else if (response.type == "Debug")
                                                                {
                                                                    new MsgBox(app.main, response.content, "Close");
                                                                    console.log(response.content);
                                                                }
                                                                else if (response.type == "Success")
                                                                {
                                                                    new MsgBox(app.main, response.content, "Close");
                                                                }
                                                            }
                                                        });                                            
                                                    });
                                                });
                                                break;
                                            case 2:
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
                                    viewer.rows.slice(-1)[0]["td"]["control"].appendChild(controlButtons.container);
                                }
                            }
                        }
                    });
                });
                btnGrp.inputExs[1].setLabelText("Add New Account");
                btnGrp.inputExs[1].setTooltipText("");
                btnGrp.inputExs[1].addEvent("click", (event)=>{
                    var addUserDialog = new UserEditor().setup(this.main, this, "mpasis-add-account-user-editor", 0);
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
                this.constructSettingsForm();
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

        this.forms["jobData"] = new Old_FormEx(this.mainSections["main-job-data-entry"], "job-data-form");
        this.forms["jobData"].fieldWrapper.style.display = "grid";
        this.forms["jobData"].fieldWrapper.style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto";
        this.forms["jobData"].fieldWrapper.style.gridAutoFlow = "column";
        this.forms["jobData"].fieldWrapper.style.gridGap = "1em";

        this.forms["jobData"].setFullWidth();
        this.forms["jobData"].setTitle("Job Data Entry", 2);

        field = this.forms["jobData"].addInputEx("Load Position", "buttonEx", "", "Load Position", "loadPosition");
        field.container.style.gridColumn = "1 / span 12";
        field.container.classList.add("right");
        //field.disable();
        this.forms["jobData"].dbInputEx["loadPosition"].addEvent("click", (loadPositionClickEvent)=>{
            var retrievePositionDialog = null;
            if (loadPositionClickEvent.target.innerHTML == "Load Position")
            {
            //     var retrieveApplicant = (applicationObj, newApplication = false)=>{
                        
            //         console.log(applicationObj, applicantDataForm.dbInputEx);

            //         if (!newApplication)
            //         {
            //             applicantDataForm.dbInputEx["position_title_applied"].setDefaultValue(applicationObj["position_title_applied"] ?? "", true);
            //             applicantDataForm.dbInputEx["parenthetical_title_applied"].setDefaultValue(applicationObj["parenthetical_title_applied"] ?? "", true);
            //             applicantDataForm.dbInputEx["plantilla_item_number_applied"].setDefaultValue(applicationObj["plantilla_item_number_applied"] ?? "ANY", true);
            //             plantillaChange();
            //         }

            //         for (const key in applicationObj)
            //         {
            //             if (key in applicantDataForm.dbInputEx)
            //             {
            //                 switch (key)
            //                 {
            //                     case "position_title_applied":
            //                     case "parenthetical_title_applied":
            //                     case "plantilla_item_number_applied":
            //                         // do nothing; whatever needs to be done here needs to be done earlier
            //                         break;
            //                     case "sex":
            //                         applicantDataForm.dbInputEx[key].setDefaultValue((applicationObj[key] == "Male" ? 1 : (applicationObj[key] == "Female" ? 2 : "")), true);
            //                         break;
            //                     case "civil_status":
            //                         applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj["civil_statusIndex"], true);
            //                         break;
            //                     case "disability":
            //                     case "email_address":
            //                     case "contact_number":
            //                         if (applicationObj[key].length > 0)
            //                         {
            //                             applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj[key].map(number=>number[key]).join(";"), true);
            //                         }
            //                         break;
            //                     case "degree_taken":
            //                         break;
            //                     case "educational_attainment":
            //                         applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj["educational_attainmentIndex"], true);
            //                         applicantDataForm.dbInputEx["degree_taken"].setDefaultValue(applicationObj["degree_taken"]);
            //                         applicantDataForm.dbInputEx["degree_taken"].setValue("degree_takenId", applicationObj["degree_taken"]);
            //                         attainedEducIncrement.innerHTML = computeEducIncrementLevel();
            //                         break;
            //                     default:
            //                         if (!newApplication && !applicantDataForm.dbInputEx[key].isDisabled() && (applicantDataForm.dbInputEx[key].type == "checkbox" || applicantDataForm.dbInputEx[key] == "radio"))
            //                         {
            //                             applicantDataForm.dbInputEx[key].check(applicationObj[key] == 1);
            //                         }
            //                         else if (!newApplication || key != "application_code")
            //                         {
            //                             applicantDataForm.dbInputEx[key].setDefaultValue(applicationObj[key] ?? "", true);
            //                         }
            //                         break;
            //                 }
            //             }
            //             else
            //             {
            //                 switch (key)
            //                 {
            //                     case "present_address":
            //                         applicantDataForm.dbInputEx["address"].setDefaultValue(applicationObj["permanent_address"] ?? applicationObj["present_address"] ?? "", true);
            //                         break;
            //                     case "ethnic_group":
            //                         applicantDataForm.dbInputEx["ethnicity"].setDefaultValue(applicationObj[key] ?? "", true);
            //                         break;
            //                     case "relevant_training":
            //                         while(trainingInputExs.length > 0)
            //                         {
            //                             trainingInputExs.slice(-1)[0]["trainingInputEx"]["removeRowBtn"].removeRowOverride = true;
            //                             trainingInputExs.slice(-1)[0]["trainingInputEx"]["removeRowBtn"].fields[0].click();
            //                         }

            //                         for (const training of applicationObj[key])
            //                         {
            //                             addTrainingBtn.fields[0].click();
            //                             trainingInputExs.slice(-1)[0]["trainingInputEx"].setDefaultValue(training["descriptive_name"], true);
            //                             trainingInputExs.slice(-1)[0]["trainingHoursInputEx"].setDefaultValue(training["hours"], true);
            //                         }
            //                         attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
            //                         break;
            //                     case "has_more_unrecorded_training":
            //                         moreTraining.check(applicationObj[key] == 1);
            //                         break;
            //                     case "has_more_unrecorded_work_experience":
            //                         moreWorkExp.check(applicationObj[key] == 1);
            //                         break;
            //                     case "relevant_work_experience":
            //                         while(workExpInputExs.length > 0)
            //                         {
            //                             workExpInputExs.slice(-1)[0]["workExpInputEx"]["removeRowBtn"].removeRowOverride = true;
            //                             workExpInputExs.slice(-1)[0]["workExpInputEx"]["removeRowBtn"].fields[0].click();
            //                         }

            //                         for (const workExp of applicationObj[key])
            //                         {
            //                             addWorkExpBtn.fields[0].click();
            //                             workExpInputExs.slice(-1)[0]["workExpInputEx"].setDefaultValue(workExp["descriptive_name"], true);
            //                             workExpInputExs.slice(-1)[0]["workExpStartDateInputEx"].setDefaultValue(workExp["start_date"], true);
            //                             workExpInputExs.slice(-1)[0]["workExpEndDateInputEx"].setDefaultValue(workExp["end_date"], true);
            //                             workExpInputExs.slice(-1)[0]["workExpDuration"].setHTMLContent(ScoreSheet.convertDurationToString(ScoreSheet.getDuration(workExp["start_date"], workExp["end_date"])));
            //                         }
            //                         attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
            //                         break;
            //                     case "relevant_eligibility":
            //                         applicantDataForm.dbInputEx["eligibilityId"].setDefaultValue(applicationObj[key].map(elig=>elig["eligibilityId"]), true);
            //                         applicantDataForm.dbInputEx["eligibilityId"].inputExs[1]["changeElig"]();
            //                         break;
            //                     default:
            //                         break;
            //                 }
            //             }
            //         }

            //         if (!newApplication)
            //         {
            //             applicantDataForm.dbInputEx["application_code"].disable();
            //         }

            //         applicantDataBtnGrp.inputExs[0].setLabelText(newApplication ? "Save" : "Update");

            //         loadApplicant.setLabelText("Reset Form");
            //     };

            //     retrievePositionDialog = new JobApplicationSelectorDialog(this, "applicant-data-job-application-selector-dialog", [
            //         {label:"New", tooltip:"Create a new application from the selected application's data", callbackOnClick:event=>{                
            //             var searchResult = retrievePositionDialog.getApplicantListBox();
                        
            //             if (typeof(searchResult.getValue()) == "string" && searchResult.getValue() == "" || searchResult.getValue() == null)
            //             {
            //                 retrievePositionDialog.formEx.raiseError("Please select an item to load before continuing");
            //                 return;
            //             }
            //             else
            //             {
            //                 applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0]
            //                 retrieveApplicant(applicantDataForm.dataLoaded, true);
            //             }
                        
            //             retrievePositionDialog.close();
            //         }},
            //         {label:"Edit", tooltip:"Load selected application for editing", callbackOnClick:event=>{                
            //             var searchResult = retrievePositionDialog.getApplicantListBox();
                        
            //             if (typeof(searchResult.getValue()) == "string" && searchResult.getValue() == "" || searchResult.getValue() == null)
            //             {
            //                 retrievePositionDialog.formEx.raiseError("Please select an item to load before continuing");
            //                 return;
            //             }
            //             else
            //             {
            //                 applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.getValue())[0]
            //                 retrieveApplicant(applicantDataForm.dataLoaded, false);
            //             }
                        
            //             retrievePositionDialog.close();
            //         }},
            //         {label:"Cancel", tooltip:"Close dialog", callbackOnClick:event=>{
            //             retrievePositionDialog.close();
            //         }}
            //     ]);

            //     retrievePositionDialog.getDialogButton(0).disable();
            //     retrievePositionDialog.getDialogButton(1).disable();

            //     ["change", "keydown", "keyup", "keypress"].forEach(eventType=>{
            //         retrievePositionDialog.getApplicantQueryBox().addEvent(eventType, event=>retrievePositionDialog.getDialogButton(0).disable());
            //         retrievePositionDialog.getApplicantQueryBox().addEvent(eventType, event=>retrievePositionDialog.getDialogButton(1).disable());
            //     });
    
            //     retrievePositionDialog.getApplicantListBox().addEvent("click", selectOptionEvent=>{
            //         retrievePositionDialog.getDialogButton(0).enable();
            //         retrievePositionDialog.getDialogButton(1).enable();
            //     });
            }
            else if (loadPositionClickEvent.target.innerHTML == "Reset Form")
            {
            //     this.showScrim();
                
            //     // applicantDataForm.resetForm();
            //     window.location.reload(true);

            //     loadPositionClickEvent.target.innerHTML = "Load Existing Applicant";
            }
            alert("TESTING AGAIN!");
            
        });

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
        field.container.style.gridColumn = "1 / span 6";
        field.reverse();
        field.setVertical();
        field.runAfterFilling = function(){
            this.inputExs[0].check();
        };
        field.fillItemsFromServer(MPASIS_App.processURL, "app=mpasis&a=fetch&f=positionCategory", "position_category", "position_categoryId", "description");
        
        this.forms["jobData"].addSpacer();

        field = this.forms["jobData"].addInputEx("Place of Assignment", "text", "", "", "place_of_assignment", "Position");
        field.container.style.gridColumn = "7 / span 6";
        field.setVertical();
        field.showColon();

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
        
        field = this.forms["jobData"].addInputEx("Total years of relevant work experience", "number", "0", "Minimum years of relevant work experience", "required_work_experience_years", "Position");
        field.container.style.gridColumn = "1 / span 6";
        field.container.style.gridRow = "span 2";
        field.showColon();
        field.setMin(0);
        field.setMax(99);
        field.setFullWidth();

        field = this.forms["jobData"].addInputEx("Position may require alternative work experience qualification", "checkbox", "", "Select for positions that have alternative work experience requirements that could differ in the number of years. These alternative qualifications should be detailed in the specific work experience field.", "alternative_work_experience", "Position");
        field.labels[0].style.fontWeight = "bold";
        field.reverse();
        field.container.style.gridColumn = "1 / span 6";
        field.container.style.gridRow = "span 1";

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

            this.removeItemAt(this.inputExs.findIndex(inputEx=>Number.parseInt(inputEx.fields[0].value) == 3)); // Remove Honor Graduate entry which is only one of the equivalents of CS Prof

            addEligibilityBtn = new InputEx(this.fieldWrapper, "add-eligibility-input-ex", "buttonEx", false);
            addEligibilityBtn.setLabelText("+Add Missing Eligibility");
            addEligibilityBtn.addEvent("click", (clickEvent)=>{
                var addEligDialog = new Old_DialogEx(app.main, "add-eligibility-dialog-ex");
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
                    else if (key == "alternative_work_experience")
                    {
                        position[key] = this.forms["jobData"].dbInputEx[key].isChecked();
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

            // DEBUG
            // console.log(packageData(positions));
            
            // return;
            // DEBUG
            
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
                        new MsgBox(this.forms["jobData"].container, response.content, "OK", successClickOKEvent=>{
                            window.location.reload(true);
                        });
                    }
                    else if (response.type == "Warning")
                    {
                        new MsgBox(this.forms["jobData"].container, "WARNING: " + response.content, "OK");
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

        applicantDataForm = this.forms["applicantData"] = new Old_FormEx(this.mainSections["main-applicant-data-entry"], "applicant-data-form-ex", true);
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

        field = applicantDataForm.addInputEx("Spouse's Last Name", "text", "", "Spouse's Last Name; for married women", "spouse_name", "Person");
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

        var educNotes = applicantDataForm.addInputEx("Relevant documents or requirements submitted/Other remarks", "textarea", "", "", "educ_notes", "Job_Application", true);
        educNotes.setFullWidth();
        educNotes.container.style.gridColumn = "1 / span 12";

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
            
            requiredEducIncrement.innerHTML = (appliedPosition == null ? 0 : ScoreSheet.getEducIncrements(parseInt(appliedPosition["required_educational_attainment"]), []));

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
        moreTraining.setFullWidth();

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

            trainingInputExs.slice(-1)[0]["trainingHoursInputEx"].setDefaultValue(0, true);

            trainingInputExs.slice(-1)[0]["trainingHoursInputEx"].addEvent("change", changeEvent=>{
                attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
            });

            var removeRowBtn = new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (trainingInputExs.length - 1), "buttonEx");
            removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 50%; color: red;\">close</span></b>");
            removeRowBtn.fields[0].style.borderRadius = "1em";
            removeRowBtn.fields[0].style.padding = 0;
            removeRowBtn.fields[0].style.fontSize = "0.5em";
            removeRowBtn["row"] = row;
            removeRowBtn["rowData"] = trainingInputExs.slice(-1)[0];
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

            for (const key in trainingInputExs.slice(-1)[0])
            {
                trainingInputExs.slice(-1)[0][key]["removeRowBtn"] = removeRowBtn;
            }

            trainingInputExs.slice(-1)[0].trainingInputEx.setFullWidth();
            trainingInputExs.slice(-1)[0].trainingInputEx.setPlaceholderText("Enter a descriptive name for the training");
            trainingInputExs.slice(-1)[0].trainingInputEx.fields[0].style.width = "100%";
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.setFullWidth();
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.setPlaceholderText("hours");
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.setMin(0);
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.setMax(999);
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.fields[0].style.width = "100%";
            trainingInputExs.slice(-1)[0].trainingHoursInputEx.fields[0].style.textAlign = "right";
        });
        specTrainingAttained.addEvent("change", changeEvent=>{
            attainedTrainingIncrement.innerHTML = computeTrainingIncrementLevel();
        });

        var trainNotes = applicantDataForm.addInputEx("Relevant documents or requirements submitted/Other remarks", "textarea", "", "", "train_notes", "Job_Application", true);
        trainNotes.setFullWidth();
        trainNotes.container.style.gridColumn = "1 / span 12";

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

        var workExpUseAlternative = applicantDataForm.addInputEx("Specify an alternative work experience requirement in years. Clarify in remarks.", "checkbox", "", "", "has_alternative_work_experience_applicable", "Job_Application");
        workExpUseAlternative.setParent(workExpDiv);
        workExpUseAlternative.reverse();
        workExpUseAlternative.setFullWidth();
        workExpUseAlternative.disable();
        workExpUseAlternative.hide();

        workExpUseAlternative.inlineTextboxEx = applicantDataForm.addInputEx("Required relevant work experience in years", "text", "0", "Required relevant work experience in years", "alternative_work_experience_years", "Job_Application");
        workExpUseAlternative.inlineTextboxEx.setParent(workExpUseAlternative.labels[0]);
        workExpUseAlternative.inlineTextboxEx.hide();

        workExpUseAlternative.handleInlineTextboxExOnCheck = altWorkExpClickEvent=>{ 
        if (workExpUseAlternative.isChecked())
            {
                workExpUseAlternative.inlineTextboxEx.show();
            }
            else
            {
                workExpUseAlternative.inlineTextboxEx.hide();
            }
        };
        workExpUseAlternative.addEvent("click", workExpUseAlternative.handleInlineTextboxExOnCheck);

        var moreWorkExp = new InputEx(workExpDiv, "has_more_unrecorded_work_experience", "checkbox");    
        moreWorkExp.setLabelText("There are more work experience information that were no longer included in this list for encoding.");
        moreWorkExp.reverse();
        moreWorkExp.setFullWidth();

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

        var workExpNotes = applicantDataForm.addInputEx("Relevant documents or requirements submitted/Other remarks", "textarea", "", "", "work_exp_notes", "Job_Application", true);
        workExpNotes.setFullWidth();
        workExpNotes.container.style.gridColumn = "1 / span 12";

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
                end = (end == "" ? MPASIS_App.defaultEndDate : end);

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

            workExpInputExs.slice(-1)[0]["workExpEndDateInputEx"].setTooltipText("Leave blank if still employed");

            workExpInputExs.slice(-1)[0]["workExpStartDateInputEx"].addEvent("change", changeEvent=>{
                attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
            });
            workExpInputExs.slice(-1)[0]["workExpEndDateInputEx"].addEvent("change", changeEvent=>{
                attainedWorkExpIncrement.innerHTML = computeWorkExpIncrement();
            });
            
            var removeRowBtn = new InputEx(createElementEx(NO_NS, "td", row), "remove-row-" + (workExpInputExs.length - 1), "buttonEx")
            removeRowBtn.setLabelText("<b><span class=\"material-icons-round\" style=\"border-radius: 50%; color: red;\">close</span></b>");
            removeRowBtn.fields[0].style.borderRadius = "1em";
            removeRowBtn.fields[0].style.padding = 0;
            removeRowBtn.fields[0].style.fontSize = "0.5em";
            removeRowBtn["row"] = row;
            removeRowBtn["rowData"] = workExpInputExs.slice(-1)[0];
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

            for (const key in workExpInputExs.slice(-1)[0])
            {
                workExpInputExs.slice(-1)[0][key]["removeRowBtn"] = removeRowBtn;
            }

            workExpInputExs.slice(-1)[0].workExpInputEx.setFullWidth();
            workExpInputExs.slice(-1)[0].workExpInputEx.setPlaceholderText("Enter a descriptive name for the work experience");
            workExpInputExs.slice(-1)[0].workExpInputEx.fields[0].style.width = "100%";
            workExpInputExs.slice(-1)[0].workExpStartDateInputEx.setFullWidth();
            workExpInputExs.slice(-1)[0].workExpStartDateInputEx.fields[0].style.width = "100%";
            workExpInputExs.slice(-1)[0].workExpEndDateInputEx.setFullWidth();
            workExpInputExs.slice(-1)[0].workExpEndDateInputEx.fields[0].style.width = "100%";

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

            this.removeItemAt(this.inputExs.findIndex(inputEx=>Number.parseInt(inputEx.fields[0].value) == 4)); // Remove RA 1080 entry which is only used as a general/umbrella requirement for positions

            this.setAsExtendableList(true, "+Add missing eligibility", clickEvent=>{
                var addEligibilityBtn = clickEvent.target.inputEx;
                var addEligDialog = new Old_DialogEx(app.main, "add-eligibility-dialog-ex");
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
                            var requiredEligibility = requiredEligibilities.slice(-1)[0];
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
                var retrieveApplicant = (applicationObj, newApplication = false)=>{
                        
                    // console.log(applicationObj, applicantDataForm.dbInputEx);

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
                                        trainingInputExs.slice(-1)[0]["trainingInputEx"]["removeRowBtn"].removeRowOverride = true;
                                        trainingInputExs.slice(-1)[0]["trainingInputEx"]["removeRowBtn"].fields[0].click();
                                    }

                                    for (const training of applicationObj[key])
                                    {
                                        addTrainingBtn.fields[0].click();
                                        trainingInputExs.slice(-1)[0]["trainingInputEx"].setDefaultValue(training["descriptive_name"], true);
                                        trainingInputExs.slice(-1)[0]["trainingHoursInputEx"].setDefaultValue(training["hours"], true);
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
                                        workExpInputExs.slice(-1)[0]["workExpInputEx"]["removeRowBtn"].removeRowOverride = true;
                                        workExpInputExs.slice(-1)[0]["workExpInputEx"]["removeRowBtn"].fields[0].click();
                                    }

                                    for (const workExp of applicationObj[key])
                                    {
                                        addWorkExpBtn.fields[0].click();
                                        workExpInputExs.slice(-1)[0]["workExpInputEx"].setDefaultValue(workExp["descriptive_name"], true);
                                        workExpInputExs.slice(-1)[0]["workExpStartDateInputEx"].setDefaultValue(workExp["start_date"], true);
                                        workExpInputExs.slice(-1)[0]["workExpEndDateInputEx"].setDefaultValue(workExp["end_date"], true);
                                        workExpInputExs.slice(-1)[0]["workExpDuration"].setHTMLContent(ScoreSheet.convertDurationToString(ScoreSheet.getDuration(workExp["start_date"], workExp["end_date"])));
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

                retrieveApplicantDialog = new JobApplicationSelectorDialogEx();
                retrieveApplicantDialog.setup(this.main, this, "applicant-data-job-application-selector-dialog", [
                    {caption:"New", buttonType:"button", enable:false, tooltip:"Create a new application from the selected application's data", clickCallback:event=>{                
                        let searchResult = retrieveApplicantDialog.getApplicantListBox();
                        
                        if (typeof(searchResult.value) == "string" && searchResult.value == "" || searchResult.value == null)
                        {
                            retrieveApplicantDialog.raiseError("Please select an item to load before continuing");
                            return;
                        }
                        else
                        {
                            applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.value)[0]
                            retrieveApplicant(applicantDataForm.dataLoaded, true);
                        }
                        
                        retrieveApplicantDialog.close();
                    }},
                    {caption:"Edit", buttonType:"button", enable:false, tooltip:"Load selected application for editing", clickCallback:event=>{                
                        var searchResult = retrieveApplicantDialog.getApplicantListBox();
                        
                        if (typeof(searchResult.value) == "string" && searchResult.value == "" || searchResult.value == null)
                        {
                            retrieveApplicantDialog.raiseError("Please select an item to load before continuing");
                            return;
                        }
                        else
                        {
                            applicantDataForm.dataLoaded = searchResult.data.filter(data=>data["application_code"] == searchResult.value)[0]
                            retrieveApplicant(applicantDataForm.dataLoaded, false);
                        }
                        
                        retrieveApplicantDialog.close();
                    }},
                    {caption:"Cancel", buttonType:"button", tooltip:"Close dialog", clickCallback:event=>{
                        retrieveApplicantDialog.close();
                    }}
                ]);

                ["change", "keydown", "keyup", "keypress"].forEach(eventType=>{
                    retrieveApplicantDialog.getApplicantQueryBox().addEvent(eventType, event=>retrieveApplicantDialog.getDialogButton(0).disable());
                    retrieveApplicantDialog.getApplicantQueryBox().addEvent(eventType, event=>retrieveApplicantDialog.getDialogButton(1).disable());
                });
    
                retrieveApplicantDialog.getApplicantListBox().addEvent("click", selectOptionEvent=>{
                    retrieveApplicantDialog.getDialogButton(0).enable();
                    retrieveApplicantDialog.getDialogButton(1).enable();
                });
            }
            else if (loadApplicantClickEvent.target.innerHTML == "Reset Form")
            {
                this.showScrim();
                
                // applicantDataForm.resetForm();
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
                    document.hrRoles = data["hr_roles"];
                    
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

            if (appliedPosition == null)
            {
                alert("Specified position not found. (" + positionField.getValue() + ")");
                return;
            }

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
            if (appliedPosition["alternative_work_experience"] == 0)
            {
                workExpUseAlternative.disable();
                workExpUseAlternative.hide();
            }
            else
            {
                workExpUseAlternative.show();
                workExpUseAlternative.enable();
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
            requiredEducIncrement.innerHTML = ScoreSheet.getEducIncrements(Number(appliedPosition["required_educational_attainment"]), []);
            requiredTrainingIncrement.innerHTML = Math.trunc(Number(appliedPosition["required_training_hours"]) / 8) + 1;
            requiredWorkExpIncrement.innerHTML = Math.trunc(Number(appliedPosition["required_work_experience_years"]) * 12 / 6) + 1;
            remarkElig.innerHTML = (appliedPosition["required_eligibility"].length == 0 ? "Not Required" : "Not Qualified");
            remarkElig.style.color = (appliedPosition["required_eligibility"].length == 0 ? null : "red");

        };
        positionField.addEvent("change", plantillaChange);
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

    constructScoreSheet()
    {
        if (this.forms["scoreSheet"] == null || this.forms["scoreSheet"] == undefined)
        {
            this.forms["scoreSheet"] = new ScoreSheet(this, "score-sheet");
        }

        return this.forms["scoreSheet"];
    }

    constructIER()
    {
        if (this.forms["ier"] == null || this.forms["ier"] == undefined)
        {
            this.forms["ier"] = new IERForm(this, "ier-form");
        }

        return this.forms["ier"];
    }

    constructIES()
    {
        if (this.forms["ies"] == null || this.forms["ies"] == undefined)
        {
            this.forms["ies"] = new IESForm(this, "ies-form");
        }

        return this.forms["ies"];
    }

    constructCAR()
    {
        if (this.forms["car"] == null || this.forms["car"] == undefined)
        {
            this.forms["car"] = new CARForm(this, "car-form");
        }

        return this.forms["car"];
    }

    constructCARRQA()
    {
        if (this.forms["rqa"] == null || this.forms["rqa"] == undefined)
        {
            this.forms["rqa"] = new RQAForm(this, "rqa-form");
        }

        return this.forms["rqa"];
    }

    constructSettingsForm()
    {
        if (this.forms["settings"] == null || this.forms["settings"] == undefined)
        {
            this.forms["settings"] = new MPASIS_Settings_Form(this, "settings");
        }

        return this.forms["settings"];
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

    static setCookie(cname, cvalue, exdays)
    {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
    }
    
    static getCookie(cname)
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

    static getFullName(givenName, middleName, familyName, spouseName, extName, lastNameFirst = false, middleInitialOnly = true, includeMaidenMiddleName = false)
    {
        var nameArr = null;

        if (!MPASIS_App.isDefined(givenName) || MPASIS_App.isEmptySpaceString(givenName))
        {
            throw("Invalid argument: givenName:" + givenName);
        }

        nameArr = [givenName, middleName, familyName, spouseName, extName];

        if (!includeMaidenMiddleName && this.isDefined(middleName) && !this.isEmptySpaceString(middleName) && this.isDefined(familyName) && !this.isEmptySpaceString(familyName) && this.isDefined(spouseName) && !this.isEmptySpaceString(spouseName))
        {
            nameArr.splice(1, 1);
        }

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

            if (this.isDefined(extName) && !this.isEmptySpaceString(extName))
            {
                nameArr[1] += " " + extName.trim();
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

    static selectPlantilla(positionField = new InputEx(), parenField = new InputEx(), plantillaField = new InputEx(), clearParenFieldForAnyPlantilla = true)
    {
        var selectedPlantilla = plantillaField.getValue();
        if (clearParenFieldForAnyPlantilla || selectedPlantilla == "ANY")
        {
            parenField.setValue(""); // for `combo` text input box only; unnecessary for select element; keep code for future use
            parenField.clearList();
            var temp = document.positions.filter(position=>((((selectedPlantilla == "ANY" || selectedPlantilla == "") && position["position_title"] == positionField.getValue()) || position["plantilla_item_number"] == selectedPlantilla) && position["parenthetical_title"] != null && position["parenthetical_title"] != ""));
            parenField.fillItems(temp, "parenthetical_title", "plantilla_item_number", "");
        }
        console.log(parenField.datalist);
        if (parenField.type == "combo" || (!clearParenFieldForAnyPlantilla && parenField.type == "select")) // !!!!! IMPROVE THIS LOGIC!
        {
            if (parenField.datalist != null)
            {
                var filteredOptions = Array.from(parenField.datalist.children).filter(option=>option.getAttribute("data-value") == selectedPlantilla);
                parenField.setValue((filteredOptions.length > 0 ? filteredOptions[0].value : ""));
            }
        }
        else
        {
            parenField.setValue(selectedPlantilla);
        }
    }

    static filterPosition(positions, positionTitle, parenTitle, plantilla)
    {

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
            {caption:"OK", clickCallback:event=>{
                let hrRoles = {};

                for (const key in this.#selectorLinks)
                {
                    hrRoles[key] = this.#selectorLinks[key].selected.map(item=>({name:item.text, personId:item.value}));
                }

                console.log(hrRoles);
            }, tooltip:"Assign roles and close dialog."},
            {caption:"Cancel", clickCallback:event=>thisDialog.close(), tooltip:"Close dialog and discard any changes."}
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
            for (const item of [{name:"Dr. Neil G. Angeles, Ed.D.",personId:0}, {name:"Jessamae O. Castromero",personId:1}, {name:"Edward D. Garcia",personId:2}, {name:"Guillerma L. Bilog, Ed.D.",personId:3}, {name:"Carina V. Pedragosa",personId:4}, {name:"Catalina M. Calinawan",personId:5}, {name:"Jaime Tolentino",personId:6}])
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
        console.log(userData);

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
        this.dataFormEx.addControlEx(CheckboxEx.UIExType, {label:"Temporary account only", id:"temp_user", name:"temp_user", check:(mode == 1 && MPASIS_App.isDefined(userData) && "temp_user" in userData && parseInt(userData["temp_user"]) === 1), addContainerClass:obj=>obj.container.classList.add("temp-user"), tooltip:"Temporary accounts are accounts that are not bound to employee information", reverse:undefined, dbInfo:{column:"temp_user"}});
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
            {caption:"Save", buttonType:"button", tooltip:"Save employee information", clickCallback:function(clickEvent){
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
    
                    postData(MPASIS_App.processURL, "app=mpasis&a=" + (dialog.mode == 0 ? "add" : "update") + "&person=" + packageData(person) + "&user=" + packageData(user), async (event)=>{
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
            }}, {caption:"Close", buttonType:"button", tooltip:"Close dialog", clickCallback:function(clickEvent){
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

class JobApplicationSelectorDialogEx extends DialogEx
{
    constructor()
    {
        super();
    }

    setup(parentHTMLElement = new HTMLElement(), app = new App(), id = "", buttonsConfig = [{caption:"Close",tooltip:"Close dialog box",clickCallback:JobApplicationSelectorDialogEvent=>this.close()}])
    {
        super.setup(parentHTMLElement);
        let thisDialog = this;
        this.app = app;

        this.scrim.classList.add("job-application-selector");
        this.caption = "Select Job Application";
        this.captionHeaderLevel = 3;
        this.addDataFormEx("div");
        this.dataFormEx.id = id;
        
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {id:"app", name:"app", inputType:"hidden", value:"MPaSIS"});
        this.dataFormEx.addControlEx(TextboxEx.UIExType, {label:"Enter an applicant name or application code:", tooltip:"Press [ENTER] to populate list", addContainerClass:obj=>obj.container.classList.add("applicant-query-box"), vertical:true, dbInfo:{column:"applicantQueryBox"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(ButtonEx.UIExType, {caption:"\u{1f50d}", tooltip:"Click to populate list", addContainerClass:obj=>obj.container.classList.add("applicant-search-button"), dbInfo:{column:"applicantSearchButton"}});
        this.dataFormEx.addSpacer();
        this.dataFormEx.addControlEx(RadioButtonGroupEx.UIExType, {label:"Choose the job application to load", containerType:"frame", setupCustom:obj=>{ obj.container.classList.add("applicant-list-box"); obj.addStatusPane(); obj.statusMsgTimeout = -1; obj.showInfo("None to show", false); }, vertical:true, dbInfo:{column:"applicantListBox"}});

        this.getApplicantQueryBox().container.appendChild(this.dataFormEx.dbControls["applicantSearchButton"].container);

        this.getApplicantListBox().reverse();

        this.setupDialogButtons(buttonsConfig);

        this.getApplicantListBox().runAfterFilling = ()=>{
            this.getApplicantListBox().reverse();
        };

        var keyEventFunc = ()=>{
            this.getApplicantListBox().removeAllItems();

            this.getApplicantListBox().statusTimeout = -1;
            this.getApplicantListBox().showWait("Retrieving . . .");

            this.getApplicantListBox().fillItemsFromServer(MPASIS_App.processURL, "a=fetch&f=applicationsByApplicantOrCode&srcStr=" + this.getApplicantQueryBox().value, "applicant_option_label", "application_code");
        }

        this.dataFormEx.dbControls["applicantSearchButton"].addEvent("click", keyEventFunc);

        this.getApplicantQueryBox().addEvent("keypress",  keyEvent=>{
            if (keyEvent.key === "Enter")
            {
                this.dataFormEx.dbControls["applicantSearchButton"].click();
            }
        });

        return this;
    }
    
    getApplicantListBox() // CONVERT TO PROPERTY
    {
        return this.dataFormEx.dbControls["applicantListBox"];
    }

    getApplicantQueryBox() // CONVERT TO PROPERTY
    {
        return this.dataFormEx.dbControls["applicantQueryBox"];
    }

    getDialogButton(index = 0)
    {
        if (type(index) == "number" && index >= 0 && index < this.buttonGrpEx.controlExs.length)
        {
            return this.buttonGrpEx.controlExs[index];
        }
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

class PasswordEditor extends Old_DialogEx
{
    constructor(app = new App(), id = "", requireCurrentPassword = false, requireChange = false) // password change when requireCurrentPassword is false will only push through if the user is properly logged in
    {
        super(app.main, id);
        this.app = app;

        var thisPasswordEditor = this;

        this.scrim.classList.add("password-editor");

        this.addFormEx();
        this.formEx.setTitle("Change Password", 3);

        [
            {label:"Current Password", type:"password", colName:"password", table:"All_User", tooltip:"Type your old password"},
            {label:"New Password", type:"password", colName:"new_password", table:"All_User", tooltip:"Type new password"},
            {label:"Retype New Password", type:"password", colName:"retype_new_password", table:"All_User", tooltip:"Retype new password"}
        ].forEach((field, index)=>{
            if (requireCurrentPassword || field.colName != "password")
            {
                this.formEx.addInputEx(field.label, field.type, "", field.tooltip, field.colName, field.table);
            }

            var passwordRetypeFunc = passwordRetypeEvent=>{
                var passMatch = MPASIS_App.isEmpty(this.formEx.dbInputEx["retype_new_password"].getValue()) || this.formEx.dbInputEx["new_password"].getValue() == this.formEx.dbInputEx["retype_new_password"].getValue();
                var allFilled = !MPASIS_App.isEmpty(this.formEx.dbInputEx["new_password"].getValue()) && !MPASIS_App.isEmpty(this.formEx.dbInputEx["retype_new_password"].getValue()) && (!requireCurrentPassword || !MPASIS_App.isEmpty(this.formEx.dbInputEx["password"].getValue()));

                btnGrp.inputExs[0].enable(null, passMatch && allFilled);
                
                if (passMatch)
                {
                    this.formEx.resetStatus();
                }
                else
                {
                    this.formEx.raiseError("New passwords do not match");
                }
            };

            if (field.colName in this.formEx.dbInputEx)
            {
                this.formEx.dbInputEx[field.colName].addEvent("change", passwordRetypeFunc);
                this.formEx.dbInputEx[field.colName].addEvent("keydown", passwordRetypeFunc);
                this.formEx.dbInputEx[field.colName].addEvent("keypress", passwordRetypeFunc);
                this.formEx.dbInputEx[field.colName].addEvent("keyup", passwordRetypeFunc);
            }

        });

        this.formEx.addStatusPane();
        this.formEx.setStatusMsgTimeout(-1);

        var btnGrp = this.formEx.addFormButtonGrp(2);
        btnGrp.container.classList.add("password-editor-buttons");
        this.dialogBox.appendChild(btnGrp.container);

        btnGrp.inputExs[0].setLabelText("Save");
        btnGrp.inputExs[0].setTooltipText("Save new password");
        btnGrp.inputExs[0].disable()
        btnGrp.inputExs[0].addEvent("click", changePasswordEvent=>{
            var passwordDetails = {
                requireCurrentPassword:requireCurrentPassword,
                password:(requireCurrentPassword ? this.formEx.dbInputEx["password"].getValue() : null),
                new_password:this.formEx.dbInputEx["new_password"].getValue(),
                user:this.app.currentUser
            }

            // // DEBUG
            // console.log(passwordDetails);

            // return;
            // // DEBUG

            postData(MPASIS_App.processURL, "a=update&passd=" + packageData(passwordDetails), updatePasswordEvent=>{
                var response;

                if (updatePasswordEvent.target.readyState == 4 && updatePasswordEvent.target.status == 200)
                {
                    response = JSON.parse(updatePasswordEvent.target.responseText);

                    if (response.type == "Error")
                    {
                        new MsgBox(thisPasswordEditor.app.main, response.content, "Close");
                    }
                    else if (response.type == "Debug")
                    {
                        new MsgBox(thisPasswordEditor.app.main, response.content, "Close");
                        console.log(response.content);
                    }
                    else if (response.type == "Success")
                    {
                        new MsgBox(thisPasswordEditor.app.main, response.content, "OK", ()=>{
                            thisPasswordEditor.app.navClick("signout");
                        });
                    }
                }
            });

        });

        btnGrp.inputExs[1].setLabelText("Cancel");
        btnGrp.inputExs[1].setTooltipText("");
        btnGrp.inputExs[1].addEvent("click", changePasswordEvent=>{
            this.close();
        });

        if (requireChange)
        {
            btnGrp.inputExs[1].setInline();
            btnGrp.inputExs[1].hide();
            this.closeBtn.classList.add("hidden");
        }
    }
}

var app = new MPASIS_App(document.getElementById("mpasis"));
