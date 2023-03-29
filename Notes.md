# MISCELLANEOUS NOTES
___

## SYSTEMS:

* Service Record Generation

* Online Data Tracking System
  - Pending
  - On-Hold
  - Forwarded
  - Archived

* RPMS/Personnel
  - Eligibility for Promotions

___

## TASK BOARD (Projects)

### PRIORITY 3:
* Merit Promotion and Selection Information System (on instructions from Dr. Rose)
* RPMS Online System (collab with Dr. Rose)
* Service Record Generation System (SERGS)/Step-Increment Monitoring (STIM) (Collab with Ma'am Cathy)

### PRIORITY 2:


### PRIORITY 1:
* Student/School Info Database/System (Collab with Sir Ivan)

### PRIORITY 0:
* Personnel Records, Services, and Information System (PerSIS) - for manual data entry of personnel records (test or actual data), but may eventually subsume SeRGS because of its possibly and potentially larger scope
* Information System Creation and Management System (ISCreAMS) - for system development (similar to CMS, but for MIS)
* HRPS (for hiring process) - Google Forms/Sheets (Collab with Sir Alexis) [*Replaced by MPASIS*]

___

## TASK BOARD (Daily Tasks)

### TO DO:
* [ ] Wireframe Prototype (MPASIS)
* [ ] Wireframe Prototype (OPMS)

### TO DO (*BACKLOGS*):

### ON-GOING:
* [ ] Specifications (MPASIS)
* [ ] Prototype (SeRGS)
* [ ] Prototype (OPMS)
* [x] ERD Diagram (OPMS: database)
* [x] Database tester page
  * [ ] Construction of utility classes for recreating and accessing the database
* [x] Database construction
  * [x] SeRGS
  * [x] OPMS (initial tables)

### ON-GOING (LONG-TERM)
* [ ] Technical Manual (SeRGS)
* [ ] User Manual (SeRGS)

### ON HOLD:
* [ ] Wireframe Prototype (SeRGS)
* [ ] UML Diagram (SeRGS: front-end/JS)
* [ ] UML Diagram (SeRGS: back-end/PHP)
* [ ] User Stories and Scenarios (OPMS)
* [ ] Narrative Progress Report on System Development (SeRGS)

### DISCONTINUED:
* [ ] ERD Diagram (SeRGS: database) - NOTE: Database structure already realized.

### FINISHED:
* [x] User Stories and Scenarios (SeRGS)
* [x] Workflow Chart (SeRGS)
* [x] Database Query Tester
___

## GUIDES
___

### PRIORITY LEVELS (Guide):

* 0 - Not Urgent, Not Important
* 1 - Not Urgent, Important
* 2 - Urgent, Not Important
* 3 - Urgent, Important (Default)

> Importance refers to the significance of something to the goals of both the organization and my officially designated tasks. Urgency shall refer to the necessity to finish or deliver something regardless of importance to myself or to the organization.
___

### SPRINT (Guide)

#### REQUIREMENTS DEFINITION
- Determine the target users and their needs
  - surveys
  - field observations
  - consultations
- Identify use cases and formulate user stories
  - 

#### SYSTEM & SOFTWARE DESIGN
- Front-end prototyping and development

#### IMPLEMENTATION & TESTING
- Back-end development
- User testing

#### OPERATION & MAINTENANCE
-

### PHP SUPERGLOBALS
- $GLOBALS
- $_SERVER
- $_REQUEST
- $_POST
- $_GET
- $_FILES
- $_ENV
- $_COOKIE
- $_SESSION

### GENERAL POST DATA VARIABLE STRINGS/SWITCHES
- a : Action
  - login (use with: unm, pwd)
  - logout
  - getCurrentUser
  - pwreset
  - query (use with: q)
  - fetch (use with: f, k, qcs, flim)
  - addTempUser
- q : Query
- unm : Username (use with: a=login)
- pwd : Password (use with: a=login)
- f : fetch (use with: a=fetch, k, qcs, flim)
  - person
  - employee
  - user
  - institution
  - address
  - workplace
  - appointment
  - leave
  - termOfOffice
- k : Primary Key (use with: a=fetch, f, qcs, flim)
  - all (all results)
  - [specify]
- qcs : Query Criteria String (use with: a=fetch, f, k, flim)
- flim : Fetch Limit (use with: a=fetch, f, k, qcs)
- src: Redirect Source URL
- dbflds
- dbvals
