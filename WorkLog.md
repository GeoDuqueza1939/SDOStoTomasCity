# Work Log

## 5/1/2023
Today was a busy day, as I went on tech call starting from the morning to late in the afternoon. The good thing was my wife was there to assist me, although the payout doesn't seem to be enough for what the both of us did. Upon arriving home in the early evening, I updated my work logs and, afterwards, checked on the new MPASIS score sheet. Upon testing using an ADAS I job application test data, I found another bug in the Application of Education criteria for positions with no experience requirement. It was caused by an incorrectly coded maximum value of "ANY" instead of an actual percentage maximum of 100, resulting into a NaN (Not a Number) result for the points. I fixed it and proceeded to add styling to the scoresheet.

## 4/29/2023-4/30/2023
I mostly rested the whole Saturday, occasionally adding some more code, although I made significant progress on Sunday. I was able to notice something in DO 007 s 2023, yet again. In the performance criteria, there was a different rubric to be used depending on whether or not the position requires prior work experience and whether or not the applicant has prior work experience, so I worked to implement it first. Afterwards, I worked in generalizing the total points computation for each criteria. I was able to finish it, although it seems to have an unintended effect of computing the points of each of all the other input fields under the same criteria. I left it as it is, as it might eventually prove useful to the encoders and/or evaluators. If it proves to be a bane instead, I will just have to remove it or adjust it to their liking.

## 4/28/2023
I was able to finish the education score sheet criteria computations. I then started to adapt this code to both the training and work experience criteria. However, I still get stumped with some of the computations, although I am getting close to the original functionality. I have also added yet another functionality wherein an input number control displays the points it contributes once it is updated, although I will have to find a way for this functionality to also be called by each criteria in updating the criteria's total points display.

## 4/27/2023
I finished the score sheet elements data structure in the morning and started to cleanup and convert the data into a JSON object/array. I, then, reinserted the data structure and started adjusting the code. Little by little, it seems to be resembling the old UI. I will have to finish this tomorrow so I could proceed with other features of the system over the weekend, such as the initial evaluation report form, the individual evaluation report form, the ranking, and so on. As these mostly just involve retrieval, these will be easier to implement.

## 4/26/2023
I immediately went to continue working on the data structure that will configure the generalized score sheet. However, organizing the data turned to be very tedious and confusing. After lunch, I started to work using a spreadsheet software to organize all the data. Once I finish this, I would export the spreadsheet into a CSV that will be a lot easier to convert into JSON format using RegEx. I have finished until NEAP facilitatorship subcriteria. I also transferred the score sheet classes into the ExClass.js file so I can still use IntelliSense while coding the classes.

## 4/25/2023
I began work today in finding the logic error that caused the criteria points to miscombine. I seemed to have found it, so I tried correcting it and I also converted the ScoreSheet.getCriteria member function into a static member for easier testing, and I succeeded in fixing it. I also tested it on a minified version of a Teacher I job position structure, and it returned the correct criteria score set. I also found another bug on the education, training, and experience scoring functions, which I have also fixed. In relation to this, I have found that the bug wasn't really a bug in a traditional sense, but was based on a discrepancy in some of the documents provided to me as references for use in the development process. I have already informed the Personnel Section (Miss Cathy and Miss Jessa) about this so they could do some adjustments.

The session keeps on expiring. I couldn't find, yet, where this issue is coming from. It may be arising from the way my browser (MS Edge) keeps on hibernating unused tabs, which might be causing the session to expire like when the browser window is actually closed. I will need to find a way to keep the session alive. I might need to send the User variable/cookie from time to time.

The generalized ScoreSheet isn't finished yet. I am still having difficulty in the data structure that will set the parameters in configuring the scoresheet UI. I hope I can think of something.

## 4/24/2023
Today, I focused on creating the new generalized Score Sheet. I started building the criteria function, minus the update functions. After that, I started to create the ScoreSheet class. I had issues with recreating the UI, as the behavior of the old and the new score sheets could prove to be wildly different, in consideration of the data/criteria handled and the user experience, as well. Also, the points kept on combining differently from expected and always seemed to result in an invalid total (!= 100). I need to find and fix the logic error that causes this.

