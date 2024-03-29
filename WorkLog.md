# Work Log

## 8/04/2023
TO DO:
* [ ] [SeRGS] Recreate the JS SDP class as a non-static SecureDataPackager class (for front-end)
* [x] [SeRGS] Create the PHP SecureDataPackager class (for back-end)
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Today, I finished the PHP SDP class. I will have to recreate this later on in the front-end to have seamless handshake and data interchange.

## 8/03/2023
TO DO:
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

EUREKA! After a few days and another whole morning of fiddling around, I've finally made the JSBN encryption and PHPSECLIB decryption work together! It would be better if I could do the same with OpenSSL PHP extensions, but this will, at least, do for now. I proceeded to remove most of the OpenSSL statements in the test procedure. Tomorrow, I will be busy in integrating the encryption-decryption procedures to the PHP SDP class, which I shall turn into a non-static class.

## 8/02/2023
TO DO:
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

I felt really ill yesterday so I had to request some time off. I resumed my work today in trying to implement the JSBN-PHPSECLIB handshake.


## 7/31/2023
TO DO:
* [x] Transition to Windows 11 and XAMPP from Ubuntu Linux and Apache2/PHP/MariaDB
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Not much happened today. But I did try setting up XAMPP in Windows 11 to get things working again.

## 7/26/2023
TO DO:
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

The pacing of work is slow as these past days because of dealing with encryption. I will have to finish something before I tender my (temporary) resignation. There is also the deal with (re)installing Windows as my laptop's main OS.

## 7/25/2023
TO DO:
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [x] [SeRGS] Integrate a PHP RSA library/install a PHP RSA plugin
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

I resumed my work to make both ends (PHP and JS) meet in encryption. However, I've already spent the greater part of the day trying to find a way to make them work. At first, I tried to make the client generate an actual PEM-format key, but, to my dismay, the JS library that I found the most suitable for my purposes just can't do it. It can encrypt and decrypt, but all it can generate are numeric data used in the actual generation of the keys. I did consider making my own implementation (and I have already began this a few years back though I was unable to finish due to other priorities), but that would be too time consuming. The next option was making the PHP backend generate the key using the modulus and the exponents produced by the JS frontend, but I couldn't find any native implementation, although I did find a library (phpseclib) which could do it, so I think I'll go with that. However, the JSBN library is unable to encrypt strings or data that exceed the set bit length of the key, so I will still need to add code that will split the data into chunks which will be operable enough for JSBN. Time is running out. I'll need to continue this again, tomorrow.

## 7/24/2023
TO DO:
* [ ] [SeRGS] Add JS code that creates and encrypts data using RSA key pairs
* [ ] [SeRGS] Integrate a PHP RSA library/install a PHP RSA plugin
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

I found a few built-in functions in PHP which I could use right away for the encryption. However, setting up the PHP-to-JS encryption handshake proved to be very tedious. I spent most of the work day trying to match up the data being spewed by both ends, only to fail in setting up the keys, not to mention the actual decryption. Eventually, upon realizing that the JSBN library uses string-type hexadecimal data in generating or using encryption keys, I tried converting the PHP RSA data into hexadecimal strings, after which it is used as inputs in generating and using encryption in the client side, and I it finally did the trick. However, my work day is almost up before I realized it. I will have to resume this tomorrow. Hopefully, I would be more productive.

## 7/21/2023
TO DO:
* [x] [SeRGS] Integrate a JavaScript RSA library (temporary only: to implement my own, if I have enough time)
* [ ] [SeRGS] Integrate a PHP RSA library/install a PHP RSA plugin
* [ ] [SeRGS] Secure all data exchange
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Okay, the plan was for the server host to send an autogenerated public key to the client browser. The client browser, then, generates a PKI pair and encrypts its private key using the server's public key to generate a shared key, which is then sent back to the server. The shared key is then decrypted to extract the client's private key, after which the server then sends the web pages applicable to the client's request. As such, I need to have a PKI library for JavaScript and another for PHP. Let's focus first on the client side. I tried searching for both suitable and easy-to-use JS libraries for PKI. After spending a big part of the morning doing just that, I stumbled upon a few choices, the most notable of which were JSBN and JSEncrypt, the latter of which was a wrapper for the former. I decided to go for JSBN. At first, I was confused on how to use it and spent a big chunk of the afternoon trying to make it work, especially as it kept on spewing an undefined variable exception when trying to generate a key pair. Then, after viewing the demo's source code, I discovered the issue: I was using a number-typed exponent argument where a string-typed exponent argument is needed. After fixing it, it worked nicely. However, I might need to continue this next week, as time had ran short again.

## 7/20/2023
TO DO:
* [x] [SeRGS] Adapt UserEditor class for SeRGS
* [x] [SeRGS] Adapt PasswordEditor class for SeRGS
* [x] [SeRGS] Add Account page (based on existing MPaSIS design)
* [x] [SeRGS] Add My Account page (based on existing MPaSIS design)
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

First, I added an account management landing page with links to My Account and Other Accounts. Afterwards, I worked on the My Account page and added two buttons that was supposed to open dialog boxes for adding/editing users and modifying passwords. I went back to MPaSIS to check on the UserEditor and PasswordEditor classes and adapt them for use in SeRGS. However, as these were derived from the older DialogEx class from my ExClass framework, I still had to convert some of the references and recode a few parts so it could work when derived from the newer DialogEx class of my UIEx framework instead. The dialogs now look a lot better, although I will need to adapt and modify some of the data handling procedures I used for user management in MPaSIS. That made me think a lot about securty this afternoon, as I realized that, since it might still be a long time before we had SSL, I would, at least need to implement some type of end-to-end encryption. I will have to look into this tomorrow, instead, as we're on party mode right now for a birthday surprise prepared for the Superintendent.

## 7/19/2023
TO DO:
* [x] [SeRGS] Fix print layout for multiple-page SR
* [x] [SeRGS] Enable `Print` views for the SR Viewers
* [ ] [SeRGS] Add My Account page (based on existing MPaSIS design)
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

After a very long while and while we were transferring our office to another location, I finally found a way to render fixed headers and footers without overlapping text. It is not that perfect, but it would work for the meantime. To while the remaining time of the day, I also put print buttons on the SR Viewer pages, so we SRs can now be printed even without loading them for editing.

## 7/18/2023
TO DO:
* [x] [SeRGS] Enable `Print` views for the SR Editor
* [ ] [SeRGS] Add My Account page (based on existing MPaSIS design)
* [ ] [SeRGS] Add Other Accounts page (based on existing MPaSIS design)
* [ ] [SeRGS] Add success and fail message whenever saving/updating service record
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

I could start clean on my SeRGS tasks today. That's why I decided to endeavor to add Print views for the SR Editor. I didn't really encounter much issues in building the print page, although I did hit a stump when trying to print a multi-page SR, in which fixed headers and footers overlap with text. I tried the previous tricks that I knew back when I was still converting books into ebooks and when I used to generate PDF test papers from HTML code, but still with no luck. I will have to resume this tomorrow. In the meanwhile, I might need to do some readings on web standards and do a few more web searches.

