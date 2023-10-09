CREATE DATABASE `ISCreAMS`;

-- ISCreAMS.Information_System definition

CREATE TABLE `ISCreAMS`.`Information_System` (
  `information_systemId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_system_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `isInternal` tinyint(1) NOT NULL DEFAULT 1,
  `type` enum('full','frontend','backend') NOT NULL DEFAULT 'full',
  `status` enum('active','in-progress','disabled') NOT NULL DEFAULT 'in-progress',
  `acronym` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`information_systemId`)
);

-- ISCreAMS.Setting definition

CREATE TABLE `ISCreAMS`.`Setting` (
  `settingId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `setting_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `text_value` longtext DEFAULT NULL,
  `int_value` bigint(20) DEFAULT NULL,
  `double_value` double DEFAULT NULL,
  `datetime_value` datetime DEFAULT NULL,
  `timestamp_value` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`settingId`),
  FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ISCreAMS.DB_Table definition

CREATE TABLE `ISCreAMS`.`DB_Table` (
  `db_tableId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) NOT NULL,
  `db_name` varchar(100) NOT NULL,
  `ddl_path` longtext DEFAULT NULL,
  `isCreated` tinyint(1) NOT NULL DEFAULT 0,
  `required_tableId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`db_tableId`)
);

-- ISCreAMS.IS_DB definition

CREATE TABLE `ISCreAMS`.`IS_DB` (
  `is_dbId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `db_tableId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`is_dbId`),
  FOREIGN KEY (`db_tableId`) REFERENCES `DB_Table` (`db_tableId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ISCreAMS.Nav definition

CREATE TABLE `ISCreAMS`.`Nav` (
  `nav_itemId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nav_text` longtext NOT NULL,
  `url` mediumtext DEFAULT NULL,
  `type` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `nav_index` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `parent_nav` int(10) unsigned NOT NULL DEFAULT 0,
  `nav_html_id` varchar(100) DEFAULT NULL,
  `icon_tag` varchar(100) DEFAULT NULL,
  `access_level` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'Will depend on each IS''s access levels',
  PRIMARY KEY (`nav_itemId`),
  FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ISCreAMS.Page definition

CREATE TABLE `ISCreAMS`.`Page` (
  `pageId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `page_name` varchar(255) NOT NULL DEFAULT 'NO NAME',
  `page_path` longtext NOT NULL DEFAULT '/',
  `isDynamic` tinyint(1) NOT NULL DEFAULT 0,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`pageId`),
  FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE DATABASE `SDOStoTomas`;

-- SDOStoTomas.ENUM_Civil_Status definition

CREATE TABLE `SDOStoTomas`.`ENUM_Civil_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
);

-- SDOStoTomas.ENUM_Emp_Appointment_Status definition

CREATE TABLE `SDOStoTomas`.`ENUM_Emp_Appointment_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `appointment_status` varchar(100) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ENUM_Emp_Appointment_Status_UN` (`appointment_status`)
);

-- SDOStoTomas.ENUM_MPASIS_Access_Level definition

CREATE TABLE `SDOStoTomas`.`ENUM_MPASIS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `SERGES_Access_Level_UN` (`level_name`)
);

-- SDOStoTomas.ENUM_MPASIS_Action definition

CREATE TABLE `SDOStoTomas`.`ENUM_MPASIS_Action` (
  `index` tinyint(3) unsigned NOT NULL,
  `mpasis_action` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
);

-- SDOStoTomas.ENUM_OPMS_Access_Level definition

CREATE TABLE `SDOStoTomas`.`ENUM_OPMS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ROMAS_Access_Level_UN` (`level_name`)
);

-- SDOStoTomas.ENUM_PM_Plan_Item_Status definition

CREATE TABLE `SDOStoTomas`.`ENUM_PM_Plan_Item_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `status` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ENUM_PM_Plan_Item_Status_status_IDX` (`status`) USING BTREE
) COMMENT='0 - Added-For Agreement/Commitment; 1 - Added-Agreed/Committed; 2 - Removed-For Agreement/Commitment; 3 - Removed-Agreed/Committed';

-- SDOStoTomas.ENUM_PM_Plan_Status definition

CREATE TABLE `SDOStoTomas`.`ENUM_PM_Plan_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `status` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
) COMMENT='0 - Inactive; 1 - For Agreement/Commitment; 2 - Active; 3 - For Review; 4 - Updated/Active; 5 - For Approval; 6 - Finalized';