## 4/22/2023 - 4/23/2023
As a preparating in creating a more generalized Score Sheet, I started to separate the styles from the -Ex classes and transfer them into a CSS file. I thought it would be easy and fast at first, however, it turned out to be a bit tedious and confusing and took longer than I thought it would. I started with the ScrimEx and the DisplayEx styling which were a lot simpler. But the holdup began with the InputEx and FormEx class. I might recode these classes, too, and remake some of them as sibling classes, as some of them have similar methods. In addition, I also added the SDO's logo on the menu and changed the color of the header a bit, whilst, along the way, fixing a CSS bug that caused the header text to get behind the nav button in some view dimensions.

## 4/20/2023
I did less coding today than the previous days. We switch workplaces twice today to give way to the exam and interview of some applicants. In the meantime, I tried to check if the jobs in the database were all categorized correctly. I made a list of positions labeled according to salary grades and categories, unsuccessfully using an OCR'd copy of the DO7s2023 so I typed some of it in the latter part, instead. I did find one position that was miscategorized so I corrected it. In the afternoon, as my cold started to worsen due to the cold aircon air, I started coding a function that will return the criteria set along with the weights depending on a given position's category and salary grade. I plan to create a new generalized ScoreSheet class that extends FormEx, which would use the criteria weights and other related information to generate UI elements on the fly. If I succeed, I might create other FormEx-derived classes based on this concept. Likewise, after moving style out of the -Ex classes, I might also create a new POST function that would rely more on JS Promises.

## 4/19/2023
I worked all day to make the applicant data entry work for updates, too. Around past 3 in the afternoon, I have finally completed ***MPaSIS Mark II (v0.0.2)***. Although MPaSIS did not make it to the orientation and interview of two high-rank administrative positions, I am very positive that this will be a great help in the succeeding positions to be processed. The next things to do:

* [ ] A login/session watcher that will keep the user logged until the user logs out or reaches the timeout in and/or will notify the user of an option to remain signed in
* [ ] Summary of Score Sheet (view or subsection)
* [ ] Comparative Assessment Result (view)
* [ ] A feature to edit own account
* [ ] An option to create a full-pledged account or a temporary account
* [ ] Getting styles out of the classes and into the CSS
* [ ] Making the controls bigger and more round or colorful
* [ ] Reorganizing of the `process.php` code

## 4/18/2023
I was able to fix some bugs early in the morning, when I woke up. The `date range bug`, I found out, was probably caused, in part by an ill-planned search-and-replace operation, which resulted in the function handling it to fail. Likewise, both this bug and the `new eligibility bug` was caused by the InputEx.getValue mishandling some data, which I was able to fix before I went to office.

Once I arrived, I simultaneously worked on both the server configuration and the database-saving feature of the score sheet. The score sheet was designed to update data as opposed to the other forms, which are focused on creating data instead, so I was able to finish the feature more easily. I will need to add this feature into the applicant data form as well.

In the beginning, the server kept on spewing some syntax errors. However, after finding the culprit undeclared PHP variables, I was finally able to make the system work on the server, although some occasional errors were encountered, especially when they tried to enter actual data into the applicant data form and the score sheet. Another issue encountered was the account creation feature, which was affected by the stricter data handling of the InputEx.getValue function, which kept on converting number string into actual numbers. This issue was encountered as a user tried to input a number password that starts with a zero. I fixed this, temporarily by specifying the password to not be automatically converted. I would have to rethink this stricter and more automatic conversion of data.

Another issue encountered was when they were trying to edit an applicant data record, when they immediately saved the data without completing it. I will have to correct this issue by tomorrow to further empower the encoders in handling the applicant data.

I am committing the system code as version 0.0.1. I will be frequently updating the minor revision number, especially as the CRUD system and UX are still very clunky.

## 4/17/2023
Today, I mainly focused on making the system work, at least, for the presentation in the afternoon. I worked out the bugs that I inevitably introduced while trying to add the `degree taken` information. I was able to fix the bug and make the application data form save the data, however, a few more bugs became apparent during the presentation, such as the work experience date range not summing up into a duration and the new eligibility refusing to save. Likewise, due to some confusion, a few fields under `accomplishments` appear to be summing up incorrectly, but it turned out that the score weights being viewed do not match those in effect in the system. The scoresheet, however, is still not saving data yet. I will be working on this at home later today.

