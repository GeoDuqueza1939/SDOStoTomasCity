# DEVELOPMENT NOTES
###### for SeRGS
___

## SERVICE RECORD GENERATION SYSTEM

### Specifications (from RAW NOTES)
- Generate service record
- Target Users:
  - Approvers: Approving AO
    - Access rights: encoding; editing; approving auto-generated entries; approval; viewing; request for update/correction
  - Encoders: Assigned AO/ICT Coordinators
    - Access rights: encoding; editing; approving auto-generated entries; viewing; request for update/correction
  - End users: Teaching and Non-teaching personnel (including admin users)
    - Access rights: viewing; request for update/correction
- Former workflow:
  1. Personnel goes to SDO to request for Service Record
  2. Assigned AO reviews appointments attached in personnel's 201 file, encodes service record entries, and signs to certify its correctness.
  3. Approving AO then signs to approve its release.
  4. Personnel claims service record
- Proposed workflow:
  1. Personnel transacts a request through the SERGS.
  2. Encoder receives a notification about the request. Once the request is opened, the Encoder then clicks a button to review the generated service record and add updates to it. Once the service record is deemed completed, the Encoder then certifies its correctness by clicking a button.
  3. Approver receives a notification about the certified service record. Approver then reviews its contents and may either approve it or reassign to Encoder for further edits.
  4. Once the SR is approved, the requesting Personnel may login again to view the notification and/or print the SR with certifying and approving e-signatures.
- Salaries are to be computed using a personnel's salary grade and step and the salary tables effective during that year (e.g., think SSL).
- Allow for manual entry in special cases such as JO and LSB personnel
- LWOP - Dates/periods should be specified
- New Service Record entries may be generated or manually encoded in the following situations or manner:
  - Requester is LSB staff
  - Requester has been separated from the SDO
  - Requester's documents show discrepancies in the saved data.
- System should log the person responsible for any edits or updates to the Service Record entries
- Appointment Status - Permanent; Temporary; Substitute; LSB; PSB
- EACH PAGE of a certified/approved Service Record shall have signatures
- Data regarding users/requesters shall be PERMANENTLY RETAINED, in line with the permanent retention of copies of the documents submitted whenever the Service Record is updated, regardless of Appointment Status.
- Expiration of an approved request: 48 HOURS AFTER APPROVAL
- PIN code for certifying and approving requests
- Whenever a document request or update request is cancelled, the attending/processing staff shall be notified.
- Whenever a specific user both has a document request and an update request, the update request shall take precedence over the document request in processing.
- Certifier and Note/Approver signatories SHOULD NEVER BE THE SAME.
- All activities in the system and the involved users/staff shall be logged:
  - View
  - Preview/Print
  - Request for Update
  - Request for Certified Document
  - Encode/Update
  - Certify
  - Approve
  - Release (Manual)
- Reason/Purpose for request shall be specified
- For requests for ORIGINAL signatures, the number of copies shall be specified so these can be printed and signed even before the user/requester arrives at the DO.
- In cases where the user/requester either resigned, transferred to another agency, or is deceased, the system records shall also be updated while system access shall be REVOKED.
- Updates to the Service Record can be effected after ENDORSEMENT from Personnel Department/Officer, particularly in cases of newly hired teachers/staff.
- Permanent employees shall, by default, use their Employee Numbers while Temporary, Substitute teachers, LSB staff, and even newly-hired Permanent employees shall, instead, use their Item Numbers from their Appointment papers while still without Employee Numbers.
- Each person shall be allowed ONLY 1 ACCOUNT. (NOTE TO SELF: In case a future staff is able to create more than 1 accounts, insert a feature to allow the merging of these accounts.)
- Requests should be processed within 10-30 minutes after being initiated by used.
- How should we handle updating of own Service Record? Should the highest access level be allowed to edit their own Service Record or should a specific lower level be allowed to approve the highest access level's updates? [Higher-ups will normally ask those higher than them when requesting for Service Record. However, the system should be able to be MANUALLY OVERRIDEN to manually encode the Service Record of higher ups should the need arise.]
- Once a specific staff, takes charge of a request, the request shall be locked and can no longer be processed by another until the processing stage is finished.
- Only the latest/current SR document can be printed. No historical versions even on the previous requests.

### TO DISCUSS
- Should we treat the Service Record as a static document (specific snapshots) or as an evolving document (always current, no historical versions)?
___

## OTHER THINGS TO TAKE NOTE:

* When resizing content to fit the page, make sure to compare the results of both wrapping and resizing fonts as opposed to merely resizing fonts and select a better alternative where the font-size is larger.