-- SDOStoTomas.ENUM_SERGS_Access_Level definition

CREATE TABLE `SDOStoTomas`.`ENUM_SERGS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `SERGES_Access_Level_UN` (`level_name`)
);

-- SDOStoTomas.Address definition

CREATE TABLE `SDOStoTomas`.`Address` (
  `addressId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `address` longtext DEFAULT NULL,
  PRIMARY KEY (`addressId`)
);

-- SDOStoTomas.ENUM_Location_Type definition

CREATE TABLE `SDOStoTomas`.`ENUM_Location_Type` (
  `index` tinyint(3) unsigned NOT NULL,
  `location_type_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Location_Type_UN` (`location_type_name`)
);

-- SDOStoTomas.Location definition

CREATE TABLE `SDOStoTomas`.`Location` (
  `locationId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `location_type` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `latitude` smallint(6) DEFAULT NULL,
  `longitude` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`locationId`),
  FOREIGN KEY (`location_type`) REFERENCES `ENUM_Location_Type` (`index`) ON UPDATE CASCADE
);

-- SDOStoTomas.Broad_Location definition

CREATE TABLE `SDOStoTomas`.`Broad_Location` (
  `broad_locationIndex` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `locationId` bigint(20) unsigned NOT NULL,
  `broad_locationId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`broad_locationIndex`),
  FOREIGN KEY (`locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`broad_locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Contact_Number definition

CREATE TABLE `SDOStoTomas`.`Contact_Number` (
  `contact_numberId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personId` bigint(20) unsigned NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `type` enum('Landline','Mobile') NOT NULL DEFAULT 'Mobile',
  PRIMARY KEY (`contact_numberId`)
);

-- SDOStoTomas.ENUM_Educational_Attainment definition

CREATE TABLE `SDOStoTomas`.`ENUM_Educational_Attainment` (
  `index` tinyint(3) unsigned NOT NULL,
  `educational_attainment` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
);

-- SDOStoTomas.Religion definition

CREATE TABLE `SDOStoTomas`.`Religion` (
  `religionId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `religion` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`religionId`),
  UNIQUE KEY `Religion_religion_IDX` (`religion`) USING BTREE
);

-- SDOStoTomas.Ethnicity definition

CREATE TABLE `SDOStoTomas`.`Ethnicity` (
  `ethnicityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ethnic_group` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`ethnicityId`),
  UNIQUE KEY `Ethnicity_UN` (`ethnic_group`)
);

-- SDOStoTomas.Person definition

CREATE TABLE `SDOStoTomas`.`Person` (
  `personId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `family_name` varchar(100) DEFAULT NULL,
  `spouse_name` varchar(20) DEFAULT NULL,
  `ext_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` bigint(20) unsigned DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `age` tinyint(3) unsigned DEFAULT NULL,
  `civil_status` tinyint(3) unsigned DEFAULT NULL,
  `religionId` int(10) unsigned DEFAULT NULL,
  `ethnicityId` int(10) unsigned DEFAULT NULL,
  `permanent_addressId` bigint(20) unsigned DEFAULT NULL,
  `present_addressId` bigint(20) unsigned DEFAULT NULL,
  `educational_attainment` tinyint(3) unsigned DEFAULT NULL,
  `postgraduate_units` tinyint(3) unsigned DEFAULT NULL COMMENT 'this will be phased-out in favor of a new table',
  `complete_academic_requirements` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`personId`),
  FOREIGN KEY (`civil_status`) REFERENCES `ENUM_Civil_Status` (`index`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`religionId`) REFERENCES `Religion` (`religionId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`ethnicityId`) REFERENCES `Ethnicity` (`ethnicityId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`permanent_addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`present_addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SDOStoTomas.Degree_Taken definition

CREATE TABLE `SDOStoTomas`.`Degree_Taken` (
  `degree_takenId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `degree` varchar(200) NOT NULL,
  `degree_typeIndex` tinyint(3) unsigned NOT NULL,
  `units_earned` tinyint(3) unsigned DEFAULT NULL,
  `complete_academic_requirements` tinyint(1) DEFAULT NULL,
  `graduation_year` int(10) unsigned DEFAULT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `year_level_completed` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`degree_takenId`),
  FOREIGN KEY (`degree_typeIndex`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Disability definition

CREATE TABLE `SDOStoTomas`.`Disability` (
  `disabilityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `disability` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`disabilityId`),
  UNIQUE KEY `Disability_disability_IDX` (`disability`) USING BTREE
);

-- SDOStoTomas.Eligibility definition

CREATE TABLE `SDOStoTomas`.`Eligibility` (
  `eligibilityId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `eligibility` varchar(500) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`eligibilityId`)
);

-- SDOStoTomas.Email_Address definition

CREATE TABLE `SDOStoTomas`.`Email_Address` (
  `email_address` varchar(50) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`email_address`),
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Date_Range definition

CREATE TABLE `SDOStoTomas`.`Date_Range` (
  `date_rangeId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_start` date NOT NULL,
  `date_end` date DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`date_rangeId`)
);

-- SDOStoTomas.Institution definition

CREATE TABLE `SDOStoTomas`.`Institution` (
  `institutionId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institution_name` varchar(500) NOT NULL,
  `umbrella_institutionId` bigint(20) unsigned DEFAULT NULL,
  `addressId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`institutionId`),
  FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`umbrella_institutionId`) REFERENCES `Institution` (`institutionId`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SDOStoTomas.Workplace definition

CREATE TABLE `SDOStoTomas`.`Workplace` (
  `workplaceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institutionId` bigint(20) unsigned NOT NULL,
  `addressId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`workplaceId`),
  FOREIGN KEY (`institutionId`) REFERENCES `Institution` (`institutionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SDOStoTomas.Employee definition

CREATE TABLE `SDOStoTomas`.`Employee` (
  `employeeId` varchar(30) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `is_temporary_empno` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `Employee_UN` (`personId`),
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Emp_Appointment definition

CREATE TABLE `SDOStoTomas`.`Emp_Appointment` (
  `emp_appointmentId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `plantilla_item` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  PRIMARY KEY (`emp_appointmentId`)
);

-- SDOStoTomas.Emp_Term_of_Service definition

CREATE TABLE `SDOStoTomas`.`Emp_Term_of_Service` (
  `emp_term_of_serviceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_rangeId` bigint(20) unsigned NOT NULL,
  `appointmentId` bigint(20) unsigned NOT NULL,
  `workplaceId` bigint(20) unsigned DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `salary` float DEFAULT NULL,
  `branch` varchar(100) DEFAULT 'NM',
  `employeeId` varchar(30) NOT NULL,
  PRIMARY KEY (`emp_term_of_serviceId`),
  FOREIGN KEY (`date_rangeId`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  FOREIGN KEY (`appointmentId`) REFERENCES `Emp_Appointment` (`emp_appointmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`workplaceId`) REFERENCES `Workplace` (`workplaceId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`status`) REFERENCES `ENUM_Emp_Appointment_Status` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Position_Category definition

CREATE TABLE `SDOStoTomas`.`Position_Category` (
  `position_categoryId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `position_category` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`position_categoryId`)
);

-- SDOStoTomas.Position definition

CREATE TABLE `SDOStoTomas`.`Position` (
  `plantilla_item_number` varchar(20) NOT NULL,
  `position_title` varchar(100) NOT NULL,
  `parenthetical_title` varchar(100) NOT NULL DEFAULT '',
  `salary_grade` tinyint(3) unsigned NOT NULL,
  `position_categoryId` tinyint(3) unsigned NOT NULL,
  `required_educational_attainment` tinyint(3) unsigned NOT NULL,
  `specific_education_required` varchar(500) DEFAULT NULL,
  `required_training_hours` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `specific_training_required` varchar(500) DEFAULT NULL,
  `required_work_experience_years` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `specific_work_experience_required` varchar(500) DEFAULT NULL,
  `competency` longtext DEFAULT NULL,
  `filled` tinyint(1) NOT NULL DEFAULT 0,
  `eligibility_string` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`plantilla_item_number`),
  FOREIGN KEY (`required_educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`position_categoryId`) REFERENCES `Position_Category` (`position_categoryId`) ON UPDATE CASCADE
);

-- SDOStoTomas.Job_Application definition

CREATE TABLE `SDOStoTomas`.`Job_Application` (
  `application_code` varchar(20) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `position_title_applied` varchar(100) DEFAULT NULL,
  `parenthetical_title_applied` varchar(100) DEFAULT NULL,
  `plantilla_item_number_applied` varchar(20) DEFAULT NULL,
  `has_specific_education_required` tinyint(1) DEFAULT NULL,
  `has_specific_training` tinyint(1) DEFAULT NULL,
  `has_more_unrecorded_training` tinyint(1) DEFAULT NULL,
  `has_specific_work_experience` tinyint(1) DEFAULT NULL,
  `has_more_unrecorded_work_experience` tinyint(1) DEFAULT NULL,
  `has_specific_competency_required` tinyint(1) DEFAULT NULL,
  `most_recent_performance_rating` float DEFAULT NULL,
  `number_of_citation_movs` tinyint(3) unsigned DEFAULT NULL,
  `number_of_academic_award_movs` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_external_office_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_external_org_level_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_central_co_level_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_central_national_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_regional_ro_level_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_regional_national_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_division_sdo_level_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_division_national_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_school_school_level_search` tinyint(4) DEFAULT NULL,
  `number_of_awards_school_sdo_level_search` tinyint(4) DEFAULT NULL,
  `number_of_research_proposal_only` tinyint(4) DEFAULT NULL,
  `number_of_research_proposal_ar` tinyint(4) DEFAULT NULL,
  `number_of_research_proposal_ar_util` tinyint(4) DEFAULT NULL,
  `number_of_research_proposal_ar_util_adopt` tinyint(4) DEFAULT NULL,
  `number_of_research_proposal_ar_util_cite` tinyint(4) DEFAULT NULL,
  `number_of_smetwg_issuance_cert` tinyint(4) DEFAULT NULL,
  `number_of_smetwg_issuance_cert_output` tinyint(4) DEFAULT NULL,
  `number_of_speakership_external_office_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_external_org_level_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_central_co_level_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_central_national_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_regional_ro_level_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_regional_national_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_division_sdo_level_search` tinyint(4) DEFAULT NULL,
  `number_of_speakership_division_national_search` tinyint(4) DEFAULT NULL,
  `neap_facilitator_accreditation` tinyint(4) DEFAULT NULL,
  `score_exam` float DEFAULT NULL,
  `score_skill` float DEFAULT NULL,
  `score_bei` float DEFAULT NULL,
  `number_of_app_educ_actionplan` tinyint(4) DEFAULT NULL,
  `number_of_app_educ_actionplan_ar` tinyint(4) DEFAULT NULL,
  `number_of_app_educ_actionplan_ar_adoption` tinyint(4) DEFAULT NULL,
  `app_educ_gwa` float DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap` tinyint(4) DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap_arlocal` tinyint(4) DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap_arlocal_arother` tinyint(4) DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap` tinyint(4) DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap_arlocal` tinyint(4) DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap_arlocal_arother` tinyint(4) DEFAULT NULL,
  `present_school` varchar(200) DEFAULT NULL,
  `present_designation` varchar(100) DEFAULT NULL,
  `present_position` varchar(100) DEFAULT NULL,
  `present_district` varchar(200) DEFAULT NULL,
  `lept_rating` float DEFAULT NULL,
  `ppstcoi` float DEFAULT NULL,
  `ppstncoi` float DEFAULT NULL,
  `trainer_award_level` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`application_code`),
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`plantilla_item_number_applied`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SDOStoTomas.Leave definition

CREATE TABLE `SDOStoTomas`.`Leave` (
  `leaveId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `dates_excluded` bigint(20) unsigned DEFAULT NULL,
  `dates_with_pay` bigint(20) unsigned DEFAULT NULL,
  `employeeId` varchar(30) NOT NULL,
  PRIMARY KEY (`leaveId`),
  FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  FOREIGN KEY (`dates_excluded`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  FOREIGN KEY (`dates_with_pay`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Temp_User definition

CREATE TABLE `SDOStoTomas`.`Temp_User` (
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `sergs_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `opms_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `mpasis_access_level` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`username`),
  UNIQUE KEY `User_UN` (`personId`),
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`mpasis_access_level`) REFERENCES `ENUM_MPASIS_Access_Level` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`sergs_access_level`) REFERENCES `ENUM_SERGS_Access_Level` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`opms_access_level`) REFERENCES `ENUM_OPMS_Access_Level` (`index`) ON UPDATE CASCADE
);

-- SDOStoTomas.User definition

CREATE TABLE `SDOStoTomas`.`User` (
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `employeeId` varchar(30) NOT NULL,
  `sergs_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `opms_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`username`),
  UNIQUE KEY `User_UN` (`employeeId`),
  FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`sergs_access_level`) REFERENCES `ENUM_SERGS_Access_Level` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`opms_access_level`) REFERENCES `ENUM_OPMS_Access_Level` (`index`) ON UPDATE CASCADE
);

-- SDOStoTomas.MPASIS_History definition

CREATE TABLE `SDOStoTomas`.`MPASIS_History` (
  `mpasis_historyId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mpasis_action` tinyint(3) unsigned NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `temp_username` varchar(100) DEFAULT NULL,
  `application_code` bigint(20) unsigned DEFAULT NULL,
  `position_title` varchar(100) DEFAULT NULL,
  `plantilla_item_number` varchar(20) DEFAULT NULL,
  `username_op` varchar(100) DEFAULT NULL,
  `temp_username_op` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `remarks` longtext DEFAULT NULL,
  PRIMARY KEY (`mpasis_historyId`),
  FOREIGN KEY (`mpasis_action`) REFERENCES `ENUM_MPASIS_Action` (`index`) ON UPDATE CASCADE,
  FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`temp_username`) REFERENCES `Temp_User` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`plantilla_item_number`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SDOStoTomas.MPS_Increment_Table_Education definition

CREATE TABLE `SDOStoTomas`.`MPS_Increment_Table_Education` (
  `education_increment_level` tinyint(3) unsigned NOT NULL,
  `baseline_educational_attainment` tinyint(3) unsigned NOT NULL,
  `baseline_postgraduate_units` tinyint(3) unsigned DEFAULT NULL,
  `complete_academic_requirements` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Complete academic requirements completed towards the next post-graduate degree',
  PRIMARY KEY (`education_increment_level`),
  FOREIGN KEY (`baseline_educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE
);

-- SDOStoTomas.PM_Cycle definition

CREATE TABLE `SDOStoTomas`.`PM_Cycle` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `descriptive_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE
) COMMENT='Performance Management Cycle';

-- SDOStoTomas.PM_Framework definition

CREATE TABLE `SDOStoTomas`.`PM_Framework` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `framework_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  `basis` varchar(100) DEFAULT NULL COMMENT 'Documentary/legal bases',
  PRIMARY KEY (`id`)
) COMMENT='Performance Management Framework; different sets of MFO''s, KRA''s, and Objectives that can be used to suggest Performance Management Plans';

-- SDOStoTomas.PM_MFO definition

CREATE TABLE `SDOStoTomas`.`PM_MFO` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mfo` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT='Major Final Output for Performance Management; may refer to services or products of performance';

-- SDOStoTomas.PM_KRA definition

CREATE TABLE `SDOStoTomas`.`PM_KRA` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kra` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `mfoId` int(10) unsigned NOT NULL,
  `frameworkId` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mfoId`) REFERENCES `PM_MFO` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`frameworkId`) REFERENCES `PM_Framework` (`id`) ON UPDATE CASCADE
) COMMENT='Key Result Areas for Performance Management';

-- SDOStoTomas.PM_MOV definition

CREATE TABLE `SDOStoTomas`.`PM_MOV` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mov` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT='Methods of Verification for Performance Management Objectives; each may be used for various objectives';

-- SDOStoTomas.PM_Objective definition

CREATE TABLE `SDOStoTomas`.`PM_Objective` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `objective` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `kraId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`kraId`) REFERENCES `PM_KRA` (`id`) ON UPDATE CASCADE
) COMMENT='Performance Objectives for Performance Management';

-- SDOStoTomas.PM_Plan definition

CREATE TABLE `SDOStoTomas`.`PM_Plan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rateeId` varchar(30) NOT NULL COMMENT 'employeeId',
  `pm_cycle` int(10) unsigned NOT NULL,
  `raterId` varchar(30) DEFAULT NULL COMMENT 'employeeId',
  `approverId` varchar(30) DEFAULT NULL COMMENT 'employeeId',
  `plan_status` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`rateeId`) REFERENCES `Employee` (`employeeId`) ON UPDATE CASCADE,
  FOREIGN KEY (`raterId`) REFERENCES `Employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`approverId`) REFERENCES `Employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`plan_status`) REFERENCES `ENUM_PM_Plan_Status` (`index`) ON UPDATE CASCADE
) COMMENT='Performance Management Plan for Employees; one plan every PM cycle';

-- SDOStoTomas.PM_Plan_Objective definition

CREATE TABLE `SDOStoTomas`.`PM_Plan_Objective` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `planId` bigint(20) unsigned NOT NULL,
  `objectiveId` bigint(20) unsigned NOT NULL,
  `plan_objective_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`planId`) REFERENCES `PM_Plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`objectiveId`) REFERENCES `PM_Objective` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`plan_objective_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) COMMENT='Objectives for Performance Management chosen by Employee Ratees';