## 4/15/2023-4/16/2023
Today, I shall initiate the implementation of the following:

* [x] The `InputEx` type `select`
* [x] The `InputEx` type <code title="This type will use span elements styled as table elements">`table`</code>
* [x] Adding `Degrees` into the applicant data and score sheet forms
* [ ] Reorganizing of the `process.php` code
* [x] Saving/updating of score sheet data into the database
* [ ] Moving the -Ex styles out of the classes and into CSS files

## 4/14/2023
After resting the whole night, I have tried to create another function that computes for the work experience score using the increment, which was put to good use later on. I then recoded some parts of the score sheet UI, redefining some of the procedure in constructing it. I eventually finished the score sheet UI, with its autoscoring feature which I will need to adapt for other positions, as well. <u title="to-do">What's left is to complete the RUD parts of the CRUD system in the score sheet, applicant data, and job data forms.</u> Likewise, <u title="to-do">I will also have to generalize the search feature for many kinds of data/data sets.</u> <u title="to-do">I will also need to optimize and cleanup some of the PHP code, for easier maintenance and debugging later on.</u>

## 4/13/2023
At dawn, I tried to complete most of the scoresheet UI. I continued it in the office. I started to add to the data structure returned when the MPaSIS load application dialog queries for the initial data sets (list of matching applications and positions), though adding more joins proved to be a bit tedious. I was able to create up to 3 joins for the job applications,joining Person with Job_Application, ENUM_Educational_Attainment, and ENUM_Civil_Status. I will continue the joins later on. Likewise, as I tried to fill-in the education and training DisplayEx's in the score sheet, I was able to create two functions that simplified the computation of education and training final scores. I would have created it if there was still enough time. Also, these cold symptoms that worsened a bit in the afternoon slowed my progress significantly. I hope to finish more tomorrow.

## 4/12/2023
Today, I have decided to implement the scoresheet on another page/view different from the applicant data form. I have made a few changes on some of the -Ex classes to accommodate some of the features of the page, although I mostly made a few "hacks" on the code whenever I'm feeling lazy on the design of the code. <u title="to-do">I would probably optimize in a few days</u> after I get to work most of MPASIS. I have also added a new style on the fields that make a textbox display only the bottom border. I also used the DisplayEx class as a sort of frame to group some fields and display elements together. I am taking a bit of inspiration from the looks of Google Forms, as those fields are looking quite nice, each one surrounded by boxes with rounded corners. I have finished almost half of the scoresheet form and I am still thinking of where to put most of the other elements left to implement. Just so I can track my own work, here are some of the things I have changed/added:

* DisplayEx.setVertical() now works even if there is no label
* Added InputEx.setBlankStyle() to implement a textbox with only the bottom border
* Tried adding `Info` and `Debug` scenarios in the InputEx.fillItemsFromServer() method. This helped quite a lot in debugging a few bugs, particularly in misformed/malformed JSON data structures
* InputEx.setWidth() now also works properly for `combo` type
* Added InputEx.setStep() for number and range type
* Added hide(), show(), and isHidden() methods to InputEx
* Recoded the stub function for resetting a FormEx; <u title="to-do">this shall be improved later on when I have more time</u>
* Hard-coded some DialogEx styles and disabled DialogEx-related CSS entries; <u title="to-do">these shall be reinstated and the hard-coded ones removed</u> once I have the time for further code-optimization
* Added DialogEx.gridDisplay() for better layouts
* Renamed Applicant Search to Applicant Score Sheet in the MPaSIS UI

Likewise, the following are to-do:

* <u title="to-do">Setup of the -Ex classes using JSON instead of manually calling the methods to set them up</u>
* <u title="to-do">Reorganization and recoding of -Ex classes for better consistency and better code maintainability</u>
* <u title="to-do">Adding the `select` InputEx type which features a non-editable drop-down list</u>
* <u title="to-do">Adding of search pages in MPaSIS</u>

