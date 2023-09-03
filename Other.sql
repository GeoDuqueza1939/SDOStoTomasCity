-- SDOStoTomas.Employee_User source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `SDOStoTomas`.`Employee_User` AS
select
    `Person_Employee`.`given_name` AS `given_name`,
    `Person_Employee`.`middle_name` AS `middle_name`,
    `Person_Employee`.`family_name` AS `family_name`,
    `Person_Employee`.`spouse_name` AS `spouse_name`,
    `Person_Employee`.`ext_name` AS `ext_name`,
    `Person_Employee`.`birth_date` AS `birth_date`,
    `Person_Employee`.`birth_place` AS `birth_place`,
    `SDOStoTomas`.`User`.`employeeId` AS `employeeId`,
    `Person_Employee`.`is_temporary_empno` AS `is_temporary_empno`,
    `SDOStoTomas`.`User`.`username` AS `username`,
    `SDOStoTomas`.`User`.`sergs_access_level` AS `sergs_access_level`,
    `SDOStoTomas`.`User`.`opms_access_level` AS `opms_access_level`
from
    (`SDOStoTomas`.`Person_Employee`
join `SDOStoTomas`.`User` on
    (`Person_Employee`.`employeeId` = `SDOStoTomas`.`User`.`employeeId`))


-- SDOStoTomas.Job_Applicants source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `SDOStoTomas`.`Job_Applicants` AS
select
    `p`.`id` AS `id`,
    `p`.`given_name` AS `given_name`,
    `p`.`middle_name` AS `middle_name`,
    `p`.`family_name` AS `family_name`,
    `p`.`spouse_name` AS `spouse_name`,
    `p`.`ext_name` AS `ext_name`,
    `p`.`birth_date` AS `birth_date`,
    `p`.`birth_place` AS `birth_place`,
    `p`.`sex` AS `sex`,
    `p`.`age` AS `age`,
    `p`.`civil_status` AS `civil_status`,
    `p`.`religionId` AS `religionId`,
    `p`.`ethnic_groupId` AS `ethnic_groupId`,
    `ja`.`application_code` AS `application_code`,
    `ja`.`personId` AS `personId`,
    `ja`.`position_title_applied` AS `position_title_applied`,
    `ja`.`parenthetical_title_applied` AS `parenthetical_title_applied`,
    `ja`.`plantilla_item_number_applied` AS `plantilla_item_number_applied`
from
    (`SDOStoTomas`.`Person` `p`
join `SDOStoTomas`.`Job_Application` `ja` on
    (`p`.`id` = `ja`.`personId`));


-- SDOStoTomas.Person_Employee source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `SDOStoTomas`.`Person_Employee` AS
select
    `SDOStoTomas`.`Person`.`given_name` AS `given_name`,
    `SDOStoTomas`.`Person`.`middle_name` AS `middle_name`,
    `SDOStoTomas`.`Person`.`family_name` AS `family_name`,
    `SDOStoTomas`.`Person`.`spouse_name` AS `spouse_name`,
    `SDOStoTomas`.`Person`.`ext_name` AS `ext_name`,
    `SDOStoTomas`.`Person`.`birth_date` AS `birth_date`,
    `SDOStoTomas`.`Person`.`birth_place` AS `birth_place`,
    `SDOStoTomas`.`Employee`.`employeeId` AS `employeeId`,
    `SDOStoTomas`.`Employee`.`is_temporary_empno` AS `is_temporary_empno`
from
    (`SDOStoTomas`.`Person`
join `SDOStoTomas`.`Employee` on
    (`SDOStoTomas`.`Person`.`id` = `SDOStoTomas`.`Employee`.`personId`));


