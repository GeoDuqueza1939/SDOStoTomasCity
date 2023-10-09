# SPECIFICATIONS
___
> Target System: Merit Promotion and Selection Information System<br>
> Document Version: 0.00
___

## The Purpose of the System

The purpose of the system is mainy to streamline the encoding and computation of MPS (merit promotion and selection) scores and allow for its quicker release.

## The Users' Needs

The users shall be screening the submitted requirements of the applicants. They need to take note of the following, among others:
* some personal information of the applicants, such as names and addresses;
  - the users will have to directly copy these into the online forms for storing in the database
* the level of education of the applicants;
  - this shall be assessed according to the education level reached by an application and/or the number of units earned towards the completion of a degree
* the number of hours of relevant training submitted by the applicant;
  - the users shall need to filter out the relevant training from the irrelevant ones and enter the number of hours of relevant training.
* the number of months/years of relevant work experience.
  - the users shall need to count the number of months/years of relevant work experience before entering them into the system. (*Developer suggestion: we could probably ask the users to enter a descriptive name for the work experience, have them enter the date ranges of the work experience, and let the system do the computations instead*)

## What The System Should Be Capable Of

* The system shall allow the user to enter the personal information of the applicants through a simple online form, along with the position being applied for.
* The system shall provide a means for a user to enter an applicant's highest educational attainment and degree earned and, if any post-graduate degrees are unfinished, specify the units earned toward the completion of these degrees.
* The system shall afford the user a facility that would allow the user to encode the names of the applicant's relevant trainings and the corresponding hours spent for each of these trainings.
* The system shall give the user sufficient space to enter a descriptive name and the date range (start and end) for each relevant work experience.
* Using the user's inputs, the system shall compute, in real time, the number of hours, months, or years of relevant training and experience. The system, itself, will also automatically compute the point increments above the qualifications by comparing the user's inputs to the pre-encoded required increment based on the job qualifications.
* The system shall also provide a facility that will let users encode the positions to be filled up, along with the baseline qualifications needed for the job.
* The system shall warn a user if the data being encoded does not meet the job qualifications. Should any applicant data set prove to be insufficient to meet the job qualifications, the system shall warn the encoder/user but that data can be submitted anyway for recording in the database.
* The system shall provide a dashboard that will show a summary of the applications, the number of screenouts, and the number of qualified applicants.
* The system shall also provide a link to a page that will allow a user to filter out the top 5 in each of the position rankings. Should there be more than one job openings for a specific position (all openings should have exactly the same job description), the number of top ranked applicants shall be computed as a product of the number of job openings multiplied by 5.
* One the top ranks are finalized, these shall be used as pools that administrators can choose from in appointing people to the available positions.