## 4/11/2023
I have finally finished the applicant data entry form and it is now able to save data to the database. It also now records the user who was signed in when the record was saved to the database. However, I was advised by Ms. Cathy that implementing the scoresheet online is also equally, if not more, important, so I tried to design the scoresheet as an addendum to the applicant data form. This doesn't seem to be working, however, as the scoresheet doesn't really fit into the applicant data form. I merely finished just the headings and a few fields but I am a bit stumped on the form design.

On the side, I also tried to make the Apache server on Ms. Jen's PC work for the MPASIS web app. However, the server kept on showing syntax errors in places where no errors were raised when it MPASIS was hosted on my PC. The XAMPP server seems to have stricter settings for the PHP that makes all these error appear, <u title="to-do">so I might look into it some other time.</u> Mr. Rey said he would bring a computer tomorrow that might help in temporarily hosting the web app.

## 4/10/2023
I have done a lot of code optimization and fixing some minor bugs here and there. Eligibility validation has been completed. The code for adding items to `radio-select` and `checkbox-select`, along with `buttons` and `buttonExs` has been reduced and optimized, introducing and fixing a bug and fixing a bug along the way. The bug in the code for computing the difference between two dates, which causes duration of days to exceed the previous months maximum, has been fixed and invalid dates are now being dealt with, although invalid date processing in the increment computation still needs to be added. The code for extracting the selected position has been recoded for reusability. The only feature left to implement is the Competency validation which will not be implemented as of this time as it will not be used for the time being.

I have also begun implementing history logs, at least for MPaSIS. As such, I further modified both front-end and back-end to always indicate the web app being used. I did break a lot of things in the process, but it can't be helped as the feature is important for auditing actions and checking accountabilities in the system, so I took the time to fix them again.

## 4/9/2023
After workng for the past three-to-four days, I had finally been able to finish refactoring the code and removing most of the page-building code from the MPASIS_App class constructor and placed them on a separate class. I also even further separated the applicant data entry page/form building code into its own class, which I also plan to do to the other forms, as well (I will do so on future updates). After remodularizing the code, I was also able to further improve the messy and very confusing spaghetti-code-like scope nesting that once resulted from all the nested anonymous callback functions and occasionally caused some backlogs in my development work. I would have to remember not to be carried away to much with all the nested callbacks, especially when trying to beat deadlines, as these tend to make development work somewhat more tedious, if not difficult. Likewise, I had also been able to work out the increment-computing feature on the applicant data entry form after introducing a new DisplayEx class which I designed to only display data. I would most probably try to reuse some of these code in the application status views which I would implement in the next few days.

As a side note, I have also decided to reformat my work log, as the narrative format is able to provide more flexibility in recording my work than the time-based log, especially when I need to incorporate details into my records/logs.

## 4/5/2023
* 07:35AM-12:00PM   Forgot to add fields for the position title and the plantilla item number to the applicant data entry form, so added them today. Had trouble filtering data for the available position
* xx:xxXX   Modified paths to `requires` and `includes` to prepare for setup of web server.

## 4/4/2023
* 07:45AM-12:40PM   Resumed reimplementation of Applicant data entry form; started modifying InputEx for multiple options to allow for an extending list.
* 12:55PM-05:00PM   Resumed coding Applicant data entry. Added entending data entry tables for training and work experience. Added extending list for eligibility.

## 4/3/2023
* 08:20AM-12:10PM   Resumed reimplementation of the Job data entry form.
* 12:40PM-04:55PM   Experience and fixed issues with single quotes whenever string data with single quotes is packaged as JSON in transit to the server prior to storing/updating into the database. Fixed by replacing each single quote with 2 single quotes after packaging into JSON. SHOULD OBSERVE FOR ANY IMPACTS TO DATA. Also started reimplementing Applicant Data Entry form

## 4/2/2023
* xx:xxXX   Finished most of the implements of InputEx, FormEx, and DialogEx classes after a while. Started to test their capabilities by reimplementing Other Accounts interface. Also considered reimplementing Job Data Entry form.