-- SDOStoTomas.PM_PI definition

CREATE TABLE `SDOStoTomas`.`PM_PI` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `plan_objectiveId` bigint(20) unsigned NOT NULL,
  `performance_indicator` longtext NOT NULL,
  `score` tinyint(3) unsigned NOT NULL COMMENT 'allowed values: 1-5',
  `plan_pi_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`plan_objectiveId`) REFERENCES `PM_Plan_Objective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`plan_pi_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) COMMENT='Performance Indicators for Performance Management Objectives; rubrics criteria';

-- SDOStoTomas.PM_Plan_History definition

CREATE TABLE `SDOStoTomas`.`PM_Plan_History` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `planId` bigint(20) unsigned NOT NULL,
  `mod_description` longtext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater','approver') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`planId`) REFERENCES `PM_Plan` (`id`) ON UPDATE CASCADE
);

-- SDOStoTomas.PM_Plan_MOV definition

CREATE TABLE `SDOStoTomas`.`PM_Plan_MOV` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `movId` int(10) unsigned NOT NULL,
  `plan_objectiveId` bigint(20) unsigned NOT NULL,
  `plan_mov_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`movId`) REFERENCES `PM_MOV` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`plan_objectiveId`) REFERENCES `PM_Plan_Objective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`plan_mov_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) COMMENT='Methods of Verification for Performance Management Objectives; each may be used for various objectives';