## 7/17/2023
TO DO:
* [x] [SeRGS] Add a function that creates a list of salary steps valid for a selected designation/position (to be used for SR Editor's salary column)
* [x] [SeRGS] Create a function for retrieving a static list of service records for a particular person
* [x] [SeRGS] Design My Service Record page
* [x] [SeRGS] Design Other Service Record
* [x] [SeRGS] Convert all static SeRGS_App members into non-static members
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

I was progressing quite smoothly today, despite some office events (e.g., Flag Ceremony, welcoming of new appointees, etc.) By using the SR Editor as a guide, I redesigned the `My Service Record` page and built the `Other Service Record` page. I have also renamed the `Other Service Record` to `View Service Record` as it is more like a viewer for service records owned by others. I might integrate the two pages later on, if time allows. Likewise, defining a function which retrieves/filters the employees through a selected personId really helped in simplifying things more. I have also changed the privacy of most SeRGS_App PHP members. I also dealt with a backlog related to resetting the salary field once related fields were activated and then goes out of focus. Tomorrow, I will have to start the printing feature so the app will at least have a backoffice use.

## 7/14/2023
TO DO:
* [x] Run the following SQL statements on the hosted web app
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD date_rangeId BIGINT UNSIGNED NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD CONSTRAINT Emp_Appointment_FK_2 FOREIGN KEY (date_rangeId) REFERENCES SDOStoTomas.Date_Range(date_rangeId) ON DELETE RESTRICT ON UPDATE CASCADE;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment COMMENT='Appointments may include both CSC Appointments and Job Order Appointments';
    * [x] ALTER TABLE SDOStoTomas.Emp_Term_of_Service DROP FOREIGN KEY Emp_Term_of_Service_FK_4;
    * [x] ALTER TABLE SDOStoTomas.Emp_Term_of_Service DROP COLUMN employeeId;
    * [x] ALTER TABLE SDOStoTomas.Emp_Term_of_Service MODIFY COLUMN salary float unsigned DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Term_of_Service MODIFY COLUMN branch varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'NM' NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD personId BIGINT UNSIGNED NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE emp_appointmentId emp_appointmentId bigint(20) unsigned auto_increment NOT NULL AFTER personId;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD CONSTRAINT Emp_Appointment_FK_3 FOREIGN KEY (personId) REFERENCES SDOStoTomas.Person(personId) ON DELETE CASCADE ON UPDATE CASCADE;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE designation designation varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL AFTER emp_appointmentId;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE personId personId bigint(20) unsigned NOT NULL AFTER designation;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE employeeId employeeId varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL AFTER personId;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE appointment_number appointment_number varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL NULL AFTER employeeId;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE plantilla_item_number plantilla_item_number varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL NULL AFTER appointment_number;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE date_rangeId date_rangeId bigint(20) unsigned NOT NULL AFTER plantilla_item_number;
* [x] [SeRGS] Restructure Emp_Appointment and Emp_Term_of_Service tables for better storage of related data
* [ ] [SeRGS] Add a function that creates a list of salary steps valid for a selected designation/position (to be used for SR Editor's salary column)
* [x] [SeRGS] Create code procedures for submitting service record data
* [x] [SeRGS] Create code procedures for loading service record data using employee ID
* [x] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Today's a Friday and I was supposed to have something to offer for testing today. This proved to be quite a challenge, as it was only now that I could focus better, for there were fewer people and office chatter this morning. I resumed my work on the PHP-to-DB backend code. I kept on changing the code as if I'm getting nowhere. Midway, I turned my attention to the hosted system. I tried to run the queued SQL statements. However, I did run into a problem. I could access the hosted page, but I couldn't log in. Next, I tried logging in to MariaDB on the hosted system, but I could not connect successfully. It turned out that the DB server stack has crashed, so restarting it fixed it. After executing the SQL statements, I continued working on the backend. Unfortunately, another distraction came in the form of a meeting. At first, I couldn't really focus, as the attendees were quite a noisy bunch and there were too many of them. However, once they were finished, although there were still a lot of chatter left, I was finally able to continue working quietly. At around past 4PM, I finally finished the SR Editor, but the AO5 and the HRMO were both occupied at the moment. I guess, I will have to show them this next week. I continued testing it and updating the hosted system as well while waiting for end-of-shift.

## 7/13/2023
TO DO:
* [x] [SeRGS] Simplify some of the SR Editor backend code; modularize to functions, if possible
* [x] [SeRGS] Add row selection outline styling
* [ ] [SeRGS] Add a function that creates a list of salary steps valid for a selected designation/position (to be used for SR Editor's salary column)
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Today was one rainy day. I almost failed to arrive at the office on time, again. Also, an officemate had her birthday today and the continuous flow off food and office chatter was a mixture of both welcome and a bit unhealthy distraction (for me, at least), while the ITO was on leave so I had to attend to some tech support-like duties all throughout the day, so I could only do as much as I could. Still, I tried my best to continue with my work. Creating the PHP-to-DB code was a bit tedious. Fortunately, I had the ERD guide that I made yesterday which modifies the current DB structure for the Emp_Term_of_Service and Emp_Appointment tables. Then, I proceeded to create functions out of the PHP-to-DB code. This seems to be taking a long while, as I had to deeply analyze both the relationships of the data (again) and anticipate the effects/impacts of modifying any data submitted. As such, I tried to implement PHP functions that will fetch and update date ranges and appointments. I might need to continue this tomorrow, as my head hurts to much, already. I also added some styling to the selected SR table row, so the user will have no trouble in determining the currently selected row, especially when deleting it.

## 7/12/2023
TO DO:
* [x] [SeRGS] Add status indicators for SR Editor status pane messages
* [ ] [SeRGS] Simplify some of the SR Editor backend code; modularize to functions, if possible
* [ ] [SeRGS] Add a function that creates a list of salary steps valid for a selected designation/position (to be used for SR Editor's salary column)
* [x] [SeRGS] Create a new data structure that will represent the appointment related to each term of service
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

The status messages from the DB code looked somewhat bland, so I worked to add icons to them. I might need to do the same for the table-based code, later on. Afterwards, I started to work on the DB backend code. However, as the office chatter continued today, I couldn't really concentrate with all the distractions around. As simplifying te DB backend code proved to be a bit of a hassle with the current structure of the both the database and the submitted data, I created a new term of service and appointment DB structure that can accommodate some changes and improve data relationships better.

About the system unit that I intended to bring to the office, I've wanted to install drivers to it for the USB WiFi dongle, as I practiced installing it using may notebook. However, although I was able to resolve the over-heating issue last night, it seems that its former symptoms of its board being short-circuited has returned. After a while, I gave it up. I would probably be better off creating another test system using another spare system unit.

## 7/11/2023
TO DO:
* [x] [SeRGS] Transfer server messages passed via JS message box into the status pane
* [x] [SeRGS] Improve error and warning status message display
    * [x] [SeRGS] Add color to SR Editor status pane
* [x] [SeRGS] Added PHP-based validation of Service dates
* [x] [SeRGS] Added PHP-based validation of missing values in the designation, status, salary, and station fields
* [x] [SeRGS] Add code to prevent DB manipulation when SR data is incomplete or invalid
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

When I looked out the office window this morning, I realized that another event will be held again today. I guess I'm off for another noisy day, so I tried starting early. I resumed my work on the PHP-to-JS message passing, but soon decided that it will be easier if I did it PHP-to-HTML instead, so I moved the DB-modifying code down to the status pane code area. I also added data validation via PHP on some of the SR table columns and accumulated the related error messages and warnings for display later in the status pane, as well. As the messages are now displayed in the SR Editor status pane, I then added color styling and differentiating the various statuses I could think off: information, success, failure, wait, warning, exception, error, and debug. I also realized that not all submissions should be sent to the DB right away, so I added a code "gate" that will only allow DB processing when there were no errors encountered during validation.

By the way, I wanted to bring the system unit to office this morning but I couldn't make the USB WiFi dongle to work. I will need to configure it once I got home.

## 7/10/2023
TO DO:
* [x] Run the following SQL statements on the hosted web app
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD employeeId varchar(30) NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment CHANGE employeeId employeeId varchar(30) NULL AFTER plantilla_item_number;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD CONSTRAINT Emp_Appointment_FK_1 FOREIGN KEY (employeeId) REFERENCES SDOStoTomas.Employee(employeeId) ON DELETE CASCADE ON UPDATE CASCADE;
    * [x] ALTER TABLE SDOStoTomas.`Position` MODIFY COLUMN plantilla_item_number varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Employee MODIFY COLUMN employeeId varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.PM_Plan MODIFY COLUMN rateeId varchar(50)  NOT NULL COMMENT 'employeeId';
    * [x] ALTER TABLE SDOStoTomas.PM_Plan MODIFY COLUMN raterId varchar(50)  DEFAULT NULL NULL COMMENT 'employeeId';
    * [x] ALTER TABLE SDOStoTomas.PM_Plan MODIFY COLUMN approverId varchar(50)  DEFAULT NULL NULL COMMENT 'employeeId';
    * [x] ALTER TABLE SDOStoTomas.MPASIS_Role MODIFY COLUMN employeeId varchar(50)  DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.`User` MODIFY COLUMN employeeId varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.`Leave` MODIFY COLUMN employeeId varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Term_of_Service MODIFY COLUMN employeeId varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment MODIFY COLUMN employeeId varchar(50)  DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.Job_Application MODIFY COLUMN plantilla_item_number_applied varchar(50)  DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.Required_Eligibility MODIFY COLUMN plantilla_item_number varchar(50)  NOT NULL;
    * [x] ALTER TABLE SDOStoTomas.MPASIS_History MODIFY COLUMN plantilla_item_number varchar(50)  DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment MODIFY COLUMN plantilla_item_number varchar(50)  DEFAULT NULL NULL;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment DROP FOREIGN KEY Emp_Appointment_FK;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment ADD CONSTRAINT Emp_Appointment_FK FOREIGN KEY (plantilla_item_number) REFERENCES SDOStoTomas.`Position`(plantilla_item_number) ON DELETE SET NULL ON UPDATE CASCADE;
    * [x] ALTER TABLE SDOStoTomas.Emp_Appointment MODIFY COLUMN employeeId varchar(50)  NOT NULL;
* [x] Fix error and warning settings on the PHP server on my development machine
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

Inpired by the configuration I did on the system I intended to use as a test server, I started the day by tinkering on the Apache configuration on my notebook so it would display errors and warnings, much like how Apache does on the hosted server. I eventually succeeded and proceeded to debug some of the code on my notebook. Afterwards, I resumed my work on the back-end code for the SR Editor and tried to add some data validation code. However, due to some background noise due to several year-end events held, I couldn't concentrate very much on the SR Editor. I, then, focused my attention on the focused server and started to run some of the queued SQL statements after some DB restructuring last week. Afterwards, as I felt the PHP warnings and error messages were insufficient in debugging, I tried to create better PHP-to-JS message passing procedures, but in vain. I hope the events and the endless office chatter would end soon enough, or I wouldn't be able to finish anything this week.

## 7/9/2023
Starting last night until today, I built a test Ubuntu Server system configured with Apache, PHP, MariaDB, and VSFTPD. I used a system unit with a faulty built-in video display adapter. After installing Ubuntu Server on the HDD using another similar system and verifying that the system works without a keyboard, I went on to try my luck in enabling the system's Keyboardless Operation. I spent almost the whole time from midnight to daybreak with no luck whatsoever, not until I found a document online that shows how to modify some (BIOS) system settings even while the OS is online. After doing away with the Keyboarless operation issue, I went on to deal with issues on the server stacks. I initially installed MySQL along with Apache, PHP, and PhpMyAdmin. However, try as I may, I couldn't get the PhpMyAdmin to work. In the early afternoon, I tried to remove all the server stacks I installed. I had some issues with uninstallation, as the PhpMyAdmin kept on blocking the uninstall process. After several reboots, I tried to reconfigure PhpMyAdmin again before finally uninstalling it successfully. After removing all other unnecessary packages and performing some cleanup, I tried to install the server stacks once again, switching MySQL for MariaDB. After the installation and a few configuration steps, I was finally able to make it work. I then tried testing sending an email using PHP mail(). Eventually, I was able to send an email after installing the sendmail package, although there was still no way to tell if the email was actually transmitted as I am only using localhost for this. Afterwards, I went on to configure VSFTPD and was eventually able to enable and test TLS encryption on FTP connections.

At first, I intended to bring the configured system unit to the office tomorrow (Monday) to serve as an auxilliary/additional testing machine. However, I might still need to do a few more configurations and I also needed to modify my CRUD systems for self-reconfiguration so these will be portable enough when transferred from server to server. I hope I can finish all these while preparing the encoding and printing feature of the SeRGS for testing this coming week and the certification/approval feature on the succeeding week.

## 7/8/2023
TO DO:
* [x] [SeRGS] Reposition the `Revert/Refresh` button higher in the page
* [x] [SeRGS] Duplicate the SR Editor control buttons above the SR table
* [x] [SeRGS] Decorate the SR Editor control buttons with functional color
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] Make `/web/root/secure` folder more secure

It is a Saturday, but I decided to do some coding, anyway. I duplicated the the SR editor control buttons and place the duplicate above the table to make these button more reachable. I also added some background color to these buttons, which show up whenever they are enabled by the users actions. I also did some modifications to the database, which I may need to reimplement on the hosted web app, as well. I have added these SQL statements to the TO DO list for Monday, so I wont forget. This how I begin my plans of making the system adaptable to future updates.

## 7/7/2023
TO DO:
* [x] [SeRGS] Add SR Editor Salary column dropdown behavior
* [x] [SeRGS] Add SR Editor LWOP column dropdown behavior
* [x] [SeRGS] Change SR Editor Designation column dropdown behavior from select box to combo box.
* [x] [SeRGS] Modify the `Add Record` and `Delete Record` button labels into `+` and `-`, respectively
* [x] [SeRGS] Modify the `Revert/Refresh` button label into label into either a refresh, revert, or recycle icon
* [ ] [SeRGS] Reposition the `Revert/Refresh` button higher in the page
* [x] [SeRGS] Modify the `Update/Save` button label into a floppy disk icon
* [x] [SeRGS] Add a `Print` button with a printer icon label
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [x] Update hosted web app code and DB for testing
* [ ] Make `/web/root/secure` folder more secure

Coding was a bit slow today. Burnout must be catching up to me again. I tried my best to modfy or finish the drop down behavior of some of the columns. I made salary column more flexible so that it can receive other values when the salary is not found in the suggested list. I am also planned to implement this on the Designation column, although I might need more time to polish this change later on. To cover more ground, I focused my attention on the buttons, trying to beutify them a bit by changing those word into icons and adding tooltips, instead. I also added print button, although I would need to postpone adding more code to it until this weekend or Monday, whenever I've got the time.

## 7/6/2023
TO DO:
* [x] [SeRGS] Add SR Editor Designation column dropdown behavior
* [x] [SeRGS] Add SR Editor Status column dropdown behavior
* [ ] [SeRGS] Add SR Editor Salary column dropdown behavior
* [x] [SeRGS] Make the `To` date say `present` when left blank or with invalid data if the `From` column has a valid date
* [x] [SeRGS] Repair Dashboard button redirect behavior
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [x] Update hosted web app code and DB for testing
* [ ] Make `/web/root/secure` folder more secure

As I was anticipating some system tests today, I tried my best to tie loose ends and prepare the hosted web app for testing early on. Afterwards, I resumed modifying the SR table behavior. I added dropdowns for some columns. For the salary column, I had to do some filtering using the value of the designation column to offer the user a list of salary steps available for the specific designation. I also modified the date-to column behavior to display `present` when left blank. Likewise, I also found and fixed a bug in the Dashboard buttons which caused them to fail to redirect to other pages. It turned out that I have misplaced the code for these redirect buttons, placing them after a lot of HTML tags instead of before any HTML tag.

## 7/5/2023
TO DO:
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [x] [SeRGS] Transfer JS code from the sergsApp.php and the sergs.js files into the SeRGS_App class
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [x] Add cell navigation as a built-in TableEx class feature
* [ ] Make `/web/root/secure` folder more secure
* [x] [MPaSIS] Repair Add Eligibility dialog layout in the Applicant Data Entry
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [x] [MPaSIS] Adapt Add User dialog to the newer DialogEx parent class
* [x] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [x] [MPaSIS] Add Honor Graduate to eligibilities

Today was quite peculiar. The superintendent called for me early today and I arrived in his office while he was speaking wit two of the section heads. They must have called me to follow-up on the CRUD systems I am building. However, as the minutes passed, the superintendent kept on calling for a few more section heads and even the assistant superintendent, so I've never felt out-of-place before. He just mentioned that I focus on the SeRGS system first while the MPaSIS ranking system was already mentioned to be already available for some general testing and that the OPMS could wait. Afterwards, I had a little conversation with the IT Officer, who was strangely forgotten in the on-the-fly meeting, regarding the superintendent's possible intent to have the SeRGS system up and running ASAP, so he immediately went and eventually secured a priority for another system unit that could be used as a temporary server while the actual server is still unavailable. I guess I will have to step up my efforts into finishing something ASAP, as well.

As a result of the inspiring and slightly awkward happenings this morning, I tried my best to cover as much ground as possible. I tried to fix a few issues that I have left behind in the MPaSIS app, as the HRMO said she intends to hold some testing later this week. I also went on the add cell navigation as a feature to te TableEx class itself, so I will now be able to use this in other units or projects, as well. Likewise, I tried to perform some cod cleanup by transferring some JS code from PHP into the JS files instead.

## 7/4/2023
TO DO:
* [x] [SeRGS] Create a jsErrorMsgBox PHP method in sergsApp.php that will simplify the displaying of error messages via the JS-based MessageBox class
* [ ] [SeRGS] Create code procedures for submitting service record data
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Transfer JS code from the sergsApp.php and the sergs.js files into the SeRGS_App class
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [x] Allow TableEx class to read and configure existing table body data
* [ ] Add cell navigation as a built-in TableEx class feature
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

Creating the SR Editing form seems to be taking forever. Today, I first tried to modify the TableEx class to enable it to load and reconfigure a prepared table with existing tbody data. As I had some issues in data handling in the server, I also created a PHP method that will setup and execute a JS function in the client that will display any error messages. I also used this to create error messages in case database errors were encountered in the processing of the SR editor.

## 7/3/2023
TO DO:
* [x] [SeRGS] Improved SR cell navigation
* [x] [SeRGS] Enabled/disabled the <button>Add Employee</button>/<button>Load Service Record</button> button when clicked while an employee ID is selected
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

I continued my work on the SR Editor, focusing on the cell-to-cell navigation in the SR table. I tried to make the navigation feel more like navigating through cells in MS Excel, although it changes a bit when the cursor arrives at the date fields. Likewise, I also modified the behavior of the Add Employee/Load Service Record button a bit.

## 6/29/2023
TO DO:
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

As today is examination day, I was unable to do very much today. I intended to endorse the source code to the IT Officer for safe-keeping, as this was supposed to be my last office day before my Job Order renewal. Fortunately, we were informed that we were to be renewed by Monday, so I did not need to rush things today just to endorse the source code as I will have the next week to continue my work. Still, I tried to add the code for loading service record data using employee ID. I will have to revisit this code by next week, as I am on leave tomorrow (Friday) for the graduation/completion ceremony of two of my sons.

## 6/27/2023
TO DO:
* [x] [SeRGS] Keep the mm/dd/yyyy date format in SR during the focus and blur events
* [x] [SeRGS] Enable delete record entry
* [x] [SeRGS] Allow tab and arrow keys navigation in the SR table
* [x] [SeRGS] Backend for Add Employee Dialog (saving new Employee data)
* [ ] [SeRGS] Create code procedures for loading service record data using employee ID
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

Today was the Open Ranking proceedings for Admin Assistant III, so my attention was a bit divided today, again. However, I was still able to add a few functionalities to the SR table. First, I added code to retain the `mm/dd/yyyy` date format in between focus and blur events. I was also able to make the behavior similar to spreadsheet software whenever navigation through cells using arrow keys, although I disabled the arrow key navigation for the date cells to prevent conflict with the date-type input functionality. I also enabled the delete record entry functionality in the <button>Delete Record</button> button. I also added some code for adding employee data to the database. Now, limited sets of employee data can be added using this interface.

## 6/26/2023
TO DO:
* [x] [SeRGS] Completed Add Employee Dialog (to do: backend)
* [x] [SeRGS] Enable add record entry
* [ ] [SeRGS] Enable delete record entry
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

After modifying the DialogEx class, I worked to add the dialog buttons and code that will extract/directly submit the data from the dialog form's input fields. I will need to add backed code that will handle these submissions later on. I also added functionality to the <button>Add Record</button> button to enable adding of rows to the SR table. I first had to modify the TableEx class to enable setting up using an existing table before I could enable adding of record entries. The rows added can be automatically set as editable, depending on header setting. I also added code that changes the date-typed cells in a row to a date-typed input element, although blur events causes the date data to be converted to the `yyyy-mm-dd` format. Likewise, focus and blur events don't feel natural, as I am at least aiming for an MS Excel-like feel in the navigation around the SR-table. I will need to deal with these things tomorrow.

## 6/23/2023
TO DO:
* [x] [SeRGS] Added control buttons to Service Record Data Entry Form
* [x] [SeRGS] Added an Add Employee Dialog (to be finished)
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

I decided to add control buttons to the Service Record Data Entry form which will handle adding and deleting of record rows, updating and saving of data, and reverting to unmodified records. I will have to  add the functions later on. I, proceeded to create the AddEmployeeDialog class which is called everytime the `Add Employee` button is clicked. I was able to add all the fields that it needs, although I will need to add the dialog buttons later on by modifying the parent DialogEx class itself.

## 6/22/2023
TO DO:
* [x] [SeRGS] Design For Encode/Update layout
* [x] [SeRGS] Design For Certification layout
* [x] [SeRGS] Design For Approval layout
* [x] [SeRGS] Design For Release layout
* [x] [SeRGS] Incorporate encode/update, certification, approval, and release views in Request List
* [x] [SeRGS] Delete links and pages for encode/update, certification, approval, and release views
* [ ] [SeRGS] Design a Service Record Data Entry Form
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

I worked steadily in the layouts for the Requests lists pages. I decided to incorporate the other lists into a single Request list page, instead implementing them as a filter. I then delete the links to these features from the database. I then began working on the Service Record data entry form layout.

## 6/21/2023
TO DO:
* [x] [SeRGS] Design New Request layout
* [x] [SeRGS] Design Requests layout
* [x] [SeRGS] Design My Requests layout
* [x] [SeRGS] Rename My Requests to Request List and allow it show varied titles and interfaces depending on user access level
* [ ] [SeRGS] Design For Encode/Update layout
* [ ] [SeRGS] Design For Certification layout
* [ ] [SeRGS] Design For Approval layout
* [ ] [SeRGS] Design For Release layout
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

I spent most of the first hour fixing my work log documentation. Afterwards I continued work on the New Request page. I made its interface variant depending on user access level. I also worked on the My Requests layout. After finishing its general layout, I realized that the request list will be redundant for the other request status, so I remade the My Request page into the Request List page which can morph depending on the user access level. I will need to delete the other links tomorrow while I am dealing with my IPCRF.

## 6/20/2023
TO DO:
* [x] [SeRGS] Design Dashboard layout
* [x] [SeRGS] Design View Service Record layout
* [x] [SeRGS] Add preliminary design layout for My Service Record UI
* [x] [SeRGS] Add variant views depending on user access level
* [ ] [SeRGS] Design New Request layout
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

Today, I progressively worked on the SeRGS_App, mostly in the backend. I worked on the Dashboard layout, implementing it with card-like interface, which would look cool in pastel, although I colored them gray for now. I also made it so that the access level of the user affects the cards that can be viewed by the user. I also worked on the View Service Record layout by making the links to the underlying pages look like cards, as well. I also added a bare-bones layout for the My Service Record page, the table of which can be constructed either in the PHP backend or through the JS/HTML frontend. I also began work on the New Request page, which also features a variant layout, depending on the user's access level. I will need to finish this tomorrow.

## 6/19/2023
TO DO:
* [x] [SeRGS] Create SeRGS_App class
* [x] [SeRGS] Add bare-bones index files for destination folders
* [ ] [SeRGS] Design Dashboard layout
* [ ] [SeRGS] Design view Service Record layout
* [x] [SeRGS] Adjust SeRGS UI to be consistent with layout and styling of MPaSIS
* [ ] Make `/web/root/secure` folder more secure
* [ ] [MPaSIS] Change font-family (ask for suggestions)
* [ ] [MPaSIS] Handle tied scores in the rankings
* [ ] [MPaSIS] Test MPaSIS for production fitness
* [ ] [MPaSIS] Add features in Add User dialog that will handle the adding of temporary users with positions
* [ ] [MPaSIS] Add signatory names
* [ ] [MPaSIS] Provide a field/checkbox for withdrawn applications
* [ ] [MPaSIS] Add Honor Graduate to eligibilities

Its the first day of the week and a few days before my Job Order is officially finised. I decided to leave work on MPaSIS for a while and continue working on the SeRGS for a change of pace. Also, I would like to accomplish a few more things aside from the MPaSIS app before I am finished with the current Job Order. I added the SeRGS_App class by using the MPaSIS_App class as reference. But I also tried to implement a counterpart SeRGS_App on the backend as well while also adding index files to destination web folders. Although implementing almost everything in JavaScript would be faster, I reckoned that making the backend handle more processing is the more practical way forward. I might do the same with the MPaSIS_App once I am renewed with the Job Order contract or once I am hired as an ADAS I/III, whichever comes first.

## 6/16/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [ ] Test MPaSIS for production fitness
* [ ] Add features in Add User dialog that will handle the adding of temporary users with positions
* [x] Add a class for selecting items via link
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

My work progressed a bit slowly today. I continued my work on the SelectorLink class and eventually finished it early in the afternoon. I also tried using the SelectorLink on the Assign Roles dialog in the MPaSIS settings page. I was able to finish the said dialog box, but I still needed to add a backend processor for this to make the signatory names a fully working feature. I also tried to modify the Add/Edit user dialog to allow adding of positions, but I kept on stumbling on the new DialogEx class which I tried to use. I will need more time for this later on.

## 6/15/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [ ] Test MPaSIS for production fitness
* [ ] Add a class for selecting items via link
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

Today was exam and interview day for the ADAS I application. I couldn't really focus on work today, but I did begin coding the SelectorLink class, which should feature a link that changes to a dropdown listbox when clicked that, in turn, changes into a simple text node whose contents are the text in the selected item. However, I might need to finish this tomorrow.

## 6/14/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [x] Finish ButtonGroupEx class
* [x] Add new DialogEx class
* [ ] Test MPaSIS for production fitness
* [x] Develop UIEx framework for better UI rendering and data handling
* [x] Allow changes in temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

I added a few modifications to the ButtonGroupEx class today. Afterwards, I finished the new DialogEx class to wrap up the new UIEx framework which I worked on for a couple of weeks. Likewise, I added some code to allow temporary modifications to (the temporary) signatory names in the printouts by double clicking and editing them before printing. All these were dealt with while participating and anticipating the Open Ranking procedures for my ADAS I application.

## 6/13/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [x] Add ButtonGroupEx class
* [ ] Add new DialogEx class
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

Today, I started work on ButtonGroupEx. Its implementation was a breeze, using some of the methods from the previously finished -GroupEx classes. I, eventually, started reimplementing the DialogEx class. It took a lot of my time, especially as I had to implement the same or similar useful features. I will need to continue this tomorrow.

## 6/9/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [ ] Add new DialogEx class
* [x] Add new DataFormEx class
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [x] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

I was able to finish (most of) the DataFormEx class today after working on it for a few days, although I might need to polish its data submission feature once I put the class into use. I also tried to add signatories in some of the forms, albiet temporarily. I will soon need to implement the signatory names that can be fixed in the database through the settings of the MPaSIS app.

## 6/8/2023
TO DO:
* [x] Add event callback arrays to ControlEx
* [x] Add more UIEx references on wrapped elements
* [x] Fix bug on the JobApplicationSelectorDialog instantiation
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [ ] Add new DialogEx class
* [ ] Add new DataFormEx class
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

I found and eventually fixed a bug in the Applicant Data Form, which caused the JobApplicationSelectorDialog to not generate. It turned out that the dialog was actually generating, but it is not being inserted into the DOM. The issue came from changes to the original DialogEx class which required for the App to be added as an argument instead of a parent HTML element. The issue also existed in the other forms, as well, but went undetected as the features haven't been tested for quite a while. As a corollary, I added some more UIEx references on some UIEx wrapped elements, for better reference redundancy and debugging. I also added an event callback array to the ControlEx parent class that can be used in storing event callbacks.

## 6/7/2023
TO DO:
* [ ] Change font-family (ask for suggestions)
* [ ] Handle tied scores in the rankings
* [ ] Add new DialogEx class
* [ ] Add new DataFormEx class
* [x] Add CheckboxGroupEx class
* [x] Add RadioButtonGroupEx class
* [x] Add RadioButtonEx class
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

Today, I continued work on the backlogs yesterday and eventually finished them. Afterwards, I laid the groundwork for the reimplementation of the DialogEx and the FormEx classes. I renamed the reimplementation of the FormEx class as DataFormEx instead of retaining the old name to differentiate it from the Form HTML element better, as it doesn't always use a Form element.

## 6/6/2023
TO DO:
* [ ] Handle tied scores in the rankings
* [ ] Add RadioButtonGroupEx class
* [ ] Add CheckboxGroupEx class
* [ ] Add RadioButtonEx class
* [x] Add CheckboxEx class
* [x] Add ListBoxEx class
* [x] Add DropDownEx class
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

After adding a few more finishing touches to the ComboEx class, I started work on the DropDownEx class, which uses the select HTML element and is somewhat the uneditable version of the ComboEx class. I also derived the ListBoxEx class from the DropDownEx class, which allows for multiple items to be selected while holding the CTRL or SHIFT keys. I also began work on the RadioButtonEX, the CheckboxGroupEx, and the RadioButtonGroupEx classes simultaneously. At first, I intended to derived the CheckboxGroupEx and the RadioButtonGroupEx classes from the CheckboxEx and the RadioButtonEX classes, respectively, but doing so proved to be a bit difficult due to the prototype inheritance in JavaScript, which treats the `this` identifier as a pointer to the current object in scope and not on the parent class scope even when it is used by a parent class method. I will have to continue this tomorrow after apply a few finishing touches to the CheckboxEx class.

On the side, I had a little conversation with others in the Personnel section regarding ties in the bottom of the top 5 rankings. I still haven't fully handled the ties in the bottom part of the top 5. I will have to work on this sooner or later.

## 6/5/2023
TO DO:
* [ ] Add ListBoxEx class
* [ ] Add RadioButtonGroupEx class
* [ ] Add CheckboxGroupEx class
* [ ] Add RadioButtonEx class
* [ ] Add CheckboxEx class
* [ ] Add DropDownEx class
* [x] Add ComboEx class
* [x] Add ButtonEx class
* [x] Add InputButtonEx class
* [x] Add a SetupFooter method to TableEx
* [ ] Test MPaSIS for production fitness
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Add Honor Graduate to eligibilities

I further modified the TableEx class by adding a SetupFooter method, which was supposed to allow colspans on footer cells even on a single row footer. This will be particularly useful in instances where there is a need to add summary of the data in the tbody cells. Afterwards, I worked on the ButtonEx and InputButtonEx classes. I also started work on the ComboEx class, which I finished before end-of-shift.

## 6/2/2023
TO DO:
* [x] Add DateTimeFieldEx class
* [x] Add TimeFieldEx class
* [x] Add DateFieldEx class
* [x] Add NumberFieldEx class
* [x] Add TextboxEx class
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

After fully implementing the TextboxEx class, I derived other classes from it, such as the NumberFieldEx class, the DateFieldEx class, the TimeFieldEx class, and the DateTimeFieldEx class. I took a somewhat longer time implementing the DateFieldEx class, but pretty soon it was a breeze when I worked on the other TextboxEx-derived classes.

On the side, it doesn't seem like the testing of the MPaSIS web app would be scheduled anytime soon. I will try to just work on it a little more, particularly in putting signatory names on the printable forms.

## 6/1/2023
TO DO:
* [x] Add a very flexible TableEx for use in laying out and moving around of both content and input components
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

The TableEx class proved to be composed of a big chunk of code. It took me quite a while, but I eventually finished it today. I, then, began work on the TextboxEx class, which could prove to be the ControlEx-derived class that will have much use.

## 5/31/2023
TO DO:
* [x] Add a FrameEx class
* [ ] Add TableEx for use in laying out of both content and input components
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

I have added a FrameEx class as another ContainerEx-derived class. Afterwards, I began work on the TableEx class, which proved to be taking a significant time of my work time, especially as it has a lot more structures than other ContainerEx classes. I might need to continue this tomorrow, instead.

## 5/30/2023
TO DO:
* [x] Add a LabelEx class for labelling and/or adding captions to various components
* [x] Add a DivEx class
* [x] Add a SpanEx class
* [x] Add a ContainerEx classes that will help in holding content and input components
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

I finished the SpanEx and DivEx classes today. I have also added a LabelEx class to make labelling/captioning controls and containers easier.

## 5/29/2023
TO DO:
* [ ] Develop UIEx framework for better UI rendering and data handling
* [ ] Add temporary signatory names
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [x] Improve appearance of SDO Services sign-in page
* [x] Improve appearance of SDO Services landing page
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

I started work today on the landing and sign-in page, trying to make the styling consistent for the two pages. After that, I started work on my new UIEx control framework which, I hope, can further simplify my coding processes.

## 5/26/2023
TO DO:
* [x] Add MPASIS_Settings class
* [ ] Add signatory names
* [ ] Provide a field/checkbox for withdrawn applications
* [ ] Improve appearance of SDO Services sign-in page
* [ ] Improve appearance of SDO Services landing page
* [ ] Test MPaSIS for production fitness
* [ ] Add Honor Graduate to eligibilities

I immediately started work on adding signatories to the forms. I had a choice on whether to make the signatories static or to make it dynamic, depending on who are assigned in the database. As such, I first added two more tables to the database. Later on, I had to add an MPASIS_Settings class and another database table. However, the feature redesign might need a little more time. I might need to add elements to my Ex Framework or create a better Ex Framework altogether. I think I'd be having a long weekend ahead. I hope the storm doesn't affect the power grid too much.

## 5/25/2023
TO DO:
* [ ] Improve appearance of SDO Services sign-in page
* [ ] Improve appearance of SDO Services landing page
* [ ] Test MPaSIS for production fitness
* [x] Add abbreviations to eligibilities (hosted)
* [ ] Add Honor Graduate to eligibilities

After experiencing and adapting to some technical issues on my laptop, I started work today by adding abbreviations to some eligibilities in the hosted version of the MPaSIS app. Afterwards, I did some system testing with Ms. Jessa. While waiting for Ms. Jessa to return on the tests, I started to clean-up both the SDO Online Services landing page and login page and apply some makeovers. I especially added some card-like styling to the list of links on the landing page. I also added a background image to the login page. I might try to improve on these styling in the next few days. Likewise, I would also need to work on some changes to make MPaSIS align with the already existing workflow and some policies such as data privacy. I also hope testing can commence anytime so I could determine the things that need to be patched up as soon as possible.

## 5/24/2023
TO DO:
* [x] Fix Training score bug
* [x] Fix Education score bug
* [x] Fix Work Experience score bug
* [x] Add details in Score Sheet
* [x] Create a printout template for the CAR
* [x] Create a printout template for the CAR-RQA
* [x] Add abbreviations to eligibilities (local)
* [ ] Add abbreviations to eligibilities (hosted)
* [ ] Add Honor Graduate to eligibilities
* [x] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

I worked with Mr. James today for some random testing and we have found a few bugs related to the Trainings score in the score sheet. After investigation, I found out that it not only affected the trainings score but the education and the experience scores, as well. I started fixing it right away and, while on it, I also added a few more details in the Score Sheet regarding the applicant's increment level in the three criteria in question and the base increment level set in the position's Qualification Standard. Afterwards, I resumed my work on the CAR form printout, which helped me later when I worked on the CAR-RQA printout later on. Later on, I went to remove the default user password from the main MPASIS PHP processor and, instead of just setting the default password as a variable, I moved the entire password reset procedure into a function in the local secure folder for PHP scripts.

## 5/23/2023
TO DO:
* [x] Polish printout for the IER
* [x] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CAR-RQA
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

I struggled to polish the print layout of the IER this morning. However, once I finished that, creating and finishing the IES print layout was a lot easier. The only challenge encountered is transferring of cloned data into the print page. Before the end of the shift, I started working on the print layout for the CAR. Once I finish the CAR print layout, creating the RQA print layout would also be a breeze, just like with the IES print layout.

## 5/22/2023
TO DO:
* [x] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CAR-RQA
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [x] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

I started optimizing some backend PHP code. When I couldn't find other code that can be optimized as separate functions (at least, for now, so I might add more later, if time permits), I proceeded to add a printing function to the IER. I considered several ways on how to create a printout or a printer-friendly view of the IER form page, including printing it directly or opening another tab/window and copying each data one-by-one. I settled opening a new blank tab/window and deep-cloning the IER form into the new tab, adding or removing elements as needed. I was able to implement that cloning, but I initially had issues with applying the stylesheets that were needed. I added the stylesheets on the new tab's head element, but the styles did not apply and, since the HTML elements were generated/cloned on-the-fly, I couldn't easily troubleshoot using the network tab of the Web Developer tool. Silly me, I forgot that the links to the stylesheets, although absolute in path, did not include the web hostname and protocol (e.g., http://host.com) and that caused them to fail loading properly, as the URL in one of the browsers I used was "about:new" and not the actual hostname. So, I first tried to include the hostname on the stylesheet hrefs, which worked. I, then, used the `base` tag to set the base url for all links, and it worked as well. After that, I started to modify the styles, removed the elements (buttons) that I did not need in the cloned IER and added the signatory `div` and an instructions `div`. I might do something similar in the other forms that will need printouts. If all things go smoothly, I might even proceed creating printouts for the qualification/rejection letters, as well.

## 5/19/2023
TO DO:
* [x] Add a FormEx-derived Comparative Assessment Result-Registry of Qualified Applicants
* [x] Add a LoadJobApplication dialog class to generalize code
* [ ] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CAR-RQA
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

I finally finished the LoadJobApplication dialog class this morning. Now, code for loading job applications is as reusable as can be. I have made the necessary modifications in the Applicant Data Entry, the Score Sheet, and the Individual Evaluation Sheet forms so they could use the new dialog class which asks the user for any name or application code and offers job application matches based on the provided data. I have also completed the CAR-RQA form, which displays a list of qualified teacher applicants. When I asked if the other CAR and RQA fields should be filled up online and how they should be filled up, they told me that some columns could only be filled by the appointing authority, who, in our case, is the SDS. As such, I see that the HRMPSB online forms are basically done. I will just have to work on the printout templates and add a few more customizations and code optimizations in the following days.

## 5/18/2023
TO DO:
* [x] Increase coverage of MPASIS auditing in process.php
* [x] Add a FormEx-derived Comparative Assessment Result
* [ ] Add a FormEx-derived Comparative Assessment Result-Registry of Qualified Applicants
* [x] Add a Place of Assignment field to the Job Data/QS Entry form and Position DB table
* [x] Add a Date of Final Deliberation field to both the CAR form and the Position DB table
* [ ] Add a LoadJobApplication dialog class to generalize code
* [ ] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CAR-RQA
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

I started working on adding more activity-logging code in the PHP processor script. After a somewhat extended, I completed most of the features of the CAR form, culminating with adding the place of assignment and the date of final deliberation field to their respective places in the forms and the Position table in the database. The place of assignment can now be saved when adding a job position. The final deliberation date, on the other hand, will only be saved once the CAR is saved/updated, the code for which shall be added soon. I then started creating the LoadJobApplication dialog class and reached until completing just the UI and the basic logic. I will have to add more code for this tomorrow.

## 5/17/2023
TO DO:
* [x] Fixed a security issue where session user data is not completely unset on sign out
* [ ] Add a FormEx-derived Comparative Assessment Result
* [ ] Add a FormEx-derived Comparative Assessment Result-Registry of Qualified Applicants
* [x] Add a PositionSelectorDialog class
* [ ] Add a Place of Assignment field to the Job Data/QS Entry form and Position DB table
* [ ] Add a Date of Final Deliberation field to both the CAR form and the Position DB table
* [ ] Add a LoadJobApplication dialog class to generalize code
* [ ] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CAR-RQA
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

At the start of the workday, I found a bug that could prove to be a security issue, which I was able to fix quickly. As a went about trying to implement the CAR form, I encountered some hurdles along the way. First, I had to generalize the position selector as a class. Next, I also needed to add the place of assignment and the date of final deliberation in several places, so I had to be careful in modifying code. I will have to resume this tomorrow. I was able to complete most of CAR form's UI, but I was unable to proceed without adding the aforementioned fields in both the app and the database.

## 5/16/2023
TO DO:
* [x] Add remarks fields to all score sheet-related items
* [x] Render the details of applicant's qualifications
* [x] Render some of the score computations
* [x] Remove the source code for the old Score Sheet
* [ ] Add a FormEx-derived Comparative Assessment Result
* [ ] Add a FormEx-derived Comparative Assessment Result-Registry of Qualified Applicants
* [x] Enable resetting of passwords in user management
* [ ] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [ ] Create a printout template for the CAR
* [ ] Create a printout template for the CARRQA
* [ ] Add a LoadJobApplication dialog class to generalize code
* [ ] Add abbreviations to eligibilities
* [ ] Add Honor Graduate to eligibilities
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Implement the default user password as either a variable in the secure local PHP scripts or as a default value in the password fields.

Today, I focused on rendering applicant qualification details and score computations. I resorted to just adding fields in both applicant data entry and score sheet forms that correspond to the qualification details and HRMPSB member's remarks. For the score computations, I used the `getScore` and `getScoreManually` methods to create `getComputationString` and `getComputationStringManually` methods which would generate the computation strings. So far, the criteria that returns computation strings were those that uses weights in computations. I also tried to remove the old Score Sheet code to further streamline both the maintenance of the source code and the source code itself. I also quickly implemented the password resetting feature in the the user management interface. The feature uses the first_signin column value in the User and Temp_User tables. When resetting the password, the password is first set to the default initial password and, once the user signs in next, a prompt will appear asking the user to supply a new password. Finally, I started to add stubs for the CAR and RQA form classes.

## 5/15/2023
TO DO:
* [x] Add a FormEx-derived IES class
* [x] Add IES styling
* [ ] Render either or both the details of applicant's qualifications and the computation of the score
* [ ] Add a FormEx-derived Comparative Assessment Result
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Create a printout template for the IER
* [ ] Create a printout template for the IES
* [x] Added favicon

I have started constructing the IESForm class just this morning, and it was almost finished, as most of the code I needed were similar to those in the score sheet. However, 2 columns were quite unclear to me. First is the Details of Applicant's Qualifications column, which may consist of remarks about the relevant documents submitted. To implement this, I might need to revisit the Applicant Data Entry form and even the score sheet and add a few more text fields. Next is the Computation column, which Ms. Cathy said is not always filled. However, although it doesn't need to be automatically filled, I think it might be easier to implement than the other column is. I might look into this tomorrow or I could also dive directly into te CAR form design instead. I just need to rest right now first, as my headache is killing me.

By the way, I have also added some favicons to the site.

## 5/14/2023
TO DO:
* [x] Implement app behavior wherein a user will be asked to define a new password after first login
* [x] Add more safeguards in validating user login
* [x] Fix bug found in Applicant Data Entry form that causes duplicate personal data to be generated
* [x] Generalize the location of the processURL variable
* [x] Remove "commented" code
* [x] Fix bug found in Applicant Data Entry form that causes duplicate job application data to be generated when application code is edited
* [ ] Create PHP functions that will further generalize adding and updating of specific database records
* [ ] Create a printout template for the IER
* [ ] Add a FormEx-derived IES class 

I mostly rested today as it was a fine Sunday. However, I would occasionally modify the code whenever I have enough time to spare. As it was already a bit overdue, I prioritized the password reset on first login. Now, the system just has to set the first_signin database value in the User or Temp_User table to force a password reset. This will also be useful when people who are forgetful of their own passwords are added as users into the system. <u class="to-do">I will have to add a reset feature on the user list later on, as well, for better user management.</u> Next, as I remembered my conversation with Mr. Rey regarding system security, I also added a few more checks for the user session and moved some of the account-related PHP functions out from the web-exposed PHP files and into locally-accessible PHP files instead. While working on these, I also came upon a bug in the Applicant Data Entry form which caused personal data to be duplicated whenever another job application is generated from an already existing one. This bug was also fixed. However, I could not successfully begin on the IES form just yet. Sadly, I will definitely need more time for this. Before wrapping up for the day, I also proceeded to remove some of the old, commented-out code to declutter the source code and also relocated to the MPASIS_App class and fixed the references to the processURL variable.

## 5/12/2023
TO DO:
* [x] Repair web server configuration
* [x] Add an option to modify one's own account details and password
* [ ] Implement app behavior wherein a user will be asked to define a new password after first login
* [ ] Create a printout template for the IER
* [ ] Add a FormEx-derived IES class

I was supposed to push through with some system tests today, however, the web server in Ms. Jen's PC experienced issues when the main router had to be restarted and IP addresses had been reassigned. Fortunately, only the Apache of XAMPP experienced issues and not MySQL and FileZilla. Once I was able to get the new IP address of the web server, I scrummaged through several XAMPP folders and eventually found a httpd configuration file. I then commented out the line which causes it to stick to listening to the former IP address assigned and was finally able to launch Apache afterwards. I then continued working on the password editing feature, which I finished by end-of-workday. I will have to work on the feature forcing the user to change passwords on first sign-in over this coming weekend so I can finally work on the IES, as well.

## 5/11/2023
TO DO:
* [x] Add a better User editing form, with option to add either a permanent or a temporary user account
* [ ] Implement app behavior wherein a user will be asked to define a new password after first login
* [ ] Create a printout template for the IER
* [ ] Add a FormEx-derived IES class

Creating the front-end and back-end logic and the styling for the User editor form wasn't that easy as expected. I had issues with the former code which was haphazardly constructed. However, in the afterhours, I was finally able to make the data interchange work for both adding and updating. I will have to add the function for deleting and for resetting passwords tomorrow.

## 5/10/2023
TO DO:
* [ ] Implement app behavior wherein a user will be asked to define a new password after first login
* [x] Restructure database to prepare for adding user management features
* [ ] Add a better User editing form, with option to add either a permanent or a temporary user account
* [ ] Create a printout template for the IER

I started to restructure my local database along with the hosted database to accommodate more user management features. However, when I went on creating a new user editing form class, I had some difficulties in figuring out how to implement the logic and the styling. So, I first tried to set up the name and username fields along with the system access levels. I had issues in placing the elements, especially when using grid display style. I might use the Mozilla Firefox browser tomorrow to better implement the styling, as that browser is more standards compliant than Microsoft Edge or Google Chrome.

## 5/9/2023
TO DO:
* [x] Add code in the IER to check whether an applicant is qualified or not
* [x] Fix the styling of IER form elements
* [x] Add code in the IER to enable/disable [Select] button in `Select Application` dialog
* [ ] Implement app behavior wherein a user will be asked to define a new password after first login.
* [ ] Create a printout template for the IER
* [x] Reimplement similar changes to position fields in the applicant data entry form

I first worked out the IER code for determining whether an applicant is qualified or not. However, I had to revisit and revise some similar code in the applicant data form to make things simpler and more consistent. I transferred some of them into static methods to optimize code use. After I got the qualification validation working, I then proceeded to restyle the IER elements by removing some of the styling methods and adding more styles in the CSS files. I also inserted code to prevent the clicking of the `Select` button while no position title is selected. An hour before end-of-workday, I began to revisit the position fields in the applicant data entry form to make their behavior consistent with the positions field in the IER's select position dialog.

So far, the app hasn't been used or even tested due to time constraint. <u class="to-do">I should make use of this time to fix the user management features of MPaSIS to facilitate its use by others.</u>

## 5/8/2023
TO DO:
* [x] Create code that will load job applications into the IER Form.
* [ ] Add code to enable/disable [Select] button in `Select Application` dialog
* [ ] Implement app behavior wherein a user will be asked to define a new password after first login.
* [ ] Create a printout template for the IER
* [ ] Reimplement similar changes to position fields in the applicant data entry form

I immediately encountered and fixed a bug which I inadvertently introduced last week when I created the `fetch` codes. It turns out that I forgot to modify the `WHERE` SQL clause for filtering records using job position info. I tried to use some static methods from the ScoreSheet class, also removing the same methods from the MPASIS_App class to lessen the code base in the process. I also encountered some difficulty in inserting multiple-item values, such as degrees taken or trainings undergone. With the degrees, I decided to render them as list items similar to how these were rendered in the Score Sheet. For the trainings and the work experiences, I settled on rendering them as lists, as well, but I added the hours and years for each training and employment experience, and, for their second column, I just inserted the total hours or years, whichever is applicable. For the eligibility, I had to modify the back-end coding to include not just the eligibility ids, which had been included all along, but the eligibility names, as well. I also had these names rendered as lists, too. <u class="to-do">What's left to insert is whether the applicant is qualified to apply or not, depending on the presented documents.</u> <u class="to-do">Likewise, although I suggested otherwise, I might still need to insert the HRMO's name in the IER, as well, just to be thorough.</u>

## 5/5/2023
TO DO:
* [x] Force updates in the parenthetical position field
* [x] Transfer position fields into a dialog box that loads a particular position
* [x] Create a dialog box that loads a particular position
* [x] Create back-end code to handle requests for job applications filtered by position titles and/or plantilla item number
* [ ] Create a printout template for the IER
* [ ] Reimplement similar changes to position fields in the applicant data entry form

Today's work was quite straigthforward. I began my work in the parenthetical position field of the IER form. First, I made the plantilla item number field reset and update the value of the parenthetical position field upon selecting a plantilla item number. Next, I remove the extra blank parenthetical position options that were created while the parenthetical position in the database is either blank or null. All this while, I have also worked to transfer these position fields to a dialog box that will load the selected position. Afterwards, I implemented code that extracts the salary table from the database beforehand so it can be loaded once a position is selected and loaded in the IER. <u class="to-do">I will have to generalize this code, too, or at least put it into the MPaSIS app class constructor so this will be readily available after the MPaSIS app page is loaded.</u> I, then, added code that filters the loaded job position data and loads the qualifications into the display fields. Loading the education, training, and experience QS's were a breeze, but loading the eligibility data was a bit tricky. It was probably due to my mindset that was anticipating that <u class="to-do">the system might need to implement both an optional set of eligibilities (`OR`) and mandatory sets of eligibilities (`AND`)</u>. I was able to pull it through, though. Near the end of my workday, I started to lay the groundwork for fetching job applications based on selected position data. To do this, I first transferred most of the code in fetching job applications using applicant codes or names into a PHP function and generalized it to accept other `WHERE` criteria and `LIMIT` values. <u class="to-do">I might expand this function later on to allow for more arguments.</u> Just before I tapped out for the day, I was already pulling these job application data from the database. <u class="to-do">All that's left to do is restructure the data for displaying in the IER table.</u>

## 5/4/2023
I started the day by working on and fixing the styling of some message boxes for loading job applications, which sometimes fails to render properly on some views and also overflows outside the screen. I then continued to implement the IER form. As I added position fields on IER, I encountered and fixed a minor bug that was left unfixed in the Applicant Data Entry form which manifests itself whenever position titles and parenthetical titles are selected but no plantilla item numbers are listed. I also modified the FormEx class with a new method that I formerly included with its ScoreSheet subclass so the method can be used with the IER form, as well. Tonight or tomorrow, whichever time is convenient, <u class="to-do">I shall also implement code that will force updates in the parenthetical position field once the plantilla item number is selected.</u> <u class="to-do">Likewise, I will try to finish the IER tomorrow.</u>

## 5/3/2023
I continued my work on the Score Sheet's Summary of Ratings. At around noon, it was mostly functional, although I seem to have forgotten to add a table footer where I could put the "Grand Total" of the scores. I was able to complete the Summary, which had automatic adding of scores, and even added some styling. I also found a bug in a field under the performance criteria, which I traced to sone of the data types set in some columns of the Job_Application database table, and fixed them. It was a lot of work, but most of it are visible changes which can be viewed via the locally hosted app.

## 5/2/2023
I updated the files in the temporary web server (XAMPP in Ms. Jen's PC). I also edited the Job_Application table in XAMPP, as it has been restructured a bit in my end to accommodate changes in and corrections to the source code. I also started to fix some styling bugs that caused some InputEx objects to not render properly, especially in full width. I also added some links to forms into some of the landing pages. I have, likewise, added stubs for other important MPS forms. I have also began work to incorporate a Summary of Ratings to the Score Sheet, although I would often veer from this task whenever I see something else to do or correct. I have created a DisplayTableEx class for this purpose which I extended from DisplayEx, but I might recode it to be extended from ScoreSheetElementUI instead, as it more closely fits my intention. I was able to finish up to an unstyled Summary of Ratings (no scores yet). If I finish this part, although the Score Sheet is already functional as it is, it will more closely resemble the paper-based version in terms of functionality.

## 5/1/2023
Today was a busy day, as I went on tech call starting from the morning to late in the afternoon. The good thing was my wife was there to assist me, although the payout doesn't seem to be enough for what the both of us did. Upon arriving home in the early evening, I updated my work logs and, afterwards, checked on the new MPaSIS score sheet. Upon testing using an ADAS I job application test data, I found another bug in the Application of Education criteria for positions with no experience requirement. It was caused by an incorrectly coded maximum value of "ANY" instead of an actual percentage maximum of 100, resulting into a NaN (Not a Number) result for the points. I fixed it and proceeded to add styling to the scoresheet.

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