## 4/1/2023
* xx:xxXX   Tried to optimize Job Data Entry form. Because of spaghetti code, optimization was a bit difficult. I decided to reimplement the InputEx and DialogEx classes while also creating FormEx class as an intermediary between the two classes. The goal is to smoothen future coding processes.

## 3/31/2023
* 07:00AM-12:05PM   Resumed coding of Job Data Entry form
* 12:40PM-03:15PM   Finished Job Data Entry Form interface and CRUD (will optimize or reimplement at home, if possible)
* 02:15PM-05:02PM   Started coding Applicant Data Entry form.

## 3/30/2023
* 07:24AM-08:35AM   Resumed construction of additional database tables.
* 08:35AM-10:03AM   Input salary tables (2022-2023) into database; employed OCR on downloaded SSL tables and reformatted extracted text as CSV for direct upload to database.
* 10:03AM-11:07AM   Started coding Job Data Entry form
* 11:40PM-05:20PM   Resumed coding of Job Data Entry form


## 3/29/2023
* 07:30AM-12:05PM   Added a some elements to dashboard and other account views.
* 12:30PM-05:15PM   Finished Add Account function in Other Accounts view; MPASIS is now ready to accept users!
* xx:xxXX   Designed and constructed additional database tables for storing applicant and position information.

## 3/28/2023
* 07:30AM-10:10AM   Review of MPASIS specifications; added wireframe prototype; started coding of PHP backend (MPASIS landing page).
* 10:10AM-11:40AM   Started construction/restructuring of database; added some MPASIS code
* 11:40AM-12:05PM   Conference with Ma'am Cathy.
* 12:40PM-02:30PM   Resumed coding.
* 02:30PM-05:17PM   Attended meeting with HRMPSB.
* xx:xxXX    Implemented nav menus according to ISCreAMS design.

## 3/27/2023
* 09:00AM-12:50PM   Resumed creation of OPMS pages. Started working on (I/O)PCRF.
* 01:20PM-03:30PM   Attended meeting on HRMPSB; received some info on the requested system; possible expedited development time would be at least 5 to 7 days, but could lengthen a bit due to the need to review the job qualifications of all 70+ positions.
* 03:30PM-   Started working on specifications for the HRMPSB system.

## 3/25/2023 (Saturday)
* xx:xxXX   Cleaned up/reorganized directory structure and repaired styling impacted.
* xx:xxXX   Started the ISCreAMS project that could aid in further system development.

## 3/24/2023
* 07:48AM-10:50AM   Resumed generalizing of layouts and styles
* 10:50AM-12:15PM   Started coding a few more OPMS pages.
* 12:58PM-04:50PM   Resumed coding OPMS pages and styling; also added other placeholder OPMS pages

## 3/23/2023
* 07:55AM-11:45AM   Resumed designing sign-in page procedure; started setting up web app landing pages.
* 12:40PM-02:10PM   Resumed coding SERGS landing page. Restyling is 'TO DO'
* 02:10PM-04:49PM   Renamed ROMaS to OPMS for better future adaptability. Started defining general layouts and styling for both SeRGS and OPMS.

## 3/22/2023
* 07:30AM-08:05AM   Started reviewing PHP classes code for optimization
* 08:05AM-10:00AM   Poster-making activity
* 10:25AM-11:55AM   Started (re)designing data interchange formats and protocols between and among client, server, and database
* 12:40PM-05:21PM   Set up actual sign-in page procedure


## 3/21/2023
* 08:15AM-12:10PM   Resumed coding database utility classes; finished the following classes: Location, Address; also separated classes and class stubs into different files for better manageability
* 01:05PM-  Resumed coding database utility classes; finished the following classes: Institution, Workplace

## 3/20/2023
* 08:20AM   Started reviewing ERD for ROMaS and redesigning the database.
* 10:14AM   Started modifying database based on design.
* 11:55AM   Took lunch
* 12:45PM   Experienced issue with monitor (power cable)
* 12:50PM   Resumed database design and construction.
* 01:38PM   Finished first group of database tables for ROMaS; Resumed coding PHP classes for SeRGS.
* 03:50PM   Encountered another issue with monitor power cable
* 04:55PM   Completed Location class; Ongoing construction of Address class logic; Committed to repository