-- SDOStoTomas.Person_Disability definition

CREATE TABLE `SDOStoTomas`.`Person_Disability` (
  `person_disabilityId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personId` bigint(20) unsigned NOT NULL,
  `disabilityId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`person_disabilityId`),
  FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`disabilityId`) REFERENCES `Disability` (`disabilityId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Relevant_Eligibility definition

CREATE TABLE `SDOStoTomas`.`Relevant_Eligibility` (
  `relevant_eligibilityId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `application_code` varchar(20) NOT NULL,
  `eligibilityId` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`relevant_eligibilityId`),
  FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`eligibilityId`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Relevant_Training definition

CREATE TABLE `SDOStoTomas`.`Relevant_Training` (
  `relevant_trainingId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descriptive_name` longtext NOT NULL,
  `hours` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `application_code` varchar(20) NOT NULL,
  PRIMARY KEY (`relevant_trainingId`),
  FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Relevant_Work_Experience definition

CREATE TABLE `SDOStoTomas`.`Relevant_Work_Experience` (
  `relevant_work_experienceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descriptive_name` longtext NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `application_code` varchar(20) NOT NULL,
  PRIMARY KEY (`relevant_work_experienceId`),
  FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Required_Eligibility definition

CREATE TABLE `SDOStoTomas`.`Required_Eligibility` (
  `required_eligibilityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `plantilla_item_number` varchar(20) NOT NULL,
  `eligibilityId` tinyint(3) unsigned NOT NULL,
  `eligibilityId2` tinyint(3) unsigned DEFAULT NULL,
  `eligibilityId3` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`required_eligibilityId`),
  FOREIGN KEY (`plantilla_item_number`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`eligibilityId`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`eligibilityId2`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`eligibilityId3`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE SET NULL ON UPDATE CASCADE
) COMMENT='Each position can have multiple eligibilities. 3 alternative eligibilities can be specified at a time. Required eligibiities (any of which may have up to 3 alternatives each) may be specified multiple numbers of times.';

-- SDOStoTomas.SET_Address_Location definition

CREATE TABLE `SDOStoTomas`.`SET_Address_Location` (
  `address_locationId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `addressId` bigint(20) unsigned NOT NULL,
  `locationId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`address_locationId`),
  FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SDOStoTomas.Salary_Table definition

CREATE TABLE `SDOStoTomas`.`Salary_Table` (
  `salary_gradeId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `salary_grade` tinyint(3) unsigned NOT NULL,
  `step_increment` tinyint(3) unsigned NOT NULL,
  `salary` float NOT NULL DEFAULT 0,
  `effectivity_date` date NOT NULL,
  PRIMARY KEY (`salary_gradeId`)
);