## 3/17/2023
* 07:45AM   Started reviewing code of Person and Employee classes.
* 09:00AM   Sent email to Dr. Neil informing about the systems development progress.
* 09:30AM   Resumed coding.
* 10:30AM   Issues were encountered with current implementation of Person and Employee PHP classes; started reimplementation.
* 12:30PM   Finished reimplementation of Person and Employee PHP classes; I PROMISE TO NEVER TOUCH ANYTHING THAT STILL WORKS; Took my lunch.
* 01:15PM   Resumed coding of PHP classes.
* 02:10PM   Finished implementation of User class.
* 02:20PM   Started/resumed creation of RPMS related database tables
* 04:45PM   Committed code and file changes to repository.


## 3/16/2023
* 07:55AM   Resumed coding of utility classes for SeRGS/ROMaS backend
* 12:10PM   Lunch
* 12:40PM   Resumed coding
* 04:50PM   Stopped coding; encountered bugs while testing Person and Employee classes.

## 3/15/2023
* 07:52AM   Started reviewing database structure; encountered and fixed issues with switching foreign key checks setting.
* 12:10PM   Took lunch.
* 12:50PM   Resumed coding.
* 02:10PM   Completed DatabaseConnection class. Started creating other PHP classes for accessing and storing specific data sets in the database.
* 05:00PM   Committed remaining unstaged changes to repository.

## 3/14/2023
* 08:00AM   Continued testing and restructuring database for both SeRGS and ROMaS and coding for the backend
* 12:15PM   Went for lunch
* 12:45PM   Continuing backend (PHP/MySQL) coding
* 04:50PM   Committed some backend code (DatabaseConnection class and database test page)

## 3/13/2023
* 07:35AM   Flag Ceremony
* 08:45AM   Had issues with monitor/computer hardware; fixed at around 9:00AM
* 09:03AM   Browsed aroung SDO Sto. Tomas City Google Sites page and FB page to view some info, page styling, and any downloadable forms related to the developing systems
* 09:20AM   Resumed readings for ROnAS.
* 10:30AM   Commenced construction of Wireframe Prototypes
* 12:00PM   Put ROnAS wireframe construction; went for lunch
* 01:00PM   Resumed wireframe construction. Renamed ROnAS to ROMaS to better reflect the nature of the system. Added link to ROMaS wireframe prototype.
* 01:55PM   Started creating a tester page with a query tester for use in testing the database.
* 04:55PM   Committed changes

## 3/10/2023
* 07:30AM   Renamed remote repository to git@github.com:GeoDuqueza1939/SDOStoTomasCity.git and tried fixing the links and the repository authorization and references.
* 08:50AM   Added placeholder files for prototype pages of ROnAS. Continued readings of documents and other materials related to the proposed system.
* 11:30AM   Took lunch
* 12:30PM   Resumed readings.
* 03:20PM   Started coding prototype PHP page for SeRGS
* 05:00PM   Committed and pushed updated SeRGS files

## 3/9/2023
* 07:30AM   Fixed manual filing of documents.
* 08:00AM   Started viewing and analyzing the RPMS documents sent.
* 10:50AM   Had to leave for City Hall for some HR-related matters
* 12:15PM   Resumed reading about the PPST in teacherph.com (deped.gov.ph went down earlier for maintenance)
* 12:40PM   Created User Stories and Scenarios for ROnAS.
* 01:15PM   Joined National Earthquake Drill while continuing with the user stories.
* 03:50PM   Puts scenarios formulation for the ROnAS on hold and proceeds to continue with the database construction for SeRGS.
* 04:58PM   Finished initial database structure.

## 3/8/2023
* xx:xxXM   Installed HeidiSQL and dBeaver CE to replace the buggy MySQL Workbench CE; tested connection and apps by creating database tables.
* 08:00AM   Deleted the test tables and recreated them with more standard procedures.
* 09:00AM   Conferred with Sir Ivan regarding control and management of student/school data in relation to the release of deworming medicine.
* 09:30AM   Conferred with Dr. Rose regarding RPMS online system.
* 10:30AM   Started reorganizing notes.
* 12:00PM   Took my lunch
* 01:00PM   Resumed database construction.
* 04:00PM   Put database construction for SERGS on hold. Started to do proceed with some documentation and priotization activities.

## 3/7/2023 (Non-working Holiday)
* xx:xxXM   Installed and configured Lubuntu desktop environment, Apache2, MariaDB, and MySQL Workbench CE; had trouble with but was able to fix issues with symlinking project files into Apache web directory.

## 3/6/2023
* xx:xxXM   Installed my work apps and utilities: MS Edge, Google Chrome, VS Code, Git, etc.
* 08:00AM   Started creating test data.
* 05:00PM   Committed and pushed test data and corresponding styles; also updated some JS classes.

## 3/5/2023 (Sunday)
* xx:xxXM   Started installing Ubuntu 22.04 on my notebook PC.

## 3/4/2023 (Saturday)
* xx:xxXM   Restructured file data on my notebook PC to allow for proper defragmentation of all files.
* xx:xxXM   Finished defragmentation of files; since OS partition is still unfeasible using Windows Disk Management, proceeded to repartition using utilities from Hiren's Boot CD PE.

## 3/3/2023
* 07:50AM   Resumed UML diagram construction so as to aide in further front-end design, development, and testing.
* 04:58PM   Committed the updated JS UML diagram and the updated Technical Manual, along with logo, a new classes.js script, and a test.js script meant to hold test data.

## 3/2/2023
* 07:30AM   Started coding an alternative web app page using both Bootstrap ang JQuery.
* 05:00PM   Committed and pushed new sergs.html to repository; Side-bar navigation partially implemented

## 3/1/2023
* 07:51AM	Resumed coding. Decided to abandon old code. Will attempt to style bootstrap first.
* 09:00AM   Fire/Earthquake Drill
* 09:18AM	Resumed coding
* 04:54PM   Side-panel mostly finished. Committed and Pushed to online repository. (page was later found to be not responsive enough in mobile)

## 2/28/2023
* 08:00AM	Submitted a copy of the User Stories and the user-system interaction flowchart to Ma'am Catalina
* 08:25AM	Resumed coding (had to restart to refresh my system and cure its lag)
* 04:50PM	Put coding on hold to determine whether to rewrite the code without using BootStrap or pursue it as it is.

## 2/27/2023
* 09:00AM	Conferred with Ma'am Cath about comments/feedbacks regarding the User stories; Put on old after a few minutes.
* 09:30AM	Started coding login page (HTML/CSS)
* 10:20AM	Went for early lunch/mini-buffet for birthday celebrants
* 10:52AM	Resumed coding
* 01:00PM	Continued conference about system specifications/requirements; also consolidated and filed notes after conference.
* 02:15PM	Resumed coding
* 02:40PM	The file login.html has been tentatively finished. Improvements shall be effected later. sergs.html has been added to design app styles.

## 2/23/2023
* 07:37AM	Exported and committed/pushed an updated wireframe prototype, as I forgot to re-export it yesterday.
* 07:58AM	Had to stop for HR/Landbank concerns
* 11:32AM	Returned to office
* 02:02PM	Finished adding content to Wireframe Prototype (put Wireframe creation ON-HOLD to wait for further inputs)
* 02:25PM	Committed/pushed updated Wireframe Prototype
* 02:35PM	Started creating ERD and UML diagrams
* 04:18PM	Added a Technical Manual for the system.

## 2/22/2023
* 12:45PM	Finished creating workflow diagrams in Dia (work interrupted for around an hour due to HR concerns)
* 12:55PM	Started constructing wireframe prototypes for the pages
* 04:57PM	Committed a wireframe prototype and set it up to be viewable on the web

## 2/21/2023
* 08:30AM	Conferred with Miss Cathy regarding the processing of Service Records and the proposed features for the Service Record Generation System.
* 10:00AM	Started creating User Stories-Set 1
* 12:15PM	Finished User Stories-Set 1; To be shown to Ma'am Cath
* 01:03PM	Started creating workflow diagram in Dia (had to install Dia first; actual start time is 1:33PM)
